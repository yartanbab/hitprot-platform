using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Tasks;

namespace Apya.Platform.Tests.Domain.Tasks;

public class TaskItem_Tests
{
    [Fact]
    public void SetTitle_Should_Throw_Exception_When_Null_Or_Empty()
    {
        // Arrange
        var task = new TaskItem(Guid.NewGuid(), "Orijinal Başlık", now: DateTime.UtcNow);

        // Act & Assert
        var ex = Assert.Throws<BusinessException>(() => task.SetTitle("   "));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskTitleRequired);
    }

    [Fact]
    public void ChangeStatus_Should_Set_CompletedDate_When_Done()
    {
        // Arrange
        var task = new TaskItem(Guid.NewGuid(), "Orijinal Başlık", now: DateTime.UtcNow);
        var completedAt = new DateTime(2026, 6, 22, 10, 0, 0, DateTimeKind.Utc);

        // Act — Domain kuralı: now her zaman çağıran tarafından geçirilir (IClock inject edilmez)
        task.ChangeStatus(TaskStatus.Done, now: completedAt);

        // Assert — geçirilen now CompletedDate'e aynen yansımalı (çağıranlar now geçmek ZORUNDA;
        // BoardColumnAppService.MoveTaskToColumnAsync bunu atlıyordu → CompletedDate null kalıyordu)
        task.CompletedDate.ShouldBe(completedAt);
        task.Status.ShouldBe(TaskStatus.Done);
    }

    [Fact]
    public void ChangeStatus_Should_Clear_CompletedDate_When_Reverted_From_Done()
    {
        // Arrange
        var task = new TaskItem(Guid.NewGuid(), "Orijinal Başlık", now: DateTime.UtcNow);
        task.ChangeStatus(TaskStatus.Done, now: DateTime.UtcNow); // First it's done

        // Act
        task.ChangeStatus(TaskStatus.InProgress); // Reverted — CompletedDate null'a dönmeli

        // Assert
        task.CompletedDate.ShouldBeNull();
        task.Status.ShouldBe(TaskStatus.InProgress);
    }
}
