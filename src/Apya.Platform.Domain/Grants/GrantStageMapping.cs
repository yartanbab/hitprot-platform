using System;

namespace Apya.Platform.Grants;

/// <summary>
/// 🔴 DOM-01: Şablon adımı → sabit aşama eşlemesinin VARSAYILANI.
///
/// <para>Eşleme asıl olarak <see cref="GrantStageTemplateStep.Stage"/>'de, host'un
/// seçtiği değerde durur. Burası yalnız mevcut şablonları doldurmak ve yeni adıma
/// makul bir başlangıç vermek için kullanılır — host her zaman üzerine yazabilir.</para>
///
/// <para>İki kural, bu sırayla:</para>
/// <list type="number">
/// <item>Adın adı sabit aşamanın Türkçe karşılığıysa doğrudan o aşama. Varsayılan
/// şablonun dört adımı tam olarak böyle adlandırılmıştır (Başvuru · Değerlendirme ·
/// Onay · Ödeme), yani orada eşleme bire birdir.</item>
/// <item>Değilse adımın şablondaki KONUMU dört aşamaya oranlanır. Altı adımlı bir
/// şablonda ilk iki adım Başvuru, sonrakiler sırayla ilerler. Kaba ama tahmin
/// edilebilir; alternatifi her adımı "Başvuru" saymaktı ve o, huniyi yanlış gösterirdi.</item>
/// </list>
/// </summary>
public static class GrantStageMapping
{
    /// <summary>Adın sabit aşamayla birebir karşılığı; yoksa <c>null</c>.</summary>
    public static GrantApplicationStage? MatchByName(string? name)
    {
        var clean = (name ?? string.Empty).Trim();
        if (clean.Length == 0)
        {
            return null;
        }

        // OrdinalIgnoreCase Türkçe 'ş'/'ö' için doğru çalışır; 'I'/'İ' ayrımı bu dört
        // adın hiçbirinde ayırt edici değil (tr kültürüne özel karşılaştırma gerekmiyor).
        if (string.Equals(clean, "Başvuru", StringComparison.OrdinalIgnoreCase)) return GrantApplicationStage.Basvuru;
        if (string.Equals(clean, "Değerlendirme", StringComparison.OrdinalIgnoreCase)) return GrantApplicationStage.Degerlendirme;
        if (string.Equals(clean, "Onay", StringComparison.OrdinalIgnoreCase)) return GrantApplicationStage.Onay;
        if (string.Equals(clean, "Ödeme", StringComparison.OrdinalIgnoreCase)) return GrantApplicationStage.Odeme;
        return null;
    }

    /// <summary>
    /// Adımın varsayılan aşaması: önce ada, sonra konuma bakar.
    /// </summary>
    /// <param name="name">Adım adı.</param>
    /// <param name="order">Adımın şablondaki sırası (0'dan başlar).</param>
    /// <param name="stepCount">Şablondaki toplam adım sayısı.</param>
    public static GrantApplicationStage Suggest(string? name, int order, int stepCount)
    {
        var byName = MatchByName(name);
        if (byName.HasValue)
        {
            return byName.Value;
        }

        var count = Math.Max(1, stepCount);
        var index = Math.Clamp(order, 0, count - 1);
        var bucket = index * StageCount / count;
        return (GrantApplicationStage)Math.Clamp(bucket, 0, StageCount - 1);
    }

    private const int StageCount = 4;
}
