using System;
using Shouldly;
using Xunit;
using Apya.Platform.Ai;
using Apya.Platform.Ai.Drafts;

namespace Apya.Platform.Tests.Domain.Ai;

public class DraftBatch_Tests
{
    [Fact]
    public void Constructor_Should_Initialize_With_Created_Status()
    {
        var batch = new DraftBatch(Guid.NewGuid());

        batch.Status.ShouldBe(DraftBatchStatus.Created);
        batch.TotalItems.ShouldBe(0);
        batch.ApprovedItems.ShouldBe(0);
    }

    [Fact]
    public void Constructor_Should_Truncate_SourceFileName_To_255_Chars()
    {
        var longName = new string('a', 300);

        var batch = new DraftBatch(Guid.NewGuid(), sourceFileName: longName);

        batch.SourceFileName!.Length.ShouldBe(255);
    }

    [Fact]
    public void Constructor_Should_Keep_Short_SourceFileName_As_Is()
    {
        var batch = new DraftBatch(Guid.NewGuid(), sourceFileName: "report.pdf");

        batch.SourceFileName.ShouldBe("report.pdf");
    }

    [Fact]
    public void LinkToAiRequest_Should_Set_AiRequestId()
    {
        var batch = new DraftBatch(Guid.NewGuid());
        var requestId = Guid.NewGuid();

        batch.LinkToAiRequest(requestId);

        batch.AiRequestId.ShouldBe(requestId);
    }

    [Fact]
    public void MarkProcessing_Should_Set_Status_To_Processing()
    {
        var batch = new DraftBatch(Guid.NewGuid());

        batch.MarkProcessing();

        batch.Status.ShouldBe(DraftBatchStatus.Processing);
    }

    [Fact]
    public void MarkReadyForReview_Should_Set_Abandoned_When_TotalItems_Zero()
    {
        var batch = new DraftBatch(Guid.NewGuid());

        batch.MarkReadyForReview(0);

        batch.Status.ShouldBe(DraftBatchStatus.Abandoned);
        batch.TotalItems.ShouldBe(0);
    }

    [Fact]
    public void MarkReadyForReview_Should_Set_ReadyForReview_When_TotalItems_Positive()
    {
        var batch = new DraftBatch(Guid.NewGuid());

        batch.MarkReadyForReview(5);

        batch.Status.ShouldBe(DraftBatchStatus.ReadyForReview);
        batch.TotalItems.ShouldBe(5);
    }

    [Fact]
    public void MarkReadyForReview_Should_Throw_When_TotalItems_Negative()
    {
        var batch = new DraftBatch(Guid.NewGuid());

        Assert.Throws<ArgumentException>(() => batch.MarkReadyForReview(-1));
    }

    [Fact]
    public void RecordApproval_Should_Set_PartiallyApproved_When_Not_All_Approved()
    {
        var batch = new DraftBatch(Guid.NewGuid());
        batch.MarkReadyForReview(10);

        batch.RecordApproval(3);

        batch.Status.ShouldBe(DraftBatchStatus.PartiallyApproved);
        batch.ApprovedItems.ShouldBe(3);
    }

    [Fact]
    public void RecordApproval_Should_Set_FullyApproved_When_All_Approved()
    {
        var batch = new DraftBatch(Guid.NewGuid());
        batch.MarkReadyForReview(5);

        batch.RecordApproval(5);

        batch.Status.ShouldBe(DraftBatchStatus.FullyApproved);
        batch.ApprovedItems.ShouldBe(5);
    }

    [Fact]
    public void RecordApproval_Should_Accumulate_Across_Calls()
    {
        var batch = new DraftBatch(Guid.NewGuid());
        batch.MarkReadyForReview(10);

        batch.RecordApproval(3);
        batch.RecordApproval(7);

        batch.ApprovedItems.ShouldBe(10);
        batch.Status.ShouldBe(DraftBatchStatus.FullyApproved);
    }

    [Fact]
    public void MarkFailed_Should_Set_Status_To_Failed()
    {
        var batch = new DraftBatch(Guid.NewGuid());

        batch.MarkFailed();

        batch.Status.ShouldBe(DraftBatchStatus.Failed);
    }

    [Fact]
    public void Abandon_Should_Set_Status_To_Abandoned()
    {
        var batch = new DraftBatch(Guid.NewGuid());

        batch.Abandon();

        batch.Status.ShouldBe(DraftBatchStatus.Abandoned);
    }
}
