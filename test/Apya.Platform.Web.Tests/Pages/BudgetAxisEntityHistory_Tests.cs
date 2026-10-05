using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Microsoft.Extensions.Options;
using Shouldly;
using Volo.Abp.Auditing;
using Volo.Abp.AuditLogging;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// SEC-04 · Proje bütçe ekseni alan düzeyi geçmişe (AbpEntityChanges) yazılır.
///
/// <para>Fatura, gider, gelir ve hibe tutarları için "kim, ne zaman, kaçtan kaça" sorusu
/// cevaplanabiliyordu; projenin kendi bütçesi için cevaplanamıyordu. Bütçe kalemi 100 binden
/// 150 bine çekilse, dilim tahsilatı değişse ya da projenin toplam bütçesi güncellense geriye
/// yalnız "son değiştiren" kalıyordu — eski değer hiçbir yerde durmuyordu.</para>
/// </summary>
public class BudgetAxisEntityHistory_Tests : PlatformWebTestBase
{
    [Theory]
    [InlineData(typeof(Project))]
    [InlineData(typeof(ProjectBudgetLine))]
    [InlineData(typeof(FundingTranche))]
    [InlineData(typeof(TrancheDeduction))]
    public void Butce_Ekseni_Kayitlari_Entity_Gecmisinde(Type type)
    {
        var options = GetRequiredService<IOptions<AbpAuditingOptions>>().Value;

        options.EntityHistorySelectors.Any(s => s.Predicate(type)).ShouldBeTrue($"{type.Name} geçmişe yazılmıyor");
    }

    /// <summary>
    /// Seçici listesine bakmak yetmez: değerin gerçekten yazıldığı ölçülür. Kalemin planlanan
    /// tutarı değiştirilir, sonra geçmişte eski ve yeni değer aranır.
    /// </summary>
    [Fact]
    public async Task Butce_Kalemi_Tutari_Degisince_Eski_Ve_Yeni_Deger_Gecmise_Yazilir()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var projectId = Guid.NewGuid();
        var code = "SEC04-" + Guid.NewGuid().ToString("N")[..6];
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<Project, Guid>>()
                .InsertAsync(new Project(projectId, null, null, "Geçmiş " + code, code, "test"), autoSave: true);
            await uow.CompleteAsync();
        }

        var budget = GetRequiredService<IProjectBudgetAppService>();
        var line = await budget.CreateLineAsync(
            projectId, new CreateUpdateBudgetLineDto { Name = "Personel", PlannedAmount = 100_000m });

        using (var scope = GetRequiredService<IAuditingManager>().BeginScope())
        {
            await budget.UpdateLineAsync(
                line.Id, new CreateUpdateBudgetLineDto { Name = "Personel", PlannedAmount = 150_000m });
            await scope.SaveAsync();
        }

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var changes = await GetRequiredService<IAuditLogRepository>().GetEntityChangeListAsync(
                entityId: line.Id.ToString(),
                entityTypeFullName: typeof(ProjectBudgetLine).FullName,
                includeDetails: true);

            var planned = changes
                .SelectMany(c => c.PropertyChanges)
                .Where(p => p.PropertyName == nameof(ProjectBudgetLine.PlannedAmount))
                .ToList();

            planned.ShouldContain(
                p => p.OriginalValue != null && p.OriginalValue.Contains("100000")
                     && p.NewValue != null && p.NewValue.Contains("150000"),
                "planlanan tutarın eski ve yeni değeri geçmişte yok");

            await uow.CompleteAsync();
        }
    }
}
