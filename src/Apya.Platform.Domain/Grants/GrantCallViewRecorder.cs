using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;

namespace Apya.Platform.Grants;

/// <summary>
/// 18c · Çağrı detayı açıldığında hunideki görüntülenme sayısını artırır.
///
/// <para>Sayım BEST-EFFORT'tur: kendi iş biriminde yürür ve hata sayfayı düşürmez. Günün ilk iki
/// görüntülenmesi aynı anda gelirse ikinci satır tekil indekse takılır ve o tek sayım kaybolur; bu,
/// her görüntülemeye kilit almaktan ucuzdur.</para>
/// </summary>
public class GrantCallViewRecorder : DomainService
{
    private readonly IGrantCallDailyStatRepository _statRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IUnitOfWorkManager _unitOfWorkManager;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;

    public GrantCallViewRecorder(
        IGrantCallDailyStatRepository statRepository,
        IRepository<GrantCall, Guid> callRepository,
        IUnitOfWorkManager unitOfWorkManager,
        IDataFilter<IMultiTenant> multiTenantFilter)
    {
        _statRepository = statRepository;
        _callRepository = callRepository;
        _unitOfWorkManager = unitOfWorkManager;
        _multiTenantFilter = multiTenantFilter;
    }

    public async Task RecordAsync(Guid grantCallId, GrantCallStatKind kind)
    {
        try
        {
            using var uow = _unitOfWorkManager.Begin(requiresNew: true, isTransactional: false);

            // Adresteki kimlik rastgele olabilir: yalnız var olan HOST çağrısı sayılır. Süzgeç kapatılınca kapsam
            // tüm kiracılara genişler, TenantId == null elle konur.
            GrantCall? call;
            using (_multiTenantFilter.Disable())
            {
                call = await _callRepository.FindAsync(c => c.Id == grantCallId && c.TenantId == null);
            }

            if (call is null)
            {
                return;
            }

            await _statRepository.IncrementAsync(grantCallId, Clock.Now.Date, kind);
            await uow.CompleteAsync();
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "Çağrı görüntülenmesi sayılamadı. GrantCallId: {GrantCallId}, Kind: {Kind}", grantCallId, kind);
        }
    }
}
