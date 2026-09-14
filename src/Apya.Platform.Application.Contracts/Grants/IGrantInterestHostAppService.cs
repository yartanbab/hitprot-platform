using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// Host: İlgi Talepleri kutusu. Talep değerlendirilir; süreç başlatılırsa başvuru
/// BURADA doğar, uygun bulunmazsa gerekçe firmaya bildirim olarak gider.
///
/// <para>🔴 HOST-ONLY: kutu kiracılar arası bakar.</para>
/// </summary>
public interface IGrantInterestHostAppService : IApplicationService
{
    /// <param name="onlyPending">true = yalnız karara bağlanmamış talepler.</param>
    Task<GrantInterestConsoleDto> GetAsync(bool onlyPending);

    Task<GrantInterestConsoleDto> StartReviewAsync(Guid interestId);

    /// <summary>Başvuru sürecini başlatır: kiracı bağlamında başvuru açılır.</summary>
    Task<GrantInterestConsoleDto> StartApplicationAsync(Guid interestId);

    Task<GrantInterestConsoleDto> RejectAsync(RejectGrantInterestInput input);

    /// <summary>18a · Tek talebin inceleme ekranı.</summary>
    Task<GrantInterestReviewDto> GetReviewAsync(Guid interestId);

    /// <summary>18a · İç not (firmaya gitmez). Boş not siler.</summary>
    Task<GrantInterestReviewDto> SaveNoteAsync(SaveGrantInterestNoteInput input);

    /// <summary>18a · Talebi başka danışmana devret; yalnız etkin host kullanıcısına.</summary>
    Task<GrantInterestReviewDto> AssignAsync(AssignGrantInterestInput input);

    /// <summary>18e · Firmanın önerdiği saatlerden birini onaylar; talep incelemeye alınır, firmaya bildirim gider.</summary>
    Task<GrantInterestReviewDto> ConfirmMeetingAsync(ConfirmGrantMeetingInput input);

    /// <summary>18e · Önerilen saatlere uymadığını notla bildirir; firma yeniden önerebilir.</summary>
    Task<GrantInterestReviewDto> RequestOtherMeetingTimeAsync(RequestGrantMeetingTimeInput input);
}
