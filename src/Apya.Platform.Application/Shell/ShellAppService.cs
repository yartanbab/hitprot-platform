using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Reflection;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets.Webhooks;
using Apya.Platform.Grants;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Settings;
using Apya.Platform.Shell;
using Apya.Platform.Shell.Dtos;
using Apya.Platform.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Hosting;
using System.Text.Json;
using Volo.Abp;
using Volo.Abp.Identity;
// System.Threading.Tasks.TaskStatus ile çakışıyor — domain enum'u kastediliyor.
using TaskStatus = Apya.Platform.Tasks.TaskStatus;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Application.Shell;

/// <summary>
/// Kenar çubuğunun durum servisi — rozetler, sabitlemeler, proje alt listesi,
/// sistem durumu. Kabuk HER sayfada render edildiği için dört ayrı istek yerine
/// tek çağrı; sayaçlar da tek tek Count sorgusu olarak kalır (liste çekilmez).
///
/// Sınıf seviyesinde [Authorize] YOK, çünkü kabuk her oturumlu kullanıcıya
/// görünür. Yetki gerektiren her parça KENDİ kapısını kontrol eder ve yetkisi
/// olmayan sıfır/boş alır — hata almaz, yoksa kabuk komple çöker.
/// </summary>
[Authorize]
public class ShellAppService : PlatformAppService, IShellAppService
{
    /// <summary>Alt listede gösterilen en fazla proje — handoff'ta liste kısa, sonda "Tüm projeler" var.</summary>
    private const int MaxProjects = 8;

    private readonly IHostEnvironment _hostEnvironment;
    private readonly ISettingManager _settingManager;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<WebhookDeliveryLog, Guid> _webhookLogRepository;
    private readonly IRepository<GrantApplication, Guid> _grantApplicationRepository;

    public ShellAppService(
        IHostEnvironment hostEnvironment,
        ISettingManager settingManager,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<Project, Guid> projectRepository,
        IRepository<WebhookDeliveryLog, Guid> webhookLogRepository,
        IRepository<GrantApplication, Guid> grantApplicationRepository)
    {
        _hostEnvironment = hostEnvironment;
        _settingManager = settingManager;
        _taskRepository = taskRepository;
        _projectRepository = projectRepository;
        _webhookLogRepository = webhookLogRepository;
        _grantApplicationRepository = grantApplicationRepository;
    }

    public async Task<ShellStateDto> GetStateAsync()
    {
        return new ShellStateDto
        {
            Pins = await GetPinsAsync(),
            Badges = await GetBadgesAsync(),
            Projects = await GetProjectsAsync(),
            Health = GetHealth(_hostEnvironment.EnvironmentName),
            Can = await GetCanAsync(),
            SavedViews = await GetSavedViewsAsync()
        };
    }

    private async Task<ShellCanDto> GetCanAsync()
    {
        return new ShellCanDto
        {
            CreateTask = await IsGrantedAsync(PlatformPermissions.Tasks.Create),
            CreateProject = await IsGrantedAsync(PlatformPermissions.Projects.Create),
            CreateGrant = await IsGrantedAsync(PlatformPermissions.Grants.Create),
            CreateUser = await IsGrantedAsync(IdentityPermissions.Users.Create)
        };
    }

    public async Task<List<ShellSavedViewDto>> SetSavedViewsAsync(List<ShellSavedViewDto> views)
    {
        var cleaned = (views ?? new List<ShellSavedViewDto>())
            .Where(v => v != null && !string.IsNullOrWhiteSpace(v.Name) && !string.IsNullOrWhiteSpace(v.Screen))
            .Select(v => new ShellSavedViewDto
            {
                Name = Clip(v.Name, PlatformSettingDefaults.ShellSavedViewNameMax),
                Screen = NormalizeScreen(v.Screen),
                Query = Clip((v.Query ?? string.Empty).TrimStart('?'), PlatformSettingDefaults.ShellSavedViewQueryMax)
            })
            .Where(v => v.Screen.Length > 0)
            .Take(PlatformSettingDefaults.ShellSavedViewsMax)
            .ToList();

        await _settingManager.SetForCurrentUserAsync(
            PlatformSettings.Shell.SavedViews, JsonSerializer.Serialize(cleaned));

        return cleaned;
    }

    private async Task<List<ShellSavedViewDto>> GetSavedViewsAsync()
    {
        var raw = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.Shell.SavedViews);
        if (string.IsNullOrWhiteSpace(raw))
        {
            return new List<ShellSavedViewDto>();
        }

        try
        {
            return JsonSerializer.Deserialize<List<ShellSavedViewDto>>(raw) ?? new List<ShellSavedViewDto>();
        }
        catch (JsonException)
        {
            // Bozuk değer kabuğu çökertmesin — kullanıcı yeni görünüm
            // kaydettiğinde değer zaten üzerine yazılır.
            return new List<ShellSavedViewDto>();
        }
    }

    private static string Clip(string value, int max)
    {
        value = (value ?? string.Empty).Trim();
        return value.Length <= max ? value : value.Substring(0, max);
    }

    /// <summary>
    /// Yalnız site içi YOL bırakır ("/Tasks"). Manipüle edilmiş bir istek,
    /// başka bir origin'e yönlendiren "görünüm" bırakamasın diye şema/host
    /// taşıyan ve protokol-göreli ("//site") değerler elenir.
    /// </summary>
    private static string NormalizeScreen(string screen)
    {
        screen = (screen ?? string.Empty).Trim();
        if (screen.Length == 0) { return string.Empty; }

        if (Uri.TryCreate(screen, UriKind.Absolute, out var abs))
        {
            screen = abs.AbsolutePath;
        }
        if (!screen.StartsWith('/') || screen.StartsWith("//"))
        {
            return string.Empty;
        }
        return Clip(screen, 200);
    }

    /// <summary>
    /// Sabit (parametresiz) sekme türleri — /Tasks ("tasks" scope'u). Beyaz
    /// liste, çünkü tür doğrudan istemciden geliyor: tanınmayan bir tür
    /// saklanırsa konsol onu çizemez ve kullanıcı kapatamadığı ölü bir sekmeyle
    /// kalır. Pages/Tasks/index.js → VIEWS ile aynı adlar.
    /// </summary>
    private static readonly HashSet<string> BoardTabViewKinds =
        new(StringComparer.Ordinal) { "list", "kanban", "gantt", "calendar", "dashboard", "gallery" };

    /// <summary>
    /// Proje detay konsolunun ("project:{id}" scope'u) çizebildiği türler.
    /// Katalog panelleri (takvim, gösterge paneli…) proje yüzeyine açıldıkça
    /// buraya da eklenmeli — ProjectDetails.cshtml sekmeleriyle aynı adlar.
    /// </summary>
    private static readonly HashSet<string> ProjectBoardTabViewKinds =
        new(StringComparer.Ordinal) { "list", "kanban", "gantt", "finance" };

    // JSON biçimi (camelCase gerekçesi dahil) ShellBoardTabsSetting'de — yazan
    // (burası) ve okuyan (PageModel/View'lar) aynı yardımcının içinden geçer.
    public async Task<List<ShellBoardTabDto>> SetBoardTabsAsync(SetShellBoardTabsInput input)
    {
        var scope = NormalizeBoardTabsScope(input?.Scope);
        var cleaned = CleanBoardTabs(scope, input?.Tabs);

        // Oku-değiştir-yaz: ayar TÜM yüzeylerin düzenlerini tek değerde tutar,
        // yalnız istenen scope değişir — öbür yüzeylerin düzeni korunur.
        var raw = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.Shell.BoardTabs);
        var scopes = ShellBoardTabsSetting.Parse(raw);
        scopes[scope] = cleaned;

        await _settingManager.SetForCurrentUserAsync(
            PlatformSettings.Shell.BoardTabs, ShellBoardTabsSetting.Serialize(scopes));

        return cleaned;
    }

    /// <summary>
    /// Scope anahtarını doğrular ve normalleştirir (proje GUID'i tek biçime
    /// iner). Tanınmayan scope HATA: sessizce bir varsayılana düşmek başka
    /// yüzeyin düzenini ezerdi.
    /// </summary>
    private static string NormalizeBoardTabsScope(string? scope)
    {
        scope = (scope ?? string.Empty).Trim();

        if (scope == ShellBoardTabsSetting.TasksScope ||
            scope == ShellBoardTabsSetting.TaskDetailScope)
        {
            return scope;
        }

        const string projectPrefix = "project:";
        if (scope.StartsWith(projectPrefix, StringComparison.Ordinal) &&
            Guid.TryParse(scope.Substring(projectPrefix.Length), out var projectId))
        {
            return ShellBoardTabsSetting.ProjectScope(projectId);
        }

        throw new BusinessException(PlatformDomainErrorCodes.ShellBoardTabsScopeInvalid);
    }

    private static List<ShellBoardTabDto> CleanBoardTabs(string scope, List<ShellBoardTabDto>? tabs)
    {
        var cleaned = new List<ShellBoardTabDto>();
        var seen = new HashSet<string>(StringComparer.Ordinal);
        var isTasksScope = scope == ShellBoardTabsSetting.TasksScope;

        foreach (var tab in tabs ?? new List<ShellBoardTabDto>())
        {
            var kind = (tab?.Kind ?? string.Empty).Trim();
            var reference = (tab?.Ref ?? string.Empty).Trim();

            if (scope == ShellBoardTabsSetting.TaskDetailScope)
            {
                // Görev detayında "sekme" = özellik KODU (TaskFeatureRegistry).
                // Kod listesi istemcide yaşıyor; burada kopyasını tutmayız —
                // biçim denetimi yeter, atama doğrulamasını TaskAppService
                // (AddFeatureAsync) zaten yapıyor. Tanınmayan kod çizilmez,
                // sıradan sessizce düşer; ölü sekme riski yok.
                if (!IsFeatureCode(kind)) { continue; }
                reference = string.Empty;
            }
            else if ((isTasksScope ? BoardTabViewKinds : ProjectBoardTabViewKinds).Contains(kind))
            {
                // Sabit görünüşün referansı OLMAZ; gelirse atılır (aksi halde
                // aynı görünüş farklı referanslarla defalarca açılabilirdi).
                reference = string.Empty;
            }
            else if (isTasksScope && kind == "project")
            {
                // Proje sekmesi bir GUID taşır. Doğrulamak "kötü değeri eleme"
                // değil, sekmeyi çizilebilir tutma meselesi.
                if (!Guid.TryParse(reference, out var projectId)) { continue; }
                reference = projectId.ToString();
            }
            else if (isTasksScope && kind == "view")
            {
                // Kayıtlı görünüm ADI ile anılır (konsolun kendi listesi de adla
                // çalışıyor). Adsız görünüm sekmesi hedefsizdir.
                if (reference.Length == 0) { continue; }
                reference = Clip(reference, PlatformSettingDefaults.ShellBoardTabsTitleMax);
            }
            else
            {
                continue; // tanınmayan tür
            }

            if (!seen.Add(kind + " " + reference)) { continue; }

            cleaned.Add(new ShellBoardTabDto
            {
                Kind = kind,
                Ref = reference,
                // Yalnız parametreli sekmeler başlık taşır: sabit görünüşlerin
                // etiketi localization'dan, özellik kodlarınınki registry'den gelir.
                Title = reference.Length == 0
                    ? string.Empty
                    : Clip(tab!.Title, PlatformSettingDefaults.ShellBoardTabsTitleMax)
            });

            if (cleaned.Count >= PlatformSettingDefaults.ShellBoardTabsMax) { break; }
        }

        return cleaned;
    }

    /// <summary>Registry kodu biçimi: küçük harf/rakam/tire, 1-64 karakter ("subtask-table").</summary>
    private static bool IsFeatureCode(string kind)
    {
        if (kind.Length is 0 or > 64) { return false; }
        foreach (var c in kind)
        {
            if (c is not ((>= 'a' and <= 'z') or (>= '0' and <= '9') or '-')) { return false; }
        }
        return true;
    }

    public async Task<List<string>> SetPinsAsync(List<string> pins)
    {
        // Menü ADI saklanır; serbest metin değil. Virgül ayraç olduğu için
        // içinde virgül geçen değer listeyi bozar → temizlenir. Üst sınır,
        // manipüle edilmiş isteğin ayarı şişirmesini engeller.
        var cleaned = (pins ?? new List<string>())
            .Where(p => !string.IsNullOrWhiteSpace(p))
            .Select(p => p.Trim())
            .Where(p => !p.Contains(','))
            .Distinct()
            .Take(PlatformSettingDefaults.ShellPinsMax)
            .ToList();

        await _settingManager.SetForCurrentUserAsync(
            PlatformSettings.Shell.Pins, string.Join(",", cleaned));

        return cleaned;
    }

    private async Task<List<string>> GetPinsAsync()
    {
        var raw = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.Shell.Pins)
                  ?? PlatformSettingDefaults.ShellPins;

        return raw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                  .Distinct()
                  .ToList();
    }

    private async Task<ShellBadgesDto> GetBadgesAsync()
    {
        var badges = new ShellBadgesDto();
        var today = Clock.Now.Date; // CORR-004: DateTime.Now yerine IClock

        // --- Geciken görevler ---
        // GİZLİLİK: yalnız kullanıcıya ATANMIŞ görevler sayılır. Tüm görevleri
        // saymak, kullanıcının göremediği gizli görevlerin varlığını rozet
        // üzerinden ele verirdi (aynı sızıntı alt görev sayaçlarında da vardı).
        // Kullanıcı kendisine atanmış görevi her hâlükârda görebilir.
        if (CurrentUser.Id.HasValue && await IsGrantedAsync(PlatformPermissions.Tasks.Default))
        {
            var userId = CurrentUser.Id.Value;
            var taskQuery = await _taskRepository.GetQueryableAsync();
            badges.OverdueTasks = taskQuery.Count(t =>
                t.AssigneeId == userId &&
                t.DueDate != null && t.DueDate < today &&
                t.Status != TaskStatus.Done && t.Status != TaskStatus.Cancelled);
        }

        // --- Bekleyen hibe başvuruları ---
        // "Başvurular" ekranı host'a özel (GrantApplicationHostAppService.EnsureHostContext);
        // menü öğesi de yalnız host'ta çıkıyor → rozet de aynı kapıdan geçer.
        if (CurrentTenant.Id == null && await IsGrantedAsync(PlatformPermissions.Grants.Edit))
        {
            var grantQuery = await _grantApplicationRepository.GetQueryableAsync();
            badges.PendingGrantApplications = grantQuery.Count(a =>
                a.Stage == GrantApplicationStage.Basvuru ||
                a.Stage == GrantApplicationStage.Degerlendirme);
        }

        // --- Webhook hataları ---
        // Yalnız SON 24 SAAT: rozet "şu an bir şey bozuk" demeli, geçmişteki
        // tüm hataların toplamı değil — kalıcı yüksek sayı rozeti anlamsızlaştırır.
        if (await IsGrantedAsync(PlatformPermissions.DynamicAssets.Default))
        {
            var since = Clock.Now.AddDays(-1); // CORR-004: DateTime.Now yerine IClock
            var logQuery = await _webhookLogRepository.GetQueryableAsync();
            badges.WebhookErrors = logQuery.Count(x => !x.IsSuccess && x.CreationTime >= since);
        }

        return badges;
    }

    private async Task<List<ShellProjectDto>> GetProjectsAsync()
    {
        if (!await IsGrantedAsync(PlatformPermissions.Projects.Default))
        {
            return new List<ShellProjectDto>();
        }

        var projectQuery = await _projectRepository.GetQueryableAsync();
        var projects = projectQuery
            .OrderBy(p => p.Name)
            .Take(MaxProjects)
            .Select(p => new ShellProjectDto { Id = p.Id, Name = p.Name, Code = p.Code })
            .ToList();

        if (projects.Count == 0)
        {
            return projects;
        }

        // Açık görev sayıları TEK GroupBy ile — proje başına sorgu (N+1) yok.
        // Gizli görevler sayılmaz: alt liste sayacı da bir sızıntı yüzeyidir.
        var ids = projects.Select(p => p.Id).ToList();
        var taskQuery = await _taskRepository.GetQueryableAsync();
        var counts = taskQuery
            .Where(t => t.ProjectId != null && ids.Contains(t.ProjectId.Value)
                        && !t.IsPrivate
                        && t.Status != TaskStatus.Done && t.Status != TaskStatus.Cancelled)
            .GroupBy(t => t.ProjectId!.Value)
            .Select(g => new { ProjectId = g.Key, Count = g.Count() })
            .ToDictionary(x => x.ProjectId, x => x.Count);

        foreach (var project in projects)
        {
            project.OpenTaskCount = counts.TryGetValue(project.Id, out var count) ? count : 0;
        }

        return projects;
    }

    private ShellHealthDto GetHealth(string environmentName)
    {
        // Sürüm derlemeden okunur; ayrı bir sabit tutmak sürüm atlandığında
        // sessizce yanlış değer gösterirdi.
        var version = Assembly.GetEntryAssembly()?.GetName().Version;

        // NOT: şu an yalnız "uygulama ayakta" bilgisini taşır — bu kod çalışıyorsa
        // ayaktadır. Sistem Sağlığı metriklerine (hata oranı vb.) bağlamak ayrı
        // bir iş; sahte bir "her şey yolunda" göstermemek için nokta yalnız
        // gerçekten bildiğimiz şeyi ifade ediyor.
        return new ShellHealthDto
        {
            IsHealthy = true,
            Version = version == null ? string.Empty : $"v{version.Major}.{version.Minor}.{version.Build}",
            Environment = environmentName
        };
    }

    private async Task<bool> IsGrantedAsync(string permission)
    {
        return await AuthorizationService.IsGrantedAsync(permission);
    }
}
