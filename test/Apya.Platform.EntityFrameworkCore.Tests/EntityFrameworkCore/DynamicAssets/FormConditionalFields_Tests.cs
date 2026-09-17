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
/// 17 · Koşullu alan: bir alan yalnız başka bir alanın cevabına ya da o cevapta SEÇİLEN ÇAĞRININ
/// şartına göre görünür. Sunucu KARAR mercii: gizli alanın zorunluluğu aranmaz, gizli alana gelen
/// cevap da yazılmaz — istemci gizlemese bile.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FormConditionalFields_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IFormAppService _formAppService;
    private readonly IResponseAppService _responseAppService;
    private readonly IRepository<AppResponse, Guid> _responseRepository;
    private readonly ICurrentTenant _currentTenant;

    public FormConditionalFields_Tests()
    {
        _formAppService = GetRequiredService<IFormAppService>();
        _responseAppService = GetRequiredService<IResponseAppService>();
        _responseRepository = GetRequiredService<IRepository<AppResponse, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<GrantCall> CreateHostCallAsync(string name, bool requiresConsortium)
    {
        var grant = new Grant(Guid.NewGuid(), name, "TÜBİTAK", 1_000_000m, minMatchScore: 0)
        {
            RequiresConsortium = requiresConsortium
        };
        await GetRequiredService<IRepository<Grant, Guid>>().InsertAsync(grant, autoSave: true);
        return await GetRequiredService<IRepository<GrantCall, Guid>>()
            .InsertAsync(new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik), autoSave: true);
    }

    private async Task<Guid> CreateTenantAsync()
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("Koşul Firma " + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    /// <summary>
    /// Çağrı (canlı liste) + "Ortak firma adı" (yalnız ortaklık isteyen çağrıda, ZORUNLU) +
    /// "Ortak sayısı" (ortak adı yanıtlanırsa) — üç kademeli zincir.
    /// </summary>
    private async Task<DocumentDto> CreateConsortiumFormAsync()
    {
        var form = await _formAppService.CreateAsync(new CreateUpdateFormDto
        {
            Title = "Başvuru ön bilgi formu",
            Blocks = new List<CreateBlockDto>
            {
                new()
                {
                    Type = BlockType.Dropdown, Order = 1, Content = "İlgilendiğiniz çağrı",
                    Settings = $"{{\"required\":true,\"source\":\"{FormChoiceSources.OpenGrantCalls}\"}}"
                }
            }
        });

        var callBlockId = form.Blocks.Single().Id;
        await _formAppService.UpdateBlocksAsync(form.Id, new UpdateFormBlocksDto
        {
            Blocks = new List<CreateBlockDto>
            {
                new()
                {
                    Id = callBlockId, Type = BlockType.Dropdown, Order = 1, Content = "İlgilendiğiniz çağrı",
                    Settings = $"{{\"required\":true,\"source\":\"{FormChoiceSources.OpenGrantCalls}\"}}"
                },
                new()
                {
                    Type = BlockType.ShortText, Order = 2, Content = "Ortak firma adı",
                    Settings = $"{{\"required\":true,\"visibleWhen\":{{\"blockId\":\"{callBlockId}\",\"op\":\"flag\",\"value\":\"{FormChoiceFlags.RequiresConsortium}\"}}}}"
                }
            }
        });

        await _formAppService.PublishAsync(form.Id, new PublishFormDto { Slug = "basvuru-" + Guid.NewGuid().ToString("N")[..6] });
        return await _formAppService.GetAsync(form.Id);
    }

    private Task SubmitAsync(DocumentDto form, Dictionary<string, object> answers)
        => _responseAppService.SubmitAsync(new SubmitResponseDto
        {
            DocumentSlug = form.Slug,
            Answers = JsonSerializer.Serialize(answers)
        });

    private async Task<JsonElement> StoredAnswersAsync(DocumentDto form)
    {
        AppResponse response;
        using (GetRequiredService<IDataFilter<IMultiTenant>>().Disable())
        {
            response = (await _responseRepository.GetListAsync(r => r.DocumentId == form.Id)).ShouldHaveSingleItem();
        }

        return JsonDocument.Parse(response.Answers).RootElement.Clone();
    }

    [Fact]
    public async Task Ortaklik_istemeyen_cagrida_ortak_alani_zorunlu_degil()
    {
        var call = await CreateHostCallAsync("Tekil Başvuru Programı", requiresConsortium: false);
        var form = await CreateConsortiumFormAsync();
        var callBlockId = form.Blocks.Single(b => b.Order == 1).Id;
        var partnerBlockId = form.Blocks.Single(b => b.Order == 2).Id;

        using (_currentTenant.Change(await CreateTenantAsync()))
        {
            // Ortak adı ZORUNLU ama alan gizli: gönderim geçmeli.
            await SubmitAsync(form, new Dictionary<string, object>
            {
                [callBlockId.ToString()] = new { value = call.Id.ToString(), label = "x" }
            });
        }

        var answers = await StoredAnswersAsync(form);
        answers.TryGetProperty(partnerBlockId.ToString(), out _).ShouldBeFalse();
    }

    [Fact]
    public async Task Ortaklik_isteyen_cagrida_ortak_alani_zorunlu()
    {
        var call = await CreateHostCallAsync("Konsorsiyum Programı", requiresConsortium: true);
        var form = await CreateConsortiumFormAsync();
        var callBlockId = form.Blocks.Single(b => b.Order == 1).Id;
        var partnerBlockId = form.Blocks.Single(b => b.Order == 2).Id;

        using (_currentTenant.Change(await CreateTenantAsync()))
        {
            var missing = await Should.ThrowAsync<BusinessException>(() => SubmitAsync(form, new Dictionary<string, object>
            {
                [callBlockId.ToString()] = new { value = call.Id.ToString(), label = "x" }
            }));
            missing.Code.ShouldBe(PlatformDomainErrorCodes.FormRequiredAnswerMissing);

            await SubmitAsync(form, new Dictionary<string, object>
            {
                [callBlockId.ToString()] = new { value = call.Id.ToString(), label = "x" },
                [partnerBlockId.ToString()] = "Gediz Cam A.Ş."
            });
        }

        (await StoredAnswersAsync(form)).GetProperty(partnerBlockId.ToString()).GetString().ShouldBe("Gediz Cam A.Ş.");
    }

    [Fact]
    public async Task Gizli_alana_gelen_cevap_KAYDA_yazilmaz()
    {
        var call = await CreateHostCallAsync("Tekil Başvuru Programı", requiresConsortium: false);
        var form = await CreateConsortiumFormAsync();
        var callBlockId = form.Blocks.Single(b => b.Order == 1).Id;
        var partnerBlockId = form.Blocks.Single(b => b.Order == 2).Id;

        using (_currentTenant.Change(await CreateTenantAsync()))
        {
            // İstemci alanı gizlemeden gönderdi (ya da önce doldurup sonra çağrıyı değiştirdi).
            await SubmitAsync(form, new Dictionary<string, object>
            {
                [callBlockId.ToString()] = new { value = call.Id.ToString(), label = "x" },
                [partnerBlockId.ToString()] = "Görünmeyen alana yazılmış cevap"
            });
        }

        var answers = await StoredAnswersAsync(form);
        answers.TryGetProperty(partnerBlockId.ToString(), out _).ShouldBeFalse();
        answers.GetProperty(callBlockId.ToString()).GetProperty("label").GetString()
            .ShouldBe("TÜBİTAK · Tekil Başvuru Programı (2026/1)");
    }

    [Fact]
    public async Task Cevaba_bagli_kosul_ve_zincir_sunucuda_cozulur()
    {
        var form = await _formAppService.CreateAsync(new CreateUpdateFormDto
        {
            Title = "Ortaklık bilgisi",
            Blocks = new List<CreateBlockDto>
            {
                new() { Type = BlockType.Dropdown, Order = 1, Content = "Ortaklı mı?", Settings = "{\"required\":true,\"options\":[\"Evet\",\"Hayır\"]}" }
            }
        });

        var parentId = form.Blocks.Single().Id;
        var updated = await _formAppService.UpdateBlocksAsync(form.Id, new UpdateFormBlocksDto
        {
            Blocks = new List<CreateBlockDto>
            {
                new() { Id = parentId, Type = BlockType.Dropdown, Order = 1, Content = "Ortaklı mı?", Settings = "{\"required\":true,\"options\":[\"Evet\",\"Hayır\"]}" },
                new() { Type = BlockType.ShortText, Order = 2, Content = "Ortak firma adı", Settings = $"{{\"required\":true,\"visibleWhen\":{{\"blockId\":\"{parentId}\",\"op\":\"eq\",\"value\":\"Evet\"}}}}" }
            }
        });

        var childId = updated.Blocks.Single(b => b.Order == 2).Id;
        await _formAppService.UpdateBlocksAsync(form.Id, new UpdateFormBlocksDto
        {
            Blocks = new List<CreateBlockDto>
            {
                new() { Id = parentId, Type = BlockType.Dropdown, Order = 1, Content = "Ortaklı mı?", Settings = "{\"required\":true,\"options\":[\"Evet\",\"Hayır\"]}" },
                new() { Id = childId, Type = BlockType.ShortText, Order = 2, Content = "Ortak firma adı", Settings = $"{{\"required\":true,\"visibleWhen\":{{\"blockId\":\"{parentId}\",\"op\":\"eq\",\"value\":\"Evet\"}}}}" },
                // Üçüncü kademe: ortak adı gizliyse bu da gizlenmeli (zincir).
                new() { Type = BlockType.Number, Order = 3, Content = "Ortak sayısı", Settings = $"{{\"required\":true,\"visibleWhen\":{{\"blockId\":\"{childId}\",\"op\":\"answered\"}}}}" }
            }
        });

        await _formAppService.PublishAsync(form.Id, new PublishFormDto { Slug = "ortaklik-" + Guid.NewGuid().ToString("N")[..6] });
        var published = await _formAppService.GetAsync(form.Id);

        using (_currentTenant.Change(await CreateTenantAsync()))
        {
            // "Hayır" → ortak adı gizli, ona bağlı sayı da gizli: tek cevapla geçer.
            await SubmitAsync(published, new Dictionary<string, object> { [parentId.ToString()] = "Hayır" });

            // "Evet" → ortak adı görünür ve ZORUNLU.
            var missing = await Should.ThrowAsync<BusinessException>(() => SubmitAsync(
                published, new Dictionary<string, object> { [parentId.ToString()] = "Evet" }));
            missing.Code.ShouldBe(PlatformDomainErrorCodes.FormRequiredAnswerMissing);
        }
    }
}
