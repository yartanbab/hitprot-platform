using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Telemetry;
using Apya.Platform.Telemetry.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.SystemHealth;

[Authorize(PlatformPermissions.SystemHealth.Default)]
public class IndexModel : AbpPageModel
{
    /// <summary>
    /// Seçilebilir pencereler — serbest sayı kabul edilmez (audit tablosu büyük).
    /// <para>
    /// 1 gün BİLİNÇLİ olarak var: en dar pencere 7 günken bir haftalık birikim hep
    /// taze görünüyor, "dün ne oldu" ile "bu hafta ne oldu" ayrılamıyordu. Çoktan
    /// düzelmiş hataları güncel sanmaya yol açan tek nokta buydu.
    /// </para>
    /// </summary>
    public static readonly int[] AllowedWindows = { 1, 7, 14, 30, 90 };

    /// <summary>Durum bandının "dikkat" ve "kritik" eşikleri (sunucu hata oranı).</summary>
    private const double WarningRate  = 0.03;
    private const double CriticalRate = 0.10;

    /// <summary>Konsolun ilk yüklemede çektiği olay sayısı.</summary>
    private const int ConsolePageSize = 40;

    private readonly ISystemHealthAppService _systemHealthAppService;

    public SystemHealthDto Health { get; set; } = default!;

    public HealthIssueListDto Issues { get; set; } = new();

    [BindProperty(SupportsGet = true)]
    public int WindowDays { get; set; } = 7;

    /// <summary>
    /// KPI kartından gelen ön-filtre: "unresolved" | "resolved" | "all".
    /// İstemci hataları tablosunun açılış durumunu belirler.
    /// </summary>
    [BindProperty(SupportsGet = true)]
    public string? ClientFilter { get; set; }

    /// <summary>Açılışta hangi sekme: "console" (teşhis) | "metrics" (ölçümler).</summary>
    [BindProperty(SupportsGet = true)]
    public string? Tab { get; set; }

    public IndexModel(ISystemHealthAppService systemHealthAppService)
    {
        _systemHealthAppService = systemHealthAppService;
    }

    public async Task OnGetAsync()
    {
        NormalizeWindow();

        Health = await _systemHealthAppService.GetAsync(WindowDays);
        Issues = await _systemHealthAppService.GetIssuesAsync(BuildListInput());
    }

    /// <summary>
    /// Konsol listesini tazeler. Satır işaretlemesi Razor'da TEK yerde durur; JS
    /// yalnız gelen parçayı yerine koyar — böylece elle aynalanmış bir DOM kopyası
    /// oluşmaz ve liste her yerde aynı kuralla çizilir.
    /// </summary>
    public async Task<IActionResult> OnGetIssueListAsync(
        string? filter, string? kinds, bool? isResolved, string? sort)
    {
        NormalizeWindow();

        var input = BuildListInput();
        input.Filter     = filter;
        input.IsResolved = isResolved;
        input.Kinds      = ParseKinds(kinds);
        input.Sort       = ParseSort(sort);

        Issues = await _systemHealthAppService.GetIssuesAsync(input);

        return Partial("_IssueList", this);
    }

    /// <summary>Seçili olayın kanıt paneli.</summary>
    public async Task<IActionResult> OnGetIssueDetailAsync(
        HealthIssueKind kind, Guid? clientErrorId, string? url, string? httpMethod)
    {
        NormalizeWindow();

        var detail = await _systemHealthAppService.GetIssueDetailAsync(new GetHealthIssueDetailInput
        {
            Kind          = kind,
            ClientErrorId = clientErrorId,
            Url           = url,
            HttpMethod    = httpMethod,
            WindowDays    = WindowDays
        });

        return Partial("_IssueDetail", new IssueDetailViewModel
        {
            Detail     = detail,
            WindowDays = WindowDays,
            CanCreateIssueTask = await AuthorizationService.IsGrantedAsync(PlatformPermissions.IssueTasks.Default),
            CanResolve = await AuthorizationService.IsGrantedAsync(PlatformPermissions.SystemHealth.Resolve)
        });
    }

    private void NormalizeWindow()
    {
        if (!AllowedWindows.Contains(WindowDays))
        {
            WindowDays = 7;
        }
    }

    private GetHealthIssueListInput BuildListInput() => new()
    {
        WindowDays     = WindowDays,
        MaxResultCount = ConsolePageSize,

        // KPI kartından gelen ön-filtre konsolu da açılışta daraltsın.
        IsResolved = ClientFilter switch
        {
            "resolved" => true,
            "all"      => null,
            _          => null
        }
    };

    private static List<HealthIssueKind>? ParseKinds(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            return null;
        }

        var kinds = raw
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(part => int.TryParse(part, out var value) ? value : 0)
            .Where(value => Enum.IsDefined(typeof(HealthIssueKind), value))
            .Select(value => (HealthIssueKind)value)
            .Distinct()
            .ToList();

        return kinds.Count == 0 ? null : kinds;
    }

    private static HealthIssueSort ParseSort(string? raw) => raw switch
    {
        "lastSeen"   => HealthIssueSort.LastSeen,
        "occurrence" => HealthIssueSort.Occurrence,
        _            => HealthIssueSort.Impact
    };

    /* ─── Görünüm yardımcıları ─────────────────────────────────────────────── */

    /// <summary>ClientFilter'ın #Filter_IsResolved seçeneğine karşılığı.</summary>
    public string ResolvedSelectValue => ClientFilter switch
    {
        "resolved" => "true",
        "all"      => "",
        _          => "false"
    };

    public static string SourceLabel(ClientErrorSource source) => source switch
    {
        ClientErrorSource.JsError            => "JS Hatası",
        ClientErrorSource.UnhandledRejection => "Promise Reddi",
        ClientErrorSource.AjaxError          => "AJAX Hatası",
        _                                    => source.ToString()
    };

    public static string KindLabel(HealthIssueKind kind) => kind switch
    {
        HealthIssueKind.ClientJs      => "İstemci · JS",
        HealthIssueKind.ClientPromise => "İstemci · Promise",
        HealthIssueKind.ClientAjax    => "İstemci · AJAX",
        HealthIssueKind.ServerError   => "Sunucu",
        _                             => "Performans"
    };

    /// <summary>Kanalın ton adı — sol şerit, ikon kutusu ve etiket rengi bunu kullanır.</summary>
    public static string KindTone(HealthIssueDto issue)
    {
        if (issue.IsResolved)
        {
            return "neutral";
        }

        return issue.Kind switch
        {
            HealthIssueKind.ServerError => "negative",
            HealthIssueKind.Performance => "brand",
            _                           => "warning"
        };
    }

    public static string KindIcon(HealthIssueKind kind) => kind switch
    {
        HealthIssueKind.ServerError => "fa fa-triangle-exclamation",
        HealthIssueKind.Performance => "fa fa-gauge-high",
        _                           => "fa fa-bug"
    };

    /// <summary>
    /// Satırın son bilgisi. Kanal ne ölçebiliyorsa o yazılır: performansta ortalama
    /// süre, sunucu hatasında etkilenen kullanıcı. İstemci hatasında ikisi de
    /// ölçülmediği için ilk görülme konur — hücre boş kalmaz, sayı da uydurulmaz.
    /// </summary>
    public static string MetaTail(HealthIssueDto issue) => issue.Kind switch
    {
        HealthIssueKind.Performance =>
            $"· ort. {issue.AverageDurationMs?.ToString("0", CultureInfo.InvariantCulture) ?? "-"} ms",

        HealthIssueKind.ServerError =>
            $"· {issue.AffectedUserCount ?? 0} kullanıcı",

        _ => issue.IsResolved ? "· çözüldü" : $"· ilk: {Ago(issue.FirstSeenAt)}"
    };

    /// <summary>"2 dk önce" — mutlak zaman damgası satırda yer kaplamasın.</summary>
    public static string Ago(DateTime moment)
    {
        var span = DateTime.Now - moment;

        if (span.TotalMinutes < 1) return "az önce";
        if (span.TotalHours   < 1) return $"{(int)span.TotalMinutes} dk önce";
        if (span.TotalDays    < 1) return $"{(int)span.TotalHours} saat önce";
        if (span.TotalDays    < 7) return $"{(int)span.TotalDays} gün önce";

        return moment.ToString("dd.MM HH:mm", CultureInfo.InvariantCulture);
    }

    /// <summary>
    /// Kova değerlerinden 60×16 sparkline yolu. Değer yoksa null döner ve satır
    /// kesikli çizgi çizer — "ölçülmüyor" ile "sıfır" karıştırılmasın.
    /// </summary>
    public static string? SparkPath(List<int>? buckets, int width = 60, int height = 16)
    {
        if (buckets is null || buckets.Count < 2)
        {
            return null;
        }

        var max = buckets.Max();
        var span = max <= 0 ? 1 : max;
        var stepX = (double)width / (buckets.Count - 1);

        var builder = new StringBuilder(buckets.Count * 12);
        for (var i = 0; i < buckets.Count; i++)
        {
            var x = i * stepX;
            // 1px üstte/altta pay: 1.4px'lik çizgi kırpılmasın.
            var y = height - 1 - (buckets[i] / (double)span) * (height - 2);

            builder.Append(i == 0 ? 'M' : 'L')
                   .Append(x.ToString("0.#", CultureInfo.InvariantCulture))
                   .Append(' ')
                   .Append(y.ToString("0.#", CultureInfo.InvariantCulture));
        }

        return builder.ToString();
    }

    /* ─── Durum bandı ──────────────────────────────────────────────────────── */

    public string StatusTone => Health.ServerErrorRate switch
    {
        >= CriticalRate => "negative",
        >= WarningRate  => "warning",
        _               => "positive"
    };

    /// <summary>
    /// Çıplak 0-100 skor YOK: trafik ışığı + neden öyle olduğunu söyleyen cümle.
    /// Sayı gerekçesiyle birlikte verilmezse yönetici ne yapacağını bilemiyor.
    /// </summary>
    public string StatusText
    {
        get
        {
            var percent = (Health.ServerErrorRate * 100).ToString("0.0", CultureInfo.GetCultureInfo("tr-TR"));

            if (Health.ServerRequestCount == 0)
            {
                return "Veri yok — seçili pencerede hiç sunucu isteği kaydedilmemiş";
            }

            if (Health.ServerErrorRate < WarningRate)
            {
                return $"Normal — sunucu hata oranı %{percent}, eşiğin altında";
            }

            var multiple = (Health.ServerErrorRate / WarningRate).ToString("0.#", CultureInfo.GetCultureInfo("tr-TR"));
            var label = Health.ServerErrorRate >= CriticalRate ? "Kritik" : "Dikkat";

            return $"{label} — sunucu hata oranı %{percent}, eşiğin {multiple} katı";
        }
    }
}

/// <summary>Kanıt paneli partial'ının modeli — izinler işaretlemeyi belirliyor.</summary>
public class IssueDetailViewModel
{
    public HealthIssueDetailDto Detail { get; set; } = new();
    public int WindowDays { get; set; }
    public bool CanCreateIssueTask { get; set; }
    public bool CanResolve { get; set; }
}
