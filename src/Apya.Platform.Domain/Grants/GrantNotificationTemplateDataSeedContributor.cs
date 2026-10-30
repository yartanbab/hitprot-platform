using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Microsoft.Extensions.Localization;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Localization;

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

        var templates = await _repository.GetListAsync();

        // Tohumlama eskiden sunucunun diliyle yazıyordu; İngilizce Windows'ta şablonlar
        // İngilizce kuruldu. Hâlâ İngilizce varsayılanında duran (host'un dokunmadığı)
        // şablon Türkçeye çevrilir; host'un düzenlediği metne dokunulmaz.
        foreach (var template in templates)
        {
            var english = DefaultText(template.Trigger, "en");
            if (template.Subject == english.Subject && template.Body == english.Body)
            {
                var turkish = DefaultText(template.Trigger, "tr");
                template.SetText(turkish.Subject, turkish.Body);
                await _repository.UpdateAsync(template, autoSave: true);
            }
        }

        // Rol şablonu Genel'in yerine geçmez: her tetikleyicinin bir Genel şablonu olmalı.
        var existing = templates
            .Where(t => t.Audience == GrantNotificationAudience.Genel)
            .Select(t => t.Trigger)
            .ToHashSet();

        foreach (var trigger in GrantNotificationTriggerRegistry.All)
        {
            if (existing.Contains(trigger))
            {
                continue;
            }

            var text = DefaultText(trigger, "tr");
            var template = new GrantNotificationTemplate(
                Guid.NewGuid(),
                trigger,
                text.Subject,
                text.Body,
                inApp: true,
                // E-posta yalnız kaçırılması pahalıya patlayan tetikleyicilerde açık gelir;
                // kalanı uygulama içinde kalır ve günlük özete düşer. Mesaj ve sıra devri
                // ANINDA e-postayla gider (kullanıcı kararı 10-19): iki taraflı başvuruda yanıt
                // bekleyen taraf ekrana bakmadıkça haberi olmuyordu.
                email: trigger is GrantNotificationTrigger.DecisionIssued
                                or GrantNotificationTrigger.DocumentDeadlineNear
                                or GrantNotificationTrigger.ReportDeadlineNear
                                or GrantNotificationTrigger.MessageReceived
                                or GrantNotificationTrigger.HandedOver);

            await _repository.InsertAsync(template, autoSave: true);
        }
    }

    /// <summary>Varsayılan metin, sunucunun dilinden bağımsız olarak istenen dilde.</summary>
    private (string Subject, string Body) DefaultText(GrantNotificationTrigger trigger, string culture)
    {
        using (CultureHelper.Use(culture))
        {
            return (_l[$"Grants:Notify:Trigger:{trigger}:Subject"], _l[$"Grants:Notify:Trigger:{trigger}:Body"]);
        }
    }
}
