using System;
using System.Threading.Tasks;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.RegistrationRequests.Dtos;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Validation;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.RegistrationRequests;

/// <summary>
/// SÖZLEŞME: giriş ekranındaki oturumsuz kayıt formu, panelin güvenebileceği bir kayıt
/// üretir ve kötüye kullanıma açık bırakılmaz.
///
/// <para>Yetkilendirme burada ölçülmez — <c>PlatformTestBaseModule</c> içindeki
/// <c>AddAlwaysAllowAuthorization</c> her izni verir. Ölçülen dört şey:</para>
/// <list type="bullet">
/// <item><b>Kayıt bütünlüğü:</b> talep "Yeni" doğar, alanlar kırpılır, protokolün
/// istediği kurum kimliği eksiksiz saklanır.</item>
/// <item><b>Değerlendirme:</b> durum, onaylanan paket ve bedel güncellenebilir.</item>
/// <item><b>Paket ayrımı:</b> onayda paket değişirse adayın seçtiği KAYBOLMAZ.</item>
/// <item><b>Sel koruması:</b> aynı IP saatlik sınırı aşamaz.</item>
/// </list>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class RegistrationRequestAppService_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IRegistrationRequestAppService _registrationRequestAppService;

    public RegistrationRequestAppService_Tests()
    {
        _registrationRequestAppService = GetRequiredService<IRegistrationRequestAppService>();
    }

    /// <summary>
    /// IP verilmezse sel koruması hiç çalışmaz; testlerin birbirinin sayacını
    /// tüketmemesi için sınırı ölçmeyen testler IP'siz gider.
    /// </summary>
    private static CreateRegistrationRequestDto NewInput(
        string email = "aday@ornek.com",
        SalesPlan plan = SalesPlan.Standard,
        string? ipAddress = null)
        => new()
        {
            RequestedPlan = plan,
            CompanyName = " Örnek Gençlik Derneği ",
            CompanyType = Apya.Platform.Tenants.CompanyType.Association,
            TaxNumber = " 1234567890 ",
            TaxOffice = " Halkalı ",
            Address = "  Merkez Mah. Atatürk Cad. No:1, Küçükçekmece / İstanbul  ",
            CorporateEmail = " info@ornek.com ",
            CompanySize = RegistrationRequestCompanySize.From11To50,
            FullName = "  Ayşe Yılmaz  ",
            AuthorizedTitle = " Yönetim Kurulu Başkanı ",
            Email = email,
            Phone = " 05551112233 ",
            Message = "  Hibe takibi için bakıyoruz.  ",
            IpAddress = ipAddress
        };

    [Fact]
    public async Task Talep_yeni_durumunda_dogar_ve_alanlar_kirpilir()
    {
        var id = await _registrationRequestAppService.CreateAsync(NewInput());

        var request = await _registrationRequestAppService.GetAsync(id);

        request.Status.ShouldBe(RegistrationRequestStatus.New);
        request.FullName.ShouldBe("Ayşe Yılmaz");
        request.AuthorizedTitle.ShouldBe("Yönetim Kurulu Başkanı");
        request.CompanyName.ShouldBe("Örnek Gençlik Derneği");
        request.Phone.ShouldBe("05551112233");
        request.Message.ShouldBe("Hibe takibi için bakıyoruz.");
        request.AdminNote.ShouldBeNull();
    }

    /// <summary>
    /// Protokolün 1. maddesindeki KURUM sütunu bu alanlardan doldurulacak; biri
    /// eksik saklanırsa sözleşme metni boş yer tutucuyla üretilir.
    /// </summary>
    [Fact]
    public async Task Protokolun_istedigi_kurum_kimligi_eksiksiz_saklanir()
    {
        var id = await _registrationRequestAppService.CreateAsync(NewInput());

        var request = await _registrationRequestAppService.GetAsync(id);

        request.CompanyName.ShouldNotBeNullOrWhiteSpace();   // KURUM_UNVANI
        request.TaxNumber.ShouldBe("1234567890");            // KURUM_VERGI_KUTUK_NO
        request.TaxOffice.ShouldBe("Halkalı");
        request.Address.ShouldBe("Merkez Mah. Atatürk Cad. No:1, Küçükçekmece / İstanbul"); // KURUM_ADRES
        request.CorporateEmail.ShouldBe("info@ornek.com");
        request.CompanyType.ShouldBe(Apya.Platform.Tenants.CompanyType.Association);
    }

    [Fact]
    public async Task Istege_bagli_alanlar_bos_birakilabilir()
    {
        var input = NewInput();
        input.TaxOffice = null;
        input.CorporateEmail = null;
        input.CompanySize = null;
        input.OperationalContactName = null;
        input.OperationalContactPhone = null;
        input.Message = "   ";

        var id = await _registrationRequestAppService.CreateAsync(input);
        var request = await _registrationRequestAppService.GetAsync(id);

        request.TaxOffice.ShouldBeNull();
        request.CorporateEmail.ShouldBeNull();
        request.CompanySize.ShouldBeNull();
        request.OperationalContactName.ShouldBeNull();
        // Yalnız boşluktan ibaret metin null'a indirgenir; DB'de "" ile null karışmasın.
        request.Message.ShouldBeNull();
        request.Status.ShouldBe(RegistrationRequestStatus.New);
    }

    [Fact]
    public async Task Durum_paket_ve_bedel_guncellenir()
    {
        var id = await _registrationRequestAppService.CreateAsync(NewInput());

        var updated = await _registrationRequestAppService.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Approved,
            ApprovedPlan = SalesPlan.Corporate,
            OfferedAmount = 24_000m,
            AdminNote = "  Görüşüldü, Kurumsal pakete geçildi.  "
        });

        updated.Status.ShouldBe(RegistrationRequestStatus.Approved);
        updated.ApprovedPlan.ShouldBe(SalesPlan.Corporate);
        updated.OfferedAmount.ShouldBe(24_000m);
        updated.AdminNote.ShouldBe("Görüşüldü, Kurumsal pakete geçildi.");

        // Yanlış işaretleme geri alınabilmeli: geçiş tek yönlü DEĞİL.
        var reopened = await _registrationRequestAppService.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.InReview,
            AdminNote = null
        });

        reopened.Status.ShouldBe(RegistrationRequestStatus.InReview);
        reopened.AdminNote.ShouldBeNull();
    }

    /// <summary>
    /// Onayda paket değişse bile adayın SEÇTİĞİ kayıtta kalmalı: satış görüşmesinde
    /// "ben Standart istemiştim" itirazının tek dayanağı bu alan.
    /// </summary>
    [Fact]
    public async Task Onayda_paket_degisirse_adayin_secimi_korunur()
    {
        var id = await _registrationRequestAppService.CreateAsync(NewInput(plan: SalesPlan.Standard));

        var updated = await _registrationRequestAppService.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Approved,
            ApprovedPlan = SalesPlan.Joint
        });

        updated.RequestedPlan.ShouldBe(SalesPlan.Standard);
        updated.ApprovedPlan.ShouldBe(SalesPlan.Joint);
        // Sözleşmeye yazılacak olan: onaylanan.
        updated.EffectivePlan.ShouldBe(SalesPlan.Joint);
    }

    /// <summary>Onayda paket değiştirilmezse sözleşmeye adayın seçtiği gider.</summary>
    [Fact]
    public async Task Paket_degistirilmezse_gecerli_paket_adayin_secimidir()
    {
        var id = await _registrationRequestAppService.CreateAsync(NewInput(plan: SalesPlan.Corporate));

        var updated = await _registrationRequestAppService.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Approved,
            ApprovedPlan = null
        });

        updated.ApprovedPlan.ShouldBeNull();
        updated.EffectivePlan.ShouldBe(SalesPlan.Corporate);
    }

    /// <summary>
    /// Negatif bedel servis sınırında DOĞRULAMA hatasıyla döner — domain kuralıyla
    /// değil. Sıra bilinçli: <c>[Range]</c> hostuna alan bazlı bir mesaj gösterir,
    /// <c>BusinessException</c> ise formda genel hata kutusuna düşerdi.
    /// Domain kuralı ayrıca duruyor; onu bir sonraki test ölçüyor.
    /// </summary>
    [Fact]
    public async Task Negatif_bedel_servis_sinirinda_reddedilir()
    {
        var id = await _registrationRequestAppService.CreateAsync(NewInput());

        await Should.ThrowAsync<AbpValidationException>(
            () => _registrationRequestAppService.UpdateAsync(id, new UpdateRegistrationRequestDto
            {
                Status = RegistrationRequestStatus.Approved,
                OfferedAmount = -1m
            }));
    }

    /// <summary>
    /// Domain kuralı DTO'dan bağımsız durur: entity'yi doğrudan çağıran bir yol
    /// (Faz 2'nin hesap açılış akışı, tohumlayıcı, ileride bir arka plan işi)
    /// <c>[Range]</c> doğrulamasına hiç uğramaz.
    /// </summary>
    [Fact]
    public void Entity_negatif_bedeli_kabul_etmez()
    {
        var request = new RegistrationRequest(
            Guid.NewGuid(),
            "Ayşe Yılmaz",
            "Yönetim Kurulu Başkanı",
            "aday@ornek.com",
            "05551112233",
            "Örnek Gençlik Derneği",
            Apya.Platform.Tenants.CompanyType.Association,
            "1234567890",
            "Merkez Mah. No:1, İstanbul",
            SalesPlan.Standard);

        var exception = Should.Throw<BusinessException>(
            () => request.SetOffer(SalesPlan.Corporate, -1m));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.RegistrationRequestOfferAmountInvalid);
    }

    [Fact]
    public async Task Liste_duruma_gore_suzulur()
    {
        var email = $"suzgec-{Guid.NewGuid():N}@ornek.com";
        var id = await _registrationRequestAppService.CreateAsync(NewInput(email: email));
        await _registrationRequestAppService.UpdateAsync(id, new UpdateRegistrationRequestDto
        {
            Status = RegistrationRequestStatus.Rejected
        });

        var rejected = await _registrationRequestAppService.GetListAsync(new RegistrationRequestListFilterDto
        {
            Status = RegistrationRequestStatus.Rejected,
            Filter = email
        });
        rejected.Items.Count.ShouldBe(1);
        rejected.Items[0].Id.ShouldBe(id);

        var stillNew = await _registrationRequestAppService.GetListAsync(new RegistrationRequestListFilterDto
        {
            Status = RegistrationRequestStatus.New,
            Filter = email
        });
        stillNew.Items.ShouldBeEmpty();
    }

    /// <summary>Vergi numarası da aranabilmeli — panelde kurum çoğu zaman onunla bulunur.</summary>
    [Fact]
    public async Task Liste_vergi_numarasiyla_aranir()
    {
        var taxNumber = new Random().Next(1000000, 9999999).ToString() + "42";
        var input = NewInput(email: $"vergi-{Guid.NewGuid():N}@ornek.com");
        input.TaxNumber = taxNumber;

        var id = await _registrationRequestAppService.CreateAsync(input);

        var found = await _registrationRequestAppService.GetListAsync(new RegistrationRequestListFilterDto
        {
            Filter = taxNumber
        });

        found.Items.Count.ShouldBe(1);
        found.Items[0].Id.ShouldBe(id);
    }

    [Fact]
    public async Task Ayni_IP_saatlik_siniri_asamaz()
    {
        // Sayaç IP başına: başka testlerin kaydı bu sınırı tüketmesin diye IP benzersiz.
        var ip = $"203.0.113.{new Random().Next(1, 254)}-{Guid.NewGuid():N}";

        for (var i = 0; i < RegistrationRequestConsts.RateLimitMaxRequests; i++)
        {
            await _registrationRequestAppService.CreateAsync(NewInput(ipAddress: ip));
        }

        var exception = await Should.ThrowAsync<BusinessException>(
            () => _registrationRequestAppService.CreateAsync(NewInput(ipAddress: ip)));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.RegistrationRequestRateLimitExceeded);
    }

    [Fact]
    public async Task Sinir_IP_basinadir_baska_IP_etkilenmez()
    {
        var busyIp = $"198.51.100.7-{Guid.NewGuid():N}";
        var freshIp = $"198.51.100.8-{Guid.NewGuid():N}";

        for (var i = 0; i < RegistrationRequestConsts.RateLimitMaxRequests; i++)
        {
            await _registrationRequestAppService.CreateAsync(NewInput(ipAddress: busyIp));
        }

        // Farklı IP hâlâ geçmeli, aksi halde tek bot tüm formu kilitlerdi.
        var id = await _registrationRequestAppService.CreateAsync(NewInput(ipAddress: freshIp));

        id.ShouldNotBe(Guid.Empty);
    }
}
