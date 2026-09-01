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
            return WithCompleteness(new FirmProfileDto());
        }
        var tags = await _tagRepo.GetListAsync(t => t.FirmProfileId == profile.Id);
        return WithCompleteness(Map(profile, tags
            .Select(t => new GrantCriteriaTagDto { Kind = t.Kind, Value = t.Value })
            .ToList()));
    }

    public async Task<FirmProfileDto> UpdateMyProfileAsync(UpdateFirmProfileDto input)
    {
        var profile = await _profileRepo.FirstOrDefaultAsync();
        if (profile == null)
        {
            profile = new FirmProfile(GuidGenerator.Create(), CurrentTenant.Id);
            Apply(profile, input);
            await _profileRepo.InsertAsync(profile, autoSave: true);
        }
        else
        {
            Apply(profile, input);
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
        return WithCompleteness(Map(profile, saved));
    }

    private static void Apply(FirmProfile profile, UpdateFirmProfileDto input)
    {
        profile.Size = input.Size;
        profile.FoundedOn = input.FoundedOn;
        profile.StaffCount = input.StaffCount;
        profile.RdStaffCount = input.RdStaffCount;
        profile.AnnualRevenue = input.AnnualRevenue;
        profile.Trl = input.Trl;
        profile.HasConsortiumPartner = input.HasConsortiumPartner;
    }

    private static FirmProfileDto Map(FirmProfile p, List<GrantCriteriaTagDto> tags) => new()
    {
        Size = p.Size,
        FoundedOn = p.FoundedOn,
        StaffCount = p.StaffCount,
        RdStaffCount = p.RdStaffCount,
        AnnualRevenue = p.AnnualRevenue,
        Trl = p.Trl,
        HasConsortiumPartner = p.HasConsortiumPartner,
        Tags = tags
    };

    /// <summary>
    /// Doluluk, programların ölçebildiği alanlar üzerinden sayılır: her biri bir uygunluk
    /// şartının ya da bir skor boyutunun karşılığıdır. Boş bırakılan alan o şartı
    /// ölçülemez yapar — 1d'deki "N alan eksik" tam olarak bunu sayar.
    /// </summary>
    private static FirmProfileDto WithCompleteness(FirmProfileDto dto)
    {
        var filled = new[]
        {
            dto.Size.HasValue,
            dto.FoundedOn.HasValue,
            dto.StaffCount.HasValue,
            dto.RdStaffCount.HasValue,
            dto.AnnualRevenue.HasValue,
            dto.Trl.HasValue,
            dto.HasConsortiumPartner.HasValue,
            dto.Tags.Any(t => t.Kind == GrantCriteriaKind.NaceKodu),
            dto.Tags.Any(t => t.Kind == GrantCriteriaKind.Sektor)
        };

        dto.MissingFieldCount = filled.Count(f => !f);
        dto.CompletionPercent = (int)Math.Round(filled.Count(f => f) * 100.0 / filled.Length);
        return dto;
    }
}
