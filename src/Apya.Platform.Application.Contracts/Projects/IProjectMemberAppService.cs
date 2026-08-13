using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Projects.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Projects;

/// <summary>
/// Proje ekibi (konsol 8. adım). Üyelik yalnız kayıttır — görev ataması ve
/// görünürlük bundan etkilenmez (bkz. <see cref="ProjectMember"/>).
/// </summary>
public interface IProjectMemberAppService : IApplicationService
{
    Task<List<ProjectMemberDto>> GetListByProjectAsync(Guid projectId);

    /// <summary>Projeye henüz eklenmemiş, atanabilir kullanıcılar (üye ekleme seçicisi).</summary>
    Task<List<UserLookupDto>> GetAssignableUsersAsync(Guid projectId);

    Task<ProjectMemberDto> AddAsync(AddProjectMemberDto input);

    Task<ProjectMemberDto> UpdateRoleAsync(Guid id, UpdateProjectMemberRoleDto input);

    Task RemoveAsync(Guid id);

    /// <summary>
    /// Backfill ile ekibe eklenecek kişi sayısı. Drawer'daki geçiş şeridini
    /// göstermek/gizlemek için kullanılır — 0 ise şerit hiç çıkmaz.
    /// SUNUCUDAN sorulur çünkü sayfanın Razor tarafındaki görev listesi
    /// (`GetDetailAsync` → AutoMapper) `AssigneeName`i doldurmuyor.
    /// </summary>
    Task<int> GetBackfillCandidateCountAsync(Guid projectId);

    /// <summary>
    /// Projedeki görev atananlarını ekibe üye olarak ekler (tek seferlik geçiş
    /// aracı). Daha önce ekipten çıkarılmış kişileri GERİ GETİRMEZ.
    /// </summary>
    Task<ProjectMemberBackfillResultDto> BackfillFromAssigneesAsync(Guid projectId);
}
