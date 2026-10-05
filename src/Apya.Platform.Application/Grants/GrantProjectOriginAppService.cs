using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 🔴 DOC-02 · Projeden hibeye giden köprü.
///
/// <para>Dönüşüm özeti kullanıcıya "evrak başvuruda kalır, projeden erişilir" diye söz
/// veriyordu; söz tutulmadığı için metin bir tur önce geri çekilmişti. Bağın kendisi
/// zaten vardı (<c>GrantApplication.ProjectId</c>, indeksli) — eksik olan tüketiciydi.
/// Bu servis o bağı ters yönden okur, ŞEMA DEĞİŞMEDEN.</para>
///
/// <para>Kiracı bağlamında filtre AÇIK kalır: kullanıcı yalnız kendi başvurusunu görür.
/// Host bağlamında proje konsolu zaten kiracı filtresini kapatarak açıldığı için
/// (<c>ProjectAppService.GetDetailAsync</c>) burada da kapatılır; aksi hâlde host,
/// gördüğü projenin hibesini göremezdi.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantProjectOriginAppService : ApplicationService, IGrantProjectOriginAppService
{
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantProjectOriginAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantApplicationDocument, Guid> docRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _appRepo = appRepo;
        _docRepo = docRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _mtFilter = mtFilter;
    }

    public async Task<GrantProjectOriginDto?> GetByProjectAsync(Guid projectId)
    {
        if (projectId == Guid.Empty)
        {
            return null;
        }

        GrantApplication? application;
        using (CurrentTenant.Id == null ? _mtFilter.Disable() : null)
        {
            application = await _appRepo.FirstOrDefaultAsync(a => a.ProjectId == projectId);
        }

        if (application == null)
        {
            return null;
        }

        // Katalog host'a ait (TenantId null); kiracı bağlamında filtre onu gizlerdi.
        using (_mtFilter.Disable())
        {
            var call = await _callRepo.FirstOrDefaultAsync(
                c => c.Id == application.GrantCallId && c.TenantId == null);
            var grant = call == null
                ? null
                : await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null);

            return new GrantProjectOriginDto
            {
                ApplicationId = application.Id,
                // Katalog kaydı sonradan silinmiş olsa bile şerit basılır: bağ denetim izidir,
                // program adı kaybolduğunda yerine genel etiket konur.
                GrantName = grant?.Name ?? L["Grants:Origin:UnknownProgram"],
                CallPeriod = call?.Period,
                DocumentCount = (int)await _docRepo.CountAsync(d => d.GrantApplicationId == application.Id)
            };
        }
    }
}
