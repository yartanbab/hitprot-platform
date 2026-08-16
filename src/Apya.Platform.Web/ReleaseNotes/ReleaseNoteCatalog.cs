using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.Web.ReleaseNotes;

/// <summary>
/// Sürüm notları — kod içinde tutulur (her yayın kod ile birlikte gelir).
/// YENİ SÜRÜM EKLERKEN: listenin BAŞINA yeni bir <see cref="ReleaseNote"/> ekle
/// (en yeni ilk). <see cref="Latest"/> otomatik ilk öğedir; kullanıcı bunu
/// görmediyse ilk açılışta "Yenilikler" penceresi açılır.
/// </summary>
public static class ReleaseNoteCatalog
{
    public static IReadOnlyList<ReleaseNote> All { get; } = new List<ReleaseNote>
    {
        new ReleaseNote(
            version: "2026.08.16",
            date: "16 Ağustos 2026",
            title: "Güvenlik, gizlilik ve kararlılık güncellemesi",

            // ── Güvenlik ──────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Security,
                "Fatura, proje ve görev verilerine erişim yetkileri sıkılaştırıldı",
                "Bu ekranların verilerine artık yalnızca ilgili yetkiye sahip kullanıcılar erişebilir. " +
                "Önceden bazı isteklerin yetki kontrolünü atlaması mümkündü; bu kapatıldı. Yetkili kullanıcılar " +
                "için hiçbir değişiklik yok."),

            new ReleaseNoteItem(ReleaseNoteCategory.Security,
                "Takvim entegrasyonu artık şifreli",
                "Google/Outlook takvim bağlantı bilgileriniz veritabanında artık şifreli saklanıyor. " +
                "Bu güncelleme nedeniyle mevcut takvim bağlantılarını bir kez yeniden bağlamanız gerekir " +
                "(Takvim ekranından). Sonraki bağlantılar otomatik şifrelenir."),

            new ReleaseNoteItem(ReleaseNoteCategory.Security,
                "Yapay zekâ özellikleri yetkilendirmeye bağlandı",
                "Yapay zekâ (belge → görev üretimi, AI asistan) artık yalnızca yapay zekâ iznine sahip kullanıcılar " +
                "ve paketinde yapay zekâ bulunan kiracılar için çalışır. Bu, kota/maliyet israfını ve izinsiz kullanımı önler."),

            new ReleaseNoteItem(ReleaseNoteCategory.Security,
                "Webhook ve genel form korumaları",
                "Webhook adreslerinin iç/özel sunuculara erişimi engellendi. Genel (herkese açık) form gönderimleri " +
                "artık forma göre doğrulanıyor ve basit bot koruması var — böylece çöp/spam kayıt oluşmaz."),

            // ── KVKK / Gizlilik ───────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Aydınlatma metni, gizlilik politikası ve çerez bilgilendirmesi",
                "KVKK kapsamında aydınlatma metni ve gizlilik politikası sayfaları eklendi, alt bilgiden erişilebilir. " +
                "İlk ziyarette çerez bilgilendirme şeridi çıkar. (Yasal metinler taslaktır; hukuki inceleme sürüyor.)"),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Genel formlarda KVKK onayı ve yayın penceresi",
                "Formlarınıza zorunlu KVKK onay kutusu ekleyebilir, formu yalnız belirli tarih aralığında açık " +
                "tutabilirsiniz. Onaylar kayıt altına alınır; yönetim tarafında rıza analiz paneli bunları gösterir."),

            // ── İyileştirme / Düzeltme ────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Proje Detay'daki \"Atanan\" filtresi düzeltildi",
                "Proje detayında görevleri atanan kişiye göre süzen filtre artık isimleri doğru gösteriyor " +
                "(önceden boş kalıyordu)."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Tarih/saat tutarlılığı düzeltildi",
                "Bazı ekranlar sunucu yerel saatini kullanıyordu; artık hepsi tek bir zaman kaynağını kullanıyor. " +
                "Özellikle hibe son tarihleri ve \"bugün\" sınırındaki hesaplamalar daha isabetli."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Ödeme kaydında hatalı tutar engellendi",
                "Faturaya sıfır veya negatif tutarlı ödeme kaydedilmesi engellendi; bu tür kayıtlar fatura durumunu " +
                "yanlış gösterebiliyordu."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Liste ekranlarında hız iyileştirmeleri",
                "Görev ve fatura listeleri gibi sık kullanılan ekranlar için veritabanı indeksleri eklendi; " +
                "büyük verilerde açılış daha akıcı.")
        )
    };

    /// <summary>En yeni sürüm (listenin ilk öğesi). Görülme takibi bununla yapılır.</summary>
    public static ReleaseNote Latest => All[0];

    public static ReleaseNote? Find(string? version) =>
        version is null ? null : All.FirstOrDefault(r => r.Version == version);
}
