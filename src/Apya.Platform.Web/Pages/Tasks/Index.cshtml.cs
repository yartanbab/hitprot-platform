using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Localization;
using Apya.Platform.Localization;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Apya.Platform.Shell;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Export;
using Volo.Abp.Settings;

namespace Apya.Platform.Web.Pages.Tasks
{
    [Authorize(PlatformPermissions.Tasks.Default)]
    public class IndexModel : PageModel
    {
        private readonly ISettingProvider _settingProvider;
        private readonly Microsoft.AspNetCore.Authorization.IAuthorizationService _authorizationService;
        private readonly ITaskAppService _taskAppService;
        private readonly IStringLocalizer<PlatformResource> _l;

        public IndexModel(
            ISettingProvider settingProvider,
            Microsoft.AspNetCore.Authorization.IAuthorizationService authorizationService,
            ITaskAppService taskAppService,
            IStringLocalizer<PlatformResource> l)
        {
            _settingProvider = settingProvider;
            _authorizationService = authorizationService;
            _taskAppService = taskAppService;
            _l = l;
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

        /// <summary>
        /// Ekrandaki filtreyle görev listesi (.xlsx). Liste ucu sayfa sayfa çağrılır: gizlilik kuralı ve
        /// proje/etiket adları ekrandakiyle aynı kalır. Hiyerarşi düzleşir, alt görev "Üst görev" sütunuyla gelir.
        /// </summary>
        public async Task<IActionResult> OnGetExcelAsync(GetTasksInput input)
        {
            input.TenantId = null;
            input.RootOnly = false;
            input.ParentTaskId = null;

            var rows = await ExcelTable.CollectAsync((skip, take) =>
            {
                input.SkipCount = skip;
                input.MaxResultCount = take;
                return _taskAppService.GetListAsync(input);
            });

            var columns = new List<ExcelColumn<TaskDto>>
            {
                new(_l["Export:Col:Code"], t => t.Code),
                new(_l["Export:Col:Title"], t => t.Title),
                new(_l["Export:Col:Project"], t => t.ProjectName),
                new(_l["Export:Col:ParentTask"], t => t.ParentTaskTitle),
                new(_l["Export:Col:Assignee"], t => t.AssigneeName),
                new(_l["Export:Col:Status"], t => _l[$"Tasks:Status:{t.Status}"].Value),
                new(_l["Export:Col:Priority"], t => _l[$"Tasks:Priority:{t.Priority}"].Value),
                new(_l["Export:Col:StartDate"], t => t.StartDate, "dd.MM.yyyy"),
                new(_l["Export:Col:DueDate"], t => t.DueDate, "dd.MM.yyyy"),
                new(_l["Export:Col:CompletedDate"], t => t.CompletedDate, "dd.MM.yyyy"),
                new(_l["Export:Col:EstimatedHours"], t => t.EstimatedHours, "#,##0.0"),
                new(_l["Export:Col:SpentHours"], t => t.SpentHours, "#,##0.0"),
                new(_l["Export:Col:Tags"], t => string.Join(", ", t.Tags.Select(x => x.Name))),
                // İçe aktarmanın okuduğu son sütun: indirilen dosya geri yüklenince açıklama kaybolmaz.
                new(_l["Export:Col:Description"], t => t.Description),
                new(_l["Export:Col:CreationTime"], t => t.CreationTime, "dd.MM.yyyy HH:mm"),
            };

            var name = _l["Export:Tasks:Name"].Value;
            var note = rows.Truncated ? _l["Export:Truncated", ExcelTable.MaxRows].Value : null;
            return this.TableFile(name, columns, rows.Items, note);
        }
    }
}
