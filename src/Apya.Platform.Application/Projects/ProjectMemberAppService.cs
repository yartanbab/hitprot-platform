using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

/// <summary>
/// Konsol 8. adım: proje ekibi yönetimi.
/// Okuma Projects.Default, yazma Projects.ManageTeam ister (izin zaten tanımlıydı).
/// </summary>
[Authorize(PlatformPermissions.Projects.Default)]
public class ProjectMemberAppService : PlatformAppService, IProjectMemberAppService
{
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IIdentityUserRepository _userRepository;
    private readonly IDataFilter _dataFilter;

    public ProjectMemberAppService(
        IRepository<ProjectMember, Guid> memberRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IIdentityUserRepository userRepository,
        IDataFilter dataFilter)
    {
        _memberRepository = memberRepository;
        _taskRepository = taskRepository;
        _userRepository = userRepository;
        _dataFilter = dataFilter;
    }

    public async Task<List<ProjectMemberDto>> GetListByProjectAsync(Guid projectId)
    {
        // Host bağlamında kiracı projesinin ekibi de okunabilmeli. Filtre açık kalınca
        // patlamıyor ama SESSİZCE boş liste dönüyordu: proje detayında ekip yokmuş gibi
        // görünüyor, şeritteki facepile boş kalıyordu.
        using var hostScope = CurrentTenant.Id == null ? _dataFilter.Disable<IMultiTenant>() : null;

        var members = await _memberRepository.GetListAsync(m => m.ProjectId == projectId);
        if (members.Count == 0)
        {
            return new List<ProjectMemberDto>();
        }

        // Kullanıcı adları TEK sorguda çekilir — üye başına FindAsync N+1 yapardı.
        var userIds = members.Select(m => m.UserId).Distinct().ToList();
        var users = (await _userRepository.GetListByIdsAsync(userIds))
            .ToDictionary(u => u.Id);

        // Açık görev sayısı da tek sorguda: kapanmamış = İptal(0) ve Tamamlandı(4) dışı.
        // TAM NİTELİKLİ yazılmalı: `using System.Threading.Tasks` yüzünden kısa
        // `Tasks.TaskStatus` System.Threading.Tasks.TaskStatus'a çözülüyor.
        var openTasks = await _taskRepository.GetListAsync(t =>
            t.ProjectId == projectId &&
            t.AssigneeId.HasValue &&
            t.Status != Apya.Platform.Tasks.TaskStatus.Done &&
            t.Status != Apya.Platform.Tasks.TaskStatus.Cancelled);

        var openCounts = openTasks
            .GroupBy(t => t.AssigneeId!.Value)
            .ToDictionary(g => g.Key, g => g.Count());

        return members
            .Select(m => ToDto(m, users.GetValueOrDefault(m.UserId), openCounts.GetValueOrDefault(m.UserId)))
            .OrderBy(d => d.Role)               // Lead önce
            .ThenBy(d => d.DisplayName)
            .ToList();
    }

    public async Task<List<UserLookupDto>> GetAssignableUsersAsync(Guid projectId)
    {
        var members = await _memberRepository.GetListAsync(m => m.ProjectId == projectId);
        var alreadyIn = members.Select(m => m.UserId).ToHashSet();

        // TaskAppService'teki atanabilir kullanıcı sorgusuyla aynı sınır (500).
        var users = await _userRepository.GetListAsync(maxResultCount: 500, sorting: "UserName");

        return users
            .Where(u => !alreadyIn.Contains(u.Id))
            .Select(u => new UserLookupDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Name = u.Name ?? string.Empty,
                Surname = u.Surname ?? string.Empty
            })
            .ToList();
    }

    [Authorize(PlatformPermissions.Projects.ManageTeam)]
    public async Task<ProjectMemberDto> AddAsync(AddProjectMemberDto input)
    {
        var user = await _userRepository.FindAsync(input.UserId)
            ?? throw new UserFriendlyException("Kullanıcı bulunamadı.");

        // Soft-delete filtresi KAPATILARAK aranır: ekipten çıkarılmış bir üyenin
        // satırı tabloda kalıyor ve (ProjectId, UserId) tekil indeksi IsDeleted'a
        // bakmıyor. Filtre açıkken kayıt bulunamayıp INSERT denenirse SQL
        // "duplicate key" fırlatıyor — çıkarılan biri bir daha eklenemiyordu
        // (canlı doğrulandı, 500 dönüyordu).
        using (_dataFilter.Disable<ISoftDelete>())
        {
            var existing = await _memberRepository.FindAsync(
                m => m.ProjectId == input.ProjectId && m.UserId == input.UserId);

            if (existing != null)
            {
                if (!existing.IsDeleted)
                {
                    throw new UserFriendlyException("Bu kullanıcı zaten projenin ekibinde.");
                }

                existing.Restore(input.Role);
                await _memberRepository.UpdateAsync(existing, autoSave: true);
                return ToDto(existing, user, 0);
            }
        }

        var member = new ProjectMember(
            GuidGenerator.Create(), input.ProjectId, input.UserId, input.Role, CurrentTenant.Id);

        await _memberRepository.InsertAsync(member, autoSave: true);
        return ToDto(member, user, 0);
    }

    [Authorize(PlatformPermissions.Projects.ManageTeam)]
    public async Task<ProjectMemberDto> UpdateRoleAsync(Guid id, UpdateProjectMemberRoleDto input)
    {
        var member = await _memberRepository.GetAsync(id);
        member.SetRole(input.Role);
        await _memberRepository.UpdateAsync(member, autoSave: true);

        var user = await _userRepository.FindAsync(member.UserId);
        return ToDto(member, user, 0);
    }

    [Authorize(PlatformPermissions.Projects.ManageTeam)]
    public async Task RemoveAsync(Guid id)
    {
        var member = await _memberRepository.GetAsync(id);

        // Görevleri BOŞA ÇIKARMIYORUZ: üyelik yalnız kayıt, atama ondan bağımsız
        // (bkz. ProjectMember sınıf notu). Ekipten çıkan birinin görevleri
        // sessizce sahipsiz kalsaydı iş kaybolurdu.
        await _memberRepository.DeleteAsync(member, autoSave: true);
    }

    /// <summary>
    /// Tek seferlik geçiş: ProjectMember 8. adımda geldiği için eski projelerin
    /// ekibi boş görünüyor. Bu işlem ekibi mevcut görev atamalarından türetir.
    ///
    /// DbMigrator seed'i olarak YAZILMADI: `ApyaPlatformDbMigrationService`
    /// tenant'ları dolaşmıyor, `_dataSeeder.SeedAsync()`i host bağlamında tek
    /// sefer çağırıyor — multi-tenant filtresi yüzünden tenant verisi görünmez,
    /// seeder sessizce hiçbir şey yapmazdı. Kullanıcı tetiklemesi ayrıca doğru
    /// tenant bağlamını ve anında geri bildirimi bedavaya getiriyor.
    /// </summary>
    public async Task<int> GetBackfillCandidateCountAsync(Guid projectId)
    {
        var (candidates, _, _) = await ResolveBackfillAsync(projectId);
        return candidates.Count;
    }

    [Authorize(PlatformPermissions.Projects.ManageTeam)]
    public async Task<ProjectMemberBackfillResultDto> BackfillFromAssigneesAsync(Guid projectId)
    {
        var (candidates, alreadyMember, previouslyRemoved) = await ResolveBackfillAsync(projectId);

        foreach (var userId in candidates)
        {
            await _memberRepository.InsertAsync(
                new ProjectMember(GuidGenerator.Create(), projectId, userId,
                                  ProjectMemberRole.Member, CurrentTenant.Id));
        }

        return new ProjectMemberBackfillResultDto
        {
            Added = candidates.Count,
            SkippedAlreadyMember = alreadyMember,
            SkippedPreviouslyRemoved = previouslyRemoved
        };
    }

    /// <summary>
    /// Backfill'in kimi ekleyeceğini hesaplar. Sayım ve uygulama AYNI kaynaktan
    /// gelsin diye ortak: iki ayrı yerde yazılsa şerit "3 kişi" deyip işlem 1
    /// kişi ekleyebilirdi.
    /// </summary>
    private async Task<(List<Guid> Candidates, int AlreadyMember, int PreviouslyRemoved)>
        ResolveBackfillAsync(Guid projectId)
    {
        // Durumu ne olursa olsun TÜM atamalar sayılır: tamamlanmış görevi olan
        // da bu projede çalışmıştır.
        var tasks = await _taskRepository.GetListAsync(t => t.ProjectId == projectId && t.AssigneeId.HasValue);
        var assigneeIds = tasks.Select(t => t.AssigneeId!.Value).Distinct().ToList();
        if (assigneeIds.Count == 0)
        {
            return (new List<Guid>(), 0, 0);
        }

        // Soft-delete filtresi KAPALI okunur: ekipten çıkarılmış kişinin satırı
        // duruyor ve o kişi BİLEREK çıkarılmış demektir — backfill onu geri
        // getirmemeli. Filtre açık okunsaydı "kayıt yok" sanılıp yeniden
        // eklenirdi (ayrıca tekil indeks INSERT'i reddederdi).
        List<ProjectMember> allRows;
        using (_dataFilter.Disable<ISoftDelete>())
        {
            allRows = await _memberRepository.GetListAsync(m => m.ProjectId == projectId);
        }

        var live = allRows.Where(m => !m.IsDeleted).Select(m => m.UserId).ToHashSet();
        var removed = allRows.Where(m => m.IsDeleted).Select(m => m.UserId).ToHashSet();

        var candidates = new List<Guid>();
        var alreadyMember = 0;
        var previouslyRemoved = 0;

        foreach (var userId in assigneeIds)
        {
            if (live.Contains(userId)) { alreadyMember++; }
            else if (removed.Contains(userId)) { previouslyRemoved++; }
            else { candidates.Add(userId); }
        }

        return (candidates, alreadyMember, previouslyRemoved);
    }

    private static string RoleText(ProjectMemberRole role) => role switch
    {
        ProjectMemberRole.Lead => "Sorumlu",
        ProjectMemberRole.Observer => "İzleyici",
        _ => "Üye"
    };

    private static ProjectMemberDto ToDto(ProjectMember m, IdentityUser? user, int openTaskCount)
    {
        var full = user == null
            ? string.Empty
            : $"{user.Name} {user.Surname}".Trim();

        return new ProjectMemberDto
        {
            Id = m.Id,
            ProjectId = m.ProjectId,
            UserId = m.UserId,
            Role = m.Role,
            RoleText = RoleText(m.Role),
            UserName = user?.UserName ?? string.Empty,
            // Ad/soyad boşsa kullanıcı adına düş — avatar baş harfleri boş kalmasın.
            DisplayName = string.IsNullOrWhiteSpace(full) ? (user?.UserName ?? "Bilinmeyen") : full,
            Email = user?.Email,
            OpenTaskCount = openTaskCount
        };
    }
}
