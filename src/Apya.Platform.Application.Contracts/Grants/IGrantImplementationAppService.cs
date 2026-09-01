using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 6c · Uygulama &amp; Tahsilat. Firma durumu okur; rapor ve tahsilat hareketlerini
/// danışman yürütür.
/// </summary>
public interface IGrantImplementationAppService : IApplicationService
{
    Task<GrantImplementationDto> GetAsync(Guid applicationId);

    Task<GrantImplementationDto> SaveReportAsync(SaveGrantReportInput input);
    Task<GrantImplementationDto> SetReportStatusAsync(SetGrantReportStatusInput input);
    Task<GrantImplementationDto> AddSectionAsync(AddGrantReportSectionInput input);
    Task<GrantImplementationDto> SetSectionStatusAsync(SetGrantReportSectionStatusInput input);

    /// <summary>Dilimi tahsil edildi işaretler; bağlı rapor onaylanmamışsa reddeder.</summary>
    Task<GrantImplementationDto> MarkTranchePaidAsync(Guid trancheId);
}
