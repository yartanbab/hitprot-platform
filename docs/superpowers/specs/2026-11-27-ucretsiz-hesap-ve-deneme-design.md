# Ücretsiz hibe hesabı, süreli deneme ve satış yönlendirmeleri — tasarım

**Tarih:** 2026-11-26/27 · **Durum:** Onaylandı (8 bölüm), uygulama planı bekliyor
**Model:** C · Hibrit — ücretsiz hibe hesabı kalıcı taban + isteğe bağlı süreli tam deneme

## 1. Amaç

Firmaların APYA Platform'u satın almadan tanımasını ve satın alma kararına sistemin kendi
ekranlarından yönlenmesini sağlamak:

- Herkes ücretsiz hesap açar, kurum bilgilerini girer, kendisine uygun hibeleri görür.
  Hibe takibi, Makro'nun hibe kartları ve "İlgileniyorum" tamamen açıktır.
- İsteyen firma ürünün tamamını süreli dener. Süre bitince giriş yapar, denemede girdiği
  veriyi görür ama işlem yapamaz; işlem denemesi paket talebine yönlenir.
- Paket ve danışmanlık satın alma, mevcut "talep → host onayı → protokol → fatura" hattından
  geçer; tek fark hesabın yeniden açılmayıp **yerinde yükseltilmesidir**.

## 2. Kararlar

| # | Konu | Karar |
|---|---|---|
| K1 | Model | C · Hibrit (ücretsiz taban + süreli tam deneme) |
| K2 | Ücretsiz planda kullanıcı | 1 (ikincisinde mevcut kota duvarı paket talebine yönlendirir) |
| K3 | Denemeyi kim başlatır | Firma hesap başına bir kez + host istediği zaman |
| K4 | Deneme bitince dışa aktarma / indirme | Açık kalır; yalnız yazma kapalı |
| K5 | Yazma engeli mekanizması | Web katmanında tek sunucu kapısı (middleware) + izinli işlemler listesi |
| K6 | Host bürünmesi | Kapıdan muaf |
| K7 | Profil sihirbazı | Atlanabilir ¹ |
| K8 | Yönlendirme haritası | Bölüm 6'daki haliyle ¹ |
| K9 | Talep türü | `RegistrationRequests.Kind` açık kolonu (Yeni / Yükseltme) — çift migration |
| K10 | Yükseltmede protokol onayı | Oturum içinde (`/Subscription/Protokol`), jetonsuz, şifre adımsız |
| K11 | Ücretsiz kayıtta doğrulama | Hesap anında açılır; ilgi / görüşme / paket talebi doğrulanmış e-posta ister; 7 gün doğrulanmayan hesap pasife alınır |
| K12 | Giriş ekranında sunum | Kayıt sihirbazının paket kartlarında ilk kart "Ücretsiz Hibe Hesabı" |
| K13 | Danışmanlık lisanssız satılabilir mi | Evet — yeni satış planı "Yalnız Danışmanlık" (teknik paket Ücretsiz kalır) |
| K14 | İmzasız ücretsiz/deneme firmasında "Başvuruyu başlat" | Durur; yerine "Protokol gönder" (eski ücretli müşteriler etkilenmez) |

¹ Tasarım görüşmesinde yönlendirme haritası sorusu oturum kesilmesiyle yanıtsız kaldı;
kullanıcı "devam" dedi ve önerilen seçenekle ilerlendi. Kullanıcı değiştirmek isterse bu
iki satır güncellenir.

## 3. Mevcut durum — tasarımı belirleyen ölçümler

1. **Kayıt akışı mevcut kullanıcıyı geri çevirir.** `RegistrationRequestManager.CreateAsync`
   sistemde hesabı olan e-postayı `RegistrationRequestEmailAlreadyRegistered` ile reddeder
   (`src/Apya.Platform.Domain/RegistrationRequests/RegistrationRequestManager.cs:132`);
   `ProtocolApprovalAppService.ApproveAsync` de `CheckNotRegisteredAsync` çağırır ve
   `TenantProvisioner` ile **yeni** kiracı açar. Demo/ücretsiz kullanıcı bu yoldan geçemez,
   geçse verisi yeni hesaba taşınmaz → yükseltme dalı şart.
2. **Süre dolunca Basic'e düşülür, salt okunur kavramı yok.** `SubscriptionExpiryProcessor`
   dolan aboneliği Basic'e indirir; Basic'te proje/görev/finans yazma açık.
   `SubscriptionSource.Trial = 4` tanımlı, hiç kullanılmıyor.
3. **Hibe eşleştirme kural tabanlı ve canlı hesaplanır** (`GrantMatchManager`, kalıcılık
   yok, yapay zekâ yok) → ücretsiz hesapta maliyetsiz. Yapay zekâ maliyetli kısım
   "Belgeden doldur" (`/CompanyProfile/DataImport`).
4. **Kamuya açık huni var:** `/Hibeler` (sunucu render arama) → `/Hibeler/Detay`
   (uygunluk testi, e-posta duvarı yok) → `GrantLead` → `/Hibeler/Randevu` → host
   "Ön Değerlendirme Talepleri" → `GrantLeadAppService.ConvertToTenantAsync`.
5. **Danışmanlık hattı var:** kiracı başvuru açamaz; `GrantInterest` ("İlgileniyorum") +
   `GrantMeetingProposal` (firma üç saat önerir) → host inceler, başvuruyu başlatır.
   Protokol lisans bedeli + başarı primini (`ServiceAgreementConsts.DefaultSuccessFeePercent = 12`)
   birlikte bağlar.
6. **Kilitli modül görünmez.** Menü (`PlatformNavigationResolver`) ve `MacroCatalog`
   izinsiz öğeyi basmaz.
7. **Yönlendirme altyapısı var:** `/Subscription` (Paketim, `TenantSettings.Default`),
   `apya-quota-upsell.js` (`abp.ajax.showError` sarmalayıcısı, `PackageQuotaErrorCodes`),
   host iletişim kanalı ayarları `Subscription.UpgradeContactEmail/Phone/Url`.
8. **Paket sıralaması enum sayısına bağlı:** `MySubscriptionAppService.cs:205`
   `Enum.GetValues<PackageCode>().Where(c => c > currentCode)`.
9. **Varsayılan izin tavanı** (`PackagePermissionDefaults.IsIncluded`) = "kapalı feature'ların
   arkası hariç hepsi"; Proje/Görev hiçbir feature'a bağlı değil.
10. **ABP yüzeyi:** gereken ad alanları (`Volo.Abp.Features`, `Volo.Abp.MultiTenancy`,
    `Volo.Abp.Users`, `Volo.Abp.Settings`) `docs/abp-cikis/izinli-yuzey.txt`'te var; yeni
    `Volo.*` gerekmiyor.

## 4. Hesap durumları

**Ücretsiz** (kalıcı) → **Deneme** (süreli, ürünün tamamı) → **Deneme bitti** (salt okunur,
süresiz) → **Ücretli** (protokolle).

| Alan | Ücretsiz | Deneme (vars. 14 gün) | Deneme bitti | Ücretli |
|---|---|---|---|---|
| Hibe: Bugün, Fırsatlar, eşleşme puanı, çağrı detayı, takibe alma | Açık | Açık | Açık | Açık |
| "İlgileniyorum", "Fikrimi paylaş" | Açık ² | Açık | Açık | Açık |
| Başvurularım, sihirbaz, evrak, itiraz (danışman başlattıysa) | Açık | Açık | Açık | Açık |
| Kurum Profili, Kurumsal Veriler (elle) | Açık | Açık | Açık | Açık |
| Belgeden doldur (yapay zekâ) | Kilitli → tanıtım | Açık | Kilitli → paket | Pakete göre |
| Makro | Hibe kartları açık, diğerleri kilitli kart | Tamamı | Tamamı görünür, işlem → paket | Pakete göre |
| Projeler, Panolar/Görevler, Takvim | Tanıtım sayfası | Açık | Salt okunur | Pakete göre |
| Finans Merkezi, Belgeler, Formlar | Tanıtım sayfası | Açık | Salt okunur | Pakete göre |
| Kullanıcı sayısı | 1 | Paket kotası | Var olanlar girer, yeni eklenemez | Paket kotası |
| Excel/PDF dışa aktarma, belge indirme | — | Açık | Açık (K4) | Pakete göre |

² Ücretsiz hesapta doğrulanmış e-posta ister (K11).

- **Tanıtım sayfası:** kilit simgeli menü öğesi / Makro kartı → modülün ne işe yaradığı,
  ekran görüntüsü, "Paketleri gör" ve (kullanılmadıysa) "14 gün ücretsiz dene".
- **Deneme bitti süresizdir:** ikinci zamanlayıcı yok, veri silinmez; paket alınınca
  kilit kalkar.
- **Başvuru satırı ücretsizde açık:** başvuruyu yalnız danışman açar; başvuru varsa
  danışmanlık satılmıştır (K13/K14). Danışmanlık müşterisi lisans almadan çalışır.

## 5. Salt okunur kip

### 5.1 Bayrak
- Kiracı feature'ı **`Platform.ReadOnly`** (bool, varsayılan `false`), `AbpFeatureValues`'ta
  → **şemasız**. `PackageFeatureGates.Map`'e GİRMEZ (izin kapısı değil).
- `PackageDefinitions`'ta **her paket** `Platform.ReadOnly = "false"` yazar →
  `TenantPackageManager.ApplyPackageAsync` yükseltmede kilidi kendiliğinden kaldırır.
- Host kiracının feature penceresinden elle açıp kapatabilir.

### 5.2 Süre işleyicisi
`SubscriptionExpiryProcessor`, dolan aboneliğin `Source`'una bakar:
- `Trial` → Basic'e İNDİRMEZ; paket aynen kalır, `Platform.ReadOnly = true`, abonelik
  `Expired`, yeni bildirim türü "Deneme süreniz bitti" (derin link `/Subscription`).
- `Manual` / `Payment` / `AutoDowngrade` → bugünkü davranış (Basic) değişmez.
- Uyarılar mevcut `Subscription.WarningDays` ("7,1") ile gelir.

### 5.3 Sunucu kapısı (`ReadOnlyTenantMiddleware`, Web)
Koşul: `CurrentTenant.Id != null` ∧ `Platform.ReadOnly` ∧ bürünme YOK (K6) ∧ yol izinli
listede değil.

| İstek | Davranış |
|---|---|
| GET / HEAD / OPTIONS | Geçer (dışa aktarma ve indirme dahil, K4) |
| GET `…/CreateModal`, `…/EditModal` | Pencere yerine "Bu işlem paket gerektirir" penceresinin kısmi görünümü döner (ABP ModalManager onu gösterir) |
| AJAX yazma (POST/PUT/PATCH/DELETE) | 403 + ABP hata gövdesi, kod `Platform:Subscription:ReadOnly` |
| Klasik form POST | `302 /Subscription?readonly=1` |

- **İzinli yazmalar** tek kaynakta (`ReadOnlyAllowedWrites`, Domain.Shared — sunucu↔istemci
  sözleşmesi): çıkış, şifre/profil, bildirim okundu ve tercihleri, menü düzeni / sabitleme /
  kayıtlı görünüm, hibe firma işlemleri (ilgi, görüşme önerisi, takip, fikir, gerekçeli
  kapatma, sihirbaz, evrak, itiraz), Kurum Profili ve Kurumsal Veriler (elle), paket talebi
  ve protokol onayı, geri bildirim, onay kayıtları.
- Test, listedeki her girdinin gerçek bir uç/sayfaya karşılık geldiğini ölçer
  (`QuotaUpsell_Tests` deseni) — yeniden adlandırma kapıyı sessizce bozamaz.
- **Arka plan işleri** kapıdan geçmez: kiracı adına kayıt üreten işler (uygulama planında
  tek tek listelenecek) `Platform.ReadOnly` kiracıyı atlar.

### 5.4 İstemci
- `apya-quota-upsell.js` genelleşir: `Platform:Subscription:ReadOnly` kodunu da tanır,
  aynı pencereyi farklı metinle açar. Düğmeler: "Paket talep et", "Danışmanla görüş".
  İzni olmayan kullanıcıya bugünkü gibi yalnız "Kurum yöneticiniz paket talep edebilir".
- Kalıcı şerit (layout bileşeni): "Deneme süreniz {tarih}'te bitti. Verileriniz duruyor;
  işlem yapmak için paket seçin. [Paket talep et]".

## 6. Yönlendirme haritası

Hedefler: **Paket talep et** (§7) · **Danışmanla görüş** (§9) · **14 gün dene** (hesap başına
bir kez; kullanıldıysa hiçbir yerde basılmaz). Oturumlu kullanıcının "kayıt ekranı" paket
talebidir; `/Account/RegistrationRequest`'e yönlendirilmez.

**İlke:** Ücretsiz hesapta sürekli şerit yok; yönlendirme yalnız kullanıcı kilitli bir şeye
uzandığında ya da hibede anlamlı bir anda çıkar.

### 6.1 Ücretsiz hesap

| # | Yer | Tetik | Görünen | Hedef |
|---|---|---|---|---|
| 1 | İlk giriş | Kayıt sonrası | 3 adımlı profil sihirbazı (tür/il/sektör · ölçek/çalışan/ciro · hedefler), atlanabilir (K7); sonuç ekranı "14 programa uygunsunuz, 9'u koşullu" | Danışman · Fırsatlar |
| 2 | Bugün | Profil eksik | "Profiliniz %55 — tamamlarsanız 9 koşullu programın durumu netleşir" (mevcut doluluk hesabı) | Kurumsal Veriler |
| 3 | Bugün | Uygun çağrının kapanmasına < 14 gün | Kartta "Başvuru için ~X gün hazırlık gerekir" | Danışman |
| 4 | Fırsatlar | Koşullu satır | "Neden koşullu?": eksik bilgi → Kurumsal Veriler; giderilebilir şart (ör. kamu borcu) → "Danışman desteği al" | Kurumsal Veriler / Danışman |
| 5 | Çağrı detayı | Her zaman | Ana düğme "İlgileniyorum"; onayda "Danışmanımız 1 iş günü içinde dönecek" | Danışmanlık talebi |
| 6 | Başvurularım | Boş liste | "Başvurularınızı uzman danışmanla hazırlayın" | Danışman |
| 7 | Menü | Tavan dışı modül | Kilit simgeli öğe (Projeler, Panolar, Takvim, Finans, Belgeler, Formlar) | Tanıtım sayfası |
| 8 | Makro | Tavan dışı kart | Soluk + kilitli kart; tıklayınca tanıtım penceresi | 14 gün dene / Paket |
| 9 | Kurumsal Veriler | "Belgeden doldur" | Yapay zekâ tanıtım penceresi | 14 gün dene / Paket |
| 10 | Kullanıcı ekle | 2. kullanıcı | Mevcut kota duvarı | Paket talep et |
| 11 | Bildirim/e-posta | Yeni uygun çağrı | Mevcut `GrantCallAnnouncer` duyurusu | Çağrı detayı |
| 12 | Avatar menüsü | Her zaman | Kurum adının altında "Ücretsiz plan · Yükselt" | Paketim |
| 13 | Paketim | Her zaman | Plan karşılaştırması (Ücretsiz/Standart/Kurumsal/Ortak/Yalnız Danışmanlık; bedeller `/PackageManagement`'tan) + üç düğme | Üç hedef |

### 6.2 Deneme süresince
- Üst şeritte geri sayım "Denemenin 9 günü kaldı · Paket talep et"; ≤ 3 gün sarı.
- Bildirim 7 ve 1 gün kala + bitiş günü.

### 6.3 Deneme bitti
- Kalıcı şerit (§5.4); her yazma ve her Create/Edit penceresi → paket penceresi.
- Makro kartları görünür, pencere açılacak yerde paket penceresi.
- Hibe tarafı ücretsiz hesaptaki gibi (1–6, 11).

### 6.4 Kaynak anahtarı
Her yönlendirme bir anahtar taşır (`upsell:makro-card:ProjectCreate`,
`upsell:readonly:save`, `grants:call-detail:interest` …). Paket talebine
`RegistrationRequests.SourceKey` olarak yazılır (§7, §11).

## 7. Paket talebi ve yerinde yükseltme

1. **Talep** — "Paket talep et" → `/Subscription/Request` (yetki `TenantSettings.Default`,
   yalnız kurum yöneticisi): plan kartları + bedeller; Kurum Profili'nden önceden dolu unvan,
   vergi no/dairesi, adres, yetkili. Ücretsiz kayıtta sorulmayan alanlar (vergi no, adres)
   burada zorunlu. `RegistrationRequest { Kind = Upgrade, TenantId = mevcut, SourceKey }`.
   Hesap başına tek açık talep.
2. **Host** — `/Admin/RegistrationRequests`'te "Mevcut hesap · {durum}" rozeti + hesaba
   bağlantı. İnceler → onaylar (plan + bedel) → "Protokolü gönder" (`AwaitingProtocol`).
   Firmaya bildirim + Paketim'de "Protokolünüz onayınızı bekliyor" kartı.
3. **Firma** — `/Subscription/Protokol` (oturum içi, K10): aynı renderer'ın metni, iki onay
   kutusu, şifre adımı yok. Yetki: oturum + `request.TenantId == CurrentTenant.Id` +
   `Kind == Upgrade` + `AwaitingProtocol`. Onayda:
   `ServiceAgreement` + iki `ConsentRecord` → `ApplyPackageAsync(SalesPlanCatalog.ToPackageCode(plan))`
   → yıllık abonelik (`Manual`; deneme aboneliği `Superseded`) → `Platform.ReadOnly = false`
   → `request.CompleteWithTenant(mevcutId)` → host'a bildirim.
4. **Fatura** — mevcut `/Admin/Billing`, değişmez.

**Kurallar**
- `RegisteredEmailChecker` yükseltme dalında çalışmaz (e-posta aynı hesaba ait).
- Vergi no tekilliği (`TenantProfileManager`) yükseltilen hesabın kendisini hariç tutar.
- Ücretsiz kayıt vergi no İSTEMEZ → başkasının vergi numarasıyla hesap açıp o firmayı
  engelleme (vergi no işgali) mümkün değil; tekillik paket talebinde denetlenir.
- Paketim talep izi: Talep alındı → İnceleniyor → Protokol onayınızda → Paketiniz açıldı.
  Ret: "Talebiniz sonuçlanmadı, danışmanınız sizinle iletişime geçecek" (iç not gösterilmez).
- Deneme, talep beklerken biterse hesap salt okunur olur; talep ve protokol izinli listede.
  Host "Süreyi uzat" ile köprü kurabilir.
- Ortak Paket: ikinci kurumu host bugünkü gibi elle açar.
- 🔴 Protokol metninde "hesap açılışı" ifadeleri yükseltme bağlamında hukuken kontrol edilmeli.

## 8. Ücretsiz kayıt

**Girişler**
- Kayıt sihirbazının plan adımında ilk kart "Ücretsiz Hibe Hesabı" (K12) → kısa form.
- `/Hibeler/Detay` test sonucu: "Bu sonucu kaydedin, size uygun tüm programları görün" →
  cevaplar sunucuda **TempData** ile taşınır (adres satırına kişisel/kurum verisi konmaz),
  hesap açılınca `ConvertToTenantAsync` ile aynı eşlemeyle firma profiline aktarılır.
  "Danışmanla görüşmek istiyorum" formu yanında kalır.
- Tanıtım sitesi (depo dışı) aynı forma bağlanır.

**Form:** ad soyad, e-posta, şifre, kurum adı, kurum türü, il. Zorunlu: Üyelik Koşulları +
KVKK aydınlatma. İsteğe bağlı ve ayrı: ticari ileti izni (6563). Yeni uygun çağrı bildirimi
hizmet iletisidir; paket/danışmanlık tanıtım e-postaları bu izne bağlıdır. Protokol yok.

**Açılış:** `TenantProvisioner.ProvisionAsync(resolveUniqueName: true)`, `PackageCode.Free`,
`SubscriptionPeriod.Unlimited`; `TenantProfile` (unvan, tür) + `FirmProfile` (il, tür) +
`ConsentRecord`'lar; otomatik oturum → profil sihirbazı. E-posta tekilliğinde formda tek
mesaj (sayım ucu açılmaz).

**Doğrulama (K11):** ABP `EmailConfirmed`. Doğrulanmamış hesap her şeyi görür; ilgi,
görüşme önerisi ve paket talebi doğrulama penceresi açar. 7 gün doğrulanmayan hesabın
tek kullanıcısı pasife alınır (`IdentityUser.IsActive = false`; kiracı silinmez). Doğrulama
bağlantısı oturum istemediği için kullanıcı sonradan da doğrulayabilir; doğrulayınca
kullanıcı yeniden etkinleşir.

**Kötüye kullanım:** host ayarı `Account.FreeSignupEnabled` (vars. **kapalı**), IP başına
günlük kayıt sınırı, görünmez tuzak alanı. CAPTCHA ilk sürümde yok.

🔴 **Ön koşul:** canlıda e-posta gönderimi çalışmıyor (sertifika uyuşmazlığı ölçüldü).
Faz 4a canlıya açılmadan önce düzelmeli.

## 9. Danışmanlık satışı

- **Çağrıdan "İlgileniyorum"** → mevcut `GrantInterest` (+ isteğe bağlı üç saatlik
  `GrantMeetingProposal`). Ücretsizde doğrulanmış e-posta şart.
- **Çağrıdan bağımsız "Danışmanla görüş"** (Paketim, boş Başvurularım, paket penceresi):
  yeni kayıt türü YOK. Pencere firmanın en uygun 3 açık çağrısını "İlgileniyorum"
  düğmeleriyle listeler; eşleşme yoksa "Önce profilinizi tamamlayın" + host iletişim kanalı
  (`Subscription.UpgradeContactEmail/Phone/Url`).
- **Host Talepler › Yanıt bekleyen:** rozetler — hesap durumu (Ücretsiz / Deneme /
  Deneme bitti / Ücretli), eşleşme puanı, profil doluluğu, kapanışa kalan gün.
- **"Başvuruyu başlat" kapısı (K14):** hesap Ücretsiz veya Deneme durumundaysa ve imzalı
  `ServiceAgreement` yoksa düğme durur, yerine "Protokol gönder": onayı önceden verilmiş bir
  yükseltme talebi açar (plan/bedel host seçer) → firma §7.3 ile onaylar → host başlatır.
  `ServiceAgreement` kaydı olmayan **eski ücretli müşteriler etkilenmez**.
- **"Yalnız Danışmanlık" satış planı (K13):** `SalesPlan.ConsultingOnly`;
  `SalesPlanCatalog.ToPackageCode` → `PackageCode.Free` (hibe modülü, sihirbaz, evrak zaten
  açık); lisans bedeli host ayarı `Platform.Pricing.ConsultingPlan` (0 olabilir; tanımsız
  `null` kuralı korunur) + başarı primi. 🔴 Protokolün danışmanlık varyantı hukuk tarafından
  yazılmalı.

## 10. Teknik ayrıntılar

### 10.1 Ücretsiz paket
- `PackageCode.Free = 5` — **0 değil:** 0 enum varsayılanıdır; paket kodu boş gelen bir
  istek sessizce ücretsiz hesap açardı.
- Sıra fonksiyonu (`PackageCodeOrder`): Free < Basic < Standard < Premium < Enterprise.
  `MySubscriptionAppService.cs:205` ve uygulama planında taranacak diğer sayısal
  karşılaştırmalar buna geçer.
- `PackageDefinitions.Free`: Grants true; Finance, Documents, Forms, Calendar, AiAssist,
  MultiCurrency, AdvancedReports, TaskQuickEntry false; MaxUsers 1, MaxProjects 0;
  ReadOnly false.
- **Tavan = açık beyaz liste** (`PackagePermissionDefaults.IsIncluded` Free dalı): hibe
  firma izinleri (`Grants.Default`, `Grants.ManageApplications`), `TenantSettings.Default`,
  Kurum Profili / Kurumsal Veriler izinleri, bildirim ve geri bildirim izinleri. Proje ve
  görev izinleri feature'a bağlı olmadığı için "kapalı feature'ların arkası hariç" kuralı
  burada kullanılamaz. Host ekrandan düzenleyebilir.
- Paket satırı `EnsureDefaultPackagesAsync` ile tohumlanır (yalnız hiç olmayan paket) →
  DbMigrator önerilir.

### 10.2 Kilitli öğe kuralı
Kilit **yalnız paket tavanı izni dışarıda bıraktığında** gösterilir (`PackageCeilingStore`).
Rolünde izin olmayan çalışana "paket satın al" gösterilmez; öğe bugünkü gibi gizli kalır.
Menü ve `MacroCatalog` aynı kuralı tek yardımcıdan okur.

### 10.3 Tanıtım sayfaları
`/Paket/Modul/{anahtar}` (anahtarlar: projects, boards, calendar, finance, documents, forms,
ai). Metin `tr.json`, görsel `wwwroot/images/showcase/` (mevcut CDP ekran görüntüsü yöntemi).

### 10.4 Deneme
- Firma: `MySubscriptionAppService.StartTrialAsync` — hesabın `Source = Trial` aboneliği
  varsa reddedilir; yoksa `Trial` abonelik, `EndDate = şimdi + TrialDays` (kolon var,
  şemasız), `ApplyPackageAsync(TrialPackage)` (yeni açılan modül izinleri yönetici rolüne
  mevcut `GrantNewlyEnabledPermissionsAsync` ile gider).
- Host ayarları: `Subscription.TrialDays` (14), `Subscription.TrialPackage` (Premium —
  yapay zekâ dahil, maliyet doğar).
- Host "Denemeye al": paket + gün; denemesini kullanmış hesaba da verilebilir.

### 10.5 Host ekranları
- Kiracı Yönetimi: durum rozeti (Ücretsiz / Deneme · N gün / Deneme bitti / Ücretli) + süzgeç.
- Kayıt talepleri: tür sütunu (Yeni / Yükseltme) + kaynak anahtarı.
- `/PackageManagement`: ücretsiz kayıt aç/kapa, deneme süresi ve paketi, IP günlük sınırı,
  "Yalnız Danışmanlık" bedeli.

## 11. Şema

| Değişiklik | Faz | Not |
|---|---|---|
| `RegistrationRequests.Kind` (int, vars. 0 = Yeni) | 2 | Eklemeli; mevcut satırlar 0 |
| `RegistrationRequests.SourceKey` (nvarchar(64), null) | 2 | Aynı migration |

Tek eklemeli **çift migration** (SqlServer + Postgres), canlıda DbMigrator. Başka şema yok:
salt okunur bayrağı feature değeri, ayarlar `AbpSettings`, `Free` int kolonda yeni değer,
deneme bitişi mevcut `EndDate`.

## 12. Fazlar ve doğrulama

Her faz bir ya da birkaç PR; hepsi base = main, yığın yok. Sürüm notu ihtiyacı her faz
sonunda ayrıca değerlendirilir (müşteri odaklı; host-only maddeler girmez).

**Faz 0 — kod dışı ön koşullar**
Canlıda e-posta gönderimi · Üyelik Koşulları · KVKK aydınlatma güncellemesi · "Yalnız
Danışmanlık" protokol metni · bedeller · tanıtım ekran görüntüleri.
→ doğrulama: test e-postası canlıdan teslim edildi; metinler kullanıcıdan geldi.

**Faz 1 — Salt okunur kip** (şemasız; sonunda A modeli çalışır)
1. `Platform.ReadOnly` feature + paket tanımları → doğrulama: `ApplyPackageAsync` sonrası değer false (Application testi).
2. Süre işleyicisinin `Trial` dalı + bildirim türü → doğrulama: deneme dolunca paket aynı, ReadOnly true; Manual dolunca Basic (iki test).
3. Host "Denemeye al" (gün bazlı) → doğrulama: EF testi + host ekranında satır.
4. `ReadOnlyTenantMiddleware` + `ReadOnlyAllowedWrites` → doğrulama: Web testleri — POST 403 + kod, GET geçer, izinli yol geçer, bürünme geçer, CreateModal → paket penceresi; liste↔uç eşleşme testi.
5. `apya-quota-upsell.js` genelleşmesi + şerit → doğrulama: vitest karar yüzeyi + tarayıcıda gerçek oturumla deneme.
6. Arka plan işlerinin listesi ve ReadOnly atlaması → doğrulama: ilgili işçi testleri.

**Faz 2 — Paket talebi ve yerinde yükseltme** (çift migration)
1. `Kind` + `SourceKey` migration → doğrulama: iki sağlayıcıda `has-pending-model-changes` temiz.
2. `/Subscription/Request` + tek açık talep kuralı → doğrulama: EF testi (ikinci talep reddedilir).
3. Host rozetleri + "Protokolü gönder" → doğrulama: sayfa testi.
4. `/Subscription/Protokol` + `ApproveAsync` yükseltme dalı → doğrulama: yeni kiracı AÇILMAZ, paket uygulanır, ReadOnly kalkar, e-posta kapısı atlanır, vergi no kendini hariç tutar (EF testleri).
5. Paketim talep izi → doğrulama: sayfa testi + tarayıcı.

**Faz 3 — Ücretsiz paket ve tanıtım** (şemasız)
1. `PackageCode.Free` + `PackageCodeOrder` + tanım + beyaz liste tavan → doğrulama: üst paket kartları doğru sırada; tavan yalnız listedekiler (Application testleri).
2. Kilitli öğe kuralı (menü + Makro) → doğrulama: tavan dışı = kilitli, rol eksik = gizli (iki test).
3. Tanıtım sayfaları → doğrulama: sayfa testi + iki tema / 375 px tarayıcı ölçümü.
4. "14 gün dene" (bir kez) + ayarlar → doğrulama: ikinci deneme reddedilir.
5. Paketim plan karşılaştırması + avatar rozeti → doğrulama: tarayıcı.

**Faz 4a — Firmanın kendi açtığı ücretsiz kayıt** (şemasız; ayar kapalı başlar)
Plan kartı + kısa form + `TenantProvisioner(Free)` + onay kayıtları + e-posta doğrulaması ve
doğrulama kapıları + 7 gün kuralı + IP sınırı + tuzak alan.
→ doğrulama: kayıt uçtan uca (geçici DB), mükerrer e-postada tek mesaj, doğrulanmamış
hesapta ilgi talebi reddi, ayar kapalıyken "Ücretsiz Hibe Hesabı" kartı basılmaz ve
form ucu 404 döner.

**Faz 4b — Karşılama ve hibe yönlendirmeleri** (şemasız)
Profil sihirbazı + sonuç ekranı + Bugün doluluk çubuğu + "Neden koşullu?" + `/Hibeler`
testinden ücretsiz kayda geçiş (TempData).
→ doğrulama: test cevapları firma profiline aktarıldı; tarayıcıda akış.

**Faz 5 — Danışmanlık** (şemasız)
`SalesPlan.ConsultingOnly` + bedel ayarı + protokol varyantı (metin gelince) + "Başvuruyu
başlat" kapısı + Talepler rozetleri + "Danışmanla görüş" penceresi.
→ doğrulama: imzasız ücretsiz hesapta başlatma durur, `ServiceAgreement`'sız eski ücretli
müşteride durmaz (iki test).

**Faz 6 — Ölçüm** (şemasız)
Kaynak anahtarına göre dönüşüm raporu (kayıt → profil ≥ %60 → ilgi → talep → protokol) +
uzun süredir girişsiz ücretsiz hesap raporu.

## 13. Riskler

- **İzinli liste kayması:** yeni bir firma-tarafı hibe ucu eklenip listeye yazılmazsa salt
  okunur hesapta çalışmaz → liste↔uç testi + kod yorumunda uyarı.
- **Arka plan işleri:** HTTP kapısından geçmez; kiracı adına yazan işler tek tek ele alınmalı.
- **Kiracı sayısı:** her ücretsiz kayıt bir kiracı; tüm kiracıları dolaşan işçilerin yükü
  büyür. Faz 6 raporu + ileride silme/pasifleştirme politikası (KVKK saklama).
- **Deneme maliyeti:** Premium denemede yapay zekâ açık; `TrialPackage` ayarıyla yönetilir.
- **Sayısal paket karşılaştırmaları:** `Free = 5` yalnız sıra fonksiyonu kullanan yerlerde
  güvenli; Faz 3'te tüm `PackageCode` karşılaştırmaları taranır.
- **Hukuki metinler:** Faz 4a (Üyelik Koşulları, KVKK) ve Faz 5 (danışmanlık varyantı) metin
  gelmeden canlıya açılmaz.
- **Paket kotası ↔ protokol çelişkisi** (Standart: kodda 10/25, protokolde 2/2) bu işte
  çözülmez; yükseltme mevcut `ToPackageCode` eşlemesini kullanır.

## 14. Kapsam dışı / ayrıca bakılacak

- `GrantLeadAppService.ConvertToTenantAsync` kiracıyı `TenantProvisioner` yerine doğrudan
  `TenantManager.CreateAsync` ile açıyor: yönetici kullanıcı, `TenantProfile` (paket) ve
  abonelik yazılmıyor görünüyor → dönüştürülen firma giriş yapamayabilir. Bu tasarımdan
  bağımsız düzeltilmeli; Faz 4b'deki TempData eşlemesi aynı alan eşlemesini kullanır.
- Ödeme altyapısı (`AutoRenew`, `ExternalReference` kancaları) — bu tasarımda yok.
- Uygulama içi canlı destek / sohbet — yok.
