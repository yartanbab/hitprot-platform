using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Storage;
using Apya.Platform.Tasks.Dtos;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// Misafir paylaşımının sunucu içi metotları API ucu DEĞİLDİR.
///
/// <para>Misafir yüklemesini <c>/Paylasim</c> sayfası yapar: izni doğrular, dosyayı ortak depoya
/// yazar (ad sunucuda üretilir), sonra kaydı açar. Kaydı açan servis metodu saklanan dosya ADINI
/// parametre olarak alır — sayfa ona kendi yazdığı dosyanın adını verir. Aynı metot oturumsuz bir
/// API ucu olarak da açıktı: geçerli bir paylaşım bağlantısı olan misafir, sayfayı atlayıp ucu
/// doğrudan çağırarak yükleme klasöründeki BAŞKA bir dosyayı (adını biliyorsa) kendi eki olarak
/// kaydettirebiliyor, sonra "kendi yüklediği ek" diye indirebiliyordu.</para>
///
/// <para>Yükleme klasörü bütün test sınıflarının ortak malı; klasöre yazan sınıflar aynı
/// koleksiyonda sırayla koşar.</para>
/// </summary>
[Collection("Yükleme klasörünü kullanan testler")]
public class GuestShareApiSurface_Tests : PlatformWebTestBase
{
    private string RootFolder => GetRequiredService<IUploadedFileRootFolderProvider>().GetRootFolder();

    /// <summary>Görev + yükleme izinli paylaşım bağlantısı: misafirin elindeki meşru bağlantı.</summary>
    private async Task<(Guid TaskId, string Token)> CreateSharedTaskAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);

        var task = new TaskItem(
            Guid.NewGuid(), "Misafire açık görev",
            tenantId: GetRequiredService<ICurrentTenant>().Id, now: DateTime.Now);
        await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(task, autoSave: true);

        var created = await GetRequiredService<ITaskShareAppService>().CreateAsync(new CreateTaskShareLinkDto
        {
            TaskId = task.Id,
            RecipientName = "Misafir",
            LifetimeDays = 7,
            AllowComment = true,
            AllowUpload = true,
            AllowDownload = true
        });
        await uow.CompleteAsync();

        return (task.Id, created.Url.Split('/').Last());
    }

    private async Task<TaskAttachment?> FindAttachmentAsync(Func<TaskAttachment, bool> predicate)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        return (await GetRequiredService<IRepository<TaskAttachment, Guid>>().GetListAsync()).FirstOrDefault(predicate);
    }

    [Fact]
    public async Task Misafir_Baska_Bir_Dosyayi_Kendi_Eki_Olarak_Kaydettiremez()
    {
        var (taskId, token) = await CreateSharedTaskAsync();

        // Yükleme klasöründe misafirle ilgisi olmayan bir dosya (başka bir kaydın belgesi).
        var victimName = Guid.NewGuid() + ".pdf";
        var victimPath = Path.Combine(RootFolder, victimName);
        var secret = Encoding.UTF8.GetBytes("misafirle ilgisi olmayan belge " + Guid.NewGuid());
        await File.WriteAllBytesAsync(victimPath, secret);

        try
        {
            // Misafir sayfayı atlar, kaydı açan ucu doğrudan çağırır ve o dosyanın adını verir.
            var url = $"/api/app/task-share/register-guest-upload/{taskId}"
                      + $"?token={Uri.EscapeDataString(token)}&fileName=belgem.pdf"
                      + $"&storedFileName={Uri.EscapeDataString(victimName)}&fileSize={secret.Length}";
            using var body = new StringContent("{}", Encoding.UTF8, "application/json");
            var register = await Client.PostAsync(url, body);

            var planted = await FindAttachmentAsync(a => a.StoredFileName == victimName);

            // Kayıt açıldıysa misafir onu "kendi eki" olarak indirebilir: gerçekten indirmeyi dene.
            var leaked = false;
            if (planted != null)
            {
                var download = await Client.GetAsync(
                    $"/Paylasim/{Uri.EscapeDataString(token)}?handler=Download&attachmentId={planted.Id}");
                leaked = download.IsSuccessStatusCode
                         && (await download.Content.ReadAsByteArrayAsync()).SequenceEqual(secret);
            }

            leaked.ShouldBeFalse("misafir, yükleme klasöründeki başka bir dosyayı kendi eki olarak indirdi");
            planted.ShouldBeNull("misafir, sunucudaki başka bir dosyayı kendi eki olarak kaydettirdi");
            register.IsSuccessStatusCode.ShouldBeFalse("kayıt açan metot API ucu olarak çağrılabildi");
        }
        finally
        {
            try { File.Delete(victimPath); } catch (IOException) { }
        }
    }

    /// <summary>
    /// Öbür yüz: uç kapanınca meşru yol bozulmadı. Misafir sayfa üzerinden yükler, dosya sunucunun
    /// ürettiği adla saklanır ve misafir kendi ekini indirir.
    /// </summary>
    [Fact]
    public async Task Misafir_Sayfa_Uzerinden_Yukler_Ve_Kendi_Ekini_Indirir()
    {
        var (taskId, token) = await CreateSharedTaskAsync();
        var payload = Encoding.UTF8.GetBytes("%PDF-1.4 misafir yüklemesi " + Guid.NewGuid());
        var pageUrl = $"/Paylasim/{Uri.EscapeDataString(token)}";

        var page = await Client.GetAsync(pageUrl);
        page.StatusCode.ShouldBe(HttpStatusCode.OK, "paylaşım sayfası oturumsuz açılmalı");
        var doc = new HtmlDocument();
        doc.LoadHtml(await page.Content.ReadAsStringAsync());
        var antiforgery = doc.DocumentNode
            .SelectSingleNode("//input[@name='__RequestVerificationToken']")
            ?.GetAttributeValue("value", null);
        antiforgery.ShouldNotBeNull("sayfadaki formda doğrulama jetonu olmalı");

        using var form = new MultipartFormDataContent();
        var file = new ByteArrayContent(payload);
        file.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
        form.Add(file, "file", "misafir.pdf");
        form.Add(new StringContent(taskId.ToString()), "taskId");
        form.Add(new StringContent(antiforgery!), "__RequestVerificationToken");

        var upload = await Client.PostAsync(pageUrl + "?handler=Upload", form);
        ((int)upload.StatusCode).ShouldBeLessThan(400, "sayfa üzerinden yükleme reddedildi");

        var attachment = await FindAttachmentAsync(a => a.TaskId == taskId && a.FileName == "misafir.pdf");
        attachment.ShouldNotBeNull("yükleme kaydı açılmadı");
        var storedPath = Path.Combine(RootFolder, attachment!.StoredFileName);
        try
        {
            Guid.TryParse(Path.GetFileNameWithoutExtension(attachment.StoredFileName), out _)
                .ShouldBeTrue("saklanan ad sunucuda üretilmiş olmalı: " + attachment.StoredFileName);

            var download = await Client.GetAsync($"{pageUrl}?handler=Download&attachmentId={attachment.Id}");
            download.StatusCode.ShouldBe(HttpStatusCode.OK);
            (await download.Content.ReadAsByteArrayAsync()).ShouldBe(payload);
        }
        finally
        {
            try { File.Delete(storedPath); } catch (IOException) { }
        }
    }
}
