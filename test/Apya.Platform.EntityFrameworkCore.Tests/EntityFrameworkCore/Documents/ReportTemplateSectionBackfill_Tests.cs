using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Documents;

/// <summary>
/// 🔴 RPT-02 · Enum'a yeni bir rapor bölümü eklendiğinde mevcut şablonlara ne olur.
///
/// <para>İki küme var. Sistem şablonları tohumlayıcının tanımlarından tamamlanır — bu
/// zaten yapılıyordu. Kiracıların KENDİ oluşturduğu şablonlar ise hiç ele alınmıyordu:
/// özel şablonun bölüm satırları oluşturulduğu günün enum'undan yazılır, sonradan
/// eklenen bölüm o şablonda görünmez ve AÇILAMAZDI.</para>
///
/// <para>Fikstür "eski" bir özel şablonu taklit eder: yeni iki bölümün satırı olmadan
/// elle kurulur (servis yolu bugün hepsini yazar, ölçülecek şey eski kayıt).</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ReportTemplateSectionBackfill_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly ReportSectionKey[] NewKeys =
    {
        ReportSectionKey.BudgetSummary,
        ReportSectionKey.TaskProgress,
    };

    private readonly ReportTemplateDataSeedContributor _seeder;
    private readonly IReportTemplateAppService _templates;
    private readonly IRepository<ReportTemplate, Guid> _templateRepository;
    private readonly IRepository<ReportSection, Guid> _sectionRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IUnitOfWorkManager _uowManager;

    public ReportTemplateSectionBackfill_Tests()
    {
        _seeder = GetRequiredService<ReportTemplateDataSeedContributor>();
        _templates = GetRequiredService<IReportTemplateAppService>();
        _templateRepository = GetRequiredService<IRepository<ReportTemplate, Guid>>();
        _sectionRepository = GetRequiredService<IRepository<ReportSection, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _uowManager = GetRequiredService<IUnitOfWorkManager>();
    }

    /// <summary>Yeni iki bölümün satırı OLMAYAN, kiracıya ait eski bir özel şablon.</summary>
    private async Task<(Guid TenantId, Guid TemplateId)> CreateLegacyCustomTemplateAsync()
    {
        var tenant = await _tenantManager.CreateAsync("Rapor " + Guid.NewGuid().ToString("N")[..6]);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);

        using (_currentTenant.Change(tenant.Id))
        {
            var template = new ReportTemplate(
                Guid.NewGuid(), tenant.Id, "Eski özel şablon", ReportRecipient.Internal,
                issuer: null, isSystem: false, order: 1);
            await _templateRepository.InsertAsync(template, autoSave: true);

            var order = 0;
            foreach (var key in Enum.GetValues<ReportSectionKey>().Where(k => !NewKeys.Contains(k)))
            {
                await _sectionRepository.InsertAsync(
                    new ReportSection(Guid.NewGuid(), tenant.Id, template.Id, key, ++order, isEnabled: true),
                    autoSave: true);
            }

            return (tenant.Id, template.Id);
        }
    }

    private async Task<ReportSection[]> ReadSectionsAsync(Guid? tenantId, Guid templateId)
    {
        using var uow = _uowManager.Begin(requiresNew: true);
        using (_currentTenant.Change(tenantId))
        {
            var sections = (await _sectionRepository.GetListAsync(s => s.TemplateId == templateId)).ToArray();
            await uow.CompleteAsync();
            return sections;
        }
    }

    /// <summary>
    /// Satır KAPALI ve SONA eklenir: kullanıcının kurduğu rapor kendiliğinden değişmemeli,
    /// yeni bölüm yalnız açılabilir hâle gelmeli.
    /// </summary>
    [Fact]
    public async Task Eski_ozel_sablona_yeni_bolumler_kapali_ve_sona_eklenir()
    {
        var (tenantId, templateId) = await WithUnitOfWorkAsync(CreateLegacyCustomTemplateAsync);

        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

        var sections = await ReadSectionsAsync(tenantId, templateId);

        sections.Length.ShouldBe(Enum.GetValues<ReportSectionKey>().Length, "her bölüm türünün bir satırı olmalı");

        var added = sections.Where(s => NewKeys.Contains(s.SectionKey)).ToArray();
        added.Length.ShouldBe(2);
        added.ShouldAllBe(s => !s.IsEnabled, "eklenen bölüm kullanıcının raporunu değiştirmemeli");
        added.ShouldAllBe(s => s.TenantId == tenantId, "satır şablonun kiracısına yazılmalı");

        var oldMaxOrder = sections.Where(s => !NewKeys.Contains(s.SectionKey)).Max(s => s.Order);
        added.ShouldAllBe(s => s.Order > oldMaxOrder, "var olan satırlarla sıra çakışması olmamalı");
        sections.Select(s => s.Order).Distinct().Count().ShouldBe(sections.Length, "sıra numaraları tekil");

        // Kullanıcının zaten açık tuttuğu bölümler açık kalır.
        sections.Where(s => !NewKeys.Contains(s.SectionKey)).ShouldAllBe(s => s.IsEnabled);
    }

    [Fact]
    public async Task Ikinci_tur_satir_cogaltmaz()
    {
        var (tenantId, templateId) = await WithUnitOfWorkAsync(CreateLegacyCustomTemplateAsync);

        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));
        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

        var sections = await ReadSectionsAsync(tenantId, templateId);
        sections.Length.ShouldBe(Enum.GetValues<ReportSectionKey>().Length);
        sections.GroupBy(s => s.SectionKey).ShouldAllBe(g => g.Count() == 1);
    }

    /// <summary>
    /// Sistem şablonlarına da iner — KAPALI. Hiçbir tanım yeni bölümleri açık getirmez:
    /// mevcut kurulumların rapor çıktısı DbMigrator turunda kendiliğinden değişmemeli.
    /// </summary>
    [Fact]
    public async Task Sistem_sablonlarina_yeni_bolumler_kapali_iner()
    {
        await WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

        var systemTemplates = await WithUnitOfWorkAsync(
            () => _templateRepository.GetListAsync(t => t.IsSystem));
        systemTemplates.Count.ShouldBe(6);

        foreach (var template in systemTemplates)
        {
            var sections = await ReadSectionsAsync(null, template.Id);

            sections.Length.ShouldBe(Enum.GetValues<ReportSectionKey>().Length, template.Name);
            sections.Where(s => NewKeys.Contains(s.SectionKey))
                .ShouldAllBe(s => !s.IsEnabled, $"{template.Name}: yeni bölüm açık gelmemeli");
            sections.Select(s => s.Order).Distinct().Count()
                .ShouldBe(sections.Length, $"{template.Name}: sıra numaraları tekil");
        }
    }

    /// <summary>
    /// Bugün oluşturulan özel şablonda ise yeni bölümler diğer uygun bölümler gibi AÇIK
    /// doğar — geri dolumun "kapalı ekle" kuralı yalnız geçmişe uygulanır.
    /// </summary>
    [Fact]
    public async Task Yeni_olusturulan_ozel_sablonda_bolumler_acik_dogar()
    {
        var created = await _templates.CreateAsync(new CreateUpdateReportTemplateDto
        {
            Name = "Bugünkü şablon " + Guid.NewGuid().ToString("N")[..6],
            Recipient = ReportRecipient.Internal,
            Order = 1,
        });

        created.Sections.Count.ShouldBe(Enum.GetValues<ReportSectionKey>().Length);
        created.Sections.Where(s => NewKeys.Contains(s.SectionKey))
            .ShouldAllBe(s => s.IsEnabled && s.IsAvailable);
    }
}
