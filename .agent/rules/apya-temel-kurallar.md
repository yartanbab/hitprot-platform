---
trigger: always_on
---

# Kural: APYA Projesi Temel Geliştirme ve Mimari Kuralları

**Bağlam:** Bu dosya, Apya projesindeki tüm geliştirmeler, hata çözümleri ve kod incelemeleri için "Anayasa" niteliğindedir. Aşağıdaki kurallar KESİNLİKLE esnetilemez:

**1. Mimari Katı Kurallar (ABP & DDD):**
- **Domain Katmanı:** Sadece iş mantığı, Aggregate Root'lar, Entity'ler, Domain Service'ler ve Interface'ler burada yer alır. Asla UI, DTO veya veritabanı (EF Core) referansı barındıramaz. Apya multi-tenant bir sistem olduğu için, gerektiğinde Entity'lere `IMultiTenant` arayüzünü (interface) eklemeyi unutma.
- **Application.Contracts Katmanı:** Sadece DTO'lar (Data Transfer Objects) ve Application Service Interface'leri (`I...AppService`) burada tanımlanır.
- **Application Katmanı:** İş kurallarının orkestrasyonu burada yapılır. DTO-Entity dönüşümleri için kesinlikle AutoMapper kullan, manuel eşleme yapma.

**2. Kodlama ve İsimlendirme Standartları (C# Best Practices):**
- **Dil:** Sınıf, metot, değişken isimleri ve yorum satırları **DAİMA İNGİLİZCE** yazılacaktır. Ancak kullanıcıya dönen metinler, hata mesajları ve arayüz (UI) verileri **Türkçe** (veya lokalizasyon dosyalarıyla uyumlu) olmalıdır.
- **İsimlendirme (Naming Convention):** Sınıf ve metotlar `PascalCase`, parametreler ve lokal değişkenler `camelCase`, private field'lar alt tire ile (`_camelCase`) yazılacaktır.
- **Asenkron Programlama:** Tüm I/O ve veritabanı işlemleri asenkron olmalıdır. Metot isimleri kesinlikle `Async` eki ile bitmelidir (Örn: `CreateUserAsync`).
- **Dependency Injection:** Bağımlılıklar daima "Constructor Injection" yöntemiyle içeri alınmalıdır.

**3. Strict Mode (Katı Otonomi Sınırları):**
- **Onaysız İşlem Yasaktır:** Mimari bir karar almadan, veritabanı şemasını değiştirmeden veya büyük bir kod bloğunu silmeden/refactor etmeden önce **daima kullanıcıdan onay iste**.
- **Cerrahi Müdahale:** Bir dosyada değişiklik yaparken dosyanın tamamını baştan yazma; sadece ilgili fonksiyonu veya satırı düzelt (partial update).
- **Halüsinasyon Engeli:** Eğer projedeki bir sınıfın veya arayüzün içeriğini tam olarak bilmiyorsan, varsayım yaparak kod uydurma. Kullanıcıdan ilgili dosyayı (örn: "Lütfen bana `IPaymentRepository` içeriğini gösterir misin?") talep et.