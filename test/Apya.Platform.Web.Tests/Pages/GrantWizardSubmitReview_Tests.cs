using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// H-04 · "Kuruma gönder" geri alınamaz; önce özet: bütün adımlardaki boş alanlar, eksik zorunlu evrak.
/// Kendi programı/çağrısı/başvurusuyla kurulur — sihirbaz testlerinin paylaştığı başvuruya dokunmaz.
/// </summary>
public class GrantWizardSubmitReview_Tests : PlatformWebTestBase
{
    private async Task<Guid> CreateFreshApplicationAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);

        var grant = new Grant(Guid.NewGuid(), "Özet Testi Programı " + Guid.NewGuid().ToString("N")[..6], "Test Kurumu", 1_000_000m, 50);
        await GetRequiredService<IRepository<Grant, Guid>>().InsertAsync(grant, autoSave: true);
        await GetRequiredService<IRepository<GrantEligibleCostItem, Guid>>().InsertAsync(
            new GrantEligibleCostItem(Guid.NewGuid(), grant.Id, GrantCostItemKind.Personel, null), autoSave: true);

        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/10", GrantCallStatus.Acik);
        call.SetSchedule(DateTime.Today.AddDays(-1), DateTime.Today.AddDays(30));
        await GetRequiredService<IRepository<GrantCall, Guid>>().InsertAsync(call, autoSave: true);

        var application = new GrantApplication(Guid.NewGuid(), null, call.Id);
        await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(application, autoSave: true);

        var docs = GetRequiredService<IRepository<GrantApplicationDocument, Guid>>();
        await docs.InsertAsync(new GrantApplicationDocument(Guid.NewGuid(), null, application.Id, null,
            "QA Faaliyet belgesi", GrantDocumentObligation.Zorunlu, GrantPartyRole.Firma, false, 1), autoSave: true);
        await docs.InsertAsync(new GrantApplicationDocument(Guid.NewGuid(), null, application.Id, null,
            "QA Koşullu belge", GrantDocumentObligation.Kosullu, GrantPartyRole.Firma, false, 2), autoSave: true);

        await uow.CompleteAsync();
        return application.Id;
    }

    [Fact]
    public async Task Ozet_butun_adimlardaki_bos_alanlari_ve_eksik_zorunlu_evraki_listeler()
    {
        var id = await CreateFreshApplicationAsync();

        var review = await GetRequiredService<IGrantApplicationWizardAppService>().GetSubmitReviewAsync(id);

        review.MissingFields.Select(f => f.FieldKey).ShouldContain(GrantApplicationWizardAppService.FieldSummaryTitle);
        review.MissingFields.Select(f => f.FieldKey).ShouldContain(GrantApplicationWizardAppService.BudgetFieldKey(GrantCostItemKind.Personel));
        review.MissingDocuments.Count.ShouldBe(1, "koşullu belge zorunlu sayılmaz");
        review.MissingDocuments.ShouldContain("QA Faaliyet belgesi");
        review.CompletionPercent.ShouldBe(0);
    }

    /// <summary>Gönder adımında sağ panel ve "N alan hâlâ boş" uyarısı bütün adımları sayar (eskiden hep 0).</summary>
    [Fact]
    public async Task Gonder_adiminda_kalanlar_butun_adimlari_kapsar()
    {
        var id = await CreateFreshApplicationAsync();
        var wizard = GetRequiredService<IGrantApplicationWizardAppService>();

        var dto = await wizard.SetStepAsync(id, 4);

        dto.PendingFields.Select(f => f.FieldKey).ShouldContain(GrantApplicationWizardAppService.FieldSummaryTitle);
        dto.PendingFields.Select(f => f.FieldKey).ShouldContain(GrantApplicationWizardAppService.BudgetFieldKey(GrantCostItemKind.Personel));
    }

    [Fact]
    public void Kuruma_gonder_once_ozeti_acar()
    {
        var js = File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(),
            "src", "Apya.Platform.Web", "Pages", "Grants", "Wizard.js"));

        js.ShouldContain("service.getSubmitReview(appId)");
        var click = js.Substring(js.IndexOf("$('#NextBtn').on('click'", StringComparison.Ordinal), 400);
        click.ShouldContain("openSubmitReview();");
        click.ShouldNotContain("service.submit(appId)");
    }
}
