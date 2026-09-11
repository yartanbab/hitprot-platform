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

    /// <summary>
    /// Kayıtlı görünümleri topluca değiştirir — ekleme, yeniden adlandırma ve
    /// silme aynı çağrıdan geçer (istemci tam listeyi gönderir). Sunucuda
    /// saklanır ki cihazlar arası taşınsın.
    /// </summary>
    Task<List<ShellSavedViewDto>> SetSavedViewsAsync(List<ShellSavedViewDto> views);

    /// <summary>
    /// Bir yüzeyin (scope) açık sekmelerini topluca değiştirir — sekme açma,
    /// kapatma ve sıralama aynı çağrıdan geçer (istemci tam listeyi gönderir).
    /// Sunucuda saklanır ki düzen cihazlar arası taşınsın. Scope'lar:
    /// "tasks" (/Tasks), "project:{guid}" (proje detay konsolu), "taskdetail"
    /// (görev detayının sekme sırası) — bkz. ShellBoardTabsSetting.
    ///
    /// OKUMA burada YOK: her yüzeyin kendi sayfası düzeni doğrudan ayardan okuyup
    /// data attribute ile basar. ShellStateDto'ya konsaydı her sayfa yükünde
    /// taşınırdı, oysa yalnız bu sayfaları ilgilendiriyor.
    /// </summary>
    Task<List<ShellBoardTabDto>> SetBoardTabsAsync(SetShellBoardTabsInput input);

    /// <summary>
    /// Kart Panosu görünüm tercihini topluca değiştirir (istemci tam nesneyi
    /// gönderir). Sunucuda saklanır ki üç kanban yüzeyi ve cihazlar arası
    /// taşınsın. OKUMA burada YOK — BoardTabs'taki gerekçeyle aynı:
    /// _KanbanBoard.cshtml ayarı doğrudan okuyup data attribute ile basar.
    /// </summary>
    Task<ShellKanbanViewDto> SetKanbanViewAsync(ShellKanbanViewDto input);
}
