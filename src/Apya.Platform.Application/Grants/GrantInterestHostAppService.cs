using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// Host: İlgi Talepleri kutusu — kiracıların "İlgileniyorum" talepleri.
///
/// <para>🔴 HOST-ONLY. Talepler KİRACIYA ait olduğu için her okuma/yazma o kiracının
/// bağlamına geçilerek yapılır (emsal: <see cref="GrantApplicationHostAppService"/>).
/// Filtreyi kapatmak yerine bağlam değiştiriyoruz: <c>Disable()</c> kapsamı tüm
/// kiracılara açar ve yazma tarafında yanlış kiracıya kayıt düşürme riski doğar.</para>
///
/// <para>Başvuru BURADA doğar: kiracıya başvuru açtıran uç yok, süreç host'un
/// kararıyla başlar.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantInterestHostAppService : PlatformAppService, IGrantInterestHostAppService
{
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantRecommendation, Guid> _recRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly ICurrentTenant _currentTenant;
    private readonly GrantNotificationDispatcher _notifyDispatcher;

    public GrantInterestHostAppService(
        IRepository<GrantInterest, Guid> interestRepo,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantRecommendation, Guid> recRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        ITenantRepository tenantRepo,
        IIdentityUserRepository userRepo,
        ICurrentTenant currentTenant,
        GrantNotificationDispatcher notifyDispatcher)
    {
        _interestRepo = interestRepo;
        _appRepo = appRepo;
        _recRepo = recRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _tenantRepo = tenantRepo;
        _userRepo = userRepo;
        _currentTenant = currentTenant;
        _notifyDispatcher = notifyDispatcher;
    }

    public async Task<GrantInterestConsoleDto> GetAsync(bool onlyPending)
    {
        EnsureHostContext();
        return await BuildConsoleAsync(onlyPending);
    }

    public async Task<GrantInterestConsoleDto> StartReviewAsync(Guid interestId)
    {
        EnsureHostContext();

        var tenantId = await FindInterestTenantIdAsync(interestId);
        using (_currentTenant.Change(tenantId))
        {
            var interest = await _interestRepo.GetAsync(interestId);
            interest.StartReview(CurrentUser.Id, Clock.Now);
            await _interestRepo.UpdateAsync(interest, autoSave: true);
        }

        // Firmaya bildirim GİTMEZ: "incelemeye alındı" host'un iç triage adımıdır,
        // firmanın gördüğü durum zaten "talebiniz iletildi".
        return await BuildConsoleAsync(onlyPending: true);
    }

    public async Task<GrantInterestConsoleDto> StartApplicationAsync(Guid interestId)
    {
        EnsureHostContext();

        var tenantId = await FindInterestTenantIdAsync(interestId);
        Guid callId;

        using (_currentTenant.Change(tenantId))
        {
            var interest = await _interestRepo.GetAsync(interestId);
            callId = interest.GrantCallId;

            // Başvuru KİRACININ bağlamında açılır; host bağlamında açılsaydı firma
            // kendi başvurusunu göremezdi. Aynı çağrıya ikinci başvuru açılmaz
            // (tenant+çağrı benzersiz): eski kayıt varsa talep ona bağlanır.
            var application = await _appRepo.FirstOrDefaultAsync(a => a.GrantCallId == interest.GrantCallId);
            if (application == null)
            {
                application = new GrantApplication(GuidGenerator.Create(), tenantId, interest.GrantCallId);
                await _appRepo.InsertAsync(application, autoSave: true);

                // Host bu çağrıyı bu firmaya göndermişse (B3), başvuruldu olarak işaretle.
                var rec = await _recRepo.FirstOrDefaultAsync(r => r.GrantCallId == interest.GrantCallId);
                if (rec != null)
                {
                    rec.MarkApplied();
                    await _recRepo.UpdateAsync(rec, autoSave: true);
                }
            }

            interest.MarkApplicationStarted(application.Id, CurrentUser.Id, Clock.Now);
            await _interestRepo.UpdateAsync(interest, autoSave: true);
        }

        await NotifyAnsweredAsync(
            tenantId,
            callId,
            interestId,
            decision: L["Grants:Interest:Decision:Started"],
            reason: L["Grants:Interest:Decision:StartedHint"]);

        return await BuildConsoleAsync(onlyPending: true);
    }

    public async Task<GrantInterestConsoleDto> RejectAsync(RejectGrantInterestInput input)
    {
        EnsureHostContext();

        var tenantId = await FindInterestTenantIdAsync(input.InterestId);
        Guid callId;

        using (_currentTenant.Change(tenantId))
        {
            var interest = await _interestRepo.GetAsync(input.InterestId);
            interest.Reject(input.Reason, CurrentUser.Id, Clock.Now);
            await _interestRepo.UpdateAsync(interest, autoSave: true);
            callId = interest.GrantCallId;
        }

        // Gerekçe METİN OLARAK gider: firmanın gördüğü cümle host'un yazdığıdır,
        // bildirimde özetlenip ekranda başka türlü görünmesi güveni bozardı.
        await NotifyAnsweredAsync(
            tenantId,
            callId,
            input.InterestId,
            decision: L["Grants:Interest:Decision:Rejected"],
            reason: input.Reason.Trim());

        return await BuildConsoleAsync(onlyPending: true);
    }

    // ---------- Yardımcılar ----------

    private async Task NotifyAnsweredAsync(
        Guid? tenantId, Guid callId, Guid interestId, string decision, string reason)
    {
        await _notifyDispatcher.DispatchToTenantAsync(
            GrantNotificationTrigger.InterestAnswered,
            tenantId,
            new Dictionary<string, string?>
            {
                ["{çağrı_adı}"] = await GetGrantNameAsync(callId),
                ["{karar}"] = decision,
                ["{gerekçe}"] = reason
            },
            nameof(GrantInterest), interestId);
    }

    /// <summary>
    /// Konsolun tamamı: KPI'lar her zaman tüm taleplerden, liste süzgece göre.
    /// Katalog host bağlamında bir kez okunur — kiracı bağlamına geçildiğinde
    /// filtre çağrıları eler ve program adı boş kalırdı.
    /// </summary>
    private async Task<GrantInterestConsoleDto> BuildConsoleAsync(bool onlyPending)
    {
        var calls = (await _callRepo.GetListAsync()).ToDictionary(c => c.Id);
        var grantIds = calls.Values.Select(c => c.GrantId).Distinct().ToList();
        var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id)))
            .ToDictionary(g => g.Id, g => g.Name);

        var today = Clock.Now.Date;
        var rows = new List<GrantInterestRowDto>();

        foreach (var tenant in await _tenantRepo.GetListAsync())
        {
            using (_currentTenant.Change(tenant.Id))
            {
                var interests = await _interestRepo.GetListAsync();
                if (interests.Count == 0)
                {
                    continue;
                }

                var users = (await _userRepo.GetListAsync()).ToDictionary(u => u.Id, DisplayName);

                foreach (var interest in interests)
                {
                    var call = calls.GetValueOrDefault(interest.GrantCallId);
                    rows.Add(new GrantInterestRowDto
                    {
                        Id = interest.Id,
                        TenantId = tenant.Id,
                        FirmName = tenant.Name,
                        GrantCallId = interest.GrantCallId,
                        GrantName = call == null ? string.Empty : grants.GetValueOrDefault(call.GrantId, string.Empty),
                        Period = call?.Period,
                        Deadline = call?.Deadline,
                        DaysRemaining = call?.Deadline == null
                            ? null
                            : (int)(call.Deadline.Value.Date - today).TotalDays,
                        CreationTime = interest.CreationTime,
                        Note = interest.Note,
                        Status = interest.Status,
                        HostFeedback = interest.HostFeedback,
                        RequestedByName = interest.RequestedByUserId.HasValue
                            ? users.GetValueOrDefault(interest.RequestedByUserId.Value)
                            : null,
                        ReviewedByUserId = interest.ReviewedByUserId,
                        ReviewedAt = interest.ReviewedAt,
                        GrantApplicationId = interest.GrantApplicationId
                    });
                }
            }
        }

        // İnceleyen danışman host kullanıcısıdır; adı host bağlamında çözülür.
        await FillReviewerNamesAsync(rows);

        var dto = new GrantInterestConsoleDto
        {
            NewCount = rows.Count(r => r.Status == GrantInterestStatus.Yeni),
            InReviewCount = rows.Count(r => r.Status == GrantInterestStatus.Inceleniyor),
            StartedCount = rows.Count(r => r.Status == GrantInterestStatus.BasvuruAcildi),
            RejectedCount = rows.Count(r => r.Status == GrantInterestStatus.UygunDegil)
        };

        // Bekleyenler önce, içlerinde en eski talep başta: sıradaki iş yukarıda dursun.
        dto.Items = rows
            .Where(r => !onlyPending || r.Status is GrantInterestStatus.Yeni or GrantInterestStatus.Inceleniyor)
            .OrderBy(r => r.Status is GrantInterestStatus.Yeni or GrantInterestStatus.Inceleniyor ? 0 : 1)
            .ThenBy(r => r.CreationTime)
            .ToList();

        return dto;
    }

    private async Task FillReviewerNamesAsync(List<GrantInterestRowDto> rows)
    {
        if (rows.All(r => r.ReviewedAt == null))
        {
            return;
        }

        var hostUsers = (await _userRepo.GetListAsync()).ToDictionary(u => u.Id, DisplayName);
        foreach (var row in rows.Where(r => r.ReviewedAt != null))
        {
            row.ReviewedByName = row.ReviewedByUserId.HasValue
                ? hostUsers.GetValueOrDefault(row.ReviewedByUserId.Value)
                : null;
        }
    }

    /// <summary>Ad + soyad; ikisi de boşsa kullanıcı adı — satır isimsiz kalmasın.</summary>
    private static string DisplayName(IdentityUser user)
    {
        var full = $"{user.Name} {user.Surname}".Trim();
        return full.IsNullOrWhiteSpace() ? user.UserName : full;
    }

    private async Task<string?> GetGrantNameAsync(Guid callId)
    {
        var call = await _callRepo.FirstOrDefaultAsync(c => c.Id == callId);
        return call == null
            ? null
            : (await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId))?.Name;
    }

    private async Task<Guid?> FindInterestTenantIdAsync(Guid interestId)
    {
        foreach (var tenant in await _tenantRepo.GetListAsync())
        {
            using (_currentTenant.Change(tenant.Id))
            {
                if (await _interestRepo.FindAsync(interestId) != null)
                {
                    return tenant.Id;
                }
            }
        }

        throw new BusinessException(PlatformDomainErrorCodes.GrantInterestNotFound);
    }

    private void EnsureHostContext()
    {
        if (_currentTenant.Id != null)
        {
            throw new AbpAuthorizationException();
        }
    }
}
