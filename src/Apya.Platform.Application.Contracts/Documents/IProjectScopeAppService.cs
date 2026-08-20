using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// Proje kapsamı ağacı: proje → iş adımı → belge · eksik kalem, kardeş dalda
/// proje → görev → alt görev.
///
/// Ağaç TEMBEL yüklenir: önce proje satırları ve toplam gelir, bir proje
/// açıldığında o projenin dalı ayrıca istenir.
/// </summary>
public interface IProjectScopeAppService : IApplicationService
{
    /// <summary>Proje satırları + toplam şeridi.</summary>
    Task<ProjectScopeOverviewDto> GetOverviewAsync();

    /// <summary>Tek bir projenin alt ağacı.</summary>
    Task<ProjectScopeBranchDto> GetBranchAsync(Guid projectId);
}
