using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Volo.Abp.Settings;

namespace Apya.Platform.Web.Pages.Tasks
{
    [Authorize(PlatformPermissions.Tasks.Default)]
    public class IndexModel : PageModel
    {
        private readonly ISettingProvider _settingProvider;

        public IndexModel(ISettingProvider settingProvider)
        {
            _settingProvider = settingProvider;
        }

        /// <summary>
        /// Kullanıcının açık pano sekmeleri — HAM JSON, sayfaya olduğu gibi
        /// basılır ve index.js ayrıştırır.
        ///
        /// Sekmeler kasıtlı olarak SAYFAYLA gelir, ayrı bir istekle değil:
        /// şerit sayfanın ilk çizilen parçası, ikinci bir gidiş gelişte önce
        /// yanlış sekmeler çizilip sonra yerine oturması gerekirdi. Aynı
        /// sebeple ShellStateDto'ya da konmadı — orası HER sayfada taşınıyor,
        /// bu değer yalnız burayı ilgilendiriyor.
        ///
        /// BOŞ ise kullanıcı düzene hiç dokunmamış demektir → istemci
        /// varsayılan sekmeleri kurar (index.js → DEFAULT_TABS).
        /// Yazma ve doğrulama ShellAppService.SetBoardTabsAsync'te.
        /// </summary>
        public string BoardTabsJson { get; private set; } = string.Empty;

        public async Task OnGetAsync()
        {
            BoardTabsJson = await _settingProvider.GetOrNullAsync(
                PlatformSettings.Shell.BoardTabs) ?? string.Empty;
        }
    }
}
