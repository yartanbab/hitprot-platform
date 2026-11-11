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
/// Sihirbazdaki "PDF indir": başvurunun özeti (program, proje özeti, hedefler, bütçe) sihirbazın
/// servisinden okunup PDF'e yazılır. Kendi programı/çağrısı/başvurusuyla kurulur.
/// </summary>
public class GrantApplicationPdf_Tests : PlatformWebTestBase
{
    private readonly string _code = Guid.NewGuid().ToString("N")[..6];

    private async Task<Guid> CreateApplicationAsync()
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);

        var grant = new Grant(Guid.NewGuid(), "Program " + _code, "Kurum " + _code, 1_000_000m, 50);
        await GetRequiredService<IRepository<Grant, Guid>>().InsertAsync(grant, autoSave: true);
        await GetRequiredService<IRepository<GrantEligibleCostItem, Guid>>().InsertAsync(
            new GrantEligibleCostItem(Guid.NewGuid(), grant.Id, GrantCostItemKind.Personel, null), autoSave: true);

        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2031/1", GrantCallStatus.Acik);
        call.SetSchedule(DateTime.Today.AddDays(-1), DateTime.Today.AddDays(30));
        await GetRequiredService<IRepository<GrantCall, Guid>>().InsertAsync(call, autoSave: true);

        var application = new GrantApplication(Guid.NewGuid(), null, call.Id);
        await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(application, autoSave: true);

        await uow.CompleteAsync();
        return application.Id;
    }

    [Fact]
    public async Task Pdf_proje_ozeti_hedef_ve_butceyi_tasir()
    {
        var id = await CreateApplicationAsync();
        var wizard = GetRequiredService<IGrantApplicationWizardAppService>();
        await wizard.SaveSummaryAsync(new SaveWizardSummaryInput
        {
            ApplicationId = id,
            ProjectTitle = "Güneş Paneli Ar-Ge " + _code,
            ProjectSummary = "Özet metni " + _code,
            ProjectDurationMonths = 18
        });
        await wizard.AddTargetAsync(new SaveWizardTargetInput
        {
            ApplicationId = id, Name = "Verim " + _code, Unit = "%", BaselineValue = 10, TargetValue = 25
        });
        await wizard.SaveBudgetLineAsync(new SaveWizardBudgetLineInput
        {
            ApplicationId = id, Kind = GrantCostItemKind.Personel, Amount = 120_000m, Justification = "Uzman " + _code
        });

        var response = await GetResponseAsync($"/Grants/Wizard?id={id}&handler=Pdf");
        response.Content.Headers.ContentType!.MediaType.ShouldBe("application/pdf");

        using var pdf = UglyToad.PdfPig.PdfDocument.Open(await response.Content.ReadAsByteArrayAsync());
        // Boşluklar güvenilir değil; yazı tipi "ti"yi bitişik çizer — denetlenen metinlerde "ti" yok.
        var text = string.Concat(pdf.GetPages().Select(p => p.Text)).Replace(" ", "");
        text.ShouldContain(("Güneş Paneli Ar-Ge " + _code).Replace(" ", ""));
        text.ShouldContain(("Özet metni " + _code).Replace(" ", ""));
        text.ShouldContain(("Verim " + _code).Replace(" ", ""));
        text.ShouldContain("Personel");
        text.ShouldContain(("Uzman " + _code).Replace(" ", ""));
        text.ShouldContain("Program" + _code);
    }

    [Fact]
    public async Task Sihirbaz_pdf_baglantisini_bu_basvuru_icin_basar()
    {
        var id = await CreateApplicationAsync();

        var html = await GetResponseAsStringAsync($"/Grants/Wizard?id={id}");

        html.ShouldContain($"href=\"/Grants/Wizard?id={id}&handler=Pdf\"");
    }
}
