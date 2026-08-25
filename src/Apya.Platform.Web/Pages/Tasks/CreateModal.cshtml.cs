using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Apya.Platform.Features;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Apya.Platform.Tasks;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Features;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Web.Pages.Tasks;

public class CreateModalModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid? ProjectId { get; set; }

    [BindProperty]
    public CreateUpdateTaskDto Task { get; set; } = new();

    // Birleşik "Durum / Kolon" seçimi — "s:<int>" sistem durumu, "c:<guid>" özel kolon.
    // SupportsGet: kanban kolon başlığındaki ＋ bu değeri geçirerek o kolonu ön seçer.
    [BindProperty(SupportsGet = true)]
    public string? StatusOrColumn { get; set; }

    public List<SelectListItem> UserList { get; set; } = new();
    public List<SelectListItem> StatusOrColumnList { get; set; } = new();

    /// <summary>Proje bağlamı verilmeden açıldığında (Görevler ekranı, ⌘K paleti) seçilebilecek projeler.</summary>
    public List<SelectListItem> ProjectList { get; set; } = new();

    /// <summary>Select2 tags:true widget'ının başlangıç seçenek listesi (mevcut tüm etiketler).</summary>
    public List<string> AllTagNames { get; set; } = new();

    // ── Ekstra konfigürasyonlar ───────────────────────────────────────────────
    // Üç kapı AND'lenir: paket feature'ı (kiracı satın aldı mı) → izin (bu kullanıcı
    // yetkili mi) → ayar (görmek istiyor mu). Biri kapalıysa parça hiç render EDİLMEZ.

    /// <summary>Hızlı giriş satırı çizilsin mi? (feature + izin + ayar)</summary>
    public bool ShowQuickEntry { get; set; }

    /// <summary>Planlama alanları ("Daha fazla" açılırı) çizilsin mi? (feature + izin)</summary>
    public bool ShowPlanningFields { get; set; }

    /// <summary>İşaretçi ipuçları ve ⌘↵ rozeti çizilsin mi? (ayar)</summary>
    public bool ShowKeyboardHints { get; set; } = PlatformSettingDefaults.TaskCreateShowKeyboardHints;

    /// <summary>Eski bilgi kutusu çizilsin mi? (kiracı ayarı, varsayılan kapalı)</summary>
    public bool ShowInfoBanner { get; set; } = PlatformSettingDefaults.TaskCreateShowInfoBanner;

    private readonly ITaskAppService _taskAppService;
    private readonly Apya.Platform.Projects.IBoardColumnAppService _boardColumnAppService;
    private readonly ISettingManager _settingManager;
    private readonly IPermissionChecker _permissionChecker;
    private readonly IFeatureChecker _featureChecker;

    public CreateModalModel(
        ITaskAppService taskAppService,
        Apya.Platform.Projects.IBoardColumnAppService boardColumnAppService,
        ISettingManager settingManager,
        IPermissionChecker permissionChecker,
        IFeatureChecker featureChecker)
    {
        _taskAppService = taskAppService;
        _boardColumnAppService = boardColumnAppService;
        _settingManager = settingManager;
        _permissionChecker = permissionChecker;
        _featureChecker = featureChecker;
    }

    public async System.Threading.Tasks.Task OnGetAsync()
    {
        Task = new CreateUpdateTaskDto
        {
            ProjectId = ProjectId,
            StartDate = Clock.Now,
            DueDate = Clock.Now.AddDays(7),
            Priority = TaskPriority.Medium,
            Status = Apya.Platform.Tasks.TaskStatus.Todo
        };

        var userLookup = await _taskAppService.GetUsersLookupAsync();
        UserList = userLookup.Items
            .Select(u => new SelectListItem(u.UserName, u.Id.ToString()))
            .ToList();

        AllTagNames = (await _taskAppService.GetAllTagsAsync()).Select(t => t.Name).ToList();

        // Proje bağlamı YOKSA seçici gösterilir. Daha önce hiç yoktu: /Tasks'tan açılan
        // her görev sessizce projesiz kaydediliyordu.
        if (!ProjectId.HasValue)
        {
            ProjectList = (await _taskAppService.GetProjectsLookupAsync())
                .Select(p => new SelectListItem(p.Name, p.Id.ToString()))
                .ToList();
        }

        await BuildStatusOrColumnListAsync(ProjectId);
        await LoadExtrasAsync();
    }

    /// <summary>
    /// Ekstra konfigürasyonların üç kapısını çözer. Feature bir kez sorulur; kapalıysa
    /// izinlere hiç bakılmaz (paket kapalıyken izin zaten <c>RequireFeatures</c> ile devre dışı).
    /// </summary>
    private async System.Threading.Tasks.Task LoadExtrasAsync()
    {
        var featureEnabled = await _featureChecker.IsEnabledAsync(PlatformFeatures.TaskQuickEntry);

        ShowPlanningFields = featureEnabled
            && await _permissionChecker.IsGrantedAsync(PlatformPermissions.Tasks.ManagePlanning);

        var canQuickCreate = featureEnabled
            && await _permissionChecker.IsGrantedAsync(PlatformPermissions.Tasks.QuickCreate);

        // Kullanıcı "form" moduna sabitlemişse yetkisi olsa da hızlı satır açılmaz.
        var mode = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.TaskCreate.DefaultMode)
                   ?? PlatformSettingDefaults.TaskCreateDefaultMode;
        ShowQuickEntry = canQuickCreate && mode == "quick";

        ShowKeyboardHints = await ReadBoolForCurrentUserAsync(
            PlatformSettings.TaskCreate.ShowKeyboardHints,
            PlatformSettingDefaults.TaskCreateShowKeyboardHints);

        // Kiracı seviyesi: bu kutuyu kiracı yöneticisi açar, tek tek kullanıcılar değil.
        var banner = await _settingManager.GetOrNullForCurrentTenantAsync(PlatformSettings.TaskCreate.ShowInfoBanner);
        ShowInfoBanner = banner == null
            ? PlatformSettingDefaults.TaskCreateShowInfoBanner
            : banner.Equals("true", StringComparison.OrdinalIgnoreCase);
    }

    private async Task<bool> ReadBoolForCurrentUserAsync(string name, bool fallback)
    {
        var raw = await _settingManager.GetOrNullForCurrentUserAsync(name);
        return raw == null ? fallback : raw.Equals("true", StringComparison.OrdinalIgnoreCase);
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (ProjectId.HasValue && Task.ProjectId == null)
        {
            Task.ProjectId = ProjectId;
        }

        // Birleşik Durum/Kolon seçimini uzlaştır: özel kolon → BoardColumnId (Status=Todo),
        // sistem durumu → Status. Boşsa varsayılan Todo kalır.
        if (!string.IsNullOrEmpty(StatusOrColumn))
        {
            if (StatusOrColumn.StartsWith("c:") && Guid.TryParse(StatusOrColumn.Substring(2), out var colId))
            {
                Task.BoardColumnId = colId;
            }
            else if (StatusOrColumn.StartsWith("s:") && int.TryParse(StatusOrColumn.Substring(2), out var sv))
            {
                Task.Status = (Apya.Platform.Tasks.TaskStatus)sv;
                Task.BoardColumnId = null;
            }
        }

        // Planlama alanları SUNUCUDA da kapatılır: alanlar gizlendiğinde form yine de
        // elle POST edilebilir. İstemci tarafı gizleme yetkilendirme değildir.
        await LoadExtrasAsync();
        if (!ShowPlanningFields)
        {
            Task.EstimatedHours = null;
            Task.TaskType = null;
            Task.Sprint = null;
            Task.ParentTaskId = null;
        }

        await _taskAppService.CreateAsync(Task);
        return NoContent();
    }

    // Proje verilmişse kanban kolonlarını (sistem = s:<status>, özel = c:<guid>) + İptal,
    // yoksa sistem durumlarını listeler. Varsayılan seçili: Yapılacak.
    private async System.Threading.Tasks.Task BuildStatusOrColumnListAsync(Guid? projectId)
    {
        StatusOrColumnList = new List<SelectListItem>();

        // Kanban kolon başlığındaki ＋ "s:<status>" ya da "c:<guid>" gönderir; gelmezse
        // varsayılan Yapılacak seçili kalır.
        var selected = string.IsNullOrWhiteSpace(StatusOrColumn) ? "s:1" : StatusOrColumn;

        // Sistem durumları her zaman
        foreach (var (label, sv) in new[] { ("Yapılacak", 1), ("Sürüyor", 2), ("Testte", 3), ("Tamamlandı", 4) })
        {
            StatusOrColumnList.Add(new SelectListItem(label, "s:" + sv, "s:" + sv == selected));
        }

        // Projenin özel kolonları (StatusValue=null)
        if (projectId.HasValue)
        {
            try
            {
                var cols = await _boardColumnAppService.GetListByProjectAsync(projectId.Value);
                foreach (var c in cols.Where(c => !c.StatusValue.HasValue).OrderBy(c => c.Order))
                {
                    StatusOrColumnList.Add(new SelectListItem(c.Name, "c:" + c.Id, "c:" + c.Id == selected));
                }
            }
            catch { /* yetki/erişim yoksa yalnızca sistem durumları */ }
        }

        StatusOrColumnList.Add(new SelectListItem("İptal", "s:0", selected == "s:0"));
    }
}
