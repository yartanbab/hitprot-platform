namespace Apya.Platform.Billing;

/// <summary>
/// Faturalama sabitleri.
///
/// <para><b>Para birimi TL'dir ve alan olarak TUTULMAZ.</b> Protokolün 3. ve 5. maddeleri
/// bedeli TL üzerinden bağlar; kolon açmak, hiçbir yerde doldurulmayan ve raporlarda
/// yanlış toplamlara yol açabilecek bir serbestlik olurdu. Döviz gerekirse o gün ayrı bir
/// karar olarak eklenir.</para>
/// </summary>
public static class BillingConsts
{
    /// <summary>Fatura takip numarasının ön eki — "APYA-FTR-2026-0001".</summary>
    public const string NumberPrefix = "APYA-FTR-";

    /// <summary>Protokol Madde 5.1: fatura tarihinden itibaren ödeme vadesi (gün).</summary>
    public const int DefaultDueDays = 15;

    /// <summary>Yüklenen dosyalar için üst sınır (byte). Fatura/dekont PDF'i için fazlasıyla yeter.</summary>
    public const int MaxFileSizeBytes = 10 * 1024 * 1024;

    /// <summary>
    /// Kabul edilen uzantılar. Resmî belge ve dekont pratikte PDF ya da fotoğraftır;
    /// liste dar tutuldu — çalıştırılabilir bir şeyin sunucuya inmesi için sebep yok.
    /// </summary>
    public static readonly string[] AllowedFileExtensions = { ".pdf", ".jpg", ".jpeg", ".png" };

    // --- Alan uzunlukları ---
    public const int MaxNumberLength = 32;
    public const int MaxOfficialNumberLength = 64;
    public const int MaxNotesLength = 1000;
    public const int MaxFileNameLength = 260;
    public const int MaxStoredFileNameLength = 100;
    public const int MaxReferenceLength = 128;
}
