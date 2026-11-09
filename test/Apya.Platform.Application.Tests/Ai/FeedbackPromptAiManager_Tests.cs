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
using Apya.Platform.Ai.Cost;
using Apya.Platform.Ai.Feedbacks;

namespace Apya.Platform.Tests.Application.Ai;

/// <summary>
/// Geri bildirim prompt'u için AI ön analizi: sahte sağlayıcıyla — gerçek modele istek gitmez.
/// </summary>
public class FeedbackPromptAiManager_Tests
{
    private readonly IAiProvider _aiProvider;
    private readonly ICostPolicyEngine _costPolicy;
    private readonly IRepository<AiRequest, Guid> _aiRequestRepo;
    private readonly FeedbackPromptAiManager _sut;
    private readonly Guid _feedbackId = Guid.NewGuid();

    public FeedbackPromptAiManager_Tests()
    {
        _aiProvider = Substitute.For<IAiProvider>();
        _aiProvider.Name.Returns("test-provider");
        _costPolicy = Substitute.For<ICostPolicyEngine>();
        _aiRequestRepo = Substitute.For<IRepository<AiRequest, Guid>>();

        _sut = new FeedbackPromptAiManager(_aiProvider, _aiRequestRepo, _costPolicy);

        var services = new ServiceCollection();
        services.AddSingleton<IGuidGenerator>(SimpleGuidGenerator.Instance);
        services.AddSingleton<ICurrentTenant>(Substitute.For<ICurrentTenant>());
        services.AddLogging();
        _sut.LazyServiceProvider = new AbpLazyServiceProvider(services.BuildServiceProvider());

        _aiRequestRepo.InsertAsync(Arg.Any<AiRequest>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(ci => Task.FromResult(ci.ArgAt<AiRequest>(0)));
        _aiRequestRepo.UpdateAsync(Arg.Any<AiRequest>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(ci => Task.FromResult(ci.ArgAt<AiRequest>(0)));
    }

    private void GivenQuotaAllows() =>
        _costPolicy.EvaluateAsync(Arg.Any<Guid?>(), Arg.Any<int>(), Arg.Any<CancellationToken>())
            .Returns(CostDecision.Allow(10_000));

    private static AiCompletionResult Completion(string response) =>
        new() { Response = response, InputTokens = 100, OutputTokens = 50, Duration = TimeSpan.FromSeconds(1) };

    [Fact]
    public async Task Basarili_analiz_metni_doner_kullanim_ve_istek_kaydi_yazilir()
    {
        GivenQuotaAllows();
        _aiProvider.CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(Completion("**Özet:** Kaydet düğmesi 500 veriyor."));

        var analysis = await _sut.AnalyzeAsync(_feedbackId, "{\"konu\":\"Kaydet\"}");

        analysis.ShouldBe("**Özet:** Kaydet düğmesi 500 veriyor.");
        await _costPolicy.Received(1).RecordUsageAsync(Arg.Any<Guid?>(), 150, Arg.Any<CancellationToken>());
        await _aiRequestRepo.Received(1).InsertAsync(
            Arg.Is<AiRequest>(r => r.RequestType == "feedback-prompt-analysis" && r.CorrelationId == _feedbackId),
            Arg.Any<bool>(), Arg.Any<CancellationToken>());
        await _aiRequestRepo.Received().UpdateAsync(
            Arg.Is<AiRequest>(r => r.Status == AiRequestStatus.Completed),
            Arg.Any<bool>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Veri_modele_yalniz_veri_kurali_ile_gider()
    {
        GivenQuotaAllows();
        string? system = null, user = null;
        _aiProvider.CompleteAsync(Arg.Do<string>(s => system = s), Arg.Do<string>(u => user = u), Arg.Any<CancellationToken>())
            .Returns(Completion("**Özet:** x"));

        await _sut.AnalyzeAsync(_feedbackId, "{\"konu\":\"Kaydet\"}");

        system.ShouldNotBeNull();
        system.ShouldContain("yalnız VERİDİR");
        system.ShouldContain("uydurma");
        user.ShouldNotBeNull();
        user.ShouldContain("{\"konu\":\"Kaydet\"}");
    }

    [Fact]
    public async Task Kota_asilirsa_saglayici_cagrilmadan_kota_hatasi_doner()
    {
        _costPolicy.EvaluateAsync(Arg.Any<Guid?>(), Arg.Any<int>(), Arg.Any<CancellationToken>())
            .Returns(CostDecision.Deny("aylık limit aşıldı"));

        var ex = await Should.ThrowAsync<BusinessException>(() => _sut.AnalyzeAsync(_feedbackId, "{}"));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.AiQuotaExceeded);
        await _aiProvider.DidNotReceiveWithAnyArgs().CompleteAsync(default!, default!, default);
    }

    [Fact]
    public async Task Saglayici_yapilandirilmamissa_hata_aynen_doner_ve_istek_basarisiz_isaretlenir()
    {
        GivenQuotaAllows();
        _aiProvider.CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Throws(new AiProviderException(PlatformDomainErrorCodes.AiProviderNotConfigured, "yok"));

        var ex = await Should.ThrowAsync<AiProviderException>(() => _sut.AnalyzeAsync(_feedbackId, "{}"));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.AiProviderNotConfigured);
        await _aiRequestRepo.Received().UpdateAsync(
            Arg.Is<AiRequest>(r => r.Status == AiRequestStatus.Failed),
            Arg.Any<bool>(), Arg.Any<CancellationToken>());
        await _costPolicy.DidNotReceiveWithAnyArgs().RecordUsageAsync(default, default, default);
    }

    [Fact]
    public async Task Bos_yanit_gecersiz_yanit_hatasi_verir()
    {
        GivenQuotaAllows();
        _aiProvider.CompleteAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(Completion("   "));

        var ex = await Should.ThrowAsync<AiProviderException>(() => _sut.AnalyzeAsync(_feedbackId, "{}"));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.AiResponseInvalid);
    }

    [Theory]
    [InlineData("```markdown\n**Özet:** a\n```", "**Özet:** a")]
    [InlineData("## AI ön analizi\n**Özet:** a", "**Özet:** a")]
    [InlineData("  **Özet:** a  ", "**Özet:** a")]
    public void Kod_citi_ve_baslik_temizlenir(string raw, string expected)
    {
        FeedbackPromptAiManager.Clean(raw).ShouldBe(expected);
    }
}
