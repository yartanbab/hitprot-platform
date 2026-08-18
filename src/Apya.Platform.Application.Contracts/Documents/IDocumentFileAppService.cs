using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// Belge (dosya) listesi ve meta yönetimi. Klasör/sayfa CRUD'u
/// <see cref="IDocumentAppService"/>'te kalmaya devam eder.
/// </summary>
public interface IDocumentFileAppService : IApplicationService
{
    Task<PagedResultDto<DocumentFileDto>> GetListAsync(GetDocumentFilesInput input);

    Task<DocumentFileDetailDto> GetAsync(Guid id);

    Task<DocumentFileDto> UpdateMetaAsync(Guid id, UpdateDocumentFileMetaDto input);

    /// <summary>Tek satırın sürükle-bırakla klasör değiştirmesi.</summary>
    Task<DocumentFileDto> MoveAsync(Guid id, Guid targetDocumentId);

    Task BulkMoveAsync(BulkMoveDocumentFilesDto input);

    Task BulkTagAsync(BulkTagDocumentFilesDto input);

    Task DeleteAsync(Guid id);

    /// <summary>Etiket girişinde öneri listesi (tenant'ın mevcut etiketleri).</summary>
    Task<List<string>> GetTagsAsync();
}
