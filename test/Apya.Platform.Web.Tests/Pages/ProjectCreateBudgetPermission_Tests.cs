using System;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 🔴 PRJ-06 · Bütçe yetkisi OLMAYAN kullanıcıyla yeni proje.
///
/// <para>Düzenlemede bütçe yetkisi (Projects.ViewBudget) uygulanıyordu, oluşturmada
/// uygulanmıyordu: bütçeyi göremeyen kullanıcı yeni projeye bütçe yazabiliyor, sonra
/// yazdığını ne görebiliyor ne değiştirebiliyordu.</para>
///
/// <para>Test barındırıcısı normalde <c>AddAlwaysAllowAuthorization</c> ile koşar ve izin
/// reddini hiç göremez. Bu sınıf barındırıcıyı TEK izni reddedecek şekilde kurar — hem
/// formun alanı gizlediği hem sunucunun bütçeyi yazmadığı gerçek yoldan ölçülür.</para>
/// </summary>
public class ProjectCreateBudgetPermission_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var denyBudget = new DenyPermissionsAuthorizationService(PlatformPermissions.Projects.ViewBudget);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(denyBudget));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(denyBudget));
    }

    [Fact]
    public async Task Butce_yetkisi_olmayana_butce_alani_gosterilmez()
    {
        var html = await GetResponseAsStringAsync("/Projects/CreateModal");

        html.ShouldContain("ProjectCreateForm", Case.Sensitive, "form açılmalı — reddedilen yalnız bütçe izni");
        // Kimlik betikte de geçiyor ($('#PfBudgetDisplay')); ölçülen şey ALANIN kendisi.
        html.ShouldNotContain("id=\"PfBudgetDisplay\"", Case.Sensitive);
    }

    /// <summary>
    /// Alanı gizlemek yetmez: uç doğrudan da çağrılabilir. Yetkisiz kullanıcının gönderdiği
    /// bütçe ve saatlik ücret YAZILMAZ; proje 0 bütçeyle doğar.
    /// </summary>
    [Fact]
    public async Task Butce_yetkisi_olmayanin_gonderdigi_butce_yazilmaz()
    {
        var code = "PB-" + Guid.NewGuid().ToString("N")[..6];

        var created = await GetRequiredService<IProjectAppService>().CreateAsync(new CreateProjectDto
        {
            Name = "Yetkisiz bütçe " + code,
            Code = code,
            TotalBudget = 500_000m,
            HourlyRate = 120m,
            Currency = "EUR",
            StartDate = DateTime.Today,
            EndDate = DateTime.Today.AddMonths(3),
        });

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var stored = await GetRequiredService<IRepository<Project, Guid>>().GetAsync(created.Id);

        stored.TotalBudget.ShouldBe(0m);
        stored.HourlyRate.ShouldBe(0m);
        stored.Currency.ShouldBe("EUR", "para birimi bir tutar değil, projenin zorunlu alanı — korunur");
        await uow.CompleteAsync();
    }

    /// <summary>
    /// Zaman çizelgesi bütçe ve gider toplamlarını yalnız belge görme izniyle döndürüyordu. Bütçe
    /// görme izni yoksa tutarlar hesaplanmaz ve ekrana "kartları çizme" işareti gider.
    /// </summary>
    [Fact]
    public async Task Butce_yetkisi_olmayan_zaman_cizelgesinde_butceyi_goremez()
    {
        var projectId = Guid.NewGuid();
        var code = "PZ-" + Guid.NewGuid().ToString("N")[..6];
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, null, null, "Çizelge bütçesi " + code, code, "", 640_000m, 0m, "TRY"),
                autoSave: true);
            await uow.CompleteAsync();
        }

        var timeline = await GetRequiredService<Apya.Platform.Documents.IProjectTimelineAppService>()
            .GetAsync(projectId);

        timeline.BudgetVisible.ShouldBeFalse();
        timeline.Budget.TotalBudget.ShouldBe(0m);
        timeline.ProjectName.ShouldStartWith("Çizelge bütçesi", Case.Sensitive, "çizelgenin kendisi açılmalı");
    }

    /// <summary>
    /// Liste bütçeyi maskeliyordu, tekil okuma ve detay maskelemiyordu: bütçeyi göremeyen kullanıcı
    /// aynı rakamları /api/app/project/{id} ve /detail üzerinden okuyabiliyordu (ürün kararı,
    /// 2026-10-12). Ardından proje düzenlenince kayıtlı bütçe korunur — maskelenen sıfır geri yazılmaz.
    /// </summary>
    [Fact]
    public async Task Butce_yetkisi_olmayan_tekil_okumada_ve_detayda_butceyi_goremez()
    {
        var projectId = Guid.NewGuid();
        var code = "PG-" + Guid.NewGuid().ToString("N")[..6];
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, null, null, "Gizli bütçe " + code, code, "", 750_000m, 180m, "EUR"),
                autoSave: true);
            await uow.CompleteAsync();
        }

        var service = GetRequiredService<IProjectAppService>();

        var single = await service.GetAsync(projectId);
        single.TotalBudget.ShouldBe(0m);
        single.HourlyRate.ShouldBe(0m);
        single.Currency.ShouldBe("EUR");

        var detail = await service.GetDetailAsync(projectId);
        detail.TotalBudget.ShouldBe(0m);
        detail.HourlyRate.ShouldBe(0m);
        detail.SpentBudget.ShouldBe(0m);
        detail.BudgetPercent.ShouldBe(0);

        // Düzenleme formu maskelenmiş değerleri geri gönderir; sunucu izinsiz bütçeyi yok sayar.
        await service.UpdateAsync(projectId, new CreateProjectDto
        {
            Name = "Gizli bütçe (düzenlendi)",
            Code = code,
            TotalBudget = single.TotalBudget,
            HourlyRate = single.HourlyRate,
            Currency = single.Currency,
            StartDate = DateTime.Today,
            EndDate = DateTime.Today.AddMonths(3),
        });

        using var check = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var stored = await GetRequiredService<IRepository<Project, Guid>>().GetAsync(projectId);
        stored.TotalBudget.ShouldBe(750_000m);
        stored.HourlyRate.ShouldBe(180m);
        await check.CompleteAsync();
    }
}
