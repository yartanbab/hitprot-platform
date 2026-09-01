using System;
using System.Collections.Generic;
using System.Linq;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// 4b · Ağırlıklı skorlama. Ayrı bir dosyada tutuluyor çünkü
/// <see cref="GrantMatchManager_Tests"/> AĞIRLIKSIZ davranışın regresyon kalkanıdır —
/// oradaki beklentiler değişmemeli.
/// </summary>
public class GrantMatchWeight_Tests
{
    private readonly GrantMatchManager _m = new();

    private static Grant Program(int sizes = 0, decimal maxAmount = 1_000_000m) =>
        new Grant(Guid.NewGuid(), "P", "K", maxAmount, 0) { EligibleCompanySizes = sizes };

    private static List<GrantCriteriaTag> Tags(params (GrantCriteriaKind, string)[] xs)
    {
        var gid = Guid.NewGuid();
        return xs.Select(x => new GrantCriteriaTag(Guid.NewGuid(), gid, x.Item1, x.Item2)).ToList();
    }

    private static FirmSignals Firm(params (GrantCriteriaKind, string)[] xs) =>
        new() { Tags = xs.Select(x => new FirmSignalTag(x.Item1, x.Item2)).ToList() };

    private static GrantMatchWeightSet Weights(Action<GrantMatchWeightSet> configure)
    {
        var set = GrantMatchWeightSet.Default;
        configure(set);
        return set;
    }

    /// <summary>Sektör tutuyor (1.0), bölge tutmuyor (0.0) — ağırlıksız ortalama 50.</summary>
    private static (Grant Grant, List<GrantCriteriaTag> Tags, FirmSignals Firm) HalfMatch()
        => (Program(),
            Tags((GrantCriteriaKind.Sektor, "a"), (GrantCriteriaKind.Bolge, "ankara")),
            Firm((GrantCriteriaKind.Sektor, "a")));

    [Fact]
    public void Varsayilan_Agirlik_Agirliksiz_Sonucla_Ayni()
    {
        var (grant, tags, firm) = HalfMatch();

        _m.Score(firm, grant, tags).ShouldBe(50);
        _m.Score(firm, grant, tags, GrantMatchWeightSet.Default).ShouldBe(50);
    }

    [Fact]
    public void Sifir_Carpan_Boyutu_Skordan_Tamamen_Cikarir()
    {
        var (grant, tags, firm) = HalfMatch();

        var w = Weights(s => s[GrantMatchDimension.Region] = 0);

        // Bölge boyutu kapandı; geriye yalnız tutan sektör kaldı.
        _m.Score(firm, grant, tags, w).ShouldBe(100);
        w.IsEnabled(GrantMatchDimension.Region).ShouldBeFalse();
    }

    [Fact]
    public void Yuksek_Carpan_Skoru_O_Boyuta_Cekiyor()
    {
        var (grant, tags, firm) = HalfMatch();

        // (1×2 + 0×1) / 3 = 0,667
        _m.Score(firm, grant, tags, Weights(s => s[GrantMatchDimension.Sector] = 2)).ShouldBe(67);
        // (1×1 + 0×2) / 3 = 0,333
        _m.Score(firm, grant, tags, Weights(s => s[GrantMatchDimension.Region] = 2)).ShouldBe(33);
    }

    [Fact]
    public void Olcek_Cezasi_Kapatilabilir()
    {
        var grant = Program((int)CompanySize.Buyuk);
        var tags = Tags((GrantCriteriaKind.Sektor, "a"));
        var firm = Firm((GrantCriteriaKind.Sektor, "a"));
        firm.Size = CompanySize.Mikro;

        _m.Score(firm, grant, tags).ShouldBe(30); // mevcut davranış
        _m.Score(firm, grant, tags, Weights(s => s.SizePenaltyEnabled = false)).ShouldBe(100);
    }

    [Fact]
    public void Eksik_Veri_Cezasi_Acilabilir()
    {
        // Tavansız program: proje geçmişi boyutu devreye girmesin, ceza yalnız
        // Ar-Ge personeli üzerinden ölçülsün.
        var grant = Program(maxAmount: 0m);
        grant.MinRdStaffCount = 2;
        var tags = Tags((GrantCriteriaKind.Sektor, "a"));
        var firm = Firm((GrantCriteriaKind.Sektor, "a")); // RdStaffCount girilmemiş

        // Varsayılan: veri yoksa boyut atlanır → yalnız sektör kalır.
        _m.Score(firm, grant, tags).ShouldBe(100);

        // Ceza açıkken eksik veri 0 puanlı bir boyut olur: (1 + 0) / 2.
        _m.Score(firm, grant, tags, Weights(s => s.SkipMissingDimensions = false)).ShouldBe(50);
    }

    [Fact]
    public void Ceza_Acikken_Proje_Gecmisi_De_Sayilir()
    {
        // Programın bir tavanı varsa "proje bütçesi geçmişi" de ŞART sayılır;
        // geçmişi olmayan firma ceza modunda o boyuttan da 0 alır: (1 + 0 + 0) / 3.
        var grant = Program(maxAmount: 1_000_000m);
        grant.MinRdStaffCount = 2;
        var tags = Tags((GrantCriteriaKind.Sektor, "a"));
        var firm = Firm((GrantCriteriaKind.Sektor, "a"));

        _m.Score(firm, grant, tags, Weights(s => s.SkipMissingDimensions = false)).ShouldBe(33);
    }

    [Fact]
    public void Yeni_Boyutlar_Yalniz_Iki_Tarafta_Da_Veri_Varsa_Devreye_Girer()
    {
        var grant = Program();
        var tags = Tags((GrantCriteriaKind.Sektor, "a"));
        var firm = Firm((GrantCriteriaKind.Sektor, "a"));
        firm.Trl = 5;

        // Program TRL şartı koymuyor → boyut yok, skor değişmez.
        _m.Score(firm, grant, tags).ShouldBe(100);

        grant.MinTrl = 3;
        grant.MaxTrl = 7;
        _m.Score(firm, grant, tags).ShouldBe(100); // 5, 3-7 aralığında

        firm.Trl = 9;
        _m.Score(firm, grant, tags).ShouldBe(50); // aralık dışı → (1+0)/2
    }

    [Fact]
    public void ArGe_Personeli_Boyutu_Asgariyi_Karsilamaya_Bakar()
    {
        var grant = Program();
        grant.MinRdStaffCount = 2;
        var tags = Tags((GrantCriteriaKind.Sektor, "a"));
        var firm = Firm((GrantCriteriaKind.Sektor, "a"));

        firm.RdStaffCount = 3;
        _m.Score(firm, grant, tags).ShouldBe(100);

        firm.RdStaffCount = 1;
        _m.Score(firm, grant, tags).ShouldBe(50);
    }

    [Fact]
    public void Nace_Etiketi_Sektor_Boyutunda_Sayilir()
    {
        var grant = Program();
        var tags = Tags((GrantCriteriaKind.NaceKodu, "62.01"), (GrantCriteriaKind.Bolge, "ankara"));
        var firm = Firm((GrantCriteriaKind.NaceKodu, "62.01"));

        // Sektör boyutu kapatılınca NACE de düşer; geriye tutmayan bölge kalır.
        _m.Score(firm, grant, tags, Weights(s => s[GrantMatchDimension.Sector] = 0)).ShouldBe(0);
        _m.Score(firm, grant, tags).ShouldBe(50);
    }

    [Fact]
    public void Tum_Boyutlar_Kapaliysa_Skor_Sifir()
    {
        var (grant, tags, firm) = HalfMatch();

        var w = Weights(s =>
        {
            foreach (GrantMatchDimension d in Enum.GetValues<GrantMatchDimension>())
            {
                s[d] = 0;
            }
        });

        _m.Score(firm, grant, tags, w).ShouldBe(0);
    }

    [Fact]
    public void Negatif_Carpan_Sifira_Kirpilir()
    {
        var set = GrantMatchWeightSet.Default;
        set[GrantMatchDimension.Sector] = -3;

        set[GrantMatchDimension.Sector].ShouldBe(0);
        set.IsEnabled(GrantMatchDimension.Sector).ShouldBeFalse();
    }
}
