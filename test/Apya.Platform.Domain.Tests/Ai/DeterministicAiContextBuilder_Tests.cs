using System.Collections.Generic;
using System.Threading.Tasks;
using Shouldly;
using Xunit;
using Apya.Platform.Ai.Context;

namespace Apya.Platform.Tests.Domain.Ai;

public class DeterministicAiContextBuilder_Tests
{
    private readonly DeterministicAiContextBuilder _builder = new();

    [Fact]
    public async Task BuildAsync_Should_Return_Empty_For_Empty_Request()
    {
        var ctx = await _builder.BuildAsync(new AiContextRequest());

        ctx.Content.ShouldBe(string.Empty);
        ctx.IncludedSources.ShouldBeEmpty();
        ctx.Truncated.ShouldBeFalse();
        ctx.EstimatedTokens.ShouldBe(0);
    }

    [Fact]
    public async Task BuildAsync_Should_Include_Metadata_Section()
    {
        var ctx = await _builder.BuildAsync(new AiContextRequest
        {
            Metadata = new Dictionary<string, string>
            {
                ["proje"] = "TÜBİTAK 1501",
                ["dil"] = "tr"
            }
        });

        ctx.Content.ShouldContain("# Metadata");
        ctx.Content.ShouldContain("proje: TÜBİTAK 1501");
        ctx.Content.ShouldContain("dil: tr");
        ctx.IncludedSources.ShouldContain("metadata");
    }

    [Fact]
    public async Task BuildAsync_Should_Include_Primary_Section()
    {
        var ctx = await _builder.BuildAsync(new AiContextRequest
        {
            PrimaryText = "İlk proje açıklaması."
        });

        ctx.Content.ShouldContain("# Primary Content");
        ctx.Content.ShouldContain("İlk proje açıklaması.");
        ctx.IncludedSources.ShouldContain("primary");
        ctx.Truncated.ShouldBeFalse();
    }

    [Fact]
    public async Task BuildAsync_Should_Combine_Metadata_And_Primary()
    {
        var ctx = await _builder.BuildAsync(new AiContextRequest
        {
            Metadata = new Dictionary<string, string> { ["a"] = "1" },
            PrimaryText = "metin"
        });

        ctx.Content.ShouldContain("# Metadata");
        ctx.Content.ShouldContain("# Primary Content");
        ctx.IncludedSources.ShouldContain("metadata");
        ctx.IncludedSources.ShouldContain("primary");
    }

    [Fact]
    public async Task BuildAsync_Should_Truncate_When_PrimaryText_Exceeds_Budget()
    {
        var longText = new string('x', 50_000);

        var ctx = await _builder.BuildAsync(new AiContextRequest
        {
            PrimaryText = longText,
            TokenBudget = 100
        });

        ctx.Truncated.ShouldBeTrue();
        ctx.Content.Length.ShouldBeLessThan(longText.Length);
    }

    [Fact]
    public async Task BuildAsync_Should_Estimate_Tokens_Roughly_As_Chars_Over_4()
    {
        var ctx = await _builder.BuildAsync(new AiContextRequest
        {
            PrimaryText = new string('x', 400)
        });

        ctx.EstimatedTokens.ShouldBeGreaterThan(0);
        ctx.EstimatedTokens.ShouldBeLessThanOrEqualTo(ctx.Content.Length / 4 + 1);
    }
}
