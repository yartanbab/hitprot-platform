using System;
using System.Collections.Generic;
using System.Text.Json;
using Apya.Platform.Shell.Dtos;

namespace Apya.Platform.Shell;

/// <summary>
/// Shell.BoardTabs ayarının SAKLAMA biçimi (2026-09: scope'lu sözlük).
///
/// Değer artık scope → sekme listesi sözlüğüdür:
/// <c>{"tasks":[{"kind":"list"}...],"project:&lt;guid&gt;":[...],"taskdetail":[...]}</c>
/// GERİ UYUM: eski değer düz bir JSON diziydi ve yalnız /Tasks'a aitti; dizi
/// görülürse "tasks" scope'u sayılır. Ayrı bir taşıma yok — kullanıcı ilk kez
/// sekme kaydettiğinde değer yeni biçimde yazılır.
///
/// Bu sınıf hem yazan (ShellAppService) hem okuyan (PageModel/View'lar) tarafça
/// kullanılır ki JSON biçimi tek yerde dursun. camelCase ZORUNLU: değeri C#
/// yazıyor ama sayfaya ham basılıp JavaScript okuyor — varsayılan PascalCase
/// çıktıda istemci "kind" alanını göremez, düzeni tanınmaz sayıp varsayılana
/// döner ve kullanıcının sekmeleri sessizce kaybolur.
/// </summary>
public static class ShellBoardTabsSetting
{
    /// <summary>/Tasks konsolunun sekmeleri.</summary>
    public const string TasksScope = "tasks";

    /// <summary>Görev detayının sekme SIRASI (özellik kodları `Kind` alanında).</summary>
    public const string TaskDetailScope = "taskdetail";

    /// <summary>Proje detay konsolunun sekmeleri — proje başına ayrı düzen.</summary>
    public static string ProjectScope(Guid projectId) => "project:" + projectId;

    private static readonly JsonSerializerOptions Json =
        new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase, PropertyNameCaseInsensitive = true };

    /// <summary>
    /// Ham ayar değerini scope sözlüğüne çevirir. Bozuk/boş değer boş sözlük
    /// döner — sekme düzeni kritik değil, hata kullanıcıya sıçramaz.
    /// </summary>
    public static Dictionary<string, List<ShellBoardTabDto>> Parse(string? raw)
    {
        raw = (raw ?? string.Empty).Trim();
        if (raw.Length == 0)
        {
            return new Dictionary<string, List<ShellBoardTabDto>>(StringComparer.Ordinal);
        }

        try
        {
            if (raw.StartsWith('['))
            {
                // Eski biçim: düz dizi = /Tasks düzeni.
                var legacy = JsonSerializer.Deserialize<List<ShellBoardTabDto>>(raw, Json);
                return new Dictionary<string, List<ShellBoardTabDto>>(StringComparer.Ordinal)
                {
                    [TasksScope] = legacy ?? new List<ShellBoardTabDto>()
                };
            }

            return JsonSerializer.Deserialize<Dictionary<string, List<ShellBoardTabDto>>>(raw, Json)
                   ?? new Dictionary<string, List<ShellBoardTabDto>>(StringComparer.Ordinal);
        }
        catch (JsonException)
        {
            return new Dictionary<string, List<ShellBoardTabDto>>(StringComparer.Ordinal);
        }
    }

    /// <summary>Sözlüğü saklanacak ham değere çevirir.</summary>
    public static string Serialize(Dictionary<string, List<ShellBoardTabDto>> scopes)
        => JsonSerializer.Serialize(scopes, Json);

    /// <summary>
    /// Tek scope'un sekmelerini, sayfaya <c>data-board-tabs</c> olarak basılacak
    /// camelCase JSON dizi metni olarak verir. Scope yoksa boş string döner
    /// ("kullanıcı hiç dokunmadı" — istemci varsayılanını kurar).
    /// </summary>
    public static string ExtractScopeJson(string? raw, string scope)
    {
        var scopes = Parse(raw);
        return scopes.TryGetValue(scope, out var tabs) && tabs is { Count: > 0 }
            ? JsonSerializer.Serialize(tabs, Json)
            : string.Empty;
    }
}
