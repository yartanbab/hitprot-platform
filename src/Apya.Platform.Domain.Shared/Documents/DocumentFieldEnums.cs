namespace Apya.Platform.Documents;

/// <summary>Meta şema alanının veri tipi — değerin hangi kolonda saklandığını da belirler.</summary>
public enum DocumentFieldType
{
    Text = 1,
    Date = 2,
    Money = 3,
    Number = 4,
    Percent = 5,
    Select = 6,
    Relation = 7
}

/// <summary>
/// Alanın nereden dolduğu. Faz A'da yalnız Manual gerçekten çalışır;
/// Ocr/Ai/Rule seed'de tanımlıdır ve UI'da rozet olarak gösterilir,
/// otomatik doldurma Faz D'de (kural motoru) devreye girer.
/// </summary>
public enum DocumentFieldFillSource
{
    Manual = 1,
    Ocr = 2,
    Ai = 3,
    Rule = 4
}

/// <summary>
/// Alanın varsayılan görünürlüğü. Rol × alan matrisi Faz D'de
/// (DocumentFieldPermission) gelir; buradaki değer o matris yokken
/// uygulanan varsayılandır.
/// </summary>
public enum DocumentFieldVisibility
{
    Everyone = 1,
    Restricted = 2,
    Confidential = 3
}
