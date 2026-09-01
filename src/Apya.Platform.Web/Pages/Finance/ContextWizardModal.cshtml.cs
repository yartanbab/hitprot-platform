using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// Bağlam sihirbazı (tasarım 1c) — projenin finans bağlamını gösterir ve bütçe
/// kalemlerini şablon önerisinden kurar.
///
/// KAPSAM, KULLANICI KARARIYLA DARALTILDI (2026-09-01):
///   • Kalem AĞACI yok — <see cref="ProjectBudgetLine"/> düz liste kalıyor.
///   • Sekme aç/kapa TOGGLE'ı yok — sekme seti şablondan türemeye devam ediyor,
///     burada salt-okunur gösterilir. Saklanmayan bir toggle ölü kontrol olurdu.
///   • "Şablon olarak kaydet" yok — kiracı seviyesinde finans şablonu varlığı
///     şemada yok.
///
/// KATEGORİYE DOKUNMAZ. Şablon projenin kategorisinden türer; kategoriyi buradan
/// değiştirmek <c>UpdateAsync(id, CreateProjectDto)</c> ile TÜM projeyi yeniden
/// yazmak demekti (16 alan + <c>AddTemplateTasks</c> yan etki bayrağı). Eksik
/// kopyalanan tek alan sessizce silinirdi; kategori düzenlemesi kendi ekranında
/// (proje düzenleme) zaten doğru yapılıyor, sihirbaz oraya yönlendirir.
/// </summary>
public class ContextWizardModalModel : AbpPageModel
{
    private readonly IProjectAppService _projectAppService;
    private readonly IProjectBudgetAppService _budgetAppService;

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    public string ProjectName { get; private set; } = string.Empty;
    public string CategoryName { get; private set; } = string.Empty;
    public string? CategoryIcon { get; private set; }
    public FinanceContextTemplate Template { get; private set; } = FinanceContextTemplate.Corporate;
    public IReadOnlyList<FinanceTabDefinition> Tabs { get; private set; } = Array.Empty<FinanceTabDefinition>();

    /// <summary>Projede zaten kalem varsa sihirbaz kalem kurmayı ÖNERMEZ, uyarır.</summary>
    public int ExistingLineCount { get; private set; }

    /// <summary>Formdan gelen kalem satırları; boş adlı satırlar atılır.</summary>
    [BindProperty]
    public List<PresetRow> Rows { get; set; } = new();

    public class PresetRow
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public decimal Amount { get; set; }
    }

    public ContextWizardModalModel(
        IProjectAppService projectAppService,
        IProjectBudgetAppService budgetAppService)
    {
        _projectAppService = projectAppService;
        _budgetAppService = budgetAppService;
    }

    public async Task<IActionResult> OnGetAsync()
    {
        var project = await _projectAppService.GetDetailAsync(ProjectId);

        ProjectName = project.Name;
        CategoryName = project.CategoryName;
        CategoryIcon = project.CategoryIcon;
        Template = FinanceContext.Resolve(project.CategorySystemKey);
        Tabs = FinanceContext.TabsFor(Template);

        ExistingLineCount = (await _budgetAppService.GetLinesAsync(ProjectId)).Count;
        Rows = PresetFor(Template);

        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // Adı boş satır kullanıcının sildiği satırdır; sessizce atlanır.
        var wanted = Rows
            .Where(r => !string.IsNullOrWhiteSpace(r.Name))
            .Select(r => new CreateUpdateBudgetLineDto
            {
                Code = string.IsNullOrWhiteSpace(r.Code) ? null : r.Code!.Trim(),
                Name = r.Name!.Trim(),
                PlannedAmount = r.Amount
            })
            .ToList();

        // HEPSİNİ ÖNCE DOĞRULA, sonra yaz. Kalem kodu çakışırsa CreateLineAsync
        // ortada patlar ve sihirbaz YARIM uygulanmış olurdu: bir kısmı eklenmiş,
        // kullanıcı hangisinin girdiğini bilmiyor. ApplyRevisionAsync'te de aynı
        // kural var — çok kalemli işlem ya tümüyle olur ya hiç.
        EnsureCodesAreUnique(wanted, await ExistingCodesAsync());

        foreach (var line in wanted)
        {
            await _budgetAppService.CreateLineAsync(ProjectId, line);
        }

        return NoContent();
    }

    private async Task<HashSet<string>> ExistingCodesAsync()
        => (await _budgetAppService.GetLinesAsync(ProjectId))
            .Where(l => !string.IsNullOrWhiteSpace(l.Code))
            .Select(l => l.Code)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Kod çakışmasını TEK seferde bildirir: hem formun kendi içinde hem projede
    /// zaten duran kalemlere karşı. Kodsuz satır serbesttir (kod opsiyonel).
    /// </summary>
    private void EnsureCodesAreUnique(List<CreateUpdateBudgetLineDto> wanted, HashSet<string> existing)
    {
        var clashes = new List<string>();
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var line in wanted.Where(l => !string.IsNullOrWhiteSpace(l.Code)))
        {
            if (!seen.Add(line.Code!))
            {
                clashes.Add($"{line.Code} (formda iki kez)");
            }
            else if (existing.Contains(line.Code!))
            {
                clashes.Add($"{line.Code} (projede zaten var)");
            }
        }

        if (clashes.Count > 0)
        {
            throw new Volo.Abp.UserFriendlyException(
                "Şu kalem kodları kullanılamaz: " + string.Join(", ", clashes) +
                ". Kodları düzeltin ya da boş bırakın; hiçbir kalem eklenmedi.");
        }
    }

    /// <summary>
    /// Şablona göre kalem ÖNERİSİ. Yalnız AD önerilir; tutarlar sıfır gelir —
    /// kullanıcının girmediği bir bütçeyi ekrana yazmak uydurma veri olurdu.
    /// Satırlar formda serbestçe düzenlenir, silinir, çoğaltılır.
    /// </summary>
    public static List<PresetRow> PresetFor(FinanceContextTemplate template) => template switch
    {
        FinanceContextTemplate.Grant => new()
        {
            new() { Code = "1", Name = "Personel" },
            new() { Code = "2", Name = "Seyahat ve konaklama" },
            new() { Code = "3", Name = "Ekipman ve malzeme" },
            new() { Code = "4", Name = "Hizmet alımı" },
            new() { Code = "5", Name = "Dolaylı giderler" },
        },
        FinanceContextTemplate.Event => new()
        {
            new() { Code = "1", Name = "Mekân ve lojistik" },
            new() { Code = "2", Name = "Konuşmacı ve program" },
            new() { Code = "3", Name = "İkram" },
            new() { Code = "4", Name = "Tanıtım ve basılı malzeme" },
        },
        _ => new()
        {
            new() { Code = "1", Name = "Personel" },
            new() { Code = "2", Name = "Hizmet alımı" },
            new() { Code = "3", Name = "Ekipman" },
            new() { Code = "4", Name = "Diğer giderler" },
        }
    };
}
