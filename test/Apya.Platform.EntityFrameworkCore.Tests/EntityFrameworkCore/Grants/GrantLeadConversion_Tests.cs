using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// GRH-03 · "Müşteriye dönüştür" iki kez gelince (çift tık, eski sekme) ikinci istek kiracıyı ve firma
/// profilini YAZDIKTAN SONRA "zaten dönüştürüldü" diyordu: farklı adla ikinci bir kiracı açılıyor, aynı adla
/// ABP'nin "kiracı adı kullanımda" hatası (yanlış metin) çıkıyordu. Denetim artık yan etkilerden önce.
///
/// <para>Test modülünde işlem (transaction) kapalı: düzeltme geri alınırsa ikinci kiracı veritabanında kalır
/// ve ilk test kırmızıya döner.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantLeadConversion_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantLeadAppService _leads;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantLead, Guid> _leadRepository;
    private readonly ITenantRepository _tenantRepository;

    public GrantLeadConversion_Tests()
    {
        _leads = GetRequiredService<IGrantLeadAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _leadRepository = GetRequiredService<IRepository<GrantLead, Guid>>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
    }

    private async Task<GrantLead> InsertLeadAsync(string firm)
    {
        var grant = new Grant(Guid.NewGuid(), "Dönüştürme Programı " + Guid.NewGuid().ToString("N")[..4], "Kurum", maxAmount: 100_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);
        var call = await _callRepository.InsertAsync(new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik), autoSave: true);

        var lead = new GrantLead(Guid.NewGuid(), call.Id, firm, "Ayşe Kaya", "ayse@" + Guid.NewGuid().ToString("N")[..6] + ".test");
        return await _leadRepository.InsertAsync(lead, autoSave: true);
    }

    [Fact]
    public async Task Donusturulmus_talep_ikinci_kez_kiraci_acmaz()
    {
        var suffix = Guid.NewGuid().ToString("N")[..6];
        var lead = await InsertLeadAsync("donusum-" + suffix);
        var secondName = "donusum-ikinci-" + suffix;

        var first = await _leads.ConvertToTenantAsync(new ConvertGrantLeadInput { LeadId = lead.Id });

        var ex = await Should.ThrowAsync<BusinessException>(() =>
            _leads.ConvertToTenantAsync(new ConvertGrantLeadInput { LeadId = lead.Id, TenantName = secondName }));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantLeadAlreadyConverted);
        (await _tenantRepository.GetListAsync()).ShouldNotContain(t => t.Name == secondName, "ikinci istek kiracı açmamalı");
        (await _leadRepository.GetAsync(lead.Id)).ConvertedTenantId.ShouldBe(first.TenantId);
    }

    [Fact]
    public async Task Ayni_adla_ikinci_donusturme_LeadAlreadyConverted_verir()
    {
        var lead = await InsertLeadAsync("donusum-ayni-" + Guid.NewGuid().ToString("N")[..6]);

        await _leads.ConvertToTenantAsync(new ConvertGrantLeadInput { LeadId = lead.Id });

        // Düzeltmeden önce ABP'nin "kiracı adı kullanımda" hatası dönüyordu (yanlış kod, yanlış metin).
        var ex = await Should.ThrowAsync<BusinessException>(() =>
            _leads.ConvertToTenantAsync(new ConvertGrantLeadInput { LeadId = lead.Id }));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantLeadAlreadyConverted);
    }
}
