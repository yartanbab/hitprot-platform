using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Projects.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Projects;

/// <summary>
/// Proje kategorisi tanımları. Sistem kategorileri (Hibe / Etkinlik / Diğer) globaldir ve
/// yalnız gizlenebilir; kiracı kendi kategorilerini ekleyip düzenleyebilir.
/// </summary>
public interface IProjectCategoryAppService : IApplicationService
{
    /// <summary>Geçerli kiracının gördüğü tüm kategoriler (pasifler dahil), sıraya dizili.</summary>
    Task<List<ProjectCategoryDto>> GetListAsync();

    /// <summary>Yeni proje ekranında seçilebilecek kategoriler (yalnız aktifler).</summary>
    Task<List<ProjectCategoryDto>> GetSelectableAsync();

    Task<ProjectCategoryDto> CreateAsync(CreateUpdateProjectCategoryDto input);

    Task<ProjectCategoryDto> UpdateAsync(Guid id, CreateUpdateProjectCategoryDto input);

    /// <summary>
    /// Kiracı kategorisini siler. Sistem kategorisi silinemez; kategoriyi kullanan
    /// proje varsa silme reddedilir (bunun yerine pasife alınır).
    /// </summary>
    Task DeleteAsync(Guid id);

    /// <summary>Sistem kategorisinin bu kiracıda görünürlüğünü değiştirir.</summary>
    Task SetSystemVisibilityAsync(Guid id, bool visible);
}
