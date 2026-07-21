# Apya.Platform

ABP Framework / .NET 10, katmanlı DDD, multi-tenant. MVC + Razor Pages (LeptonX Lite teması).
Proje & görev yönetimi + çift taraflı muhasebe (cari, kasa, fatura, kur değerleme) platformu.

---

## 1. Solution haritası

İki modül ağacı var. Yeni kod yazarken hangisine ait olduğunu **önce belirle**:

**Çekirdek** — `src/Apya.Platform.*`

| Katman | Ne barındırır | Neye referans veremez |
|---|---|---|
| `Domain.Shared` | Enum, sabit, localization (`Localization/Platform/*.json`) | Her şey buna bakabilir, bu hiçbir şeye bakmaz |
| `Domain` | Entity, Aggregate Root, `*Manager` domain service, `I*Repository` | DTO, EF Core, UI |
| `Application.Contracts` | DTO (`{Alan}.Dtos`), `I*AppService`, `PlatformPermissions` | Application, EF Core, UI |
| `Application` | AppService, AutoMapper profilleri, orkestrasyon | UI |
| `EntityFrameworkCore` | DbContext, entity config, migration, repository impl | UI |
| `HttpApi` / `HttpApi.Client` | REST controller / generated proxy | — |
| `Web` | Razor Pages, `wwwroot`, view model | — |
| `DbMigrator` | Migration + seed konsol uygulaması | — |

**AI modülü** — `src/Apya.Platform.Ai.*` (Domain.Shared, Domain, Application.Contracts, Application, EntityFrameworkCore, HttpApi)
Aynı katman kuralları geçerli. Çekirdek modül AI modülüne referans **vermez**; bağımlılık tek yönlüdür.

Domain alanları: `Projects`, `Tasks`, `Accounting`, `Invoices`, `Customers`, `CashAccounts`, `Expenses`, `Incomes`, `FxRevaluations`, `ExchangeRates`, `Documents`, `DynamicAssets`, `Calendars`, `Notifications`, `Grants`, `Tenants`.
Her katmanda **aynı alan klasörü** kullanılır: `Domain/Projects/` ↔ `Application/Projects/` ↔ `Web/Pages/Projects/`.

---

## 2. Konvansiyonlar

- **Domain service** → `*Manager` (`ProjectManager`, `InvoiceManager`, `JournalEntryManager`). İş kuralı buraya, AppService'e değil.
- **Distributed event** → `*Eto` (`TaskAssignedEto`)
- **DTO** → `Apya.Platform.{Alan}.Dtos` namespace'i, `Application.Contracts` içinde
- **AppService** → `CrudAppService<...>` türetilir, `[Authorize]` ile işaretlenir, namespace `Apya.Platform.Application.{Alan}`
- **Repository interface** → aggregate'in yanında, Domain katmanında
- **İzin** → `PlatformPermissions.{Alan}.{Default|Create|Edit|Delete}`; `PlatformPermissionDefinitionProvider`'a kaydedilmeden çalışmaz
- **Multi-tenant** → tenant'a özel her entity `IMultiTenant` uygular. Host bağlamında (`CurrentTenant.Id == null`) tenant seçimi açıkça ele alınır.
- İsimlendirme: sınıf/metot `PascalCase`, parametre/lokal `camelCase`, private field `_camelCase`
- Tüm I/O ve DB işlemleri async, metot adı `Async` ile biter
- Bağımlılıklar constructor injection ile
- DTO↔Entity dönüşümü **AutoMapper** ile; elle mapping yazma
- Kullanıcıya dönen metinler Türkçe (`Localization/Platform/tr.json`), koda gömülmez

---

## 3. Komutlar

```bash
dotnet build Apya.Platform.sln
dotnet test

# Migration (EntityFrameworkCore proje dizininde)
dotnet ef migrations add <Ad> --startup-project ../Apya.Platform.Web
dotnet ef database update --startup-project ../Apya.Platform.Web

# Migration + seed uygula
dotnet run --project src/Apya.Platform.DbMigrator

# İstemci kütüphaneleri
abp install-libs
```

Web: `https://localhost:44386`

---

## 4. Arama hijyeni — ÖNEMLİ

Bu repoda 76.000+ dosya var; büyük kısmı build çıktısı ve bağımlılık.
**Kök dizinde kapsamsız arama yapma.** Her aramada yolu daralt ve şunları dışarıda bırak:

```
node_modules/   bin/   obj/   wwwroot/libs/   wwwroot/dynamic-assets/node_modules/   .claude/worktrees/
```

- Bir sınıfın nerede olduğunu ararken önce alan klasörünü tahmin et (`src/Apya.Platform.Domain/Accounting/`), tüm `src/`'yi tarama
- Geniş keşif gerekiyorsa `Explore` subagent'ı kullan — dosya dökümü değil sonuç döner
- `.claude/worktrees/` altında reponun eski kopyaları var; arama sonuçlarını çoğaltırlar, oradan okuma

---

## 5. Çalışma prensipleri

### Varsayma
- Belirsizlik varsa sor. Sessizce bir yorumu seçip devam etme.
- Bir sınıfın veya arayüzün içeriğini bilmiyorsan **oku**; hatırladığını sanıp kod uydurma.
- Birden fazla makul yaklaşım varsa ikisini de sun, birini sessizce seçme.
- Daha basit bir yol varsa söyle. İtiraz etmen gerektiğinde et.

### Sade tut
- İstenmeyen özellik ekleme. Tek kullanımlık kod için soyutlama üretme.
- İstenmemiş "esneklik" / "konfigüre edilebilirlik" ekleme.
- Gerçekleşmesi imkânsız senaryolar için hata yönetimi yazma.
- 200 satır yazdıysan ve 50 satır yetiyorsa, baştan yaz.

### Cerrahi müdahale
- Dosyanın tamamını yeniden yazma; sadece ilgili satır/metodu değiştir.
- Görevinle ilgisiz kodu, yorumu veya formatı "iyileştirme".
- Mevcut stile uy, kendin farklı yazacak olsan bile.
- İlgisiz ölü kod fark edersen **söyle**, silme.
- Ölçü: değişen her satır kullanıcının isteğine doğrudan bağlanabilmeli.

### Onay gerektiren işler
Şunları yapmadan önce **daima kullanıcıdan onay al**:
- Mimari karar (yeni katman, yeni modül, bağımlılık yönü değişikliği)
- Veritabanı şeması değişikliği / yeni migration
- Büyük blok silme veya refactor
- Paket ekleme/yükseltme

### Doğrulanabilir bitiş
Çok adımlı işlerde önce kısa bir plan söyle, her adıma bir doğrulama iliştir:

```
1. [adım] → doğrulama: [kontrol]
2. [adım] → doğrulama: [kontrol]
```

"Çalışıyor" yeterli değil — `dotnet build` geçti mi, ilgili test geçti mi, sayfa açılıyor mu, somut söyle.
Doğrulamadan "tamamlandı" deme.
