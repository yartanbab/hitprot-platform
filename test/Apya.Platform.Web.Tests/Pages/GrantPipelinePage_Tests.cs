using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 2c · Host başvuru pipeline konsolu. Test host'u host bağlamında koşar; kiracı
/// erişiminin kapalı olduğu kod okumasıyla doğrulandı (kiracı bağlamında koşan bir
/// test altyapısı yok) — burada sütun kaynağı, kart yerleşimi ve risk sinyalleri
/// kilitleniyor.
/// </summary>
public class GrantPipelinePage_Tests : PlatformWebTestBase
{
    private readonly IGrantPipelineAppService _pipeline;

    public GrantPipelinePage_Tests()
    {
        _pipeline = GetRequiredService<IGrantPipelineAppService>();
    }

    /// <summary>Açık çağrı + başvuru; <paramref name="withTemplate"/> ise programa şablon bağlar.</summary>
    private async Task<(Guid CallId, Guid ApplicationId, Guid? TemplateId)> SetupAsync(bool withTemplate)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);

        var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var grantRepo = GetRequiredService<IRepository<Grant, Guid>>();
        var templateRepo = GetRequiredService<IRepository<GrantStageTemplate, Guid>>();
        var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();

        var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();
        var grant = await grantRepo.GetAsync(call.GrantId);

        Guid? templateId = null;
        if (withTemplate)
        {
            var template = (await templateRepo.GetListAsync()).FirstOrDefault();
            template.ShouldNotBeNull("tohumlanmış aşama şablonu olmalı");
            templateId = template!.Id;
        }
        grant.StageTemplateId = templateId;
        await grantRepo.UpdateAsync(grant, autoSave: true);

        var application = await appRepo.FirstOrDefaultAsync(a => a.GrantCallId == call.Id);
        if (application == null)
        {
            application = new GrantApplication(Guid.NewGuid(), null, call.Id);
            await appRepo.InsertAsync(application, autoSave: true);
        }

        await uow.CompleteAsync();
        return (call.Id, application.Id, templateId);
    }

    [Fact]
    public async Task Pano_Sayfasi_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/Pipeline");

        html.ShouldContain("apya-pipe-board");
        html.ShouldContain("Boru hattındaki destek");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Pipeline[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Pipeline.js içermeli");
    }

    [Fact]
    public async Task Sablon_Yoksa_Dort_Sabit_Asamaya_Duser()
    {
        var (callId, _, _) = await SetupAsync(withTemplate: false);

        var board = await _pipeline.GetBoardAsync(callId, null);

        board.IsTemplateDriven.ShouldBeFalse();
        board.Columns.Count.ShouldBe(4);
        board.Columns.ShouldAllBe(c => c.Stage != null && c.StepId == null);
    }

    [Fact]
    public async Task Sablon_Varsa_Sutunlar_Sablondan_Gelir()
    {
        var (callId, _, templateId) = await SetupAsync(withTemplate: true);

        var board = await _pipeline.GetBoardAsync(callId, null);

        board.IsTemplateDriven.ShouldBeTrue();
        board.StageTemplateId.ShouldBe(templateId);
        board.Columns.ShouldAllBe(c => c.StepId != null);
        board.Columns.Count.ShouldBeGreaterThan(1);
    }

    [Fact]
    public async Task Tum_Cagrilar_Gorunumunde_Sablon_Sutunu_Kullanilmaz()
    {
        await SetupAsync(withTemplate: true);

        // Farklı şablonlardaki başvuruları tek panoda göstermenin tutarlı yolu yok;
        // "tümü" görünümü daima dört sabit aşamaya düşer.
        var board = await _pipeline.GetBoardAsync(null, null);

        board.IsTemplateDriven.ShouldBeFalse();
        board.Columns.Count.ShouldBe(4);
    }

    [Fact]
    public async Task Adimsiz_Basvuru_Ilk_Sutunda_Baslar()
    {
        var (callId, applicationId, _) = await SetupAsync(withTemplate: true);

        var board = await _pipeline.GetBoardAsync(callId, null);

        board.Columns[0].Cards.ShouldContain(c => c.ApplicationId == applicationId);
    }

    [Fact]
    public async Task Kart_Sablon_Adimina_Tasinir()
    {
        var (callId, applicationId, _) = await SetupAsync(withTemplate: true);
        var board = await _pipeline.GetBoardAsync(callId, null);
        var target = board.Columns[2];

        var moved = await _pipeline.MoveAsync(new MoveGrantApplicationInput
        {
            ApplicationId = applicationId,
            StepId = target.StepId
        });

        moved.Columns.Single(c => c.StepId == target.StepId)
            .Cards.ShouldContain(c => c.ApplicationId == applicationId);
        moved.Columns[0].Cards.ShouldNotContain(c => c.ApplicationId == applicationId);
    }

    [Fact]
    public async Task Baska_Sablonun_Adimina_Tasinamaz()
    {
        var (_, applicationId, _) = await SetupAsync(withTemplate: true);

        await Should.ThrowAsync<BusinessException>(async () =>
            await _pipeline.MoveAsync(new MoveGrantApplicationInput
            {
                ApplicationId = applicationId,
                StepId = Guid.NewGuid() // bu programın şablonunda olmayan adım
            }));
    }

    [Fact]
    public async Task Danisman_Atanir_Ve_Yuk_Sayilir()
    {
        var (callId, applicationId, _) = await SetupAsync(withTemplate: true);
        var userRepo = GetRequiredService<IIdentityUserRepository>();

        Guid userId;
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin())
        {
            userId = (await userRepo.GetListAsync()).First(u => u.IsActive && u.TenantId == null).Id;
        }

        var board = await _pipeline.AssignAsync(new AssignGrantApplicationInput
        {
            ApplicationId = applicationId,
            UserId = userId
        });

        var card = board.Columns.SelectMany(c => c.Cards).Single(c => c.ApplicationId == applicationId);
        card.AssignedUserId.ShouldBe(userId);
        card.AssignedUserName.ShouldNotBeNullOrWhiteSpace();
        board.Consultants.Single(c => c.UserId == userId).AssignedCount.ShouldBe(1);

        // Atama kaldırılabilir.
        var cleared = await _pipeline.AssignAsync(new AssignGrantApplicationInput
        {
            ApplicationId = applicationId,
            UserId = null
        });
        cleared.Columns.SelectMany(c => c.Cards).Single(c => c.ApplicationId == applicationId)
            .AssignedUserId.ShouldBeNull();
    }

    [Fact]
    public async Task Atanmamis_Kart_Risk_Sinyali_Tasir()
    {
        var (callId, applicationId, _) = await SetupAsync(withTemplate: true);
        await _pipeline.AssignAsync(new AssignGrantApplicationInput { ApplicationId = applicationId, UserId = null });

        var board = await _pipeline.GetBoardAsync(callId, null);
        var card = board.Columns.SelectMany(c => c.Cards).Single(c => c.ApplicationId == applicationId);

        card.Risks.ShouldContain(r => r.Kind == GrantPipelineRisk.Unassigned);
    }

    [Fact]
    public async Task Danisman_Suzgeci_Kartlari_Daraltir()
    {
        var (callId, applicationId, _) = await SetupAsync(withTemplate: true);
        await _pipeline.AssignAsync(new AssignGrantApplicationInput { ApplicationId = applicationId, UserId = null });

        var filtered = await _pipeline.GetBoardAsync(callId, Guid.NewGuid());

        filtered.Columns.SelectMany(c => c.Cards).ShouldBeEmpty(
            "başka bir danışmana atanmış kart yok, süzgeç hepsini elemeli");
    }

    [Fact]
    public async Task Ozet_Serit_Sayilari_Kart_Sayisiyla_Tutarli()
    {
        var (callId, _, _) = await SetupAsync(withTemplate: true);

        var board = await _pipeline.GetBoardAsync(callId, null);
        var cards = board.Columns.SelectMany(c => c.Cards).ToList();

        board.RiskyDayThreshold.ShouldBe(GrantPipelineAppService.RiskyDayThreshold);
        board.ReadyForProjectCount.ShouldBe(board.Columns[^1].Cards.Count);
        board.WaitingDocumentApplicationCount.ShouldBe(cards.Count(c => c.MissingDocumentCount > 0));
    }
}
