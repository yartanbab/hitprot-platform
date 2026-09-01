using System;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Kur köprüsü: proje bazlı kur politikası ve üç defter görünümü.
///
/// Kurun KENDİSİ burada üretilmez — kaynak her zaman mevcut Kurlar sayfasıdır
/// (<c>ExchangeRate</c>). Bu servis yalnız "hangi günün kuru" sorusunu
/// politikayla yanıtlar ve sonucu kayda yazar.
/// </summary>
public interface IProjectFxAppService : IApplicationService
{
    Task<ProjectFxPolicyDto> GetPolicyAsync(Guid projectId);

    Task<ProjectFxPolicyDto> UpdatePolicyAsync(Guid projectId, UpdateProjectFxPolicyDto input);

    /// <summary>"Kur köprüsü" sekmesinin tek çağrısı.</summary>
    Task<ProjectFxBridgeDto> GetBridgeAsync(Guid projectId);

    /// <summary>
    /// Kilitli kayıtların donör karşılığını yürürlükteki politikayla YENİDEN
    /// hesaplar. Politika değişikliği kayıtları kendiliğinden değiştirmez;
    /// bu, açıkça istenen bir işlemdir.
    /// </summary>
    Task<FxRecalculationResultDto> RecalculateAsync(Guid projectId);
}
