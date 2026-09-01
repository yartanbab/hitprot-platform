using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 3b · Aşama şablonu düzenleyicisi + 1b'nin Evrak ve Süreç bölümleri.
/// Test host'u AddAlwaysAllowAuthorization kullanır; gerçek host'ta erişimi
/// <c>[Authorize(PlatformPermissions.Grants.Edit)]</c> (host-only izin) kapatır.
/// </summary>
public class GrantStageTemplate_Tests : PlatformWebTestBase
{
    private async Task<Guid> FirstGrantIdAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin();
        var repo = GetRequiredService<IRepository<Grant, Guid>>();
        return (await repo.GetListAsync()).OrderBy(g => g.Name).First().Id;
    }

    private static CreateUpdateGrantStageTemplateDto NewTemplate(string name, params string[] stepNames)
        => new()
        {
            Name = name,
            Steps = stepNames.Select((n, i) => new GrantStageTemplateStepDto
            {
                Order = i,
                Name = n,
                Owner = GrantPartyRole.Ortak
            }).ToList()
        };

    [Fact]
    public async Task Varsayilan_Sablon_Tohumlanmis()
    {
        var service = GetRequiredService<IGrantStageTemplateAppService>();

        var list = await service.GetListAsync();

        var def = list.SingleOrDefault(t => t.IsDefault);
        def.ShouldNotBeNull("tohumlayıcı bir varsayılan şablon kurmalı");
        def!.Steps.Count.ShouldBe(4);
        def.Steps.Select(s => s.Order).ShouldBe(new[] { 0, 1, 2, 3 });
        def.Steps[0].Name.ShouldBe("Başvuru");
    }

    [Fact]
    public async Task Sayfa_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/StageTemplates");

        html.ShouldContain("apya-tpl-layout");
        html.ShouldContain("Pano Önizlemesi");
        html.ShouldContain("Tamamlanma koşulu");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"StageTemplates[^""]*\.js")
            .ShouldBeTrue("sayfa demeti StageTemplates.js içermeli");
    }

    [Fact]
    public async Task Sablon_Olusturulur_Ve_Adimlar_Sirayla_Saklanir()
    {
        var service = GetRequiredService<IGrantStageTemplateAppService>();

        var created = await service.CreateAsync(
            NewTemplate("KOSGEB Kısa Süreç", "İlgi", "Hazırlık", "Sunum"));

        created.Steps.Select(s => s.Name).ShouldBe(new[] { "İlgi", "Hazırlık", "Sunum" });
        created.Steps.Select(s => s.Order).ShouldBe(new[] { 0, 1, 2 });

        // Yeniden sıralama: adımlar sil-yeniden ekle ile yazılır, sıra girdiden gelir.
        var reordered = NewTemplate("KOSGEB Kısa Süreç", "Sunum", "İlgi");
        var updated = await service.UpdateAsync(created.Id, reordered);

        updated.Steps.Select(s => s.Name).ShouldBe(new[] { "Sunum", "İlgi" });
        updated.Steps.Select(s => s.Order).ShouldBe(new[] { 0, 1 });
    }

    [Fact]
    public async Task Varsayilan_Isaretlemek_Digerini_Dusurur()
    {
        var service = GetRequiredService<IGrantStageTemplateAppService>();
        var onceki = (await service.GetListAsync()).Single(t => t.IsDefault);

        var input = NewTemplate("Yeni Varsayılan", "Tek aşama");
        input.IsDefault = true;
        var yeni = await service.CreateAsync(input);

        var list = await service.GetListAsync();
        list.Single(t => t.IsDefault).Id.ShouldBe(yeni.Id);
        list.Single(t => t.Id == onceki.Id).IsDefault.ShouldBeFalse();
    }

    [Fact]
    public async Task Programa_Bagli_Sablon_Silinemez()
    {
        var templateService = GetRequiredService<IGrantStageTemplateAppService>();
        var paramService = GetRequiredService<IGrantParameterAppService>();

        var template = await templateService.CreateAsync(NewTemplate("Silinemez", "Tek"));
        var grantId = await FirstGrantIdAsync();

        await paramService.UpdateAsync(grantId, new UpdateGrantParameterDto
        {
            Name = "Bağlı program",
            Issuer = "Kurum",
            StageTemplateId = template.Id
        });

        var ex = await Should.ThrowAsync<Volo.Abp.BusinessException>(
            () => templateService.DeleteAsync(template.Id));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantStageTemplateInUse);
    }

    [Fact]
    public async Task Evrak_Ve_Sablon_Parametre_Formunda_Gidip_Geliyor()
    {
        var templateService = GetRequiredService<IGrantStageTemplateAppService>();
        var paramService = GetRequiredService<IGrantParameterAppService>();

        var template = await templateService.CreateAsync(NewTemplate("Süreç", "Başvuru", "Sonuç"));
        var grantId = await FirstGrantIdAsync();

        var saved = await paramService.UpdateAsync(grantId, new UpdateGrantParameterDto
        {
            Name = "Evrak testi",
            Issuer = "Kurum",
            StageTemplateId = template.Id,
            DocumentRequirements =
            {
                new GrantDocumentRequirementDto
                {
                    Order = 0,
                    Name = "KOBİ beyannamesi",
                    Obligation = GrantDocumentObligation.Zorunlu,
                    UploaderParty = GrantPartyRole.Firma
                },
                new GrantDocumentRequirementDto
                {
                    Order = 1,
                    Name = "Patent belgesi",
                    Obligation = GrantDocumentObligation.Kosullu,
                    UploaderParty = GrantPartyRole.Danisman,
                    RequiresESignature = true
                }
            }
        });

        saved.DocumentRequirements.Count.ShouldBe(2);
        saved.StageTemplateId.ShouldBe(template.Id);

        // Yeniden okuma da aynı veriyi vermeli (yazma yolu girdiden dönüyor, okuma DB'den).
        var reread = await paramService.GetAsync(grantId);
        reread.StageTemplateName.ShouldBe("Süreç");
        reread.StageStepCount.ShouldBe(2);
        reread.DocumentRequirements.Select(d => d.Name)
            .ShouldBe(new[] { "KOBİ beyannamesi", "Patent belgesi" });
        reread.DocumentRequirements[1].RequiresESignature.ShouldBeTrue();
        reread.DocumentRequirements[1].UploaderParty.ShouldBe(GrantPartyRole.Danisman);
    }

    [Fact]
    public async Task Evrak_Ve_Sablon_Tamamlanma_Yuzdesini_Yukseltir()
    {
        var templateService = GetRequiredService<IGrantStageTemplateAppService>();
        var paramService = GetRequiredService<IGrantParameterAppService>();
        var template = await templateService.CreateAsync(NewTemplate("Yüzde", "Tek"));
        var grantId = await FirstGrantIdAsync();

        var bos = new UpdateGrantParameterDto { Name = "P", Issuer = "K" };
        var oncesi = await paramService.PreviewMatchAsync(grantId, bos);

        var dolu = new UpdateGrantParameterDto
        {
            Name = "P",
            Issuer = "K",
            StageTemplateId = template.Id,
            DocumentRequirements = { new GrantDocumentRequirementDto { Name = "Belge" } }
        };
        var sonrasi = await paramService.PreviewMatchAsync(grantId, dolu);

        sonrasi.CompletionPercent.ShouldBeGreaterThan(oncesi.CompletionPercent);
    }
}
