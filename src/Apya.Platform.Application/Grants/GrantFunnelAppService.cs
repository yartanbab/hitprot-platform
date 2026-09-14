using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 18c · Host · Çağrı dönüşüm hunisi: görüntülenme → uygunluk testi → ilgi → görüşme → başvuru → onay.
///
/// <para>Görüntülenme dışındaki aşamalar yeni kayıt tutmaz; talepler, ilgi talepleri ve başvurular sayılır.
/// İlgi ve başvuru kiracılarda durduğu için sayım kiracı süzgeci kapalı ve çağrı kimliğiyle yapılır
/// (çağrı host'undur, kimliği tekildir).</para>
///
/// <para>Yetki yöntem başınadır: ABP sınıf ve yöntem yetkisini BİRLİKTE arar; sınıfa düzenleme izni konsaydı
/// kiracının görüntülenme sayımı da onu isterdi.</para>
/// </summary>
public class GrantFunnelAppService : PlatformAppService, IGrantFunnelAppService
{
    private static readonly int[] AllowedWindows = { 30, 60, 90 };

    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IGrantCallDailyStatRepository _statRepository;
    private readonly IRepository<GrantLead, Guid> _leadRepository;
    private readonly IRepository<GrantInterest, Guid> _interestRepository;
    private readonly IRepository<GrantApplication, Guid> _applicationRepository;
    private readonly GrantCallViewRecorder _viewRecorder;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;

    public GrantFunnelAppService(
        IRepository<GrantCall, Guid> callRepository,
        IRepository<Grant, Guid> grantRepository,
        IGrantCallDailyStatRepository statRepository,
        IRepository<GrantLead, Guid> leadRepository,
        IRepository<GrantInterest, Guid> interestRepository,
        IRepository<GrantApplication, Guid> applicationRepository,
        GrantCallViewRecorder viewRecorder,
        IDataFilter<IMultiTenant> multiTenantFilter)
    {
        _callRepository = callRepository;
        _grantRepository = grantRepository;
        _statRepository = statRepository;
        _leadRepository = leadRepository;
        _interestRepository = interestRepository;
        _applicationRepository = applicationRepository;
        _viewRecorder = viewRecorder;
        _multiTenantFilter = multiTenantFilter;
    }

    [Authorize(PlatformPermissions.Grants.Edit)]
    public async Task<List<GrantFunnelCallDto>> GetCallsAsync()
    {
        EnsureHostContext();

        var calls = await _callRepository.GetListAsync(c => c.TenantId == null);
        var grants = await GrantsOfAsync(calls);

        return calls
            .Where(c => grants.ContainsKey(c.GrantId))
            .OrderBy(c => c.Status == GrantCallStatus.Acik ? 0 : c.Status == GrantCallStatus.Planlandi ? 1 : 2)
            .ThenBy(c => c.Deadline ?? DateTime.MaxValue)
            .Select(c => new GrantFunnelCallDto { Id = c.Id, Label = LabelOf(grants[c.GrantId], c), Status = c.Status })
            .ToList();
    }

    [Authorize(PlatformPermissions.Grants.Edit)]
    public async Task<GrantFunnelDto> GetAsync(Guid callId, int days = 60)
    {
        EnsureHostContext();

        var call = await _callRepository.GetAsync(c => c.Id == callId && c.TenantId == null);
        var grant = await _grantRepository.GetAsync(call.GrantId);
        var window = AllowedWindows.Contains(days) ? days : 60;
        var since = Clock.Now.Date.AddDays(-(window - 1));

        var dto = new GrantFunnelDto { CallId = call.Id, CallLabel = LabelOf(grant, call), Days = window };

        var stats = await _statRepository.GetListAsync(s => s.GrantCallId == callId && s.Day >= since);
        dto.PublicViews = stats.Where(s => s.Kind == GrantCallStatKind.PublicView).Sum(s => s.Count);
        dto.TenantViews = stats.Where(s => s.Kind == GrantCallStatKind.TenantView).Sum(s => s.Count);

        var leads = await _leadRepository.GetListAsync(l => l.GrantCallId == callId && l.CreationTime >= since);
        dto.Tests = leads.Count;

        using (_multiTenantFilter.Disable())
        {
            var interests = await _interestRepository.GetListAsync(i => i.GrantCallId == callId && i.CreationTime >= since);
            dto.Interests = interests.Count;

            // Görüşme: firmayla temas kuruldu. pargetto'da randevu tercihi bırakılan ya da randevusu verilen talep,
            // platformda danışmanın üstlendiği (inceleme ya da başvuru aşamasına geçen) ilgi talebi.
            dto.Meetings = leads.Count(l => l.PreferredMeetingAt != null
                                            || l.Status is GrantLeadStatus.RandevuVerildi or GrantLeadStatus.MusteriOldu)
                           + interests.Count(i => i.Status is GrantInterestStatus.Inceleniyor or GrantInterestStatus.BasvuruAcildi);

            var applications = await _applicationRepository.GetListAsync(a => a.GrantCallId == callId && a.CreationTime >= since);
            dto.Applications = applications.Count;
            dto.Approved = applications.Count(a => a.Stage is GrantApplicationStage.Onay or GrantApplicationStage.Odeme);
        }

        return dto;
    }

    [AllowAnonymous]
    [RemoteService(IsEnabled = false)]
    public Task RecordPublicViewAsync(Guid callId)
        => _viewRecorder.RecordAsync(callId, GrantCallStatKind.PublicView);

    [Authorize(PlatformPermissions.Grants.Default)]
    [RemoteService(IsEnabled = false)]
    public async Task RecordTenantViewAsync(Guid callId)
    {
        // Host kullanıcısının bakışı firmadan gelen ilgi değildir.
        if (CurrentTenant.Id is null)
        {
            return;
        }

        await _viewRecorder.RecordAsync(callId, GrantCallStatKind.TenantView);
    }

    private async Task<Dictionary<Guid, Grant>> GrantsOfAsync(List<GrantCall> calls)
    {
        var ids = calls.Select(c => c.GrantId).Distinct().ToList();
        return (await _grantRepository.GetListAsync(g => ids.Contains(g.Id))).ToDictionary(g => g.Id);
    }

    private static string LabelOf(Grant grant, GrantCall call) => $"{grant.Issuer} · {grant.Name} ({call.Period})";

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Bu işlem yalnızca host bağlamında yapılabilir.");
        }
    }
}
