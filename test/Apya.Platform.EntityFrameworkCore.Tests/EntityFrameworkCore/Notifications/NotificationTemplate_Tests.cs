using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.Notifications;
using Microsoft.Extensions.Localization;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Localization;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// Faz 4 · Görev ve proje bildirimlerinin metni host şablonundan gelir. Kilitlenen sözleşme: tohumlanan
/// şablon bugünkü metinle HARFİ HARFİNE aynı sonucu verir (host dokunmadıkça bildirim değişmez); düzenlenen
/// metin kullanılır; kapalı tür hiç üretilmez; şablon yoksa bugünkü metne düşülür.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class NotificationTemplate_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IRepository<NotificationTemplate, Guid> _repo;
    private readonly NotificationTextComposer _composer;
    private readonly IStringLocalizer<PlatformResource> _l;
    private readonly INotificationTemplateAppService _service;

    public NotificationTemplate_Tests()
    {
        _repo = GetRequiredService<IRepository<NotificationTemplate, Guid>>();
        _composer = GetRequiredService<NotificationTextComposer>();
        _l = GetRequiredService<IStringLocalizer<PlatformResource>>();
        _service = GetRequiredService<INotificationTemplateAppService>();
    }

    /// <summary>
    /// Değişken başına ayırt edilebilir örnek değer ("&lt;kalem&gt;"). Değer ADA bağlıdır: aynı değişken başlıkta
    /// ve gövdede geçebilir (bütçe aşımında {kalem}), üretici ikisine de aynı değeri verir.
    /// </summary>
    private static Dictionary<string, string?> Sample(NotificationTemplateDefinition d)
        => d.Variables.ToDictionary(v => v, v => (string?)("<" + v.Trim('{', '}') + ">"));

    private static object[] Args(string[] names, Dictionary<string, string?> values)
        => names.Select(n => (object)values[n]!).ToArray();

    [Fact]
    public async Task Tohumlanan_her_sablon_bugunku_metinle_ayni_sonucu_verir()
    {
        using (CultureHelper.Use("tr"))
        {
            foreach (var d in NotificationTemplateDefinitions.All)
            {
                var values = Sample(d);
                var text = await WithUnitOfWorkAsync(() => _composer.ComposeAsync(d.Type, d.Variant, values));

                text.ShouldNotBeNull($"{d.Type}/{d.Variant}");
                text!.Value.Title.ShouldBe(_l[d.TitleKey, Args(d.TitleArgs, values)].Value, $"{d.Type}/{d.Variant} başlık");
                text.Value.Body.ShouldBe(_l[d.BodyKey, Args(d.BodyArgs, values)].Value, $"{d.Type}/{d.Variant} gövde");
            }
        }
    }

    [Fact]
    public async Task Her_tanim_icin_bir_sablon_tohumlanir()
    {
        var rows = await WithUnitOfWorkAsync(() => _repo.GetListAsync());

        foreach (var d in NotificationTemplateDefinitions.All)
        {
            rows.Count(t => t.Type == d.Type && t.Variant == d.Variant).ShouldBe(1, $"{d.Type}/{d.Variant}");
        }
    }

    [Fact]
    public async Task Duzenlenen_metin_kullanilir_kapali_tur_uretilmez()
    {
        var console = await WithUnitOfWorkAsync(() => _service.GetAsync());
        var assigned = console.Templates.Single(t => t.Type == NotificationType.TaskAssigned);
        assigned.Name.ShouldBe("Görev atandı");

        await WithUnitOfWorkAsync(() => _service.SaveAsync(new SaveNotificationTemplateInput
        {
            Id = assigned.Id,
            Subject = "Yeni iş: {görev_adı}",
            Body = "{görev_adı} artık sizde.",
            IsEnabled = true
        }));

        var values = new Dictionary<string, string?> { ["{görev_adı}"] = "Rapor" };
        var text = await WithUnitOfWorkAsync(() =>
            _composer.ComposeAsync(NotificationType.TaskAssigned, NotificationTemplateDefinitions.Default, values));
        text!.Value.Title.ShouldBe("Yeni iş: Rapor");
        text.Value.Body.ShouldBe("Rapor artık sizde.");

        await WithUnitOfWorkAsync(() => _service.SaveAsync(new SaveNotificationTemplateInput
        {
            Id = assigned.Id,
            Subject = "Yeni iş: {görev_adı}",
            Body = "{görev_adı} artık sizde.",
            IsEnabled = false
        }));

        (await WithUnitOfWorkAsync(() =>
            _composer.ComposeAsync(NotificationType.TaskAssigned, NotificationTemplateDefinitions.Default, values)))
            .ShouldBeNull("kapalı tür hiç üretilmez");
    }

    [Fact]
    public async Task Finans_sekmesi_dokuz_metinle_gelir()
    {
        var finance = (await WithUnitOfWorkAsync(() => _service.GetAsync())).Templates
            .Where(t => t.Category == NotificationCategory.Finance)
            .ToList();

        finance.Count.ShouldBe(9, "8 tür; vadesi geçen faturanın alış ve satış hâli ayrı");
        finance.Single(t => t.Type == NotificationType.InvoiceOverdue && t.Variant == NotificationTemplateDefinitions.Purchase)
            .VariantName.ShouldBe("Alış faturası");
        finance.ShouldAllBe(t => !t.PreviewBody.Contains("{"), "önizlemede ham değişken kalmaz");
    }

    [Fact]
    public async Task Sablon_yoksa_bugunku_metne_dusulur()
    {
        await WithUnitOfWorkAsync(() => _repo.DeleteAsync(t => t.Type == NotificationType.TaskDueSoon, autoSave: true));

        using (CultureHelper.Use("tr"))
        {
            var text = await WithUnitOfWorkAsync(() => _composer.ComposeAsync(
                NotificationType.TaskDueSoon, NotificationTemplateDefinitions.Default,
                new Dictionary<string, string?> { ["{görev_adı}"] = "Rapor" }));

            text!.Value.Body.ShouldBe(_l["Notification:TaskDueSoon:Body", "Rapor"].Value);
        }
    }

    [Fact]
    public async Task Uzun_metin_bildirim_kaydina_sigacak_kadar_kisaltilir()
    {
        var text = await WithUnitOfWorkAsync(() => _composer.ComposeAsync(
            NotificationType.TaskCommentAdded, NotificationTemplateDefinitions.Default,
            new Dictionary<string, string?> { ["{yorumlayan}"] = "Ali", ["{yorum}"] = new string('x', 3000) }));

        text!.Value.Body.Length.ShouldBe(NotificationConsts.MaxBodyLength);
        text.Value.Body.ShouldEndWith("…");
    }
}
