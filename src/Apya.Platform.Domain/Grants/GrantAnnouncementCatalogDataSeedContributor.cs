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

        foreach (var seed in await ReadSeedsAsync())
        {
            var grant = await _grantRepository.FindAsync(seed.Id);
            if (grant == null)
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
                await _grantRepository.InsertAsync(grant, autoSave: true);

                await InsertTagsAsync(grant.Id, GrantCriteriaKind.Sektor, seed.Sectors);
                await InsertTagsAsync(grant.Id, GrantCriteriaKind.Bolge, seed.Regions);
                await InsertTagsAsync(grant.Id, GrantCriteriaKind.AnahtarKelime, seed.Keywords);
                await InsertCostItemsAsync(grant.Id, seed.CostItems);
                await InsertDocumentsAsync(grant.Id, seed.Documents);
            }
            else
            {
                await EnrichExistingAsync(grant, seed);
            }

            var deadline = ParseDate(seed.Deadline, endOfDay: true);
            var existing = await _callRepository.FindAsync(c => c.GrantId == seed.Id && c.Period == seed.Period);
            if (existing != null)
            {
                // Var olan çağrıda yalnız boş tarihler dolar; durum ve dolu tarihler host'undur.
                if (existing.OpenDate == null && existing.Deadline == null && (seed.OpenDate != null || seed.Deadline != null))
                {
                    existing.SetSchedule(ParseDate(seed.OpenDate, endOfDay: false), deadline);
                    await _callRepository.UpdateAsync(existing, autoSave: true);
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
            await _callRepository.InsertAsync(call, autoSave: true);
        }
    }

    /// <summary>
    /// Var olan programda yalnız boş alanlar dolar. Sayısal alanlarda "boş" = null (tutar tavanında 0);
    /// bayraklarda yalnız false → true yönü; alt listelerde (etiket türü, harcama kalemi, belge) program o
    /// türden hiç kayıt taşımıyorsa.
    /// </summary>
    private async Task EnrichExistingAsync(Grant grant, GrantSeed seed)
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
            await _grantRepository.UpdateAsync(grant, autoSave: true);
        }

        foreach (var (kind, values) in new[]
                 {
                     (GrantCriteriaKind.Sektor, seed.Sectors),
                     (GrantCriteriaKind.Bolge, seed.Regions),
                     (GrantCriteriaKind.AnahtarKelime, seed.Keywords)
                 })
        {
            if (values.Length > 0 && !await _criteriaRepository.AnyAsync(t => t.GrantId == grant.Id && t.Kind == kind))
            {
                await InsertTagsAsync(grant.Id, kind, values);
            }
        }

        if (seed.CostItems is { Length: > 0 } && !await _costItemRepository.AnyAsync(c => c.GrantId == grant.Id))
        {
            await InsertCostItemsAsync(grant.Id, seed.CostItems);
        }

        if (seed.Documents is { Length: > 0 } && !await _documentRepository.AnyAsync(d => d.GrantId == grant.Id))
        {
            await InsertDocumentsAsync(grant.Id, seed.Documents);
        }
    }

    private async Task InsertCostItemsAsync(Guid grantId, CostItemSeed[]? items)
    {
        foreach (var item in (items ?? []).DistinctBy(i => i.Kind))
        {
            await _costItemRepository.InsertAsync(
                new GrantEligibleCostItem(_guidGenerator.Create(), grantId, Enum.Parse<GrantCostItemKind>(item.Kind), item.LimitPercent),
                autoSave: true);
        }
    }

    private async Task InsertDocumentsAsync(Guid grantId, DocumentSeed[]? documents)
    {
        var order = 0;
        foreach (var doc in documents ?? [])
        {
            await _documentRepository.InsertAsync(
                new GrantDocumentRequirement(_guidGenerator.Create(), grantId, order++, doc.Name)
                {
                    Obligation = Enum.Parse<GrantDocumentObligation>(doc.Obligation),
                    UploaderParty = Enum.Parse<GrantPartyRole>(doc.Uploader),
                    RequiresESignature = doc.ESignature
                },
                autoSave: true);
        }
    }

    /// <summary>Ekrandaki "her satıra bir madde" sözleşmesi: maddeler satır sonuyla birleşir; boş liste null.</summary>
    private static string? JoinLines(string[]? items)
    {
        var lines = (items ?? []).Where(i => !i.IsNullOrWhiteSpace()).Select(i => i.Trim()).ToArray();
        return lines.Length == 0 ? null : string.Join("\n", lines);
    }

    private async Task InsertTagsAsync(Guid grantId, GrantCriteriaKind kind, string[] values)
    {
        foreach (var value in values)
        {
            await _criteriaRepository.InsertAsync(
                new GrantCriteriaTag(_guidGenerator.Create(), grantId, kind, value),
                autoSave: true);
        }
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
