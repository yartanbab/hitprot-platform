using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Apya.Platform.Projects.Dtos;

namespace Apya.Platform.Web.Pages;

/// <summary>
/// Gelir/Gider modallarının ortak yardımcısı: proje → {başlangıç, bitiş} tarih aralığı
/// JSON'u üretir. Client (apya-finance-modal.js) bu sözlükle tarih girişini projenin
/// aralığına sınırlar. Tarihler 'yyyy-MM-dd' (ISO) — date input min/max ile birebir.
/// </summary>
public static class FinanceLookupShared
{
    public static string BuildProjectDatesJson(IEnumerable<ProjectDto> projects)
    {
        var map = projects.ToDictionary(
            p => p.Id.ToString(),
            p => new ProjectDateRange
            {
                s = p.StartDate?.ToString("yyyy-MM-dd"),
                e = p.EndDate?.ToString("yyyy-MM-dd")
            });
        return JsonSerializer.Serialize(map);
    }

    // JSON anahtarları kasıtlı kısa (s/e) — client 'i.s' / 'i.e' okur.
    private sealed class ProjectDateRange
    {
        public string? s { get; set; }
        public string? e { get; set; }
    }
}
