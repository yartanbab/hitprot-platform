using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// FIN-10 · Faturalar listesindeki "Gecikmiş" süzgeci saklanan duruma (hiç atanmayan 4) değil, sunucunun
/// hesapladığı <c>isOverdue</c> bayrağına bakar; rozet de aynı bayrağı gösterir. Betik test kabuğunda
/// koşmadığı için sözleşme kaynaktan kilitlenir.
/// </summary>
public class InvoiceOverdueFilterScript_Tests
{
    private static string Script()
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..",
            "src", "Apya.Platform.Web", "Pages", "Invoices", "index.js");
        File.Exists(path).ShouldBeTrue();
        return File.ReadAllText(path);
    }

    [Fact]
    public void Gecikmis_suzgeci_ve_rozeti_sunucu_bayragina_bakar()
    {
        typeof(Apya.Platform.Invoices.Dtos.InvoiceDto).GetProperty("IsOverdue").ShouldNotBeNull();

        var script = Script();
        script.ShouldContain("if (state.status === '4') {", Case.Sensitive);
        script.ShouldContain("if (!x.isOverdue) { return false; }", Case.Sensitive);
        script.ShouldContain("statusChip(x.status, x.isOverdue)", Case.Sensitive);
        script.ShouldContain("statusChip(d.status, d.isOverdue)", Case.Sensitive);
    }
}
