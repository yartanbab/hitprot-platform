/**
 * Görev detayı SAYFA kipinde başka bir göreve geçiş (Çoğalt, alt görev, üst görev) o görevin
 * kendi sayfasına gider (QA-16). Eskiden içerik yerinde değişiyor, adres ve sekme başlığı eski
 * görevde kalıyordu: kopyada çalışan kullanıcı yenileyince ya da bağlantıyı paylaşınca asıl
 * göreve dönüyordu. Kaydedilmemiş değişiklik koruması bu çağrıdan ÖNCE çalışır (switchTask).
 */
export function goToTaskPage(id) {
    window.location.assign('/Tasks/Detail/' + encodeURIComponent(id));
}
