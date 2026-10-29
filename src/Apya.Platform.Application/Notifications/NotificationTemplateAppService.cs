using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Notifications;

/// <summary>
/// Faz 4 · Host: hibe dışı bildirimlerin metni ve aç/kapa (kullanıcı kararı 10-29: Görev, Proje, Finans).
///
/// <para>🔴 HOST-ONLY: şablon bütün kiracılara aynı gider. İzin yalnız host'ta bulunan kiracı yönetimi iznidir;
/// kiracı bağlamından çağrılırsa ayrıca yetki hatası verilir. Şablonlar tohumlamayla gelir; ekran ekleme/silme
/// SUNMAZ — tür ve hâl listesi koda bağlıdır (<see cref="NotificationTemplateDefinitions"/>).</para>
/// </summary>
[Authorize(TenantManagementPermissions.Tenants.Update)]
public class NotificationTemplateAppService : PlatformAppService, INotificationTemplateAppService
{
    private readonly IRepository<NotificationTemplate, Guid> _repo;
    private readonly ICurrentTenant _currentTenant;

    public NotificationTemplateAppService(IRepository<NotificationTemplate, Guid> repo, ICurrentTenant currentTenant)
    {
        _repo = repo;
        _currentTenant = currentTenant;
    }

    public async Task<NotificationTemplateConsoleDto> GetAsync()
    {
        EnsureHostContext();
        return await BuildAsync();
    }

    public async Task<NotificationTemplateConsoleDto> SaveAsync(SaveNotificationTemplateInput input)
    {
        EnsureHostContext();

        var template = await _repo.FindAsync(input.Id)
                       ?? throw new BusinessException(PlatformDomainErrorCodes.NotificationTemplateNotFound);

        template.SetText(input.Subject, input.Body);
        template.SetEnabled(input.IsEnabled);
        await _repo.UpdateAsync(template, autoSave: true);

        return await BuildAsync();
    }

    private void EnsureHostContext()
    {
        if (_currentTenant.Id != null)
        {
            throw new AbpAuthorizationException();
        }
    }

    private async Task<NotificationTemplateConsoleDto> BuildAsync()
    {
        var order = NotificationTemplateDefinitions.All
            .Select((d, i) => (d.Type, d.Variant, i))
            .ToDictionary(x => (x.Type, x.Variant), x => x.i);
        var sample = SampleValues();

        var items = (await _repo.GetListAsync())
            .Where(t => order.ContainsKey((t.Type, t.Variant)))
            // Sıra tanım sırasıdır: görev akışı, sonra proje.
            .OrderBy(t => order[(t.Type, t.Variant)])
            .Select(t => new NotificationTemplateDto
            {
                Id = t.Id,
                Type = t.Type,
                Variant = t.Variant,
                Category = NotificationTypeRegistry.Get(t.Type).Category,
                Name = L[$"Notify:Type:{t.Type}"],
                VariantName = t.Variant == NotificationTemplateDefinitions.Default ? null : L[$"Notify:Variant:{t.Variant}"].Value,
                Subject = t.Subject,
                Body = t.Body,
                IsEnabled = t.IsEnabled,
                Variables = NotificationTemplateDefinitions.Find(t.Type, t.Variant)!.Variables.ToList(),
                PreviewSubject = GrantNotificationRenderer.Render(t.Subject, sample),
                PreviewBody = GrantNotificationRenderer.Render(t.Body, sample)
            })
            .ToList();

        return new NotificationTemplateConsoleDto
        {
            Templates = items,
            EnabledCount = items.Count(t => t.IsEnabled)
        };
    }

    /// <summary>Önizleme için ÖRNEK değerler; gerçek bir kayıttan okunmaz (ekranda yazılı).</summary>
    private Dictionary<string, string?> SampleValues()
    {
        var date = Clock.Now.Date.AddDays(14).ToString("dd.MM.yyyy");

        return new Dictionary<string, string?>
        {
            ["{görev_adı}"] = L["Notify:Sample:Task"],
            ["{yorumlayan}"] = L["Notify:Sample:Person"],
            ["{değiştiren}"] = L["Notify:Sample:Person"],
            ["{yorum}"] = L["Notify:Sample:Comment"],
            ["{durum}"] = L["Tasks:Status:Done"],
            ["{yeni_tarih}"] = date,
            ["{gecikme_gün}"] = "3",
            ["{proje_adı}"] = L["Notify:Sample:Project"],
            ["{rol}"] = L["Notification:ProjectRole:Lead"],
            ["{kalan_gün}"] = "14",
            ["{bitiş_tarihi}"] = date,
            ["{açık_görev_sayısı}"] = "5",
            ["{gösterge}"] = L["Notify:Sample:Indicator"],
            ["{hedef_tarih}"] = date,
            ["{gerçekleşen}"] = L["Notify:Sample:Actual"],
            ["{hedef}"] = L["Notify:Sample:Target"],
            ["{ilerleme}"] = "40"
        };
    }
}
