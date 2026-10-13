namespace Apya.Platform.Projects;

public static class ProjectIndicatorConsts
{
    public const int MaxNameLength = 128;
    public const int MaxUnitLength = 32;
    public const int MaxEntryNoteLength = 512;
}

/// <summary>PRJ-08 · Göstergenin hedefe göre durumu. Saklanmaz; ölçümlerden hesaplanır.</summary>
public enum ProjectIndicatorStatus
{
    /// <summary>Hedefe ulaşılmadı, hedef tarihi geçmedi (ya da tarih verilmedi).</summary>
    OnTrack = 0,

    /// <summary>Hedef tarihi geçti, hedefe ulaşılmadı.</summary>
    Behind = 1,

    /// <summary>Hedefe ulaşıldı.</summary>
    Completed = 2,
}
