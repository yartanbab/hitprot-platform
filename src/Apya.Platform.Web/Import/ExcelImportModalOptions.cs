namespace Apya.Platform.Web.Import;

/// <summary>Ortak içe aktarma penceresinin (Shared/_ExcelImportModal) başlığı ve ekrana özel ipucu.</summary>
public sealed record ExcelImportModalOptions(string Title, string? Hint = null);
