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
        var task = new TaskItem(Guid.NewGuid(), "Orijinal Başlık");

        // Act & Assert
        var ex = Assert.Throws<BusinessException>(() => task.SetTitle("   "));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskTitleRequired);
    }

    [Fact]
    public void ChangeStatus_Should_Set_CompletedDate_When_Done()
    {
        // Arrange
        var task = new TaskItem(Guid.NewGuid(), "Orijinal Başlık");

        // Act
        task.ChangeStatus(TaskStatus.Done);

        // Assert
        task.CompletedDate.ShouldNotBeNull();
        task.Status.ShouldBe(TaskStatus.Done);
    }

    [Fact]
    public void ChangeStatus_Should_Clear_CompletedDate_When_Reverted_From_Done()
    {
        // Arrange
        var task = new TaskItem(Guid.NewGuid(), "Orijinal Başlık");
        task.ChangeStatus(TaskStatus.Done); // First it's done
        
        // Act
        task.ChangeStatus(TaskStatus.InProgress); // Reverted

        // Assert
        task.CompletedDate.ShouldBeNull();
        task.Status.ShouldBe(TaskStatus.InProgress);
    }
}
