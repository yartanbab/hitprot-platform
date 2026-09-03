using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.ReleaseNotes;

/// <summary>
/// Sürüm notlarının yayın kapısı. Katalog kodda durur; bu servis katalogla host'un
/// verdiği yayın kararlarını birleştirip her kullanıcıya YALNIZ görmesi gerekeni döner.
/// </summary>
public interface IReleaseNotePublicationAppService : IApplicationService
{
    /// <summary>Host yönetim ekranı: tüm katalog + mevcut kararlar (onaysızlar dâhil).</summary>
    Task<List<ReleaseNoteAdminDto>> GetForManagementAsync();

    /// <summary>Kararları toplu yazar ve önbelleği geçersizleştirir.</summary>
    Task SaveAsync(SaveReleaseNotePublicationsInput input);

    /// <summary>Sürüm geçmişi sayfası — geçerli kullanıcının görebildiği sürüm/madde listesi.</summary>
    Task<List<ReleaseNoteViewDto>> GetHistoryAsync();

    /// <summary>İlk açılış penceresi. Kullanıcı zaten gördüyse ya da gösterilecek madde yoksa null.</summary>
    Task<ReleaseNoteModalDto?> GetModalOrNullAsync();

    /// <summary>Geçerli kullanıcı için "gördüm" damgasını yazar.</summary>
    Task MarkSeenAsync();
}
