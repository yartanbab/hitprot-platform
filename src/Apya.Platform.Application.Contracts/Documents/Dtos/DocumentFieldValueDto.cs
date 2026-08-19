using System;

namespace Apya.Platform.Documents;

/// <summary>
/// Şema alanı + o belgedeki değeri. Değer girilmemişse Value* alanları null'dır
/// ama alan yine döner — panelde "boş zorunlu alan" gösterilebilsin diye.
/// </summary>
public class DocumentFieldValueDto
{
    public Guid FieldId { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public DocumentFieldType FieldType { get; set; }
    public bool IsRequired { get; set; }
    public DocumentFieldFillSource FillSource { get; set; }
    public DocumentFieldVisibility Visibility { get; set; }
    public int Order { get; set; }
    public string? OptionsJson { get; set; }

    public string? ValueText { get; set; }
    public decimal? ValueNumber { get; set; }
    public DateTime? ValueDate { get; set; }
    public int? Confidence { get; set; }
    public DocumentFieldFillSource? FilledBy { get; set; }

    /* --- Alan bazlı izin (Faz D) — sunucuda çözülür, istemci yalnız çizer --- */

    public DocumentFieldAccessLevel AccessLevel { get; set; } = DocumentFieldAccessLevel.Edit;

    /// <summary>true ise Value* alanları GERÇEK DEĞERİ TAŞIMAZ; MaskedDisplay gösterilir.</summary>
    public bool IsMasked { get; set; }

    /// <summary>Maskeli alanın biçim korunmuş gösterimi (32.450,00 → ••.•••,••).</summary>
    public string? MaskedDisplay { get; set; }

    public bool IsEditable { get; set; } = true;
}
