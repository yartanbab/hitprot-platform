namespace Apya.Platform.Documents;

/// <summary>
/// Belgenin yaşam döngüsü durumu.
/// Matched, belgenin bir harcama/fatura kalemine bağlandığını gösterir (Faz E).
/// Expired, ExpiryDate geçmiş belgeler için DocumentExpiryWorker tarafından işaretlenir.
/// </summary>
public enum DocumentFileStatus
{
    Draft = 1,
    Final = 2,
    Matched = 3,
    Expired = 4
}
