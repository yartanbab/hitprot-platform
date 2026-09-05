namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// Kayıt talebinin süreç durumu.
/// <para>
/// Sayısal değerler DEMO TALEBİ döneminden devralındı ve KORUNDU: <c>New</c> ve
/// <c>Closed</c> aynı sayıda kaldığı için var olan satırlar veri taşıma gerektirmez.
/// <c>Contacted</c> yalnız ad değiştirdi (<see cref="InReview"/>) — anlamı zaten
/// "elimize aldık" idi.
/// </para>
/// <para>
/// Protokol onayı ve hesap açılışı durumları (Faz 2) BİLEREK yok: bugün onları
/// üretecek bir akış olmadığı için panelde ölü seçenek olarak durmaları yanıltırdı.
/// </para>
/// </summary>
public enum RegistrationRequestStatus
{
    /// <summary>Henüz kimse dokunmadı.</summary>
    New = 0,

    /// <summary>Ekip talebi inceliyor / adayla görüşüyor.</summary>
    InReview = 1,

    /// <summary>Süreç sonuçsuz kapandı (aday vazgeçti, ulaşılamadı).</summary>
    Closed = 2,

    /// <summary>Onaylandı — protokol adımına geçmeye hazır.</summary>
    Approved = 3,

    /// <summary>Talep reddedildi. Gerekçe iç notta durur, adaya gösterilmez.</summary>
    Rejected = 4
}
