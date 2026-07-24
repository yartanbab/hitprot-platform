using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Emailing;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// Host'un bir çağrıyı hedefli firmalara toplu göndermesi (B3). Yalnız host bağlamında
/// çalışır — tenant'lar arası veri okuma/yazma <see cref="ICurrentTenant.Change"/> ile yapılır.
/// </summary>
[Authorize(PlatformPermissions.Grants.Create)]
public class GrantHostDispatchAppService : ApplicationService, IGrantHostDispatchAppService
{
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<GrantRecommendation, Guid> _recRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly FirmSignalsBuilder _signalsBuilder;
    private readonly GrantMatchManager _matcher;
    private readonly ICurrentTenant _currentTenant;
    private readonly NotificationManager _notificationManager;
    private readonly IEmailSender _emailSender;

    public GrantHostDispatchAppService(
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        IRepository<GrantRecommendation, Guid> recRepo,
        ITenantRepository tenantRepo,
        IIdentityUserRepository userRepo,
        FirmSignalsBuilder signalsBuilder,
        GrantMatchManager matcher,
        ICurrentTenant currentTenant,
        NotificationManager notificationManager,
        IEmailSender emailSender)
    {
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _criteriaRepo = criteriaRepo;
        _recRepo = recRepo;
        _tenantRepo = tenantRepo;
        _userRepo = userRepo;
        _signalsBuilder = signalsBuilder;
        _matcher = matcher;
        _currentTenant = currentTenant;
        _notificationManager = notificationManager;
        _emailSender = emailSender;
    }

    public async Task<List<HostRecommendationCandidateDto>> PreviewAsync(PreviewHostRecommendationInput input)
    {
        EnsureHostContext();

        var call = await _callRepo.GetAsync(input.GrantCallId);
        var grant = await _grantRepo.GetAsync(call.GrantId);
        var tags = await _criteriaRepo.GetListAsync(t => t.GrantId == grant.Id);

        var tenants = await _tenantRepo.GetListAsync();
        var result = new List<HostRecommendationCandidateDto>();
        foreach (var tenant in tenants)
        {
            var signals = await _signalsBuilder.BuildAsync(tenant.Id);

            if (input.Sizes.HasValue && signals.Size.HasValue && ((int)signals.Size.Value & input.Sizes.Value) == 0)
            {
                continue;
            }
            if (input.BudgetMin.HasValue && (signals.TypicalProjectBudget == null || signals.TypicalProjectBudget < input.BudgetMin))
            {
                continue;
            }
            if (input.BudgetMax.HasValue && (signals.TypicalProjectBudget == null || signals.TypicalProjectBudget > input.BudgetMax))
            {
                continue;
            }
            if (input.Category.HasValue && signals.DominantCategory != input.Category)
            {
                continue;
            }

            var score = _matcher.Score(signals, grant, tags);
            if (score < input.MinScore)
            {
                continue;
            }

            result.Add(new HostRecommendationCandidateDto { TenantId = tenant.Id, TenantName = tenant.Name, Score = score });
        }

        return result.OrderByDescending(r => r.Score).ToList();
    }

    public async Task SendAsync(SendHostRecommendationInput input)
    {
        EnsureHostContext();

        var call = await _callRepo.GetAsync(input.GrantCallId);
        var grant = await _grantRepo.GetAsync(call.GrantId);
        var title = $"Yeni hibe önerisi: {grant.Name}";
        var body = string.IsNullOrWhiteSpace(input.Note)
            ? $"{grant.Name} ({call.Period}) programı firmanız için önerildi."
            : input.Note!;

        foreach (var tenantId in input.TenantIds.Distinct())
        {
            using (_currentTenant.Change(tenantId))
            {
                var existing = await _recRepo.FirstOrDefaultAsync(r => r.GrantCallId == input.GrantCallId);
                if (existing != null)
                {
                    continue; // idempotent — bu tenant'a zaten gönderilmiş
                }

                var rec = new GrantRecommendation(GuidGenerator.Create(), tenantId, input.GrantCallId, GrantRecommendationSource.Host, input.Note);
                await _recRepo.InsertAsync(rec, autoSave: true);

                var users = await _userRepo.GetListAsync();
                foreach (var user in users.Where(u => u.IsActive))
                {
                    await _notificationManager.PublishAsync(user.Id, title, body, NotificationType.GrantRecommended, nameof(GrantCall), call.Id);
                    if (!string.IsNullOrWhiteSpace(user.Email))
                    {
                        await _emailSender.SendAsync(user.Email, title, body);
                    }
                }
            }
        }
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Bu işlem yalnızca host bağlamında yapılabilir.");
        }
    }
}
