using System;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Analysis
{
    public class AnalysisModalModel : AbpPageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid ProjectId { get; set; }

        public ProjectAnalysisDto? Analysis { get; set; } // Null olabilir (? koyduk)

        private readonly IProjectAppService _projectAppService;

        public AnalysisModalModel(IProjectAppService projectAppService)
        {
            _projectAppService = projectAppService;
        }

        public async Task OnGetAsync()
        {
            // Analizi getiriyoruz
            Analysis = await _projectAppService.GetAnalysisAsync(ProjectId);
        }
    }
}