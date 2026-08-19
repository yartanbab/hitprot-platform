using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Permissions;

namespace Apya.Platform.Documents;

/// <summary>
/// Belge tipleri + alan şemaları — Faz A'da salt okuma.
/// Sistem tipleri host seviyesinde (TenantId = null) seed edildiği için
/// kiracı filtresi kapatılarak okunur (Grants katalogundaki desen).
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class DocumentTypeAppService : ApplicationService, IDocumentTypeAppService
{
    private readonly IRepository<DocumentType, Guid> _typeRepository;
    private readonly IRepository<DocumentTypeField, Guid> _fieldRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public DocumentTypeAppService(
        IRepository<DocumentType, Guid> typeRepository,
        IRepository<DocumentTypeField, Guid> fieldRepository,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _typeRepository = typeRepository;
        _fieldRepository = fieldRepository;
        _mtFilter = mtFilter;
    }

    public virtual async Task<List<DocumentTypeDto>> GetListAsync()
    {
        var tenantId = CurrentTenant.Id;

        using (_mtFilter.Disable())
        {
            var typeQueryable = await _typeRepository.GetQueryableAsync();
            var types = await AsyncExecuter.ToListAsync(
                typeQueryable.AsNoTracking()
                    .Where(x => x.TenantId == null || x.TenantId == tenantId)
                    .OrderBy(x => x.Order)
                    .ThenBy(x => x.Name));

            if (types.Count == 0)
            {
                return new List<DocumentTypeDto>();
            }

            var typeIds = types.Select(x => x.Id).ToList();

            var fieldQueryable = await _fieldRepository.GetQueryableAsync();
            var fields = await AsyncExecuter.ToListAsync(
                fieldQueryable.AsNoTracking()
                    .Where(f => typeIds.Contains(f.DocumentTypeId))
                    .OrderBy(f => f.Order));

            var fieldsByType = fields
                .GroupBy(f => f.DocumentTypeId)
                .ToDictionary(g => g.Key, g => g.ToList());

            var dtos = ObjectMapper.Map<List<DocumentType>, List<DocumentTypeDto>>(types);

            foreach (var dto in dtos)
            {
                dto.Fields = fieldsByType.TryGetValue(dto.Id, out var typeFields)
                    ? ObjectMapper.Map<List<DocumentTypeField>, List<DocumentTypeFieldDto>>(typeFields)
                    : new List<DocumentTypeFieldDto>();
            }

            return dtos;
        }
    }
}
