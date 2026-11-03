using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// Islak imza / kaşe şartı katalogda yalnız evrak adında yazıyordu; kural adı okur.
/// Uyarı, dosyadan okunan bilgi şartla karşılaştırılarak üretilir.
/// </summary>
public class GrantDocumentSignatureRules_Tests
{
    [Theory]
    [InlineData("Faaliyet Planı (EK TD2; imzalı-kaşeli)", true)]
    [InlineData("KAYS Taahhütnamesi (e-imza; aksi halde 5 iş günü içinde ıslak imzalı teslim)", true)]
    [InlineData("İmza Örneği/Sirküleri (tatbiki imza veya noter tasdikli güncel imza sirküleri)", true)]
    [InlineData("Eğitmen/danışman özgeçmişi ve firmanın kaşe/imzayla onayladığı iş tanımı (proforma eki)", true)]
    [InlineData("Uluslararası Başvuru Formu (1. ve 2. aşama ulusal başvuruda PBS'ye yüklenir, e-imzalı)", false)]
    [InlineData("Proje Önerisi (PRODİS, 1719 ulusal çağrısı, e-imzalı)", false)]
    [InlineData("Başvuru formu (elektronik imza ile)", false)]
    [InlineData("Vergi levhası", false)]
    public void Islak_imza_sarti_addan_cikarilir(string name, bool expected)
    {
        GrantDocumentSignatureRules.InfersWetSignature(name).ShouldBe(expected);
    }

    [Theory]
    [InlineData("Faaliyet Planı (EK TD2; imzalı-kaşeli)", true)]
    [InlineData("Başvuru Sahibi Beyannamesi (imzalı, mühürlü/kaşeli)", true)]
    [InlineData("EK-C Yaklaşık Maliyet Formu (Kaşeli-imzalı)", true)]
    [InlineData("Proje Önerisi (PRODİS, 1719 ulusal çağrısı, e-imzalı)", false)]
    public void Kase_sarti_addan_cikarilir(string name, bool expected)
    {
        GrantDocumentSignatureRules.InfersStamp(name).ShouldBe(expected);
    }

    private static readonly GrantDocumentFileInspection WordExport = new(false, false, 0);
    private static readonly GrantDocumentFileInspection Scan = new(false, true, 0);
    private static readonly GrantDocumentFileInspection ESigned = new(true, false, 0);

    [Fact]
    public void Islak_imza_istenen_evrak_Word_ciktisiysa_uyarilir()
    {
        GrantDocumentSignatureRules.Evaluate(false, true, true, WordExport)
            .ShouldBe([GrantDocumentPreCheckWarning.NotScanned]);
    }

    [Fact]
    public void Islak_imza_istenen_evrak_taranmissa_uyari_yok()
    {
        GrantDocumentSignatureRules.Evaluate(false, true, true, Scan).ShouldBeEmpty();
    }

    [Fact]
    public void E_imza_islak_imzanin_ve_kasenin_yerini_tutar()
    {
        GrantDocumentSignatureRules.Evaluate(false, true, true, ESigned).ShouldBeEmpty();
    }

    [Fact]
    public void Yalniz_e_imza_istenen_evrak_e_imzasizsa_uyarilir_taranmis_olsa_bile()
    {
        GrantDocumentSignatureRules.Evaluate(true, false, false, Scan)
            .ShouldBe([GrantDocumentPreCheckWarning.ESignatureMissing]);
    }

    [Fact]
    public void E_imza_yoksa_islak_imza_istenen_evrakta_tarama_yeter()
    {
        GrantDocumentSignatureRules.Evaluate(true, true, false, Scan).ShouldBeEmpty();
        GrantDocumentSignatureRules.Evaluate(true, true, false, WordExport)
            .ShouldBe([GrantDocumentPreCheckWarning.NotScanned]);
    }

    [Fact]
    public void Imza_istenmeyen_evrakta_yalniz_bos_alan_uyarilir()
    {
        GrantDocumentSignatureRules.Evaluate(false, false, false, WordExport).ShouldBeEmpty();
        GrantDocumentSignatureRules.Evaluate(false, false, false, new GrantDocumentFileInspection(false, false, 2))
            .ShouldBe([GrantDocumentPreCheckWarning.EmptyFields]);
    }

    [Fact]
    public void Okunamayan_dosyada_uyari_uretilmez()
    {
        GrantDocumentSignatureRules.Evaluate(true, true, true, null).ShouldBeEmpty();
    }
}
