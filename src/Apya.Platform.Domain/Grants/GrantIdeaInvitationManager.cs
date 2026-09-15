using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.Tenants;
using Microsoft.Extensions.Localization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Grants;

/// <summary>
/// 19b · Fikir davetinin kuralları: alıcı kümesi, "yanıtladı" hesabı, bildirim ve tek hatırlatma. Gönderim (host
/// ekranı) ve hatırlatma (günlük iş) aynı bildirim yolundan geçer.
///
/// <para>🔴 Kiracı verisi (profil, fikir, başvuru) filtre BİLEREK kapalı okunur ve TenantId koşulu elle konur
/// (emsal: Talepler). Yazma yok.</para>
/// </summary>
public class GrantIdeaInvitationManager : DomainService
{
    private readonly ITenantRepository _tenantRepo;
    private readonly IRepository<FirmProfile, Guid> _profileRepo;
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantIdeaInvitation, Guid> _invitationRepo;
    private readonly IRepository<GrantIdeaInvitationRecipient, Guid> _recipientRepo;
    private readonly GrantNotificationDispatcher _dispatcher;
    private readonly TenantDisplayNameResolver _displayNames;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly IStringLocalizer<PlatformResource> _l;

    public GrantIdeaInvitationManager(
        ITenantRepository tenantRepo,
        IRepository<FirmProfile, Guid> profileRepo,
        IRepository<GrantInterest, Guid> interestRepo,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantIdeaInvitation, Guid> invitationRepo,
        IRepository<GrantIdeaInvitationRecipient, Guid> recipientRepo,
        GrantNotificationDispatcher dispatcher,
        TenantDisplayNameResolver displayNames,
        IDataFilter<IMultiTenant> mtFilter,
        IStringLocalizer<PlatformResource> l)
    {
        _tenantRepo = tenantRepo;
        _profileRepo = profileRepo;
        _interestRepo = interestRepo;
        _appRepo = appRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _invitationRepo = invitationRepo;
        _recipientRepo = recipientRepo;
        _dispatcher = dispatcher;
        _displayNames = displayNames;
        _mtFilter = mtFilter;
        _l = l;
    }

    /// <summary>
    /// "Kime": tek firma, süzülmüş grup ya da tümü. Süzgeç Eşleştirme ekranının ölçek kuralını izler: ölçeğini
    /// girmemiş firma elenmez (bilinmeyen ölçek davet dışında kalmasın). <paramref name="onlyWithoutPoolIdea"/> =
    /// havuzda bekleyen fikri olmayanlar.
    /// </summary>
    public async Task<List<Tenant>> ResolveAudienceAsync(
        GrantIdeaInvitationAudience audience, Guid? tenantId, int? sizes, bool onlyWithoutPoolIdea)
    {
        var tenants = await _tenantRepo.GetListAsync();
        switch (audience)
        {
            case GrantIdeaInvitationAudience.Single:
                return tenants.Where(t => t.Id == tenantId).ToList();
            case GrantIdeaInvitationAudience.All:
                return tenants;
        }

        Dictionary<Guid, CompanySize?> sizeByTenant;
        HashSet<Guid> withIdea;
        using (_mtFilter.Disable())
        {
            sizeByTenant = (await _profileRepo.GetListAsync(p => p.TenantId != null))
                .GroupBy(p => p.TenantId!.Value)
                .ToDictionary(g => g.Key, g => g.First().Size);
            withIdea = onlyWithoutPoolIdea
                ? (await _interestRepo.GetListAsync(i => i.TenantId != null && i.GrantCallId == null
                        && (i.Status == GrantInterestStatus.Yeni || i.Status == GrantInterestStatus.Inceleniyor)))
                    .Select(i => i.TenantId!.Value).ToHashSet()
                : new HashSet<Guid>();
        }

        return tenants
            .Where(t => sizes is not > 0
                        || sizeByTenant.GetValueOrDefault(t.Id) is not { } size
                        || ((int)size & sizes.Value) != 0)
            .Where(t => !withIdea.Contains(t.Id))
            .ToList();
    }

    /// <summary>
    /// Davetten SONRA yanıt veren firmalar. Havuz davetinde firmanın kendi paylaştığı fikir (sonradan bir çağrıya
    /// bağlanmış olsa da); çağrı davetinde o çağrıya ilgi talebi ya da başvuru.
    /// </summary>
    public async Task<HashSet<Guid>> GetRespondedFirmsAsync(GrantIdeaInvitation invitation, IReadOnlyCollection<Guid> firmIds)
    {
        // Alıcılar parametreyle gelir: davet satırı alt koleksiyonu yüklenmeden okunur (includeDetails tek başına yüklemez).
        if (firmIds.Count == 0)
        {
            return new HashSet<Guid>();
        }

        using (_mtFilter.Disable())
        {
            if (invitation.GrantCallId is not { } callId)
            {
                return (await _interestRepo.GetListAsync(i => i.TenantId != null && firmIds.Contains(i.TenantId.Value)
                        && i.Source == GrantInterestSource.Tenant && i.CreationTime >= invitation.SentAt))
                    .Select(i => i.TenantId!.Value).ToHashSet();
            }

            var interested = (await _interestRepo.GetListAsync(i => i.TenantId != null && firmIds.Contains(i.TenantId.Value)
                    && i.GrantCallId == callId && i.CreationTime >= invitation.SentAt))
                .Select(i => i.TenantId!.Value);
            var applied = (await _appRepo.GetListAsync(a => a.TenantId != null && firmIds.Contains(a.TenantId.Value)
                    && a.GrantCallId == callId && a.CreationTime >= invitation.SentAt))
                .Select(a => a.TenantId!.Value);
            return interested.Concat(applied).ToHashSet();
        }
    }

    /// <summary>Daveti (ya da hatırlatmasını) firmanın etkin kullanıcılarına duyurur. Şablon kapalıysa <c>false</c>.</summary>
    public async Task<bool> NotifyAsync(GrantIdeaInvitation invitation, Guid firmTenantId, bool reminder)
    {
        var (callName, deadline) = await DescribeCallAsync(invitation.GrantCallId);

        return await _dispatcher.DispatchToTenantAsync(
            GrantNotificationTrigger.IdeaInvited,
            firmTenantId,
            new Dictionary<string, string?>
            {
                ["{hatırlatma}"] = reminder ? _l["Grants:Invite:ReminderPrefix"] : null,
                ["{firma_adı}"] = await _displayNames.GetAsync(firmTenantId),
                ["{davet_mesajı}"] = invitation.Message,
                ["{çağrı_adı}"] = callName,
                ["{son_tarih}"] = deadline?.ToString("dd.MM.yyyy")
            },
            nameof(GrantIdeaInvitation), invitation.Id,
            sendEmail: invitation.SendEmail);
    }

    /// <summary>
    /// Günlük iş: süresi dolan davetlerde yanıtlamamış ve henüz hatırlatılmamış firmalara bir kez hatırlatır.
    /// Hatırlatılan satır işaretlenir; iş aynı gün yeniden koşsa da ikinci hatırlatma gitmez.
    /// </summary>
    /// <returns>Hatırlatılan firma sayısı.</returns>
    public async Task<int> SendDueRemindersAsync(DateTime now)
    {
        var invitations = (await _invitationRepo.GetListAsync(i => i.RemindAfterDays != null))
            .Where(i => i.IsReminderDue(now))
            .ToList();
        if (invitations.Count == 0)
        {
            return 0;
        }

        var ids = invitations.Select(i => i.Id).ToList();
        var recipients = (await _recipientRepo.GetListAsync(r => ids.Contains(r.InvitationId) && r.RemindedAt == null))
            .GroupBy(r => r.InvitationId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var reminded = 0;
        foreach (var invitation in invitations.Where(i => recipients.ContainsKey(i.Id)))
        {
            var responded = await GetRespondedFirmsAsync(invitation, recipients[invitation.Id].Select(r => r.FirmTenantId).ToList());
            foreach (var recipient in recipients[invitation.Id].Where(r => !responded.Contains(r.FirmTenantId)))
            {
                await NotifyAsync(invitation, recipient.FirmTenantId, reminder: true);
                // Şablon kapalı olsa da işaretlenir: host bildirimi bilerek susturmuşsa ertesi gün yeniden denemek yanlış olur.
                recipient.MarkReminded(now);
                await _recipientRepo.UpdateAsync(recipient, autoSave: true);
                reminded++;
            }
        }

        return reminded;
    }

    /// <summary>Çağrı → (program adı, son tarih). Katalog host verisidir: filtre kapalı, TenantId null.</summary>
    public async Task<(string? Name, DateTime? Deadline)> DescribeCallAsync(Guid? callId)
    {
        if (callId == null)
        {
            return (null, null);
        }

        using (_mtFilter.Disable())
        {
            var call = await _callRepo.FirstOrDefaultAsync(c => c.Id == callId && c.TenantId == null);
            if (call == null)
            {
                return (null, null);
            }

            var grant = await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null);
            return (grant?.Name, call.Deadline);
        }
    }
}
