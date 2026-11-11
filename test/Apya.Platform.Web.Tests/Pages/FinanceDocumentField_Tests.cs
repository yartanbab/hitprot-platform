using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Documents;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Gider/gelir pencerelerinin "Belge ekle" alanı (kullanıcı isteği, 2026-11-11): fatura, fiş, dekont
/// kaydı açarken eklenir; Belge Merkezi'ne düşer ve kayda bağlanır.
/// </summary>
public class FinanceDocumentField_Tests : PlatformWebTestBase
{
    private const string FileField = "name=\"DocumentFiles\"";

    private async Task<Guid> CashAccountAsync()
    {
        var id = Guid.NewGuid();
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IRepository<CashAccount, Guid>>()
            .InsertAsync(new CashAccount(id, "Belge kasası " + id.ToString("N")[..6]), autoSave: true);
        await uow.CompleteAsync();
        return id;
    }

    private async Task<T> InNewUowAsync<T>(Func<Task<T>> read)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var result = await read();
        await uow.CompleteAsync();
        return result;
    }

    /// <summary>
    /// Alanları ve dosyayı tarayıcı gibi multipart gönderir. Form adresi sorgusuzdur: düzenleme
    /// penceresi kaydın kimliğini gizli alandan okur. Pencere formu `action`'ı açık yazdığı için
    /// kendi jetonunu basmaz (tarayıcıda ABP jetonu çerezden başlığa koyar); jeton, jeton basan
    /// içe aktarma penceresinden alınır.
    /// </summary>
    private async Task<HttpResponseMessage> PostAsync(
        string url, (string Name, string Value)[] fields, (string Name, byte[] Content)? file)
    {
        (await GetResponseAsStringAsync(url)).ShouldContain(FileField, Case.Sensitive, url);

        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync("/Expenses/ImportModal"));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']")
            ?.GetAttributeValue("value", "") ?? "";
        token.ShouldNotBeEmpty("antiforgery jetonu alınamadı");

        using var content = new MultipartFormDataContent();
        content.Add(new StringContent(token), "__RequestVerificationToken");
        foreach (var (name, value) in fields)
        {
            content.Add(new StringContent(value), name);
        }

        if (file.HasValue)
        {
            var part = new ByteArrayContent(file.Value.Content);
            part.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            content.Add(part, "DocumentFiles", file.Value.Name);
        }

        using var request = new HttpRequestMessage(HttpMethod.Post, url.Split('?')[0]) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        request.Headers.Add("RequestVerificationToken", token);
        return await Client.SendAsync(request);
    }

    private static (string, string)[] ExpenseFields(string title, Guid cashAccountId) => new[]
    {
        ("Expense.Title", title),
        ("Expense.Amount", "250"),
        ("Expense.ExpenseDate", "2026-11-11"),
        ("Expense.Currency", "TRY"),
        ("Expense.Category", nameof(ExpenseCategory.Other)),
        ("Expense.CashAccountId", cashAccountId.ToString()),
    };

    [Fact]
    public async Task Gider_ve_gelir_pencerelerinde_belge_alani_var_ve_form_dosya_gonderir()
    {
        foreach (var url in new[] { "/Expenses/CreateModal", "/Incomes/CreateModal" })
        {
            var html = await GetResponseAsStringAsync(url);
            html.ShouldContain(FileField, Case.Sensitive, url);
            html.ShouldContain("enctype=\"multipart/form-data\"", Case.Sensitive, url);
        }
    }

    [Fact]
    public async Task Dosyali_gider_kaydedilir_belge_baglanir_ve_duzenlemede_listelenir()
    {
        var accountId = await CashAccountAsync();
        var title = "Belgeli gider " + Guid.NewGuid().ToString("N")[..6];
        var bytes = Encoding.UTF8.GetBytes("%PDF-1.4 fatura");

        var response = await PostAsync(
            "/Expenses/CreateModal", ExpenseFields(title, accountId), ("Kırtasiye faturası.pdf", bytes));
        response.IsSuccessStatusCode.ShouldBeTrue(response.StatusCode + " " + await response.Content.ReadAsStringAsync());

        var expense = await InNewUowAsync(async () =>
            (await GetRequiredService<IRepository<Expense, Guid>>().GetListAsync(e => e.Title == title)).Single());
        var linked = (await InNewUowAsync(() =>
            GetRequiredService<IFinanceDocumentAppService>().GetExpenseDocumentsAsync(expense.Id))).ShouldHaveSingleItem();
        linked.Name.ShouldBe("Kırtasiye faturası.pdf");

        // Yüklenen içerik Belge Merkezi'nin indirme ucundan aynen geri gelir.
        var download = await GetResponseAsync(linked.DownloadUrl);
        (await download.Content.ReadAsByteArrayAsync()).ShouldBe(bytes);

        // Razor ASCII dışı harfleri varlık olarak basabilir; metin çözülerek aranır.
        var edit = await GetResponseAsStringAsync("/Expenses/EditModal?id=" + expense.Id);
        WebUtility.HtmlDecode(edit).ShouldContain("Kırtasiye faturası.pdf");
        edit.ShouldContain(FileField, Case.Sensitive);
    }

    [Fact]
    public async Task Reddedilen_dosya_gideri_yarim_birakmaz()
    {
        var accountId = await CashAccountAsync();
        var title = "Reddedilen gider " + Guid.NewGuid().ToString("N")[..6];

        var response = await PostAsync(
            "/Expenses/CreateModal", ExpenseFields(title, accountId), ("kurulum.exe", new byte[] { 1, 2, 3 }));

        response.IsSuccessStatusCode.ShouldBeFalse();
        // Jeton reddi de "başarısız" olurdu; ret sebebinin dosya olduğu koddan anlaşılır.
        (await response.Content.ReadAsStringAsync()).ShouldContain(PlatformDomainErrorCodes.FileUnsupportedExtension);
        (await InNewUowAsync(() =>
            GetRequiredService<IRepository<Expense, Guid>>().CountAsync(e => e.Title == title))).ShouldBe(0);
    }

    [Fact]
    public async Task Gelir_duzenlenirken_eklenen_dekont_gelire_baglanir()
    {
        var accountId = await CashAccountAsync();
        var incomeId = Guid.NewGuid();
        await InNewUowAsync(async () => await GetRequiredService<IRepository<IncomeEntry, Guid>>().InsertAsync(
            new IncomeEntry(incomeId, "Dekontlu gelir", 400m, new DateTime(2026, 11, 11), cashAccountId: accountId),
            autoSave: true));

        var response = await PostAsync("/Incomes/EditModal?id=" + incomeId, new[]
        {
            ("IncomeId", incomeId.ToString()),
            ("Income.Title", "Dekontlu gelir"),
            ("Income.Amount", "400"),
            ("Income.IncomeDate", "2026-11-11"),
            ("Income.Currency", "TRY"),
            ("Income.Category", nameof(IncomeCategory.Other)),
            ("Income.CashAccountId", accountId.ToString()),
        }, ("Dekont.pdf", Encoding.UTF8.GetBytes("%PDF-1.4 dekont")));
        response.StatusCode.ShouldBe(HttpStatusCode.NoContent, await response.Content.ReadAsStringAsync());

        (await InNewUowAsync(() => GetRequiredService<IFinanceDocumentAppService>().GetIncomeDocumentsAsync(incomeId)))
            .ShouldHaveSingleItem().Name.ShouldBe("Dekont.pdf");
    }
}

/// <summary>Belge yükleme izni (ya da Belgeler paketi) olmayan kullanıcıya alan basılmaz.</summary>
public class FinanceDocumentFieldDenied_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var deny = new DenyPermissionsAuthorizationService(PlatformPermissions.Documents.Edit);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    [Fact]
    public async Task Belge_yukleme_izni_yoksa_alan_gorunmez_pencere_acilir()
    {
        foreach (var (url, title) in new[] { ("/Expenses/CreateModal", "Yeni Gider"), ("/Incomes/CreateModal", "Yeni Gelir") })
        {
            var html = await GetResponseAsStringAsync(url);
            html.ShouldContain(title, Case.Sensitive, url);
            html.ShouldNotContain("name=\"DocumentFiles\"", Case.Sensitive, url);
        }
    }
}
