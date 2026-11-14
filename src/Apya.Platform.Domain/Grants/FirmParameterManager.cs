using System;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// Kurumun parametre değerlerini yazmanın TEK yolu. Elle giriş de, belgeden çıkarım da
/// buradan geçer; doğrulama ve köken kaydı tek yerde kalır.
/// </summary>
public class FirmParameterManager : DomainService
{
    private readonly IRepository<FirmParameterDefinition, Guid> _definitionRepository;
    private readonly IRepository<FirmParameterValue, Guid> _valueRepository;

    public FirmParameterManager(
        IRepository<FirmParameterDefinition, Guid> definitionRepository,
        IRepository<FirmParameterValue, Guid> valueRepository)
    {
        _definitionRepository = definitionRepository;
        _valueRepository = valueRepository;
    }

    /// <summary>Geçerli kurumun değerini yazar: satır yoksa ekler, varsa üzerine yazar.</summary>
    public async Task<FirmParameterValue> SetValueAsync(
        Guid definitionId,
        FirmParameterInput input,
        FirmParameterOrigin origin)
    {
        var tenantId = RequireTenantId();
        var definition = await _definitionRepository.GetAsync(definitionId);
        var now = Clock.Now;

        // Kiracı süzgeci açık: yalnız geçerli kurumun satırı bulunur.
        var value = await _valueRepository.FirstOrDefaultAsync(v => v.DefinitionId == definitionId);
        if (value == null)
        {
            value = new FirmParameterValue(GuidGenerator.Create(), tenantId, definition, input, origin, now);
            return await _valueRepository.InsertAsync(value, autoSave: true);
        }

        value.Set(definition, input, origin, now);
        return await _valueRepository.UpdateAsync(value, autoSave: true);
    }

    /// <summary>
    /// Değeri "bilinmiyor"a döndürür: satır silinir. Sıfır yazmak bunun yerine GEÇMEZ —
    /// sıfır bir değerdir.
    /// </summary>
    public async Task ClearValueAsync(Guid definitionId)
    {
        RequireTenantId();
        await _valueRepository.DeleteAsync(v => v.DefinitionId == definitionId, autoSave: true);
    }

    private Guid RequireTenantId()
        => CurrentTenant.Id ?? throw new BusinessException(PlatformDomainErrorCodes.FirmParameterTenantRequired);
}
