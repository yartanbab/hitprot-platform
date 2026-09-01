using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>3a · Metinden çıkarılan tek alan.</summary>
public class GrantExtractedFieldDto
{
    public string FieldKey { get; set; } = string.Empty;

    /// <summary>null = alan çıkarılamadı ("boş" durumu, host elle girer).</summary>
    public string? Value { get; set; }

    /// <summary>0-100. Elle girilen değerde 100.</summary>
    public int Confidence { get; set; }

    /// <summary>Değerin okunduğu pasaj — metinde vurgulanır.</summary>
    public string? Excerpt { get; set; }

    public GrantDraftFieldStatus Status { get; set; }
}

/// <summary>3a · Çıkarım sonucu ve doluluk sayacı ("N / 13 alan dolu").</summary>
public class GrantExtractionResultDto
{
    public List<GrantExtractedFieldDto> Fields { get; set; } = new();

    /// <summary>Değeri olan alan sayısı.</summary>
    public int FilledCount { get; set; }

    /// <summary>Formun tanıdığı toplam alan sayısı.</summary>
    public int TotalCount { get; set; }
}

public class ExtractGrantTextInput
{
    [Required(ErrorMessage = "Çağrı metni zorunludur.")]
    public string Text { get; set; } = string.Empty;
}

/// <summary>
/// 3a · "Taslak olarak kaydet". Yalnız host'un KABUL ettiği alanlar gelir; reddedilenler
/// gönderilmez. Program adı ve kurum zorunludur — ikisi de veritabanında NOT NULL.
/// </summary>
public class CreateGrantDraftInput
{
    public List<GrantExtractedFieldDto> Fields { get; set; } = new();

    /// <summary>Elle girilen programın isteğe bağlı takip adresi (3a alt bilgisi).</summary>
    [StringLength(512, ErrorMessage = "Adres en fazla {1} karakter olabilir.")]
    public string? SourceUrl { get; set; }

    /// <summary>Çağrı dönemi. Boşsa son başvuru yılından türetilir.</summary>
    [StringLength(32, ErrorMessage = "Dönem en fazla {1} karakter olabilir.")]
    public string? Period { get; set; }
}

/// <summary>3a · Kayıt sonucu — UI parametre formuna atlar.</summary>
public class GrantDraftCreatedDto
{
    public Guid GrantId { get; set; }
    public Guid GrantCallId { get; set; }
    public int SavedFieldCount { get; set; }
}
