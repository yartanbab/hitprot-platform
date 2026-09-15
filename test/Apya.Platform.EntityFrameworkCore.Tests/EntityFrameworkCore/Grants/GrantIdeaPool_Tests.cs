using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 19a · Fikir Havuzu: çağrısı boş ilgi kaydı. Havuz fikri talep DEĞİLDİR — Talepler'e, "İlgi
/// Taleplerim"e ve çağrı başına tek talep kuralına girmez; başvuru ve görüşme çağrı ister.
///
/// <para>Koleksiyondaki diğer testler de kayıt bıraktığı için mutlak sayı yerine her test kendi
/// firmasının fikirlerine bakar.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantIdeaPool_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantIdeaPoolAppService _pool;
    private readonly IGrantInterestAppService _interests;
    private readonly IGrantInterestHostAppService _hostInterests;
    private readonly IGrantRequestAppService _requests;
    private readonly IGrantJourneyAppService _journey;
    private readonly IGrantRecommendationAppService _recommendations;
    private readonly IRepository<GrantInterest, Guid> _interestRepository;
    private readonly ICurrentUser _currentUser;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantIdeaPool_Tests()
    {
        _pool = GetRequiredService<IGrantIdeaPoolAppService>();
        _interests = GetRequiredService<IGrantInterestAppService>();
        _hostInterests = GetRequiredService<IGrantInterestHostAppService>();
        _requests = GetRequiredService<IGrantRequestAppService>();
        _journey = GetRequiredService<IGrantJourneyAppService>();
        _recommendations = GetRequiredService<IGrantRecommendationAppService>();
        _interestRepository = GetRequiredService<IRepository<GrantInterest, Guid>>();
        _currentUser = GetRequiredService<ICurrentUser>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<(Guid TenantId, string Name)> CreateTenantAsync(string prefix)
    {
        var name = prefix + " " + Guid.NewGuid().ToString("N")[..6];
        var tenant = await _tenantManager.CreateAsync(name);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        return (tenant.Id, name);
    }

    private async Task<Guid> ShareAsync(Guid tenantId, string idea, decimal? budget = null)
    {
        using (_currentTenant.Change(tenantId))
        {
            var shared = await _interests.ShareIdeaAsync(new ShareGrantIdeaInput
            {
                Note = idea,
                ProblemStatement = "Sorun",
                TargetAudience = "Kooperatifler",
                EstimatedBudget = budget
            });
            return shared.Id;
        }
    }

    [Fact]
    public async Task Kiracinin_fikri_havuza_duser_talep_sayilmaz()
    {
        var firm = await CreateTenantAsync("Ege Tekstil");

        // Çağrı başına tek süren talep kuralı havuza uymaz: aynı firmanın iki fikri olabilir.
        var first = await ShareAsync(firm.TenantId, "Kadın kooperatifleri dijital pazar erişimi", 900_000m);
        var second = await ShareAsync(firm.TenantId, "Yerel üretici eğitim programı");

        var pool = await _pool.GetListAsync(new GetGrantIdeaPoolInput());
        var mine = pool.Items.Where(i => i.TenantId == firm.TenantId).ToList();
        mine.Select(i => i.Id).ShouldBe(new[] { second, first }, ignoreOrder: true);
        mine.ShouldAllBe(i => i.Source == GrantInterestSource.Tenant && i.FirmName == firm.Name);
        mine.Single(i => i.Id == first).EstimatedBudget.ShouldBe(900_000m);
        pool.Firms.ShouldContain(f => f.Id == firm.TenantId && f.Name == firm.Name);

        // Talep değil: yanıt süresi işlemez, Talepler'e düşmez.
        var inbox = await _requests.GetInboxAsync(new GetGrantRequestInboxInput());
        inbox.Items.ShouldNotContain(r => r.Id == first || r.Id == second);

        using (_currentTenant.Change(firm.TenantId))
        {
            // "İlgi Taleplerim" çağrıya bırakılan talepleri listeler.
            (await _interests.GetMineAsync()).ShouldBeEmpty();

            // Yolculukta her fikir ayrı satır; çağrı yok.
            var journey = await _journey.GetAsync();
            var ideas = journey.Items.Where(i => i.Kind == GrantJourneyItemKind.IdeaPooled).ToList();
            ideas.Count.ShouldBe(2);
            ideas.ShouldAllBe(i => i.GrantCallId == null && i.IdeaSource == GrantInterestSource.Tenant);
            ideas.ShouldContain(i => i.InterestId == first && i.Idea == "Kadın kooperatifleri dijital pazar erişimi");
            // Havuz fikri süreç sayılmaz.
            journey.ActiveCount.ShouldBe(0);

            // 🔴 Akış çağrısız kaydı null anahtarla sözlüğe koyup patlıyordu.
            await _recommendations.GetOpenCallsAsync();
        }
    }

    [Fact]
    public async Task Danisman_firma_adina_fikir_girer_kayit_firmanin_olur()
    {
        var firm = await CreateTenantAsync("Mavi Enerji");

        var created = await _pool.CreateAsync(new CreateGrantIdeaInput
        {
            TenantId = firm.TenantId,
            Note = "Atık ısı geri kazanım hattı",
            ProblemStatement = "Enerji kaybı",
            Stakeholders = "  ",
            EstimatedBudget = 6_000_000m,
            TargetStartDate = new DateTime(2026, 10, 1)
        });

        created.TenantId.ShouldBe(firm.TenantId);
        created.FirmName.ShouldBe(firm.Name);
        created.Source.ShouldBe(GrantInterestSource.Consultant);
        created.ProblemStatement.ShouldBe("Enerji kaybı");
        // Boşluktan ibaret cevap yazılmamış sayılır.
        created.Stakeholders.ShouldBeNull();

        var detail = await _pool.GetAsync(created.Id);
        detail.Idea.ShouldBe("Atık ısı geri kazanım hattı");
        detail.TargetStartDate.ShouldBe(new DateTime(2026, 10, 1));

        using (_currentTenant.Change(firm.TenantId))
        {
            // 🔴 ABP başka kiracının kaydında CreatorId'yi yazmıyordu → "Kim girdi" boş kalıyordu.
            (await _interestRepository.GetAsync(created.Id)).CreatorId.ShouldBe(_currentUser.Id);

            var idea = (await _journey.GetAsync()).Items.Single(i => i.InterestId == created.Id);
            idea.Kind.ShouldBe(GrantJourneyItemKind.IdeaPooled);
            idea.IdeaSource.ShouldBe(GrantInterestSource.Consultant);
        }
    }

    [Fact]
    public async Task Kaynak_suzgeci_ve_butce_siralamasi()
    {
        var firm = await CreateTenantAsync("Deniz Makine");
        var small = await ShareAsync(firm.TenantId, "Küçük fikir", 450_000m);
        var noBudget = await ShareAsync(firm.TenantId, "Bütçesiz fikir");
        var big = (await _pool.CreateAsync(new CreateGrantIdeaInput
        {
            TenantId = firm.TenantId, Note = "Büyük fikir", ProblemStatement = "Sorun", EstimatedBudget = 12_500_000m
        })).Id;

        var consultantOnly = await _pool.GetListAsync(new GetGrantIdeaPoolInput { Source = GrantInterestSource.Consultant });
        consultantOnly.Items.ShouldAllBe(i => i.Source == GrantInterestSource.Consultant);
        consultantOnly.Items.Where(i => i.TenantId == firm.TenantId).Select(i => i.Id).ShouldBe(new[] { big });
        // Sayaç süzgeçten bağımsız: boş durum "havuz boş" ile "süzgece uyan yok"u ayırır.
        consultantOnly.TotalCount.ShouldBeGreaterThanOrEqualTo(3);

        var byBudget = await _pool.GetListAsync(new GetGrantIdeaPoolInput { Sort = GrantIdeaPoolSort.Budget });
        byBudget.Items.Where(i => i.TenantId == firm.TenantId).Select(i => i.Id)
            .ShouldBe(new[] { big, small, noBudget });
    }

    [Fact]
    public async Task Havuz_fikrinde_basvuru_ve_gorusme_acilmaz()
    {
        var firm = await CreateTenantAsync("Vektör Yazılım");
        var idea = await ShareAsync(firm.TenantId, "Gençlik atölyeleri");

        (await Should.ThrowAsync<BusinessException>(() => _hostInterests.StartApplicationAsync(idea)))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestIdeaNotLinked);

        using (_currentTenant.Change(firm.TenantId))
        {
            (await Should.ThrowAsync<BusinessException>(() => _interests.ProposeMeetingAsync(new ProposeGrantMeetingInput
            {
                InterestId = idea,
                Slots = new() { DateTime.Now.AddDays(2), DateTime.Now.AddDays(3), DateTime.Now.AddDays(4) }
            }))).Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestIdeaNotLinked);
        }
    }

    [Fact]
    public async Task Geri_cekilen_fikir_havuzdan_ve_yolculuktan_duser()
    {
        var firm = await CreateTenantAsync("Akım Teknoloji");
        var idea = await ShareAsync(firm.TenantId, "Sensör analitiği");

        using (_currentTenant.Change(firm.TenantId))
        {
            await _interests.WithdrawAsync(idea);
            (await _journey.GetAsync()).Items.ShouldNotContain(i => i.InterestId == idea);
        }

        (await _pool.GetListAsync(new GetGrantIdeaPoolInput())).Items.ShouldNotContain(i => i.Id == idea);
        // Kayıt silinmez, tarihçedir: bağlantıyla açılırsa hâlâ okunur.
        (await _pool.GetAsync(idea)).Id.ShouldBe(idea);
    }

    [Fact]
    public async Task Havuz_uclari_rolune_kapali()
    {
        var firm = await CreateTenantAsync("Rol Firması");

        // Host'un firması yok: havuza fikri firma adına Fikir Havuzu'ndan girer.
        await Should.ThrowAsync<AbpAuthorizationException>(() => _interests.ShareIdeaAsync(
            new ShareGrantIdeaInput { Note = "Fikir", ProblemStatement = "Sorun" }));

        using (_currentTenant.Change(firm.TenantId))
        {
            await Should.ThrowAsync<AbpAuthorizationException>(() => _pool.GetListAsync(new GetGrantIdeaPoolInput()));
        }
    }
}
