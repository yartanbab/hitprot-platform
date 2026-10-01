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

    [Fact]
    public async Task UpdatePreferencesAsync_tercihleri_saklar_ve_geri_okur()
    {
        await _calendar.UpdatePreferencesAsync(new UpdateCalendarPreferencesInput
        {
            DailyCapacityHours = 6m,
            Sources = new System.Collections.Generic.List<CalendarSourceType>
            {
                CalendarSourceType.Task,
                CalendarSourceType.Invoice,
                // Dış etkinlik bir kaynak SEÇİMİ değil (hesap bağlantısına bağlı).
                CalendarSourceType.ExternalEvent
            },
            SetupCompleted = true
        });

        var prefs = await _calendar.GetPreferencesAsync();

        prefs.DailyCapacityHours.ShouldBe(6m);
        prefs.SetupCompleted.ShouldBeTrue();
        prefs.Sources.ShouldContain(CalendarSourceType.Task);
        prefs.Sources.ShouldNotContain(CalendarSourceType.ExternalEvent);
    }

    [Fact]
    public async Task UpdatePreferencesAsync_sifir_kapasite_takibi_kapatir()
    {
        await _calendar.UpdatePreferencesAsync(new UpdateCalendarPreferencesInput
        {
            DailyCapacityHours = 0m,
            SetupCompleted = true
        });

        var prefs = await _calendar.GetPreferencesAsync();
        prefs.DailyCapacityHours.ShouldBeNull();

        // Feed de kapasite döndürmemeli — çubuklar çizilmesin.
        var feed = await _calendar.GetFeedAsync(new GetCalendarFeedInput
        {
            From = _clock.Now.Date,
            To   = _clock.Now.Date
        });
        feed.DailyCapacityHours.ShouldBeNull();
    }

    [Fact]
    public async Task BulkRescheduleAsync_basarisiz_satir_digerlerini_dusurmez()
    {
        var today = _clock.Now.Date;
        var task = new TaskItem(Guid.NewGuid(), "Toplu tasinan gorev",
            dueDate: today.AddDays(-3), tenantId: _currentTenant.Id, now: today.AddDays(-10));
        await _taskRepository.InsertAsync(task, autoSave: true);

        var results = await _calendar.BulkRescheduleAsync(new System.Collections.Generic.List<RescheduleCalendarItemInput>
        {
            new() { Source = CalendarSourceType.Task, SourceId = task.Id, NewDate = today.AddDays(2) },
            // Fatura vadesi ertelenemez → bu satır hata döner…
            new() { Source = CalendarSourceType.Invoice, SourceId = Guid.NewGuid(), NewDate = today.AddDays(2) }
        });

        results.Count.ShouldBe(2);
        results[0].Succeeded.ShouldBeTrue();
        results[1].Succeeded.ShouldBeFalse();
        // Kodsuz ('message:' ile atılan) ret kendi cümlesiyle aynen geçer.
        results[1].Error.ShouldBe("Fatura vadesi takvimden değiştirilemez.");

        // …ama BAŞARILI satır uygulanmış kalmalı.
        var updated = await _taskRepository.GetAsync(task.Id);
        updated.DueDate!.Value.Date.ShouldBe(today.AddDays(2));
    }

    /// <summary>
    /// CAL-15 · Kodla atılan ret satıra <c>ex.Message</c> ile yazılıyordu: .NET'in İngilizce varsayılanı
    /// ("Exception of type 'Volo.Abp.BusinessException' was thrown."). Satır artık kodun tr.json metnini taşır.
    /// <para>Test host'u her izni verdiği için TaskUpdateDenied üretilemiyor; aynı dalın diğer kodu destek
    /// oturumuyla (impersonation) üretilir — <c>TaskAppService_Tenant_Tests</c> emsali.</para>
    /// </summary>
    [Fact]
    public async Task BulkRescheduleAsync_kodlu_reddi_yerellestirilmis_metinle_doner()
    {
        var today = _clock.Now.Date;
        var task = new TaskItem(Guid.NewGuid(), "QA-UX gizli toplu erteleme",
            dueDate: today, isPrivate: true, tenantId: _currentTenant.Id, now: today.AddDays(-2));
        await _taskRepository.InsertAsync(task, autoSave: true);

        var impersonated = new System.Security.Claims.ClaimsPrincipal(new System.Security.Claims.ClaimsIdentity(new[]
        {
            new System.Security.Claims.Claim(Volo.Abp.Security.Claims.AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new System.Security.Claims.Claim(Volo.Abp.Security.Claims.AbpClaimTypes.UserName, "qa-ux-destek"),
            new System.Security.Claims.Claim(Volo.Abp.Security.Claims.AbpClaimTypes.ImpersonatorUserId, Guid.NewGuid().ToString())
        }));

        System.Collections.Generic.List<BulkRescheduleResultDto> results;
        string expected;
        using (Volo.Abp.Localization.CultureHelper.Use("tr"))
        using (GetRequiredService<Volo.Abp.Security.Claims.ICurrentPrincipalAccessor>().Change(impersonated))
        {
            results = await _calendar.BulkRescheduleAsync(new System.Collections.Generic.List<RescheduleCalendarItemInput>
            {
                new() { Source = CalendarSourceType.Task, SourceId = task.Id, NewDate = today.AddDays(2) }
            });
            expected = GetRequiredService<Microsoft.Extensions.Localization.IStringLocalizer<Apya.Platform.Localization.PlatformResource>>()
                [PlatformDomainErrorCodes.TaskViewImpersonationDenied].Value;
        }

        var row = results.ShouldHaveSingleItem();
        row.Succeeded.ShouldBeFalse();
        row.Error.ShouldBe(expected);
        row.Error.ShouldStartWith("Bu gizli görevi");
        row.Error.ShouldNotContain("Exception of type");

        // Reddedilen görev yerinde kalır.
        (await _taskRepository.GetAsync(task.Id)).DueDate!.Value.Date.ShouldBe(today);
    }

    [Fact]
    public async Task GetTeamLoadAsync_kisi_basina_gunluk_yuku_toplar()
    {
        var today = _clock.Now.Date;
        // Atanan GERÇEK bir kullanıcı olmalı: AssigneeId'de AbpUsers'a FK var,
        // CurrentUser.Id test bağlamında bir satıra karşılık gelmeyebilir.
        var userRepo = GetRequiredService<IRepository<Volo.Abp.Identity.IdentityUser, Guid>>();
        var assignee = (await userRepo.GetListAsync()).First().Id;

        await _taskRepository.InsertAsync(
            NewTask("Ekip gorevi 1", today, assignee, hours: 5m), autoSave: true);
        await _taskRepository.InsertAsync(
            NewTask("Ekip gorevi 2", today, assignee, hours: 3m), autoSave: true);
        // Tamamlanmis gorev yuke GIRMEZ: kalan kapasiteyi etkilemez.
        var done = NewTask("Biten", today, assignee, hours: 8m);
        done.ChangeStatus(Apya.Platform.Tasks.TaskStatus.Done, today);
        await _taskRepository.InsertAsync(done, autoSave: true);

        var rows = await _calendar.GetTeamLoadAsync(new GetCalendarFeedInput
        {
            From = today,
            To   = today
        });

        var row = rows.Single(r => r.UserId == assignee);
        row.TotalHours.ShouldBe(8m);
        row.Days.Single().Hours.ShouldBe(8m);
        row.Days.Single().ItemCount.ShouldBe(2);
    }

    [Fact]
    public async Task GetTeamLoadAsync_atanmamis_gorevi_saymaz()
    {
        var today = _clock.Now.Date;

        await _taskRepository.InsertAsync(
            new TaskItem(Guid.NewGuid(), "Atanmamis", dueDate: today,
                tenantId: _currentTenant.Id, now: today.AddDays(-1)),
            autoSave: true);

        var rows = await _calendar.GetTeamLoadAsync(new GetCalendarFeedInput
        {
            From = today,
            To   = today
        });

        rows.ShouldAllBe(r => r.UserId != Guid.Empty);
        rows.SelectMany(r => r.Days).ShouldAllBe(d => d.ItemCount > 0);
    }

    private TaskItem NewTask(string title, DateTime due, Guid assigneeId, decimal? hours = null)
    {
        var task = new TaskItem(Guid.NewGuid(), title, dueDate: due, assigneeId: assigneeId,
            tenantId: _currentTenant.Id, now: due.AddDays(-2));
        if (hours.HasValue) task.SetPlanningInfo(hours, null, null);
        return task;
    }
}
