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
/// Hibe veren kurumların kapanış raporu sistem şablonları. Ortak sıradaki ilk altı şablondan
/// farkı: açık bölümler kurumun resmi formundaki sırayla BAŞA gelir, kapalılar arkaya dizilir.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ReportTemplateClosingSeed_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const int ClosingTemplateCount = 23;

    private static readonly Guid[] ClosingIds = Enumerable.Range(1, ClosingTemplateCount)
        .Select(i => new Guid($"c1000000-0000-4000-8000-{i + 100:D12}"))
        .ToArray();

    private readonly ReportTemplateDataSeedContributor _seeder;
    private readonly IRepository<ReportTemplate, Guid> _templateRepository;
    private readonly IRepository<ReportSection, Guid> _sectionRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IUnitOfWorkManager _uowManager;

    public ReportTemplateClosingSeed_Tests()
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

    [Fact]
    public async Task Kapanis_sablonlari_host_duzeyinde_kurum_sablonu_olarak_tohumlanir()
    {
        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

        var closing = await WithUnitOfWorkAsync(() => _templateRepository.GetListAsync(t => ClosingIds.Contains(t.Id)));

        closing.Count.ShouldBe(ClosingTemplateCount);
        closing.ShouldAllBe(t => t.IsSystem && t.TenantId == null);
        closing.ShouldAllBe(t => t.Recipient == ReportRecipient.Institution);
        closing.ShouldAllBe(t => !string.IsNullOrWhiteSpace(t.Issuer), "kurum şablonu veren kurumu taşımalı");
        closing.Select(t => t.Order).OrderBy(o => o).ShouldBe(Enumerable.Range(7, ClosingTemplateCount));

        var allSystem = await WithUnitOfWorkAsync(() => _templateRepository.GetListAsync(t => t.IsSystem));
        allSystem.Select(t => t.Name).Distinct().Count().ShouldBe(allSystem.Count, "sistem şablonu adları tekil");
    }

    [Fact]
    public async Task Acik_bolumler_resmi_sirayla_basa_kapalilar_arkaya_dizilir()
    {
        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

        var allKeys = Enum.GetValues<ReportSectionKey>().Length;
        foreach (var id in ClosingIds)
        {
            var sections = await ReadSectionsAsync(id);

            sections.Length.ShouldBe(allKeys, $"{id}: her bölüm türünün bir satırı olmalı");
            sections.Select(s => s.Order).ShouldBe(Enumerable.Range(1, allKeys), $"{id}: sıra 1..n kesintisiz");
            sections.Count(s => s.IsEnabled).ShouldBeGreaterThan(0, $"{id}: en az bir bölüm açık");

            var lastEnabled = sections.Where(s => s.IsEnabled).Max(s => s.Order);
            var firstDisabled = sections.Where(s => !s.IsEnabled).Select(s => s.Order).DefaultIfEmpty(int.MaxValue).Min();
            lastEnabled.ShouldBeLessThan(firstDisabled, $"{id}: açık bölümler kapalılardan önce gelmeli");
        }
    }

    /// <summary>Resmi formun sırası korunuyor mu — iki bilinen form üzerinden tam sıra.</summary>
    [Fact]
    public async Task Bilinen_formlarda_acik_bolum_sirasi_birebir()
    {
        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

        // TÜBİTAK TEYDEB (AGY350/351): bütçe, harcama eşleşmesinden ve göstergelerden önce.
        (await EnabledKeysAsync(ClosingIds[0])).ShouldBe(new[]
        {
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Timeline, ReportSectionKey.Milestones, ReportSectionKey.TeamContribution,
            ReportSectionKey.BudgetSummary, ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.Indicators,
            ReportSectionKey.Risks, ReportSectionKey.AuditTrail, ReportSectionKey.ComplianceStatus,
            ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex,
        });

        // Masraf ve katılım kanıt paketi: anlatı yok, yalnız kanıt.
        (await EnabledKeysAsync(ClosingIds[22])).ShouldBe(new[]
        {
            ReportSectionKey.CoverPage, ReportSectionKey.ExpenseDocumentMatch,
            ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex,
        });
    }

    [Fact]
    public async Task Ikinci_tur_kapanis_sablonlarini_cogaltmaz()
    {
        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));
        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

        var closing = await WithUnitOfWorkAsync(() => _templateRepository.GetListAsync(t => ClosingIds.Contains(t.Id)));
        closing.Count.ShouldBe(ClosingTemplateCount);

        foreach (var id in ClosingIds)
        {
            var sections = await ReadSectionsAsync(id);
            sections.GroupBy(s => s.SectionKey).ShouldAllBe(g => g.Count() == 1, $"{id}: satır çoğalmamalı");
        }
    }

    private async Task<ReportSectionKey[]> EnabledKeysAsync(Guid templateId)
        => (await ReadSectionsAsync(templateId)).Where(s => s.IsEnabled).Select(s => s.SectionKey).ToArray();
}
