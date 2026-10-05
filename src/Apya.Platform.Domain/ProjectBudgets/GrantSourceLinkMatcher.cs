using System;
using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// 🔴 CNV-01 / FIN-04 · Kaynak kimliği alanları eklenmeden ÖNCE dönüştürülmüş projelerde
/// proje kaydını doğduğu hibe kaydıyla eşleştirir.
///
/// <para>Kural tek cümle: <b>emin değilsen bağlama.</b> Yanlış kurulmuş bir bağ, hiç
/// kurulmamış bağdan kötüdür — bağı okuyan ekran iki ilgisiz kaydı aynı şeymiş gibi
/// gösterir. Boş kalan alan ise yalnız "kaynağı bilinmiyor" demektir.</para>
///
/// <para>Saf fonksiyonlar: veri erişimi yok, kararın kendisi burada test edilir.</para>
/// </summary>
public static class GrantSourceLinkMatcher
{
    public readonly record struct GrantTranche(Guid Id, int SequenceNo, decimal Amount);

    public readonly record struct ProjectTranche(Guid Id, int SequenceNo, decimal PlannedAmount);

    public readonly record struct GrantLine(Guid Id, decimal Amount);

    public readonly record struct ProjectLine(Guid Id, decimal PlannedAmount);

    /// <summary>
    /// Dilim: SIRA numarası VE tutar birlikte tutmalı. Dönüşüm ikisini de bire bir
    /// kopyalar; kullanıcı sonradan dilimi silip aynı sıraya başka tutarla yenisini
    /// açtıysa o artık aynı dilim değildir ve bağlanmaz.
    /// </summary>
    /// <returns>proje dilimi kimliği → hibe dilimi kimliği</returns>
    public static Dictionary<Guid, Guid> MatchTranches(
        IReadOnlyCollection<GrantTranche> grantTranches,
        IReadOnlyCollection<ProjectTranche> projectTranches)
    {
        var result = new Dictionary<Guid, Guid>();

        // Aynı sıra numarasını iki kayıt taşıyorsa hangisinin kopya olduğu bilinemez.
        var grantBySequence = grantTranches
            .GroupBy(t => t.SequenceNo)
            .Where(g => g.Count() == 1)
            .ToDictionary(g => g.Key, g => g.Single());

        foreach (var group in projectTranches.GroupBy(t => t.SequenceNo).Where(g => g.Count() == 1))
        {
            var project = group.Single();

            if (grantBySequence.TryGetValue(project.SequenceNo, out var grant)
                && grant.Amount == project.PlannedAmount)
            {
                result[project.Id] = grant.Id;
            }
        }

        return result;
    }

    /// <summary>
    /// Bütçe kalemi: tutar HEM başvuruda HEM projede TEK bir satırı göstermeli.
    ///
    /// <para>Neden tutar: dönüşüm kalemin adını istemciden alır ve kodu sıra numarasıyla
    /// yazar; kaynağı gösteren tek kararlı iz kopyalanan tutardır. Projede kıyas noktası
    /// olarak <c>PlannedAmount</c> kullanılır — bütçe revizyonu onu DEĞİŞTİRMEZ.</para>
    ///
    /// <para>İki kalem aynı tutarı taşıyorsa (ör. ikisi de 50.000) hangisinin hangisinden
    /// doğduğu bilinemez; ikisi de bağlanmaz.</para>
    /// </summary>
    /// <returns>proje kalemi kimliği → başvuru bütçe satırı kimliği</returns>
    public static Dictionary<Guid, Guid> MatchBudgetLines(
        IReadOnlyCollection<GrantLine> grantLines,
        IReadOnlyCollection<ProjectLine> projectLines)
    {
        var result = new Dictionary<Guid, Guid>();

        var grantByAmount = grantLines
            .Where(l => l.Amount > 0)
            .GroupBy(l => l.Amount)
            .Where(g => g.Count() == 1)
            .ToDictionary(g => g.Key, g => g.Single());

        foreach (var group in projectLines.GroupBy(l => l.PlannedAmount).Where(g => g.Count() == 1))
        {
            var project = group.Single();

            if (grantByAmount.TryGetValue(project.PlannedAmount, out var grant))
            {
                result[project.Id] = grant.Id;
            }
        }

        return result;
    }
}
