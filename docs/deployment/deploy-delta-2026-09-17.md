# Deploy delta — 2026-09-17 (`d8a01af6` → `1db6556d`)

Canlıda koşan kod **`d8a01af6`** (2026-09-14 gece paketi `337eaf55`; 17 Eylül'de beş dosyada
blob'la yeniden ölçüldü). Bu paket onun üzerine gelir.

Paket: `Apya-Yayin-1db6556d.zip` + `Apya-DbMigrator-1db6556d.zip` (`Masaüstü\Apya-Yayin-2026-09-17\`).

> Paket **main `1db6556d`** commit'inden üretildi (`claude/yayin-2026-09-17` dalı o an main ile aynı
> noktadaydı). Bu delta belgesi paketten SONRA aynı dala eklendi; belge commit'i `src/` ağacını
> değiştirmez, paket yeniden üretilmez.

## Taban nasıl ölçüldü — 2026-09-17 10:07

Sunucudan beş statik dosya indirilip `git hash-object` ile ağaçlarda arandı:

| Canlıdaki dosya | Canlı blob | `d8a01af6` | main |
|---|---|---|---|
| `css/apya-theme-bridge.css` | `c52ef508` | ✅ aynı | farklı |
| `Pages/Grants/Detail.js` | `6035efaa` | ✅ aynı | farklı |
| `Pages/Grants/Shared.css` | `72a5e562` | ✅ aynı | farklı |
| `css/apya-shell.css` | `ce7baefa` | ✅ aynı | ✅ aynı (bu turda değişmedi) |
| `Pages/Grants/Journey.js` | `226730a1` | ✅ aynı | farklı |

Ek kanıt: `Pages/Grants/Ideas.js`, `IdeaForm.js` ve `Requests.js` canlıda **302** — dosya yok.
`/health/ready` **200** (35,8 sn, soğuk başlangıç).

🔑 Sonuç: 2026-09-14 gece paketi canlıda duruyor, sonraki on bir commit inmedi.

## Ne iniyor

**12 commit** (PR #409 → #420). Müşterinin göreceği başlıklar:

| Alan | Değişiklik |
|---|---|
| Hibe · program bilgisi | Çağrı detayında programın **amacı, öncelikleri, uygun başvuru sahipleri** ve **asgari–azami destek aralığı** görünüyor (#409, migration aşağıda). Asgari tutar girilmemişse eski "azami" gösterimi korunur. |
| Hibe · Fikir Havuzu | Firma, uygun bir çağrı açılmasını beklemeden **proje fikrini paylaşabiliyor** (`/Grants/Idea`): aynı dokuz soruluk form, çağrı seçimi yok. Havuzdaki fikir talep sayılmaz; Taleplerim ve yanıt süresi işlemez. Hibe Yolculuğum'da "havuza bırakıldı" satırı görünür (#414, migration aşağıda). |
| Hibe · eşleşme | Danışman havuzdaki fikri bir çağrıyla **tek tıkla ilişkilendirince** fikir talebe dönüşüyor ve firmaya bildirim gidiyor ("fikrinize uygun çağrı açıldı"). Eşleşme puanı fikir metni ve firma profilinden anlık hesaplanır, kayıt tutulmaz (#416). |
| Hibe · fikir daveti | Danışman firmaları **proje fikrini paylaşmaya davet edebiliyor**; davet uygulama içi bildirim olarak, seçilirse e-posta olarak gider. Yanıtlamayan firmaya **bir kez** hatırlatma gider. Firma bildirimden doğrudan fikir formuna ya da çağrı detayına düşer (#418, migration aşağıda). |
| Görünüm | Seçili onay kutusu, radyo ve anahtarlar uygulama genelinde **kurum rengiyle** (çivit) çiziliyor; tema pembesi kalktı. Hibe formundaki "Konsorsiyum ortağınız var mı?" başlığı diğer soru başlıklarıyla aynı boyda (#415). |
| Host'a özel (sürüm notuna GİRMEDİ) | Hibe menüsü beşe indi: Bugün · Çağrılar · Talepler · Fikir Havuzu · Raporlar; hibe ayarları genel Ayarlar'daki Hibe kartına taşındı (#412). Çağrılar ekranı afişli kartlara döndü, Yayında · Taslak · Kaynaklar sekmeleri geldi, yeni çağrı artık **Taslak** doğuyor (#413). Talepler ekranı yanıt bekleyen ve yürüyen başvuruları ayırıyor; eski `/Grants/Interests` adresi yönleniyor (#412). Parametre formundaki dört yeni alanın Türkçe adı (#411). Danışman başvuru detayında (`/Grants/DetailHost`) **Form durumu** kartından evrak yükleme yerine ulaşılıyor ve evrak/gönderim durumu doğru gösteriliyor (#417); aynı kart 992 px altında satırları alt alta dizerek okunur hâle geldi (#420). |
| Sürüm notu | `2026.09.15` girişi **4 madde**: program bilgisi (#410) + fikir paylaşma, uygun çağrı bildirimi, fikir daveti (#419). |

## Migration — 3 adet, **hiçbiri veri düşürmüyor**

```
20260914231217_GrantProgramIdentityFields   (#409)
20260915022318_GrantInterestIdeaPool        (#414)
20260915100529_GrantIdeaInvitations         (#418)
```

Adlar SQL Server tarafınınkiler (canlı sağlayıcı); her biri PostgreSql tarafında da üretildi.
`Up()` iki sağlayıcıda da ölçüldü:

| Migration | İşlem | Etkisi |
|---|---|---|
| `GrantProgramIdentityFields` | `AppGrants` +4 nullable kolon: `Objective` nvarchar(2000), `Priorities` nvarchar(4000), `EligibleApplicants` nvarchar(2000), `MinAmount` decimal | Yalnız ekleme; mevcut programlarda boş gelir |
| `GrantInterestIdeaPool` | `AppGrantInterests.GrantCallId` NOT NULL → **NULL** (kolon genişliyor) · `Source` int NOT NULL, varsayılan `0` | Mevcut talepler olduğu gibi kalır, `Source` = "firma". Havuz fikri `GrantCallId` boş satırdır |
| `GrantIdeaInvitations` | Yeni tablolar `AppGrantIdeaInvitations` + `AppGrantIdeaInvitationRecipients` + 3 indeks | Boş başlar |

🔴 **Geri alma uyarısı:** `GrantInterestIdeaPool`'un `Down()`'u `GrantCallId`'yi tekrar NOT NULL yapar
ve boş değerlere `00000000-0000-0000-0000-000000000000` yazar. Deploy sonrası havuza bırakılmış her
fikir bu geri almada **bozulur**. Geri dönüş planı migration'ı geri sarmak değil, **sunucu yedeği** olmalı.

## Tohumlama — DbMigrator ŞART

`dotnet ef database update` **yetmez**: şema uygular, tohumlamayı çalıştırmaz.

- **İki yeni hibe bildirim şablonu:** `GrantNotificationTemplateDataSeedContributor` tetikleyici
  kaydını (`GrantNotificationTriggerRegistry.All`) gezip eksik olanı ekler — bu turda `IdeaLinked`
  (fikir çağrıyla ilişkilendirildi) ve `IdeaInvited` (fikir daveti + hatırlatma). Şablon yoksa
  bildirim **sessizce gitmez**; host'un düzenlediği mevcut şablonlara dokunulmaz.
- **Yeni izin yok** (`d8a01af6..a1ac4bff` izin dosyalarında fark 0). Fikir Havuzu ve davet ekranları
  mevcut `Grants.Default` / `Grants.Edit` / `Grants.Create` kapılarını kullanır.
- 🔴 Önceki paketin (`337eaf55`) sunucu işleri doğrulanmadıysa aynı koşuda toparlanır.

🔴 **Yeni sürüm notu maddeleri VARSAYILAN OLARAK KAPALIDIR.** `2026.09.15` girişinin 4 maddesi
host `/Admin/ReleaseNotes` ekranından onaylanana kadar kullanıcıya gitmez. Önceki paketlerin
onaylanmamış maddeleri de duruyorsa liste daha uzun olur; ekran bekleyenleri rozetle gösterir.

## Deploy adımları

1. Yedek al (DB + site kökü).
2. Korunacak dosyaları FileZilla filtresine ekle — `appsettings.secrets.json`, `openiddict.pfx`,
   `App_Data/uploads/*`, `App_Data/DataProtection-Keys/*`, `Logs/*`.
3. Web paketini site köküne aç (`App_offline.htm` ile havuzu düşürmek DLL kilidini önler).
4. `dbmigrator` klasörünü yükle, **sunucudaki `appsettings.secrets.json`'ı içine kopyala**; dosyadaki
   anahtar **`ConnectionStrings:SqlServer`** olmalı, başka adla araç sessizce localhost'a gider.
5. Plesk › Zamanlanmış Görevler › `migrate.bat` → "Şimdi Çalıştır".
6. Sonucu çıkış kodundan değil `dbmigrator\Logs\logs.txt` dosyasındaki
   `Successfully completed all database migrations.` satırından doğrula.
7. Zamanlanmış görevi ve `dbmigrator` klasörünü **SİL** (ClientSecret düz metin kalır).
8. App pool geri dönüşümü.
9. `/Admin/ReleaseNotes` → `2026.09.15` girişinin 4 maddesini (ve bekleyen eski maddeleri) onayla.

## Deploy sonrası QA

- `/health/ready` **200** (ilk istek soğuk başlangıç, 15-40 sn normal).
- **Program bilgisi:** bir çağrı detayında amaç, öncelikler, uygun başvuru sahipleri ve destek
  aralığı görünüyor mu (`GrantProgramIdentityFields` kolonlarının ilk kullanımı; host Parametreler'den doldurur).
- **Fikir Havuzu (kiracı):** Hibeler'den fikir paylaş → dokuz soruluk form → gönder
  (`AppGrantInterests.GrantCallId` boş ilk satır) → Hibe Yolculuğum'da "havuza bırakıldı" satırı.
- **Havuz (host):** Fikir Havuzu ekranında fikir görünüyor mu; bir çağrıyla ilişkilendir →
  talep Talepler'e düşmeli, firmaya bildirim gitmeli (`IdeaLinked` şablonu).
- **Fikir daveti (host):** bir firmaya davet gönder (uygulama içi + e-posta seçeneği) →
  firmada bildirim, bağlantı fikir formuna gitmeli (`AppGrantIdeaInvitations`'a ilk yazım, `IdeaInvited` şablonu).
- **Menü:** hibe menüsünde beş giriş; Ayarlar'da Hibe kartı; eski `/Grants/Interests` adresi Talepler'e yönleniyor mu.
- **Çağrılar (host):** afişli kartlar, Yayında/Taslak/Kaynaklar sekmeleri; yeni çağrı Taslak doğuyor mu.
- **Dokümanlar:** başvurudaki Form durumu kartından evrak yükleme yerine gidiliyor mu.
- **Görünüm:** herhangi bir onay kutusu/radyo işaretlendiğinde renk çivit mi (pembe kalmamalı); hibe
  formundaki konsorsiyum sorusu başlığı diğer sorularla aynı boyda mı. Koyu temada da bak.
- Sürüm notu penceresi: onaydan **önce** kullanıcıda çıkmamalı, onaydan **sonra** çıkmalı.

## Paket doğrulaması

2026-09-17 12:0x, **ZIP'lerin kendisinden** ölçüldü (publish klasöründen değil; `tar.exe -t` / `-xO`):

| Denetim | Sonuç |
|---|---|
| ZIP'ler | `Apya-Yayin-1db6556d.zip` 115,8 MB · **4197 girdi** · `Apya-DbMigrator-1db6556d.zip` 53,6 MB · **454 girdi** · ikisinde de ters slash **0** |
| Self-contained | İki ZIP'in kökünde `System.Private.CoreLib.dll`, `coreclr.dll`, `hostfxr.dll` var |
| Kök dosyalar | Web: `web.config`, `Apya.Platform.Web.exe` · DbMigrator: `Apya.Platform.DbMigrator.exe`, `migrate.bat`, `appsettings.json` |
| `web.config` | Yorumlar ayıklanınca tek `<aspNetCore>`: `processPath=".\Apya.Platform.Web.exe"` · `hostingModel="OutOfProcess"`. Betiğin "InProcess" uyarısı yorum satırına takılan bilinen yanlış alarm. |
| Sırlar | `appsettings.secrets.json`, `*.pfx`, `App_Data/`, `Logs/` iki pakette de **yok** |
| İstemci | `wwwroot/libs/signalr/signalr.min.js` ve `wwwroot/js/.vite/manifest.json` pakette |
| Bu turun sayfaları | `Pages/Grants/Ideas.js`, `IdeaForm.js`, `Idea.js`, `Requests.js` **dördü de** pakette (canlıda bu dosyalar 302) |
| Tema düzeltmesi | Paketteki `wwwroot/css/apya-theme-bridge.css` seçili kontrol kuralını `--apya-accent-500 !important` ile taşıyor (#415) |
| Commit | `Apya.Platform.Web.dll` içinde `+1db6556d…` gömülü |
| Migration | Üç migration kimliği **hem web hem DbMigrator** paketindeki `Apya.Platform.EntityFrameworkCore.SqlServer.dll`'de |
| Sürüm notu | `Apya.Platform.Application.Contracts.dll` (UTF-16): `2026.09.15` giriş başlığı + **4 madde başlığının hepsi** var |
| Yerelleştirme | `Apya.Platform.Domain.Shared.dll`: `Grants:Notify:Trigger:IdeaLinked:Subject`, `…IdeaInvited:Subject`, `Grants:Ideas:Title`, `Grants:Parameters:AmountRange` |

Doğrulama betiği: scratchpad `verify-package-0917.cjs <klasör> <sha8>` (Node; `tar.exe` + UTF-8/UTF-16 arama).

## Test

2026-09-17, main `a1ac4bff` üzerinde tam koşu. .NET ile vitest **ardışık**; Web.Tests sınıf öbekleri
hâlinde (altışar sınıf, 12 öbek), her öbek ayrı süreçte:

| Takım | Sonuç |
|---|---|
| `Apya.Platform.Domain.Tests` | 360 / 360 ✅ |
| `Apya.Platform.Application.Tests` | 269 / 269 ✅ |
| `Apya.Platform.EntityFrameworkCore.Tests` | 403 / 403 ✅ |
| `Apya.Platform.Web.Tests` (12 öbek) | 574 / 574 ✅ |
| Vitest (`dynamic-assets`) | 84 dosya · 777 / 777 ✅ |

**Toplam 2383 test, 0 hata.**

`1db6556d` (#420) yalnız `DetailHost.css`'e dokunduğu için .NET tarafı etkilenmez; yine de paket
commit'inde **25 hibe web test sınıfı** yeniden koşuldu: 5 öbek, **217 / 217 ✅**.

🔴 Aynı 25 sınıf **tek süreçte** koşturulduğunda 4 test düştü ve koşu 46 dakika sürdü; öbeklenince
hepsi geçti. Bu, bilinen yük/zaman aşımı tuzağıdır (bkz. `reference_web_test_timeout_under_load`),
kod hatası değil. Web.Tests her zaman öbekli koşulmalı.

## Bilinen sınır

- Fikir daveti hatırlatması günlük bir arka plan işidir (`GrantIdeaInvitationReminderWorker`).
  Paylaşımlı hostingde arka plan işleri **yalnız app pool ayaktayken** çalışır; havuz uykudayken
  hatırlatma o gün gecikebilir.
- Eşleşme puanı kayıt tutmaz, ekranlar anlık hesaplar: geçmişe dönük "o gün kaçtı" sorusunun cevabı yok.
- Fikir daveti e-postası **SMTP'ye bağlı**; sunucuda SMTP doğrulanmadı (`Smtp.Host` varsayılanı 127.0.0.1).
  Uygulama içi bildirim her hâlükârda gider.
- Hibe tasarımının tur 16-17'si (form veri kaynakları, yanıt → kayıt eşleme, koşullu alanlar) bu pakette yok.
- Paket kesildikten sonra açılan PR'lar bu pakete girmedi (bkz. aşağıdaki not).
