using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 1b · Hibe Parametre Formu — sayfa render'ı ve canlı eşleşme ucu.
/// Test host'u AddAlwaysAllowAuthorization kullanır; gerçek host'ta erişimi
/// <c>[Authorize(PlatformPermissions.Grants.Edit)]</c> (host-only izin) kapatır.
/// </summary>
public class GrantParametersPage_Tests : PlatformWebTestBase
{
    private async Task<Guid> FirstGrantIdAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin();
        var repo = GetRequiredService<IRepository<Grant, Guid>>();
        var grants = await repo.GetListAsync();
        grants.ShouldNotBeEmpty("tohum verisinde en az bir hibe programı olmalı");
        return grants.OrderBy(g => g.Name).First().Id;
    }

    [Fact]
    public async Task Sayfa_Render_Oluyor()
    {
        var id = await FirstGrantIdAsync();

        var html = await GetResponseAsStringAsync($"/Grants/Parameters?id={id}");

        html.ShouldContain("apya-param-layout");
        html.ShouldContain("Uygunluk Şartları");
        html.ShouldContain("Canlı Eşleşme");
        // Sayfa script/stili ABP demetine girer (/__bundles/...Parameters.<hash>.js),
        // ham dosya yolu HTML'de görünmez.
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Parameters[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Parameters.js içermeli");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Parameters[^""]*\.css")
            .ShouldBeTrue("sayfa demeti Parameters.css içermeli");
    }

    [Fact]
    public async Task Id_Verilmezse_Listeye_Yonlendirir()
    {
        var response = await Client.GetAsync("/Grants/Parameters");

        ((int)response.StatusCode).ShouldBe(302);
        response.Headers.Location!.ToString().ShouldContain("/Grants");
    }

    [Fact]
    public async Task Sayfada_Ham_Renk_Degeri_Yok()
    {
        // Tasarım kuralı: her renk token'dan gelir. Sayfanın kendi markup'ında
        // hex renk bulunmamalı (LeptonX/Bootstrap demetleri bu kontrole girmez).
        var id = await FirstGrantIdAsync();
        var html = await GetResponseAsStringAsync($"/Grants/Parameters?id={id}");

        // Yalnız SAYFANIN kendi bloğu ölçülür; LeptonX kabuğunun satır içi stilleri
        // bu kuralın konusu değil.
        var start = html.IndexOf("apya-param-layout", StringComparison.Ordinal);
        start.ShouldBeGreaterThan(-1);
        var end = html.IndexOf("</aside>", start, StringComparison.Ordinal);
        end.ShouldBeGreaterThan(start);
        var body = html[start..end];

        System.Text.RegularExpressions.Regex
            .IsMatch(body, @"style\s*=\s*""[^""]*#[0-9A-Fa-f]{3,6}")
            .ShouldBeFalse("sayfa markup'ında satır içi hex renk olmamalı");
    }

    [Fact]
    public async Task Parametre_Ucu_Programi_Doner()
    {
        var id = await FirstGrantIdAsync();
        var service = GetRequiredService<IGrantParameterAppService>();

        var dto = await service.GetAsync(id);

        dto.Id.ShouldBe(id);
        dto.Issuer.ShouldNotBeNullOrWhiteSpace();
        // Yayınlanacak taslak çağrı yoksa Yayınla kapalı kalır.
        dto.CanPublish.ShouldBe(dto.MissingRequiredFields.Count == 0 && dto.DraftCallCount > 0);
    }

    /// <summary>Ar-Ge personeli 1 olan tek firmalık bir kiracı kurar.</summary>
    private async Task<Guid> CreateFirmAsync(int rdStaffCount)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var tenantManager = GetRequiredService<ITenantManager>();
        var tenantRepo = GetRequiredService<ITenantRepository>();
        var currentTenant = GetRequiredService<ICurrentTenant>();
        var profileRepo = GetRequiredService<IRepository<FirmProfile, Guid>>();

        Guid tenantId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await tenantManager.CreateAsync("Firma-" + Guid.NewGuid().ToString("N")[..8]);
            await tenantRepo.InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;
            await uow.CompleteAsync();
        }

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            using (currentTenant.Change(tenantId))
            {
                await profileRepo.InsertAsync(
                    new FirmProfile(Guid.NewGuid(), tenantId) { RdStaffCount = rdStaffCount },
                    autoSave: true);
            }
            await uow.CompleteAsync();
        }

        return tenantId;
    }

    [Fact]
    public async Task Canli_Eslesme_Sart_Eklendikce_Daralir()
    {
        await CreateFirmAsync(rdStaffCount: 1);

        var id = await FirstGrantIdAsync();
        var service = GetRequiredService<IGrantParameterAppService>();

        var bos = await service.PreviewMatchAsync(id, new UpdateGrantParameterDto
        {
            Name = "P",
            Issuer = "K"
        });

        // Hiç şart yokken kural üretilmez; her firma "karşılıyor" sayılır.
        bos.TotalFirms.ShouldBeGreaterThan(0);
        bos.RuleImpacts.ShouldBeEmpty();
        bos.MatchingFirms.ShouldBe(bos.TotalFirms);
        bos.TopEliminatingRule.ShouldBeNull();

        var sartli = await service.PreviewMatchAsync(id, new UpdateGrantParameterDto
        {
            Name = "P",
            Issuer = "K",
            MinRdStaffCount = 2
        });

        // Şart tanımlandı → kural üretildi ve Ar-Ge personeli 1 olan firma ELENDİ.
        var etki = sartli.RuleImpacts.Single(i => i.Rule == GrantEligibilityRule.RdStaffCount);
        etki.EliminatedCount.ShouldBeGreaterThan(0);
        sartli.TopEliminatingRule.ShouldBe(GrantEligibilityRule.RdStaffCount);
        sartli.MatchingFirms.ShouldBeLessThan(bos.MatchingFirms);
    }

    [Fact]
    public async Task Zorunlu_Alan_Eksikken_Yayin_Reddedilir()
    {
        var id = await FirstGrantIdAsync();
        var service = GetRequiredService<IGrantParameterAppService>();

        // Destek oranı ve proje süresi boş → yayın kapısı kapalı.
        await service.UpdateAsync(id, new UpdateGrantParameterDto
        {
            Name = "Yayın kapısı testi",
            Issuer = "Kurum"
        });

        var ex = await Should.ThrowAsync<Volo.Abp.BusinessException>(
            () => service.PublishAsync(id));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantPublishRequiredFieldsMissing);
    }
}
