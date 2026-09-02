using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>5a · Host: Ön Değerlendirme Talepleri (lead kutusu).</summary>
public interface IGrantLeadAppService : IApplicationService
{
    Task<GrantLeadConsoleDto> GetAsync();

    Task<GrantLeadDetailDto> GetDetailAsync(Guid leadId);

    Task<GrantLeadConsoleDto> SetStatusAsync(SetGrantLeadStatusInput input);

    /// <summary>Talebi kiracıya dönüştürür; test cevapları firma profiline aktarılır.</summary>
    Task<GrantLeadConversionResultDto> ConvertToTenantAsync(ConvertGrantLeadInput input);
}
