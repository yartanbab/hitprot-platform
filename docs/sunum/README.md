# Apya Platform — Tanıtım Sunumları

İki ayrı deste, tek derleme zinciri. Her deste 16 slayt, sıralı anlatım.

| Deste | Kime | Klasör |
|---|---|---|
| `sirket` | Proje yürüten şirketler | [`sirket/`](sirket/) |
| `dernek` | Dernek ve vakıflar | [`dernek/`](dernek/) |

Slayt içerikleri `build/slides-<deste>.mjs` içinde yaşar; PDF, PNG ve PPTX
hepsi oradan üretilir. Bir cümleyi düzeltmek için yalnızca o dosya değiştirilir,
sonra derleme komutu çalıştırılır — üç çıktı da senkron kalır.

## Çıktılar (her deste için)

| Dosya | Ne için |
|---|---|
| `apya-sunum-<deste>.pdf` | Gönderilecek / basılacak sürüm (16 sayfa, 16:9) |
| `apya-sunum-<deste>.pptx` | PowerPoint ile sunum (13,33 × 7,5 inç; konuşmacı notları dolu) |
| `gorseller/slayt-01..16.png` | Teklif, e-posta, web sitesi için tek tek görseller (1600 × 900) |
| `apya-sunum-<deste>.html` | Tarayıcıda gezilen sürüm (↓ ↑ ile slayt geçişi) |

## Slayt sırası (iki destede de aynı iskelet)

| # | Bölüm | Şirket | Dernek |
|---|---|---|---|
| 01 | — | Kapak | Kapak |
| 02 | Neden | Bilgi altı ayrı yerde | Fon raporu istendiğinde işler durur |
| 03 | Neden | İş · Para · Belge | Faaliyet · Kaynak · Kanıt |
| 04 | Neden | İşin yolculuğu — **ana görsel** | Kaynaktan rapora giden yol — **ana görsel** |
| 05 | Ekranlar | Genel Bakış | Genel Bakış |
| 06 | Ekranlar | Proje konsolu | Fon konsolu |
| 07 | Ekranlar | Görevler: liste · kanban · takvim · Gantt | aynı |
| 08 | Ekranlar | Finans akışı | Kaynak akışı (hibe · bağış · harcama) |
| 09 | Ekranlar | Dokümanlar & formlar | Belgeler & formlar (denetime hazırlık) |
| 10 | Ekranlar | Raporlar | Raporlar (fon bütçesi · cari ekstre · mizan) |
| 11 | Ekranlar | AI Değerlendirme Merkezi | AI ile başvuru ön eleme |
| 12 | Ekranlar | Hibe yönetimi | Fon yönetimi |
| 13 | Güven | Roller ve yetkiler | Roller (yönetim/denetim kurulu dahil) |
| 14 | Güven | Çok şirketli yapı + güvenlik | Şube / temsilcilik + şeffaflık |
| 15 | Güven | Masaüstü / tablet / telefon | aynı |
| 16 | Başlangıç | Dört adım | Dört adım |

## Dernek destesinin kapsam kuralı

**Üyelik ve aidat takibi üründe YOKTUR** — üye modülü, aidat tahakkuku ve
gönüllü yönetimi bulunmaz. Dernek destesi bunlara **hiç değinmez**; ürünün
gerçekten güçlü olduğu yerleri anlatır: fon/hibe yönetimi, bağış ve faturasız
gelir (`IncomeCategory.Donation` / `.Grant`), proje bazlı bütçe, belge düzeni,
rol/yetki ve işlem geçmişi. Yeni slayt eklerken bu kurala uy — olmayan özelliği
anlatma. (Kuruluş tipi olarak "Dernek" ve "Vakıf" üründe `CompanyType` ile
tanımlıdır.)

## Yeniden üretme

```bash
cd docs/sunum/build && bash render.sh dernek all
```

HTML deck'i, PDF'i ve 16 PNG'yi üretir (`sirket` de aynı şekilde). `render.sh
<deste> png` yalnız görselleri, `render.sh <deste> pdf` yalnız PDF'i basar.
Chrome yoksa Edge'e düşer.

PPTX ayrı adımdır; `pptxgenjs` gerekir ama **depoya bağımlılık eklenmemiştir**,
git dışı `_tmp/` altına kurulur:

```bash
cd docs/sunum/build && mkdir -p _tmp/pptx && cd _tmp/pptx && npm init -y && npm install pptxgenjs@4
```

```bash
cd docs/sunum/build && node pptx.mjs dernek
```

PDF'i doğrulamak için (sayfa sayısı, sayfa ölçüsü, koyu zeminlerin basılıp
basılmadığı):

```bash
cd docs/sunum/build && node pdfcheck.mjs ../dernek/apya-sunum-dernek.pdf
```

## Notlar

- **Ekranlar maket, veriler örnektir.** Gerçek ekran görüntüsü istenirse
  PNG'ler birebir aynı ölçüde (1600 × 900) değiştirilebilir; PPTX ve PDF
  yeniden üretilince otomatik güncellenir.
- `build/common.mjs` yalnız **içerik taşımayan** parçaları tutar (SVG ok ucu,
  maket sol menüsü). Metin ve veri her destenin kendi dosyasında kalır —
  desteler bilinçli olarak ayrışacak.
- Renk ve tipografi ürünün kendi tasarım sisteminden alınır
  (`src/Apya.Platform.Web/wwwroot/dynamic-assets/src/styles/tokens.css`);
  fontlar `wwwroot/fonts/` altındaki self-host woff2'lerdir ve HTML'e
  base64 gömülür — çıktılar internet bağlantısı olmadan da aynı görünür.
- Gömülü font yalnız latin + latin-ext kapsar. Yeni bir sembol (ok, üçgen,
  onay işareti vb.) eklerseniz bu aralığın dışında kalır ve sistem fontuna
  düşer; metinle ifade etmek daha güvenlidir.
- Akış slaytlarında ok etiketleri kutular arasındaki ~104 px boşluğa sığmalı —
  yaklaşık 11 karakteri geçme, yoksa kutuların üzerine taşar.
- PDF, Chrome'un `--print-to-pdf` çıktısıdır. `build.mjs` içindeki
  `print-color-adjust: exact` kuralı kaldırılırsa koyu slaytların zemini
  bazı ortamlarda beyaza düşer.
- `render.sh` dosya yollarını `cygpath` ile Windows biçimine çevirir. Bu şarttır:
  MSYS düz argümanları çevirir ama `file:///` önekli bir dizeyi URL sanıp
  dokunmaz; `/e/...` yolu Chrome'a `file:////e/...` olarak gider ve Chrome
  **hata vermeden boş sayfa basar**.
