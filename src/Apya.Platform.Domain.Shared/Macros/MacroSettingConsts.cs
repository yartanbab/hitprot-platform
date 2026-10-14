namespace Apya.Platform.Macros;

public static class MacroSettingConsts
{
    public const int MaxDisplayNameLength = 64;

    /// <summary>Font Awesome sınıfı, ör. "fa fa-bolt".</summary>
    public const int MaxIconLength = 64;

    /// <summary>Virgüllü paket kodları (PackageCode adları).</summary>
    public const int MaxPackagesLength = 64;

    /// <summary>Virgüllü rol adları.</summary>
    public const int MaxRolesLength = 512;

    public const int MaxRoleCount = 10;

    public const int MaxRoleNameLength = 64;

    /// <summary>İkon biçimi: "fa" ya da "fa-solid/regular/brands" + en az bir "fa-…" sınıfı.</summary>
    public const string IconPattern = @"^(fa|fa-solid|fa-regular|fa-brands)( fa-[a-z0-9-]+)+$";
}
