using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using ClosedXML.Excel;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Import;

/// <summary>
/// Görevleri Excel'den içe aktarma: ortak gövde (ExcelImportPageModel) görev penceresinin
/// servisine bağlanır. Proje adla/kodla, durum ve öncelik metinle, atanan kişi kullanıcı adıyla eşleşir.
/// </summary>
public class TaskImport_Tests : PlatformWebTestBase
{
    private const string Url = "/Tasks/ImportModal";

    // Şablonun sütun sırası: Başlık, Proje, Başlangıç, Son tarih, Durum, Öncelik, Atanan, Etiketler, Açıklama
    private const int TitleCol = 1, ProjectCol = 2, StartCol = 3, DueCol = 4, StatusCol = 5, PriorityCol = 6,
        AssigneeCol = 7, TagsCol = 8;

    private readonly string _code = Guid.NewGuid().ToString("N")[..6];

    private async Task<Project> SeedProjectAsync()
    {
        var project = new Project(Guid.NewGuid(), null, null, "İçe aktarma projesi " + _code, "IMP-" + _code, "");
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(project, autoSave: true);
        await uow.CompleteAsync();
        return project;
    }

    private async Task<byte[]> FilledTemplateAsync(params string?[][] rows)
    {
        var response = await GetResponseAsync(Url + "?handler=Template");
        using var wb = new XLWorkbook(new MemoryStream(await response.Content.ReadAsByteArrayAsync()));
        var ws = wb.Worksheet(1);
        ws.Cell(1, TitleCol).GetString().ShouldEndWith(" *");
        for (var i = 0; i < rows.Length; i++)
        {
            for (var c = 0; c < rows[i].Length; c++)
            {
                if (rows[i][c] != null) ws.Cell(i + 2, c + 1).Value = rows[i][c]!;
            }
        }

        using var stream = new MemoryStream();
        wb.SaveAs(stream);
        return stream.ToArray();
    }

    private async Task<JsonElement> PostAsync(string handler, byte[] file)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Url));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull("pencerede antiforgery jetonu yok");

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        part.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        content.Add(part, "file", "gorevler.xlsx");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, Url + "?handler=" + handler) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    [Fact]
    public async Task Gecerli_satirlar_proje_durum_oncelik_atanan_ve_etiketle_kaydedilir()
    {
        var project = await SeedProjectAsync();
        var user = (await GetRequiredService<ITaskAppService>().GetUsersLookupAsync()).Items.First();

        var file = await FilledTemplateAsync(
            ["Görev " + _code + " 1", project.Code, "10.11.2026", "20.11.2026", "InProgress", "High", user.UserName, "aktarım, " + _code],
            ["Görev " + _code + " 2", project.Name, null, null, null, null, null, null]);

        var import = await PostAsync("Import", file);
        import.GetProperty("done").GetBoolean().ShouldBeTrue(import.GetProperty("message").GetString());

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var prefix = "Görev " + _code;
        var saved = (await GetRequiredService<IRepository<TaskItem, Guid>>().GetListAsync(t => t.Title.StartsWith(prefix)))
            .OrderBy(t => t.Title).ToList();
        saved.Count.ShouldBe(2);
        saved.ShouldAllBe(t => t.ProjectId == project.Id);
        saved[0].Status.ShouldBe(TaskStatus.InProgress);
        saved[0].Priority.ShouldBe(TaskPriority.High);
        saved[0].AssigneeId.ShouldBe(user.Id);
        saved[0].DueDate.ShouldBe(new DateTime(2026, 11, 20));
        saved[1].Status.ShouldBe(TaskStatus.Todo);
        saved[1].Priority.ShouldBe(TaskPriority.Medium);
        saved[1].DueDate.ShouldBeNull();
    }

    [Fact]
    public async Task Onizleme_bilinmeyen_kisiyi_ve_baslangictan_onceki_son_tarihi_satirda_gosterir()
    {
        var file = await FilledTemplateAsync(
            ["Görev " + _code + " a", null, "10.11.2026", "01.11.2026", null, null, null, null],
            ["Görev " + _code + " b", null, null, null, null, null, "olmayan-kisi-" + _code, null]);

        var preview = await PostAsync("Preview", file);
        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
        var rows = preview.GetProperty("rows");
        rows[0].GetProperty("errors").GetArrayLength().ShouldBe(1);
        rows[1].GetProperty("errors").GetArrayLength().ShouldBe(1);

        (await PostAsync("Import", file)).GetProperty("done").GetBoolean().ShouldBeFalse();
    }
}
