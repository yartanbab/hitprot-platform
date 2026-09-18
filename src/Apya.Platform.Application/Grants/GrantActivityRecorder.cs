using System;
using System.Globalization;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Users;

namespace Apya.Platform.Grants;

/// <summary>
/// H-07 · Para olaylarını (onaylanan tutar, dilim ekle/değiştir/sil/öde) başvurunun akışına yazar.
/// Önceden hiçbiri iz bırakmıyordu: onaylanan tutar 500 binden 5 milyona çekilse kim, ne zaman, kaçtan kaça
/// sorusunun cevabı yoktu.
///
/// <para>Bağlam dile bağlı sözcük taşımaz — yalnız sıra no ve tutarlar; cümleyi istemci
/// <c>Grants:DetailHost:Activity:&lt;Kind&gt;</c> ile kurar. Tutarlar tr biçiminde (hibe tarafında para birimi
/// alanı yok, ekranlar ₺ yazıyor).</para>
/// </summary>
public class GrantActivityRecorder : ITransientDependency
{
    private static readonly CultureInfo Tr = CultureInfo.GetCultureInfo("tr-TR");

    private readonly IRepository<GrantApplicationActivity, Guid> _activityRepo;
    private readonly ICurrentUser _currentUser;
    private readonly IGuidGenerator _guidGenerator;

    public GrantActivityRecorder(
        IRepository<GrantApplicationActivity, Guid> activityRepo,
        ICurrentUser currentUser,
        IGuidGenerator guidGenerator)
    {
        _activityRepo = activityRepo;
        _currentUser = currentUser;
        _guidGenerator = guidGenerator;
    }

    public static string Money(decimal? amount) => amount.HasValue ? amount.Value.ToString("N0", Tr) + " ₺" : "—";

    public static string Tranche(int sequenceNo, string amounts) => $"#{sequenceNo} · {amounts}";

    /// <summary>Danışman eylemi olarak kaydeder; çağıran başvurunun kiracısını verir.</summary>
    public async Task RecordAsync(Guid? tenantId, Guid applicationId, GrantActivityKind kind, string context)
    {
        var actorName = string.IsNullOrWhiteSpace(_currentUser.Name)
            ? (_currentUser.UserName ?? "?")
            : $"{_currentUser.Name} {_currentUser.SurName}".Trim();

        await _activityRepo.InsertAsync(new GrantApplicationActivity(
            _guidGenerator.Create(), tenantId, applicationId, kind,
            _currentUser.GetId(), actorName, GrantPartyRole.Danisman, context), autoSave: true);
    }
}
