namespace Apya.Platform.CashMovements;

/// <summary>APYA-134: Hareket yönü — kasaya giriş veya kasadan çıkış.</summary>
public enum CashMovementDirection
{
    In = 0,
    Out = 1,
}

/// <summary>APYA-134: Hareketin kaynağı. Manuel girişler + ileride otomatik (APYA-136).</summary>
public enum CashMovementSource
{
    Manual = 0,
    Invoice = 1,
    Expense = 2,
    Transfer = 3,
}
