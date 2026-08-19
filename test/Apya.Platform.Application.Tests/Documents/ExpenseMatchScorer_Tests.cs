using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Documents;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Documents;

/// <summary>
/// Eşleştirme skoru mali bir öneridir: yanlış sıralama, kullanıcının yanlış
/// faturayı yanlış harcamaya bağlamasına ve teslim dosyasının tutarsız
/// çıkmasına yol açar. Eşik altı adayların hiç gösterilmemesi de listenin
/// kullanılabilir kalması için kritik.
/// </summary>
public class ExpenseMatchScorer_Tests
{
    private static readonly DateTime Day = new(2026, 6, 28);

    private static MatchExpense Expense(
        decimal amount = 184200m, DateTime? date = null, string? supplier = "Mikrotek Elektronik")
        => new(Guid.NewGuid(), "Makine alımı", amount, date ?? Day, supplier);

    private static MatchDocument Doc(
        string name = "fatura.pdf",
        decimal? amount = 184200m,
        DateTime? date = null,
        string? supplier = "Mikrotek Elektronik",
        string? hash = null)
        => new(Guid.NewGuid(), name, amount, date ?? Day, supplier, hash);

    /* ─── Bileşenler ─────────────────────────────────────────────────── */

    [Fact]
    public void Birebir_ayni_kayit_tam_puan_alir()
    {
        var score = ExpenseMatchScorer.Score(Doc(), Expense());

        score.Score.ShouldBe(100);
        score.IsStrong.ShouldBeTrue();
        score.Reasons.ShouldContain("tutar birebir aynı");
        score.Reasons.ShouldContain("aynı tarih");
        score.Reasons.ShouldContain("tedarikçi aynı");
    }

    [Fact]
    public void Tutari_olmayan_belge_tutar_puani_alamaz()
    {
        // "Bilinmiyor" ile "uyuyor" aynı şey değildir.
        var score = ExpenseMatchScorer.Score(Doc(amount: null), Expense());

        score.AmountScore.ShouldBe(0);
        score.Score.ShouldBe(50); // yalnız tarih (30) + tedarikçi (20)
    }

    [Fact]
    public void Tolerans_disi_tutar_sifir_puan()
    {
        // %5 tolerans; 184.200 -> 200.000 yaklasik %8.6 sapma.
        var score = ExpenseMatchScorer.Score(Doc(amount: 200000m), Expense());

        score.AmountScore.ShouldBe(0);
    }

    [Fact]
    public void Tolerans_ici_tutar_kismi_puan_alir()
    {
        // %1 sapma: 184.200 -> 186.042
        var score = ExpenseMatchScorer.Score(Doc(amount: 186042m), Expense());

        score.AmountScore.ShouldBeGreaterThan(0);
        score.AmountScore.ShouldBeLessThan(50);
    }

    [Fact]
    public void Tarih_uzaklastikca_puan_duser()
    {
        var same = ExpenseMatchScorer.Score(Doc(date: Day), Expense());
        var tenDays = ExpenseMatchScorer.Score(Doc(date: Day.AddDays(10)), Expense());
        var farAway = ExpenseMatchScorer.Score(Doc(date: Day.AddDays(60)), Expense());

        same.DateScore.ShouldBe(30);
        tenDays.DateScore.ShouldBeLessThan(30);
        tenDays.DateScore.ShouldBeGreaterThan(0);
        farAway.DateScore.ShouldBe(0);
    }

    [Fact]
    public void Tarih_farki_yon_bagimsizdir()
    {
        var before = ExpenseMatchScorer.Score(Doc(date: Day.AddDays(-10)), Expense());
        var after = ExpenseMatchScorer.Score(Doc(date: Day.AddDays(10)), Expense());

        before.DateScore.ShouldBe(after.DateScore);
    }

    /* ─── Tedarikçi ──────────────────────────────────────────────────── */

    [Fact]
    public void Tedarikci_yazim_farklarina_dayanikli()
    {
        // "MİKROTEK A.Ş." ile "mikrotek as" eşleşmeli.
        var score = ExpenseMatchScorer.Score(
            Doc(supplier: "MİKROTEK A.Ş."),
            Expense(supplier: "mikrotek as"));

        score.SupplierScore.ShouldBeGreaterThan(0);
    }

    [Fact]
    public void Tedarikci_alani_bossa_belge_adinda_aranir()
    {
        // Faturalar sıklıkla "... MİKROTEK.pdf" diye adlandırılıyor; sinyal kaybolmamalı.
        var score = ExpenseMatchScorer.Score(
            Doc(name: "Makine Alım Faturası Mikrotek Elektronik.pdf", supplier: null),
            Expense());

        score.SupplierScore.ShouldBeGreaterThan(0);
        score.Reasons.ShouldContain("tedarikçi adı belge adında geçiyor");
    }

    [Fact]
    public void Alakasiz_tedarikci_puan_almaz()
    {
        var score = ExpenseMatchScorer.Score(Doc(supplier: "Acme Danışmanlık"), Expense());

        score.SupplierScore.ShouldBe(0);
    }

    /* ─── Sıralama ve eşik ───────────────────────────────────────────── */

    [Fact]
    public void Esik_altindaki_adaylar_hic_donmez()
    {
        // Yalnız tedarikçi uyuyor (20 puan) → eşik 40'ın altında.
        var weak = Doc(amount: 999999m, date: Day.AddDays(300));

        var results = ExpenseMatchScorer.RankForExpense(Expense(), new[] { weak });

        results.ShouldBeEmpty();
    }

    [Fact]
    public void Adaylar_skora_gore_azalan_siralanir()
    {
        var perfect = Doc("tam.pdf");
        var partial = Doc("kismi.pdf", amount: 184200m, date: Day.AddDays(20), supplier: null);

        var expense = Expense();
        var results = ExpenseMatchScorer.RankForExpense(expense, new[] { partial, perfect });

        results.Count.ShouldBe(2);
        results[0].DocumentFileId.ShouldBe(perfect.Id);
        results[0].Score.ShouldBeGreaterThan(results[1].Score);
    }

    [Fact]
    public void Sonuc_sayisi_sinirlanir()
    {
        var documents = Enumerable.Range(0, 25).Select(_ => Doc()).ToList();

        var results = ExpenseMatchScorer.RankForExpense(Expense(), documents, maxResults: 5);

        results.Count.ShouldBe(5);
    }

    /* ─── Çift kayıt ─────────────────────────────────────────────────── */

    [Fact]
    public void Ayni_icerik_ozeti_kesin_cift_kayittir()
    {
        var a = Doc("fatura.pdf", hash: "abc123");
        var b = Doc("fatura-kopya.pdf", hash: "abc123");

        ExpenseMatchScorer.DetectDuplicate(a, new[] { b })
            .ShouldBe(DuplicateReason.IdenticalContent);
    }

    [Fact]
    public void Ayni_tutar_tarih_tedarikci_supheli_sayilir()
    {
        var a = Doc("fatura.pdf", hash: "aaa");
        var b = Doc("tarali-fatura.pdf", hash: "bbb");

        ExpenseMatchScorer.DetectDuplicate(a, new[] { b })
            .ShouldBe(DuplicateReason.SameAmountDateSupplier);
    }

    [Fact]
    public void Farkli_belgeler_cift_kayit_sayilmaz()
    {
        var a = Doc("fatura.pdf", amount: 100m, hash: "aaa");
        var b = Doc("baska.pdf", amount: 250m, date: Day.AddDays(30), supplier: "Acme", hash: "bbb");

        ExpenseMatchScorer.DetectDuplicate(a, new[] { b }).ShouldBeNull();
    }

    [Fact]
    public void Belge_kendisiyle_cift_kayit_olmaz()
    {
        var a = Doc(hash: "aaa");

        ExpenseMatchScorer.DetectDuplicate(a, new[] { a }).ShouldBeNull();
    }
}
