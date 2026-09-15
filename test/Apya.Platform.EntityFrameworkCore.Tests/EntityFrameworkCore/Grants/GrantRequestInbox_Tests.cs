using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 22b · Talepler › Yanıt bekleyen. İlgi talepleri (kiracıda) ve ön değerlendirme talepleri
/// (host'ta) tek listede; yanıt durumu sunucuda hesaplanır.
///
/// <para>Koleksiyondaki diğer testler de kayıt bıraktığı için mutlak sayı yerine her test
/// kendi çağrısıyla süzüp kendi satırlarına bakar.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantRequestInbox_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantRequestAppService _requests;
    private readonly IGrantInterestAppService _interestAppService;
    private readonly IGrantInterestHostAppService _hostAppService;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantLead, Guid> _leadRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantRequestInbox_Tests()
    {
        _requests = GetRequiredService<IGrantRequestAppService>();
        _interestAppService = GetRequiredService<IGrantInterestAppService>();
        _hostAppService = GetRequiredService<IGrantInterestHostAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _leadRepository = GetRequiredService<IRepository<GrantLead, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<GrantCall> CreateHostCallAsync(string name)
    {
        var grant = new Grant(Guid.NewGuid(), name, "Kurum", maxAmount: 100_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);

        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik);
        await _callRepository.InsertAsync(call, autoSave: true);
        return call;
    }

    private async Task<(Guid TenantId, string Name)> CreateTenantAsync(string prefix)
    {
        var name = prefix + " " + Guid.NewGuid().ToString("N")[..6];
        var tenant = await _tenantManager.CreateAsync(name);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        return (tenant.Id, name);
    }

    private async Task<Guid> ExpressAsync(Guid tenantId, Guid callId, string idea)
    {
        using (_currentTenant.Change(tenantId))
        {
            var interest = await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = callId, Note = idea, ProblemStatement = "Sorun" });
            return interest.Id;
        }
    }

    private async Task<GrantLead> InsertLeadAsync(Guid callId, string firm, Action<GrantLead>? change = null)
    {
        var lead = new GrantLead(Guid.NewGuid(), callId, firm, "Ayşe Kaya", "ayse@" + Guid.NewGuid().ToString("N")[..6] + ".test");
        change?.Invoke(lead);
        return await _leadRepository.InsertAsync(lead, autoSave: true);
    }

    [Fact]
    public async Task Iki_kiracinin_ilgisi_ve_on_degerlendirme_tek_listede_gelir()
    {
        var call = await CreateHostCallAsync("Talepler Programı");
        var a = await CreateTenantAsync("Akım Teknoloji");
        var b = await CreateTenantAsync("Ege Tekstil");

        var interestA = await ExpressAsync(a.TenantId, call.Id, "Sensör analitiği");
        var interestB = await ExpressAsync(b.TenantId, call.Id, "Dijital pazar erişimi");
        var lead = await InsertLeadAsync(call.Id, "Mavi Enerji");

        var inbox = await _requests.GetInboxAsync(new GetGrantRequestInboxInput { GrantCallId = call.Id });

        inbox.Items.Count.ShouldBe(3);
        inbox.Items.ShouldContain(r => r.Id == interestA && r.Kind == GrantRequestKind.Interest && r.FirmName == a.Name);
        inbox.Items.ShouldContain(r => r.Id == interestB && r.FirmName == b.Name && r.Summary == "Dijital pazar erişimi");
        inbox.Items.ShouldContain(r => r.Id == lead.Id && r.Kind == GrantRequestKind.Lead && r.FirmName == "Mavi Enerji");
        inbox.Items.ShouldAllBe(r => r.GrantName == "Talepler Programı" && r.Period == "2026/1");

        // Yeni talep yanıtlanmamıştır: son an bir iş günü sonrası, kalan saat dolu.
        var row = inbox.Items.Single(r => r.Id == interestA);
        row.RespondBy.ShouldBe(GrantResponseDeadline.For(row.CreationTime));
        row.Response.ShouldBeOneOf(GrantResponseState.Waiting, GrantResponseState.DueSoon, GrantResponseState.Overdue);
        row.HoursLeft.ShouldNotBeNull();

        inbox.PendingCount.ShouldBeGreaterThanOrEqualTo(3);
        inbox.Calls.ShouldContain(c => c.Id == call.Id && c.Name == "Talepler Programı · 2026/1");
    }

    [Fact]
    public async Task Yanit_verilen_talep_yanitlandi_karara_baglanan_kapanmista_gorunur()
    {
        var call = await CreateHostCallAsync("Yanıt Programı");
        var tenant = await CreateTenantAsync("Vektör Yazılım");

        // Aynı çağrıda ikinci açık talep açılamaz: önce ilki kapanır, sonra yenisi bırakılır.
        var rejected = await ExpressAsync(tenant.TenantId, call.Id, "Reddedilecek fikir");
        await _hostAppService.RejectAsync(new RejectGrantInterestInput { InterestId = rejected, Reason = "Kapsam dışı" });
        var reviewed = await ExpressAsync(tenant.TenantId, call.Id, "İncelenecek fikir");
        await _hostAppService.StartReviewAsync(reviewed);

        var called = await InsertLeadAsync(call.Id, "Aranan Firma", l => l.SetStatus(GrantLeadStatus.Arandi));
        // Ziyaretçinin saat tercihi danışmanın yanıtı DEĞİLDİR: talep yanıt bekler.
        var meetingAsked = await InsertLeadAsync(call.Id, "Randevu İsteyen", l => l.RequestMeeting(DateTime.Today.AddDays(3), null));
        var closedLead = await InsertLeadAsync(call.Id, "Kapanan Firma", l => l.SetStatus(GrantLeadStatus.Kapandi));

        var open = await _requests.GetInboxAsync(new GetGrantRequestInboxInput { GrantCallId = call.Id });

        open.Items.Single(r => r.Id == reviewed).Response.ShouldBe(GrantResponseState.Answered);
        open.Items.Single(r => r.Id == reviewed).HoursLeft.ShouldBeNull();
        open.Items.Single(r => r.Id == called.Id).Response.ShouldBe(GrantResponseState.Answered);
        open.Items.Single(r => r.Id == meetingAsked.Id).HoursLeft.ShouldNotBeNull();
        open.Items.ShouldNotContain(r => r.Id == rejected || r.Id == closedLead.Id);

        // Sıra: yanıtlanmamış önce.
        open.Items.First().Id.ShouldBe(meetingAsked.Id);

        var closed = await _requests.GetInboxAsync(new GetGrantRequestInboxInput { GrantCallId = call.Id, Closed = true });

        closed.Items.Select(r => r.Id).ShouldBe(new[] { closedLead.Id, rejected }, ignoreOrder: true);
        closed.Items.ShouldAllBe(r => r.Response == GrantResponseState.Closed);
    }

    [Fact]
    public async Task Cagri_suzgeci_baska_cagrinin_talebini_getirmez_sekme_sayaclari_uyusur()
    {
        var mine = await CreateHostCallAsync("Süzgeç Programı");
        var other = await CreateHostCallAsync("Başka Program");
        var tenant = await CreateTenantAsync("Deniz Makine");

        var own = await ExpressAsync(tenant.TenantId, mine.Id, "Bu çağrı");
        var foreign = await ExpressAsync(tenant.TenantId, other.Id, "Öbür çağrı");

        var inbox = await _requests.GetInboxAsync(new GetGrantRequestInboxInput { GrantCallId = mine.Id });

        inbox.Items.ShouldContain(r => r.Id == own);
        inbox.Items.ShouldNotContain(r => r.Id == foreign);

        // Sekme sayaçları süzgeçten bağımsızdır ve iki uçta aynıdır.
        var counts = await _requests.GetTabCountsAsync();
        counts.PendingCount.ShouldBe(inbox.PendingCount);
        counts.RunningCount.ShouldBe(inbox.RunningCount);
    }

    [Fact]
    public async Task Kiraci_baglaminda_talepler_okunamaz()
    {
        var tenant = await CreateTenantAsync("Meraklı Firma");

        using (_currentTenant.Change(tenant.TenantId))
        {
            await Should.ThrowAsync<AbpAuthorizationException>(
                () => _requests.GetInboxAsync(new GetGrantRequestInboxInput()));
            await Should.ThrowAsync<AbpAuthorizationException>(() => _requests.GetTabCountsAsync());
        }
    }
}
