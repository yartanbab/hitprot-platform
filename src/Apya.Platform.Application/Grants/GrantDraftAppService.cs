using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 3a · Elle Hibe Girme. Metni <see cref="GrantTextExtractor"/> ile alanlara böler,
/// host'un KABUL ettiklerinden taslak çağrı üretir.
///
/// <para>🔴 Üretilen çağrı daima <see cref="GrantCallStatus.Taslak"/>'tır — yayın kararı
/// 1b'deki parametre formunda verilir.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantDraftAppService : ApplicationService, IGrantDraftAppService
{
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<GrantDraftField, Guid> _fieldRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<GrantDocumentRequirement, Guid> _documentRepo;
    private readonly GrantTextExtractor _extractor;

    public GrantDraftAppService(
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<GrantDraftField, Guid> fieldRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        IRepository<GrantDocumentRequirement, Guid> documentRepo,
        GrantTextExtractor extractor)
    {
        _grantRepo = grantRepo;
        _callRepo = callRepo;
        _fieldRepo = fieldRepo;
        _criteriaRepo = criteriaRepo;
        _documentRepo = documentRepo;
        _extractor = extractor;
    }

    public Task<GrantExtractionResultDto> ExtractAsync(ExtractGrantTextInput input)
    {
        EnsureHostContext();

        var found = _extractor.Extract(input.Text)
            .ToDictionary(f => f.FieldKey, f => f);

        // Bulunamayan alanlar da DÖNER (değeri null) — form "boş" satırını gösterip
        // host'un elle doldurmasına izin verir; tasarımdaki "4 boş" durumu budur.
        var fields = GrantTextExtractor.AllFields
            .Select(key => found.TryGetValue(key, out var f)
                ? new GrantExtractedFieldDto
                {
                    FieldKey = key,
                    Value = f.Value,
                    Confidence = f.Confidence,
                    Excerpt = f.Excerpt,
                    Status = GrantDraftFieldStatus.Beklemede
                }
                : new GrantExtractedFieldDto { FieldKey = key, Status = GrantDraftFieldStatus.Beklemede })
            .ToList();

        return Task.FromResult(new GrantExtractionResultDto
        {
            Fields = fields,
            FilledCount = fields.Count(f => !string.IsNullOrWhiteSpace(f.Value)),
            TotalCount = GrantTextExtractor.AllFields.Length
        });
    }

    public async Task<GrantDraftCreatedDto> CreateDraftAsync(CreateGrantDraftInput input)
    {
        EnsureHostContext();

        var values = input.Fields
            .Where(f => !string.IsNullOrWhiteSpace(f.Value))
            .GroupBy(f => f.FieldKey)
            .ToDictionary(g => g.Key, g => g.First());

        var name = Text(values, GrantTextExtractor.FieldName);
        var issuer = Text(values, GrantTextExtractor.FieldIssuer);
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(issuer))
        {
            // Ad ve kurum kolonları NOT NULL; eksikken uydurma değer yazmaktansa reddedilir.
            throw new BusinessException(PlatformDomainErrorCodes.GrantDraftIdentityRequired);
        }

        var grant = new Grant(GuidGenerator.Create(), name!, issuer!, 0m, 0)
        {
            Description = string.Empty,
            SourceUrl = input.SourceUrl
        };
        ApplyParameters(grant, values);
        await _grantRepo.InsertAsync(grant, autoSave: true);

        var deadline = Date(values, GrantTextExtractor.FieldDeadline);
        var period = string.IsNullOrWhiteSpace(input.Period)
            // Dönem çıkarılmıyor; son başvuru yılından türetilir, o da yoksa bu yıl.
            ? $"{(deadline?.Year ?? Clock.Now.Year)}/1"
            : input.Period!.Trim();

        var call = new GrantCall(GuidGenerator.Create(), grant.Id, period, GrantCallStatus.Taslak)
        {
            Origin = GrantCallOrigin.Elle
        };
        call.SetSchedule(null, deadline);
        await _callRepo.InsertAsync(call, autoSave: true);

        await SaveChildrenAsync(grant.Id, values);
        var savedFieldCount = await SaveDraftFieldsAsync(call.Id, input.Fields);

        return new GrantDraftCreatedDto
        {
            GrantId = grant.Id,
            GrantCallId = call.Id,
            SavedFieldCount = savedFieldCount
        };
    }

    /// <summary>Çıkarılan değerleri programın parametre alanlarına yazar.</summary>
    private static void ApplyParameters(Grant grant, IReadOnlyDictionary<string, GrantExtractedFieldDto> values)
    {
        if (Decimal(values, GrantTextExtractor.FieldMaxAmount) is { } amount)
        {
            grant.MaxAmount = amount;
        }
        if (Int(values, GrantTextExtractor.FieldSupportRate) is { } rate)
        {
            grant.SupportRatePercent = rate;
        }
        if (Int(values, GrantTextExtractor.FieldDuration) is { } months)
        {
            grant.ProjectDurationMonths = months;
        }
        if (Int(values, GrantTextExtractor.FieldCompanyAge) is { } age)
        {
            grant.MinCompanyAgeYears = age;
        }
        if (Int(values, GrantTextExtractor.FieldCompanySizes) is { } sizes)
        {
            grant.EligibleCompanySizes = sizes;
        }
        if (Int(values, GrantTextExtractor.FieldRdStaff) is { } rdStaff)
        {
            grant.MinRdStaffCount = rdStaff;
        }
        if (Bool(values, GrantTextExtractor.FieldConsortium) is { } consortium)
        {
            grant.RequiresConsortium = consortium;
        }

        // TRL "3-7" biçiminde gelir.
        var trl = Text(values, GrantTextExtractor.FieldTrl);
        if (trl != null)
        {
            var parts = trl.Split('-', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length == 2
                && int.TryParse(parts[0], out var min)
                && int.TryParse(parts[1], out var max))
            {
                grant.MinTrl = min;
                grant.MaxTrl = max;
            }
        }
    }

    /// <summary>NACE ve belge şartı programın child kayıtlarına gider.</summary>
    private async Task SaveChildrenAsync(Guid grantId, IReadOnlyDictionary<string, GrantExtractedFieldDto> values)
    {
        var nace = Text(values, GrantTextExtractor.FieldNace);
        if (nace != null)
        {
            await _criteriaRepo.InsertAsync(
                new GrantCriteriaTag(GuidGenerator.Create(), grantId, GrantCriteriaKind.NaceKodu, nace),
                autoSave: true);
        }

        var document = Text(values, GrantTextExtractor.FieldDocument);
        if (document != null)
        {
            await _documentRepo.InsertAsync(
                new GrantDocumentRequirement(GuidGenerator.Create(), grantId, 0, document)
                {
                    Obligation = GrantDocumentObligation.Zorunlu,
                    UploaderParty = GrantPartyRole.Firma
                },
                autoSave: true);
        }
    }

    /// <summary>
    /// Alanların ham hâli saklanır: 1a kuyruğundaki "alan güveni" ve 1b'deki sarı işaret
    /// bu kayıtlardan gelir. Boş alanlar da yazılır — "çıkarılamadı" bilgisi de bilgidir.
    /// </summary>
    private async Task<int> SaveDraftFieldsAsync(Guid callId, List<GrantExtractedFieldDto> fields)
    {
        var saved = 0;
        foreach (var f in fields.GroupBy(x => x.FieldKey).Select(g => g.First()))
        {
            await _fieldRepo.InsertAsync(
                new GrantDraftField(GuidGenerator.Create(), callId, f.FieldKey)
                {
                    RawValue = f.Value,
                    Confidence = string.IsNullOrWhiteSpace(f.Value) ? 0 : f.Confidence,
                    Status = f.Status,
                    SourceExcerpt = f.Excerpt
                },
                autoSave: true);
            saved++;
        }
        return saved;
    }

    private static string? Text(IReadOnlyDictionary<string, GrantExtractedFieldDto> v, string key)
        => v.TryGetValue(key, out var f) && !string.IsNullOrWhiteSpace(f.Value) ? f.Value!.Trim() : null;

    private static int? Int(IReadOnlyDictionary<string, GrantExtractedFieldDto> v, string key)
        => Text(v, key) is { } s && int.TryParse(s, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n)
            ? n
            : null;

    private static decimal? Decimal(IReadOnlyDictionary<string, GrantExtractedFieldDto> v, string key)
        => Text(v, key) is { } s && decimal.TryParse(s, NumberStyles.Number, CultureInfo.InvariantCulture, out var d)
            ? d
            : null;

    private static bool? Bool(IReadOnlyDictionary<string, GrantExtractedFieldDto> v, string key)
        => Text(v, key) is { } s && bool.TryParse(s, out var b) ? b : null;

    private static DateTime? Date(IReadOnlyDictionary<string, GrantExtractedFieldDto> v, string key)
        => Text(v, key) is { } s
           && DateTime.TryParseExact(s, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var d)
            ? d
            : null;

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Hibe taslağı yalnızca host bağlamında oluşturulabilir.");
        }
    }
}
