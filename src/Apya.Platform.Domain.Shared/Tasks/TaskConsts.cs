namespace Apya.Platform.Tasks;

/// <summary>Görev kurallarının sabitleri.</summary>
public static class TaskConsts
{
    /// <summary>
    /// Bir alt görevin ana görevden en fazla kaç üst görevi olabilir; yani alt görevler ana görevin
    /// altında en çok kaç düzey iç içe girer. Yeni alt görev bu sınırı aşıyorsa açılamaz.
    ///
    /// <para>İki şeyi korur: (1) alt görev ağacını eşleyen ya da dolaşan kod sınırsız derinlikte
    /// özyinelemesin (AutoMapper CVE-2026-32933: yeterince derin zincir yığını taşırır ve süreç
    /// çöker); (2) dış paylaşım ağacı <see cref="TaskShareConsts.MaxScopeDepth"/> adım yürüdüğü için
    /// hiçbir görevi sessizce kesmesin — bu yüzden bu sabit onu aşamaz
    /// (TaskAppService_SubtaskDepth_Tests koruyor).</para>
    ///
    /// <para>Yalnız OLUŞTURMA anında zorlanır; sınırdan derin mevcut zincirlere dokunulmaz.</para>
    /// </summary>
    public const int MaxSubTaskDepth = 10;
}
