using System;
using System.Collections.Generic;

namespace Apya.Platform.Documents;

/// <summary>
/// Onay bekleyen tek bir öneri. Kaydı YOKTUR — her okumada kural motoru ve
/// eşleşme skorlayıcısından üretilir, bu yüzden Id taşımaz; kimliği
/// belge + tür + hedef üçlüsüdür.
/// </summary>
public class DocumentSuggestionDto
{
    public Guid DocumentFileId { get; set; }

    public string DocumentFileName { get; set; } = string.Empty;

    public DocumentSuggestionKind Kind { get; set; }

    /// <summary>Hedefin ham değeri (Guid ya da dönem kodu).</summary>
    public string? Payload { get; set; }

    /// <summary>Hedefin okunur adı — klasör/tip/iş adımı/harcama adı.</summary>
    public string? TargetName { get; set; }

    /// <summary>Önerinin gerekçesi ("R-01 kuralı", "tutar tam · tarih 2 gün").</summary>
    public string Reason { get; set; } = string.Empty;

    /// <summary>0-100. Kural eşleşmesi 100; harcama eşleşmesi skorlayıcıdan gelir.</summary>
    public int Confidence { get; set; }
}

/// <summary>Öneri şeridi: bekleyenler + kaç belgeye dokunduğu.</summary>
public class DocumentSuggestionSummaryDto
{
    public List<DocumentSuggestionDto> Items { get; set; } = new();

    /// <summary>Öneri taşıyan farklı belge sayısı — şeritteki "7 dosya" bu.</summary>
    public int DocumentCount { get; set; }
}

/// <summary>Uygulanacak/reddedilecek öneriyi tanımlayan üçlü.</summary>
public class DocumentSuggestionRefDto
{
    public Guid DocumentFileId { get; set; }
    public DocumentSuggestionKind Kind { get; set; }
    public string? Payload { get; set; }
}

public class ApplyDocumentSuggestionsDto
{
    public List<DocumentSuggestionRefDto> Suggestions { get; set; } = new();
}
