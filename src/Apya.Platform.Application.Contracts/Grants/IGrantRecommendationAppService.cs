using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>
/// Kiracı katalog yüzeyi (1d · 9a · 1e). Katalog host verisidir; kiracıya CANLI
/// hesaplanır, kalıcı değildir.
/// </summary>
public interface IGrantRecommendationAppService : IApplicationService
{
    /// <summary>Yalnız firmaya önerilen (skor >= eşik ya da host-push) açık çağrılar.</summary>
    Task<List<GrantRecommendationDto>> GetMyRecommendationsAsync();

    /// <summary>Host'un yayınladığı TÜM açık çağrılar; öneri olanlar IsRecommended ile işaretli.</summary>
    Task<List<GrantRecommendationDto>> GetOpenCallsAsync();

    /// <summary>1e · Tek çağrının detayı: uygunluk tablosu, bütçe kalemleri, süreç, uyum kırılımı.</summary>
    Task<GrantCallDetailDto> GetCallDetailAsync(Guid grantCallId);

    /// <summary>1e · Bütçe hesaplayıcısı: girilen tutarlardan destek tahmini (sihirbazla aynı hesap, kayıt yok).</summary>
    Task<GrantBudgetEstimateDto> EstimateBudgetAsync(EstimateGrantBudgetInput input);

    /// <summary>1d/9a · Takip işaretini açıp kapatır. Dönüş: yeni durum.</summary>
    Task<bool> ToggleBookmarkAsync(Guid grantCallId);

    /// <summary>13b · Takipteki çağrıya not düşer; boş not siler. Takipte değilse hata.</summary>
    Task SetBookmarkNoteAsync(SetGrantBookmarkNoteInput input);

    /// <summary>
    /// LIF-08 · Firma çağrıya "İlgilenmiyorum" der (gerekçe zorunlu). Danışman önerisi de,
    /// otomatik öneri de olabilir; olay kaydı tutulur, danışman önerisi "Kapatıldı" olur.
    /// Yalnız yayındaki açık çağrı kapatılır; başvurulmuş çağrıda bir şey yapmaz.
    /// </summary>
    Task DismissRecommendationAsync(DismissGrantRecommendationInput input);

    /// <summary>"Geri al": kapatılan çağrı akışa döner. Kapalı değilse bir şey yapmaz.</summary>
    Task RestoreRecommendationAsync(Guid grantCallId);

    /// <summary>
    /// H-07 · Firma çağrının ayrıntısını açtı: danışmanın bu çağrı için gönderdiği yeni öneri
    /// "Görüldü" olur. Öneri yoksa bir şey yapmaz (ayrıntı her açılışta çağırır).
    /// </summary>
    Task MarkRecommendationSeenAsync(Guid grantCallId);
}
