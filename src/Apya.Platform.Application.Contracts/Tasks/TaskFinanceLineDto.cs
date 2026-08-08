using System;

namespace Apya.Platform.Tasks
{
    /// <summary>Göreve bağlı tek bir finans satırı (gider veya gelir) — FinanceTab özeti için.</summary>
    public class TaskFinanceLineDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "TRY";
        public DateTime Date { get; set; }
    }
}
