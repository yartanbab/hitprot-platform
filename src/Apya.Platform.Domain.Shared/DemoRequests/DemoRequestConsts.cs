using System;
using System.Linq;

namespace Apya.Platform.DemoRequests;

/// <summary>
/// Demo talebi sabitleri: alan uzunlukları, ilgilenilen modül anahtarları ve
/// oturumsuz formun kötüye kullanım sınırları.
/// </summary>
public static class DemoRequestConsts
{
    public const int MaxFullNameLength = 150;
    public const int MaxCompanyNameLength = 200;
    public const int MaxEmailLength = 256;
    public const int MaxPhoneLength = 32;
    public const int MaxInterestedModulesLength = 400;
    public const int MaxMessageLength = 2000;

    // --- Proje fikri (ön görüşme) alanları ---
    public const int MaxTargetAudienceLength = 300;
    public const int MaxProblemStatementLength = 1500;
    public const int MaxPlannedActivitiesLength = 1500;
    public const int MaxExpectedOutcomesLength = 1500;
    public const int MaxAdminNoteLength = 2000;
    public const int MaxIpAddressLength = 64;
    public const int MaxUserAgentLength = 512;

    /// <summary>Formun KVKK aydınlatma onayında kullanılacak kaynak etiketi.</summary>
    public const string ConsentSourceRef = "account/demo-request";

    /// <summary>Aynı IP'den bu pencerede kabul edilecek en fazla talep sayısı.</summary>
    public const int RateLimitMaxRequests = 3;

    /// <summary>Kötüye kullanım sayacının penceresi (saat).</summary>
    public const int RateLimitWindowHours = 1;

    /// <summary>
    /// Formdaki "ilgilendiğim modüller" seçenekleri. Anahtarlar VERİTABANINA yazılır,
    /// etiketleri <c>DemoRequest:Module:{anahtar}</c> ile yerelleştirilir — modül adı
    /// değişince kayıtlı talepler bozulmasın diye anahtar sabittir.
    /// </summary>
    public static readonly string[] ModuleKeys =
    {
        "Projects",
        "Finance",
        "Invoices",
        "Documents",
        "Forms",
        "Calendar",
        "Grants",
        "Reports"
    };

    /// <summary>
    /// Serbest gelen modül listesini tanınan anahtarlara indirger ve CSV'ye çevirir.
    /// Tanınmayan değer sessizce atılır: liste istemciden geliyor, doğrulanmadan
    /// saklanırsa panel etiketi çözemez.
    /// </summary>
    public static string? NormalizeModules(string?[]? modules)
    {
        if (modules == null)
        {
            return null;
        }

        var known = modules
            .Where(m => !string.IsNullOrWhiteSpace(m))
            .Select(m => m!.Trim())
            .Where(m => ModuleKeys.Contains(m, StringComparer.OrdinalIgnoreCase))
            .Select(m => ModuleKeys.First(k => string.Equals(k, m, StringComparison.OrdinalIgnoreCase)))
            .Distinct()
            .ToArray();

        return known.Length == 0 ? null : string.Join(",", known);
    }

    /// <summary>CSV olarak saklanan modül listesini geri okur.</summary>
    public static string[] SplitModules(string? csv)
        => string.IsNullOrWhiteSpace(csv)
            ? Array.Empty<string>()
            : csv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
}
