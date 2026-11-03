using System.Linq;
using Apya.Platform.ProjectBudgets;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.ProjectBudgets;

/// <summary>Kalem kodu SAYI sırasıyla dizilir — alfabetik sıra "10"u "2"nin önüne koyardı.</summary>
public class BudgetLineCodeComparer_Tests
{
    [Fact]
    public void Kodlar_sayi_sirasina_gore_dizilir_kodsuzlar_en_sonda()
    {
        var codes = new[] { "10", "", "2.2", "2", "2.10", "1", "2.1", "B-04", "B-3", "1.1.1" };

        var sorted = codes.OrderBy(x => x, BudgetLineCodeComparer.Instance).ToArray();

        sorted.ShouldBe(new[] { "1", "1.1.1", "2", "2.1", "2.2", "2.10", "10", "B-3", "B-04", "" });
    }

    [Fact]
    public void Cok_uzun_sayi_tasma_yapmaz()
    {
        BudgetLineCodeComparer.Instance.Compare("99999999999999999999999", "100000000000000000000000").ShouldBeLessThan(0);
    }
}
