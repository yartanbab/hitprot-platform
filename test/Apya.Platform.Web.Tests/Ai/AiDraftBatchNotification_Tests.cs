using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Drafts;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Ai;

/// <summary>
/// N-09 · Görev taslakları bitince başlatana kalıcı bildirim; başarısızlık bir kez (iş yeniden denenince
/// tekrar etmez); bildirim bağlantısı Görevler sayfasında inceleme penceresini açar.
/// </summary>
public class AiDraftBatchNotification_Tests : PlatformWebTestBase
{
    private async Task PublishAsync(Guid batchId, Guid userId, DraftBatchStatus status, int total = 0)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<ILocalEventBus>().PublishAsync(new DraftBatchStatusChangedEto
        {
            BatchId = batchId, TenantId = null, UserId = userId, NewStatus = status,
            TotalItems = total, ErrorMessage = status == DraftBatchStatus.Failed ? "Görev çıkarma işlemi sırasında bir hata oluştu." : null
        });
        await uow.CompleteAsync();
    }

    private async Task<Notification[]> RowsAsync(Guid batchId)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        return (await GetRequiredService<IRepository<Notification, Guid>>().GetListAsync(n => n.EntityId == batchId)).ToArray();
    }

    [Fact]
    public async Task Taslaklar_hazir_olunca_baslatana_bildirim_gider()
    {
        var batchId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        await PublishAsync(batchId, userId, DraftBatchStatus.Processing);
        await PublishAsync(batchId, userId, DraftBatchStatus.ReadyForReview, total: 7);

        var row = (await RowsAsync(batchId)).ShouldHaveSingleItem("işleniyor durumu bildirim üretmez");
        row.UserId.ShouldBe(userId);
        row.Type.ShouldBe(NotificationType.AiDraftsReady);
        row.Body.ShouldContain("7 görev taslağı");
        NotificationTypeRegistry.BuildDeepLink(NotificationType.AiDraftsReady, batchId).ShouldBe("/Tasks?drafts=" + batchId);
    }

    [Fact]
    public async Task Basarisizlik_yeniden_denemede_tekrarlanmaz()
    {
        var batchId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        await PublishAsync(batchId, userId, DraftBatchStatus.Failed);
        await PublishAsync(batchId, userId, DraftBatchStatus.Failed);

        (await RowsAsync(batchId)).ShouldHaveSingleItem().Type.ShouldBe(NotificationType.AiDraftsFailed);
    }

    [Fact]
    public void Gorevler_sayfasi_bildirimden_inceleme_penceresini_acar()
    {
        var js = File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(), "src", "Apya.Platform.Web", "Pages", "Tasks", "index.js"));
        js.ShouldContain("new URLSearchParams(window.location.search).get('drafts')");
        js.ShouldContain("reviewModal.open({ BatchId: draftsBatchId });");
        js.ShouldNotContain("İşlem zaman aşımına uğradı", customMessage: "iş sürüyor olabilir; hata değil bilgi verilir");
    }
}
