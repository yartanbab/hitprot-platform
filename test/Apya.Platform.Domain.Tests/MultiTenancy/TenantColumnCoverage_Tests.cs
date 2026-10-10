using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.Tests.Domain.MultiTenancy;

/// <summary>
/// SEC-03 · Kiracı sütunu taşımayan varlık bir KARARDIR. Sütunsuz varlıkta izolasyon yalnız
/// "üst kayda join" disiplinine kalır; görev yorumu/eki, fatura kalemi, revizyon satırı ve takvim
/// OAuth hesabı yıllarca böyle yaşadı. Yeni bir varlık <see cref="IMultiTenant"/> uygulamıyorsa
/// buraya gerekçesiyle eklenmelidir — yoksa bu test düşer.
/// </summary>
public class TenantColumnCoverage_Tests
{
    private const string HostRecord =
        "Host kaydı: ilgili kiracıyı düz alan olarak taşır; host bütün kiracıların satırını okuduğu için süzgeçsizdir.";
    private const string HostCatalog = "Host kataloğu: kiracıya ait değildir.";

    private static string ChildOf(string parent) =>
        $"Alt satır: yalnız üst kaydı ({parent}) üzerinden okunur, kiracı üst kayıttadır. Sütun eklenmedi.";

    /// <summary>
    /// Kiracı sütunu OLMAYAN (IMultiTenant uygulamayan) varlıklar ve neden öyle oldukları.
    /// 2026-10-10 dökümü: buradaki "alt satır" gerekçesi yapıyı anlatır, her okuma yolunun
    /// denetlendiğini SÖYLEMEZ — o disiplin üst kayda join'e dayanmayı sürdürüyor.
    /// </summary>
    private static readonly Dictionary<string, string> Exempt = new()
    {
        ["Apya.Platform.Agreements.ServiceAgreement"] = HostRecord,
        ["Apya.Platform.Billing.SubscriptionInvoice"] = HostRecord,
        ["Apya.Platform.Billing.SubscriptionPayment"] = ChildOf("SubscriptionInvoice — host kaydı"),
        ["Apya.Platform.RegistrationRequests.RegistrationRequest"] = HostRecord,
        ["Apya.Platform.Tenants.TenantProfile"] = HostRecord,
        ["Apya.Platform.Tenants.TenantSubscription"] = HostRecord,
        ["Apya.Platform.Grants.GrantIdeaInvitationRecipient"] = HostRecord,
        ["Apya.Platform.Grants.GrantLead"] = HostRecord,
        ["Apya.Platform.IssueTasks.IssueTaskLink"] = HostRecord,

        ["Apya.Platform.Tenants.PlatformPackage"] = HostCatalog,
        ["Apya.Platform.Tenants.PlatformPackageFeature"] = HostCatalog,
        ["Apya.Platform.Tenants.PlatformPackagePermission"] = HostCatalog,
        ["Apya.Platform.ReleaseNotes.ReleaseNotePublication"] = HostCatalog,
        ["Apya.Platform.Grants.GrantCallDailyStat"] = HostCatalog,

        ["Apya.Platform.Tasks.TaskChecklistItem"] = ChildOf("TaskItem"),
        ["Apya.Platform.Tasks.TaskDependency"] = ChildOf("TaskItem"),
        ["Apya.Platform.Tasks.TaskDocument"] = ChildOf("TaskItem"),
        ["Apya.Platform.Tasks.TaskFavorite"] = ChildOf("TaskItem"),
        ["Apya.Platform.Tasks.TaskFeatureAssignment"] = ChildOf("TaskItem"),
        ["Apya.Platform.Tasks.TaskTagAssignment"] = ChildOf("TaskItem"),
        ["Apya.Platform.Tasks.TaskWatcher"] = ChildOf("TaskItem"),
        ["Apya.Platform.Tasks.TaskTemplateFeature"] = ChildOf("TaskTemplate"),
        ["Apya.Platform.Tasks.TaskTemplateItem"] = ChildOf("TaskTemplate"),
        ["Apya.Platform.Tasks.TaskTemplateTag"] = ChildOf("TaskTemplate"),
        ["Apya.Platform.Calendars.CalendarSyncMapping"] = ChildOf("ExternalCalendarAccount"),
        ["Apya.Platform.Documents.DocumentFileTag"] = ChildOf("DocumentFile"),
        ["Apya.Platform.DynamicAssets.AppBlock"] = ChildOf("AppDocument"),
        ["Apya.Platform.DynamicAssets.ResponseComment"] = ChildOf("AppResponse"),
        ["Apya.Platform.DynamicAssets.Webhooks.WebhookDeliveryLog"] = ChildOf("WebhookSubscription"),
        ["Apya.Platform.FxRevaluations.FxRevaluationLine"] = ChildOf("FxRevaluationSnapshot"),
    };

    private static List<Type> TenantlessEntities() => typeof(Project).Assembly.GetTypes()
        .Where(t => t.IsClass && !t.IsAbstract
                    && typeof(IEntity).IsAssignableFrom(t)
                    && !typeof(IMultiTenant).IsAssignableFrom(t))
        .OrderBy(t => t.FullName)
        .ToList();

    [Fact]
    public void Kiraci_Sutunu_Olmayan_Her_Varlik_Gerekcesiyle_Listelidir()
    {
        var unlisted = TenantlessEntities()
            .Select(t => t.FullName!)
            .Where(name => !Exempt.ContainsKey(name))
            .ToList();

        unlisted.ShouldBeEmpty(
            "Kiracı sütunu olmayan yeni varlık: ya IMultiTenant uygulayın ya da gerekçesiyle Exempt'e ekleyin → "
            + string.Join(", ", unlisted));
    }

    [Fact]
    public void Muafiyet_Listesinde_Bayat_Satir_Yoktur()
    {
        var actual = TenantlessEntities().Select(t => t.FullName!).ToHashSet();

        Exempt.Keys.Where(k => !actual.Contains(k)).ShouldBeEmpty(
            "Listedeki varlık artık yok ya da kiracı sütunu aldı; satırı kaldırın.");
    }

    [Fact]
    public void Her_Muafiyetin_Gerekcesi_Vardir()
    {
        Exempt.Where(kv => string.IsNullOrWhiteSpace(kv.Value)).Select(kv => kv.Key).ShouldBeEmpty();
    }
}
