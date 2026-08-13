using System;
using System.Collections.Generic;

namespace Apya.Platform.Shell.Dtos;

/// <summary>
/// Kenar çubuğunun tek veri paketi — rozet sayıları, sabitlemeler, proje alt
/// listesi ve sistem durumu. Kabuk her sayfada render edildiği için dört ayrı
/// istek yerine tek çağrı yapılır.
/// </summary>
public class ShellStateDto
{
    /// <summary>Sabitlenen menü öğelerinin ADLARI (etiket değil) — bkz. PlatformSettings.Shell.Pins.</summary>
    public List<string> Pins { get; set; } = new();

    /// <summary>Rozet sayıları — sıfır olanlar da döner, istemci sıfırı basmaz.</summary>
    public ShellBadgesDto Badges { get; set; } = new();

    /// <summary>Projeler alt listesi (ada göre sıralı, üst N).</summary>
    public List<ShellProjectDto> Projects { get; set; } = new();

    /// <summary>Kenar çubuğu dibindeki durum satırı.</summary>
    public ShellHealthDto Health { get; set; } = new();
}

public class ShellBadgesDto
{
    /// <summary>
    /// Süresi geçmiş görev sayısı. KAPSAM: yalnız oturumdaki kullanıcıya ATANMIŞ
    /// görevler. Bilinçli daraltma — tüm görevleri saymak, kullanıcının göremediği
    /// gizli görevlerin varlığını rozet üzerinden ele verirdi.
    /// </summary>
    public int OverdueTasks { get; set; }

    /// <summary>Karar bekleyen hibe başvurusu (yalnız host bağlamı + Grants.Edit).</summary>
    public int PendingGrantApplications { get; set; }

    /// <summary>Son 24 saatte başarısız webhook teslimi (yalnız DynamicAssets yetkisi).</summary>
    public int WebhookErrors { get; set; }
}

public class ShellProjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;

    /// <summary>Kapanmamış görev sayısı (Done ve Cancelled hariç), gizlilik filtresi uygulanmış.</summary>
    public int OpenTaskCount { get; set; }
}

public class ShellHealthDto
{
    /// <summary>false ise durum noktası negatife döner ve metin değişir.</summary>
    public bool IsHealthy { get; set; } = true;

    /// <summary>Kenar çubuğu dibinde gösterilen sürüm.</summary>
    public string Version { get; set; } = string.Empty;

    /// <summary>
    /// Barındırma ortamı ("Development" / "Staging" / "Production").
    /// Üst bardaki ortam çipi bunu okur — handoff kuralı: PROD'da çip HİÇ
    /// gösterilmez, dikkat yalnız riskli ortamda harcanır.
    /// </summary>
    public string Environment { get; set; } = string.Empty;
}
