---
name: apya-mobil-api
description: Apya mobil uygulaması (React Native / Flutter) ile ABP backend arasındaki entegrasyon işlerinde kullanılır. "Mobil uygulama", "React Native", "Flutter", "mobil için endpoint", "API kontratı", "mobil login", "access token", "refresh token", "mobilde şu ekran", "mobile app", "API integration" gibi isteklerde tetiklenir. Tasarım token'ları (--apya-*) ile ilgisi yoktur — o apya-redesign'dır. OpenIddict auth akışı, multi-tenant header, DTO senkronizasyonu ve repo ayrımını kapsar.
---

# Apya Mobil ↔ Backend Entegrasyonu

Mobil uygulama **ayrı bir repoda** yaşar. `hitprot-platform` reposuna React Native
veya Flutter kodu koyma — her aramada .NET dosyalarıyla karışır ve iki bağlam
birbirini kirletir.

Ortak yüzey tek şey: **HTTP API kontratı.**

## Kontrat kaynağı

Backend'de `src/Apya.Platform.HttpApi/` altındaki controller'lar ve
`Application.Contracts` içindeki DTO'lar tek doğru kaynaktır.

- Swagger: `https://localhost:44386/swagger`
- ABP dinamik API'leri AppService'lerden otomatik üretir; `IProjectAppService`
  → `/api/app/project` gibi
- **Mobil tarafta DTO'yu elle yazma.** Swagger'dan tip üret (`openapi-typescript`,
  `swagger_dart_code_generator`). Elle yazılan tip, backend değişince sessizce bozulur.

DTO değiştiğinde mobil kırılır. Bu yüzden `Application.Contracts` içinde bir DTO'ya
dokunurken **mobilde kullanılıyor mu** diye sor. Kullanılıyorsa geriye uyumlu değiştir:
alan ekle, silme; alan adı değiştirme.

## Kimlik doğrulama — OpenIddict

Backend OpenIddict kullanıyor. Mobil için doğru akış:

- **Resource Owner Password** akışı basit ama access token'ı istemcide tutar —
  sadece kendi first-party uygulamanız içinse kabul edilebilir
- **Authorization Code + PKCE** doğru olan. Public client (mobil) için client secret
  saklanamaz, PKCE bunu çözer

Her iki durumda da:

- Token'ı güvenli depoda tut: iOS Keychain / Android Keystore
  (React Native: `react-native-keychain`, Flutter: `flutter_secure_storage`)
- **`AsyncStorage` / `SharedPreferences` kullanma** — şifresiz, root'lu cihazda okunur
- Refresh token akışını kur; access token kısa ömürlü olmalı
- 401 dönünce otomatik refresh, refresh de başarısızsa login'e düş

Yeni bir OpenIddict client tanımı gerekiyorsa `OpenIddictDataSeedContributor.cs`'e
eklenir — bu bir şema/seed değişikliğidir, **onay al**.

## Multi-tenancy

Bu en kolay unutulan ve en pahalı kısım. Apya multi-tenant; mobil istemci
hangi tenant adına konuştuğunu **her istekte** belirtmeli:

```
__tenant: <tenant-adı-veya-id>
```

- Tenant çözümleme header üzerinden yapılır (`AbpAspNetCoreMultiTenancyOptions.TenantKey`)
- Header eksikse istek **host bağlamında** çalışır ve kullanıcı kendi verisini göremez
- Login ekranında tenant seçimi/girişi olmalı, seçilen tenant güvenli depoda saklanmalı
- HTTP istemcisine interceptor koy; header'ı her istekte otomatik ekle, tek tek yazma

Mobilde "veri boş geliyor" şikâyetinin ilk şüphelisi eksik `__tenant` header'ıdır.

## Endpoint eklerken

Mobil için yeni bir uç gerekiyorsa:

1. Önce sor: mevcut AppService yetiyor mu? ABP zaten otomatik endpoint üretiyor
2. Yetmiyorsa `Application` katmanına metot ekle — controller'a iş mantığı yazma
3. Mobil için özel bir DTO gerekiyorsa (daha az alan, daha az round-trip)
   `Application.Contracts` içinde ayrı DTO tanımla, mevcut olanı bozma
4. Liste uçlarında **sayfalama zorunlu**. Mobilde tüm kayıtları çekmek kabul edilemez
5. `abp-ozellik-gelistirme` skill'indeki izin ve localization adımları burada da geçerli

## Ağ ve dayanıklılık

Mobil ağ masaüstü ağı değil. Backend'e istek atan her yerde:

- Timeout ver (varsayılan sonsuz beklemeye bırakma)
- Yeniden deneme: sadece idempotent (GET) isteklerde, üstel geri çekilmeyle
- **POST/PUT'u körlemesine yeniden deneme** — çift fatura, çift ödeme kaydı oluşur
- Offline durumu ele al: kullanıcıya net mesaj, sessizce boş liste gösterme
- Dosya yükleme (`ProjectAttachment`, `TaskAttachment`) için ayrı, uzun timeout

## Doğrulama

```
1. Login çalışıyor, token güvenli depoda
2. Token yenileme çalışıyor (access token'ı bilerek bekleterek test et)
3. __tenant header'ı her istekte gidiyor
4. Doğru tenant verisi geliyor, başka tenant'ın verisi görünmüyor
5. Offline / timeout senaryosunda uygulama çökmüyor
6. Backend DTO değişikliği sonrası tipler yeniden üretildi
```

Tenant izolasyonunu test etmeden "çalışıyor" deme — bu bir güvenlik kontrolüdür.
