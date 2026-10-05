using System;
using System.Threading.Tasks;
using Apya.Platform.Incomes;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// FIN-06 · Tahsilat penceresindeki gelir kaydı listesi.
///
/// <para>Aynı gelir iki dilime bağlanamaz (sunucu reddeder). Kullanıcıya seçtirip sonra
/// hata vermek yerine, başka bir dilimin tahsilatına bağlı gelir listede hiç sunulmaz —
/// ama dilimin KENDİ bağı listede kalmalı, yoksa pencere açılınca seçili gelir kaybolur
/// ve kaydetmek bağı sessizce koparırdı.</para>
/// </summary>
public class CollectionModalIncomeList_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Baska_dilime_bagli_gelir_listede_yok_kendi_bagi_var()
    {
        var projectId = Guid.NewGuid();
        Guid ownIncome, otherIncome, freeIncome;

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            GetRequiredService<ICurrentTenant>().Id.ShouldBeNull("test host bağlamında koşmalı");

            var code = "CM-" + Guid.NewGuid().ToString("N")[..6];
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, null, null, "Tahsilat penceresi " + code, code, ""), autoSave: true);

            var incomeRepo = GetRequiredService<IRepository<IncomeEntry, Guid>>();
            async Task<Guid> IncomeAsync(string title)
            {
                var income = new IncomeEntry(Guid.NewGuid(), title, 100_000m, new DateTime(2026, 9, 1), projectId: projectId);
                await incomeRepo.InsertAsync(income, autoSave: true);
                return income.Id;
            }

            // ASCII başlıklar: düz string Razor'da kodlanır, Türkçe karakter aranamaz.
            ownIncome = await IncomeAsync("OWN-LINK");
            otherIncome = await IncomeAsync("OTHER-LINK");
            freeIncome = await IncomeAsync("FREE-INCOME");

            await uow.CompleteAsync();
        }

        var budget = GetRequiredService<IProjectBudgetAppService>();
        var mine = await budget.CreateTrancheAsync(projectId, new CreateUpdateTrancheDto { PlannedAmount = 100_000m });
        var theirs = await budget.CreateTrancheAsync(projectId, new CreateUpdateTrancheDto { PlannedAmount = 100_000m });

        await budget.RegisterCollectionAsync(mine.Id, new RegisterCollectionDto
        {
            ReceivedAmount = 100_000m, ReceivedDate = new DateTime(2026, 9, 2), IncomeEntryId = ownIncome,
        });
        await budget.RegisterCollectionAsync(theirs.Id, new RegisterCollectionDto
        {
            ReceivedAmount = 100_000m, ReceivedDate = new DateTime(2026, 9, 2), IncomeEntryId = otherIncome,
        });

        var html = await GetResponseAsStringAsync($"/Finance/CollectionModal?projectId={projectId}&id={mine.Id}");

        html.ShouldContain("FREE-INCOME", Case.Sensitive);
        html.ShouldContain("OWN-LINK", Case.Sensitive, "dilimin kendi bağı listede kalmalı");
        html.ShouldNotContain("OTHER-LINK", Case.Sensitive, "başka dilime bağlı gelir sunulmamalı");
        html.ShouldContain(ownIncome.ToString());
        html.ShouldNotContain(otherIncome.ToString());
        _ = freeIncome;
    }
}
