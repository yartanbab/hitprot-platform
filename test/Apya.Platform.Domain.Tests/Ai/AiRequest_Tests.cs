using System;
using Shouldly;
using Xunit;
using Apya.Platform.Ai;

namespace Apya.Platform.Tests.Domain.Ai;

public class AiRequest_Tests
{
    [Fact]
    public void Constructor_Should_Initialize_With_Pending_Status()
    {
        var request = new AiRequest(Guid.NewGuid(), "openai", "task-extraction");

        request.Status.ShouldBe(AiRequestStatus.Pending);
        request.ProviderName.ShouldBe("openai");
        request.RequestType.ShouldBe("task-extraction");
        request.TokensUsed.ShouldBe(0);
        request.Duration.ShouldBeNull();
        request.ErrorMessage.ShouldBeNull();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_On_Invalid_ProviderName(string? providerName)
    {
        Assert.Throws<ArgumentException>(() =>
            new AiRequest(Guid.NewGuid(), providerName!, "task-extraction"));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_On_Invalid_RequestType(string? requestType)
    {
        Assert.Throws<ArgumentException>(() =>
            new AiRequest(Guid.NewGuid(), "openai", requestType!));
    }

    [Fact]
    public void MarkProcessing_Should_Transition_To_Processing()
    {
        var request = new AiRequest(Guid.NewGuid(), "openai", "task-extraction");

        request.MarkProcessing();

        request.Status.ShouldBe(AiRequestStatus.Processing);
    }

    [Fact]
    public void MarkCompleted_Should_Set_Status_Tokens_And_Duration()
    {
        var request = new AiRequest(Guid.NewGuid(), "openai", "task-extraction");

        request.MarkCompleted(tokensUsed: 250, duration: TimeSpan.FromSeconds(3));

        request.Status.ShouldBe(AiRequestStatus.Completed);
        request.TokensUsed.ShouldBe(250);
        request.Duration.ShouldBe(TimeSpan.FromSeconds(3));
    }

    [Fact]
    public void MarkFailed_Should_Truncate_LongErrorMessage_To_2000_Chars()
    {
        var request = new AiRequest(Guid.NewGuid(), "openai", "task-extraction");
        var longMessage = new string('x', 3000);

        request.MarkFailed(longMessage);

        request.Status.ShouldBe(AiRequestStatus.Failed);
        request.ErrorMessage!.Length.ShouldBe(2000);
    }

    [Fact]
    public void MarkFailed_Should_Keep_ShortErrorMessage_As_Is()
    {
        var request = new AiRequest(Guid.NewGuid(), "openai", "task-extraction");

        request.MarkFailed("provider timeout");

        request.ErrorMessage.ShouldBe("provider timeout");
    }
}
