using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 3a · Yapıştırılan çağrı metninden alan çıkarımı.
///
/// <para><b>Bu bir AI değil, DESEN eşleştiricidir.</b> Türkçe çağrı metinlerinin
/// kalıplaşmış ifadelerini (“azami destek tutarı … TL”, “destek oranı %…”, “en fazla … ay”,
/// “… tarihine kadar”) arar. Bulamadığı alan boş döner ve host elle girer — hiçbir değer
/// tahmin edilmez. Güven skoru desenin ne kadar bağlayıcı olduğundan gelir, olasılıktan değil.</para>
///
/// <para>Saf hesap: kalıcılık yok, DI'sız test edilebilir.</para>
/// </summary>
public class GrantTextExtractor : DomainService
{
    // Alan anahtarları GrantDraftField.FieldKey ile birebir; UI de bunlarla yerelleştirir.
    public const string FieldName = "Name";
    public const string FieldIssuer = "Issuer";
    public const string FieldMaxAmount = "MaxAmount";
    public const string FieldSupportRate = "SupportRatePercent";
    public const string FieldDeadline = "Deadline";
    public const string FieldDuration = "ProjectDurationMonths";
    public const string FieldCompanyAge = "MinCompanyAgeYears";
    public const string FieldCompanySizes = "EligibleCompanySizes";
    public const string FieldConsortium = "RequiresConsortium";
    public const string FieldRdStaff = "MinRdStaffCount";
    public const string FieldTrl = "Trl";
    public const string FieldNace = "Nace";
    public const string FieldDocument = "DocumentRequirement";

    /// <summary>Formun "N / 13 alan dolu" sayacındaki payda.</summary>
    public static readonly string[] AllFields =
    {
        FieldName, FieldIssuer, FieldMaxAmount, FieldSupportRate, FieldDeadline, FieldDuration,
        FieldCompanyAge, FieldCompanySizes, FieldConsortium, FieldRdStaff, FieldTrl, FieldNace,
        FieldDocument
    };

    // 🔴 Desenlerdeki boşluk aralığı [^.] — satır sonunu GEÇER, cümle sonunu geçmez.
    // Yapıştırılan metin satır kaydırdığında "destek oranı" ile "%70" ayrı satırlara
    // düşüyor; satır sonunu dışlayan bir aralık bunları sessizce okuyamazdı.
    private static readonly RegexOptions Opts =
        RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Singleline;

    private static readonly string[] TurkishMonths =
    {
        "ocak", "şubat", "mart", "nisan", "mayıs", "haziran",
        "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık"
    };

    public IReadOnlyList<GrantExtractedField> Extract(string? text)
    {
        var results = new List<GrantExtractedField>();
        if (string.IsNullOrWhiteSpace(text))
        {
            return results;
        }

        AddIdentity(text, results);
        AddMoney(text, results);
        AddSupportRate(text, results);
        AddDuration(text, results);
        AddDeadline(text, results);
        AddCompanyAge(text, results);
        AddCompanySizes(text, results);
        AddConsortium(text, results);
        AddRdStaff(text, results);
        AddTrl(text, results);
        AddDocument(text, results);

        return results;
    }

    /// <summary>İlk dolu satır başlıktır; "Kurum — Program" kalıbı varsa ikiye ayrılır.</summary>
    private static void AddIdentity(string text, List<GrantExtractedField> results)
    {
        var firstLine = text
            .Split('\n')
            .Select(l => l.Trim())
            .FirstOrDefault(l => l.Length > 0);
        if (firstLine == null)
        {
            return;
        }

        var parts = firstLine.Split(new[] { " — ", " – ", " - " }, 2, StringSplitOptions.None);
        if (parts.Length == 2)
        {
            // Ayraçlı başlıkta sol taraf kurum, sağ taraf program adıdır.
            results.Add(new GrantExtractedField(FieldIssuer, parts[0].Trim(), 78, firstLine));
            results.Add(new GrantExtractedField(FieldName, parts[1].Trim(), 78, firstLine));
        }
        else
        {
            // Ayraç yoksa yalnız program adı tahmin edilir; kurum host'a bırakılır.
            results.Add(new GrantExtractedField(FieldName, firstLine, 62, firstLine));
        }
    }

    private static void AddMoney(string text, List<GrantExtractedField> results)
    {
        // "azami destek tutarı 2.500.000 TL" — tutar sözcüğüne DEMİRLENİR, metindeki
        // rastgele bir para birimini almamak için.
        var m = Regex.Match(
            text,
            @"(?:azami|en fazla|üst limit|üst sınır)[^.]{0,60}?([\d][\d.\s]{3,})\s*(?:TL|₺)",
            Opts);
        var confidence = 96;
        if (!m.Success)
        {
            m = Regex.Match(text, @"(?:destek tutarı|hibe tutarı)[^.]{0,40}?([\d][\d.\s]{3,})\s*(?:TL|₺)", Opts);
            confidence = 88;
        }
        if (m.Success)
        {
            results.Add(new GrantExtractedField(FieldMaxAmount, Digits(m.Groups[1].Value), confidence, Excerpt(m)));
        }
    }

    private static void AddSupportRate(string text, List<GrantExtractedField> results)
    {
        var m = Regex.Match(text, @"destek oranı[^.]{0,60}?%\s*(\d{1,3})", Opts);
        if (!m.Success)
        {
            m = Regex.Match(text, @"%\s*(\d{1,3})[^.]{0,30}?(?:destek|hibe)", Opts);
        }
        if (m.Success && int.TryParse(m.Groups[1].Value, out var rate) && rate is > 0 and <= 100)
        {
            results.Add(new GrantExtractedField(FieldSupportRate, rate.ToString(), 94, Excerpt(m)));
        }
    }

    private static void AddDuration(string text, List<GrantExtractedField> results)
    {
        var m = Regex.Match(text, @"(?:proje süresi|süre)[^.]{0,40}?(\d{1,3})\s*ay", Opts);
        if (m.Success && int.TryParse(m.Groups[1].Value, out var months) && months is > 0 and <= 240)
        {
            results.Add(new GrantExtractedField(FieldDuration, months.ToString(), 92, Excerpt(m)));
        }
    }

    private static void AddDeadline(string text, List<GrantExtractedField> results)
    {
        // Önce "14 Ekim 2026", sonra "14.10.2026".
        var m = Regex.Match(text, @"(\d{1,2})\s+(" + string.Join("|", TurkishMonths) + @")\s+(\d{4})", Opts);
        if (m.Success)
        {
            var day = int.Parse(m.Groups[1].Value);
            var month = Array.IndexOf(TurkishMonths, m.Groups[2].Value.ToLowerInvariant()) + 1;
            var year = int.Parse(m.Groups[3].Value);
            if (TryDate(year, month, day, out var date))
            {
                results.Add(new GrantExtractedField(FieldDeadline, date.ToString("yyyy-MM-dd"), 99, Excerpt(m)));
                return;
            }
        }

        m = Regex.Match(text, @"(\d{1,2})[./](\d{1,2})[./](\d{4})", Opts);
        if (m.Success
            && TryDate(int.Parse(m.Groups[3].Value), int.Parse(m.Groups[2].Value), int.Parse(m.Groups[1].Value), out var d2))
        {
            results.Add(new GrantExtractedField(FieldDeadline, d2.ToString("yyyy-MM-dd"), 90, Excerpt(m)));
        }
    }

    private static void AddCompanyAge(string text, List<GrantExtractedField> results)
    {
        var m = Regex.Match(text, @"en az\s*(\d{1,2})\s*yıl[^.]{0,30}?faaliyet", Opts);
        if (m.Success)
        {
            results.Add(new GrantExtractedField(FieldCompanyAge, m.Groups[1].Value, 90, Excerpt(m)));
        }
    }

    private static void AddCompanySizes(string text, List<GrantExtractedField> results)
    {
        // "küçük ve orta ölçekli" — ölçek sözcükleri "ölçekli" ifadesine yakın aranır.
        var m = Regex.Match(text, @"((?:mikro|küçük|orta|büyük)(?:[,\s]+(?:ve|veya)?\s*(?:mikro|küçük|orta|büyük))*)\s*ölçek", Opts);
        if (!m.Success)
        {
            return;
        }

        var found = new List<CompanySize>();
        var phrase = m.Groups[1].Value.ToLowerInvariant();
        if (phrase.Contains("mikro")) { found.Add(CompanySize.Mikro); }
        if (phrase.Contains("küçük")) { found.Add(CompanySize.Kucuk); }
        if (phrase.Contains("orta")) { found.Add(CompanySize.Orta); }
        if (phrase.Contains("büyük")) { found.Add(CompanySize.Buyuk); }
        if (found.Count == 0)
        {
            return;
        }

        var mask = found.Aggregate(0, (acc, s) => acc | (int)s);
        results.Add(new GrantExtractedField(FieldCompanySizes, mask.ToString(), 86, Excerpt(m)));
    }

    private static void AddConsortium(string text, List<GrantExtractedField> results)
    {
        var m = Regex.Match(text, @"konsorsiyum[^.]{0,60}", Opts);
        if (!m.Success)
        {
            return;
        }
        var phrase = m.Value.ToLowerInvariant();
        // "kabul edilmez" olumsuzlar; "zorunlu/şart" olumlar. İkisi de yoksa karar verilmez.
        if (phrase.Contains("kabul edilmez") || phrase.Contains("aranmaz"))
        {
            results.Add(new GrantExtractedField(FieldConsortium, "false", 90, Excerpt(m)));
        }
        else if (phrase.Contains("zorunlu") || phrase.Contains("şart"))
        {
            results.Add(new GrantExtractedField(FieldConsortium, "true", 90, Excerpt(m)));
        }
    }

    private static void AddRdStaff(string text, List<GrantExtractedField> results)
    {
        var m = Regex.Match(text, @"en az\s*(?:(\d{1,3})|iki|üç|dört|beş)\s*\(?(\d{1,3})?\)?\s*(?:adet\s*)?ar-?ge personel", Opts);
        if (!m.Success)
        {
            return;
        }
        var value = m.Groups[1].Success ? m.Groups[1].Value
            : m.Groups[2].Success ? m.Groups[2].Value
            : null;
        if (value != null)
        {
            results.Add(new GrantExtractedField(FieldRdStaff, value, 88, Excerpt(m)));
        }
    }

    private static void AddTrl(string text, List<GrantExtractedField> results)
    {
        var m = Regex.Match(text, @"TRL\s*(\d)\s*(?:ile|-|–|—)\s*(?:TRL\s*)?(\d)", Opts);
        if (m.Success)
        {
            results.Add(new GrantExtractedField(FieldTrl, $"{m.Groups[1].Value}-{m.Groups[2].Value}", 93, Excerpt(m)));
        }
    }

    private static void AddDocument(string text, List<GrantExtractedField> results)
    {
        // Belge adları çok çeşitli; yalnız açıkça "belge/sertifika" geçen ISO kalıbı okunur.
        var m = Regex.Match(text, @"(ISO\s*\d{4,5}(?:\s*(?:veya|ile|ve)\s*ISO\s*\d{4,5})*)[^.]{0,40}?belge", Opts);
        if (m.Success)
        {
            results.Add(new GrantExtractedField(FieldDocument, m.Groups[1].Value.Trim(), 88, Excerpt(m)));
        }
    }

    private static bool TryDate(int year, int month, int day, out DateTime date)
    {
        date = default;
        if (month is < 1 or > 12 || day < 1 || year is < 2000 or > 2100)
        {
            return false;
        }
        if (day > DateTime.DaysInMonth(year, month))
        {
            return false;
        }
        date = new DateTime(year, month, day, 0, 0, 0, DateTimeKind.Unspecified);
        return true;
    }

    private static string Digits(string raw)
        => new string(raw.Where(char.IsDigit).ToArray());

    /// <summary>Vurgulanacak pasaj — 3a metninde <c>mark</c> ile işaretlenir.</summary>
    private static string Excerpt(Match m)
        => m.Value.Trim().Length > 180 ? m.Value.Trim()[..180] : m.Value.Trim();
}

/// <summary>Metinden okunmuş tek alan.</summary>
public sealed record GrantExtractedField(string FieldKey, string? Value, int Confidence, string? Excerpt);
