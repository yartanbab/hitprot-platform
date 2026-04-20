using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Tasks.Drafts;

public interface IDraftTaskAppService : IApplicationService
{
    Task<Guid> UploadPdfForExtractionAsync(UploadPdfInput input);

    Task<List<DraftTaskDto>> GetPendingDraftsAsync(Guid batchId);

    Task ApproveDraftsAsync(ApproveDraftsInput input);
}

public class UploadPdfInput
{
    [Required]
    public byte[] FileBytes { get; set; }
    
    [Required]
    [StringLength(255)]
    public string FileName { get; set; }

    public Guid? ProjectId { get; set; }

    /// <summary>
    /// Web katmanı tarafından wwwroot/uploads altına kaydedilen benzersiz dosya adı.
    /// </summary>
    public string StoredFileName { get; set; }

    /// <summary>
    /// Disk üzerindeki tam dosya yolu (arka plan işlemi tarafından okunur).
    /// </summary>
    public string StoredFilePath { get; set; }
}

public class DraftTaskDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public TaskPriority Priority { get; set; }
    public double EstimatedHours { get; set; }
    public Guid ImportBatchId { get; set; }
}

public class ApproveDraftsInput
{
    [Required]
    public Guid BatchId { get; set; }
    
    [Required]
    public List<Guid> SelectedDraftIds { get; set; } = new();
}
