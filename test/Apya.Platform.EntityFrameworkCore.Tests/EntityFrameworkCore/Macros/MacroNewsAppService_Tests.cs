using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Macros;
using Apya.Platform.Macros.Dtos;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Security.Claims;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Macros;

/// <summary>
/// Makro Ekran haber akışı: ayrı bir haber kaydı yok, akış mevcut kaynaklardan türer. Çağrı haberi
/// "açık" kuralına (durum + son başvuru) uyar; sonuç haberi yalnız kullanıcının kendi karar/itiraz
/// bildirimidir.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class MacroNewsAppService_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IMacroNewsAppService _service;
    private readonly IRepository<Grant, Guid> _grants;
    private readonly IRepository<GrantCall, Guid> _calls;
    private readonly IRepository<Notification, Guid> _notifications;
    private readonly ICurrentPrincipalAccessor _principal;
    private readonly DateTime _now;

    public MacroNewsAppService_Tests()
    {
        _service = GetRequiredService<IMacroNewsAppService>();
        _grants = GetRequiredService<IRepository<Grant, Guid>>();
        _calls = GetRequiredService<IRepository<GrantCall, Guid>>();
        _notifications = GetRequiredService<IRepository<Notification, Guid>>();
        _principal = GetRequiredService<ICurrentPrincipalAccessor>();
        _now = GetRequiredService<IClock>().Now;
    }

    private IDisposable As(Guid userId) => _principal.Change(
        new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new(AbpClaimTypes.UserId, userId.ToString()),
            new(AbpClaimTypes.UserName, "haber-" + userId.ToString("N")[..6])
        }, "Test")));

    private async Task<List<MacroNewsItemDto>> NewsAsync(Guid userId, int max = 50)
    {
        using (As(userId))
        {
            return await WithUnitOfWorkAsync(() => _service.GetListAsync(max));
        }
    }

    private async Task<GrantCall> NewCallAsync(string name, GrantCallStatus status, int? deadlineInDays, int openedDaysAgo,
        DateTime? openedAt = null)
    {
        return await WithUnitOfWorkAsync(async () =>
        {
            var grant = new Grant(Guid.NewGuid(), name, "Haber Kurumu", 100_000m, 0);
            await _grants.InsertAsync(grant, autoSave: true);
            var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/9", status);
            call.SetSchedule(openedAt ?? _now.Date.AddDays(-openedDaysAgo),
                deadlineInDays.HasValue ? _now.Date.AddDays(deadlineInDays.Value) : null);
            await _calls.InsertAsync(call, autoSave: true);
            return call;
        });
    }

    [Fact]
    public async Task Yalniz_acik_ve_tarihi_gecmemis_cagri_haber_olur()
    {
        // Açılış ANI tam şimdi: haber listesi (OpenDate ?? CreationTime) azalan sırada ilk 50'yi alır.
        // Veritabanı test sınıfları arasında ortak; açılış tarihi boş, bugün oluşturulmuş açık çağrılar
        // "2 gün önce" açılanı ilk 50'nin dışına itiyor, test sırasına göre kırmızıya dönüyordu (10-19
        // tam paket). Kural değişmedi; yalnız testin kendi kaydı en yeni olur.
        var open = await NewCallAsync("Açık haber çağrısı", GrantCallStatus.Acik, deadlineInDays: 10, openedDaysAgo: 0, openedAt: _now);
        var past = await NewCallAsync("Süresi geçmiş haber çağrısı", GrantCallStatus.Acik, deadlineInDays: -1, openedDaysAgo: 40);
        var draft = await NewCallAsync("Taslak haber çağrısı", GrantCallStatus.Taslak, deadlineInDays: 10, openedDaysAgo: 1);

        var calls = (await NewsAsync(Guid.NewGuid())).Where(n => n.Kind == MacroNewsKind.Call).ToList();

        var item = calls.Single(n => n.Url == "/Grants/Detail?id=" + open.Id);
        item.Title.ShouldBe("Açık haber çağrısı · 2026/9");
        item.Source.ShouldBe("Haber Kurumu");
        item.Summary.ShouldContain("10");
        item.IsNew.ShouldBeTrue();
        calls.ShouldNotContain(n => n.Url.EndsWith(past.Id.ToString()));
        calls.ShouldNotContain(n => n.Url.EndsWith(draft.Id.ToString()));
    }

    /// <summary>Sonuç haberi kullanıcının KENDİ karar bildirimidir; başkasınınki ve 60 günden eskisi gelmez.</summary>
    [Fact]
    public async Task Sonuc_haberi_kullanicinin_kendi_karar_bildirimidir()
    {
        var me = Guid.NewGuid();
        var appId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            await _notifications.InsertAsync(new Notification(Guid.NewGuid(), null, me,
                NotificationType.GrantDecisionIssued, "Başvurunuza karar verildi", "Kabul", entityType: "GrantApplication", entityId: appId), autoSave: true);
            await _notifications.InsertAsync(new Notification(Guid.NewGuid(), null, Guid.NewGuid(),
                NotificationType.GrantDecisionIssued, "Başkasının kararı", "Ret"), autoSave: true);
            var old = new Notification(Guid.NewGuid(), null, me, NotificationType.GrantAppealResolved, "Eski itiraz", "Sonuçlandı");
            old.LastOccurredAt = DateTime.UtcNow.AddDays(-(MacroNewsAppService.ResultLookbackDays + 5));
            await _notifications.InsertAsync(old, autoSave: true);
            await _notifications.InsertAsync(new Notification(Guid.NewGuid(), null, me,
                NotificationType.TaskAssigned, "Görev atandı", "Sonuç değil"), autoSave: true);
        });

        var results = (await NewsAsync(me)).Where(n => n.Kind == MacroNewsKind.Result).ToList();

        results.Select(r => r.Title).ShouldBe(new[] { "Başvurunuza karar verildi" });
        results[0].Url.ShouldStartWith("/");
        results[0].IsNew.ShouldBeTrue();
    }

    [Fact]
    public async Task Akis_en_yeni_ustte_ve_ust_sinira_uyar()
    {
        await NewCallAsync("Eski açılış", GrantCallStatus.Acik, deadlineInDays: 20, openedDaysAgo: 30);
        await NewCallAsync("Yeni açılış", GrantCallStatus.Acik, deadlineInDays: 20, openedDaysAgo: 0);

        var news = await NewsAsync(Guid.NewGuid());
        news.Select(n => n.Date).ShouldBe(news.Select(n => n.Date).OrderByDescending(d => d));

        (await NewsAsync(Guid.NewGuid(), max: 1)).Count.ShouldBeLessThanOrEqualTo(1);
        (await NewsAsync(Guid.NewGuid(), max: 0)).Count.ShouldBeLessThanOrEqualTo(1); // alt sınır 1
    }
}
