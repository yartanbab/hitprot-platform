using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using ClosedXML.Excel;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>Tam parametreli aktarım testlerinin ortak dosya ve kiracı yardımcıları.</summary>
public abstract class FullImportTestBase : PlatformWebTestBase
{
    protected abstract string Url { get; }

    protected readonly string Code = Guid.NewGuid().ToString("N")[..6];

    protected string TenantName => "tam-aktarim-" + Code;

    protected async Task<Guid> SeedTenantAsync(string? name = null)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync(name ?? TenantName);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    protected async Task InTenantAsync(Guid? tenantId, Func<Task> action)
    {
        using (GetRequiredService<ICurrentTenant>().Change(tenantId))
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            await action();
            await uow.CompleteAsync();
        }
    }

    protected async Task<byte[]> ExportAsync()
    {
        var response = await GetResponseAsync($"{Url}?handler=Export");
        return await response.Content.ReadAsByteArrayAsync();
    }

    protected static byte[] Edit(byte[] file, Action<IXLWorksheet> edit)
    {
        using var wb = new XLWorkbook(new MemoryStream(file));
        edit(wb.Worksheet(1));
        using var stream = new MemoryStream();
        wb.SaveAs(stream);
        return stream.ToArray();
    }

    protected static int ColumnOf(IXLWorksheet ws, string header)
        => ws.Row(1).CellsUsed().First(c => c.GetString().TrimEnd(' ', '*') == header).Address.ColumnNumber;

    protected static int RowOf(IXLWorksheet ws, Guid id)
        => ws.Column(1).CellsUsed().First(c => c.GetString() == id.ToString()).Address.RowNumber;

    protected static int NextRow(IXLWorksheet ws) => ws.LastRowUsed()!.RowNumber() + 1;

    protected static bool HasId(byte[] file, Guid id)
    {
        using var wb = new XLWorkbook(new MemoryStream(file));
        return wb.Worksheet(1).Column(1).CellsUsed().Any(c => c.GetString() == id.ToString());
    }

    protected async Task<JsonElement> PostAsync(string handler, byte[] file)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Url));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull("pencerede antiforgery jetonu yok");

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        part.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        content.Add(part, "file", "aktarim.xlsx");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, $"{Url}?handler={handler}") { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    protected static string Describe(JsonElement result)
    {
        var errors = result.TryGetProperty("rows", out var rows)
            ? rows.EnumerateArray().SelectMany(r => r.GetProperty("errors").EnumerateArray()
                .Select(e => $"satır {r.GetProperty("number").GetInt32()}: {e.GetString()}"))
            : [];
        return $"{result.GetProperty("message").GetString()} {string.Join(" | ", errors)}";
    }

    protected static void ShouldBeDone(JsonElement result, string summary)
    {
        result.GetProperty("done").GetBoolean().ShouldBeTrue(Describe(result));
        result.GetProperty("message").GetString().ShouldContain(summary);
    }
}

public class ProjectFullImport_Tests : FullImportTestBase
{
    protected override string Url => "/Projects/FullImportModal";

    private async Task<Guid> SeedProjectAsync(Guid tenantId, DateTime start)
    {
        var id = Guid.NewGuid();
        await InTenantAsync(tenantId, () => GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
            new Project(id, tenantId, null, "Kiracı projesi " + Code, "KP-" + Code, "Açıklama", 1000m, 50m, "EUR", "Amaç",
                startDate: start, endDate: start.AddDays(30)), autoSave: true));
        return id;
    }

    [Fact]
    public async Task Cikti_aynen_yuklenince_degismez_kimlikli_gunceller_kiraciya_yeni_acar()
    {
        var tenantId = await SeedTenantAsync();
        var start = new DateTime(2026, 3, 5, 14, 30, 0);
        var id = await SeedProjectAsync(tenantId, start);

        var file = await ExportAsync();
        ShouldBeDone(await PostAsync("Import", file), "Yeni: 0 · Güncellenen: 0");

        var newName = "Yeni proje " + Code;
        var edited = Edit(file, ws =>
        {
            ws.Cell(RowOf(ws, id), ColumnOf(ws, "Amaç")).Value = "Yeni amaç";
            var next = NextRow(ws);
            ws.Cell(next, ColumnOf(ws, "Kiracı")).Value = TenantName;
            ws.Cell(next, ColumnOf(ws, "Proje adı")).Value = newName;
            ws.Cell(next, ColumnOf(ws, "Toplam bütçe")).Value = 2500;
        });
        ShouldBeDone(await PostAsync("Import", edited), "Yeni: 1 · Güncellenen: 1");

        await InTenantAsync(tenantId, async () =>
        {
            var repository = GetRequiredService<IRepository<Project, Guid>>();
            var updated = await repository.GetAsync(id);
            updated.Purpose.ShouldBe("Yeni amaç");
            updated.StartDate.ShouldBe(start); // değişmeyen hücre saati bozmaz
            updated.TotalBudget.ShouldBe(1000m);
            updated.Currency.ShouldBe("EUR");

            var created = await repository.SingleAsync(p => p.Name == newName);
            created.TenantId.ShouldBe(tenantId);
            created.Code.ShouldNotBeNullOrEmpty();
            created.TotalBudget.ShouldBe(2500m);
        });
    }

    [Fact]
    public async Task Kiracisi_degistirilen_ve_kodu_cakisan_satir_reddedilir()
    {
        var tenantId = await SeedTenantAsync();
        await SeedTenantAsync("baska-" + Code);
        var id = await SeedProjectAsync(tenantId, new DateTime(2026, 3, 5));
        var file = await ExportAsync();

        var moved = await PostAsync("Preview", Edit(file, ws => ws.Cell(RowOf(ws, id), ColumnOf(ws, "Kiracı")).Value = "baska-" + Code));
        moved.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(moved).ShouldContain("başka kiracıya taşınmaz");

        var duplicate = await PostAsync("Preview", Edit(file, ws =>
        {
            var next = NextRow(ws);
            ws.Cell(next, ColumnOf(ws, "Kiracı")).Value = TenantName;
            ws.Cell(next, ColumnOf(ws, "Proje adı")).Value = "Kopya kod";
            ws.Cell(next, ColumnOf(ws, "Proje kodu")).Value = "KP-" + Code;
        }));
        duplicate.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(duplicate).ShouldContain("zaten kullanılıyor");
    }
}

public class TaskFullImport_Tests : FullImportTestBase
{
    protected override string Url => "/Tasks/FullImportModal";

    private async Task<(Guid TenantId, Guid ProjectId, Guid UserId, string UserName, Guid TaskId, Guid PrivateId)> SeedAsync()
    {
        var tenantId = await SeedTenantAsync();
        var projectId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var taskId = Guid.NewGuid();
        var privateId = Guid.NewGuid();
        var userName = "kisi-" + Code;

        await InTenantAsync(tenantId, async () =>
        {
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, tenantId, null, "Görev projesi " + Code, "GP-" + Code, ""), autoSave: true);
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(
                new IdentityUser(userId, userName, $"{userName}@example.test", tenantId), autoSave: true);

            var tasks = GetRequiredService<IRepository<TaskItem, Guid>>();
            var task = new TaskItem(taskId, "Mevcut görev " + Code, projectId: projectId, tenantId: tenantId, now: DateTime.Now);
            task.AssignNumber(1);
            await tasks.InsertAsync(task, autoSave: true);

            var hidden = new TaskItem(privateId, "Gizli görev " + Code, projectId: projectId, isPrivate: true, tenantId: tenantId, now: DateTime.Now);
            hidden.AssignNumber(2);
            await tasks.InsertAsync(hidden, autoSave: true);
        });

        return (tenantId, projectId, userId, userName, taskId, privateId);
    }

    [Fact]
    public async Task Gizli_gorev_ciktiya_girmez_guncelleme_ve_yeni_kayit_kiracida_bildirimsiz_yazilir()
    {
        var seed = await SeedAsync();
        var file = await ExportAsync();
        HasId(file, seed.TaskId).ShouldBeTrue();
        HasId(file, seed.PrivateId).ShouldBeFalse();

        ShouldBeDone(await PostAsync("Import", file), "Yeni: 0 · Güncellenen: 0");

        var newTitle = "Yeni görev " + Code;
        var edited = Edit(file, ws =>
        {
            var row = RowOf(ws, seed.TaskId);
            ws.Cell(row, ColumnOf(ws, "Sprint")).Value = "S1";
            ws.Cell(row, ColumnOf(ws, "Atanan")).Value = seed.UserName;
            ws.Cell(row, ColumnOf(ws, "Öncelik")).Value = "Yüksek";

            var next = NextRow(ws);
            ws.Cell(next, ColumnOf(ws, "Kiracı")).Value = TenantName;
            ws.Cell(next, ColumnOf(ws, "Başlık")).Value = newTitle;
            ws.Cell(next, ColumnOf(ws, "Proje")).Value = "GP-" + Code;
            ws.Cell(next, ColumnOf(ws, "Atanan")).Value = seed.UserName;
            ws.Cell(next, ColumnOf(ws, "Etiketler")).Value = "Acil; Saha";
            ws.Cell(next, ColumnOf(ws, "Önkoşul görevler")).Value = "GRV-1";
            ws.Cell(next, ColumnOf(ws, "Üst görev")).Value = "GRV-1";
        });
        ShouldBeDone(await PostAsync("Import", edited), "Yeni: 1 · Güncellenen: 1");

        Guid createdId = default;
        await InTenantAsync(seed.TenantId, async () =>
        {
            var tasks = GetRequiredService<IRepository<TaskItem, Guid>>();
            var updated = await tasks.GetAsync(seed.TaskId);
            updated.Sprint.ShouldBe("S1");
            updated.AssigneeId.ShouldBe(seed.UserId);
            updated.Priority.ShouldBe(TaskPriority.High);

            var created = await tasks.SingleAsync(t => t.Title == newTitle);
            createdId = created.Id;
            created.TenantId.ShouldBe(seed.TenantId);
            created.ProjectId.ShouldBe(seed.ProjectId);
            created.AssigneeId.ShouldBe(seed.UserId);
            created.ParentTaskId.ShouldBe(seed.TaskId);

            var dependencies = await GetRequiredService<IRepository<TaskDependency, Guid>>().GetListAsync(d => d.TaskId == created.Id);
            dependencies.Select(d => d.PredecessorTaskId).ShouldBe([seed.TaskId]);

            (await GetRequiredService<IRepository<Notification, Guid>>().CountAsync(n => n.UserId == seed.UserId)).ShouldBe(0);
        });

        // Kapsamın dışında aynı servis bildirim üretir: yukarıdaki sıfır, susturmanın kanıtıdır.
        await InTenantAsync(seed.TenantId, () => GetRequiredService<ITaskAppService>().CreateAsync(new CreateUpdateTaskDto
        {
            Title = "Ekrandan atama " + Code,
            ProjectId = seed.ProjectId,
            AssigneeId = seed.UserId,
            StartDate = DateTime.Today
        }));
        await InTenantAsync(seed.TenantId, async () =>
            (await GetRequiredService<IRepository<Notification, Guid>>().CountAsync(n => n.UserId == seed.UserId)).ShouldBeGreaterThan(0));
    }

    [Fact]
    public async Task Gizli_gorev_kimlikle_guncellenemez_ust_gorev_degisemez_iptal_acilmaz()
    {
        var seed = await SeedAsync();
        var file = await ExportAsync();

        var hidden = await PostAsync("Preview", Edit(file, ws =>
        {
            var next = NextRow(ws);
            ws.Cell(next, 1).Value = seed.PrivateId.ToString();
            ws.Cell(next, ColumnOf(ws, "Kiracı")).Value = TenantName;
            ws.Cell(next, ColumnOf(ws, "Başlık")).Value = "Ele geçirme";
        }));
        hidden.GetProperty("ok").GetBoolean().ShouldBeFalse();

        var parent = await PostAsync("Preview", Edit(file, ws =>
            ws.Cell(RowOf(ws, seed.TaskId), ColumnOf(ws, "Üst görev")).Value = "GRV-1"));
        parent.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(parent).ShouldContain("yalnız yeni kayıtta");

        var cancelled = await PostAsync("Preview", Edit(file, ws =>
        {
            var next = NextRow(ws);
            ws.Cell(next, ColumnOf(ws, "Kiracı")).Value = TenantName;
            ws.Cell(next, ColumnOf(ws, "Başlık")).Value = "İptal yeni";
            ws.Cell(next, ColumnOf(ws, "Durum")).Value = "İptal";
        }));
        cancelled.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(cancelled).ShouldContain("yeni görev açılamaz");
    }
}

/// <summary>Özel izni olmayan host kullanıcısı ve kiracı: "tek anahtar" kapalıyken de erişemez.</summary>
public class FullParameterImportAccess_Tests : PlatformWebTestBase
{
    private static readonly string[] Pages = ["/Projects/FullImportModal", "/Tasks/FullImportModal", "/Grants/ProgramImportModal"];

    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        var deny = new DenyPermissionsAuthorizationService(PlatformPermissions.DataTransfer.FullParameters);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    [Fact]
    public async Task Ozel_izni_olmayan_host_kullanicisi_hicbir_uca_erisemez()
    {
        foreach (var page in Pages)
        {
            (await Client.GetAsync($"{page}?handler=Export")).StatusCode.ShouldNotBe(HttpStatusCode.OK, page);
            (await Client.GetAsync($"{page}?handler=Template")).StatusCode.ShouldNotBe(HttpStatusCode.OK, page);
            (await Client.GetAsync(page)).StatusCode.ShouldNotBe(HttpStatusCode.OK, page);
        }

        var workspace = await GetResponseAsStringAsync("/DataTransfer?tab=import");
        workspace.ShouldNotContain("tasks-full");
        workspace.ShouldNotContain("projects-full");
        workspace.ShouldContain("data-transfer-module=\"tasks\"");
    }
}

public class FullParameterImportTenant_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Kiraci_modulleri_gormez_ve_uclari_kapalidir()
    {
        var html = await GetResponseAsStringAsync("/DataTransfer?tab=import");
        html.ShouldContain("data-transfer-module=\"tasks-full\"");
        html.ShouldContain("data-transfer-module=\"projects-full\"");

        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("tam-kiraci-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        await WithTenantClientAsync(tenant.Id, async client =>
        {
            var workspace = await client.GetStringAsync("/DataTransfer?tab=import");
            workspace.ShouldNotContain("tasks-full");
            workspace.ShouldNotContain("projects-full");
            foreach (var page in new[] { "/Projects/FullImportModal", "/Tasks/FullImportModal" })
            {
                (await client.GetAsync($"{page}?handler=Export")).StatusCode.ShouldNotBe(HttpStatusCode.OK, page);
                (await client.GetAsync($"{page}?handler=Template")).StatusCode.ShouldNotBe(HttpStatusCode.OK, page);
            }
        });
    }
}
