using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// Kiracı: çağrıya ilgi bildirme ve kendi taleplerini izleme.
///
/// <para>Başvuruyu kiracı AÇMAZ; host talebi değerlendirip süreci başlatır
/// (<see cref="IGrantInterestHostAppService"/>).</para>
/// </summary>
public interface IGrantInterestAppService : IApplicationService
{
    Task<MyGrantInterestDto> ExpressAsync(ExpressGrantInterestInput input);

    Task<List<MyGrantInterestDto>> GetMineAsync();

    /// <summary>
    /// İlgiyi geri çeker. Yalnız karara bağlanmamış talep çekilebilir; sonra aynı
    /// çağrıya yeniden ilgi bildirilebilir (yeni kayıt açılır).
    /// </summary>
    Task<MyGrantInterestDto> WithdrawAsync(Guid id);

    /// <summary>
    /// 18e · Ön görüşme için üç saat önerir. Yalnız karara bağlanmamış talepte ve açık öneri yokken; danışman
    /// başka saat istediyse yeniden önerilebilir. Host'a bildirim gider.
    /// </summary>
    Task<GrantMeetingDto> ProposeMeetingAsync(ProposeGrantMeetingInput input);
}
