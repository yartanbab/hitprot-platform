using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.AiTasks;

/// <summary>
/// Proje dosyasini okuyup otomatik gorev onerisi ureten servisin sozlesmesi.
/// </summary>
public interface IAiTaskGeneratorAppService : IApplicationService
{
    /// <summary>
    /// Mevcut projede yuklu dosyayi analiz eder ve gorev onerisi doner.
    /// </summary>
    Task<DocumentParseResultDto> ParseExistingDocumentAsync(Guid projectId);

    /// <summary>
    /// Kullanicinin onayladigi AI gorev onerilerini topluca olusturur.
    /// </summary>
    Task<int> CreateTasksFromSuggestionsAsync(CreateTasksFromAiInput input);
}
