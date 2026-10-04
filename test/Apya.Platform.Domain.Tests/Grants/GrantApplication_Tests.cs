using System;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

public class GrantApplication_Tests
{
    private static GrantApplication NewApp() => new GrantApplication(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());

    [Fact]
    public void AdvanceStage_Updates_Stage()
    {
        var app = NewApp();
        app.AdvanceStage(GrantApplicationStage.Degerlendirme);
        app.Stage.ShouldBe(GrantApplicationStage.Degerlendirme);
        app.ApprovedAmount.ShouldBeNull();
    }

    [Fact]
    public void AdvanceStage_With_ApprovedAmount_Sets_It()
    {
        var app = NewApp();
        app.AdvanceStage(GrantApplicationStage.Onay, 50000m);
        app.Stage.ShouldBe(GrantApplicationStage.Onay);
        app.ApprovedAmount.ShouldBe(50000m);
    }

    [Fact]
    public void AdvanceStage_Without_ApprovedAmount_Keeps_Previous_Value()
    {
        var app = NewApp();
        app.AdvanceStage(GrantApplicationStage.Onay, 50000m);
        app.AdvanceStage(GrantApplicationStage.Odeme);
        app.Stage.ShouldBe(GrantApplicationStage.Odeme);
        app.ApprovedAmount.ShouldBe(50000m);
    }

    [Fact]
    public void AdvanceStage_Rejects_Negative_ApprovedAmount()
    {
        var app = NewApp();
        app.AdvanceStage(GrantApplicationStage.Onay, 50000m);

        var ex = Should.Throw<Volo.Abp.BusinessException>(() => app.AdvanceStage(GrantApplicationStage.Onay, -1m));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantApprovedAmountInvalid);
        app.ApprovedAmount.ShouldBe(50000m, "reddedilen giriş mevcut tutarı bozmamalı");
    }

    /// <summary>
    /// 🔴 DOM-01: Adım taşıma sabit aşamayı da yazar. Eskiden yalnız CurrentStepId
    /// değişiyordu; huni, "bugün", Hibe Yolculuğum ve Başvurularım Stage okuduğu için
    /// başvuru panoda son adıma gelse bile firma tarafında hiç kapanmıyordu.
    /// </summary>
    [Fact]
    public void MoveToStep_Eslenen_Asamayi_Yazar()
    {
        var app = NewApp();
        var stepId = Guid.NewGuid();

        app.MoveToStep(stepId, GrantApplicationStage.Onay);

        app.CurrentStepId.ShouldBe(stepId);
        app.Stage.ShouldBe(GrantApplicationStage.Onay);
    }

    /// <summary>Eşlenmemiş adıma (Stage null) taşımak özeti bozmaz — eski davranış korunur.</summary>
    [Fact]
    public void MoveToStep_Eslenmemis_Adimda_Asamayi_Korur()
    {
        var app = NewApp();
        app.AdvanceStage(GrantApplicationStage.Degerlendirme);
        var stepId = Guid.NewGuid();

        app.MoveToStep(stepId, null);

        app.CurrentStepId.ShouldBe(stepId);
        app.Stage.ShouldBe(GrantApplicationStage.Degerlendirme);
    }

    /// <summary>
    /// Geriye taşımada özet de geriye gider: adım TEK doğruluk kaynağıdır, host kartı
    /// bilerek geri çektiyse huni de onu izlemeli.
    /// </summary>
    [Fact]
    public void MoveToStep_Geriye_Tasimada_Asama_Da_Geri_Gider()
    {
        var app = NewApp();
        app.MoveToStep(Guid.NewGuid(), GrantApplicationStage.Onay);

        app.MoveToStep(Guid.NewGuid(), GrantApplicationStage.Degerlendirme);

        app.Stage.ShouldBe(GrantApplicationStage.Degerlendirme);
    }
}
