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

    private static string ReadScript(string name)
    {
        var path = Path.Combine(
            Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..",
            "src", "Apya.Platform.Web", "Pages", "Grants", name);
        File.Exists(path).ShouldBeTrue($"Betik bulunamadı: {Path.GetFullPath(path)}");
        return File.ReadAllText(path);
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
