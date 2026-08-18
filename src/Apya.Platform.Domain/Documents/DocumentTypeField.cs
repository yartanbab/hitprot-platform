using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Bir belge tipinin meta şema alanı ("Fatura no", "Tutar (KDV dahil)", "Cari / tedarikçi").
/// Değerler <see cref="DocumentFieldValue"/> içinde belge başına tutulur.
/// </summary>
public class DocumentTypeField : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid DocumentTypeId { get; private set; }

    /// <summary>Makine anahtarı (invoiceNo, amount...). Tip içinde benzersiz.</summary>
    public string Key { get; private set; } = null!;

    public string Label { get; private set; } = null!;

    public DocumentFieldType FieldType { get; private set; }

    public bool IsRequired { get; private set; }

    public DocumentFieldFillSource FillSource { get; private set; }

    public DocumentFieldVisibility Visibility { get; private set; }

    public int Order { get; private set; }

    /// <summary>Select tipi için seçenekler (JSON dizi). Diğer tiplerde null.</summary>
    public string? OptionsJson { get; private set; }

    protected DocumentTypeField() { }

    public DocumentTypeField(
        Guid id,
        Guid? tenantId,
        Guid documentTypeId,
        string key,
        string label,
        DocumentFieldType fieldType,
        bool isRequired,
        DocumentFieldFillSource fillSource = DocumentFieldFillSource.Manual,
        DocumentFieldVisibility visibility = DocumentFieldVisibility.Everyone,
        int order = 0,
        string? optionsJson = null) : base(id)
    {
        TenantId = tenantId;
        DocumentTypeId = documentTypeId;
        SetKey(key);
        SetLabel(label);
        FieldType = fieldType;
        IsRequired = isRequired;
        FillSource = fillSource;
        Visibility = visibility;
        Order = order;
        OptionsJson = optionsJson;
    }

    public void SetKey(string key)
    {
        if (string.IsNullOrWhiteSpace(key))
            throw new BusinessException(PlatformDomainErrorCodes.DocumentFieldKeyRequired);

        Key = Check.NotNullOrWhiteSpace(key, nameof(key), maxLength: DocumentConsts.MaxFieldKeyLength).Trim();
    }

    public void SetLabel(string label)
        => Label = Check.NotNullOrWhiteSpace(label, nameof(label), maxLength: DocumentConsts.MaxFieldLabelLength).Trim();

    public void Update(
        string label,
        DocumentFieldType fieldType,
        bool isRequired,
        DocumentFieldFillSource fillSource,
        DocumentFieldVisibility visibility,
        int order,
        string? optionsJson)
    {
        SetLabel(label);
        FieldType = fieldType;
        IsRequired = isRequired;
        FillSource = fillSource;
        Visibility = visibility;
        Order = order;
        OptionsJson = optionsJson;
    }
}
