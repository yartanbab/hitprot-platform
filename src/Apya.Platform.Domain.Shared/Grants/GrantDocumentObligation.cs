namespace Apya.Platform.Grants;

/// <summary>
/// Belgenin bağlayıcılığı (1b · Evrak &amp; Belgeler).
/// <see cref="Kosullu"/> = yalnız belirli durumlarda istenir.
/// </summary>
public enum GrantDocumentObligation
{
    Zorunlu = 0,
    Kosullu = 1
}
