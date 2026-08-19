# Apya Platform — Müşteri Tanıtım Sunumu

16 slaytlık sıralı anlatım. **Tek kaynak, üç çıktı**: slayt içerikleri
`build/slides.mjs` içinde yaşar; PDF, PNG ve PPTX hepsi oradan üretilir.
Bir cümleyi düzeltmek için yalnızca `slides.mjs` değiştirilir, sonra derleme
komutu çalıştırılır — üç çıktı da senkron kalır.

## Çıktılar

| Dosya | Ne için |
|---|---|
| `apya-sunum.pdf` | Müşteriye gönderilecek / basılacak sürüm (16 sayfa, 16:9) |
| `apya-sunum.pptx` | PowerPoint ile sunum (13,33 × 7,5 inç; konuşmacı notları dolu) |
| `gorseller/slayt-01..16.png` | Teklif, e-posta, web sitesi için tek tek görseller (1600 × 900) |
| `apya-sunum.html` | Tarayıcıda gezilen sürüm (↓ ↑ ile slayt geçişi) |

## Slayt sırası

| # | Bölüm | Slayt |
|---|---|---|
| 01 | — | Kapak |
| 02 | Neden | Bugün bilgi altı ayrı yerde duruyor |
| 03 | Neden | Apya üç şeyi birbirine bağlar (iş · para · belge) |
| 04 | Neden | İşin baştan sona yolculuğu — **ana görsel** |
| 05 | Ekranlar | Genel Bakış |
| 06 | Ekranlar | Proje konsolu |
| 07 | Ekranlar | Görevler: liste · kanban · takvim · Gantt |
| 08 | Ekranlar | Finans akışı |
| 09 | Ekranlar | Dokümanlar & formlar |
| 10 | Ekranlar | Raporlar |
| 11 | Ekranlar | AI Değerlendirme Merkezi |
| 12 | Ekranlar | Hibe yönetimi |
| 13 | Güven | Roller ve yetkiler |
| 14 | Güven | Çok şirketli yapı + güvenlik |
| 15 | Güven | Masaüstü / tablet / telefon |
| 16 | Başlangıç | Kullanmaya başlamak: dört adım |

## Yeniden üretme

```bash
cd docs/sunum/build && bash render.sh all
```

HTML deck'i, PDF'i ve 16 PNG'yi üretir. `render.sh png` yalnız görselleri,
`render.sh pdf` yalnız PDF'i basar. Chrome yoksa Edge'e düşer.

PPTX ayrı adımdır; `pptxgenjs` gerekir ama **depoya bağımlılık eklenmemiştir**,
git dışı `_tmp/` altına kurulur:

```bash
cd docs/sunum/build && mkdir -p _tmp/pptx && cd _tmp/pptx && npm init -y && npm install pptxgenjs@4
```

```bash
cd docs/sunum/build && node pptx.mjs
```

PDF'i doğrulamak için (sayfa sayısı, sayfa ölçüsü, koyu zeminlerin basılıp
basılmadığı):

```bash
cd docs/sunum/build && node pdfcheck.mjs ../apya-sunum.pdf
```

## Notlar

- **Ekranlar maket, veriler örnektir.** Gerçek ekran görüntüsü istenirse
  PNG'ler birebir aynı ölçüde (1600 × 900) değiştirilebilir; PPTX ve PDF
  yeniden üretilince otomatik güncellenir.
- Renk ve tipografi ürünün kendi tasarım sisteminden alınır
  (`src/Apya.Platform.Web/wwwroot/dynamic-assets/src/styles/tokens.css`);
  fontlar `wwwroot/fonts/` altındaki self-host woff2'lerdir ve HTML'e
  base64 gömülür — çıktılar internet bağlantısı olmadan da aynı görünür.
- Gömülü font yalnız latin + latin-ext kapsar. Yeni bir sembol (ok, üçgen,
  onay işareti vb.) eklerseniz bu aralığın dışında kalır ve sistem fontuna
  düşer; metinle ifade etmek daha güvenlidir.
- PDF, Chrome'un `--print-to-pdf` çıktısıdır. `build.mjs` içindeki
  `print-color-adjust: exact` kuralı kaldırılırsa koyu slaytların zemini
  bazı ortamlarda beyaza düşer.
