using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Belge ↔ fatura bağı (kullanıcı isteği, 2026-11-11): faturanın kendisi (PDF/fotoğraf) ve
/// tahsilat dekontları fatura penceresinden eklenir.
///
/// <para><see cref="DocumentIncomeLink"/> ile aynı gerekçeyle ayrı tablo: bir fatura birden çok belge
/// (fatura + dekontlar) taşır. Dekont tahsilat satırına değil faturaya bağlanır — tahsilat kaydı
/// kimliğini dışarı vermiyor ve aynı referansla gelen tekrarı sessizce yutuyor.</para>
/// </summary>
public class DocumentInvoiceLink : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid DocumentFileId { get; private set; }

    public Guid InvoiceId { get; private set; }

    protected DocumentInvoiceLink() { }

    public DocumentInvoiceLink(Guid id, Guid? tenantId, Guid documentFileId, Guid invoiceId) : base(id)
    {
        TenantId = tenantId;
        DocumentFileId = documentFileId;
        InvoiceId = invoiceId;
    }
}
