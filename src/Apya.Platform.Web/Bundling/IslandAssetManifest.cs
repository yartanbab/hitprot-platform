using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Web.Bundling;

/// <summary>
/// Vite'ın ürettiği <c>wwwroot/js/.vite/manifest.json</c>'u okur ve bir island
/// entry'sinin <b>geçişli</b> chunk grafiğini verir.
/// <para>
/// Neden gerekli: island'lar ES modülü olarak yükleniyor. Tarayıcı bağımlı
/// chunk'ları ancak entry dosyasını indirip ayrıştırdıktan SONRA keşfeder; grafik
/// derinleştikçe her seviye bir gidiş-dönüş daha ekler. Dashboard'da ui-vendor
/// (226 KB) entry'nin DOĞRUDAN import'u bile değil — Dialog üzerinden geçişli
/// bağlı, yani en geç keşfedilen ve en büyük parçalardan biri. Grafiği sunucuda
/// çözüp <c>&lt;link rel="modulepreload"&gt;</c> olarak basınca tüm chunk'lar
/// entry ile PARALEL iner; ilk /api isteği o kadar öne çekilir.
/// </para>
/// <para>
/// Manifest yoksa (henüz <c>npm run build</c> koşmamış) sessizce boş döner —
/// preload bir optimizasyondur, yokluğu sayfayı bozmaz.
/// </para>
/// <para>
/// Manifest süreç ömrü boyunca BİR KEZ okunur. Geliştirmede yeniden build
/// aldıysan uygulamayı da yeniden başlat; yoksa eski chunk adları preload edilir
/// (zararsız 404, sayfa yine doğru grafiği yükler).
/// </para>
/// </summary>
public class IslandAssetManifest : ISingletonDependency
{
    /// <summary>wwwroot'a göreli manifest yolu (Vite 5 varsayılanı).</summary>
    private const string ManifestPath = "js/.vite/manifest.json";

    /// <summary>Üretilen chunk'ların servis edildiği kök.</summary>
    private const string AssetRoot = "/js/";

    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<IslandAssetManifest> _logger;
    private readonly Lazy<IReadOnlyDictionary<string, IReadOnlyList<string>>> _preloadsByEntry;

    public IslandAssetManifest(
        IWebHostEnvironment environment,
        ILogger<IslandAssetManifest> logger)
    {
        _environment = environment;
        _logger = logger;
        _preloadsByEntry = new Lazy<IReadOnlyDictionary<string, IReadOnlyList<string>>>(
            Build, LazyThreadSafetyMode.ExecutionAndPublication);
    }

    /// <summary>
    /// <paramref name="entryName"/> island'ının önceden yüklenecek chunk URL'leri.
    /// Entry'nin KENDİSİ listede yoktur — onu <c>&lt;script src&gt;</c> zaten çeker.
    /// Bilinmeyen entry ya da eksik manifest için boş liste döner.
    /// </summary>
    public IReadOnlyList<string> GetPreloadUrls(string entryName)
    {
        return _preloadsByEntry.Value.TryGetValue(entryName, out var urls)
            ? urls
            : Array.Empty<string>();
    }

    private IReadOnlyDictionary<string, IReadOnlyList<string>> Build()
    {
        var file = _environment.WebRootFileProvider.GetFileInfo(ManifestPath);
        if (!file.Exists)
        {
            _logger.LogWarning(
                "Vite manifest bulunamadı ({Path}) — island chunk'ları modulepreload edilmeyecek. " +
                "'npm run build' koşuldu mu?", ManifestPath);
            return new Dictionary<string, IReadOnlyList<string>>();
        }

        Dictionary<string, ManifestChunk>? chunks;
        try
        {
            using var stream = file.CreateReadStream();
            chunks = JsonSerializer.Deserialize<Dictionary<string, ManifestChunk>>(stream);
        }
        catch (Exception ex) when (ex is JsonException or IOException)
        {
            // Bozuk/yarım yazılmış manifest sayfayı DÜŞÜRMEZ; preload'dan vazgeçilir.
            _logger.LogWarning(ex, "Vite manifest okunamadı ({Path}).", ManifestPath);
            return new Dictionary<string, IReadOnlyList<string>>();
        }

        var result = new Dictionary<string, IReadOnlyList<string>>(StringComparer.Ordinal);
        if (chunks == null)
        {
            return result;
        }

        foreach (var (key, chunk) in chunks)
        {
            if (!chunk.IsEntry || string.IsNullOrEmpty(chunk.Name))
            {
                continue;
            }

            var urls = new List<string>();
            var visited = new HashSet<string>(StringComparer.Ordinal);
            CollectImports(chunks, key, visited, urls);
            result[chunk.Name] = urls;
        }

        return result;
    }

    /// <summary>
    /// <paramref name="key"/> chunk'ının import grafiğini derinlik-öncelikli gezer.
    /// <paramref name="visited"/> hem tekrarı hem döngüyü keser (Rollup grafiği
    /// çevrimsiz olmalıdır ama buna güvenip sonsuz döngü riski almıyoruz).
    /// </summary>
    private static void CollectImports(
        IReadOnlyDictionary<string, ManifestChunk> chunks,
        string key,
        HashSet<string> visited,
        List<string> urls)
    {
        if (!chunks.TryGetValue(key, out var chunk) || chunk.Imports == null)
        {
            return;
        }

        foreach (var importKey in chunk.Imports)
        {
            if (!visited.Add(importKey))
            {
                continue;
            }

            if (chunks.TryGetValue(importKey, out var imported) && !string.IsNullOrEmpty(imported.File))
            {
                urls.Add(AssetRoot + imported.File);
            }

            CollectImports(chunks, importKey, visited, urls);
        }
    }

    /// <summary>Manifest kaydının yalnız kullandığımız alanları.</summary>
    private sealed class ManifestChunk
    {
        [JsonPropertyName("file")]
        public string? File { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("isEntry")]
        public bool IsEntry { get; set; }

        [JsonPropertyName("imports")]
        public List<string>? Imports { get; set; }
    }
}
