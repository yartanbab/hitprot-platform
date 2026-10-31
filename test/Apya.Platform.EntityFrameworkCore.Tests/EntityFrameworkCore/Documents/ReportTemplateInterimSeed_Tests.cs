using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Documents;

/// <summary>
/// Ara rapor (dönem / gelişme / periyodik / ilerleme) sistem şablonları ve ilk iki kurum
/// şablonunun (KOSGEB ara rapor, TÜBİTAK dönem raporu) resmi forma bir kez düzeltilmesi.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ReportTemplateInterimSeed_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const int InterimTemplateCount = 14;

    private static readonly Guid KosgebId = new("c1000000-0000-4000-8000-000000000001");
    private static readonly Guid TeydebId = new("c1000000-0000-4000-8000-000000000002");

    private static readonly Guid[] InterimIds = Enumerable.Range(1, InterimTemplateCount)
        .Select(i => new Guid($"c1000000-0000-4000-8000-{i + 200:D12}"))
        .ToArray();

    /// <summary>Tohumlayıcının ortak okuma sırası — eski kurulumdaki satırların sırası budur.</summary>
    private static readonly ReportSectionKey[] CommonOrder =
    {
        ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
        ReportSectionKey.Timeline, ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.TeamContribution,
        ReportSectionKey.ComplianceStatus, ReportSectionKey.MissingDocuments, ReportSectionKey.Milestones,
        ReportSectionKey.Risks, ReportSectionKey.AnnexIndex, ReportSectionKey.AuditTrail,
        ReportSectionKey.BudgetSummary, ReportSectionKey.TaskProgress, ReportSectionKey.Indicators,
    };

    /// <summary>İlk iki şablonun ESKİ tanımındaki açık bölümler.</summary>
    private static readonly ReportSectionKey[] LegacyEnabled =
    {
        ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
        ReportSectionKey.Timeline, ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.ComplianceStatus,
        ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex,
    };

    /// <summary>AGY320 sırası (Proje özeti ve iç kontrol bölümleri dahil).</summary>
    private static readonly ReportSectionKey[] TeydebEnabled =
    {
        ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
        ReportSectionKey.TeamContribution, ReportSectionKey.BudgetSummary, ReportSectionKey.Timeline,
        ReportSectionKey.Milestones, ReportSectionKey.AuditTrail, ReportSectionKey.Risks,
        ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.ComplianceStatus,
        ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex,
    };

    private readonly ReportTemplateDataSeedContributor _seeder;
    private readonly IRepository<ReportTemplate, Guid> _templateRepository;
    private readonly IRepository<ReportSection, Guid> _sectionRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IUnitOfWorkManager _uowManager;

    public ReportTemplateInterimSeed_Tests()
    {
        _seeder = GetRequiredService<ReportTemplateDataSeedContributor>();
        _templateRepository = GetRequiredService<IRepository<ReportTemplate, Guid>>();
        _sectionRepository = GetRequiredService<IRepository<ReportSection, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _uowManager = GetRequiredService<IUnitOfWorkManager>();
    }

    private async Task<ReportSection[]> ReadSectionsAsync(Guid templateId)
    {
        using var uow = _uowManager.Begin(requiresNew: true);
        using (_currentTenant.Change(null))
        {
            var sections = (await _sectionRepository.GetListAsync(s => s.TemplateId == templateId))
                .OrderBy(s => s.Order)
                .ToArray();
            await uow.CompleteAsync();
            return sections;
        }
    }

    private async Task<ReportSectionKey[]> EnabledKeysAsync(Guid templateId)
        => (await ReadSectionsAsync(templateId)).Where(s => s.IsEnabled).Select(s => s.SectionKey).ToArray();

    private Task<ReportTemplate> GetTemplateAsync(Guid id)
        => WithUnitOfWorkAsync(() => _templateRepository.GetAsync(id));

    /// <summary>Şablonu düzeltmeden önceki kurulumun hâline geri koyar: eski ad, ortak sıra, eski açık bölümler.</summary>
    private Task RestoreLegacyStateAsync(Guid templateId, string legacyName) => WithUnitOfWorkAsync(async () =>
    {
        var template = await _templateRepository.GetAsync(templateId);
        template.SetName(legacyName);
        await _templateRepository.UpdateAsync(template, autoSave: true);

        var sections = await _sectionRepository.GetListAsync(s => s.TemplateId == templateId);
        foreach (var section in sections)
        {
            section.SetOrder(Array.IndexOf(CommonOrder, section.SectionKey) + 1);
            section.SetEnabled(LegacyEnabled.Contains(section.SectionKey));
        }

        await _sectionRepository.UpdateManyAsync(sections, autoSave: true);
    });

    [Fact]
    public async Task Ara_rapor_sablonlari_resmi_sirayla_kurum_sablonu_olarak_tohumlanir()
    {
        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

        var interim = await WithUnitOfWorkAsync(() => _templateRepository.GetListAsync(t => InterimIds.Contains(t.Id)));
        interim.Count.ShouldBe(InterimTemplateCount);
        interim.ShouldAllBe(t => t.IsSystem && t.TenantId == null && t.Recipient == ReportRecipient.Institution);
        interim.ShouldAllBe(t => !string.IsNullOrWhiteSpace(t.Issuer));
        interim.Select(t => t.Order).OrderBy(o => o).ShouldBe(Enumerable.Range(30, InterimTemplateCount));

        var allKeys = Enum.GetValues<ReportSectionKey>().Length;
        foreach (var id in InterimIds)
        {
            var sections = await ReadSectionsAsync(id);
            sections.Select(s => s.Order).ShouldBe(Enumerable.Range(1, allKeys), $"{id}: sıra 1..n kesintisiz");

            var lastEnabled = sections.Where(s => s.IsEnabled).Max(s => s.Order);
            var firstDisabled = sections.Where(s => !s.IsEnabled).Select(s => s.Order).DefaultIfEmpty(int.MaxValue).Min();
            lastEnabled.ShouldBeLessThan(firstDisabled, $"{id}: açık bölümler kapalılardan önce gelmeli");
        }

        var allSystem = await WithUnitOfWorkAsync(() => _templateRepository.GetListAsync(t => t.IsSystem));
        allSystem.Select(t => t.Name).Distinct().Count().ShouldBe(allSystem.Count, "sistem şablonu adları tekil");
    }

    [Fact]
    public async Task Yeni_kurulumda_ilk_iki_sablon_resmi_formla_dogar()
    {
        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

        (await GetTemplateAsync(TeydebId)).Name.ShouldBe("TÜBİTAK TEYDEB dönem raporu (6 ayda bir)");
        (await EnabledKeysAsync(TeydebId)).ShouldBe(TeydebEnabled);

        (await GetTemplateAsync(KosgebId)).Name.ShouldBe("KOSGEB ara rapor (3 ayda bir)");
        var kosgeb = await EnabledKeysAsync(KosgebId);
        kosgeb.ShouldContain(ReportSectionKey.Risks, "Dönemsel İzleme Formu D-Sonuç");
        kosgeb.ShouldContain(ReportSectionKey.TeamContribution, "Stratejik Ürün'ün destek kalemi personel");
    }

    [Fact]
    public async Task Eski_adli_sablon_bir_kez_resmi_forma_duzeltilir()
    {
        await RestoreLegacyStateAsync(TeydebId, "TÜBİTAK 1501 dönem raporu");
        (await EnabledKeysAsync(TeydebId)).ShouldBe(CommonOrder.Where(LegacyEnabled.Contains), "ön koşul: eski hâl");

        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

        (await GetTemplateAsync(TeydebId)).Name.ShouldBe("TÜBİTAK TEYDEB dönem raporu (6 ayda bir)");
        (await EnabledKeysAsync(TeydebId)).ShouldBe(TeydebEnabled);

        var sections = await ReadSectionsAsync(TeydebId);
        sections.Select(s => s.Order).ShouldBe(Enumerable.Range(1, Enum.GetValues<ReportSectionKey>().Length), "sıra tekil ve kesintisiz");
    }

    /// <summary>Düzeltme yapıldıktan sonra host'un bölüm değişikliği bir sonraki DbMigrator turunda ezilmez.</summary>
    [Fact]
    public async Task Duzeltilmis_sablonda_host_degisikligi_korunur()
    {
        await RestoreLegacyStateAsync(TeydebId, "TÜBİTAK 1501 dönem raporu");
        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

        // Host riskleri kapatır.
        await WithUnitOfWorkAsync(async () =>
        {
            var risks = await _sectionRepository.GetAsync(s => s.TemplateId == TeydebId && s.SectionKey == ReportSectionKey.Risks);
            risks.SetEnabled(false);
            await _sectionRepository.UpdateAsync(risks, autoSave: true);
        });

        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

        (await EnabledKeysAsync(TeydebId)).ShouldNotContain(ReportSectionKey.Risks, "düzeltme ikinci kez uygulanmamalı");
    }
}
