using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Hibe YAZMA uçları düzenleme izni ister (ürün kararı, 2026-10-13): host'ta
/// <c>Grants.Edit</c>, firmada <c>Grants.ManageApplications</c>. Eskiden hepsi görüntüleme
/// iznine düşüyordu.
///
/// <para>Barındırıcı iki yazma iznini reddedecek, görüntüleme iznini verecek şekilde kurulur.
/// Ölçülen: izin denetimi kayıt aranmadan ÖNCE çalışır (var olmayan kimlikle bile yetki hatası).</para>
/// </summary>
public class GrantWritePermission_Tests : PlatformWebTestBase
{
    private static readonly Guid FirmTenant = Guid.Parse("99990000-cccc-4000-8000-000000000091");

    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var deny = new DenyPermissionsAuthorizationService(
            PlatformPermissions.Grants.Edit,
            PlatformPermissions.Grants.ManageApplications);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    [Fact]
    public async Task Host_duzenleme_izni_olmadan_karar_itiraz_ve_belge_onayi_yazamaz()
    {
        var appeal = GetRequiredService<IGrantAppealAppService>();
        var documents = GetRequiredService<IGrantApplicationDocumentAppService>();
        var wizard = GetRequiredService<IGrantApplicationWizardAppService>();
        var id = Guid.NewGuid();

        GetRequiredService<ICurrentTenant>().Id.ShouldBeNull("test host bağlamında koşmalı");

        await Should.ThrowAsync<AbpAuthorizationException>(() => appeal.SaveDecisionAsync(
            new SaveGrantDecisionInput { ApplicationId = id, DecidedOn = DateTime.Today }));
        await Should.ThrowAsync<AbpAuthorizationException>(() => appeal.ResolveAppealAsync(id, accepted: false));
        await Should.ThrowAsync<AbpAuthorizationException>(() => appeal.AcceptAppealAsync(
            new AcceptGrantAppealInput { ApplicationId = id }));
        await Should.ThrowAsync<AbpAuthorizationException>(() => documents.ApproveAsync(
            new ReviewGrantDocumentInput()));
        await Should.ThrowAsync<AbpAuthorizationException>(() => wizard.SubmitAsync(id));
        await Should.ThrowAsync<AbpAuthorizationException>(() => wizard.SaveSummaryAsync(
            new SaveWizardSummaryInput { ApplicationId = id }));
        await Should.ThrowAsync<AbpAuthorizationException>(() => wizard.AddTargetAsync(
            new SaveWizardTargetInput { ApplicationId = id, Name = "Hedef", TargetValue = 1m }));
        await Should.ThrowAsync<AbpAuthorizationException>(() => wizard.DeleteTargetAsync(id, Guid.NewGuid()));
    }

    [Fact]
    public async Task Firma_basvuru_yonetme_izni_olmadan_ilgiyi_cekemez_profil_ve_basvuru_yazamaz()
    {
        var interests = GetRequiredService<IGrantInterestAppService>();
        var profile = GetRequiredService<IFirmProfileAppService>();
        var wizard = GetRequiredService<IGrantApplicationWizardAppService>();
        var id = Guid.NewGuid();

        using (GetRequiredService<ICurrentTenant>().Change(FirmTenant))
        {
            await Should.ThrowAsync<AbpAuthorizationException>(() => interests.WithdrawAsync(id));
            await Should.ThrowAsync<AbpAuthorizationException>(() => profile.UpdateMyProfileAsync(new UpdateFirmProfileDto()));
            await Should.ThrowAsync<AbpAuthorizationException>(() => wizard.SubmitAsync(id));
            await Should.ThrowAsync<AbpAuthorizationException>(() => wizard.AddTargetAsync(
                new SaveWizardTargetInput { ApplicationId = id, Name = "Hedef", TargetValue = 1m }));
            await Should.ThrowAsync<AbpAuthorizationException>(() => wizard.DeleteTargetAsync(id, Guid.NewGuid()));

            // Karşı yön: görüntüleme yazma iznine bağlı değil.
            (await interests.GetMineAsync()).ShouldBeEmpty();
        }
    }

    [Fact]
    public void Kapi_hosta_duzenleme_firmaya_basvuru_yonetme_iznini_sorar()
    {
        var tenant = GetRequiredService<ICurrentTenant>();

        GrantWritePermission.For(tenant).ShouldBe(PlatformPermissions.Grants.Edit);
        using (tenant.Change(FirmTenant))
        {
            GrantWritePermission.For(tenant).ShouldBe(PlatformPermissions.Grants.ManageApplications);
        }
    }
}
