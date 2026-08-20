using System.Collections.Generic;

namespace Apya.Platform.Web.Tour;

/// <summary>
/// Turda gösterilen tek bir slayt.
/// </summary>
/// <param name="Image">
/// <c>wwwroot/tanitim/</c> altındaki dosya adı. Görseller elle konmaz;
/// <c>docs/sunum/build/render.sh</c> kopyalar (bkz. sınıf açıklaması).
/// </param>
/// <param name="TitleKey">Lokalizasyon anahtarı — slaytın başlığı.</param>
/// <param name="BodyKey">Lokalizasyon anahtarı — tek cümlelik açıklama.</param>
public sealed record TourSlide(string Image, string TitleKey, string BodyKey);

/// <summary>
/// İlk girişte açılan tanıtım turunun içeriği — 16 slaytlık tam sunumdan
/// seçilmiş 6 slayt: ne olduğu, işin akışı, üç ana ekran, nasıl başlanacağı.
///
/// <para>
/// GÖRSELLER BURADAN ÜRETİLMEZ. Kaynak <c>docs/sunum/build/slides.mjs</c>'tir;
/// <c>render.sh all</c> hem sunumu üretir hem de buradaki 6 slaytı
/// <c>wwwroot/tanitim/</c>'e kopyalar. Bu listeye slayt ekler/çıkarırsan
/// <c>render.sh</c> içindeki dosya numarası listesini de güncelle —
/// <c>TourSlideCatalog_Tests</c> ikisinin ayrışmasını yakalar.
/// </para>
///
/// <para>
/// Başlık ve açıklama METİN olarak da tutulur çünkü 1600×900 slayt görseli
/// telefon genişliğine sığdırılınca üzerindeki yazı okunamaz hale gelir;
/// dar ekranda görselin altına bu metinler basılır. Aynı metinler görselin
/// <c>alt</c> değeri olarak da kullanılır.
/// </para>
/// </summary>
public static class TourSlideCatalog
{
    public static IReadOnlyList<TourSlide> All { get; } = new List<TourSlide>
    {
        new("slayt-01.png", "Tour:Slide:Welcome:Title",  "Tour:Slide:Welcome:Body"),
        new("slayt-04.png", "Tour:Slide:Flow:Title",     "Tour:Slide:Flow:Body"),
        new("slayt-05.png", "Tour:Slide:Overview:Title", "Tour:Slide:Overview:Body"),
        new("slayt-06.png", "Tour:Slide:Projects:Title", "Tour:Slide:Projects:Body"),
        new("slayt-08.png", "Tour:Slide:Finance:Title",  "Tour:Slide:Finance:Body"),
        new("slayt-16.png", "Tour:Slide:Start:Title",    "Tour:Slide:Start:Body"),
    };

    /// <summary>Görsellerin ve tam sunum PDF'inin sunulduğu kök yol.</summary>
    public const string AssetPath = "/tanitim";

    /// <summary>Tam sunum (16 slayt) — turdaki "PDF indir" düğmesi buna gider.</summary>
    public const string PdfPath = AssetPath + "/apya-sunum.pdf";
}
