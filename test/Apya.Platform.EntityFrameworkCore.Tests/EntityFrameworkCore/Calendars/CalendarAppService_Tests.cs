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
    private readonly IRepository<ExternalCalendarAccount, Guid> _accountRepository;
    private readonly Volo.Abp.Users.ICurrentUser _currentUser;

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
        _accountRepository = GetRequiredService<IRepository<ExternalCalendarAccount, Guid>>();
        _currentUser       = GetRequiredService<Volo.Abp.Users.ICurrentUser>();
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
        // Dış takvim etkinliği bu listede YOKTUR: izin modeli farklı, ayrı uçtan gelir.
        feed.Sources.Count.ShouldBe(CalendarSources.Internal.Length);
        feed.Sources.ShouldNotContain(s => s.Source == CalendarSourceType.ExternalEvent);
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

    [Fact]
    public async Task RescheduleItemAsync_gorevi_baska_gune_tasir()
    {
        var today = _clock.Now.Date;
        var task = new TaskItem(Guid.NewGuid(), "Tasinacak gorev",
            dueDate: today, tenantId: _currentTenant.Id, now: today.AddDays(-2));
        await _taskRepository.InsertAsync(task, autoSave: true);

        await _calendar.RescheduleItemAsync(new RescheduleCalendarItemInput
        {
            Source   = CalendarSourceType.Task,
            SourceId = task.Id,
            NewDate  = today.AddDays(3)
        });

        var updated = await _taskRepository.GetAsync(task.Id);
        updated.DueDate!.Value.Date.ShouldBe(today.AddDays(3));
    }

    [Fact]
    public async Task RescheduleItemAsync_fatura_vadesini_degistirmeyi_reddeder()
    {
        var today = _clock.Now.Date;
        var project = new Project(Guid.NewGuid(), _currentTenant.Id, null, "Vade Testi", "VDE-1", "Vade korumasi");
        await _projectRepository.InsertAsync(project, autoSave: true);

        var invoice = new Invoice(Guid.NewGuid(), _currentTenant.Id, project.Id, "FTR-VADE-1",
            today.AddDays(-10), today, 20m, "TRY", InvoiceDirection.Sales, null, null);
        await _invoiceRepository.InsertAsync(invoice, autoSave: true);

        // Muhasebe kaydının vadesi takvimden sürüklenerek değiştirilemez.
        await Should.ThrowAsync<Volo.Abp.BusinessException>(() =>
            _calendar.RescheduleItemAsync(new RescheduleCalendarItemInput
            {
                Source   = CalendarSourceType.Invoice,
                SourceId = invoice.Id,
                NewDate  = today.AddDays(5)
            }));

        var unchanged = await _invoiceRepository.GetAsync(invoice.Id);
        unchanged.DueDate.Date.ShouldBe(today);
    }

    [Fact]
    public async Task CompleteItemAsync_gorevi_kapatir_ve_riski_kalkar()
    {
        var today = _clock.Now.Date;
        var task = new TaskItem(Guid.NewGuid(), "Kapanacak gorev",
            dueDate: today.AddDays(-3), tenantId: _currentTenant.Id, now: today.AddDays(-10));
        await _taskRepository.InsertAsync(task, autoSave: true);

        await _calendar.CompleteItemAsync(new CompleteCalendarItemInput
        {
            Source   = CalendarSourceType.Task,
            SourceId = task.Id
        });

        var feed = await _calendar.GetFeedAsync(new GetCalendarFeedInput
        {
            From = today.AddDays(-7),
            To   = today
        });

        var item = feed.Items.Single(i => i.Title == "Kapanacak gorev");
        item.IsDone.ShouldBeTrue();
        item.Risk.ShouldBe(CalendarRiskLevel.None);
    }

    [Fact]
    public async Task GetExternalEventsAsync_bagli_hesap_yokken_bos_doner_patlamaz()
    {
        var today = _clock.Now.Date;

        var result = await _calendar.GetExternalEventsAsync(new GetCalendarFeedInput
        {
            From = today,
            To   = today.AddDays(7)
        });

        result.Items.ShouldBeEmpty();
        result.Accounts.ShouldBeEmpty();
    }

    [Fact]
    public async Task GetExternalEventsAsync_bozuk_hesabi_hata_satiri_olarak_dondurur()
    {
        var today = _clock.Now.Date;

        // Okuma sağlayıcısı olmayan bir hesap: takvimin tamamı düşmemeli, yalnız
        // o hesabın satırı hata durumuna geçmeli (tasarımın "bağlantı bozuk" hâli).
        var account = new ExternalCalendarAccount(
            Guid.NewGuid(), _currentUser.Id!.Value, CalendarProviderType.ICloud, "kirik@apya.co");
        await _accountRepository.InsertAsync(account, autoSave: true);

        var result = await _calendar.GetExternalEventsAsync(new GetCalendarFeedInput
        {
            From = today,
            To   = today.AddDays(7)
        });

        var row = result.Accounts.Single(a => a.AccountId == account.Id);
        row.Error.ShouldNotBeNullOrWhiteSpace();
        row.EventCount.ShouldBe(0);
        result.Items.ShouldBeEmpty();
    }

    [Fact]
    public async Task UpdateSyncRulesAsync_kurallari_saklar_ve_geri_okur()
    {
        var account = new ExternalCalendarAccount(
            Guid.NewGuid(), _currentUser.Id!.Value, CalendarProviderType.Google, "kural@apya.co");
        await _accountRepository.InsertAsync(account, autoSave: true);

        var projectId = Guid.NewGuid();
        await _calendar.UpdateSyncRulesAsync(new UpdateCalendarSyncRulesInput
        {
            AccountId      = account.Id,
            IsSyncEnabled  = true,
            SyncSources    = new System.Collections.Generic.List<CalendarSourceType>
            {
                CalendarSourceType.Task,
                CalendarSourceType.Invoice,
                // Dış etkinlik bir HEDEF, kaynak değil — kaydedilmemeli.
                CalendarSourceType.ExternalEvent
            },
            SyncProjectIds = new System.Collections.Generic.List<Guid> { projectId },
            ConflictRule   = CalendarConflictRule.ApyaWins
        });

        var settings = await _calendar.GetSyncSettingsAsync();
        var row = settings.Accounts.Single(a => a.Id == account.Id);

        row.SyncSources.ShouldContain(CalendarSourceType.Task);
        row.SyncSources.ShouldContain(CalendarSourceType.Invoice);
        row.SyncSources.ShouldNotContain(CalendarSourceType.ExternalEvent);
        row.SyncProjectIds.ShouldBe(new[] { projectId });
        row.ConflictRule.ShouldBe(CalendarConflictRule.ApyaWins);
    }

    [Fact]
    public async Task GetSyncSettingsAsync_kuralsiz_hesapta_yalniz_gorev_dondurur()
    {
        var account = new ExternalCalendarAccount(
            Guid.NewGuid(), _currentUser.Id!.Value, CalendarProviderType.Outlook, "eski@apya.co");
        await _accountRepository.InsertAsync(account, autoSave: true);

        var settings = await _calendar.GetSyncSettingsAsync();
        var row = settings.Accounts.Single(a => a.Id == account.Id);

        // Kural tanımlanmamış eski hesap birden bire fatura/gider göndermeye başlamamalı.
        row.SyncSources.ShouldBe(new[] { CalendarSourceType.Task });
        row.SyncProjectIds.ShouldBeEmpty();
        row.ConflictRule.ShouldBe(CalendarConflictRule.LastWriteWins);
    }
}
