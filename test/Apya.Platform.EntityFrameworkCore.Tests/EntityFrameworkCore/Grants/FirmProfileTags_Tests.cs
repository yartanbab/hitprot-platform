using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Kurum profili kaydı etiketleri TAM DEĞİŞTİRİR: gelen liste profilin eksiksiz etiket kümesidir.
/// /Grants'taki etiket kaybının kökü istemciydi — profil okunamadığında ya da henüz okunmadan
/// açılan boş form kaydedilebiliyor, boş liste gönderiyordu (Tenant.js artık formu profil okunana
/// kadar kilitli tutuyor; <c>GrantFirmProfileEditorScript_Tests</c>). Sunucu sözleşmesi burada
/// kilitli: formun geri gönderdiği etiketler yeniden kayıtta KORUNUR, boş liste gerçekten
/// "hepsini kaldır" demektir — sunucu "yüklenmemiş form"u "kullanıcı hepsini sildi"den ayıramaz.
///
/// Her test kendi kiracısında koşar (profil kiracı başına tekil). Doğrulama servis okumasıyla
/// değil, yeni UoW'da doğrudan tablodan yapılır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FirmProfileTags_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IFirmProfileAppService _firmProfileAppService;
    private readonly IRepository<FirmProfileTag, Guid> _tagRepository;
    private readonly ICurrentTenant _currentTenant;

    public FirmProfileTags_Tests()
    {
        _firmProfileAppService = GetRequiredService<IFirmProfileAppService>();
        _tagRepository = GetRequiredService<IRepository<FirmProfileTag, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private static readonly (GrantCriteriaKind Kind, string Value)[] CompanyTags =
    {
        (GrantCriteriaKind.NaceKodu, "62.01"),
        (GrantCriteriaKind.Sektor, "Yazılım"),
        (GrantCriteriaKind.Bolge, "Ankara"),
        (GrantCriteriaKind.AnahtarKelime, "yapay zekâ")
    };

    private async Task SaveCompanyProfileWithTagsAsync()
    {
        var input = new UpdateFirmProfileDto { Type = OrganizationType.Sirket, StaffCount = 12 };
        input.Tags.AddRange(CompanyTags.Select(t => new GrantCriteriaTagDto { Kind = t.Kind, Value = t.Value }));
        await _firmProfileAppService.UpdateMyProfileAsync(input);
    }

    private Task<(GrantCriteriaKind Kind, string Value)[]> LiveTagsAsync()
        => WithUnitOfWorkAsync(async () => (await _tagRepository.GetListAsync())
            .Select(t => (t.Kind, t.Value))
            .ToArray());

    /// <summary>
    /// İstemcinin yaptığı gibi: profili oku, yalnız bir alanı değiştir, okunan etiketleri geri
    /// gönder. Etiketlerin tümü yeniden kayıttan sonra da canlı kalmalı.
    /// </summary>
    [Fact]
    public async Task Formdan_geri_gelen_etiketler_yeniden_kayitta_korunur()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            await SaveCompanyProfileWithTagsAsync();

            var loaded = await _firmProfileAppService.GetMyProfileAsync();
            loaded.Tags.Count.ShouldBe(CompanyTags.Length);

            await _firmProfileAppService.UpdateMyProfileAsync(new UpdateFirmProfileDto
            {
                Type = loaded.Type,
                StaffCount = 15,
                Tags = loaded.Tags
            });

            (await LiveTagsAsync()).ShouldBe(CompanyTags, ignoreOrder: true);

            var reread = await _firmProfileAppService.GetMyProfileAsync();
            reread.StaffCount.ShouldBe(15);
            reread.Tags.Select(t => (t.Kind, t.Value)).ShouldBe(CompanyTags, ignoreOrder: true);
        }
    }

    /// <summary>
    /// Tam değiştirme sözleşmesi: boş liste tüm etiketleri kaldırır. Bu yüzden yüklenmemiş
    /// form kaydedilememeli — koruma istemcide (form kilidi), DTO sözleşmesi değişmez.
    /// </summary>
    [Fact]
    public async Task Bos_etiket_listesi_tum_etiketleri_kaldirir()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            await SaveCompanyProfileWithTagsAsync();
            (await LiveTagsAsync()).Length.ShouldBe(CompanyTags.Length);

            await _firmProfileAppService.UpdateMyProfileAsync(new UpdateFirmProfileDto { Type = OrganizationType.Sirket });

            (await LiveTagsAsync()).ShouldBeEmpty();
        }
    }
}
