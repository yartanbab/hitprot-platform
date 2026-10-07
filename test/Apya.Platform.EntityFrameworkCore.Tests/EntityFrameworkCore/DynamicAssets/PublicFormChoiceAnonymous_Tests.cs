using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.DynamicAssets;

/// <summary>
/// Herkese açık formda canlı seçenek listeleri OTURUMSUZ ziyaretçiye host verisi vermez.
///
/// <para>Canlı kaynaklar formu DOLDURANIN bağlamında çözülür: "firmalar" yalnız host'ta, "projeler"
/// dolduranın firmasında. Oturumsuz ve kiracısız bir istek ise host bağlamı GİBİ görünür
/// (<c>CurrentTenant.Id == null</c>). Herkese açık form uçları oturum istemediği için, formuna
/// "firmalar" kaynağını yazan bir kiracı (katalog bu kaynağı kiracıya göstermez ama kayıtta
/// denetlenmiyordu) bütün müşteri listesini, "projeler" / "görevler" kaynağıyla da host'un proje ve
/// görev adlarını oturumsuz bir istekle alabiliyordu.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class PublicFormChoiceAnonymous_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IFormAppService _formAppService;
    private readonly IPublicDocumentAppService _publicDocumentAppService;
    private readonly ICurrentTenant _currentTenant;
    private readonly ICurrentPrincipalAccessor _principalAccessor;

    public PublicFormChoiceAnonymous_Tests()
    {
        _formAppService = GetRequiredService<IFormAppService>();
        _publicDocumentAppService = GetRequiredService<IPublicDocumentAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _principalAccessor = GetRequiredService<ICurrentPrincipalAccessor>();
    }

    private static string Settings(string source, Guid? dependsOn = null)
        => dependsOn == null
            ? $"{{\"required\":true,\"source\":\"{source}\"}}"
            : $"{{\"required\":true,\"source\":\"{source}\",\"dependsOn\":\"{dependsOn}\"}}";

    private async Task<Guid> CreateTenantAsync(string name)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync(name + " " + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    /// <summary>Verilen bağlamda, tek açılır listeli yayında bir form; listenin kaynağı <paramref name="source"/>.</summary>
    private async Task<(string Slug, Guid FormId, Guid BlockId)> PublishFormAsync(Guid? tenantId, string source)
    {
        using (_currentTenant.Change(tenantId))
        {
            var form = await _formAppService.CreateAsync(new CreateUpdateFormDto
            {
                Title = "Canlı liste sınaması",
                Blocks = new List<CreateBlockDto>
                {
                    new() { Type = BlockType.Dropdown, Order = 1, Content = "Seçiniz", Settings = Settings(source) }
                }
            });

            var slug = "canli-" + Guid.NewGuid().ToString("N")[..8];
            await _formAppService.PublishAsync(form.Id, new PublishFormDto { Slug = slug });
            return (slug, form.Id, form.Blocks.Single().Id);
        }
    }

    /// <summary>Oturumsuz, kiracısız ziyaretçi — herkese açık form ucuna gelen sıradan istek.</summary>
    private IDisposable Anonymous() => _principalAccessor.Change(new ClaimsPrincipal(new ClaimsIdentity()));

    [Fact]
    public async Task Oturumsuz_ziyaretci_kiraci_formundan_firma_listesini_alamaz()
    {
        var attacker = await CreateTenantAsync("Formu Yazan Firma");
        await CreateTenantAsync("Listede Görünmemesi Gereken Müşteri");
        var (slug, _, _) = await PublishFormAsync(attacker, FormChoiceSources.Firms);

        using (Anonymous())
        {
            var form = await _publicDocumentAppService.GetBySlugAsync(slug, attacker);

            form.Blocks.Single().Choices.ShouldBeEmpty("oturumsuz ziyaretçi müşteri listesini aldı");
        }
    }

    [Fact]
    public async Task Oturumsuz_ziyaretci_host_formundan_da_firma_listesini_alamaz()
    {
        await CreateTenantAsync("Listede Görünmemesi Gereken Müşteri");
        var (slug, _, _) = await PublishFormAsync(tenantId: null, FormChoiceSources.Firms);

        using (Anonymous())
        {
            (await _publicDocumentAppService.GetBySlugAsync(slug)).Blocks.Single().Choices.ShouldBeEmpty();
        }
    }

    [Fact]
    public async Task Oturumlu_host_kullanicisi_firma_listesini_gorur()
    {
        var customer = await CreateTenantAsync("Listelenen Müşteri");
        var (slug, _, _) = await PublishFormAsync(tenantId: null, FormChoiceSources.Firms);

        // Varsayılan test kimliği oturumlu bir kullanıcıdır; bağlam host.
        var form = await _publicDocumentAppService.GetBySlugAsync(slug);

        form.Blocks.Single().Choices.ShouldContain(c => c.Value == customer.ToString());
    }

    [Fact]
    public async Task Oturumsuz_ziyaretci_host_projelerini_ve_gorevlerini_alamaz()
    {
        var attacker = await CreateTenantAsync("Formu Yazan Firma");

        // Host'un kendi projesi ve görevi (kiracısız kayıt).
        var hostProject = await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
            new Project(Guid.NewGuid(), null, null, "Host iç projesi", "H" + Guid.NewGuid().ToString("N")[..6], ""),
            autoSave: true);
        await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(
            new TaskItem(Guid.NewGuid(), "Host iç görevi", hostProject.Id, tenantId: null, now: DateTime.Now),
            autoSave: true);

        var (projectsSlug, _, _) = await PublishFormAsync(attacker, FormChoiceSources.TenantProjects);
        var (tasksSlug, _, tasksBlockId) = await PublishFormAsync(attacker, FormChoiceSources.TenantProjectTasks);

        using (Anonymous())
        {
            var form = await _publicDocumentAppService.GetBySlugAsync(projectsSlug, attacker);
            form.Blocks.Single().Choices.ShouldNotContain(c => c.Value == hostProject.Id.ToString(),
                "oturumsuz ziyaretçi host'un proje adını aldı");

            var tasks = await _publicDocumentAppService.GetBlockChoicesAsync(
                tasksSlug, tasksBlockId, hostProject.Id.ToString(), attacker);
            tasks.ShouldBeEmpty("oturumsuz ziyaretçi host'un görev adını aldı");
        }
    }

    [Fact]
    public async Task Oturumlu_kiraci_kullanicisi_kendi_projelerini_gormeye_devam_eder()
    {
        var mine = await CreateTenantAsync("Dolduran Firma");
        var project = await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
            new Project(Guid.NewGuid(), mine, null, "Kendi projem", "K" + Guid.NewGuid().ToString("N")[..6], ""),
            autoSave: true);
        var (slug, _, _) = await PublishFormAsync(mine, FormChoiceSources.TenantProjects);

        using (_currentTenant.Change(mine))
        {
            var form = await _publicDocumentAppService.GetBySlugAsync(slug);

            form.Blocks.Single().Choices.ShouldContain(c => c.Value == project.Id.ToString());
        }
    }
}
