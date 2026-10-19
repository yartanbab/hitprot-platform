using Apya.Platform.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Tasks;

/// <summary>QA-05 / QA-21 · Görev ekranlarında kişi adı tek kuraldan.</summary>
public class TaskPersonName_Tests
{
    [Fact]
    public void Ad_soyad_varsa_kullanici_adi_yerine_o_gosterilir()
    {
        TaskPersonName.Of("Can", "Öztürk", "calisan1").ShouldBe("Can Öztürk");
        TaskPersonName.Label("Can", "Öztürk", "calisan1").ShouldBe("Can Öztürk (calisan1)");
    }

    [Fact]
    public void Ad_yoksa_kullanici_adina_duser()
    {
        TaskPersonName.Of(null, " ", "admin").ShouldBe("admin");
        TaskPersonName.Label("", null, "admin").ShouldBe("admin");
    }

    [Fact]
    public void Yalniz_ad_varsa_ad_gosterilir()
    {
        TaskPersonName.Of("Yakup", null, "admin").ShouldBe("Yakup");
    }
}
