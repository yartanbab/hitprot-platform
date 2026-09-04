# Takvim entegrasyonları — Google / Outlook / iCal kurulumu

Bu belge, takvimin dış servislerle **gerçekten** konuşabilmesi için yapılması
gereken tek şeyi anlatır: OAuth istemcisi kaydı. Kod tarafında yapılacak bir iş
kalmadı.

---

## Kısaca

| Entegrasyon | Kurulum gerekir mi | Yön |
|---|---|---|
| **iCal (dışa)** — `/ical/u/{token}.ics` | Hayır, çalışır durumda | APYA → dış takvim (salt-okunur) |
| **iCal (içeri)** — `.ics` aboneliği | Hayır, çalışır durumda | Dış takvim → APYA (salt-okunur) |
| **Google Calendar** | ✅ Google Cloud Console kaydı | Çift yönlü |
| **Microsoft Outlook** | ✅ Azure uygulama kaydı | Çift yönlü |

İstemci **tanımlı değilken** "Google bağla / Outlook bağla" düğmeleri kullanıcıyı
`/Calendars/SimulateAuth` sayfasına götürür: gerçek bir bağlantı kurulmaz, sahte
token'lı bir hesap oluşur ve ekran akışı denenebilir. **İstemci tanımlandığı anda
o sayfa kapanır (404)** ve düğmeler gerçek OAuth ekranına gider — arayüzde
değiştirilecek bir ayar yok, karar tamamen yapılandırmaya bakar.

---

## 1. Google Calendar

1. <https://console.cloud.google.com> → proje seç/oluştur.
2. **APIs & Services → Library** → *Google Calendar API* → **Enable**.
3. **APIs & Services → OAuth consent screen**:
   - User type: *External* (kendi Workspace'iniz dışındaki kullanıcılar bağlanacaksa).
   - Kapsamlar (scopes) olarak şunları ekleyin:
     - `https://www.googleapis.com/auth/calendar.events`
     - `https://www.googleapis.com/auth/userinfo.email`
   - Yayınlanmamış (Testing) uygulamada yalnız *Test users* listesindekiler bağlanabilir.
4. **Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**
   - **Authorized redirect URIs** — `App:SelfUrl` + `/Calendars/Callback`:
     - Yerel: `https://localhost:44386/Calendars/Callback`
     - Canlı: `https://<alan-adiniz>/Calendars/Callback`
   - Üretilen **Client ID** ve **Client secret** değerlerini not alın.

> Yönlendirme adresi **birebir** eşleşmelidir: sondaki `/`, `http`/`https` farkı
> ya da farklı port `redirect_uri_mismatch` hatası verir.

## 2. Microsoft Outlook

1. <https://portal.azure.com> → **Microsoft Entra ID → App registrations → New registration**.
2. Supported account types: kimlerin bağlanacağına göre seçin (çoğu kurulumda
   *Accounts in any organizational directory and personal Microsoft accounts*).
3. **Redirect URI**: platform *Web*, adres `https://<alan-adiniz>/Calendars/Callback`.
4. **Certificates & secrets → New client secret** → değeri **hemen** kopyalayın
   (bir daha gösterilmez).
5. **API permissions → Microsoft Graph → Delegated**:
   - `Calendars.ReadWrite`
   - `offline_access`
   - `User.Read`

## 3. Değerleri uygulamaya girmek

`src/Apya.Platform.Web/appsettings.json` içindeki bölüm:

```json
"Calendars": {
    "Google":  { "ClientId": "", "ClientSecret": "" },
    "Outlook": { "ClientId": "", "ClientSecret": "" }
}
```

🔴 **Bu dosyaya gerçek değer YAZMAYIN** — depoya girer. Değerleri
`appsettings.secrets.json` dosyasına koyun (git'te izlenmez):

```json
{
    "Calendars": {
        "Google":  { "ClientId": "…", "ClientSecret": "…" },
        "Outlook": { "ClientId": "…", "ClientSecret": "…" }
    }
}
```

Dikkat edilecekler:

- `appsettings.secrets.json` ortam değişkenlerini ve komut satırı argümanlarını
  **sessizce ezer**; bir değeri ortamdan verdiğinizi sanıp bu dosyada eskisini
  bırakmayın.
- Dosya **worktree'lere kopyalanmaz**; başka bir çalışma kopyasında dener­ken
  yeniden oluşturmanız gerekir.
- Canlı sunucuda **deploy sırasında korunacak dosyalar** arasındadır; paketi
  açarken üzerine yazmayın.
- `App:SelfUrl` değeri, kayıtlardaki yönlendirme adresinin ön ekiyle aynı olmalıdır;
  callback adresi bu değerden üretilir.

**İki değer birden** (ClientId + ClientSecret) dolu olmalıdır. Yalnız ClientId
girilirse sağlayıcı yapılandırılmamış sayılır ve simülasyon yolunda kalınır —
aksi hâlde kullanıcı gerçek Google ekranına gider, dönüşte kod takası secret
olmadan düşer ve sebepsiz "bağlantı başarısız" görürdü.

## 4. Doğrulama

1. Uygulamayı yeniden başlatın (yapılandırma açılışta okunur).
2. `/Calendars/SimulateAuth?provider=1` adresi artık **404** dönmeli.
3. Takvim → kaynak rayı → **Senkron ayarları** → **Google bağla**: gerçek Google
   onay ekranına gitmelisiniz.
4. İzin verdikten sonra `/Calendars?msg=success` ile dönülür ve hesap kartı
   senkron drawer'ında görünür.
5. Kartta **Şimdi senkronize et** → Google Calendar'da görevlerinizin etkinlik
   olarak oluştuğunu ve **saatlerin doğru** olduğunu görün.
6. Google'da bir etkinlik oluşturup takvimi yenileyin: etkinlik APYA'da
   salt-okunur olarak görünmeli.

Bir adım tutmazsa hata hep aynı yerde yazar: senkron drawer'ındaki **Senkron
günlüğü** ve sunucu log'ları (`Logs/logs.txt`).

## 5. Bilinen sınırlar

- Dış takvime **yalnız görevler** yazılır. Hesap kartındaki kaynak seçiciden
  fatura/gider/gelir/hibe/kur işaretlenebiliyor ama yazma yolu bugün yalnız
  görev için var — seçim o kaynaklar için karşılıksızdır.
- `CalendarProviderType.ICloud` sayacı tanımlı ama **iCloud sağlayıcısı yok**;
  Apple takvimleri bugün yalnız `.ics` aboneliğiyle (tek yönlü) okunur.
- Tüm gün etkinlikleri dışa yazılırken saatli etkinlik olarak gider.
