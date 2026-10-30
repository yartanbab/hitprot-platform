using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Microsoft.Extensions.Localization;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Localization;

namespace Apya.Platform.Notifications;

/// <summary>
/// Faz 4 · Hibe dışı bildirim şablonlarını HOST kataloğuna kurar. Varsayılan metin bugünkü Türkçe metindir
/// (sıralı yerler adlandırılmış değişkene çevrilir): host dokunmadıkça bildirim bir harf değişmez.
///
/// <para>🔴 HOST-ONLY: guard olmasaydı ABP her kiracı açılışında tekrar çağırır, kiracı başına kopya yazardı.
/// Var olan şablona dokunulmaz; yalnız eksik tür/hâl eklenir. Metin sunucunun dilinden bağımsız Türkçedir.</para>
/// </summary>
public class NotificationTemplateDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<NotificationTemplate, Guid> _repository;
    private readonly IStringLocalizer<PlatformResource> _l;

    public NotificationTemplateDataSeedContributor(
        IRepository<NotificationTemplate, Guid> repository,
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

        var existing = (await _repository.GetListAsync()).Select(t => (t.Type, t.Variant)).ToHashSet();

        using (CultureHelper.Use("tr"))
        {
            foreach (var d in NotificationTemplateDefinitions.All.Where(d => !existing.Contains((d.Type, d.Variant))))
            {
                await _repository.InsertAsync(new NotificationTemplate(
                    Guid.NewGuid(), d.Type, d.Variant,
                    NotificationTemplateDefinitions.ToTemplate(_l[d.TitleKey], d.TitleArgs),
                    NotificationTemplateDefinitions.ToTemplate(_l[d.BodyKey], d.BodyArgs)), autoSave: true);
            }
        }
    }
}
