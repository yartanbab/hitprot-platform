using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// İlk kurulum sihirbazı.
///
/// Durum bir TABLOYA değil KİRACI AYARINA yazılır (takvimin sihirbazıyla aynı
/// ray). Kurulumun kendisi zaten mevcut uçları kullanır: kurum paketi uygulama
/// ve klasör oluşturma — sihirbaz yalnız bunları tek akışta sıraya dizer.
/// </summary>
public interface IDocumentSetupAppService : IApplicationService
{
    Task<DocumentSetupStateDto> GetStateAsync();

    /// <summary>Klasör şemasını kurar, seçildiyse kurum paketini uygular.</summary>
    Task<DocumentSetupResultDto> ApplyAsync(ApplyDocumentSetupDto input);

    /// <summary>Sihirbazı kapatır (kurulum yapılmadan da atlanabilir).</summary>
    Task CompleteAsync();
}
