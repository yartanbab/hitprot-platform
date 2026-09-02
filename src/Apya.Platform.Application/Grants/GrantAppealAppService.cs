using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Users;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 6b · Red &amp; İtiraz.
///
/// <para>İKİ TARAF, TEK SERVİS: firma kararı ve görüşleri OKUR, danışman yazar.
/// Rol <see cref="ICurrentTenant"/>'tan türetilir; istemciden gelmez.</para>
///
/// <para>🔴 İstatistik GERÇEK kararlardan hesaplanır ve örneklem küçükse
/// GÖSTERİLMEZ. Üç karardan çıkan "%28 kabul oranı" güven veriyormuş gibi durup
/// yanlış yönlendirir.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantAppealAppService : PlatformAppService, IGrantAppealAppService
{
    /// <summary>Bu sayıdan az karar varsa oran gösterilmez.</summary>
    public const int MinimumStatsSample = 5;

    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantDecision, Guid> _decisionRepo;
    private readonly IRepository<GrantAppealItem, Guid> _itemRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly GrantNotificationDispatcher _notifyDispatcher;

    public GrantAppealAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantDecision, Guid> decisionRepo,
        IRepository<GrantAppealItem, Guid> itemRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        ICurrentTenant currentTenant,
        IDataFilter<IMultiTenant> mtFilter,
        GrantNotificationDispatcher notifyDispatcher)
    {
        _appRepo = appRepo;
        _decisionRepo = decisionRepo;
        _itemRepo = itemRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _currentTenant = currentTenant;
        _mtFilter = mtFilter;
        _notifyDispatcher = notifyDispatcher;
    }

    private bool IsConsultant => _currentTenant.Id == null;

    private string ActorName =>
        CurrentUser.Name.IsNullOrWhiteSpace()
            ? (CurrentUser.UserName ?? "?")
            : $"{CurrentUser.Name} {CurrentUser.SurName}".Trim();

    public async Task<GrantAppealConsoleDto> GetAsync(Guid applicationId)
    {
        var application = await GetApplicationAsync(applicationId);
        return await BuildAsync(application);
    }

    public async Task<GrantAppealConsoleDto> SaveDecisionAsync(SaveGrantDecisionInput input)
    {
        EnsureConsultant();
        var application = await GetApplicationAsync(input.ApplicationId);

        var decision = await FindDecisionAsync(application.Id);
        if (decision == null)
        {
            decision = new GrantDecision(
                GuidGenerator.Create(), application.TenantId, application.Id,
                input.Outcome, input.DecidedOn, input.ReferenceNo, input.AppealDeadline);
            await _decisionRepo.InsertAsync(decision, autoSave: true);
        }
        else
        {
            decision.Update(input.Outcome, input.DecidedOn, input.ReferenceNo, input.AppealDeadline);
            await _decisionRepo.UpdateAsync(decision, autoSave: true);
        }

        await NotifyDecisionAsync(application, decision);

        return await BuildAsync(application);
    }

    /// <summary>
    /// 6d · Kurum kararını firmaya duyurur. Bu tetikleyici ZORUNLUDUR: kullanıcı
    /// hibe bildirimlerini kapatmış olsa bile üretilir, çünkü kaçırılması doğrudan
    /// itiraz hakkının kaybı demektir (bkz. <c>NotificationTypeInfo.Mandatory</c>).
    /// </summary>
    private async Task NotifyDecisionAsync(GrantApplication application, GrantDecision decision)
    {
        string? grantName;
        using (_mtFilter.Disable())
        {
            var call = await _callRepo.FirstOrDefaultAsync(
                c => c.Id == application.GrantCallId && c.TenantId == null);
            grantName = call == null
                ? null
                : (await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null))?.Name;
        }

        // İtiraz penceresi TEK cümle olarak taşınır: onay kararında pencere yoktur ve
        // ayrı tarih/gün değişkenleri kalsaydı gövde yarım cümleyle giderdi.
        var appealInfo = decision.Outcome == GrantDecisionOutcome.Reddedildi && decision.AppealDeadline.HasValue
            ? L["Grants:Notify:AppealWindow",
                decision.AppealDeadline!.Value.ToString("dd.MM.yyyy"),
                Math.Max(0, (decision.AppealDeadline.Value.Date - Clock.Now.Date).Days)].Value
            : null;

        await _notifyDispatcher.DispatchToTenantAsync(
            GrantNotificationTrigger.DecisionIssued,
            application.TenantId,
            new Dictionary<string, string?>
            {
                ["{çağrı_adı}"] = grantName,
                ["{karar}"] = L[$"Grants:Notify:Decision:{decision.Outcome}"].Value,
                ["{itiraz_bilgisi}"] = appealInfo
            },
            nameof(GrantApplication), application.Id);
    }

    public async Task<GrantAppealConsoleDto> AddItemAsync(AddGrantAppealItemInput input)
    {
        EnsureConsultant();
        var application = await GetApplicationAsync(input.ApplicationId);
        var decision = await FindDecisionAsync(application.Id)
                       ?? throw new BusinessException(PlatformDomainErrorCodes.GrantDecisionNotFound);

        var existing = await GetItemsAsync(decision.Id);
        await _itemRepo.InsertAsync(new GrantAppealItem(
            GuidGenerator.Create(), application.TenantId, decision.Id,
            existing.Count == 0 ? 1 : existing.Max(i => i.Order) + 1,
            input.Title, input.InstitutionText), autoSave: true);

        return await BuildAsync(application);
    }

    public async Task<GrantAppealConsoleDto> SaveOpinionAsync(SaveGrantAppealOpinionInput input)
    {
        EnsureConsultant();
        var item = await GetItemAsync(input.ItemId);
        var decision = await GetDecisionAsync(item.DecisionId);
        var application = await GetApplicationAsync(decision.GrantApplicationId);

        item.SetOpinion(input.Stance, input.Summary, input.Detail, ActorName);
        await _itemRepo.UpdateAsync(item, autoSave: true);

        return await BuildAsync(application);
    }

    public async Task<GrantAppealConsoleDto> SubmitAppealAsync(Guid applicationId)
    {
        var application = await GetApplicationAsync(applicationId);
        var decision = await FindDecisionAsync(application.Id)
                       ?? throw new BusinessException(PlatformDomainErrorCodes.GrantDecisionNotFound);

        var items = await GetItemsAsync(decision.Id);
        if (items.All(i => i.Stance != GrantAppealStance.Itiraz))
        {
            // İtiraza konu tek madde yoksa dosya boş gider; kurum nezdinde
            // güvenilirliği zedeler.
            throw new BusinessException(PlatformDomainErrorCodes.GrantAppealNoItems);
        }

        decision.SubmitAppeal(Clock.Now);
        await _decisionRepo.UpdateAsync(decision, autoSave: true);

        return await BuildAsync(application);
    }

    public async Task<GrantAppealConsoleDto> ResolveAppealAsync(Guid applicationId, bool accepted)
    {
        EnsureConsultant();
        var application = await GetApplicationAsync(applicationId);
        var decision = await FindDecisionAsync(application.Id)
                       ?? throw new BusinessException(PlatformDomainErrorCodes.GrantDecisionNotFound);

        decision.ResolveAppeal(accepted);
        await _decisionRepo.UpdateAsync(decision, autoSave: true);

        return await BuildAsync(application);
    }

    // ------------------------------------------------------------------ yardımcılar

    private void EnsureConsultant()
    {
        if (!IsConsultant)
        {
            // Karar ve görüş yazmak danışmanın işi; firma yalnız okur ve itirazı gönderir.
            throw new AbpAuthorizationException();
        }
    }

    private async Task<GrantApplication> GetApplicationAsync(Guid id)
    {
        if (IsConsultant)
        {
            using (_mtFilter.Disable())
            {
                return await _appRepo.FirstOrDefaultAsync(a => a.Id == id)
                       ?? throw new EntityNotFoundException(typeof(GrantApplication), id);
            }
        }

        return await _appRepo.FirstOrDefaultAsync(a => a.Id == id)
               ?? throw new EntityNotFoundException(typeof(GrantApplication), id);
    }

    private async Task<GrantDecision?> FindDecisionAsync(Guid applicationId)
    {
        if (IsConsultant)
        {
            using (_mtFilter.Disable())
            {
                return await _decisionRepo.FirstOrDefaultAsync(d => d.GrantApplicationId == applicationId);
            }
        }
        return await _decisionRepo.FirstOrDefaultAsync(d => d.GrantApplicationId == applicationId);
    }

    private async Task<GrantDecision> GetDecisionAsync(Guid id)
    {
        using (_mtFilter.Disable())
        {
            return await _decisionRepo.FirstOrDefaultAsync(d => d.Id == id)
                   ?? throw new EntityNotFoundException(typeof(GrantDecision), id);
        }
    }

    private async Task<GrantAppealItem> GetItemAsync(Guid id)
    {
        using (_mtFilter.Disable())
        {
            return await _itemRepo.FirstOrDefaultAsync(i => i.Id == id)
                   ?? throw new EntityNotFoundException(typeof(GrantAppealItem), id);
        }
    }

    private async Task<List<GrantAppealItem>> GetItemsAsync(Guid decisionId)
    {
        if (IsConsultant)
        {
            using (_mtFilter.Disable())
            {
                return (await _itemRepo.GetListAsync(i => i.DecisionId == decisionId))
                    .OrderBy(i => i.Order).ToList();
            }
        }
        return (await _itemRepo.GetListAsync(i => i.DecisionId == decisionId))
            .OrderBy(i => i.Order).ToList();
    }

    private async Task<GrantAppealConsoleDto> BuildAsync(GrantApplication application)
    {
        var today = Clock.Now.Date;
        var dto = new GrantAppealConsoleDto
        {
            ApplicationId = application.Id,
            CanEditOpinion = IsConsultant
        };

        GrantCall call;
        Grant grant;
        using (_mtFilter.Disable())
        {
            call = await _callRepo.FirstOrDefaultAsync(
                       c => c.Id == application.GrantCallId && c.TenantId == null)
                   ?? throw new EntityNotFoundException(typeof(GrantCall), application.GrantCallId);
            grant = await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null)
                    ?? throw new EntityNotFoundException(typeof(Grant), call.GrantId);

            // "Bir daha denemek için": aynı programın AÇIK bir sonraki çağrısı.
            var next = (await _callRepo.GetListAsync(
                    c => c.GrantId == grant.Id && c.TenantId == null
                         && c.Id != call.Id && c.Status == GrantCallStatus.Acik))
                .OrderBy(c => c.Deadline ?? DateTime.MaxValue)
                .FirstOrDefault();
            if (next != null)
            {
                dto.NextCallId = next.Id;
                dto.NextCallPeriod = next.Period;
                dto.NextCallDeadline = next.Deadline;
            }
        }

        dto.GrantName = grant.Name;
        dto.Issuer = grant.Issuer;
        dto.Period = call.Period;

        var decision = await FindDecisionAsync(application.Id);
        if (decision == null)
        {
            dto.Stats = await BuildStatsAsync(grant.Id);
            return dto;
        }

        dto.DecisionId = decision.Id;
        dto.Outcome = decision.Outcome;
        dto.DecidedOn = decision.DecidedOn;
        dto.ReferenceNo = decision.ReferenceNo;
        dto.AppealDeadline = decision.AppealDeadline;
        dto.AppealSubmittedAt = decision.AppealSubmittedAt;
        dto.AppealAccepted = decision.AppealAccepted;
        dto.IsAppealWindowOpen = decision.IsAppealWindowOpen(today);
        dto.AppealDaysLeft = decision.AppealDeadline.HasValue && dto.IsAppealWindowOpen
            ? (int)(decision.AppealDeadline.Value.Date - today).TotalDays
            : null;

        var items = await GetItemsAsync(decision.Id);
        dto.Items = items.Select(i => new GrantAppealItemDto
        {
            Id = i.Id,
            Order = i.Order,
            Title = i.Title,
            InstitutionText = i.InstitutionText,
            OpinionSummary = i.OpinionSummary,
            OpinionDetail = i.OpinionDetail,
            Stance = i.Stance,
            OpinionByName = i.OpinionByName
        }).ToList();

        dto.AppealedCount = items.Count(i => i.Stance == GrantAppealStance.Itiraz);
        dto.AcceptedCount = items.Count(i => i.Stance == GrantAppealStance.Kabul);
        dto.Stats = await BuildStatsAsync(grant.Id);

        return dto;
    }

    /// <summary>
    /// Programın itiraz istatistiği — kiracılar arası GERÇEK kararlardan. Örneklem
    /// <see cref="MinimumStatsSample"/> altındaysa oran döndürülmez.
    /// </summary>
    private async Task<GrantAppealStatsDto> BuildStatsAsync(Guid grantId)
    {
        var stats = new GrantAppealStatsDto();

        using (_mtFilter.Disable())
        {
            var callIds = (await _callRepo.GetListAsync(c => c.GrantId == grantId && c.TenantId == null))
                .Select(c => c.Id).ToList();
            if (callIds.Count == 0) { return stats; }

            var applicationIds = (await _appRepo.GetListAsync(a => callIds.Contains(a.GrantCallId)))
                .Select(a => a.Id).ToList();
            if (applicationIds.Count == 0) { return stats; }

            var decisions = (await _decisionRepo.GetListAsync(d => applicationIds.Contains(d.GrantApplicationId)))
                .Where(d => d.Outcome == GrantDecisionOutcome.Reddedildi)
                .ToList();

            stats.SampleSize = decisions.Count;
            if (decisions.Count < MinimumStatsSample) { return stats; }

            var appealed = decisions.Where(d => d.AppealSubmittedAt.HasValue).ToList();
            stats.HasEnoughData = true;
            stats.AppealRatePercent = (int)Math.Round(appealed.Count * 100.0 / decisions.Count);

            var resolved = appealed.Where(d => d.AppealAccepted.HasValue).ToList();
            stats.AcceptanceRatePercent = resolved.Count == 0
                ? null
                : (int)Math.Round(resolved.Count(d => d.AppealAccepted!.Value) * 100.0 / resolved.Count);
        }

        return stats;
    }
}
