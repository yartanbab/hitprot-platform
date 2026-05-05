using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Ai.Drafts;

public class PdfTaskExtractionJob : AsyncBackgroundJob<PdfTaskExtractionArgs>, ITransientDependency
{
    private readonly TaskAiAgentManager _aiAgentManager;
    private readonly IRepository<DraftTaskItem, Guid> _draftTaskRepository;

    public PdfTaskExtractionJob(
        TaskAiAgentManager aiAgentManager,
        IRepository<DraftTaskItem, Guid> draftTaskRepository)
    {
        _aiAgentManager = aiAgentManager;
        _draftTaskRepository = draftTaskRepository;
    }

    public override async Task ExecuteAsync(PdfTaskExtractionArgs args)
    {
        Logger.LogInformation("PDF Task Extraction Job Started. BatchId: {BatchId}", args.ImportBatchId);

        try
        {
            if (!File.Exists(args.FileBlobName))
            {
                Logger.LogWarning("PDF dosyası bulunamadı. Path: {Path}", args.FileBlobName);
                return;
            }

            var pdfBytes = await File.ReadAllBytesAsync(args.FileBlobName);
            if (pdfBytes.Length == 0)
            {
                Logger.LogWarning("PDF dosyası boş. Path: {Path}", args.FileBlobName);
                return;
            }

            var extractedText = string.Empty;
            using (var document = PdfDocument.Open(pdfBytes))
            {
                var textBuilder = new System.Text.StringBuilder();
                foreach (var page in document.GetPages())
                {
                    textBuilder.AppendLine(ContentOrderTextExtractor.GetText(page));
                }
                extractedText = textBuilder.ToString();
            }

            if (string.IsNullOrWhiteSpace(extractedText))
            {
                Logger.LogWarning("PDF dokümanından hiç metin çıkarılamadı. BatchId: {BatchId}", args.ImportBatchId);
                return;
            }

            if (extractedText.Length > 40000)
            {
                extractedText = extractedText.Substring(0, 40000);
                Logger.LogWarning("PDF metni çok uzundu, ilk 40.000 karakteri analiz edilecek. BatchId: {BatchId}", args.ImportBatchId);
            }

            var aiTasks = await _aiAgentManager.ExtractTasksFromTextAsync(extractedText);

            if (aiTasks == null || aiTasks.Count == 0)
            {
                Logger.LogWarning("AI, geçerli bir görev yapısı bulamadı. BatchId: {BatchId}", args.ImportBatchId);
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

            Logger.LogInformation(
                "PDF Task Extraction Başarılı. {Count} taslak oluşturuldu. BatchId: {BatchId}",
                aiTasks.Count, args.ImportBatchId);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "PdfTaskExtractionJob sırasında kritik hata. BatchId: {BatchId}", args.ImportBatchId);
            throw;
        }
    }
}
