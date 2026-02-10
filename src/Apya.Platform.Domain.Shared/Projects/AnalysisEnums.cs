namespace Apya.Platform.Projects;

// Doküman Madde 21: Proje Türleri
public enum ProjectType
{
    ArGe = 1,
    Investment = 2,
    Digitalization = 3,
    ProductDev = 4,
    Hybrid = 5
}

// Doküman Madde 22: Proje Başlangıç Şekli
public enum ProjectCreationMethod
{
    Empty = 1,
    Template = 2,
    AiGenerated = 3
}

// Doküman Madde 23: AI Müdahale Seviyesi
public enum AiInterventionLevel
{
    SuggestionOnly = 1,
    WarningAndPriority = 2,
    AutoReschedule = 3
}