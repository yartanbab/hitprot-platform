namespace Apya.Platform.Billing;

/// <summary>
/// Host'un kiracıya kestiği faturanın tahsilat durumu.
/// <para>
/// <b>"Vadesi geçti" burada YOK</b> — o bir durum değil, tarih karşılaştırmasıdır
/// (<see cref="Apya.Platform.Billing.SubscriptionInvoice.IsOverdue"/>). Kolona yazılsaydı
/// her gün çalışıp durumları güncelleyen bir işe ihtiyaç duyardık ve o iş bir gün
/// koşmayınca liste yalan söylerdi.
/// </para>
/// </summary>
public enum SubscriptionInvoiceStatus
{
    /// <summary>Kesildi, tahsilat bekleniyor.</summary>
    Issued = 1,

    /// <summary>Kısmi tahsilat yapıldı.</summary>
    PartiallyPaid = 2,

    /// <summary>Tamamı tahsil edildi.</summary>
    Paid = 3,

    /// <summary>İptal edildi (yanlış kesildi, iade, vazgeçildi).</summary>
    Cancelled = 4
}
