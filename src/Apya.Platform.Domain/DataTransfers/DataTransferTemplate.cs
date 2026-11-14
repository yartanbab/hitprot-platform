using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.DataTransfers;

/// <summary>
/// Aktarım şablonu: bir modül ve yön (içe/dışa) için adlandırılmış sütun seti, başlık eşlemesi ve
/// dosya biçimi. Sütun tanımı <see cref="DefinitionJson"/> içinde durur; biçimini Web katmanı bilir.
///
/// <para>Host şablonu (TenantId = null) sistem şablonudur: bütün kiracılar kullanır, yalnız host
/// değiştirir. Kiracının şablonu yalnız kendisine aittir.</para>
///
/// <para>Her değişiklik yeni bir sürümdür: önceki tanım <see cref="Versions"/> içinde saklanır,
/// geçmiş kayıtları hangi sürümle çalıştıklarını yazar.</para>
/// </summary>
public class DataTransferTemplate : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    /// <summary>Modülün kalıcı anahtarı (bkz. DataTransferModules); şablon başka modüle taşınmaz.</summary>
    public string ModuleKey { get; private set; } = null!;

    public DataTransferDirection Direction { get; private set; }

    public string Name { get; private set; } = null!;

    public string? Description { get; private set; }

    public DataTransferFileFormat Format { get; private set; }

    /// <summary>Yürürlükteki sürüm; 1 ile başlar, her değişiklikte bir artar.</summary>
    public int Version { get; private set; }

    public string DefinitionJson { get; private set; } = null!;

    /// <summary>Yürürlükteki dahil bütün sürümlerin anlık görüntüleri.</summary>
    public ICollection<DataTransferTemplateVersion> Versions { get; private set; } = new List<DataTransferTemplateVersion>();

    protected DataTransferTemplate() { }

    public DataTransferTemplate(
        Guid id,
        Guid? tenantId,
        string moduleKey,
        DataTransferDirection direction,
        string name,
        string? description,
        DataTransferFileFormat format,
        string definitionJson,
        Guid firstVersionId) : base(id)
    {
        TenantId = tenantId;
        ModuleKey = Check.NotNullOrWhiteSpace(moduleKey, nameof(moduleKey), DataTransferConsts.MaxModuleKeyLength);
        Direction = direction;
        Apply(name, description, format, definitionJson);
        Version = 1;
        Versions.Add(new DataTransferTemplateVersion(firstVersionId, tenantId, id, Version, Name, Format, DefinitionJson));
    }

    /// <summary>Şablonu değiştirir ve yeni sürüm açar; önceki sürüm saklanır.</summary>
    public void Update(string name, string? description, DataTransferFileFormat format, string definitionJson, Guid versionId)
    {
        Apply(name, description, format, definitionJson);
        Version++;
        Versions.Add(new DataTransferTemplateVersion(versionId, TenantId, Id, Version, Name, Format, DefinitionJson));
    }

    private void Apply(string name, string? description, DataTransferFileFormat format, string definitionJson)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), DataTransferConsts.MaxTemplateNameLength).Trim();
        Description = string.IsNullOrWhiteSpace(description)
            ? null
            : Check.Length(description.Trim(), nameof(description), DataTransferConsts.MaxTemplateDescriptionLength);
        Format = format;
        DefinitionJson = Check.NotNullOrWhiteSpace(definitionJson, nameof(definitionJson));
    }
}

/// <summary>Şablonun bir sürümünün anlık görüntüsü. Yalnız eklenir; değiştirilmez.</summary>
public class DataTransferTemplateVersion : CreationAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid TemplateId { get; private set; }

    public int Version { get; private set; }

    public string Name { get; private set; } = null!;

    public DataTransferFileFormat Format { get; private set; }

    public string DefinitionJson { get; private set; } = null!;

    protected DataTransferTemplateVersion() { }

    internal DataTransferTemplateVersion(
        Guid id, Guid? tenantId, Guid templateId, int version, string name,
        DataTransferFileFormat format, string definitionJson) : base(id)
    {
        TenantId = tenantId;
        TemplateId = templateId;
        Version = version;
        Name = name;
        Format = format;
        DefinitionJson = definitionJson;
    }
}
