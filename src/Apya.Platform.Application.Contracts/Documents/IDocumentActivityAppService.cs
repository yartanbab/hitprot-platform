using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>Değiştirilemez denetim izi — yalnızca okuma.</summary>
public interface IDocumentActivityAppService : IApplicationService
{
    Task<PagedResultDto<DocumentActivityDto>> GetListAsync(GetDocumentActivityInput input);
}
