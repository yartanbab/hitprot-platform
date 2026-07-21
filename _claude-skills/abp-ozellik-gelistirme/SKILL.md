---
name: abp-ozellik-gelistirme
description: Apya.Platform'a yeni bir özellik, modül, entity, CRUD ekranı veya AppService eklerken kullanılır. "Yeni özellik ekle", "şu entity'yi oluştur", "CRUD sayfası yap", "yeni AppService yaz", "şu alanı ekle", "add feature", "create entity", "new CRUD page", "scaffold" gibi isteklerde tetiklenir. ABP'nin katman sırasını (Entity → DTO → AppService → izin → localization → Razor) ve Apya konvansiyonlarını uygular. Var olan bir hatayı çözmek için DEĞİL (bunun için abp-hata-ayiklama).
---

# Apya'da Yeni Özellik Geliştirme

ABP'de bir CRUD özelliği **8 dosyaya sabit bir sırayla** dokunur. Sırayı atlama —
sonraki adım öncekine dayanır, ters gidersen derlenmeyen ara durumlar oluşur.

## Adım 0 — Önce netleştir (kod yazmadan)

Bunlar belli değilse **sor**:

1. **Hangi modül?** Çekirdek (`Apya.Platform.*`) mi, AI (`Apya.Platform.Ai.*`) mi?
2. **Hangi alan klasörü?** Mevcut bir alana mı giriyor (`Projects`, `Accounting`, `Invoices`...) yoksa yeni alan mı?
3. **Tenant'a özel mi?** Öyleyse `IMultiTenant` gerekir.
4. **Var olan bir aggregate'e mi bağlı?** Öyleyse yeni aggregate root değil, child entity olabilir.
5. **Basit CRUD mu, iş kuralı var mı?** İş kuralı varsa `*Manager` domain service gerekir.

Benzer bir özellik zaten varsa **onu oku ve pattern'i taklit et**. `Projects` veya
`Invoices` alanı iyi referanslardır. Yeni pattern icat etme.

## Adım 1 — Domain

`src/Apya.Platform.Domain/{Alan}/{Entity}.cs`

- `AggregateRoot<Guid>` veya `Entity<Guid>` türet
- Tenant'a özelse `IMultiTenant` uygula, `TenantId` ekle
- Setter'ları `private set` yap; değişiklik metotlar üzerinden
- İş kuralı varsa `{Alan}/{Entity}Manager.cs` domain service'i ekle — kural AppService'e sızmasın
- Özel sorgu gerekiyorsa `I{Entity}Repository` arayüzünü aggregate'in yanına koy

## Adım 2 — Application.Contracts

`src/Apya.Platform.Application.Contracts/{Alan}/`

- `Dtos/{Entity}Dto.cs`, `Dtos/Create{Entity}Dto.cs`, gerekiyorsa `Dtos/Update{Entity}Dto.cs`
- Namespace: `Apya.Platform.{Alan}.Dtos`
- `I{Entity}AppService.cs` — `ICrudAppService<...>` türet
- Doğrulama attribute'ları DTO'ya (`[Required]`, `[StringLength]`)

## Adım 3 — İzinler

`src/Apya.Platform.Application.Contracts/Permissions/`

- `PlatformPermissions.cs` içine yeni statik sınıf:
  ```csharp
  public static class {Alan}
  {
      public const string Default = GroupName + ".{Alan}";
      public const string Create  = Default + ".Create";
      public const string Edit    = Default + ".Edit";
      public const string Delete  = Default + ".Delete";
  }
  ```
- `PlatformPermissionDefinitionProvider.cs`'e **kaydet** — bu adım atlanırsa izin UI'da görünmez ve yetkilendirme sessizce çalışmaz
- Uygun izin grubuna bağla (`Groups.Work`, `Groups.Finance`, `Groups.Accounting`, ...)

## Adım 4 — Application

`src/Apya.Platform.Application/{Alan}/{Entity}AppService.cs`

- `CrudAppService<{Entity}, {Entity}Dto, Guid, PagedAndSortedResultRequestDto, Create{Entity}Dto>` türet
- `[Authorize]` ekle; izin sabitlerini base'in policy property'lerine bağla:
  ```csharp
  GetPolicyName    = PlatformPermissions.{Alan}.Default;
  CreatePolicyName = PlatformPermissions.{Alan}.Create;
  UpdatePolicyName = PlatformPermissions.{Alan}.Edit;
  DeletePolicyName = PlatformPermissions.{Alan}.Delete;
  ```
- İş kuralı varsa `{Entity}Manager`'ı constructor'dan al ve `CreateAsync`/`UpdateAsync`'i override et
- Host bağlamı: `CurrentTenant.Id == null` durumunda tenant seçimini açıkça ele al (bkz. `ProjectAppService.CreateAsync`)

**AutoMapper:** `PlatformApplicationAutoMapperProfile.cs`'e mapping ekle.
Eksikse çalışma zamanında `AutoMapperMappingException` alırsın, derleme hatası vermez.

## Adım 5 — EF Core

`src/Apya.Platform.EntityFrameworkCore/`

- `PlatformDbContext.cs`'e `DbSet<{Entity}>` ekle
- `OnModelCreating` içinde entity konfigürasyonu: tablo adı, index, ilişkiler, `ConfigureByConvention()`
- Migration: **kullanıcıdan onay al**, sonra `abp-migration` skill'ini izle

## Adım 6 — Localization

`src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json` ve `en.json`

- Menü adı, sayfa başlığı, alan etiketleri, hata mesajları
- Anahtar formatı: `Menu:{Alan}`, `{Entity}`, `Create{Entity}`, `Edit{Entity}`
- Türkçe metni Razor'a veya C#'a gömme; her zaman localization anahtarı kullan

## Adım 7 — Web (Razor Pages)

`src/Apya.Platform.Web/Pages/{Alan}/`

Mevcut sayfa yapısını taklit et (`Pages/Projects/` iyi referans):

- `Index.cshtml` + `Index.cshtml.cs` + `Index.js` — DataTables listesi
- `CreateModal.cshtml` + `.cshtml.cs` — ABP modal
- `EditModal.cshtml` + `.cshtml.cs`
- Menüye ekle: `PlatformMenuContributor.cs`, izin kontrolüyle birlikte

**Stil:** Yeni CSS yazma. `--apya-*` token'larını kullan, hex renk gömme.
Detay için `apya-redesign` skill'ine bak.

## Adım 8 — Doğrula

Bunları söylemeden "tamamlandı" deme:

```
1. dotnet build Apya.Platform.sln          → hata yok
2. dotnet test                              → mevcut testler kırılmadı
3. Migration uygulandı mı                   → DbMigrator çalıştı
4. İzin UI'da görünüyor mu                  → Kimlik > Roller > İzinler
5. Sayfa açılıyor mu, CRUD çalışıyor mu     → https://localhost:44386
```

## Sık yapılan hatalar

| Hata | Belirti |
|---|---|
| İzni `PermissionDefinitionProvider`'a kaydetmemek | İzin UI'da yok, yetkilendirme sessizce geçiyor |
| AutoMapper profili eklememek | Çalışma zamanında `AutoMapperMappingException` |
| `IMultiTenant` unutmak | Tenant'lar birbirinin verisini görüyor — **veri sızıntısı** |
| İş kuralını AppService'e yazmak | Kural HttpApi ve arka plan job'larda tekrarlanmıyor |
| Metni Razor'a gömmek | Localization kırılıyor, dil değişince Türkçe kalıyor |
| Yeni pattern icat etmek | Kod tabanı tutarsızlaşıyor; önce benzer alanı oku |
