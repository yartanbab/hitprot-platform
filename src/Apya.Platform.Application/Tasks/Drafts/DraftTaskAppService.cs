using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp.Application.Services;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Volo.Abp;

namespace Apya.Platform.Tasks.Drafts;

[Authorize(PlatformPermissions.Projects.UseAiFeatures)]
public class DraftTaskAppService : ApplicationService, IDraftTaskAppService
{
    private readonly IBackgroundJobManager _backgroundJobManager;
    private readonly IRepository<DraftTaskItem, Guid> _draftTaskRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<ProjectAttachment, Guid> _projectAttachmentRepository;

    public DraftTaskAppService(
        IBackgroundJobManager backgroundJobManager,
        IRepository<DraftTaskItem, Guid> draftTaskRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<ProjectAttachment, Guid> projectAttachmentRepository)
    {
        _backgroundJobManager = backgroundJobManager;
        _draftTaskRepository = draftTaskRepository;
        _taskRepository = taskRepository;
        _projectAttachmentRepository = projectAttachmentRepository;
    }

    public async Task<Guid> UploadPdfForExtractionAsync(UploadPdfInput input)
    {
        if (input.FileBytes == null || input.FileBytes.Length == 0)
        {
            throw new UserFriendlyException("Yüklenen dosya boş olamaz.");
        }

        var ext = System.IO.Path.GetExtension(input.FileName)?.ToLower();
        if (ext != ".pdf")
        {
            throw new UserFriendlyException("Sadece PDF formatındaki dosyalar yapay zeka tarafından analiz edilebilir.");
        }

        var batchId = GuidGenerator.Create();

        // Dosyayı proje eki olarak kaydet (istediğiniz zaman açabilirsiniz)
        if (input.ProjectId.HasValue && !string.IsNullOrEmpty(input.StoredFileName))
        {
            await _projectAttachmentRepository.InsertAsync(new ProjectAttachment
            {
                ProjectId = input.ProjectId.Value,
                FileName = input.FileName,
                StoredFileName = input.StoredFileName,
                FileSize = input.FileBytes.Length
            });

            Logger.LogInformation(
                "PDF dosyası proje ekine kaydedildi. ProjeId: {ProjectId}, Dosya: {FileName}",
                input.ProjectId, input.FileName);
        }

        // Arka plan işlemini kuyruğa at
        await _backgroundJobManager.EnqueueAsync(new PdfTaskExtractionArgs
        {
            TenantId = CurrentTenant.Id,
            UserId = CurrentUser.Id ?? Guid.Empty,
            ProjectId = input.ProjectId,
            ImportBatchId = batchId,
            FileBlobName = input.StoredFilePath // Disk üzerindeki kalıcı yol
        });

        Logger.LogInformation(
            "AI görev çıkarma işlemi kuyruğa alındı. BatchId: {BatchId}, Dosya: {FileName}",
            batchId, input.FileName);

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

    public async Task ApproveDraftsAsync(ApproveDraftsInput input)
    {
        var drafts = await _draftTaskRepository.GetListAsync(x => x.ImportBatchId == input.BatchId && !x.IsApproved);

        var selectedDrafts = drafts.Where(d => input.SelectedDraftIds.Contains(d.Id)).ToList();

        foreach (var draft in selectedDrafts)
        {
            var newTask = new TaskItem(
                GuidGenerator.Create(),
                draft.Title,
                projectId: draft.ProjectId,
                parentTaskId: null,
                description: draft.Description,
                startDate: Clock.Now,
                dueDate: null,
                priority: draft.Priority,
                assigneeId: null,
                isPrivate: false
            );

            await _taskRepository.InsertAsync(newTask);

            draft.MarkAsApproved();
            await _draftTaskRepository.UpdateAsync(draft);
        }

        // Onaylanmayan taslakları temizle
        var unselectedDrafts = drafts.Where(d => !input.SelectedDraftIds.Contains(d.Id)).ToList();
        foreach (var unselected in unselectedDrafts)
        {
            await _draftTaskRepository.DeleteAsync(unselected);
        }
    }
}
