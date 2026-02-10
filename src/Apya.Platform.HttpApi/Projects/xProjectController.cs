

////using System;
////using System.Threading.Tasks;
////using Microsoft.AspNetCore.Mvc;
////using Apya.Platform.Application.Contracts.Projects;
////using Apya.Platform.Application.Contracts.Projects.Dtos;

////namespace Apya.Platform.HttpApi.Projects;

////[Route("api/projects")]
////public class ProjectController : ApyaPlatformController
////{
////    private readonly IProjectAppService _service;

////    public ProjectController(IProjectAppService service)
////    {
////        _service = service;
////    }

////    [HttpPost]
////    public async Task<Guid> CreateAsync(CreateProjectDto input)
////    {
////        return await _service.CreateAsync(input);
////    }
////}


//using System;
//using System.Collections.Generic;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Mvc;
//using Volo.Abp;
//using Volo.Abp.AspNetCore.Mvc;
//using Volo.Abp.Application.Dtos;
//using Apya.Platform.Projects; // <-- EKSİK OLAN ANA SATIR BU
//using Apya.Platform.Projects.Dtos;
//using Apya.Platform.Application.Contracts.Projects.Dtos;
//using Apya.Platform.Grants.Dtos;

//namespace Apya.Platform.Controllers;

//[RemoteService(Name = "Platform")]
//[Route("/api/app/project")]
//public class ProjectController : AbpController, IProjectAppService
//{
//    private readonly IProjectAppService _projectAppService;

//    public ProjectController(IProjectAppService projectAppService)
//    {
//        _projectAppService = projectAppService;
//    }

//    [HttpPost]
//    public Task<Guid> CreateAsync(CreateProjectDto input)
//    {
//        return _projectAppService.CreateAsync(input);
//    //}

//    [HttpPost]
//    [Route("analysis")]
//    public Task<ProjectAnalysisDto> AddAnalysisAsync(CreateAnalysisDto input)
//    {
//        return _projectAppService.AddAnalysisAsync(input);
//    }

//    [HttpGet]
//    [Route("{projectId}/suitable-grants")]
//    public Task<List<GrantDto>> GetSuitableGrantsAsync(Guid projectId)
//    {
//        return _projectAppService.GetSuitableGrantsAsync(projectId);
//    }

//    [HttpGet]
//    public Task<PagedResultDto<ProjectDto>> GetListAsync(PagedAndSortedResultRequestDto input)
//    {
//        return _projectAppService.GetListAsync(input);
//    }

//    [HttpGet]
//    [Route("{projectId}/analysis")]
//    public Task<ProjectAnalysisDto?> GetAnalysisAsync(Guid projectId)
//    {
//        return _projectAppService.GetAnalysisAsync(projectId);
//    }




////}