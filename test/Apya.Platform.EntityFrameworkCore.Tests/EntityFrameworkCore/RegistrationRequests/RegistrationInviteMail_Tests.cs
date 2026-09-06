using System;
using System.Threading.Tasks;
using Apya.Platform.Agreements;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.RegistrationRequests.Dtos;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.RegistrationRequests;

/// <summary>
/// SÖZLEŞME: davet e-postası akışı DURDURMAZ. SMTP yapılandırılmamışsa gönderim sessizce
/// atlanır, davet geçerli kalır ve host bağlantıyı elle iletir.
///
/// <para>Test ortamında SMTP tanımlı değildir; ölçülen şey tam olarak bu yoldur — canlıda
/// posta ayarı gelene kadar da geçerli olan yol budur.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class RegistrationInviteMail_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IRegistrationRequestAppService _requests;
    private readonly IRepository<RegistrationRequest, Guid> _repository;

    public RegistrationInviteMail_Tests()
    {
        _requests = GetRequiredService<IRegistrationRequestAppService>();
        _repository = GetRequiredService<IRepository<RegistrationRequest, Guid>>();
    }

    private async Task<Guid> CreateApprovedRequestAsync()
    {
        var id = await _requests.CreateAsync(new CreateRegistrationRequestDto
        {
            RequestedPlan = SalesPlan.Standard,
            CompanyName = $"Posta Testi Derneği {Guid.NewGuid():N}",
            CompanyType = CompanyType.Association,
            TaxNumber = Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString(),
            Address = "Adres",
            FullName = "Ayşe Yılmaz",
            AuthorizedTitle = "Başkan",
            Email = $"posta-{Guid.NewGuid():N}@ornek.com",
            Phone = "05551112233"
        });

        await _requests.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Approved
        });

        return id;
    }

    /// <summary>
    /// 🔑 Gönderim İSTİSNA ATMAZ — SMTP kurulu olsun olmasın. Atsaydı host'a "davet
    /// üretilemedi" görünür ve elindeki geçerli bağlantıyı çöpe atardı.
    ///
    /// <para>Sonucun <c>true</c> mu <c>false</c> mu olduğu ORTAMA bağlıdır ve burada
    /// iddia EDİLMEZ: test host'unda sahte gönderici her zaman başarılı olur, canlıda
    /// SMTP yoksa bağlantı reddedilir. Sözleşme "patlamaz ve daveti bozmaz"dır.</para>
    /// </summary>
    [Fact]
    public async Task Gonderim_istisna_atmaz()
    {
        var id = await CreateApprovedRequestAsync();
        await _requests.IssueInviteAsync(id);

        await Should.NotThrowAsync(
            () => _requests.SendInviteMailAsync(id, "https://localhost/Account/Protokol?token=abc"));
    }

    /// <summary>
    /// Gönderim başarısız olsa da DAVET GEÇERLİ kalmalı: jeton yanmaz, durum
    /// "Protokol bekliyor"da durur ve host bağlantıyı elle iletebilir.
    /// </summary>
    [Fact]
    public async Task Gonderim_dusse_de_davet_gecerli_kalir()
    {
        var id = await CreateApprovedRequestAsync();
        var invite = await _requests.IssueInviteAsync(id);

        await _requests.SendInviteMailAsync(id, "https://localhost/Account/Protokol?token=abc");

        var stored = await _repository.GetAsync(id);

        stored.Status.ShouldBe(RegistrationRequestStatus.AwaitingProtocol);
        stored.InviteTokenHash.ShouldBe(InviteToken.Hash(invite.Token));
        stored.InviteUsedAt.ShouldBeNull();
    }
}
