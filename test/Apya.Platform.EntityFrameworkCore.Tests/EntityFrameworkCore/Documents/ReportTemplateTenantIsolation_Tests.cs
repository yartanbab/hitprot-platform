using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Documents;

/// <summary>
/// Rapor şablonunda kiracı yalıtımı.
///
/// <para>Sistem şablonları host'ta durur ve BÜTÜN kiracılarca paylaşılır; künyeleri bu yüzden
/// değiştirilemez (<see cref="ReportTemplate.GuardNotSystem"/>). Bölümleri ise korunmuyordu: bölüm
/// güncelleme ucu kiracı süzgecini kapatıp yalnız şablon kimliğine bakıyordu ve Rapor Derleyici
/// sistem şablonunda da aç/kapa ve sırala düğmelerini basıyordu. Bir kiracının "KOSGEB" şablonunda
/// kapattığı bölüm, öbür bütün kiracıların raporundan da düşüyordu. Kopyalama ucu da kaynağın kime
/// ait olduğunu sormuyordu.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ReportTemplateTenantIsolation_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid TenantA = Guid.Parse("55550000-cccc-4000-8000-0000000000a1");
    private static readonly Guid TenantB = Guid.Parse("55550000-cccc-4000-8000-0000000000b1");

    private readonly IReportTemplateAppService _templates;
    private readonly IRepository<ReportTemplate, Guid> _templateRepository;
    private readonly IRepository<ReportSection, Guid> _sectionRepository;
    private readonly ICurrentTenant _currentTenant;

    public ReportTemplateTenantIsolation_Tests()
    {
        _templates = GetRequiredService<IReportTemplateAppService>();
        _templateRepository = GetRequiredService<IRepository<ReportTemplate, Guid>>();
        _sectionRepository = GetRequiredService<IRepository<ReportSection, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private Task AsAsync(Guid? tenantId, Func<Task> action) => WithUnitOfWorkAsync(async () =>
    {
        using (_currentTenant.Change(tenantId))
        {
            await action();
        }
    });

    /// <summary>İki bölümlü şablon: Proje özeti (1., açık) ve Zaman çizelgesi (2., açık).</summary>
    private async Task<(Guid TemplateId, Guid FirstSectionId, Guid SecondSectionId)> InsertTemplateAsync(
        Guid? tenantId, bool isSystem)
    {
        var templateId = Guid.NewGuid();
        var first = Guid.NewGuid();
        var second = Guid.NewGuid();
        await AsAsync(tenantId, async () =>
        {
            // TenantId kurucuda ATANIR; CurrentTenant.Change kapsamı tek başına yetmez.
            await _templateRepository.InsertAsync(
                new ReportTemplate(templateId, tenantId, "Yalıtım sınaması", ReportRecipient.Institution, "KOSGEB", isSystem),
                autoSave: true);
            await _sectionRepository.InsertManyAsync(new[]
            {
                new ReportSection(first, tenantId, templateId, ReportSectionKey.ProjectSummary, order: 1, isEnabled: true),
                new ReportSection(second, tenantId, templateId, ReportSectionKey.Timeline, order: 2, isEnabled: true),
            }, autoSave: true);
        });
        return (templateId, first, second);
    }

    /// <summary>İkinci bölümü başa alıp birinciyi kapatan istek.</summary>
    private static UpdateReportSectionsDto Reorder(Guid templateId, Guid first, Guid second) => new()
    {
        TemplateId = templateId,
        Sections = new List<ReportSectionOrderDto>
        {
            new() { SectionId = second, Order = 1, IsEnabled = true },
            new() { SectionId = first, Order = 2, IsEnabled = false },
        },
    };

    private async Task<(int Order, bool IsEnabled)> ReadSectionAsync(Guid? ownerTenantId, Guid sectionId)
    {
        (int, bool) state = default;
        await AsAsync(ownerTenantId, async () =>
        {
            var section = await _sectionRepository.GetAsync(sectionId);
            state = (section.Order, section.IsEnabled);
        });
        return state;
    }

    [Fact]
    public async Task Kiraci_Sistem_Sablonunun_Bolumlerini_Degistiremez()
    {
        var (templateId, first, second) = await InsertTemplateAsync(tenantId: null, isSystem: true);

        await AsAsync(TenantB, async () =>
        {
            var ex = await Should.ThrowAsync<BusinessException>(
                async () => await _templates.UpdateSectionsAsync(Reorder(templateId, first, second)));
            ex.Code.ShouldBe(PlatformDomainErrorCodes.ReportTemplateIsSystem);
        });

        // Öbür kiracıların (ve host'un) gördüğü ortak şablon olduğu gibi duruyor.
        (await ReadSectionAsync(null, first)).ShouldBe((1, true));
        (await ReadSectionAsync(null, second)).ShouldBe((2, true));
    }

    [Fact]
    public async Task Host_Sistem_Sablonunun_Bolumlerini_Degistirmeye_Devam_Eder()
    {
        // Ortak şablonu yöneten host'tur; kısıt kiracılar içindir.
        var (templateId, first, second) = await InsertTemplateAsync(tenantId: null, isSystem: true);

        await AsAsync(null, async () => await _templates.UpdateSectionsAsync(Reorder(templateId, first, second)));

        (await ReadSectionAsync(null, first)).ShouldBe((2, false));
        (await ReadSectionAsync(null, second)).ShouldBe((1, true));
    }

    [Fact]
    public async Task Kiraci_Baska_Kiracinin_Sablonunun_Bolumlerini_Degistiremez()
    {
        var (templateId, first, second) = await InsertTemplateAsync(TenantA, isSystem: false);

        await AsAsync(TenantB, async () =>
            await Should.ThrowAsync<EntityNotFoundException>(
                async () => await _templates.UpdateSectionsAsync(Reorder(templateId, first, second))));

        (await ReadSectionAsync(TenantA, first)).ShouldBe((1, true));
        (await ReadSectionAsync(TenantA, second)).ShouldBe((2, true));
    }

    [Fact]
    public async Task Kiraci_Kendi_Sablonunun_Bolumlerini_Degistirir()
    {
        var (templateId, first, second) = await InsertTemplateAsync(TenantA, isSystem: false);

        await AsAsync(TenantA, async () =>
        {
            var updated = await _templates.UpdateSectionsAsync(Reorder(templateId, first, second));
            updated.Sections.Single(s => s.Id == second).Order.ShouldBe(1);
        });

        (await ReadSectionAsync(TenantA, first)).ShouldBe((2, false));
        (await ReadSectionAsync(TenantA, second)).ShouldBe((1, true));
    }

    [Fact]
    public async Task Baska_Sablonun_Bolumu_Istege_Katilsa_Da_Degismez()
    {
        // İstek kendi şablonunu gösterir ama bölüm listesine başka kiracının bölümünü de koyar.
        var (ownTemplateId, ownFirst, ownSecond) = await InsertTemplateAsync(TenantB, isSystem: false);
        var (_, foreignFirst, _) = await InsertTemplateAsync(TenantA, isSystem: false);

        var input = Reorder(ownTemplateId, ownFirst, ownSecond);
        input.Sections.Add(new ReportSectionOrderDto { SectionId = foreignFirst, Order = 9, IsEnabled = false });

        await AsAsync(TenantB, async () => await _templates.UpdateSectionsAsync(input));

        (await ReadSectionAsync(TenantA, foreignFirst)).ShouldBe((1, true));
    }

    [Fact]
    public async Task Kiraci_Baska_Kiracinin_Sablonunu_Kopyalayamaz()
    {
        var (templateId, _, _) = await InsertTemplateAsync(TenantA, isSystem: false);

        await AsAsync(TenantB, async () =>
            await Should.ThrowAsync<EntityNotFoundException>(async () => await _templates.DuplicateAsync(templateId)));

        await AsAsync(TenantB, async () =>
            (await _templateRepository.GetListAsync()).ShouldNotContain(t => t.Name.StartsWith("Yalıtım sınaması")));
    }

    [Fact]
    public async Task Kiraci_Sistem_Sablonunu_Kopyalar_Ve_Kopyasini_Duzenler()
    {
        var (templateId, _, _) = await InsertTemplateAsync(tenantId: null, isSystem: true);

        ReportTemplateDto copy = null!;
        await AsAsync(TenantB, async () => copy = await _templates.DuplicateAsync(templateId));

        copy.IsSystem.ShouldBeFalse();
        copy.TenantId.ShouldBe(TenantB);
        copy.Sections.Count.ShouldBe(2);

        // "Kendinize uyarlamak için kopyalayın" yolu uçtan uca çalışır.
        var ordered = copy.Sections.OrderBy(s => s.Order).ToList();
        await AsAsync(TenantB, async () =>
            await _templates.UpdateSectionsAsync(Reorder(copy.Id, ordered[0].Id, ordered[1].Id)));

        (await ReadSectionAsync(TenantB, ordered[0].Id)).ShouldBe((2, false));
    }
}
