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
        public Guid ProjectId { get; set; } // EKSÝKTÝ EKLENDÝ

        [BindProperty]
        public CreateAnalysisDto Analysis { get; set; }

        public ProjectAnalysisDto ExistingAnalysis { get; set; } // EKSÝKTÝ EKLENDÝ

        private readonly IProjectAppService _projectAppService;

        public AnalysisInputModalModel(IProjectAppService projectAppService)
        {
            _projectAppService = projectAppService;
        }

        public async Task OnGetAsync()
        {
            Analysis = new CreateAnalysisDto { ProjectId = ProjectId };
            // Mevcut analizi kontrol et (varsa getir)
            ExistingAnalysis = await _projectAppService.GetAnalysisAsync(ProjectId);
        }

        public async Task<IActionResult> OnPostAsync()
        {
            Analysis.ProjectId = ProjectId;
            await _projectAppService.AddAnalysisAsync(Analysis);
            return NoContent();
        }
    }
}