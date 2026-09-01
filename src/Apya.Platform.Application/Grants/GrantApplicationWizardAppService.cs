using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Users;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 2a · Başvuru sihirbazı — canlı birlikte düzenleme.
///
/// <para>İKİ TARAF TEK SERVİS: kiracı kullanıcısı <see cref="GrantPartyRole.Firma"/>,
/// host kullanıcısı <see cref="GrantPartyRole.Danisman"/> olarak görülür. Rol
/// <see cref="ICurrentTenant"/>'tan türetilir; istemciden GELMEZ — gelseydi kiracı
/// kendini danışman ilan edip devralma kurallarını atlardı.</para>
///
/// <para>KİLİT DB'DE: bellekte tutulsaydı uygulama yeniden başladığında ya da ikinci
/// sunucuda kilitler kaybolur, iki taraf aynı alanı yazardı. 2 dakika dokunulmayan
/// kilit ilk isteyene açılır (<see cref="GrantApplicationFieldLock.IdleMinutes"/>).</para>
///
/// <para>Katalog (Grant/GrantCall) host'ta TenantId=null durur; okurken IMultiTenant
/// filtresi kapatılır ve 🔴 TenantId koşulu ELLE konur.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantApplicationWizardAppService : ApplicationService, IGrantApplicationWizardAppService
{
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantApplicationBudgetLine, Guid> _budgetRepo;
    private readonly IRepository<GrantApplicationFieldLock, Guid> _lockRepo;
    private readonly IRepository<GrantApplicationMessage, Guid> _messageRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costItemRepo;
    private readonly IRepository<FirmProfile, Guid> _profileRepo;
    private readonly IRepository<FirmProfileTag, Guid> _profileTagRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantApplicationWizardAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantApplicationBudgetLine, Guid> budgetRepo,
        IRepository<GrantApplicationFieldLock, Guid> lockRepo,
        IRepository<GrantApplicationMessage, Guid> messageRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantEligibleCostItem, Guid> costItemRepo,
        IRepository<FirmProfile, Guid> profileRepo,
        IRepository<FirmProfileTag, Guid> profileTagRepo,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _appRepo = appRepo;
        _budgetRepo = budgetRepo;
        _lockRepo = lockRepo;
        _messageRepo = messageRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _costItemRepo = costItemRepo;
        _profileRepo = profileRepo;
        _profileTagRepo = profileTagRepo;
        _mtFilter = mtFilter;
    }

    /// <summary>Alan anahtarları — istemci ile sunucu aynı sözlüğü konuşur.</summary>
    public static string BudgetFieldKey(GrantCostItemKind kind) => "budget:" + kind;
    public const string FieldSummaryTitle = "summary:Title";
    public const string FieldSummaryBody = "summary:Body";
    public const string FieldSummaryDuration = "summary:Duration";

    private GrantPartyRole ViewerRole =>
        CurrentTenant.Id == null ? GrantPartyRole.Danisman : GrantPartyRole.Firma;

    private Guid ViewerUserId => CurrentUser.GetId();

    private string ViewerName =>
        CurrentUser.Name.IsNullOrWhiteSpace()
            ? (CurrentUser.UserName ?? "?")
            : $"{CurrentUser.Name} {CurrentUser.SurName}".Trim();

    public async Task<GrantApplicationWizardDto> GetAsync(Guid applicationId)
    {
        var application = await GetApplicationAsync(applicationId);
        return await BuildAsync(application);
    }

    // ------------------------------------------------------------------ yazma

    public async Task<GrantApplicationWizardDto> SaveBudgetLineAsync(SaveWizardBudgetLineInput input)
    {
        var application = await GetEditableApplicationAsync(input.ApplicationId);
        var fieldKey = BudgetFieldKey(input.Kind);
        await EnsureNotLockedByOtherAsync(application.Id, fieldKey);

        var (_, costItems) = await GetCatalogAsync(application);
        if (costItems.All(c => c.Kind != input.Kind))
        {
            // Program bu kalemi desteklemiyor — ekranda satır girilemez durumda, ama
            // uç doğrudan çağrılabildiği için sunucu da reddeder.
            throw new BusinessException(PlatformDomainErrorCodes.GrantBudgetCostItemNotEligible);
        }

        var line = await _budgetRepo.FirstOrDefaultAsync(
            l => l.GrantApplicationId == application.Id && l.Kind == input.Kind);

        if (line == null)
        {
            line = new GrantApplicationBudgetLine(
                GuidGenerator.Create(), application.TenantId, application.Id, input.Kind);
            line.SetAmount(input.Amount);
            line.SetJustification(input.Justification);
            await _budgetRepo.InsertAsync(line, autoSave: true);
        }
        else
        {
            line.SetAmount(input.Amount);
            line.SetJustification(input.Justification);
            await _budgetRepo.UpdateAsync(line, autoSave: true);
        }

        await TouchLockAsync(application.Id, fieldKey);
        return await BuildAsync(application);
    }

    public async Task<GrantApplicationWizardDto> SaveSummaryAsync(SaveWizardSummaryInput input)
    {
        var application = await GetEditableApplicationAsync(input.ApplicationId);
        await EnsureNotLockedByOtherAsync(application.Id, FieldSummaryTitle);

        application.SetProjectSummary(input.ProjectTitle, input.ProjectSummary, input.ProjectDurationMonths);
        await _appRepo.UpdateAsync(application, autoSave: true);

        await TouchLockAsync(application.Id, FieldSummaryTitle);
        return await BuildAsync(application);
    }

    public async Task<GrantApplicationWizardDto> SetStepAsync(Guid applicationId, int step)
    {
        var application = await GetApplicationAsync(applicationId);
        application.SetStep(step);
        await _appRepo.UpdateAsync(application, autoSave: true);
        return await BuildAsync(application);
    }

    public async Task<GrantApplicationWizardDto> HandOverAsync(Guid applicationId)
    {
        var application = await GetEditableApplicationAsync(applicationId);

        // Sıra karşı tarafa geçer. Devreden kişinin kilitleri bırakılır ki karşı taraf
        // devralma isteği göndermek zorunda kalmasın.
        application.HandOverTo(
            ViewerRole == GrantPartyRole.Firma ? GrantPartyRole.Danisman : GrantPartyRole.Firma);
        await _appRepo.UpdateAsync(application, autoSave: true);

        var mine = await _lockRepo.GetListAsync(
            l => l.GrantApplicationId == application.Id && l.OwnerUserId == ViewerUserId);
        if (mine.Count > 0)
        {
            await _lockRepo.DeleteManyAsync(mine, autoSave: true);
        }

        return await BuildAsync(application);
    }

    public async Task<GrantApplicationWizardDto> SubmitAsync(Guid applicationId)
    {
        var application = await GetEditableApplicationAsync(applicationId);
        application.Submit(Clock.Now);
        await _appRepo.UpdateAsync(application, autoSave: true);

        // Gönderilen başvuruda kilit tutmanın anlamı yok.
        var locks = await _lockRepo.GetListAsync(l => l.GrantApplicationId == application.Id);
        if (locks.Count > 0)
        {
            await _lockRepo.DeleteManyAsync(locks, autoSave: true);
        }

        return await BuildAsync(application);
    }

    // ------------------------------------------------------------------ kilit

    public async Task<GrantFieldLockResultDto> AcquireLockAsync(GrantFieldLockInput input)
    {
        var application = await GetEditableApplicationAsync(input.ApplicationId);
        var now = Clock.Now;

        var existing = await _lockRepo.FirstOrDefaultAsync(
            l => l.GrantApplicationId == application.Id && l.FieldKey == input.FieldKey);

        if (existing != null)
        {
            if (existing.OwnerUserId == ViewerUserId)
            {
                existing.Touch(now);
                await _lockRepo.UpdateAsync(existing, autoSave: true);
                return new GrantFieldLockResultDto { Acquired = true, Lock = ToDto(existing) };
            }

            if (!existing.IsStale(now))
            {
                // Karşı taraf hâlâ yazıyor: alan alınmaz, kimde olduğu döner.
                return new GrantFieldLockResultDto { Acquired = false, Lock = ToDto(existing) };
            }

            // Boşta kalmış kilit ilk isteyene geçer.
            existing.TransferTo(ViewerUserId, ViewerName, now);
            await _lockRepo.UpdateAsync(existing, autoSave: true);
            return new GrantFieldLockResultDto { Acquired = true, Lock = ToDto(existing) };
        }

        var created = new GrantApplicationFieldLock(
            GuidGenerator.Create(), application.TenantId, application.Id,
            input.FieldKey, ViewerUserId, ViewerName, now);
        await _lockRepo.InsertAsync(created, autoSave: true);
        return new GrantFieldLockResultDto { Acquired = true, Lock = ToDto(created) };
    }

    public async Task ReleaseLockAsync(GrantFieldLockInput input)
    {
        var existing = await _lockRepo.FirstOrDefaultAsync(
            l => l.GrantApplicationId == input.ApplicationId
                 && l.FieldKey == input.FieldKey
                 && l.OwnerUserId == ViewerUserId);
        if (existing != null)
        {
            await _lockRepo.DeleteAsync(existing, autoSave: true);
        }
    }

    public async Task HeartbeatAsync(GrantFieldLockInput input)
    {
        await TouchLockAsync(input.ApplicationId, input.FieldKey);
    }

    public async Task RequestTakeoverAsync(GrantFieldLockInput input)
    {
        var existing = await _lockRepo.FirstOrDefaultAsync(
            l => l.GrantApplicationId == input.ApplicationId && l.FieldKey == input.FieldKey);
        if (existing == null || existing.OwnerUserId == ViewerUserId)
        {
            return;
        }

        existing.RequestTakeover(ViewerUserId, ViewerName);
        await _lockRepo.UpdateAsync(existing, autoSave: true);
    }

    public async Task<GrantFieldLockResultDto> ApproveTakeoverAsync(GrantFieldLockInput input)
    {
        var existing = await _lockRepo.FirstOrDefaultAsync(
            l => l.GrantApplicationId == input.ApplicationId && l.FieldKey == input.FieldKey);

        if (existing == null || existing.OwnerUserId != ViewerUserId
            || existing.TakeoverRequestedByUserId == null)
        {
            // Onaylayacak bir istek yok; çağrı sessizce sonuçsuz kalır.
            return new GrantFieldLockResultDto { Acquired = false, Lock = existing == null ? null : ToDto(existing) };
        }

        existing.TransferTo(
            existing.TakeoverRequestedByUserId.Value,
            existing.TakeoverRequestedByName ?? "?",
            Clock.Now);
        await _lockRepo.UpdateAsync(existing, autoSave: true);
        return new GrantFieldLockResultDto { Acquired = true, Lock = ToDto(existing) };
    }

    // ------------------------------------------------------------------ mesaj

    public async Task<GrantApplicationMessageDto> SendMessageAsync(SendWizardMessageInput input)
    {
        var application = await GetApplicationAsync(input.ApplicationId);

        var message = new GrantApplicationMessage(
            GuidGenerator.Create(), application.TenantId, application.Id,
            ViewerUserId, ViewerName, ViewerRole, input.Body.Trim());
        await _messageRepo.InsertAsync(message, autoSave: true);

        return new GrantApplicationMessageDto
        {
            Id = message.Id,
            SenderUserId = message.SenderUserId,
            SenderName = message.SenderName,
            SenderRole = message.SenderRole,
            Body = message.Body,
            CreationTime = message.CreationTime
        };
    }

    // ------------------------------------------------------------------ yardımcılar

    private async Task<GrantApplication> GetApplicationAsync(Guid id)
    {
        // Host (danışman) kiracının başvurusuna bakar: filtre kapatılır. Kiracı
        // bağlamında filtre zaten kendi satırlarını sınırlar.
        if (CurrentTenant.Id == null)
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

    private async Task<GrantApplication> GetEditableApplicationAsync(Guid id)
    {
        var application = await GetApplicationAsync(id);
        if (application.SubmittedAt.HasValue)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantApplicationLocked);
        }
        return application;
    }

    private async Task<(GrantCall Call, List<GrantEligibleCostItem> CostItems)> GetCatalogAsync(
        GrantApplication application)
    {
        using (_mtFilter.Disable())
        {
            var call = await _callRepo.FirstOrDefaultAsync(
                           c => c.Id == application.GrantCallId && c.TenantId == null)
                       ?? throw new EntityNotFoundException(typeof(GrantCall), application.GrantCallId);
            var items = await _costItemRepo.GetListAsync(c => c.GrantId == call.GrantId && c.TenantId == null);
            return (call, items);
        }
    }

    private async Task EnsureNotLockedByOtherAsync(Guid applicationId, string fieldKey)
    {
        var existing = await _lockRepo.FirstOrDefaultAsync(
            l => l.GrantApplicationId == applicationId && l.FieldKey == fieldKey);

        if (existing != null && existing.OwnerUserId != ViewerUserId && !existing.IsStale(Clock.Now))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantFieldLockedByOther)
                .WithData("Owner", existing.OwnerName);
        }
    }

    private async Task TouchLockAsync(Guid applicationId, string fieldKey)
    {
        var existing = await _lockRepo.FirstOrDefaultAsync(
            l => l.GrantApplicationId == applicationId
                 && l.FieldKey == fieldKey
                 && l.OwnerUserId == ViewerUserId);
        if (existing != null)
        {
            existing.Touch(Clock.Now);
            await _lockRepo.UpdateAsync(existing, autoSave: true);
        }
    }

    private static GrantFieldLockDto ToDto(GrantApplicationFieldLock l) => new()
    {
        FieldKey = l.FieldKey,
        OwnerUserId = l.OwnerUserId,
        OwnerName = l.OwnerName,
        // Kilit sahibinin rolü: kiracı satırında TenantId dolu olur, host kullanıcısı
        // kiracı bağlamında da yazabildiği için rol kilidin kendi kaydından türetilemez;
        // bu yüzden sahibin adı ekranda esas gösterimdir. Rol yalnız renk seçer.
        OwnerRole = GrantPartyRole.Ortak,
        LastActivityAt = l.LastActivityAt,
        TakeoverRequestedByUserId = l.TakeoverRequestedByUserId,
        TakeoverRequestedByName = l.TakeoverRequestedByName
    };

    private async Task<GrantApplicationWizardDto> BuildAsync(GrantApplication application)
    {
        var (call, costItems) = await GetCatalogAsync(application);

        Grant grant;
        using (_mtFilter.Disable())
        {
            grant = await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null)
                    ?? throw new EntityNotFoundException(typeof(Grant), call.GrantId);
        }

        var lines = await _budgetRepo.GetListAsync(l => l.GrantApplicationId == application.Id);
        var locks = await _lockRepo.GetListAsync(l => l.GrantApplicationId == application.Id);
        var messages = await _messageRepo.GetListAsync(m => m.GrantApplicationId == application.Id);

        var byKind = lines.ToDictionary(l => l.Kind);
        var calcInput = costItems.Select(c => new GrantBudgetCalculator.LineInput(
            c.Kind,
            byKind.TryGetValue(c.Kind, out var l) ? l.Amount : 0m,
            c.LimitPercent));
        var budget = GrantBudgetCalculator.Calculate(calcInput, grant.SupportRatePercent, grant.MaxAmount);

        var dto = new GrantApplicationWizardDto
        {
            Id = application.Id,
            GrantCallId = call.Id,
            GrantId = grant.Id,
            GrantName = grant.Name,
            Issuer = grant.Issuer,
            Period = call.Period,
            Deadline = call.Deadline,
            DaysRemaining = call.Deadline.HasValue
                ? (int)(call.Deadline.Value.Date - Clock.Now.Date).TotalDays
                : null,
            MaxAmount = grant.MaxAmount,
            SupportRatePercent = grant.SupportRatePercent,
            CurrentStep = application.CurrentStep,
            StepCount = GrantApplication.StepCount,
            PendingParty = application.PendingParty,
            SubmittedAt = application.SubmittedAt,
            IsReadOnly = application.SubmittedAt.HasValue,
            ViewerRole = ViewerRole,
            ViewerUserId = ViewerUserId,
            ProjectTitle = application.ProjectTitle,
            ProjectSummary = application.ProjectSummary,
            ProjectDurationMonths = application.ProjectDurationMonths,
            TotalProject = budget.TotalProject,
            TotalSupport = budget.TotalSupport,
            OwnContribution = budget.OwnContribution,
            CapApplied = budget.CapApplied,
            SupportShareOfCapPercent = budget.SupportShareOfCapPercent
        };

        // Bütçe satırları: programın AÇIK kalemleri + tasarım gereği kapalı kalemler de
        // "desteklenmiyor" satırı olarak görünür (2a).
        foreach (var result in budget.Lines)
        {
            byKind.TryGetValue(result.Kind, out var line);
            dto.BudgetLines.Add(new GrantWizardBudgetLineDto
            {
                Kind = result.Kind,
                Amount = result.Amount,
                Justification = line?.Justification,
                LimitPercent = result.LimitPercent,
                SupportAmount = result.SupportAmount,
                LimitApplied = result.LimitApplied,
                IsEligible = true
            });
        }

        foreach (var kind in Enum.GetValues<GrantCostItemKind>())
        {
            if (costItems.All(c => c.Kind != kind))
            {
                dto.BudgetLines.Add(new GrantWizardBudgetLineDto { Kind = kind, IsEligible = false });
            }
        }

        dto.Locks = locks.Select(ToDto).ToList();
        dto.Messages = messages
            .OrderBy(m => m.CreationTime)
            .Select(m => new GrantApplicationMessageDto
            {
                Id = m.Id,
                SenderUserId = m.SenderUserId,
                SenderName = m.SenderName,
                SenderRole = m.SenderRole,
                Body = m.Body,
                CreationTime = m.CreationTime
            })
            .ToList();

        dto.PendingFields = BuildPendingFields(application, dto, locks);
        dto.CompletionPercent = CalculateCompletion(application, dto);
        dto.Firm = await BuildFirmSummaryAsync(application);

        return dto;
    }

    /// <summary>Sağ panel · "Bu Adımda Kalanlar" — yalnız BULUNULAN adımın eksikleri.</summary>
    private static List<GrantWizardPendingFieldDto> BuildPendingFields(
        GrantApplication application,
        GrantApplicationWizardDto dto,
        List<GrantApplicationFieldLock> locks)
    {
        var pending = new List<GrantWizardPendingFieldDto>();

        void Add(string key, string label)
        {
            var held = locks.FirstOrDefault(l => l.FieldKey == key);
            pending.Add(new GrantWizardPendingFieldDto
            {
                FieldKey = key,
                Label = label,
                LockedByRole = held == null ? null : GrantPartyRole.Ortak
            });
        }

        switch (application.CurrentStep)
        {
            case 2:
                if (application.ProjectTitle.IsNullOrWhiteSpace()) { Add(FieldSummaryTitle, "ProjectTitle"); }
                if (application.ProjectSummary.IsNullOrWhiteSpace()) { Add(FieldSummaryBody, "ProjectSummary"); }
                if (application.ProjectDurationMonths == null) { Add(FieldSummaryDuration, "ProjectDuration"); }
                break;

            case 3:
                foreach (var line in dto.BudgetLines.Where(b => b.IsEligible))
                {
                    if (line.Amount <= 0)
                    {
                        Add(BudgetFieldKey(line.Kind), line.Kind.ToString());
                    }
                    else if (line.Justification.IsNullOrWhiteSpace())
                    {
                        Add(BudgetFieldKey(line.Kind) + ":note", line.Kind.ToString());
                    }
                }
                break;
        }

        return pending;
    }

    /// <summary>
    /// Tamamlanma: proje özeti 3 alan + açık kalem başına 1 alan üzerinden.
    /// Firma bilgileri adımı sayılmaz — profil ayrı ekranda doldurulur, sihirbazın
    /// ilerlemesini firma profiline bağlamak yanıltıcı olurdu.
    /// </summary>
    private static int CalculateCompletion(GrantApplication application, GrantApplicationWizardDto dto)
    {
        var total = 3 + dto.BudgetLines.Count(b => b.IsEligible);
        if (total == 0) { return 0; }

        var filled = 0;
        if (!application.ProjectTitle.IsNullOrWhiteSpace()) { filled++; }
        if (!application.ProjectSummary.IsNullOrWhiteSpace()) { filled++; }
        if (application.ProjectDurationMonths != null) { filled++; }
        filled += dto.BudgetLines.Count(b => b.IsEligible && b.Amount > 0);

        return (int)Math.Round(filled * 100.0 / total);
    }

    private async Task<GrantWizardFirmSummaryDto?> BuildFirmSummaryAsync(GrantApplication application)
    {
        FirmProfile? profile;
        List<FirmProfileTag> tags;
        using (_mtFilter.Disable())
        {
            profile = await _profileRepo.FirstOrDefaultAsync(p => p.TenantId == application.TenantId);
            if (profile == null) { return null; }
            tags = await _profileTagRepo.GetListAsync(t => t.FirmProfileId == profile.Id);
        }

        // Doluluk 1d ile AYNI dokuz alan üzerinden — iki ekran farklı yüzde gösterirse
        // kullanıcı hangisine güveneceğini bilemez.
        var filled = new[]
        {
            profile.Size.HasValue, profile.FoundedOn.HasValue, profile.StaffCount.HasValue,
            profile.RdStaffCount.HasValue, profile.AnnualRevenue.HasValue, profile.Trl.HasValue,
            profile.HasConsortiumPartner.HasValue,
            tags.Any(t => t.Kind == GrantCriteriaKind.NaceKodu),
            tags.Any(t => t.Kind == GrantCriteriaKind.Sektor)
        };

        return new GrantWizardFirmSummaryDto
        {
            Size = profile.Size,
            StaffCount = profile.StaffCount,
            RdStaffCount = profile.RdStaffCount,
            Trl = profile.Trl,
            HasConsortiumPartner = profile.HasConsortiumPartner,
            CompletionPercent = (int)Math.Round(filled.Count(f => f) * 100.0 / filled.Length)
        };
    }
}
