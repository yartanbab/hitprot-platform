using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.DemoRequests;
using Apya.Platform.DemoRequests.Dtos;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.DemoRequests;

/// <summary>
/// SÖZLEŞME: giriş ekranındaki oturumsuz demo formu, panelin güvenebileceği bir kayıt
/// üretir ve kötüye kullanıma açık bırakılmaz.
///
/// <para>Yetkilendirme burada ölçülmez — <c>PlatformTestBaseModule</c> içindeki
/// <c>AddAlwaysAllowAuthorization</c> her izni verir. Ölçülen üç şey:</para>
/// <list type="bullet">
/// <item><b>Kayıt bütünlüğü:</b> talep "Yeni" doğar, istemciden gelen modül listesi
/// tanınan anahtarlara indirgenir.</item>
/// <item><b>Takip:</b> durum ve iç not güncellenebilir.</item>
/// <item><b>Sel koruması:</b> aynı IP saatlik sınırı aşamaz.</item>
/// </list>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DemoRequestAppService_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IDemoRequestAppService _demoRequestAppService;

    public DemoRequestAppService_Tests()
    {
        _demoRequestAppService = GetRequiredService<IDemoRequestAppService>();
    }

    /// <summary>
    /// IP verilmezse sel koruması hiç çalışmaz; testlerin birbirinin sayacını
    /// tüketmemesi için sınırı ölçmeyen testler IP'siz gider.
    /// </summary>
    private static CreateDemoRequestDto NewInput(
        string email = "aday@ornek.com",
        List<string>? modules = null,
        string? ipAddress = null)
        => new()
        {
            FullName = "  Ayşe Yılmaz  ",
            CompanyName = " Örnek Dernek ",
            Email = email,
            Phone = " 05551112233 ",
            OrganizationKind = DemoRequestOrganizationKind.Association,
            CompanySize = DemoRequestCompanySize.From11To50,
            InterestedModules = modules ?? new List<string> { "Projects", "Finance" },
            Message = "  Hibe takibi için bakıyoruz.  ",
            IpAddress = ipAddress
        };

    [Fact]
    public async Task Talep_yeni_durumunda_dogar_ve_alanlar_kirpilir()
    {
        var id = await _demoRequestAppService.CreateAsync(NewInput());

        var request = await _demoRequestAppService.GetAsync(id);

        request.Status.ShouldBe(DemoRequestStatus.New);
        request.FullName.ShouldBe("Ayşe Yılmaz");
        request.CompanyName.ShouldBe("Örnek Dernek");
        request.Phone.ShouldBe("05551112233");
        request.Message.ShouldBe("Hibe takibi için bakıyoruz.");
        request.AdminNote.ShouldBeNull();
        request.InterestedModuleKeys.ShouldBe(new[] { "Projects", "Finance" });
    }

    [Fact]
    public async Task Taninmayan_modul_anahtari_elenir()
    {
        // Liste istemciden geliyor: doğrulanmadan saklanırsa panel etiketi çözemez.
        var id = await _demoRequestAppService.CreateAsync(
            NewInput(modules: new List<string> { "Projects", "<script>", "Bilinmeyen", "projects" }));

        var request = await _demoRequestAppService.GetAsync(id);

        request.InterestedModuleKeys.ShouldBe(new[] { "Projects" });
    }

    [Fact]
    public async Task Hicbir_modul_secilmezse_bos_kalir()
    {
        var id = await _demoRequestAppService.CreateAsync(NewInput(modules: new List<string>()));

        var request = await _demoRequestAppService.GetAsync(id);

        request.InterestedModules.ShouldBeNull();
        request.InterestedModuleKeys.ShouldBeEmpty();
    }

    [Fact]
    public async Task Durum_ve_ic_not_guncellenir()
    {
        var id = await _demoRequestAppService.CreateAsync(NewInput());

        var updated = await _demoRequestAppService.UpdateAsync(id, new UpdateDemoRequestDto
        {
            Status = DemoRequestStatus.Contacted,
            AdminNote = "  Arandı, salı günü demo ayarlandı.  "
        });

        updated.Status.ShouldBe(DemoRequestStatus.Contacted);
        updated.AdminNote.ShouldBe("Arandı, salı günü demo ayarlandı.");

        // Yanlış işaretleme geri alınabilmeli: geçiş tek yönlü DEĞİL.
        var reopened = await _demoRequestAppService.UpdateAsync(id, new UpdateDemoRequestDto
        {
            Status = DemoRequestStatus.New,
            AdminNote = null
        });

        reopened.Status.ShouldBe(DemoRequestStatus.New);
        reopened.AdminNote.ShouldBeNull();
    }

    [Fact]
    public async Task Liste_duruma_gore_suzulur()
    {
        var email = $"suzgec-{Guid.NewGuid():N}@ornek.com";
        var id = await _demoRequestAppService.CreateAsync(NewInput(email: email));
        await _demoRequestAppService.UpdateAsync(id, new UpdateDemoRequestDto
        {
            Status = DemoRequestStatus.Closed
        });

        var closed = await _demoRequestAppService.GetListAsync(new DemoRequestListFilterDto
        {
            Status = DemoRequestStatus.Closed,
            Filter = email
        });
        closed.Items.Count.ShouldBe(1);
        closed.Items[0].Id.ShouldBe(id);

        var stillNew = await _demoRequestAppService.GetListAsync(new DemoRequestListFilterDto
        {
            Status = DemoRequestStatus.New,
            Filter = email
        });
        stillNew.Items.ShouldBeEmpty();
    }

    [Fact]
    public async Task Ayni_IP_saatlik_siniri_asamaz()
    {
        // Sayaç IP başına: başka testlerin kaydı bu sınırı tüketmesin diye IP benzersiz.
        var ip = $"203.0.113.{new Random().Next(1, 254)}-{Guid.NewGuid():N}";

        for (var i = 0; i < DemoRequestConsts.RateLimitMaxRequests; i++)
        {
            await _demoRequestAppService.CreateAsync(NewInput(ipAddress: ip));
        }

        var exception = await Should.ThrowAsync<BusinessException>(
            () => _demoRequestAppService.CreateAsync(NewInput(ipAddress: ip)));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.DemoRequestRateLimitExceeded);
    }

    [Fact]
    public async Task Sinir_IP_basinadir_baska_IP_etkilenmez()
    {
        var busyIp = $"198.51.100.7-{Guid.NewGuid():N}";
        var freshIp = $"198.51.100.8-{Guid.NewGuid():N}";

        for (var i = 0; i < DemoRequestConsts.RateLimitMaxRequests; i++)
        {
            await _demoRequestAppService.CreateAsync(NewInput(ipAddress: busyIp));
        }

        // Farklı IP hâlâ geçmeli, aksi halde tek bot tüm formu kilitlerdi.
        var id = await _demoRequestAppService.CreateAsync(NewInput(ipAddress: freshIp));

        id.ShouldNotBe(Guid.Empty);
    }
}
