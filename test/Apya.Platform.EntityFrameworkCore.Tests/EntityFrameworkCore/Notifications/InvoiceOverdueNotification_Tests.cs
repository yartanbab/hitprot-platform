using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Invoices;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// B-16 · Vadesi geçen, kapanmamış fatura proje sorumlusuna (fatura yetkisiyle) bir kez bildirilir; ödenmiş fatura ve
/// yetkisiz kişi bildirim almaz.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class InvoiceOverdueNotification_Tests : PlatformEntityFrameworkCoreTestBase
{
    [Fact]
    public void Izin_adi_PlatformPermissions_ile_ayni()
        => InvoiceOverdueNotifier.ViewPermission.ShouldBe(PlatformPermissions.Invoices.Default);

    private async Task<Guid> UserAsync(bool canSeeInvoices)
    {
        var id = Guid.NewGuid();
        var suffix = id.ToString("N")[..8];
        await WithUnitOfWorkAsync(async () =>
        {
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(
                new IdentityUser(id, "finans-" + suffix, $"finans-{suffix}@apya.test"), autoSave: true);
            if (canSeeInvoices)
            {
                await GetRequiredService<IPermissionGrantRepository>().InsertAsync(new PermissionGrant(
                    Guid.NewGuid(), PlatformPermissions.Invoices.Default, UserPermissionValueProvider.ProviderName, id.ToString()), autoSave: true);
            }
        });
        return id;
    }

    private async Task<Guid> InvoiceAsync(Guid projectId, int daysOverdue, bool paid = false)
    {
        var id = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            var invoice = new Invoice(id, null, projectId, "FTR-" + id.ToString("N")[..6], DateTime.Today.AddDays(-40),
                DateTime.Today.AddDays(-daysOverdue), 20, "TRY", InvoiceDirection.Sales, null, null);
            invoice.AddItem(Guid.NewGuid(), "Danışmanlık", 1, 1000);
            if (paid) { invoice.UpdateStatus(10_000); }
            await GetRequiredService<IRepository<Invoice, Guid>>().InsertAsync(invoice, autoSave: true);
        });
        return id;
    }

    private Task<int> CountAsync(Guid userId, Guid invoiceId)
        => WithUnitOfWorkAsync(async () => (await GetRequiredService<IRepository<Notification, Guid>>()
            .GetListAsync(n => n.UserId == userId && n.EntityId == invoiceId && n.Type == NotificationType.InvoiceOverdue)).Count);

    [Fact]
    public async Task Geciken_fatura_yetkili_proje_sorumlusuna_bir_kez_bildirilir()
    {
        var lead = await UserAsync(canSeeInvoices: true);
        var leadWithoutPermission = await UserAsync(canSeeInvoices: false);
        var projectId = Guid.NewGuid();
        var suffix = projectId.ToString("N")[..6];
        await WithUnitOfWorkAsync(async () =>
        {
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, null, null, "Fatura Projesi " + suffix, "FP-" + suffix[..4], "açıklama"), autoSave: true);
            var members = GetRequiredService<IRepository<ProjectMember, Guid>>();
            await members.InsertAsync(new ProjectMember(Guid.NewGuid(), projectId, lead, ProjectMemberRole.Lead), autoSave: true);
            await members.InsertAsync(new ProjectMember(Guid.NewGuid(), projectId, leadWithoutPermission, ProjectMemberRole.Lead), autoSave: true);
        });
        var overdue = await InvoiceAsync(projectId, daysOverdue: 3);
        var paid = await InvoiceAsync(projectId, daysOverdue: 3, paid: true);
        var notifier = GetRequiredService<InvoiceOverdueNotifier>();

        await WithUnitOfWorkAsync(() => notifier.RunAsync(DateTime.Now));
        await WithUnitOfWorkAsync(() => notifier.RunAsync(DateTime.Now)); // işçi saatte bir koşar

        (await CountAsync(lead, overdue)).ShouldBe(1);
        (await CountAsync(leadWithoutPermission, overdue)).ShouldBe(0, "fatura yetkisi olmayana gitmez");
        (await CountAsync(lead, paid)).ShouldBe(0, "ödenmiş fatura gecikmiş değildir");
    }
}
