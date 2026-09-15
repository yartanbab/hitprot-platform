using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Users;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 20a/20b · Çağrı yayınlanınca havuz taraması ve tek tık ilişkilendirme: uyan fikir puanı ve gerekçesiyle
/// listelenir, bağlanan fikir talep olur (İnceleniyor), çağrı firmanın takibine girer, firmaya bildirim gider.
///
/// <para>Koleksiyondaki diğer testler de açık çağrı ve fikir bıraktığı için program metni bu teste özgü
/// kelimelerle (zeytinyağı, rekolte) kurulur ve her test kendi kayıtlarına bakar.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantIdeaLink_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantIdeaPoolAppService _pool;
    private readonly IGrantInterestAppService _interests;
    private readonly IGrantRequestAppService _requests;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantInterest, Guid> _interestRepository;
    private readonly IRepository<GrantBookmark, Guid> _bookmarkRepository;
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly ICurrentUser _currentUser;

    public GrantIdeaLink_Tests()
    {
        _pool = GetRequiredService<IGrantIdeaPoolAppService>();
        _interests = GetRequiredService<IGrantInterestAppService>();
        _requests = GetRequiredService<IGrantRequestAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _interestRepository = GetRequiredService<IRepository<GrantInterest, Guid>>();
        _bookmarkRepository = GetRequiredService<IRepository<GrantBookmark, Guid>>();
        _notificationRepository = GetRequiredService<IRepository<Notification, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _currentUser = GetRequiredService<ICurrentUser>();
    }

    private async Task<GrantCall> CreateOliveCallAsync(GrantCallStatus status = GrantCallStatus.Acik)
    {
        var grant = new Grant(Guid.NewGuid(), "Zeytinyağı Kooperatifleri Programı " + Guid.NewGuid().ToString("N")[..4], "Kalkınma Ajansı", 2_000_000m, 0)
        {
            Objective = "Zeytinyağı üreticisi kooperatiflerin rekolte sonrası pazarlama kapasitesini güçlendirmek.",
            Priorities = "Soğuk sıkım zeytinyağı\nRekolte kayıplarının azaltılması\nKooperatif markalaşması\nİhracat pazarlaması"
        };
        await _grantRepository.InsertAsync(grant, autoSave: true);
        return await _callRepository.InsertAsync(new GrantCall(Guid.NewGuid(), grant.Id, "2026/2", status), autoSave: true);
    }

    /// <summary>Kullanıcılı firma: bildirim ancak etkin kullanıcıya düşer.</summary>
    private async Task<(Guid TenantId, string Name)> CreateFirmAsync(string prefix)
    {
        var name = prefix + " " + Guid.NewGuid().ToString("N")[..6];
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync(name);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        using (_currentTenant.Change(tenant.Id))
        {
            var suffix = Guid.NewGuid().ToString("N")[..6];
            (await GetRequiredService<IdentityUserManager>()
                .CreateAsync(new IdentityUser(Guid.NewGuid(), "firma-" + suffix, $"firma-{suffix}@apya.test", tenant.Id))).Succeeded.ShouldBeTrue();
        }
        return (tenant.Id, name);
    }

    private async Task<Guid> ShareAsync(Guid tenantId, string note, string problem, decimal? budget = null)
    {
        using (_currentTenant.Change(tenantId))
        {
            return (await _interests.ShareIdeaAsync(new ShareGrantIdeaInput { Note = note, ProblemStatement = problem, EstimatedBudget = budget })).Id;
        }
    }

    private Task<Guid> ShareOliveIdeaAsync(Guid tenantId) => ShareAsync(tenantId,
        "Soğuk sıkım zeytinyağımızı kooperatif markasıyla ihracat pazarlarına açmak",
        "Rekolte sonrası zeytinyağı depoda bekliyor, pazarlama kapasitemiz yok",
        budget: 1_200_000m);

    [Fact]
    public async Task Cagriya_uyan_fikir_puani_ve_gerekcesiyle_listelenir()
    {
        var call = await CreateOliveCallAsync();
        var olive = await CreateFirmAsync("Ayvalık Zeytin Kooperatifi");
        var steel = await CreateFirmAsync("Demir Çelik");
        var oliveIdea = await ShareOliveIdeaAsync(olive.TenantId);
        var steelIdea = await ShareAsync(steel.TenantId, "Haddehane hattında enerji verimliliği", "Fırın ısısı boşa gidiyor", 9_000_000m);

        var matches = await _pool.GetCallMatchesAsync(call.Id);

        matches.IsOpen.ShouldBeTrue();
        matches.Threshold.ShouldBe(GrantIdeaMatcher.Threshold);
        var good = matches.Items.Single(i => i.Id == oliveIdea);
        good.IsMatch.ShouldBeTrue();
        good.FirmName.ShouldBe(olive.Name);
        // Program etiketsiz → firma skoru ölçülemez, puan metin payıdır.
        good.FirmScore.ShouldBeNull();
        good.Score.ShouldBe(good.TextScore!.Value);
        good.MatchedTerms.ShouldNotBeEmpty();
        good.BudgetFits.ShouldBe(true);

        var bad = matches.Items.Single(i => i.Id == steelIdea);
        bad.IsMatch.ShouldBeFalse();
        bad.BudgetFits.ShouldBe(false);

        // Puana göre azalan.
        matches.Items.IndexOf(good).ShouldBeLessThan(matches.Items.IndexOf(bad));
        matches.MatchCount.ShouldBe(matches.Items.Count(i => i.IsMatch));
    }

    [Fact]
    public async Task Iliskilendirilen_fikir_incelemede_talep_olur_takibe_girer_firmaya_bildirim_gider()
    {
        var call = await CreateOliveCallAsync();
        var firm = await CreateFirmAsync("Edremit Zeytin Kooperatifi");
        var idea = await ShareOliveIdeaAsync(firm.TenantId);
        int notifiedBefore;
        using (_currentTenant.Change(firm.TenantId))
        {
            notifiedBefore = (await _notificationRepository.GetListAsync(n => n.Type == NotificationType.GrantIdeaLinked)).Count;
        }

        var result = await _pool.LinkAsync(new LinkGrantIdeasInput { GrantCallId = call.Id, InterestIds = { idea } });

        result.LinkedCount.ShouldBe(1);
        result.SkippedCount.ShouldBe(0);

        using (_currentTenant.Change(firm.TenantId))
        {
            var linked = await _interestRepository.GetAsync(idea);
            linked.GrantCallId.ShouldBe(call.Id);
            linked.Status.ShouldBe(GrantInterestStatus.Inceleniyor);
            linked.AssignedUserId.ShouldBe(_currentUser.Id);

            (await _bookmarkRepository.GetListAsync(b => b.GrantCallId == call.Id)).ShouldHaveSingleItem();

            var notification = (await _notificationRepository.GetListAsync(n => n.Type == NotificationType.GrantIdeaLinked))
                .OrderByDescending(n => n.CreationTime).First();
            (await _notificationRepository.GetListAsync(n => n.Type == NotificationType.GrantIdeaLinked)).Count.ShouldBe(notifiedBefore + 1);
            notification.EntityId.ShouldBe(call.Id);
            notification.Body.ShouldContain("Soğuk sıkım zeytinyağımızı");
            notification.Body.ShouldContain("%");
        }

        // Artık talep: Talepler'de yanıtlanmış (danışman bağladı), havuzda ve tarama listesinde değil.
        var inbox = await _requests.GetInboxAsync(new GetGrantRequestInboxInput { GrantCallId = call.Id });
        inbox.Items.Single(r => r.Id == idea).Response.ShouldBe(GrantResponseState.Answered);
        (await _pool.GetListAsync(new GetGrantIdeaPoolInput())).Items.ShouldNotContain(i => i.Id == idea);
        (await _pool.GetCallMatchesAsync(call.Id)).Items.ShouldNotContain(i => i.Id == idea);
    }

    [Fact]
    public async Task Suren_talebi_olan_ya_da_artik_havuzda_olmayan_fikir_atlanir()
    {
        var call = await CreateOliveCallAsync();
        var busyFirm = await CreateFirmAsync("Gömeç Zeytin");
        var withdrawnFirm = await CreateFirmAsync("Burhaniye Zeytin");
        var busyIdea = await ShareOliveIdeaAsync(busyFirm.TenantId);
        var withdrawnIdea = await ShareOliveIdeaAsync(withdrawnFirm.TenantId);

        using (_currentTenant.Change(busyFirm.TenantId))
        {
            await _interests.ExpressAsync(new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Doğrudan ilgi", ProblemStatement = "Sorun" });
        }
        using (_currentTenant.Change(withdrawnFirm.TenantId))
        {
            await _interests.WithdrawAsync(withdrawnIdea);
        }

        // Süren talebi olan firmanın fikri taramada da görünmez (bağlanamaz).
        (await _pool.GetCallMatchesAsync(call.Id)).Items.ShouldNotContain(i => i.Id == busyIdea);

        var result = await _pool.LinkAsync(new LinkGrantIdeasInput
        {
            GrantCallId = call.Id, InterestIds = { busyIdea, withdrawnIdea, Guid.NewGuid() }
        });

        result.LinkedCount.ShouldBe(0);
        result.SkippedCount.ShouldBe(3);
        using (_currentTenant.Change(busyFirm.TenantId))
        {
            (await _interestRepository.GetAsync(busyIdea)).IsPoolIdea.ShouldBeTrue();
        }
    }

    [Fact]
    public async Task Yayinda_olmayan_cagriya_baglanmaz()
    {
        var draft = await CreateOliveCallAsync(GrantCallStatus.Taslak);
        var firm = await CreateFirmAsync("Havran Zeytin");
        var idea = await ShareOliveIdeaAsync(firm.TenantId);

        (await _pool.GetCallMatchesAsync(draft.Id)).IsOpen.ShouldBeFalse();

        (await Should.ThrowAsync<BusinessException>(() =>
                _pool.LinkAsync(new LinkGrantIdeasInput { GrantCallId = draft.Id, InterestIds = { idea } })))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantIdeaCallNotOpen);
    }

    [Fact]
    public async Task Havuz_listesi_en_guclu_acik_cagri_eslesmesini_ve_bekleyen_sayisini_verir()
    {
        var call = await CreateOliveCallAsync();
        var firm = await CreateFirmAsync("Küçükkuyu Zeytin");
        var idea = await ShareOliveIdeaAsync(firm.TenantId);
        var unmatched = await ShareAsync(firm.TenantId, "Qwxyz plazma kaynağı", "Vbnmk kalibrasyonu");

        var pool = await _pool.GetListAsync(new GetGrantIdeaPoolInput { Sort = GrantIdeaPoolSort.Match });

        var row = pool.Items.Single(i => i.Id == idea);
        row.BestMatch.ShouldNotBeNull();
        row.BestMatch!.Score.ShouldBeGreaterThanOrEqualTo(GrantIdeaMatcher.Threshold);
        row.BestMatch.GrantCallId.ShouldBe(call.Id);
        pool.Items.Single(i => i.Id == unmatched).BestMatch.ShouldBeNull();
        pool.AwaitingMatchCount.ShouldBeGreaterThanOrEqualTo(1);

        // Eşleşme gücü sırası: eşleşen önce.
        pool.Items.FindIndex(i => i.Id == idea).ShouldBeLessThan(pool.Items.FindIndex(i => i.Id == unmatched));
    }
}
