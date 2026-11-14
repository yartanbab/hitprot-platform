using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Grants;

/// <summary>
/// Kurum parametre kataloğunu (<see cref="FirmParameterCatalog"/>) kurar.
///
/// <para>🔴 HOST-ONLY: ABP bu tohumlayıcıyı her yeni kurum açılışında da çağırır; katalog
/// tektir, kurum bağlamında hiçbir şey yazılmaz.</para>
///
/// <para>Yeniden çalıştırılabilir: yalnız EKSİK tanım eklenir. Var olan tanıma dokunulmaz —
/// host adını, açıklamasını ya da eşleştirmedeki rolünü değiştirdiyse tohumlama geri almaz.
/// Host'un sildiği tanım da geri gelmez: varlık denetimi silinmişleri de sayar (aksi halde
/// aynı Id ile yeniden eklenip birincil anahtarda çakışırdı).</para>
/// </summary>
public class FirmParameterDefinitionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<FirmParameterDefinition, Guid> _repository;
    private readonly IDataFilter<ISoftDelete> _softDeleteFilter;

    public FirmParameterDefinitionDataSeedContributor(
        IRepository<FirmParameterDefinition, Guid> repository,
        IDataFilter<ISoftDelete> softDeleteFilter)
    {
        _repository = repository;
        _softDeleteFilter = softDeleteFilter;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return; // katalog host'ta yaşar
        }

        var catalog = FirmParameterCatalog.Build();
        var catalogIds = catalog.Select(d => d.Id).ToList();

        using (_softDeleteFilter.Disable())
        {
            var existing = await _repository.GetListAsync();
            var knownIds = existing.Select(d => d.Id).ToHashSet();
            // Kod yalnız CANLI tanımlar arasında benzersizdir: host aynı kodla kendi
            // tanımını açtıysa tohum onunla çakışmasın.
            var liveCodes = existing.Where(d => !d.IsDeleted).Select(d => d.Code).ToHashSet(StringComparer.Ordinal);

            foreach (var definition in catalog)
            {
                if (knownIds.Contains(definition.Id) || liveCodes.Contains(definition.Code))
                {
                    continue;
                }
                await _repository.InsertAsync(definition, autoSave: true);
            }
        }
    }
}
