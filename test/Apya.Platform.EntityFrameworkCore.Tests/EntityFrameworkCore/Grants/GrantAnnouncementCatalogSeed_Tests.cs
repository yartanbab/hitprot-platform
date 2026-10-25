using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Duyuru kataloğu tohumu artık programın anlatı alanlarını (amaç, öncelikler, başvuru sahipleri),
/// harcama kalemlerini ve belge listesini de kurar; var olan programda yalnız BOŞ alanları doldurur.
/// Kilitlenen sözleşme: host'un elle girdiği değer tekrar koşan tohumla ezilmez, boşalan alan ise
/// yeniden dolar ve alt listeler mükerrer üretilmez.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantAnnouncementCatalogSeed_Tests : PlatformEntityFrameworkCoreTestBase
{
    /// <summary>TÜBİTAK 1507 KOBİ Ar-Ge Başlangıç (2026/2) — stgm-tubitak-hibe-duyurulari.json.</summary>
    private static readonly Guid Tubitak1507Id = Guid.Parse("eb8cfcb6-0cad-4f04-8679-cfb171f97471");

    /// <summary>Alanı Genişlet Gençlik Örgütleri Destek Programı — AB fonlu, tavanı avro.</summary>
    private static readonly Guid AlaniGenisletId = Guid.Parse("766724c8-4fed-4410-8a97-80583376d2cf");

    private readonly IDataSeeder _dataSeeder;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costItemRepository;
    private readonly IRepository<GrantDocumentRequirement, Guid> _documentRepository;

    public GrantAnnouncementCatalogSeed_Tests()
    {
        _dataSeeder = GetRequiredService<IDataSeeder>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _costItemRepository = GetRequiredService<IRepository<GrantEligibleCostItem, Guid>>();
        _documentRepository = GetRequiredService<IRepository<GrantDocumentRequirement, Guid>>();
    }

    [Fact]
    public async Task Program_anlati_alanlari_kalemleri_ve_belgeleriyle_kurulur()
    {
        var grant = await _grantRepository.GetAsync(Tubitak1507Id);

        grant.TenantId.ShouldBeNull("katalog host verisidir");
        grant.Objective.ShouldNotBeNullOrWhiteSpace();
        grant.Priorities.ShouldNotBeNull();
        grant.Priorities.Split('\n').Length.ShouldBeGreaterThan(1, "her madde bir satır");
        grant.EligibleApplicants.ShouldNotBeNullOrWhiteSpace();
        grant.SupportRatePercent.ShouldBe(75);
        grant.ProjectDurationMonths.ShouldBe(18);
        grant.HasAdvancePayment.ShouldBeTrue();

        var costItems = await _costItemRepository.GetListAsync(c => c.GrantId == Tubitak1507Id);
        costItems.Select(c => c.Kind).Distinct().Count().ShouldBe(costItems.Count, "kalem türü tekrar etmez");
        costItems.ShouldContain(c => c.Kind == GrantCostItemKind.Personel);

        var documents = await _documentRepository.GetListAsync(d => d.GrantId == Tubitak1507Id);
        documents.ShouldNotBeEmpty();
        documents.Select(d => d.Order).ShouldBeUnique();
        documents.ShouldContain(d => d.Obligation == GrantDocumentObligation.Kosullu);
    }

    [Fact]
    public async Task Doviz_tavanli_program_kendi_para_birimiyle_kurulur()
    {
        var tl = await _grantRepository.GetAsync(Tubitak1507Id);
        tl.Currency.ShouldBe(GrantCurrencies.Try);

        var eur = await _grantRepository.GetAsync(AlaniGenisletId);
        eur.Currency.ShouldBe(GrantCurrencies.Eur);
        eur.MaxAmount!.Value.ShouldBeGreaterThan(0m);
        eur.TryMaxAmount.ShouldBeNull("döviz tavanı TL karşılaştırmasına girmez");
    }

    [Fact]
    public async Task Bos_tavana_doviz_tutari_birimiyle_dolar_dolu_TL_tavana_dokunulmaz()
    {
        var eur = await _grantRepository.GetAsync(AlaniGenisletId);
        var seededMax = eur.MaxAmount;
        eur.MaxAmount = 0m;
        eur.Currency = GrantCurrencies.Try;
        await _grantRepository.UpdateAsync(eur, autoSave: true);

        var tl = await _grantRepository.GetAsync(Tubitak1507Id);
        tl.MaxAmount = 1_234_000m;
        await _grantRepository.UpdateAsync(tl, autoSave: true);

        await _dataSeeder.SeedAsync();

        var eurAfter = await _grantRepository.GetAsync(AlaniGenisletId);
        eurAfter.MaxAmount.ShouldBe(seededMax);
        eurAfter.Currency.ShouldBe(GrantCurrencies.Eur, "tutar ile birimi birlikte gelir");

        var tlAfter = await _grantRepository.GetAsync(Tubitak1507Id);
        tlAfter.MaxAmount.ShouldBe(1_234_000m);
        tlAfter.Currency.ShouldBe(GrantCurrencies.Try);
    }

    [Fact]
    public async Task Tekrar_kosmak_elle_girilen_degeri_ezmez_bosalan_alani_doldurur()
    {
        var grant = await _grantRepository.GetAsync(Tubitak1507Id);
        var seededObjective = grant.Objective;
        grant.Objective = "Host elle yazdı";
        grant.Priorities = null;
        await _grantRepository.UpdateAsync(grant, autoSave: true);

        var documentsBefore = await _documentRepository.GetListAsync(d => d.GrantId == Tubitak1507Id);
        await _documentRepository.DeleteManyAsync(documentsBefore, autoSave: true);
        var costItemsBefore = (await _costItemRepository.GetListAsync(c => c.GrantId == Tubitak1507Id)).Count;

        await _dataSeeder.SeedAsync();

        var after = await _grantRepository.GetAsync(Tubitak1507Id);
        after.Objective.ShouldBe("Host elle yazdı", "dolu alan tohumla ezilmez");
        after.Priorities.ShouldNotBeNullOrWhiteSpace("boşalan alan yeniden dolar");
        seededObjective.ShouldNotBe(after.Objective);

        (await _documentRepository.GetListAsync(d => d.GrantId == Tubitak1507Id)).Count
            .ShouldBe(documentsBefore.Count, "silinen belge listesi yeniden kurulur");
        (await _costItemRepository.GetListAsync(c => c.GrantId == Tubitak1507Id)).Count
            .ShouldBe(costItemsBefore, "var olan kalemler mükerrer üretilmez");
    }
}
