using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Expenses;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;

namespace Apya.Platform.Grants;

/// <summary>
/// 6c · Uygulama &amp; Tahsilat.
///
/// <para>İKİ TARAF TEK SERVİS: firma durumu OKUR, danışman rapor ve bölüm
/// durumlarını yazar. Rol <see cref="ICurrentTenant"/>'tan türetilir.</para>
///
/// <para>🔴 RAPOR ONAYLANMADAN DİLİM ÖDEMEYE ÇIKMAZ. Tasarımın kuralı bu; kapı
/// burada uygulanır (<see cref="MarkTranchePaidAsync"/>), entity yalnız bağı
/// taşır.</para>
///
/// <para>Bütçe gerçekleşmesi PROJEDEN okunur: harcama kaydı projede tutulur.
/// Başvuru henüz projeye dönüşmediyse gerçekleşme yoktur ve ekran bunu söyler —
/// başvurunun planlanan bütçesini "harcanan" gibi göstermek yanlış olurdu.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantImplementationAppService : ApplicationService, IGrantImplementationAppService
{
    /// <summary>Kullanım bu oranı aşınca kalem uyarılı gösterilir (tasarım 6c: %96).</summary>
    public const int NearLimitPercent = 90;

    /// <summary>Yükümlülük listesine bu kadar gün ilerisi girer.</summary>
    public const int ObligationHorizonDays = 90;

    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantReport, Guid> _reportRepo;
    private readonly IRepository<GrantReportSection, Guid> _sectionRepo;
    private readonly IRepository<GrantDisbursementTranche, Guid> _trancheRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<ProjectBudgetLine, Guid> _projectBudgetRepo;
    private readonly IRepository<Expense, Guid> _expenseRepo;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantImplementationAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantReport, Guid> reportRepo,
        IRepository<GrantReportSection, Guid> sectionRepo,
        IRepository<GrantDisbursementTranche, Guid> trancheRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<ProjectBudgetLine, Guid> projectBudgetRepo,
        IRepository<Expense, Guid> expenseRepo,
        ICurrentTenant currentTenant,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _appRepo = appRepo;
        _reportRepo = reportRepo;
        _sectionRepo = sectionRepo;
        _trancheRepo = trancheRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _projectBudgetRepo = projectBudgetRepo;
        _expenseRepo = expenseRepo;
        _currentTenant = currentTenant;
        _mtFilter = mtFilter;
    }

    private bool IsConsultant => _currentTenant.Id == null;

    public async Task<GrantImplementationDto> GetAsync(Guid applicationId)
    {
        var application = await GetApplicationAsync(applicationId);
        return await BuildAsync(application);
    }

    public async Task<GrantImplementationDto> SaveReportAsync(SaveGrantReportInput input)
    {
        EnsureConsultant();
        var application = await GetApplicationAsync(input.ApplicationId);

        if (input.ReportId.HasValue)
        {
            var existing = await GetReportAsync(input.ReportId.Value);
            existing.Update(input.Title, input.DueDate, input.TrancheId);
            await _reportRepo.UpdateAsync(existing, autoSave: true);
        }
        else
        {
            var reports = await GetReportsAsync(application.Id);
            await _reportRepo.InsertAsync(new GrantReport(
                GuidGenerator.Create(), application.TenantId, application.Id,
                input.TrancheId,
                reports.Count == 0 ? 1 : reports.Max(r => r.Order) + 1,
                input.Title, input.DueDate), autoSave: true);
        }

        return await BuildAsync(application);
    }

    public async Task<GrantImplementationDto> SetReportStatusAsync(SetGrantReportStatusInput input)
    {
        EnsureConsultant();
        var report = await GetReportAsync(input.ReportId);
        var application = await GetApplicationAsync(report.GrantApplicationId);

        report.SetStatus(input.Status, input.Note);
        await _reportRepo.UpdateAsync(report, autoSave: true);

        return await BuildAsync(application);
    }

    public async Task<GrantImplementationDto> AddSectionAsync(AddGrantReportSectionInput input)
    {
        EnsureConsultant();
        var report = await GetReportAsync(input.ReportId);
        var application = await GetApplicationAsync(report.GrantApplicationId);

        var sections = await GetSectionsAsync(new List<Guid> { report.Id });
        await _sectionRepo.InsertAsync(new GrantReportSection(
            GuidGenerator.Create(), application.TenantId, report.Id,
            sections.Count == 0 ? 1 : sections.Max(s => s.Order) + 1,
            input.Name), autoSave: true);

        return await BuildAsync(application);
    }

    public async Task<GrantImplementationDto> SetSectionStatusAsync(SetGrantReportSectionStatusInput input)
    {
        EnsureConsultant();
        var section = await GetSectionAsync(input.SectionId);
        var report = await GetReportAsync(section.ReportId);
        var application = await GetApplicationAsync(report.GrantApplicationId);

        section.SetStatus(input.Status, input.Note);
        await _sectionRepo.UpdateAsync(section, autoSave: true);

        return await BuildAsync(application);
    }

    /// <summary>Dilimi tahsil edildi olarak işaretler — raporu onaylanmamışsa reddeder.</summary>
    public async Task<GrantImplementationDto> MarkTranchePaidAsync(Guid trancheId)
    {
        EnsureConsultant();
        var tranche = await GetTrancheAsync(trancheId);
        var application = await GetApplicationAsync(tranche.GrantApplicationId);

        var reports = await GetReportsAsync(application.Id);
        var linked = reports.FirstOrDefault(r => r.TrancheId == tranche.Id);
        if (linked != null && linked.Status != GrantReportStatus.Onaylandi)
        {
            // 🔴 Rapor onaylanmadan dilim ödemeye çıkmaz (tasarım 6c).
            throw new BusinessException(PlatformDomainErrorCodes.GrantTranchePaymentBlockedByReport)
                .WithData("Report", linked.Title);
        }

        tranche.MarkPaid();
        await _trancheRepo.UpdateAsync(tranche, autoSave: true);

        return await BuildAsync(application);
    }

    // ------------------------------------------------------------------ yardımcılar

    private void EnsureConsultant()
    {
        if (!IsConsultant)
        {
            // Rapor durumunu ve tahsilatı danışman yürütür; firma okur.
            throw new AbpAuthorizationException();
        }
    }

    private async Task<GrantApplication> GetApplicationAsync(Guid id)
    {
        if (IsConsultant)
        {
            using (_mtFilter.Disable())
            {
                return await _appRepo.FirstOrDefaultAsync(a => a.Id == id)
                       ?? throw new EntityNotFoundException(typeof(GrantApplication), id);
            }
        }

        return await _appRepo.FirstOrDefaultAsync(a => a.Id == id)
               ?? throw new EntityNotFoundException(typeof(GrantApplication), id);
    }

    private async Task<GrantReport> GetReportAsync(Guid id)
    {
        using (_mtFilter.Disable())
        {
            return await _reportRepo.FirstOrDefaultAsync(r => r.Id == id)
                   ?? throw new EntityNotFoundException(typeof(GrantReport), id);
        }
    }

    private async Task<GrantReportSection> GetSectionAsync(Guid id)
    {
        using (_mtFilter.Disable())
        {
            return await _sectionRepo.FirstOrDefaultAsync(s => s.Id == id)
                   ?? throw new EntityNotFoundException(typeof(GrantReportSection), id);
        }
    }

    private async Task<GrantDisbursementTranche> GetTrancheAsync(Guid id)
    {
        using (_mtFilter.Disable())
        {
            return await _trancheRepo.FirstOrDefaultAsync(t => t.Id == id)
                   ?? throw new EntityNotFoundException(typeof(GrantDisbursementTranche), id);
        }
    }

    private async Task<List<GrantReport>> GetReportsAsync(Guid applicationId)
    {
        if (IsConsultant)
        {
            using (_mtFilter.Disable())
            {
                return (await _reportRepo.GetListAsync(r => r.GrantApplicationId == applicationId))
                    .OrderBy(r => r.Order).ToList();
            }
        }
        return (await _reportRepo.GetListAsync(r => r.GrantApplicationId == applicationId))
            .OrderBy(r => r.Order).ToList();
    }

    private async Task<List<GrantReportSection>> GetSectionsAsync(List<Guid> reportIds)
    {
        if (reportIds.Count == 0) { return new List<GrantReportSection>(); }

        if (IsConsultant)
        {
            using (_mtFilter.Disable())
            {
                return (await _sectionRepo.GetListAsync(s => reportIds.Contains(s.ReportId)))
                    .OrderBy(s => s.Order).ToList();
            }
        }
        return (await _sectionRepo.GetListAsync(s => reportIds.Contains(s.ReportId)))
            .OrderBy(s => s.Order).ToList();
    }

    private async Task<GrantImplementationDto> BuildAsync(GrantApplication application)
    {
        var today = Clock.Now.Date;
        var dto = new GrantImplementationDto
        {
            ApplicationId = application.Id,
            ApprovedAmount = application.ApprovedAmount ?? 0m,
            ContractStart = application.CreationTime.Date,
            CanManage = IsConsultant,
            HasProject = application.ProjectId.HasValue,
            ProjectId = application.ProjectId
        };

        using (_mtFilter.Disable())
        {
            var call = await _callRepo.FirstOrDefaultAsync(
                           c => c.Id == application.GrantCallId && c.TenantId == null)
                       ?? throw new EntityNotFoundException(typeof(GrantCall), application.GrantCallId);
            var grant = await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null)
                        ?? throw new EntityNotFoundException(typeof(Grant), call.GrantId);

            dto.GrantName = grant.Name;
            dto.Issuer = grant.Issuer;
            dto.Period = call.Period;
            dto.ContractEnd = grant.ProjectDurationMonths.HasValue
                ? dto.ContractStart?.AddMonths(grant.ProjectDurationMonths.Value)
                : null;
        }

        // --- Dilimler ve tahsilat ---
        List<GrantDisbursementTranche> tranches;
        if (IsConsultant)
        {
            using (_mtFilter.Disable())
            {
                tranches = (await _trancheRepo.GetListAsync(t => t.GrantApplicationId == application.Id))
                    .OrderBy(t => t.SequenceNo).ToList();
            }
        }
        else
        {
            tranches = (await _trancheRepo.GetListAsync(t => t.GrantApplicationId == application.Id))
                .OrderBy(t => t.SequenceNo).ToList();
        }

        dto.CollectedAmount = tranches
            .Where(t => t.Status == GrantDisbursementTrancheStatus.Odendi)
            .Sum(t => t.Amount);
        dto.RemainingAmount = Math.Max(0m, dto.ApprovedAmount - dto.CollectedAmount);
        dto.CollectedPercent = dto.ApprovedAmount > 0
            ? (int)Math.Round(dto.CollectedAmount / dto.ApprovedAmount * 100m)
            : 0;

        // --- Rapor-dilim zinciri ---
        var reports = await GetReportsAsync(application.Id);
        var sections = (await GetSectionsAsync(reports.Select(r => r.Id).ToList()))
            .GroupBy(s => s.ReportId).ToDictionary(g => g.Key, g => g.ToList());

        foreach (var report in reports)
        {
            var tranche = report.TrancheId.HasValue
                ? tranches.FirstOrDefault(t => t.Id == report.TrancheId.Value)
                : null;

            dto.Chain.Add(new GrantChainItemDto
            {
                ReportId = report.Id,
                Order = report.Order,
                Title = report.Title,
                DueDate = report.DueDate,
                Status = report.Status,
                Note = report.Note,
                TrancheId = tranche?.Id,
                TrancheAmount = tranche?.Amount,
                TrancheStatus = tranche?.Status,
                PaymentBlocked = tranche != null
                                 && tranche.Status != GrantDisbursementTrancheStatus.Odendi
                                 && report.Status != GrantReportStatus.Onaylandi,
                Sections = sections.GetValueOrDefault(report.Id, new())
                    .Select(s => new GrantReportSectionDto
                    {
                        Id = s.Id, Order = s.Order, Name = s.Name, Status = s.Status, Note = s.Note
                    }).ToList()
            });
        }

        // Rapora bağlanmamış dilimler zincirin sonunda ayrı halkalar olarak görünür;
        // aksi halde ekranda hiç yer almazlardı.
        foreach (var tranche in tranches.Where(t => reports.All(r => r.TrancheId != t.Id)))
        {
            dto.Chain.Add(new GrantChainItemDto
            {
                Order = dto.Chain.Count + 1,
                Title = string.Empty,
                TrancheId = tranche.Id,
                TrancheAmount = tranche.Amount,
                TrancheStatus = tranche.Status,
                DueDate = tranche.DueDate,
                Status = GrantReportStatus.Planlandi
            });
        }

        dto.Budget = await BuildBudgetAsync(application);
        dto.Obligations = BuildObligations(reports, tranches, today);

        return dto;
    }

    /// <summary>
    /// Bütçe gerçekleşmesi PROJEDEN okunur. Harcama kaydı projede tutulduğu için
    /// projeye dönüşmemiş başvuruda gerçekleşme YOKTUR; boş liste döner ve ekran
    /// bunu açıkça söyler.
    /// </summary>
    private async Task<List<GrantBudgetRealisationDto>> BuildBudgetAsync(GrantApplication application)
    {
        var result = new List<GrantBudgetRealisationDto>();
        if (!application.ProjectId.HasValue) { return result; }

        using (_currentTenant.Change(application.TenantId))
        {
            var lines = (await _projectBudgetRepo.GetListAsync(l => l.ProjectId == application.ProjectId.Value))
                .OrderBy(l => l.Order).ToList();
            if (lines.Count == 0) { return result; }

            var expenses = await _expenseRepo.GetListAsync(e => e.ProjectId == application.ProjectId.Value);
            var spentByLine = expenses
                .Where(e => e.BudgetLineId.HasValue)
                .GroupBy(e => e.BudgetLineId!.Value)
                .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));

            foreach (var line in lines)
            {
                var spent = spentByLine.GetValueOrDefault(line.Id);
                var usage = line.ApprovedAmount > 0
                    ? (int)Math.Round(spent / line.ApprovedAmount * 100m)
                    : 0;

                result.Add(new GrantBudgetRealisationDto
                {
                    Name = line.Name,
                    ApprovedAmount = line.ApprovedAmount,
                    SpentAmount = spent,
                    RemainingAmount = line.ApprovedAmount - spent,
                    UsagePercent = usage,
                    IsNearLimit = usage >= NearLimitPercent
                });
            }
        }

        return result;
    }

    /// <summary>
    /// Yaklaşan yükümlülükler: rapor teslim tarihleri + beklenen dilim tarihleri.
    /// Teminat/personel bildirimi gibi maddeler için repoda tarih taşıyan bir alan
    /// YOK; uydurmak yerine listeye girmiyorlar.
    /// </summary>
    private static List<GrantObligationDto> BuildObligations(
        List<GrantReport> reports, List<GrantDisbursementTranche> tranches, DateTime today)
    {
        var horizon = today.AddDays(ObligationHorizonDays);
        var list = new List<GrantObligationDto>();

        foreach (var report in reports.Where(r => r.DueDate.HasValue
                                                  && r.Status != GrantReportStatus.Onaylandi
                                                  && r.DueDate!.Value.Date <= horizon))
        {
            list.Add(new GrantObligationDto
            {
                Kind = GrantObligationKind.ReportDue,
                Label = report.Title,
                DueDate = report.DueDate!.Value,
                DaysLeft = (int)(report.DueDate.Value.Date - today).TotalDays,
                IsOverdue = report.DueDate.Value.Date < today
            });
        }

        foreach (var tranche in tranches.Where(t => t.DueDate.HasValue
                                                    && t.Status != GrantDisbursementTrancheStatus.Odendi
                                                    && t.DueDate!.Value.Date <= horizon))
        {
            list.Add(new GrantObligationDto
            {
                Kind = GrantObligationKind.TrancheDue,
                Label = tranche.SequenceNo.ToString(),
                DueDate = tranche.DueDate!.Value,
                DaysLeft = (int)(tranche.DueDate.Value.Date - today).TotalDays,
                IsOverdue = tranche.DueDate.Value.Date < today
            });
        }

        return list.OrderBy(o => o.DueDate).ToList();
    }
}
