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

namespace Apya.Platform.Invoices;

[Authorize]
public class InvoiceAppService : ApplicationService, IInvoiceAppService
{
    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Payment, Guid> _paymentRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly InvoiceManager _invoiceManager;

    public InvoiceAppService(
        IRepository<Invoice, Guid> invoiceRepository,
        IRepository<Payment, Guid> paymentRepository,
        IRepository<Project, Guid> projectRepository,
        InvoiceManager invoiceManager)
    {
        _invoiceRepository = invoiceRepository;
        _paymentRepository = paymentRepository;
        _projectRepository = projectRepository;
        _invoiceManager = invoiceManager;
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

        var invoiceIds = items.Select(x => x.Id).ToList();
        var projectIds = items.Select(x => x.ProjectId).Distinct().ToList();

        var projects = await _projectRepository.GetListAsync(p => projectIds.Contains(p.Id));
        var payments = await _paymentRepository.GetListAsync(p => invoiceIds.Contains(p.InvoiceId));

        var dtos = items.Select(x =>
        {
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
        var items = input.Items
            .Select(i => new InvoiceItemDescriptor(i.Description, i.Quantity, i.UnitPrice))
            .ToList();

        var invoice = await _invoiceManager.CreateAsync(
            input.ProjectId,
            input.InvoiceNumber,
            input.InvoiceDate,
            input.DueDate,
            input.TaxRate,
            input.Currency,
            input.Direction,
            input.CustomerId,
            input.TaskId,
            items);

        return await GetAsync(invoice.Id);
    }

    public async Task AddPaymentAsync(Guid invoiceId, decimal amount, string method, string reference, Guid? cashAccountId = null)
    {
        await _invoiceManager.RecordPaymentAsync(invoiceId, amount, method, reference, cashAccountId);
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
        var q = await _projectRepository.GetQueryableAsync();
        var projects = await AsyncExecuter.ToListAsync(q.OrderBy(p => p.Name).Take(1000));
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
            Items = x.Items.Select(i => new InvoiceItemDto
            {
                Description = i.Description,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                TotalPrice = i.TotalPrice
            }).ToList()
        };
    }
}
