using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Apya.Platform.Permissions;
using Apya.Platform.Projects.Dtos;

namespace Apya.Platform.Projects;

[Authorize(PlatformPermissions.Tasks.Default)]
public class ProjectTaskAppService : PlatformAppService, IProjectTaskAppService
{
    private readonly IRepository<ProjectTask, Guid> _taskRepository;
    private readonly IIdentityUserRepository _userRepository;

    public ProjectTaskAppService(
        IRepository<ProjectTask, Guid> taskRepository,
        IIdentityUserRepository userRepository)
    {
        _taskRepository = taskRepository;
        _userRepository = userRepository;
    }

    public async Task<List<UserLookupDto>> GetUserLookupAsync()
    {
        var users = await _userRepository.GetListAsync();

        return users.Select(u => new UserLookupDto
        {
            Id = u.Id,
            UserName = u.UserName,
            Name = u.Name,
            Surname = u.Surname
        }).ToList();
    }

    public async Task<List<ProjectTaskDto>> GetListByProjectIdAsync(Guid projectId)
    {
        var tasks = await _taskRepository.GetListAsync(t => t.ProjectId == projectId);
        return ObjectMapper.Map<List<ProjectTask>, List<ProjectTaskDto>>(tasks);
    }

    [Authorize(PlatformPermissions.Tasks.Create)]
    public async Task<ProjectTaskDto> CreateAsync(CreateUpdateProjectTaskDto input)
    {
        var task = ObjectMapper.Map<CreateUpdateProjectTaskDto, ProjectTask>(input);

        // --- Alt Görevleri (SubTasks) Parçala ve Ekle ---
        if (!string.IsNullOrWhiteSpace(input.SubTasksText))
        {
            var subTaskLines = input.SubTasksText.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

            foreach (var line in subTaskLines)
            {
                var cleanLine = line.Trim();
                if (!string.IsNullOrEmpty(cleanLine))
                {
                    // Not: Domain katmanındaki Alt Görev sınıfının adı farklıysa (örn: ProjectSubTask) 'SubTask' kısmını düzeltmelisin.
                    task.SubTasks.Add(new SubTask
                    {
                        Title = cleanLine,
                        IsCompleted = false
                    });
                }
            }
        }

        // --- İlk Yorumu (InitialComment) Ekle ---
        if (!string.IsNullOrWhiteSpace(input.InitialComment))
        {
            // Not: Domain katmanındaki Yorum sınıfının adı farklıysa (örn: ProjectTaskComment) 'TaskComment' kısmını düzeltmelisin.
            task.Comments.Add(new TaskComment
            {
                Text = input.InitialComment.Trim()
            });
        }

        await _taskRepository.InsertAsync(task, autoSave: true);
        return ObjectMapper.Map<ProjectTask, ProjectTaskDto>(task);
    }

    [Authorize(PlatformPermissions.Tasks.Edit)]
    public async Task<ProjectTaskDto> UpdateAsync(Guid id, CreateUpdateProjectTaskDto input)
    {
        var task = await _taskRepository.GetAsync(id);
        ObjectMapper.Map(input, task);
        await _taskRepository.UpdateAsync(task);
        return ObjectMapper.Map<ProjectTask, ProjectTaskDto>(task);
    }

    [Authorize(PlatformPermissions.Tasks.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await _taskRepository.DeleteAsync(id);
    }
}