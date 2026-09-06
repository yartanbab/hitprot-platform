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
/// <see cref="AwaitingProtocol"/> ve <see cref="AccountCreated"/> host tarafından ELLE
/// SEÇİLMEZ; akış onları kendisi yazar (davet üretilince / hesap açılınca). Panelde
/// seçici bunları göstermez — elle "hesap açıldı" işaretlemek ortada hesap yokken
/// süreci bitmiş gösterirdi.
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
    Rejected = 4,

    /// <summary>
    /// Davet bağlantısı üretildi, adayın protokolü onaylaması bekleniyor.
    /// Akış yazar; host elle seçemez.
    /// </summary>
    AwaitingProtocol = 5,

    /// <summary>
    /// Protokol onaylandı ve kiracı hesabı açıldı — sürecin son durağı.
    /// Akış yazar; host elle seçemez.
    /// </summary>
    AccountCreated = 6
}
