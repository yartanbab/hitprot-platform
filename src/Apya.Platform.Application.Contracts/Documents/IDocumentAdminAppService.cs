using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// Yonetim ekraninin sunucu tarafi: kural motoru, alan bazli izinler,
/// meta sema yazma, entegrasyon kayitlari ve konsolide kiraci raporu.
///
/// Tek servis: alti modul de ayni yonetim ekranini besliyor ve ayni izne
/// (Documents.Administer) bagli — alti ayri servis kurmak yalnizca dosya sayisini
/// artirirdi.
/// </summary>
public interface IDocumentAdminAppService : IApplicationService
{
    /* --- Kural motoru --- */

    Task<List<DocumentRuleDto>> GetRulesAsync();

    Task<DocumentRuleDto> GetRuleAsync(Guid id);

    Task<DocumentRuleDto> CreateRuleAsync(CreateUpdateDocumentRuleDto input);

    Task<DocumentRuleDto> UpdateRuleAsync(Guid id, CreateUpdateDocumentRuleDto input);

    Task DeleteRuleAsync(Guid id);

    Task<DocumentRuleDto> SetRuleEnabledAsync(Guid id, bool isEnabled);

    /// <summary>
    /// Kuru calistirma: HICBIR belge degismez, yalnizca kac belgenin etkilenecegi
    /// ve ornekleri doner. Gercek calistirma ile AYNI degerlendiriciyi kullanir.
    /// </summary>
    Task<DocumentRuleRunResultDto> DryRunAsync(Guid ruleId);

    /// <summary>Kurali gercekten uygular. Kapali kural calistirilamaz.</summary>
    Task<DocumentRuleRunResultDto> RunAsync(Guid ruleId);

    /* --- Alan bazli izinler --- */

    Task<DocumentFieldPermissionMatrixDto> GetFieldPermissionMatrixAsync(Guid documentTypeId);

    Task SetFieldPermissionAsync(SetFieldPermissionDto input);

    /* --- Meta sema yazma --- */

    Task<DocumentTypeDto> CreateTypeAsync(CreateUpdateDocumentTypeDto input);

    Task<DocumentTypeDto> UpdateTypeAsync(Guid id, CreateUpdateDocumentTypeDto input);

    Task DeleteTypeAsync(Guid id);

    Task<DocumentTypeFieldDto> CreateFieldAsync(CreateUpdateDocumentTypeFieldDto input);

    Task<DocumentTypeFieldDto> UpdateFieldAsync(Guid id, CreateUpdateDocumentTypeFieldDto input);

    Task DeleteFieldAsync(Guid id);

    /* --- Entegrasyonlar --- */

    Task<List<DocumentIntegrationDto>> GetIntegrationsAsync();

    Task<DocumentIntegrationDto> SaveIntegrationAsync(Guid? id, CreateUpdateDocumentIntegrationDto input);

    Task DeleteIntegrationAsync(Guid id);

    /* --- Konsolide rapor (yalniz host) --- */

    Task<ConsolidatedTenantReportDto> GetConsolidatedReportAsync();
}
