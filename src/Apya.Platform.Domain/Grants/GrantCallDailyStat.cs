using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Grants;

/// <summary>
/// 18c · Bir host çağrısının bir gündeki görüntülenme sayısı, kanal başına tek satır. Tek tek olay satırı
/// tutulmaz: huni yalnız "son N günde kaç kez, hangi kanaldan" sorusunu sorar.
///
/// <para>Kiracıya ait değildir (host analitiği); kiracının görüntülemesi de host çağrısının satırını artırır.
/// Soft delete YOK: tekil indeks <c>(GrantCallId, Day, Kind)</c> silinmiş satırla dolmasın.</para>
/// </summary>
public class GrantCallDailyStat : BasicAggregateRoot<Guid>
{
    public Guid GrantCallId { get; private set; }

    /// <summary>Günün başlangıcı (saat kısmı sıfır).</summary>
    public DateTime Day { get; private set; }

    public GrantCallStatKind Kind { get; private set; }

    public int Count { get; private set; }

    protected GrantCallDailyStat() { }

    public GrantCallDailyStat(Guid id, Guid grantCallId, DateTime day, GrantCallStatKind kind, int count)
        : base(id)
    {
        GrantCallId = grantCallId;
        Day = day.Date;
        Kind = kind;
        Count = count;
    }
}
