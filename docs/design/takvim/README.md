# Takvim modülü — tasarım maketleri

Bu klasör `/Calendars` yeniden tasarımının **kaynak maketleridir**. Daha önce
yalnızca sohbet oturumuna ek olarak geliyorlardı; yeni bir turda "maket nerede"
diye aramamak ve uygulamayı ekran görüntüsüyle değil kaynakla karşılaştırmak
için depoya alındılar.

## Dosyalar

| Dosya | Ne |
|---|---|
| `takvim-yeniden-tasarim.dc.html` | Ana maket — 7 tasarım turu, birden çok ekran |
| `takvim-ciktisi.dc.html` | A4 baskı / PDF çıktısı referansı |
| `uygulama-promptu.md` | 12 bölümlük uygulama brief'i + kabul kriterleri |
| `tasarim-senkron-manifesti.md` | Tasarım aracının depoyla senkron kaydı |
| `support.js`, `doc-page.js` | Maketlerin çalışma zamanı — **silme** |

`support.js` ve `doc-page.js` HTML'lerden **göreli yolla** (`./support.js`)
yükleniyor; aynı klasörde durmazlarsa maketler boş açılır.

Maketler dışarıdan iki kaynak daha çeker: Font Awesome CDN ve Google Calendar
SVG'si. İnternet olmadan ikonlar eksik görünür, düzen bozulmaz.

## Hangi ekran hangisi

Ana makette ekranlar `4a`, `1a` gibi etiketlerle işaretli. **`4a` — "/Calendars
— yeniden tasarlanmış"** uygulanan son tasarımdır; ay görünümü, sol kaynak rayı
ve sağ gün paneli oradan okunur.

Bir bölümün metin iskeletini çıkarmak için (277 KB'lık dosyayı baştan sona
okumaya gerek yok):

```bash
sed -n '812,930p' takvim-yeniden-tasarim.dc.html | sed 's/<[^>]*>/\n/g' | grep -v '^\s*$'
```

`812` satırı ekran `4a`'nın başlangıcıdır; başka bir ekran için
`grep -n "yeniden tasarlanmış\|/Calendars —"` ile sınırları bul.

## Uygulama ile arasındaki bilinen farklar

Maket ile kodun **bilinçli** olarak ayrıştığı üç nokta (PR #202):

1. **Riskli pill'de tarama deseni var, makette yok.** Risk üç kanaldan
   anlatılıyor (renk + desen + ikon); renk körlüğü için tek başına renk yeterli
   değil.
2. **Ekip avatar çipleri yalnız ekip katmanı açıkken dolar.** Katman kapalıyken
   ekip sorgusu hiç atılmıyor; uydurma isim gösterilmiyor.
3. **`Filtre` düğmesi panel açmaz, filtreleri temizler.** Filtre paneli yapmak
   eksik kabuk değil yeni özellik olurdu.

Ayrıca gider ve gelir rayda tek satır ("Gider / gelir") görünür ama enum'da
**ayrı** kalır — sunucu, izin ve tercih kaydı öyle çalışıyor; birleştirme
yalnızca görünüm katmanındadır (`RAIL_GROUPS`).
