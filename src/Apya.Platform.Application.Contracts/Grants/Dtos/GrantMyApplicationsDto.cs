using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 6a · Kiracı · Başvurularım. Firmanın kendi başvuruları; her satır "sıradaki iş
/// kimde" sorusuna cevap verir.
/// </summary>
public class GrantMyApplicationsDto
{
    // --- Beşli KPI (tasarım 6a) ---
    public int OpenCount { get; set; }
    public int ApprovedCount { get; set; }

    /// <summary>Firmadan beklenen iş sayısı: evrak + doldurulmamış form bölümü.</summary>
    public int WaitingOnYouCount { get; set; }

    public decimal CollectedAmount { get; set; }

    /// <summary>En yakın son başvuru tarihine kalan gün; açık başvuru yoksa null.</summary>
    public int? NearestDeadlineDays { get; set; }

    public List<GrantMyApplicationRowDto> Items { get; set; } = new();
}

public class GrantMyApplicationRowDto
{
    public Guid Id { get; set; }
    public Guid GrantCallId { get; set; }
    public string GrantName { get; set; } = null!;
    public string Issuer { get; set; } = null!;
    public string? Period { get; set; }

    /// <summary>Şablon adımı; yoksa dört sabit aşamadan biri gösterilir.</summary>
    public string? StageName { get; set; }
    public GrantApplicationStage Stage { get; set; }

    /// <summary>Aşama ilerlemesi (%) — şablon varsa adım sırasından, yoksa enumdan.</summary>
    public int ProgressPercent { get; set; }

    /// <summary>Talep edilen destek; onaylandıysa onaylanan tutar.</summary>
    public decimal? Amount { get; set; }
    public bool IsApprovedAmount { get; set; }

    public DateTime? Deadline { get; set; }
    public int? DaysRemaining { get; set; }
    public DateTime? SubmittedAt { get; set; }

    // --- Sıradaki iş ---
    public GrantPartyRole PendingParty { get; set; }
    public GrantNextAction NextAction { get; set; }

    /// <summary>Sıradaki işin sayısal bağlamı (eksik evrak, boş alan sayısı).</summary>
    public int NextActionValue { get; set; }

    public string? AssignedUserName { get; set; }

    /// <summary>Dönüştürülmüş başvuruda proje kimliği — "Projeye git" bağlantısı.</summary>
    public Guid? ProjectId { get; set; }

    public decimal CollectedAmount { get; set; }
    public bool IsClosed { get; set; }
}

/// <summary>
/// 6a · Satırdaki "sıradaki iş". Cümle sunucuda kurulmaz; anahtar + sayı döner,
/// metni istemci yerelleştirir.
/// </summary>
public enum GrantNextAction
{
    /// <summary>Form bölümleri eksik — firma dolduracak.</summary>
    CompleteForm = 0,

    /// <summary>Zorunlu evrak bekleniyor — firma yükleyecek.</summary>
    UploadDocuments = 1,

    /// <summary>Danışmanda: inceleme ya da kuruma gönderim.</summary>
    WaitingOnConsultant = 2,

    /// <summary>Kurumdan yanıt bekleniyor.</summary>
    WaitingOnInstitution = 3,

    /// <summary>Proje yürütülüyor.</summary>
    InProject = 4,

    /// <summary>Kapandı; yapılacak iş yok.</summary>
    Done = 5
}
