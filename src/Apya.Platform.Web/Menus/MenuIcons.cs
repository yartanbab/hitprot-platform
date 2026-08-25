using System;
using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.Web.Menus;

/// <summary>
/// Kullanıcının kendi kategori/kısayolu için seçebileceği ikonlar.
///
/// Neden BEYAZ LİSTE: ikon değeri doğrudan <c>class</c> attribute'una basılıyor.
/// Serbest metin kabul etmek, kullanıcının sayfaya istediği sınıfı (ve onunla
/// gelen stili) enjekte etmesi demek — ayar başka bir kullanıcıya da
/// gösterilmese bile bu yüzeyi açık bırakmanın gereği yok. Liste dışı değer
/// sessizce <see cref="Default"/>'a düşer.
///
/// Sınıf biçimi projedeki menüyle aynı (`fa fa-*`); FontAwesome 7 kuruludur ama
/// sürüm-özel font-family YAZILMAZ (bkz. kabuk ikon tuzağı).
/// </summary>
public static class MenuIcons
{
    public const string Default = "fa fa-folder";

    public static readonly IReadOnlyList<string> All = new[]
    {
        "fa fa-folder",
        "fa fa-star",
        "fa fa-bookmark",
        "fa fa-flag",
        "fa fa-heart",
        "fa fa-bolt",
        "fa fa-rocket",
        "fa fa-lightbulb",
        "fa fa-compass",
        "fa fa-globe",
        "fa fa-link",
        "fa fa-tag",
        "fa fa-bell",
        "fa fa-cube",
        "fa fa-box",
        "fa fa-briefcase",
        "fa fa-users",
        "fa fa-user-gear",
        "fa fa-chart-line",
        "fa fa-chart-pie",
        "fa fa-list-check",
        "fa fa-calendar-days",
        "fa fa-file-lines",
        "fa fa-shield-halved",
        "fa fa-wrench",
        "fa fa-gear"
    };

    private static readonly HashSet<string> Allowed = All.ToHashSet(StringComparer.Ordinal);

    /// <summary>Liste dışı ya da boş değeri varsayılana çeker.</summary>
    public static string Normalize(string? icon)
    {
        icon = icon?.Trim();
        return icon != null && Allowed.Contains(icon) ? icon : Default;
    }
}
