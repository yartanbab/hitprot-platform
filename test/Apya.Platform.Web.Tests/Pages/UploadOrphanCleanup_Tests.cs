using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Storage;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Kaydı açılamayan yükleme diskte dosya bırakmaz (DOC-11'in kardeş yolları).
///
/// <para>Belge merkezi ve hibe evrakı yüklemeleri dosyayı önce yazıp sonra kaydı
/// açıyor; kayıt açılamazsa (olmayan klasör/evrak, gönderilmiş başvuru) dosya yükleme
/// klasöründe hiçbir kayda bağlı olmadan kalıyordu. Yükleme kuyruğu
/// (<c>Documents/Upload</c>) bunu zaten temizliyordu; bu iki yol temizlemiyordu.</para>
/// </summary>
public class UploadOrphanCleanup_Tests : PlatformWebTestBase
{
    // İçerik koşuya özgü: test kendi yazdığı dosyayı başka koşuların artıklarından ayırabilsin.
    private readonly byte[] _payload = Encoding.UTF8.GetBytes("yetim yükleme denemesi " + Guid.NewGuid());

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

    private async Task<HttpResponseMessage> PostFileAsync(string url, Guid documentId, string fileName)
    {
        var token = await AntiforgeryTokenAsync();

        using var content = new MultipartFormDataContent();
        var file = new ByteArrayContent(_payload);
        file.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
        content.Add(file, "file", fileName);
        content.Add(new StringContent(documentId.ToString()), "documentId");
        content.Add(new StringContent(token), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, url) { Content = content };
        // Gerçek istemci bu uçları AJAX ile çağırır; hata da öyle döner.
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        return await Client.SendAsync(request);
    }

    [Fact]
    public async Task Belge_Merkezi_Olmayan_Klasore_Yuklemede_Diske_Dosya_Birakmaz()
    {
        var before = FileCount();

        var response = await PostFileAsync("/Documents?handler=UploadFile", Guid.NewGuid(), "not.txt");

        response.IsSuccessStatusCode.ShouldBeFalse();
        FileCount().ShouldBe(before, "kaydı açılamayan yükleme diskte dosya bırakmamalı");
    }

    /// <summary>
    /// Yükleme kuyruğu bu temizliği zaten yapıyordu; kendi kopyası ortak depolama metoduna
    /// taşındı. Davranışın taşınırken kaybolmadığını kilitler.
    /// </summary>
    [Fact]
    public async Task Yukleme_Kuyrugu_Olmayan_Klasore_Yuklemede_Diske_Dosya_Birakmaz()
    {
        var before = FileCount();

        var response = await PostFileAsync("/Documents/Upload?handler=Upload", Guid.NewGuid(), "not.txt");

        response.IsSuccessStatusCode.ShouldBeFalse();
        FileCount().ShouldBe(before, "kaydı açılamayan yükleme diskte dosya bırakmamalı");
    }

    [Fact]
    public async Task Hibe_Evraki_Olmayan_Evraka_Yuklemede_Diske_Dosya_Birakmaz()
    {
        var before = FileCount();

        var response = await PostFileAsync("/Grants/Documents?handler=Upload", Guid.NewGuid(), "not.txt");

        response.IsSuccessStatusCode.ShouldBeFalse();
        FileCount().ShouldBe(before, "kaydı açılamayan yükleme diskte dosya bırakmamalı");
    }

    /// <summary>Temizlik yalnız HATA yolunda çalışır: geçerli yükleme yazılır ve yerinde kalır.</summary>
    [Fact]
    public async Task Belge_Merkezi_Gecerli_Yukleme_Calisir()
    {
        var folderId = Guid.NewGuid();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var folders = GetRequiredService<IRepository<Document, Guid>>();
            await folders.InsertAsync(new Document(folderId, null, "Yetim testi klasörü", ""), autoSave: true);
            await uow.CompleteAsync();
        }

        var before = FileCount();

        var response = await PostFileAsync("/Documents?handler=UploadFile", folderId, "gecerli.txt");

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        var written = Directory.GetFiles(RootFolder)
            .Where(f => File.ReadAllBytes(f).SequenceEqual(_payload))
            .ToList();
        try
        {
            FileCount().ShouldBe(before + 1);
            written.Count.ShouldBe(1);
        }
        finally
        {
            // Yükleme kökü test çıktı klasöründe; koşular arasında dosya birikmesin.
            foreach (var path in written)
            {
                File.Delete(path);
            }
        }
    }
}
