---
trigger: always_on
---

# Kural: Git Commit Standartları (v2.0)

**Bağlam:** Bu projede kod yazdıktan veya refactor yaptıktan sonra Git commit mesajı oluştururken **DAİMA** "Conventional Commits" ve Jira entegrasyon kurallarına uymalısın.

## Format
`<tip>(<modül>): <JIRA-ID> - <açıklama>`

## Tipler (Types)
- `feat`: Yeni bir özellik (feature) eklenmesi.
- `fix`: Bir hatanın (bug) kök nedeninin çözülmesi.
- `refactor`: Kodun mevcut iş mantığını değiştirmeden yapılan mimari/temizlik iyileştirmeleri.
- `test`: Eksik testlerin eklenmesi veya mevcut testlerin güncellenmesi.
- `perf`: Performansı artıran kod değişiklikleri.
- `docs`: Sadece dokümantasyon (README, Swagger açıklamaları vb.) değişiklikleri.
- `style`: Kodun çalışmasını etkilemeyen biçimsel değişiklikler (Boşluklar, isimlendirme standartları vb.).
- `chore`: Build süreçleri, paket yönetimi (NuGet/npm) veya CI/CD güncellemeleri.

## Kurallar
1. **Emir Kipi Şartı (Kritik):** Açıklamalar tamamen Türkçe ve emir kipiyle (imperative mood) yazılmalıdır. Geçmiş zaman veya edilgen yapı (yapıldı, edildi, eklendi) KESİNLİKLE KULLANMA. (Örn: "Eklendi" yerine "Ekle", "Düzeltildi" yerine "Düzelt").
2. **Jira Bağlantısı:** Her commit mesajı mutlaka ilgili Jira Task/Story ID'sini (Örn: APYA-20) içermelidir.
3. **Kapsam (Scope):** Değişikliğin yapıldığı modül veya katman adı parantez içinde küçük harfle belirtilmelidir (Örn: auth, payment, ui, domain).
4. **Harf Kuralları:** Tip kısmı (`feat`, `fix` vb.) küçük harfle başlamalı, `<açıklama>` kısmı ise büyük harfle başlamalıdır. Sonuna nokta konmamalıdır.

## Doğru Örnekler (Bunları Model Al)
- `feat(collaboration): APYA-19 - Görev içi yorumlaşma altyapısını kur`
- `fix(auth): APYA-21 - RBAC entegrasyonunda yetki kontrolü hatasını gider`
- `refactor(storage): APYA-18 - Dosya ekleme işleminde asenkron yapıya geç`
- `test(invoice): APYA-25 - Fatura hesaplama servisi için birim testlerini ekle`
- `chore(nuget): APYA-30 - ABP Framework paketlerini v8.0 sürümüne yükselt`