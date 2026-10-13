using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Permissions;
using Apya.Platform.Storage;
using Apya.Platform.Web.Pages.Grants;
using Apya.Platform.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.DependencyInjection;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Hibe belgeleri sayfası dosyayı, yazma izni denetlenmeden ÖNCE depoya yazıyordu: salt-okur
/// kullanıcının yüklediği dosya önce diske yazılıp servis reddedince siliniyordu; paket zip'i ise
/// reddedilince hiç silinmiyordu. İzin artık depoya dokunulmadan önce denetlenir.
/// </summary>
public class GrantDocumentUploadPermission_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var deny = new DenyPermissionsAuthorizationService(
            PlatformPermissions.Grants.Edit, PlatformPermissions.Grants.ManageApplications);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    /// <summary>Depoya yapılan her çağrıyı sayar; hiçbir şey yazmaz.</summary>
    private sealed class RecordingStorage : IUploadedFileStorage
    {
        public List<string> Calls { get; } = new();

        public Task<string> StoreAsync(IFormFile file)
        {
            Calls.Add("store");
            return Task.FromResult("kayit.pdf");
        }

        public Task<string> StoreGeneratedAsync(byte[] content, string extension)
        {
            Calls.Add("generated");
            return Task.FromResult("paket.zip");
        }

        public void TryDelete(string storedFileName) => Calls.Add("delete");
    }

    private DocumentsModel Page(RecordingStorage storage)
    {
        var page = new DocumentsModel(
            GetRequiredService<IGrantApplicationDocumentAppService>(),
            storage,
            GetRequiredService<IUploadedFileRootFolderProvider>());
        page.LazyServiceProvider = GetRequiredService<IAbpLazyServiceProvider>();
        return page;
    }

    [Fact]
    public async Task Yazma_izni_olmayan_kullanicinin_dosyasi_depoya_hic_yazilmaz()
    {
        var storage = new RecordingStorage();
        using var stream = new MemoryStream(new byte[] { 1, 2, 3 });
        var file = new FormFile(stream, 0, stream.Length, "file", "dekont.pdf");

        await Should.ThrowAsync<AbpAuthorizationException>(
            () => Page(storage).OnPostUploadAsync(Guid.NewGuid(), file, null));

        storage.Calls.ShouldBeEmpty("izin, dosya depoya yazılmadan önce denetlenmeli");
    }

    [Fact]
    public async Task Yazma_izni_olmayan_kullanici_icin_paket_dosyasi_uretilmez()
    {
        var storage = new RecordingStorage();

        await Should.ThrowAsync<AbpAuthorizationException>(
            () => Page(storage).OnPostCreatePackageAsync(Guid.NewGuid()));

        storage.Calls.ShouldBeEmpty();
    }
}
