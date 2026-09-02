using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 2b · İki taraflı evrak takibi. Dosya YÜKLEME burada değil: bayt akışı Web
/// katmanındaki sayfa işleyicisinde durur (<c>IUploadedFileStorage</c> orada
/// tanımlı). Bu servis listeyi, incelemeyi ve sürüm kaydını yönetir.
/// </summary>
public interface IGrantApplicationDocumentAppService : IApplicationService
{
    /// <summary>Kontrol listesini döndürür; ilk çağrıda çağrı şablonundan türetir.</summary>
    Task<GrantDocumentConsoleDto> GetAsync(Guid applicationId);

    /// <summary>Yüklenen dosyayı yeni sürüm olarak kaydeder (Web katmanı çağırır).</summary>
    Task<GrantDocumentConsoleDto> RegisterVersionAsync(RegisterGrantDocumentVersionInput input);

    Task<GrantDocumentConsoleDto> ApproveAsync(ReviewGrantDocumentInput input);
    Task<GrantDocumentConsoleDto> RequestRevisionAsync(RequestGrantDocumentRevisionInput input);
    Task<GrantDocumentConsoleDto> AddAsync(AddGrantDocumentInput input);

    /// <summary>Eksik evrakı olan tarafa bildirim gönderir.</summary>
    Task<GrantDocumentReminderResultDto> SendReminderAsync(Guid applicationId);

    /// <summary>Sürümün diskteki adını döndürür — indirme işleyicisi kullanır.</summary>
    Task<GrantDocumentFileRefDto> GetFileRefAsync(Guid versionId);

    /// <summary>Gönderim paketine girecek onaylı sürümlerin dosya listesi.</summary>
    Task<GrantDocumentPackageContentDto> GetPackageContentAsync(Guid applicationId);

    /// <summary>Üretilmiş paketin diskteki adı; paket yoksa hata verir.</summary>
    Task<GrantDocumentFileRefDto> GetPackageRefAsync(Guid applicationId);

    /// <summary>Üretilen paketi başvuruya bağlar (Web katmanı zip'i yazdıktan sonra çağırır).</summary>
    Task<GrantDocumentConsoleDto> RegisterPackageAsync(RegisterGrantDocumentPackageInput input);
}
