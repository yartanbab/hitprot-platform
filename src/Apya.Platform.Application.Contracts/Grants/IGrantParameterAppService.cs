using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>
/// 1b · Hibe Parametre Formu. Yalnız host bağlamında çalışır — katalog host verisidir.
/// </summary>
public interface IGrantParameterAppService : IApplicationService
{
    Task<GrantParameterDto> GetAsync(Guid id);

    Task<GrantParameterDto> UpdateAsync(Guid id, UpdateGrantParameterDto input);

    /// <summary>
    /// Kaydedilmemiş parametrelerle canlı eşleşme önizlemesi (sağ panel). Veritabanına
    /// hiçbir şey yazmaz.
    /// </summary>
    Task<GrantMatchPreviewDto> PreviewMatchAsync(Guid id, UpdateGrantParameterDto input);

    /// <summary>
    /// Programın taslak çağrılarını yayına alır. Zorunlu alan eksikse
    /// <c>Platform:Grant:PublishRequiredFieldsMissing</c> ile reddeder.
    /// </summary>
    Task<GrantParameterDto> PublishAsync(Guid id);
}
