using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Timing;
using Apya.Platform.Ai.Permissions;

namespace Apya.Platform.Ai.Tenants;

[Authorize(AiPermissions.TenantSettings.Default)]
public class TenantAiSettingsAppService : ApplicationService, ITenantAiSettingsAppService
{
    private readonly IRepository<TenantAiSettings, Guid> _repository;
    private readonly IClock _clock;

    public TenantAiSettingsAppService(IRepository<TenantAiSettings, Guid> repository, IClock clock)
    {
        _repository = repository;
        _clock = clock;
    }

    public async Task<TenantAiSettingsDto> GetAsync(Guid? tenantId)
    {
        EnsureCallerAuthorized(tenantId);
        var entity = await _repository.FirstOrDefaultAsync(x => x.TenantId == tenantId);
        if (entity == null)
        {
            try
            {
                entity = new TenantAiSettings(GuidGenerator.Create(), tenantId, BuildPeriodStart(_clock.Now));
                await _repository.InsertAsync(entity, autoSave: true);
            }
            catch (Exception)
            {
                // Eşzamanlı insert yarışı: başka bir istek zaten oluşturmuş olabilir.
                entity = await _repository.FirstOrDefaultAsync(x => x.TenantId == tenantId);
                if (entity == null) throw;
            }
        }
        return ObjectMapper.Map<TenantAiSettings, TenantAiSettingsDto>(entity);
    }

    [Authorize(AiPermissions.TenantSettings.Manage)]
    public async Task<TenantAiSettingsDto> UpdateAsync(Guid? tenantId, UpdateTenantAiSettingsDto input)
    {
        EnsureHost();
        var entity = await _repository.FirstOrDefaultAsync(x => x.TenantId == tenantId)
            ?? new TenantAiSettings(GuidGenerator.Create(), tenantId, BuildPeriodStart(_clock.Now));

        entity.SetProvider(input.PreferredProvider, input.PreferredModel);
        entity.SetQuota(input.MonthlyTokenQuota);
        if (input.IsEnabled) entity.Enable();
        else entity.Disable();

        if (entity.Id == default) await _repository.InsertAsync(entity, autoSave: true);
        else await _repository.UpdateAsync(entity, autoSave: true);

        return ObjectMapper.Map<TenantAiSettings, TenantAiSettingsDto>(entity);
    }

    [Authorize(AiPermissions.TenantSettings.Manage)]
    public async Task ResetQuotaAsync(Guid? tenantId)
    {
        EnsureHost();
        var entity = await _repository.FirstOrDefaultAsync(x => x.TenantId == tenantId)
            ?? throw new UserFriendlyException("Bu tenant için AI ayarı bulunamadı.");
        entity.RecordUsage(-entity.TokensUsedThisMonth, _clock.Now);
        await _repository.UpdateAsync(entity, autoSave: true);
    }

    private static DateTime BuildPeriodStart(DateTime now) =>
        new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

    private void EnsureHost()
    {
        if (CurrentTenant.Id != null)
            throw new UserFriendlyException("Sadece host yöneticisi tenant AI ayarlarını değiştirebilir.");
    }

    private void EnsureCallerAuthorized(Guid? requestedTenantId)
    {
        if (CurrentTenant.Id != null && requestedTenantId != CurrentTenant.Id)
            throw new UserFriendlyException("Başka bir tenant'ın AI ayarına erişim yetkiniz yok.");
    }
}
