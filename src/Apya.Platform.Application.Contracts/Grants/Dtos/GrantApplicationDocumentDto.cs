using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 2b · Evrak konsolunun tek okumada döndürdüğü hâli: sayaçlar, kontrol listesi,
/// seçili evrakın sürüm geçmişi ve gönderim paketinin hazırlık durumu.
/// </summary>
public class GrantDocumentConsoleDto
{
    public Guid ApplicationId { get; set; }
    public string GrantName { get; set; } = null!;
    public string Issuer { get; set; } = null!;

    /// <summary>İsteği yapanın rolü — "sadece bende olanlar" süzgeci buna göre çalışır.</summary>
    public GrantPartyRole ViewerRole { get; set; }

    /// <summary>Danışman inceleyebilir; firma yalnız yükler.</summary>
    public bool CanReview { get; set; }

    public bool IsReadOnly { get; set; }

    // --- Sayaçlar (tasarım 2b · 5\'li KPI) ---
    public int TotalCount { get; set; }
    public int ApprovedCount { get; set; }
    public int WaitingOnViewerCount { get; set; }
    public int WaitingOnOtherCount { get; set; }

    /// <summary>Onaylı zorunlu evrakın zorunlu toplamına oranı (%).</summary>
    public int ReadyPercent { get; set; }

    public int MandatoryCount { get; set; }
    public int MandatoryApprovedCount { get; set; }

    public List<GrantApplicationDocumentDto> Documents { get; set; } = new();

    /// <summary>E-imza gereken evraklar — repoda e-imza entegrasyonu YOK, bu liste yalnız durumu gösterir.</summary>
    public List<GrantESignatureItemDto> ESignatureItems { get; set; } = new();

    public DateTime? LastActivityAt { get; set; }

    /// <summary>Son üretilen gönderim paketi var mı — indirme bağlantısı buna bakar.</summary>
    public bool HasPackage { get; set; }
    public DateTime? PackageCreatedAt { get; set; }
}

public class GrantApplicationDocumentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public GrantDocumentObligation Obligation { get; set; }
    public GrantPartyRole UploaderParty { get; set; }
    public bool RequiresESignature { get; set; }
    public GrantDocumentStatus Status { get; set; }
    public string? ReviewNote { get; set; }
    public int LatestVersionNo { get; set; }
    public int Order { get; set; }

    /// <summary>Evrak isteği yapanın tarafında mı bekliyor — süzgeç ve KPI bunu kullanır.</summary>
    public bool IsOnViewer { get; set; }

    public GrantDocumentVersionDto? LatestVersion { get; set; }
    public List<GrantDocumentVersionDto> Versions { get; set; } = new();
}

public class GrantDocumentVersionDto
{
    public Guid Id { get; set; }
    public int VersionNo { get; set; }
    public string OriginalFileName { get; set; } = null!;
    public long SizeBytes { get; set; }
    public string UploaderName { get; set; } = null!;
    public GrantPartyRole UploaderRole { get; set; }
    public string? Note { get; set; }
    public DateTime CreationTime { get; set; }
}

public class GrantESignatureItemDto
{
    public Guid DocumentId { get; set; }
    public string Name { get; set; } = null!;
    public GrantDocumentStatus Status { get; set; }
    public bool IsUploaded { get; set; }
}

// ------------------------------------------------------------------ girdiler

public class ReviewGrantDocumentInput
{
    [Required(ErrorMessage = "Evrak zorunludur.")]
    public Guid DocumentId { get; set; }

    [StringLength(512, ErrorMessage = "Not en fazla 512 karakter olabilir.")]
    public string? Note { get; set; }
}

public class RequestGrantDocumentRevisionInput
{
    [Required(ErrorMessage = "Evrak zorunludur.")]
    public Guid DocumentId { get; set; }

    [Required(ErrorMessage = "Revizyon gerekçesi zorunludur.")]
    [StringLength(512, ErrorMessage = "Gerekçe en fazla 512 karakter olabilir.")]
    public string Note { get; set; } = null!;
}

public class AddGrantDocumentInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    [Required(ErrorMessage = "Evrak adı zorunludur.")]
    [StringLength(128, ErrorMessage = "Evrak adı en fazla 128 karakter olabilir.")]
    public string Name { get; set; } = null!;

    public GrantPartyRole UploaderParty { get; set; }
}

/// <summary>Eksik evrak hatırlatmasının sonucu.</summary>
public class GrantDocumentReminderResultDto
{
    public int MissingCount { get; set; }
    public int NotifiedUserCount { get; set; }
}

/// <summary>Web katmanı dosyayı diske yazdıktan sonra kaydı bu girdiyle açar.</summary>
public class RegisterGrantDocumentVersionInput
{
    public Guid DocumentId { get; set; }
    public string StoredFileName { get; set; } = null!;
    public string OriginalFileName { get; set; } = null!;
    public long SizeBytes { get; set; }
    public string? Note { get; set; }
}

/// <summary>İndirme işleyicisinin ihtiyacı: diskteki ad + kullanıcıya gösterilecek ad.</summary>
public class GrantDocumentFileRefDto
{
    public string StoredFileName { get; set; } = null!;
    public string OriginalFileName { get; set; } = null!;
}

public class GrantDocumentPackageContentDto
{
    public Guid ApplicationId { get; set; }
    public string GrantName { get; set; } = null!;
    public bool IsComplete { get; set; }
    public int MissingMandatoryCount { get; set; }
    public List<GrantDocumentPackageEntryDto> Entries { get; set; } = new();
}

public class GrantDocumentPackageEntryDto
{
    public string StoredFileName { get; set; } = null!;

    /// <summary>Zip içindeki ad: kurumun beklediği sıra ve isimlendirme.</summary>
    public string EntryName { get; set; } = null!;
}

public class RegisterGrantDocumentPackageInput
{
    public Guid ApplicationId { get; set; }
    public string StoredFileName { get; set; } = null!;
}
