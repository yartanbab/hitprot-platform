using AutoMapper;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// AutoMapper profile for DynamicAssets module.
/// Maps domain entities to their corresponding DTOs.
/// </summary>
public class DynamicAssetsApplicationAutoMapperProfile : Profile
{
    public DynamicAssetsApplicationAutoMapperProfile()
    {
        // AppDocument -> DocumentDto (including child Blocks collection)
        CreateMap<AppDocument, DocumentDto>();

        // AppBlock -> BlockDto
        CreateMap<AppBlock, BlockDto>();

        // Public-facing mappings (Faz 4 — anonymous form rendering)
        CreateMap<AppDocument, PublicDocumentDto>();
        CreateMap<AppBlock, PublicBlockDto>();
    }
}
