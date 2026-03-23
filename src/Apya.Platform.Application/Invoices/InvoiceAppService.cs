using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Projects;

namespace Apya.Platform.Invoices;

[Authorize]
public class InvoiceAppService : ApplicationService, IInvoiceAppService
{
    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Payment, Guid> _paymentRepository;
    private readonly IRepository<Project, Guid> _projectRepository;

    public InvoiceAppService(
        IRepository<Invoice, Guid> invoiceRepository,
        IRepository<Payment, Guid> paymentRepository,
        IRepository<Project, Guid> projectRepository)
    {
        _invoiceRepository = invoiceRepository;
        _paymentRepository = paymentRepository;
        _projectRepository = projectRepository;
    }

    public async Task<PagedResultDto<InvoiceDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var query = await _invoiceRepository.GetQueryableAsync();
        var totalCount = await _invoiceRepository.GetCountAsync();
        var items = await _invoiceRepository.GetListAsync(); // Optimization omitted for simplicity
        
        var projects = await _projectRepository.GetListAsync();
        var allPayments = await _paymentRepository.GetListAsync();

        var dtos = items.Select(x => {
            var dto = MapToDto(x, projects.FirstOrDefault(p => p.Id == x.ProjectId));
            dto.PaidAmount = allPayments.Where(p => p.InvoiceId == x.Id).Sum(p => p.Amount);
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
            Status = InvoiceStatus.Draft
        };

        foreach (var item in input.Items)
        {
            invoice.Items.Add(new InvoiceItem(GuidGenerator.Create(), invoice.Id, item.Description, item.Quantity, item.UnitPrice));
        }

        invoice.TotalAmount = invoice.Items.Sum(x => x.TotalPrice) * (1 + (invoice.TaxRate / 100));

        await _invoiceRepository.InsertAsync(invoice);
        return await GetAsync(invoice.Id);
    }

    public async Task AddPaymentAsync(Guid invoiceId, decimal amount, string method, string reference)
    {
        var invoice = await _invoiceRepository.GetAsync(invoiceId);
        
        await _paymentRepository.InsertAsync(new Payment(GuidGenerator.Create(), invoiceId, amount, Clock.Now, method)
        {
            ReferenceNumber = reference
        });

        // Durumu güncelle
        var payments = await _paymentRepository.GetListAsync(p => p.InvoiceId == invoiceId);
        var totalPaid = payments.Sum(p => p.Amount);
        
        if (totalPaid >= invoice.TotalAmount)
        {
            invoice.Status = InvoiceStatus.Paid;
        }
        else
        {
            invoice.Status = InvoiceStatus.Sent;
        }

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

    private InvoiceDto MapToDto(Invoice x, Project project)
    {
        return new InvoiceDto
        {
            Id = x.Id,
            ProjectId = x.ProjectId,
            ProjectName = project?.Name ?? "Bilinmeyen Proje",
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
