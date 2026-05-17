using AutoMapper;
using Apya.Platform.Ai.Tenants;

namespace Apya.Platform.Ai;

public class PlatformAiApplicationAutoMapperProfile : Profile
{
    public PlatformAiApplicationAutoMapperProfile()
    {
        CreateMap<TenantAiSettings, TenantAiSettingsDto>();
    }
}
