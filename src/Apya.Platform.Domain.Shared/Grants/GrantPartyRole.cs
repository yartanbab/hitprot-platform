namespace Apya.Platform.Grants;

/// <summary>
/// Bir işin/evrakın kimde olduğu (3b · aşama sahibi, 1b · evrakı yükleyecek taraf).
/// <see cref="Ortak"/> = iki taraf birlikte yürütür.
/// </summary>
public enum GrantPartyRole
{
    Firma = 0,
    Danisman = 1,
    Ortak = 2,
    Kurum = 3
}
