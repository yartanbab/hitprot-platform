using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Belge tipi (Fatura, Bordro, Rapor, Sözleşme, Test raporu, Resmi yazı).
/// Her tip kendi alan şemasını (<see cref="DocumentTypeField"/>), saklama süresini
/// ve dosya adı kalıbını taşır.
///
/// Sistem tipleri <c>TenantId = null</c> ile seed edilir ve tüm kiracılar görür —
/// Grants katalogundaki host-null deseni (IDataFilter.Disable ile okuma). Kiracıya
/// özel tip tanımlama Faz D'de (Yönetim ekranı) gelecek.
/// </summary>
public class DocumentType : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string Name { get; private set; } = null!;

    /// <summary>Makine tarafı sabit anahtar (INVOICE, PAYROLL...). Seed ve kural motoru buna bakar.</summary>
    public string Code { get; private set; } = null!;

    /// <summary>Font Awesome ikon adı (ör. "fa-file-invoice").</summary>
    public string? Icon { get; private set; }

    /// <summary>Saklama süresi (ay). Null = saklama kuralı yok.</summary>
    public int? RetentionMonths { get; private set; }

    /// <summary>Yüklemede uygulanacak ad kalıbı, ör. <c>{proje}-{tip}-{tarih}-{no}</c>. Faz D'de işletilir.</summary>
    public string? FileNamePattern { get; private set; }

    /// <summary>Sistem tipi — kiracı silemez/yeniden adlandıramaz.</summary>
    public bool IsSystem { get; private set; }

    public int Order { get; private set; }

    protected DocumentType() { }

    public DocumentType(
        Guid id,
        Guid? tenantId,
        string name,
        string code,
        string? icon = null,
        int? retentionMonths = null,
        string? fileNamePattern = null,
        bool isSystem = false,
        int order = 0) : base(id)
    {
        TenantId = tenantId;
        SetName(name);
        SetCode(code);
        Icon = icon;
        RetentionMonths = retentionMonths;
        FileNamePattern = fileNamePattern;
        IsSystem = isSystem;
        Order = order;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.DocumentTypeNameRequired);

        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: DocumentConsts.MaxTypeNameLength).Trim();
    }

    public void SetCode(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new BusinessException(PlatformDomainErrorCodes.DocumentTypeCodeRequired);

        Code = Check.NotNullOrWhiteSpace(code, nameof(code), maxLength: DocumentConsts.MaxTypeCodeLength)
            .Trim().ToUpperInvariant();
    }

    public void SetRetention(int? retentionMonths) => RetentionMonths = retentionMonths;

    public void SetFileNamePattern(string? pattern)
        => FileNamePattern = string.IsNullOrWhiteSpace(pattern) ? null : pattern.Trim();
}
