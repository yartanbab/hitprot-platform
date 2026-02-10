namespace Apya.Platform.Tasks // Klasör yapına göre namespace bu şekilde olmalı
{
    public enum TaskPriority
    {
        Low = 1,      // Düşük
        Medium = 2,   // Orta
        High = 3,     // Yüksek
        Critical = 4  // Kritik
    }

    public enum TaskStatus
    {
        Todo = 1,        // Yapılacak
        InProgress = 2,  // Devam Ediyor
        InReview = 3,    // Kontrol/Test Aşamasında
        Done = 4,        // Tamamlandı
        Cancelled = 0    // İptal
    }
}