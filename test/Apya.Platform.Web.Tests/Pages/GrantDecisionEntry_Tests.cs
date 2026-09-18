using System;
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
}
