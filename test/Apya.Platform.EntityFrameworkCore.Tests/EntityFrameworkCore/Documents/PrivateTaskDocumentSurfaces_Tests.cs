using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Documents;

/// <summary>
/// SÖZLEŞME: gizli görev (APYA-22) belge ekranlarında da süzülür — proje kapsam ağacı ve
/// uyum kalemlerinin "kaynak görev" adı.
///
/// <para>İki servis de görevi doğrudan depodan okuyordu: kapsam ağacı gizli görevin başlığını,
/// durumunu, tarihlerini ve atananını <c>Documents.Default</c>'u olan herkese basıyor; uyum
/// kalemi eklerken yazılan herhangi bir görev kimliği başlığıyla geri yankılanıyordu.</para>
///
/// <para>Barındırıcı her izne "evet" dediği için süzgecin bağlandığı, kuralın yetkiden bağımsız
/// dalıyla ölçülür: bürünme oturumu gizli görevi hiç görmez.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class PrivateTaskDocumentSurfaces_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectScopeAppService _scopeAppService;
    private readonly IComplianceAppService _complianceAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentPrincipalAccessor _principalAccessor;
    private readonly ICurrentTenant _currentTenant;

    public PrivateTaskDocumentSurfaces_Tests()
    {
        _scopeAppService = GetRequiredService<IProjectScopeAppService>();
        _complianceAppService = GetRequiredService<IComplianceAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _principalAccessor = GetRequiredService<ICurrentPrincipalAccessor>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>Gizli görevi hiçbir koşulda göremeyen çağıran: bürünme oturumu.</summary>
    private IDisposable AsOutsider() => _principalAccessor.Change(
        new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new(AbpClaimTypes.UserName, "gizliyi-goremeyen"),
            new(AbpClaimTypes.ImpersonatorUserId, Guid.NewGuid().ToString())
        }, "Test")));

    private async Task<Guid> NewProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, grantId: null,
            name: "Gizlilik " + Guid.NewGuid().ToString("N")[..6], code: "GZL-1", description: "gizlilik testi",
            totalBudget: 0, currency: "TRY",
            startDate: new DateTime(2026, 1, 1), endDate: new DateTime(2026, 12, 31));

        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private async Task<TaskItem> NewTaskAsync(string title, bool isPrivate, Guid? projectId = null, Guid? parentTaskId = null)
    {
        var task = new TaskItem(
            Guid.NewGuid(), title, projectId: projectId, parentTaskId: parentTaskId,
            isPrivate: isPrivate, tenantId: _currentTenant.Id, now: DateTime.Now);

        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    /* ═══════════════ Proje kapsam ağacı ═══════════════ */

    [Fact]
    public async Task Kapsam_agaci_gizli_gorevi_goremeyene_basmaz()
    {
        var projectId = await NewProjectAsync();
        var open = await NewTaskAsync("Anasayfa tasarımı", isPrivate: false, projectId);
        var openChild = await NewTaskAsync("Hero görseli", isPrivate: false, projectId, open.Id);
        var secret = await NewTaskAsync("Maaş görüşmesi", isPrivate: true, projectId);
        var secretChild = await NewTaskAsync("Zam teklifi", isPrivate: true, projectId, open.Id);

        var all = new[] { open.Id, openChild.Id, secret.Id, secretChild.Id };

        // Karşı yön: görebilen dördünü de alır.
        (await TaskRowsAsync(projectId)).ShouldBe(all, ignoreOrder: true);

        using (AsOutsider())
        {
            (await TaskRowsAsync(projectId)).ShouldBe(new[] { open.Id, openChild.Id }, ignoreOrder: true);
        }
    }

    private async Task<List<Guid>> TaskRowsAsync(Guid projectId)
    {
        var branch = await _scopeAppService.GetBranchAsync(projectId);

        return branch.Rows
            .Where(r => r.Kind is ScopeRowKind.Task or ScopeRowKind.SubTask)
            .Select(r => r.EntityId!.Value)
            .ToList();
    }

    /* ═══════════════ Uyum kalemi: kaynak görev adı ═══════════════ */

    [Fact]
    public async Task Uyum_kalemi_gizli_gorevin_adini_goremeyene_dondurmez()
    {
        var secret = await NewTaskAsync("Maaş görüşmesi", isPrivate: true);
        var packageId = await NewPackageAsync();

        var created = await _complianceAppService.AddRequirementAsync(packageId, TaskRequirement(secret.Id));
        created.SourceEntityName.ShouldNotBeNull();
        created.SourceEntityName.ShouldContain("Maaş görüşmesi");

        using (AsOutsider())
        {
            var requirement = (await _complianceAppService.GetRequirementListAsync(packageId)).ShouldHaveSingleItem();

            // Kalem durur (bağ kopmaz), yalnız ad dönmez — silinmiş görevle aynı görünüm.
            requirement.SourceEntityId.ShouldBe(secret.Id);
            requirement.SourceEntityName.ShouldBeNull();
        }
    }

    /// <summary>
    /// Kimlikten başlık öğrenme yolu: kalem EKLERKEN yazılan görev kimliği, yanıtta görevin
    /// başlığıyla dönüyordu. Göremeyen kişi için yanıtta ad olmamalı.
    /// </summary>
    [Fact]
    public async Task Uyum_kalemi_eklemek_gizli_gorevin_adini_ogretmez()
    {
        var secret = await NewTaskAsync("Fesih hazırlığı", isPrivate: true);
        var packageId = await NewPackageAsync();

        using (AsOutsider())
        {
            var created = await _complianceAppService.AddRequirementAsync(packageId, TaskRequirement(secret.Id));

            created.SourceEntityName.ShouldBeNull();
        }
    }

    /// <summary>Karşı yön: açık görevin adı herkese dönmeye devam eder.</summary>
    [Fact]
    public async Task Uyum_kalemi_acik_gorevin_adini_dondurur()
    {
        var open = await NewTaskAsync("Anasayfa tasarımı", isPrivate: false);
        var packageId = await NewPackageAsync();
        await _complianceAppService.AddRequirementAsync(packageId, TaskRequirement(open.Id));

        using (AsOutsider())
        {
            (await _complianceAppService.GetRequirementListAsync(packageId))
                .ShouldHaveSingleItem().SourceEntityName!.ShouldContain("Anasayfa tasarımı");
        }
    }

    private async Task<Guid> NewPackageAsync()
    {
        var package = await _complianceAppService.CreatePackageAsync(new CreateUpdateCompliancePackageDto
        {
            Name = "Gizlilik paketi " + Guid.NewGuid().ToString("N")[..6],
            Issuer = "İç politika"
        });

        return package.Id;
    }

    private static CreateUpdateComplianceRequirementDto TaskRequirement(Guid taskId) => new()
    {
        Title = "Görev eki",
        Source = ComplianceRequirementSource.TaskAttachment,
        SourceEntityId = taskId
    };
}
