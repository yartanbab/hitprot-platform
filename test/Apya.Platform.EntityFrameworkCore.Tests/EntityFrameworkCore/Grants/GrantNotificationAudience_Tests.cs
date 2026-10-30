using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Rol bazlı bildirim metni: aynı tetikleyici her alıcı rolüne ayrı şablonla gidebilir. Rolüne uyan
/// şablon yoksa alıcı Genel şablonu alır; Genel şablon silinemez, ulaşmadığı role şablon çoğaltılamaz.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantNotificationAudience_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const GrantNotificationTrigger Trigger = GrantNotificationTrigger.ApplicationStageChanged;

    private readonly ICurrentTenant _currentTenant;
    private readonly IGrantNotificationTemplateAppService _service;

    public GrantNotificationAudience_Tests()
    {
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _service = GetRequiredService<IGrantNotificationTemplateAppService>();
    }

    private static GrantNotificationTemplateDto General(GrantNotificationConsoleDto dto, GrantNotificationTrigger trigger)
        => dto.Templates.Single(t => t.Trigger == trigger && t.Audience == GrantNotificationAudience.Genel && !t.IsEscalation);

    // ------------------------------------------------------------ gönderim

    /// <summary>
    /// Kiracıda biri yönetici rolünde iki kullanıcı. <paramref name="renamed"/>: rol "admin" adını taşımaz,
    /// yöneticiliği rol izinlerini yönetebilmesinden anlaşılır ("Hesabına Gir" ile aynı tanım).
    /// </summary>
    private async Task<(Guid Tenant, Guid Admin, Guid Member)> ArrangeTenantAsync(bool renamed = false)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("rol-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        using (_currentTenant.Change(tenant.Id))
        {
            var roleName = renamed ? "Yönetim" : GrantNotificationDispatcher.AdminRoleName;
            (await GetRequiredService<IdentityRoleManager>()
                .CreateAsync(new IdentityRole(Guid.NewGuid(), roleName, tenant.Id)))
                .Succeeded.ShouldBeTrue();
            if (renamed)
            {
                await GetRequiredService<IPermissionGrantRepository>().InsertAsync(new PermissionGrant(
                    Guid.NewGuid(), ImpersonationTargetFinder.AdminPermissionName, RolePermissionValueProvider.ProviderName,
                    roleName, tenant.Id), autoSave: true);
            }

            var users = GetRequiredService<IdentityUserManager>();
            var admin = new IdentityUser(Guid.NewGuid(), "yonetici-" + Guid.NewGuid().ToString("N")[..6], Guid.NewGuid().ToString("N")[..8] + "@ornek.test", tenant.Id);
            var member = new IdentityUser(Guid.NewGuid(), "uye-" + Guid.NewGuid().ToString("N")[..6], Guid.NewGuid().ToString("N")[..8] + "@ornek.test", tenant.Id);
            (await users.CreateAsync(admin)).Succeeded.ShouldBeTrue();
            (await users.CreateAsync(member)).Succeeded.ShouldBeTrue();
            (await users.AddToRoleAsync(admin, roleName)).Succeeded.ShouldBeTrue();

            return (tenant.Id, admin.Id, member.Id);
        }
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Yonetici_rol_sablonunu_digerleri_Genel_sablonu_alir(bool renamed)
    {
        var (tenant, admin, member) = await WithUnitOfWorkAsync(() => ArrangeTenantAsync(renamed));

        var console = await WithUnitOfWorkAsync(() => _service.GetAsync());
        var general = General(console, Trigger);
        console = await WithUnitOfWorkAsync(() => _service.DuplicateAsync(new DuplicateGrantNotificationTemplateInput
        {
            Id = general.Id,
            Audience = GrantNotificationAudience.FirmaYoneticisi
        }));
        var role = console.Templates.Single(t => t.Trigger == Trigger && t.Audience == GrantNotificationAudience.FirmaYoneticisi);
        await WithUnitOfWorkAsync(() => _service.SaveAsync(new SaveGrantNotificationTemplateInput
        {
            Id = role.Id,
            Subject = "Yönetici özeti: {çağrı_adı}",
            Body = role.Body,
            InApp = true,
            Email = role.Email,
            IsEnabled = true
        }));

        var entityId = Guid.NewGuid();
        await WithUnitOfWorkAsync(() => GetRequiredService<GrantNotificationDispatcher>().DispatchToTenantAsync(
            Trigger, tenant,
            new Dictionary<string, string?> { ["{çağrı_adı}"] = "Rol Programı", ["{aşama}"] = "Değerlendirme" },
            "GrantApplication", entityId));

        var rows = await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenant))
            {
                return await GetRequiredService<IRepository<Notification, Guid>>().GetListAsync(n => n.EntityId == entityId);
            }
        });

        rows.Single(n => n.UserId == admin).Title.ShouldBe("Yönetici özeti: Rol Programı");
        rows.Single(n => n.UserId == member).Title.ShouldNotStartWith("Yönetici özeti", Case.Sensitive);
    }

    // ------------------------------------------------------------ çoğalt / sil

    [Fact]
    public async Task Cogaltilan_rol_artik_secenek_olarak_sunulmaz()
    {
        var console = await WithUnitOfWorkAsync(() => _service.GetAsync());
        var general = General(console, GrantNotificationTrigger.DocumentApproved);
        general.DuplicableAudiences.ShouldBe(
            new[] { GrantNotificationAudience.FirmaKullanicisi, GrantNotificationAudience.FirmaYoneticisi },
            ignoreOrder: false, "evrak onayı yalnız firmaya gider");

        console = await WithUnitOfWorkAsync(() => _service.DuplicateAsync(new DuplicateGrantNotificationTemplateInput
        {
            Id = general.Id,
            Audience = GrantNotificationAudience.FirmaKullanicisi
        }));

        var copy = console.Templates.Single(t =>
            t.Trigger == GrantNotificationTrigger.DocumentApproved && t.Audience == GrantNotificationAudience.FirmaKullanicisi);
        copy.Subject.ShouldBe(general.Subject);
        General(console, GrantNotificationTrigger.DocumentApproved).DuplicableAudiences
            .ShouldBe(new[] { GrantNotificationAudience.FirmaYoneticisi });

        await Should.ThrowAsync<BusinessException>(() => WithUnitOfWorkAsync(() => _service.DuplicateAsync(
            new DuplicateGrantNotificationTemplateInput { Id = general.Id, Audience = GrantNotificationAudience.FirmaKullanicisi })));
    }

    [Fact]
    public async Task Ulasmadigi_role_cogaltilamaz()
    {
        var general = General(await WithUnitOfWorkAsync(() => _service.GetAsync()), GrantNotificationTrigger.InterestReceived);

        var ex = await Should.ThrowAsync<BusinessException>(() => WithUnitOfWorkAsync(() => _service.DuplicateAsync(
            new DuplicateGrantNotificationTemplateInput { Id = general.Id, Audience = GrantNotificationAudience.FirmaYoneticisi })));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantNotificationTemplateAudienceNotReached, "ilgi talebi yalnız danışmana gider");
    }

    [Fact]
    public async Task Genel_sablon_silinemez_rol_sablonu_silinir()
    {
        var general = General(await WithUnitOfWorkAsync(() => _service.GetAsync()), GrantNotificationTrigger.MessageReceived);

        var ex = await Should.ThrowAsync<BusinessException>(() => WithUnitOfWorkAsync(() => _service.DeleteAsync(general.Id)));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantNotificationTemplateGeneralNotDeletable);

        var console = await WithUnitOfWorkAsync(() => _service.DuplicateAsync(new DuplicateGrantNotificationTemplateInput
        {
            Id = general.Id,
            Audience = GrantNotificationAudience.Danisman
        }));
        var role = console.Templates.Single(t =>
            t.Trigger == GrantNotificationTrigger.MessageReceived && t.Audience == GrantNotificationAudience.Danisman);

        console = await WithUnitOfWorkAsync(() => _service.DeleteAsync(role.Id));

        console.Templates.ShouldNotContain(t => t.Id == role.Id);
        General(console, GrantNotificationTrigger.MessageReceived).DuplicableAudiences
            .ShouldContain(GrantNotificationAudience.Danisman, "silinen rol yeniden çoğaltılabilir");
    }
}
