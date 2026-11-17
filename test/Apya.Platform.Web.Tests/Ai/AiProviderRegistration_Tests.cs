using Apya.Platform.Ai.Evaluations;
using Apya.Platform.Ai.Feedbacks;
using Apya.Platform.Ai.Grants;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Providers;
using Apya.Platform.Grants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Ai;

/// <summary>
/// Uygulamanın gerçek modül yapısıyla (canlıdakiyle aynı) yapay zekâ servisleri çözülebilir mi.
/// Birim testleri sağlayıcıyı elle verdiği için kayıt eksikliğini göremezdi: <see cref="IAiProvider"/>
/// hiç kaydedilmemişti ve ona bağlı her servis ilk çağrıda çözülemiyordu.
/// </summary>
public class AiProviderRegistration_Tests : PlatformWebTestBase
{
    [Fact]
    public void Yapay_zeka_saglayicisi_tek_kapidir()
        => GetRequiredService<IAiProvider>().ShouldBeOfType<AiGateway>();

    [Fact]
    public void Saglayiciya_bagli_servisler_cozulur()
    {
        GetRequiredService<TaskAiAgentManager>().ShouldNotBeNull();
        GetRequiredService<FeedbackPromptAiManager>().ShouldNotBeNull();
        GetRequiredService<AiEvaluationManager>().ShouldNotBeNull();
        GetRequiredService<IFirmDataExtractionAi>().ShouldBeOfType<FirmDataExtractionAi>();
    }

    [Fact]
    public void Gorev_cikarma_dogrulayicisi_json_dizisi_bekler()
        => GetRequiredService<IAiResponseValidator>().ShouldBeOfType<JsonArrayResponseValidator>();
}
