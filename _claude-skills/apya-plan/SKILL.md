---
name: apya-plan
description: Büyük veya belirsiz bir iş başlamadan önce kapsamı netleştirip uygulama planı çıkarmak için kullanılır. "Şunu yapalım", "bu modülü ekleyelim", "refactor edelim", "nasıl yapsak", "plan çıkar", "bunu konuşalım", "büyük bir değişiklik" gibi isteklerde ve birden fazla dosyaya/katmana dokunacak her işte tetiklenir. Önce soru sorup tasarımı onaylatır, sonra adım adım doğrulanabilir plan üretir. Tek dosyalık küçük düzeltmeler için DEĞİL.
---

# Apya — Plan Çıkarma

Bu skill'in amacı **yanlış şeyi inşa etmeyi önlemek.** Büyük bir işte en pahalı hata
kötü kod değil, üç saat sonra "aslında bunu istememiştim" cevabıdır.

Kural: birden fazla katmana dokunacak veya 3+ dosya değiştirecek hiçbir işe
plan onaylanmadan başlama.

## Faz 1 — Anla (kod yazma, dosya değiştirme)

Kullanıcının söylediği şey genelde çözüm önerisidir, problem değil.
Önce **problemi** bul.

Sor:

- **Gerçek amaç ne?** "Şu tabloya kolon ekleyelim" → hangi soruya cevap vermek için?
- **Kim kullanacak?** Hangi rol, hangi tenant, hangi ekran?
- **Şu an nasıl çözülüyor?** Elle mi, başka bir ekrandan mı, hiç mi?
- **Ne kadar veri?** 100 kayıt mı, 100 bin mi? Bu mimariyi değiştirir.
- **Bitince ne doğru olacak?** Somut, ölçülebilir bir cümle.

Aynı anda **bir soru** sor, cevabı bekle. Beş soruyu tek mesajda sorma —
kullanıcı hepsini birden cevaplamaz, en önemlisi kaybolur.

Kod tabanında zaten benzer bir şey varsa **oku ve göster**: "Bu, `Invoices` alanındaki
şu yapıya benziyor, aynı deseni mi izleyelim?"

## Faz 2 — Tasarımı sun ve onaylat

Kod yazmadan önce kısa bir tasarım özeti ver. Uzun döküman değil, okunabilir birkaç paragraf:

```
Ne yapıyoruz:      [tek cümle]
Nereye giriyor:    [modül + katman + alan klasörü]
Yeni ne oluşuyor:  [entity / appservice / sayfa listesi]
Neye dokunuyoruz:  [mevcut dosyalar]
Şema değişiyor mu: [evet/hayır — evetse ne değişiyor]
Riskler:           [veri kaybı, tenant izolasyonu, performans, geriye uyum]
Kapsam dışı:       [bilinçli olarak yapmadığımız şeyler]
```

**Birden fazla makul yaklaşım varsa ikisini de sun.** Sessizce birini seçme.
Her birinin maliyetini ve borcunu yaz. Tavsiyeni söyle ama kararı kullanıcıya bırak.

Basit bir yol varsa **söyle**. Kullanıcı karmaşık bir şey istediyse ve daha sade
bir çözüm işi görüyorsa, itiraz et.

Onay al. "Devam edeyim mi?" diye sor ve **cevabı bekle**.

## Faz 3 — Adım planı yaz

Onaydan sonra işi küçük, sırayla doğrulanabilir adımlara böl.

Her adım şunları içermeli:
- Hangi dosya (tam yol)
- Ne değişiyor (tek cümle)
- Nasıl doğrulanıyor (somut kontrol)

```
1. Domain/Customers/CustomerTaxInfo.cs oluştur
   → doğrulama: dotnet build geçiyor

2. Application.Contracts/Customers/Dtos/ altına DTO'lar
   → doğrulama: dotnet build geçiyor

3. PlatformPermissions + DefinitionProvider kaydı
   → doğrulama: izin UI'da görünüyor

4. Migration üret ve OKU
   → doğrulama: beklenmedik DropColumn yok
...
```

Adımlar 5-15 dakikalık olsun. Bir adım "tüm modülü yaz" diyorsa, çok büyüktür.

Şema değişikliği içeren adımı **ayrı işaretle** — orada ayrıca onay gerekir.

## Faz 4 — Uygula

- Adımları sırayla yap, her adımdan sonra doğrulamayı çalıştır
- Bir adım beklenenden farklı çıkarsa **dur ve söyle**, planı zorlamaya çalışma
- Yolda plana girmemiş bir iş keşfedersen listeye ekle, sessizce yapma
- Plan dışına çıkman gerekiyorsa önce nedenini açıkla

## Ne zaman bu skill'i atlarsın

- Tek dosyada tek satır düzeltme
- Yazım hatası, eksik null kontrolü
- Kullanıcı zaten net ve detaylı bir talimat verdiyse
- Salt okuma / araştırma isteği

Bu durumlarda plan çıkarmak gereksiz yavaşlatır. Yargını kullan.

## Diğer skill'lerle ilişki

Bu skill **önce** çalışır, sonra iş türüne göre devir teslim yapar:

- Yeni özellik / entity / CRUD → `abp-ozellik-gelistirme`
- Şema değişikliği → `abp-migration`
- Arayüz / stil → `apya-redesign`
- Mobil entegrasyon → `apya-mobil-api`

Plan onaylandıktan sonra ilgili skill'in adım listesini izle. Planı iki kez yazma.

## Not

Bu akış test-driven development dayatmaz. Apya'nın önemli bir kısmı Razor sayfaları
ve CSS — bunlar için TDD anlamsız. Ancak **domain katmanında iş kuralı** yazıyorsan
(`*Manager`, muhasebe hesaplamaları, `Money` işlemleri) test yazmayı planın bir adımı
olarak öner: orada test gerçekten değer üretir.
