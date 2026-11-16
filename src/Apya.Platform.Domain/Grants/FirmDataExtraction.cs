using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Bir belgenin yapay zekâyla okunması ve bundan çıkan değer önerileri.
///
/// <para>🔴 Öneri kurum verisi DEĞİLDİR: kurum onaylayana kadar hiçbir değer
/// <see cref="FirmParameterValue"/>'ya yazılmaz (<see cref="FirmDataExtractionManager.AcceptAsync"/>).</para>
///
/// <para>KVKK izi: belge okunmadan önce aydınlatma metnini kimin, ne zaman onayladığı
/// bu kayıtta saklanır. Belgenin kendisi Belge Merkezi'ndedir; silinse de bu kayıt kalır.</para>
/// </summary>
public class FirmDataExtraction : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    /// <summary>Belge Merkezi'ndeki belge. FK yok: belge silinse de okuma izi kalmalı.</summary>
    public Guid DocumentFileId { get; private set; }

    /// <summary>Okunan sürüm: aynı adla yeni sürüm yüklenince belge değişir, sayfa ve alıntılar bu sürüme aittir.</summary>
    public Guid DocumentAttachmentId { get; private set; }

    public string FileName { get; private set; } = string.Empty;

    public DateTime ConsentedAt { get; private set; }

    public Guid ConsentedByUserId { get; private set; }

    public FirmDataExtractionStatus Status { get; private set; }

    /// <summary>Okuma başarısız olduysa kullanıcıya gösterilecek neden.</summary>
    public string? Error { get; private set; }

    /// <summary>Belgenin sayfa sayısı (Word belgesinde sayfa bilinmez: null).</summary>
    public int? PageCount { get; private set; }

    /// <summary>Metin sınırı aşıldı; belgenin yalnız baş kısmı okundu.</summary>
    public bool IsTruncated { get; private set; }

    public List<FirmDataSuggestion> Suggestions { get; private set; } = new();

    protected FirmDataExtraction() { }

    public FirmDataExtraction(
        Guid id,
        Guid? tenantId,
        Guid documentFileId,
        Guid documentAttachmentId,
        string fileName,
        Guid consentedByUserId,
        DateTime consentedAt) : base(id)
    {
        TenantId = tenantId;
        DocumentFileId = documentFileId;
        DocumentAttachmentId = documentAttachmentId;
        FileName = Check.NotNullOrWhiteSpace(fileName, nameof(fileName)).Length > FirmDataExtractionConsts.MaxFileNameLength
            ? fileName[..FirmDataExtractionConsts.MaxFileNameLength]
            : fileName;
        ConsentedByUserId = consentedByUserId;
        ConsentedAt = consentedAt;
        Status = FirmDataExtractionStatus.Isleniyor;
    }

    public int PendingCount => Suggestions.Count(s => s.Status == FirmDataSuggestionStatus.Beklemede);

    public void MarkUnreadable()
    {
        Status = FirmDataExtractionStatus.Okunamadi;
        Error = null;
    }

    public void MarkFailed(string error)
    {
        Status = FirmDataExtractionStatus.Hata;
        var text = string.IsNullOrWhiteSpace(error) ? "-" : error.Trim();
        Error = text.Length > FirmDataExtractionConsts.MaxErrorLength ? text[..FirmDataExtractionConsts.MaxErrorLength] : text;
    }

    /// <summary>Okumayı bitirir; öneri çıkmadıysa da "hazır"dır (belgede aranan bilgi yoktu).</summary>
    internal void Complete(IEnumerable<FirmDataSuggestion> suggestions, int? pageCount, bool isTruncated)
    {
        Suggestions.Clear();
        Suggestions.AddRange(suggestions);
        PageCount = pageCount;
        IsTruncated = isTruncated;
        Status = FirmDataExtractionStatus.Hazir;
        Error = null;
    }

    public FirmDataSuggestion GetSuggestion(Guid suggestionId)
        => Suggestions.FirstOrDefault(s => s.Id == suggestionId)
           ?? throw new EntityNotFoundException(typeof(FirmDataSuggestion), suggestionId);
}

/// <summary>
/// Belgeden okunan tek bir değer önerisi: hangi parametre, hangi değer, ne kadar emin,
/// belgenin neresinde. Değer kurum verisinin ham biçimindedir (<see cref="FirmParameterRawValue"/>).
/// </summary>
public class FirmDataSuggestion : Entity<Guid>
{
    public Guid ExtractionId { get; private set; }

    public Guid DefinitionId { get; private set; }

    public string RawValue { get; private set; } = string.Empty;

    /// <summary>Yapay zekânın beyan ettiği güven (0-100).</summary>
    public int Confidence { get; private set; }

    public int? Page { get; private set; }

    public string? Excerpt { get; private set; }

    public FirmDataSuggestionStatus Status { get; private set; }

    /// <summary>Kabulde kurum verisine yazılan değer (düzenlendiyse önerilenden farklıdır).</summary>
    public string? AcceptedRawValue { get; private set; }

    public DateTime? DecidedAt { get; private set; }

    public Guid? DecidedByUserId { get; private set; }

    protected FirmDataSuggestion() { }

    internal FirmDataSuggestion(
        Guid id, Guid extractionId, Guid definitionId, string rawValue, int confidence, int? page, string? excerpt) : base(id)
    {
        ExtractionId = extractionId;
        DefinitionId = definitionId;
        RawValue = rawValue;
        Confidence = Math.Clamp(confidence, 0, 100);
        Page = page is > 0 ? page : null;
        var text = excerpt?.Trim();
        Excerpt = string.IsNullOrEmpty(text)
            ? null
            : text.Length > FirmParameterConsts.MaxSourceExcerptLength ? text[..FirmParameterConsts.MaxSourceExcerptLength] : text;
        Status = FirmDataSuggestionStatus.Beklemede;
    }

    internal void Accept(string writtenRawValue, bool edited, Guid? userId, DateTime now)
    {
        EnsurePending();
        Status = edited ? FirmDataSuggestionStatus.DuzenlenerekKabul : FirmDataSuggestionStatus.Kabul;
        AcceptedRawValue = writtenRawValue;
        DecidedByUserId = userId;
        DecidedAt = now;
    }

    internal void Reject(Guid? userId, DateTime now)
    {
        EnsurePending();
        Status = FirmDataSuggestionStatus.Red;
        DecidedByUserId = userId;
        DecidedAt = now;
    }

    private void EnsurePending()
    {
        if (Status != FirmDataSuggestionStatus.Beklemede)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmDataSuggestionAlreadyDecided);
        }
    }
}
