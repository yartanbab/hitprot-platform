using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Dashboard;
using Apya.Platform.Dashboard.Dtos;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Dashboard;

/// <summary>
/// Teslim/gecikme hesabının uçtan uca testi. Testlerde yetkilendirme
/// <c>AddAlwaysAllowAuthorization</c> ile açıktır; kilit sözleşmesi ayrıca
/// <c>DashboardStatisticsProvider_Tests</c> içinde birim testle doğrulanır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DashboardAppService_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IDashboardAppService _dashboard;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public DashboardAppService_Tests()
    {
        _dashboard = GetRequiredService<IDashboardAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
    }

    private async Task<TaskItem> SeedTaskAsync(string title, DateTime dueDate)
    {
        var task = new TaskItem(
            Guid.NewGuid(), title,
            dueDate: dueDate,
            tenantId: _currentTenant.Id,
            now: _clock.Now.AddDays(-30));

        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    [Fact]
    public async Task GetSummaryAsync_gecikmis_gorevleri_dogru_sayar()
    {
        var today = _clock.Now.Date;
        var marker = Guid.NewGuid().ToString("N")[..8];

        await SeedTaskAsync($"{marker} gecikmis-1", today.AddDays(-5));
        await SeedTaskAsync($"{marker} gecikmis-2", today.AddDays(-1));
        await SeedTaskAsync($"{marker} zamaninda", today.AddDays(3));

        var before = await _dashboard.GetSummaryAsync(new DashboardQueryDto());

        // Yalnız bu testin eklediği kayıtların etkisini ölçmek için delta bakılmaz;
        // en eski gecikme bu testin 5 günlük kaydından küçük OLAMAZ.
        before.Overdue.ShouldBeGreaterThanOrEqualTo(2);
        before.OldestOverdueDays.ShouldNotBeNull();
        before.OldestOverdueDays!.Value.ShouldBeGreaterThanOrEqualTo(5);
    }

    [Fact]
    public async Task GetDeliveriesAsync_gecikmis_satiri_Overdue_ve_gun_sayisiyla_doner()
    {
        var today = _clock.Now.Date;
        var title = $"gecikmis-{Guid.NewGuid():N}";
        await SeedTaskAsync(title, today.AddDays(-4));

        var deliveries = await _dashboard.GetDeliveriesAsync(new DashboardQueryDto());

        var item = deliveries.Single(d => d.Title == title);
        item.State.ShouldBe(DeliveryState.Overdue);
        item.OverdueDays.ShouldBe(4);
    }

    [Fact]
    public async Task GetDeliveriesAsync_bu_hafta_ve_gelecek_hafta_gruplarini_ayirir()
    {
        var today = _clock.Now.Date;
        var weekStart = DashboardPeriod.StartOfWeek(today);
        var marker = Guid.NewGuid().ToString("N")[..8];

        // Bu haftanın içinde kalan bir gün (hafta başı + 1) ve gelecek haftanın ortası.
        var thisWeekDue = weekStart.AddDays(1);
        var nextWeekDue = weekStart.AddDays(9);

        await SeedTaskAsync($"{marker}-bu-hafta", thisWeekDue);
        await SeedTaskAsync($"{marker}-gelecek-hafta", nextWeekDue);

        // Ay penceresi iki haftayı da kapsasın diye Quarter kullanılır.
        var deliveries = await _dashboard.GetDeliveriesAsync(
            new DashboardQueryDto { Range = DashboardDateRange.Quarter });

        deliveries.Single(d => d.Title == $"{marker}-bu-hafta")
            .GroupKey.ShouldBe(DeliveryGroup.ThisWeek);
        deliveries.Single(d => d.Title == $"{marker}-gelecek-hafta")
            .GroupKey.ShouldBe(DeliveryGroup.NextWeek);
    }

    [Fact]
    public async Task Layout_kaydedilir_okunur_ve_sifirlanir()
    {
        var input = new SaveDashboardLayoutInput
        {
            ViewKey = DashboardDefaultLayouts.Today,
            Cards = new()
            {
                new DashboardCardDto
                {
                    CardKey = "deliveries",
                    ChartType = DashboardChartType.RankBar,
                    X = 0, Y = 0, W = 6, H = 4
                }
            }
        };

        await _dashboard.SaveLayoutAsync(input);

        var saved = await _dashboard.GetLayoutAsync(DashboardDefaultLayouts.Today);
        saved.IsDefault.ShouldBeFalse();
        saved.Cards.ShouldHaveSingleItem().CardKey.ShouldBe("deliveries");

        await _dashboard.ResetLayoutAsync(DashboardDefaultLayouts.Today);

        var afterReset = await _dashboard.GetLayoutAsync(DashboardDefaultLayouts.Today);
        afterReset.IsDefault.ShouldBeTrue();
        afterReset.Cards.Count.ShouldBeGreaterThan(1);
    }

    /// <summary>
    /// Sıfırlama kaydı SİLER; DashboardLayout soft-delete olmadığı için aynı
    /// kullanıcı+görünüm tekrar kaydedilebilmeli (tekil indeks ihlali olmamalı).
    /// </summary>
    [Fact]
    public async Task Layout_sifirlandiktan_sonra_tekrar_kaydedilebilir()
    {
        var input = new SaveDashboardLayoutInput
        {
            ViewKey = DashboardDefaultLayouts.Grants,
            Cards = new()
            {
                new DashboardCardDto { CardKey = "deliveries", W = 4, H = 4 }
            }
        };

        await _dashboard.SaveLayoutAsync(input);
        await _dashboard.ResetLayoutAsync(DashboardDefaultLayouts.Grants);
        await _dashboard.SaveLayoutAsync(input);

        var saved = await _dashboard.GetLayoutAsync(DashboardDefaultLayouts.Grants);
        saved.IsDefault.ShouldBeFalse();
        saved.Cards.ShouldHaveSingleItem().CardKey.ShouldBe("deliveries");
    }
}
