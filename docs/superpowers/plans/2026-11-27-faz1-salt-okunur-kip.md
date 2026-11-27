# Faz 1 · Salt okunur kip — uygulama planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans (inline, recommended for this user) or subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Host bir kiracıya süreli deneme verebilsin; süre bitince hesap Basic'e inmesin, **salt okunur** olsun — kullanıcılar verilerini görsün, her yazma denemesi "Bu işlem paket gerektirir" penceresine dönsün, hibe tarafı ve kişisel tercihler çalışmaya devam etsin.

**Architecture:** Salt okunur durumu kiracı feature'ı `Platform.ReadOnly`'dır (şemasız). Süre işleyicisi `Trial` kaynaklı aboneliği bitirince bayrağı açar; paket uygulamak bayrağı kapatır. Web katmanında tek bir middleware (`ReadOnlyTenantMiddleware`) GET dışı her isteği, izinli listede (`ReadOnlyAllowedWrites`) değilse keser; istemcide `apya-quota-upsell.js` hata kodunu tanıyıp paket penceresini açar ve oluştur/düzenle pencerelerini daha açılmadan durdurur. Her sayfada `LayoutHooks.Body.First` şeridi durumu söyler.

**Tech Stack:** ABP 10.0.2 / .NET 10, Razor Pages, ABP feature sistemi (`IFeatureChecker`, `IFeatureManager`), ASP.NET Core middleware, jQuery + Bootstrap (abp.ajax / abp.ModalManager), xUnit + Shouldly + NSubstitute, vitest.

**Tasarım:** `docs/superpowers/specs/2026-11-27-ucretsiz-hesap-ve-deneme-design.md` (§5, §10.4, §12 Faz 1).

## Global Constraints

- Kullanıcıya dönen her metin Türkçe ve `src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json`'da; JS'te `abp.localization.getResource('Platform')`.
- Yeni `Volo.*` ad alanı / paketi YOK. Kullanılanlar izinli listede: `Volo.Abp.Features`, `Volo.Abp.MultiTenancy`, `Volo.Abp.Users`, `Volo.Abp.DependencyInjection`, `Volo.Abp.AspNetCore.Mvc`, `Volo.Abp.Application.Services`, `Volo.Abp.Domain.Repositories`, `Volo.Abp.Authorization.Permissions`. Kontrol: `AbpYuzeyi_Tests`.
- **Şema değişikliği YOK** (Faz 1). Migration üretme.
- Tüm I/O async ve `Async` ile biter; bağımlılıklar constructor injection.
- `BusinessException` yalnız kodla fırlatılır; her yeni kodun tr.json karşılığı olur (`ErrorCodeLocalization_Tests`).
- Testler RAM bekçisiyle, parça parça (aşağıdaki komut kalıbı). **Web.Tests'i asla filtresiz koşma** (tam koşu ~10 GB).
- Commit: açık dosya adlarıyla `git add`, Türkçe konu, sonda `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Push ve PR ayrı onay ister.
- `src/Apya.Platform.Web/wwwroot/dynamic-assets/yarn.lock` değişikliği COMMIT EDİLMEZ.

**Komut kalıbı** (depo kökünden, Git Bash):

```bash
M="C:/Users/ybaba/.claude/projects/E--Developer-G-T-hitprot-platform/memory"
bash "$M/parts.sh" <etiket> "<komut>" [<etiket> "<komut>" ...]
```
`@B` derleme bayraklarına açılır. Önce `dotnet build <test projesi> @B`, sonra `dotnet test <test projesi> --no-build --filter ...`.

## Tasarımdan uygulama sapmaları (gerekçeli)

1. **Bayrak paket satırlarında tutulmaz.** Tasarım "her paket tanımında false yazılır" diyordu. Paket satırına girseydi `/PackageManagement` ekranında düzenlenebilir bir paket özelliği olarak görünür ve `BackfillLateAdditionsAsync` onu tüm paketlere yayardı. Bunun yerine `ApplyPackageAsync` bayrağı **açıkça** kapatır (`SetReadOnlyAsync(false)`); etki aynı.
2. **`HostFeatureValueProvider` bu bayrağı hariç tutar.** Sağlayıcı host'ta tüm `Platform.*` toggle'larına "true" döndüğü için host kendini salt okunur görürdü.
3. **Pencere yakalama istemcide.** Tasarım "sunucu pencere yerine paket penceresini döner" diyordu; middleware `UseRouting`'den sonra koştuğu için uç değiştiremez. `abp.ModalManager.open` sarmalanır; durdurulan adlar `(Create|Edit|Import)Modal`. Betik yüklenmezse kullanıcı kaydette yine paket penceresini görür (sunucu kapısı).
4. **Klasik form gönderimi `/Subscription/ReadOnly`'ye yönlenir**, `/Subscription`'a değil: Paketim `TenantSettings.Default` ister, izni olmayan kullanıcı 403 alırdı.
5. **Deneme ek süreye girmez ve `AutoDowngradeEnabled` ayarına bağlı değildir** — bu ayar ücretli paketin düşürülmesi içindir.
6. **Etkin denemede "Süreyi Uzat"** dönemi `Manual` (ücretli) yapar — bilinçli. Denemeyi uzatmak için "Denemeye al" yeniden kullanılır.
7. **İzinli listeye iki ek:** `/Subscription` (Paketim'deki "Ödedim" bildirimi POST'tur) ve belge indirme uçları (`prepare-download` POST'tur; K4 indirmeyi açık tutar).
8. **Paket penceresinin düğmesi Faz 1'de Paketim'e gider** (host'un tanımladığı iletişim kanalı orada). Uygulama içi "Paket talep et" formu Faz 2'de.

## PR bölümü

- **PR-1 (sunucu: durum ve deneme)** = Task 0–4. Kendi başına zararsızdır: bayrak açılsa da henüz hiçbir şeyi kesmez.
- **PR-2 (kapı ve istemci)** = Task 5–10. PR-1 main'e girdikten SONRA, main'den yeni dalla başlar (yığın PR yok).

## Dosya haritası

| Dosya | Sorumluluk | Task |
|---|---|---|
| `src/Apya.Platform.Application.Contracts/Features/PlatformFeatures.cs` | `ReadOnly` sabiti | 1 |
| `src/Apya.Platform.Application.Contracts/Features/PlatformFeatureDefinitionProvider.cs` | feature tanımı | 1 |
| `src/Apya.Platform.Application.Contracts/Features/HostFeatureValueProvider.cs` | host'ta hariç tutma | 1 |
| `src/Apya.Platform.Application/Tenants/TenantPackageManager.cs` | `SetReadOnlyAsync`, `IsReadOnlyAsync`, paket uygulayınca temizleme | 1 |
| `src/Apya.Platform.Domain.Shared/Tenants/SubscriptionTrialConsts.cs` (yeni) | deneme gün sınırları | 2 |
| `src/Apya.Platform.Domain.Shared/PlatformDomainErrorCodes.cs` | `TrialDaysOutOfRange`, `SubscriptionReadOnly` | 2, 6 |
| `src/Apya.Platform.Domain/Tenants/TenantSubscription.cs` | `CreateTrial` | 2 |
| `src/Apya.Platform.Domain/Tenants/TenantSubscriptionManager.cs` | `StartTrialAsync`, `GetLatestEndedTrialOrNullAsync` | 2 |
| `src/Apya.Platform.Domain.Shared/Notifications/NotificationType.cs`, `NotificationTypeRegistry.cs` | `TrialEnded` | 3 |
| `src/Apya.Platform.Application/Tenants/SubscriptionExpiryProcessor.cs` | deneme dalı | 3 |
| `src/Apya.Platform.Application.Contracts/Tenants/ITenantProfileAppService.cs`, `TenantProfileDto.cs` | `StartTrialAsync`, `IsTrial`, `IsReadOnly` | 4 |
| `src/Apya.Platform.Application/Tenants/TenantProfileAppService.cs` | host "Denemeye al" + liste bayrakları | 4 |
| `src/Apya.Platform.Web/Pages/TenantManagement/Tenants/Index.js` | aksiyon + rozetler | 4 |
| `src/Apya.Platform.Web/Middleware/ReadOnlyAllowedWrites.cs` (yeni) | izinli yazmalar | 5 |
| `src/Apya.Platform.Web/Middleware/ReadOnlyRequestPolicy.cs` (yeni) | saf karar | 5 |
| `src/Apya.Platform.Web/Middleware/ReadOnlyTenantMiddleware.cs` (yeni) | kapı | 6 |
| `src/Apya.Platform.Web/PlatformWebModule.cs` | middleware + layout hook kaydı | 6, 8 |
| `src/Apya.Platform.Web/wwwroot/js/apya-quota-upsell.js` | hata kodu + pencere yakalama | 7 |
| `src/Apya.Platform.Application.Contracts/Tenants/IReadOnlyStateAppService.cs`, `ReadOnlyStateDto.cs` (yeni) | durum sözleşmesi | 8 |
| `src/Apya.Platform.Application/Tenants/ReadOnlyStateAppService.cs` (yeni) | durum okuma | 8 |
| `src/Apya.Platform.Web/Pages/Shared/Components/ReadOnlyBanner/*` (yeni) | şerit | 8 |
| `src/Apya.Platform.Web/Pages/Subscription/ReadOnly.cshtml(.cs)` (yeni) | form yönlendirme sayfası | 8 |
| `src/Apya.Platform.Web/Pages/Subscription/Index.cshtml(.cs)` | Paketim rozeti + uyarı | 8 |
| `src/Apya.Platform.Web/Documents/ScheduledReportWorker.cs` | salt okunurda atla | 9 |
| `src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json` | metinler | 1–9 |

---

### Task 0: Ortam ve dal

**Files:** yok (ortam)

- [ ] **Step 1: Dal aç** (tasarım + plan commit'leri dalın içinde kalır) ve bekçi yolunu tanımla

```bash
git switch -c claude/salt-okunur-kip-sunucu
M="C:/Users/ybaba/.claude/projects/E--Developer-G-T-hitprot-platform/memory"
```

- [ ] **Step 2: İstemci kütüphaneleri** (worktree'de şart; yoksa Web her isteğe 500 döner)

```bash
abp install-libs
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npm ci && cd -
git checkout -- src/Apya.Platform.Web/wwwroot/dynamic-assets/yarn.lock
git status --short
```
Expected: `git status` boş (yarn.lock geri alındı).

- [ ] **Step 3: Taban derleme** (dokunulacak test projeleri)

```bash
bash "$M/parts.sh" ef-build "dotnet build test/Apya.Platform.EntityFrameworkCore.Tests @B" dom-build "dotnet build test/Apya.Platform.Domain.Tests @B"
```
Expected: `TAMAM`, `error` satırı yok.

---

### Task 1: `Platform.ReadOnly` bayrağı

**Files:**
- Modify: `src/Apya.Platform.Application.Contracts/Features/PlatformFeatures.cs`
- Modify: `src/Apya.Platform.Application.Contracts/Features/PlatformFeatureDefinitionProvider.cs`
- Modify: `src/Apya.Platform.Application.Contracts/Features/HostFeatureValueProvider.cs`
- Modify: `src/Apya.Platform.Application/Tenants/TenantPackageManager.cs`
- Modify: `src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json`
- Test: `test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/ReadOnlyFeature_Tests.cs` (yeni)

**Interfaces:**
- Produces: `PlatformFeatures.ReadOnly` (`"Platform.ReadOnly"`); `TenantPackageManager.SetReadOnlyAsync(Guid tenantId, bool readOnly) : Task`; `TenantPackageManager.IsReadOnlyAsync(Guid tenantId) : Task<bool>`; `ApplyPackageAsync` bayrağı kapatır.

- [ ] **Step 1: Failing test yaz**

`test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/ReadOnlyFeature_Tests.cs`:

```csharp
using System;
using System.Threading.Tasks;
using Apya.Platform.Features;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Features;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// SALT OKUNUR BAYRAĞI SÖZLEŞMESİ: varsayılan kapalı, elle açılır, paket uygulanınca kapanır
/// ve host bağlamında hiçbir zaman "açık" okunmaz.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ReadOnlyFeature_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly TenantPackageManager _packageManager;
    private readonly IFeatureChecker _featureChecker;
    private readonly ICurrentTenant _currentTenant;

    public ReadOnlyFeature_Tests()
    {
        _packageManager = GetRequiredService<TenantPackageManager>();
        _featureChecker = GetRequiredService<IFeatureChecker>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<bool> IsReadOnlyInTenantAsync(Guid tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            return await _featureChecker.IsEnabledAsync(PlatformFeatures.ReadOnly);
        }
    }

    [Fact]
    public async Task ReadOnly_Defaults_To_False_For_Tenant()
    {
        var tenantId = Guid.NewGuid();

        (await WithUnitOfWorkAsync(() => IsReadOnlyInTenantAsync(tenantId))).ShouldBeFalse();
        (await WithUnitOfWorkAsync(() => _packageManager.IsReadOnlyAsync(tenantId))).ShouldBeFalse();
    }

    [Fact]
    public async Task SetReadOnly_Makes_Tenant_ReadOnly()
    {
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(() => _packageManager.SetReadOnlyAsync(tenantId, true));

        (await WithUnitOfWorkAsync(() => IsReadOnlyInTenantAsync(tenantId))).ShouldBeTrue();
        (await WithUnitOfWorkAsync(() => _packageManager.IsReadOnlyAsync(tenantId))).ShouldBeTrue();
    }

    [Fact]
    public async Task ApplyPackage_Clears_ReadOnly()
    {
        var tenantId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();
            await _packageManager.SetReadOnlyAsync(tenantId, true);
        });

        await WithUnitOfWorkAsync(() => _packageManager.ApplyPackageAsync(tenantId, PackageCode.Standard));

        (await WithUnitOfWorkAsync(() => IsReadOnlyInTenantAsync(tenantId))).ShouldBeFalse();
    }

    /// <summary>
    /// HostFeatureValueProvider host'ta Platform.* toggle'larına "true" döner; bu bayrak hariç
    /// tutulmasaydı host kendini salt okunur sayardı.
    /// </summary>
    [Fact]
    public async Task Host_Context_Never_Reads_ReadOnly_As_True()
    {
        (await WithUnitOfWorkAsync(() => _featureChecker.IsEnabledAsync(PlatformFeatures.ReadOnly)))
            .ShouldBeFalse();
    }
}
```

- [ ] **Step 2: Koş, düştüğünü gör**

```bash
bash "$M/parts.sh" ef-build "dotnet build test/Apya.Platform.EntityFrameworkCore.Tests @B"
```
Expected: derleme HATASI — `PlatformFeatures.ReadOnly`, `SetReadOnlyAsync`, `IsReadOnlyAsync` yok.

- [ ] **Step 3: Sabiti ekle** — `PlatformFeatures.cs`, `public const string TaskQuickEntry = GroupName + ".TaskQuickEntry";` satırının ARDINA:

```csharp

    /// <summary>
    /// Hesap SALT OKUNUR: kullanıcılar verilerini görür ama kayıt ekleyemez, değiştiremez,
    /// silemez. Süreli deneme bitince <c>SubscriptionExpiryProcessor</c> açar; paket uygulanınca
    /// (<c>TenantPackageManager.ApplyPackageAsync</c>) kendiliğinden kapanır. Yazmayı Web
    /// katmanındaki <c>ReadOnlyTenantMiddleware</c> keser.
    /// <para>Paket yetenek kapısı DEĞİLDİR: <c>PackageDefinitions</c>'ta ve paket satırlarında
    /// yer almaz; <see cref="HostFeatureValueProvider"/> host'ta onu "true" saymaz.</para>
    /// </summary>
    public const string ReadOnly = GroupName + ".ReadOnly";
```

- [ ] **Step 4: Tanımı ekle** — `PlatformFeatureDefinitionProvider.cs`, şu iki satırın ARDINA:

```csharp
            description: L("Feature:Platform:TaskQuickEntry:Description"),
            valueType: new ToggleStringValueType());
```
eklenecek:
```csharp

        // Salt okunur hesap — paket kapısı değil, hesap DURUMU. Varsayılan KAPALI
        // (bkz. PlatformFeatures.ReadOnly). Host kiracının özellik penceresinden elle açıp kapatabilir.
        group.AddFeature(PlatformFeatures.ReadOnly, defaultValue: "false",
            displayName: L("Feature:Platform:ReadOnly"),
            description: L("Feature:Platform:ReadOnly:Description"),
            valueType: new ToggleStringValueType());
```

- [ ] **Step 5: Host'ta hariç tut** — `HostFeatureValueProvider.cs`, `if (!feature.Name.StartsWith(PlatformFeatures.GroupName + ".", StringComparison.Ordinal))` satırının ÖNÜNE:

```csharp
        // Salt okunur bir hesap DURUMUDUR, yetenek değil: host'ta "true" dönseydi host kendini
        // salt okunur sayardı (istemci betiği oluştur/düzenle pencerelerini kapatırdı).
        if (feature.Name == PlatformFeatures.ReadOnly)
        {
            return Task.FromResult<string?>(null);
        }

```

- [ ] **Step 6: Paket yöneticisi** — `TenantPackageManager.cs`, `ApplyPackageAsync` içinde `// Tenant'ın paketi değişmiş olabilir: izin tavanı önbelleği bayat kalmasın.` satırının ÖNÜNE:

```csharp
        // Paket uygulamak hesabı yeniden AÇAR: deneme bitince konan salt okunur bayrağı paket
        // satırlarında olmadığı için yukarıdaki döngü onu silmez (bkz. PlatformFeatures.ReadOnly).
        await SetReadOnlyAsync(tenantId, false);

```
ve `ApplyPackageAsync`'in kapanışından sonra, `/// Paket uygulanmadan önce tenant'ta KAPALI olup` ile başlayan özetin ÖNÜNE:

```csharp
    /// <summary>
    /// Hesabı salt okunur yapar ya da açar. "false" ABP'de varsayılana eşit olduğu için kiracının
    /// değer satırı silinir — açık hesapta iz kalmaz.
    /// </summary>
    public Task SetReadOnlyAsync(Guid tenantId, bool readOnly)
        => _featureManager.SetAsync(
            PlatformFeatures.ReadOnly,
            readOnly ? "true" : "false",
            TenantFeatureValueProvider.ProviderName,
            tenantId.ToString());

    /// <summary>
    /// Kiracının KENDİ değeri. Zincire düşmeden okunur; host bağlamından (kiracı listesi) da doğru
    /// sonuç verir.
    /// </summary>
    public async Task<bool> IsReadOnlyAsync(Guid tenantId)
        => string.Equals(
            await _featureManager.GetOrNullAsync(
                PlatformFeatures.ReadOnly,
                TenantFeatureValueProvider.ProviderName,
                tenantId.ToString(),
                fallback: false),
            "true",
            StringComparison.OrdinalIgnoreCase);

```

- [ ] **Step 7: Metinler** — `tr.json`, `"Feature:Platform:TaskQuickEntry:Description"` ile başlayan satırın ARDINA:

```json
        "Feature:Platform:ReadOnly": "Salt okunur hesap",
        "Feature:Platform:ReadOnly:Description": "Açıkken kurumun kullanıcıları verilerini görür ama kayıt ekleyemez, değiştiremez, silemez. Hibe takibi, kişisel tercihler ve Paketim çalışmaya devam eder. Paket uygulanınca kendiliğinden kapanır.",
```

- [ ] **Step 8: Koş, geçtiğini gör**

```bash
bash "$M/parts.sh" ef-build "dotnet build test/Apya.Platform.EntityFrameworkCore.Tests @B" ef "dotnet test test/Apya.Platform.EntityFrameworkCore.Tests --no-build --filter FullyQualifiedName~Tenants"
```
Expected: `Passed!`, 0 başarısız (yeni 4 test + mevcut `SubscriptionExpiry_Tests`, `MySubscription_Tests` yeşil).

- [ ] **Step 9: Commit**

```bash
git add src/Apya.Platform.Application.Contracts/Features/PlatformFeatures.cs src/Apya.Platform.Application.Contracts/Features/PlatformFeatureDefinitionProvider.cs src/Apya.Platform.Application.Contracts/Features/HostFeatureValueProvider.cs src/Apya.Platform.Application/Tenants/TenantPackageManager.cs src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/ReadOnlyFeature_Tests.cs
git commit -F - <<'EOF'
feat(paket): salt okunur hesap bayrağı (Platform.ReadOnly)

Paket uygulanınca kendiliğinden kapanır; host bağlamında hiçbir zaman
açık okunmaz. Paket satırlarına girmez, paket ekranında görünmez.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 2: Süreli deneme dönemi (domain)

**Files:**
- Create: `src/Apya.Platform.Domain.Shared/Tenants/SubscriptionTrialConsts.cs`
- Modify: `src/Apya.Platform.Domain.Shared/PlatformDomainErrorCodes.cs`
- Modify: `src/Apya.Platform.Domain/Tenants/TenantSubscription.cs`
- Modify: `src/Apya.Platform.Domain/Tenants/TenantSubscriptionManager.cs`
- Modify: `src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json`
- Test: `test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/TrialSubscription_Tests.cs` (yeni)

**Interfaces:**
- Produces: `SubscriptionTrialConsts.MinDays = 1`, `MaxDays = 90`, `DefaultDays = 14`; `PlatformDomainErrorCodes.TrialDaysOutOfRange`; `TenantSubscription.CreateTrial(Guid id, Guid tenantId, PackageCode packageCode, DateTime startDate, int days) : TenantSubscription`; `TenantSubscriptionManager.StartTrialAsync(Guid tenantId, PackageCode packageCode, int days) : Task<TenantSubscription>`; `TenantSubscriptionManager.GetLatestEndedTrialOrNullAsync(Guid tenantId) : Task<TenantSubscription?>`.

- [ ] **Step 1: Failing test yaz**

`test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/TrialSubscription_Tests.cs`:

```csharp
using System;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// SÜRELİ DENEME SÖZLEŞMESİ: bitiş GÜN olarak hesaplanır, yürürlükteki dönem kapanır, gün sınırı
/// sunucuda denetlenir ve biten deneme sonradan bulunabilir (şeritteki tarih).
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TrialSubscription_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly TenantSubscriptionManager _subscriptionManager;
    private readonly IRepository<TenantSubscription, Guid> _subscriptionRepository;
    private readonly IClock _clock;

    public TrialSubscription_Tests()
    {
        _subscriptionManager = GetRequiredService<TenantSubscriptionManager>();
        _subscriptionRepository = GetRequiredService<IRepository<TenantSubscription, Guid>>();
        _clock = GetRequiredService<IClock>();
    }

    [Fact]
    public async Task StartTrial_Sets_EndDate_In_Days_And_Source_Trial()
    {
        var tenantId = Guid.NewGuid();

        var trial = await WithUnitOfWorkAsync(
            () => _subscriptionManager.StartTrialAsync(tenantId, PackageCode.Premium, 14));

        trial.Source.ShouldBe(SubscriptionSource.Trial);
        trial.PackageCode.ShouldBe(PackageCode.Premium);
        trial.Status.ShouldBe(SubscriptionStatus.Active);
        trial.EndDate.ShouldBe(trial.StartDate.AddDays(14));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(91)]
    public async Task StartTrial_Rejects_Out_Of_Range_Days(int days)
    {
        var ex = await Should.ThrowAsync<BusinessException>(() => WithUnitOfWorkAsync(
            () => _subscriptionManager.StartTrialAsync(Guid.NewGuid(), PackageCode.Premium, days)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.TrialDaysOutOfRange);
    }

    [Fact]
    public async Task StartTrial_Supersedes_Current_Subscription()
    {
        var tenantId = Guid.NewGuid();
        var paid = await WithUnitOfWorkAsync(() => _subscriptionManager.StartAsync(
            tenantId, PackageCode.Standard, SubscriptionPeriod.Annual, SubscriptionSource.Manual));

        await WithUnitOfWorkAsync(() => _subscriptionManager.StartTrialAsync(tenantId, PackageCode.Premium, 14));

        await WithUnitOfWorkAsync(async () =>
        {
            (await _subscriptionRepository.GetAsync(paid.Id)).Status.ShouldBe(SubscriptionStatus.Superseded);
            (await _subscriptionManager.GetCurrentOrNullAsync(tenantId))!.Source.ShouldBe(SubscriptionSource.Trial);
        });
    }

    [Fact]
    public async Task GetLatestEndedTrial_Returns_Expired_Trial_Only()
    {
        var tenantId = Guid.NewGuid();
        var ended = TenantSubscription.CreateTrial(
            Guid.NewGuid(), tenantId, PackageCode.Premium, _clock.Now.AddDays(-20), 14);
        ended.Expire(_clock.Now.AddDays(-6));

        await WithUnitOfWorkAsync(async () =>
        {
            (await _subscriptionManager.GetLatestEndedTrialOrNullAsync(tenantId)).ShouldBeNull();
            await _subscriptionRepository.InsertAsync(ended, autoSave: true);
        });

        var found = await WithUnitOfWorkAsync(() => _subscriptionManager.GetLatestEndedTrialOrNullAsync(tenantId));

        found.ShouldNotBeNull();
        found!.Id.ShouldBe(ended.Id);
    }
}
```

- [ ] **Step 2: Koş, düştüğünü gör**

```bash
bash "$M/parts.sh" ef-build "dotnet build test/Apya.Platform.EntityFrameworkCore.Tests @B"
```
Expected: derleme HATASI — `StartTrialAsync`, `CreateTrial`, `TrialDaysOutOfRange` yok.

- [ ] **Step 3: Sabitler** — yeni dosya `src/Apya.Platform.Domain.Shared/Tenants/SubscriptionTrialConsts.cs`:

```csharp
namespace Apya.Platform.Tenants;

/// <summary>
/// Süreli deneme sınırları. Host ekranındaki gün kutusu ve sunucu aynı değerlerle denetler.
/// </summary>
public static class SubscriptionTrialConsts
{
    public const int MinDays = 1;

    public const int MaxDays = 90;

    public const int DefaultDays = 14;
}
```

- [ ] **Step 4: Hata kodu** — `PlatformDomainErrorCodes.cs`, `public const string GrantCriterionDuplicate = "Platform:GrantCriterion:Duplicate";` satırının ARDINA:

```csharp

    // Süreli deneme (ücretsiz hesap tasarımı Faz 1).
    public const string TrialDaysOutOfRange = "Platform:Subscription:TrialDaysOutOfRange";
```

- [ ] **Step 5: Varlık fabrikası** — `TenantSubscription.cs`, `/// <summary>Dönemin bitiş tarihi. Süresizde <c>null</c>; diğerlerinde enum değeri kadar AY eklenir.</summary>` satırının ÖNÜNE:

```csharp
    /// <summary>
    /// Süreli deneme dönemi. Bitiş AY değil GÜN olarak verilir. <see cref="Period"/> bu satırda
    /// anlam taşımaz (Monthly yazılır); ekranlar denemeyi <see cref="Source"/>'tan tanır.
    /// </summary>
    public static TenantSubscription CreateTrial(
        Guid id,
        Guid tenantId,
        PackageCode packageCode,
        DateTime startDate,
        int days)
    {
        var subscription = new TenantSubscription(
            id, tenantId, packageCode, SubscriptionPeriod.Monthly, startDate, SubscriptionSource.Trial);
        subscription.EndDate = startDate.AddDays(days);
        return subscription;
    }

```

- [ ] **Step 6: Yönetici** — `TenantSubscriptionManager.cs`, `/// Yürürlükteki paketi bir dönem daha uzatır.` ile başlayan özetin (`/// <summary>` satırı dahil) ÖNÜNE:

```csharp
    /// <summary>
    /// Süreli deneme başlatır. Yürürlükteki satır <see cref="StartAsync"/>'teki gibi kapanır.
    /// Paketi kiracıya UYGULAMAK çağıranın işidir (<c>TenantPackageManager</c> Application'da).
    /// </summary>
    public async Task<TenantSubscription> StartTrialAsync(Guid tenantId, PackageCode packageCode, int days)
    {
        if (days < SubscriptionTrialConsts.MinDays || days > SubscriptionTrialConsts.MaxDays)
        {
            throw new BusinessException(PlatformDomainErrorCodes.TrialDaysOutOfRange)
                .WithData("Min", SubscriptionTrialConsts.MinDays)
                .WithData("Max", SubscriptionTrialConsts.MaxDays);
        }

        var now = Clock.Now;

        var current = await GetCurrentOrNullAsync(tenantId);
        if (current != null)
        {
            current.Supersede(now);
            await _subscriptionRepository.UpdateAsync(current);
        }

        var trial = TenantSubscription.CreateTrial(GuidGenerator.Create(), tenantId, packageCode, now, days);
        return await _subscriptionRepository.InsertAsync(trial, autoSave: true);
    }

    /// <summary>
    /// Kiracının en son BİTEN denemesi — salt okunur şeridindeki tarih buradan gelir. Yoksa
    /// <c>null</c> (host hesabı elle kilitlemiş olabilir).
    /// </summary>
    public async Task<TenantSubscription?> GetLatestEndedTrialOrNullAsync(Guid tenantId)
    {
        var queryable = await _subscriptionRepository.GetQueryableAsync();
        return await AsyncExecuter.FirstOrDefaultAsync(
            queryable
                .Where(s => s.TenantId == tenantId
                            && s.Source == SubscriptionSource.Trial
                            && s.Status == SubscriptionStatus.Expired)
                .OrderByDescending(s => s.EndedAt));
    }

```

- [ ] **Step 7: Metin** — `tr.json`, `"Platform:Error:MaxUsersReached"` ile başlayan satırın ARDINA:

```json
        "Platform:Subscription:TrialDaysOutOfRange": "Deneme süresi {Min} ile {Max} gün arasında olmalı.",
```

- [ ] **Step 8: Koş, geçtiğini gör**

```bash
bash "$M/parts.sh" ef-build "dotnet build test/Apya.Platform.EntityFrameworkCore.Tests @B" ef "dotnet test test/Apya.Platform.EntityFrameworkCore.Tests --no-build --filter FullyQualifiedName~Tenants" dom-build "dotnet build test/Apya.Platform.Domain.Tests @B" dom "dotnet test test/Apya.Platform.Domain.Tests --no-build --filter FullyQualifiedName~ErrorCodeLocalization"
```
Expected: iki koşu da `Passed!`.

- [ ] **Step 9: Commit**

```bash
git add src/Apya.Platform.Domain.Shared/Tenants/SubscriptionTrialConsts.cs src/Apya.Platform.Domain.Shared/PlatformDomainErrorCodes.cs src/Apya.Platform.Domain/Tenants/TenantSubscription.cs src/Apya.Platform.Domain/Tenants/TenantSubscriptionManager.cs src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/TrialSubscription_Tests.cs
git commit -F - <<'EOF'
feat(paket): gün bazlı süreli deneme dönemi

Kaynağı Trial olan abonelik; bitiş gün olarak hesaplanır (1–90),
yürürlükteki dönem kapanır. Biten deneme şerit tarihi için bulunur.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 3: Süre işleyicisinin deneme dalı

**Files:**
- Modify: `src/Apya.Platform.Domain.Shared/Notifications/NotificationType.cs`
- Modify: `src/Apya.Platform.Domain.Shared/Notifications/NotificationTypeRegistry.cs`
- Modify: `src/Apya.Platform.Application/Tenants/SubscriptionExpiryProcessor.cs`
- Modify: `src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json`
- Test: `test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/SubscriptionExpiry_Tests.cs`
- Test: `test/Apya.Platform.Domain.Tests/Notifications/NotificationTypeRegistry_Tests.cs`

**Interfaces:**
- Consumes: `TenantPackageManager.SetReadOnlyAsync`, `IsReadOnlyAsync` (Task 1); `TenantSubscription.CreateTrial`, `TenantSubscriptionManager.GetLatestEndedTrialOrNullAsync` (Task 2).
- Produces: `NotificationType.TrialEnded = 66`; `SubscriptionExpiryResult.TrialsEnded : int`.

- [ ] **Step 1: Failing testler** — `SubscriptionExpiry_Tests.cs`:

alanlara ekle:
```csharp
    private readonly TenantPackageManager _packageManager;
```
constructor'a ekle (`_clock = GetRequiredService<IClock>();` satırının ardına):
```csharp
        _packageManager = GetRequiredService<TenantPackageManager>();
```
`GetPackageAsync` yardımcısının ardına:
```csharp
    private async Task AddTrialAsync(Guid tenantId, PackageCode code, DateTime startDate, int days)
    {
        var trial = TenantSubscription.CreateTrial(Guid.NewGuid(), tenantId, code, startDate, days);
        await _subscriptionRepository.InsertAsync(trial, autoSave: true);
    }

    /// <summary>
    /// DENEME BİTİNCE Basic'e İNİLMEZ: paket aynen kalır, hesap salt okunur olur, ek süre
    /// tanımlı olsa da deneme oraya girmez ve yerine yeni satır açılmaz.
    /// </summary>
    [Fact]
    public async Task Expired_Trial_Keeps_Package_And_Makes_Tenant_ReadOnly()
    {
        await ConfigureAsync(autoDowngrade: true, graceDays: 5);
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            await CreateProfileAsync(tenantId, PackageCode.Premium);
            await AddTrialAsync(tenantId, PackageCode.Premium, _clock.Now.AddDays(-20), 14);
        });

        var result = await WithUnitOfWorkAsync(() => _processor.RunAsync());

        result.TrialsEnded.ShouldBe(1);
        result.Downgraded.ShouldBe(0);
        result.MovedToGrace.ShouldBe(0);

        await WithUnitOfWorkAsync(async () =>
        {
            (await GetPackageAsync(tenantId)).ShouldBe(PackageCode.Premium);
            (await _packageManager.IsReadOnlyAsync(tenantId)).ShouldBeTrue();
            (await _subscriptionManager.GetCurrentOrNullAsync(tenantId)).ShouldBeNull();
            (await _subscriptionManager.GetLatestEndedTrialOrNullAsync(tenantId)).ShouldNotBeNull();
        });
    }

    /// <summary>Otomatik indirme ayarı ücretli paket içindir; deneme ondan bağımsız biter.</summary>
    [Fact]
    public async Task Expired_Trial_Ends_Even_When_AutoDowngrade_Is_Off()
    {
        await ConfigureAsync(autoDowngrade: false, graceDays: 0);
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            await CreateProfileAsync(tenantId, PackageCode.Premium);
            await AddTrialAsync(tenantId, PackageCode.Premium, _clock.Now.AddDays(-20), 14);
        });

        var result = await WithUnitOfWorkAsync(() => _processor.RunAsync());

        result.TrialsEnded.ShouldBe(1);
        result.DowngradeSkipped.ShouldBe(0);
        (await WithUnitOfWorkAsync(() => _packageManager.IsReadOnlyAsync(tenantId))).ShouldBeTrue();
    }

    [Fact]
    public async Task Expired_Trial_Is_Processed_Only_Once()
    {
        await ConfigureAsync(autoDowngrade: true, graceDays: 0);
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            await CreateProfileAsync(tenantId, PackageCode.Premium);
            await AddTrialAsync(tenantId, PackageCode.Premium, _clock.Now.AddDays(-20), 14);
        });

        await WithUnitOfWorkAsync(() => _processor.RunAsync());
        var second = await WithUnitOfWorkAsync(() => _processor.RunAsync());

        second.TrialsEnded.ShouldBe(0);
    }

    /// <summary>Ücretli (Manual) dönemin davranışı DEĞİŞMEZ: Basic'e iner, salt okunur olmaz.</summary>
    [Fact]
    public async Task Expired_Manual_Subscription_Is_Not_Made_ReadOnly()
    {
        await ConfigureAsync(autoDowngrade: true, graceDays: 0);
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            await CreateProfileAsync(tenantId, PackageCode.Premium);
            await AddSubscriptionAsync(
                tenantId, PackageCode.Premium, SubscriptionPeriod.Monthly, _clock.Now.AddMonths(-2));
        });

        var result = await WithUnitOfWorkAsync(() => _processor.RunAsync());

        result.Downgraded.ShouldBe(1);
        result.TrialsEnded.ShouldBe(0);
        (await WithUnitOfWorkAsync(() => _packageManager.IsReadOnlyAsync(tenantId))).ShouldBeFalse();
    }
```

`NotificationTypeRegistry_Tests.cs` sınıfının sonuna:
```csharp
    /// <summary>"Deneme bitti" bildirimi Paketim'e götürür; kayda bağlı değildir.</summary>
    [Fact]
    public void TrialEnded_Links_To_Subscription_Page()
    {
        NotificationTypeRegistry.IsRegistered(NotificationType.TrialEnded).ShouldBeTrue();
        NotificationTypeRegistry.Get(NotificationType.TrialEnded).DeepLinkTemplate.ShouldBe("/Subscription");
    }
```

- [ ] **Step 2: Koş, düştüğünü gör**

```bash
bash "$M/parts.sh" ef-build "dotnet build test/Apya.Platform.EntityFrameworkCore.Tests @B"
```
Expected: derleme HATASI — `TrialsEnded`, `NotificationType.TrialEnded` yok.

- [ ] **Step 3: Bildirim türü** — `NotificationType.cs`, son satırı:

```csharp
    FirmDataStale               = 65  // Kurum bilgisinin geçerlilik süresi doldu (kurum yöneticilerine)
}
```
şuna çevir:
```csharp
    FirmDataStale               = 65, // Kurum bilgisinin geçerlilik süresi doldu (kurum yöneticilerine)

    // Ücretsiz hesap Faz 1: süreli deneme bitti, hesap salt okunur.
    TrialEnded                  = 66  // Deneme süresi doldu; hesap salt okunur (kurum yöneticilerine)
}
```

`NotificationTypeRegistry.cs`, şu bloğu:
```csharp
            [NotificationType.SubscriptionDowngraded] = new(
                NotificationCategory.System, NotificationSeverity.Critical,
                "fa fa-circle-arrow-down", "/Subscription", GroupSimilar: false)
        };
```
şuna çevir:
```csharp
            [NotificationType.SubscriptionDowngraded] = new(
                NotificationCategory.System, NotificationSeverity.Critical,
                "fa fa-circle-arrow-down", "/Subscription", GroupSimilar: false),

            [NotificationType.TrialEnded] = new(
                NotificationCategory.System, NotificationSeverity.Critical,
                "fa fa-lock", "/Subscription", GroupSimilar: false)
        };
```

- [ ] **Step 4: İşleyici** — `SubscriptionExpiryProcessor.cs`:

(a) `SubscriptionExpiryResult` içinde `public int Downgraded { get; set; }` satırının ARDINA:
```csharp

    /// <summary>Süresi biten ve salt okunur yapılan deneme sayısı.</summary>
    public int TrialsEnded { get; set; }
```

(b) `ProcessOneAsync` içinde `// Süre doldu. Ek süre tanımlıysa önce oraya alınır — paket HÂLÂ açık kalır.` satırının ÖNÜNE:
```csharp
        // Deneme EK SÜREYE GİRMEZ ve otomatik indirme ayarına bağlı DEĞİLDİR (o ayar ücretli
        // paket içindir): paket olduğu gibi kalır, hesap salt okunur olur.
        if (subscription.Source == SubscriptionSource.Trial)
        {
            await EndTrialAsync(subscription, now);
            result.TrialsEnded++;
            return;
        }

```

(c) `RunAsync`'teki log çağrısını:
```csharp
        _logger.LogInformation(
            "Abonelik süre turu: {Warned} uyarı, {Grace} ek süre, {Downgraded} indirme, {Skipped} atlandı.",
            result.Warned, result.MovedToGrace, result.Downgraded, result.DowngradeSkipped);
```
şuna çevir:
```csharp
        _logger.LogInformation(
            "Abonelik süre turu: {Warned} uyarı, {Grace} ek süre, {Downgraded} indirme, {TrialsEnded} deneme bitti, {Skipped} atlandı.",
            result.Warned, result.MovedToGrace, result.Downgraded, result.TrialsEnded, result.DowngradeSkipped);
```

(d) `TryWarnAsync` içindeki bildirim çağrısında şu iki satırı:
```csharp
            _l["Notification:SubscriptionExpiring:Title"],
            _l["Notification:SubscriptionExpiring:Body",
```
şuna çevir (deneme uyarısı "Basic'e geçer" DEMEMELİ):
```csharp
            _l[subscription.Source == SubscriptionSource.Trial
                ? "Notification:SubscriptionExpiring:TitleTrial"
                : "Notification:SubscriptionExpiring:Title"],
            _l[subscription.Source == SubscriptionSource.Trial
                    ? "Notification:SubscriptionExpiring:BodyTrial"
                    : "Notification:SubscriptionExpiring:Body",
```

(e) `/// Bildirimi kiracının statik admin rolündeki kullanıcılara gönderir.` ile başlayan özetin ÖNÜNE:
```csharp
    /// <summary>
    /// Denemeyi bitirir: satır <see cref="SubscriptionStatus.Expired"/> olur, paket DEĞİŞMEZ
    /// (denemede açılan ekranlar görünmeye devam eder), hesap salt okunur yapılır. Yerine yeni satır
    /// AÇILMAZ — kiracı bir daha bu taramaya girmez; kilit paket uygulanınca kalkar.
    /// </summary>
    private async Task EndTrialAsync(TenantSubscription subscription, DateTime now)
    {
        subscription.Expire(now);
        await _subscriptionRepository.UpdateAsync(subscription, autoSave: true);

        await _packageManager.SetReadOnlyAsync(subscription.TenantId, true);

        await _localEventBus.PublishAsync(new SubscriptionExpiredEto
        {
            TenantId = subscription.TenantId,
            SubscriptionId = subscription.Id,
            PreviousPackageCode = subscription.PackageCode,
            EndDate = subscription.EndDate!.Value,
            GraceEndedAt = subscription.GraceEndsAt,
            ExternalReference = subscription.ExternalReference
        });

        await NotifyTenantAdminsAsync(
            subscription.TenantId,
            _l["Notification:TrialEnded:Title"],
            _l["Notification:TrialEnded:Body", FormatDate(subscription.EndDate!.Value)],
            NotificationType.TrialEnded);

        _logger.LogInformation(
            "TenantId={TenantId}: {Package} denemesi bitti, hesap salt okunur yapıldı.",
            subscription.TenantId, subscription.PackageCode);
    }

```

- [ ] **Step 5: Metinler** — `tr.json`, `"Notification:SubscriptionDowngraded:Body"` ile başlayan satırın ARDINA:
```json
        "Notification:SubscriptionExpiring:TitleTrial": "Deneme süreniz doluyor",
        "Notification:SubscriptionExpiring:BodyTrial": "Deneme süreniz {1} tarihinde bitiyor ({2} gün kaldı). Süre bitince verilerinizi görmeye devam edersiniz ama kayıt ekleyemez ve değiştiremezsiniz. Devam etmek için Paketim ekranından paket seçin.",
        "Notification:TrialEnded:Title": "Deneme süreniz bitti",
        "Notification:TrialEnded:Body": "Deneme süreniz {0} tarihinde bitti. Verileriniz duruyor ve görüntülenebilir; kayıt eklemek ve değiştirmek için paket seçin. Hibe takibi açık kalır.",
```
ve `"Notify:Type:FirmDataStale"` ile başlayan satırın ARDINA:
```json
        "Notify:Type:TrialEnded": "Deneme süresi bitti",
```

- [ ] **Step 6: Koş, geçtiğini gör**

```bash
bash "$M/parts.sh" ef-build "dotnet build test/Apya.Platform.EntityFrameworkCore.Tests @B" ef "dotnet test test/Apya.Platform.EntityFrameworkCore.Tests --no-build --filter FullyQualifiedName~Tenants" dom-build "dotnet build test/Apya.Platform.Domain.Tests @B" dom "dotnet test test/Apya.Platform.Domain.Tests --no-build --filter FullyQualifiedName~Notification" app-build "dotnet build test/Apya.Platform.Application.Tests @B" app "dotnet test test/Apya.Platform.Application.Tests --no-build --filter FullyQualifiedName~MacroNotificationLink"
```
Expected: üçü de `Passed!` (`Rozetsiz_turler_bilincli` `/Subscription`'ı zaten tanıyor).

- [ ] **Step 7: Commit**

```bash
git add src/Apya.Platform.Domain.Shared/Notifications/NotificationType.cs src/Apya.Platform.Domain.Shared/Notifications/NotificationTypeRegistry.cs src/Apya.Platform.Application/Tenants/SubscriptionExpiryProcessor.cs src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/SubscriptionExpiry_Tests.cs test/Apya.Platform.Domain.Tests/Notifications/NotificationTypeRegistry_Tests.cs
git commit -F - <<'EOF'
feat(paket): deneme bitince hesap salt okunur olur, Basic'e inmez

Trial kaynaklı abonelik ek süreye girmez ve otomatik indirme ayarına
bağlı değildir; paket kalır, Platform.ReadOnly açılır, yöneticilere
"Deneme süreniz bitti" bildirimi gider. Ücretli dönem davranışı aynı.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 4: Host "Denemeye al" ve liste rozetleri

**Files:**
- Modify: `src/Apya.Platform.Application.Contracts/Tenants/ITenantProfileAppService.cs`
- Modify: `src/Apya.Platform.Application.Contracts/Tenants/TenantProfileDto.cs`
- Modify: `src/Apya.Platform.Application/Tenants/TenantProfileAppService.cs`
- Modify: `src/Apya.Platform.Web/Pages/TenantManagement/Tenants/Index.js`
- Modify: `src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json`
- Test: `test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/TrialSubscription_Tests.cs`

**Interfaces:**
- Consumes: `TenantSubscriptionManager.StartTrialAsync` (Task 2), `TenantPackageManager.ApplyPackageAsync/IsReadOnlyAsync/SetReadOnlyAsync` (Task 1).
- Produces: `ITenantProfileAppService.StartTrialAsync(Guid tenantId, PackageCode packageCode, int days) : Task<TenantProfileDto>` → JS `apya.platform.tenants.tenantProfile.startTrial(tenantId, packageCode, days)`; `TenantProfileDto.IsTrial : bool`, `TenantProfileDto.IsReadOnly : bool`.

- [ ] **Step 1: Failing test** — `TrialSubscription_Tests.cs`'e ekle:

using'lere: `using Apya.Platform.Tenants;` zaten var; ekle: `using System.Linq;`

alanlar:
```csharp
    private readonly ITenantProfileAppService _tenantProfileAppService;
    private readonly TenantPackageManager _packageManager;
    private readonly IRepository<TenantProfile, Guid> _profileRepository;
```
constructor:
```csharp
        _tenantProfileAppService = GetRequiredService<ITenantProfileAppService>();
        _packageManager = GetRequiredService<TenantPackageManager>();
        _profileRepository = GetRequiredService<IRepository<TenantProfile, Guid>>();
```
test:
```csharp
    /// <summary>
    /// Host "Denemeye al": paket uygulanır (salt okunur kilit de kalkar) ve deneme dönemi açılır.
    /// </summary>
    [Fact]
    public async Task Host_StartTrial_Applies_Package_Clears_ReadOnly_And_Opens_Trial()
    {
        var tenantId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();
            var profile = new TenantProfile(
                Guid.NewGuid(), tenantId, CompanyType.Company,
                Guid.NewGuid().ToString("N")[..10], "a@b.com");
            await _profileRepository.InsertAsync(profile, autoSave: true);
            await _packageManager.SetReadOnlyAsync(tenantId, true);
        });

        var dto = await _tenantProfileAppService.StartTrialAsync(tenantId, PackageCode.Premium, 14);

        dto.PackageCode.ShouldBe(PackageCode.Premium);
        dto.IsTrial.ShouldBeTrue();
        dto.SubscriptionEndDate.ShouldNotBeNull();

        await WithUnitOfWorkAsync(async () =>
        {
            (await _packageManager.IsReadOnlyAsync(tenantId)).ShouldBeFalse();
            (await _subscriptionManager.GetCurrentOrNullAsync(tenantId))!.Source.ShouldBe(SubscriptionSource.Trial);
        });
    }
```

- [ ] **Step 2: Koş, düştüğünü gör**

```bash
bash "$M/parts.sh" ef-build "dotnet build test/Apya.Platform.EntityFrameworkCore.Tests @B"
```
Expected: derleme HATASI — `StartTrialAsync`, `IsTrial` yok.

- [ ] **Step 3: Sözleşme** — `ITenantProfileAppService.cs`, `Task<TenantProfileDto> RenewPackageAsync(Guid tenantId, SubscriptionPeriod period);` satırının ARDINA:
```csharp

    /// <summary>
    /// Müşteriye süreli deneme verir: paketi uygular (salt okunur kilidi de kalkar) ve gün
    /// cinsinden bir deneme dönemi açar. Yürürlükteki dönem kapanır. Süre bitince hesap Basic'e
    /// İNMEZ, salt okunur olur.
    /// </summary>
    Task<TenantProfileDto> StartTrialAsync(Guid tenantId, PackageCode packageCode, int days);
```
`TenantProfileDto.cs`, `public bool IsInGracePeriod { get; set; }` satırının ARDINA:
```csharp

    /// <summary>Yürürlükteki dönem süreli deneme mi?</summary>
    public bool IsTrial { get; set; }

    /// <summary>Hesap salt okunur mu (deneme bitti ya da host elle kilitledi)?</summary>
    public bool IsReadOnly { get; set; }
```

- [ ] **Step 4: Uygulama** — `TenantProfileAppService.cs`:

(a) `GetListAsync` içinde `IsInGracePeriod = subscription?.Status == SubscriptionStatus.InGrace` satırını:
```csharp
                IsInGracePeriod = subscription?.Status == SubscriptionStatus.InGrace,
                IsTrial = subscription?.Source == SubscriptionSource.Trial,
                // Deneme bitince yürürlükte satır kalmaz ("süresiz" görünürdü); durumu bayrak söyler.
                IsReadOnly = await _tenantPackageManager.IsReadOnlyAsync(tenant.Id)
```
yap.

(b) `FillSubscription` içinde `dto.IsInGracePeriod = subscription.Status == SubscriptionStatus.InGrace;` satırının ARDINA:
```csharp
        dto.IsTrial = subscription.Source == SubscriptionSource.Trial;
```

(c) `RenewPackageAsync` metodunun ÖNÜNE (onun `/// <summary>` satırından önce):
```csharp
    /// <summary>
    /// Süreli deneme. Paket hemen uygulanır (ApplyPackageAsync salt okunur kilidi de kaldırır),
    /// gün bazlı bir deneme dönemi açılır. Gün sınırı TenantSubscriptionManager'da denetlenir.
    /// </summary>
    [Authorize(TenantManagementPermissions.Tenants.Update)]
    public async Task<TenantProfileDto> StartTrialAsync(Guid tenantId, PackageCode packageCode, int days)
    {
        using var uow = _unitOfWorkManager.Begin(requiresNew: true, isTransactional: true);

        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);
        if (profile == null)
        {
            throw new UserFriendlyException("Bu tenant için profil bulunamadı; önce profil oluşturun.");
        }

        profile.SetPackage(packageCode);
        await _tenantProfileRepository.UpdateAsync(profile);

        await _tenantPackageManager.ApplyPackageAsync(tenantId, packageCode);

        var subscription = await _tenantSubscriptionManager.StartTrialAsync(tenantId, packageCode, days);

        var result = ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
        FillSubscription(result, subscription);

        await uow.CompleteAsync();
        return result;
    }

```
(Profil mesajı `AssignPackageAsync`'teki ile aynı tutuldu — mevcut stil; tr.json'a taşımak bu işin kapsamı dışında.)

- [ ] **Step 5: Host ekranı** — `Index.js`:

(a) "Süreyi Uzat" aksiyon nesnesinin (`renewPackage(data.record);` içeren blok, sonundaki `},` dahil) ARDINA:
```js
                            {
                                text: l('TenantManagement:StartTrial'),
                                visible: abp.auth.isGranted('AbpTenantManagement.Tenants.Update'),
                                action: function (data) {
                                    startTrial(data.record);
                                }
                            },
```

(b) "Paket Bitişi" sütununun `render`'ında şu iki satırı:
```js
                    // Abonelik satırı olmayan müşteri süresizdir: süre işleyicisi ona dokunmaz.
                    if (!data) {
```
şuna çevir:
```js
                    // Deneme bitince yürürlükte satır kalmaz; "Süresiz" demek yanlış olurdu.
                    if (row.isReadOnly) {
                        return '<span class="apya-chip apya-chip-negative">'
                            + esc(l('TenantManagement:Chip.ReadOnly')) + '</span>';
                    }

                    // Abonelik satırı olmayan müşteri süresizdir: süre işleyicisi ona dokunmaz.
                    if (!data) {
```
ve aynı render'da `var text = end.toLocaleDateString('tr-TR');` satırını:
```js
                    var text = end.toLocaleDateString('tr-TR')
                        + (row.isTrial ? ' · ' + esc(l('TenantManagement:Chip.Trial')) : '');
```

(c) `renewPackage` fonksiyonunun kapanışından (`abp.notify.success('Paket süresi uzatıldı.');` içeren `.then` zincirinin `});` ve fonksiyonun `}`'si) SONRA:
```js

    // Süreli deneme: paket hemen uygulanır, süre GÜN olarak verilir. Bitince hesap Basic'e
    // inmez, salt okunur olur (StartTrialAsync).
    function startTrial(record) {
        var trialPackages = { 2: 'Standard', 3: 'Premium', 4: 'Enterprise' };

        Swal.fire({
            title: esc(l('TenantManagement:StartTrial')),
            html: '<div class="text-start">'
                + '<div class="mb-2 text-muted small">' + esc(record.tenantName) + '</div>'
                + '<label class="form-label small" for="trialPkgSelect">' + esc(l('TenantManagement:StartTrial.Package')) + '</label>'
                + buildSelect('trialPkgSelect', trialPackages, 3)
                + '<label class="form-label small mt-3" for="trialDays">' + esc(l('TenantManagement:StartTrial.Days')) + '</label>'
                + '<input id="trialDays" type="number" class="form-control" min="1" max="90" value="14">'
                + '<div class="form-text mt-2">' + esc(l('TenantManagement:StartTrial.Hint')) + '</div>'
                + '</div>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: esc(l('TenantManagement:StartTrial.Confirm')),
            cancelButtonText: 'İptal',
            preConfirm: function () {
                return {
                    packageCode: parseInt(document.getElementById('trialPkgSelect').value, 10),
                    days: parseInt(document.getElementById('trialDays').value, 10)
                };
            }
        }).then(function (r) {
            if (!r.isConfirmed) { return; }
            apya.platform.tenants.tenantProfile
                .startTrial(record.tenantId, r.value.packageCode, r.value.days)
                .then(function () {
                    abp.notify.success(l('TenantManagement:StartTrial.Done'));
                    dataTable.ajax.reload();
                });
        });
    }
```
(Sunucu gün sınırını ayrıca denetler; kutu 1–90 dışında bir sayı gönderirse ABP hata kutusu `TrialDaysOutOfRange` metnini gösterir.)

- [ ] **Step 6: Metinler** — `tr.json`, `"Subscription:Host.Notice"` ile başlayan satırın ARDINA:
```json
        "TenantManagement:StartTrial": "Denemeye al",
        "TenantManagement:StartTrial.Package": "Deneme paketi",
        "TenantManagement:StartTrial.Days": "Süre (gün, 1–90)",
        "TenantManagement:StartTrial.Hint": "Paket hemen uygulanır ve yürürlükteki dönem kapanır. Süre bitince hesap Basic'e inmez, salt okunur olur; paket atanınca açılır.",
        "TenantManagement:StartTrial.Confirm": "Denemeyi başlat",
        "TenantManagement:StartTrial.Done": "Deneme başlatıldı.",
        "TenantManagement:Chip.ReadOnly": "Salt okunur",
        "TenantManagement:Chip.Trial": "deneme",
```

- [ ] **Step 7: Koş, geçtiğini gör**

```bash
bash "$M/parts.sh" ef-build "dotnet build test/Apya.Platform.EntityFrameworkCore.Tests @B" ef "dotnet test test/Apya.Platform.EntityFrameworkCore.Tests --no-build --filter FullyQualifiedName~Tenants"
```
Expected: `Passed!`.

- [ ] **Step 8: Commit**

```bash
git add src/Apya.Platform.Application.Contracts/Tenants/ITenantProfileAppService.cs src/Apya.Platform.Application.Contracts/Tenants/TenantProfileDto.cs src/Apya.Platform.Application/Tenants/TenantProfileAppService.cs src/Apya.Platform.Web/Pages/TenantManagement/Tenants/Index.js src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/TrialSubscription_Tests.cs
git commit -F - <<'EOF'
feat(kiracı): host müşteriye süreli deneme verir, listede durum görünür

Kiracı Yönetimi'ne "Denemeye al" (paket + gün). Paket Bitişi sütunu
salt okunur hesabı ve denemeyi rozetle gösterir.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

- [ ] **Step 9: PR-1 hazır** — kullanıcıya push + PR onayı sor (`gh pr list --state open --limit 10` ile mükerrer tara). PR-1 main'e girmeden Task 5'e BAŞLAMA.

---

### Task 5: İzinli yazmalar ve saf karar (PR-2 başlangıcı)

**Files:**
- Create: `src/Apya.Platform.Web/Middleware/ReadOnlyAllowedWrites.cs`
- Create: `src/Apya.Platform.Web/Middleware/ReadOnlyRequestPolicy.cs`
- Test: `test/Apya.Platform.Web.Tests/Middleware/ReadOnlyAllowedWrites_Tests.cs` (yeni)
- Test: `test/Apya.Platform.Web.Tests/Middleware/ReadOnlyRequestPolicy_Tests.cs` (yeni)

**Interfaces:**
- Produces: `ReadOnlyAllowedWrites.IsAllowed(PathString path) : bool`; `ReadOnlyDecision { Pass, RejectApi, RedirectForm }`; `ReadOnlyRequestPolicy.Decide(string method, PathString path, bool isApiCall) : ReadOnlyDecision`; `ReadOnlyRequestPolicy.IsApiCall(HttpRequest) : bool`; `ReadOnlyRequestPolicy.ExplanationPath = "/Subscription/ReadOnly"`.

- [ ] **Step 0: Dal** (PR-1 main'de olmalı)

```bash
git fetch origin && git switch -c claude/salt-okunur-kip-kapi origin/main
git log --oneline -3
```
Expected: son commit'lerde PR-1'in squash'ı görünür.

- [ ] **Step 1: Failing testler**

`test/Apya.Platform.Web.Tests/Middleware/ReadOnlyRequestPolicy_Tests.cs`:
```csharp
using Apya.Platform.Web.Middleware;
using Microsoft.AspNetCore.Http;
using Shouldly;
using Xunit;

namespace Apya.Platform.Middleware;

/// <summary>
/// Salt okunur kapının SAF kararı: hangi istek geçer, hangisi API hatası, hangisi form
/// yönlendirmesi olur. Kiracı/bayrak/bürünme kararı middleware'de, burada değil.
/// </summary>
public class ReadOnlyRequestPolicy_Tests
{
    [Theory]
    [InlineData("GET", "/Tasks")]
    [InlineData("HEAD", "/Tasks")]
    [InlineData("OPTIONS", "/api/app/task")]
    [InlineData("GET", "/Tasks/CreateModal")]
    [InlineData("GET", "/api/app/expense/excel")]
    public void Okuma_istekleri_gecer(string method, string path)
    {
        ReadOnlyRequestPolicy.Decide(method, path, isApiCall: true).ShouldBe(ReadOnlyDecision.Pass);
    }

    [Theory]
    [InlineData("POST", "/api/app/grant-interest/express")]
    [InlineData("POST", "/api/app/notification/mark-as-read")]
    [InlineData("POST", "/Account/Logout")]
    [InlineData("POST", "/Subscription")]
    [InlineData("POST", "/notification-hub/negotiate")]
    public void Izinli_yazmalar_gecer(string method, string path)
    {
        ReadOnlyRequestPolicy.Decide(method, path, isApiCall: true).ShouldBe(ReadOnlyDecision.Pass);
    }

    [Theory]
    [InlineData("POST", "/api/app/task")]
    [InlineData("PUT", "/api/app/project/1")]
    [InlineData("DELETE", "/api/app/expense/1")]
    public void Diger_API_yazmalari_reddedilir(string method, string path)
    {
        ReadOnlyRequestPolicy.Decide(method, path, isApiCall: true).ShouldBe(ReadOnlyDecision.RejectApi);
    }

    [Fact]
    public void Klasik_form_gonderimi_aciklama_sayfasina_yonlenir()
    {
        ReadOnlyRequestPolicy.Decide("POST", "/Tasks/CreateModal", isApiCall: false)
            .ShouldBe(ReadOnlyDecision.RedirectForm);
        ReadOnlyRequestPolicy.ExplanationPath.ShouldBe("/Subscription/ReadOnly");
    }

    [Fact]
    public void API_cagrisi_yol_ya_da_baslikla_taninir()
    {
        var api = new DefaultHttpContext().Request;
        api.Path = "/api/app/task";
        ReadOnlyRequestPolicy.IsApiCall(api).ShouldBeTrue();

        var ajax = new DefaultHttpContext().Request;
        ajax.Path = "/Tasks/CreateModal";
        ajax.Headers.XRequestedWith = "XMLHttpRequest";
        ReadOnlyRequestPolicy.IsApiCall(ajax).ShouldBeTrue();

        var form = new DefaultHttpContext().Request;
        form.Path = "/Tasks/CreateModal";
        ReadOnlyRequestPolicy.IsApiCall(form).ShouldBeFalse();
    }
}
```

`test/Apya.Platform.Web.Tests/Middleware/ReadOnlyAllowedWrites_Tests.cs`:
```csharp
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using Apya.Platform.Web;
using Apya.Platform.Web.Middleware;
using Microsoft.AspNetCore.Mvc;
using Shouldly;
using Xunit;

namespace Apya.Platform.Middleware;

/// <summary>
/// İzinli yazma listesi SÖZLEŞMESİ. Bir uç yeniden adlandırılınca liste sessizce ölür: salt
/// okunur hesapta o işlem 403 döner ve hiçbir test düşmez. Bu testler her girdinin gerçek bir
/// uca karşılık geldiğini ölçer.
/// </summary>
public class ReadOnlyAllowedWrites_Tests
{
    private static readonly Assembly ApplicationAssembly = typeof(PlatformApplicationModule).Assembly;

    private static string Pascal(string kebab)
        => string.Concat(kebab.Split('-').Select(p => char.ToUpperInvariant(p[0]) + p[1..]));

    private static string PagesRoot()
        => Path.Combine(
            Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..",
            "src", "Apya.Platform.Web", "Pages");

    [Fact]
    public void Her_servis_girdisi_gercek_bir_AppServicee_karsilik_gelir()
    {
        var names = ApplicationAssembly.GetTypes().Select(t => t.Name).ToHashSet();

        var missing = ReadOnlyAllowedWrites.AppServices
            .Where(s => !names.Contains(Pascal(s) + "AppService"))
            .ToList();

        missing.ShouldBeEmpty("Karşılığı olmayan servis: " + string.Join(", ", missing));
    }

    [Fact]
    public void Her_eylem_girdisi_gercek_bir_metoda_karsilik_gelir()
    {
        foreach (var action in ReadOnlyAllowedWrites.Actions)
        {
            // "/api/app/document/prepare-download" → DocumentAppService.PrepareDownloadAsync
            var parts = action.Split('/', StringSplitOptions.RemoveEmptyEntries);
            var type = ApplicationAssembly.GetTypes().SingleOrDefault(t => t.Name == Pascal(parts[2]) + "AppService");

            type.ShouldNotBeNull(action);
            type!.GetMethods().ShouldContain(m => m.Name == Pascal(parts[3]) + "Async", action);
        }
    }

    [Fact]
    public void Sayfa_onekleri_gercek_klasorlere_karsilik_gelir()
    {
        foreach (var folder in new[] { "Account", "Grants", "CompanyProfile", "Subscription" })
        {
            Directory.Exists(Path.Combine(PagesRoot(), folder)).ShouldBeTrue(folder);
        }

        File.Exists(Path.Combine(PagesRoot(), "CompanyProfile", "DataImport.cshtml")).ShouldBeTrue();
    }

    [Fact]
    public void Denetleyici_uclari_gercek_POST_eylemlerine_karsilik_gelir()
    {
        var posts = typeof(PlatformWebModule).Assembly.GetTypes()
            .Where(t => typeof(ControllerBase).IsAssignableFrom(t))
            .SelectMany(t =>
            {
                var route = t.GetCustomAttribute<RouteAttribute>()?.Template ?? string.Empty;
                return t.GetMethods()
                    .SelectMany(m => m.GetCustomAttributes<HttpPostAttribute>())
                    .Select(a => "/" + route + "/" + a.Template);
            })
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var endpoint in new[] { "/consent/ack", "/release-notes/mark-seen", "/product-tour/mark-seen" })
        {
            posts.ShouldContain(endpoint);
        }
    }

    [Theory]
    [InlineData("/api/app/grant-interest/express", true)]
    [InlineData("/api/app/firm-data", true)]
    [InlineData("/api/app/firm-data-extraction/extract", false)]
    [InlineData("/CompanyProfile/Data", true)]
    [InlineData("/CompanyProfile/DataImport", false)]
    [InlineData("/api/app/document/prepare-download", true)]
    [InlineData("/api/app/document", false)]
    [InlineData("/api/app/task", false)]
    [InlineData("/Tasks/CreateModal", false)]
    [InlineData("/notification-hub/negotiate", true)]
    [InlineData("/api/ai-task-generator/create-tasks", false)]
    public void Ucretsiz_zemin_acik_ucretli_alan_kapali(string path, bool allowed)
    {
        ReadOnlyAllowedWrites.IsAllowed(path).ShouldBe(allowed);
    }
}
```

- [ ] **Step 2: Koş, düştüğünü gör**

```bash
bash "$M/parts.sh" web-build "dotnet build test/Apya.Platform.Web.Tests @B"
```
Expected: derleme HATASI — `ReadOnlyAllowedWrites`, `ReadOnlyRequestPolicy` yok.

- [ ] **Step 3: İzinli liste** — `src/Apya.Platform.Web/Middleware/ReadOnlyAllowedWrites.cs`:
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace Apya.Platform.Web.Middleware;

/// <summary>
/// Salt okunur hesapta DA çalışan yazma uçları — "ücretsiz zemin" (tasarım:
/// docs/superpowers/specs/2026-11-27-ucretsiz-hesap-ve-deneme-design.md §5.3).
///
/// <para>🔴 Yeni bir firma-tarafı hibe ucu ya da kişisel tercih ucu eklenince buraya bak:
/// listede olmayan her yazma salt okunur hesapta 403 döner. <c>ReadOnlyAllowedWrites_Tests</c>
/// her girdinin gerçek bir uca karşılık geldiğini ölçer.</para>
/// </summary>
public static class ReadOnlyAllowedWrites
{
    /// <summary>
    /// <c>/api/app/grant-…</c>: hibe servislerinin tamamı. Host'a özel olanlar zaten
    /// <c>Grants.Edit/Create</c> iznine bağlı; kiracı onları çağıramaz.
    /// </summary>
    public const string GrantServicePrefix = "grant-";

    /// <summary>
    /// <c>/api/app/{servis}/…</c> — servis segmenti TAM eşleşir: "firm-data" izinli,
    /// "firm-data-extraction" (yapay zekâyla belgeden doldurma) değil.
    /// </summary>
    public static readonly IReadOnlyCollection<string> AppServices = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
        "notification",        // okundu, tercih, sessiz saat
        "notification-device", // anlık bildirim aboneliği
        "shell",               // sabitlemeler, pano görünümü
        "dashboard",           // Genel Bakış düzeni
        "macro-screen",        // Makro kullanım sayacı
        "feedback",            // geri bildirim gönderme
        "consent",             // onay kaydı
        "telemetry",           // istemci hata kaydı
        "my-company-profile",  // Kurum Profili
        "firm-data",           // Kurumsal Veriler (elle)
        "firm-profile",        // hibe eşleştirme profili
    };

    /// <summary>Okuma niteliğinde ama POST olan eylemler (K4: indirme açık kalır).</summary>
    public static readonly IReadOnlyList<string> Actions = new[]
    {
        "/api/app/document/prepare-download",
        "/api/app/delivery-package/prepare-download",
        "/api/app/delivery-package/prepare-run-download",
    };

    /// <summary>Razor sayfa kökleri ve diğer uçlar (segment önekiyle eşleşir).</summary>
    public static readonly IReadOnlyList<string> PathPrefixes = new[]
    {
        "/Account",                 // giriş, çıkış, bürünmeden dönüş
        "/api/account",             // profil ve şifre
        "/connect",                 // OpenIddict jeton uçları
        "/Grants",                  // hibe ekranları (firma tarafı)
        "/CompanyProfile",          // Kurum Profili ve Kurumsal Veriler
        "/Subscription",            // Paketim: "Ödedim" bildirimi
        "/consent/ack",
        "/release-notes/mark-seen",
        "/product-tour/mark-seen",
    };

    /// <summary>Bir önekin İÇİNDE olup ücretli kalanlar.</summary>
    public static readonly IReadOnlyList<string> ExcludedPrefixes = new[]
    {
        "/CompanyProfile/DataImport", // yapay zekâyla belgeden doldurma
    };

    public static bool IsAllowed(PathString path)
    {
        if (ExcludedPrefixes.Any(p => path.StartsWithSegments(p, StringComparison.OrdinalIgnoreCase)))
        {
            return false;
        }

        if (path.StartsWithSegments("/api/app", StringComparison.OrdinalIgnoreCase, out var rest))
        {
            var service = FirstSegment(rest);
            return service.StartsWith(GrantServicePrefix, StringComparison.OrdinalIgnoreCase)
                   || AppServices.Contains(service)
                   || Actions.Any(a => path.StartsWithSegments(a, StringComparison.OrdinalIgnoreCase));
        }

        return PathPrefixes.Any(p => path.StartsWithSegments(p, StringComparison.OrdinalIgnoreCase))
               || SlowRequestLoggingMiddleware.HubPrefixes.Any(p => path.StartsWithSegments(p, StringComparison.OrdinalIgnoreCase));
    }

    /// <summary>"/grant-interest/express" → "grant-interest".</summary>
    private static string FirstSegment(PathString rest)
    {
        var value = (rest.Value ?? string.Empty).TrimStart('/');
        var slash = value.IndexOf('/');
        return slash < 0 ? value : value[..slash];
    }
}
```

- [ ] **Step 4: Saf karar** — `src/Apya.Platform.Web/Middleware/ReadOnlyRequestPolicy.cs`:
```csharp
using System;
using Microsoft.AspNetCore.Http;

namespace Apya.Platform.Web.Middleware;

public enum ReadOnlyDecision
{
    /// <summary>İstek olduğu gibi geçer.</summary>
    Pass = 0,

    /// <summary>API / AJAX yazması: 403 + ABP hata gövdesi.</summary>
    RejectApi = 1,

    /// <summary>Klasik form gönderimi: açıklama sayfasına yönlendirilir.</summary>
    RedirectForm = 2
}

/// <summary>
/// Salt okunur hesapta bir isteğe ne olacağının SAF kararı. Kiracı, bayrak ve bürünme
/// denetimi <see cref="ReadOnlyTenantMiddleware"/>'dedir; burada yalnız yöntem ve yol.
/// </summary>
public static class ReadOnlyRequestPolicy
{
    /// <summary>
    /// Klasik form gönderiminin yönlendirildiği sayfa. Oturumlu HER kullanıcıya açıktır —
    /// Paketim TenantSettings izni istediği için oraya yönlendirmek izni olmayana 403 olurdu.
    /// </summary>
    public const string ExplanationPath = "/Subscription/ReadOnly";

    public static ReadOnlyDecision Decide(string method, PathString path, bool isApiCall)
    {
        if (HttpMethods.IsGet(method) || HttpMethods.IsHead(method)
            || HttpMethods.IsOptions(method) || HttpMethods.IsTrace(method))
        {
            return ReadOnlyDecision.Pass;
        }

        if (ReadOnlyAllowedWrites.IsAllowed(path))
        {
            return ReadOnlyDecision.Pass;
        }

        return isApiCall ? ReadOnlyDecision.RejectApi : ReadOnlyDecision.RedirectForm;
    }

    /// <summary>
    /// abp.ajax / jQuery <c>X-Requested-With</c> gönderir; <c>fetch</c> göndermez ama
    /// <c>/api</c> altına gider. İkisi de JSON hata gövdesi bekler.
    /// </summary>
    public static bool IsApiCall(HttpRequest request)
        => request.Path.StartsWithSegments("/api", StringComparison.OrdinalIgnoreCase)
           || string.Equals(request.Headers.XRequestedWith.ToString(), "XMLHttpRequest", StringComparison.OrdinalIgnoreCase)
           || request.Headers.Accept.ToString().Contains("application/json", StringComparison.OrdinalIgnoreCase);
}
```

- [ ] **Step 5: Koş, geçtiğini gör**

```bash
bash "$M/parts.sh" web-build "dotnet build test/Apya.Platform.Web.Tests @B" web "dotnet test test/Apya.Platform.Web.Tests --no-build --filter FullyQualifiedName~Apya.Platform.Middleware.ReadOnly"
```
Expected: `Passed!`. Bir servis/eylem girdisi düşerse adını Application'da ara (`Grep "class XAppService"`), listeyi gerçek ada göre düzelt — testi gevşetme.

- [ ] **Step 6: Commit**

```bash
git add src/Apya.Platform.Web/Middleware/ReadOnlyAllowedWrites.cs src/Apya.Platform.Web/Middleware/ReadOnlyRequestPolicy.cs test/Apya.Platform.Web.Tests/Middleware/ReadOnlyAllowedWrites_Tests.cs test/Apya.Platform.Web.Tests/Middleware/ReadOnlyRequestPolicy_Tests.cs
git commit -F - <<'EOF'
feat(paket): salt okunur hesabın izinli yazma listesi ve kararı

Hibe firma tarafı, kişisel tercihler, Kurum Profili, Paketim ve belge
indirme açık; yapay zekâyla belgeden doldurma kapalı. Her girdinin
gerçek bir uca karşılık geldiği testle ölçülür.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 6: Sunucu kapısı (middleware)

**Files:**
- Create: `src/Apya.Platform.Web/Middleware/ReadOnlyTenantMiddleware.cs`
- Modify: `src/Apya.Platform.Web/PlatformWebModule.cs`
- Modify: `src/Apya.Platform.Domain.Shared/PlatformDomainErrorCodes.cs`
- Modify: `src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json`
- Test: `test/Apya.Platform.Web.Tests/Middleware/ReadOnlyTenantMiddleware_Tests.cs` (yeni)

**Interfaces:**
- Consumes: `ReadOnlyRequestPolicy`, `ReadOnlyDecision` (Task 5); `PlatformFeatures.ReadOnly` (Task 1).
- Produces: `PlatformDomainErrorCodes.SubscriptionReadOnly = "Platform:Subscription:ReadOnly"`; 403 gövdesi `{"error":{"code":"Platform:Subscription:ReadOnly","message":"…"}}` + başlık `_AbpErrorFormat: true`.

- [ ] **Step 1: Failing test** — `test/Apya.Platform.Web.Tests/Middleware/ReadOnlyTenantMiddleware_Tests.cs`:
```csharp
using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Features;
using Apya.Platform.Localization;
using Apya.Platform.Web.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Localization;
using NSubstitute;
using Shouldly;
using Volo.Abp.Features;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Volo.Abp.Users;
using Xunit;

namespace Apya.Platform.Middleware;

/// <summary>
/// SUNUCU KAPISI: salt okunur kiracıda izinsiz yazma durur (API → 403 + ABP hata gövdesi,
/// form → açıklama sayfası); okuma, izinli yazma, host, bürünen host ve açık hesap geçer.
/// </summary>
public class ReadOnlyTenantMiddleware_Tests
{
    private static (ReadOnlyTenantMiddleware Middleware, IFeatureChecker Features) Create(
        Guid? tenantId, bool authenticated = true, bool readOnly = true, bool impersonated = false)
    {
        var tenant = Substitute.For<ICurrentTenant>();
        tenant.Id.Returns(tenantId);

        var user = Substitute.For<ICurrentUser>();
        user.IsAuthenticated.Returns(authenticated);
        user.FindClaim(AbpClaimTypes.ImpersonatorUserId).Returns(impersonated
            ? new Claim(AbpClaimTypes.ImpersonatorUserId, Guid.NewGuid().ToString())
            : null);

        var features = Substitute.For<IFeatureChecker>();
        features.IsEnabledAsync(PlatformFeatures.ReadOnly).Returns(readOnly);

        var l = Substitute.For<IStringLocalizer<PlatformResource>>();
        l[Arg.Any<string>()].Returns(ci => new LocalizedString((string)ci[0], "Bu işlem paket gerektirir."));

        return (new ReadOnlyTenantMiddleware(tenant, user, features, l), features);
    }

    private static DefaultHttpContext Request(string method, string path, bool ajax = false)
    {
        var context = new DefaultHttpContext();
        context.Request.Method = method;
        context.Request.Path = path;
        if (ajax)
        {
            context.Request.Headers.XRequestedWith = "XMLHttpRequest";
        }
        context.Response.Body = new MemoryStream();
        return context;
    }

    private static async Task<bool> RunAsync(ReadOnlyTenantMiddleware middleware, HttpContext context)
    {
        var passed = false;
        await middleware.InvokeAsync(context, _ => { passed = true; return Task.CompletedTask; });
        return passed;
    }

    [Fact]
    public async Task API_yazmasi_403_ve_ABP_hata_govdesi_doner()
    {
        var (middleware, _) = Create(Guid.NewGuid());
        var context = Request("POST", "/api/app/task");

        (await RunAsync(middleware, context)).ShouldBeFalse();

        context.Response.StatusCode.ShouldBe(StatusCodes.Status403Forbidden);
        context.Response.Headers["_AbpErrorFormat"].ToString().ShouldBe("true");
        context.Response.Body.Position = 0;
        var body = await new StreamReader(context.Response.Body).ReadToEndAsync();
        body.ShouldContain(PlatformDomainErrorCodes.SubscriptionReadOnly);
    }

    [Fact]
    public async Task Form_gonderimi_aciklama_sayfasina_yonlenir()
    {
        var (middleware, _) = Create(Guid.NewGuid());
        var context = Request("POST", "/Tasks/CreateModal");

        (await RunAsync(middleware, context)).ShouldBeFalse();

        context.Response.StatusCode.ShouldBe(StatusCodes.Status302Found);
        context.Response.Headers.Location.ToString().ShouldBe(ReadOnlyRequestPolicy.ExplanationPath);
    }

    [Fact]
    public async Task Okuma_bayrak_sorulmadan_gecer()
    {
        var (middleware, features) = Create(Guid.NewGuid());

        (await RunAsync(middleware, Request("GET", "/Tasks"))).ShouldBeTrue();
        await features.DidNotReceive().IsEnabledAsync(Arg.Any<string>());
    }

    [Fact]
    public async Task Izinli_yazma_gecer()
    {
        var (middleware, _) = Create(Guid.NewGuid());
        (await RunAsync(middleware, Request("POST", "/api/app/grant-interest/express"))).ShouldBeTrue();
    }

    [Fact]
    public async Task Burunen_host_gecer()
    {
        var (middleware, _) = Create(Guid.NewGuid(), impersonated: true);
        (await RunAsync(middleware, Request("POST", "/api/app/task"))).ShouldBeTrue();
    }

    [Fact]
    public async Task Acik_hesap_gecer()
    {
        var (middleware, _) = Create(Guid.NewGuid(), readOnly: false);
        (await RunAsync(middleware, Request("POST", "/api/app/task"))).ShouldBeTrue();
    }

    [Fact]
    public async Task Host_ve_oturumsuz_istek_gecer()
    {
        var (host, _) = Create(tenantId: null);
        (await RunAsync(host, Request("POST", "/api/app/task"))).ShouldBeTrue();

        var (anonymous, _) = Create(Guid.NewGuid(), authenticated: false);
        (await RunAsync(anonymous, Request("POST", "/api/app/task"))).ShouldBeTrue();
    }
}
```

- [ ] **Step 2: Koş, düştüğünü gör**

```bash
bash "$M/parts.sh" web-build "dotnet build test/Apya.Platform.Web.Tests @B"
```
Expected: derleme HATASI — `ReadOnlyTenantMiddleware`, `SubscriptionReadOnly` yok.

- [ ] **Step 3: Hata kodu** — `PlatformDomainErrorCodes.cs`, `TrialDaysOutOfRange` satırının ARDINA:
```csharp
    public const string SubscriptionReadOnly = "Platform:Subscription:ReadOnly";
```
`tr.json`, `"Platform:Subscription:TrialDaysOutOfRange"` satırının ARDINA:
```json
        "Platform:Subscription:ReadOnly": "Deneme süreniz bitti; hesabınız salt okunur. Verilerinizi görmeye ve dışa aktarmaya devam edebilirsiniz; kayıt eklemek, değiştirmek ve silmek için paket seçin.",
```

- [ ] **Step 4: Middleware** — `src/Apya.Platform.Web/Middleware/ReadOnlyTenantMiddleware.cs`:
```csharp
using System.Threading.Tasks;
using Apya.Platform.Features;
using Apya.Platform.Localization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Features;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Middleware;

/// <summary>
/// SALT OKUNUR HESAP KAPISI (deneme bitti ya da host kilitledi). GET dışı her isteği,
/// <see cref="ReadOnlyAllowedWrites"/>'ta değilse durdurur: API/AJAX → 403 + ABP hata gövdesi
/// (istemci betiği paket penceresini açar), klasik form → açıklama sayfası.
///
/// <para>Kapı TEK noktadır: izin tavanıyla yapılsaydı düğmeler gizlenir ("tıklayınca pakete"
/// anı kaybolur) ve bazı <c>.Default</c> izinleri yazmaya da izin verdiği için sızıntı kalırdı.</para>
///
/// <para>Bürünen host muaftır (destek işi; işlem zaten güvenlik kaydına düşer). Arka plan işleri
/// bu kapıdan geçmez — kiracı adına yazan işler kendileri bakar (ScheduledReportWorker).</para>
/// </summary>
public class ReadOnlyTenantMiddleware : IMiddleware, ITransientDependency
{
    private readonly ICurrentTenant _currentTenant;
    private readonly ICurrentUser _currentUser;
    private readonly IFeatureChecker _featureChecker;
    private readonly IStringLocalizer<PlatformResource> _l;

    public ReadOnlyTenantMiddleware(
        ICurrentTenant currentTenant,
        ICurrentUser currentUser,
        IFeatureChecker featureChecker,
        IStringLocalizer<PlatformResource> l)
    {
        _currentTenant = currentTenant;
        _currentUser = currentUser;
        _featureChecker = featureChecker;
        _l = l;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // Ucuz karar ÖNCE: okumalar ve izinli yazmalar bayrak okunmadan geçer.
        var decision = ReadOnlyRequestPolicy.Decide(
            context.Request.Method,
            context.Request.Path,
            ReadOnlyRequestPolicy.IsApiCall(context.Request));

        if (decision == ReadOnlyDecision.Pass || !await IsEnforcedAsync())
        {
            await next(context);
            return;
        }

        if (decision == ReadOnlyDecision.RedirectForm)
        {
            context.Response.Redirect(ReadOnlyRequestPolicy.ExplanationPath);
            return;
        }

        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        // abp.ajax bu başlığı görünce gövdeyi abp.ajax.showError'a verir; apya-quota-upsell.js
        // kodu tanıyıp düz hata kutusu yerine paket penceresini açar.
        context.Response.Headers["_AbpErrorFormat"] = "true";
        await context.Response.WriteAsJsonAsync(new
        {
            error = new
            {
                code = PlatformDomainErrorCodes.SubscriptionReadOnly,
                message = _l[PlatformDomainErrorCodes.SubscriptionReadOnly].Value
            }
        });
    }

    private async Task<bool> IsEnforcedAsync()
    {
        if (_currentTenant.Id == null || !_currentUser.IsAuthenticated)
        {
            return false;
        }

        if (_currentUser.FindImpersonatorUserId() != null)
        {
            return false;
        }

        return await _featureChecker.IsEnabledAsync(PlatformFeatures.ReadOnly);
    }
}
```

- [ ] **Step 5: Boru hattına kaydet** — `PlatformWebModule.cs`, şu iki satırı:
```csharp
        app.UseDynamicClaims();
        app.UseAuthorization();
```
şuna çevir:
```csharp
        app.UseDynamicClaims();
        app.UseAuthorization();

        // Salt okunur hesap (deneme bitti): yazmaları keser. UseDynamicClaims'ten SONRA — kiracı ve
        // bürünme claim'i ancak burada okunur; UseUnitOfWork'ten SONRA — feature okuması DB'ye inebilir.
        app.UseMiddleware<Middleware.ReadOnlyTenantMiddleware>();
```

- [ ] **Step 6: Koş, geçtiğini gör**

```bash
bash "$M/parts.sh" web-build "dotnet build test/Apya.Platform.Web.Tests @B" web "dotnet test test/Apya.Platform.Web.Tests --no-build --filter FullyQualifiedName~Apya.Platform.Middleware.ReadOnly" dom-build "dotnet build test/Apya.Platform.Domain.Tests @B" dom "dotnet test test/Apya.Platform.Domain.Tests --no-build --filter FullyQualifiedName~ErrorCodeLocalization"
```
Expected: ikisi de `Passed!`.

- [ ] **Step 7: Commit**

```bash
git add src/Apya.Platform.Web/Middleware/ReadOnlyTenantMiddleware.cs src/Apya.Platform.Web/PlatformWebModule.cs src/Apya.Platform.Domain.Shared/PlatformDomainErrorCodes.cs src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json test/Apya.Platform.Web.Tests/Middleware/ReadOnlyTenantMiddleware_Tests.cs
git commit -F - <<'EOF'
feat(paket): salt okunur hesapta yazmayı sunucuda tek kapı keser

API/AJAX yazması 403 + Platform:Subscription:ReadOnly döner, klasik
form açıklama sayfasına yönlenir. Okuma, izinli yazma, host ve bürünen
host geçer.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 7: İstemci — paket penceresi ve pencere yakalama

**Files:**
- Modify: `src/Apya.Platform.Web/wwwroot/js/apya-quota-upsell.js`
- Modify: `src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json`
- Modify: `test/Apya.Platform.Web.Tests/Pages/QuotaUpsell_Tests.cs`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/test/apyaReadOnlyUpsell.test.js` (yeni)

**Interfaces:**
- Consumes: hata kodu `Platform:Subscription:ReadOnly` (Task 6), feature `Platform.ReadOnly` (Task 1).
- Produces: `window.apya.quotaUpsell.isReadOnlyError(error)`, `.isReadOnlyActive()`, `.shouldBlockModal(viewUrl)`; `abp.ModalManager` sarmalayıcısı.

- [ ] **Step 1: Failing testler**

`src/Apya.Platform.Web/wwwroot/dynamic-assets/src/test/apyaReadOnlyUpsell.test.js`:
```js
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

// Salt okunur kip KARARLARI: hangi hata salt okunur sayılır, durum ne zaman etkin, hangi
// pencere açılmadan durur. Modal DOM'u jQuery + Bootstrap ister (repoda jQuery devDependency
// yok) — canlı QA ile doğrulanır.

let upsell;
let enabled;
let impersonator;
let opened;

beforeAll(async () => {
    enabled = {};
    impersonator = null;
    opened = [];

    global.abp = {
        ajax: { showError: function () { return 'abp-kutusu'; } },
        auth: { isGranted: function () { return false; } },
        features: { isEnabled: function (name) { return enabled[name] === true; } },
        currentUser: {},
        ModalManager: function (options) {
            return { open: function () { opened.push(options); } };
        }
    };
    Object.defineProperty(global.abp.currentUser, 'impersonatorUserId', { get: () => impersonator });

    await import('../../../js/apya-quota-upsell.js');
    upsell = window.apya.quotaUpsell;
});

beforeEach(() => {
    enabled = {};
    impersonator = null;
    opened = [];
});

describe('salt okunur hatası', () => {
    it('sunucunun salt okunur kodunu tanır', () => {
        expect(upsell.isReadOnlyError({ code: 'Platform:Subscription:ReadOnly' })).toBe(true);
    });

    it('kota kodunu ve başka hataları salt okunur saymaz', () => {
        expect(upsell.isReadOnlyError({ code: 'Platform:Error:MaxUsersReached' })).toBe(false);
        expect(upsell.isReadOnlyError(null)).toBe(false);
    });

    // jsdom'da Bootstrap yok → salt okunur hata da güvenli tarafa, ABP'nin kutusuna düşer.
    it('Bootstrap yokken salt okunur hatayı yutmaz', () => {
        expect(abp.ajax.showError({ code: 'Platform:Subscription:ReadOnly', message: 'x' })).toBe('abp-kutusu');
    });
});

describe('salt okunur durumu', () => {
    it('bayrak kapalıyken etkin değil', () => {
        expect(upsell.isReadOnlyActive()).toBe(false);
    });

    it('bayrak açıkken etkin', () => {
        enabled['Platform.ReadOnly'] = true;
        expect(upsell.isReadOnlyActive()).toBe(true);
    });

    // Sunucuyla aynı kural: bürünen host kapıdan muaf.
    it('bürünen host için etkin değil', () => {
        enabled['Platform.ReadOnly'] = true;
        impersonator = 'b2a1c3d4-0000-0000-0000-000000000001';
        expect(upsell.isReadOnlyActive()).toBe(false);
    });
});

describe('pencere kararı', () => {
    it('oluştur, düzenle ve içe aktar pencerelerini durdurur', () => {
        enabled['Platform.ReadOnly'] = true;
        expect(upsell.shouldBlockModal('/Tasks/CreateModal')).toBe(true);
        expect(upsell.shouldBlockModal('/Invoices/EditModal?id=1')).toBe(true);
        expect(upsell.shouldBlockModal('/Expenses/ImportModal')).toBe(true);
        // abp.appPath + 'Expenses/CreateModal' biçimi (baştaki / olmadan) da tanınır.
        expect(upsell.shouldBlockModal('Expenses/CreateModal')).toBe(true);
    });

    it('ayrıntı ve özet pencerelerini açar', () => {
        enabled['Platform.ReadOnly'] = true;
        expect(upsell.shouldBlockModal('/FxRevaluations/DetailModal')).toBe(false);
        expect(upsell.shouldBlockModal('/Projects/BudgetSummaryModal')).toBe(false);
    });

    it('ücretsiz zemindeki pencereleri açar', () => {
        enabled['Platform.ReadOnly'] = true;
        expect(upsell.shouldBlockModal('/Grants/CallImportModal')).toBe(false);
        expect(upsell.shouldBlockModal('/CompanyProfile/EditModal')).toBe(false);
    });

    it('bayrak kapalıyken hiçbir pencereyi durdurmaz', () => {
        expect(upsell.shouldBlockModal('/Tasks/CreateModal')).toBe(false);
    });
});

describe('ModalManager sarmalayıcısı', () => {
    it('açık hesapta pencereyi açar', () => {
        new abp.ModalManager({ viewUrl: '/Tasks/CreateModal' }).open();
        expect(opened).toHaveLength(1);
    });

    // Bootstrap yoksa paket penceresi çizilemez: pencere açılır, kayıt sunucuda yine durur.
    it('Bootstrap yokken salt okunur hesapta da pencereyi açar', () => {
        enabled['Platform.ReadOnly'] = true;
        new abp.ModalManager('/Tasks/CreateModal').open();
        expect(opened).toHaveLength(1);
    });
});
```

`QuotaUpsell_Tests.cs` sınıfının sonuna (gerekirse `using Apya.Platform.Features;` ekle):
```csharp
    /// <summary>
    /// Salt okunur kip: sunucunun 403 kodu ve feature adı betikte birebir geçmeli. Ayrışırsa
    /// kullanıcı paket penceresi yerine düz "yetkisiz" kutusunu görür, pencereler de açılır.
    /// </summary>
    [Fact]
    public void Yukseltme_betigi_salt_okunur_kodunu_ve_bayragini_taniyor()
    {
        var script = ReadUpsellScript();

        script.ShouldContain(PlatformDomainErrorCodes.SubscriptionReadOnly);
        script.ShouldContain(PlatformFeatures.ReadOnly);
    }
```

- [ ] **Step 2: Koş, düştüğünü gör**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/test/apyaReadOnlyUpsell.test.js; cd -
```
Expected: FAIL — `upsell.isReadOnlyError is not a function`.

- [ ] **Step 3: Betik** — `apya-quota-upsell.js`:

(a) `var SUBSCRIPTION_URL = '/Subscription';` satırının ARDINA:
```js

    // SALT OKUNUR HESAP (deneme bitti). Tek kaynak: PlatformDomainErrorCodes.SubscriptionReadOnly
    // ve PlatformFeatures.ReadOnly; ayrışmayı QuotaUpsell_Tests ölçüyor.
    var READ_ONLY_ERROR_CODE = 'Platform:Subscription:ReadOnly';
    var READ_ONLY_FEATURE = 'Platform.ReadOnly';

    // Açılmadan durdurulan pencereler: oluştur / düzenle / içe aktar. Diğerleri (ayrıntı, özet)
    // açılır; içlerinden bir kayıt denenirse sunucu kapısı yine durdurur.
    var BLOCKED_MODAL = /(Create|Edit|Import)Modal$/;

    // Salt okunur hesapta da çalışan alanlar (ReadOnlyAllowedWrites ile aynı kökler).
    var ALLOWED_MODAL_ROOTS = ['/grants/', '/companyprofile/', '/account/', '/subscription/'];

    function isReadOnlyError(error) {
        return !!(error && error.code === READ_ONLY_ERROR_CODE);
    }

    // Bürünen host kapıdan muaf (sunucuyla aynı kural). Bayrağı ABP'nin istemci yapılandırması
    // taşır; host'ta HostFeatureValueProvider onu hiçbir zaman "true" saymaz.
    function isReadOnlyActive() {
        try {
            if (abp.currentUser && abp.currentUser.impersonatorUserId) { return false; }
            return !!(abp.features && abp.features.isEnabled && abp.features.isEnabled(READ_ONLY_FEATURE));
        } catch (e) {
            return false;
        }
    }

    function shouldBlockModal(viewUrl) {
        if (!viewUrl || !isReadOnlyActive()) { return false; }

        var path = String(viewUrl).split('?')[0];
        if (path.charAt(0) !== '/') { path = '/' + path; }

        var lower = path.toLowerCase();
        for (var i = 0; i < ALLOWED_MODAL_ROOTS.length; i++) {
            if (lower.indexOf(ALLOWED_MODAL_ROOTS[i]) === 0) { return false; }
        }
        return BLOCKED_MODAL.test(path);
    }

    function canRenderModal() {
        return typeof $ !== 'undefined' && typeof bootstrap !== 'undefined' && !!bootstrap.Modal;
    }

    function t(key) {
        try {
            return abp.localization.getResource('Platform')(key);
        } catch (e) {
            return key;
        }
    }
```

(b) `window.apya.quotaUpsell = { ... }` nesnesini:
```js
    window.apya.quotaUpsell = {
        isQuotaError: isQuotaError,
        canViewSubscription: canViewSubscription,
        subscriptionUrl: SUBSCRIPTION_URL,
        isReadOnlyError: isReadOnlyError,
        isReadOnlyActive: isReadOnlyActive,
        shouldBlockModal: shouldBlockModal
    };
```
yap.

(c) `abp.ajax.showError = function (error) { ... };` bloğunun TAMAMINI:
```js
    abp.ajax.showError = function (error) {
        var readOnly = isReadOnlyError(error);
        if (!readOnly && !isQuotaError(error)) {
            return originalShowError.apply(this, arguments);
        }

        // Bootstrap/jQuery beklenmedik şekilde yoksa sessiz kalma — ABP'nin kutusuna dön.
        if (!canRenderModal()) {
            return originalShowError.apply(this, arguments);
        }

        if (readOnly) {
            showReadOnly(error.message || '');
        } else {
            showUpsell(error.message || '');
        }
        // ABP dönen değeri yalnız zincirlemek için kullanıyor; modal kendi yaşam
        // döngüsünü yönetiyor.
        return null;
    };
```
ile değiştir.

(d) `showUpsell` fonksiyonunun kapanışından SONRA, dosyanın son satırı `})();`'nin ÖNÜNE:
```js

    // Salt okunur paket penceresi. Metinler tr.json'dan (ReadOnly:Modal.*); sunucu mesajı
    // geldiyse o basılır. Düğme Paketim'e gider; izni olmayana yalnız yöneticisine başvurması söylenir.
    function showReadOnly(message) {
        var showLink = canViewSubscription();

        var $modal = $(
            '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="ApyaReadOnlyTitle">' +
            '  <div class="modal-dialog modal-dialog-centered" role="document">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <h5 class="modal-title" id="ApyaReadOnlyTitle">' +
            '          <i class="fa fa-lock text-primary me-2"></i><span class="js-readonly-title"></span>' +
            '        </h5>' +
            '        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>' +
            '      </div>' +
            '      <div class="modal-body">' +
            '        <p class="mb-2 js-readonly-message"></p>' +
            '        <p class="text-muted small mb-0 js-readonly-hint"></p>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn btn-outline-secondary js-readonly-close" data-bs-dismiss="modal"></button>' +
            (showLink
                ? '        <a class="btn btn-primary js-readonly-cta" href="' + SUBSCRIPTION_URL + '">' +
                  '          <i class="fa fa-gem me-1"></i><span></span></a>'
                : '') +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>');

        // Metinler .text() ile basılır: sunucu mesajı HTML olarak yorumlanmamalı.
        $modal.find('.js-readonly-title').text(t('ReadOnly:Modal.Title'));
        $modal.find('.js-readonly-message').text(message || t('ReadOnly:Modal.Message'));
        $modal.find('.js-readonly-hint').text(t(showLink ? 'ReadOnly:Modal.HintAdmin' : 'ReadOnly:Modal.HintMember'));
        $modal.find('.js-readonly-close').text(t('ReadOnly:Modal.Close'));
        $modal.find('.btn-close').attr('aria-label', t('ReadOnly:Modal.Close'));
        $modal.find('.js-readonly-cta span').text(t('ReadOnly:Modal.Cta'));

        $modal.appendTo(document.body);
        $modal.on('hidden.bs.modal', function () { $modal.remove(); });

        bootstrap.Modal.getOrCreateInstance($modal[0]).show();
    }

    // Oluştur/düzenle penceresi salt okunur hesapta HİÇ açılmaz: kullanıcı formu doldurup
    // kaydette duvara çarpmasın. Sarmalayıcı yalnız open'a dokunur; karar shouldBlockModal'da.
    // Sayfa betikleri yöneticilerini DOM hazır olunca kurar; bu betik genel demette onlardan önce yüklenir.
    if (abp.ModalManager) {
        var OriginalModalManager = abp.ModalManager;

        abp.ModalManager = function (options) {
            var manager = new OriginalModalManager(options);
            var viewUrl = typeof options === 'string' ? options : (options && options.viewUrl);
            var originalOpen = manager.open;

            manager.open = function () {
                if (shouldBlockModal(viewUrl) && canRenderModal()) {
                    showReadOnly('');
                    return;
                }
                return originalOpen.apply(manager, arguments);
            };

            return manager;
        };
        abp.ModalManager.prototype = OriginalModalManager.prototype;
    }
```

- [ ] **Step 4: Metinler** — `tr.json`, `"TenantManagement:Chip.Trial"` satırının ARDINA (Task 4 yoksa `"Subscription:Host.Notice"` satırının ardına):
```json
        "ReadOnly:Modal.Title": "Bu işlem paket gerektirir",
        "ReadOnly:Modal.Message": "Deneme süreniz bitti. Verilerinizi görmeye ve dışa aktarmaya devam edebilirsiniz; kayıt eklemek, değiştirmek ve silmek için paket seçin.",
        "ReadOnly:Modal.HintAdmin": "Paket seçenekleri ve iletişim bilgileri Paketim ekranında. Hibe takibi bu sürede de açık.",
        "ReadOnly:Modal.HintMember": "Paket için kurumunuzun sistem yöneticisiyle görüşün. Hibe takibi bu sürede de açık.",
        "ReadOnly:Modal.Close": "Kapat",
        "ReadOnly:Modal.Cta": "Paket seçenekleri",
```

- [ ] **Step 5: Koş, geçtiğini gör**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/test/apyaReadOnlyUpsell.test.js src/test/apyaQuotaUpsell.test.js; cd -
bash "$M/parts.sh" web-build "dotnet build test/Apya.Platform.Web.Tests @B" web "dotnet test test/Apya.Platform.Web.Tests --no-build --filter FullyQualifiedName~QuotaUpsell"
```
Expected: vitest iki dosya `passed`; xUnit `Passed!` (mevcut kota testleri dahil).

- [ ] **Step 6: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/js/apya-quota-upsell.js src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json src/Apya.Platform.Web/wwwroot/dynamic-assets/src/test/apyaReadOnlyUpsell.test.js test/Apya.Platform.Web.Tests/Pages/QuotaUpsell_Tests.cs
git commit -F - <<'EOF'
feat(paket): salt okunur hesapta paket penceresi, pencereler açılmadan durur

abp.ajax.showError salt okunur kodunu tanır; oluştur/düzenle/içe aktar
pencereleri açılmak yerine "Bu işlem paket gerektirir" penceresi çıkar.
Hibe ve Kurum Profili pencereleri açık; bürünen host muaf.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 8: Durum servisi, şerit, açıklama sayfası, Paketim

**Files:**
- Create: `src/Apya.Platform.Application.Contracts/Tenants/ReadOnlyStateDto.cs`
- Create: `src/Apya.Platform.Application.Contracts/Tenants/IReadOnlyStateAppService.cs`
- Create: `src/Apya.Platform.Application/Tenants/ReadOnlyStateAppService.cs`
- Create: `src/Apya.Platform.Web/Pages/Shared/Components/ReadOnlyBanner/ReadOnlyBannerViewComponent.cs`
- Create: `src/Apya.Platform.Web/Pages/Shared/Components/ReadOnlyBanner/Default.cshtml`
- Create: `src/Apya.Platform.Web/Pages/Subscription/ReadOnly.cshtml`, `ReadOnly.cshtml.cs`
- Modify: `src/Apya.Platform.Web/Pages/Subscription/Index.cshtml`, `Index.cshtml.cs`
- Modify: `src/Apya.Platform.Web/PlatformWebModule.cs`
- Modify: `src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json`
- Test: `test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/ReadOnlyState_Tests.cs` (yeni)
- Test: `test/Apya.Platform.Web.Tests/Pages/SubscriptionPage_Tests.cs`

**Interfaces:**
- Consumes: `PlatformFeatures.ReadOnly` (Task 1), `TenantSubscriptionManager.GetLatestEndedTrialOrNullAsync` (Task 2), `ReadOnlyRequestPolicy.ExplanationPath` (Task 5).
- Produces: `IReadOnlyStateAppService.GetAsync() : Task<ReadOnlyStateDto>` (`[Authorize]`, izin istemez); `ReadOnlyStateDto { bool IsReadOnly; DateTime? TrialEndedOn; }`.

- [ ] **Step 1: Failing testler**

`test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/ReadOnlyState_Tests.cs`:
```csharp
using System;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// Şeridin ve Paketim'in okuduğu durum: açık hesapta boş, deneme bitince tarihli, host elle
/// kilitlediyse tarihsiz; host bağlamında hiçbir zaman salt okunur değil.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ReadOnlyState_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IReadOnlyStateAppService _readOnlyState;
    private readonly TenantPackageManager _packageManager;
    private readonly IRepository<TenantSubscription, Guid> _subscriptionRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public ReadOnlyState_Tests()
    {
        _readOnlyState = GetRequiredService<IReadOnlyStateAppService>();
        _packageManager = GetRequiredService<TenantPackageManager>();
        _subscriptionRepository = GetRequiredService<IRepository<TenantSubscription, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
    }

    private async Task<ReadOnlyStateDto> GetInTenantAsync(Guid tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            return await _readOnlyState.GetAsync();
        }
    }

    [Fact]
    public async Task Open_Tenant_Is_Not_ReadOnly()
    {
        var state = await WithUnitOfWorkAsync(() => GetInTenantAsync(Guid.NewGuid()));

        state.IsReadOnly.ShouldBeFalse();
        state.TrialEndedOn.ShouldBeNull();
    }

    [Fact]
    public async Task Ended_Trial_Tenant_Is_ReadOnly_With_Date()
    {
        var tenantId = Guid.NewGuid();
        var trial = TenantSubscription.CreateTrial(
            Guid.NewGuid(), tenantId, PackageCode.Premium, _clock.Now.AddDays(-20), 14);
        trial.Expire(_clock.Now.AddDays(-6));

        await WithUnitOfWorkAsync(async () =>
        {
            await _subscriptionRepository.InsertAsync(trial, autoSave: true);
            await _packageManager.SetReadOnlyAsync(tenantId, true);
        });

        var state = await WithUnitOfWorkAsync(() => GetInTenantAsync(tenantId));

        state.IsReadOnly.ShouldBeTrue();
        state.TrialEndedOn.ShouldBe(trial.EndDate);
    }

    [Fact]
    public async Task Host_Locked_Tenant_Is_ReadOnly_Without_Date()
    {
        var tenantId = Guid.NewGuid();
        await WithUnitOfWorkAsync(() => _packageManager.SetReadOnlyAsync(tenantId, true));

        var state = await WithUnitOfWorkAsync(() => GetInTenantAsync(tenantId));

        state.IsReadOnly.ShouldBeTrue();
        state.TrialEndedOn.ShouldBeNull();
    }

    [Fact]
    public async Task Host_Context_Is_Never_ReadOnly()
    {
        (await WithUnitOfWorkAsync(() => _readOnlyState.GetAsync())).IsReadOnly.ShouldBeFalse();
    }
}
```

`SubscriptionPage_Tests.cs` sınıfının sonuna:
```csharp
    /// <summary>
    /// Salt okunur şeridi host'ta basılmaz; açıklama sayfası host'ta da patlamadan açılır
    /// (form yönlendirmesinin hedefi).
    /// </summary>
    [Fact]
    public async Task Salt_okunur_seridi_hostta_yok_aciklama_sayfasi_acilir()
    {
        var page = await GetResponseAsStringAsync("/Subscription");
        page.ShouldNotContain("apya-readonly-bar");

        var explanation = HtmlEntity.DeEntitize(await GetResponseAsStringAsync("/Subscription/ReadOnly"));
        explanation.ShouldContain("Hesabınız açık");
    }
```

- [ ] **Step 2: Koş, düştüğünü gör**

```bash
bash "$M/parts.sh" ef-build "dotnet build test/Apya.Platform.EntityFrameworkCore.Tests @B"
```
Expected: derleme HATASI — `IReadOnlyStateAppService` yok.

- [ ] **Step 3: Sözleşme**

`src/Apya.Platform.Application.Contracts/Tenants/ReadOnlyStateDto.cs`:
```csharp
using System;

namespace Apya.Platform.Tenants;

/// <summary>Hesabın salt okunur durumu — her sayfadaki şerit ve Paketim için.</summary>
public class ReadOnlyStateDto
{
    public bool IsReadOnly { get; set; }

    /// <summary>Kilidi koyan denemenin bitiş tarihi. Host elle kilitlediyse <c>null</c>.</summary>
    public DateTime? TrialEndedOn { get; set; }
}
```

`src/Apya.Platform.Application.Contracts/Tenants/IReadOnlyStateAppService.cs`:
```csharp
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Tenants;

/// <summary>
/// Salt okunur durumu. Paketim'den (TenantSettings izni) AYRI: şerit kurumun HER kullanıcısında
/// görünür, bu yüzden yalnız oturum ister.
/// </summary>
public interface IReadOnlyStateAppService : IApplicationService
{
    Task<ReadOnlyStateDto> GetAsync();
}
```

- [ ] **Step 4: Servis** — `src/Apya.Platform.Application/Tenants/ReadOnlyStateAppService.cs`:
```csharp
using System.Threading.Tasks;
using Apya.Platform.Features;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Features;

namespace Apya.Platform.Tenants;

/// <inheritdoc cref="IReadOnlyStateAppService"/>
[Authorize]
public class ReadOnlyStateAppService : PlatformAppService, IReadOnlyStateAppService
{
    private readonly IFeatureChecker _featureChecker;
    private readonly TenantSubscriptionManager _subscriptionManager;

    public ReadOnlyStateAppService(IFeatureChecker featureChecker, TenantSubscriptionManager subscriptionManager)
    {
        _featureChecker = featureChecker;
        _subscriptionManager = subscriptionManager;
    }

    public async Task<ReadOnlyStateDto> GetAsync()
    {
        var tenantId = CurrentTenant.Id;
        if (tenantId == null || !await _featureChecker.IsEnabledAsync(PlatformFeatures.ReadOnly))
        {
            return new ReadOnlyStateDto();
        }

        // Abonelik satırları host-side'dır (MySubscriptionAppService ile aynı okuma).
        TenantSubscription? trial;
        using (CurrentTenant.Change(null))
        {
            trial = await _subscriptionManager.GetLatestEndedTrialOrNullAsync(tenantId.Value);
        }

        return new ReadOnlyStateDto
        {
            IsReadOnly = true,
            TrialEndedOn = trial?.EndDate
        };
    }
}
```

- [ ] **Step 5: Şerit**

`src/Apya.Platform.Web/Pages/Shared/Components/ReadOnlyBanner/ReadOnlyBannerViewComponent.cs`:
```csharp
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Components.ReadOnlyBanner;

/// <summary>
/// Salt okunur hesap şeridi — <c>LayoutHooks.Body.First</c> ile her sayfaya, bürünme şeridinin
/// ardından. Oturumsuz sayfalarda (giriş) ve host'ta hiçbir şey basmaz: uç <c>[Authorize]</c>
/// olduğu için önce bakılır. Bürünen host da görür (kapıdan muaf olsa da durumu bilmeli).
/// </summary>
public class ReadOnlyBannerViewComponent : AbpViewComponent
{
    private readonly ICurrentUser _currentUser;
    private readonly ICurrentTenant _currentTenant;
    private readonly IReadOnlyStateAppService _readOnlyState;

    public ReadOnlyBannerViewComponent(
        ICurrentUser currentUser,
        ICurrentTenant currentTenant,
        IReadOnlyStateAppService readOnlyState)
    {
        _currentUser = currentUser;
        _currentTenant = currentTenant;
        _readOnlyState = readOnlyState;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        if (!_currentUser.IsAuthenticated || _currentTenant.Id == null)
        {
            return Content(string.Empty);
        }

        var state = await _readOnlyState.GetAsync();
        return state.IsReadOnly ? View(state) : Content(string.Empty);
    }
}
```

`src/Apya.Platform.Web/Pages/Shared/Components/ReadOnlyBanner/Default.cshtml`:
```cshtml
@model Apya.Platform.Tenants.ReadOnlyStateDto
@inject Microsoft.Extensions.Localization.IStringLocalizer<Apya.Platform.Localization.PlatformResource> L
@inject Volo.Abp.Authorization.Permissions.IPermissionChecker PermissionChecker
@{
    var canViewSubscription = await PermissionChecker.IsGrantedAsync(
        Apya.Platform.Permissions.PlatformPermissions.TenantSettings.Default);
}

<div class="apya-readonly-bar" role="status">
    <i class="fa fa-lock me-2"></i>
    @if (Model.TrialEndedOn.HasValue)
    {
        @L["ReadOnly:Banner.TrialEnded", Model.TrialEndedOn.Value.ToString("dd.MM.yyyy")]
    }
    else
    {
        @L["ReadOnly:Banner.Locked"]
    }

    @if (canViewSubscription)
    {
        <a class="btn btn-sm btn-primary ms-3" href="/Subscription">@L["ReadOnly:Banner.Cta"]</a>
    }
    else
    {
        <span class="ms-2">@L["ReadOnly:Banner.AskAdmin"]</span>
    }
</div>

<style>
    /* Bürünme şeridiyle aynı formül (soft zemin + tonlu metin); ayrım ikon ve metinle. */
    .apya-readonly-bar {
        position: relative;
        z-index: var(--apya-z-sticky);
        margin: 0;
        padding: var(--apya-space-3) var(--apya-space-4);
        text-align: center;
        font-size: 13px;
        font-weight: var(--apya-weight-medium);
        background: color-mix(in srgb, var(--apya-warning-500) 20%, var(--apya-surface-base));
        color: var(--apya-text-warning);
        border-bottom: 2px solid var(--apya-warning-500);
    }
</style>
```

`PlatformWebModule.cs`, şu satırın ARDINA:
```csharp
            options.Add(Volo.Abp.Ui.LayoutHooks.LayoutHooks.Body.First, typeof(Apya.Platform.Web.Components.ImpersonationAlert.ImpersonationAlertViewComponent));
```
eklenecek:
```csharp
            // Salt okunur hesap şeridi — bürünme şeridinin ARDINDAN (ikisi birlikte görünebilir).
            options.Add(Volo.Abp.Ui.LayoutHooks.LayoutHooks.Body.First, typeof(Apya.Platform.Web.Components.ReadOnlyBanner.ReadOnlyBannerViewComponent));
```

- [ ] **Step 6: Açıklama sayfası**

`src/Apya.Platform.Web/Pages/Subscription/ReadOnly.cshtml.cs`:
```csharp
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Subscription;

/// <summary>
/// Salt okunur hesapta KLASİK form gönderiminin yönlendirildiği sayfa
/// (<c>ReadOnlyRequestPolicy.ExplanationPath</c>). Paketim'in aksine yalnız oturum ister:
/// izni olmayan kullanıcı da buraya düşer.
/// </summary>
[Authorize]
public class ReadOnlyModel : AbpPageModel
{
    private readonly IReadOnlyStateAppService _readOnlyState;

    public ReadOnlyModel(IReadOnlyStateAppService readOnlyState)
    {
        _readOnlyState = readOnlyState;
    }

    public ReadOnlyStateDto State { get; private set; } = new();

    public async Task OnGetAsync()
    {
        State = await _readOnlyState.GetAsync();
    }
}
```

`src/Apya.Platform.Web/Pages/Subscription/ReadOnly.cshtml`:
```cshtml
@page "/Subscription/ReadOnly"
@model Apya.Platform.Web.Pages.Subscription.ReadOnlyModel
@inject Microsoft.Extensions.Localization.IStringLocalizer<Apya.Platform.Localization.PlatformResource> L
@inject Volo.Abp.Authorization.Permissions.IPermissionChecker PermissionChecker
@{
    ViewBag.Title = L["ReadOnly:Page.Title"].Value;
    var canViewSubscription = await PermissionChecker.IsGrantedAsync(
        Apya.Platform.Permissions.PlatformPermissions.TenantSettings.Default);
}

<div class="apya-page--narrow">
    <abp-card>
        <abp-card-body>
            <h2 class="h4"><i class="fa fa-lock me-2"></i>@L["ReadOnly:Page.Title"]</h2>
            <p class="mb-3">
                @(Model.State.IsReadOnly ? L["ReadOnly:Modal.Message"] : L["ReadOnly:Page.NotReadOnly"])
            </p>
            <div class="d-flex flex-wrap gap-2">
                <a class="btn btn-outline-secondary" href="/">@L["ReadOnly:Page.Back"]</a>
                @if (Model.State.IsReadOnly && canViewSubscription)
                {
                    <a class="btn btn-primary" href="/Subscription">@L["ReadOnly:Modal.Cta"]</a>
                }
            </div>
        </abp-card-body>
    </abp-card>
</div>
```

- [ ] **Step 7: Paketim** — `Pages/Subscription/Index.cshtml.cs`:

constructor imzasına `IReadOnlyStateAppService readOnlyStateAppService` parametresini ekle, alanı ata:
```csharp
    private readonly IReadOnlyStateAppService _readOnlyStateAppService;
```
```csharp
        _readOnlyStateAppService = readOnlyStateAppService;
```
özellik (`public MySubscriptionDto Subscription ...` satırının ardına):
```csharp

    /// <summary>Deneme bitti mi / host kilitledi mi — durum rozeti ve uyarı için.</summary>
    public ReadOnlyStateDto ReadOnlyState { get; private set; } = new();
```
`LoadAsync` içinde `Invoices = await _myBillingAppService.GetListAsync();` satırının ardına:
```csharp
        ReadOnlyState = await _readOnlyStateAppService.GetAsync();
```

`Pages/Subscription/Index.cshtml` — durum rozeti zincirinde:
```cshtml
                    @if (sub.IsInGrace)
                    {
```
şuna çevir:
```cshtml
                    @if (Model.ReadOnlyState.IsReadOnly)
                    {
                        @* Deneme bitince yürürlükte satır kalmaz; "Süresiz" demek yanlış olurdu. *@
                        <span class="badge bg-danger fs-6">@L["Subscription:Status.ReadOnly"]</span>
                    }
                    else if (sub.IsInGrace)
                    {
```
ve `@if (sub.IsInGrace && sub.EndDate.HasValue)` satırının ÖNÜNE:
```cshtml
            @if (Model.ReadOnlyState.IsReadOnly)
            {
                <div class="alert alert-danger mt-3 mb-0" role="alert">
                    <i class="fa fa-lock me-2"></i>@L["ReadOnly:Modal.Message"]
                </div>
            }

```

- [ ] **Step 8: Metinler** — `tr.json`, `"ReadOnly:Modal.Cta"` satırının ARDINA:
```json
        "ReadOnly:Banner.TrialEnded": "Deneme süreniz {0} tarihinde bitti. Verileriniz duruyor; kayıt eklemek ve değiştirmek için paket seçin.",
        "ReadOnly:Banner.Locked": "Hesabınız salt okunur. Verilerinizi görebilirsiniz; kayıt eklemek ve değiştirmek için paket seçin.",
        "ReadOnly:Banner.Cta": "Paket seçenekleri",
        "ReadOnly:Banner.AskAdmin": "Paket için kurumunuzun sistem yöneticisiyle görüşün.",
        "ReadOnly:Page.Title": "Hesabınız salt okunur",
        "ReadOnly:Page.NotReadOnly": "Hesabınız açık. Bu sayfaya bir işlemden sonra geldiyseniz işleminizi yeniden deneyin.",
        "ReadOnly:Page.Back": "Genel Bakış'a dön",
        "Subscription:Status.ReadOnly": "Salt okunur",
```

- [ ] **Step 9: Koş, geçtiğini gör**

```bash
bash "$M/parts.sh" ef-build "dotnet build test/Apya.Platform.EntityFrameworkCore.Tests @B" ef "dotnet test test/Apya.Platform.EntityFrameworkCore.Tests --no-build --filter FullyQualifiedName~Tenants" web-build "dotnet build test/Apya.Platform.Web.Tests @B" web "dotnet test test/Apya.Platform.Web.Tests --no-build --filter FullyQualifiedName~SubscriptionPage"
```
Expected: ikisi de `Passed!`.

- [ ] **Step 10: Commit**

```bash
git add src/Apya.Platform.Application.Contracts/Tenants/ReadOnlyStateDto.cs src/Apya.Platform.Application.Contracts/Tenants/IReadOnlyStateAppService.cs src/Apya.Platform.Application/Tenants/ReadOnlyStateAppService.cs src/Apya.Platform.Web/Pages/Shared/Components/ReadOnlyBanner/ReadOnlyBannerViewComponent.cs src/Apya.Platform.Web/Pages/Shared/Components/ReadOnlyBanner/Default.cshtml src/Apya.Platform.Web/Pages/Subscription/ReadOnly.cshtml src/Apya.Platform.Web/Pages/Subscription/ReadOnly.cshtml.cs src/Apya.Platform.Web/Pages/Subscription/Index.cshtml src/Apya.Platform.Web/Pages/Subscription/Index.cshtml.cs src/Apya.Platform.Web/PlatformWebModule.cs src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tenants/ReadOnlyState_Tests.cs test/Apya.Platform.Web.Tests/Pages/SubscriptionPage_Tests.cs
git commit -F - <<'EOF'
feat(paket): salt okunur şeridi, açıklama sayfası ve Paketim durumu

Her sayfada "Deneme süreniz … bitti" şeridi; Paketim "Salt okunur"
rozeti ve uyarısı gösterir; form yönlendirmesi /Subscription/ReadOnly'ye
iner (izinsiz kullanıcıya da açık).

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 9: Zamanlanmış rapor üretimi salt okunur hesabı atlar

**Files:**
- Modify: `src/Apya.Platform.Web/Documents/ScheduledReportWorker.cs`
- Modify: `src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json`

Taranan diğer işler (değişiklik YOK): `IssueTaskAutomationWorker` host'un kendi görevlerini açar; `TcmbDailySyncWorker` kur verisi yazar (görüntüleme için güncel kalmalı); kalanlar bildirim/temizlik işleridir — bildirimler izinli.

- [ ] **Step 1: Değişiklik** — `ScheduledReportWorker.cs`:

using'lere ekle:
```csharp
using Apya.Platform.Features;
using Apya.Platform.Localization;
using Microsoft.Extensions.Localization;
using Volo.Abp.Features;
```
`RunOneAsync` içinde `if (schedule.CreatorId is null) { … }` bloğunun ARDINA:
```csharp

        // Salt okunur hesapta (deneme bitti) zamanlanmış üretim DURUR: çıktı belge olarak kaydedilir,
        // yani yazmadır. Zamanlama silinmez; paket alınınca kaldığı yerden sürer.
        if (schedule.TenantId.HasValue && await IsReadOnlyAsync(services, schedule.TenantId.Value))
        {
            return services.GetRequiredService<IStringLocalizer<PlatformResource>>()["ReadOnly:ScheduledReport.Skipped"].Value;
        }
```
sınıfın sonuna (son `}`'den önce):
```csharp

    private static async Task<bool> IsReadOnlyAsync(IServiceProvider services, Guid tenantId)
    {
        var currentTenant = services.GetRequiredService<ICurrentTenant>();
        var featureChecker = services.GetRequiredService<IFeatureChecker>();

        using (currentTenant.Change(tenantId))
        {
            return await featureChecker.IsEnabledAsync(PlatformFeatures.ReadOnly);
        }
    }
```

- [ ] **Step 2: Metin** — `tr.json`, `"Subscription:Status.ReadOnly"` satırının ARDINA:
```json
        "ReadOnly:ScheduledReport.Skipped": "Hesap salt okunur; zamanlanmış üretim paket alınınca devam eder.",
```

- [ ] **Step 3: Derle**

```bash
bash "$M/parts.sh" web-build "dotnet build src/Apya.Platform.Web @B"
```
Expected: `TAMAM`, hata yok.

- [ ] **Step 4: Commit**

```bash
git add src/Apya.Platform.Web/Documents/ScheduledReportWorker.cs src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json
git commit -F - <<'EOF'
feat(paket): salt okunur hesapta zamanlanmış rapor üretimi durur

Çıktı belge olarak kaydedildiği için yazmadır; zamanlama silinmez,
satıra sebep yazılır ve paket alınınca sürer.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 10: Bütünleşik doğrulama ve tarayıcı QA

**Files:** yok (doğrulama)

- [ ] **Step 1: Çözüm derlemesi**

```bash
bash "$M/parts.sh" sln "dotnet build Apya.Platform.slnx @B"
```
Expected: `TAMAM`, `error` yok.

- [ ] **Step 2: Test parçaları**

```bash
bash "$M/parts.sh" dom "dotnet test test/Apya.Platform.Domain.Tests --no-build" app "dotnet test test/Apya.Platform.Application.Tests --no-build" ef "dotnet test test/Apya.Platform.EntityFrameworkCore.Tests --no-build --filter FullyQualifiedName~Tenants" web "dotnet test test/Apya.Platform.Web.Tests --no-build --filter FullyQualifiedName~ReadOnly|FullyQualifiedName~QuotaUpsell|FullyQualifiedName~SubscriptionPage"
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run; cd -
```
Expected: hepsi `Passed!`; `AbpYuzeyi_Tests` (Domain.Tests içinde) yeşil; vitest tüm dosyalar yeşil. Kırmızı varsa önce bu dalla ilgisini ölç (`git stash` YOK — `git switch main` ile karşılaştır).

- [ ] **Step 3: Tarayıcı QA** — Web'i `ayaga-kaldir` becerisiyle bu worktree'den kaldır (kök checkout'taki 44386'yı DURDURMA; port çakışırsa kullanıcıya sor). Yerel test hesapları: `reference_yerel_test_hesaplari` hafıza notu.

| # | Adım | Beklenen |
|---|---|---|
| 1 | Host `admin` → Kiracı Yönetimi → profilli bir kiracıda "Denemeye al" (Premium, 14) | Bildirim "Deneme başlatıldı"; Paket Bitişi "… · deneme" |
| 2 | Aynı kiracıda "Seçenekler (Features)" → "Salt okunur hesap" aç | Liste rozeti "Salt okunur" |
| 3 | O kiracının bir kullanıcısıyla (e-postayla) gir | Üstte salt okunur şeridi |
| 4 | Görevler → "+ Yeni görev" | Görev penceresi yerine "Bu işlem paket gerektirir" penceresi |
| 5 | Konsolda `apya.platform.tasks.task.create({})` | Aynı pencere; ağda 403 + `Platform:Subscription:ReadOnly` |
| 6 | Hibe → bir çağrıda "İlgileniyorum" | Çalışır (izinli) |
| 7 | Bir listede Excel dışa aktar | İner (K4) |
| 8 | Bildirimi okundu işaretle, menüde sabitleme yap | Çalışır |
| 9 | Kurumsal Veriler → "Belgeden doldur" ile yükle | Paket penceresi / açıklama sayfası |
| 10 | Host olarak bürün → aynı kiracıda görev oluştur | Oluşur (muaf) |
| 11 | Koyu tema + 375 px'te şerit | Taşma yok, okunur |
| 12 | Host → "Paket Değiştir" (Standard, 1 Yıl) | Şerit kalkar, görev oluşturma açılır |

QA'da bırakılan veriyi (açılan deneme, bayrak) eski hâline al ve kullanıcıya bildir.

- [ ] **Step 4: yarn.lock** — `git status --short`'ta `yarn.lock` görünürse `git checkout -- src/Apya.Platform.Web/wwwroot/dynamic-assets/yarn.lock`.

- [ ] **Step 5: PR-2** — kullanıcıya push + PR onayı sor (`gh pr list --state open --limit 10` ile mükerrer tara). PR gövdesinde: sapmalar listesi, QA tablosu sonucu, **migration YOK**, canlıda DbMigrator GEREKMEZ (yeni izin yok; feature tanımı koddan okunur).

- [ ] **Step 6: Sürüm notu kararı** — Faz 1 müşteriye doğrudan görünmez (yalnız host deneme verdiğinde); sürüm notu maddesi gerekip gerekmediğini kullanıcıya sor.
