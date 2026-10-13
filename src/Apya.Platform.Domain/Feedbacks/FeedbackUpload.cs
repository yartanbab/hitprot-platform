using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Geri bildirim için YÜKLENMİŞ ama henüz bir geri bildirime bağlanmamış (ya da bağlanmış) dosyanın
/// sahiplik kaydı (ürün kararı, 2026-10-13).
///
/// <para>Neden: gönderim isteği saklanan dosya adını istemciden alıyordu ve o dosyayı bu kullanıcının
/// yüklediğini doğrulamıyordu. Başkasının dosyasının (rastgele, 32 haneli) adını öğrenen biri onu
/// kendi geri bildirimine iliştirip indirebilirdi. Kayıt, "bu adı şu kullanıcı yükledi" bilgisini
/// sunucuda tutar; gönderim yalnız çağıranın kendi, henüz kullanılmamış yüklemelerini kabul eder.</para>
/// </summary>
public class FeedbackUpload : CreationAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    /// <summary>Dosyayı yükleyen kullanıcı.</summary>
    public Guid UserId { get; private set; }

    /// <summary>Diskte saklanan (rastgeleleştirilmiş) ad. Tekildir.</summary>
    public string StoredFileName { get; private set; } = string.Empty;

    /// <summary>Dosyanın bağlandığı geri bildirim; boşsa yükleme henüz kullanılmamıştır.</summary>
    public Guid? ClaimedByFeedbackId { get; private set; }

    protected FeedbackUpload() { }

    public FeedbackUpload(Guid id, Guid? tenantId, Guid userId, string storedFileName) : base(id)
    {
        TenantId = tenantId;
        UserId = userId;
        StoredFileName = storedFileName;
    }

    public void Claim(Guid feedbackId) => ClaimedByFeedbackId = feedbackId;
}
