using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Application service interface for submitting anonymous responses to published documents.
/// Designed for unauthenticated access via Headless API.
/// </summary>
public interface IResponseAppService : IApplicationService
{
    /// <summary>
    /// Submits a new response (form answers) for a published document identified by slug.
    /// </summary>
    Task SubmitAsync(SubmitResponseDto input);
}
