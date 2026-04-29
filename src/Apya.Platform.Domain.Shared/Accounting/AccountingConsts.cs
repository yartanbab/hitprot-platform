namespace Apya.Platform.Accounting;

/// <summary>
/// Accounting modülüne ait sabitler.
/// Tablo prefix'i ana platform prefix'inden ayrı tutulur ki ledger şeması
/// ileride ayrı bir veritabanına/şemaya çekilebilsin (write/read split, sharding).
/// </summary>
public static class AccountingConsts
{
    public const string DbTablePrefix = "AppLedger";
    public const string DbSchema = null!;

    /// <summary>
    /// Money.Amount alanı için zorunlu maksimum ondalık basamak sayısı.
    /// Basis-point hesaplamalarına izin verir, fakat sınırsız precision kabul etmez —
    /// sub-cent yuvarlama farkı oluşturmamak için.
    /// </summary>
    public const int MoneyMaxScale = 4;

    /// <summary>
    /// Currency code uzunluğu (ISO 4217).
    /// </summary>
    public const int CurrencyCodeLength = 3;

    /// <summary>
    /// Bir journal entry'de izin verilen maksimum satır sayısı.
    /// Hem performans hem de operatör hatalarına karşı koruma.
    /// </summary>
    public const int MaxLinesPerEntry = 1000;

    /// <summary>
    /// Idempotency key için maksimum karakter uzunluğu.
    /// </summary>
    public const int IdempotencyKeyMaxLength = 128;
}
