using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using ClosedXML.Excel;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>
/// Proje bütçe kalemlerini Excel'den içe aktarma: üst kalem mevcut bir kalem ya da dosyada daha
/// yukarıdaki bir satır olabilir; ağaç tek dosyada kurulur. Satırlar "Kalem ekle"nin servisinden geçer.
/// </summary>
public class BudgetLineImport_Tests : PlatformWebTestBase
{
    private const string Url = "/Finance/BudgetLineImportModal";

    private readonly string _code = Guid.NewGuid().ToString("N")[..6];

    private async Task<Guid> SeedProjectAsync()
    {
        var project = new Project(Guid.NewGuid(), null, null, "Bütçe aktarımı " + _code, "BUD-" + _code, "");
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(project, autoSave: true);
        await uow.CompleteAsync();
        return project.Id;
    }

    // Şablonun sütun sırası: Kod, Kalem adı, Üst kalem, Sözleşme tutarı, Onaylanan tutar, Hibe payı
    private async Task<byte[]> FilledTemplateAsync(Guid projectId, params string?[][] rows)
    {
        var response = await GetResponseAsync($"{Url}?projectId={projectId}&handler=Template");
        using var wb = new XLWorkbook(new MemoryStream(await response.Content.ReadAsByteArrayAsync()));
        var ws = wb.Worksheet(1);
        ws.Cell(1, 2).GetString().ShouldEndWith(" *");
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

    private async Task<JsonElement> PostAsync(Guid projectId, string handler, byte[] file)
    {
        var html = await GetResponseAsStringAsync($"{Url}?projectId={projectId}");
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull("pencerede antiforgery jetonu yok");
        // Pencere uçlarını proje bağlamıyla çağırır; sorgu dizesi düşerse kalem yanlış projeye gider.
        html.ShouldContain($"projectId={projectId}&amp;handler=Template");

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        part.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        content.Add(part, "file", "kalemler.xlsx");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, $"{Url}?projectId={projectId}&handler={handler}") { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    [Fact]
    public async Task Agac_tek_dosyada_kurulur_ust_kalem_kodla_ya_da_adla_bulunur()
    {
        var projectId = await SeedProjectAsync();
        var file = await FilledTemplateAsync(projectId,
            ["1", "Personel", null, "1000"],
            ["1.1", "Uzman", "1", "600"],
            ["1.2", "Asistan", "personel", "400", "350"],
            [null, "Seyahat", null, "1.500"]);

        var import = await PostAsync(projectId, "Import", file);
        import.GetProperty("done").GetBoolean().ShouldBeTrue(import.GetProperty("message").GetString());

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var lines = await GetRequiredService<IRepository<ProjectBudgetLine, Guid>>().GetListAsync(l => l.ProjectId == projectId);
        lines.Count.ShouldBe(4);
        var root = lines.Single(l => l.Code == "1");
        root.ParentId.ShouldBeNull();
        lines.Single(l => l.Code == "1.1").ParentId.ShouldBe(root.Id);
        var assistant = lines.Single(l => l.Code == "1.2");
        assistant.ParentId.ShouldBe(root.Id);
        assistant.ApprovedAmount.ShouldBe(350m);
        lines.Single(l => l.Name == "Seyahat").PlannedAmount.ShouldBe(1500m);
    }

    [Fact]
    public async Task Onizleme_tekrar_eden_kodu_bilinmeyen_ust_kalemi_ve_negatif_tutari_satirda_gosterir()
    {
        var projectId = await SeedProjectAsync();
        var file = await FilledTemplateAsync(projectId,
            ["1", "Personel", null, "1000"],
            ["1", "Yine personel", null, "100"],
            ["2", "Seyahat", "olmayan-kalem", "100"],
            ["3", "Kırtasiye", null, "-5"]);

        var preview = await PostAsync(projectId, "Preview", file);
        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
        var rows = preview.GetProperty("rows");
        rows[0].GetProperty("errors").GetArrayLength().ShouldBe(0);
        rows[1].GetProperty("errors").GetArrayLength().ShouldBe(1);
        rows[2].GetProperty("errors").GetArrayLength().ShouldBe(1);
        rows[3].GetProperty("errors").GetArrayLength().ShouldBe(1);

        (await PostAsync(projectId, "Import", file)).GetProperty("done").GetBoolean().ShouldBeFalse();

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        (await GetRequiredService<IRepository<ProjectBudgetLine, Guid>>().CountAsync(l => l.ProjectId == projectId)).ShouldBe(0);
    }
}
