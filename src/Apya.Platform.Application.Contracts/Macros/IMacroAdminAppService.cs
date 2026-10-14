using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Macros.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Macros;

/// <summary>
/// Host: Makro Ekran yönetimi (/Admin/Macros). Varsayılan açık model — katalogdaki her makro bir
/// satırdır; host ayar kaydeder ya da varsayılana döndürür. "Yeni makro" ve "Kopyala" yok: makro
/// kodda (MacroCatalog) doğar (kullanıcı kararı 2026-10-14).
/// </summary>
public interface IMacroAdminAppService : IApplicationService
{
    /// <summary>Katalogdaki bütün makrolar, ayarlarıyla ve son 30 günlük kullanımla, sıralı.</summary>
    Task<List<MacroAdminDto>> GetListAsync();

    Task<MacroAdminDto> UpdateAsync(string key, UpdateMacroSettingDto input);

    /// <summary>Ayar kaydını siler: makro katalogdaki hâline döner.</summary>
    Task<MacroAdminDto> ResetAsync(string key);
}
