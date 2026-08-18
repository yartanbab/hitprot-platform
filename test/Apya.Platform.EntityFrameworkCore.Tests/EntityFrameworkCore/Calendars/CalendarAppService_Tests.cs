using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Calendars;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using Apya.Platform.Invoices;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Calendars;

/// <summary>
/// Takvim veri ucunun uçtan uca testi: sorguların GERÇEKTEN SQL'e çevrildiğini ve
/// altı kaynağın tek şekilde döndüğünü ölçer. Birim testler (CalendarFeedProvider_Tests)
/// izin/risk sözleşmesini kapsar; burada yetkilendirme AddAlwaysAllowAuthorization ile
/// açıktır, yani HER kaynağın sorgusu çalışır — çeviri hatası burada yakalanır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class CalendarAppService_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ICalendarAppService _calendar;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public CalendarAppService_Tests()
    {
        _calendar          = GetRequiredService<ICalendarAppService>();
        _taskRepository    = GetRequiredService<IRepository<TaskItem, Guid>>();
        _invoiceRepository = GetRequiredService<IRepository<Invoice, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _expenseRepository = GetRequiredService<IRepository<Expense, Guid>>();
        _cashAccountRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
        _currentTenant     = GetRequiredService<ICurrentTenant>();
        _clock             = GetRequiredService<IClock>();
    }

    [Fact]
    public async Task GetFeedAsync_alti_kaynagi_tek_sekilde_dondurur()
    {
        var today = _clock.Now.Date;
        var project = new Project(Guid.NewGuid(), _currentTenant.Id, null, "Takvim Testi", "TKV-1", "Takvim ucu testi");
        await _projectRepository.InsertAsync(project, autoSave: true);

        await _taskRepository.InsertAsync(
            new TaskItem(Guid.NewGuid(), "Takvim görevi", projectId: project.Id,
                dueDate: today, tenantId: _currentTenant.Id, now: today.AddDays(-5)),
            autoSave: true);

        await _invoiceRepository.InsertAsync(
            new Invoice(Guid.NewGuid(), _currentTenant.Id, project.Id, "FTR-TAKVIM-1",
                today.AddDays(-20), today, 20m, "TRY", InvoiceDirection.Sales, null, null),
            autoSave: true);

        var cashAccount = new CashAccount(Guid.NewGuid(), "Takvim Kasası", tenantId: _currentTenant.Id);
        await _cashAccountRepository.InsertAsync(cashAccount, autoSave: true);

        await _expenseRepository.InsertAsync(
            new Expense(
                Guid.NewGuid(), "Takvim gideri", 1500m, cashAccount.Id, today,
                projectId: project.Id, tenantId: _currentTenant.Id),
            autoSave: true);

        var feed = await _calendar.GetFeedAsync(new GetCalendarFeedInput
        {
            From = today.AddDays(-1),
            To   = today.AddDays(1)
        });

        // Her kaynak için ray satırı döner (izin açık → hepsi erişilebilir).
        feed.Sources.Count.ShouldBe(Enum.GetValues<CalendarSourceType>().Length);
        feed.Sources.ShouldAllBe(s => s.IsAvailable);

        var task = feed.Items.Single(i => i.Title == "Takvim görevi");
        task.Source.ShouldBe(CalendarSourceType.Task);
        task.Date.ShouldBe(today);
        task.Subtitle.ShouldBe("Takvim Testi");
        task.CanReschedule.ShouldBeTrue();

        var invoice = feed.Items.Single(i => i.Title.Contains("FTR-TAKVIM-1"));
        invoice.Source.ShouldBe(CalendarSourceType.Invoice);
        invoice.Currency.ShouldBe("TRY");
        invoice.CanReschedule.ShouldBeFalse();

        var expense = feed.Items.Single(i => i.Title == "Takvim gideri");
        expense.Source.ShouldBe(CalendarSourceType.Expense);
        expense.Amount.ShouldBe(1500m);

        // Öğeler tarihe göre sıralı gelir — ekran ayrıca sıralama yapmaz.
        feed.Items.Select(i => i.Date).ShouldBe(feed.Items.Select(i => i.Date).OrderBy(d => d));
    }

    [Fact]
    public async Task GetFeedAsync_aralik_disindaki_ogeleri_getirmez()
    {
        var today = _clock.Now.Date;

        await _taskRepository.InsertAsync(
            new TaskItem(Guid.NewGuid(), "Uzak gelecek görevi",
                dueDate: today.AddDays(60), tenantId: _currentTenant.Id, now: today),
            autoSave: true);

        var feed = await _calendar.GetFeedAsync(new GetCalendarFeedInput
        {
            From = today,
            To   = today.AddDays(7)
        });

        feed.Items.ShouldNotContain(i => i.Title == "Uzak gelecek görevi");
    }

    [Fact]
    public async Task GetFeedAsync_istenen_kaynagi_tek_basina_dondurur()
    {
        var today = _clock.Now.Date;

        await _taskRepository.InsertAsync(
            new TaskItem(Guid.NewGuid(), "Yalnız görev süzgeci",
                dueDate: today, tenantId: _currentTenant.Id, now: today.AddDays(-2)),
            autoSave: true);

        var feed = await _calendar.GetFeedAsync(new GetCalendarFeedInput
        {
            From    = today.AddDays(-1),
            To      = today.AddDays(1),
            Sources = new System.Collections.Generic.List<CalendarSourceType> { CalendarSourceType.Task }
        });

        feed.Items.ShouldNotBeEmpty();
        feed.Items.ShouldAllBe(i => i.Source == CalendarSourceType.Task);
    }
}
