namespace Apya.Platform.Projects;

public enum TaskState
{
    Todo = 0,       // Yapılacak
    InProgress = 1, // Devam Ediyor
    Review = 2,     // İncelemede (Danışman Onayı)
    Done = 3        // Tamamlandı
}