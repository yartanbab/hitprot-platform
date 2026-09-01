using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

/// <summary>1a · Kaynak listesi satırı.</summary>
public class GrantSourceDto : EntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string? Url { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastScrapedAt { get; set; }

    /// <summary>Mono baş harf kutusu.</summary>
    public string Initial { get; set; } = string.Empty;

    /// <summary>Bu kaynaktan gelen toplam çağrı — satırdaki "N çağrı".</summary>
    public int CallCount { get; set; }

    /// <summary>Son koşunun durumu. null = kaynak hiç taranmadı.</summary>
    public GrantScrapeRunStatus? LastRunStatus { get; set; }

    /// <summary>Son koşuda ilk kez eklenen taslak sayısı — "N yeni" chip'i.</summary>
    public int LastRunNewCount { get; set; }
}

public class CreateUpdateGrantSourceDto
{
    [Required(ErrorMessage = "Kaynak adı zorunludur.")]
    [StringLength(96, ErrorMessage = "Kaynak adı en fazla {1} karakter olabilir.")]
    public string Name { get; set; } = string.Empty;

    [StringLength(512, ErrorMessage = "Adres en fazla {1} karakter olabilir.")]
    public string? Url { get; set; }

    public bool IsActive { get; set; } = true;
}

/// <summary>1a · Konsolun tek yükü: KPI'lar, kaynak listesi ve taslak kuyruğu.</summary>
public class GrantSourceConsoleDto
{
    public int ActiveSourceCount { get; set; }
    public int DraftQueueCount { get; set; }
    public int PublishedCallCount { get; set; }

    /// <summary>Son 7 günde eklenen ya da güncellenen çağrı sayısı.</summary>
    public int ChangedThisWeekCount { get; set; }

    public List<GrantSourceDto> Sources { get; set; } = new();
    public List<GrantDraftQueueItemDto> Drafts { get; set; } = new();
}

/// <summary>1a · Taslak kuyruğu satırı.</summary>
public class GrantDraftQueueItemDto
{
    public Guid GrantCallId { get; set; }
    public Guid GrantId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
    public decimal? MaxAmount { get; set; }
    public GrantCallOrigin Origin { get; set; }

    /// <summary>
    /// Alan güveni (%). Taslağın alan kayıtlarının ortalaması; hiç alan kaydı yoksa
    /// (elle girilmiş eski çağrı) 100 sayılır — onaylanacak öneri yoktur.
    /// </summary>
    public int FieldConfidence { get; set; }
}

/// <summary>1a · "Tümünü Tara" sonucu.</summary>
public class GrantScrapeResultDto
{
    public int SourceCount { get; set; }
    public int SucceededCount { get; set; }
    public int SkippedCount { get; set; }
    public int FailedCount { get; set; }
    public int NewDraftCount { get; set; }
}
