using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Finance;

/// <summary>
/// Fatura listesi sıralaması açık bir eşlemeyle yapılır (2026-11-20 kararı: System.Linq.Dynamic.Core
/// yeni depoya girmez). Yalnız bilinen sütun + asc/desc; DTO'da hesaplanan projectName/paidAmount
/// varsayılana düşer; başka her şey hata.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class InvoiceListSorting_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IInvoiceAppService _invoices;
    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Project, Guid> _projectRepository;

    public InvoiceListSorting_Tests()
    {
        _invoices = GetRequiredService<IInvoiceAppService>();
        _invoiceRepository = GetRequiredService<IRepository<Invoice, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
    }

    /// <summary>
    /// Üç fatura: fatura tarihi C &lt; A &lt; B, vade B &lt; A &lt; C, numara C &lt; A &lt; B.
    /// Dönen sözlük fatura kimliği → harf.
    /// </summary>
    private async Task<(Guid ProjectId, Dictionary<Guid, string> Names)> SeedAsync()
    {
        var project = new Project(
            Guid.NewGuid(), null, null, "Sıralama projesi", "FSR-" + Guid.NewGuid().ToString("N")[..8], "");
        await _projectRepository.InsertAsync(project, autoSave: true);
        var prefix = "FSR-" + Guid.NewGuid().ToString("N")[..6];

        var names = new Dictionary<Guid, string>();
        async Task AddAsync(string name, string number, DateTime invoiceDate, DateTime dueDate, decimal amount)
        {
            var dto = await _invoices.CreateAsync(new CreateInvoiceDto
            {
                ProjectId = project.Id,
                InvoiceNumber = prefix + "-" + number,
                InvoiceDate = invoiceDate,
                DueDate = dueDate,
                Items = new List<CreateInvoiceItemDto>
                {
                    new() { Description = "Hizmet", Quantity = 1, UnitPrice = amount }
                }
            });
            names[dto.Id] = name;
        }

        await AddAsync("A", "2", new DateTime(2026, 1, 10), new DateTime(2026, 3, 1), 300m);
        await AddAsync("B", "3", new DateTime(2026, 1, 20), new DateTime(2026, 2, 1), 100m);
        await AddAsync("C", "1", new DateTime(2026, 1, 5), new DateTime(2026, 4, 1), 200m);
        return (project.Id, names);
    }

    private async Task<string> OrderAsync(Guid projectId, Dictionary<Guid, string> names, string? sorting)
    {
        var list = await _invoices.GetListAsync(new GetInvoicesInput
        {
            ProjectId = projectId,
            Sorting = sorting,
            MaxResultCount = 10
        });
        return string.Join(",", list.Items.Select(i => names[i.Id]));
    }

    [Theory]
    [InlineData(null, "B,A,C")]
    [InlineData("", "B,A,C")]
    [InlineData("   ", "B,A,C")]
    [InlineData("invoiceDate desc", "B,A,C")]
    [InlineData("invoiceDate asc", "C,A,B")]
    [InlineData("invoiceDate", "C,A,B")]
    [InlineData("dueDate asc", "B,A,C")]
    [InlineData("dueDate desc", "C,A,B")]
    [InlineData("invoiceNumber asc", "C,A,B")]
    [InlineData("invoiceNumber desc", "B,A,C")]
    [InlineData("direction asc, invoiceNumber asc", "C,A,B")]
    [InlineData("INVOICEDATE DESC", "B,A,C")]
    [InlineData("InvoiceDate Descending", "B,A,C")]
    [InlineData("duedate ASCENDING", "B,A,C")]
    [InlineData("currency asc, invoiceNumber desc", "B,A,C")]
    [InlineData("  status asc ,  dueDate desc ", "C,A,B")]
    public async Task Fatura_listesi_bilinen_alana_gore_siralanir(string? sorting, string expected)
    {
        var (projectId, names) = await SeedAsync();

        (await OrderAsync(projectId, names, sorting)).ShouldBe(expected);
    }

    /// <summary>
    /// Test veritabanı SQLite ve EF Core orada decimal sütunu ORDER BY'a çeviremez; bu yüzden
    /// TotalAmount eşlemesi bellekteki kayıtlar üzerinde sınanır.
    /// </summary>
    [Theory]
    [InlineData("totalAmount desc", "A,C,B")]
    [InlineData("TOTALAMOUNT asc", "B,C,A")]
    public async Task Fatura_listesi_tutara_gore_siralanir(string sorting, string expected)
    {
        var (projectId, names) = await SeedAsync();
        var rows = await _invoiceRepository.GetListAsync(x => x.ProjectId == projectId);
        var applySorting = typeof(InvoiceAppService)
            .GetMethod("ApplySorting", BindingFlags.NonPublic | BindingFlags.Static)!;

        var sorted = (IQueryable<Invoice>)applySorting.Invoke(null, new object[] { rows.AsQueryable(), sorting })!;

        string.Join(",", sorted.AsEnumerable().Select(x => names[x.Id])).ShouldBe(expected);
    }

    [Theory]
    [InlineData("projectName asc")]
    [InlineData("ProjectName desc")]
    [InlineData("paidAmount desc")]
    [InlineData("invoiceNumber asc, projectName asc")]
    public async Task Hesaplanan_alanla_siralama_fatura_tarihi_azalana_duser(string sorting)
    {
        var (projectId, names) = await SeedAsync();

        (await OrderAsync(projectId, names, sorting)).ShouldBe("B,A,C");
    }

    [Theory]
    [InlineData("customerName asc")]
    [InlineData("notes asc")]
    [InlineData("invoiceDate up")]
    [InlineData("invoiceDate desc extra")]
    [InlineData("invoiceDate desc,")]
    [InlineData("projectName sideways")]
    [InlineData("Id; DROP TABLE Invoices")]
    public async Task Bilinmeyen_alan_ya_da_yon_hata_verir(string sorting)
    {
        var (projectId, names) = await SeedAsync();

        var ex = await Should.ThrowAsync<BusinessException>(() => OrderAsync(projectId, names, sorting));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.InvoiceSortingInvalid);
        ex.Data["Sorting"].ShouldBe(sorting);
    }
}
