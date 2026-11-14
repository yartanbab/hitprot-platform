namespace Apya.Platform.DataTransfers;

public enum DataTransferDirection
{
    Export = 0,
    Import = 1
}

/// <summary>Şablonun dosya biçimi.</summary>
public enum DataTransferFileFormat
{
    Xlsx = 0,
    Csv = 1
}

public static class DataTransferConsts
{
    public const int MaxModuleKeyLength = 64;
    public const int MaxTemplateNameLength = 128;
    public const int MaxTemplateDescriptionLength = 512;
    public const int MaxFormatLength = 16;
    public const int MaxFileNameLength = 256;
    public const int MaxMessageLength = 1000;
}
