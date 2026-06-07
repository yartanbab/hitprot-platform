namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Defines the available block types for an AppDocument form element or content area.
/// NOTE: Underlying integer values are STABLE — never reuse/renumber existing values,
/// since they are persisted on <see cref="AppBlock"/> rows. Renaming a member is safe
/// (no code references members by name; frontend maps to ints), but renumbering is not.
/// </summary>
public enum BlockType
{
    // --- Mevcut tipler (değerler sabit; eski isimler ShortText/LongText olarak netleştirildi) ---
    ShortText = 0,   // (eski: Input) tek satır kısa metin
    LongText = 1,    // (eski: TextArea) çok satır uzun metin
    Select = 2,      // tekli seçim (radio)
    MultiSelect = 3, // çoklu seçim (checkbox)
    DatePicker = 4,
    FilePicker = 5,
    TableGrid = 6,
    RichText = 7,

    // --- Yeni tipler ---
    Number = 8,        // sayısal alan
    Email = 9,         // e-posta (format doğrulamalı)
    Phone = 10,        // telefon
    TimePicker = 11,   // saat
    Rating = 12,       // yıldız/puan derecelendirme
    Nps = 13,          // Net Promoter Score (0-10)
    Signature = 14,    // imza (canvas)
    Address = 15,      // çok alanlı adres
    SectionHeader = 16,// bölüm başlığı (sadece görsel)
    Paragraph = 17,    // açıklama metni (sadece görsel)
    Dropdown = 18      // açılır liste (Select'ten ayrı render)
}
