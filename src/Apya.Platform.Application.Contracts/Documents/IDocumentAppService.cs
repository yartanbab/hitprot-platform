using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

public interface IDocumentAppService :
    ICrudAppService<
        DocumentDto,
        Guid,
        GetDocumentsInput,
        CreateUpdateDocumentDto>
{
    Task<DocumentAttachmentDto> AddAttachmentAsync(Guid documentId, string fileName, string storedFileName, string contentType, long fileSize);

    Task<List<DocumentAttachmentDto>> GetAttachmentsAsync(Guid documentId);

    Task DeleteAttachmentAsync(Guid attachmentId);
}
