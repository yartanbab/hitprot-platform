using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Rol × alan izni. ABP'nin izin sistemi rol × İZİN eşlemesi tutar; burada
/// gereken rol × ALAN × seviye matrisi oraya sığmadığı için ayrı tablo.
///
/// <see cref="FieldId"/> null ise kural belge TİPİNİN tüm alanlarına uygulanır
/// (mockup'taki "devralma: klasör → belge tipi → alan" zincirinin tip halkası).
/// Alan bazlı kural, tip bazlı kuralı EZER — daha özel olan kazanır.
/// </summary>
public class DocumentFieldPermission : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid DocumentTypeId { get; private set; }

    /// <summary>Null = tipin tüm alanları için varsayılan.</summary>
    public Guid? FieldId { get; private set; }

    public string RoleName { get; private set; } = null!;

    public DocumentFieldAccessLevel Level { get; private set; }

    protected DocumentFieldPermission() { }

    public DocumentFieldPermission(
        Guid id,
        Guid? tenantId,
        Guid documentTypeId,
        Guid? fieldId,
        string roleName,
        DocumentFieldAccessLevel level) : base(id)
    {
        TenantId = tenantId;
        DocumentTypeId = documentTypeId;
        FieldId = fieldId;
        RoleName = Check.NotNullOrWhiteSpace(roleName, nameof(roleName), maxLength: RuleConsts.MaxRoleNameLength).Trim();
        Level = level;
    }

    public void SetLevel(DocumentFieldAccessLevel level) => Level = level;
}
