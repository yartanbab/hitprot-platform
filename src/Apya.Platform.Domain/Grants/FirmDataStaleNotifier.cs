using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Geçerlilik süresi dolan kurum bilgilerini kurumun yöneticilerine bildirir. Süresi dolan değer
/// eşleştirmede "bilinmiyor" sayılır (çağrı Koşullu olur); kurum bunu ancak ekrana girince
/// görüyordu.
///
/// <para>Tekillik bildirim tarafında: DEĞER + SON TEYİT TARİHİ başına bir kez. Kurum "hâlâ güncel"
/// deyip tarihi yenilerse, yeni süre dolduğunda yeniden bildirilir.</para>
///
/// <para>Yalnız son <see cref="LookbackDays"/> günde süresi dolanlar: özellik yayına girdiğinde
/// çoktan dolmuş değerler toplu bildirilmesin. İşçiden ayrı (doğrudan ölçülür); işçi yalnız çağırır.</para>
/// </summary>
public class FirmDataStaleNotifier : ITransientDependency
{
    public const int LookbackDays = 30;

    /// <summary>PlatformPermissions.TenantSettings.Default — Domain sabite başvuramaz; değer eşitliği testle kilitli.</summary>
    public const string RecipientPermission = "Platform.TenantSettings";

    private readonly IRepository<FirmParameterDefinition, Guid> _definitionRepository;
    private readonly IRepository<FirmParameterValue, Guid> _valueRepository;
    private readonly IDataFilter<IMultiTenant> _tenantFilter;
    private readonly ICurrentTenant _currentTenant;
    private readonly NotificationManager _notificationManager;
    private readonly PermittedUserFinder _permittedUsers;
    private readonly NotificationTextComposer _texts;

    public FirmDataStaleNotifier(
        IRepository<FirmParameterDefinition, Guid> definitionRepository,
        IRepository<FirmParameterValue, Guid> valueRepository,
        IDataFilter<IMultiTenant> tenantFilter,
        ICurrentTenant currentTenant,
        NotificationManager notificationManager,
        PermittedUserFinder permittedUsers,
        NotificationTextComposer texts)
    {
        _definitionRepository = definitionRepository;
        _valueRepository = valueRepository;
        _tenantFilter = tenantFilter;
        _currentTenant = currentTenant;
        _notificationManager = notificationManager;
        _permittedUsers = permittedUsers;
        _texts = texts;
    }

    /// <summary>Üretilen bildirim sayısı.</summary>
    public async Task<int> RunAsync(DateTime now)
    {
        var today = now.Date;
        var from = today.AddDays(-LookbackDays);

        // Süresi olan, kullanımdaki kullanıcı parametreleri (katalog host'ta, IMultiTenant değil).
        var definitions = (await _definitionRepository.GetListAsync(
                d => d.ValidityMonths != null && d.IsActive && d.SystemKey == null))
            .ToDictionary(d => d.Id);
        if (definitions.Count == 0)
        {
            return 0;
        }

        // Değerler kurumlara dağınık: OKUMA için filtre bilinçli kapatılır; yayın kurum bağlamında.
        // Süre hesabı (AddMonths) iki sağlayıcıda aynı SQL'e çevrilmediği için bellekte yapılır;
        // tablo kurum × parametre kadardır.
        List<FirmParameterValue> stale;
        using (_tenantFilter.Disable())
        {
            var ids = definitions.Keys.ToList();
            stale = (await _valueRepository.GetListAsync(v => ids.Contains(v.DefinitionId) && v.TenantId != null))
                .Where(v =>
                {
                    var expiredOn = v.ConfirmedAt.Date.AddMonths(definitions[v.DefinitionId].ValidityMonths!.Value);
                    return expiredOn < today && expiredOn >= from;
                })
                .ToList();
        }

        var published = 0;
        foreach (var tenantGroup in stale.GroupBy(v => v.TenantId))
        {
            using (_currentTenant.Change(tenantGroup.Key))
            {
                var recipients = await _permittedUsers.WithPermissionAsync(
                    await _permittedUsers.ActiveUserIdsAsync(), RecipientPermission);
                if (recipients.Count == 0)
                {
                    continue;
                }

                foreach (var value in tenantGroup)
                {
                    var definition = definitions[value.DefinitionId];
                    if (await _texts.ComposeAsync(NotificationType.FirmDataStale, NotificationTemplateDefinitions.Default,
                            new Dictionary<string, string?>
                            {
                                ["{bilgi}"] = definition.Name,
                                ["{son_güncelleme}"] = value.ConfirmedAt.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture)
                            }) is not { } text)
                    {
                        continue; // tür host tarafından kapatıldı
                    }

                    var onceKey = $"{(int)NotificationType.FirmDataStale}:FirmParameter:{definition.Id}:{value.ConfirmedAt:yyyyMMdd}";
                    foreach (var userId in recipients)
                    {
                        if (await _notificationManager.PublishOnceAsync(
                                userId, onceKey, text.Title, text.Body, NotificationType.FirmDataStale,
                                entityType: "FirmParameter", entityId: definition.Id))
                        {
                            published++;
                        }
                    }
                }
            }
        }

        return published;
    }
}
