using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;

namespace Apya.Platform.ReleaseNotes;

/// <summary>
/// Yayın kapısı devreye girmeden ÖNCE yayınlanmış sürümler için bir kerelik geri doldurma.
///
/// <para>Kapı "karar yoksa gösterme" mantığıyla çalışır. Bu tohum olmasaydı, özellik canlıya
/// indiği an bütün kullanıcılar için sürüm notları boşalır ve host tek tek onaylayana kadar
/// öyle kalırdı. Tohum, o güne kadar zaten herkese açık olan katalogdaki maddeleri
/// "onaylı · tüm paketler · herkes" olarak yazar; host istemediklerini ekrandan kaldırır.</para>
///
/// <para>🔑 YALNIZ TABLO TAMAMEN BOŞSA çalışır. Aksi hâlde her DbMigrator koşusunda yeni
/// eklenen sürümleri de sessizce onaylardı — oysa bundan sonraki her sürüm host onayı
/// beklemeli.</para>
/// </summary>
public class ReleaseNotePublicationDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<ReleaseNotePublication, Guid> _repository;
    private readonly IGuidGenerator _guidGenerator;

    public ReleaseNotePublicationDataSeedContributor(
        IRepository<ReleaseNotePublication, Guid> repository,
        IGuidGenerator guidGenerator)
    {
        _repository = repository;
        _guidGenerator = guidGenerator;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        // Kararlar host seviyesindedir; kiracı tohumlamasında tekrar çalışmasın.
        if (context.TenantId != null)
        {
            return;
        }

        if (await _repository.GetCountAsync() > 0)
        {
            return;
        }

        var allPackages = Enum.GetValues<PackageCode>();
        var rows = new List<ReleaseNotePublication>();

        foreach (var release in ReleaseNoteCatalog.All)
        {
            foreach (var item in release.Items)
            {
                var row = new ReleaseNotePublication(_guidGenerator.Create(), release.Version, item.Key);
                row.Set(
                    isApproved: true,
                    showInModal: true,
                    showInHistory: true,
                    packages: allPackages,
                    audience: ReleaseNoteAudience.Everyone);
                rows.Add(row);
            }
        }

        if (rows.Count > 0)
        {
            await _repository.InsertManyAsync(rows, autoSave: true);
        }
    }
}
