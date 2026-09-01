using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Erasmus+ gençlik katalogunun tohumlanması. Bu tohumlayıcı demo verisi DEĞİL — bayrağa
/// bağlı olmadan her DbMigrator koşusunda çalışır, o yüzden davranışı kilitlenmelidir.
///
/// <para>Kilitlenen üç sözleşme: (1) katalog host'a yazılır, kiracıya kopyalanmaz;
/// (2) tekrar koşmak mükerrer kayıt üretmez; (3) kiracı bağlamında yalnız "Açık" çağrılar
/// listelenir — geçmiş dönemler "Kapandı", 2027 dönemleri "Planlandı" olarak durur.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ErasmusYouthCatalogSeed_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Ka152Id = Guid.Parse("e7a51520-0000-4000-8000-000000000152");
    private static readonly Guid Ka210Id = Guid.Parse("e7a51520-0000-4000-8000-000000000210");
    private static readonly Guid TenantId = Guid.Parse("c0ffee00-1111-2222-3333-444444444444");

    private readonly IDataSeeder _dataSeeder;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepository;
    private readonly IGrantRecommendationAppService _recommendationAppService;
    private readonly ICurrentTenant _currentTenant;

    public ErasmusYouthCatalogSeed_Tests()
    {
        _dataSeeder = GetRequiredService<IDataSeeder>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _criteriaRepository = GetRequiredService<IRepository<GrantCriteriaTag, Guid>>();
        _recommendationAppService = GetRequiredService<IGrantRecommendationAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Fact]
    public async Task Bes_program_host_katalogunda_kurulur()
    {
        foreach (var id in new[] { "152", "153", "154", "210", "220" }
                     .Select(k => Guid.Parse("e7a51520-0000-4000-8000-000000000" + k)))
        {
            (await _grantRepository.FindAsync(id)).ShouldNotBeNull($"{id} tohumlanmamış");
        }

        var ka152 = await _grantRepository.FindAsync(Ka152Id);

        ka152.ShouldNotBeNull();
        ka152.TenantId.ShouldBeNull("katalog host verisidir");
        ka152.Name.ShouldBe("KA152 - Gençlik Değişimleri");
        ka152.Issuer.ShouldBe("Erasmus+ (Ulusal Ajans)");

        // Tavan Avro cinsinden ve tek bir üst limiti yok → 0 sentinel'i.
        ka152.MaxAmount.ShouldBe(0m);

        // Her tüzel kişilik başvurabilir; ölçek kısıtı yok.
        ka152.EligibleCompanySizes.ShouldBe(0);
    }

    [Fact]
    public async Task Program_eslestirme_etiketleriyle_birlikte_gelir()
    {
        var tags = await _criteriaRepository.GetListAsync(t => t.GrantId == Ka152Id);

        // Etiketi olmayan program GrantMatchManager'da 0 puan alır ve hiç önerilemez.
        tags.ShouldNotBeEmpty();
        tags.ShouldContain(t => t.Kind == GrantCriteriaKind.Sektor && t.Value == "gençlik");
        tags.ShouldContain(t => t.Kind == GrantCriteriaKind.AnahtarKelime && t.Value == "erasmus+");
    }

    [Fact]
    public async Task Gecmis_donem_Kapandi_gelecek_donem_Acik_kaydedilir()
    {
        var calls = await _callRepository.GetListAsync(c => c.GrantId == Ka152Id);

        var subat = calls.Single(c => c.Period == "2026/1");
        subat.Status.ShouldBe(GrantCallStatus.Kapandi);
        subat.Deadline!.Value.Date.ShouldBe(new DateTime(2026, 2, 12));
        subat.Reference.ShouldBe("KA152-YOU");

        var ekim = calls.Single(c => c.Period == "2026/2");
        ekim.Status.ShouldBe(GrantCallStatus.Acik);
        ekim.Deadline!.Value.Date.ShouldBe(new DateTime(2026, 10, 1));
    }

    /// <summary>
    /// KA210/KA220'nin 2026 dönemi geçmişte kaldı ve 2027 takvimi açıklanmadı; tarihsiz
    /// "Planlandı" çağrı, program katalogda dursun ama açık çağrı gibi görünmesin diye var.
    /// </summary>
    [Fact]
    public async Task Takvimi_belli_olmayan_donem_tarihsiz_Planlandi_durur()
    {
        var calls = await _callRepository.GetListAsync(c => c.GrantId == Ka210Id);

        var gelecek = calls.Single(c => c.Period == "2027/1");
        gelecek.Status.ShouldBe(GrantCallStatus.Planlandi);
        gelecek.Deadline.ShouldBeNull();
        gelecek.OpenDate.ShouldBeNull();
    }

    [Fact]
    public async Task Tohumlama_tekrar_kosunca_mukerrer_kayit_uretmez()
    {
        var grantsBefore = (await _grantRepository.GetListAsync()).Count;
        var callsBefore = (await _callRepository.GetListAsync(c => c.GrantId == Ka152Id)).Count;
        var tagsBefore = (await _criteriaRepository.GetListAsync(t => t.GrantId == Ka152Id)).Count;

        await _dataSeeder.SeedAsync();

        (await _grantRepository.GetListAsync()).Count.ShouldBe(grantsBefore);
        (await _callRepository.GetListAsync(c => c.GrantId == Ka152Id)).Count.ShouldBe(callsBefore);
        (await _criteriaRepository.GetListAsync(t => t.GrantId == Ka152Id)).Count.ShouldBe(tagsBefore);
    }

    /// <summary>
    /// Kiracı bağlamında tohumlama çalışırsa katalog her kiracıya kopyalanır. Guard'ın
    /// düşmesi bu testle yakalanır.
    /// </summary>
    [Fact]
    public async Task Kiraci_baglaminda_tohumlama_katalogu_kopyalamaz()
    {
        await _dataSeeder.SeedAsync(new DataSeedContext(TenantId));

        using (_currentTenant.Change(TenantId))
        {
            var tenantOwned = await _grantRepository.GetListAsync();
            tenantOwned.ShouldNotContain(g => g.Id == Ka152Id);
        }
    }

    /// <summary>
    /// Kiracının gördüğü liste: yalnız "Açık" çağrılar. Kapanan ve planlanan dönemler girmez.
    /// </summary>
    [Fact]
    public async Task Kiraci_yalniz_acik_donemleri_gorur()
    {
        using (_currentTenant.Change(TenantId))
        {
            var feed = await _recommendationAppService.GetOpenCallsAsync();

            feed.ShouldContain(x => x.GrantId == Ka152Id && x.Period == "2026/2");
            feed.ShouldNotContain(x => x.GrantId == Ka152Id && x.Period == "2026/1");
            feed.ShouldNotContain(x => x.GrantId == Ka210Id);
        }
    }
}
