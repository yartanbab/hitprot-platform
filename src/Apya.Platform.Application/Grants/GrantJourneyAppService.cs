using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;

namespace Apya.Platform.Grants;

/// <summary>
/// 18d · Kiracı · Hibe Yolculuğum.
///
/// <para>Yeni kayıt tutmaz: Başvurularım (6a) satırları, ilgi talepleri, projeler ve kapanan
/// çağrılar birleştirilir. "Sıradaki iş" 6a'nın hesabından gelir — iki ekran aynı başvuru için
/// farklı cümle kurmasın diye <see cref="IGrantMyApplicationsAppService"/> yeniden kullanılır.</para>
///
/// <para>Çağrı başına tek satır: başvuru varsa ilgi talebi gösterilmez (talebin devamıdır);
/// aynı çağrıya birden fazla talep varsa en yenisi.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantJourneyAppService : ApplicationService, IGrantJourneyAppService
{
    private readonly IGrantMyApplicationsAppService _myApplications;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepo;
    private readonly IRepository<GrantDisbursementTranche, Guid> _trancheRepo;
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<Project, Guid> _projectRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly IRepository<GrantMeetingProposal, Guid> _proposalRepo;

    public GrantJourneyAppService(
        IGrantMyApplicationsAppService myApplications,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantApplicationDocument, Guid> docRepo,
        IRepository<GrantDisbursementTranche, Guid> trancheRepo,
        IRepository<GrantInterest, Guid> interestRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<Project, Guid> projectRepo,
        IIdentityUserRepository userRepo,
        IDataFilter<IMultiTenant> mtFilter,
        IRepository<GrantMeetingProposal, Guid> proposalRepo)
    {
        _myApplications = myApplications;
        _appRepo = appRepo;
        _docRepo = docRepo;
        _trancheRepo = trancheRepo;
        _interestRepo = interestRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _projectRepo = projectRepo;
        _userRepo = userRepo;
        _mtFilter = mtFilter;
        _proposalRepo = proposalRepo;
    }

    public async Task<GrantJourneyDto> GetAsync()
    {
        // Yolculuk bir firmanındır; host'un firması yok.
        if (CurrentTenant.Id == null)
        {
            throw new AbpAuthorizationException();
        }

        var dto = new GrantJourneyDto { FirmName = CurrentTenant.Name };
        var today = Clock.Now.Date;

        var rows = (await _myApplications.GetAsync()).Items;
        var applications = (await _appRepo.GetListAsync()).ToDictionary(a => a.Id);
        var interests = await _interestRepo.GetListAsync();
        // 18e · Talep başına son görüşme önerisi (kiracı filtresi açık: yalnız firmanın kendi önerileri).
        var meetings = (await _proposalRepo.GetListAsync())
            .GroupBy(p => p.GrantInterestId)
            .ToDictionary(g => g.Key, g => g.OrderByDescending(p => p.CreationTime).First());

        var appIds = rows.Select(r => r.Id).ToList();
        var documents = (await _docRepo.GetListAsync(d => appIds.Contains(d.GrantApplicationId)))
            .GroupBy(d => d.GrantApplicationId).ToDictionary(g => g.Key, g => g.ToList());
        var tranches = (await _trancheRepo.GetListAsync(t => appIds.Contains(t.GrantApplicationId)))
            .GroupBy(t => t.GrantApplicationId).ToDictionary(g => g.Key, g => g.ToList());
        var projectIds = rows.Where(r => r.ProjectId.HasValue).Select(r => r.ProjectId!.Value).ToList();
        var projects = projectIds.Count == 0
            ? new Dictionary<Guid, string>()
            : (await _projectRepo.GetListAsync(p => projectIds.Contains(p.Id))).ToDictionary(p => p.Id, p => p.Name);

        // Katalog host'ta (TenantId=null) durur; danışman adları host kullanıcılarıdır.
        var callIds = rows.Select(r => r.GrantCallId)
            .Concat(interests.Where(i => i.GrantCallId != null).Select(i => i.GrantCallId!.Value))
            .Distinct().ToList();
        Dictionary<Guid, GrantCall> calls;
        Dictionary<Guid, Grant> grants;
        Dictionary<Guid, string> hostUsers;
        using (_mtFilter.Disable())
        {
            calls = (await _callRepo.GetListAsync(c => callIds.Contains(c.Id) && c.TenantId == null)).ToDictionary(c => c.Id);
            var grantIds = calls.Values.Select(c => c.GrantId).Distinct().ToList();
            grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id) && g.TenantId == null)).ToDictionary(g => g.Id);
            var reviewerIds = interests.Where(i => i.ReviewedByUserId.HasValue).Select(i => i.ReviewedByUserId!.Value).Distinct().ToList();
            hostUsers = reviewerIds.Count == 0
                ? new Dictionary<Guid, string>()
                : (await _userRepo.GetListByIdsAsync(reviewerIds)).ToDictionary(u => u.Id, DisplayName);
        }

        // --- Başvurular ---
        foreach (var row in rows)
        {
            var application = applications.GetValueOrDefault(row.Id);
            var call = calls.GetValueOrDefault(row.GrantCallId);
            var docs = documents.GetValueOrDefault(row.Id, new List<GrantApplicationDocument>());
            var appTranches = tranches.GetValueOrDefault(row.Id, new List<GrantDisbursementTranche>());
            var nextTranche = appTranches
                .Where(t => t.Status != GrantDisbursementTrancheStatus.Odendi)
                .OrderBy(t => t.SequenceNo)
                .FirstOrDefault();

            var item = new GrantJourneyItemDto
            {
                GrantCallId = row.GrantCallId,
                GrantName = row.GrantName,
                Issuer = row.Issuer,
                Period = row.Period,
                Deadline = row.Deadline,
                DaysRemaining = row.DaysRemaining,
                At = row.SubmittedAt ?? application?.AppliedDate ?? application?.CreationTime ?? Clock.Now,
                ApplicationId = row.Id,
                StageName = row.StageName,
                Stage = row.Stage,
                NextAction = row.NextAction,
                NextActionValue = row.NextActionValue,
                ConsultantName = row.AssignedUserName,
                DocumentsApproved = docs.Count(d => d.Status == GrantDocumentStatus.Onaylandi),
                DocumentsTotal = docs.Count,
                AppealDaysLeft = row.AppealDaysLeft,
                ProjectId = row.ProjectId,
                ProjectName = row.ProjectId.HasValue ? projects.GetValueOrDefault(row.ProjectId.Value) : null,
                ApprovedAmount = row.IsApprovedAmount ? row.Amount : null,
                CollectedAmount = row.CollectedAmount,
                NextTrancheNo = nextTranche?.SequenceNo,
                NextTrancheAmount = nextTranche?.Amount,
                NextTrancheDue = nextTranche?.DueDate
            };

            item.Kind = row.ProjectId.HasValue ? GrantJourneyItemKind.Project
                : row.Stage == GrantApplicationStage.Odeme ? GrantJourneyItemKind.Completed
                : row.IsRejected ? GrantJourneyItemKind.ApplicationRejected
                : row.SubmittedAt.HasValue ? GrantJourneyItemKind.ApplicationWithInstitution
                : call?.Status == GrantCallStatus.Kapandi ? GrantJourneyItemKind.CallClosed
                : GrantJourneyItemKind.ApplicationOpen;

            if (item.ApprovedAmount.HasValue)
            {
                dto.WonAmount += item.ApprovedAmount.Value;
            }

            dto.Items.Add(item);
        }

        // --- İlgi talepleri: başvurusu olan çağrı atlanır, çağrı başına en yeni talep ---
        var coveredCalls = rows.Select(r => r.GrantCallId).ToHashSet();
        foreach (var interest in interests
                     .Where(i => i.GrantCallId != null && !coveredCalls.Contains(i.GrantCallId.Value))
                     .GroupBy(i => i.GrantCallId!.Value)
                     .Select(g => g.OrderByDescending(i => i.CreationTime).First()))
        {
            var call = calls.GetValueOrDefault(interest.GrantCallId!.Value);
            var grant = call == null ? null : grants.GetValueOrDefault(call.GrantId);
            var closed = call?.Status == GrantCallStatus.Kapandi;

            var kind = interest.Status switch
            {
                GrantInterestStatus.UygunDegil => GrantJourneyItemKind.InterestRejected,
                GrantInterestStatus.GeriCekildi => GrantJourneyItemKind.InterestWithdrawn,
                GrantInterestStatus.Kacirildi => GrantJourneyItemKind.CallClosed,
                _ when closed => GrantJourneyItemKind.CallClosed,
                _ => GrantJourneyItemKind.InterestPending
            };

            dto.Items.Add(new GrantJourneyItemDto
            {
                Kind = kind,
                GrantCallId = interest.GrantCallId,
                GrantName = grant?.Name ?? "—",
                Issuer = grant?.Issuer,
                Period = call?.Period,
                Deadline = call?.Deadline,
                DaysRemaining = call?.Deadline == null ? null : (int)(call.Deadline.Value.Date - today).TotalDays,
                At = interest.WithdrawnAt ?? interest.ReviewedAt ?? interest.CreationTime,
                InterestId = interest.Id,
                ReviewerName = interest.ReviewedByUserId.HasValue ? hostUsers.GetValueOrDefault(interest.ReviewedByUserId.Value) : null,
                HostFeedback = interest.HostFeedback,
                Meeting = kind == GrantJourneyItemKind.InterestPending && meetings.TryGetValue(interest.Id, out var meeting)
                    ? GrantMeetingMapping.ToDto(meeting)
                    : null
            });
        }

        // --- 19a · Havuzdaki fikirler: her fikir ayrı satır. Geri çekilen fikir yolculuktan düşer —
        // çağrısı olmadığı için "çağrıyı gör" diyecek bir yeri de yok.
        foreach (var idea in interests.Where(i => i.IsPoolIdea && i.IsPending))
        {
            dto.Items.Add(new GrantJourneyItemDto
            {
                Kind = GrantJourneyItemKind.IdeaPooled,
                GrantName = string.Empty,
                At = idea.CreationTime,
                InterestId = idea.Id,
                Idea = idea.Note,
                IdeaSource = idea.Source
            });
        }

        dto.ActiveCount = dto.Items.Count(IsActive);
        dto.ProjectCount = dto.Items.Count(i => i.Kind == GrantJourneyItemKind.Project);
        dto.MissedCount = dto.Items.Count(i => i.Kind == GrantJourneyItemKind.CallClosed);

        // Süren işler önce (son tarihi yakın olan başta), sonra projeler, en sonda kapananlar.
        dto.Items = dto.Items
            // Havuzdaki fikir süreç sayılmaz ama bekleyen iştir: aktiflerin ardında (son tarihi yok).
            .OrderBy(i => IsActive(i) || i.Kind == GrantJourneyItemKind.IdeaPooled ? 0 : i.Kind is GrantJourneyItemKind.Project or GrantJourneyItemKind.Completed ? 1 : 2)
            .ThenBy(i => IsActive(i) ? i.DaysRemaining ?? int.MaxValue : 0)
            .ThenByDescending(i => i.At)
            .ToList();

        return dto;
    }

    private static bool IsActive(GrantJourneyItemDto item)
        => item.Kind is GrantJourneyItemKind.InterestPending
                or GrantJourneyItemKind.ApplicationOpen
                or GrantJourneyItemKind.ApplicationWithInstitution
           || (item.Kind == GrantJourneyItemKind.ApplicationRejected && item.AppealDaysLeft.HasValue);

    private static string DisplayName(IdentityUser user)
    {
        var full = $"{user.Name} {user.Surname}".Trim();
        return full.IsNullOrWhiteSpace() ? user.UserName : full;
    }
}
