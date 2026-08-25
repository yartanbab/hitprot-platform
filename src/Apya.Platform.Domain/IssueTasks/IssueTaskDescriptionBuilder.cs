using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;
using Apya.Platform.Feedbacks;
using Apya.Platform.Telemetry;

namespace Apya.Platform.IssueTasks;

/// <summary>
/// Kaynağın teşhis bağlamını görev açıklamasına dönüştürür. Çıktı HTML'dir — görev
/// açıklaması zengin metin olarak render edilir. Metin göreve KOPYALANIR: kaynak kayıt
/// saklama süresiyle temizlense bile görev tek başına okunabilir kalmalı.
/// </summary>
public static class IssueTaskDescriptionBuilder
{
    private const string DateFormat = "dd.MM.yyyy HH:mm";

    public static string ForFeedback(Feedback feedback, string? tenantName, string? note)
    {
        var sb = new StringBuilder();
        AppendNote(sb, note);

        sb.Append("<p><strong>").Append(E(feedback.FeedbackNumber)).Append("</strong> · ")
          .Append(E(TypeLabel(feedback.Type))).Append(" · ")
          .Append(E(tenantName ?? "Host")).Append(" · ")
          .Append(E(feedback.CreationTime.ToString(DateFormat, CultureInfo.InvariantCulture)))
          .Append("</p>");

        sb.Append("<p>").Append(Multiline(feedback.Body)).Append("</p>");

        AppendList(sb, "Ayrıntılar", ParseDetails(feedback.DetailsJson));

        var context = new List<KeyValuePair<string, string>>();
        Add(context, "Sayfa", feedback.PageUrl);
        Add(context, "Sayfa başlığı", feedback.PageTitle);
        Add(context, "Modül", feedback.ModuleCode);
        Add(context, "Bileşen", feedback.ComponentCode);
        Add(context, "Gönderen", feedback.IsAnonymous ? "(anonim)" : feedback.SubmittedByUserName);
        Add(context, "Kullanıcının önem değerlendirmesi", feedback.Severity?.ToString());
        Add(context, "Tarayıcı", feedback.UserAgent);
        Add(context, "Çözünürlük", feedback.ScreenResolution);
        Add(context, "Sürüm", feedback.AppVersion);
        AppendList(sb, "Bağlam", context);

        return Trim(sb.ToString());
    }

    public static string ForClientError(ClientError error, string? tenantName, string? note)
    {
        var sb = new StringBuilder();
        AppendNote(sb, note);

        sb.Append("<p><strong>İstemci hatası</strong> · ")
          .Append(E(error.Source.ToString())).Append(" · ")
          .Append(error.OccurrenceCount).Append(" oluşum · ")
          .Append(E(tenantName ?? "Host")).Append("</p>");

        sb.Append("<p>").Append(E(error.Message)).Append("</p>");

        AppendPre(sb, "Yığın izi", error.StackTrace);

        var context = new List<KeyValuePair<string, string>>();
        Add(context, "Sayfa", error.PageUrl);
        Add(context, "İlk görülme", error.FirstSeenAt.ToString(DateFormat, CultureInfo.InvariantCulture));
        Add(context, "Son görülme", error.LastSeenAt.ToString(DateFormat, CultureInfo.InvariantCulture));
        Add(context, "İmza", error.Fingerprint);
        Add(context, "Tarayıcı", error.UserAgent);
        Add(context, "Çözünürlük", error.ScreenResolution);
        Add(context, "Sürüm", error.AppVersion);
        AppendList(sb, "Bağlam", context);

        return Trim(sb.ToString());
    }

    public static string ForServerError(ServerErrorSignal signal, string? note)
    {
        var sb = new StringBuilder();
        AppendNote(sb, note);

        sb.Append("<p><strong>Sunucu hatası</strong> · ")
          .Append(E(signal.HttpMethod ?? "-")).Append(" ")
          .Append(E(signal.Url)).Append(" · ")
          .Append(signal.HttpStatusCode?.ToString(CultureInfo.InvariantCulture) ?? "-").Append(" · ")
          .Append(signal.OccurrenceCount).Append(" oluşum · ")
          .Append(E(signal.TenantName ?? "Host")).Append("</p>");

        AppendPre(sb, "Hata metni", signal.ExceptionText);

        var context = new List<KeyValuePair<string, string>>();
        Add(context, "İlk görülme", signal.FirstSeenAt.ToString(DateFormat, CultureInfo.InvariantCulture));
        Add(context, "Son görülme", signal.LastSeenAt.ToString(DateFormat, CultureInfo.InvariantCulture));
        Add(context, "Exception türü", signal.ExceptionType);
        AppendList(sb, "Bağlam", context);

        sb.Append("<p><em>Denetim günlüğü saklama süresiyle temizlenir; teşhis metni bu göreve kopyalanmıştır.</em></p>");

        return Trim(sb.ToString());
    }

    /* ---------- yardımcılar ---------- */

    private static void AppendNote(StringBuilder sb, string? note)
    {
        if (!string.IsNullOrWhiteSpace(note))
        {
            sb.Append("<p>").Append(Multiline(note!)).Append("</p><hr />");
        }
    }

    private static void AppendList(StringBuilder sb, string title, List<KeyValuePair<string, string>> items)
    {
        if (items.Count == 0)
        {
            return;
        }

        sb.Append("<p><strong>").Append(E(title)).Append("</strong></p><ul>");
        foreach (var item in items)
        {
            sb.Append("<li><strong>").Append(E(item.Key)).Append(":</strong> ")
              .Append(Multiline(item.Value)).Append("</li>");
        }
        sb.Append("</ul>");
    }

    private static void AppendPre(StringBuilder sb, string title, string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return;
        }

        sb.Append("<p><strong>").Append(E(title)).Append("</strong></p><pre>")
          .Append(E(text!)).Append("</pre>");
    }

    private static void Add(List<KeyValuePair<string, string>> list, string key, string? value)
    {
        if (!string.IsNullOrWhiteSpace(value))
        {
            list.Add(new KeyValuePair<string, string>(key, value!));
        }
    }

    private static List<KeyValuePair<string, string>> ParseDetails(string? json)
    {
        var result = new List<KeyValuePair<string, string>>();
        if (string.IsNullOrWhiteSpace(json))
        {
            return result;
        }

        try
        {
            using var doc = JsonDocument.Parse(json!);
            foreach (var prop in doc.RootElement.EnumerateObject())
            {
                var value = prop.Value.ValueKind == JsonValueKind.String
                    ? prop.Value.GetString()
                    : prop.Value.ToString();

                Add(result, FeedbackDetailLabels.For(prop.Name), value);
            }
        }
        catch (JsonException)
        {
            // Bozuk JSON teşhis verisidir; sessizce atlanır (panelde de aynı davranış).
        }

        return result;
    }

    private static string TypeLabel(FeedbackType type) => type switch
    {
        FeedbackType.Bug            => "Hata bildirimi",
        FeedbackType.Suggestion     => "Öneri",
        FeedbackType.Question       => "Soru",
        FeedbackType.Praise         => "Beğeni",
        FeedbackType.UsabilityIssue => "Kullanım zorluğu",
        FeedbackType.MissingContent => "Eksik içerik",
        FeedbackType.Performance    => "Performans",
        FeedbackType.UxDesign       => "Tasarım / deneyim",
        _                           => "Diğer"
    };

    /// <summary>HTML kaçışı — hata metni ve kullanıcı girdisi işaretleme İÇEREBİLİR.</summary>
    /// <summary>
    /// Yalnız HTML anlamı olan karakterleri kaçırır (&lt; &gt; &amp; " ').
    ///
    /// Önceden WebUtility.HtmlEncode kullanılıyordu; o yalnız 160–255 aralığını
    /// sayısal varlığa çeviriyor, 255 üstünü olduğu gibi bırakıyor. Türkçede
    /// sonuç tutarsızdı: "ç" ve "ü" kaçırılıp "ı", "ğ", "ş" kaçırılmıyordu
    /// ("Beklenen sonu&amp;#231;" ama "Ayrıntılar"). Çıktı UTF-8 olduğu için
    /// bunların hiçbirini kaçırmaya gerek yok; kaçırmak ayrıca açıklama uzunluk
    /// bütçesini (MaxDescriptionLength) her Türkçe harf için 6 katına çıkarıyordu.
    ///
    /// XSS koruması etkilenmez: &lt; ve &amp; hâlâ kaçırılıyor.
    /// </summary>
    private static readonly HtmlEncoder Encoder = HtmlEncoder.Create(UnicodeRanges.All);

    private static string E(string? value) => Encoder.Encode(value ?? string.Empty);

    /// <summary>Satır sonlarını korur; içerik yine kaçırılır.</summary>
    private static string Multiline(string value) =>
        E(value).Replace("\r\n", "<br />").Replace("\n", "<br />");

    /// <summary>Görev açıklaması alanının sınırını aşmayacak şekilde kırpar.</summary>
    private static string Trim(string html) =>
        html.Length <= IssueTaskConsts.MaxDescriptionLength
            ? html
            : html.Substring(0, IssueTaskConsts.MaxDescriptionLength - 3) + "…";
}
