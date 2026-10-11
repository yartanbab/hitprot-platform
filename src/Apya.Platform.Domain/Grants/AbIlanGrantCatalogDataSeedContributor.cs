using System;
using System.Globalization;
using System.Text.Json;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;

namespace Apya.Platform.Grants;

/// <summary>
/// ab-ilan.com "Proje, Hibe ve Fonlar" kategorisindeki duyuruları (kalkınma ajansı, KOSGEB,
/// TÜBİTAK/Eureka, AB ve büyükelçilik çağrıları) HOST kataloğuna kurar. Veri gömülü
/// <c>Grants/SeedData/ab-ilan-hibe-duyurulari.json</c> dosyasındadır; duyuru metninin tamamı
/// programın açıklamasına yazılır.
///
/// <para>🔴 HOST-ONLY ve yeniden çalıştırılabilir — <see cref="ErasmusYouthCatalogDataSeedContributor"/>
/// ile aynı sözleşme: program sabit Id'siyle, çağrı (program, dönem) çiftiyle aranır; var olan
/// kayda DOKUNULMAZ.</para>
///
/// <para>Çağrılar <see cref="GrantCallStatus.Acik"/> doğar; son başvurusu tohumlama anında geçmiş
/// olanlar arşiv olarak <see cref="GrantCallStatus.Kapandi"/> yazılır. Tutarlar yalnız TL ise
/// yazılır; döviz cinsinden tavanlar açıklamada kalır ve <c>MaxAmount</c> 0 ("tavan belirtilmemiş").</para>
/// </summary>
public class AbIlanGrantCatalogDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private const string ResourceName = "Apya.Platform.Grants.SeedData.ab-ilan-hibe-duyurulari.json";
    private const double DefaultMinMatchScore = 40.0;

    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepository;
    private readonly IGuidGenerator _guidGenerator;

    public AbIlanGrantCatalogDataSeedContributor(
        IRepository<Grant, Guid> grantRepository,
        IRepository<GrantCall, Guid> callRepository,
        IRepository<GrantCriteriaTag, Guid> criteriaRepository,
        IGuidGenerator guidGenerator)
    {
        _grantRepository = grantRepository;
        _callRepository = callRepository;
        _criteriaRepository = criteriaRepository;
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
                    RepaymentType = seed.Repayable ? GrantRepaymentType.GeriOdemeli : GrantRepaymentType.GeriOdemesiz
                };
                await _grantRepository.InsertAsync(grant, autoSave: true);

                await InsertTagsAsync(grant.Id, GrantCriteriaKind.Sektor, seed.Sectors);
                await InsertTagsAsync(grant.Id, GrantCriteriaKind.Bolge, seed.Regions);
                await InsertTagsAsync(grant.Id, GrantCriteriaKind.AnahtarKelime, seed.Keywords);
            }

            var existing = await _callRepository.FindAsync(c => c.GrantId == seed.Id && c.Period == seed.Period);
            if (existing != null)
            {
                continue;
            }

            var deadline = ParseDate(seed.Deadline, endOfDay: true);
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

    private async Task InsertTagsAsync(Guid grantId, GrantCriteriaKind kind, string[] values)
    {
        foreach (var value in values)
        {
            await _criteriaRepository.InsertAsync(
                new GrantCriteriaTag(_guidGenerator.Create(), grantId, kind, value),
                autoSave: true);
        }
    }

    private static async Task<GrantSeed[]> ReadSeedsAsync()
    {
        await using var stream = typeof(AbIlanGrantCatalogDataSeedContributor).Assembly
            .GetManifestResourceStream(ResourceName)!;
        var seeds = await JsonSerializer.DeserializeAsync<GrantSeed[]>(
            stream, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        return seeds!;
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

    private sealed record GrantSeed(
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
        string Description);
}
