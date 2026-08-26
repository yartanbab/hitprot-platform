using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Application.Projects;

/// <summary>
/// Proje kategorisi tanımları.
///
/// Sistem kategorileri (Hibe / Etkinlik / Diğer) GLOBAL satırlardır: migration ile gelir,
/// tüm kiracılar görür, düzenlenemez ve silinemez — yalnız kiracı bazında gizlenebilir.
/// Kiracının kendi eklediği kategoriler tam CRUD'a açıktır.
/// </summary>
[Authorize(PlatformPermissions.Projects.Default)]
public class ProjectCategoryAppService : ApplicationService, IProjectCategoryAppService
{
    private readonly IRepository<ProjectCategoryDefinition, Guid> _repository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ProjectCategoryStore _store;
    private readonly ISettingManager _settingManager;

    public ProjectCategoryAppService(
        IRepository<ProjectCategoryDefinition, Guid> repository,
        IRepository<Project, Guid> projectRepository,
        ProjectCategoryStore store,
        ISettingManager settingManager)
    {
        _repository = repository;
        _projectRepository = projectRepository;
        _store = store;
        _settingManager = settingManager;
    }

    public async Task<List<ProjectCategoryDto>> GetListAsync()
    {
        var all = await _store.GetAllAsync();
        var hidden = await _store.GetHiddenIdsAsync();
        var counts = await GetProjectCountsAsync();

        return all.Select(c =>
        {
            var dto = ObjectMapper.Map<ProjectCategoryDefinition, ProjectCategoryDto>(c);

            // Gizlenmiş sistem kategorisi ayarlar ekranında "pasif" görünür; kullanıcı
            // için gizleme ile pasiflik tek bir anahtardır.
            if (hidden.Contains(c.Id))
            {
                dto.IsActive = false;
            }

            dto.ProjectCount = counts.GetValueOrDefault(c.Id);
            return dto;
        }).ToList();
    }

    public async Task<List<ProjectCategoryDto>> GetSelectableAsync()
    {
        var items = await _store.GetSelectableAsync();
        return ObjectMapper.Map<List<ProjectCategoryDefinition>, List<ProjectCategoryDto>>(items);
    }

    [Authorize(PlatformPermissions.Projects.ManageCategories)]
    public async Task<ProjectCategoryDto> CreateAsync(CreateUpdateProjectCategoryDto input)
    {
        await CheckNameIsFreeAsync(input.Name, excludeId: null);

        // Kiracı kaydı DAİMA kiracıya bağlıdır. Host bağlamında kategori eklemek yeni bir
        // sistem kategorisi üretmek olurdu — o yol migration'a ait, buradan açılmaz.
        var entity = new ProjectCategoryDefinition(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            input.Name,
            input.Icon,
            input.Tone,
            input.Order,
            systemKey: null);

        entity.SetActive(input.IsActive);

        await _repository.InsertAsync(entity);

        return ObjectMapper.Map<ProjectCategoryDefinition, ProjectCategoryDto>(entity);
    }

    [Authorize(PlatformPermissions.Projects.ManageCategories)]
    public async Task<ProjectCategoryDto> UpdateAsync(Guid id, CreateUpdateProjectCategoryDto input)
    {
        var entity = await GetOwnCategoryAsync(id);

        await CheckNameIsFreeAsync(input.Name, excludeId: id);

        entity.Update(input.Name, input.Icon, input.Tone, input.Order, input.IsActive);

        await _repository.UpdateAsync(entity);

        return ObjectMapper.Map<ProjectCategoryDefinition, ProjectCategoryDto>(entity);
    }

    [Authorize(PlatformPermissions.Projects.ManageCategories)]
    public async Task DeleteAsync(Guid id)
    {
        var entity = await GetOwnCategoryAsync(id);

        // Kategori projeye FK ile bağlı (OnDelete.Restrict). Kullanımdayken silmek DB
        // seviyesinde patlardı; anlaşılır hatayla önce burada durduruluyor.
        var inUse = await _projectRepository.CountAsync(p => p.CategoryId == id);
        if (inUse > 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.ProjectCategoryInUse)
                .WithData("Name", entity.Name)
                .WithData("Count", inUse);
        }

        await _repository.DeleteAsync(entity);
    }

    [Authorize(PlatformPermissions.Projects.ManageCategories)]
    public async Task SetSystemVisibilityAsync(Guid id, bool visible)
    {
        var category = (await _store.GetAllAsync()).FirstOrDefault(c => c.Id == id);
        if (category == null || !category.IsSystem)
        {
            throw new BusinessException(PlatformDomainErrorCodes.ProjectCategoryNotFound)
                .WithData("Id", id);
        }

        // "Diğer / Genel" gizlenemez: kategorisi çözülemeyen proje oraya düşer, gizlenirse
        // yeni proje ekranı kategorisiz kalırdı.
        if (id == ProjectCategoryConsts.SystemIds.Other)
        {
            throw new BusinessException(PlatformDomainErrorCodes.ProjectCategorySystemReadOnly)
                .WithData("Name", category.Name);
        }

        var hidden = await _store.GetHiddenIdsAsync();
        if (visible)
        {
            hidden.Remove(id);
        }
        else
        {
            hidden.Add(id);
        }

        await _settingManager.SetForCurrentTenantAsync(
            PlatformSettings.Projects.HiddenCategories,
            string.Join(",", hidden));
    }

    /// <summary>
    /// Düzenleme/silme için kiracının KENDİ kaydını getirir. Sistem kaydı ya da başka
    /// kiracının kaydı buraya giremez — Id tahminiyle global satır düzenlenemesin.
    /// </summary>
    private async Task<ProjectCategoryDefinition> GetOwnCategoryAsync(Guid id)
    {
        var entity = await _repository.FindAsync(c => c.Id == id && c.TenantId == CurrentTenant.Id);
        if (entity == null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.ProjectCategoryNotFound)
                .WithData("Id", id);
        }

        if (entity.IsSystem)
        {
            throw new BusinessException(PlatformDomainErrorCodes.ProjectCategorySystemReadOnly)
                .WithData("Name", entity.Name);
        }

        return entity;
    }

    /// <summary>
    /// Ad çakışması. DB'deki unique index (TenantId + Name) zaten korur ama ham çakışma
    /// hatası kullanıcıya 500 olarak dönerdi; burada anlaşılır hataya çevriliyor. Sistem
    /// kategorilerinin adları da hesaba katılır — kiracı "Hibe Projesi" adında ikinci bir
    /// kategori açamaz.
    /// </summary>
    private async Task CheckNameIsFreeAsync(string name, Guid? excludeId)
    {
        var trimmed = (name ?? string.Empty).Trim();
        var clash = (await _store.GetAllAsync())
            .Any(c => c.Id != excludeId
                      && string.Equals(c.Name, trimmed, StringComparison.OrdinalIgnoreCase));

        if (clash)
        {
            throw new BusinessException(PlatformDomainErrorCodes.ProjectCategoryNameAlreadyExists)
                .WithData("Name", trimmed);
        }
    }

    /// <summary>Kategori başına proje sayısı — tek sorguda.</summary>
    private async Task<Dictionary<Guid, int>> GetProjectCountsAsync()
    {
        var queryable = await _projectRepository.GetQueryableAsync();
        var grouped = await AsyncExecuter.ToListAsync(
            queryable.GroupBy(p => p.CategoryId)
                     .Select(g => new { CategoryId = g.Key, Count = g.Count() }));

        return grouped.ToDictionary(x => x.CategoryId, x => x.Count);
    }
}
