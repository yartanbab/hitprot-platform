using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.DataTransfers.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Settings;

namespace Apya.Platform.DataTransfers;

/// <summary>
/// Aktarım şablonları. Host şablonu (TenantId boş) sistem şablonudur: kiracılar görür ve kullanır,
/// değiştiremez. Şablon yalnız, çağıranın görebildiği modül için listelenir ve kaydedilir.
/// </summary>
[Authorize]
public class DataTransferTemplateAppService : PlatformAppService, IDataTransferTemplateAppService
{
    private readonly IRepository<DataTransferTemplate, Guid> _templateRepository;
    private readonly IDataFilter<IMultiTenant> _tenantFilter;

    public DataTransferTemplateAppService(
        IRepository<DataTransferTemplate, Guid> templateRepository,
        IDataFilter<IMultiTenant> tenantFilter)
    {
        _templateRepository = templateRepository;
        _tenantFilter = tenantFilter;
    }

    public async Task<ListResultDto<DataTransferTemplateDto>> GetListAsync(GetDataTransferTemplatesInput input)
    {
        var tenantId = CurrentTenant.Id;
        List<DataTransferTemplate> templates;

        // Kiracı süzgeci kapalıyken sorgu AÇIKÇA iki tarafa daraltılır (kendi + sistem) ve blok
        // içinde çalıştırılır; süzgeçsiz sorgu bütün kiracıların şablonlarını döndürürdü.
        using (_tenantFilter.Disable())
        {
            var query = (await _templateRepository.GetQueryableAsync()).AsNoTracking()
                .Where(t => t.TenantId == null || t.TenantId == tenantId);
            if (!string.IsNullOrWhiteSpace(input.ModuleKey)) query = query.Where(t => t.ModuleKey == input.ModuleKey);
            if (input.Direction.HasValue) query = query.Where(t => t.Direction == input.Direction.Value);
            templates = await AsyncExecuter.ToListAsync(query.OrderBy(t => t.ModuleKey).ThenBy(t => t.Name));
        }

        var visible = new List<DataTransferTemplateDto>();
        foreach (var template in templates)
        {
            if (await CanSeeModuleAsync(template.ModuleKey))
            {
                visible.Add(Map(template));
            }
        }

        return new ListResultDto<DataTransferTemplateDto>(visible);
    }

    public async Task<DataTransferTemplateDto> GetAsync(Guid id)
    {
        var template = await FindVisibleAsync(id, includeVersions: false);
        return Map(template);
    }

    public async Task<DataTransferTemplateDto> CreateAsync(CreateDataTransferTemplateDto input)
    {
        await CheckManageAsync();
        var module = DataTransferModules.Find(input.ModuleKey)
            ?? throw new BusinessException(PlatformDomainErrorCodes.DataTransferTemplateModuleUnknown);
        await AuthorizationService.CheckAsync(module.Permission);

        var template = new DataTransferTemplate(
            GuidGenerator.Create(), CurrentTenant.Id, module.Key, input.Direction, input.Name, input.Description,
            input.Format, Serialize(input.Columns), GuidGenerator.Create());

        await _templateRepository.InsertAsync(template, autoSave: true);
        return Map(template);
    }

    public async Task<DataTransferTemplateDto> UpdateAsync(Guid id, SaveDataTransferTemplateDto input)
    {
        await CheckManageAsync();
        var template = await FindVisibleAsync(id, includeVersions: true);
        CheckOwn(template);

        template.Update(input.Name, input.Description, input.Format, Serialize(input.Columns), GuidGenerator.Create());
        await _templateRepository.UpdateAsync(template, autoSave: true);
        return Map(template);
    }

    public async Task DeleteAsync(Guid id)
    {
        await CheckManageAsync();
        var template = await FindVisibleAsync(id, includeVersions: false);
        CheckOwn(template);
        await _templateRepository.DeleteAsync(template);
    }

    public async Task<List<DataTransferTemplateVersionDto>> GetVersionsAsync(Guid id)
    {
        var template = await FindVisibleAsync(id, includeVersions: true);
        return template.Versions.OrderByDescending(v => v.Version)
            .Select(v => new DataTransferTemplateVersionDto
            {
                Version = v.Version,
                Name = v.Name,
                Format = v.Format,
                Columns = Deserialize(v.DefinitionJson),
                CreationTime = v.CreationTime
            })
            .ToList();
    }

    /// <summary>Kendi şablonu ya da sistem şablonu; başka kiracınınki "yok" sayılır.</summary>
    private async Task<DataTransferTemplate> FindVisibleAsync(Guid id, bool includeVersions)
    {
        var tenantId = CurrentTenant.Id;
        DataTransferTemplate? template;
        using (_tenantFilter.Disable())
        {
            var query = await _templateRepository.GetQueryableAsync();
            if (includeVersions) query = query.Include(t => t.Versions);
            template = await AsyncExecuter.FirstOrDefaultAsync(
                query.Where(t => t.Id == id && (t.TenantId == null || t.TenantId == tenantId)));
        }

        if (template == null || !await CanSeeModuleAsync(template.ModuleKey))
        {
            throw new EntityNotFoundException(typeof(DataTransferTemplate), id);
        }

        return template;
    }

    private async Task<bool> CanSeeModuleAsync(string moduleKey)
        => DataTransferModules.Find(moduleKey) is { } module && await AuthorizationService.IsGrantedAsync(module.Permission);

    /// <summary>Sistem şablonunu yalnız host değiştirir.</summary>
    private void CheckOwn(DataTransferTemplate template)
    {
        if (template.TenantId != CurrentTenant.Id)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DataTransferTemplateIsSystem).WithData("Name", template.Name);
        }
    }

    /// <summary>
    /// Şablon yönetimi izni yalnız host denetimi açtıysa aranır (aktarım izinleriyle aynı "tek anahtar";
    /// bkz. Web katmanındaki TransferAccess).
    /// </summary>
    private async Task CheckManageAsync()
    {
        if (await SettingProvider.GetAsync(PlatformSettings.DataTransfer.EnforcePermissions, false))
        {
            await AuthorizationService.CheckAsync(PlatformPermissions.DataTransfer.ManageTemplates);
        }
    }

    private static string Serialize(List<DataTransferTemplateColumnDto> columns)
    {
        var clean = columns
            .Where(c => !string.IsNullOrWhiteSpace(c.Key))
            .Select(c => new DataTransferTemplateColumnDto
            {
                Key = c.Key.Trim(),
                Header = string.IsNullOrWhiteSpace(c.Header) ? c.Key.Trim() : c.Header.Trim()
            })
            .ToList();

        if (clean.Count == 0
            || clean.GroupBy(c => c.Key).Any(g => g.Count() > 1)
            || clean.GroupBy(c => c.Header, StringComparer.OrdinalIgnoreCase).Any(g => g.Count() > 1))
        {
            throw new BusinessException(PlatformDomainErrorCodes.DataTransferTemplateColumnsInvalid);
        }

        return JsonSerializer.Serialize(clean);
    }

    private static List<DataTransferTemplateColumnDto> Deserialize(string json)
        => JsonSerializer.Deserialize<List<DataTransferTemplateColumnDto>>(json) ?? new();

    private DataTransferTemplateDto Map(DataTransferTemplate template) => new()
    {
        Id = template.Id,
        TenantId = template.TenantId,
        IsSystem = template.TenantId == null,
        IsEditable = template.TenantId == CurrentTenant.Id,
        ModuleKey = template.ModuleKey,
        Direction = template.Direction,
        Name = template.Name,
        Description = template.Description,
        Format = template.Format,
        Version = template.Version,
        Columns = Deserialize(template.DefinitionJson),
        CreationTime = template.CreationTime,
        LastModificationTime = template.LastModificationTime
    };
}
