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
/// 1c · Firmalara gönderimin e-postası. Gönderim, firmanın her aktif kullanıcısına e-postayı
/// isteğin içinde senkron yolluyordu: host SMTP'yi kullanıcı sayısı kadar bekliyor, kullanıcının
/// hibe e-posta tercihi de sorulmuyordu.
/// </summary>
public class GrantDispatchEmail_Tests : PlatformWebTestBase
{
    private readonly IEmailSender _emails = Substitute.For<IEmailSender>();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        base.ConfigureWebHost(builder);
        builder.ConfigureServices(s => s.Replace(ServiceDescriptor.Singleton(_emails)));
    }

    private int EmailCount(string method) =>
        _emails.ReceivedCalls().Count(c => c.GetMethodInfo().Name == method);

    /// <summary>Kiracı + e-posta isteyen bir kullanıcı + hibe e-postasını kapatmış bir kullanıcı.</summary>
    private async Task<Guid> ArrangeFirmAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var currentTenant = GetRequiredService<ICurrentTenant>();
        Guid tenantId;

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await GetRequiredService<ITenantManager>().CreateAsync("Eposta-" + Guid.NewGuid().ToString("N")[..6]);
            await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;
            await uow.CompleteAsync();
        }

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            using (currentTenant.Change(tenantId))
            {
                var userRepo = GetRequiredService<IIdentityUserRepository>();
                var suffix = tenantId.ToString("N")[..6];

                // Tercih kaydı yok: hibe kategorisinde varsayılan e-posta açıktır.
                await userRepo.InsertAsync(
                    new IdentityUser(Guid.NewGuid(), "isteyen" + suffix, "isteyen@ornek.test", tenantId), autoSave: true);

                var optedOut = new IdentityUser(Guid.NewGuid(), "istemeyen" + suffix, "istemeyen@ornek.test", tenantId);
                await userRepo.InsertAsync(optedOut, autoSave: true);
                await GetRequiredService<IRepository<NotificationPreference, Guid>>().InsertAsync(
                    new NotificationPreference(Guid.NewGuid(), tenantId, optedOut.Id, NotificationCategory.Grants,
                        inApp: true, email: false), autoSave: true);
            }
            await uow.CompleteAsync();
        }

        return tenantId;
    }

    [Fact]
    public async Task Gonderim_Epostasi_Kuyruga_Alinir_Ve_Tercihi_Kapali_Kullaniciya_Gitmez()
    {
        var tenantId = await ArrangeFirmAsync();
        var service = GetRequiredService<IGrantHostDispatchAppService>();

        Guid callId;
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin())
        {
            callId = (await GetRequiredService<IRepository<GrantCall, Guid>>()
                .GetListAsync(c => c.Status == GrantCallStatus.Acik)).First().Id;
        }

        var result = await service.SendAsync(new SendHostRecommendationInput
        {
            GrantCallId = callId,
            TenantIds = { tenantId },
            SendNotification = false,
            SendEmail = true
        });

        result.SentCount.ShouldBe(1);
        result.EmailCount.ShouldBe(1, "yalnız hibe e-postası isteyen kullanıcı sayılmalı");
        EmailCount(nameof(IEmailSender.QueueAsync)).ShouldBe(1, "e-posta kuyruğa alınmalı");
        EmailCount(nameof(IEmailSender.SendAsync)).ShouldBe(0, "e-posta isteğin içinde senkron gönderilmemeli");
        await _emails.Received(1).QueueAsync("isteyen@ornek.test", Arg.Any<string>(), Arg.Any<string>(), Arg.Any<bool>());
    }
}
