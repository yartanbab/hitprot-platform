using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 22b · Host "Talepler". Yalnız okur: kararlar İlgi inceleme ve Ön değerlendirme ekranlarında.
///
/// <para>🔴 Filtre BİLEREK kapalı okunur: ilgi talepleri kiracılara aittir ve kutu hepsine
/// bakar (emsal: pipeline panosu). Yazma yok, yanlış kiracıya kayıt düşürme riski doğmaz.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantRequestAppService : PlatformAppService, IGrantRequestAppService
{
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly IRepository<GrantLead, Guid> _leadRepo;
    private readonly IRepository<GrantMeetingProposal, Guid> _proposalRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantRequestAppService(
        IRepository<GrantInterest, Guid> interestRepo,
        IRepository<GrantLead, Guid> leadRepo,
        IRepository<GrantMeetingProposal, Guid> proposalRepo,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        ITenantRepository tenantRepo,
        IIdentityUserRepository userRepo,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _interestRepo = interestRepo;
        _leadRepo = leadRepo;
        _proposalRepo = proposalRepo;
        _appRepo = appRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _tenantRepo = tenantRepo;
        _userRepo = userRepo;
        _mtFilter = mtFilter;
    }

    public async Task<GrantRequestInboxDto> GetInboxAsync(GetGrantRequestInboxInput input)
    {
        EnsureHostContext();

        var now = Clock.Now;
        var rows = await BuildRowsAsync(now);
        var open = rows.Where(r => r.Response != GrantResponseState.Closed).ToList();
        var dueSoon = open.Where(r => r.Response is GrantResponseState.DueSoon or GrantResponseState.Overdue).ToList();

        var dto = new GrantRequestInboxDto
        {
            PendingCount = open.Count,
            RunningCount = await CountRunningAsync(),
            DueSoonCount = dueSoon.Count,
            DueSoonByConsultant = dueSoon
                .GroupBy(r => r.ConsultantName)
                .Select(g => new GrantRequestConsultantCountDto { Name = g.Key, Count = g.Count() })
                .OrderByDescending(c => c.Count)
                .ThenBy(c => c.Name)
                .ToList(),
            Consultants = open
                .Where(r => r.ConsultantUserId.HasValue)
                .GroupBy(r => r.ConsultantUserId!.Value)
                .Select(g => new GrantRequestOptionDto { Id = g.Key, Name = g.First().ConsultantName ?? string.Empty })
                .OrderBy(o => o.Name)
                .ToList(),
            Calls = rows
                .GroupBy(r => r.GrantCallId)
                .Select(g => new GrantRequestOptionDto { Id = g.Key, Name = CallLabel(g.First()) })
                .OrderBy(o => o.Name)
                .ToList()
        };

        var filtered = rows
            .Where(r => input.Closed == (r.Response == GrantResponseState.Closed))
            .Where(r => input.ConsultantUserId == null || r.ConsultantUserId == input.ConsultantUserId)
            .Where(r => input.GrantCallId == null || r.GrantCallId == input.GrantCallId)
            .ToList();

        // Açıkta yanıtlanmamışlar önce ve en acil üstte, yanıtlananlar geliş sırasıyla.
        // Kapanmışta en yeni üstte.
        dto.Items = input.Closed
            ? filtered.OrderByDescending(r => r.CreationTime).ToList()
            : filtered
                .OrderBy(r => IsUnanswered(r) ? 0 : 1)
                .ThenBy(r => IsUnanswered(r) ? r.RespondBy : r.CreationTime)
                .ToList();

        return dto;
    }

    public async Task<GrantRequestTabCountsDto> GetTabCountsAsync()
    {
        EnsureHostContext();

        var rows = await BuildRowsAsync(Clock.Now);
        return new GrantRequestTabCountsDto
        {
            PendingCount = rows.Count(r => r.Response != GrantResponseState.Closed),
            RunningCount = await CountRunningAsync()
        };
    }

    private async Task<List<GrantRequestRowDto>> BuildRowsAsync(DateTime now)
    {
        // Katalog host bağlamında okunur (çağrı ve program adı).
        var calls = (await _callRepo.GetListAsync(c => c.TenantId == null)).ToDictionary(c => c.Id);
        var grants = (await _grantRepo.GetListAsync(g => g.TenantId == null)).ToDictionary(g => g.Id, g => g.Name);
        var tenants = (await _tenantRepo.GetListAsync()).ToDictionary(t => t.Id, t => t.Name);
        var hostUsers = (await _userRepo.GetListAsync()).ToDictionary(u => u.Id, DisplayName);

        List<GrantInterest> interests;
        HashSet<Guid> plannedMeetings;
        using (_mtFilter.Disable())
        {
            // 19a · Havuz fikri talep değildir (yanıt süresi yok); Fikir Havuzu ekranında yaşar.
            interests = await _interestRepo.GetListAsync(i => i.TenantId != null && i.GrantCallId != null);
            var interestIds = interests.Select(i => i.Id).ToList();
            plannedMeetings = (await _proposalRepo.GetListAsync(
                    p => p.Status == GrantMeetingStatus.Onaylandi && interestIds.Contains(p.GrantInterestId)))
                .Select(p => p.GrantInterestId)
                .ToHashSet();
        }

        var leads = await _leadRepo.GetListAsync();
        var rows = new List<GrantRequestRowDto>();

        foreach (var interest in interests)
        {
            var consultantId = interest.AssignedUserId ?? interest.ReviewedByUserId;
            var row = NewRow(GrantRequestKind.Interest, interest.Id, interest.GrantCallId!.Value, interest.CreationTime, calls, grants);
            row.FirmName = tenants.GetValueOrDefault(interest.TenantId!.Value, string.Empty);
            row.Summary = interest.Note;
            row.ConsultantUserId = consultantId;
            row.ConsultantName = consultantId.HasValue ? hostUsers.GetValueOrDefault(consultantId.Value) : null;
            row.Response = interest.Status switch
            {
                GrantInterestStatus.Yeni => GrantResponseDeadline.StateOf(row.RespondBy, now),
                GrantInterestStatus.Inceleniyor => plannedMeetings.Contains(interest.Id)
                    ? GrantResponseState.MeetingPlanned
                    : GrantResponseState.Answered,
                _ => GrantResponseState.Closed
            };
            rows.Add(Finish(row, now));
        }

        foreach (var lead in leads)
        {
            var row = NewRow(GrantRequestKind.Lead, lead.Id, lead.GrantCallId, lead.CreationTime, calls, grants);
            row.FirmName = lead.FirmName;
            row.Summary = lead.ContactName;
            // 🔴 "Randevu verildi" ziyaretçinin saat TERCİHİYLE de atanır (5b) — danışmanın
            // yanıtı değildir. Yanıt sayılan tek durum host'un işaretlediği "Arandı".
            row.Response = lead.Status switch
            {
                GrantLeadStatus.Yeni or GrantLeadStatus.RandevuVerildi => GrantResponseDeadline.StateOf(row.RespondBy, now),
                GrantLeadStatus.Arandi => GrantResponseState.Answered,
                _ => GrantResponseState.Closed
            };
            rows.Add(Finish(row, now));
        }

        return rows;
    }

    private static GrantRequestRowDto NewRow(
        GrantRequestKind kind, Guid id, Guid callId, DateTime createdAt,
        Dictionary<Guid, GrantCall> calls, Dictionary<Guid, string> grants)
    {
        var call = calls.GetValueOrDefault(callId);
        return new GrantRequestRowDto
        {
            Kind = kind,
            Id = id,
            GrantCallId = callId,
            GrantName = call == null ? string.Empty : grants.GetValueOrDefault(call.GrantId, string.Empty),
            Period = call?.Period,
            CreationTime = createdAt,
            RespondBy = GrantResponseDeadline.For(createdAt)
        };
    }

    private static GrantRequestRowDto Finish(GrantRequestRowDto row, DateTime now)
    {
        row.HoursLeft = IsUnanswered(row) ? GrantResponseDeadline.HoursLeft(row.RespondBy, now) : null;
        return row;
    }

    private static bool IsUnanswered(GrantRequestRowDto row)
        => row.Response is GrantResponseState.Waiting or GrantResponseState.DueSoon or GrantResponseState.Overdue;

    private static string CallLabel(GrantRequestRowDto row)
        => string.IsNullOrWhiteSpace(row.Period) ? row.GrantName : $"{row.GrantName} · {row.Period}";

    /// <summary>Panonun varsayılan görünümüyle aynı küme: açık çağrılardaki başvurular.</summary>
    private async Task<int> CountRunningAsync()
    {
        var openCallIds = (await _callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik && c.TenantId == null))
            .Select(c => c.Id)
            .ToList();
        if (openCallIds.Count == 0)
        {
            return 0;
        }

        using (_mtFilter.Disable())
        {
            return (int)await _appRepo.CountAsync(a => openCallIds.Contains(a.GrantCallId));
        }
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
