namespace Apya.Platform;

/// <summary>
/// REV-006: Tüm iş mantığı hata kodları burada merkezi olarak tanımlanır.
/// ABP, "Platform:" prefix'ini otomatik olarak lokalizasyon kaynağına eşler
/// (PlatformDomainSharedModule → MapCodeNamespace("Platform", ...)).
/// </summary>
public static class PlatformDomainErrorCodes
{
    // --- Görev (Task) Modülü ---
    public const string TaskTitleRequired = "Platform:Task:TitleRequired";
    public const string TaskViewPrivateDenied = "Platform:Task:ViewPrivateDenied";
    public const string TaskViewImpersonationDenied = "Platform:Task:ViewImpersonationDenied";
    public const string TaskUpdateDenied = "Platform:Task:UpdateDenied";
    public const string TaskDeleteDenied = "Platform:Task:DeleteDenied";

    // --- Proje (Project) Modülü ---
    public const string ProjectNotFound = "Platform:Project:NotFound";
    public const string ProjectCodeAlreadyExists = "Platform:Project:CodeAlreadyExists";

    // --- Dosya (File) Modülü ---
    public const string FileUnsupportedExtension = "Platform:File:UnsupportedExtension";
    public const string FileSizeExceeded = "Platform:File:SizeExceeded";
}
