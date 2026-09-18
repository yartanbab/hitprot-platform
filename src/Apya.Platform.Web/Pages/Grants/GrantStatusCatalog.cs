using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// Hibe ekranlarındaki durum rozetlerinin TEK KAYNAĞI: enum değeri → rozet tonu.
///
/// <para>Neden var: durum enum'ları istemcide elle yazılmış dizilerle eşleniyordu
/// (<c>var statusKeys = ['Yeni', …]; var statusTone = ['warning', …];</c>). Bu bağı hiçbir
/// derleyici denetlemiyor. Sonuçları 2026-09-17 denetiminde ölçüldü:</para>
/// <list type="bullet">
/// <item>Tahsilat dizisi bir kaymıştı → <b>ödenmiş dilim ekranda "İptal"</b> görünüyordu.</item>
/// <item>Aynı <see cref="GrantInterestStatus"/> host'ta sarı, kiracıda gri, Yolculuk'ta mordu.</item>
/// <item><see cref="GrantApplicationStage"/> etiketleri üç ekranda elle Türkçe yazılmıştı.</item>
/// </list>
///
/// <para>Artık <b>anahtar dizisini sunucu üretir</b> (<see cref="Enum.GetNames{TEnum}()"/>) —
/// yani sıra tanım gereği doğrudur, kayamaz. Ton da değere göre burada yazılır; istemci
/// yalnız okur.</para>
///
/// <para>🔑 <b>Etiket burada DEĞİL.</b> Aynı durum host'a "Yeni", kiracıya "Talebiniz iletildi"
/// diyebilir; bu doğru ve korunuyor. Sayfa kendi yerelleştirme önekini kullanmaya devam eder
/// (<c>l('Grants:Interest:Status:' + keys[v])</c>). Değişmeyen tek şey <b>renk</b>: bir durum
/// her ekranda aynı tonda görünür.</para>
///
/// <para>Katmanı: burası Web. Ton bir sunum kararıdır, Domain.Shared'a yazılmaz.</para>
/// </summary>
public static class GrantStatusCatalog
{
    // ── Talep / ilgi ──────────────────────────────────────────────────────────
    // Yeni ve Inceleniyor "iş sürüyor" demek → accent. Eskiden host'ta warning,
    // kiracıda neutral, Yolculuk'ta accent idi; üçü accent'te birleşti (Yolculuk
    // zaten böyleydi). Yanıt süresi baskısı ayrı bir göstergede (Talepler şeridi).
    private static readonly Dictionary<GrantInterestStatus, string> Interest = new()
    {
        [GrantInterestStatus.Yeni]           = "accent",
        [GrantInterestStatus.Inceleniyor]    = "accent",
        [GrantInterestStatus.BasvuruAcildi]  = "positive",
        [GrantInterestStatus.UygunDegil]     = "negative",
        [GrantInterestStatus.GeriCekildi]    = "neutral",
        [GrantInterestStatus.Kacirildi]      = "neutral"
    };

    // ── Başvuru aşaması ───────────────────────────────────────────────────────
    // 🔴 Ödeme eskiden "ai" tonundaydı; o ton platformda yapay zekâ yüzeylerine
    // ayrılmış (mor). Aşama ilerlemesi artık nötr → uyarı → accent → olumlu.
    private static readonly Dictionary<GrantApplicationStage, string> Stage = new()
    {
        [GrantApplicationStage.Basvuru]       = "neutral",
        [GrantApplicationStage.Degerlendirme] = "warning",
        [GrantApplicationStage.Onay]          = "accent",
        [GrantApplicationStage.Odeme]         = "positive"
    };

    // ── Tahsilat dilimi ───────────────────────────────────────────────────────
    private static readonly Dictionary<GrantDisbursementTrancheStatus, string> Tranche = new()
    {
        [GrantDisbursementTrancheStatus.Planlandi]   = "neutral",
        [GrantDisbursementTrancheStatus.TalepEdildi] = "warning",
        [GrantDisbursementTrancheStatus.Odendi]      = "positive"
    };

    // ── Evrak ─────────────────────────────────────────────────────────────────
    private static readonly Dictionary<GrantDocumentStatus, string> Document = new()
    {
        [GrantDocumentStatus.Bekleniyor]      = "neutral",
        [GrantDocumentStatus.Incelemede]      = "warning",
        [GrantDocumentStatus.Onaylandi]       = "positive",
        [GrantDocumentStatus.RevizyonIstendi] = "negative"
    };

    // ── Rapor ─────────────────────────────────────────────────────────────────
    private static readonly Dictionary<GrantReportStatus, string> Report = new()
    {
        [GrantReportStatus.Planlandi]       = "neutral",
        [GrantReportStatus.Hazirlaniyor]    = "warning",
        [GrantReportStatus.Gonderildi]      = "accent",
        [GrantReportStatus.Onaylandi]       = "positive",
        [GrantReportStatus.RevizyonIstendi] = "negative"
    };

    // ── Uygunluk kovası ───────────────────────────────────────────────────────
    private static readonly Dictionary<GrantEligibilityBucket, string> Bucket = new()
    {
        [GrantEligibilityBucket.Uygun]      = "positive",
        [GrantEligibilityBucket.Kosullu]    = "warning",
        [GrantEligibilityBucket.UygunDegil] = "neutral"
    };

    // ── Pano riski ────────────────────────────────────────────────────────────
    private static readonly Dictionary<GrantPipelineRisk, string> Risk = new()
    {
        [GrantPipelineRisk.DeadlineNear]     = "warning",
        [GrantPipelineRisk.DeadlinePassed]   = "negative",
        [GrantPipelineRisk.MissingDocuments] = "warning",
        [GrantPipelineRisk.WaitingOnFirm]    = "neutral",
        [GrantPipelineRisk.Unassigned]       = "neutral"
    };

    // ── Hibe yolculuğu ────────────────────────────────────────────────────────
    private static readonly Dictionary<GrantJourneyItemKind, string> Journey = new()
    {
        [GrantJourneyItemKind.InterestPending]            = "accent",
        [GrantJourneyItemKind.InterestRejected]           = "neutral",
        [GrantJourneyItemKind.InterestWithdrawn]          = "neutral",
        [GrantJourneyItemKind.ApplicationOpen]            = "warning",
        [GrantJourneyItemKind.ApplicationWithInstitution] = "accent",
        [GrantJourneyItemKind.ApplicationRejected]        = "negative",
        [GrantJourneyItemKind.Project]                    = "positive",
        [GrantJourneyItemKind.Completed]                  = "positive",
        [GrantJourneyItemKind.CallClosed]                 = "neutral",
        [GrantJourneyItemKind.IdeaPooled]                 = "accent"
    };

    // ── İtiraz tutumu ─────────────────────────────────────────────────────────
    private static readonly Dictionary<GrantAppealStance, string> Stance = new()
    {
        [GrantAppealStance.Belirsiz] = "neutral",
        [GrantAppealStance.Itiraz]   = "accent",
        [GrantAppealStance.Kabul]    = "warning"
    };

    // ── Kurum kararı ──────────────────────────────────────────────────────────
    private static readonly Dictionary<GrantDecisionOutcome, string> Decision = new()
    {
        [GrantDecisionOutcome.Reddedildi] = "negative",
        [GrantDecisionOutcome.Onaylandi]  = "positive",
        [GrantDecisionOutcome.KismiOnay]  = "warning"
    };

    // ── Başvuru akışı olayı ───────────────────────────────────────────────────
    // Akış metni l('Grants:DetailHost:Activity:' + keys[kind]) ile kurulur; dizi elle tutulurken
    // para olayları (H-07) eklenince ekranda "undefined" basılırdı. Ton para olaylarını ayırır.
    private static readonly Dictionary<GrantActivityKind, string> Activity = new()
    {
        [GrantActivityKind.StageMoved]            = "accent",
        [GrantActivityKind.AssignmentChanged]     = "neutral",
        [GrantActivityKind.HandedOver]            = "neutral",
        [GrantActivityKind.Submitted]             = "positive",
        [GrantActivityKind.ApprovedAmountChanged] = "warning",
        [GrantActivityKind.TrancheAdded]          = "neutral",
        [GrantActivityKind.TrancheAmountChanged]  = "warning",
        [GrantActivityKind.TrancheRemoved]        = "negative",
        [GrantActivityKind.TranchePaid]           = "positive"
    };

    // ── Başvuru detayı bölüm durumu ───────────────────────────────────────────
    private static readonly Dictionary<GrantDetailSectionState, string> SectionState = new()
    {
        [GrantDetailSectionState.Empty]      = "neutral",
        [GrantDetailSectionState.InProgress] = "warning",
        [GrantDetailSectionState.Live]       = "accent",
        [GrantDetailSectionState.Complete]   = "positive",
        [GrantDetailSectionState.Locked]     = "neutral"
    };

    /// <summary>
    /// İstemciye gidecek harita. Anahtar adları JS'te kullanılan adlardır
    /// (<c>apyaGrantStatus.interest.keys</c>); değiştirilirse JS tarafı da değişmeli —
    /// <c>GrantStatusCatalog_Tests</c> her girişin dolu olduğunu doğrular.
    /// </summary>
    public static IReadOnlyDictionary<string, GrantStatusEntry> Build() => new Dictionary<string, GrantStatusEntry>
    {
        ["interest"]     = Entry(Interest),
        ["stage"]        = Entry(Stage),
        ["tranche"]      = Entry(Tranche),
        ["document"]     = Entry(Document),
        ["report"]       = Entry(Report),
        ["bucket"]       = Entry(Bucket),
        ["risk"]         = Entry(Risk),
        ["journey"]      = Entry(Journey),
        ["stance"]       = Entry(Stance),
        ["decision"]     = Entry(Decision),
        ["activity"]     = Entry(Activity),
        ["sectionState"] = Entry(SectionState)
    };

    /// <summary>
    /// İstemciye giden JSON. Serileştirme seçeneği burada durur: <c>keys</c>/<c>tones</c>
    /// adları JS'in okuduğu adlardır, camelCase politikası değişirse her hibe sayfası
    /// sessizce bozulurdu. <c>GrantStatusCatalog_Tests</c> bu çıktının şeklini doğrular.
    /// </summary>
    public static string ToJson() => JsonSerializer.Serialize(Build(), JsonOptions);

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    /// <summary>
    /// Anahtar sırası <see cref="Enum.GetNames{TEnum}()"/>'den gelir — elle yazılmadığı için
    /// kayamaz. Tonu olmayan bir enum değeri varsa BURADA patlar; sessizce boş ton dönmez.
    /// </summary>
    private static GrantStatusEntry Entry<TEnum>(IReadOnlyDictionary<TEnum, string> tones)
        where TEnum : struct, Enum
    {
        var names = Enum.GetNames<TEnum>();
        var values = Enum.GetValues<TEnum>();

        var missing = values.Where(v => !tones.ContainsKey(v)).ToList();
        if (missing.Count > 0)
        {
            throw new InvalidOperationException(
                $"{typeof(TEnum).Name} için ton tanımı eksik: {string.Join(", ", missing)}. " +
                "GrantStatusCatalog'a ekle — rozet tonsuz kalamaz.");
        }

        return new GrantStatusEntry(names, values.Select(v => tones[v]).ToArray());
    }
}

/// <summary>Bir enum'un istemciye giden karşılığı: sıralı adlar + aynı sıradaki tonlar.</summary>
public sealed record GrantStatusEntry(string[] Keys, string[] Tones);
