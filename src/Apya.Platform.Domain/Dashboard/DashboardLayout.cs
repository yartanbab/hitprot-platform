using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Dashboard;

/// <summary>
/// Bir kullanıcının bir dashboard görünümü için kaydettiği kart düzeni.
/// <para>
/// Soft-delete BİLEREK yok (<see cref="AuditedAggregateRoot{TKey}"/>, FullAudited değil):
/// <c>UserId + ViewKey</c> üzerinde filtresiz tekil indeks var ve "sıfırla" akışı kaydı
/// siliyor. Soft-delete olsaydı silinen satır indekste kalır, kullanıcı düzeni yeniden
/// kaydettiğinde tekil indeks ihlali (500) alırdı. Kullanıcı tercihi için geri alma
/// gereksinimi de yok.
/// </para>
/// </summary>
public class DashboardLayout : AuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid UserId { get; private set; }

    /// <summary>Görünüm anahtarı: "project-management" | "finance" | "today" | "grants".</summary>
    public string ViewKey { get; private set; } = null!;

    /// <summary>Kart yerleşimi, JSON dizisi olarak. Şeması <c>DashboardCardDto</c>.</summary>
    public string CardsJson { get; private set; } = null!;

    protected DashboardLayout() { }

    public DashboardLayout(Guid id, Guid? tenantId, Guid userId, string viewKey, string cardsJson) : base(id)
    {
        TenantId = tenantId;
        UserId = userId;
        ViewKey = viewKey;
        CardsJson = cardsJson;
    }

    public void SetCards(string cardsJson) => CardsJson = cardsJson;
}
