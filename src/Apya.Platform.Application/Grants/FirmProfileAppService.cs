using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>Mevcut tenant'ın (firma) eşleştirme profili — tekil, upsert.</summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class FirmProfileAppService : ApplicationService, IFirmProfileAppService
{
    private readonly IRepository<FirmProfile, Guid> _profileRepo;
    private readonly IRepository<FirmProfileTag, Guid> _tagRepo;

    public FirmProfileAppService(
        IRepository<FirmProfile, Guid> profileRepo,
        IRepository<FirmProfileTag, Guid> tagRepo)
    {
        _profileRepo = profileRepo;
        _tagRepo = tagRepo;
    }

    public async Task<FirmProfileDto> GetMyProfileAsync()
    {
        var profile = await _profileRepo.FirstOrDefaultAsync();
        if (profile == null)
        {
            return new FirmProfileDto();
        }
        var tags = await _tagRepo.GetListAsync(t => t.FirmProfileId == profile.Id);
        return new FirmProfileDto
        {
            Size = profile.Size,
            Tags = tags.Select(t => new GrantCriteriaTagDto { Kind = t.Kind, Value = t.Value }).ToList()
        };
    }

    public async Task<FirmProfileDto> UpdateMyProfileAsync(UpdateFirmProfileDto input)
    {
        var profile = await _profileRepo.FirstOrDefaultAsync();
        if (profile == null)
        {
            profile = new FirmProfile(GuidGenerator.Create(), CurrentTenant.Id) { Size = input.Size };
            await _profileRepo.InsertAsync(profile, autoSave: true);
        }
        else
        {
            profile.Size = input.Size;
            await _profileRepo.UpdateAsync(profile, autoSave: true);
        }

        var existing = await _tagRepo.GetListAsync(t => t.FirmProfileId == profile.Id);
        await _tagRepo.DeleteManyAsync(existing);

        var saved = new List<GrantCriteriaTagDto>();
        foreach (var t in input.Tags.Where(x => !string.IsNullOrWhiteSpace(x.Value)))
        {
            await _tagRepo.InsertAsync(new FirmProfileTag(GuidGenerator.Create(), profile.Id, t.Kind, t.Value));
            saved.Add(new GrantCriteriaTagDto { Kind = t.Kind, Value = t.Value.Trim() });
        }

        // Dönüş, kaydedilen girdiden kurulur — aynı UoW içinde henüz flush edilmemiş
        // tag'leri GetMyProfileAsync yeniden okuyamayacağı için (boş dönerdi).
        return new FirmProfileDto { Size = profile.Size, Tags = saved };
    }
}
