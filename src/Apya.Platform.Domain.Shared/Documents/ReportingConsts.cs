namespace Apya.Platform.Documents;

public static class ReportingConsts
{
    public const int MaxTemplateNameLength = 128;

    /// <summary>Kurum adı ("KOSGEB", "TÜBİTAK") — şablon künyesinde serbest metin.</summary>
    public const int MaxIssuerLength = 128;
    public const int MaxPackageNameLength = 160;
    public const int MaxAnnexNumberLength = 24;
    public const int MaxStoredFileNameLength = 260;
    public const int MaxIssueMessageLength = 300;

    /// <summary>Paylaşım linki token'ının SHA-256 özeti (hex). Token'ın kendisi SAKLANMAZ.</summary>
    public const int ShareTokenHashLength = 64;

    /// <summary>Süreli link varsayılan ömrü (gün).</summary>
    public const int DefaultShareLifetimeDays = 14;

    /// <summary>Bir teslim paketine konabilecek azami belge — ZIP üretimini korumak için.</summary>
    public const int MaxPackageItems = 500;
}
