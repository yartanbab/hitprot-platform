namespace Apya.Platform.Dashboard.Dtos;

/// <summary>
/// İstatistik bandındaki tek kutucuk.
/// <para>
/// KİLİT SÖZLEŞMESİ: <see cref="Locked"/> true ise <see cref="Value"/> ve
/// <see cref="DeltaValue"/> null'dır ve sunucu o sorguyu HİÇ atmaz — kilitli kutucuk
/// sayı sızdırmaz. UI yalnız bu bayrağı çizer; gizlemeyi frontend yapmaz.
/// </para>
/// </summary>
public class DashboardStatDto
{
    /// <summary>Kararlı kimlik (örn. "ontime-delivery") — UI eşlemesi buna bakar.</summary>
    public string Key { get; set; } = string.Empty;

    public DashboardStatGroup Group { get; set; }

    /// <summary>Yerelleştirilmiş etiket.</summary>
    public string Label { get; set; } = string.Empty;

    /// <summary>Kilitliyse null.</summary>
    public decimal? Value { get; set; }

    /// <summary>Kullanıcıya gösterilecek biçimlenmiş değer; kilitliyse boş string.</summary>
    public string Formatted { get; set; } = string.Empty;

    /// <summary>"%", "g", "sa", "₺" gibi birim; birimsizse boş string.</summary>
    public string Unit { get; set; } = string.Empty;

    /// <summary>Önceki döneme göre fark. Karşılaştırma yapılamıyorsa null.</summary>
    public decimal? DeltaValue { get; set; }

    public string DeltaFormatted { get; set; } = string.Empty;

    public DashboardTrend Trend { get; set; }

    /// <summary>Kutucuğun gerektirdiği izin adı — tasarımda mono 9px olarak gösterilir.</summary>
    public string RequiredPermission { get; set; } = string.Empty;

    public bool Locked { get; set; }
}
