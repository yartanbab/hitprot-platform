using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Belge ↔ harcama bağı.
///
/// Ayrı tablo olmasının sebebi: bir belge birden çok harcama kalemini kapsayabilir
/// (toplu fatura) ve bir harcama birden çok belgeyle desteklenebilir (fatura +
/// banka dekontu). DocumentFile üzerinde ExpenseId kolonu olsaydı bu iki durum
/// da ifade edilemezdi — Faz A'da o kolonlar bilerek açılmadı.
///
/// <see cref="AnnexNumber"/> teslim paketindeki ek numarasının kopyasıdır;
/// mali raporda "hangi harcama hangi EK'te" sorusu paket açılmadan yanıtlanabilsin.
/// </summary>
public class DocumentExpenseMatch : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid DocumentFileId { get; private set; }

    public Guid ExpenseId { get; private set; }

    /// <summary>Bağlama anındaki skor (0-100). Sonradan yeniden hesaplanmaz — karar anının kaydı.</summary>
    public int Score { get; private set; }

    public MatchSource Source { get; private set; }

    public string? AnnexNumber { get; private set; }

    protected DocumentExpenseMatch() { }

    public DocumentExpenseMatch(
        Guid id,
        Guid? tenantId,
        Guid documentFileId,
        Guid expenseId,
        int score,
        MatchSource source,
        string? annexNumber = null) : base(id)
    {
        TenantId = tenantId;
        DocumentFileId = documentFileId;
        ExpenseId = expenseId;
        Score = Math.Clamp(score, 0, 100);
        Source = source;
        AnnexNumber = annexNumber;
    }

    public void SetAnnexNumber(string? annexNumber)
        => AnnexNumber = string.IsNullOrWhiteSpace(annexNumber) ? null : annexNumber.Trim();
}
