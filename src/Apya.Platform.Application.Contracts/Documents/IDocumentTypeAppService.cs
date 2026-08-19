using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// Belge tipleri ve alan şemaları — Faz A'da salt okuma.
/// Tip/alan yazma işlemleri Yönetim ekranıyla (Faz D) gelecek.
/// </summary>
public interface IDocumentTypeAppService : IApplicationService
{
    /// <summary>Sistem tipleri (TenantId = null) + kiracının kendi tipleri, alan şemalarıyla birlikte.</summary>
    Task<List<DocumentTypeDto>> GetListAsync();
}
