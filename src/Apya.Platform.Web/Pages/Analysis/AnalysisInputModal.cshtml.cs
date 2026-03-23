using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;

namespace Apya.Platform.Web.Pages
{
    public class AnalysisInputModalModel : AbpPageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid ProjectId { get; set; }

        [BindProperty]
        public CreateAnalysisDto Analysis { get; set; } = null!;

        public ProjectAnalysisDto? ExistingAnalysis { get; set; }

        private readonly IProjectAppService _projectAppService;

        public AnalysisInputModalModel(IProjectAppService projectAppService)
        {
            _projectAppService = projectAppService;
        }

        public async Task OnGetAsync()
        {
            Analysis = new CreateAnalysisDto { ProjectId = ProjectId };
            try
            {
                ExistingAnalysis = await _projectAppService.GetAnalysisAsync(ProjectId);
            }
            catch(Exception)
            {
                ExistingAnalysis = null;
            }
        }

        public async Task<IActionResult> OnPostAsync()
        {
            Analysis.ProjectId = ProjectId;
            await _projectAppService.AddAnalysisAsync(Analysis);
            return NoContent();
        }
    }
}
