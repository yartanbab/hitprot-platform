using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Apya.Platform.Shell.Dtos;

namespace Apya.Platform.Shell;

/// <summary>
/// Shell.KanbanView ayarının SAKLAMA biçimi ve doğrulama sözlüğü.
///
/// Değer tek bir JSON nesnedir:
/// <c>{"density":"compact","fields":{"code":true,...},"collapseEmpty":true,"hideDone":false}</c>
/// camelCase ZORUNLU: değeri C# yazıyor ama _KanbanBoard.cshtml sayfaya ham
/// basıyor ve /js/apya-kanban.js okuyor — PascalCase çıksa istemci alanları
/// göremez, tercihi tanınmaz sayıp varsayılana dönerdi (ShellBoardTabsSetting
/// ile aynı gerekçe).
/// </summary>
public static class ShellKanbanViewSetting
{
    /// <summary>Varsayılan yoğunluk — kanban v2 tasarım kararı (ekran 2a).</summary>
    public const string DefaultDensity = "compact";

    /// <summary>Geçerli yoğunluklar — istemciden gelen değere karşı beyaz liste.</summary>
    public static readonly string[] Densities = { "card", "compact", "list", "title" };

    /// <summary>
    /// Kartta açılıp kapatılabilen alanlar. "project" ve "subtasks" yalnız genel
    /// panoda anlamlı; yüzey farkı İSTEMCİDE ele alınır, saklamada ayrım yok.
    /// </summary>
    public static readonly HashSet<string> FieldKeys =
        new(StringComparer.Ordinal)
        { "code", "pri", "assignee", "due", "meta", "tags", "project", "subtasks" };

    private static readonly JsonSerializerOptions Json =
        new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase, PropertyNameCaseInsensitive = true };

    /// <summary>
    /// İstemciden gelen tercihi beyaz listeden geçirir: tanınmayan yoğunluk
    /// varsayılana düşer, tanınmayan alan anahtarı ATILIR (manipüle edilmiş
    /// istek ayarı şişirmesin).
    /// </summary>
    public static ShellKanbanViewDto Clean(ShellKanbanViewDto? input)
    {
        var cleaned = new ShellKanbanViewDto
        {
            Density = Densities.Contains(input?.Density ?? "") ? input!.Density : DefaultDensity,
            CollapseEmpty = input?.CollapseEmpty ?? true,
            HideDone = input?.HideDone ?? false
        };

        foreach (var pair in input?.Fields ?? new Dictionary<string, bool>())
        {
            if (FieldKeys.Contains(pair.Key))
            {
                cleaned.Fields[pair.Key] = pair.Value;
            }
        }

        return cleaned;
    }

    /// <summary>Tercihi saklanacak ham değere çevirir (camelCase).</summary>
    public static string Serialize(ShellKanbanViewDto view)
        => JsonSerializer.Serialize(view, Json);
}
