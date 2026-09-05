using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.RegistrationRequests.Dtos;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// Kayıt talepleri. <see cref="RemoteServiceAttribute"/> ile HTTP API'si KAPALI:
/// oluşturma oturumsuzdur ve IP/UA yalnız Web sınırında güvenilir yakalanır
/// (bkz. <c>Pages/Account/RegistrationRequest.cshtml.cs</c>); açık bir uç formu
/// atlayıp doğrudan kayıt üretmeye izin verirdi. Aynı gerekçe: <c>ConsentAppService</c>.
/// </summary>
[RemoteService(false)]
[Authorize(PlatformPermissions.RegistrationRequests.Default)]
public class RegistrationRequestAppService : PlatformAppService, IRegistrationRequestAppService
{
    private readonly IRepository<RegistrationRequest, Guid> _repository;
    private readonly RegistrationRequestManager _registrationRequestManager;

    public RegistrationRequestAppService(
        IRepository<RegistrationRequest, Guid> repository,
        RegistrationRequestManager registrationRequestManager)
    {
        _repository = repository;
        _registrationRequestManager = registrationRequestManager;
    }

    [AllowAnonymous]
    public async Task<Guid> CreateAsync(CreateRegistrationRequestDto input)
    {
        // Zorunlu değer tipleri DTO'da nullable: doğrulama mesajını kendimiz veriyoruz.
        // Buraya null geldiyse ModelState'i atlayan bir çağrı var demektir.
        Check.NotNull(input.RequestedPlan, nameof(input.RequestedPlan));
        Check.NotNull(input.CompanyType, nameof(input.CompanyType));

        var request = await _registrationRequestManager.CreateAsync(
            input.FullName.Trim(),
            input.AuthorizedTitle.Trim(),
            input.Email.Trim(),
            input.Phone.Trim(),
            input.CompanyName.Trim(),
            input.CompanyType!.Value,
            input.TaxNumber.Trim(),
            input.Address.Trim(),
            input.RequestedPlan!.Value,
            TrimToNull(input.IpAddress),
            TrimToNull(input.UserAgent),
            new RegistrationRequestOptionalDetails
            {
                TaxOffice = TrimToNull(input.TaxOffice),
                CorporateEmail = TrimToNull(input.CorporateEmail),
                CompanySize = input.CompanySize,
                OperationalContactName = TrimToNull(input.OperationalContactName),
                OperationalContactPhone = TrimToNull(input.OperationalContactPhone),
                Message = TrimToNull(input.Message)
            });

        return request.Id;
    }

    public async Task<PagedResultDto<RegistrationRequestDto>> GetListAsync(RegistrationRequestListFilterDto input)
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
                r.TaxNumber.Contains(filter) ||
                r.Email.Contains(filter) ||
                r.Phone.Contains(filter));
        }

        var totalCount = await AsyncExecuter.CountAsync(query);

        // En yeni talep en üstte: panelin işi "kimi henüz değerlendirmedik" sorusuna cevap vermek.
        var items = await AsyncExecuter.ToListAsync(
            query.OrderByDescending(r => r.CreationTime)
                 .Skip(input.SkipCount)
                 .Take(input.MaxResultCount));

        return new PagedResultDto<RegistrationRequestDto>(
            totalCount,
            ObjectMapper.Map<List<RegistrationRequest>, List<RegistrationRequestDto>>(items));
    }

    public async Task<RegistrationRequestDto> GetAsync(Guid id)
    {
        var request = await _repository.GetAsync(id);
        return ObjectMapper.Map<RegistrationRequest, RegistrationRequestDto>(request);
    }

    [Authorize(PlatformPermissions.RegistrationRequests.Manage)]
    public async Task<RegistrationRequestDto> UpdateAsync(Guid id, UpdateRegistrationRequestDto input)
    {
        var request = await _repository.GetAsync(id);

        request.SetStatus(input.Status);
        request.SetOffer(input.ApprovedPlan, input.OfferedAmount);
        request.SetAdminNote(TrimToNull(input.AdminNote));

        await _repository.UpdateAsync(request, autoSave: true);

        return ObjectMapper.Map<RegistrationRequest, RegistrationRequestDto>(request);
    }

    public async Task<RegistrationRequestSummaryDto> GetSummaryAsync()
    {
        var query = await _repository.GetQueryableAsync();

        var counts = await AsyncExecuter.ToListAsync(
            query.GroupBy(r => r.Status)
                 .Select(g => new { Status = g.Key, Count = g.Count() }));

        int CountOf(RegistrationRequestStatus status)
            => counts.FirstOrDefault(c => c.Status == status)?.Count ?? 0;

        return new RegistrationRequestSummaryDto
        {
            NewCount = CountOf(RegistrationRequestStatus.New),
            InReviewCount = CountOf(RegistrationRequestStatus.InReview),
            ApprovedCount = CountOf(RegistrationRequestStatus.Approved),
            RejectedCount = CountOf(RegistrationRequestStatus.Rejected),
            ClosedCount = CountOf(RegistrationRequestStatus.Closed)
        };
    }

    /// <summary>Boş/boşluk metni null'a indirger — DB'de "" ile null karışmasın.</summary>
    private static string? TrimToNull(string? value)
        => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
