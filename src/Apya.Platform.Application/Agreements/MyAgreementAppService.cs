using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Agreements.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Agreements;

/// <summary>
/// Kiracının kendi hizmet protokolü. Salt okunur ve TEK kayıt döner.
///
/// <para>🔴 Sözleşme host kaydıdır (<c>IMultiTenant</c> DEĞİL) — ABP'nin kiracı filtresi bu
/// sorguyu KORUMAZ. Eşleştirme <c>CurrentTenant.Id</c> ile ELLE yapılır; filtreye güvenmek
/// bir kiracıya başkasının sözleşmesini açardı.</para>
/// </summary>
[Authorize(PlatformPermissions.TenantSettings.Default)]
public class MyAgreementAppService : PlatformAppService, IMyAgreementAppService
{
    private readonly IRepository<ServiceAgreement, Guid> _repository;
    private readonly ProtocolRenderer _renderer;

    public MyAgreementAppService(
        IRepository<ServiceAgreement, Guid> repository,
        ProtocolRenderer renderer)
    {
        _repository = repository;
        _renderer = renderer;
    }

    public async Task<MyAgreementDto?> GetAsync()
    {
        var tenantId = CurrentTenant.Id;
        if (tenantId == null)
        {
            // Host bağlamında "benim sözleşmem" diye bir şey yok.
            return null;
        }

        var query = await _repository.GetQueryableAsync();

        // En yeni sözleşme: yenileme geldiğinde kiracının birden fazla kaydı olabilir.
        var agreement = await AsyncExecuter.FirstOrDefaultAsync(
            query.Where(a => a.TenantId == tenantId)
                 .OrderByDescending(a => a.ApprovedAt));

        if (agreement == null)
        {
            return null;
        }

        return new MyAgreementDto
        {
            Number = agreement.Number,
            PlanName = SalesPlanCatalog.DisplayName(agreement.Plan),
            Amount = agreement.Amount,
            SuccessFeePercent = agreement.SuccessFeePercent,
            StartDate = agreement.StartDate,
            EndDate = agreement.EndDate,
            Status = agreement.Status,
            ApproverName = agreement.ApproverName,
            ApproverTitle = agreement.ApproverTitle,
            ApprovedAt = agreement.ApprovedAt,
            ApprovedIp = agreement.ApprovedIp,
            ContentHash = agreement.ContentHash,
            RenderedHtml = agreement.RenderedHtml,
            HashVerified = _renderer.VerifyHash(agreement.RenderedHtml, agreement.ContentHash)
        };
    }
}
