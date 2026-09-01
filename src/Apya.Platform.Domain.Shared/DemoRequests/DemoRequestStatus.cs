namespace Apya.Platform.DemoRequests;

/// <summary>
/// Demo talebinin takip durumu. Talep panelden işlenir; akış tek yönlü değildir
/// (yanlış işaretlenen kayıt geri alınabilir).
/// </summary>
public enum DemoRequestStatus
{
    /// <summary>Henüz kimse dokunmadı.</summary>
    New = 0,

    /// <summary>Arandı / e-posta atıldı; sonuç bekleniyor.</summary>
    Contacted = 1,

    /// <summary>Süreç bitti (demo verildi, müşteri oldu ya da vazgeçti).</summary>
    Closed = 2
}
