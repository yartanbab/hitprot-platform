using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.ChoiceSources;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.DynamicAssets;

/// <summary>
/// Formdaki "projenin görevleri" canlı listesi görev BAŞLIĞI verir; gizli görev (APYA-22) burada da
/// görev listesiyle aynı kuralla süzülür.
///
/// <para>Kaynak görevi doğrudan depodan okuyordu: formu dolduran herkes, göremediği gizli
/// görevlerin başlıklarını açılır listede okuyordu. Barındırıcı her izne "evet" dediği için
/// süzgecin bağlandığı, kuralın yetkiden bağımsız dalıyla ölçülür (bürünme oturumu gizli görevi
/// hiç görmez).</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FormTaskChoicePrivacy_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IFormChoiceSource _source;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentPrincipalAccessor _principalAccessor;
    private readonly ICurrentTenant _currentTenant;

    public FormTaskChoicePrivacy_Tests()
    {
        _source = GetRequiredService<IEnumerable<IFormChoiceSource>>()
            .Single(s => s.Key == FormChoiceSources.TenantProjectTasks);
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _principalAccessor = GetRequiredService<ICurrentPrincipalAccessor>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private IDisposable AsOutsider() => _principalAccessor.Change(
        new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new(AbpClaimTypes.UserName, "gizliyi-goremeyen"),
            new(AbpClaimTypes.ImpersonatorUserId, Guid.NewGuid().ToString())
        }, "Test")));

    private async Task<TaskItem> NewTaskAsync(Guid projectId, string title, bool isPrivate)
    {
        var task = new TaskItem(
            Guid.NewGuid(), title, projectId,
            isPrivate: isPrivate, tenantId: _currentTenant.Id, now: new DateTime(2026, 9, 1));

        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    [Fact]
    public async Task Gorev_secenek_listesi_gizli_gorevi_goremeyene_vermez()
    {
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, null,
            "Form listesi " + Guid.NewGuid().ToString("N")[..6], "PRJ-FRM", "", 0m, 0m, "TRY");
        await _projectRepository.InsertAsync(project, autoSave: true);

        await NewTaskAsync(project.Id, "Anasayfa tasarımı", isPrivate: false);
        await NewTaskAsync(project.Id, "Maaş görüşmesi", isPrivate: true);

        // Karşı yön: görebilen (oluşturan / ekip yöneticisi) ikisini de alır.
        (await _source.GetAsync(project.Id.ToString())).Select(c => c.Label)
            .ShouldBe(new[] { "Anasayfa tasarımı", "Maaş görüşmesi" });

        using (AsOutsider())
        {
            (await _source.GetAsync(project.Id.ToString())).Select(c => c.Label)
                .ShouldBe(new[] { "Anasayfa tasarımı" });
        }
    }
}
