using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Proje bütçesi: kalem kırılımı, fonlama dilimleri, kesintiler ve revizyon geçmişi.
///
/// Okuma <c>Projects.ViewBudget</c>, yazma <c>Projects.Edit</c> iznine bağlıdır —
/// yeni izin açılmadı.
/// </summary>
public interface IProjectBudgetAppService : IApplicationService
{
    /// <summary>"Genel" sekmesinin tek çağrısı: KPI'lar + fonlama akışı + kalem tablosu.</summary>
    Task<ProjectBudgetOverviewDto> GetOverviewAsync(Guid projectId);

    Task<List<ProjectBudgetLineDto>> GetLinesAsync(Guid projectId);
    Task<ProjectBudgetLineDto> CreateLineAsync(Guid projectId, CreateUpdateBudgetLineDto input);
    Task<ProjectBudgetLineDto> UpdateLineAsync(Guid id, CreateUpdateBudgetLineDto input);

    /// <summary>Bağlı gider/gelir kaydı varsa <c>Platform:ProjectBudget:LineInUse</c> ile reddeder.</summary>
    Task DeleteLineAsync(Guid id);

    Task<List<FundingTrancheDto>> GetTranchesAsync(Guid projectId);
    Task<FundingTrancheDto> CreateTrancheAsync(Guid projectId, CreateUpdateTrancheDto input);
    Task<FundingTrancheDto> UpdateTrancheAsync(Guid id, CreateUpdateTrancheDto input);
    Task DeleteTrancheAsync(Guid id);

    /// <summary>Tahsilatı kaydeder; durum tutardan yeniden türetilir.</summary>
    Task<FundingTrancheDto> RegisterCollectionAsync(Guid trancheId, RegisterCollectionDto input);

    /// <summary>İtiraz işaretini koyar/kaldırır. Tutardan türemeyen tek durumdur.</summary>
    Task<FundingTrancheDto> SetDisputedAsync(Guid trancheId, bool disputed);

    Task<FundingTrancheDto> AddDeductionAsync(Guid trancheId, CreateDeductionDto input);
    Task<FundingTrancheDto> RemoveDeductionAsync(Guid deductionId);

    /// <summary>Kesintiyi "finanse edilmeyen" olarak kapatır — bütçe aynı kalır.</summary>
    Task<FundingTrancheDto> MarkDeductionUnfundedAsync(Guid deductionId);

    /// <summary>Kesinti kararını geri alır.</summary>
    Task<FundingTrancheDto> ReopenDeductionAsync(Guid deductionId);

    Task<List<BudgetRevisionDto>> GetRevisionsAsync(Guid projectId);

    /// <summary>
    /// Kalem tutarlarını değiştirir ve geçmiş kaydını üretir. Tek işlem:
    /// tutar + kayıt + (varsa) kesinti bağı birlikte olur ya da hiç olmaz.
    /// </summary>
    Task<BudgetRevisionDto> ApplyRevisionAsync(Guid projectId, ApplyBudgetRevisionDto input);
}
