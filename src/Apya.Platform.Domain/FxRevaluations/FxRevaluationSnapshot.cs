using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.FxRevaluations;

/// <summary>
/// APYA-138: Yıl sonu (veya herhangi bir tarih) döviz kasa değerleme anlık görüntüsü.
/// Ardışık snapshot'lar arası fark = kur farkı (UI/AppService karşılaştırır).
/// JournalEntry posting Faz 7'ye ertelendi (APYA-92 ledger bağımlılığı).
/// </summary>
public class FxRevaluationSnapshot : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public DateTime AsOfDate { get; set; }
    public decimal TotalTryValue { get; private set; }
    public string? Notes { get; set; }

    public ICollection<FxRevaluationLine> Lines { get; private set; } = new Collection<FxRevaluationLine>();

    protected FxRevaluationSnapshot() { }

    public FxRevaluationSnapshot(Guid id, DateTime asOfDate, Guid? tenantId = null, string? notes = null) : base(id)
    {
        TenantId = tenantId;
        AsOfDate = asOfDate.Date;
        Notes = notes;
    }

    public void AddLine(FxRevaluationLine line)
    {
        Lines.Add(line);
        TotalTryValue += line.TryValue;
    }
}
