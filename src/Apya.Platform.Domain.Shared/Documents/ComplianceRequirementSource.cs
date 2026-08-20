namespace Apya.Platform.Documents;

/// <summary>
/// Kontrol listesi kaleminin NEREDEN geldiği.
///
/// Kalemler tek tabloda yaşar; kaynak yalnızca kökenini söyler ve listede
/// gruplama/etiketleme için kullanılır. Ayrı tablolar kurmak, "zorunlu belge"
/// kavramını üründe ikiye bölerdi.
/// </summary>
public enum ComplianceRequirementSource
{
    /// <summary>Kurumun şablonu (KOSGEB, TÜBİTAK…) — sistem tohumu.</summary>
    InstitutionPackage = 1,

    /// <summary>Kiracının kendi klasör şeması / iç politikası.</summary>
    FolderSchema = 2,

    /// <summary>
    /// Bir göreve bağlı ek. <c>SourceEntityId</c> görevin kimliğidir.
    ///
    /// ⚠️ Bu kalem OTOMATİK karşılanamaz: <c>DocumentFile</c>'ın TaskId'si yok,
    /// dolayısıyla hangi belgenin görevin eki olduğu veriden türetilemez —
    /// yalnız elle bağlama ya da feragat ile kapanır.
    /// </summary>
    TaskAttachment = 3
}
