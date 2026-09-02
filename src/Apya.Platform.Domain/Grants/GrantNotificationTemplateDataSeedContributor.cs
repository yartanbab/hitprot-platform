using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Microsoft.Extensions.Localization;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Grants;

/// <summary>
/// 6d · Yedi tetikleyicinin varsayılan şablonunu HOST kataloğuna kurar.
///
/// <para>🔴 HOST-ONLY: şablon <c>TenantId=null</c> ile yaşar; guard olmasaydı ABP her
/// yeni kiracı açılışında tekrar çağırır ve kiracı başına kopya yazardı.</para>
///
/// <para>Metin koda gömülmez — varsayılanlar <c>tr.json</c>'dan okunur. Host şablonu
/// düzenlediyse tohumlama geri ALMAZ: eksik tetikleyici varsa yalnız onu ekler.</para>
/// </summary>
public class GrantNotificationTemplateDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<GrantNotificationTemplate, Guid> _repository;
    private readonly IStringLocalizer<PlatformResource> _l;

    public GrantNotificationTemplateDataSeedContributor(
        IRepository<GrantNotificationTemplate, Guid> repository,
        IStringLocalizer<PlatformResource> l)
    {
        _repository = repository;
        _l = l;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return;
        }

        var existing = (await _repository.GetListAsync()).Select(t => t.Trigger).ToHashSet();

        foreach (var trigger in GrantNotificationTriggerRegistry.All)
        {
            if (existing.Contains(trigger))
            {
                continue;
            }

            var template = new GrantNotificationTemplate(
                Guid.NewGuid(),
                trigger,
                _l[$"Grants:Notify:Trigger:{trigger}:Subject"],
                _l[$"Grants:Notify:Trigger:{trigger}:Body"],
                inApp: true,
                // E-posta yalnız kaçırılması pahalıya patlayan üç tetikleyicide açık
                // gelir; kalanı uygulama içinde kalır ve günlük özete düşer.
                email: trigger is GrantNotificationTrigger.DecisionIssued
                                or GrantNotificationTrigger.DocumentDeadlineNear
                                or GrantNotificationTrigger.ReportDeadlineNear);

            await _repository.InsertAsync(template, autoSave: true);
        }
    }
}
