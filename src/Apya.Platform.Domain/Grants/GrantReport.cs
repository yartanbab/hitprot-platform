using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 6c · Uygulama dönemindeki bir rapor (ara rapor, sonuç raporu…).
///
/// <para>Rapor bir tahsilat dilimine BAĞLANABİLİR: tasarımın "rapor-dilim zinciri"
/// budur. 🔴 Bağlıysa dilim, rapor onaylanmadan ödemeye çıkmamalıdır — kural
/// uygulama katmanında (<see cref="GrantImplementationAppService"/>) uygulanır,
/// entity yalnız bağı taşır.</para>
///
/// <para>Alt bölümler (teknik / mali / çizelge / YMM) ayrı satırlardır: "rapor
/// hazırlanıyor" demek yetmez, hangi bölümün beklediği görünmeli.</para>
/// </summary>
public class GrantReport : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantApplicationId { get; private set; }

    /// <summary>Ödemesi bu rapora bağlı dilim; bağımsız raporda null.</summary>
    public Guid? TrancheId { get; private set; }

    public int Order { get; set; }
    public string Title { get; private set; } = null!;
    public DateTime? DueDate { get; private set; }
    public GrantReportStatus Status { get; private set; }

    /// <summary>Kurumun uyguladığı indirim/kesinti notu (tasarım: "indirim notu").</summary>
    public string? Note { get; private set; }

    public ICollection<GrantReportSection> Sections { get; set; } = new List<GrantReportSection>();

    protected GrantReport() { }

    public GrantReport(
        Guid id,
        Guid? tenantId,
        Guid grantApplicationId,
        Guid? trancheId,
        int order,
        string title,
        DateTime? dueDate) : base(id)
    {
        TenantId = tenantId;
        GrantApplicationId = grantApplicationId;
        TrancheId = trancheId;
        Order = order;
        Title = Check.NotNullOrWhiteSpace(title, nameof(title), maxLength: 128).Trim();
        DueDate = dueDate;
        Status = GrantReportStatus.Planlandi;
    }

    public void Update(string title, DateTime? dueDate, Guid? trancheId)
    {
        Title = Check.NotNullOrWhiteSpace(title, nameof(title), maxLength: 128).Trim();
        DueDate = dueDate;
        TrancheId = trancheId;
    }

    public void SetStatus(GrantReportStatus status, string? note = null)
    {
        Status = status;
        Note = note ?? Note;
    }
}
