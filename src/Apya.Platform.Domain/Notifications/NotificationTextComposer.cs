using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Localization;
using Microsoft.Extensions.Localization;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Notifications;

/// <summary>
/// Faz 4 · Hibe dışı bildirimin başlık ve gövdesini üretir: host şablonu varsa onu, yoksa bugünkü
/// yerelleştirilmiş metni (<see cref="NotificationTemplateDefinitions"/>) değişkenlerle doldurur.
///
/// <para>Şablon yoksa (DbMigrator henüz koşmadı) bildirim düşmez, eski metinle gider. Host şablonu kapattıysa
/// <c>null</c> döner: üretici bildirimi hiç yayınlamaz.</para>
///
/// <para>Doldurulmuş metin bildirim kaydının sınırlarına kısaltılır: yorum gibi serbest metin içeren değişken
/// gövdeyi 1024 karakterin üstüne taşırsa kayıt veritabanında düşerdi.</para>
/// </summary>
public class NotificationTextComposer : ITransientDependency
{
    private readonly IRepository<NotificationTemplate, Guid> _templateRepo;
    private readonly IStringLocalizer<PlatformResource> _l;
    private readonly IDataFilter _dataFilter;

    public NotificationTextComposer(
        IRepository<NotificationTemplate, Guid> templateRepo,
        IStringLocalizer<PlatformResource> l,
        IDataFilter dataFilter)
    {
        _templateRepo = templateRepo;
        _l = l;
        _dataFilter = dataFilter;
    }

    /// <returns>Bildirim kapalıysa <c>null</c>.</returns>
    public async Task<(string Title, string Body)?> ComposeAsync(
        NotificationType type, string variant, IReadOnlyDictionary<string, string?> values)
    {
        var definition = NotificationTemplateDefinitions.Find(type, variant)
                         ?? throw new ArgumentException($"Tanımsız bildirim metni: {type}/{variant}", nameof(variant));

        NotificationTemplate? template;
        // Host kataloğu: kiracı bağlamından da okunur; Disable() tüm kiracılara açtığı için TenantId ELLE.
        using (_dataFilter.Disable<IMultiTenant>())
        {
            template = (await _templateRepo.GetListAsync(
                t => t.TenantId == null && t.Type == type && t.Variant == variant)).FirstOrDefault();
        }

        if (template is { IsEnabled: false })
        {
            return null;
        }

        var subject = template?.Subject ?? NotificationTemplateDefinitions.ToTemplate(_l[definition.TitleKey], definition.TitleArgs);
        var body = template?.Body ?? NotificationTemplateDefinitions.ToTemplate(_l[definition.BodyKey], definition.BodyArgs);

        return (Fit(GrantNotificationRenderer.Render(subject, values), NotificationConsts.MaxTitleLength),
                Fit(GrantNotificationRenderer.Render(body, values), NotificationConsts.MaxBodyLength));
    }

    private static string Fit(string text, int max)
        => text.Length <= max ? text : text[..(max - 1)].TrimEnd() + "…";
}
