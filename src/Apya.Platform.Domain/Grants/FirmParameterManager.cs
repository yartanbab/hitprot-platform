using System;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Kurumun parametre değerlerini yazmanın TEK yolu. Elle giriş de, belgeden çıkarım da
/// buradan geçer; doğrulama ve köken kaydı tek yerde kalır.
/// </summary>
public class FirmParameterManager : DomainService
{
    private readonly IRepository<FirmParameterDefinition, Guid> _definitionRepository;
    private readonly IRepository<FirmParameterValue, Guid> _valueRepository;
    private readonly IDataFilter<IMultiTenant> _tenantFilter;

    public FirmParameterManager(
        IRepository<FirmParameterDefinition, Guid> definitionRepository,
        IRepository<FirmParameterValue, Guid> valueRepository,
        IDataFilter<IMultiTenant> tenantFilter)
    {
        _definitionRepository = definitionRepository;
        _valueRepository = valueRepository;
        _tenantFilter = tenantFilter;
    }

    /// <summary>Yeni tanımı kataloğa ekler. Kod canlı tanımlar arasında benzersizdir.</summary>
    public async Task<FirmParameterDefinition> CreateDefinitionAsync(FirmParameterDefinition definition)
    {
        if (await _definitionRepository.AnyAsync(d => d.Code == definition.Code))
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmParameterCodeExists);
        }
        return await _definitionRepository.InsertAsync(definition, autoSave: true);
    }

    /// <summary>
    /// Tanımı siler. Sistem parametresi silinemez (motor onu okur); değeri girilmiş tanım da
    /// silinmez — kurumların verisi sahipsiz kalırdı, bunun yerine kullanımdan kaldırılır.
    /// </summary>
    public async Task DeleteDefinitionAsync(Guid definitionId)
    {
        var definition = await _definitionRepository.GetAsync(definitionId);
        if (definition.IsSystem)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmParameterSystemLocked).WithData("Name", definition.Name);
        }
        if (await CountValueOwnersAsync(definitionId) > 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmParameterHasValues).WithData("Name", definition.Name);
        }
        await _definitionRepository.DeleteAsync(definition, autoSave: true);
    }

    /// <summary>
    /// Bu parametreye değer girmiş kurum sayısı. 🔴 Kiracı süzgeci BİLEREK kapatılır: sayım
    /// bütün kurumlar üzerindendir ve yalnız host yönetiminden çağrılır; değerin kendisi okunmaz.
    /// </summary>
    public async Task<int> CountValueOwnersAsync(Guid definitionId)
    {
        using (_tenantFilter.Disable())
        {
            return await _valueRepository.CountAsync(v => v.DefinitionId == definitionId);
        }
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
