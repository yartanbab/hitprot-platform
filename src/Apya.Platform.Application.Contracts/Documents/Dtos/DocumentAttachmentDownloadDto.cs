namespace Apya.Platform.Documents;

/// <summary>
/// İndirme handler'ının diskten dosyayı okuyabilmesi için gereken minimum bilgi.
/// AppService bu DTO'yu döndürürken aynı zamanda DocumentAccessLog(Downloaded) kaydını yazar.
/// </summary>
public class DocumentAttachmentDownloadDto
{
    public string StoredFileName { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
}
