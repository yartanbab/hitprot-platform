using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 4b · Eşleştirme Ağırlıkları. Test host'u AddAlwaysAllowAuthorization kullanır;
/// gerçek host'ta erişimi <c>[Authorize(PlatformPermissions.Grants.Edit)]</c> kapatır.
/// </summary>
public class GrantMatchWeightPage_Tests : PlatformWebTestBase
{
    private async Task<Guid> GrantIdAsync(int skip = 0)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin();
        var repo = GetRequiredService<IRepository<Grant, Guid>>();
        return (await repo.GetListAsync()).OrderBy(g => g.Name).Skip(skip).First().Id;
    }

    private static UpdateGrantMatchWeightDto Input(bool global, double sector = 2.0)
        => new()
        {
            ApplyToAllPrograms = global,
            SizePenaltyEnabled = true,
            SkipMissingDimensions = true,
            Dimensions = new()
            {
                new() { Dimension = GrantMatchDimension.Sector, Multiplier = sector },
                new() { Dimension = GrantMatchDimension.TechnicalMaturity, Multiplier = 1.0 },
                new() { Dimension = GrantMatchDimension.RdStaff, Multiplier = 1.0 },
                new() { Dimension = GrantMatchDimension.Region, Multiplier = 0.5 },
                new() { Dimension = GrantMatchDimension.ProjectHistory, Multiplier = 1.0 },
                new() { Dimension = GrantMatchDimension.Keyword, Multiplier = 0 }
            }
        };

    [Fact]
    public async Task Sayfa_Render_Oluyor()
    {
        var id = await GrantIdAsync();

        var html = await GetResponseAsStringAsync($"/Grants/MatchWeights?id={id}");

        html.ShouldContain("apya-weight-layout");
        html.ShouldContain("Eksik Veri Kampanyası");
        html.ShouldContain("Ağırlık Değişiminin Etkisi");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"MatchWeights[^""]*\.js")
            .ShouldBeTrue("sayfa demeti MatchWeights.js içermeli");
    }

    [Fact]
    public async Task Id_Verilmezse_Listeye_Yonlendirir()
    {
        var response = await Client.GetAsync("/Grants/MatchWeights");

        ((int)response.StatusCode).ShouldBe(302);
        response.Headers.Location!.ToString().ShouldContain("/Grants");
    }

    [Fact]
    public async Task Satir_Yokken_Fabrika_Varsayilani_Doner()
    {
        var service = GetRequiredService<IGrantMatchWeightAppService>();
        var id = await GrantIdAsync();

        var dto = await service.GetAsync(id);

        dto.Dimensions.Count.ShouldBe(7);
        dto.Dimensions.ShouldAllBe(d => d.Multiplier == 1.0);
        dto.SizePenaltyEnabled.ShouldBeTrue();
        dto.SkipMissingDimensions.ShouldBeTrue();
        dto.IsInherited.ShouldBeTrue();
        dto.IsFactoryDefault.ShouldBeTrue();
    }

    [Fact]
    public async Task Program_Kapsamli_Kayit_Devralmayi_Bitirir()
    {
        var service = GetRequiredService<IGrantMatchWeightAppService>();
        var id = await GrantIdAsync();

        var saved = await service.UpdateAsync(id, Input(global: false));

        saved.IsInherited.ShouldBeFalse();
        saved.IsFactoryDefault.ShouldBeFalse();
        saved.Dimensions.Single(d => d.Dimension == GrantMatchDimension.Sector).Multiplier.ShouldBe(2.0);
        saved.Dimensions.Single(d => d.Dimension == GrantMatchDimension.Keyword).Multiplier.ShouldBe(0);

        var reread = await service.GetAsync(id);
        reread.Dimensions.Single(d => d.Dimension == GrantMatchDimension.Region).Multiplier.ShouldBe(0.5);
    }

    [Fact]
    public async Task Kuresel_Varsayilan_Program_Override_Ini_Kaldirir()
    {
        var service = GetRequiredService<IGrantMatchWeightAppService>();
        var id = await GrantIdAsync(skip: 1);

        await service.UpdateAsync(id, Input(global: false, sector: 2.0));
        (await service.GetAsync(id)).IsInherited.ShouldBeFalse();

        // "Tüm programlar için varsayılan yap": küresele yazar VE override'ı siler,
        // aksi halde program kendi eski satırıyla küreseli gölgelemeye devam ederdi.
        var afterGlobal = await service.UpdateAsync(id, Input(global: true, sector: 1.5));

        afterGlobal.IsInherited.ShouldBeTrue();
        afterGlobal.IsFactoryDefault.ShouldBeFalse();
        afterGlobal.Dimensions.Single(d => d.Dimension == GrantMatchDimension.Sector).Multiplier.ShouldBe(1.5);
    }

    [Fact]
    public async Task Varsayilana_Don_Program_Satirini_Siler()
    {
        var service = GetRequiredService<IGrantMatchWeightAppService>();
        var id = await GrantIdAsync(skip: 2);

        await service.UpdateAsync(id, Input(global: false));
        var reset = await service.ResetAsync(id);

        reset.IsInherited.ShouldBeTrue();
    }

    [Fact]
    public async Task Cozumleyici_Program_Satirini_Kuresele_Tercih_Eder()
    {
        var service = GetRequiredService<IGrantMatchWeightAppService>();
        var resolver = GetRequiredService<GrantMatchWeightResolver>();
        var own = await GrantIdAsync();
        var other = await GrantIdAsync(skip: 3);

        await service.UpdateAsync(other, Input(global: true, sector: 0.5));
        await service.UpdateAsync(own, Input(global: false, sector: 2.0));

        var resolved = await resolver.ResolveManyAsync(new[] { own, other });

        resolved[own][GrantMatchDimension.Sector].ShouldBe(2.0);   // kendi satırı
        resolved[other][GrantMatchDimension.Sector].ShouldBe(0.5); // küresel
    }

    [Fact]
    public async Task Etki_Onizlemesi_Sayilari_Doner()
    {
        var service = GetRequiredService<IGrantMatchWeightAppService>();
        var id = await GrantIdAsync();

        var impact = await service.PreviewImpactAsync(id, Input(global: false));

        impact.TotalFirms.ShouldBeGreaterThanOrEqualTo(0);
        impact.CurrentMatchingFirms.ShouldBeLessThanOrEqualTo(impact.TotalFirms);
        impact.NewMatchingFirms.ShouldBeLessThanOrEqualTo(impact.TotalFirms);
    }

    [Fact]
    public async Task Eksik_Veri_Tablosu_Alanlari_Sayar()
    {
        var service = GetRequiredService<IGrantMatchWeightAppService>();

        var rows = await service.GetMissingDataAsync();

        // Profili olmayan/boş bırakılmış her alan satır üretir; sayısı 0 olan satır elenir.
        rows.ShouldAllBe(r => r.FirmCount > 0);
        rows.Select(r => r.Field).Distinct().Count().ShouldBe(rows.Count);
    }

    /// <summary>
    /// Sonradan eklenen boyutun veritabanı varsayılanı 1,0: EF 0'ı "girilmemiş" sayarsa yeni
    /// satırda host'un kapattığı boyut sessizce yeniden açılırdı.
    /// </summary>
    [Fact]
    public async Task Oncelikli_Grup_Sifir_Agirligi_Yeni_Satirda_Korunur()
    {
        var service = GetRequiredService<IGrantMatchWeightAppService>();
        var id = await GrantIdAsync();
        var input = Input(global: false);
        input.Dimensions.Add(new() { Dimension = GrantMatchDimension.PriorityGroup, Multiplier = 0 });

        await service.UpdateAsync(id, input);

        (await service.GetAsync(id)).Dimensions
            .Single(d => d.Dimension == GrantMatchDimension.PriorityGroup).Multiplier.ShouldBe(0);
    }

    /// <summary>Host'un etki önizlemesi kurumun gerçek skorunu görür: beyan önizlemeye de girer.</summary>
    [Fact]
    public async Task Etki_Onizlemesi_Oncelikli_Grup_Beyanini_Gorur()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var currentTenant = GetRequiredService<ICurrentTenant>();
        var label = "oncelik-" + Guid.NewGuid().ToString("N")[..6];

        Guid tenantId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await GetRequiredService<ITenantManager>().CreateAsync(label);
            await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;
            await uow.CompleteAsync();
        }

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            using (currentTenant.Change(tenantId))
            {
                var profile = await GetRequiredService<IRepository<FirmProfile, Guid>>().InsertAsync(
                    new FirmProfile(Guid.NewGuid(), tenantId), autoSave: true);
                await GetRequiredService<IRepository<FirmProfileTag, Guid>>().InsertAsync(
                    new FirmProfileTag(Guid.NewGuid(), profile.Id, GrantCriteriaKind.Sektor, "oncelik-a"), autoSave: true);
                var definition = await GetRequiredService<IRepository<FirmParameterDefinition, Guid>>()
                    .GetAsync(FirmParameterCatalog.FemaleEntrepreneurId);
                await GetRequiredService<IRepository<FirmParameterValue, Guid>>().InsertAsync(
                    new FirmParameterValue(Guid.NewGuid(), tenantId, definition, new FirmParameterInput(Bool: true),
                        FirmParameterOrigin.UserEntry, DateTime.Now),
                    autoSave: true);
            }
            await uow.CompleteAsync();
        }

        var grantId = Guid.NewGuid();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<Grant, Guid>>().InsertAsync(
                new Grant(grantId, "Öncelik programı", "Test", 1_000_000m, 40) { PrefersFemaleEntrepreneur = true },
                autoSave: true);
            var tags = GetRequiredService<IRepository<GrantCriteriaTag, Guid>>();
            await tags.InsertAsync(new GrantCriteriaTag(Guid.NewGuid(), grantId, GrantCriteriaKind.Sektor, "oncelik-a"), autoSave: true);
            await tags.InsertAsync(new GrantCriteriaTag(Guid.NewGuid(), grantId, GrantCriteriaKind.Sektor, "oncelik-b"), autoSave: true);
            await uow.CompleteAsync();
        }

        // Yalnız öncelik boyutu kapatılıyor: skor 75'ten 50'ye iner.
        var input = new UpdateGrantMatchWeightDto
        {
            SizePenaltyEnabled = true,
            SkipMissingDimensions = true,
            Dimensions = new() { new() { Dimension = GrantMatchDimension.PriorityGroup, Multiplier = 0 } }
        };

        var impact = await GetRequiredService<IGrantMatchWeightAppService>().PreviewImpactAsync(grantId, input);

        var mover = impact.TopMovers.Single(m => m.TenantName == label);
        mover.CurrentScore.ShouldBe(75);
        mover.NewScore.ShouldBe(50);
    }

}
