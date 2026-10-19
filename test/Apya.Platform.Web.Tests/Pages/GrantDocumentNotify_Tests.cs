using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// N-06 · Hibe evrakı ve danışman ataması muhatabına ulaşır: firma yükleyince danışman (atanmamışsa
/// host ekibi), danışman onaylayınca firma, başvuruya danışman atanınca atanan kişi. Üçü de sessizdi.
/// </summary>
public class GrantDocumentNotify_Tests : PlatformWebTestBase
{
    private readonly IGrantApplicationDocumentAppService _documents;
    private readonly ICurrentTenant _currentTenant;
    private readonly IUnitOfWorkManager _uow;

    public GrantDocumentNotify_Tests()
    {
        _documents = GetRequiredService<IGrantApplicationDocumentAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _uow = GetRequiredService<IUnitOfWorkManager>();
    }

    private async Task<(Guid TenantId, Guid ApplicationId, Guid FirmUserId)> CreateFirmApplicationAsync()
    {
        using var uow = _uow.Begin(requiresNew: true);
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("Evrakci-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik && c.TenantId == null)).First();
        call.SetSchedule(call.OpenDate, DateTime.Now.Date.AddDays(30));
        await callRepo.UpdateAsync(call, autoSave: true);

        var application = new GrantApplication(Guid.NewGuid(), tenant.Id, call.Id);
        await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(application, autoSave: true);

        Guid firmUserId;
        using (_currentTenant.Change(tenant.Id))
        {
            var user = new IdentityUser(Guid.NewGuid(), "evrak-" + Guid.NewGuid().ToString("N")[..6],
                Guid.NewGuid().ToString("N")[..8] + "@ornek.test", tenant.Id);
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(user, autoSave: true);
            firmUserId = user.Id;
        }

        await uow.CompleteAsync();
        return (tenant.Id, application.Id, firmUserId);
    }

    private async Task<Guid> FirmUploadsAsync(Guid tenantId, Guid applicationId)
    {
        using (_currentTenant.Change(tenantId))
        {
            var console = await _documents.AddAsync(new AddGrantDocumentInput
            {
                ApplicationId = applicationId,
                Name = "Faaliyet belgesi",
                UploaderParty = GrantPartyRole.Firma
            });
            var documentId = console.Documents.Single(d => d.Name == "Faaliyet belgesi").Id;

            await _documents.RegisterVersionAsync(new RegisterGrantDocumentVersionInput
            {
                DocumentId = documentId,
                StoredFileName = Guid.NewGuid().ToString("N") + ".pdf",
                OriginalFileName = "faaliyet.pdf",
                SizeBytes = 1024
            });
            return documentId;
        }
    }

    private async Task<Notification[]> NotificationsAsync(Guid applicationId, NotificationType type)
    {
        using var uow = _uow.Begin(requiresNew: true);
        using (GetRequiredService<IDataFilter>().Disable<IMultiTenant>())
        {
            return (await GetRequiredService<IRepository<Notification, Guid>>()
                .GetListAsync(n => n.EntityId == applicationId && n.Type == type)).ToArray();
        }
    }

    [Fact]
    public async Task Firma_yukleyince_danisman_tarafi_haberdar_olur()
    {
        var (tenantId, id, firmUserId) = await CreateFirmApplicationAsync();

        await FirmUploadsAsync(tenantId, id);

        var notes = await NotificationsAsync(id, NotificationType.GrantDocumentUploaded);
        notes.ShouldNotBeEmpty("atama yokken host ekibine gider");
        notes.ShouldAllBe(n => n.TenantId == null);
        notes.ShouldNotContain(n => n.UserId == firmUserId, "yükleyen taraf kendine bildirim almaz");
        notes.ShouldAllBe(n => n.Body.Contains("Faaliyet belgesi"));
    }

    [Fact]
    public async Task Danisman_onaylayinca_firma_haberdar_olur()
    {
        var (tenantId, id, firmUserId) = await CreateFirmApplicationAsync();
        var documentId = await FirmUploadsAsync(tenantId, id);

        await _documents.ApproveAsync(new ReviewGrantDocumentInput { DocumentId = documentId });

        var notes = await NotificationsAsync(id, NotificationType.GrantDocumentApproved);
        notes.ShouldContain(n => n.UserId == firmUserId);
        notes.ShouldAllBe(n => n.TenantId == tenantId);
    }

    [Fact]
    public async Task Basvuruya_atanan_danisman_haberdar_olur()
    {
        var (_, id, _) = await CreateFirmApplicationAsync();
        Guid consultantId;
        using (var uow = _uow.Begin(requiresNew: true))
        {
            var consultant = new IdentityUser(Guid.NewGuid(), "danisman-" + Guid.NewGuid().ToString("N")[..6],
                Guid.NewGuid().ToString("N")[..8] + "@ornek.test");
            consultant.Name = "Deniz";
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(consultant, autoSave: true);
            consultantId = consultant.Id;
            await uow.CompleteAsync();
        }

        await GetRequiredService<IGrantPipelineAppService>().AssignAsync(
            new AssignGrantApplicationInput { ApplicationId = id, UserId = consultantId });

        var notes = await NotificationsAsync(id, NotificationType.GrantApplicationAssigned);
        notes.ShouldHaveSingleItem().UserId.ShouldBe(consultantId);
        notes[0].TenantId.ShouldBeNull("bildirim host kullanıcısınındır");
        notes[0].Body.ShouldContain("Evrakci-");
    }
}
