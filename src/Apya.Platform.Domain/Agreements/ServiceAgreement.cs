using System;
using Apya.Platform.Tenants;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Agreements;

/// <summary>
/// Onaylanmış hizmet protokolü — hukuki delil kaydı.
///
/// <para><b>Host seviyesindedir</b> (<c>IMultiTenant</c> DEĞİL): sözleşme PARGETTO ile KURUM
/// arasındadır, kiracının kendi verisi değildir. Kiracı kendi sözleşmesini
/// <see cref="TenantId"/> üzerinden okur; kiracı filtresine bırakılsaydı sözleşme, henüz
/// kiracı OLUŞMADAN yazıldığı için görünmez olurdu.</para>
///
/// <para><b>Onaylanan metnin kendisi saklanır</b> (<see cref="RenderedHtml"/>), şablona
/// referans değil. Şablon ileride değişecek; "hangi metne onay verildi" sorusunun tek
/// dürüst cevabı, o an ekranda duran metnin kopyasıdır. <see cref="ContentHash"/> bu
/// kopyanın SHA-256 özetidir ve protokolün 9. maddesindeki doğrulama kodudur.</para>
///
/// <para><b>Değişmezdir.</b> Onay alanlarının setter'ı yoktur; yalnız
/// <see cref="Terminate"/> ve <see cref="MarkExpired"/> durumu ilerletir. Onaylanmış bir
/// metni sonradan düzenlemek delili yok eder.</para>
/// </summary>
public class ServiceAgreement : AuditedAggregateRoot<Guid>
{
    /// <summary>Sözleşmeyi doğuran kayıt talebi.</summary>
    public Guid RegistrationRequestId { get; private set; }

    /// <summary>
    /// Hesap açılınca doldurulur. Onay ile hesap açılışı AYRI işlemlerdir (kiracı
    /// oluşturma kendi transaction'ında koşar), bu yüzden kısa bir an <c>null</c> kalır.
    /// </summary>
    public Guid? TenantId { get; private set; }

    /// <summary>Protokol numarası — "APYA-PRT-2026-0001".</summary>
    public string Number { get; private set; }

    /// <summary>Onay anında yürürlükte olan şablon sürümü.</summary>
    public string TemplateVersion { get; private set; }

    /// <summary>Onaylanan metnin birebir kopyası (yer tutucular doldurulmuş HTML).</summary>
    public string RenderedHtml { get; private set; }

    /// <summary>Metnin SHA-256 hex özeti (Madde 9: elektronik doğrulama kodu).</summary>
    public string ContentHash { get; private set; }

    // --- Ticari şartlar (onay anında dondurulur) ---

    public SalesPlan Plan { get; private set; }

    /// <summary>Yıllık lisans bedeli (TL, KDV hariç). Bedelsiz anlaşmada <c>null</c>.</summary>
    public decimal? Amount { get; private set; }

    /// <summary>Madde 5.3 başarı primi oranı (%). Onay anındaki değer korunur.</summary>
    public decimal SuccessFeePercent { get; private set; }

    public DateTime StartDate { get; private set; }

    public DateTime EndDate { get; private set; }

    public ServiceAgreementStatus Status { get; private set; }

    // --- Elektronik irade beyanı (Madde 9) ---

    public string ApproverName { get; private set; }

    public string ApproverTitle { get; private set; }

    public string ApproverEmail { get; private set; }

    public DateTime ApprovedAt { get; private set; }

    public string? ApprovedIp { get; private set; }

    public string? ApprovedUserAgent { get; private set; }

    // --- Sona erme ---

    public DateTime? EndedAt { get; private set; }

    public string? TerminationReason { get; private set; }

    protected ServiceAgreement()
    {
        Number = string.Empty;
        TemplateVersion = string.Empty;
        RenderedHtml = string.Empty;
        ContentHash = string.Empty;
        ApproverName = string.Empty;
        ApproverTitle = string.Empty;
        ApproverEmail = string.Empty;
    }

    /// <summary>
    /// ARCH-049: entity <c>IClock</c> inject edemez — onay anını çağıran verir
    /// (<see cref="ServiceAgreementManager"/>), süre ondan türetilir.
    /// </summary>
    public ServiceAgreement(
        Guid id,
        Guid registrationRequestId,
        string number,
        string templateVersion,
        string renderedHtml,
        string contentHash,
        SalesPlan plan,
        decimal? amount,
        decimal successFeePercent,
        DateTime approvedAt,
        int termMonths,
        string approverName,
        string approverTitle,
        string approverEmail,
        string? approvedIp,
        string? approvedUserAgent)
        : base(id)
    {
        RegistrationRequestId = registrationRequestId;
        Number = Check.NotNullOrWhiteSpace(number, nameof(number), ServiceAgreementConsts.MaxNumberLength);
        TemplateVersion = Check.NotNullOrWhiteSpace(templateVersion, nameof(templateVersion), ServiceAgreementConsts.MaxTemplateVersionLength);
        RenderedHtml = Check.NotNullOrWhiteSpace(renderedHtml, nameof(renderedHtml));
        ContentHash = Check.NotNullOrWhiteSpace(contentHash, nameof(contentHash), ServiceAgreementConsts.MaxContentHashLength);
        Plan = plan;
        Amount = amount;
        SuccessFeePercent = successFeePercent;

        // Madde 8: "sistem üzerinden onaylandığı tarihte yürürlüğe girer ve 1 yıl geçerlidir".
        ApprovedAt = approvedAt;
        StartDate = approvedAt;
        EndDate = approvedAt.AddMonths(termMonths);
        Status = ServiceAgreementStatus.Active;

        ApproverName = Check.NotNullOrWhiteSpace(approverName, nameof(approverName), ServiceAgreementConsts.MaxApproverNameLength);
        ApproverTitle = Check.NotNullOrWhiteSpace(approverTitle, nameof(approverTitle), ServiceAgreementConsts.MaxApproverTitleLength);
        ApproverEmail = Check.NotNullOrWhiteSpace(approverEmail, nameof(approverEmail), ServiceAgreementConsts.MaxApproverEmailLength);
        ApprovedIp = Truncate(approvedIp, ServiceAgreementConsts.MaxIpAddressLength);
        ApprovedUserAgent = Truncate(approvedUserAgent, ServiceAgreementConsts.MaxUserAgentLength);
    }

    /// <summary>Hesap açıldıktan sonra sözleşmeyi kiracıya bağlar. Yalnız BİR KEZ.</summary>
    public void LinkTenant(Guid tenantId)
    {
        if (TenantId.HasValue)
        {
            throw new BusinessException(PlatformDomainErrorCodes.RegistrationRequestAlreadyProvisioned);
        }

        TenantId = tenantId;
    }

    public void Terminate(DateTime endedAt, string? reason)
    {
        Status = ServiceAgreementStatus.Terminated;
        EndedAt = endedAt;
        TerminationReason = Truncate(reason, ServiceAgreementConsts.MaxTerminationReasonLength);
    }

    public void MarkExpired(DateTime endedAt)
    {
        Status = ServiceAgreementStatus.Expired;
        EndedAt = endedAt;
    }

    private static string? Truncate(string? value, int max)
        => string.IsNullOrEmpty(value) || value.Length <= max ? value : value.Substring(0, max);
}
