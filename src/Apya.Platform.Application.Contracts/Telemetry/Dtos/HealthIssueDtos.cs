using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Telemetry.Dtos;

/// <summary>
/// Bir olayın hangi kanaldan geldiği. İlk üç değer <see cref="ClientErrorSource"/>
/// ile SAYISAL OLARAK aynıdır — dönüşüm doğrudan cast'tir, eşleme tablosu yok.
/// </summary>
public enum HealthIssueKind
{
    ClientJs      = 1,
    ClientPromise = 2,
    ClientAjax    = 3,

    /// <summary>Sunucuda patlayan uç — 5xx ya da ele alınmamış istisna (AbpAuditLogs).</summary>
    ServerError = 4,

    /// <summary>Hata vermeyen ama yavaşlık eşiğini aşan uç.</summary>
    Performance = 5,

    /// <summary>
    /// Sunucunun 4xx ile geri çevirdiği istek: 401/403 yetki · 404 bulunamadı ·
    /// 400 doğrulama. <b>Arıza değildir</b> — sağlık oranına girmez; ayrı kanal
    /// olmasının sebebi teşhis değeri: aynı uçta biriken 403'ler "kullanıcı
    /// göremeyeceği bir düğmeyi görüyor" demektir.
    /// </summary>
    RequestRejected = 6
}

public enum HealthIssueSort
{
    /// <summary>Etki skoru — oluşum × etkilenen kullanıcı × yenilik.</summary>
    Impact = 0,
    LastSeen = 1,
    Occurrence = 2
}

/// <summary>
/// Teşhis konsolunun tek satırı: istemci hatası, sunucu hatası ve performans ihlali
/// aynı listede, ortak alanlarla.
/// <para>
/// <b>Ölçülemeyen alanlar null'dır, sıfır DEĞİL.</b> İstemci hatası tablosu zaman
/// serisi ve kullanıcı sayacı tutmuyor (yalnız FirstSeenAt/LastSeenAt/OccurrenceCount
/// ve LastUserId); bu yüzden istemci satırlarında <see cref="Trend"/> ve
/// <see cref="AffectedUserCount"/> boştur. Arayüz bunlara "—" çizer, uydurma sayı
/// göstermez.
/// </para>
/// </summary>
public class HealthIssueDto
{
    /// <summary>
    /// Satırın tekil kimliği: istemci hatasında Fingerprint, sunucu/performans
    /// olayında (metot + normalize yol) özeti.
    /// </summary>
    public string Key { get; set; } = string.Empty;

    public HealthIssueKind Kind { get; set; }

    public string Title { get; set; } = string.Empty;

    /// <summary>Olayın geçtiği yer: istemcide sayfa yolu, sunucuda normalize uç.</summary>
    public string? Where { get; set; }

    /// <summary>Sunucu/performans olaylarında uç kimliğinin ikinci yarısı.</summary>
    public string? HttpMethod { get; set; }

    /// <summary>Sunucu/performans olaylarında en son görülen durum kodu.</summary>
    public int? HttpStatusCode { get; set; }

    /// <summary>
    /// Sunucu/performans olaylarında ağırlıklı ortalama süre. İstemci hatalarında
    /// <b>null</b> — tarayıcı tarafında süre ölçülmüyor.
    /// </summary>
    public double? AverageDurationMs { get; set; }

    public Guid? TenantId { get; set; }
    public string? TenantName { get; set; }

    public int OccurrenceCount { get; set; }

    /// <summary>
    /// Etkilenen benzersiz kullanıcı. Sunucu/performans olaylarında audit log'dan
    /// sayılır; <b>istemci hatalarında null</b> — ClientError yalnız son kullanıcıyı
    /// tutar, dağıtık sayaç yoktur.
    /// </summary>
    public int? AffectedUserCount { get; set; }

    public DateTime FirstSeenAt { get; set; }
    public DateTime LastSeenAt { get; set; }

    /// <summary>Yalnız istemci hatalarında anlamlı; diğerlerinde daima false.</summary>
    public bool IsResolved { get; set; }

    /// <summary>
    /// Pencereye yayılmış 10 kova. <b>İstemci hatalarında null</b> — zaman serisi
    /// tutulmuyor, tek satır her oluşumda üzerine yazılıyor.
    /// </summary>
    public List<int>? Trend { get; set; }

    /// <summary>İlk görülme pencerenin son %20'sine düşüyor: yeni çıkmış bir arıza.</summary>
    public bool IsRegression { get; set; }

    /// <summary>Sıralama ölçütü — bkz. <see cref="HealthIssueSort.Impact"/>.</summary>
    public double ImpactScore { get; set; }

    /// <summary>
    /// İstemci hatasıysa kaynağın Id'si; detay ve "çözüldü işaretle" uçları bunu ister.
    /// Sunucu/performans olaylarında boştur (audit log kalıcı aggregate değildir).
    /// </summary>
    public Guid? ClientErrorId { get; set; }
}

/// <summary>
/// Konsolun sol listesi: sayfalanmış olaylar + kanal sayaçları.
/// <para>
/// Sayaçlar <b>kanal ve durum süzgeci UYGULANMADAN</b> hesaplanır: çipler o anki
/// arama/kiracı kapsamında nelerin bulunduğunu göstermeli. "Sunucu" çipine basınca
/// "İstemci · 3" sıfıra düşseydi çip kendi kendini gizlerdi.
/// </para>
/// </summary>
public class HealthIssueListDto
{
    public List<HealthIssueDto> Items { get; set; } = new();

    /// <summary>Süzgeçten geçen toplam olay — <see cref="Items"/> kırpılmış olabilir.</summary>
    public int TotalCount { get; set; }

    public int OpenCount { get; set; }
    public int ResolvedCount { get; set; }
    public int ClientCount { get; set; }
    public int ServerCount { get; set; }
    public int PerformanceCount { get; set; }

    /// <summary>4xx ile geri çevrilen uçlar — bkz. <see cref="HealthIssueKind.RequestRejected"/>.</summary>
    public int RejectedCount { get; set; }
}

/// <summary>
/// Kanıt panelindeki olgu şeridinin tek hücresi. Hücrelerin hangi bilgiyi taşıdığı
/// KANALA GÖRE değişir (istemci hatasında süre ölçülmez, yerine kaynak/sayfa konur);
/// bu karar sunucuda verilir ki arayüz kanal bilgisi taşımak zorunda kalmasın.
/// </summary>
public class HealthFactDto
{
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Sub { get; set; }

    /// <summary>neutral · negative · warning · brand — arayüzde token'a eşlenir.</summary>
    public string Tone { get; set; } = "neutral";
}

/// <summary>Seçili olayın kanıt paneli.</summary>
public class GetHealthIssueDetailInput
{
    public HealthIssueKind Kind { get; set; }

    /// <summary>İstemci kanalında kaynağın Id'si.</summary>
    public Guid? ClientErrorId { get; set; }

    /// <summary>Sunucu/performans kanalında normalize uç yolu.</summary>
    [StringLength(2048)]
    public string? Url { get; set; }

    [StringLength(16)]
    public string? HttpMethod { get; set; }

    [Range(1, 365)]
    public int WindowDays { get; set; } = 7;
}

/// <summary>
/// Kanıt panelinin içeriği. <b>Boş bölüm sekmesiz demektir</b>: arayüz yalnız dolu
/// bölümler için sekme çizer, böylece istemci hatasında "Oluşumlar", sunucu hatasında
/// "Davranış izi" gibi kanalın hiç üretmediği sekmeler tıklatılmaz.
/// </summary>
public class HealthIssueDetailDto
{
    public HealthIssueDto? Issue { get; set; }

    /// <summary>Beş hücreli olgu şeridi; kanala göre içeriği değişir.</summary>
    public List<HealthFactDto> Facts { get; set; } = new();

    /// <summary>İstemcide yığın izi, sunucuda exception metni. Performansta boştur.</summary>
    public string? StackTrace { get; set; }

    /// <summary>İstemci kanalının davranış izi (ham JSON); çözümleme arayüzde yapılır.</summary>
    public string? BreadcrumbJson { get; set; }

    public List<HealthFactDto> Environment { get; set; } = new();

    /// <summary>Sunucu/performans kanalında tek tek istekler.</summary>
    public List<ServerErrorDetailDto> Occurrences { get; set; } = new();

    /// <summary>İstemci kanalında aynı saniyedeki sunucu kayıtları.</summary>
    public List<CorrelatedServerErrorDto> Correlations { get; set; } = new();

    /// <summary>Sunucu/performans kanalında ucun vurduğu kiracılar.</summary>
    public List<HealthTenantStatDto> AffectedTenants { get; set; } = new();

    /// <summary>İstemci kanalında "çözüldü işaretle" ve göreve dönüştürme için.</summary>
    public Guid? ClientErrorId { get; set; }

    public bool IsResolved { get; set; }
}

/// <summary>Teşhis konsolunun filtre + sıralama girdisi.</summary>
public class GetHealthIssueListInput
{
    [Range(1, 365)]
    public int WindowDays { get; set; } = 7;

    /// <summary>Boşsa tüm kanallar.</summary>
    public List<HealthIssueKind>? Kinds { get; set; }

    public Guid? TenantId { get; set; }

    /// <summary>
    /// true ise yalnız host kayıtları. Ayrı bayrak gerekli: <see cref="TenantId"/>
    /// tek başına "filtre yok" ile "host" ayrımını yapamaz.
    /// </summary>
    public bool HostOnly { get; set; }

    /// <summary>Yalnız istemci hatalarında anlamlı; sunucu olayları çözülmemiş sayılır.</summary>
    public bool? IsResolved { get; set; }

    /// <summary>Başlık ya da yer alanında geçen metin.</summary>
    [StringLength(256)]
    public string? Filter { get; set; }

    public HealthIssueSort Sort { get; set; } = HealthIssueSort.Impact;

    [Range(1, 200)]
    public int MaxResultCount { get; set; } = 50;
}

/// <summary>
/// Bir istemci hatasıyla zaman ve kiracı olarak örtüşen sunucu kaydı. "Tarayıcıda
/// gördüğüm hata, sunucuda ne oldu?" sorusunun cevabı — kesin nedensellik değil,
/// yakınlık kanıtıdır.
/// </summary>
public class CorrelatedServerErrorDto
{
    public DateTime ExecutionTime { get; set; }

    /// <summary>İstemci hatasının görülme anına göre saniye farkı (± işaretli).</summary>
    public double OffsetSeconds { get; set; }

    public string? Url { get; set; }
    public string? HttpMethod { get; set; }
    public int? HttpStatusCode { get; set; }
    public int ExecutionDuration { get; set; }
    public string? UserName { get; set; }
    public string? Exceptions { get; set; }
}

/// <summary>Bir istemci hatasının çevresindeki sunucu kayıtlarını arar.</summary>
public class GetCorrelationInput
{
    [Required]
    public Guid ClientErrorId { get; set; }

    /// <summary>Kaç saniyelik pencerede aranacak (her iki yöne).</summary>
    [Range(1, 60)]
    public int WindowSeconds { get; set; } = 2;

    [Range(1, 50)]
    public int MaxResultCount { get; set; } = 10;
}
