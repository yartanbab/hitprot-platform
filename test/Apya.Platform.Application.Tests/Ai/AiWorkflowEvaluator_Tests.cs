using System;
using Shouldly;
using Xunit;
using Apya.Platform.Ai.Workflows;

namespace Apya.Platform.Tests.Application.Ai;

public class AiWorkflowEvaluator_Tests
{
    private readonly AiWorkflowEvaluator _sut = new();

    private static AiWorkflow WorkflowWith(
        params (string path, RuleOperator op, string value, WorkflowActionType action)[] rules)
    {
        var workflow = new AiWorkflow(Guid.NewGuid(), "Test");
        foreach (var r in rules)
            workflow.AddRule(Guid.NewGuid(), r.path, r.op, r.value, r.action);
        return workflow;
    }

    [Fact]
    public void Numeric_GreaterThan_Matches_When_Above()
    {
        var wf = WorkflowWith(("score", RuleOperator.GreaterThan, "80", WorkflowActionType.Approve));

        var matches = _sut.Evaluate("{\"score\":85,\"riskLevel\":\"Low\"}", wf.Rules);

        matches.Count.ShouldBe(1);
        matches[0].ActionType.ShouldBe(WorkflowActionType.Approve);
    }

    [Fact]
    public void Numeric_GreaterThan_DoesNotMatch_When_Below()
    {
        var wf = WorkflowWith(("score", RuleOperator.GreaterThan, "90", WorkflowActionType.Approve));

        _sut.Evaluate("{\"score\":85}", wf.Rules).Count.ShouldBe(0);
    }

    [Fact]
    public void String_Equal_Is_CaseInsensitive()
    {
        var wf = WorkflowWith(("riskLevel", RuleOperator.Equal, "high", WorkflowActionType.Notify));

        var matches = _sut.Evaluate("{\"riskLevel\":\"High\"}", wf.Rules);

        matches.Count.ShouldBe(1);
        matches[0].ActionType.ShouldBe(WorkflowActionType.Notify);
    }

    [Fact]
    public void Multiple_Rules_Return_All_Matches_In_Order()
    {
        var wf = WorkflowWith(
            ("score", RuleOperator.GreaterThan, "80", WorkflowActionType.Approve),
            ("riskLevel", RuleOperator.Equal, "High", WorkflowActionType.Notify));

        var matches = _sut.Evaluate("{\"score\":85,\"riskLevel\":\"High\"}", wf.Rules);

        matches.Count.ShouldBe(2);
    }

    [Fact]
    public void InvalidJson_Returns_Empty()
    {
        var wf = WorkflowWith(("score", RuleOperator.GreaterThan, "80", WorkflowActionType.Approve));

        _sut.Evaluate("this is not json", wf.Rules).Count.ShouldBe(0);
    }

    [Fact]
    public void MissingProperty_DoesNotMatch()
    {
        var wf = WorkflowWith(("score", RuleOperator.GreaterThan, "80", WorkflowActionType.Approve));

        _sut.Evaluate("{\"other\":1}", wf.Rules).Count.ShouldBe(0);
    }

    [Fact]
    public void Contains_Matches_Substring()
    {
        var wf = WorkflowWith(("decision", RuleOperator.Contains, "reject", WorkflowActionType.Webhook));

        var matches = _sut.Evaluate("{\"decision\":\"Auto-Rejected\"}", wf.Rules);

        matches.Count.ShouldBe(1);
        matches[0].ActionType.ShouldBe(WorkflowActionType.Webhook);
    }
}
