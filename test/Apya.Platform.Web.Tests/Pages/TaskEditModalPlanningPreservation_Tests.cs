using System;
using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Yedek Razor görev düzenleme modalı (Pages/Tasks/EditModal) planlama alanlarını
/// (tahmini süre, tür, sprint) formda BASMIYOR. UpdateAsync ise bu alanları koşulsuz
/// yazdığı için her otomatik kayıt onları siliyordu — STA-01 ile aynı sınıf (tam
/// değiştirme sözleşmesinde DTO'dan düşen alan silinir).
///
/// <para>Koruma OnPostAsync'te mevcut görevden geri yazılarak yapılır. Form bir gün bu
/// alanları basarsa koruma kullanıcının girdisini ezer; o zaman koruma bütçedeki
/// <c>BudgetFormRendered</c> deseniyle koşula bağlanmalı — ikinci test bunu hatırlatır.</para>
/// </summary>
public class TaskEditModalPlanningPreservation_Tests
{
    private static readonly string[] PlanningFields = { "EstimatedHours", "TaskType", "Sprint" };

    [Fact]
    public void OnPostAsync_planlama_alanlarini_mevcut_gorevden_korur()
    {
        var source = File.ReadAllText(Path.Combine(FindWebProjectRoot(), "Pages", "Tasks", "EditModal.cshtml.cs"));

        var start = source.IndexOf("public async Task<IActionResult> OnPostAsync()", StringComparison.Ordinal);
        start.ShouldBeGreaterThan(-1, "OnPostAsync bulunamadı");
        var end = source.IndexOf("public async Task<IActionResult> OnPost", start + 1, StringComparison.Ordinal);
        var body = end > start ? source[start..end] : source[start..];

        foreach (var field in PlanningFields)
        {
            body.ShouldContain($"Task.{field} = current.{field}",
                customMessage: $"OnPostAsync {field} alanını mevcut görevden korumuyor — otomatik kayıt siler");
        }
    }

    [Fact]
    public void Form_planlama_alanlarini_basmiyor()
    {
        var markup = File.ReadAllText(Path.Combine(FindWebProjectRoot(), "Pages", "Tasks", "EditModal.cshtml"));

        foreach (var field in PlanningFields)
        {
            markup.ShouldNotContain($"asp-for=\"Task.{field}\"",
                customMessage: $"Form Task.{field} alanını basıyor: OnPostAsync'teki koruma kullanıcının girdisini ezer. " +
                               "Form bu alanı basıyorsa koruma BudgetFormRendered gibi koşula bağlanmalı.");
        }
    }

    private static string FindWebProjectRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(dir.FullName, "src", "Apya.Platform.Web");
            if (Directory.Exists(candidate))
            {
                return candidate;
            }

            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException("Apya.Platform.Web proje kökü bulunamadı.");
    }
}
