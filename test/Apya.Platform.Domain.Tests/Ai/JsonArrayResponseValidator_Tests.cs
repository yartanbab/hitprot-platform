using Shouldly;
using Xunit;
using Apya.Platform.Ai.Prompts;

namespace Apya.Platform.Tests.Domain.Ai;

public class JsonArrayResponseValidator_Tests
{
    private readonly JsonArrayResponseValidator _validator = new();

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("\n\n")]
    public void Validate_Should_Reject_Empty_Or_Whitespace(string response)
    {
        var outcome = _validator.Validate(response);

        outcome.IsValid.ShouldBeFalse();
        outcome.Errors.ShouldNotBeEmpty();
        outcome.RepairHint.ShouldNotBeNullOrEmpty();
    }

    [Fact]
    public void Validate_Should_Accept_Empty_Array()
    {
        var outcome = _validator.Validate("[]");

        outcome.IsValid.ShouldBeTrue();
        outcome.Errors.ShouldBeEmpty();
    }

    [Fact]
    public void Validate_Should_Accept_Array_With_Objects()
    {
        var outcome = _validator.Validate("[{\"name\":\"task1\"},{\"name\":\"task2\"}]");

        outcome.IsValid.ShouldBeTrue();
    }

    [Fact]
    public void Validate_Should_Strip_Json_Fences()
    {
        var outcome = _validator.Validate("```json\n[{\"a\":1}]\n```");

        outcome.IsValid.ShouldBeTrue();
    }

    [Fact]
    public void Validate_Should_Strip_Json_Fences_Case_Insensitive()
    {
        var outcome = _validator.Validate("```JSON\n[]\n```");

        outcome.IsValid.ShouldBeTrue();
    }

    [Fact]
    public void Validate_Should_Reject_Object_Root()
    {
        var outcome = _validator.Validate("{\"a\":1}");

        outcome.IsValid.ShouldBeFalse();
        outcome.RepairHint.ShouldNotBeNullOrEmpty();
    }

    [Fact]
    public void Validate_Should_Reject_Invalid_Json()
    {
        var outcome = _validator.Validate("[invalid");

        outcome.IsValid.ShouldBeFalse();
        outcome.RepairHint.ShouldNotBeNullOrEmpty();
    }

    [Fact]
    public void Validate_Should_Reject_Plain_Text()
    {
        var outcome = _validator.Validate("görev listesi: yapılacaklar");

        outcome.IsValid.ShouldBeFalse();
    }
}
