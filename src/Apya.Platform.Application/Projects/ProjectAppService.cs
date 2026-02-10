using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Application.Projects;

public class ProjectAppService :
    CrudAppService<
        Project,
        ProjectDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateProjectDto>,
    IProjectAppService
{
    private readonly ProjectManager _projectManager;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<ProjectTask, Guid> _taskRepository;
    private readonly IRepository<ProjectAttachment, Guid> _projectAttachmentRepository;

    public ProjectAppService(
        IRepository<Project, Guid> repository,
        ProjectManager projectManager,
        IRepository<Grant, Guid> grantRepository,
        IRepository<ProjectTask, Guid> taskRepository,
        IRepository<ProjectAttachment, Guid> projectAttachmentRepository)
        : base(repository)
    {
        _projectManager = projectManager;
        _grantRepository = grantRepository;
        _taskRepository = taskRepository;
        _projectAttachmentRepository = projectAttachmentRepository;
    }

    // --- CREATE ---
    public override async Task<ProjectDto> CreateAsync(CreateProjectDto input)
    {
        var project = await _projectManager.CreateAsync(input.GrantId, input.Name, input.Code, input.Description ?? "");
        await Repository.InsertAsync(project);
        return ObjectMapper.Map<Project, ProjectDto>(project);
    }

    // --- GET LIST ---
    public override async Task<PagedResultDto<ProjectDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var totalCount = await Repository.GetCountAsync();
        var query = await Repository.GetQueryableAsync();

        if (!input.Sorting.IsNullOrWhiteSpace()) query = query.OrderBy(input.Sorting);
        else query = query.OrderBy(p => p.Name);

        query = query.Skip(input.SkipCount).Take(input.MaxResultCount);
        var items = await AsyncExecuter.ToListAsync(query);

        return new PagedResultDto<ProjectDto>(
            totalCount,
            ObjectMapper.Map<List<Project>, List<ProjectDto>>(items)
        );
    }

    // --- DİĞER METODLAR ---
    public async Task<List<GrantDto>> GetAllGrantsAsync()
    {
        var grants = await _grantRepository.GetListAsync();
        return ObjectMapper.Map<List<Grant>, List<GrantDto>>(grants);
    }

    public async Task AddAttachmentAsync(Guid projectId, string fileName, string storedFileName, long fileSize)
    {
        await _projectAttachmentRepository.InsertAsync(new ProjectAttachment
        {
            ProjectId = projectId,
            FileName = fileName,
            StoredFileName = storedFileName,
            FileSize = fileSize
        });
    }

    // --- ANALİZ VE HİBE (DUMMY IMPLEMENTATION - Hataları çözmek için) ---
    public Task<ProjectAnalysisDto?> GetAnalysisAsync(Guid projectId)
    {
        // Şimdilik boş dönüyoruz, sonra dolduracağız
        return Task.FromResult<ProjectAnalysisDto?>(null);
    }

    public Task<ProjectAnalysisDto> AddAnalysisAsync(CreateAnalysisDto input)
    {
        // Şimdilik boş bir nesne dönüyoruz
        return Task.FromResult(new ProjectAnalysisDto());
    }

    public Task<List<GrantDto>> GetSuitableGrantsAsync(Guid projectId)
    {
        // Şimdilik boş liste dönüyoruz
        return Task.FromResult(new List<GrantDto>());
    }
}