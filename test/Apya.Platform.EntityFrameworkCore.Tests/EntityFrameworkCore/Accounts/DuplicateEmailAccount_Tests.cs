using System;
using System.Threading.Tasks;
using Apya.Platform.Agreements;
using Apya.Platform.Agreements.Dtos;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.RegistrationRequests.Dtos;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Accounts;

/// <summary>
/// SÖZLEŞME: aynı e-posta adresiyle ikinci bir hesap AÇILAMAZ ve kural sürecin her
/// kapısında geçerlidir.
///
/// <para>Neden dört ayrı kapı ölçülüyor: kural tek noktada dursaydı aday ancak son adımda
/// (protokolü okuyup şifresini belirledikten sonra) duvara toslardı. Kapılar sırayla —
/// form → davet → protokol onayı → kurulum — ve her biri bir öncekinin kaçırdığını yakalar.</para>
///
/// <para>Kiracı yöneticisi ABP tarafından <c>UserName = "admin"</c> ile tohumlanır; kiracılar
/// arasında hesabı ayırt eden tek alan e-postadır. Mükerrer adres, kiracısız girişte parola
/// denemesini her aday kiracıda tekrarlatır ve kullanıcı hangi hesabına düştüğünü bilemez.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DuplicateEmailAccount_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IRegistrationRequestAppService _requestAppService;
    private readonly IProtocolApprovalAppService _protocolAppService;
    private readonly ITenantProfileAppService _tenantProfileAppService;
    private readonly IRepository<RegistrationRequest, Guid> _requestRepository;
    private readonly IRepository<ServiceAgreement, Guid> _agreementRepository;

    public DuplicateEmailAccount_Tests()
    {
        _requestAppService = GetRequiredService<IRegistrationRequestAppService>();
        _protocolAppService = GetRequiredService<IProtocolApprovalAppService>();
        _tenantProfileAppService = GetRequiredService<ITenantProfileAppService>();
        _requestRepository = GetRequiredService<IRepository<RegistrationRequest, Guid>>();
        _agreementRepository = GetRequiredService<IRepository<ServiceAgreement, Guid>>();
    }

    // --- 1. Kapı: oturumsuz kayıt formu ---

    /// <summary>
    /// Aynı adresle ikinci talep gönderilemez. Panelin mükerrer kayıtla dolmasını da,
    /// sürecin sonunda ikinci hesabın açılmasını da burada kesiyoruz.
    /// </summary>
    [Fact]
    public async Task Ayni_eposta_ile_ikinci_talep_gonderilemez()
    {
        var email = UniqueEmail("form");

        await _requestAppService.CreateAsync(NewRequest(email));

        var exception = await Should.ThrowAsync<BusinessException>(
            () => _requestAppService.CreateAsync(NewRequest(email)));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.RegistrationRequestEmailAlreadyRegistered);
    }

    /// <summary>
    /// Büyük/küçük harf farkı yeni bir kimlik DEĞİLDİR — "Aday@..." ile "aday@..." aynı
    /// posta kutusudur ve kuralı atlatmamalı. Karşılaştırma bu yüzden iki kollu:
    /// düz eşitlik harf duyarsız collation'a, <c>ToUpper()</c> ise harf DUYARLI
    /// sağlayıcıya karşı çalışır.
    /// </summary>
    [Fact]
    public async Task Buyuk_kucuk_harf_farki_kurali_atlatmaz()
    {
        var email = UniqueEmail("harf");

        await _requestAppService.CreateAsync(NewRequest(email.ToUpperInvariant()));

        var exception = await Should.ThrowAsync<BusinessException>(
            () => _requestAppService.CreateAsync(NewRequest(email)));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.RegistrationRequestEmailAlreadyRegistered);
    }

    /// <summary>
    /// Reddedilen talep adresi REZERVE ETMEZ. Süreç sonuçsuz kapandıysa adayın yeniden
    /// başvurmasının önünü kesmek, kuralı cezaya çevirirdi.
    /// </summary>
    [Fact]
    public async Task Reddedilen_talep_yeniden_basvuruyu_engellemez()
    {
        var email = UniqueEmail("red");

        var firstId = await _requestAppService.CreateAsync(NewRequest(email));
        await _requestAppService.UpdateAsync(firstId, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Rejected
        });

        var secondId = await _requestAppService.CreateAsync(NewRequest(email));

        secondId.ShouldNotBe(Guid.Empty);
        secondId.ShouldNotBe(firstId);
    }

    // --- 2. Kapı: davet üretimi (host'a erken uyarı) ---

    /// <summary>
    /// Adres, talep alındıktan SONRA bir hesaba bağlanmış olabilir (host elle müşteri açtı).
    /// Bunu davet üretilirken söylemek, adayın protokolü okuyup şifresini belirledikten
    /// sonra duvara toslamasını önler — vergi numarası kontrolüyle aynı gerekçe.
    /// </summary>
    [Fact]
    public async Task Eposta_baska_hesapta_ise_davet_uretilmez()
    {
        var email = UniqueEmail("davet");

        var requestId = await _requestAppService.CreateAsync(NewRequest(email));
        await ApproveRequestAsync(requestId);

        await CreateTenantAsync(email);

        var exception = await Should.ThrowAsync<BusinessException>(
            () => _requestAppService.IssueInviteAsync(requestId));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.TenantAdminEmailAlreadyInUse);

        // Davet ÜRETİLMEMİŞ olmalı: aday hiç bağlantı almamalı.
        var stored = await _requestRepository.GetAsync(requestId);
        stored.InviteTokenHash.ShouldBeNull();
        stored.Status.ShouldBe(RegistrationRequestStatus.Approved);
    }

    // --- 3. Kapı: protokol onayı ---

    /// <summary>
    /// Davet üretildikten SONRA çakışma doğduysa onay durur — ve kritik olan şu: sözleşme
    /// YAZILMADAN durur. Kurulum kendi UoW'unda commit olduğu için kontrol yalnız orada
    /// olsaydı geriye onaylanmış bir sözleşme ve açılmamış bir hesap kalırdı.
    /// </summary>
    [Fact]
    public async Task Protokol_onayi_sozlesme_yazmadan_durur()
    {
        var email = UniqueEmail("protokol");

        var requestId = await _requestAppService.CreateAsync(NewRequest(email));
        await ApproveRequestAsync(requestId);

        // Davet, çakışma DOĞMADAN önce üretiliyor: 2. kapı burada devreye girmez.
        var invite = await _requestAppService.IssueInviteAsync(requestId);

        await CreateTenantAsync(email);

        var exception = await Should.ThrowAsync<BusinessException>(
            () => _protocolAppService.ApproveAsync(new ApproveProtocolInput
            {
                Token = invite.Token,
                AcceptAgreement = true,
                AcceptKvkk = true,
                Password = "1q2w3E*asd",
                PasswordConfirm = "1q2w3E*asd"
            }));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.TenantAdminEmailAlreadyInUse);

        // Okumalar kendi UoW'unda: onay düşerken ABP çağrıyı saran UoW'u geri alıp
        // DbContext'i kapatır, dışarıdan aynı bağlamla okumaya çalışmak ObjectDisposed verir.
        await WithUnitOfWorkAsync(async () =>
        {
            var agreement = await _agreementRepository.FirstOrDefaultAsync(a => a.RegistrationRequestId == requestId);
            agreement.ShouldBeNull();

            // Jeton yanmamalı: çakışma çözülürse aynı bağlantı yeniden kullanılabilsin.
            var stored = await _requestRepository.GetAsync(requestId);
            stored.InviteUsedAt.ShouldBeNull();
            stored.Status.ShouldBe(RegistrationRequestStatus.AwaitingProtocol);
        });
    }

    // --- 4. Kapı: kurulumun kendisi (host'un "Yeni Müşteri" modalı) ---

    /// <summary>
    /// Son savunma hattı. Host elle de olsa aynı adresle ikinci hesap açamaz; kural
    /// kurulumun tek gövdesinde durduğu için host modalı ve protokol aynı yanıtı verir.
    /// </summary>
    [Fact]
    public async Task Ayni_admin_epostasiyla_ikinci_kiraci_kurulamaz()
    {
        var email = UniqueEmail("kurulum");

        await CreateTenantAsync(email);

        var exception = await Should.ThrowAsync<BusinessException>(() => CreateTenantAsync(email));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.TenantAdminEmailAlreadyInUse);
    }

    // --- Yardımcılar ---

    private static string UniqueEmail(string prefix)
        => prefix + "-" + Guid.NewGuid().ToString("N") + "@ornek.com";

    /// <summary>Vergi numarası kiracılar arasında tekil; her çağrıda benzersiz üretilir.</summary>
    private static string UniqueTaxNumber()
        => Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString();

    private static CreateRegistrationRequestDto NewRequest(string email)
        => new()
        {
            RequestedPlan = SalesPlan.Corporate,
            CompanyName = "Mükerrer Testi Derneği " + Guid.NewGuid().ToString("N"),
            CompanyType = CompanyType.Association,
            TaxNumber = UniqueTaxNumber(),
            Address = "Merkez Mah. Atatürk Cad. No:1, İstanbul",
            FullName = "Ayşe Yılmaz",
            AuthorizedTitle = "Yönetim Kurulu Başkanı",
            Email = email,
            Phone = "05551112233"
        };

    private Task ApproveRequestAsync(Guid requestId)
        => _requestAppService.UpdateAsync(requestId, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Approved,
            OfferedAmount = 24_000m
        });

    /// <summary>Host'un "Yeni Müşteri" modalının gittiği yol.</summary>
    private Task CreateTenantAsync(string adminEmail)
        => _tenantProfileAppService.CreateTenantWithProfileAsync(new CreateTenantExtendedDto
        {
            Name = "mukerrer-" + Guid.NewGuid().ToString("N"),
            AdminEmailAddress = adminEmail,
            AdminPassword = "1q2w3E*asd",
            PackageCode = PackageCode.Basic,
            CompanyType = CompanyType.Association,
            TaxNumber = UniqueTaxNumber(),
            CorporateEmail = adminEmail,
            Address = "Merkez Mah. Atatürk Cad. No:1, İstanbul"
        });
}
