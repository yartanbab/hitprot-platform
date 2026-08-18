namespace Apya.Platform.Calendars;

/// <summary>
/// Takvimin beslendiği kaynaklar. Her kaynak kendi iznine bağlıdır; izin yoksa
/// kaynak sorgusu HİÇ atılmaz (bkz. CalendarFeedProvider).
/// </summary>
public enum CalendarSourceType
{
    /// <summary>Son tarihi (DueDate) olan görevler.</summary>
    Task = 1,

    /// <summary>Fatura vadeleri.</summary>
    Invoice = 2,

    /// <summary>Hibe son tarihleri: başvuru çağrısı kapanışı + ara rapor (milestone).</summary>
    Grant = 3,

    /// <summary>Gider kayıtları (Expense.ExpenseDate).</summary>
    Expense = 4,

    /// <summary>Gelir kayıtları (IncomeEntry.IncomeDate).</summary>
    Income = 5,

    /// <summary>Kasa hareketleri (CashMovement.MovementDate).</summary>
    CashMovement = 6
}
