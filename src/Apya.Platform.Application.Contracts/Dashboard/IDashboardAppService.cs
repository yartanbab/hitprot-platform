using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Dashboard.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Dashboard;

/// <summary>
/// /Dashboard ekranının tek okuma yüzeyi. Her bölüm kendi ucundan beslenir;
/// UI her bölüm için tek istek atar.
/// <para>
/// Sınıf seviyesi izin <c>Platform.Projects</c>; finansal alanlar servis içinde
/// <c>Platform.Invoices</c> / <c>Platform.Projects.ViewBudget</c> ile ayrıca kontrol edilir.
/// Yetki yoksa değer HESAPLANMAZ (sorgu atılmaz) ve null döner.
/// </para>
/// <para>
/// AI önerileri bu serviste DEĞİL — çekirdek modül AI modülüne referans vermez.
/// UI, <c>AiDashboardAppService</c>'i ayrı bir uçtan okur.
/// </para>
/// </summary>
public interface IDashboardAppService : IApplicationService
{
    Task<DashboardSummaryDto> GetSummaryAsync(DashboardQueryDto input);

    Task<List<DeliveryItemDto>> GetDeliveriesAsync(DashboardQueryDto input);

    Task<List<ProjectHealthDto>> GetProjectHealthAsync(DashboardQueryDto input);

    Task<List<PendingApprovalDto>> GetPendingApprovalsAsync();

    Task<List<BlockedTaskDto>> GetBlockedTasksAsync();

    Task<List<DashboardStatDto>> GetStatisticsAsync(DashboardQueryDto input);

    Task<IncomeExpenseDto> GetIncomeExpenseAsync(DashboardQueryDto input);

    Task<List<DeliveryHeatmapCellDto>> GetDeliveryHeatmapAsync(DashboardQueryDto input);

    Task<DashboardLayoutDto> GetLayoutAsync(string viewKey);

    Task SaveLayoutAsync(SaveDashboardLayoutInput input);

    Task ResetLayoutAsync(string viewKey);
}
