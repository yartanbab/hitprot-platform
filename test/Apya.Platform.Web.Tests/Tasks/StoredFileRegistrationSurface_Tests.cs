using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Storage;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Routing;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// Saklanan dosya ADINI çağırandan alan metot uç değildir.
///
/// <para>Yüklenen dosyalar tek düz klasörde durur; <c>/file/get/{ad}</c> bir dosyayı, çağıranın
/// erişebildiği HERHANGİ bir kayıt o adı gösteriyorsa verir. Kaydı açan servis metotları
/// (görev eki, proje eki, belge eki, kapak görseli, afiş, hibe evrakı sürümü, teslim çıktısı, abonelik
/// faturası) saklanan adı parametre olarak alır — sayfa onlara kendi yazdığı dosyanın adını verir.
/// Aynı metotlar otomatik API ucu olarak da açıktı: oturumlu bir kullanıcı sayfayı atlayıp ucu
/// doğrudan çağırarak, adını bildiği BAŞKA bir dosyayı kendi kaydına bağlayabiliyor ve okuyabiliyordu.
/// Dosya adları rastgeledir (tahmin edilemez); yine de "adı bilmek = okumak" olmamalı.</para>
/// </summary>
[Collection("Yükleme klasörünü kullanan testler")]
public class StoredFileRegistrationSurface_Tests : PlatformWebTestBase
{
    private static readonly string[] FileNameParameters =
        { "storedFileName", "storedFilePath", "posterFileName", "coverImageFileName" };

    private static readonly string[] FileNameProperties =
        { "StoredFileName", "StoredFilePath", "PosterFileName", "CoverImageFileName" };

    private List<(RouteEndpoint Endpoint, ControllerActionDescriptor Action)> OurActions() =>
        GetRequiredService<IEnumerable<EndpointDataSource>>()
            .SelectMany(source => source.Endpoints)
            .OfType<RouteEndpoint>()
            .Select(e => (Endpoint: e, Action: e.Metadata.GetMetadata<ControllerActionDescriptor>()))
            .Where(x => x.Action != null
                        && x.Action.ControllerTypeInfo.Assembly.GetName().Name!
                            .StartsWith("Apya.Platform", StringComparison.Ordinal))
            .Select(x => (x.Endpoint, x.Action!))
            .ToList();

    /// <summary>
    /// Sözleşme: parametresinde ya da girdi nesnesinde saklanan dosya adı / yolu taşıyan hiçbir
    /// metot HTTP ucu değildir. Yeni bir "kayıt aç" metodu eklenirse burada görünür.
    /// </summary>
    [Fact]
    public void Saklanan_Dosya_Adini_Cagirandan_Alan_Metot_Uc_Degildir()
    {
        var exposed = new List<string>();
        foreach (var (endpoint, action) in OurActions())
        {
            foreach (var parameter in action.MethodInfo.GetParameters())
            {
                var direct = FileNameParameters.Contains(parameter.Name, StringComparer.OrdinalIgnoreCase);
                var viaInput = parameter.ParameterType.IsClass
                               && parameter.ParameterType != typeof(string)
                               && parameter.ParameterType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                   .Any(p => p.CanWrite && FileNameProperties.Contains(p.Name));
                if (direct || viaInput)
                {
                    exposed.Add($"{action.ControllerTypeInfo.Name}.{action.MethodInfo.Name}({parameter.Name})  →  {endpoint.RoutePattern.RawText}");
                }
            }
        }

        exposed.Distinct().OrderBy(x => x, StringComparer.Ordinal).ToList().ShouldBeEmpty(
            "Şu uçlar saklanan dosya adını çağırandan alıyor. Sayfa/denetleyici sunucu içinden çağırıyorsa " +
            "metodu [RemoteService(IsEnabled = false)] yapın:\n" + string.Join("\n", exposed.Distinct().OrderBy(x => x)));
    }

    private async Task<bool> ReadsAsync(string storedFileName, byte[] expected)
    {
        var response = await Client.GetAsync($"/file/get/{storedFileName}");
        return response.IsSuccessStatusCode
               && (await response.Content.ReadAsByteArrayAsync()).SequenceEqual(expected);
    }

    /// <summary>
    /// Davranışın kendisi: hiçbir kayda bağlı olmayan (başkasına ait) bir dosya, kullanıcı onu
    /// kendi görevine "ek" diye kaydettirince okunabilir hâle geliyordu.
    /// </summary>
    [Fact]
    public async Task Kullanici_Adini_Bildigi_Dosyayi_Kendi_Gorevine_Baglayip_Okuyamaz()
    {
        Guid taskId;
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            var task = new TaskItem(
                Guid.NewGuid(), "Kendi görevim",
                tenantId: GetRequiredService<ICurrentTenant>().Id, now: DateTime.Now);
            await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(task, autoSave: true);
            taskId = task.Id;
            await uow.CompleteAsync();
        }

        var root = GetRequiredService<IUploadedFileRootFolderProvider>().GetRootFolder();
        var victimName = Guid.NewGuid() + ".pdf";
        var victimPath = Path.Combine(root, victimName);
        var secret = Encoding.UTF8.GetBytes("kullanıcıyla ilgisi olmayan belge " + Guid.NewGuid());
        await File.WriteAllBytesAsync(victimPath, secret);

        try
        {
            // Başlangıç: hiçbir kayıt bu dosyayı göstermiyor → okunamaz. (Uygulama "bulunamadı"yı
            // hata sayfasına yönlendirir; durum koduna değil İÇERİĞE bakılır.)
            (await ReadsAsync(victimName, secret))
                .ShouldBeFalse("kayda bağlı olmayan dosya zaten okunabiliyor; test bir şey ölçmüyor");

            // Kullanıcı, kaydı açan ucu (varsa) doğrudan çağırır ve o dosyanın adını verir.
            var registrar = OurActions().FirstOrDefault(x =>
                x.Action.ControllerTypeInfo.Name == "TaskAppService" && x.Action.MethodInfo.Name == "AddAttachmentAsync");
            if (registrar.Endpoint != null)
            {
                var url = "/" + registrar.Endpoint.RoutePattern.RawText!.Replace("{taskId}", taskId.ToString())
                          + $"?fileName=belgem.pdf&storedFileName={Uri.EscapeDataString(victimName)}&fileSize={secret.Length}";
                using var body = new StringContent("{}", Encoding.UTF8, "application/json");
                await Client.PostAsync(url, body);
            }

            (await ReadsAsync(victimName, secret))
                .ShouldBeFalse("kullanıcı, adını bildiği başka bir dosyayı kendi görevine bağlayıp okudu");
        }
        finally
        {
            try { File.Delete(victimPath); } catch (IOException) { }
        }
    }
}
