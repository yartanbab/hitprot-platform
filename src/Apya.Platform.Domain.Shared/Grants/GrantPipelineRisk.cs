namespace Apya.Platform.Grants;

/// <summary>
/// 2c · Pipeline kartındaki risk sinyalleri. Sinyal, kartın SORUNLU olduğunu değil
/// DİKKAT istediğini söyler; host hangisine bakacağına kendisi karar verir.
/// </summary>
public enum GrantPipelineRisk
{
    /// <summary>Son başvuruya kalan gün eşiğin altında.</summary>
    DeadlineNear = 0,

    /// <summary>Son başvuru geçmiş ama başvuru hâlâ gönderilmemiş.</summary>
    DeadlinePassed = 1,

    /// <summary>Bekleyen zorunlu evrak var.</summary>
    MissingDocuments = 2,

    /// <summary>Sıra firmada ve firma hareketsiz — danışman dokunmalı.</summary>
    WaitingOnFirm = 3,

    /// <summary>Başvuruya danışman atanmamış.</summary>
    Unassigned = 4
}
