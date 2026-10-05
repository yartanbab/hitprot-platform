using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Storage;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// DOC-11 · Görev eki yüklemesinde erişim kontrolü dosya diske yazılmadan ÖNCE yapılır.
///
/// <para>Düzeltmeden önce iki yükleme yolu da (görev penceresi ve API ucu) dosyayı önce
/// yazıp sonra kaydı açıyordu; kontrol kaydı açan serviste olduğu için reddedilen istek
/// hata alıyor ama dosya yükleme klasöründe hiçbir kayda bağlı olmadan kalıyordu.</para>
///
/// <para>Test barındırıcısı her izne "evet" dediği için gizli görev reddi burada
/// üretilemez; aynı kapının diğer yüzü — var olmayan görev — kullanılır. İki durumda da
/// istek aynı noktada düşer.</para>
/// </summary>
public class TaskAttachmentUploadOrder_Tests : PlatformWebTestBase
{
    private static readonly byte[] Payload = Encoding.UTF8.GetBytes("DOC-11 deneme içeriği");

    private string RootFolder => GetRequiredService<IUploadedFileRootFolderProvider>().GetRootFolder();

    private int FileCount() => Directory.GetFiles(RootFolder).Length;

    private async Task<string> AntiforgeryTokenAsync()
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync("/Admin/Billing"));
        var input = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        input.ShouldNotBeNull("antiforgery jetonu alınamadı");
        return input.GetAttributeValue("value", "");
    }

    private async Task<HttpResponseMessage> PostFileAsync(string url, string fileName)
    {
        var token = await AntiforgeryTokenAsync();

        using var content = new MultipartFormDataContent();
        var file = new ByteArrayContent(Payload);
        file.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
        content.Add(file, "file", fileName);
        content.Add(new StringContent(token), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, url) { Content = content };
        // Gerçek istemci (görev penceresi) bu uçları AJAX ile çağırır; hata da öyle döner.
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        request.Headers.Add("RequestVerificationToken", token);
        return await Client.SendAsync(request);
    }

    private async Task<System.Collections.Generic.List<TaskAttachment>> StoredAttachmentsAsync(Guid taskId)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        var attachments = GetRequiredService<IRepository<TaskAttachment, Guid>>();
        return await attachments.GetListAsync(a => a.TaskId == taskId);
    }

    private async Task<Guid> SeedTaskAsync()
    {
        var taskId = Guid.NewGuid();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tasks = GetRequiredService<IRepository<TaskItem, Guid>>();
            await tasks.InsertAsync(new TaskItem(taskId, "DOC-11 görevi", startDate: DateTime.Today), autoSave: true);
            await uow.CompleteAsync();
        }

        return taskId;
    }

    [Fact]
    public async Task Gorev_Penceresi_Erisilemeyen_Goreve_Yuklemede_Diske_Dosya_Birakmaz()
    {
        var before = FileCount();

        var response = await PostFileAsync($"/Tasks/EditModal?handler=UploadFile&taskId={Guid.NewGuid()}", "not.txt");

        response.IsSuccessStatusCode.ShouldBeFalse();
        FileCount().ShouldBe(before, "reddedilen yükleme diske dosya bırakmamalı");
    }

    [Fact]
    public async Task Api_Ucu_Erisilemeyen_Goreve_Yuklemede_Diske_Dosya_Birakmaz()
    {
        var before = FileCount();

        var response = await PostFileAsync($"/api/tasks/attachments/upload/{Guid.NewGuid()}", "not.txt");

        response.IsSuccessStatusCode.ShouldBeFalse();
        FileCount().ShouldBe(before, "reddedilen yükleme diske dosya bırakmamalı");
    }

    /// <summary>Kontrolün öne alınması geçerli yüklemeyi bozmadı: dosya yazılır, kayıt açılır.</summary>
    [Fact]
    public async Task Gecerli_Yukleme_Iki_Yoldan_Da_Calisir()
    {
        var taskId = await SeedTaskAsync();

        var page = await PostFileAsync($"/Tasks/EditModal?handler=UploadFile&taskId={taskId}", "pencere.txt");
        var api = await PostFileAsync($"/api/tasks/attachments/upload/{taskId}", "api.txt");

        page.StatusCode.ShouldBe(HttpStatusCode.NoContent);
        api.StatusCode.ShouldBe(HttpStatusCode.OK);

        var attachments = await StoredAttachmentsAsync(taskId);
        try
        {
            attachments.Select(a => a.FileName).ShouldBe(new[] { "pencere.txt", "api.txt" }, ignoreOrder: true);
            foreach (var attachment in attachments)
            {
                File.Exists(Path.Combine(RootFolder, attachment.StoredFileName)).ShouldBeTrue();
            }
        }
        finally
        {
            // Yükleme kökü test çıktı klasöründe; koşular arasında dosya birikmesin.
            foreach (var attachment in attachments)
            {
                File.Delete(Path.Combine(RootFolder, attachment.StoredFileName));
            }
        }
    }
}
