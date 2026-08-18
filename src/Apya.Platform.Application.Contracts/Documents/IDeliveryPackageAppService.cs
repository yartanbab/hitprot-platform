using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// Teslim paketi kurucusu. Üretimin kendisi (PDF/ZIP baytları) Web katmanındadır —
/// QuestPDF/ClosedXML orada yaşıyor (bkz. Pages/Reports/ReportExporter). Bu servis
/// paketi yönetir, preflight'ı yürütür ve üretim sonucunu kaydeder.
/// </summary>
public interface IDeliveryPackageAppService : IApplicationService
{
    Task<List<DeliveryPackageDto>> GetListAsync(Guid projectId);

    Task<DeliveryPackageDetailDto> GetAsync(Guid id);

    Task<DeliveryPackageDto> CreateAsync(CreateUpdateDeliveryPackageDto input);

    Task<DeliveryPackageDto> UpdateAsync(Guid id, CreateUpdateDeliveryPackageDto input);

    Task DeleteAsync(Guid id);

    Task<DeliveryPackageDetailDto> AddItemsAsync(AddDeliveryPackageItemsDto input);

    Task<DeliveryPackageDetailDto> RemoveItemAsync(Guid itemId);

    Task<DeliveryPackageDetailDto> ReorderItemsAsync(ReorderDeliveryPackageItemsDto input);

    /// <summary>
    /// Üretim öncesi son kontrol. CanGenerate false ise "Paketi üret" KAPALI olmalı;
    /// üretim çağrısı da aynı kontrolü tekrar yapar (istemciye güvenilmez).
    /// </summary>
    Task<PreflightResultDto> PreflightAsync(Guid packageId);

    /// <summary>Üretilen çıktıyı kaydeder ve sürüm arşivine (ReportRun) yazar.</summary>
    Task<ReportRunDto> MarkGeneratedAsync(Guid packageId, string storedFileName, long outputSize, int sectionCount);

    Task<List<ReportRunDto>> GetRunsAsync(Guid projectId);

    /// <summary>Üretilmiş paket çıktısının indirme bilgisi.</summary>
    Task<GeneratedFileDownloadDto> PrepareDownloadAsync(Guid packageId);

    /// <summary>Arşivdeki bir rapor sürümünün indirme bilgisi.</summary>
    Task<GeneratedFileDownloadDto> PrepareRunDownloadAsync(Guid runId);

    /// <summary>ZIP üretimi için eklerin fiziksel dosya adları.</summary>
    Task<List<AnnexFileDto>> GetAnnexFilesAsync(Guid packageId);
}
