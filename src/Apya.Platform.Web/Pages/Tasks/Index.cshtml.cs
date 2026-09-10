using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Apya.Platform.Shell;
using Volo.Abp.Settings;

namespace Apya.Platform.Web.Pages.Tasks
{
    [Authorize(PlatformPermissions.Tasks.Default)]
    public class IndexModel : PageModel
    {
        private readonly ISettingProvider _settingProvider;
        private readonly Microsoft.AspNetCore.Authorization.IAuthorizationService _authorizationService;

        public IndexModel(
            ISettingProvider settingProvider,
            Microsoft.AspNetCore.Authorization.IAuthorizationService authorizationService)
        {
            _settingProvider = settingProvider;
            _authorizationService = authorizationService;
        }

        /// <summary>
        /// Sabit "Finans" sekmesi (PR-3b) yalnız gider görme yetkisiyle basılır —
        /// panel ExpenseAppService'ten besleniyor (Expenses.Default kapılı);
        /// yetkisiz kullanıcıya sekme gösterip 403 aldırmak daha kötü.
        /// </summary>
        public bool CanViewFinance { get; private set; }

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
            // Ayar tüm yüzeylerin düzenlerini tek değerde tutar; buraya yalnız
            // /Tasks'ın ("tasks" scope'u) dizisi basılır. Eski düz-dizi değeri
            // ExtractScopeJson geri-uyumla aynı scope'a sayar.
            BoardTabsJson = ShellBoardTabsSetting.ExtractScopeJson(
                await _settingProvider.GetOrNullAsync(PlatformSettings.Shell.BoardTabs),
                ShellBoardTabsSetting.TasksScope);

            CanViewFinance = (await _authorizationService.AuthorizeAsync(
                User, null, PlatformPermissions.Expenses.Default)).Succeeded;
        }
    }
}
