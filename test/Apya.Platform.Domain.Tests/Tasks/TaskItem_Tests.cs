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

    // ── Faz 4b: İptal muhasebesi ─────────────────────────────────────────
    // İptal edilen kart panoda kayboluyordu. Artık İptal kolonunda duruyor ve
    // geri alınınca ESKİ durumuna dönüyor — muhasebe ChangeStatus içinde,
    // böylece hangi yoldan gelinirse gelinsin (pano, liste, toplu işlem) tutarlı.

    [Fact]
    public void Cancel_Should_Store_Previous_Status_And_Reason()
    {
        var now = DateTime.UtcNow;
        var task = new TaskItem(Guid.NewGuid(), "Görev", now: now);
        task.ChangeStatus(TaskStatus.InReview, now);

        task.Cancel("kapsam dışı bırakıldı", now);

        task.Status.ShouldBe(TaskStatus.Cancelled);
        task.StatusBeforeCancel.ShouldBe((int)TaskStatus.InReview);
        task.CancelReason.ShouldBe("kapsam dışı bırakıldı");
        task.CancelledDate.ShouldBe(now);
    }

    [Fact]
    public void RestoreFromCancel_Should_Return_To_Previous_Status()
    {
        var now = DateTime.UtcNow;
        var task = new TaskItem(Guid.NewGuid(), "Görev", now: now);
        task.ChangeStatus(TaskStatus.InReview, now);
        task.Cancel("sebep", now);

        task.RestoreFromCancel(now);

        task.Status.ShouldBe(TaskStatus.InReview);
        task.StatusBeforeCancel.ShouldBeNull();
        task.CancelReason.ShouldBeNull();
        task.CancelledDate.ShouldBeNull();
    }

    [Fact]
    public void RestoreFromCancel_Should_Fall_Back_To_Todo_When_Previous_Unknown()
    {
        // Eski kayıt: iptal edilmiş ama StatusBeforeCancel yok.
        var now = DateTime.UtcNow;
        var task = new TaskItem(Guid.NewGuid(), "Görev", now: now);
        task.ChangeStatus(TaskStatus.Cancelled, now);
        task.RestoreFromCancel(now);
        task.Status.ShouldBe(TaskStatus.Todo);
    }

    [Fact]
    public void Cancelling_Through_ChangeStatus_Should_Also_Record_Accounting()
    {
        // Liste/toplu işlem UpdateStatusAsync üzerinden geliyor: aynı muhasebe.
        var now = DateTime.UtcNow;
        var task = new TaskItem(Guid.NewGuid(), "Görev", now: now);
        task.ChangeStatus(TaskStatus.InProgress, now);

        task.ChangeStatus(TaskStatus.Cancelled, now);

        task.StatusBeforeCancel.ShouldBe((int)TaskStatus.InProgress);
        task.CancelledDate.ShouldBe(now);
    }

    [Fact]
    public void Leaving_Cancelled_Should_Clear_Cancel_Traces()
    {
        var now = DateTime.UtcNow;
        var task = new TaskItem(Guid.NewGuid(), "Görev", now: now);
        task.Cancel("sebep", now);

        task.ChangeStatus(TaskStatus.Done, now);

        task.CancelReason.ShouldBeNull();
        task.CancelledDate.ShouldBeNull();
        task.StatusBeforeCancel.ShouldBeNull();
        task.CompletedDate.ShouldBe(now);
    }
}
