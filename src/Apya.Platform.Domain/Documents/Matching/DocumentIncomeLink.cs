using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// DOC-08 · Belge ↔ gelir (tahsilat) bağı (ürün kararı, 2026-10-13).
///
/// <para>Belge eşleştirme yalnız gider için vardı: hibe dilimi hesaba geçtiğinde banka dekontu gelir
/// kaydına bağlanamıyordu. Bağ ZORUNLU değildir; belgesi olmayan tahsilat uyarı olarak görünür.</para>
///
/// <para><see cref="DocumentExpenseMatch"/> ile aynı gerekçeyle ayrı tablo: bir dekont birden çok
/// geliri, bir gelir birden çok belgeyi (dekont + yazı) taşıyabilir. Skor ve ek numarası yok —
/// gelirde otomatik eşleştirme ve teslim eki kavramı yok, bağ elle kurulur.</para>
/// </summary>
public class DocumentIncomeLink : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid DocumentFileId { get; private set; }

    public Guid IncomeEntryId { get; private set; }

    protected DocumentIncomeLink() { }

    public DocumentIncomeLink(Guid id, Guid? tenantId, Guid documentFileId, Guid incomeEntryId) : base(id)
    {
        TenantId = tenantId;
        DocumentFileId = documentFileId;
        IncomeEntryId = incomeEntryId;
    }
}
