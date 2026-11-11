using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// Gider, gelir ve fatura pencerelerindeki "Belge ekle" alanı: yüklenen fatura, fiş ya da dekont
/// Belge Merkezi'ne konur ve kayda bağlanır. Önceden belge önce Belgeler ekranına
/// yüklenip sonra ayrı bir pencereden bağlanıyordu.
///
/// 🔴 Yalnız süreç içinden çağrılır: saklanan dosya adını çağırandan alır (dosyayı
/// diske yazan sayfa). Uzak uç bu adı çağırana bırakırdı.
/// </summary>
public interface IFinanceDocumentAppService : IApplicationService
{
    /// <summary>Kiracıda Belgeler paketi açık ve kullanıcı belge yükleyebiliyor mu. Alan buna göre görünür.</summary>
    Task<bool> CanAttachAsync();

    Task AttachToExpenseAsync(Guid expenseId, string fileName, string storedFileName, string contentType, long fileSize);

    Task AttachToIncomeAsync(Guid incomeEntryId, string fileName, string storedFileName, string contentType, long fileSize);

    /// <summary>Faturanın kendisi ya da tahsilat dekontu — ikisi de faturaya bağlanır.</summary>
    Task AttachToInvoiceAsync(Guid invoiceId, string fileName, string storedFileName, string contentType, long fileSize);

    Task<List<ProjectExpenseDocumentDto>> GetExpenseDocumentsAsync(Guid expenseId);

    Task<List<ProjectExpenseDocumentDto>> GetIncomeDocumentsAsync(Guid incomeEntryId);

    Task<List<ProjectExpenseDocumentDto>> GetInvoiceDocumentsAsync(Guid invoiceId);
}
