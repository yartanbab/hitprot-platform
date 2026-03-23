using System;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

public interface IDocumentAppService :
    ICrudAppService<
        DocumentDto,
        Guid,
        GetDocumentsInput,
        CreateUpdateDocumentDto>
{
}
