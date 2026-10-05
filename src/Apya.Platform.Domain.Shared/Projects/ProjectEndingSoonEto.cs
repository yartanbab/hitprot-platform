using System;
using System.Collections.Generic;
using Volo.Abp.EventBus;

namespace Apya.Platform.Projects;

/// <summary>
/// 🔴 NTF-05 · Projenin bitiş tarihi yaklaşıyor.
///
/// <para>Bitiş tarihi ekranlarda gösteriliyordu ama hiçbir iş tarafından okunmuyordu:
/// kapanışa bir hafta kalmış proje için kimse uyarılmıyordu.</para>
///
/// <para><see cref="EndDate"/> ve <see cref="Threshold"/> tekillik anahtarının parçasıdır:
/// her eşik (30 / 14 / 3 gün) bitiş tarihi başına BİR KEZ bildirilir; bitiş tarihi
/// ertelenirse eşikler yeni tarih için yeniden çalışır.</para>
/// </summary>
[EventName("Apya.Platform.Projects.ProjectEndingSoon")]
public class ProjectEndingSoonEto
{
    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public DateTime EndDate { get; set; }

    /// <summary>Bitişe kalan tam gün. 0 = bugün bitiyor.</summary>
    public int DaysRemaining { get; set; }

    /// <summary>İçinde bulunulan eşik: 30, 14 ya da 3.</summary>
    public int Threshold { get; set; }

    /// <summary>Tamamlanmamış (Done / Cancelled olmayan) görev sayısı — kapanış hazırlığının ölçüsü.</summary>
    public int OpenTaskCount { get; set; }

    /// <summary>Proje liderleri + projeyi açan. Boşsa bildirim üretilmez (worker loglar).</summary>
    public List<Guid> RecipientIds { get; set; } = new();
}
