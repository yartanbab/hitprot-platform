using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// Süreli dış paylaşım linkleri (denetçi görünümü).
/// Token yalnız oluşturma yanıtında döner; sunucu hash'ini saklar.
/// </summary>
public interface IExternalShareAppService : IApplicationService
{
    Task<List<ExternalShareLinkDto>> GetListAsync(ShareTargetType targetType, Guid targetId);

    Task<CreatedShareLinkDto> CreateAsync(CreateShareLinkDto input);

    Task RevokeAsync(Guid id);

    /// <summary>
    /// Anonim denetçi sayfası için: token'ı çözer, süre/iptal kontrolü yapar,
    /// erişimi kaydeder ve salt okunur içeriği döner.
    /// </summary>
    Task<SharedPackageViewDto> ResolveAsync(string token, string? ipHash, string? userAgent);
}
