using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Documents;
using Apya.Platform.Expenses;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
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
/// DOC-12 · Belge izni OLMAYAN kullanıcıya harcama satırında belge bağlantısı verilmez.
///
/// <para>Bağlantı belge merkezinin indirme ucuna gider ve o uç belge iznini ister. Bütçeyi
/// görebilen ama belge izni olmayan kullanıcıya bağlantı basılsaydı tıkladığında yasak
/// sayfasına çıkardı. "Belge var" bilgisi ise bütçe ekranının kendi verisidir, kalır.</para>
///
/// <para>Test barındırıcısı normalde her izne "evet" der; bu sınıf onu TEK izni reddedecek
/// şekilde kurar (bkz. <see cref="DenyPermissionsAuthorizationService"/>).</para>
/// </summary>
public class ProjectExpenseDocumentPermission_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var denyDocuments = new DenyPermissionsAuthorizationService(PlatformPermissions.Documents.Default);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(denyDocuments));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(denyDocuments));
    }

    private async Task<(Guid ProjectId, Guid ExpenseId)> SeedAsync()
    {
        var projectId = Guid.NewGuid();
        var expenseId = Guid.NewGuid();
        var code = "DOC12-" + Guid.NewGuid().ToString("N")[..6];

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<Project, Guid>>()
                .InsertAsync(new Project(projectId, null, null, "Belge izni " + code, code, "test"), autoSave: true);

            var cashId = Guid.NewGuid();
            await GetRequiredService<IRepository<CashAccount, Guid>>()
                .InsertAsync(new CashAccount(cashId, "Kasa " + code), autoSave: true);

            await GetRequiredService<IRepository<Expense, Guid>>().InsertAsync(
                new Expense(expenseId, "Belgeli gider", 1000m, cashId, DateTime.Today, ExpenseCategory.Service, "TRY", projectId: projectId),
                autoSave: true);

            var folderId = Guid.NewGuid();
            await GetRequiredService<IRepository<Document, Guid>>()
                .InsertAsync(new Document(folderId, null, "Klasör " + code, ""), autoSave: true);

            var file = new DocumentFile(Guid.NewGuid(), null, folderId, "Fatura.pdf", projectId: projectId);
            file.RegisterVersion(Guid.NewGuid(), 1);
            await GetRequiredService<IRepository<DocumentFile, Guid>>().InsertAsync(file, autoSave: true);

            await GetRequiredService<IRepository<DocumentExpenseMatch, Guid>>().InsertAsync(
                new DocumentExpenseMatch(Guid.NewGuid(), null, file.Id, expenseId, 100, MatchSource.Manual), autoSave: true);

            await uow.CompleteAsync();
        }

        return (projectId, expenseId);
    }

    [Fact]
    public async Task Belge_izni_olmayana_belge_kimligi_verilmez_ama_belge_durumu_kalir()
    {
        var (projectId, expenseId) = await SeedAsync();

        var panel = await GetRequiredService<IProjectBudgetAppService>().GetExpensePanelAsync(projectId);

        var row = panel.Rows.Single(r => r.Id == expenseId);
        row.HasDocument.ShouldBeTrue();
        row.Documents.ShouldBeEmpty();
        panel.UndocumentedCount.ShouldBe(0);
    }

    [Fact]
    public async Task Belge_izni_olmayana_proje_konsolunda_belge_baglantisi_basilmaz()
    {
        var (projectId, _) = await SeedAsync();

        var html = await GetResponseAsStringAsync($"/Projects/ProjectDetails/{projectId}");

        html.ShouldContain("fin-expense-table", Case.Sensitive, "harcama tablosu basılmalı — reddedilen yalnız belge izni");
        html.ShouldNotContain("data-expense-doc=", Case.Sensitive);
        html.ShouldNotContain("handler=DownloadAttachment", Case.Sensitive);
    }
}
