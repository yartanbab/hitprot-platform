using System;
using System.Collections.Generic;

namespace Apya.Platform.Documents;

/// <summary>
/// Kapsam ağacındaki satırın türü. İkon, renk ve girinti buradan çıkar.
///
/// Ağaç İKİ eksen taşır: belgeler iş adımından (DocumentFile.WorkStepId),
/// görevler ise projeden (TaskItem.ProjectId + ParentTaskId) sarkar. Bu ikisini
/// birbirine bağlayan bir alan şemada YOK; bu yüzden görevler iş adımlarının
/// altına değil, kardeş bir "Görevler" dalına konur.
/// </summary>
public enum ScopeRowKind
{
    Project = 1,
    WorkStep = 2,

    /// <summary>İş adımı atanmamış belgeleri toplayan sanal düğüm.</summary>
    UnassignedGroup = 3,

    Document = 4,

    /// <summary>Kontrol listesinde karşılığı doldurulmamış zorunlu kalem.</summary>
    MissingItem = 5,

    /// <summary>Görev dalının sanal başlığı.</summary>
    TaskGroup = 6,

    Task = 7,
    SubTask = 8
}

/// <summary>
/// Kapsam satırının ortak durum sözlüğü. Proje, iş adımı, belge ve görev
/// kendi enum'larını taşır; ağaçta tek bir rozet dili gerektiği için hepsi
/// buraya çevrilir. Etiket ve renk istemcide bu değere göre seçilir.
/// </summary>
public enum ScopeStatus
{
    None = 0,
    Planned = 1,
    InProgress = 2,
    Done = 3,
    Late = 4,
    Cancelled = 5,
    Draft = 6,
    Final = 7,
    Matched = 8,
    Expired = 9,
    Missing = 10
}

/// <summary>Ağacın tek bir satırı. Hiyerarşi <see cref="ParentId"/> ile kurulur.</summary>
public class ScopeRowDto
{
    /// <summary>
    /// Ağaç anahtarı. Guid DEĞİL, önekli birleşik anahtar ("w:{guid}") — aynı
    /// Guid hem iş adımı hem sanal grup satırında geçebiliyor.
    /// </summary>
    public string Id { get; set; } = string.Empty;

    public string? ParentId { get; set; }

    public int Depth { get; set; }

    public ScopeRowKind Kind { get; set; }

    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// "Tür" sütununda basılacak metin. Belge satırında belge tipinin adı
    /// (Fatura, Bordro…), diğer satırlarda null — istemci o zaman
    /// <see cref="Kind"/> etiketini kullanır.
    /// </summary>
    public string? TypeName { get; set; }

    public ScopeStatus Status { get; set; }

    public string? OwnerName { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public int DocumentCount { get; set; }

    public decimal? Amount { get; set; }

    /// <summary>Uygunluk yüzdesi; kontrol listesi tanımlı değilse null (0 DEĞİL).</summary>
    public int? CompliancePercent { get; set; }

    public bool HasChildren { get; set; }

    /// <summary>
    /// Çocukları bu yanıtta gelmedi, açıldığında ayrıca istenecek. Yalnız proje
    /// satırlarında true — bütün ağacı tek seferde üretmek 150 projeli kiracıda
    /// dakikalarca sürerdi.
    /// </summary>
    public bool IsLazy { get; set; }

    /// <summary>Derin link hedefi (proje, iş adımı, belge veya görev kimliği).</summary>
    public Guid? EntityId { get; set; }
}

/// <summary>Ağacın altındaki toplam şeridi.</summary>
public class ScopeRollupDto
{
    public int ProjectCount { get; set; }
    public int DocumentCount { get; set; }
    public int MissingCount { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "TRY";

    /// <summary>Kontrol listesi tanımlı projelerin ortalaması; hiç yoksa null.</summary>
    public int? AverageCompliancePercent { get; set; }

    /// <summary>
    /// Toplama birden fazla para birimi karıştı. Toplam yine de basılır ama
    /// istemci uyarı gösterir — sessizce yanlış bir rakam vermek daha kötü.
    /// </summary>
    public bool HasMixedCurrency { get; set; }
}

/// <summary>Kapsam ekranının ilk yükü: proje satırları + toplam.</summary>
public class ProjectScopeOverviewDto
{
    public List<ScopeRowDto> Rows { get; set; } = new();

    public ScopeRollupDto Rollup { get; set; } = new();
}

/// <summary>Bir projenin ağaç altı: iş adımları, belgeler, eksikler ve görevler.</summary>
public class ProjectScopeBranchDto
{
    public Guid ProjectId { get; set; }

    public List<ScopeRowDto> Rows { get; set; } = new();

    /// <summary>Görev sayısı; "Görevler" grubunun alt yazısında gösterilir.</summary>
    public int TaskCount { get; set; }

    public int SubTaskCount { get; set; }
}
