using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Search;

/// <summary>
/// X-01 · Ctrl K komut paletinin kayıt araması. Palet yalnız menü sayfalarını buluyordu; artık görev,
/// proje, hibe başvurusu ve faturayı ada/koda göre bulur. Her tür için en fazla
/// <see cref="RecordSearchLimits.PerKind"/> sonuç; görmeye yetkisi olmayan tür hiç aranmaz.
/// </summary>
public interface IRecordSearchAppService : IApplicationService
{
    Task<List<RecordSearchResultDto>> SearchAsync(string term);
}

public static class RecordSearchLimits
{
    public const int PerKind = 5;
    public const int MinTermLength = 2;
}

public class RecordSearchResultDto
{
    /// <summary>task | project | grant | invoice — paletin simgesi ve grup sırası buna bakar.</summary>
    public string Kind { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string Url { get; set; } = string.Empty;
}
