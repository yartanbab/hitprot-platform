using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Permissions;

namespace Apya.Platform.Documents;

[Authorize(PlatformPermissions.Documents.Default)]
public class DocumentAppService :
    CrudAppService<
        Document,
        DocumentDto,
        Guid,
        GetDocumentsInput,
        CreateUpdateDocumentDto>,
    IDocumentAppService
{
    public DocumentAppService(IRepository<Document, Guid> repository)
        : base(repository)
    {
        CreatePolicyName = PlatformPermissions.Documents.Create;
        UpdatePolicyName = PlatformPermissions.Documents.Edit;
        DeletePolicyName = PlatformPermissions.Documents.Delete;
    }

    protected override async Task<IQueryable<Document>> CreateFilteredQueryAsync(GetDocumentsInput input)
    {
        var query = await base.CreateFilteredQueryAsync(input);

        if (!string.IsNullOrWhiteSpace(input.FilterText))
        {
            query = query.Where(d => d.Title.Contains(input.FilterText) || d.Content.Contains(input.FilterText));
        }

        if (input.ProjectId.HasValue)
        {
            query = query.Where(d => d.ProjectId == input.ProjectId);
        }

        if (input.RootLevelOnly)
        {
            query = query.Where(d => d.ParentDocumentId == null);
        }
        else if (input.ParentDocumentId.HasValue)
        {
            query = query.Where(d => d.ParentDocumentId == input.ParentDocumentId);
        }

        return query;
    }
}
