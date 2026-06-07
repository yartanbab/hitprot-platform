using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Shouldly;
using Volo.Abp;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using Xunit;
using Apya.Platform.Ai;
using Apya.Platform.Ai.Context;
using Apya.Platform.Ai.Cost;
using Apya.Platform.Ai.Evaluations;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Security;
using Apya.Platform.DynamicAssets;

namespace Apya.Platform.Tests.Application.Ai;

public class AiEvaluationManager_Tests
{
    private readonly IAiProvider _aiProvider;
    private readonly ICostPolicyEngine _costPolicy;
    private readonly IRepository<AiRequest, Guid> _aiRequestRepo;
    private readonly IPromptRepository _promptRepo;
    private readonly IRepository<AiEvaluation, Guid> _evaluationRepo;
    private readonly IRepository<AppResponse, Guid> _responseRepo;
    private readonly AiEvaluationManager _sut;

    private readonly Guid _evaluationId = Guid.NewGuid();
    private readonly Guid _documentId = Guid.NewGuid();
    private readonly Guid _responseId = Guid.NewGuid();
    private readonly Guid _promptId = Guid.NewGuid();
    private readonly Guid _versionId = Guid.NewGuid();
    private readonly AiEvaluation _evaluation;

    public AiEvaluationManager_Tests()
    {
        _aiProvider = Substitute.For<IAiProvider>();
        _aiProvider.Name.Returns("test-provider");
        _costPolicy = Substitute.For<ICostPolicyEngine>();
        _aiRequestRepo = Substitute.For<IRepository<AiRequest, Guid>>();
        _promptRepo = Substitute.For<IPromptRepository>();
        _evaluationRepo = Substitute.For<IRepository<AiEvaluation, Guid>>();
        _responseRepo = Substitute.For<IRepository<AppResponse, Guid>>();

        _sut = new AiEvaluationManager(
            _aiProvider, _aiRequestRepo, _costPolicy,
            new DeterministicAiContextBuilder(), _promptRepo, _evaluationRepo, _responseRepo,
            new PromptInjectionSanitizer());

        var services = new ServiceCollection();
        services.AddSingleton<IGuidGenerator>(SimpleGuidGenerator.Instance);
        services.AddSingleton<ICurrentTenant>(Substitute.For<ICurrentTenant>());
        services.AddLogging();
        _sut.LazyServiceProvider = new AbpLazyServiceProvider(services.BuildServiceProvider());

        // Prompt with a published version whose schema requires "score".
        var prompt = new Prompt(_promptId, "credit-eval", "Credit Eval");
        prompt.AddVersion(_versionId, "Sen bir kredi risk uzmanısın.", "Yanıtlar: {{answers}}", "{\"required\":[\"score\"]}");
        prompt.PublishVersion(_versionId, DateTime.UtcNow);

        _evaluation = new AiEvaluation(_evaluationId, _documentId, _responseId, _promptId, _versionId);
        var response = new AppResponse(_responseId, _documentId, "{\"q1\":\"yes\"}");

        _promptRepo.GetWithVersionsAsync(_promptId, Arg.Any<CancellationToken>()).Returns(prompt);
        _responseRepo.GetAsync(_responseId, Arg.Any<bool>(), Arg.Any<CancellationToken>()).Returns(response);
        _evaluationRepo.GetAsync(_evaluationId, Arg.Any<bool>(), Arg.Any<CancellationToken>()).Returns(_evaluation);

        _aiRequestRepo.InsertAsync(Arg.Any<AiRequest>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(ci => Task.FromResult(ci.ArgAt<AiRequest>(0)));
        _aiRequestRepo.UpdateAsync(Arg.Any<AiRequest>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(ci => Task.FromResult(ci.ArgAt<AiRequest>(0)));
        _evaluationRepo.UpdateAsync(Arg.Any<AiEvaluation>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(ci => Task.FromResult(ci.ArgAt<AiEvaluation>(0)));
    }

    private void GivenQuotaAllows() =>
        _costPolicy.EvaluateAsync(Arg.Any<Guid?>(), Arg.Any<int>(), Arg.Any<CancellationToken>())
            .Returns(CostDecision.Allow(10_000));

    private static AiCompletionResult Completion(string response) =>
        new() { Response = response, InputTokens = 100, OutputTokens = 50, Duration = TimeSpan.FromSeconds(1) };

    [Fact]
    public async Task Process_HappyPath_Should_Store_SchemaValid_Result_With_Parsed_Headline()
    {
        GivenQuotaAllows();
        _aiProvider.CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(Completion("{\"score\":85,\"riskLevel\":\"Low\",\"decision\":\"Approved\",\"summary\":\"ok\"}"));

        var evaluation = await _sut.ProcessAsync(_evaluationId);

        evaluation.Status.ShouldBe(AiEvaluationStatus.Completed);
        evaluation.Result.ShouldNotBeNull();
        evaluation.Result!.IsSchemaValid.ShouldBeTrue();
        evaluation.Result.Score.ShouldBe(85);
        evaluation.Result.RiskLevel.ShouldBe("Low");
        evaluation.Result.Decision.ShouldBe("Approved");
        evaluation.AiRequestId.ShouldNotBeNull();

        await _costPolicy.Received(1).RecordUsageAsync(Arg.Any<Guid?>(), 150, Arg.Any<CancellationToken>());
        await _aiRequestRepo.Received(1).InsertAsync(
            Arg.Is<AiRequest>(r => r.RequestType == "form-evaluation"),
            Arg.Any<bool>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Process_QuotaDenied_Should_Throw_And_Mark_Failed_Without_Calling_Provider()
    {
        _costPolicy.EvaluateAsync(Arg.Any<Guid?>(), Arg.Any<int>(), Arg.Any<CancellationToken>())
            .Returns(CostDecision.Deny("aylık limit aşıldı"));

        var ex = await Should.ThrowAsync<BusinessException>(() => _sut.ProcessAsync(_evaluationId));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.AiQuotaExceeded);
        _evaluation.Status.ShouldBe(AiEvaluationStatus.Failed);
        await _aiProvider.DidNotReceiveWithAnyArgs().CompleteAsync(default!, default!, default);
    }

    [Fact]
    public async Task Process_SchemaInvalidAfterRepair_Should_Complete_With_IsSchemaValid_False()
    {
        GivenQuotaAllows();
        // Missing required "score" both times -> repair runs once, still invalid.
        _aiProvider.CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(Completion("{\"foo\":1}"), Completion("{\"foo\":2}"));

        var evaluation = await _sut.ProcessAsync(_evaluationId);

        evaluation.Status.ShouldBe(AiEvaluationStatus.Completed);
        evaluation.Result.ShouldNotBeNull();
        evaluation.Result!.IsSchemaValid.ShouldBeFalse();
        evaluation.Result.Score.ShouldBeNull();
        await _aiProvider.Received(2).CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>());
    }
}
