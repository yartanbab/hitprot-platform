using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;

namespace Apya.Platform.Grants;

/// <summary>
/// Duyuru sitelerinden derlenen hibe çağrılarını HOST kataloğuna kurar: ab-ilan.com "Proje, Hibe ve
/// Fonlar" kategorisi, STGM hibe duyuruları ve TÜBİTAK çağrı duyuruları. Veri gömülü
/// <c>Grants/SeedData/*.json</c> dosyalarındadır (her dosya bir kaynak); duyuru metninin tamamı
/// programın açıklamasına yazılır.
///
/// <para>Var olan bir programa yeni dönem eklemek için aynı Id ve yeni dönemle bir satır yazılır:
/// program atlanır, yalnız çağrı eklenir.</para>
///
/// <para>🔴 HOST-ONLY ve yeniden çalıştırılabilir: program sabit Id'siyle, çağrı (program, dönem)
/// çiftiyle aranır. Var olan programda yalnız BOŞ alanlar tohumdan dolar (amaç, öncelikler, başvuru
/// sahipleri, tutar/oran/süre, harcama kalemleri, belge listesi); host'un elle girdiği değere
/// DOKUNULMAZ. Var olan çağrıda yalnız boş tarihler dolar.</para>
///
/// <para>Çağrılar <see cref="GrantCallStatus.Acik"/> doğar; son başvurusu tohumlama anında geçmiş
/// olanlar arşiv olarak <see cref="GrantCallStatus.Kapandi"/> yazılır. Tutarlar yalnız TL ise
/// yazılır; döviz cinsinden tavanlar açıklamada kalır ve <c>MaxAmount</c> 0 ("tavan belirtilmemiş").</para>
/// </summary>
public class GrantAnnouncementCatalogDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private const string ResourcePrefix = "Apya.Platform.Grants.SeedData.";
    private const double DefaultMinMatchScore = 40.0;

    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepository;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costItemRepository;
    private readonly IRepository<GrantDocumentRequirement, Guid> _documentRepository;
    private readonly IGuidGenerator _guidGenerator;

    public GrantAnnouncementCatalogDataSeedContributor(
        IRepository<Grant, Guid> grantRepository,
        IRepository<GrantCall, Guid> callRepository,
        IRepository<GrantCriteriaTag, Guid> criteriaRepository,
        IRepository<GrantEligibleCostItem, Guid> costItemRepository,
        IRepository<GrantDocumentRequirement, Guid> documentRepository,
        IGuidGenerator guidGenerator)
    {
        _grantRepository = grantRepository;
        _callRepository = callRepository;
        _criteriaRepository = criteriaRepository;
        _costItemRepository = costItemRepository;
        _documentRepository = documentRepository;
        _guidGenerator = guidGenerator;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return; // katalog host'ta yaşar
        }

        // 🔴 Toplu yazım: test tabanı HER testte tüm tohumları kurar. ~2.500 satırı tek tek autoSave
        // ile yazmak her testin açılışına ~20 sn ekliyordu; var olan kayıtlar baştan bir kez okunur,
        // yeniler biriktirilip tek seferde eklenir.
        var seeds = await ReadSeedsAsync();
        var ids = seeds.Select(s => s.Id).Distinct().ToList();

        var grants = (await _grantRepository.GetListAsync(g => ids.Contains(g.Id))).ToDictionary(g => g.Id);
        var callKeys = (await _callRepository.GetListAsync(c => ids.Contains(c.GrantId)))
            .ToDictionary(c => (c.GrantId, c.Period));
        var tagKinds = (await _criteriaRepository.GetListAsync(t => ids.Contains(t.GrantId)))
            .Select(t => (t.GrantId, t.Kind)).ToHashSet();
        var withCostItems = (await _costItemRepository.GetListAsync(c => ids.Contains(c.GrantId)))
            .Select(c => c.GrantId).ToHashSet();
        var withDocuments = (await _documentRepository.GetListAsync(d => ids.Contains(d.GrantId)))
            .Select(d => d.GrantId).ToHashSet();

        var created = new HashSet<Guid>();
        var newGrants = new List<Grant>();
        var updatedGrants = new HashSet<Grant>();
        var newTags = new List<GrantCriteriaTag>();
        var newCostItems = new List<GrantEligibleCostItem>();
        var newDocuments = new List<GrantDocumentRequirement>();
        var newCalls = new List<GrantCall>();
        var updatedCalls = new List<GrantCall>();

        foreach (var seed in seeds)
        {
            if (!grants.TryGetValue(seed.Id, out var grant))
            {
                grant = new Grant(seed.Id, seed.Name, seed.Issuer, seed.MaxAmount, DefaultMinMatchScore)
                {
                    Description = seed.Description,
                    MinAmount = seed.MinAmount,
                    SourceUrl = seed.SourceUrl,
                    EligibleCompanySizes = seed.EligibleCompanySizes,
                    MaxCompanyAgeYears = seed.MaxCompanyAgeYears,
                    RequiresConsortium = seed.RequiresConsortium,
                    MinConsortiumPartners = seed.MinConsortiumPartners,
                    PrefersFemaleEntrepreneur = seed.PrefersFemaleEntrepreneur,
                    PrefersYoungEntrepreneur = seed.PrefersYoungEntrepreneur,
                    SupportRatePercent = seed.SupportRatePercent,
                    ProjectDurationMonths = seed.ProjectDurationMonths,
                    RepaymentType = seed.Repayable ? GrantRepaymentType.GeriOdemeli : GrantRepaymentType.GeriOdemesiz,
                    Objective = seed.Objective,
                    Priorities = JoinLines(seed.Priorities),
                    EligibleApplicants = JoinLines(seed.EligibleApplicants),
                    HasAdvancePayment = seed.HasAdvancePayment,
                    RequiresGuaranteeLetter = seed.RequiresGuaranteeLetter
                };
                grants[grant.Id] = grant;
                created.Add(grant.Id);
                newGrants.Add(grant);

                AddTags(newTags, grant.Id, GrantCriteriaKind.Sektor, seed.Sectors);
                AddTags(newTags, grant.Id, GrantCriteriaKind.Bolge, seed.Regions);
                AddTags(newTags, grant.Id, GrantCriteriaKind.AnahtarKelime, seed.Keywords);
                AddCostItems(newCostItems, grant.Id, seed.CostItems);
                AddDocuments(newDocuments, grant.Id, seed.Documents);
            }
            else if (!created.Contains(grant.Id))
            {
                if (EnrichExisting(grant, seed))
                {
                    updatedGrants.Add(grant);
                }

                foreach (var (kind, values) in new[]
                         {
                             (GrantCriteriaKind.Sektor, seed.Sectors),
                             (GrantCriteriaKind.Bolge, seed.Regions),
                             (GrantCriteriaKind.AnahtarKelime, seed.Keywords)
                         })
                {
                    if (values.Length > 0 && tagKinds.Add((grant.Id, kind)))
                    {
                        AddTags(newTags, grant.Id, kind, values);
                    }
                }

                if (seed.CostItems is { Length: > 0 } && withCostItems.Add(grant.Id))
                {
                    AddCostItems(newCostItems, grant.Id, seed.CostItems);
                }

                if (seed.Documents is { Length: > 0 } && withDocuments.Add(grant.Id))
                {
                    AddDocuments(newDocuments, grant.Id, seed.Documents);
                }
            }

            var deadline = ParseDate(seed.Deadline, endOfDay: true);
            if (callKeys.TryGetValue((seed.Id, seed.Period), out var existing))
            {
                // Var olan çağrıda yalnız boş tarihler dolar; durum ve dolu tarihler host'undur.
                if (existing.OpenDate == null && existing.Deadline == null && (seed.OpenDate != null || seed.Deadline != null))
                {
                    existing.SetSchedule(ParseDate(seed.OpenDate, endOfDay: false), deadline);
                    updatedCalls.Add(existing);
                }

                continue;
            }

            // Son başvurusu geçmiş çağrı arşiv olarak kalır: silinmez, "Kapandı" yazılır.
            var status = deadline < DateTime.UtcNow ? GrantCallStatus.Kapandi : Enum.Parse<GrantCallStatus>(seed.Status);

            var call = new GrantCall(_guidGenerator.Create(), seed.Id, seed.Period, status)
            {
                Budget = seed.Budget,
                Reference = seed.Reference
            };
            call.SetSchedule(ParseDate(seed.OpenDate, endOfDay: false), deadline);
            callKeys[(seed.Id, seed.Period)] = call;
            newCalls.Add(call);
        }

        // Sıra: program önce (alt kayıtlar ona bağlı).
        if (newGrants.Count > 0) await _grantRepository.InsertManyAsync(newGrants, autoSave: true);
        if (updatedGrants.Count > 0) await _grantRepository.UpdateManyAsync(updatedGrants, autoSave: true);
        if (newTags.Count > 0) await _criteriaRepository.InsertManyAsync(newTags, autoSave: true);
        if (newCostItems.Count > 0) await _costItemRepository.InsertManyAsync(newCostItems, autoSave: true);
        if (newDocuments.Count > 0) await _documentRepository.InsertManyAsync(newDocuments, autoSave: true);
        if (newCalls.Count > 0) await _callRepository.InsertManyAsync(newCalls, autoSave: true);
        if (updatedCalls.Count > 0) await _callRepository.UpdateManyAsync(updatedCalls, autoSave: true);
    }

    /// <summary>
    /// Var olan programda yalnız boş alanlar dolar. Sayısal alanlarda "boş" = null (tutar tavanında 0);
    /// bayraklarda yalnız false → true yönü; alt listelerde (etiket türü, harcama kalemi, belge) program o
    /// türden hiç kayıt taşımıyorsa. Değişiklik olduysa true döner.
    /// </summary>
    private static bool EnrichExisting(Grant grant, GrantSeed seed)
    {
        var changed = false;
        if (grant.Objective.IsNullOrWhiteSpace() && !seed.Objective.IsNullOrWhiteSpace()) { grant.Objective = seed.Objective; changed = true; }
        if (grant.Priorities.IsNullOrWhiteSpace() && JoinLines(seed.Priorities) is { } priorities) { grant.Priorities = priorities; changed = true; }
        if (grant.EligibleApplicants.IsNullOrWhiteSpace() && JoinLines(seed.EligibleApplicants) is { } applicants) { grant.EligibleApplicants = applicants; changed = true; }
        if (grant.MinAmount == null && seed.MinAmount != null) { grant.MinAmount = seed.MinAmount; changed = true; }
        if (grant.MaxAmount == 0 && seed.MaxAmount > 0) { grant.MaxAmount = seed.MaxAmount; changed = true; }
        if (grant.SupportRatePercent == null && seed.SupportRatePercent != null) { grant.SupportRatePercent = seed.SupportRatePercent; changed = true; }
        if (grant.ProjectDurationMonths == null && seed.ProjectDurationMonths != null) { grant.ProjectDurationMonths = seed.ProjectDurationMonths; changed = true; }
        if (grant.MaxCompanyAgeYears == null && seed.MaxCompanyAgeYears != null) { grant.MaxCompanyAgeYears = seed.MaxCompanyAgeYears; changed = true; }
        if (grant.MinConsortiumPartners == null && seed.MinConsortiumPartners != null) { grant.MinConsortiumPartners = seed.MinConsortiumPartners; changed = true; }
        if (grant.EligibleCompanySizes == 0 && seed.EligibleCompanySizes != 0) { grant.EligibleCompanySizes = seed.EligibleCompanySizes; changed = true; }
        if (grant.SourceUrl.IsNullOrWhiteSpace() && !seed.SourceUrl.IsNullOrWhiteSpace()) { grant.SourceUrl = seed.SourceUrl; changed = true; }
        if (!grant.HasAdvancePayment && seed.HasAdvancePayment) { grant.HasAdvancePayment = true; changed = true; }
        if (!grant.RequiresGuaranteeLetter && seed.RequiresGuaranteeLetter) { grant.RequiresGuaranteeLetter = true; changed = true; }
        if (!grant.RequiresConsortium && seed.RequiresConsortium) { grant.RequiresConsortium = true; changed = true; }
        if (!grant.PrefersFemaleEntrepreneur && seed.PrefersFemaleEntrepreneur) { grant.PrefersFemaleEntrepreneur = true; changed = true; }
        if (!grant.PrefersYoungEntrepreneur && seed.PrefersYoungEntrepreneur) { grant.PrefersYoungEntrepreneur = true; changed = true; }

        if (changed)
        {
            grant.EnsureRangesValid();
        }

        return changed;
    }

    private void AddTags(List<GrantCriteriaTag> target, Guid grantId, GrantCriteriaKind kind, string[] values)
    {
        foreach (var value in values)
        {
            target.Add(new GrantCriteriaTag(_guidGenerator.Create(), grantId, kind, value));
        }
    }

    private void AddCostItems(List<GrantEligibleCostItem> target, Guid grantId, CostItemSeed[]? items)
    {
        foreach (var item in (items ?? []).DistinctBy(i => i.Kind))
        {
            target.Add(new GrantEligibleCostItem(_guidGenerator.Create(), grantId, Enum.Parse<GrantCostItemKind>(item.Kind), item.LimitPercent));
        }
    }

    private void AddDocuments(List<GrantDocumentRequirement> target, Guid grantId, DocumentSeed[]? documents)
    {
        var order = 0;
        foreach (var doc in documents ?? [])
        {
            target.Add(new GrantDocumentRequirement(_guidGenerator.Create(), grantId, order++, doc.Name)
            {
                Obligation = Enum.Parse<GrantDocumentObligation>(doc.Obligation),
                UploaderParty = Enum.Parse<GrantPartyRole>(doc.Uploader),
                RequiresESignature = doc.ESignature
            });
        }
    }

    /// <summary>Ekrandaki "her satıra bir madde" sözleşmesi: maddeler satır sonuyla birleşir; boş liste null.</summary>
    private static string? JoinLines(string[]? items)
    {
        var lines = (items ?? []).Where(i => !i.IsNullOrWhiteSpace()).Select(i => i.Trim()).ToArray();
        return lines.Length == 0 ? null : string.Join("\n", lines);
    }

    internal static async Task<List<GrantSeed>> ReadSeedsAsync()
    {
        var assembly = typeof(GrantAnnouncementCatalogDataSeedContributor).Assembly;
        var seeds = new List<GrantSeed>();
        foreach (var name in assembly.GetManifestResourceNames()
                     .Where(n => n.StartsWith(ResourcePrefix) && n.EndsWith(".json"))
                     .OrderBy(n => n, StringComparer.Ordinal))
        {
            await using var stream = assembly.GetManifestResourceStream(name)!;
            seeds.AddRange((await JsonSerializer.DeserializeAsync<GrantSeed[]>(
                stream, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }))!);
        }

        return seeds;
    }

    /// <summary>
    /// Postgres kolonu <c>timestamp with time zone</c>; Kind=Utc olmayan DateTime Npgsql'de yazılamaz.
    /// </summary>
    private static DateTime? ParseDate(string? value, bool endOfDay)
    {
        if (value == null)
        {
            return null;
        }

        var date = DateTime.ParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture);
        return new DateTime(date.Year, date.Month, date.Day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, 0, DateTimeKind.Utc);
    }

    internal sealed record GrantSeed(
        Guid Id,
        string Name,
        string Issuer,
        string Period,
        string Status,
        string? OpenDate,
        string? Deadline,
        decimal MaxAmount,
        decimal? MinAmount,
        decimal? Budget,
        int? SupportRatePercent,
        int? ProjectDurationMonths,
        string? Reference,
        bool Repayable,
        int EligibleCompanySizes,
        bool RequiresConsortium,
        int? MinConsortiumPartners,
        int? MaxCompanyAgeYears,
        bool PrefersFemaleEntrepreneur,
        bool PrefersYoungEntrepreneur,
        string SourceUrl,
        string[] Sectors,
        string[] Regions,
        string[] Keywords,
        string Description,
        string? Objective = null,
        string[]? Priorities = null,
        string[]? EligibleApplicants = null,
        bool HasAdvancePayment = false,
        bool RequiresGuaranteeLetter = false,
        CostItemSeed[]? CostItems = null,
        DocumentSeed[]? Documents = null);

    internal sealed record CostItemSeed(string Kind, int? LimitPercent);

    internal sealed record DocumentSeed(string Name, string Obligation = "Zorunlu", string Uploader = "Firma", bool ESignature = false);
}
