using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Zamanlanmış rapor üretildiğinde haberdar edilecek kişi.
///
/// Rapor DOSYASI e-postaya EKLENMEZ: teslim paketleri onlarca MB olabiliyor ve
/// kurum belgesi posta kutularında dolaşmamalı. Abone, uygulamadaki sürüm
/// arşivine götüren bir bildirim alır; dış alıcı için süreli paylaşım linki
/// zaten ayrı bir akış (<see cref="ExternalShareLink"/>).
/// </summary>
public class ReportSubscriber : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid ScheduleId { get; private set; }

    public string Name { get; private set; } = null!;

    /// <summary>Bildirim adresi. Kurum dışı alıcı için tek iletişim kanalı.</summary>
    public string Email { get; private set; } = null!;

    /// <summary>
    /// Uygulama kullanıcısıysa uygulama içi bildirim de gider; null ise yalnız
    /// e-posta gönderilir.
    /// </summary>
    public Guid? UserId { get; private set; }

    public bool IsEnabled { get; private set; } = true;

    protected ReportSubscriber() { }

    public ReportSubscriber(
        Guid id,
        Guid? tenantId,
        Guid scheduleId,
        string name,
        string email,
        Guid? userId = null) : base(id)
    {
        TenantId = tenantId;
        ScheduleId = scheduleId;
        UserId = userId;
        Update(name, email);
    }

    public void Update(string name, string email)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: ReportingConsts.MaxSubscriberNameLength).Trim();

        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
        {
            throw new BusinessException(PlatformDomainErrorCodes.ReportSubscriberEmailInvalid)
                .WithData("Email", email ?? string.Empty);
        }

        Email = Check.NotNullOrWhiteSpace(email, nameof(email), maxLength: ReportingConsts.MaxSubscriberEmailLength)
            .Trim().ToLowerInvariant();
    }

    public void SetEnabled(bool isEnabled) => IsEnabled = isEnabled;
}
