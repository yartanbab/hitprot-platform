using System;
using Microsoft.Extensions.Configuration;

namespace Apya.Platform.EntityFrameworkCore;

/// <summary>
/// Desteklenen veritabanı sağlayıcıları. Aktif sağlayıcı appsettings'teki
/// <c>Database:Provider</c> bayrağıyla seçilir.
/// </summary>
public enum DatabaseProvider
{
    PostgreSql,
    SqlServer
}

/// <summary>
/// <c>Database:Provider</c> bayrağını ve seçilen sağlayıcının bağlantı dizisini çözer.
/// Hem runtime modülü hem de design-time DbContext factory buradan okur; tek kaynak.
/// </summary>
public static class DatabaseProviderResolver
{
    public const string ProviderConfigKey = "Database:Provider";

    /// <summary>Bayrağı okur; yoksa/geçersizse PostgreSql'e döner (geriye uyumluluk).</summary>
    public static DatabaseProvider Resolve(IConfiguration configuration)
    {
        var raw = configuration[ProviderConfigKey];

        if (!string.IsNullOrWhiteSpace(raw) &&
            Enum.TryParse<DatabaseProvider>(raw, ignoreCase: true, out var parsed))
        {
            return parsed;
        }

        return DatabaseProvider.PostgreSql;
    }

    /// <summary>
    /// Sağlayıcıya özel bağlantı dizisini döner: önce <c>ConnectionStrings:{Provider}</c>,
    /// yoksa <c>ConnectionStrings:Default</c>.
    /// </summary>
    public static string? ResolveConnectionString(IConfiguration configuration, DatabaseProvider provider)
    {
        return configuration.GetConnectionString(provider.ToString())
               ?? configuration.GetConnectionString("Default");
    }
}
