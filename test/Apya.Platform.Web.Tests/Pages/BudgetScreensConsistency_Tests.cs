using System;
using System.Net;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// SÖZLEŞME: bütçeyi gösteren ekranlar AYNI rakamı basar.
///
/// <para>Önceden proje detayındaki "Bütçe Durumu" modalı ile Finans → Genel sekmesi
/// iki ayrı servisten besleniyordu: modal <c>Project.TotalBudget</c>'ı okuyordu,
/// Finans çatısı ise kalem toplamını + revizyonu. Kalem tanımlı bir projede aynı
/// proje iki ekranda iki farklı bütçe gösteriyordu.</para>
///
/// <para>Bu test üç sayfayı da (modal, Finans çatısı, Raporlar) GERÇEKTEN çağırır ve
/// çıktılarını karşılaştırır — servis testi tek başına markup'ın hangi alanı
/// bastığını kanıtlamaz.</para>
/// </summary>
public class BudgetScreensConsistency_Tests : PlatformWebTestBase
{
    /// <summary>
    /// Proje bütçesi 1.000.000 ama kalem 500.000, revizyonla 400.000'e iner.
    /// Doğru cevap: sözleşme 500.000, onaylanan 400.000 — 1.000.000 DEĞİL.
    /// </summary>
    private async Task<Guid> CreateProjectWithRevisedLineAsync(string code)
    {
        var projectId = Guid.NewGuid();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<Project, Guid>>();
            await repository.InsertAsync(
                new Project(projectId, null, null, "Bütçe Tutarlılığı " + code, code,
                    "İki ekran senkron testi", 1_000_000m, 0m, "TRY"),
                autoSave: true);

            await uow.CompleteAsync();
        }

        var budgetAppService = GetRequiredService<IProjectBudgetAppService>();

        var line = await budgetAppService.CreateLineAsync(projectId, new CreateUpdateBudgetLineDto
        {
            Code = "1", Name = "Personel", PlannedAmount = 500_000m,
        });

        await budgetAppService.ApplyRevisionAsync(projectId, new ApplyBudgetRevisionDto
        {
            Reason = "Kesinti sonrası",
            EffectiveDate = new DateTime(2026, 8, 15),
            Changes = { [line.Id] = 400_000m },
        });

        return projectId;
    }

    [Fact]
    public async Task Butce_ekranlari_ayni_tutarlari_basar()
    {
        var projectId = await CreateProjectWithRevisedLineAsync("BSC-1");

        // Razor ASCII dışı her karakteri kaçırır (₺ → &#x20BA;); çözmeden aranmaz.
        var modal = WebUtility.HtmlDecode(
            await GetResponseAsStringAsync($"/Projects/BudgetSummaryModal?projectId={projectId}"));
        var hub = WebUtility.HtmlDecode(
            await GetResponseAsStringAsync($"/Finance?projectId={projectId}&tab=genel"));
        var report = WebUtility.HtmlDecode(
            await GetResponseAsStringAsync($"/Reports/ProjectBudget?ProjectId={projectId}"));

        foreach (var html in new[] { modal, hub, report })
        {
            html.ShouldContain("Sözleşme bütçesi");
            html.ShouldContain("Onaylanan bütçe");
            html.ShouldContain("₺500.000");   // sözleşme tutarı, revizyondan etkilenmez
            html.ShouldContain("₺400.000");   // yürürlükteki tutar
            html.ShouldContain("Rev.1");

            // Eski hesabın rakamı: modal bunu basıyordu, hub basmıyordu.
            html.ShouldNotContain("₺1.000.000");
        }
    }
}
