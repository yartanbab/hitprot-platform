using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.DynamicAssets;

/// <summary>
/// Tur 15 · Açılır liste "Yayındaki hibeler" kaynağına bağlanır: seçenekler sabit yazılmaz, form her
/// açıldığında host kataloğundaki açık çağrılardan gelir. Cevap güncel listeye karşı doğrulanır ve adı
/// sunucuda yazılır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FormGrantChoices_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const string LiveSettings = "{\"required\":true,\"source\":\"open-grant-calls\",\"urlPrefill\":true}";

    private readonly IFormAppService _formAppService;
    private readonly IPublicDocumentAppService _publicDocumentAppService;
    private readonly IResponseAppService _responseAppService;
    private readonly IRepository<AppResponse, Guid> _responseRepository;
    private readonly ICurrentTenant _currentTenant;

    public FormGrantChoices_Tests()
    {
        _formAppService = GetRequiredService<IFormAppService>();
        _publicDocumentAppService = GetRequiredService<IPublicDocumentAppService>();
        _responseAppService = GetRequiredService<IResponseAppService>();
        _responseRepository = GetRequiredService<IRepository<AppResponse, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<GrantCall> CreateHostCallAsync(string name, GrantCallStatus status)
    {
        var grant = await GetRequiredService<IRepository<Grant, Guid>>()
            .InsertAsync(new Grant(Guid.NewGuid(), name, "TÜBİTAK", 1_000_000m, minMatchScore: 0), autoSave: true);
        return await GetRequiredService<IRepository<GrantCall, Guid>>()
            .InsertAsync(new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", status), autoSave: true);
    }

    /// <summary>Host'ta yayında proje fikri formu: canlı çağrı listesi + sabit seçenekli bir açılır liste.</summary>
    private async Task<DocumentDto> CreateIdeaFormAsync()
    {
        var form = await _formAppService.CreateAsync(new CreateUpdateFormDto
        {
            Title = "Proje fikri bilgi formu",
            Blocks = new List<CreateBlockDto>
            {
                new() { Type = BlockType.Dropdown, Order = 1, Content = "İlgilendiğiniz çağrı", Settings = LiveSettings },
                new() { Type = BlockType.Dropdown, Order = 2, Content = "Firma ölçeği", Settings = "{\"options\":[\"KOBİ\",\"Büyük\"]}" }
            }
        });
        await _formAppService.PublishAsync(form.Id, new PublishFormDto { Slug = "fikir-" + Guid.NewGuid().ToString("N")[..6] });
        return await _formAppService.GetAsync(form.Id);
    }

    private static Guid CallBlockOf(DocumentDto form) => form.Blocks.Single(b => b.Order == 1).Id;

    private Task SubmitAsync(DocumentDto form, object callAnswer)
        => _responseAppService.SubmitAsync(new SubmitResponseDto
        {
            DocumentSlug = form.Slug,
            Answers = JsonSerializer.Serialize(new Dictionary<string, object> { [CallBlockOf(form).ToString()] = callAnswer })
        });

    [Fact]
    public async Task Form_acilinca_yalniz_acik_cagrilar_listelenir()
    {
        var open = await CreateHostCallAsync("Sanayi Ar-Ge Projeleri", GrantCallStatus.Acik);
        var closed = await CreateHostCallAsync("Kapanmış Program", GrantCallStatus.Kapandi);
        var form = await CreateIdeaFormAsync();

        var dto = await _publicDocumentAppService.GetBySlugAsync(form.Slug);

        var choices = dto.Blocks.Single(b => b.Order == 1).Choices.ShouldNotBeNull();
        choices.ShouldContain(c => c.Value == open.Id.ToString() && c.Label == "TÜBİTAK · Sanayi Ar-Ge Projeleri (2026/1)");
        choices.ShouldNotContain(c => c.Value == closed.Id.ToString());
        dto.Blocks.Single(b => b.Order == 2).Choices.ShouldBeNull();

        (await _formAppService.GetChoicesAsync(FormChoiceSources.OpenGrantCalls)).ShouldContain(c => c.Value == open.Id.ToString());
        (await _formAppService.GetChoicesAsync("bilinmeyen")).ShouldBeEmpty();
    }

    [Fact]
    public async Task Kiracinin_cevabi_guncel_adla_yazilir_kapanmis_cagri_reddedilir()
    {
        var open = await CreateHostCallAsync("KOBİGEL Dijital Dönüşüm", GrantCallStatus.Acik);
        var closed = await CreateHostCallAsync("Süresi Dolmuş", GrantCallStatus.Kapandi);
        var form = await CreateIdeaFormAsync();
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("Seçen Firma " + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        using (_currentTenant.Change(tenant.Id))
        {
            // İstemcinin gönderdiği ad yok sayılır.
            await SubmitAsync(form, new { value = open.Id.ToString(), label = "Uydurma ad" });

            var closedError = await Should.ThrowAsync<BusinessException>(() => SubmitAsync(form, new { value = closed.Id.ToString(), label = "x" }));
            closedError.Code.ShouldBe(PlatformDomainErrorCodes.FormAnswersInvalid);

            var emptyError = await Should.ThrowAsync<BusinessException>(() => SubmitAsync(form, new { value = "", label = "" }));
            emptyError.Code.ShouldBe(PlatformDomainErrorCodes.FormRequiredAnswerMissing);
        }

        AppResponse response;
        using (GetRequiredService<IDataFilter<IMultiTenant>>().Disable())
        {
            response = (await _responseRepository.GetListAsync(r => r.DocumentId == form.Id)).ShouldHaveSingleItem();
        }

        response.TenantId.ShouldBe(tenant.Id);
        using var answers = JsonDocument.Parse(response.Answers);
        var answer = answers.RootElement.GetProperty(CallBlockOf(form).ToString());
        answer.GetProperty("value").GetString().ShouldBe(open.Id.ToString());
        answer.GetProperty("label").GetString().ShouldBe("TÜBİTAK · KOBİGEL Dijital Dönüşüm (2026/1)");
    }
}
