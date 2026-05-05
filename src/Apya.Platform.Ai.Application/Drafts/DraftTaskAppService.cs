using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp.Application.Services;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Local;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Apya.Platform.Tasks.Drafts;
using Volo.Abp;

namespace Apya.Platform.Ai.Drafts;

[Authorize(AiPermissions.Drafts.Default)]
public class DraftTaskAppService : ApplicationService, IDraftTaskAppService
{
    private readonly IBackgroundJobManager _backgroundJobManager;
    private readonly IRepository<DraftTaskItem, Guid> _draftTaskRepository;
    private readonly IRepository<ProjectAttachment, Guid> _projectAttachmentRepository;
    private readonly ILocalEventBus _localEventBus;

    public DraftTaskAppService(
        IBackgroundJobManager backgroundJobManager,
        IRepository<DraftTaskItem, Guid> draftTaskRepository,
        IRepository<ProjectAttachment, Guid> projectAttachmentRepository,
        ILocalEventBus localEventBus)
    {
        _backgroundJobManager = backgroundJobManager;
        _draftTaskRepository = draftTaskRepository;
        _projectAttachmentRepository = projectAttachmentRepository;
        _localEventBus = localEventBus;
    }

    public async Task<Guid> UploadPdfForExtractionAsync(UploadPdfInput input)
    {
        if (input.FileBytes == null || input.FileBytes.Length == 0)
            throw new UserFriendlyException("Yüklenen dosya boş olamaz.");

        var ext = System.IO.Path.GetExtension(input.FileName)?.ToLower();
        if (ext != ".pdf")
            throw new UserFriendlyException("Sadece PDF formatındaki dosyalar yapay zeka tarafından analiz edilebilir.");

        var batchId = GuidGenerator.Create();

        if (input.ProjectId.HasValue && !string.IsNullOrEmpty(input.StoredFileName))
        {
            await _projectAttachmentRepository.InsertAsync(new ProjectAttachment
            {
                ProjectId = input.ProjectId.Value,
                FileName = input.FileName,
                StoredFileName = input.StoredFileName,
                FileSize = input.FileBytes.Length
            });
        }

        await _backgroundJobManager.EnqueueAsync(new PdfTaskExtractionArgs
        {
            TenantId = CurrentTenant.Id,
            UserId = CurrentUser.Id ?? Guid.Empty,
            ProjectId = input.ProjectId,
            ImportBatchId = batchId,
            FileBlobName = input.StoredFilePath
        });

        Logger.LogInformation("AI görev çıkarma işlemi kuyruğa alındı. BatchId: {BatchId}", batchId);
        return batchId;
    }

    public async Task<List<DraftTaskDto>> GetPendingDraftsAsync(Guid batchId)
    {
        var drafts = await _draftTaskRepository.GetListAsync(x => x.ImportBatchId == batchId && !x.IsApproved);
        return drafts.Select(x => new DraftTaskDto
        {
            Id = x.Id,
            Title = x.Title,
            Description = x.Description,
            Priority = x.Priority,
            EstimatedHours = x.EstimatedHours,
            ImportBatchId = x.ImportBatchId
        }).ToList();
    }

    [Authorize(AiPermissions.Drafts.Approve)]
    public async Task ApproveDraftsAsync(ApproveDraftsInput input)
    {
        var drafts = await _draftTaskRepository.GetListAsync(x => x.ImportBatchId == input.BatchId && !x.IsApproved);
        var selectedDrafts = drafts.Where(d => input.SelectedDraftIds.Contains(d.Id)).ToList();

        // APYA-121: Publish integration event instead of directly creating TaskItem.
        // The Tasks bounded context owns task creation — AI just signals intent.
        foreach (var draft in selectedDrafts)
        {
            await _localEventBus.PublishAsync(new DraftApprovedEto
            {
                DraftId = draft.Id,
                TenantId = draft.TenantId,
                UserId = CurrentUser.Id,
                ProjectId = draft.ProjectId,
                Title = draft.Title,
                Description = draft.Description,
                Priority = draft.Priority,
                EstimatedHours = draft.EstimatedHours,
                ImportBatchId = draft.ImportBatchId
            });

            draft.MarkAsApproved();
            await _draftTaskRepository.UpdateAsync(draft);
        }

        // Clean up unselected drafts
        var unselectedDrafts = drafts.Where(d => !input.SelectedDraftIds.Contains(d.Id)).ToList();
        foreach (var unselected in unselectedDrafts)
            await _draftTaskRepository.DeleteAsync(unselected);

        Logger.LogInformation(
            "Approved {Approved}/{Total} drafts in batch {BatchId} (events published).",
            selectedDrafts.Count, drafts.Count, input.BatchId);
    }
}
