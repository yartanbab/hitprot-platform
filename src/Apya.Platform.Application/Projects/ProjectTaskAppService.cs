using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq; // Select/ToList için gerekli
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity; // IdentityUserRepository için gerekli
using Apya.Platform.Permissions;
using Apya.Platform.Projects.Dtos;

namespace Apya.Platform.Projects;

[Authorize(PlatformPermissions.Tasks.Default)]
public class ProjectTaskAppService : PlatformAppService, IProjectTaskAppService
{
    private readonly IRepository<ProjectTask, Guid> _taskRepository;
    private readonly IIdentityUserRepository _userRepository; // <--- EKLENDİ (Enjeksiyon)

    // Constructor (Yapıcı Metot) Güncellendi
    public ProjectTaskAppService(
        IRepository<ProjectTask, Guid> taskRepository,
        IIdentityUserRepository userRepository) // <--- EKLENDİ
    {
        _taskRepository = taskRepository;
        _userRepository = userRepository;
    }

    // YENİ METOT: Kullanıcı Listesini Getir (Dropdown için)
    public async Task<List<UserLookupDto>> GetUserLookupAsync()
    {
        var users = await _userRepository.GetListAsync();

        // Kullanıcı entity'lerini DTO'ya çeviriyoruz
        return users.Select(u => new UserLookupDto
        {
            Id = u.Id,
            UserName = u.UserName,
            Name = u.Name,
            Surname = u.Surname
        }).ToList();
    }

    // LISTELEME
    public async Task<List<ProjectTaskDto>> GetListByProjectIdAsync(Guid projectId)
    {
        var tasks = await _taskRepository.GetListAsync(t => t.ProjectId == projectId);
        return ObjectMapper.Map<List<ProjectTask>, List<ProjectTaskDto>>(tasks);
    }

    // OLUŞTURMA
    [Authorize(PlatformPermissions.Tasks.Create)]
    public async Task<ProjectTaskDto> CreateAsync(CreateUpdateProjectTaskDto input)
    {
        var task = ObjectMapper.Map<CreateUpdateProjectTaskDto, ProjectTask>(input);
        await _taskRepository.InsertAsync(task);
        return ObjectMapper.Map<ProjectTask, ProjectTaskDto>(task);
    }

    // GÜNCELLEME
    [Authorize(PlatformPermissions.Tasks.Edit)]
    public async Task<ProjectTaskDto> UpdateAsync(Guid id, CreateUpdateProjectTaskDto input)
    {
        var task = await _taskRepository.GetAsync(id);
        ObjectMapper.Map(input, task);
        await _taskRepository.UpdateAsync(task);
        return ObjectMapper.Map<ProjectTask, ProjectTaskDto>(task);
    }

    // SİLME
    [Authorize(PlatformPermissions.Tasks.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await _taskRepository.DeleteAsync(id);
    }

    
}