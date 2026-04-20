using AutoMapper;
using Apya.Platform.AssetRelations.Dtos;

namespace Apya.Platform.AssetRelations;

/// <summary>
/// AutoMapper profile for the AssetRelations module.
/// </summary>
public class AssetRelationsApplicationAutoMapperProfile : Profile
{
    public AssetRelationsApplicationAutoMapperProfile()
    {
        CreateMap<EntityLink, EntityLinkDto>();
    }
}
