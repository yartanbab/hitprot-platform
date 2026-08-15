using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Consents;

/// <summary>
/// Rıza kaydı — append-only hukuki delil. Kim (özne), neye (tür + politika sürümü),
/// ne zaman rıza verdi/vermedi bilgisini tutar. Telemetri gibi otomatik silinmez;
/// KVKK ispat yükümlülüğü için saklanır.
/// <para>
/// Üç rıza türünü (çerez, form KVKK, AI aktarım) tek omurgada toplar; admin analiz
/// sayfası bu tablo üzerinden tip/kategori/trend raporlar.
/// </para>
/// </summary>
public class ConsentRecord : AggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public ConsentType Type { get; private set; }

    public ConsentSubjectKind SubjectKind { get; private set; }

    /// <summary>Kullanıcı kimliği veya anonim çerez kimliği; oturumsuzda null olabilir.</summary>
    public string? SubjectId { get; private set; }

    public string PolicyVersion { get; private set; }

    /// <summary>Çerez tercihi gibi kategori listeleri için serbest alan (CSV/JSON).</summary>
    public string? AcceptedCategories { get; private set; }

    public bool Granted { get; private set; }

    public DateTime OccurredAt { get; private set; }

    public string? IpAddress { get; private set; }

    public string? UserAgent { get; private set; }

    /// <summary>Rızanın alındığı kaynak — form slug'ı, sayfa yolu vb.</summary>
    public string? SourceRef { get; private set; }

    protected ConsentRecord()
    {
        PolicyVersion = string.Empty;
    }

    public ConsentRecord(
        Guid id,
        ConsentType type,
        ConsentSubjectKind subjectKind,
        string? subjectId,
        string policyVersion,
        bool granted,
        DateTime occurredAt,
        Guid? tenantId,
        string? acceptedCategories = null,
        string? ipAddress = null,
        string? userAgent = null,
        string? sourceRef = null)
        : base(id)
    {
        Type = type;
        SubjectKind = subjectKind;
        SubjectId = Truncate(subjectId, ConsentConsts.MaxSubjectIdLength);
        PolicyVersion = Check.NotNullOrWhiteSpace(policyVersion, nameof(policyVersion), ConsentConsts.MaxPolicyVersionLength);
        Granted = granted;
        OccurredAt = occurredAt;
        TenantId = tenantId;
        AcceptedCategories = Truncate(acceptedCategories, ConsentConsts.MaxAcceptedCategoriesLength);
        IpAddress = Truncate(ipAddress, ConsentConsts.MaxIpAddressLength);
        UserAgent = Truncate(userAgent, ConsentConsts.MaxUserAgentLength);
        SourceRef = Truncate(sourceRef, ConsentConsts.MaxSourceRefLength);
    }

    private static string? Truncate(string? value, int max)
        => string.IsNullOrEmpty(value) || value.Length <= max ? value : value.Substring(0, max);
}
