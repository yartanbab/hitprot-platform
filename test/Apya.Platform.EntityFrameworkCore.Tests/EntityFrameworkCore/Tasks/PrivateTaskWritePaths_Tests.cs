using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Calendars;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// SÖZLEŞME: gizli görev (APYA-22), görev servisinin DIŞINDAKİ yazma yollarından da korunur —
/// görevden şablon üretme, pano sütununa taşıma, takvimden erteleme.
///
/// <para>Üçü de görevi doğrudan depodan okuyup görev servisinin kapısını atlıyordu.
/// Barındırıcı her izne "evet" dediği için kapının bağlandığı, kuralın yetkiden bağımsız dalıyla
/// ölçülür: bürünme oturumu gizli göreve hiçbir koşulda erişemez.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class PrivateTaskWritePaths_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskTemplateAppService _templateAppService;
    private readonly IBoardColumnAppService _columnAppService;
    private readonly ICalendarAppService _calendar;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ICurrentPrincipalAccessor _principalAccessor;
    private readonly ICurrentTenant _currentTenant;

    public PrivateTaskWritePaths_Tests()
    {
        _templateAppService = GetRequiredService<ITaskTemplateAppService>();
        _columnAppService = GetRequiredService<IBoardColumnAppService>();
        _calendar = GetRequiredService<ICalendarAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _principalAccessor = GetRequiredService<ICurrentPrincipalAccessor>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>Gizli göreve hiçbir koşulda erişemeyen çağıran: bürünme oturumu.</summary>
    private IDisposable AsOutsider() => _principalAccessor.Change(
        new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new(AbpClaimTypes.UserName, "gizliyi-goremeyen"),
            new(AbpClaimTypes.ImpersonatorUserId, Guid.NewGuid().ToString())
        }, "Test")));

    private async Task<TaskItem> NewTaskAsync(
        string title, bool isPrivate, Guid? projectId = null, Guid? parentTaskId = null, DateTime? dueDate = null)
    {
        var task = new TaskItem(
            Guid.NewGuid(), title, projectId: projectId, parentTaskId: parentTaskId,
            description: title + " açıklaması", dueDate: dueDate,
            isPrivate: isPrivate, tenantId: _currentTenant.Id, now: new DateTime(2026, 9, 1));

        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    /* ═══════════════ Görevden şablon üretme ═══════════════ */

    /// <summary>
    /// Şablon kiracının ORTAK kaydıdır: göremediğiniz gizli görevden şablon çıkarabilmek, başlığını
    /// ve açıklamasını şablon üzerinden herkese açmak demekti.
    /// </summary>
    [Fact]
    public async Task Gizli_gorevden_goremeyen_kisi_sablon_cikaramaz()
    {
        var secret = await NewTaskAsync("Fesih hazırlığı", isPrivate: true);

        using (AsOutsider())
        {
            var ex = await Should.ThrowAsync<BusinessException>(
                () => _templateAppService.CreateFromTaskAsync(
                    new CreateTaskTemplateFromTaskDto { TaskId = secret.Id, Name = "Sızıntı şablonu" }));

            ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskViewImpersonationDenied);
        }
    }

    [Fact]
    public async Task Sablon_gizli_alt_gorevin_basligini_almaz()
    {
        var parent = await NewTaskAsync("Web sitesi", isPrivate: false);
        await NewTaskAsync("Anasayfa", isPrivate: false, parentTaskId: parent.Id);
        await NewTaskAsync("Maaş görüşmesi", isPrivate: true, parentTaskId: parent.Id);

        var created = await _templateAppService.CreateFromTaskAsync(
            new CreateTaskTemplateFromTaskDto { TaskId = parent.Id, Name = "Site şablonu " + Guid.NewGuid().ToString("N")[..6] });

        var template = await _templateAppService.GetAsync(created.Id);

        template.Items.ShouldBe(new[] { "Anasayfa" });
    }

    /// <summary>Karşı yön: gizli görevin kendisinden, onu görebilen kişi şablon çıkarabilir.</summary>
    [Fact]
    public async Task Gizli_gorevi_gorebilen_kisi_sablon_cikarabilir()
    {
        var secret = await NewTaskAsync("Fesih hazırlığı", isPrivate: true);

        var created = await _templateAppService.CreateFromTaskAsync(
            new CreateTaskTemplateFromTaskDto { TaskId = secret.Id, Name = "Fesih şablonu " + Guid.NewGuid().ToString("N")[..6] });

        created.TaskTitle.ShouldBe("Fesih hazırlığı");
    }

    /* ═══════════════ Pano sütununa taşıma ═══════════════ */

    [Fact]
    public async Task Burunme_oturumu_gizli_gorevi_pano_sutununa_tasiyamaz()
    {
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, null,
            "Pano " + Guid.NewGuid().ToString("N")[..6], "PRJ-PNO", "", 0m, 0m, "TRY");
        await _projectRepository.InsertAsync(project, autoSave: true);

        var column = await _columnAppService.CreateAsync(new CreateBoardColumnDto { ProjectId = project.Id, Name = "Bekleyen" });
        var secret = await NewTaskAsync("Maaş görüşmesi", isPrivate: true, projectId: project.Id);
        var open = await NewTaskAsync("Anasayfa", isPrivate: false, projectId: project.Id);

        using (AsOutsider())
        {
            var ex = await Should.ThrowAsync<BusinessException>(
                () => _columnAppService.MoveTaskToColumnAsync(secret.Id, column.Id));
            ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskViewImpersonationDenied);

            // Karşı yön: açık görev aynı oturumda taşınabilir.
            await _columnAppService.MoveTaskToColumnAsync(open.Id, column.Id);
        }

        (await _taskRepository.GetAsync(secret.Id)).BoardColumnId.ShouldBeNull();
        (await _taskRepository.GetAsync(open.Id)).BoardColumnId.ShouldBe(column.Id);
    }

    /* ═══════════════ Takvimden erteleme ═══════════════ */

    /// <summary>
    /// "Aynı güne bırakma" değişiklik yapmadan başarılı dönüyordu; gizli bir görevin bitiş tarihi
    /// gün gün denenerek öğrenilebiliyordu (yanlış gün hata, doğru gün sessizlik).
    /// </summary>
    [Fact]
    public async Task Takvimde_gizli_gorev_ayni_gune_birakilinca_da_reddedilir()
    {
        var due = new DateTime(2026, 11, 20);
        var secret = await NewTaskAsync("Maaş görüşmesi", isPrivate: true, dueDate: due);

        using (AsOutsider())
        {
            var ex = await Should.ThrowAsync<BusinessException>(
                () => _calendar.RescheduleItemAsync(new RescheduleCalendarItemInput
                {
                    Source = CalendarSourceType.Task,
                    SourceId = secret.Id,
                    NewDate = due
                }));

            ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskViewImpersonationDenied);
        }
    }
}
