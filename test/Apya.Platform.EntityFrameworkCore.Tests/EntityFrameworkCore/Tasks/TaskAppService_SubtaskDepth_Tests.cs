using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// SÖZLEŞME: alt görevler ana görevin altında en fazla <see cref="TaskConsts.MaxSubTaskDepth"/> düzey
/// iç içe olabilir; sınırı aşan yeni alt görev açılamaz.
///
/// <para>Neden: alt görev ağacını eşleyen kod (AutoMapper, CVE-2026-32933) sınırsız derinlikte
/// özyinelerse yığın taşar ve süreç çöker; derinliği kullanıcı verisi belirliyordu. Eşlemeye ayrıca
/// MaxDepth konuldu (AutoMapperMaxDepth_Tests); bu sınır kök nedeni kapatır.</para>
///
/// <para>Yalnız oluşturma anında zorlanır — alt görevin üst görevi sonradan değişmez, bu yüzden tek
/// giriş noktası <c>TaskManager.EnsureParentTaskIsValidAsync</c>. Sınırdan derin mevcut zincirlere
/// dokunulmaz.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_SubtaskDepth_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IUnitOfWorkManager _uowManager;

    public TaskAppService_SubtaskDepth_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _uowManager = GetRequiredService<IUnitOfWorkManager>();
    }

    private async Task<TaskItem> NewTaskAsync(Guid? parentId)
    {
        var task = new TaskItem(Guid.NewGuid(), "Zincir", parentTaskId: parentId,
            tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    /// <summary>Kök görevden başlayıp <paramref name="ancestors"/> üst görevi olan en derin görevi döndürür.</summary>
    private async Task<TaskItem> NewChainAsync(int ancestors)
    {
        var current = await NewTaskAsync(parentId: null);
        for (var i = 0; i < ancestors; i++)
        {
            current = await NewTaskAsync(current.Id);
        }

        return current;
    }

    private static CreateUpdateTaskDto Subtask(Guid parentId) => new()
    {
        Title = "Alt görev",
        ParentTaskId = parentId,
        StartDate = DateTime.Today,
    };

    [Fact]
    public async Task Sinirdaki_derinlige_alt_gorev_acilir()
    {
        // 9 üst görevi var → yeni alt görevin 10 üst görevi olur: sınırın tam üstü, hâlâ serbest.
        var deepest = await NewChainAsync(TaskConsts.MaxSubTaskDepth - 1);

        var created = await _taskAppService.CreateAsync(Subtask(deepest.Id));

        created.ParentTaskId.ShouldBe(deepest.Id);
    }

    [Fact]
    public async Task Siniri_asan_alt_gorev_reddedilir_ve_yazilmaz()
    {
        // 10 üst görevi var → yeni alt görevin 11 üst görevi olurdu.
        var deepest = await NewChainAsync(TaskConsts.MaxSubTaskDepth);

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _taskAppService.CreateAsync(Subtask(deepest.Id)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskParentTooDeep);
        ex.Data["MaxDepth"].ShouldBe(TaskConsts.MaxSubTaskDepth);

        using var uow = _uowManager.Begin(requiresNew: true);
        (await _taskRepository.CountAsync(t => t.ParentTaskId == deepest.Id))
            .ShouldBe(0, "doğrulama görev yazılmadan ÖNCE çalışmalı");
        await uow.CompleteAsync();
    }

    /// <summary>
    /// Paylaşım ağacı en çok <see cref="TaskShareConsts.MaxScopeDepth"/> adım iner ve yürür; oluşturma
    /// sınırı bunu aşarsa o ağaç en derin görevleri sessizce keserdi.
    /// </summary>
    [Fact]
    public void Sinir_dis_paylasim_agacinin_yuruyusunu_asmaz()
    {
        TaskConsts.MaxSubTaskDepth.ShouldBeLessThanOrEqualTo(TaskShareConsts.MaxScopeDepth);
    }

    /// <summary>
    /// Red kullanıcıya ham kodla değil, sınırı söyleyen metinle ulaşır: anahtar çözülmeli ve
    /// <c>{MaxDepth}</c> yer tutucusu istisnanın verisiyle dolmalı (anahtar yoksa ABP ham kodu basar).
    /// </summary>
    [Theory]
    [InlineData("tr", "iç içe")]
    [InlineData("en", "nested")]
    public void Red_iletisi_cozulur_ve_sinir_degerini_yazar(string culture, string expected)
    {
        using (CultureHelper.Use(culture))
        {
            var info = GetRequiredService<IExceptionToErrorInfoConverter>().Convert(
                new BusinessException(PlatformDomainErrorCodes.TaskParentTooDeep)
                    .WithData("MaxDepth", TaskConsts.MaxSubTaskDepth),
                _ => { });

            info.Message.ShouldContain(expected);
            info.Message.ShouldContain(TaskConsts.MaxSubTaskDepth.ToString());
            info.Message.ShouldNotContain("{MaxDepth}");
            info.Message.ShouldNotContain("Platform:Task");
        }
    }
}
