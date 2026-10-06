using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

public class GrantApplication_Tests
{
    private static GrantApplication NewApp() => new GrantApplication(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());

    /// <summary>
    /// DOM-03 · Başvuru tarihi çağıranın verdiği saatten gelir. Düzeltmeden önce kurucu
    /// sunucunun yerel saatini doğrudan okuyordu; varlığın geri kalanı (itiraz süresi,
    /// adım geçişleri) saati zaten parametre olarak alıyordu.
    /// </summary>
    [Fact]
    public void Kurucu_Basvuru_Tarihini_Verilen_Saatten_Alir()
    {
        var now = new DateTime(2031, 3, 14, 9, 26, 53);

        var app = new GrantApplication(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), now);

        app.AppliedDate.ShouldBe(now);
    }

    /// <summary>Saat verilmezse eski davranış korunur (testler bu kısa biçimi kullanıyor).</summary>
    [Fact]
    public void Kurucu_Saat_Verilmezse_Su_Ani_Kullanir()
    {
        var before = DateTime.Now;

        var app = NewApp();

        app.AppliedDate.ShouldBeInRange(before, DateTime.Now);
    }

    /// <summary>
    /// SÖZLEŞME · Üretim kodunda başvuru açan HER yer saati kurucuya geçirir. Parametre
    /// isteğe bağlı olduğu için derleyici unutulan çağrıyı yakalamaz; yeni bir çağıran
    /// sessizce sunucu saatine dönerdi.
    /// </summary>
    [Fact]
    public void Uretim_Kodunda_Her_Basvuru_Saati_Disaridan_Alir()
    {
        const string marker = "new GrantApplication(";
        var src = Path.Combine(RepoRoot(), "src");
        var scanned = 0;
        var offenders = new List<string>();

        foreach (var file in Directory.EnumerateFiles(src, "*.cs", SearchOption.AllDirectories))
        {
            var relative = Path.GetRelativePath(src, file);
            var parts = relative.Split(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
            if (parts.Contains("bin") || parts.Contains("obj") || parts.Contains("Migrations"))
            {
                continue;
            }

            var text = File.ReadAllText(file);
            var at = text.IndexOf(marker, StringComparison.Ordinal);
            while (at >= 0)
            {
                scanned++;
                if (TopLevelArgumentCount(text, at + marker.Length) < 4)
                {
                    offenders.Add(relative);
                }

                at = text.IndexOf(marker, at + marker.Length, StringComparison.Ordinal);
            }
        }

        // Tarama boş dönerse test hiçbir şey ölçmüyor demektir (yol ya da ad değişmiş).
        scanned.ShouldBeGreaterThan(0);
        offenders.ShouldBeEmpty(
            "başvuru tarihi sunucu saatinden atanıyor (kurucuya Clock.Now geçirilmeli):" +
            Environment.NewLine + string.Join(Environment.NewLine, offenders));
    }

    /// <summary>Açılan parantezden kapanana kadar, yalnız en dış düzeydeki virgülleri sayar.</summary>
    private static int TopLevelArgumentCount(string text, int start)
    {
        var depth = 0;
        var commas = 0;
        for (var i = start; i < text.Length; i++)
        {
            var c = text[i];
            if (c == '(')
            {
                depth++;
            }
            else if (c == ')')
            {
                if (depth == 0)
                {
                    return commas + 1;
                }

                depth--;
            }
            else if (c == ',' && depth == 0)
            {
                commas++;
            }
        }

        return commas + 1;
    }

    private static string RepoRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            if (Directory.Exists(Path.Combine(dir.FullName, "src", "Apya.Platform.Domain")))
            {
                return dir.FullName;
            }

            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException("Depo kökü bulunamadı.");
    }

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
