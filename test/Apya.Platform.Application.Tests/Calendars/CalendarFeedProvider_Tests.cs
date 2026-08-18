using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Calendars;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Customers;
using Apya.Platform.Expenses;
using Apya.Platform.Grants;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Settings;
using Apya.Platform.Tasks;
using NSubstitute;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Linq;
using Volo.Abp.Settings;
using Volo.Abp.Timing;
using Volo.Abp.Users;
using Xunit;
using TaskStatusEnum = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Tests.Application.Calendars;

/// <summary>
/// Takvim veri ucunun KİLİT SÖZLEŞMESİ testi.
/// <para>
/// 1) İzin yoksa kaynak sorgusu HİÇ atılmaz — ray sayacı sızdırmaz.
/// 2) Risk (gecikmiş / bugün son gün) yalnız AÇIK öğelerde doğar.
/// 3) Muhasebe vadeleri takvimden taşınamaz (<c>CanReschedule=false</c>).
/// Entegrasyon testleri AddAlwaysAllowAuthorization kullandığı için izin sözleşmesi
/// burada birim testle ölçülür.
/// </para>
/// </summary>
public class CalendarFeedProvider_Tests
{
    private static readonly DateTime Today = new(2026, 8, 14);

    private readonly IPermissionChecker _permissionChecker = Substitute.For<IPermissionChecker>();
    private readonly IAsyncQueryableExecuter _executer = Substitute.For<IAsyncQueryableExecuter>();
    private readonly ISettingProvider _settingProvider = Substitute.For<ISettingProvider>();

    private readonly IRepository<TaskItem, Guid> _taskRepo = Substitute.For<IRepository<TaskItem, Guid>>();
    private readonly IRepository<Invoice, Guid> _invoiceRepo = Substitute.For<IRepository<Invoice, Guid>>();
    private readonly IRepository<Expense, Guid> _expenseRepo = Substitute.For<IRepository<Expense, Guid>>();
    private readonly IRepository<IncomeEntry, Guid> _incomeRepo = Substitute.For<IRepository<IncomeEntry, Guid>>();
    private readonly IRepository<CashMovement, Guid> _cashMovementRepo = Substitute.For<IRepository<CashMovement, Guid>>();
    private readonly IRepository<GrantMilestone, Guid> _milestoneRepo = Substitute.For<IRepository<GrantMilestone, Guid>>();
    private readonly IRepository<Project, Guid> _projectRepo = Substitute.For<IRepository<Project, Guid>>();
    private readonly IRepository<Customer, Guid> _customerRepo = Substitute.For<IRepository<Customer, Guid>>();

    private CalendarFeedProvider BuildSut()
    {
        var clock = Substitute.For<IClock>();
        clock.Now.Returns(Today.AddHours(10));

        // Kapasite varsayılanı: 8 saat.
        _settingProvider.GetOrNullAsync(PlatformSettings.Calendar.DailyCapacityHours).Returns("8");

        // Boş kaynaklar: sorgulanırlarsa boş liste dönsün (izinliyken bile veri yok).
        StubEmpty(_expenseRepo);
        StubEmpty(_incomeRepo);
        StubEmpty(_cashMovementRepo);
        StubEmpty(_milestoneRepo);
        StubEmpty(_projectRepo);
        StubEmpty(_customerRepo);

        return new CalendarFeedProvider(
            _taskRepo,
            _invoiceRepo,
            _expenseRepo,
            _incomeRepo,
            _cashMovementRepo,
            _milestoneRepo,
            Substitute.For<IRepository<GrantApplication, Guid>>(),
            Substitute.For<IRepository<GrantCall, Guid>>(),
            Substitute.For<IRepository<Grant, Guid>>(),
            _projectRepo,
            _customerRepo,
            Substitute.For<IRepository<CashAccount, Guid>>(),
            Substitute.For<IRepository<IdentityUser, Guid>>(),
            _permissionChecker,
            _executer,
            Substitute.For<ICurrentUser>(),
            Substitute.For<IDataFilter>(),
            _settingProvider,
            clock);
    }

    /// <summary>Sorguyu bellek içinde çalıştıran executer — gerçek LINQ davranışı ölçülür.</summary>
    private void StubExecuter<T>()
    {
        _executer.ToListAsync(Arg.Any<IQueryable<T>>(), Arg.Any<CancellationToken>())
            .Returns(ci => ci.Arg<IQueryable<T>>().ToList());
    }

    private void StubEmpty<TEntity>(IRepository<TEntity, Guid> repo) where TEntity : class, Volo.Abp.Domain.Entities.IEntity<Guid>
    {
        repo.GetQueryableAsync().Returns(new List<TEntity>().AsQueryable());
        StubExecuter<TEntity>();
    }

    private void GivenTasks(params TaskItem[] tasks)
    {
        _taskRepo.GetQueryableAsync().Returns(tasks.AsQueryable());
        StubExecuter<TaskItem>();
    }

    private void GivenInvoices(params Invoice[] invoices)
    {
        _invoiceRepo.GetQueryableAsync().Returns(invoices.AsQueryable());
        StubExecuter<Invoice>();
    }

    private static TaskItem Task(string title, DateTime due, TaskStatusEnum status = TaskStatusEnum.Todo, decimal? hours = null)
    {
        var task = new TaskItem(Guid.NewGuid(), title, dueDate: due, now: due.AddDays(-3));
        if (hours.HasValue)
        {
            task.SetPlanningInfo(hours, null, null);
        }
        if (status != TaskStatusEnum.Todo)
        {
            task.ChangeStatus(status, Today);
        }
        return task;
    }

    private static Invoice Invoice(string number, DateTime due)
        => new(Guid.NewGuid(), null, Guid.NewGuid(), number, due.AddDays(-30), due, 20m, "TRY",
               InvoiceDirection.Sales, null, null);

    private static GetCalendarFeedInput Range(DateTime from, DateTime to)
        => new() { From = from, To = to };

    [Fact]
    public async Task Yetki_yoksa_hicbir_sorgu_atilmaz_ve_sayac_sizdirmaz()
    {
        _permissionChecker.IsGrantedAsync(Arg.Any<string>()).Returns(false);

        var feed = await BuildSut().BuildAsync(Range(Today.AddDays(-7), Today.AddDays(7)));

        feed.Items.ShouldBeEmpty();
        feed.Sources.ShouldNotBeEmpty();
        feed.Sources.ShouldAllBe(s => !s.IsAvailable);
        feed.Sources.ShouldAllBe(s => s.Count == 0);
        feed.Sources.ShouldAllBe(s => !string.IsNullOrWhiteSpace(s.RequiredPermission));

        await _taskRepo.DidNotReceive().GetQueryableAsync();
        await _invoiceRepo.DidNotReceive().GetQueryableAsync();
        await _expenseRepo.DidNotReceive().GetQueryableAsync();
        _executer.ReceivedCalls().ShouldBeEmpty();
    }

    [Fact]
    public async Task Istenmeyen_kaynak_izin_olsa_bile_sorgulanmaz()
    {
        _permissionChecker.IsGrantedAsync(Arg.Any<string>()).Returns(true);
        GivenTasks(Task("Görev", Today));
        GivenInvoices(Invoice("FTR-1", Today));

        var input = Range(Today.AddDays(-7), Today.AddDays(7));
        input.Sources = new List<CalendarSourceType> { CalendarSourceType.Task };

        var feed = await BuildSut().BuildAsync(input);

        feed.Items.ShouldAllBe(i => i.Source == CalendarSourceType.Task);
        await _invoiceRepo.DidNotReceive().GetQueryableAsync();

        // İzin VAR ama bu turda istenmedi: ray satırı erişilebilir kalır, sayaç 0'dır.
        var invoiceRow = feed.Sources.Single(s => s.Source == CalendarSourceType.Invoice);
        invoiceRow.IsAvailable.ShouldBeTrue();
        invoiceRow.Count.ShouldBe(0);
    }

    [Fact]
    public async Task Risk_yalniz_acik_ogelerde_dogar()
    {
        OnlyTasksGranted();
        GivenTasks(
            Task("Gecikmiş", Today.AddDays(-2)),
            Task("Bugün son gün", Today),
            Task("Gelecek hafta", Today.AddDays(5)),
            Task("Kapanmış gecikmiş", Today.AddDays(-2), TaskStatusEnum.Done));

        var feed = await BuildSut().BuildAsync(Range(Today.AddDays(-7), Today.AddDays(7)));

        Risk(feed, "Gecikmiş").ShouldBe(CalendarRiskLevel.Overdue);
        Risk(feed, "Bugün son gün").ShouldBe(CalendarRiskLevel.DueToday);
        Risk(feed, "Gelecek hafta").ShouldBe(CalendarRiskLevel.None);
        // Tamamlanmış görev tarihi geçmiş olsa da risk taşımaz.
        Risk(feed, "Kapanmış gecikmiş").ShouldBe(CalendarRiskLevel.None);
        feed.Items.Single(i => i.Title == "Kapanmış gecikmiş").IsDone.ShouldBeTrue();
    }

    [Fact]
    public async Task Gun_yuku_yalniz_acik_gorevlerden_toplanir()
    {
        OnlyTasksGranted();
        GivenTasks(
            Task("Açık", Today, hours: 5m),
            Task("Kapanmış", Today, TaskStatusEnum.Done, hours: 4m));

        var feed = await BuildSut().BuildAsync(Range(Today, Today));

        feed.Items.Single(i => i.Title == "Açık").LoadHours.ShouldBe(5m);
        feed.Items.Single(i => i.Title == "Kapanmış").LoadHours.ShouldBeNull();
        feed.DailyCapacityHours.ShouldBe(8m);
    }

    [Fact]
    public async Task Kapasite_sifir_veya_bossa_takip_kapalidir()
    {
        OnlyTasksGranted();
        GivenTasks();

        // BuildSut varsayılanı ("8") kurar; kapalı senaryosu ondan SONRA ezilmeli.
        var sut = BuildSut();
        _settingProvider.GetOrNullAsync(PlatformSettings.Calendar.DailyCapacityHours).Returns("0");

        var feed = await sut.BuildAsync(Range(Today, Today));

        feed.DailyCapacityHours.ShouldBeNull();
    }

    [Fact]
    public async Task Bitis_gunu_araliga_dahildir_sonrasi_disaridadir()
    {
        OnlyTasksGranted();
        var lastDay = Today.AddDays(3);
        GivenTasks(
            // Gün içi saat bileşeni olan kayıt son günde DÜŞMEMELİ.
            Task("Son gün 14:30", lastDay.AddHours(14).AddMinutes(30)),
            Task("Ertesi gün", lastDay.AddDays(1)));

        var feed = await BuildSut().BuildAsync(Range(Today, lastDay));

        feed.Items.Select(i => i.Title).ShouldContain("Son gün 14:30");
        feed.Items.Select(i => i.Title).ShouldNotContain("Ertesi gün");
        // Tarih saat bileşeninden arındırılmış olarak döner (gün hücresine oturur).
        feed.Items.Single().Date.ShouldBe(lastDay);
    }

    [Fact]
    public async Task Fatura_vadesi_takvimden_tasinamaz_gorev_tasinabilir()
    {
        _permissionChecker.IsGrantedAsync(Arg.Any<string>()).Returns(false);
        _permissionChecker.IsGrantedAsync(PlatformPermissions.Tasks.Default).Returns(true);
        _permissionChecker.IsGrantedAsync(PlatformPermissions.Invoices.Default).Returns(true);
        GivenTasks(Task("Görev", Today));
        GivenInvoices(Invoice("FTR-2026-0151", Today));

        var feed = await BuildSut().BuildAsync(Range(Today, Today));

        feed.Items.Single(i => i.Source == CalendarSourceType.Task).CanReschedule.ShouldBeTrue();
        feed.Items.Single(i => i.Source == CalendarSourceType.Invoice).CanReschedule.ShouldBeFalse();
    }

    [Fact]
    public async Task Odenmis_fatura_vadesi_gecse_bile_gecikmis_sayilmaz()
    {
        _permissionChecker.IsGrantedAsync(Arg.Any<string>()).Returns(false);
        _permissionChecker.IsGrantedAsync(PlatformPermissions.Invoices.Default).Returns(true);

        var paid = Invoice("FTR-ODENDI", Today.AddDays(-5));
        paid.UpdateStatus(0m); // kalemsiz fatura → tutar 0, tahsilat tam sayılır
        GivenInvoices(paid, Invoice("FTR-ACIK", Today.AddDays(-5)));

        var feed = await BuildSut().BuildAsync(Range(Today.AddDays(-7), Today));

        var paidItem = feed.Items.Single(i => i.Title.Contains("FTR-ODENDI"));
        paidItem.IsDone.ShouldBeTrue();
        paidItem.Risk.ShouldBe(CalendarRiskLevel.None);

        feed.Items.Single(i => i.Title.Contains("FTR-ACIK")).Risk.ShouldBe(CalendarRiskLevel.Overdue);
    }

    private void OnlyTasksGranted()
    {
        _permissionChecker.IsGrantedAsync(Arg.Any<string>()).Returns(false);
        _permissionChecker.IsGrantedAsync(PlatformPermissions.Tasks.Default).Returns(true);
    }

    private static CalendarRiskLevel Risk(CalendarFeedDto feed, string title)
        => feed.Items.Single(i => i.Title == title).Risk;
}
