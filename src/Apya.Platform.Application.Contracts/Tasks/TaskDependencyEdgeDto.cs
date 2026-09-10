using System;

namespace Apya.Platform.Tasks
{
    /// <summary>
    /// Proje içi bağımlılık KENARI (öncül → ardıl) — Proje Detayı'nın
    /// Bağımlılıklar paneli için (birleşik sekme sistemi PR-2b).
    ///
    /// Bilerek yalın: başlık/durum/tarih taşınmaz — istemci bu bilgileri zaten
    /// çektiği görev listesiyle (GetListAsync) birleştirir; kenar başına
    /// zenginleştirme sorguyu şişirir ve aynı görevi defalarca taşırdı.
    /// </summary>
    public class TaskDependencyEdgeDto
    {
        /// <summary>Ardıl görev (bağımlılığı taşıyan).</summary>
        public Guid TaskId { get; set; }

        /// <summary>Öncül görev (önce bitmesi gereken).</summary>
        public Guid PredecessorTaskId { get; set; }
    }
}
