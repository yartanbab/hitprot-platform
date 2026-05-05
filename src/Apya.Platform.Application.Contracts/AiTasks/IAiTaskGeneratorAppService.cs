using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.AiTasks;

/// <summary>
/// Proje dosyasini okuyup otomatik gorev onerisi ureten servisin sozlesmesi.
/// </summary>
public interface IAiTaskGeneratorAppService : IApplicationService
{
    Task<DocumentParseResultDto> ParseDocumentFromBytesAsync(Guid projectId, byte[] fileBytes, string fileName);

    Task<DocumentParseResultDto> ParseExistingDocumentAsync(Guid projectId);

    Task<int> CreateTasksFromSuggestionsAsync(CreateTasksFromAiInput input);
}
