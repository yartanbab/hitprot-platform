using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Tasks
{
    /// <summary>
    /// Zaman çizelgesi (Gantt) kaydı: YALNIZ tarih. Tam güncelleme (CreateUpdateTaskDto)
    /// DTO'dan düşen her alanı siler; Gantt liste DTO'suyla beslendiği için öncülleri ve
    /// bütçe bağını her kayıtta siliyordu (STA-01).
    ///
    /// Gövdeli DTO bilinçli: Gantt tarihi JSON gövdede yerel 'YYYY-MM-DDTHH:mm:ss' olarak
    /// gönderir — UpdateAsync ile aynı bağlama yolu; sorgu dizesine geçmek 1 gün kayması
    /// riskini yeniden açardı. <c>[Required] DateTime?</c> eksik başlangıcı 400 ile reddeder,
    /// 0001-01-01'e düşmez.
    /// </summary>
    public class UpdateTaskScheduleDto
    {
        [Required]
        public DateTime? StartDate { get; set; }

        public DateTime? DueDate { get; set; }
    }
}
