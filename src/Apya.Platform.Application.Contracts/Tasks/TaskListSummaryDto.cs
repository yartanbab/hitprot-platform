namespace Apya.Platform.Tasks
{
    /// <summary>
    /// Görev listesi şeridindeki sayaç barları (İlerleme / Gecikmiş / 7 Gün İçinde /
    /// Bana atanan). Barlar aynı zamanda filtre düğmesidir: gösterilen sayı,
    /// bara basınca listede çıkacak kayıt adediyle AYNI olmak zorunda.
    ///
    /// Bu yüzden sayımlar istemcideki filtre tanımını birebir yansıtır
    /// (bkz. ProjectDetails.js → OPEN_STATUSES / buildInput):
    /// "açık görev" = Todo(1) + InProgress(2) + InReview(3); Done(4) ve
    /// Cancelled(0) hariç. Gecikmiş = açık ve son tarihi dün 23:59:59 ve öncesi.
    /// 7 gün içinde = açık ve son tarihi bugün 00:00 ile +7 gün 23:59:59 arası.
    ///
    /// Kapsam olarak yalnız <see cref="GetTasksInput.ProjectId"/> (ve tenant/gizlilik
    /// süzgeci) uygulanır — chip filtreleri UYGULANMAZ. Aksi halde "Durum:
    /// Tamamlandı" seçiliyken "Gecikmiş 0" yazar ve bar filtre düğmesi olarak
    /// anlamını yitirir. <see cref="GetTasksInput.RootOnly"/> de yok sayılır;
    /// alt görevler sayıma dahildir.
    /// </summary>
    public class TaskListSummaryDto
    {
        /// <summary>Kapsamdaki toplam görev (ilerleme çubuğunun paydası).</summary>
        public int Total { get; set; }

        /// <summary>Tamamlanmış görev — Done(4). İlerleme çubuğunun payı.</summary>
        public int Done { get; set; }

        /// <summary>Son tarihi geçmiş açık görevler.</summary>
        public int Overdue { get; set; }

        /// <summary>Bugün ile +7 gün arasında bitmesi gereken açık görevler.</summary>
        public int DueIn7Days { get; set; }

        /// <summary>Mevcut kullanıcıya atanmış açık görevler.</summary>
        public int AssignedToMe { get; set; }
    }
}
