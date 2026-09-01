using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 2d · Başvuru detayı (danışman görünümü). Test host'u host bağlamında koşar;
/// servis zaten host-only.
/// </summary>
public class GrantDetailHostPage_Tests : PlatformWebTestBase
{
    private readonly IGrantApplicationDetailAppService _detail;

    public GrantDetailHostPage_Tests()
    {
        _detail = GetRequiredService<IGrantApplicationDetailAppService>();
    }

    private async Task<Guid> SetupAsync(bool withTemplate = true)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);

        var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var grantRepo = GetRequiredService<IRepository<Grant, Guid>>();
        var templateRepo = GetRequiredService<IRepository<GrantStageTemplate, Guid>>();
        var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();

        var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();
        var grant = await grantRepo.GetAsync(call.GrantId);
        grant.StageTemplateId = withTemplate
            ? (await templateRepo.GetListAsync()).First().Id
            : null;
        await grantRepo.UpdateAsync(grant, autoSave: true);

        var application = await appRepo.FirstOrDefaultAsync(a => a.GrantCallId == call.Id);
        if (application == null)
        {
            application = new GrantApplication(Guid.NewGuid(), null, call.Id);
            await appRepo.InsertAsync(application, autoSave: true);
        }

        await uow.CompleteAsync();
        return application.Id;
    }

    [Fact]
    public async Task Detay_Sayfasi_Render_Oluyor()
    {
        var id = await SetupAsync();

        var html = await GetResponseAsStringAsync($"/Grants/DetailHost?id={id}");

        html.ShouldContain("apya-dh-layout");
        html.ShouldContain("Danışmanlık kaydı");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"DetailHost[^""]*\.js")
            .ShouldBeTrue("sayfa demeti DetailHost.js içermeli");
    }

    [Fact]
    public async Task Id_Verilmezse_Panoya_Yonlendirir()
    {
        var response = await Client.GetAsync("/Grants/DetailHost");

        ((int)response.StatusCode).ShouldBe(302);
        response.Headers.Location!.ToString().ShouldContain("/Grants/Pipeline");
    }

    [Fact]
    public async Task Kunye_Ve_Adimlar_Doner()
    {
        var id = await SetupAsync();

        var dto = await _detail.GetAsync(id);

        dto.Reference.ShouldStartWith("GA-");
        dto.GrantName.ShouldNotBeNullOrWhiteSpace();
        dto.Steps.ShouldNotBeEmpty();
        dto.Steps.Count(s => s.IsCurrent).ShouldBe(1, "her zaman tek bir güncel adım olmalı");
        dto.Sections.ShouldContain(s => s.Key == GrantApplicationDetailAppService.SectionBudget);
    }

    [Fact]
    public async Task Asama_Ilerletilir_Ve_Akisa_Yazilir()
    {
        var id = await SetupAsync();
        var before = await _detail.GetAsync(id);
        var currentIndex = before.Steps.FindIndex(s => s.IsCurrent);

        var after = await _detail.AdvanceToNextStepAsync(id);

        after.Steps.FindIndex(s => s.IsCurrent).ShouldBe(currentIndex + 1);
        after.Activities.ShouldContain(a => a.Channel == GrantDetailActivityChannel.Stage
                                            && a.Kind == GrantActivityKind.StageMoved);
    }

    [Fact]
    public async Task Son_Adimdan_Sonra_Ilerletilemez()
    {
        var id = await SetupAsync();
        var dto = await _detail.GetAsync(id);

        // Son adıma kadar ilerlet.
        for (var i = dto.Steps.FindIndex(s => s.IsCurrent); i < dto.Steps.Count - 1; i++)
        {
            dto = await _detail.AdvanceToNextStepAsync(id);
        }

        await Should.ThrowAsync<BusinessException>(async () => await _detail.AdvanceToNextStepAsync(id));
    }

    [Fact]
    public async Task Sablonsuz_Programda_Ilerletme_Reddedilir()
    {
        var id = await SetupAsync(withTemplate: false);

        await Should.ThrowAsync<BusinessException>(async () => await _detail.AdvanceToNextStepAsync(id));
    }

    [Fact]
    public async Task Danismanlik_Suresi_Toplanir()
    {
        var id = await SetupAsync();

        await _detail.AddConsultingLogAsync(new AddGrantConsultingLogInput
        {
            ApplicationId = id, Hours = 2.5m, Note = "Kick-off görüşmesi"
        });
        var dto = await _detail.AddConsultingLogAsync(new AddGrantConsultingLogInput
        {
            ApplicationId = id, Hours = 1.25m
        });

        dto.TotalHours.ShouldBe(3.75m);
        dto.ConsultingLogs.Count.ShouldBe(2);
        dto.ConsultingLogs.ShouldContain(x => x.Note == "Kick-off görüşmesi");
    }

    [Fact]
    public async Task Gecersiz_Sure_Reddedilir()
    {
        var id = await SetupAsync();

        // Tek kayıtta bir günden fazla süre veri hatasıdır. Sınır DTO'daki [Range] ile
        // domain guard'ından ÖNCE yakalanır; entity guard doğrudan kullanımı korur.
        await Should.ThrowAsync<Volo.Abp.Validation.AbpValidationException>(async () =>
            await _detail.AddConsultingLogAsync(new AddGrantConsultingLogInput
            {
                ApplicationId = id, Hours = 25m
            }));
    }

    [Fact]
    public async Task Basari_Primi_Tahmini_Geliri_Uretir()
    {
        var id = await SetupAsync();
        var wizard = GetRequiredService<IGrantApplicationWizardAppService>();

        // Bütçe girilmemişse gelir hesaplanamaz.
        var withoutBudget = await _detail.SetSuccessFeeAsync(new SetGrantSuccessFeeInput
        {
            ApplicationId = id, Percent = 4m
        });
        withoutBudget.SuccessFeePercent.ShouldBe(4m);

        // Bütçe girilince talep edilen destek üzerinden hesaplanır.
        var costItemRepo = GetRequiredService<IRepository<GrantEligibleCostItem, Guid>>();
        var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();
        var grantRepo = GetRequiredService<IRepository<Grant, Guid>>();
        var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var application = await appRepo.GetAsync(id);
            var call = await callRepo.GetAsync(application.GrantCallId);
            var grant = await grantRepo.GetAsync(call.GrantId);
            grant.SupportRatePercent = 50;
            grant.MaxAmount = 10_000_000m;
            await grantRepo.UpdateAsync(grant, autoSave: true);

            if ((await costItemRepo.GetListAsync(c => c.GrantId == grant.Id))
                .All(c => c.Kind != GrantCostItemKind.Personel))
            {
                await costItemRepo.InsertAsync(
                    new GrantEligibleCostItem(Guid.NewGuid(), grant.Id, GrantCostItemKind.Personel, null),
                    autoSave: true);
            }
            await uow.CompleteAsync();
        }

        await wizard.SaveBudgetLineAsync(new SaveWizardBudgetLineInput
        {
            ApplicationId = id, Kind = GrantCostItemKind.Personel, Amount = 1_000_000m
        });

        var dto = await _detail.GetAsync(id);
        // 1.000.000 × %50 destek = 500.000 → %4 prim = 20.000
        dto.EstimatedRevenue.ShouldBe(20_000m);
    }

    [Fact]
    public async Task Akis_Uc_Kaynagi_Birlestirir()
    {
        var id = await SetupAsync();
        var wizard = GetRequiredService<IGrantApplicationWizardAppService>();
        var documents = GetRequiredService<IGrantApplicationDocumentAppService>();

        await wizard.SendMessageAsync(new SendWizardMessageInput
        {
            ApplicationId = id, Body = "Bütçe kalemlerini bugün kapatalım."
        });

        var console = await documents.GetAsync(id);
        if (console.Documents.Count > 0)
        {
            await documents.RegisterVersionAsync(new RegisterGrantDocumentVersionInput
            {
                DocumentId = console.Documents[0].Id,
                StoredFileName = Guid.NewGuid() + ".pdf",
                OriginalFileName = "form.pdf",
                SizeBytes = 512
            });
        }

        await _detail.AdvanceToNextStepAsync(id);

        var dto = await _detail.GetAsync(id);
        dto.Activities.ShouldContain(a => a.Channel == GrantDetailActivityChannel.Message);
        dto.Activities.ShouldContain(a => a.Channel == GrantDetailActivityChannel.Stage);
        if (console.Documents.Count > 0)
        {
            dto.Activities.ShouldContain(a => a.Channel == GrantDetailActivityChannel.Document
                                              && a.VersionNo == 1);
        }

        // En yeni hareket başta döner.
        dto.Activities.Select(a => a.At).ShouldBe(dto.Activities.Select(a => a.At).OrderByDescending(x => x));
    }

    [Fact]
    public async Task Gonderim_Bolumu_Zorunlu_Evrak_Tamamlanana_Kadar_Kilitli()
    {
        var id = await SetupAsync();
        var documents = GetRequiredService<IGrantApplicationDocumentAppService>();
        var console = await documents.GetAsync(id);

        var dto = await _detail.GetAsync(id);
        var submit = dto.Sections.Single(s => s.Key == GrantApplicationDetailAppService.SectionSubmit);

        if (console.Documents.Any(d => d.Obligation == GrantDocumentObligation.Zorunlu
                                       && d.Status != GrantDocumentStatus.Onaylandi))
        {
            submit.State.ShouldBe(GrantDetailSectionState.Locked);
        }
    }
}
