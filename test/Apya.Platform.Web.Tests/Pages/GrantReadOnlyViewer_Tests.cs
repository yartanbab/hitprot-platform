using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Salt-okur kullanıcı (yalnız hibeleri GÖRME izni, ör. Gözlemci rolü) hibe ekranlarında yazma
/// denetimlerini görmemeli. Sunucu yazma uçlarını zaten reddediyordu (GrantWritePermission); ekran
/// ise düğmeleri gösteriyor, kullanıcı hatayı tıkladıktan sonra alıyordu.
///
/// <para>Barındırıcı iki yazma iznini de reddeder; görüntüleme izni açık kalır.</para>
/// </summary>
public class GrantReadOnlyViewer_Tests : PlatformWebTestBase
{
    private static readonly Guid FirmTenant = Guid.Parse("99990000-aaaa-4000-8000-000000000031");

    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var deny = new DenyPermissionsAuthorizationService(
            PlatformPermissions.Grants.Edit, PlatformPermissions.Grants.ManageApplications);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    /// <summary>Açık çağrıya, verilen kiracıda bir başvuru.</summary>
    private async Task<Guid> ApplicationAsync(Guid? tenantId)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);

        var call = (await GetRequiredService<IRepository<GrantCall, Guid>>()
            .GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();

        var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
        using (GetRequiredService<ICurrentTenant>().Change(tenantId))
        {
            await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(application, autoSave: true);
        }

        await uow.CompleteAsync();
        return application.Id;
    }

    [Fact]
    public async Task Yazma_izni_olmayan_danisman_sihirbazi_ve_belgeleri_okur_yazma_bayragi_kapali_gelir()
    {
        var id = await ApplicationAsync(null);

        var wizard = await GetRequiredService<IGrantApplicationWizardAppService>().GetAsync(id);
        wizard.CanWrite.ShouldBeFalse();
        wizard.IsReadOnly.ShouldBeFalse("başvuru gönderilmedi: 'gönderildi' rozeti çıkmamalı");

        var documents = await GetRequiredService<IGrantApplicationDocumentAppService>().GetAsync(id);
        documents.CanWrite.ShouldBeFalse();
        documents.IsReadOnly.ShouldBeFalse();
    }

    [Fact]
    public async Task Yazma_izni_olmayan_firma_kullanicisi_icin_de_bayrak_kapali_gelir()
    {
        var id = await ApplicationAsync(FirmTenant);

        using (GetRequiredService<ICurrentTenant>().Change(FirmTenant))
        {
            (await GetRequiredService<IGrantApplicationWizardAppService>().GetAsync(id)).CanWrite.ShouldBeFalse();
            (await GetRequiredService<IGrantApplicationDocumentAppService>().GetAsync(id)).CanWrite.ShouldBeFalse();
        }
    }

    /// <summary>
    /// Ürün kararı (2026-10-14): izinsiz kullanıcı adımlar arasında gezer ama başvurunun ORTAK
    /// adımı değişmez — uç reddeder, betik de uca gitmeden yalnız ekrandaki adımı değiştirir.
    /// </summary>
    [Fact]
    public async Task Izinsiz_kullanici_adimi_degistiremez_basvurunun_adimi_ayni_kalir()
    {
        var id = await ApplicationAsync(null);
        var wizard = GetRequiredService<IGrantApplicationWizardAppService>();
        var before = (await wizard.GetAsync(id)).CurrentStep;

        await Should.ThrowAsync<AbpAuthorizationException>(() => wizard.SetStepAsync(id, before + 1));

        (await wizard.GetAsync(id)).CurrentStep.ShouldBe(before);

        var script = ReadScript("Wizard.js");
        script.ShouldContain("localStep = step;", Case.Sensitive);
        script.ShouldContain("if (model.canWrite === false && localStep) { model.currentStep = localStep; }", Case.Sensitive);
        // Üç gezinme yolu da (adım çipi, Geri, İleri) aynı işlevden geçer; uca doğrudan giden kalmadı.
        script.Split("service.setStep(").Length.ShouldBe(2);
        script.Split("goToStep(").Length.ShouldBe(5);
    }

    /// <summary>
    /// Ürün kararı (2026-10-14): "Bugün" okuma ekranıdır. Yazma izni olmayan danışman için de
    /// yüklenir (eskiden düzenleme izni istiyor, sayfa açılıp veri gelmiyordu).
    /// </summary>
    [Fact]
    public async Task Yazma_izni_olmayan_danisman_Bugun_ekranini_okur()
    {
        var today = await GetRequiredService<IGrantTodayAppService>().GetAsync();

        today.IsHost.ShouldBeTrue();
    }

    private static string ReadScript(string name)
    {
        var path = Path.Combine(
            Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..",
            "src", "Apya.Platform.Web", "Pages", "Grants", name);
        File.Exists(path).ShouldBeTrue($"Betik bulunamadı: {Path.GetFullPath(path)}");
        return File.ReadAllText(path);
    }

    /// <summary>
    /// Firma tarafına özgü ekranlar (çağrı ayrıntısı, yolculuk, profil, fikir) DTO bayrağı taşımaz;
    /// izni betik sorar. İzin adı sabitin DEĞERİDİR (ScriptPermissionNames_Tests ayrıca denetler).
    /// </summary>
    [Fact]
    public void Firma_ekranlari_yazma_iznini_sorar_ve_denetimleri_buna_baglar()
    {
        const string ask = "var canWrite = abp.auth.isGranted('Platform.Grants.ManageApplications') || abp.auth.isGranted('Platform.Grants.Edit');";
        PlatformPermissions.Grants.ManageApplications.ShouldBe("Platform.Grants.ManageApplications");
        PlatformPermissions.Grants.Edit.ShouldBe("Platform.Grants.Edit");

        var detail = ReadScript("Detail.js");
        detail.ShouldContain(ask, Case.Sensitive);
        // QA 10-22: ilgi bir firmanındır, host bağlamında düğme yok (sunucu da reddeder).
        detail.ShouldContain("toggleClass('d-none', !canExpress || !canWrite || !isTenant)", Case.Sensitive);
        detail.ShouldContain("$('#InterestWithdrawBtn').toggleClass('d-none', !pending || !canWrite);", Case.Sensitive);
        // QA 10-22: takip yazma izni ister (#796); düğme de izne bağlı.
        detail.ShouldContain("$('#BookmarkBtn').toggleClass('d-none', !canWrite)", Case.Sensitive);

        var catalog = ReadScript("Catalog.js");
        catalog.ShouldContain(ask, Case.Sensitive);
        catalog.ShouldContain("? '<button type=\"button\" class=\"apya-cat-bookmark'", Case.Sensitive);

        var journey = ReadScript("Journey.js");
        journey.ShouldContain(ask, Case.Sensitive);
        journey.ShouldContain("if (canWrite && (!i.meeting || i.meeting.status === 2)) {", Case.Sensitive);
        // Geri çekme düğmelerinin ikisi de (talep ve fikir) izne bağlı.
        journey.Split("if (canWrite) {").Length.ShouldBe(3);
        journey.ShouldContain("data-withdraw=\"", Case.Sensitive);
        journey.ShouldContain("data-withdraw-idea=\"", Case.Sensitive);

        var tenant = ReadScript("Tenant.js");
        tenant.ShouldContain(ask, Case.Sensitive);
        tenant.ShouldContain("$('#ProfileForm').prop('disabled', !canWrite);", Case.Sensitive);
        tenant.ShouldContain("$('#SaveProfileBtn').addClass('d-none');", Case.Sensitive);
        tenant.ShouldContain("(canWrite ? '<button type=\"button\" class=\"apya-feed-bookmark-edit\"", Case.Sensitive);

        var idea = ReadScript("Idea.js");
        idea.ShouldContain(ask, Case.Sensitive);
        idea.ShouldContain("l('Grants:ReadOnly:Notice')", Case.Sensitive);
    }

    /// <summary>
    /// Denetimler betikle çizildiği için sunucu HTML'inde görünmez; betiğin bayrağı okuduğu kaynaktan
    /// kilitlenir. Bayrak adı DTO'daki özellikle aynıdır (camelCase).
    /// </summary>
    [Fact]
    public void Betikler_yazma_bayragini_okur()
    {
        typeof(Apya.Platform.Grants.Dtos.GrantApplicationWizardDto).GetProperty("CanWrite").ShouldNotBeNull();
        typeof(Apya.Platform.Grants.Dtos.GrantDocumentConsoleDto).GetProperty("CanWrite").ShouldNotBeNull();
        typeof(Apya.Platform.Grants.Dtos.GrantAppealConsoleDto).GetProperty("CanWrite").ShouldNotBeNull();

        var wizard = ReadScript("Wizard.js");
        wizard.ShouldContain("function locked() { return !!model.isReadOnly || model.canWrite === false; }", Case.Sensitive);
        wizard.ShouldContain("$('#TargetForm').toggleClass('d-none', locked());", Case.Sensitive);
        wizard.ShouldContain("$('#MessageBody, #SendMessageBtn').prop('disabled', model.canWrite === false);", Case.Sensitive);
        // "Gönderildi" rozeti izne DEĞİL gönderim durumuna bakar.
        wizard.ShouldContain("$('#SubmittedChip').toggleClass('d-none', !model.isReadOnly)", Case.Sensitive);

        var documents = ReadScript("Documents.js");
        documents.ShouldContain("var locked = !!model.isReadOnly || model.canWrite === false;", Case.Sensitive);
        documents.ShouldContain("model.approvedCount === 0 || model.canWrite === false", Case.Sensitive);

        ReadScript("Appeal.js").ShouldContain("model.appealedCount === 0 || model.canWrite === false", Case.Sensitive);
    }
}

/// <summary>Karşı yön: yazma izni olan kullanıcıda bayrak AÇIK gelir (varsayılan barındırıcı).</summary>
public class GrantWriterViewer_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Yazma_izni_olan_danisman_icin_bayrak_acik_gelir()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        Guid id;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var call = (await GetRequiredService<IRepository<GrantCall, Guid>>()
                .GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();
            var application = new GrantApplication(Guid.NewGuid(), null, call.Id);
            await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(application, autoSave: true);
            await uow.CompleteAsync();
            id = application.Id;
        }

        (await GetRequiredService<IGrantApplicationWizardAppService>().GetAsync(id)).CanWrite.ShouldBeTrue();
        (await GetRequiredService<IGrantApplicationDocumentAppService>().GetAsync(id)).CanWrite.ShouldBeTrue();
    }
}
