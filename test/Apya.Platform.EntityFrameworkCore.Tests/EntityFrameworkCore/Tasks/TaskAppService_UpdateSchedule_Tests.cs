using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// Zaman çizelgesinin yalnız-tarih ucu (STA-01). Gantt eskiden tam güncelleme
/// (UpdateAsync) çağırıyordu ve liste DTO'suyla beslendiği için her kayıtta görevin
/// öncüllerini ve bütçe bağını siliyordu. UpdateScheduleAsync yalnız tarihi yazar;
/// geri kalan her şey olduğu gibi kalmalı.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_UpdateSchedule_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAppService_UpdateSchedule_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Fact]
    public async Task UpdateScheduleAsync_yalniz_tarihleri_yazar_oncul_butce_etiket_planlama_korunur()
    {
        var tagName = "qa-etiket-" + Guid.NewGuid().ToString("N")[..6];
        var predecessor = await _taskAppService.CreateAsync(new CreateUpdateTaskDto
        {
            Title = "Gantt öncülü",
            StartDate = new DateTime(2026, 9, 28),
        });

        var created = await _taskAppService.CreateAsync(new CreateUpdateTaskDto
        {
            Title = "Gantt görevi",
            StartDate = new DateTime(2026, 10, 1),
            DueDate = new DateTime(2026, 10, 3),
            PredecessorIds = new List<Guid> { predecessor.Id },
            TagNames = new List<string> { tagName },
            EstimatedHours = 8,
            TaskType = "Analiz",
            Sprint = "S1",
        });

        // Bütçe bağı doğrudan entity'ye: BudgetLineId'de FK yok, yalnız indeks var.
        var budgetLineId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            var entity = await _taskRepository.GetAsync(created.Id);
            entity.SetBudgetLink(budgetLineId, 500m);
            await _taskRepository.UpdateAsync(entity, autoSave: true);
        });

        await _taskAppService.UpdateScheduleAsync(created.Id, new UpdateTaskScheduleDto
        {
            StartDate = new DateTime(2026, 10, 5),
            DueDate = new DateTime(2026, 10, 9),
        });

        var after = await _taskAppService.GetAsync(created.Id);

        after.StartDate.ShouldBe(new DateTime(2026, 10, 5));
        after.DueDate.ShouldBe(new DateTime(2026, 10, 9));
        after.PredecessorIds.ShouldBe(new List<Guid> { predecessor.Id });
        after.BudgetLineId.ShouldBe(budgetLineId);
        after.PlannedAmount.ShouldBe(500m);
        after.Tags.Select(t => t.Name).ShouldContain(tagName);
        after.EstimatedHours.ShouldBe(8m);
        after.TaskType.ShouldBe("Analiz");
        after.Sprint.ShouldBe("S1");
        after.Title.ShouldBe("Gantt görevi");
    }

    [Fact]
    public async Task Vade_degisince_IsDeadlineWarningSent_sifirlanir()
    {
        var task = new TaskItem(
            Guid.NewGuid(), "Uyarısı gitmiş görev",
            startDate: new DateTime(2026, 10, 1), dueDate: new DateTime(2026, 10, 2),
            tenantId: _currentTenant.Id, now: DateTime.Now);
        task.MarkDeadlineWarningAsSent();
        await _taskRepository.InsertAsync(task, autoSave: true);

        await _taskAppService.UpdateScheduleAsync(task.Id, new UpdateTaskScheduleDto
        {
            StartDate = new DateTime(2026, 10, 1),
            DueDate = new DateTime(2026, 10, 12),
        });

        var reloaded = await _taskRepository.GetAsync(task.Id);
        reloaded.DueDate.ShouldBe(new DateTime(2026, 10, 12));
        reloaded.IsDeadlineWarningSent.ShouldBeFalse();
    }

    [Fact]
    public async Task Ters_aralikta_baslangic_bitise_cekilir()
    {
        var task = new TaskItem(
            Guid.NewGuid(), "Ters aralık",
            startDate: new DateTime(2026, 10, 1), dueDate: new DateTime(2026, 10, 3),
            tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);

        // DeferAsync ile aynı kural: bitiş esas, başlangıç ona çekilir; hata dönülmez.
        await _taskAppService.UpdateScheduleAsync(task.Id, new UpdateTaskScheduleDto
        {
            StartDate = new DateTime(2026, 10, 10),
            DueDate = new DateTime(2026, 10, 5),
        });

        var reloaded = await _taskRepository.GetAsync(task.Id);
        reloaded.StartDate.ShouldBe(new DateTime(2026, 10, 5));
        reloaded.DueDate.ShouldBe(new DateTime(2026, 10, 5));
    }
}
