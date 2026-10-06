using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NSubstitute;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Emailing;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Kurum kararı girişi (denetim H-02) ve kararın e-postası (H-08).
///
/// <para>Karar ZORUNLU ve KRİTİK bir bildirimdir. Kritik bildirimin e-postasını
/// <c>NotificationManager</c> zaten kuyruğa alıyordu; hibe dağıtıcısı şablonun e-posta
/// ayarını görüp ikinci bir e-postayı üstelik isteğin içinde senkron gönderiyordu — firma
/// her kararı iki kez alıyordu. Karar ekranı olmadığı için bu hiç görünmemişti.</para>
/// </summary>
public class GrantDecisionEntry_Tests : PlatformWebTestBase
{
    private readonly IEmailSender _emails = Substitute.For<IEmailSender>();
    private readonly IGrantAppealAppService _appeal;
    private readonly ICurrentTenant _currentTenant;

    public GrantDecisionEntry_Tests()
    {
        _appeal = GetRequiredService<IGrantAppealAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        base.ConfigureWebHost(builder);
        builder.ConfigureServices(s => s.Replace(ServiceDescriptor.Singleton(_emails)));
    }

    private int EmailCount(string method) =>
        _emails.ReceivedCalls().Count(c => c.GetMethodInfo().Name == method);

    /// <summary>Kiracı + e-posta tercihini açmış tek kullanıcı + o kiracının bir başvurusu.</summary>
    private async Task<(Guid TenantId, Guid UserId, Guid ApplicationId)> ArrangeAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        Guid tenantId, userId, applicationId;

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await GetRequiredService<ITenantManager>().CreateAsync("Karar-" + Guid.NewGuid().ToString("N")[..6]);
            await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;
            await uow.CompleteAsync();
        }

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            using (_currentTenant.Change(tenantId))
            {
                var user = new IdentityUser(Guid.NewGuid(), "firma" + tenantId.ToString("N")[..6], "firma@ornek.test", tenantId);
                await GetRequiredService<IIdentityUserRepository>().InsertAsync(user, autoSave: true);
                userId = user.Id;

                await GetRequiredService<IRepository<NotificationPreference, Guid>>().InsertAsync(
                    new NotificationPreference(Guid.NewGuid(), tenantId, userId, NotificationCategory.Grants,
                        inApp: true, email: true), autoSave: true);
            }

            var call = (await GetRequiredService<IRepository<GrantCall, Guid>>()
                .GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();
            var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
            await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(application, autoSave: true);
            applicationId = application.Id;

            await uow.CompleteAsync();
        }

        return (tenantId, userId, applicationId);
    }

    private Task<GrantAppealConsoleDto> SaveAsync(Guid applicationId, GrantDecisionOutcome outcome, string? reference = null)
        => _appeal.SaveDecisionAsync(new SaveGrantDecisionInput
        {
            ApplicationId = applicationId,
            Outcome = outcome,
            DecidedOn = DateTime.Today,
            ReferenceNo = reference,
            AppealDeadline = outcome == GrantDecisionOutcome.Reddedildi ? DateTime.Today.AddDays(15) : null
        });

    [Fact]
    public async Task Karar_Girilince_Firma_Tek_Eposta_Alir_Ve_Istek_Beklemez()
    {
        var (_, _, applicationId) = await ArrangeAsync();

        await SaveAsync(applicationId, GrantDecisionOutcome.Reddedildi);

        EmailCount(nameof(IEmailSender.QueueAsync)).ShouldBe(1, "kritik bildirimin e-postası bir kez kuyruğa alınmalı");
        EmailCount(nameof(IEmailSender.SendAsync)).ShouldBe(0, "e-posta isteğin içinde senkron gönderilmemeli");
    }

    [Fact]
    public async Task Sonucu_Degistirmeyen_Duzeltme_Firmaya_Yeniden_Bildirilmez()
    {
        var (_, _, applicationId) = await ArrangeAsync();
        await SaveAsync(applicationId, GrantDecisionOutcome.Reddedildi);

        // Karar no'daki yazım hatası düzeltiliyor: firma aynı kararı ikinci kez almamalı.
        var dto = await SaveAsync(applicationId, GrantDecisionOutcome.Reddedildi, reference: "2026/417");

        dto.ReferenceNo.ShouldBe("2026/417");
        EmailCount(nameof(IEmailSender.QueueAsync)).ShouldBe(1);
    }

    [Fact]
    public async Task Sonuc_Degisirse_Firma_Yeniden_Bilgilendirilir()
    {
        var (tenantId, userId, applicationId) = await ArrangeAsync();
        await SaveAsync(applicationId, GrantDecisionOutcome.Reddedildi);

        await SaveAsync(applicationId, GrantDecisionOutcome.KismiOnay);

        EmailCount(nameof(IEmailSender.QueueAsync)).ShouldBe(2);
        using (_currentTenant.Change(tenantId))
        {
            var decisions = await GetRequiredService<IRepository<Notification, Guid>>()
                .GetListAsync(n => n.UserId == userId && n.Type == NotificationType.GrantDecisionIssued);
            decisions.Count.ShouldBe(2);
            decisions.OrderByDescending(n => n.CreationTime).First().Body.ShouldContain("Kısmi onay");
        }
    }

    private async Task<GrantApplicationStage> StageOfAsync(Guid applicationId)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        var mtFilter = GetRequiredService<Volo.Abp.Data.IDataFilter<IMultiTenant>>();
        using (mtFilter.Disable())
        {
            return (await GetRequiredService<IRepository<GrantApplication, Guid>>()
                .GetAsync(applicationId)).Stage;
        }
    }

    /// <summary>
    /// 🔴 DOM-01: Karar kaydı aşamayı ilerletmiyordu — kurum onayı girilse bile huninin
    /// onay sayacı 0 kalıyor, firma "Başvurularım"da satırın kapandığını görmüyordu.
    /// </summary>
    [Theory]
    [InlineData(GrantDecisionOutcome.Onaylandi)]
    [InlineData(GrantDecisionOutcome.KismiOnay)]
    public async Task Onay_Karari_Asamayi_Onaya_Ilerletir(GrantDecisionOutcome outcome)
    {
        var (_, _, applicationId) = await ArrangeAsync();
        (await StageOfAsync(applicationId)).ShouldBe(GrantApplicationStage.Basvuru);

        await SaveAsync(applicationId, outcome);

        (await StageOfAsync(applicationId)).ShouldBe(GrantApplicationStage.Onay);
    }

    /// <summary>
    /// RET aşamaya DOKUNMAZ: enum'da "reddedildi" değeri yok ve uydurmak enum'u okuyan
    /// her yeri (huni, pano, rozetler, JS sözlüğü) sessizce bozardı. Ret kararın
    /// kendisinde duruyor, ekranlar oradan okuyor.
    /// </summary>
    [Fact]
    public async Task Ret_Karari_Asamayi_Degistirmez()
    {
        var (_, _, applicationId) = await ArrangeAsync();

        await SaveAsync(applicationId, GrantDecisionOutcome.Reddedildi);

        (await StageOfAsync(applicationId)).ShouldBe(GrantApplicationStage.Basvuru);
    }

    /// <summary>
    /// Yalnız İLERİ taşır: dilimi ödenmiş (Ödeme aşamasındaki) başvuru, karar numarası
    /// düzeltildi diye Onay'a geri çekilmemeli.
    /// </summary>
    [Fact]
    public async Task Karar_Duzeltmesi_Ileri_Asamayi_Geri_Cekmez()
    {
        var (_, _, applicationId) = await ArrangeAsync();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var mtFilter = GetRequiredService<Volo.Abp.Data.IDataFilter<IMultiTenant>>();
        using (var uow = uowManager.Begin(requiresNew: true))
        using (mtFilter.Disable())
        {
            var repo = GetRequiredService<IRepository<GrantApplication, Guid>>();
            var app = await repo.GetAsync(applicationId);
            app.AdvanceStage(GrantApplicationStage.Odeme);
            await repo.UpdateAsync(app, autoSave: true);
            await uow.CompleteAsync();
        }

        await SaveAsync(applicationId, GrantDecisionOutcome.Onaylandi, reference: "TYD-2026-1184");

        (await StageOfAsync(applicationId)).ShouldBe(GrantApplicationStage.Odeme);
    }

    // ── LIF-11 · İtirazın sonucu firmaya bildirilir ──────────────────────────

    /// <summary>Red kararı girilmiş ve itirazı GÖNDERİLMİŞ başvuru.</summary>
    private async Task<(Guid TenantId, Guid UserId, Guid ApplicationId)> ArrangeSubmittedAppealAsync()
    {
        var arranged = await ArrangeAsync();
        await SaveAsync(arranged.ApplicationId, GrantDecisionOutcome.Reddedildi);

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        using (GetRequiredService<Volo.Abp.Data.IDataFilter<IMultiTenant>>().Disable())
        {
            var decisions = GetRequiredService<IRepository<GrantDecision, Guid>>();
            var decision = (await decisions.GetListAsync(d => d.GrantApplicationId == arranged.ApplicationId)).Single();
            decision.SubmitAppeal(DateTime.Now);
            await decisions.UpdateAsync(decision, autoSave: true);
            await uow.CompleteAsync();
        }

        return arranged;
    }

    private async Task<List<Notification>> AppealResultsAsync(Guid tenantId, Guid userId)
    {
        using (_currentTenant.Change(tenantId))
        {
            return (await GetRequiredService<IRepository<Notification, Guid>>()
                    .GetListAsync(n => n.UserId == userId && n.Type == NotificationType.GrantAppealResolved))
                .OrderBy(n => n.CreationTime).ToList();
        }
    }

    /// <summary>
    /// Karar bildiriliyordu, itirazın SONUCU bildirilmiyordu: firma itirazını gönderdikten sonra
    /// ne olduğunu ancak ekranı açıp bakarsa öğreniyordu.
    /// </summary>
    [Theory]
    [InlineData(true, "kabul edildi")]
    [InlineData(false, "reddedildi")]
    public async Task Itiraz_Sonuclaninca_Firma_Bilgilendirilir(bool accepted, string expectedPhrase)
    {
        var (tenantId, userId, applicationId) = await ArrangeSubmittedAppealAsync();

        await _appeal.ResolveAppealAsync(applicationId, accepted);

        var row = (await AppealResultsAsync(tenantId, userId)).ShouldHaveSingleItem();
        row.Body.ShouldContain(expectedPhrase, Case.Sensitive);
        row.Body.ShouldNotContain("{", Case.Sensitive, "doldurulmamış değişken kalmamalı");
        row.Body.ShouldNotContain("Grants:Notify", Case.Sensitive, "ham anahtar değil, çevrilmiş metin");
        // Bildirim itiraz ekranına götürür.
        row.EntityId.ShouldBe(applicationId);
    }

    [Fact]
    public async Task Ayni_Itiraz_Sonucu_Yeniden_Kaydedilirse_Yeniden_Bildirilmez()
    {
        var (tenantId, userId, applicationId) = await ArrangeSubmittedAppealAsync();

        await _appeal.ResolveAppealAsync(applicationId, accepted: true);
        await _appeal.ResolveAppealAsync(applicationId, accepted: true);

        (await AppealResultsAsync(tenantId, userId)).Count.ShouldBe(1);
    }

    [Fact]
    public async Task Itiraz_Sonucu_Degisirse_Firma_Yeniden_Bilgilendirilir()
    {
        var (tenantId, userId, applicationId) = await ArrangeSubmittedAppealAsync();

        await _appeal.ResolveAppealAsync(applicationId, accepted: true);
        await _appeal.ResolveAppealAsync(applicationId, accepted: false);

        var rows = await AppealResultsAsync(tenantId, userId);
        rows.Count.ShouldBe(2);
        rows.Last().Body.ShouldContain("reddedildi", Case.Sensitive);
    }
}
