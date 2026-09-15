using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 19b · Host "Fikir daveti gönder". Kural ve bildirim <see cref="GrantIdeaInvitationManager"/>'de; burası ekranın
/// seçeneklerini toplar, daveti kaydeder ve sonucu özetler.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantIdeaInvitationAppService : PlatformAppService, IGrantIdeaInvitationAppService
{
    private readonly GrantIdeaInvitationManager _manager;
    private readonly GrantNotificationDispatcher _dispatcher;
    private readonly IRepository<GrantIdeaInvitation, Guid> _invitationRepo;
    private readonly IRepository<GrantIdeaInvitationRecipient, Guid> _recipientRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;

    public GrantIdeaInvitationAppService(
        GrantIdeaInvitationManager manager,
        GrantNotificationDispatcher dispatcher,
        IRepository<GrantIdeaInvitation, Guid> invitationRepo,
        IRepository<GrantIdeaInvitationRecipient, Guid> recipientRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo)
    {
        _manager = manager;
        _dispatcher = dispatcher;
        _invitationRepo = invitationRepo;
        _recipientRepo = recipientRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
    }

    public async Task<GrantIdeaInvitationOptionsDto> GetOptionsAsync()
    {
        EnsureHostContext();

        var firms = await _manager.ResolveAudienceAsync(GrantIdeaInvitationAudience.All, null, null, false);
        var calls = (await _callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).Where(IsOpen).ToList();
        var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
        var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id))).ToDictionary(g => g.Id, g => g.Name);

        return new GrantIdeaInvitationOptionsDto
        {
            Firms = firms.OrderBy(t => t.Name).Select(t => new GrantRequestOptionDto { Id = t.Id, Name = t.Name }).ToList(),
            Calls = calls
                .Where(c => grants.ContainsKey(c.GrantId))
                .Select(c => new GrantRequestOptionDto
                {
                    Id = c.Id,
                    Name = string.IsNullOrWhiteSpace(c.Period) ? grants[c.GrantId] : grants[c.GrantId] + " · " + c.Period
                })
                .OrderBy(c => c.Name)
                .ToList()
        };
    }

    public async Task<int> CountRecipientsAsync(GrantIdeaInvitationAudienceInput input)
    {
        EnsureHostContext();
        return (await ResolveAsync(input)).Count;
    }

    public async Task<GrantIdeaInvitationPreviewDto> PreviewAsync(PreviewGrantIdeaInvitationInput input)
    {
        EnsureHostContext();

        var (callName, deadline) = await _manager.DescribeCallAsync(input.GrantCallId);
        var rendered = await _dispatcher.RenderAsync(GrantNotificationTrigger.IdeaInvited, new Dictionary<string, string?>
        {
            ["{firma_adı}"] = L["Grants:Notify:Sample:Firm"],
            ["{davet_mesajı}"] = input.Message?.Trim(),
            ["{çağrı_adı}"] = callName,
            ["{son_tarih}"] = deadline?.ToString("dd.MM.yyyy")
        });

        return rendered == null
            ? new GrantIdeaInvitationPreviewDto { TemplateEnabled = false }
            : new GrantIdeaInvitationPreviewDto { TemplateEnabled = true, Subject = rendered.Value.Subject, Body = rendered.Value.Body };
    }

    public async Task<GrantIdeaInvitationSendResultDto> SendAsync(SendGrantIdeaInvitationInput input)
    {
        EnsureHostContext();

        // Çağrı davetinde firma "İlgileniyorum" formuna gider: yalnız firmanın görebildiği (açık) çağrı olur.
        if (input.GrantCallId is { } callId)
        {
            var call = await _callRepo.FindAsync(callId);
            if (call == null || !IsOpen(call))
            {
                throw new BusinessException(PlatformDomainErrorCodes.GrantInvitationCallNotOpen);
            }
        }

        var firms = await ResolveAsync(input);
        if (firms.Count == 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInvitationNoRecipients);
        }

        var invitation = new GrantIdeaInvitation(
            GuidGenerator.Create(), input.GrantCallId, input.Message, input.Audience, input.SendEmail, input.RemindAfterDays, Clock.Now);
        foreach (var firm in firms)
        {
            invitation.AddRecipient(GuidGenerator.Create(), firm.Id);
        }
        await _invitationRepo.InsertAsync(invitation, autoSave: true);

        // Şablon kapalıysa davet yine kaydolur (hatırlatma ve yanıt sayımı işler), bildirim gitmez — host bilerek susturmuş.
        foreach (var firm in firms)
        {
            await _manager.NotifyAsync(invitation, firm.Id, reminder: false);
        }

        return new GrantIdeaInvitationSendResultDto { InvitationId = invitation.Id, RecipientCount = firms.Count };
    }

    public async Task<GrantIdeaInvitationSummaryDto?> GetLatestAsync()
    {
        EnsureHostContext();

        var latest = (await _invitationRepo.GetListAsync()).OrderByDescending(i => i.SentAt).FirstOrDefault();
        if (latest == null)
        {
            return null;
        }

        var recipients = await _recipientRepo.GetListAsync(r => r.InvitationId == latest.Id);
        var responded = await _manager.GetRespondedFirmsAsync(latest, recipients.Select(r => r.FirmTenantId).ToList());
        var (callName, _) = await _manager.DescribeCallAsync(latest.GrantCallId);

        return new GrantIdeaInvitationSummaryDto
        {
            Id = latest.Id,
            SentAt = latest.SentAt,
            GrantName = callName,
            RecipientCount = recipients.Count,
            RespondedCount = recipients.Count(r => responded.Contains(r.FirmTenantId)),
            RemindAt = latest.RemindAt,
            RemindedCount = recipients.Count(r => r.RemindedAt != null)
        };
    }

    private Task<List<Volo.Abp.TenantManagement.Tenant>> ResolveAsync(GrantIdeaInvitationAudienceInput input)
        => _manager.ResolveAudienceAsync(input.Audience, input.TenantId, input.Sizes, input.OnlyWithoutPoolIdea);

    private bool IsOpen(GrantCall call)
        => call.Status == GrantCallStatus.Acik && (call.Deadline == null || call.Deadline.Value.Date >= Clock.Now.Date);

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException();
        }
    }
}
