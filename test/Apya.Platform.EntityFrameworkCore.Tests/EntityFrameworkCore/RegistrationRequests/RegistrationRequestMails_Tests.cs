using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.RegistrationRequests.Dtos;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.RegistrationRequests;

/// <summary>
/// K-02 · Talep alındı ve ret postaları akışı durdurmaz (davet postasıyla aynı sözleşme); ret postası
/// gerekçe içermez (kullanıcı kararı); host rozeti "Yeni" talepleri sayar.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class RegistrationRequestMails_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IRegistrationRequestAppService _requests;

    public RegistrationRequestMails_Tests()
    {
        _requests = GetRequiredService<IRegistrationRequestAppService>();
    }

    private Task<Guid> CreateAsync() => _requests.CreateAsync(new CreateRegistrationRequestDto
    {
        RequestedPlan = SalesPlan.Standard,
        CompanyName = $"Referans Derneği {Guid.NewGuid():N}",
        CompanyType = CompanyType.Association,
        TaxNumber = Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString(),
        Address = "Adres",
        FullName = "Ayşe Yılmaz",
        AuthorizedTitle = "Başkan",
        Email = $"referans-{Guid.NewGuid():N}@ornek.com",
        Phone = "05551112233"
    });

    [Fact]
    public async Task Talep_kaydedilir_ve_referansi_vardir()
    {
        var id = await CreateAsync();

        var dto = await _requests.GetAsync(id);
        dto.Reference.ShouldBe("KT-" + id.ToString("N")[..8].ToUpperInvariant());
    }

    [Fact]
    public async Task Ret_postasi_akisi_durdurmaz_ve_gerekce_icermez()
    {
        var id = await CreateAsync();

        await Should.NotThrowAsync(() => _requests.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Rejected,
            AdminNote = "İÇ NOT: vergi borcu var"
        }));

        var request = await WithUnitOfWorkAsync(() => GetRequiredService<IRepository<RegistrationRequest, Guid>>().GetAsync(id));
        request.Status.ShouldBe(RegistrationRequestStatus.Rejected);
        var body = RegistrationRequestMailer.BuildRejectedBody(request);
        body.ShouldContain(RegistrationRequestReference.Of(id));
        body.ShouldNotContain("vergi borcu");
        body.ShouldNotContain("gün içinde");
    }

    /// <summary>N-05 · Yeni talep yalnız Kayıt Talepleri yetkisi olan host kullanıcısının ziline düşer.</summary>
    [Fact]
    public async Task Yeni_talep_yetkili_host_kullanicisina_bildirilir()
    {
        var (allowed, other) = await WithUnitOfWorkAsync(async () =>
        {
            var users = GetRequiredService<IdentityUserManager>();
            var a = new IdentityUser(Guid.NewGuid(), "satis-" + Guid.NewGuid().ToString("N")[..6], Guid.NewGuid().ToString("N")[..8] + "@ornek.test");
            var o = new IdentityUser(Guid.NewGuid(), "destek-" + Guid.NewGuid().ToString("N")[..6], Guid.NewGuid().ToString("N")[..8] + "@ornek.test");
            (await users.CreateAsync(a)).Succeeded.ShouldBeTrue();
            (await users.CreateAsync(o)).Succeeded.ShouldBeTrue();
            await GetRequiredService<IPermissionGrantRepository>().InsertAsync(new PermissionGrant(
                Guid.NewGuid(), PlatformPermissions.RegistrationRequests.Default,
                UserPermissionValueProvider.ProviderName, a.Id.ToString()), autoSave: true);
            return (a.Id, o.Id);
        });

        var id = await CreateAsync();

        var rows = await WithUnitOfWorkAsync(() => GetRequiredService<IRepository<Notification, Guid>>()
            .GetListAsync(n => n.EntityId == id && n.Type == NotificationType.RegistrationRequestReceived));
        rows.ShouldContain(n => n.UserId == allowed);
        rows.ShouldNotContain(n => n.UserId == other);
        rows.All(n => n.TenantId == null).ShouldBeTrue("talep host kaydıdır");
        rows.First(n => n.UserId == allowed).Body.ShouldContain(RegistrationRequestReference.Of(id));
    }
}
