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
# Çözüm dosyası .slnx'tir (.sln YOK). Build öncesi çalışan Web uygulamasını DURDUR:
# aksi halde bin/ altındaki DLL'ler kilitli olduğu için MSB3021 "being used by
# another process" hatalarıyla düşer (kod hatası sanma).
dotnet build Apya.Platform.slnx
dotnet test Apya.Platform.slnx

# --- Migration: HER şema değişikliğinde İKİ tane üret (çift provider) ---
# Postgres — appsettings "SqlServer" dediği için sağlayıcıyı override ET, yoksa
# "target project doesn't match your migrations assembly" hatası alırsın.
cd src/Apya.Platform.EntityFrameworkCore
Database__Provider=PostgreSql dotnet ef migrations add <Ad> --startup-project ../Apya.Platform.Web

# SQL Server — migration'lar AYRI assembly'de; proje kendi startup'ı olmalı
# (Web startup olursa Generic Host design-time factory'yi atlar).
cd src/Apya.Platform.EntityFrameworkCore.SqlServer
dotnet ef migrations add <Ad> --project . --startup-project . --output-dir Migrations

# --- Migration + seed uygula: PROJE DİZİNİNDEN (aşağıdaki nota bak) ---
cd src/Apya.Platform.DbMigrator
dotnet run -- --OpenIddict:Applications:Platform_Web:ClientSecret=<secret>

# --- Yalnız şema uygula (SEED ÇALIŞMAZ — aşağıdaki uyarıya bak) ---
cd src/Apya.Platform.EntityFrameworkCore.SqlServer
dotnet ef database update --project . --startup-project .
# Postgres'e uygulamak için:
#   cd src/Apya.Platform.EntityFrameworkCore
#   Database__Provider=PostgreSql dotnet ef database update --startup-project ../Apya.Platform.Web

# İstemci kütüphaneleri (wwwroot/libs) — worktree'de ŞART.
# Eksikse Web her isteğe 500 "The Libs Folder is Missing!" döner.
abp install-libs

# React uygulaması (wwwroot/dynamic-assets) — abp install-libs SONRASINDA ŞART.
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npm ci
```

> **`abp install-libs` çalıştırdıysan `npm ci`'yi ATLAMA.** install-libs,
> `wwwroot/dynamic-assets` altında **yarn** çalıştırır; bu proje ise **npm** ile kuruludur
> (`package-lock.json` commit'lidir). `@testing-library/dom` bir *peer dependency* ve
> yarn v1 peer'ları kurmaz → paket `node_modules`'a hiç inmez ve frontend testleri
> `Cannot find module '@testing-library/dom'` ile toptan patlar (37 dosya / 242 test).
> `npm ci` doğru kurulumu geri getirir.
>
> Aynı sebeple **`dynamic-assets/yarn.lock`'ta oluşan değişikliği COMMIT ETME** —
> kazanım değil, install-libs artığıdır: kilit dosyasından `@testing-library/dom` ve
> bağımlılıklarını düşürür, yerine yalnız o makineye özgü platform ikililerini
> (`@esbuild/*`, `fsevents`) ekler. `git checkout -- .../yarn.lock` ile at.

> **DbMigrator'ı depo kökünden çalıştırma.** `Host.CreateDefaultBuilder` yapılandırmayı
> **çalışma dizininden** okur, `appsettings.json` ise proje dizinindedir. Kökten
> `dotnet run --project src/Apya.Platform.DbMigrator` dersen appsettings HİÇ yüklenmez →
> `Database:Provider` görülmez, Npgsql varsayılanına düşer ve bağlantı dizesi boş gelir
> (`The ConnectionString property has not been initialized`). Önce `cd` et.
>
> **`ClientSecret` parametresi şart.** `appsettings.json`'da `Platform_Web` istemcisinin
> secret'ı boştur; `OpenIddictDataSeedContributor` confidential istemcide boş secret'ı
> reddeder ve **tüm tohumlama zincirini** daha ilk adımda düşürür. Tarayıcı girişini
> etkilemez — uygulama non-tiered, giriş çerez tabanlıdır; bu istemci API/Swagger içindir.
>
> **Başarıyı çıkış kodundan değil log'dan doğrula:** `"Successfully completed all database
> migrations."` satırını ara. Tam log `src/Apya.Platform.DbMigrator/Logs/logs.txt`'te.

> **`dotnet ef database update` yalnız ŞEMA uygular — TOHUMLAMA ÇALIŞTIRMAZ.**
> DbMigrator ise migrate **+ seed** yapar (admin kullanıcısı, OpenIddict istemcisi,
> izin/paket tohumları). Boş bir veritabanını sadece `database update` ile kurarsan
> uygulama ayağa kalkar ama **giriş yapılamaz**. Günlük kullanımda DbMigrator'ı tercih et;
> `database update`'i tek bir migration'ı hızlıca uygulamak/geri almak gibi cerrahi
> durumlar için sakla.
>
> Hedef veritabanı `Database:Provider` + connection string'den çözülür — **bulunduğun
> proje dizininden DEĞİL.** (`migrations add`'deki "target project doesn't match your
> migrations assembly" hatası burada çıkmaz; komut sessizce config'in gösterdiği
> sağlayıcıya uygular.) Postgres'e uygulayacaksan override'ı unutma, yoksa farkında
> olmadan SQL Server'a gidersin.

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
