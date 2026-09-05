using System;
using System.Threading.Tasks;
using Apya.Platform.RegistrationRequests.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// Kayıt talebi uygulama servisi. <see cref="Apya.Platform.Consents.IConsentAppService"/>
/// ile aynı gerekçeyle HTTP API olarak AÇILMAZ: oluşturma oturumsuzdur ve IP/UA
/// yalnız Web sınırında güvenilir biçimde yakalanabilir; açık bir uç, formu atlayıp
/// doğrudan kayıt üretmeye izin verirdi.
/// </summary>
public interface IRegistrationRequestAppService : IApplicationService
{
    /// <summary>Kayıt talebini kaydeder (oturumsuz; Web sınırından çağrılır).</summary>
    Task<Guid> CreateAsync(CreateRegistrationRequestDto input);

    /// <summary>Panel listesi (izin: RegistrationRequests.Default).</summary>
    Task<PagedResultDto<RegistrationRequestDto>> GetListAsync(RegistrationRequestListFilterDto input);

    /// <summary>Tek kayıt (izin: RegistrationRequests.Default).</summary>
    Task<RegistrationRequestDto> GetAsync(Guid id);

    /// <summary>Durum / paket / bedel / iç not günceller (izin: RegistrationRequests.Manage).</summary>
    Task<RegistrationRequestDto> UpdateAsync(Guid id, UpdateRegistrationRequestDto input);

    /// <summary>Durumlara göre kayıt sayıları — panel sekmelerinin rozetleri.</summary>
    Task<RegistrationRequestSummaryDto> GetSummaryAsync();
}
