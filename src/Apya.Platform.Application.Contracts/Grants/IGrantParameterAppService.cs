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

    /// <summary>
    /// 10b çelişkisi: şartı son taslak çağrının resmî metninden okunan değere geri döndürür
    /// ve metin alanını kabul edilmiş sayar.
    /// </summary>
    Task<GrantParameterDto> ApplySourceValueAsync(Guid id, GrantEligibilityRule rule);

    /// <summary>
    /// 10b çelişkisi: host'un değerini korur. Metin önerisi reddedilir; uyarı bir daha çıkmaz
    /// ve şartın kaynağı "elle" olur.
    /// </summary>
    Task<GrantParameterDto> KeepOwnValueAsync(Guid id, GrantEligibilityRule rule);
}
