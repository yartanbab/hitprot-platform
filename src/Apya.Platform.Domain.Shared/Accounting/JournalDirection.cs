namespace Apya.Platform.Accounting;

/// <summary>
/// Bir journal entry line'ın yönü. Çift kayıt prensibi:
/// her entry içindeki Debit toplamı = Credit toplamı olmak ZORUNDADIR.
/// Aksi durumda LedgerIntegrityGuard exception fırlatır.
/// </summary>
public enum JournalDirection : byte
{
    Debit = 1,
    Credit = 2
}
