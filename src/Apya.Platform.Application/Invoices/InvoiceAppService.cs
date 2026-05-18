using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.ExchangeRates;
using Apya.Platform.CustomerLedger;

namespace Apya.Platform.Invoices;

[Authorize]
public class InvoiceAppService : ApplicationService, IInvoiceAppService
{
    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Payment, Guid> _paymentRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly IRepository<ExchangeRate, Guid> _exchangeRateRepository;
    private readonly IRepository<CustomerLedgerEntry, Guid> _customerLedgerRepository;

    public InvoiceAppService(
        IRepository<Invoice, Guid> invoiceRepository,
        IRepository<Payment, Guid> paymentRepository,
        IRepository<Project, Guid> projectRepository,
        IRepository<CashAccount, Guid> cashAccountRepository,
        IRepository<CashMovement, Guid> cashMovementRepository,
        IRepository<ExchangeRate, Guid> exchangeRateRepository,
        IRepository<CustomerLedgerEntry, Guid> customerLedgerRepository)
    {
        _invoiceRepository = invoiceRepository;
        _paymentRepository = paymentRepository;
        _projectRepository = projectRepository;
        _cashAccountRepository = cashAccountRepository;
        _cashMovementRepository = cashMovementRepository;
        _exchangeRateRepository = exchangeRateRepository;
        _customerLedgerRepository = customerLedgerRepository;
    }

    public async Task<PagedResultDto<InvoiceDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var query = await _invoiceRepository.GetQueryableAsync();
        var totalCount = await AsyncExecuter.CountAsync(query);

        var sorting = string.IsNullOrWhiteSpace(input.Sorting) ? "InvoiceDate desc" : input.Sorting;
        // projectName ve paidAmount DTO-only alanlar; DB tarafında sort'a uygulanamaz.
        if (sorting.StartsWith("projectName", StringComparison.OrdinalIgnoreCase)
            || sorting.StartsWith("paidAmount", StringComparison.OrdinalIgnoreCase))
        {
            sorting = "InvoiceDate desc";
        }

        var items = await AsyncExecuter.ToListAsync(
            query.OrderBy(sorting).PageBy(input.SkipCount, input.MaxResultCount)
        );

        if (!items.Any()) 
            return new PagedResultDto<InvoiceDto>(totalCount, new List<InvoiceDto>());

        // 2. Alt Sorgular: Sadece elimizdeki ID'lere ait Proje ve Ödemeleri çek.
        var invoiceIds = items.Select(x => x.Id).ToList();
        var projectIds = items.Select(x => x.ProjectId).Distinct().ToList();

        var projects = await _projectRepository.GetListAsync(p => projectIds.Contains(p.Id));
        var payments = await _paymentRepository.GetListAsync(p => invoiceIds.Contains(p.InvoiceId));

        var dtos = items.Select(x => {
            var dto = MapToDto(x, projects.FirstOrDefault(p => p.Id == x.ProjectId));
            dto.PaidAmount = payments.Where(p => p.InvoiceId == x.Id).Sum(p => p.Amount);
            return dto;
        }).ToList();

        return new PagedResultDto<InvoiceDto>(totalCount, dtos);
    }

    public async Task<InvoiceDto> GetAsync(Guid id)
    {
        var invoice = await _invoiceRepository.GetAsync(id);
        var project = await _projectRepository.FindAsync(invoice.ProjectId);
        var payments = await _paymentRepository.GetListAsync(p => p.InvoiceId == id);
        
        var dto = MapToDto(invoice, project);
        dto.PaidAmount = payments.Sum(p => p.Amount);
        return dto;
    }

    public async Task<InvoiceDto> CreateAsync(CreateInvoiceDto input)
    {
        var invoice = new Invoice(GuidGenerator.Create(), input.ProjectId, input.InvoiceNumber, input.InvoiceDate, input.DueDate)
        {
            TaxRate = input.TaxRate,
            Currency = input.Currency,
            Status = InvoiceStatus.Draft,
            CustomerId = input.CustomerId,
            Direction = input.Direction,
            TaskId = input.TaskId
        };

        foreach (var item in input.Items)
        {
            invoice.Items.Add(new InvoiceItem(GuidGenerator.Create(), invoice.Id, item.Description, item.Quantity, item.UnitPrice));
        }

        invoice.TotalAmount = invoice.Items.Sum(x => x.TotalPrice) * (1 + (invoice.TaxRate / 100));

        await _invoiceRepository.InsertAsync(invoice, autoSave: true);

        // APYA-142c: Satış faturası + cari → cari Borç tahakkuku
        if (invoice.CustomerId.HasValue && invoice.Direction == InvoiceDirection.Sales && invoice.TotalAmount > 0)
        {
            await _customerLedgerRepository.InsertAsync(new CustomerLedgerEntry(
                GuidGenerator.Create(),
                invoice.CustomerId.Value,
                CustomerLedgerDirection.Debit,
                invoice.TotalAmount,
                invoice.InvoiceDate,
                CustomerLedgerSource.Invoice,
                invoice.Currency,
                invoice.Id,
                invoice.ProjectId,
                $"Satış faturası: {invoice.InvoiceNumber}",
                CurrentTenant.Id), autoSave: true);
        }

        return await GetAsync(invoice.Id);
    }

    public async Task AddPaymentAsync(Guid invoiceId, decimal amount, string method, string reference, Guid? cashAccountId = null)
    {
        var invoice = await _invoiceRepository.GetAsync(invoiceId);

        var payment = new Payment(GuidGenerator.Create(), invoiceId, amount, Clock.Now, method)
        {
            ReferenceNumber = reference,
            CashAccountId = cashAccountId
        };
        await _paymentRepository.InsertAsync(payment, autoSave: true);

        // APYA-136: Kasa seçildiyse otomatik giriş hareketi (FX dönüşümlü)
        if (cashAccountId.HasValue && amount > 0)
        {
            var cash = await _cashAccountRepository.GetAsync(cashAccountId.Value);

            decimal? rate = null;
            if (!string.Equals(invoice.Currency?.Trim(), cash.Currency?.Trim(), StringComparison.OrdinalIgnoreCase))
            {
                var er = (await _exchangeRateRepository.GetListAsync(
                        x => x.FromCurrency == invoice.Currency && x.ToCurrency == cash.Currency))
                    .OrderByDescending(x => x.RateDate)
                    .FirstOrDefault();
                rate = er?.Rate;
            }

            var cashAmount = PaymentCashConverter.ToCashCurrency(amount, invoice.Currency, cash.Currency, rate);

            await _cashMovementRepository.InsertAsync(new CashMovement(
                GuidGenerator.Create(),
                cashAccountId.Value,
                CashMovementDirection.In,
                cashAmount,
                Clock.Now,
                $"Fatura tahsilatı: {invoice.InvoiceNumber}",
                CashMovementSource.Invoice,
                payment.Id,
                CurrentTenant.Id), autoSave: true);
        }

        // APYA-142c: Cari varsa tahsilat → cari Alacak tahakkuku
        // (vadeli: fatura Borç + sonra tahsilat Alacak; peşin: ikisi peş peşe → cari net 0)
        if (invoice.CustomerId.HasValue && amount > 0)
        {
            await _customerLedgerRepository.InsertAsync(new CustomerLedgerEntry(
                GuidGenerator.Create(),
                invoice.CustomerId.Value,
                CustomerLedgerDirection.Credit,
                amount,
                Clock.Now,
                CustomerLedgerSource.Payment,
                invoice.Currency,
                payment.Id,
                invoice.ProjectId,
                $"Tahsilat: {invoice.InvoiceNumber}",
                CurrentTenant.Id), autoSave: true);
        }

        // Durumu güncelle
        var payments = await _paymentRepository.GetListAsync(p => p.InvoiceId == invoiceId);
        var totalPaid = payments.Sum(p => p.Amount);

        invoice.Status = totalPaid >= invoice.TotalAmount ? InvoiceStatus.Paid : InvoiceStatus.Sent;
        await _invoiceRepository.UpdateAsync(invoice);
    }

    public async Task<List<PaymentDto>> GetPaymentsAsync(Guid invoiceId)
    {
        var payments = await _paymentRepository.GetListAsync(p => p.InvoiceId == invoiceId);
        return payments.Select(x => new PaymentDto
        {
            Id = x.Id,
            InvoiceId = x.InvoiceId,
            Amount = x.Amount,
            PaymentDate = x.PaymentDate,
            PaymentMethod = x.PaymentMethod,
            ReferenceNumber = x.ReferenceNumber,
            CashAccountId = x.CashAccountId,
            CreationTime = x.CreationTime
        }).ToList();
    }

    public async Task<ListResultDto<ProjectLookupDto>> GetProjectLookupAsync()
    {
        var projects = await _projectRepository.GetListAsync();
        return new ListResultDto<ProjectLookupDto>(projects.Select(p => new ProjectLookupDto
        {
            Id = p.Id,
            Name = p.Name
        }).ToList());
    }

    private InvoiceDto MapToDto(Invoice x, Project? project)
    {
        return new InvoiceDto
        {
            Id = x.Id,
            ProjectId = x.ProjectId,
            ProjectName = project?.Name ?? "Bilinmeyen Proje",
            CustomerId = x.CustomerId,
            Direction = x.Direction,
            TaskId = x.TaskId,
            InvoiceNumber = x.InvoiceNumber,
            InvoiceDate = x.InvoiceDate,
            DueDate = x.DueDate,
            TotalAmount = x.TotalAmount,
            TaxRate = x.TaxRate,
            Currency = x.Currency,
            Status = x.Status,
            CreationTime = x.CreationTime,
            Items = x.Items.Select(i => new InvoiceItemDto {
                Description = i.Description,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                TotalPrice = i.TotalPrice
            }).ToList()
        };
    }
}
