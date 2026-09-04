using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using Apya.Platform.Telemetry.Dtos;
using Apya.Platform.Web.Telemetry;

namespace Apya.Platform.Web.Pages.Admin.SystemHealth;

/// <summary>
/// Kanıt panelinin içeriğini, bir yapay zekâ ajanına yapıştırılacak markdown özete
/// çevirir. Ekranda okunan ne varsa (künye, hata metni, ortam, oluşumlar, davranış
/// izi, korelasyon, etkilenen kiracılar) tek metinde toplanır.
/// <para>
/// Uzun bölümler kırpılır ve kırpıldığı <b>metnin içine yazılır</b> — ajan eksik
/// listeyi tam sanıp "başka oluşum yok" diye akıl yürütmesin.
/// </para>
/// </summary>
public static class HealthIssueSummaryBuilder
{
    private const int StackTraceLimit  = 3000;
    private const int ExceptionLimit   = 240;
    private const int OccurrenceLimit  = 10;
    private const int BreadcrumbLimit  = 15;
    private const int CorrelationLimit = 5;
    private const int TenantLimit      = 5;

    private static readonly CultureInfo Inv = CultureInfo.InvariantCulture;

    /* ─── Tek olayın tam özeti ─────────────────────────────────────────────── */

    public static string Build(HealthIssueDetailDto detail, int windowDays)
    {
        var issue = detail.Issue;
        if (issue is null)
        {
            return string.Empty;
        }

        var sb = new StringBuilder(2048);

        sb.Append("## [Apya · Sistem Sağlığı] ").AppendLine(issue.Title);
        sb.AppendLine();

        AppendIdentity(sb, issue, windowDays);
        AppendStackTrace(sb, detail, issue.Kind);
        AppendEnvironment(sb, detail.Environment);
        AppendBreadcrumb(sb, detail.BreadcrumbJson);
        AppendOccurrences(sb, detail.Occurrences);
        AppendCorrelations(sb, detail.Correlations);
        AppendAffectedTenants(sb, detail.AffectedTenants);

        return sb.ToString().TrimEnd() + Environment.NewLine;
    }

    private static void AppendIdentity(StringBuilder sb, HealthIssueDto issue, int windowDays)
    {
        sb.Append("- Kanal: ").Append(IndexModel.KindLabel(issue.Kind))
          .Append(" · Durum: ").Append(issue.IsResolved ? "Çözüldü" : "Açık");

        if (issue.IsRegression && !issue.IsResolved)
        {
            sb.Append(" · Regresyon (ilk görülme pencerenin son %20'sinde)");
        }

        sb.AppendLine();
        sb.Append("- Yer: ").AppendLine(Location(issue));
        sb.Append("- Kiracı: ").AppendLine(issue.TenantName ?? "-");

        sb.Append("- Oluşum: ").Append(issue.OccurrenceCount.ToString(Inv));
        sb.Append(" · Etkilenen kullanıcı: ")
          .AppendLine(issue.AffectedUserCount?.ToString(Inv) ?? "ölçülmüyor");

        sb.Append("- İlk görülme: ").Append(Moment(issue.FirstSeenAt))
          .Append(" · Son görülme: ").AppendLine(Moment(issue.LastSeenAt));

        if (issue.AverageDurationMs.HasValue)
        {
            sb.Append("- Ortalama süre: ")
              .Append(issue.AverageDurationMs.Value.ToString("0.#", Inv)).AppendLine(" ms");
        }

        sb.Append("- Pencere: son ").Append(windowDays.ToString(Inv)).Append(" gün · özet ")
          .Append(DateTime.Now.ToString("dd.MM.yyyy HH:mm", Inv)).AppendLine(" itibarıyla üretildi");

        sb.Append("- Olay anahtarı: `").Append(issue.Key).AppendLine("`");
        sb.AppendLine();
    }

    private static void AppendStackTrace(StringBuilder sb, HealthIssueDetailDto detail, HealthIssueKind kind)
    {
        if (string.IsNullOrWhiteSpace(detail.StackTrace))
        {
            return;
        }

        var isEndpoint = kind is HealthIssueKind.ServerError or HealthIssueKind.RequestRejected;

        sb.AppendLine(isEndpoint ? "### Hata metni" : "### Yığın izi");
        sb.AppendLine();
        sb.AppendLine("```text");
        sb.AppendLine(Clip(detail.StackTrace!, StackTraceLimit));
        sb.AppendLine("```");
        sb.AppendLine();
    }

    private static void AppendEnvironment(StringBuilder sb, List<HealthFactDto> environment)
    {
        if (environment.Count == 0)
        {
            return;
        }

        sb.AppendLine("### Ortam");
        sb.AppendLine();

        foreach (var item in environment)
        {
            sb.Append("- ").Append(item.Label).Append(": ").AppendLine(item.Value);
        }

        sb.AppendLine();
    }

    private static void AppendBreadcrumb(StringBuilder sb, string? breadcrumbJson)
    {
        var crumbs = BreadcrumbParser.Parse(breadcrumbJson);
        if (crumbs.Count == 0)
        {
            return;
        }

        // Sondaki adımlar hataya en yakın olanlar — kırpma baştan yapılır.
        var shown = crumbs.Count > BreadcrumbLimit
            ? crumbs.Skip(crumbs.Count - BreadcrumbLimit).ToList()
            : crumbs;

        sb.Append("### Davranış izi (").Append(Portion(shown.Count, crumbs.Count)).AppendLine(")");
        sb.AppendLine();

        foreach (var crumb in shown)
        {
            sb.Append("- ").Append(crumb.Time.ToString("HH:mm:ss", Inv))
              .Append(" · ").Append(crumb.Type)
              .Append(" · ").AppendLine(crumb.Label);
        }

        sb.AppendLine();
    }

    private static void AppendOccurrences(StringBuilder sb, List<ServerErrorDetailDto> occurrences)
    {
        if (occurrences.Count == 0)
        {
            return;
        }

        sb.Append("### Oluşumlar (")
          .Append(Portion(Math.Min(OccurrenceLimit, occurrences.Count), occurrences.Count))
          .AppendLine(")");
        sb.AppendLine();
        sb.AppendLine("| Zaman | Durum | Süre (ms) | Kullanıcı | Adres |");
        sb.AppendLine("|---|---|---|---|---|");

        foreach (var o in occurrences.Take(OccurrenceLimit))
        {
            sb.Append("| ").Append(o.ExecutionTime.ToString("dd.MM HH:mm:ss", Inv))
              .Append(" | ").Append(o.HttpStatusCode?.ToString(Inv) ?? "-")
              .Append(" | ").Append(o.ExecutionDuration.ToString(Inv))
              .Append(" | ").Append(Cell(o.UserName ?? "anonim"))
              .Append(" | ").Append(Cell(o.Url ?? "-"))
              .AppendLine(" |");
        }

        sb.AppendLine();
    }

    private static void AppendCorrelations(StringBuilder sb, List<CorrelatedServerErrorDto> correlations)
    {
        if (correlations.Count == 0)
        {
            return;
        }

        sb.Append("### Zamandaş sunucu kayıtları (")
          .Append(Portion(Math.Min(CorrelationLimit, correlations.Count), correlations.Count))
          .AppendLine(")");
        sb.AppendLine();
        sb.AppendLine("Aynı kiracıda, hatanın görüldüğü ana ±2 saniye içindeki kayıtlar. Yakınlık kanıtıdır, nedensellik değil.");
        sb.AppendLine();

        foreach (var c in correlations.Take(CorrelationLimit))
        {
            sb.Append("- ").Append(c.ExecutionTime.ToString("HH:mm:ss.fff", Inv))
              .Append(" (").Append(c.OffsetSeconds.ToString("+0.##;-0.##;0", Inv)).Append(" sn) · ")
              .Append(c.HttpStatusCode?.ToString(Inv) ?? "-").Append(" · ")
              .Append(c.ExecutionDuration.ToString(Inv)).Append(" ms · ")
              .Append(c.HttpMethod).Append(' ').AppendLine(c.Url);

            if (!string.IsNullOrWhiteSpace(c.Exceptions))
            {
                sb.Append("  - ").AppendLine(OneLine(Clip(c.Exceptions!, ExceptionLimit)));
            }
        }

        sb.AppendLine();
    }

    private static void AppendAffectedTenants(StringBuilder sb, List<HealthTenantStatDto> tenants)
    {
        if (tenants.Count == 0)
        {
            return;
        }

        sb.Append("### Etkilenen kiracılar (")
          .Append(Portion(Math.Min(TenantLimit, tenants.Count), tenants.Count))
          .AppendLine(")");
        sb.AppendLine();
        sb.AppendLine("| Kiracı | Kayıt | Hata | Ort. (ms) |");
        sb.AppendLine("|---|---|---|---|");

        foreach (var t in tenants.Take(TenantLimit))
        {
            sb.Append("| ").Append(Cell(t.TenantName ?? "-"))
              .Append(" | ").Append(t.RequestCount.ToString(Inv))
              .Append(" | ").Append(t.ErrorCount.ToString(Inv))
              .Append(" | ").Append(t.AverageDurationMs.ToString("0", Inv))
              .AppendLine(" |");
        }

        sb.AppendLine();
    }

    /* ─── Liste: tek satırlık künyeler ─────────────────────────────────────── */

    /// <summary>
    /// Süzgeçten geçen olayların tek satırlık künyesi. Kanıt YOKTUR — hangi olaya
    /// bakılacağını seçtirmek içindir; ayrıntı için olayın kendi özeti kopyalanır.
    /// </summary>
    public static string BuildList(HealthIssueListDto list, int windowDays)
    {
        var sb = new StringBuilder(1024);

        sb.Append("## [Apya · Sistem Sağlığı] Olay listesi — son ")
          .Append(windowDays.ToString(Inv)).AppendLine(" gün");
        sb.AppendLine();
        sb.Append(list.TotalCount.ToString(Inv)).Append(" kayıttan ")
          .Append(list.Items.Count.ToString(Inv)).Append(" tanesi · özet ")
          .Append(DateTime.Now.ToString("dd.MM.yyyy HH:mm", Inv)).AppendLine(" itibarıyla üretildi");
        sb.AppendLine();

        foreach (var issue in list.Items)
        {
            sb.Append("- [").Append(IndexModel.KindLabel(issue.Kind));

            if (issue.HttpStatusCode.HasValue)
            {
                sb.Append(" · ").Append(issue.HttpStatusCode.Value.ToString(Inv));
            }

            sb.Append("] ").Append(issue.Title)
              .Append(" — ").Append(Location(issue))
              .Append(" · ").Append(issue.OccurrenceCount.ToString(Inv)).Append(" oluşum");

            if (issue.AffectedUserCount.HasValue)
            {
                sb.Append(" · ").Append(issue.AffectedUserCount.Value.ToString(Inv)).Append(" kullanıcı");
            }

            sb.Append(" · son: ").Append(Moment(issue.LastSeenAt))
              .Append(" · kiracı: ").Append(issue.TenantName ?? "-");

            if (issue.IsResolved)
            {
                sb.Append(" · çözüldü");
            }

            sb.AppendLine();
        }

        return sb.ToString();
    }

    /* ─── yardımcılar ──────────────────────────────────────────────────────── */

    private static string Location(HealthIssueDto issue)
    {
        var method = issue.HttpMethod is null ? "" : issue.HttpMethod + " ";
        var status = issue.HttpStatusCode.HasValue ? $" → {issue.HttpStatusCode.Value.ToString(Inv)}" : "";

        return $"{method}{issue.Where}{status}".Trim();
    }

    private static string Moment(DateTime moment) => moment.ToString("dd.MM.yyyy HH:mm", Inv);

    /// <summary>Tamamı gösteriliyorsa yalın sayı, değilse kırpıldığını söyleyen ibare.</summary>
    private static string Portion(int shown, int total) =>
        shown >= total ? total.ToString(Inv) : $"{shown.ToString(Inv)}/{total.ToString(Inv)} gösteriliyor";

    private static string Clip(string value, int limit) =>
        value.Length <= limit
            ? value
            : value[..limit] + $"{Environment.NewLine}… (özet için {limit.ToString(Inv)} karakterde kırpıldı)";

    /// <summary>Markdown tablosunda dikey çizgi hücreyi böler.</summary>
    private static string Cell(string value) => value.Replace("|", "\\|");

    private static string OneLine(string value) => value.Replace("\r", " ").Replace("\n", " ");
}
