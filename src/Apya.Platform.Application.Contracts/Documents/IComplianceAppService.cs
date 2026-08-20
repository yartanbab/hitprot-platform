using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// Kurum uygunluğu: paket katalogu, projeye uygulama, kontrol listesi ve özet.
///
/// Kontrol listesi durumları HESAPLANIR (belge verisinden), saklanmaz —
/// belge eklendiğinde/silindiğinde liste kendiliğinden doğrudur.
/// </summary>
public interface IComplianceAppService : IApplicationService
{
    /// <summary>Katalog: sistem paketleri + kiracının paketleri. projectId verilirse IsApplied doldurulur.</summary>
    Task<List<CompliancePackageDto>> GetPackagesAsync(Guid? projectId = null);

    /// <summary>Projeye uygulanmış tüm paketlerin kontrol listeleri + birleşik özet.</summary>
    Task<ComplianceOverviewDto> GetOverviewAsync(Guid projectId, string? periodCode = null);

    Task<ComplianceChecklistDto> ApplyPackageAsync(ApplyCompliancePackageDto input);

    Task RemoveAssignmentAsync(Guid assignmentId);

    Task<ComplianceItemDto> WaiveItemAsync(WaiveComplianceItemDto input);

    Task<ComplianceItemDto> LinkDocumentAsync(LinkComplianceDocumentDto input);

    /* --- Kiracının kendi paketi (katalog) --- */

    /// <summary>Paketin kalemleri — katalog düzenleme ekranı için.</summary>
    Task<List<ComplianceRequirementDto>> GetRequirementListAsync(Guid packageId);

    Task<CompliancePackageDto> CreatePackageAsync(CreateUpdateCompliancePackageDto input);

    Task<CompliancePackageDto> UpdatePackageAsync(Guid id, CreateUpdateCompliancePackageDto input);

    /// <summary>Bir projeye uygulanmış paket SİLİNEMEZ.</summary>
    Task DeletePackageAsync(Guid id);

    Task<ComplianceRequirementDto> AddRequirementAsync(Guid packageId, CreateUpdateComplianceRequirementDto input);

    Task<ComplianceRequirementDto> UpdateRequirementAsync(Guid id, CreateUpdateComplianceRequirementDto input);

    Task DeleteRequirementAsync(Guid id);
}
