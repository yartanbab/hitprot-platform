---
name: abp-migration
description: Apya.Platform'da veritabanı şeması değiştirilirken kullanılır. "Migration ekle", "tabloya kolon ekle", "şemayı güncelle", "DbMigrator çalıştır", "migration geri al", "veritabanını güncelle", "add migration", "database update", "EF Core" gibi isteklerde tetiklenir. Yeni entity eklenirken de bu skill'in adımları izlenir. Multi-tenant şema riskleri ve geri alma prosedürü dahil.
---

# Apya'da EF Core Migration

Şema değişikliği **geri alınması en pahalı** işlemdir. Üretimde uygulanmış bir migration
geri alınamaz — sadece telafi edici yeni bir migration yazılabilir. Bu yüzden acele etme.

## Adım 0 — Onay al

Migration oluşturmadan önce **kullanıcıya sor**. Ne değişiyor, neden, veri kaybı riski var mı?

Şu üç soruyu cevapla:

1. **Veri kaybı var mı?** Kolon silme, tip daraltma (`nvarchar(500)` → `nvarchar(100)`),
   nullable → non-nullable geçişi mevcut veriyi bozar.
2. **Tenant'a özel bir tablo mu?** `IMultiTenant` uygulayan entity'lerde `TenantId`
   kolonu ve index'i olmalı. Eksikse tenant izolasyonu kırılır.
3. **Muhasebe tablosu mu?** `JournalEntry`, `JournalEntryLine`, `OutboxMessage`,
   `AccountBalanceProjection` append-only mantığa tabidir. Buradaki değişiklik
   geçmiş kayıtların yeniden hesaplanmasını gerektirebilir.

## Adım 1 — Model değişikliğini yap

`src/Apya.Platform.EntityFrameworkCore/`

- `PlatformDbContext.cs` → `DbSet<{Entity}>` ekle
- `OnModelCreating` → entity konfigürasyonu:
  ```csharp
  builder.Entity<{Entity}>(b =>
  {
      b.ToTable(PlatformConsts.DbTablePrefix + "{Entity}s", PlatformConsts.DbSchema);
      b.ConfigureByConvention();          // audit + soft delete + multi-tenant alanları
      b.Property(x => x.Name).IsRequired().HasMaxLength(256);
      b.HasIndex(x => new { x.TenantId, x.Name });
  });
  ```
- `ConfigureByConvention()` çağrısını atlama — ABP'nin audit ve tenant alanlarını o kuruyor

## Adım 2 — Migration üret

`src/Apya.Platform.EntityFrameworkCore/` dizininden:

```bash
dotnet ef migrations add <AçıklayıcıAd> --startup-project ../Apya.Platform.Web
```

Ad, ne yaptığını anlatsın: `AddCustomerTaxNumber`, `AddIndexOnJournalEntryDate`.
`Update1`, `Fix` gibi adlar 6 ay sonra kimseye bir şey söylemez.

## Adım 3 — Üretilen migration'ı OKU

Bu adımı atlama. EF Core'un ne ürettiğini **gözünle gör**:

`Migrations/<timestamp>_<Ad>.cs` dosyasını aç ve kontrol et:

- Beklemediğin bir `DropColumn` / `DropTable` var mı? → Model'de kazara bir şey sildin
- `AlterColumn` ile tip daralıyor mu? → Veri kaybı
- İlgisiz tablolarda değişiklik var mı? → Model ile veritabanı arasında kayma var,
  önceki bir migration uygulanmamış olabilir
- `Down()` metodu mantıklı mı?

Beklenmedik bir şey varsa **dur, kullanıcıya söyle**. `migrations remove` ile geri al,
modeli düzelt, yeniden üret.

## Adım 4 — Uygula

Geliştirme ortamında iki yol var:

```bash
# Sadece şema
dotnet ef database update --startup-project ../Apya.Platform.Web

# Şema + seed verisi (tercih edilen)
dotnet run --project src/Apya.Platform.DbMigrator
```

`DbMigrator` tenant veritabanlarını da gezer. Multi-tenant değişikliklerde bunu kullan.

## Adım 5 — Doğrula

```
1. dotnet build                     → hata yok
2. DbMigrator hatasız tamamlandı    → çıktıda exception yok
3. Tablo/kolon oluştu               → veritabanında kontrol et
4. Host bağlamında sayfa açılıyor
5. Tenant bağlamında sayfa açılıyor → tenant izolasyonu kırılmadı
6. dotnet test                      → mevcut testler geçiyor
```

## Geri alma

**Henüz uygulanmadıysa** (sadece dosya olarak duruyorsa):
```bash
dotnet ef migrations remove --startup-project ../Apya.Platform.Web
```

**Uygulandıysa ama sadece lokalde:**
```bash
dotnet ef database update <ÖncekiMigrationAdı> --startup-project ../Apya.Platform.Web
dotnet ef migrations remove --startup-project ../Apya.Platform.Web
```

**Üretimde uygulandıysa:** geri alma yok. Telafi edici yeni bir migration yaz
ve veri düzeltmesini ayrıca planla. Bu durumda **kullanıcıyla konuş**, tek başına karar verme.

## Sık yapılan hatalar

| Hata | Sonuç |
|---|---|
| Üretilen migration'ı okumamak | Farkında olmadan kolon silme, veri kaybı |
| `ConfigureByConvention()` atlamak | Audit ve `TenantId` alanları oluşmuyor |
| `TenantId` index'i koymamak | Çok tenant'lı sorgularda ciddi yavaşlama |
| Birden fazla değişikliği tek migration'a doldurmak | Geri alma imkânsızlaşıyor |
| `DbMigrator` yerine `database update` kullanmak | Tenant veritabanları güncellenmiyor |
