using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>22b · Talepler › Yanıt bekleyen süzgeci.</summary>
public class GetGrantRequestInboxInput
{
    public Guid? ConsultantUserId { get; set; }

    public Guid? GrantCallId { get; set; }

    /// <summary>true = kapanmış talepler (karara bağlanan, başvuruya dönen, geri çekilen, kaçırılan).</summary>
    public bool Closed { get; set; }
}

/// <summary>22b · İki sekmenin sayaçları — sekme başlığı her üç sayfada da aynı sayıyı göstersin diye tek uç.</summary>
public class GrantRequestTabCountsDto
{
    /// <summary>Yanıt bekleyen: açık ilgi talepleri + açık ön değerlendirme talepleri.</summary>
    public int PendingCount { get; set; }

    /// <summary>Yürüyen başvuru: panonun varsayılan görünümündeki (açık çağrılar) başvurular.</summary>
    public int RunningCount { get; set; }
}

public class GrantRequestInboxDto : GrantRequestTabCountsDto
{
    public List<GrantRequestRowDto> Items { get; set; } = new();

    /// <summary>Süresi dolmak üzere ya da dolmuş yanıtlanmamış talep sayısı (üst şerit).</summary>
    public int DueSoonCount { get; set; }

    /// <summary>Şeritteki danışman kırılımı. Atanmamış talepler adı boş tek satırda toplanır.</summary>
    public List<GrantRequestConsultantCountDto> DueSoonByConsultant { get; set; } = new();

    /// <summary>Süzgeç seçenekleri — süzgeçten bağımsız, tüm açık kayıtlardan.</summary>
    public List<GrantRequestOptionDto> Consultants { get; set; } = new();

    public List<GrantRequestOptionDto> Calls { get; set; } = new();
}

public class GrantRequestRowDto
{
    public GrantRequestKind Kind { get; set; }

    public Guid Id { get; set; }

    public string FirmName { get; set; } = string.Empty;

    /// <summary>İlgide proje fikrinin kendisi; ön değerlendirmede görüşülecek kişi.</summary>
    public string? Summary { get; set; }

    public Guid GrantCallId { get; set; }

    public string GrantName { get; set; } = string.Empty;

    public string? Period { get; set; }

    public Guid? ConsultantUserId { get; set; }

    public string? ConsultantName { get; set; }

    public DateTime CreationTime { get; set; }

    /// <summary>İlk yanıtın son anı (bir iş günü).</summary>
    public DateTime RespondBy { get; set; }

    public GrantResponseState Response { get; set; }

    /// <summary>Yalnız yanıtlanmamış talepte dolu; süre dolduysa 0.</summary>
    public int? HoursLeft { get; set; }
}

public class GrantRequestConsultantCountDto
{
    public string? Name { get; set; }

    public int Count { get; set; }
}

public class GrantRequestOptionDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;
}
