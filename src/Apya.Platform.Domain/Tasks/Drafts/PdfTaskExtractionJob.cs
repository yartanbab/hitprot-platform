using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.DependencyInjection;
using Apya.Platform.AI;

namespace Apya.Platform.Tasks.Drafts;

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
            // 1. PDF dosyasını kalıcı depodan oku (wwwroot/uploads)
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

            // 2. UglyToad.PdfPig ile PDF'ten metin çıkar
            var extractedText = string.Empty;
            using (var document = PdfDocument.Open(pdfBytes))
            {
                var textBuilder = new System.Text.StringBuilder();
                foreach (var page in document.GetPages())
                {
                    var text = ContentOrderTextExtractor.GetText(page);
                    textBuilder.AppendLine(text);
                }
                extractedText = textBuilder.ToString();
            }

            if (string.IsNullOrWhiteSpace(extractedText))
            {
                Logger.LogWarning("PDF dokümanından hiç metin çıkarılamadı. BatchId: {BatchId}", args.ImportBatchId);
                return;
            }

            // Çok büyük PDF'ler için token sınır kontrolü (yaklaşık 10.000 kelime / 40.000 karakter)
            if (extractedText.Length > 40000)
            {
                extractedText = extractedText.Substring(0, 40000);
                Logger.LogWarning("PDF metni çok uzundu, ilk 40.000 karakteri analiz edilecek. BatchId: {BatchId}", args.ImportBatchId);
            }

            // 3. AI Agent Manager ile görev çıkarımı
            var aiTasks = await _aiAgentManager.ExtractTasksFromTextAsync(extractedText);

            if (aiTasks == null || aiTasks.Count == 0)
            {
                Logger.LogWarning("AI, geçerli bir görev yapısı bulamadı. BatchId: {BatchId}", args.ImportBatchId);
                return;
            }

            // 4. DraftTasks tablosuna kaydet
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

            // NOT: Dosya silinmez — proje eki olarak kalıcıdır.
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "PdfTaskExtractionJob sırasında kritik hata. BatchId: {BatchId}", args.ImportBatchId);
            throw; // Job Manager'ın tekrar (retry) denemesi için fırlatıyoruz
        }
    }
}
