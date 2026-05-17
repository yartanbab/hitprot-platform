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
using Apya.Platform.Ai.Prompts;

namespace Apya.Platform.Tests.Application.Ai;

public class TaskAiAgentManager_Tests
{
    private readonly IAiProvider _aiProvider;
    private readonly ICostPolicyEngine _costPolicy;
    private readonly IRepository<AiRequest, Guid> _aiRequestRepo;
    private readonly IAiResponseValidator _validator;
    private readonly IAiContextBuilder _contextBuilder;
    private readonly TaskAiAgentManager _sut;

    public TaskAiAgentManager_Tests()
    {
        _aiProvider = Substitute.For<IAiProvider>();
        _aiProvider.Name.Returns("test-provider");

        _costPolicy = Substitute.For<ICostPolicyEngine>();
        _aiRequestRepo = Substitute.For<IRepository<AiRequest, Guid>>();
        _validator = new JsonArrayResponseValidator();
        _contextBuilder = new DeterministicAiContextBuilder();

        _sut = new TaskAiAgentManager(_aiProvider, _validator, _aiRequestRepo, _costPolicy, _contextBuilder);

        var services = new ServiceCollection();
        services.AddSingleton<IGuidGenerator>(SimpleGuidGenerator.Instance);
        services.AddSingleton<ICurrentTenant>(Substitute.For<ICurrentTenant>());
        services.AddLogging();
        _sut.LazyServiceProvider = new AbpLazyServiceProvider(services.BuildServiceProvider());

        // Repository pass-through: return the entity provided by the caller
        _aiRequestRepo.InsertAsync(Arg.Any<AiRequest>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(ci => Task.FromResult(ci.ArgAt<AiRequest>(0)));
        _aiRequestRepo.UpdateAsync(Arg.Any<AiRequest>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(ci => Task.FromResult(ci.ArgAt<AiRequest>(0)));
    }

    private void GivenQuotaAllows(int remaining = 10_000) =>
        _costPolicy.EvaluateAsync(Arg.Any<Guid?>(), Arg.Any<int>(), Arg.Any<CancellationToken>())
            .Returns(CostDecision.Allow(remaining));

    private void GivenQuotaDenies(string reason = "monthly quota exceeded", int remaining = 0) =>
        _costPolicy.EvaluateAsync(Arg.Any<Guid?>(), Arg.Any<int>(), Arg.Any<CancellationToken>())
            .Returns(CostDecision.Deny(reason, remaining));

    private static AiCompletionResult Completion(string response, int input = 100, int output = 50) =>
        new()
        {
            Response = response,
            InputTokens = input,
            OutputTokens = output,
            Duration = TimeSpan.FromSeconds(1)
        };

    [Fact]
    public async Task ExtractTasks_HappyPath_Should_Return_Parsed_Tasks_And_Record_Usage()
    {
        GivenQuotaAllows();
        _aiProvider.CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(Completion("[{\"Title\":\"Sözleşme imzala\",\"Description\":\"Müşteri ile\",\"Priority\":2,\"EstimatedHours\":1.5}]"));

        var tasks = await _sut.ExtractTasksFromTextAsync("Bir proje yönergesi.");

        tasks.Count.ShouldBe(1);
        tasks[0].Title.ShouldBe("Sözleşme imzala");
        tasks[0].EstimatedHours.ShouldBe(1.5);

        await _aiProvider.Received(1).CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>());
        await _costPolicy.Received(1).RecordUsageAsync(Arg.Any<Guid?>(), 150, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task ExtractTasks_QuotaDenied_Should_Throw_AiQuotaExceeded_Without_Calling_Provider()
    {
        GivenQuotaDenies("aylık limit aşıldı");

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _sut.ExtractTasksFromTextAsync("text"));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.AiQuotaExceeded);
        await _aiProvider.DidNotReceiveWithAnyArgs().CompleteAsync(default!, default!, default);
        await _aiRequestRepo.DidNotReceiveWithAnyArgs()
            .InsertAsync(default!, default, default);
    }

    [Fact]
    public async Task ExtractTasks_RepairPipeline_Should_Retry_Once_When_First_Response_Is_Invalid()
    {
        GivenQuotaAllows();
        _aiProvider.CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(
                Completion("açıklama olmadan ham metin, JSON değil"),
                Completion("[{\"Title\":\"OK\",\"Description\":\"desc\",\"Priority\":1,\"EstimatedHours\":1.0}]"));

        var tasks = await _sut.ExtractTasksFromTextAsync("text");

        tasks.Count.ShouldBe(1);
        await _aiProvider.Received(2).CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task ExtractTasks_AllRepairAttemptsFail_Should_Throw_AiResponseInvalid()
    {
        GivenQuotaAllows();
        _aiProvider.CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(
                Completion("JSON değil bu metin"),
                Completion("hâlâ JSON array değil"));

        var ex = await Should.ThrowAsync<AiProviderException>(
            () => _sut.ExtractTasksFromTextAsync("text"));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.AiResponseInvalid);
        await _aiProvider.Received(2).CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task ExtractTasks_ProviderThrows_Should_Mark_AiRequest_Failed_And_Rethrow()
    {
        GivenQuotaAllows();
        _aiProvider.CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Throws(new AiProviderException(PlatformDomainErrorCodes.AiProviderUnavailable, "circuit breaker open"));

        var ex = await Should.ThrowAsync<AiProviderException>(
            () => _sut.ExtractTasksFromTextAsync("text"));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.AiProviderUnavailable);

        await _aiRequestRepo.Received(1).InsertAsync(
            Arg.Any<AiRequest>(), Arg.Any<bool>(), Arg.Any<CancellationToken>());
        await _aiRequestRepo.Received().UpdateAsync(
            Arg.Is<AiRequest>(r => r.Status == AiRequestStatus.Failed),
            Arg.Any<bool>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task ExtractTasks_HappyPath_Should_Persist_AiRequest_With_Provider_And_Type()
    {
        GivenQuotaAllows();
        _aiProvider.CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(Completion("[]"));

        await _sut.ExtractTasksFromTextAsync("text");

        // NSubstitute predicates assertion-time'da check; AiRequest aynı referans olduğu için
        // Status final durumda. Pending'i değil son durumu (Completed) doğruluyoruz.
        await _aiRequestRepo.Received(1).InsertAsync(
            Arg.Is<AiRequest>(r =>
                r.ProviderName == "test-provider" &&
                r.RequestType == "task-extraction"),
            Arg.Any<bool>(), Arg.Any<CancellationToken>());

        await _aiRequestRepo.Received().UpdateAsync(
            Arg.Is<AiRequest>(r => r.Status == AiRequestStatus.Completed),
            Arg.Any<bool>(), Arg.Any<CancellationToken>());
    }
}
