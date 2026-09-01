using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.DemoRequests.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.DemoRequests;

/// <summary>
/// Demo talepleri. <see cref="RemoteServiceAttribute"/> ile HTTP API'si KAPALI:
/// oluşturma oturumsuzdur ve IP/UA yalnız Web sınırında güvenilir yakalanır
/// (bkz. <c>Pages/Account/DemoRequest.cshtml.cs</c>); açık bir uç formu atlayıp
/// doğrudan kayıt üretmeye izin verirdi. Aynı gerekçe: <c>ConsentAppService</c>.
/// </summary>
[RemoteService(false)]
[Authorize(PlatformPermissions.DemoRequests.Default)]
public class DemoRequestAppService : PlatformAppService, IDemoRequestAppService
{
    private readonly IRepository<DemoRequest, Guid> _repository;
    private readonly DemoRequestManager _demoRequestManager;

    public DemoRequestAppService(
        IRepository<DemoRequest, Guid> repository,
        DemoRequestManager demoRequestManager)
    {
        _repository = repository;
        _demoRequestManager = demoRequestManager;
    }

    [AllowAnonymous]
    public async Task<Guid> CreateAsync(CreateDemoRequestDto input)
    {
        var request = await _demoRequestManager.CreateAsync(
            input.FullName.Trim(),
            input.CompanyName.Trim(),
            input.Email.Trim(),
            input.Phone.Trim(),
            input.OrganizationKind,
            input.CompanySize,
            DemoRequestConsts.NormalizeModules(input.InterestedModules?.ToArray()),
            TrimToNull(input.Message),
            TrimToNull(input.IpAddress),
            TrimToNull(input.UserAgent),
            new DemoRequestProjectBrief
            {
                TargetAudience = TrimToNull(input.TargetAudience),
                ProblemStatement = TrimToNull(input.ProblemStatement),
                PlannedActivities = TrimToNull(input.PlannedActivities),
                BudgetRange = input.BudgetRange,
                ExpectedOutcomes = TrimToNull(input.ExpectedOutcomes)
            });

        return request.Id;
    }

    public async Task<PagedResultDto<DemoRequestDto>> GetListAsync(DemoRequestListFilterDto input)
    {
        var query = await _repository.GetQueryableAsync();

        if (input.Status.HasValue)
        {
            query = query.Where(r => r.Status == input.Status.Value);
        }

        if (!input.Filter.IsNullOrWhiteSpace())
        {
            var filter = input.Filter!.Trim();
            query = query.Where(r =>
                r.FullName.Contains(filter) ||
                r.CompanyName.Contains(filter) ||
                r.Email.Contains(filter) ||
                r.Phone.Contains(filter));
        }

        var totalCount = await AsyncExecuter.CountAsync(query);

        // En yeni talep en üstte: panelin işi "kimi henüz aramadık" sorusuna cevap vermek.
        var items = await AsyncExecuter.ToListAsync(
            query.OrderByDescending(r => r.CreationTime)
                 .Skip(input.SkipCount)
                 .Take(input.MaxResultCount));

        return new PagedResultDto<DemoRequestDto>(
            totalCount,
            ObjectMapper.Map<List<DemoRequest>, List<DemoRequestDto>>(items));
    }

    public async Task<DemoRequestDto> GetAsync(Guid id)
    {
        var request = await _repository.GetAsync(id);
        return ObjectMapper.Map<DemoRequest, DemoRequestDto>(request);
    }

    [Authorize(PlatformPermissions.DemoRequests.Manage)]
    public async Task<DemoRequestDto> UpdateAsync(Guid id, UpdateDemoRequestDto input)
    {
        var request = await _repository.GetAsync(id);

        request.SetStatus(input.Status);
        request.SetAdminNote(TrimToNull(input.AdminNote));

        await _repository.UpdateAsync(request, autoSave: true);

        return ObjectMapper.Map<DemoRequest, DemoRequestDto>(request);
    }

    public async Task<DemoRequestSummaryDto> GetSummaryAsync()
    {
        var query = await _repository.GetQueryableAsync();

        var counts = await AsyncExecuter.ToListAsync(
            query.GroupBy(r => r.Status)
                 .Select(g => new { Status = g.Key, Count = g.Count() }));

        return new DemoRequestSummaryDto
        {
            NewCount = counts.FirstOrDefault(c => c.Status == DemoRequestStatus.New)?.Count ?? 0,
            ContactedCount = counts.FirstOrDefault(c => c.Status == DemoRequestStatus.Contacted)?.Count ?? 0,
            ClosedCount = counts.FirstOrDefault(c => c.Status == DemoRequestStatus.Closed)?.Count ?? 0
        };
    }

    /// <summary>Boş/boşluk metni null'a indirger — DB'de "" ile null karışmasın.</summary>
    private static string? TrimToNull(string? value)
        => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
