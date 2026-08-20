namespace Apya.Platform.Documents;

/// <summary>
/// Önerinin belgede neyi değiştireceği.
///
/// Domain.Shared'da duruyor çünkü hem domain (öneri üreticisi) hem
/// Application.Contracts (DTO) buna bakar; Contracts, Domain'i göremez.
/// </summary>
public enum DocumentSuggestionKind
{
    Folder = 1,
    DocumentType = 2,
    WorkStep = 3,
    PeriodCode = 4,

    /// <summary>Belgenin bir harcama kalemine bağlanması.</summary>
    Expense = 5
}
