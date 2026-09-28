using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Documents;

/// <summary>Toplu işlem şeridi: seçili belgeleri başka klasöre taşı.</summary>
public class BulkMoveDocumentFilesDto
{
    public List<Guid> DocumentFileIds { get; set; } = new();
    public Guid TargetDocumentId { get; set; }
}

/// <summary>Toplu işlem şeridi: seçili belgelere etiket ekle/çıkar.</summary>
public class BulkTagDocumentFilesDto
{
    public List<Guid> DocumentFileIds { get; set; } = new();
    public List<string> Tags { get; set; } = new();

    /// <summary>false = etiketleri ekle, true = listedeki etiketleri kaldır.</summary>
    public bool Remove { get; set; }
}

/// <summary>
/// Yükleme kuyruğu toplu künye: yalnız DOLU gelen alan yazılır, diğer künye alanlarına
/// (proje/iş adımı, tutar, tarihler, durum, etiketler, görünen ad) dokunulmaz (DOC-01).
/// </summary>
public class BulkApplyDocumentFileMetaDto
{
    public List<Guid> DocumentFileIds { get; set; } = new();

    public Guid? DocumentTypeId { get; set; }

    [StringLength(DocumentConsts.MaxPeriodCodeLength)]
    public string? PeriodCode { get; set; }
}
