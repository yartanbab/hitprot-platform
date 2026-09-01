using System;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 2a · Canlı birlikte düzenlemede bir alanın kilidi. Aynı alanı iki taraf birden
/// yazamaz; kilidi tutan kişinin adı ekranda alanın yanında görünür.
///
/// SOFT DELETE YOK (<see cref="BasicAggregateRoot{TKey}"/>): kilit bırakıldığında satır
/// GERÇEKTEN silinir. Soft delete kullansaydık (ApplicationId, FieldKey) tekil indeksi
/// silinmiş satırlarla dolar ve aynı alan bir daha kilitlenemezdi.
/// </summary>
public class GrantApplicationFieldLock : BasicAggregateRoot<Guid>, IMultiTenant
{
    /// <summary>Kilit boşta kaldıktan kaç dakika sonra kendiliğinden açılır.</summary>
    public const int IdleMinutes = 2;

    public Guid? TenantId { get; set; }
    public Guid GrantApplicationId { get; private set; }

    /// <summary>Alanın anahtarı — örn. <c>budget:MakineTechizat</c>, <c>summary:Title</c>.</summary>
    public string FieldKey { get; private set; } = null!;

    public Guid OwnerUserId { get; private set; }

    /// <summary>Görüntüleme için ad kopyası; danışman host kullanıcısı olabilir, kiracı onu sorgulayamaz.</summary>
    public string OwnerName { get; private set; } = null!;

    public DateTime AcquiredAt { get; private set; }
    public DateTime LastActivityAt { get; private set; }

    /// <summary>Devralma isteği gönderen kişi (varsa). Kilit sahibi bunu ekranında görür.</summary>
    public Guid? TakeoverRequestedByUserId { get; private set; }
    public string? TakeoverRequestedByName { get; private set; }

    protected GrantApplicationFieldLock() { }

    public GrantApplicationFieldLock(
        Guid id,
        Guid? tenantId,
        Guid grantApplicationId,
        string fieldKey,
        Guid ownerUserId,
        string ownerName,
        DateTime now) : base(id)
    {
        TenantId = tenantId;
        GrantApplicationId = grantApplicationId;
        FieldKey = fieldKey;
        OwnerUserId = ownerUserId;
        OwnerName = ownerName;
        AcquiredAt = now;
        LastActivityAt = now;
    }

    /// <summary>Kilit sahibi hâlâ yazıyorsa süre uzar; istemci düzenledikçe çağırır.</summary>
    public void Touch(DateTime now) => LastActivityAt = now;

    /// <summary><paramref name="now"/> itibarıyla kilit boşta mı — boştaysa başkası devralabilir.</summary>
    public bool IsStale(DateTime now) => (now - LastActivityAt).TotalMinutes >= IdleMinutes;

    public void RequestTakeover(Guid userId, string userName)
    {
        TakeoverRequestedByUserId = userId;
        TakeoverRequestedByName = userName;
    }

    /// <summary>Kilidi devreder; bekleyen devralma isteği temizlenir.</summary>
    public void TransferTo(Guid userId, string userName, DateTime now)
    {
        OwnerUserId = userId;
        OwnerName = userName;
        AcquiredAt = now;
        LastActivityAt = now;
        TakeoverRequestedByUserId = null;
        TakeoverRequestedByName = null;
    }
}
