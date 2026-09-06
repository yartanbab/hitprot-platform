using System;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.Tenants;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Agreements;

/// <summary>
/// Protokol metnini doldurur ve doğrulama özetini hesaplar.
///
/// <para><b>Hash zinciri (Madde 9):</b> özet, <c>{{HASH_VERIFICATION_TOKEN}}</c> yer tutucusu
/// HÂLÂ YERİNDEYKEN hesaplanır; sonra yer tutucu özetle değiştirilir. Aksi halde "özeti
/// içeren metnin özeti" gerekirdi — çözümsüz bir döngü. Sonuç: saklanan metinde özeti tekrar
/// yer tutucuya çevirip yeniden hash'leyen herkes aynı değeri bulur
/// (<see cref="VerifyHash"/> tam olarak bunu yapar).</para>
///
/// <para>🔐 Adaydan gelen her değer <see cref="WebUtility.HtmlEncode"/> ile kaçırılır: unvan
/// ve adres serbest metindir, ham basılsaydı protokol sayfası saklanmış XSS taşırdı.</para>
/// </summary>
public class ProtocolRenderer : ITransientDependency
{
    /// <summary>
    /// Onay ÖNCESİ gösterilen belge. Onay bloğu (zaman damgası, IP, hash) bilerek boş
    /// bırakılır: o değerler onay anında doğar. Uydurulmuş bir zaman damgası göstermek,
    /// adaya imzaladığından farklı bir belge okutmak olurdu.
    /// </summary>
    public string RenderPreview(
        RegistrationRequest request,
        SalesPlan plan,
        decimal? amount,
        decimal successFeePercent,
        DateTime today)
        => Fill(request, PendingMarker, plan, amount, successFeePercent, today, PendingMarker, PendingMarker)
            .Replace(ProtocolTemplate.Keys.VerificationHash, PendingMarker);

    /// <summary>
    /// Onaylanan belgeyi üretir ve (metin, özet) çiftini döner. Saklanacak olan budur.
    /// </summary>
    public (string Html, string Hash) RenderApproved(
        RegistrationRequest request,
        string protocolNumber,
        SalesPlan plan,
        decimal? amount,
        decimal successFeePercent,
        DateTime approvedAt,
        string? ipAddress)
    {
        var filled = Fill(
            request,
            protocolNumber,
            plan,
            amount,
            successFeePercent,
            approvedAt,
            ipAddress ?? "—",
            approvedAt.ToString("dd.MM.yyyy HH:mm:ss", TrCulture));

        var hash = ComputeHash(filled);

        return (filled.Replace(ProtocolTemplate.Keys.VerificationHash, hash), hash);
    }

    /// <summary>
    /// Ortak doldurma. <c>{{HASH_VERIFICATION_TOKEN}}</c> BİLEREK dokunulmadan bırakılır —
    /// özet, yer tutucu yerindeyken hesaplanır (bkz. sınıf açıklaması).
    /// </summary>
    private static string Fill(
        RegistrationRequest request,
        string protocolNumber,
        SalesPlan plan,
        decimal? amount,
        decimal successFeePercent,
        DateTime date,
        string ipText,
        string timestampText)
        => new StringBuilder(ProtocolTemplate.Html)
            .Replace(ProtocolTemplate.Keys.ProtocolNumber, Enc(protocolNumber))
            .Replace(ProtocolTemplate.Keys.Date, Enc(date.ToString("dd.MM.yyyy", TrCulture)))
            .Replace(ProtocolTemplate.Keys.CompanyName, Enc(request.CompanyName))
            .Replace(ProtocolTemplate.Keys.TaxNumber, Enc(BuildTaxLine(request)))
            .Replace(ProtocolTemplate.Keys.Address, Enc(request.Address))
            .Replace(ProtocolTemplate.Keys.AuthorizedEmail, Enc(request.Email))
            .Replace(ProtocolTemplate.Keys.Phone, Enc(request.Phone))
            .Replace(ProtocolTemplate.Keys.PlanName, Enc(SalesPlanCatalog.DisplayName(plan)))
            .Replace(ProtocolTemplate.Keys.Amount, Enc(FormatAmount(amount)))
            .Replace(ProtocolTemplate.Keys.SuccessFeePercent, Enc(FormatPercent(successFeePercent)))
            .Replace(ProtocolTemplate.Keys.AuthorizedName, Enc(request.FullName))
            .Replace(ProtocolTemplate.Keys.AuthorizedTitle, Enc(request.AuthorizedTitle))
            .Replace(ProtocolTemplate.Keys.UserEmail, Enc(request.Email))
            .Replace(ProtocolTemplate.Keys.ApprovalIp, Enc(ipText))
            .Replace(ProtocolTemplate.Keys.ApprovalTimestamp, Enc(timestampText))
            .ToString();

    /// <summary>Önizlemede henüz doğmamış alanların yerine basılan metin.</summary>
    private const string PendingMarker = "onay anında doldurulacaktır";

    /// <summary>
    /// Saklanan metnin özetiyle tutarlı olup olmadığını denetler — belge kurcalanmışsa
    /// <c>false</c> döner. Kiracı sözleşmesini görüntülerken bu kontrol çalışır.
    /// </summary>
    public bool VerifyHash(string renderedHtml, string expectedHash)
    {
        if (renderedHtml.IsNullOrWhiteSpace() || expectedHash.IsNullOrWhiteSpace())
        {
            return false;
        }

        // Özeti yer tutucuya geri çevirip yeniden hesapla — üretimdeki sıranın tersi.
        var withPlaceholder = renderedHtml.Replace(expectedHash, ProtocolTemplate.Keys.VerificationHash);

        return string.Equals(ComputeHash(withPlaceholder), expectedHash, StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// SHA-256, küçük harf hex. Satır sonları CRLF→LF normalize edilir: aynı metin farklı
    /// işletim sistemlerinde farklı özet vermemeli, yoksa doğrulama Windows'ta geçip
    /// Linux'ta düşerdi.
    /// </summary>
    private static string ComputeHash(string content)
    {
        var normalized = content.Replace("\r\n", "\n").Replace("\r", "\n");
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(normalized));

        return Convert.ToHexStringLower(bytes);
    }

    /// <summary>Vergi dairesi varsa "Halkalı V.D. – 1234567890", yoksa yalnız numara.</summary>
    private static string BuildTaxLine(RegistrationRequest request)
        => request.TaxOffice.IsNullOrWhiteSpace()
            ? request.TaxNumber
            : $"{request.TaxOffice} – {request.TaxNumber}";

    /// <summary>
    /// "24.000,00 TL + KDV". Bedel girilmemişse metne rakam UYDURULMAZ; sözleşmede
    /// görüşmeye bırakıldığı açıkça yazar.
    /// </summary>
    private static string FormatAmount(decimal? amount)
        => amount.HasValue
            ? $"{amount.Value.ToString("N2", TrCulture)} TL + KDV"
            : "Taraflarca ayrıca belirlenecektir";

    /// <summary>Tam sayı oranda ondalık basma: "%12", "%12,5" değil "%12".</summary>
    private static string FormatPercent(decimal percent)
        => percent == decimal.Truncate(percent)
            ? decimal.Truncate(percent).ToString(CultureInfo.InvariantCulture)
            : percent.ToString("0.##", TrCulture);

    /// <summary>
    /// HTML kaçırma — yalnız yapıyı bozabilen beş karakter.
    ///
    /// <para><c>WebUtility.HtmlEncode</c> BİLEREK kullanılmadı: o, ASCII dışındaki her
    /// karakteri sayısal varlığa çevirir ve "Örnek Derneği" belgede
    /// <c>&amp;#214;rnek Derne&amp;#287;i</c> olarak saklanır. Tarayıcıda doğru görünse de
    /// saklanan metin hukuki belgedir — insan gözüyle okunabilir, kopyalanabilir ve
    /// karşılaştırılabilir kalmalıdır. Sayfa UTF-8 olduğu için Türkçe harfleri kaçırmanın
    /// güvenlik açısından bir katkısı yok; XSS için bu beş karakter yeterlidir.</para>
    /// </summary>
    private static string Enc(string? value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return string.Empty;
        }

        // Sıra ÖNEMLİ: & önce kaçırılmalı, yoksa sonraki kaçırmaların & işaretleri
        // ikinci kez kaçırılıp "&amp;lt;" gibi bozuk çıktı üretir.
        return value
            .Replace("&", "&amp;")
            .Replace("<", "&lt;")
            .Replace(">", "&gt;")
            .Replace("\"", "&quot;")
            .Replace("'", "&#39;");
    }

    private static readonly CultureInfo TrCulture = CultureInfo.GetCultureInfo("tr-TR");
}
