using System;
using Apya.Platform.Grants;
using Shouldly;
using Xunit;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// 🔴 CNV-01 / FIN-04 · Eski dönüşümlerin geri dolum kuralı ve iki defterin kıyas kuralı.
///
/// <para>Geri dolumun tek ilkesi: <b>emin değilsen bağlama.</b> Yanlış kurulmuş bağ, hiç
/// kurulmamış bağdan kötüdür — bağı okuyan ekran iki ilgisiz kaydı aynı şeymiş gibi
/// gösterir. Bu testler "bağlamama" dallarını bağlama dalları kadar ciddiye alır.</para>
/// </summary>
public class GrantSourceLinkMatcher_Tests
{
    private static readonly Guid G1 = Guid.Parse("a0000000-0000-4000-8000-000000000001");
    private static readonly Guid G2 = Guid.Parse("a0000000-0000-4000-8000-000000000002");
    private static readonly Guid P1 = Guid.Parse("b0000000-0000-4000-8000-000000000001");
    private static readonly Guid P2 = Guid.Parse("b0000000-0000-4000-8000-000000000002");

    /* ─── Dilim ───────────────────────────────────────────────────────── */

    [Fact]
    public void Dilim_sira_ve_tutar_tutuyorsa_baglanir()
    {
        var map = GrantSourceLinkMatcher.MatchTranches(
            new[] { new GrantSourceLinkMatcher.GrantTranche(G1, 1, 400_000m), new GrantSourceLinkMatcher.GrantTranche(G2, 2, 600_000m) },
            new[] { new GrantSourceLinkMatcher.ProjectTranche(P1, 1, 400_000m), new GrantSourceLinkMatcher.ProjectTranche(P2, 2, 600_000m) });

        map[P1].ShouldBe(G1);
        map[P2].ShouldBe(G2);
    }

    /// <summary>
    /// Kullanıcı dilimi silip aynı sıraya başka tutarla yenisini açmış olabilir; o artık
    /// aynı dilim değildir.
    /// </summary>
    [Fact]
    public void Dilim_sirasi_tutuyor_ama_tutari_farkliysa_baglanmaz()
    {
        var map = GrantSourceLinkMatcher.MatchTranches(
            new[] { new GrantSourceLinkMatcher.GrantTranche(G1, 1, 400_000m) },
            new[] { new GrantSourceLinkMatcher.ProjectTranche(P1, 1, 350_000m) });

        map.ShouldBeEmpty();
    }

    [Fact]
    public void Ayni_sira_numarasini_iki_kayit_tasiyorsa_hicbiri_baglanmaz()
    {
        var map = GrantSourceLinkMatcher.MatchTranches(
            new[] { new GrantSourceLinkMatcher.GrantTranche(G1, 1, 400_000m) },
            new[] { new GrantSourceLinkMatcher.ProjectTranche(P1, 1, 400_000m), new GrantSourceLinkMatcher.ProjectTranche(P2, 1, 400_000m) });

        map.ShouldBeEmpty();
    }

    /* ─── Bütçe kalemi ────────────────────────────────────────────────── */

    [Fact]
    public void Kalem_tutari_iki_tarafta_da_tekilse_baglanir()
    {
        var map = GrantSourceLinkMatcher.MatchBudgetLines(
            new[] { new GrantSourceLinkMatcher.GrantLine(G1, 600_000m), new GrantSourceLinkMatcher.GrantLine(G2, 150_000m) },
            new[] { new GrantSourceLinkMatcher.ProjectLine(P1, 150_000m), new GrantSourceLinkMatcher.ProjectLine(P2, 600_000m) });

        map[P1].ShouldBe(G2);
        map[P2].ShouldBe(G1);
    }

    /// <summary>
    /// İki kalem aynı tutarı taşıyorsa hangisinin hangisinden doğduğu bilinemez. Rastgele
    /// birini seçmek, gider kalemlerini yanlış başvuru satırına bağlardı.
    /// </summary>
    [Fact]
    public void Ayni_tutari_tasiyan_iki_kalem_baglanmaz()
    {
        var map = GrantSourceLinkMatcher.MatchBudgetLines(
            new[] { new GrantSourceLinkMatcher.GrantLine(G1, 50_000m), new GrantSourceLinkMatcher.GrantLine(G2, 50_000m) },
            new[] { new GrantSourceLinkMatcher.ProjectLine(P1, 50_000m), new GrantSourceLinkMatcher.ProjectLine(P2, 50_000m) });

        map.ShouldBeEmpty();
    }

    /// <summary>Projede sonradan elle açılan kalemin başvuruda karşılığı yoktur.</summary>
    [Fact]
    public void Basvuruda_karsiligi_olmayan_proje_kalemi_baglanmaz()
    {
        var map = GrantSourceLinkMatcher.MatchBudgetLines(
            new[] { new GrantSourceLinkMatcher.GrantLine(G1, 600_000m) },
            new[] { new GrantSourceLinkMatcher.ProjectLine(P1, 600_000m), new GrantSourceLinkMatcher.ProjectLine(P2, 75_000m) });

        map.Count.ShouldBe(1);
        map[P1].ShouldBe(G1);
    }

    /// <summary>Sıfır tutarlı başvuru satırı dönüşüme hiç girmez; eşleşme adayı da olamaz.</summary>
    [Fact]
    public void Sifir_tutarli_basvuru_satiri_aday_degildir()
    {
        var map = GrantSourceLinkMatcher.MatchBudgetLines(
            new[] { new GrantSourceLinkMatcher.GrantLine(G1, 0m) },
            new[] { new GrantSourceLinkMatcher.ProjectLine(P1, 0m) });

        map.ShouldBeEmpty();
    }

    /* ─── İki defterin kıyası ─────────────────────────────────────────── */

    [Theory]
    // Hibe "Ödendi": proje tam tahsil etmediyse çelişki.
    [InlineData(GrantDisbursementTrancheStatus.Odendi, FundingTrancheStatus.Pending, true)]
    [InlineData(GrantDisbursementTrancheStatus.Odendi, FundingTrancheStatus.PartiallyCollected, true)]
    [InlineData(GrantDisbursementTrancheStatus.Odendi, FundingTrancheStatus.Disputed, true)]
    [InlineData(GrantDisbursementTrancheStatus.Odendi, FundingTrancheStatus.Collected, false)]
    // Hibe ödenmemiş: projeye para girdiyse çelişki; itiraz tek başına çelişki değil.
    [InlineData(GrantDisbursementTrancheStatus.Planlandi, FundingTrancheStatus.Pending, false)]
    [InlineData(GrantDisbursementTrancheStatus.TalepEdildi, FundingTrancheStatus.Pending, false)]
    [InlineData(GrantDisbursementTrancheStatus.TalepEdildi, FundingTrancheStatus.Disputed, false)]
    [InlineData(GrantDisbursementTrancheStatus.Planlandi, FundingTrancheStatus.PartiallyCollected, true)]
    [InlineData(GrantDisbursementTrancheStatus.TalepEdildi, FundingTrancheStatus.Collected, true)]
    public void Dilim_uyusmazligi_iki_yonde_de_yakalanir(
        GrantDisbursementTrancheStatus grant, FundingTrancheStatus project, bool expected)
    {
        GrantLedgerSync.IsTrancheOutOfSync(grant, project).ShouldBe(expected);
    }

    [Fact]
    public void Basvurudaki_tutar_sozlesme_tutarindan_ayrisinca_kalem_bayattir()
    {
        GrantLedgerSync.IsBudgetLineStale(grantAmount: 600_000m, projectPlannedAmount: 600_000m).ShouldBeFalse();
        GrantLedgerSync.IsBudgetLineStale(grantAmount: 650_000m, projectPlannedAmount: 600_000m).ShouldBeTrue();
    }
}
