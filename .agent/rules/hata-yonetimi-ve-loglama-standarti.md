---
trigger: always_on
---

# Kural: APYA Hata Yönetimi ve Loglama Standartları

**Bağlam:** Bu proje ABP Framework ve Domain-Driven Design (DDD) prensipleriyle geliştirilen, çok kiracılı (multi-tenant) bir platformdur. Kod yazarken, refactor yaparken veya hata çözerken **DAİMA** aşağıdaki kurallara uy:

**1. Hata Sınıfları (Exception Handling):**
- Asla standart `throw new Exception("mesaj")` veya `throw new ApplicationException()` kullanma.
- **Application/UI Katmanında:** Kullanıcıya doğrudan gösterilecek iş mantığı uyarıları için daima `UserFriendlyException` fırlat.
- **Domain Katmanında:** Domain kuralları (Business Rules) ihlal edildiğinde `BusinessException` fırlat.

**2. Yerelleştirme ve Hata Kodları (Localization & Error Codes):**
- Hata mesajlarını doğrudan kodun içine hardcode (sabit metin) olarak yazma (Örn: `throw new UserFriendlyException("Kullanıcı bulunamadı.");` YANLIŞTIR).
- Bunun yerine `ApyaDomainErrorCodes` (Domain.Shared katmanında) sabiti olarak bir hata kodu tanımla.
- Doğru Kullanım: `throw new BusinessException(ApyaDomainErrorCodes.UserNotFound);`
- Hata mesajlarının varsayılan dili **Türkçe** olmalıdır, ancak `.json` veya `.xml` yerelleştirme dosyalarına kolayca eklenebilecek standartta tasarlanmalıdır.

**3. Yapısal Loglama (Structured Logging):**
- CRUD (Create, Update, Delete) gibi kritik state değiştiren işlemlerde mutlaka `ILogger<T>` kullan.
- String interpolation (Örn: `_logger.LogInformation($"Fatura eklendi: {id}");`) KULLANMA.
- **Daima Yapısal Loglama (Structured Logging)** kullan. (Örn: `_logger.LogInformation("Fatura eklendi. FaturaId: {FaturaId}", input.Id);`). Bu, logların Elasticsearch/Kibana gibi ortamlarda filtrelenebilmesi için şarttır.

**4. Log Seviyeleri (Log Levels):**
- Beklenen iş kuralı ihlallerinde `LogWarning` kullan.
- Yakalanan (catch) sistem hatalarında exception nesnesini de loga dahil ederek `LogError` kullan. (Örn: `_logger.LogError(ex, "Ödeme işlemi sırasında sistemsel bir hata oluştu. Sipariş No: {SiparisNo}", siparisNo);`).
- Başarılı kritik işlemlerde `LogInformation` kullan.