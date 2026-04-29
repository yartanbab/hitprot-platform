namespace Apya.Platform.Accounting.Outbox;

using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

/// <summary>
/// OutboxMessage — transactional outbox pattern'in kalıcı parçası.
/// <para>
/// SaveChanges sırasında, AggregateRoot'un fırlattığı her distributed event,
/// ledger insert ile <b>aynı transaction içinde</b> bu tabloya bir satır
/// olarak yazılır. Background dispatcher daha sonra <see cref="OutboxMessageStatus.Pending"/>
/// kayıtları sırayla okuyup mesaj kuyruğuna (RabbitMQ/Kafka/SNS) iletir.
/// </para>
/// <para>
/// Garanti modeli: <b>at-most-once persisted, at-least-once delivered</b>.
/// Consumer'ların idempotent olması varsayılır (event içindeki
/// JournalEntryId ve IdempotencyKey bu amaçla taşınır).
/// </para>
/// <para>
/// Pure-immutable bir outbox değildir — <see cref="Status"/>, <see cref="DispatchedAt"/>,
/// <see cref="RetryCount"/>, <see cref="LastError"/> dispatcher tarafından
/// güncellenir. Bu yüzden <c>IAppendOnly</c> implement ETMEZ. Append-only
/// alternatif: dispatch sonuçlarını ayrı bir tabloya yazmak — performans
/// trade-off'u nedeniyle MVP için pragmatik yola gidiyoruz, geçişe açık.
/// </para>
/// <para>
/// <see cref="Sequence"/> outbox tablosunda kendine ait — JournalEntry
/// sequence'ından bağımsız. Dispatcher bu sequence'a göre okur, böylece
/// FIFO garantisi tek tenant içinde sağlanır.
/// </para>
/// </summary>
public class OutboxMessage : Entity<Guid>, IMultiTenant
{
    public virtual Guid? TenantId { get; private set; }

    public virtual long Sequence { get; private set; }

    /// <summary>EventName attribute'undan gelen mantıksal isim
    /// (ör. "apya.accounting.journal-entry.posted.v1").</summary>
    public virtual string EventName { get; private set; } = default!;

    /// <summary>.NET assembly-qualified type adı — consumer tarafında
    /// deserialize için kullanılır. EventName ile redundant ama
    /// schema-evolution sırasında ikisini de tutmak güvenli.</summary>
    public virtual string EventClrType { get; private set; } = default!;

    /// <summary>JSON-serialize edilmiş event payload.</summary>
    public virtual string Payload { get; private set; } = default!;

    public virtual Guid? CorrelationId { get; private set; }

    public virtual DateTimeOffset OccurredAt { get; private set; }

    public virtual OutboxMessageStatus Status { get; private set; }

    public virtual DateTimeOffset? DispatchedAt { get; private set; }

    public virtual int RetryCount { get; private set; }

    public virtual string? LastError { get; private set; }

    /// <summary>
    /// Bir sonraki retry'in mümkün olduğu en erken zaman. Exponential
    /// backoff hesabı dispatcher'da yapılır, sonuç burada saklanır.
    /// </summary>
    public virtual DateTimeOffset? NextAttemptAt { get; private set; }

    protected OutboxMessage()
    {
    }

    public OutboxMessage(
        Guid id,
        Guid? tenantId,
        long sequence,
        string eventName,
        string eventClrType,
        string payload,
        DateTimeOffset occurredAt,
        Guid? correlationId)
        : base(id)
    {
        if (sequence <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(sequence), sequence,
                "Sequence must be positive.");
        }
        TenantId = tenantId;
        Sequence = sequence;
        EventName = Check.NotNullOrWhiteSpace(eventName, nameof(eventName));
        EventClrType = Check.NotNullOrWhiteSpace(eventClrType, nameof(eventClrType));
        Payload = Check.NotNullOrWhiteSpace(payload, nameof(payload));
        OccurredAt = occurredAt;
        CorrelationId = correlationId;
        Status = OutboxMessageStatus.Pending;
        RetryCount = 0;
    }

    public void MarkDispatched(DateTimeOffset dispatchedAt)
    {
        if (Status == OutboxMessageStatus.Dispatched)
        {
            return;
        }
        if (Status == OutboxMessageStatus.Abandoned)
        {
            throw new BusinessException(PlatformDomainErrorCodes.OutboxMessageInvalidTransition)
                .WithData("From", Status)
                .WithData("To", OutboxMessageStatus.Dispatched);
        }
        Status = OutboxMessageStatus.Dispatched;
        DispatchedAt = dispatchedAt;
        LastError = null;
        NextAttemptAt = null;
    }

    public void MarkFailed(string error, DateTimeOffset? nextAttemptAt)
    {
        if (Status == OutboxMessageStatus.Dispatched)
        {
            throw new BusinessException(PlatformDomainErrorCodes.OutboxMessageInvalidTransition)
                .WithData("From", Status)
                .WithData("To", OutboxMessageStatus.Failed);
        }
        Status = OutboxMessageStatus.Failed;
        RetryCount++;
        LastError = error.Length > 4000 ? error.Substring(0, 4000) : error;
        NextAttemptAt = nextAttemptAt;
    }

    public void Reschedule(DateTimeOffset nextAttemptAt)
    {
        if (Status != OutboxMessageStatus.Failed)
        {
            throw new BusinessException(PlatformDomainErrorCodes.OutboxMessageInvalidTransition)
                .WithData("From", Status)
                .WithData("To", OutboxMessageStatus.Pending);
        }
        Status = OutboxMessageStatus.Pending;
        NextAttemptAt = nextAttemptAt;
    }

    public void Abandon(string reason)
    {
        Status = OutboxMessageStatus.Abandoned;
        LastError = reason.Length > 4000 ? reason.Substring(0, 4000) : reason;
        NextAttemptAt = null;
    }
}
