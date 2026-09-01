using System.Linq;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// 3a · Metinden alan çıkarımı. Ana senaryo, tasarımın kendi örnek çağrı metnidir —
/// beklenen sonuç da tasarımın gösterdiği "9 öneri · 4 boş" tablosudur.
/// </summary>
public class GrantTextExtractor_Tests
{
    private readonly GrantTextExtractor _x = new();

    /// <summary>Tasarım 3a'daki örnek çağrı metni (Sabancı Vakfı · Yeşil Dönüşüm).</summary>
    private const string SampleText = """
        Sabancı Vakfı — Yeşil Dönüşüm Hibe Programı 2026

        Program, imalat sanayiinde faaliyet gösteren küçük ve orta ölçekli işletmelerin
        enerji verimliliği ve karbon ayak izi azaltımı projelerini desteklemektedir.

        Her bir projeye sağlanacak azami destek tutarı 2.500.000 TL olup, destek oranı
        uygun maliyetlerin %70'i ile sınırlıdır. Kalan tutar başvuru sahibi tarafından karşılanır.

        Proje süresi en fazla 18 aydır. Başvurular 14 Ekim 2026 saat 17:00'a kadar
        çevrimiçi sistem üzerinden kabul edilir.

        Desteklenen gider kalemleri: enerji verimli ekipman alımı, ölçüm ve izleme
        sistemleri, mühendislik danışmanlığı. Personel giderleri desteklenmez.

        Başvuru sahiplerinin en az 3 yıldır faaliyette olması, ISO 14001 veya ISO 50001
        belgesine sahip olması beklenir. Konsorsiyum başvurusu kabul edilmez.
        """;

    private string? Value(string text, string fieldKey)
        => _x.Extract(text).SingleOrDefault(f => f.FieldKey == fieldKey)?.Value;

    [Fact]
    public void Tasarimin_Ornek_Metninden_Dokuz_Alan_Cikar()
    {
        var fields = _x.Extract(SampleText);

        // Tasarım: 9 öneri · 4 boş (NACE, TRL, Ar-Ge personeli ve harcama kalemleri yok).
        // 10 alan: kimlik(2) + tutar + oran + tarih + süre + faaliyet yılı + ölçek +
        // konsorsiyum + belge. Tasarımın "9 öneri" sayısı harcama kalemlerini de sayıyor;
        // bu çıkarıcı kalem listesi okumuyor (serbest metin, güvenilir deseni yok).
        fields.Count.ShouldBe(10);
        fields.Select(f => f.FieldKey).ShouldNotContain(GrantTextExtractor.FieldNace);
        fields.Select(f => f.FieldKey).ShouldNotContain(GrantTextExtractor.FieldTrl);
        fields.Select(f => f.FieldKey).ShouldNotContain(GrantTextExtractor.FieldRdStaff);
    }

    [Fact]
    public void Kurum_Ve_Program_Adi_Ayracli_Basliktan_Ayrilir()
    {
        Value(SampleText, GrantTextExtractor.FieldIssuer).ShouldBe("Sabancı Vakfı");
        Value(SampleText, GrantTextExtractor.FieldName).ShouldBe("Yeşil Dönüşüm Hibe Programı 2026");
    }

    [Fact]
    public void Tutar_Oran_Sure_Ve_Tarih_Okunur()
    {
        Value(SampleText, GrantTextExtractor.FieldMaxAmount).ShouldBe("2500000");
        Value(SampleText, GrantTextExtractor.FieldSupportRate).ShouldBe("70");
        Value(SampleText, GrantTextExtractor.FieldDuration).ShouldBe("18");
        Value(SampleText, GrantTextExtractor.FieldDeadline).ShouldBe("2026-10-14");
    }

    [Fact]
    public void Olcek_Bit_Maskesine_Cevrilir()
    {
        // "küçük ve orta ölçekli" → Kucuk(2) | Orta(4) = 6
        Value(SampleText, GrantTextExtractor.FieldCompanySizes).ShouldBe("6");
    }

    [Fact]
    public void Faaliyet_Suresi_Ve_Belge_Sarti_Okunur()
    {
        Value(SampleText, GrantTextExtractor.FieldCompanyAge).ShouldBe("3");
        Value(SampleText, GrantTextExtractor.FieldDocument).ShouldBe("ISO 14001 veya ISO 50001");
    }

    [Fact]
    public void Konsorsiyum_Olumsuzlanirsa_False_Doner()
    {
        Value(SampleText, GrantTextExtractor.FieldConsortium).ShouldBe("false");

        Value("Başvuruda konsorsiyum kurulması zorunludur.", GrantTextExtractor.FieldConsortium)
            .ShouldBe("true");

        // Kararsız cümlede alan HİÇ üretilmez — tahmin yapılmaz.
        Value("Konsorsiyum ortakları ayrıca değerlendirilir.", GrantTextExtractor.FieldConsortium)
            .ShouldBeNull();
    }

    [Fact]
    public void Trl_Araligi_Ve_ArGe_Personeli_Ayri_Metinde_Okunur()
    {
        var text = "Proje konusunun TRL 3 ile TRL 7 aralığında olması ve bünyede en az 2 Ar-Ge personeli bulunması şarttır.";

        Value(text, GrantTextExtractor.FieldTrl).ShouldBe("3-7");
        Value(text, GrantTextExtractor.FieldRdStaff).ShouldBe("2");
    }

    [Fact]
    public void Guven_Skoru_Desenin_Baglayiciligindan_Gelir()
    {
        var fields = _x.Extract(SampleText);

        // Tarih en bağlayıcı desen; başlık tahmini en zayıfı.
        fields.Single(f => f.FieldKey == GrantTextExtractor.FieldDeadline).Confidence.ShouldBe(99);
        fields.Single(f => f.FieldKey == GrantTextExtractor.FieldName).Confidence.ShouldBeLessThan(80);
        fields.ShouldAllBe(f => f.Confidence > 0 && f.Confidence <= 100);
    }

    [Fact]
    public void Her_Alan_Vurgulanacak_Pasaji_Tasir()
    {
        _x.Extract(SampleText).ShouldAllBe(f => !string.IsNullOrWhiteSpace(f.Excerpt));
    }

    [Fact]
    public void Bos_Metin_Hicbir_Alan_Uretmez()
    {
        _x.Extract(null).ShouldBeEmpty();
        _x.Extract("   ").ShouldBeEmpty();
    }

    [Fact]
    public void Gecersiz_Tarih_Kabul_Edilmez()
    {
        // 31 Şubat yok; desen tutsa da tarih üretilmez.
        Value("Son başvuru 31 Şubat 2026 tarihidir.", GrantTextExtractor.FieldDeadline).ShouldBeNull();
    }
}
