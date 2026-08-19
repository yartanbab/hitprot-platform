using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Bir belgenin tek bir meta alanına verdiği değer.
/// Alanın tipine göre üç kolondan biri dolar (metin/sayı/tarih) — EAV deseni.
/// Tutar ve tarih gibi liste kolonunda SIRALANAN alanlar burada değil,
/// <see cref="DocumentFile"/> üzerinde birinci sınıf kolon olarak durur.
/// </summary>
public class DocumentFieldValue : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid DocumentFileId { get; private set; }

    public Guid FieldId { get; private set; }

    public string? ValueText { get; private set; }
    public decimal? ValueNumber { get; private set; }
    public DateTime? ValueDate { get; private set; }

    /// <summary>OCR/AI ile dolduysa güven yüzdesi (0-100); elle girildiyse null.</summary>
    public int? Confidence { get; private set; }

    public DocumentFieldFillSource FilledBy { get; private set; } = DocumentFieldFillSource.Manual;

    protected DocumentFieldValue() { }

    public DocumentFieldValue(
        Guid id,
        Guid? tenantId,
        Guid documentFileId,
        Guid fieldId) : base(id)
    {
        TenantId = tenantId;
        DocumentFileId = documentFileId;
        FieldId = fieldId;
    }

    public void SetValue(
        string? valueText,
        decimal? valueNumber,
        DateTime? valueDate,
        DocumentFieldFillSource filledBy = DocumentFieldFillSource.Manual,
        int? confidence = null)
    {
        ValueText = string.IsNullOrWhiteSpace(valueText)
            ? null
            : valueText.Trim().Length > DocumentConsts.MaxFieldValueTextLength
                ? valueText.Trim()[..DocumentConsts.MaxFieldValueTextLength]
                : valueText.Trim();
        ValueNumber = valueNumber;
        ValueDate = valueDate;
        FilledBy = filledBy;
        Confidence = confidence.HasValue ? Math.Clamp(confidence.Value, 0, 100) : null;
    }

    /// <summary>Alan tipine bakmadan "dolu mu?" sorusunu yanıtlar — zorunlu alan kontrolü için.</summary>
    public bool HasValue => ValueText != null || ValueNumber.HasValue || ValueDate.HasValue;
}
