using System;
using System.Collections.Generic;
using Volo.Abp.EventBus;

namespace Apya.Platform.Documents;

/// <summary>
/// 🔴 DOC-05 / NTF-07 · Bir belgenin geçerlilik tarihi yaklaşıyor ya da doldu.
///
/// <para>Belgeye girilen geçerlilik tarihi (dosya düzeyi) ekranlarda "N gün kaldı" diye
/// gösteriliyordu ama hiçbir iş tarafından okunmuyordu: mevcut hatırlatma yalnız KLASÖR
/// düzeyindeki eski tarihi izliyor. Sözleşmesinin bitişini belgeye yazan kullanıcı hiç
/// uyarılmıyordu.</para>
///
/// <para><see cref="ExpiryDate"/> ve <see cref="Threshold"/> tekillik anahtarının parçasıdır:
/// her eşik tarih başına BİR KEZ bildirilir; tarih uzatılırsa eşikler yeni tarih için
/// yeniden çalışır.</para>
/// </summary>
[EventName("Apya.Platform.Documents.DocumentFileExpiry")]
public class DocumentFileExpiryEto
{
    public Guid DocumentFileId { get; set; }

    /// <summary>Belgenin durduğu klasör — bildirim oraya götürür.</summary>
    public Guid DocumentId { get; set; }

    public string DisplayName { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }

    /// <summary>Geçerliliğin bitmesine kalan tam gün. 0 = bugün doluyor, negatif = doldu.</summary>
    public int DaysRemaining { get; set; }

    /// <summary>İçinde bulunulan eşik: 30, 7 ya da 0 (bugün doluyor / doldu).</summary>
    public int Threshold { get; set; }

    /// <summary>Belgeyi yükleyen + belge bir projeye bağlıysa o projenin liderleri.</summary>
    public List<Guid> RecipientIds { get; set; } = new();
}
