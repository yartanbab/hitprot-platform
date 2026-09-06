using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Agreements;
using Apya.Platform.Agreements.Dtos;
using Apya.Platform.Consents;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.RegistrationRequests.Dtos;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Validation;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Agreements;

/// <summary>
/// SÖZLEŞME: davet bağlantısı yalnız onaylanmış talep için üretilir, jeton veritabanında
/// ham hâlde durmaz, protokol onayı hukuki delili eksiksiz yazar ve hesabı açar.
///
/// <para>Yetkilendirme burada ölçülmez (<c>AddAlwaysAllowAuthorization</c>); ölçülen şey
/// akışın kendisi ve delilin bütünlüğüdür.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProtocolApproval_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IRegistrationRequestAppService _requestAppService;
    private readonly IProtocolApprovalAppService _protocolAppService;
    private readonly IRepository<RegistrationRequest, Guid> _requestRepository;
    private readonly IRepository<ServiceAgreement, Guid> _agreementRepository;
    private readonly IRepository<ConsentRecord, Guid> _consentRepository;

    public ProtocolApproval_Tests()
    {
        _requestAppService = GetRequiredService<IRegistrationRequestAppService>();
        _protocolAppService = GetRequiredService<IProtocolApprovalAppService>();
        _requestRepository = GetRequiredService<IRepository<RegistrationRequest, Guid>>();
        _agreementRepository = GetRequiredService<IRepository<ServiceAgreement, Guid>>();
        _consentRepository = GetRequiredService<IRepository<ConsentRecord, Guid>>();
    }

    /// <summary>
    /// Onaylanmış, davete hazır bir talep üretir.
    /// <para>
    /// Vergi numarası HER ÇAĞRIDA benzersiz: <c>TenantProfileManager</c> vergi numarasını
    /// kiracılar arasında tekil sayar, sabit bir numara ikinci hesabın açılışını düşürürdü.
    /// (Aynı unvanlı iki kurumun gerçekte de vergi numarası farklıdır.)
    /// </para>
    /// </summary>
    private async Task<Guid> CreateApprovedRequestAsync(
        string? companyName = null,
        SalesPlan plan = SalesPlan.Corporate,
        string? taxNumber = null)
    {
        var id = await _requestAppService.CreateAsync(new CreateRegistrationRequestDto
        {
            RequestedPlan = plan,
            CompanyName = companyName ?? $"Protokol Testi Derneği {Guid.NewGuid():N}",
            CompanyType = CompanyType.Association,
            TaxNumber = taxNumber ?? Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString(),
            TaxOffice = "Halkalı",
            Address = "Merkez Mah. Atatürk Cad. No:1, İstanbul",
            FullName = "Ayşe Yılmaz",
            AuthorizedTitle = "Yönetim Kurulu Başkanı",
            Email = $"protokol-{Guid.NewGuid():N}@ornek.com",
            Phone = "05551112233"
        });

        await _requestAppService.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Approved,
            OfferedAmount = 24_000m
        });

        return id;
    }

    // --- Davet üretimi ---

    [Fact]
    public async Task Davet_yalniz_onaylanmis_talep_icin_uretilir()
    {
        var id = await _requestAppService.CreateAsync(new CreateRegistrationRequestDto
        {
            RequestedPlan = SalesPlan.Standard,
            CompanyName = "Onaysız Kurum",
            CompanyType = CompanyType.Company,
            TaxNumber = "1112223334",
            Address = "Adres",
            FullName = "Ali Veli",
            AuthorizedTitle = "Müdür",
            Email = $"onaysiz-{Guid.NewGuid():N}@ornek.com",
            Phone = "05551112233"
        });

        var exception = await Should.ThrowAsync<BusinessException>(() => _requestAppService.IssueInviteAsync(id));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.RegistrationRequestNotApproved);
    }

    /// <summary>
    /// 🔐 Ham jeton veritabanına YAZILMAZ. Bu test sızdıran bir gerilemeyi yakalar:
    /// jeton kolonda dursaydı veritabanı erişimi olan herkes her hesabı açabilirdi.
    /// </summary>
    [Fact]
    public async Task Ham_jeton_veritabaninda_saklanmaz()
    {
        var id = await CreateApprovedRequestAsync();

        var invite = await _requestAppService.IssueInviteAsync(id);

        invite.Token.ShouldNotBeNullOrWhiteSpace();

        var stored = await _requestRepository.GetAsync(id);

        stored.InviteTokenHash.ShouldNotBeNullOrWhiteSpace();
        stored.InviteTokenHash.ShouldNotBe(invite.Token);
        stored.InviteTokenHash.ShouldBe(InviteToken.Hash(invite.Token));
        stored.Status.ShouldBe(RegistrationRequestStatus.AwaitingProtocol);
        stored.InviteUsedAt.ShouldBeNull();
    }

    /// <summary>
    /// Vergi numarası çakışması EN GEÇ davet üretiminde yakalanmalı.
    /// <para>
    /// Kural <c>TenantProfileManager</c>'da ve hesap açılışında zaten uygulanıyor; ama orada
    /// patlarsa aday protokolü okumuş, şifresini belirlemiş ve onaylamış olur — sonra hesap
    /// açılmaz. Host'a bağlantıyı göndermeden önce söylemek, kaydı düzeltme şansı verir.
    /// </para>
    /// </summary>
    [Fact]
    public async Task Vergi_numarasi_baska_musteride_ise_davet_uretilmez()
    {
        var takenTaxNumber = Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString();

        // Önce bir hesap aç: vergi numarası artık bir kiracıya bağlı.
        var firstId = await CreateApprovedRequestAsync(companyName: "Vergi Çakışması A", taxNumber: takenTaxNumber);
        var firstInvite = await _requestAppService.IssueInviteAsync(firstId);
        await ApproveAsync(firstInvite.Token);

        // Aynı vergi numarasıyla ikinci bir talep onaylansın.
        var secondId = await CreateApprovedRequestAsync(companyName: "Vergi Çakışması B", taxNumber: takenTaxNumber);

        var exception = await Should.ThrowAsync<BusinessException>(
            () => _requestAppService.IssueInviteAsync(secondId));

        exception.Code.ShouldBe("Platform:Error:TaxNumberAlreadyExists");

        // Davet ÜRETİLMEMİŞ olmalı.
        var stored = await _requestRepository.GetAsync(secondId);
        stored.InviteTokenHash.ShouldBeNull();
        stored.Status.ShouldBe(RegistrationRequestStatus.Approved);
    }

    /// <summary>Yeni davet eskisini geçersizleştirmeli — kaybolan bağlantı yeniden üretilebiliyor.</summary>
    [Fact]
    public async Task Yeni_davet_eskisini_gecersiz_kilar()
    {
        var id = await CreateApprovedRequestAsync();

        var first = await _requestAppService.IssueInviteAsync(id);
        var second = await _requestAppService.IssueInviteAsync(id);

        first.Token.ShouldNotBe(second.Token);

        // Eskisi artık çözülmemeli.
        var exception = await Should.ThrowAsync<BusinessException>(
            () => _protocolAppService.GetByTokenAsync(first.Token));
        exception.Code.ShouldBe(PlatformDomainErrorCodes.AgreementInviteInvalid);

        // Yenisi çalışmalı.
        (await _protocolAppService.GetByTokenAsync(second.Token)).RegistrationRequestId.ShouldBe(id);
    }

    // --- Jeton doğrulama ---

    [Fact]
    public async Task Gecersiz_jeton_reddedilir()
    {
        var exception = await Should.ThrowAsync<BusinessException>(
            () => _protocolAppService.GetByTokenAsync("boyle-bir-jeton-yok"));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.AgreementInviteInvalid);
    }

    /// <summary>
    /// Süresi dolmuş davet AYRI hata kodu döndürmeli: "geçersiz" ile "süresi doldu"
    /// farklı çözümler gerektirir ve adaya farklı şey söylenir.
    /// </summary>
    [Fact]
    public async Task Suresi_dolmus_davet_ayri_hata_verir()
    {
        var id = await CreateApprovedRequestAsync();
        var token = InviteToken.Generate();

        var request = await _requestRepository.GetAsync(id);
        request.IssueInvite(InviteToken.Hash(token), DateTime.Now.AddDays(-40), DateTime.Now.AddDays(-10));
        await _requestRepository.UpdateAsync(request, autoSave: true);

        var exception = await Should.ThrowAsync<BusinessException>(
            () => _protocolAppService.GetByTokenAsync(token));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.AgreementInviteExpired);
    }

    /// <summary>
    /// Önizleme belgesinde onay bloğu BOŞ olmalı: aday henüz onaylamadı, uydurulmuş bir
    /// zaman damgası göstermek ona imzalayacağından farklı bir belge okutmak olurdu.
    /// </summary>
    [Fact]
    public async Task Onizleme_belgesinde_onay_blogu_bos_gelir()
    {
        var id = await CreateApprovedRequestAsync(companyName: "Önizleme Derneği");
        var invite = await _requestAppService.IssueInviteAsync(id);

        var dto = await _protocolAppService.GetByTokenAsync(invite.Token);

        dto.PreviewHtml.ShouldContain("Önizleme Derneği");
        dto.PreviewHtml.ShouldContain("onay anında doldurulacaktır");
        // Doldurulmamış yer tutucu kalmamalı — belgede "{{...}}" görünmesi kabul edilemez.
        dto.PreviewHtml.ShouldNotContain("{{");
        dto.PlanName.ShouldBe("Kurumsal Paket");
        dto.Amount.ShouldBe(24_000m);
    }

    // --- Onay ---

    /// <summary>
    /// Onay kutusu işaretlenmeden hesap açılmamalı.
    /// <para>
    /// Beklenen tip <c>AbpValidationException</c>: DTO doğrulaması domain kuralından ÖNCE
    /// devreye girer ve kullanıcıya alan bazlı mesaj gösteren katman odur. Servisteki
    /// <c>AgreementConsentRequired</c> kuralı ayrıca duruyor ve DTO'yu atlayan çağrıları
    /// koruyor — o katman bir sonraki testte ölçülüyor.
    /// </para>
    /// </summary>
    [Fact]
    public async Task Onay_kutulari_isaretlenmeden_reddedilir()
    {
        var id = await CreateApprovedRequestAsync();
        var invite = await _requestAppService.IssueInviteAsync(id);

        await Should.ThrowAsync<AbpValidationException>(
            () => _protocolAppService.ApproveAsync(new ApproveProtocolInput
            {
                Token = invite.Token,
                AcceptAgreement = true,
                AcceptKvkk = false,
                Password = "1q2w3E*asd",
                PasswordConfirm = "1q2w3E*asd"
            }));

        // Hesap AÇILMAMIŞ olmalı: doğrulama düştüğünde hiçbir yan etki kalmamalı.
        var stored = await _requestRepository.GetAsync(id);
        stored.Status.ShouldBe(RegistrationRequestStatus.AwaitingProtocol);
        stored.TenantId.ShouldBeNull();
    }

    /// <summary>
    /// Uçtan uca: onay sözleşmeyi yazar, rıza kayıtlarını düşer, kiracıyı açar ve talebi
    /// kapatır. Protokolün 9. maddesinin istediği her delil alanı dolu olmalı.
    /// </summary>
    [Fact]
    public async Task Onay_sozlesmeyi_yazar_ve_hesabi_acar()
    {
        var id = await CreateApprovedRequestAsync(companyName: "Uçtan Uca Gençlik Derneği");
        var invite = await _requestAppService.IssueInviteAsync(id);

        var result = await _protocolAppService.ApproveAsync(new ApproveProtocolInput
        {
            Token = invite.Token,
            AcceptAgreement = true,
            AcceptKvkk = true,
            Password = "1q2w3E*asd",
            PasswordConfirm = "1q2w3E*asd",
            IpAddress = "203.0.113.42",
            UserAgent = "Mozilla/5.0 (QA)"
        });

        result.AgreementNumber.ShouldStartWith(ServiceAgreementConsts.NumberPrefix);
        result.TenantName.ShouldNotBeNullOrWhiteSpace();
        result.ContentHash.Length.ShouldBe(64);

        var agreement = await _agreementRepository.GetAsync(a => a.RegistrationRequestId == id);

        agreement.Status.ShouldBe(ServiceAgreementStatus.Active);
        agreement.TenantId.ShouldNotBeNull();
        agreement.ApproverName.ShouldBe("Ayşe Yılmaz");
        agreement.ApproverTitle.ShouldBe("Yönetim Kurulu Başkanı");
        agreement.ApprovedIp.ShouldBe("203.0.113.42");
        agreement.Plan.ShouldBe(SalesPlan.Corporate);
        agreement.Amount.ShouldBe(24_000m);
        // Madde 8: onay tarihinden itibaren 1 yıl.
        agreement.EndDate.ShouldBe(agreement.StartDate.AddMonths(12));
        agreement.RenderedHtml.ShouldContain("Uçtan Uca Gençlik Derneği");
        agreement.RenderedHtml.ShouldNotContain("{{");

        var stored = await _requestRepository.GetAsync(id);
        stored.Status.ShouldBe(RegistrationRequestStatus.AccountCreated);
        stored.TenantId.ShouldBe(agreement.TenantId);
        stored.InviteUsedAt.ShouldNotBeNull();

        // İki rıza kaydı: protokol kabulü + KVKK taahhüdü.
        var consents = await _consentRepository.GetListAsync(
            c => c.SubjectId == stored.Email
                 && (c.Type == ConsentType.ServiceAgreement || c.Type == ConsentType.ServiceAgreementKvkk));

        consents.Count.ShouldBe(2);
        consents.ShouldAllBe(c => c.Granted);
        consents.ShouldAllBe(c => c.PolicyVersion == ConsentConsts.ServiceAgreementPolicyVersion);
    }

    /// <summary>Kullanılmış davet ikinci kez çalışmamalı — jeton tek kullanımlıktır.</summary>
    [Fact]
    public async Task Kullanilmis_davet_tekrar_calismaz()
    {
        var id = await CreateApprovedRequestAsync(companyName: "Tek Kullanım Derneği");
        var invite = await _requestAppService.IssueInviteAsync(id);

        await _protocolAppService.ApproveAsync(new ApproveProtocolInput
        {
            Token = invite.Token,
            AcceptAgreement = true,
            AcceptKvkk = true,
            Password = "1q2w3E*asd",
            PasswordConfirm = "1q2w3E*asd"
        });

        var exception = await Should.ThrowAsync<BusinessException>(
            () => _protocolAppService.GetByTokenAsync(invite.Token));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.AgreementInviteInvalid);
    }

    /// <summary>
    /// Kiracı adı kurum unvanından türer ve çakışmada sonek alır. İki farklı kurumun aynı
    /// adı alması ABP tarafında hata verir ve ikinci müşterinin kaydı hiç açılmazdı.
    /// </summary>
    [Fact]
    public async Task Ayni_unvanli_iki_kurum_farkli_hesap_adi_alir()
    {
        const string sameName = "Çakışan Unvan Derneği";

        var firstId = await CreateApprovedRequestAsync(companyName: sameName);
        var firstInvite = await _requestAppService.IssueInviteAsync(firstId);
        var first = await ApproveAsync(firstInvite.Token);

        var secondId = await CreateApprovedRequestAsync(companyName: sameName);
        var secondInvite = await _requestAppService.IssueInviteAsync(secondId);
        var second = await ApproveAsync(secondInvite.Token);

        first.TenantName.ShouldNotBe(second.TenantName);
        // Türkçe harfler ASCII'ye indirilmeli: ad bazı yerlerde anahtar gibi kullanılıyor.
        first.TenantName.ShouldBe("cakisan-unvan-dernegi");
    }

    private Task<ProtocolApprovalResultDto> ApproveAsync(string token)
        => _protocolAppService.ApproveAsync(new ApproveProtocolInput
        {
            Token = token,
            AcceptAgreement = true,
            AcceptKvkk = true,
            Password = "1q2w3E*asd",
            PasswordConfirm = "1q2w3E*asd"
        });
}
