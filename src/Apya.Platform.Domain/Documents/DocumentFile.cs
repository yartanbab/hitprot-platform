using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Kullanıcının "belge" dediği şey — meta verinin sahibi ve versiyonların çapası.
/// Bir <see cref="DocumentFile"/> altında bir veya daha fazla <see cref="DocumentAttachment"/>
/// (versiyon) bulunur; <see cref="LatestAttachmentId"/> güncel olanı işaret eder.
///
/// Önceden bu rolü <c>DocumentAttachment.VersionGroupId</c> (tablosuz bir Guid) üstleniyordu;
/// tür/tutar/dönem/durum gibi alanlar hiçbir yerde saklanamıyordu. Bu entity o boşluğu doldurur.
///
/// Harcama/fatura bağı burada DEĞİL, Faz E'deki eşleştirme tablosunda tutulacak
/// (bir belge birden çok harcama kalemini kapsayabilir). Cari/tedarikçi ve task gibi
/// ilişkiler meta şema alanı (<see cref="DocumentFieldType.Relation"/>) olarak yürür.
/// </summary>
public class DocumentFile : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    /// <summary>Bulunduğu klasör/belge (<see cref="Document"/>). Zorunlu — her dosya bir bağlamda durur.</summary>
    public Guid DocumentId { get; private set; }

    /// <summary>Belge tipi. Taşınan eski verilerde null olabilir ("Belirsiz").</summary>
    public Guid? DocumentTypeId { get; private set; }

    public Guid? ProjectId { get; private set; }

    /// <summary>Bağlı olduğu iş adımı — liste kolonu ve uygunluk kapsamı (Faz B) buna bakar.</summary>
    public Guid? WorkStepId { get; private set; }

    public string DisplayName { get; private set; } = null!;

    /// <summary>Belgenin parasal tutarı (fatura, bordro, sözleşme bedeli). Liste kolonunda sıralanabilir.</summary>
    public decimal? Amount { get; private set; }

    public string? Currency { get; private set; }

    /// <summary>Belgenin kendi tarihi (fatura tarihi) — yükleme tarihinden farklıdır.</summary>
    public DateTime? DocumentDate { get; private set; }

    /// <summary>Dönem filtresi için normalize kod, ör. "2026-Q2".</summary>
    public string? PeriodCode { get; private set; }

    public DocumentFileStatus Status { get; private set; } = DocumentFileStatus.Draft;

    /// <summary>
    /// Belgenin geçerlilik bitişi (sözleşme bitişi vb.).
    /// Not: <see cref="Document.ExpiryDate"/> klasör seviyesinde ayrı yaşıyor ve
    /// DocumentExpiryWorker hâlâ onu izliyor; ikisinin birleştirilmesi Faz B işi.
    /// </summary>
    public DateTime? ExpiryDate { get; private set; }

    /// <summary>Saklama süresi sonu — belge tipinin RetentionMonths değerinden hesaplanır.</summary>
    public DateTime? RetentionUntil { get; private set; }

    /// <summary>Kurum referansı (KSG-ARA-2026-...). Teslim paketlerinde (Faz C) kullanılacak.</summary>
    public string? ExternalRef { get; private set; }

    /// <summary>Kilitli belge düzenlenemez/silinemez (bordro gibi hassas belgeler).</summary>
    public bool IsLocked { get; private set; }

    /// <summary>Güncel versiyon. Liste render'ında N+1 sorguyu önlemek için denormalize.</summary>
    public Guid? LatestAttachmentId { get; private set; }

    public int VersionCount { get; private set; }

    protected DocumentFile() { }

    public DocumentFile(
        Guid id,
        Guid? tenantId,
        Guid documentId,
        string displayName,
        Guid? documentTypeId = null,
        Guid? projectId = null,
        Guid? workStepId = null) : base(id)
    {
        TenantId = tenantId;
        DocumentId = documentId;
        SetDisplayName(displayName);
        DocumentTypeId = documentTypeId;
        ProjectId = projectId;
        WorkStepId = workStepId;
    }

    public void SetDisplayName(string displayName)
    {
        if (string.IsNullOrWhiteSpace(displayName))
            throw new BusinessException(PlatformDomainErrorCodes.DocumentFileNameRequired);

        DisplayName = Check.NotNullOrWhiteSpace(
            displayName, nameof(displayName), maxLength: DocumentConsts.MaxDisplayNameLength).Trim();
    }

    public void SetAmount(decimal? amount, string? currency)
    {
        if (amount is < 0)
            throw new BusinessException(PlatformDomainErrorCodes.DocumentFileAmountInvalid)
                .WithData("Amount", amount);

        Amount = amount;
        Currency = amount.HasValue
            ? (string.IsNullOrWhiteSpace(currency) ? "TRY" : currency.Trim().ToUpperInvariant())
            : null;
    }

    public void SetClassification(Guid? documentTypeId, Guid? projectId, Guid? workStepId)
    {
        DocumentTypeId = documentTypeId;
        ProjectId = projectId;
        WorkStepId = workStepId;
    }

    public void SetDates(DateTime? documentDate, string? periodCode, DateTime? expiryDate)
    {
        DocumentDate = documentDate;
        PeriodCode = string.IsNullOrWhiteSpace(periodCode) ? null : periodCode.Trim();
        ExpiryDate = expiryDate;
    }

    public void SetExternalRef(string? externalRef)
        => ExternalRef = string.IsNullOrWhiteSpace(externalRef) ? null : externalRef.Trim();

    /// <summary>Saklama bitişini, belgenin tarihinden ve tipin saklama süresinden hesaplar.</summary>
    public void ApplyRetention(int? retentionMonths, DateTime referenceDate)
        => RetentionUntil = retentionMonths.HasValue
            ? referenceDate.AddMonths(retentionMonths.Value)
            : null;

    public void ChangeStatus(DocumentFileStatus status) => Status = status;

    public void Lock() => IsLocked = true;
    public void Unlock() => IsLocked = false;

    /// <summary>Klasörler arası taşıma (sürükle-bırak).</summary>
    public void MoveTo(Guid documentId) => DocumentId = documentId;

    /// <summary>Yeni versiyon eklendiğinde çağrılır — denormalize alanları tazeler.</summary>
    public void RegisterVersion(Guid attachmentId, int versionCount)
    {
        LatestAttachmentId = attachmentId;
        VersionCount = versionCount;
    }

    /// <summary>Kilitli belgede yıkıcı işlem denenirse hata fırlatır.</summary>
    public void EnsureNotLocked()
    {
        if (IsLocked)
            throw new BusinessException(PlatformDomainErrorCodes.DocumentFileLocked)
                .WithData("DisplayName", DisplayName);
    }
}
