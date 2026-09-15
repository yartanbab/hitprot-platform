using System;
using System.Collections.Generic;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// 20a · Havuzdaki fikrin programa uyumu: programın dili fikirde geçiyor mu (%60) + firma skoru (%40).
/// </summary>
public class GrantIdeaMatcher_Tests
{
    private static readonly DateTime Now = new(2026, 9, 15, 10, 0, 0);

    private static Grant YouthProgram() => new(Guid.NewGuid(), "KA154 Gençlik Katılımı", "Ulusal Ajans", 2_500_000m, 0)
    {
        Description = "Avrupa Birliği programı",
        Objective = "Gençlerin demokratik yaşama katılımını artırmak.",
        Priorities = "Kadınlar ve dezavantajlı gruplar\nDijital beceriler\nEğitim ve atölye çalışmaları\nKooperatifler",
        EligibleApplicants = "Dernekler, vakıflar, kooperatifler"
    };

    private static GrantInterest Idea(string note, string problem, string? audience = null, decimal? budget = null)
    {
        var idea = new GrantInterest(Guid.NewGuid(), Guid.NewGuid(), grantCallId: null, Guid.NewGuid(), note, budget);
        idea.SetIdeaDetails(problem, audience, null, null, null, null, null, null);
        return idea;
    }

    private static readonly IReadOnlyList<GrantCriteriaTag> NoTags = new List<GrantCriteriaTag>();

    [Fact]
    public void Programin_dilini_konusan_fikir_esigi_gecer_ve_gerekcesini_tasir()
    {
        var idea = Idea(
            "Bölgedeki kadın kooperatiflerinin ürünlerini dijital pazaryerlerine taşımak",
            "Kooperatifler yerel pazarın dışına çıkamıyor",
            "Kadınlar, gençler ve dezavantajlı gruplar",
            budget: 900_000m);

        var match = GrantIdeaMatcher.Match(idea, YouthProgram(), NoTags, firmScore: 70);

        match.TextScore.ShouldNotBeNull();
        match.TextScore!.Value.ShouldBeGreaterThanOrEqualTo(75);
        match.IsMatch.ShouldBeTrue();
        // Gerekçe programın kendi kelimesiyle: Türkçe ekler ("kadınlar", "kooperatiflerinin") köke iner.
        match.MatchedTerms.ShouldContain("kadınlar");
        match.MatchedTerms.Count.ShouldBeLessThanOrEqualTo(3);
        match.BudgetFits.ShouldBe(true);
    }

    [Fact]
    public void Konu_disi_fikir_esigin_altinda_kalir()
    {
        var idea = Idea(
            "Fabrikadaki fırın atık ısısını buhar üretimine çevirmek",
            "Enerji maliyeti rekabeti zorluyor",
            budget: 6_000_000m);

        var match = GrantIdeaMatcher.Match(idea, YouthProgram(), NoTags, firmScore: 70);

        match.TextScore!.Value.ShouldBeLessThan(30);
        match.IsMatch.ShouldBeFalse();
        match.BudgetFits.ShouldBe(false);
    }

    [Fact]
    public void Her_hibe_metninde_gecen_kelimeler_uyum_sayilmaz()
    {
        // "proje", "destek", "faaliyet", "başvuru" her programda ve her fikirde geçer.
        var idea = Idea("Projemiz için hibe desteği ve başvuru faaliyetleri", "Destek programlarına başvurmak istiyoruz");
        var grant = new Grant(Guid.NewGuid(), "Destek Programı", "Kurum", 1_000_000m, 0)
        {
            Objective = "Projelere hibe desteği sağlamak", Priorities = "Başvuru faaliyetleri"
        };

        var match = GrantIdeaMatcher.Match(idea, grant, NoTags, firmScore: null);

        // Programın elinde genel kelimeden başka dil kalmıyor: örtüşme yok, uyum yok.
        match.MatchedTerms.ShouldBeEmpty();
        match.Total.ShouldBe(0);
        match.IsMatch.ShouldBeFalse();
    }

    [Fact]
    public void Tematik_alan_anahtari_turkce_metinle_eslesir()
    {
        // Etiket değeri ASCII ve bitişik ("KulturSanat", "Egitim"); fikir Türkçe harflerle yazılı.
        var grant = new Grant(Guid.NewGuid(), "STK", "Kurum", 0, 0);
        var tags = new List<GrantCriteriaTag>
        {
            new(Guid.NewGuid(), grant.Id, GrantCriteriaKind.TematikAlan, "Egitim"),
            new(Guid.NewGuid(), grant.Id, GrantCriteriaKind.TematikAlan, "KulturSanat")
        };
        var idea = Idea("Köy okullarında eğitim ve sanat atölyeleri", "Çocukların kültür etkinliklerine erişimi yok");

        var match = GrantIdeaMatcher.Match(idea, grant, tags, firmScore: null);

        match.MatchedTerms.ShouldContain("egitim");
        match.MatchedTerms.ShouldContain("sanat");
    }

    [Fact]
    public void Olculemeyen_pay_toplami_dusurmez()
    {
        var idea = Idea("Kadın kooperatifleri için dijital eğitim", "Kooperatifler dijital pazara erişemiyor", "Kadınlar");

        // Program hedeflenmemiş (etiketsiz) → firma skoru yok → metin payı tek başına.
        var textOnly = GrantIdeaMatcher.Match(idea, YouthProgram(), NoTags, firmScore: null);
        textOnly.Total.ShouldBe(textOnly.TextScore!.Value);

        // Programın dili yok (ad da boş sayılmaz: yalnız 3 harfli kelimeler) → firma skoru tek başına.
        var bare = new Grant(Guid.NewGuid(), "AB", "Kurum", 0, 0);
        var firmOnly = GrantIdeaMatcher.Match(idea, bare, NoTags, firmScore: 55);
        firmOnly.TextScore.ShouldBeNull();
        firmOnly.Total.ShouldBe(55);

        // İkisi de varsa %60 metin + %40 firma.
        var both = GrantIdeaMatcher.Match(idea, YouthProgram(), NoTags, firmScore: 50);
        both.Total.ShouldBe((int)Math.Round(both.TextScore!.Value * 0.6 + 50 * 0.4));
    }

    [Fact]
    public void Butce_araligi_kiyaslanamiyorsa_null()
    {
        var grant = YouthProgram();
        GrantIdeaMatcher.BudgetFits(null, grant).ShouldBeNull();
        GrantIdeaMatcher.BudgetFits(900_000m, new Grant(Guid.NewGuid(), "P", "K", 0, 0)).ShouldBeNull();

        grant.MinAmount = 1_000_000m;
        GrantIdeaMatcher.BudgetFits(900_000m, grant).ShouldBe(false);
        GrantIdeaMatcher.BudgetFits(1_500_000m, grant).ShouldBe(true);
    }

    [Fact]
    public void Havuz_fikri_cagriya_baglaninca_incelemede_talep_olur()
    {
        var consultant = Guid.NewGuid();
        var callId = Guid.NewGuid();
        var idea = Idea("Fikir", "Sorun");

        idea.LinkToCall(callId, consultant, Now);

        idea.GrantCallId.ShouldBe(callId);
        idea.IsPoolIdea.ShouldBeFalse();
        idea.Status.ShouldBe(GrantInterestStatus.Inceleniyor);
        idea.AssignedUserId.ShouldBe(consultant);
        idea.ReviewedAt.ShouldBe(Now);

        // İkinci bağlama: kayıt artık havuzda değil.
        Should.Throw<BusinessException>(() => idea.LinkToCall(Guid.NewGuid(), consultant, Now))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestAlreadyLinked);
    }

    [Fact]
    public void Geri_cekilen_fikir_baglanamaz()
    {
        var idea = Idea("Fikir", "Sorun");
        idea.Withdraw(Now);

        Should.Throw<BusinessException>(() => idea.LinkToCall(Guid.NewGuid(), Guid.NewGuid(), Now))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestAlreadyAnswered);
    }
}
