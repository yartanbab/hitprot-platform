using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>Diske yazılmış yükleme ve kullanıcının aydınlatma metni onayı.</summary>
public class ExtractFirmDataInput
{
    public string FileName { get; set; } = null!;
    public string StoredFileName { get; set; } = null!;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }

    /// <summary>Kişisel veri aydınlatma metni bu yükleme için onaylandı mı. Onaysız belge okunmaz.</summary>
    public bool ConsentGiven { get; set; }
}

public class FirmDataExtractionDto
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = null!;
    public Guid DocumentFileId { get; set; }

    /// <summary>Okunan sürümün indirme bağlantısı.</summary>
    public string DownloadUrl { get; set; } = null!;

    public DateTime CreationTime { get; set; }
    public DateTime ConsentedAt { get; set; }
    public FirmDataExtractionStatus Status { get; set; }
    public string? Error { get; set; }
    public int? PageCount { get; set; }
    public bool IsTruncated { get; set; }
    public int SuggestionCount { get; set; }
    public int PendingCount { get; set; }

    /// <summary>Yalnız tekil okumada doldurulur; listede boştur.</summary>
    public List<FirmDataSuggestionDto> Suggestions { get; set; } = new();
}

public class FirmDataSuggestionDto
{
    public Guid Id { get; set; }
    public Guid DefinitionId { get; set; }
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public FirmParameterDataType DataType { get; set; }
    public List<string> Options { get; set; } = new();

    /// <summary>Önerilen değer, kurum verisinin ham biçiminde (çoklu seçimde JSON dizisi).</summary>
    public string RawValue { get; set; } = null!;

    public int Confidence { get; set; }
    public int? Page { get; set; }
    public string? Excerpt { get; set; }
    public FirmDataSuggestionStatus Status { get; set; }
    public string? AcceptedRawValue { get; set; }
    public DateTime? DecidedAt { get; set; }

    /// <summary>Kurumun bu parametredeki şimdiki değeri; onay ekranında öneriyle yan yana gösterilir.</summary>
    public bool HasCurrentValue { get; set; }
    public string? CurrentRawValue { get; set; }
    public FirmParameterSource? CurrentSource { get; set; }
}
