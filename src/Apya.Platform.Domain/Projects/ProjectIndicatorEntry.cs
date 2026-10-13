using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

/// <summary>
/// PRJ-08 · Göstergenin bir ölçümü: o tarihte ULAŞILAN değer (artış değil, toplam düzey).
/// İsteğe bağlı kanıt belgesi projenin belgelerinden seçilir.
/// </summary>
public class ProjectIndicatorEntry : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid IndicatorId { get; private set; }

    public DateTime EntryDate { get; private set; }

    public decimal Value { get; private set; }

    public string? Note { get; private set; }

    public Guid? DocumentFileId { get; private set; }

    protected ProjectIndicatorEntry() { }

    public ProjectIndicatorEntry(
        Guid id,
        Guid? tenantId,
        Guid indicatorId,
        DateTime entryDate,
        decimal value,
        string? note = null,
        Guid? documentFileId = null) : base(id)
    {
        TenantId = tenantId;
        IndicatorId = indicatorId;
        EntryDate = entryDate.Date;
        Value = value;
        Note = string.IsNullOrWhiteSpace(note)
            ? null
            : Check.Length(note.Trim(), nameof(note), ProjectIndicatorConsts.MaxEntryNoteLength);
        DocumentFileId = documentFileId;
    }
}
