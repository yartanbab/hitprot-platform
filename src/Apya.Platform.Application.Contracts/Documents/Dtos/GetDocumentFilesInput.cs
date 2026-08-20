using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

/// <summary>
/// Liste filtresi. Sayfalama ve sıralama sunucu tarafındadır —
/// Sorting için izin verilen alanlar: displayName, amount, documentDate, creationTime, status.
/// </summary>
public class GetDocumentFilesInput : PagedAndSortedResultRequestDto
{
    public string? FilterText { get; set; }

    /// <summary>Belirli bir klasör. Null = bağlam filtresi uygulanmaz (tüm dokümanlar).</summary>
    public Guid? DocumentId { get; set; }

    /// <summary>Klasörün alt klasörlerini de kapsa (ağaçta üst düğüme tıklanınca).</summary>
    public bool IncludeSubFolders { get; set; }

    public Guid? ProjectId { get; set; }
    public Guid? WorkStepId { get; set; }
    public Guid? DocumentTypeId { get; set; }
    public string? PeriodCode { get; set; }
    public DocumentFileStatus? Status { get; set; }
    public string? Tag { get; set; }

    /* --- Akıllı klasörler (kayıtlı filtre) --- */

    /// <summary>Süresi dolan veya dolmak üzere olanlar (ExpiryDate &lt;= bugün + N gün).</summary>
    public int? ExpiringWithinDays { get; set; }

    /// <summary>Zorunlu meta alanı boş olanlar — "eksik meta" akıllı klasörü.</summary>
    public bool? MissingRequiredFields { get; set; }

    /// <summary>
    /// Bu andan sonra yüklenenler (CreationTime). "Bu ay yüklenen" sayacı
    /// bunu kullanır; belge tarihi değil YÜKLEME anı ölçülür.
    /// </summary>
    public DateTime? UploadedAfter { get; set; }
}
