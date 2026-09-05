using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Consents.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Consents;

/// <summary>
/// Rıza omurgası. <see cref="RemoteServiceAttribute"/> ile HTTP API'si KAPALI:
/// yazma Web sınırından (ConsentController — IP/UA sunucuda yakalanır), analiz ise
/// admin Razor sayfasından in-process çağrılır.
/// </summary>
[RemoteService(false)]
public class ConsentAppService : ApplicationService, IConsentAppService
{
    private readonly IRepository<ConsentRecord, Guid> _repository;

    public ConsentAppService(IRepository<ConsentRecord, Guid> repository)
    {
        _repository = repository;
    }

    public async Task RecordAsync(RecordConsentInput input)
    {
        var policyVersion = string.IsNullOrWhiteSpace(input.PolicyVersion)
            ? DefaultPolicyVersion(input.Type)
            : input.PolicyVersion!;

        var record = new ConsentRecord(
            GuidGenerator.Create(),
            input.Type,
            input.SubjectKind,
            input.SubjectId,
            policyVersion,
            input.Granted,
            Clock.Now,
            CurrentTenant.Id,
            input.AcceptedCategories,
            input.IpAddress,
            input.UserAgent,
            input.SourceRef);

        await _repository.InsertAsync(record, autoSave: true);
    }

    [Authorize(PlatformPermissions.Consents.Default)]
    public async Task<ConsentAnalyticsDto> GetAnalyticsAsync(ConsentAnalyticsFilter filter)
    {
        var windowDays = filter.WindowDays <= 0 ? 30 : filter.WindowDays;
        var since = Clock.Now.Date.AddDays(-(windowDays - 1));

        var query = await _repository.GetQueryableAsync();
        if (filter.Type.HasValue)
        {
            query = query.Where(x => x.Type == filter.Type.Value);
        }

        // Pencere içi kayıtları belleğe al (analiz kümesi küçük; tenant başına filtreli).
        var windowed = await AsyncExecuter.ToListAsync(query.Where(x => x.OccurredAt >= since));

        var dto = new ConsentAnalyticsDto
        {
            WindowDays = windowDays,
            TotalRecords = windowed.Count,
            GrantedCount = windowed.Count(x => x.Granted),
            DeclinedCount = windowed.Count(x => !x.Granted),
            ByType = windowed
                .GroupBy(x => x.Type)
                .Select(g => new ConsentTypeCountDto
                {
                    Type = g.Key,
                    Granted = g.Count(x => x.Granted),
                    Declined = g.Count(x => !x.Granted)
                })
                .OrderByDescending(x => x.Total)
                .ToList()
        };

        // Günlük trend — pencere boyunca boş günler dahil sıfırla doldurulur.
        var byDay = windowed
            .GroupBy(x => x.OccurredAt.Date)
            .ToDictionary(g => g.Key, g => g.Count());

        for (var day = since; day <= Clock.Now.Date; day = day.AddDays(1))
        {
            dto.Trend.Add(new ConsentTrendPointDto
            {
                Date = day,
                Count = byDay.TryGetValue(day, out var c) ? c : 0
            });
        }

        return dto;
    }

    private static string DefaultPolicyVersion(ConsentType type) => type switch
    {
        ConsentType.CookieNotice => ConsentConsts.CookiePolicyVersion,
        ConsentType.FormKvkk => ConsentConsts.KvkkPolicyVersion,
        ConsentType.AiTransfer => ConsentConsts.KvkkPolicyVersion,
        // Protokol onayları KENDİ sürümünü taşır: metin değişince KVKK aydınlatmasından
        // bağımsız artar, aksi halde hangi sözleşme metnine onay verildiği kaybolurdu.
        ConsentType.ServiceAgreement => ConsentConsts.ServiceAgreementPolicyVersion,
        ConsentType.ServiceAgreementKvkk => ConsentConsts.ServiceAgreementPolicyVersion,
        _ => ConsentConsts.KvkkPolicyVersion
    };
}
