using System;
using System.Threading.Tasks;
using Apya.Platform.DemoRequests.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.DemoRequests;

/// <summary>
/// Demo talebi uygulama servisi. <see cref="Apya.Platform.Consents.IConsentAppService"/>
/// ile aynı gerekçeyle HTTP API olarak AÇILMAZ: oluşturma oturumsuzdur ve IP/UA
/// yalnız Web sınırında güvenilir biçimde yakalanabilir; açık bir uç, formu atlayıp
/// doğrudan kayıt üretmeye izin verirdi.
/// </summary>
public interface IDemoRequestAppService : IApplicationService
{
    /// <summary>Demo talebini kaydeder (oturumsuz; Web sınırından çağrılır).</summary>
    Task<Guid> CreateAsync(CreateDemoRequestDto input);

    /// <summary>Panel listesi (izin: DemoRequests.Default).</summary>
    Task<PagedResultDto<DemoRequestDto>> GetListAsync(DemoRequestListFilterDto input);

    /// <summary>Tek kayıt (izin: DemoRequests.Default).</summary>
    Task<DemoRequestDto> GetAsync(Guid id);

    /// <summary>Takip durumu / iç not günceller (izin: DemoRequests.Manage).</summary>
    Task<DemoRequestDto> UpdateAsync(Guid id, UpdateDemoRequestDto input);

    /// <summary>Durumlara göre kayıt sayıları — panel sekmelerinin rozetleri.</summary>
    Task<DemoRequestSummaryDto> GetSummaryAsync();
}
