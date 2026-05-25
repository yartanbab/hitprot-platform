using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus.Local;

namespace Apya.Platform.Ai.Drafts;

public class PdfTaskExtractionJob : AsyncBackgroundJob<PdfTaskExtractionArgs>, ITransientDependency
{
    private readonly TaskAiAgentManager _aiAgentManager;
    private readonly IRepository<DraftTaskItem, Guid> _draftTaskRepository;
    private readonly ILocalEventBus _localEventBus;

    public PdfTaskExtractionJob(
        TaskAiAgentManager aiAgentManager,
        IRepository<DraftTaskItem, Guid> draftTaskRepository,
        ILocalEventBus localEventBus)
    {
        _aiAgentManager = aiAgentManager;
        _draftTaskRepository = draftTaskRepository;
        _localEventBus = localEventBus;
    }

    public override async Task ExecuteAsync(PdfTaskExtractionArgs args)
    {
        Logger.LogInformation("PDF Task Extraction Job Started. BatchId: {BatchId}", args.ImportBatchId);

        await PublishStatusAsync(args, DraftBatchStatus.Processing, totalItems: 0, errorMessage: null);

        try
        {
            if (!File.Exists(args.FileBlobName))
            {
                Logger.LogWarning("PDF dosyası bulunamadı. Path: {Path}", args.FileBlobName);
                await PublishStatusAsync(args, DraftBatchStatus.Failed, 0, "PDF dosyası bulunamadı.");
                return;
            }

            var pdfBytes = await File.ReadAllBytesAsync(args.FileBlobName);
            if (pdfBytes.Length == 0)
            {
                await PublishStatusAsync(args, DraftBatchStatus.Failed, 0, "PDF dosyası boş.");
                return;
            }

            var extractedText = string.Empty;
            using (var document = PdfDocument.Open(pdfBytes))
            {
                var textBuilder = new System.Text.StringBuilder();
                foreach (var page in document.GetPages())
                    textBuilder.AppendLine(ContentOrderTextExtractor.GetText(page));
                extractedText = textBuilder.ToString();
            }

            if (string.IsNullOrWhiteSpace(extractedText))
            {
                await PublishStatusAsync(args, DraftBatchStatus.Abandoned, 0, "PDF'ten metin çıkarılamadı.");
                return;
            }

            var aiTasks = await _aiAgentManager.ExtractTasksFromTextAsync(
                extractedText,
                correlationId: args.ImportBatchId);

            if (aiTasks == null || aiTasks.Count == 0)
            {
                await PublishStatusAsync(args, DraftBatchStatus.Abandoned, 0, "AI geçerli görev bulamadı.");
                return;
            }

            foreach (var aiTask in aiTasks)
            {
                var draft = new DraftTaskItem(
                    Guid.NewGuid(),
                    args.ImportBatchId,
                    aiTask.Title,
                    aiTask.Description,
                    aiTask.Priority,
                    aiTask.EstimatedHours,
                    args.ProjectId,
                    args.TenantId
                );
                await _draftTaskRepository.InsertAsync(draft);
            }

            Logger.LogInformation("PDF Task Extraction Başarılı. {Count} taslak. BatchId: {BatchId}",
                aiTasks.Count, args.ImportBatchId);

            await PublishStatusAsync(args, DraftBatchStatus.ReadyForReview, aiTasks.Count, null);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "PdfTaskExtractionJob hata. BatchId: {BatchId}", args.ImportBatchId);
            // ARCH-040: ex.Message frontend'e sızdırılmamalı — iç hata detayı (stack path,
            // DB bağlantı bilgisi vb.) SignalR üzerinden tarayıcıya gidebilir.
            await PublishStatusAsync(args, DraftBatchStatus.Failed, 0, "Görev çıkarma işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
            throw;
        }
    }

    private Task PublishStatusAsync(PdfTaskExtractionArgs args, DraftBatchStatus status, int totalItems, string? errorMessage)
    {
        return _localEventBus.PublishAsync(new DraftBatchStatusChangedEto
        {
            BatchId = args.ImportBatchId,
            TenantId = args.TenantId,
            UserId = args.UserId,
            NewStatus = status,
            TotalItems = totalItems,
            ApprovedItems = 0,
            ErrorMessage = errorMessage
        });
    }
}
