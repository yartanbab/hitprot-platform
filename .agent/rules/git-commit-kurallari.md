---
trigger: always_on
---

# Git Commit Kuralları (v2.0)

'Conventional Commits' standardı, Jira entegrasyonu ile birlikte kesinlikle uygulanacaktır:

## Format
`<tip>(<modül>): <JIRA-ID> - <açıklama>`

## Tipler
- `feat`: Yeni bir özellik (Örn: APYA-19 Story: Görev içi yorumlaşma)
- `fix`: Hata çözümü (Örn: APYA-21 RBAC yetki hatası düzeltildi)
- `refactor`: Kod iyileştirme, performans artışı (Örn: APYA-18 Dosya yükleme optimizasyonu)
- `docs`: Sadece dokümantasyon değişikliği (Örn: README güncelleme)
- `style`: Kodun çalışmasını etkilemeyen görsel/biçimsel değişiklikler (Prettier, boşluklar vb.)
- `chore`: Build süreçleri, paket yönetimi veya yardımcı araçlardaki değişiklikler.

## Kurallar
1. **Dil:** Açıklamalar tamamen Türkçe ve emir kipiyle (yapıldı/edildi yerine yap/et) yazılmalıdır.
2. **Jira Bağlantısı:** Her commit mesajı mutlaka ilgili Jira ID'sini (Örn: APYA-20) içermelidir.
3. **Kapsam (Scope):** Modül adı parantez içinde belirtilmelidir.
4. **Büyük/Küçük Harf:** Tip küçük harfle başlamalı, açıklama ise büyük harfle başlamalıdır.

## Örnekler
- `feat(collaboration): APYA-19 - Görev içi yorumlaşma altyapısı kuruldu`
- `fix(auth): APYA-21 - RBAC entegrasyonunda yetki kontrolü hatası giderildi`
- `refactor(storage): APYA-18 - Dosya ekleme işleminde asenkron yapıya geçildi`