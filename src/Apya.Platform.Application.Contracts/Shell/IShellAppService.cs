using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Shell.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Shell;

/// <summary>
/// Uygulama kabuğunun (sol menü) durum servisi. Özel izin YOK — her oturumlu
/// kullanıcı kendi kabuğunu okur; içerideki her parça kendi iznine göre
/// filtrelenir (yetkisi olmayan sıfır/boş alır, hata almaz).
/// </summary>
public interface IShellAppService : IApplicationService
{
    Task<ShellStateDto> GetStateAsync();

    /// <summary>
    /// Sabitlemeleri topluca değiştirir (iğneye her dokunuşta tam liste gönderilir).
    /// Sunucuda saklanır ki cihazlar arası taşınsın.
    /// </summary>
    Task<List<string>> SetPinsAsync(List<string> pins);
}
