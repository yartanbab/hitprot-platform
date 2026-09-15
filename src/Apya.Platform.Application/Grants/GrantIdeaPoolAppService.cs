using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 19a · Host "Fikir Havuzu".
///
/// <para>🔴 Okuma filtre BİLEREK kapalı yapılır (emsal: Talepler) ve TenantId koşulu elle konur.
/// Yazma ise firmanın bağlamına GEÇİLEREK yapılır: <c>Disable()</c> kapsamında açılan kayıt
/// yanlış kiracıya düşebilirdi.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantIdeaPoolAppService : PlatformAppService, IGrantIdeaPoolAppService
{
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantIdeaPoolAppService(
        IRepository<GrantInterest, Guid> interestRepo,
        ITenantRepository tenantRepo,
        IIdentityUserRepository userRepo,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _interestRepo = interestRepo;
        _tenantRepo = tenantRepo;
        _userRepo = userRepo;
        _mtFilter = mtFilter;
    }

    public async Task<GrantIdeaPoolDto> GetListAsync(GetGrantIdeaPoolInput input)
    {
        EnsureHostContext();

        List<GrantInterest> ideas;
        using (_mtFilter.Disable())
        {
            ideas = await _interestRepo.GetListAsync(i =>
                i.TenantId != null
                && i.GrantCallId == null
                && (i.Status == GrantInterestStatus.Yeni || i.Status == GrantInterestStatus.Inceleniyor));
        }

        var tenants = await _tenantRepo.GetListAsync();
        var firmNames = tenants.ToDictionary(t => t.Id, t => t.Name);
        var creators = await LoadCreatorNamesAsync(ideas);

        var filtered = ideas.Where(i => input.Source == null || i.Source == input.Source);
        filtered = input.Sort == GrantIdeaPoolSort.Budget
            ? filtered.OrderByDescending(i => i.EstimatedBudget.HasValue).ThenByDescending(i => i.EstimatedBudget).ThenByDescending(i => i.CreationTime)
            : filtered.OrderByDescending(i => i.CreationTime);

        return new GrantIdeaPoolDto
        {
            TotalCount = ideas.Count,
            Items = filtered.Select(i => Fill(new GrantIdeaRowDto(), i, firmNames, creators)).ToList(),
            Firms = tenants
                .OrderBy(t => t.Name)
                .Select(t => new GrantRequestOptionDto { Id = t.Id, Name = t.Name })
                .ToList()
        };
    }

    public async Task<GrantIdeaDetailDto> GetAsync(Guid id)
    {
        EnsureHostContext();

        GrantInterest? idea;
        using (_mtFilter.Disable())
        {
            idea = await _interestRepo.FirstOrDefaultAsync(i => i.Id == id && i.TenantId != null && i.GrantCallId == null);
        }
        if (idea == null)
        {
            throw new EntityNotFoundException(typeof(GrantInterest), id);
        }

        var tenant = await _tenantRepo.GetAsync(idea.TenantId!.Value);
        var creators = await LoadCreatorNamesAsync(new List<GrantInterest> { idea });
        var dto = Fill(new GrantIdeaDetailDto(), idea, new Dictionary<Guid, string> { [tenant.Id] = tenant.Name }, creators);
        dto.ProblemStatement = idea.ProblemStatement;
        dto.TargetAudience = idea.TargetAudience;
        dto.PlannedActivities = idea.PlannedActivities;
        dto.DurationAndPartners = idea.DurationAndPartners;
        dto.SupportNeeds = idea.SupportNeeds;
        dto.PriorExperience = idea.PriorExperience;
        dto.TeamStructure = idea.TeamStructure;
        dto.Stakeholders = idea.Stakeholders;
        return dto;
    }

    public async Task<GrantIdeaDetailDto> CreateAsync(CreateGrantIdeaInput input)
    {
        EnsureHostContext();

        var tenant = await _tenantRepo.FindAsync(input.TenantId);
        if (tenant == null)
        {
            throw new EntityNotFoundException(typeof(Tenant), input.TenantId);
        }

        Guid id;
        // Kayıt firmanın bağlamında KURULUR: ABP TenantId'yi nesne oluşurken atar.
        using (CurrentTenant.Change(tenant.Id))
        {
            // Talep eden yok (null): cevap bildirimleri firma kullanıcısına gider, danışmana değil.
            // Giren danışman CreatorId'de durur.
            var idea = new GrantInterest(
                GuidGenerator.Create(),
                tenant.Id,
                grantCallId: null,
                requestedByUserId: null,
                input.Note,
                input.EstimatedBudget,
                input.TargetStartDate,
                source: GrantInterestSource.Consultant);
            idea.SetIdeaDetails(input);
            idea.RecordEnteredBy(CurrentUser.Id);

            await _interestRepo.InsertAsync(idea, autoSave: true);
            id = idea.Id;
        }

        return await GetAsync(id);
    }

    /// <summary>Giren kişi firma kullanıcısı ya da host kullanıcısı olabilir: filtre kapalı, Id ile.</summary>
    private async Task<Dictionary<Guid, string>> LoadCreatorNamesAsync(List<GrantInterest> ideas)
    {
        var ids = ideas.Where(i => i.CreatorId.HasValue).Select(i => i.CreatorId!.Value).Distinct().ToList();
        if (ids.Count == 0)
        {
            return new Dictionary<Guid, string>();
        }

        using (_mtFilter.Disable())
        {
            return (await _userRepo.GetListByIdsAsync(ids)).ToDictionary(u => u.Id, DisplayName);
        }
    }

    private static T Fill<T>(T row, GrantInterest idea, Dictionary<Guid, string> firmNames, Dictionary<Guid, string> creators)
        where T : GrantIdeaRowDto
    {
        row.Id = idea.Id;
        row.TenantId = idea.TenantId!.Value;
        row.FirmName = firmNames.GetValueOrDefault(idea.TenantId.Value, string.Empty);
        row.Idea = idea.Note;
        row.Source = idea.Source;
        row.CreatorName = idea.CreatorId.HasValue ? creators.GetValueOrDefault(idea.CreatorId.Value) : null;
        row.CreationTime = idea.CreationTime;
        row.EstimatedBudget = idea.EstimatedBudget;
        row.TargetStartDate = idea.TargetStartDate;
        return row;
    }

    /// <summary>Ad + soyad; ikisi de boşsa kullanıcı adı.</summary>
    private static string DisplayName(IdentityUser user)
    {
        var full = $"{user.Name} {user.Surname}".Trim();
        return string.IsNullOrWhiteSpace(full) ? user.UserName : full;
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException();
        }
    }
}
