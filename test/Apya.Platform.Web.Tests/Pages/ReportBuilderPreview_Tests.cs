using System;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Pages;

/// <summary>
/// 🔴 RPT-02 · Rapor derleyici önizlemesi UÇTAN UCA: şablonda açık bölümün verisi gerçek
/// kurucudan geçip modele doluyor mu.
///
/// <para>Bu sayfanın ve kurucunun (<c>DeliveryReportModelBuilder</c>) şimdiye kadar hiç
/// testi yoktu; çizim (<c>DeliveryReportSections_Tests</c>) ile veri kaynağı ayrı ayrı
/// yeşil olabilir ama ikisini bağlayan kurucu unutulursa rapor yine boş çıkar — RPT-01'in
/// hatası tam olarak bu bağdaydı.</para>
///
/// <para>Önizleme, üretimle AYNI kurucuyu kullanır; burada ölçülen şey kuruma giden
/// raporun da verisidir.</para>
/// </summary>
public class ReportBuilderPreview_Tests : PlatformWebTestBase
{
    /// <summary>Host bağlamında proje + 3 görev + 2 bütçe kalemi + her bölümü açık bir şablon.</summary>
    private async Task<(Guid ProjectId, Guid TemplateId)> SetupAsync()
    {
        var projectId = Guid.NewGuid();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            GetRequiredService<ICurrentTenant>().Id.ShouldBeNull("test host bağlamında koşmalı");

            var code = "RB-" + Guid.NewGuid().ToString("N")[..6];
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, null, null, "Rapor Projesi " + code, code, "önizleme testi",
                    totalBudget: 999_999m),
                autoSave: true);

            var taskRepo = GetRequiredService<IRepository<TaskItem, Guid>>();
            var now = DateTime.Now;

            var done1 = new TaskItem(Guid.NewGuid(), "Biten 1", projectId, now: now);
            done1.ChangeStatus(TaskStatus.Done, now);
            var done2 = new TaskItem(Guid.NewGuid(), "Biten 2", projectId, now: now);
            done2.ChangeStatus(TaskStatus.Done, now);
            // Açık ve tarihi geçmiş → gecikmiş.
            var late = new TaskItem(Guid.NewGuid(), "Geciken", projectId, dueDate: now.AddDays(-3), now: now.AddDays(-10));

            await taskRepo.InsertAsync(done1, autoSave: true);
            await taskRepo.InsertAsync(done2, autoSave: true);
            await taskRepo.InsertAsync(late, autoSave: true);

            var lineRepo = GetRequiredService<IRepository<ProjectBudgetLine, Guid>>();
            await lineRepo.InsertAsync(
                new ProjectBudgetLine(Guid.NewGuid(), null, projectId, "01", "Personel", 300_000m, 300_000m, 0),
                autoSave: true);
            await lineRepo.InsertAsync(
                new ProjectBudgetLine(Guid.NewGuid(), null, projectId, "02", "Makine", 200_000m, 200_000m, 1),
                autoSave: true);

            await uow.CompleteAsync();
        }

        // Yeni özel şablon: her uygun bölüm AÇIK doğar.
        var template = await GetRequiredService<IReportTemplateAppService>().CreateAsync(
            new CreateUpdateReportTemplateDto
            {
                Name = "Bütünleşik " + Guid.NewGuid().ToString("N")[..6],
                Recipient = ReportRecipient.Internal,
                Order = 1,
            });

        return (projectId, template.Id);
    }

    private async Task<JsonElement> GetPreviewAsync(Guid projectId, Guid? templateId)
    {
        var url = $"/Documents/ReportBuilder?handler=Preview&projectId={projectId}"
                  + (templateId.HasValue ? $"&templateId={templateId}" : string.Empty);
        var json = await GetResponseAsStringAsync(url);
        return JsonDocument.Parse(json).RootElement;
    }

    [Fact]
    public async Task Gorev_ilerlemesi_bolumu_gercek_gorevlerden_doluyor()
    {
        var (projectId, templateId) = await SetupAsync();

        var model = await GetPreviewAsync(projectId, templateId);
        var tasks = model.GetProperty("taskProgress");

        tasks.GetProperty("total").GetInt32().ShouldBe(3);
        tasks.GetProperty("done").GetInt32().ShouldBe(2);
        tasks.GetProperty("overdue").GetInt32().ShouldBe(1);
        tasks.GetProperty("completionPercent").GetInt32().ShouldBe(67, "2 / 3");
    }

    /// <summary>
    /// Bütçe özeti Finans çatısıyla AYNI servisten gelir: kalem varsa onaylanan bütçe
    /// kalemlerin toplamıdır, <c>Project.TotalBudget</c> (burada 999.999) DEĞİL.
    /// </summary>
    [Fact]
    public async Task Butce_ozeti_bolumu_kalemlerden_doluyor()
    {
        var (projectId, templateId) = await SetupAsync();

        var model = await GetPreviewAsync(projectId, templateId);
        var budget = model.GetProperty("budgetSummary");

        budget.GetProperty("approvedBudget").GetDecimal().ShouldBe(500_000m);
        budget.GetProperty("spentAmount").GetDecimal().ShouldBe(0m);
        budget.GetProperty("remainingBudget").GetDecimal().ShouldBe(500_000m);
        budget.GetProperty("lines").GetArrayLength().ShouldBe(2);
        budget.GetProperty("lines")[0].GetProperty("name").GetString().ShouldBe("Personel", "kalemler sırasıyla");
    }

    /// <summary>
    /// Bölüm şablonda açık DEĞİLSE verisi de çekilmez. Şablonsuz önizleme varsayılan dört
    /// bölümle koşar (özet, uygunluk, eksikler, ek dizini): bütçe ve görev sorgusu açılmamalı.
    /// </summary>
    [Fact]
    public async Task Kapali_bolumun_verisi_cekilmez()
    {
        var (projectId, _) = await SetupAsync();

        var model = await GetPreviewAsync(projectId, templateId: null);

        model.GetProperty("budgetSummary").ValueKind.ShouldBe(JsonValueKind.Null);
        model.GetProperty("taskProgress").ValueKind.ShouldBe(JsonValueKind.Null);
    }

    /// <summary>Aynı modelden PDF de üretilebilmeli — on dört bölüm açıkken çizim düşmemeli.</summary>
    [Fact]
    public async Task Tum_bolumler_acikken_onizleme_pdf_uretiliyor()
    {
        var (projectId, templateId) = await SetupAsync();

        var response = await Client.GetAsync(
            $"/Documents/ReportBuilder?handler=PreviewPdf&projectId={projectId}&templateId={templateId}");

        ((int)response.StatusCode).ShouldBe(200);
        response.Content.Headers.ContentType!.MediaType.ShouldBe("application/pdf");
        (await response.Content.ReadAsByteArrayAsync()).Length.ShouldBeGreaterThan(1000);
    }
}
