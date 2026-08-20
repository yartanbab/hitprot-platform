using System;
using System.Collections.Generic;

namespace Apya.Platform.Documents;

/// <summary>
/// Kurulumda uygulanacak klasör şeması. "Karma" hem iş adımlarını hem
/// kurumsal klasörleri kurar — çoğu kiracının ilk gün istediği budur.
/// </summary>
public enum DocumentFolderSchema
{
    /// <summary>Proje klasörü + her iş adımı için bir alt klasör.</summary>
    WorkStep = 1,

    /// <summary>Proje klasörü + dönem (çeyrek) alt klasörleri.</summary>
    Period = 2,

    /// <summary>İş adımı klasörleri + Finans / Personel / Sözleşmeler.</summary>
    Mixed = 3
}

/// <summary>Sihirbazın açılışta okuduğu durum.</summary>
public class DocumentSetupStateDto
{
    /// <summary>Kurulum tamamlandıysa sihirbaz bir daha açılmaz.</summary>
    public bool SetupCompleted { get; set; }

    public DocumentFolderSchema? Schema { get; set; }

    /// <summary>Kiracıda hiç klasör var mı — "gerçekten boş mu" sorusunun cevabı.</summary>
    public int FolderCount { get; set; }

    public int ProjectCount { get; set; }

    /// <summary>Uygulanabilir kurum paketleri (adım 1).</summary>
    public List<CompliancePackageDto> Packages { get; set; } = new();

    /// <summary>Klasör şemasının kurulacağı projeler (adım 2).</summary>
    public List<DocumentSetupProjectDto> Projects { get; set; } = new();
}

public class DocumentSetupProjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }

    /// <summary>Projenin iş adımı sayısı — iş adımı bazlı şema bunu kullanır.</summary>
    public int WorkStepCount { get; set; }

    /// <summary>Bu projede zaten klasör var mı (yeniden kurulum uyarısı için).</summary>
    public bool HasFolders { get; set; }
}

public class ApplyDocumentSetupDto
{
    /// <summary>Klasör şemasının kurulacağı proje.</summary>
    public Guid ProjectId { get; set; }

    public DocumentFolderSchema Schema { get; set; } = DocumentFolderSchema.Mixed;

    /// <summary>Uygulanacak kurum paketi; boş geçilebilir (adım 1 atlanabilir).</summary>
    public Guid? CompliancePackageId { get; set; }

    /// <summary>Kurum paketinin dönemi (ör. "2026-Q3").</summary>
    public string? PeriodCode { get; set; }
}

/// <summary>Kurulum sonucu — kullanıcıya ne yapıldığını sayıyla söyler.</summary>
public class DocumentSetupResultDto
{
    public int CreatedFolderCount { get; set; }
    public bool CompliancePackageApplied { get; set; }
    public Guid? RootFolderId { get; set; }
}
