using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Projects;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Timing;
using Volo.Abp.Users;

namespace Apya.Platform.DynamicAssets.ChoiceSources;

/// <summary>
/// 16b · Formu dolduran firmanın projeleri. Kapsam kaynağın kendisinde: sorgu kiracı süzgeci AÇIK çalışır,
/// yani her firma yalnız kendi projelerini görür — aynı form 212 firmaya açılsa da.
///
/// <para>🔴 Oturumsuz ziyaretçiye liste dönmez: "dolduran firma" yoktur, kiracısız istek ise süzgeçten
/// host'un projeleri olarak geçer.</para>
///
/// <para>Bitmiş proje listelenmez. Projede "kapandı" durumu yok; ölçü bitiş tarihidir (geçmişse bitmiş).</para>
/// </summary>
[ExposeServices(typeof(IFormChoiceSource))]
public class TenantProjectsChoiceSource : IFormChoiceSource, ITransientDependency
{
    private static readonly CultureInfo Turkish = CultureInfo.GetCultureInfo("tr-TR");

    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IClock _clock;
    private readonly ICurrentUser _currentUser;

    public TenantProjectsChoiceSource(
        IRepository<Project, Guid> projectRepository, IClock clock, ICurrentUser currentUser)
    {
        _projectRepository = projectRepository;
        _clock = clock;
        _currentUser = currentUser;
    }

    public string Key => FormChoiceSources.TenantProjects;

    public FormChoiceSourceScope Scope => FormChoiceSourceScope.FillerTenant;

    public async Task<List<FormChoiceDto>> GetAsync(string? parentValue)
    {
        if (!_currentUser.IsAuthenticated)
        {
            return new List<FormChoiceDto>();
        }

        var today = _clock.Now.Date;

        return (await _projectRepository.GetListAsync(p => p.EndDate == null || p.EndDate >= today))
            .Select(p => new FormChoiceDto { Value = p.Id.ToString(), Label = p.Name })
            .OrderBy(c => c.Label, StringComparer.Create(Turkish, ignoreCase: true))
            .ToList();
    }
}
