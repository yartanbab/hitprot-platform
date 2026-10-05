using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 🔴 DOC-02 · Projenin doğduğu hibe başvurusunu çözer — proje konsolundan hibe evrakına
/// giden tek köprü.
///
/// <para>Yeni alan GEREKMEDİ: bağ zaten <c>GrantApplication.ProjectId</c>'de duruyor ve
/// indeksli. Eksik olan şey kimlik değil, o kimliği TÜKETEN taraftı — proje hiçbir yerde
/// "ben şu başvurudan doğdum" demiyordu.</para>
/// </summary>
public interface IGrantProjectOriginAppService : IApplicationService
{
    /// <summary>Projenin kaynağı başvuru yoksa <c>null</c> döner (hibeden doğmamış proje).</summary>
    Task<GrantProjectOriginDto?> GetByProjectAsync(Guid projectId);

    /// <summary>
    /// Projenin doğduğu başvurunun kilometre taşları — raporun "Kilometre taşları"
    /// bölümünün kaynağı. Proje hibeden doğmamışsa BOŞ liste döner (hata değil).
    /// </summary>
    Task<List<GrantProjectMilestoneDto>> GetMilestonesByProjectAsync(Guid projectId);
}
