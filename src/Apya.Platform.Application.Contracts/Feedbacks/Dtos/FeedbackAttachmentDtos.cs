using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Feedbacks.Dtos;

/// <summary>Detay ekranlarındaki ek listesi satırı. StoredFileName bilerek YOK — indirme id ile.</summary>
public class FeedbackAttachmentDto : EntityDto<Guid>
{
    public string FileName { get; set; } = string.Empty;
    public string? ContentType { get; set; }
    public long SizeBytes { get; set; }
    public DateTime CreationTime { get; set; }
}

/// <summary>
/// Gönderim sırasında beyan edilen, önceden yüklenmiş dosya. StoredFileName upload
/// handler'ının döndürdüğü rastgele addır; tahmin edilemez olduğu için sahiplik kanıtıdır.
/// </summary>
public class CreateFeedbackAttachmentDto
{
    [Required]
    [StringLength(FeedbackConsts.MaxFileNameLength)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [StringLength(FeedbackConsts.MaxFileNameLength)]
    public string StoredFileName { get; set; } = string.Empty;

    [StringLength(FeedbackConsts.MaxContentTypeLength)]
    public string? ContentType { get; set; }

    public long SizeBytes { get; set; }
}

/// <summary>İndirme handler'larının ihtiyacı: diskteki ad + kullanıcıya gösterilecek ad.</summary>
public class FeedbackAttachmentFileDto
{
    public string FileName { get; set; } = string.Empty;
    public string StoredFileName { get; set; } = string.Empty;
    public string? ContentType { get; set; }
}

/// <summary>Kullanıcının kendi kaydına eklediği açıklama.</summary>
public class AddMyCommentDto
{
    [Required]
    [StringLength(FeedbackConsts.MaxCommentLength)]
    public string Text { get; set; } = string.Empty;
}
