namespace Apya.Platform.CustomerLedger;

/// <summary>
/// APYA-142: Cari hareket yönü (Türk muhasebe konvansiyonu, müşteri/alıcı perspektifi).
/// Borç = müşteri bize borçlandı (satış faturası). Alacak = müşteriden tahsilat / bizim ona borcumuz.
/// Bakiye = Σ Borç − Σ Alacak (pozitif → müşteri bize borçlu).
/// </summary>
public enum CustomerLedgerDirection
{
    /// <summary>Borç — satış faturası, müşteriye yansıtılan tutar.</summary>
    Debit = 0,

    /// <summary>Alacak — tahsilat, iade, müşteri lehine kayıt.</summary>
    Credit = 1,
}

/// <summary>APYA-142: Cari hareketin kaynağı.</summary>
public enum CustomerLedgerSource
{
    /// <summary>Açılış bakiyesi.</summary>
    Opening = 0,

    /// <summary>Satış faturasından tahakkuk (Borç).</summary>
    Invoice = 1,

    /// <summary>Tahsilat (Alacak).</summary>
    Payment = 2,

    /// <summary>Elle düzeltme/mahsup.</summary>
    Manual = 3,
}
