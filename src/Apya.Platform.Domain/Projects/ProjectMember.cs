using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

/// <summary>
/// Bir kullanıcının bir projedeki üyeliği (10. adım sonrası, konsolun 8. adımı).
///
/// KAPSAM — bilinçli olarak dar: bu kayıt yalnız "kim bu projenin ekibinde"
/// sorusunu yanıtlar. Görev ataması, görev görünürlüğü ve izinler bundan
/// ETKİLENMEZ; üye olmayan bir kullanıcıya hâlâ görev atanabilir. Üyeliği
/// kısıtlayıcı hâle getirmek TaskAppService'i de değiştirmeyi gerektirir.
///
/// BoardColumn gibi proje kapsamlı ama kendi başına sorgulanan bir kayıt
/// olduğu için aggregate root; özel repository'si yok, generic IRepository
/// kullanılır.
/// </summary>
public class ProjectMember : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid ProjectId { get; private set; }

    /// <summary>Volo.Abp.Identity IdentityUser.Id. FK kurulmaz — Identity ayrı modül.</summary>
    public Guid UserId { get; private set; }

    public ProjectMemberRole Role { get; private set; } = ProjectMemberRole.Member;

    protected ProjectMember() { }

    public ProjectMember(
        Guid id,
        Guid projectId,
        Guid userId,
        ProjectMemberRole role = ProjectMemberRole.Member,
        Guid? tenantId = null) : base(id)
    {
        ProjectId = projectId;
        UserId = userId;
        Role = role;
        TenantId = tenantId;
    }

    public void SetRole(ProjectMemberRole role) => Role = role;

    /// <summary>
    /// Ekipten çıkarılmış (soft-delete) bir üyeyi yeniden ekler.
    /// GEREKLİ: (ProjectId, UserId) tekil indeksi IsDeleted'a bakmaz, silinmiş
    /// satır tabloda durur — yeni INSERT "duplicate key" ile patlıyordu (canlı
    /// doğrulandı). İndeksi filtrelemek yerine kayıt canlandırılıyor; filtreli
    /// indeks SQL'i Postgres ve SqlServer'da farklı, tek DbContext'ten ikisini
    /// birden doğru üretmek mümkün değil.
    /// </summary>
    public void Restore(ProjectMemberRole role)
    {
        IsDeleted = false;
        DeletionTime = null;
        DeleterId = null;
        Role = role;
    }
}
