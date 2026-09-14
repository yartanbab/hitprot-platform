using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.DynamicAssets;

/// <summary>
/// /f/{slug} kiracı çözümü. Slug yalnız kiracı içinde tekildir ve anonim ziyaretçinin kiracısı yoktur:
/// kiracının herkese açık form bağlantısı hiç açılmıyordu. Host formunu dolduran kiracı kullanıcısının
/// yanıtı kendi kiracısına yazılır; host bu yanıtları firma adıyla görür, kiracı formlarınınkini göremez.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class PublicFormTenant_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IFormAppService _formAppService;
    private readonly IPublicDocumentAppService _publicDocumentAppService;
    private readonly IResponseAppService _responseAppService;
    private readonly IResponseManagementAppService _responseManagementAppService;
    private readonly IRepository<AppResponse, Guid> _responseRepository;
    private readonly IRepository<AppDocument, Guid> _documentRepository;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;
    private readonly ICurrentTenant _currentTenant;

    public PublicFormTenant_Tests()
    {
        _formAppService = GetRequiredService<IFormAppService>();
        _publicDocumentAppService = GetRequiredService<IPublicDocumentAppService>();
        _responseAppService = GetRequiredService<IResponseAppService>();
        _responseManagementAppService = GetRequiredService<IResponseManagementAppService>();
        _responseRepository = GetRequiredService<IRepository<AppResponse, Guid>>();
        _documentRepository = GetRequiredService<IRepository<AppDocument, Guid>>();
        _multiTenantFilter = GetRequiredService<IDataFilter<IMultiTenant>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<(Guid Id, string Name)> CreateTenantAsync(string name)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync(name + " " + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        return (tenant.Id, tenant.Name);
    }

    /// <summary>Çağıranın bağlamında tek soruluk yayında form.</summary>
    private async Task<DocumentDto> CreatePublishedFormAsync(string title, string slug)
    {
        var form = await _formAppService.CreateAsync(new CreateUpdateFormDto
        {
            Title = title,
            Blocks = new List<CreateBlockDto>
            {
                new() { Type = BlockType.ShortText, Order = 1, Content = "Firma adı", Settings = "{\"required\":true}" }
            }
        });
        await _formAppService.PublishAsync(form.Id, new PublishFormDto { Slug = slug });
        return await _formAppService.GetAsync(form.Id); // yayınla yanıtı alanları taşımaz
    }

    private Task SubmitAsync(DocumentDto form, string answer, Guid? formTenantId = null)
        => _responseAppService.SubmitAsync(new SubmitResponseDto
        {
            DocumentSlug = form.Slug,
            Answers = $"{{\"{form.Blocks.Single().Id}\":\"{answer}\"}}",
            FormTenantId = formTenantId
        });

    private async Task<List<AppResponse>> AllResponsesOfAsync(Guid documentId)
    {
        using (_multiTenantFilter.Disable())
        {
            return await _responseRepository.GetListAsync(r => r.DocumentId == documentId);
        }
    }

    private static string NewSlug(string prefix) => prefix + "-" + Guid.NewGuid().ToString("N")[..6];

    [Fact]
    public async Task Anonim_ziyaretci_kiraci_formunu_baglantidaki_kiraciyla_acar_ve_yanit_kiraciya_yazilir()
    {
        var firm = await CreateTenantAsync("Akım Teknoloji");
        DocumentDto form;
        using (_currentTenant.Change(firm.Id))
        {
            form = await CreatePublishedFormAsync("Teklif talebi", NewSlug("teklif"));
        }

        // Anonim ziyaretçi = kiracısız bağlam. Kiracı bilgisi olmadan form bulunamaz.
        _currentTenant.Id.ShouldBeNull();
        await Should.ThrowAsync<EntityNotFoundException>(() => _publicDocumentAppService.GetBySlugAsync(form.Slug));

        var opened = await _publicDocumentAppService.GetBySlugAsync(form.Slug, firm.Id);
        opened.Title.ShouldBe("Teklif talebi");

        await SubmitAsync(form, "Deniz Lojistik", firm.Id);

        var response = (await AllResponsesOfAsync(form.Id)).ShouldHaveSingleItem();
        response.TenantId.ShouldBe(firm.Id);
    }

    [Fact]
    public async Task Kiraci_kullanicisi_host_formunu_doldurur_host_yaniti_firma_adiyla_gorur()
    {
        var hostForm = await CreatePublishedFormAsync("Proje fikri bilgi formu", NewSlug("proje-fikri"));
        var firm = await CreateTenantAsync("Vektör Yazılım");

        using (_currentTenant.Change(firm.Id))
        {
            (await _publicDocumentAppService.GetBySlugAsync(hostForm.Slug)).Title.ShouldBe("Proje fikri bilgi formu");
            await SubmitAsync(hostForm, "Vektör Yazılım Ltd.");
        }

        var response = (await AllResponsesOfAsync(hostForm.Id)).ShouldHaveSingleItem();
        response.TenantId.ShouldBe(firm.Id);
        (await _documentRepository.GetAsync(hostForm.Id)).ResponseCount.ShouldBe(1);

        // Host: liste, detay, durum, yorum ve istatistik kiracıdaki yanıtı görür.
        var list = await _responseManagementAppService.GetListAsync(new ResponseListFilterDto { DocumentId = hostForm.Id });
        list.TotalCount.ShouldBe(1);
        list.Items.Single().TenantName.ShouldBe(firm.Name);
        (await _responseManagementAppService.GetAsync(response.Id)).TenantName.ShouldBe(firm.Name);
        (await _responseManagementAppService.SetStatusAsync(response.Id, new SetResponseStatusDto { Status = ResponseStatus.Reviewed }))
            .Status.ShouldBe(ResponseStatus.Reviewed);
        await _responseManagementAppService.AddCommentAsync(response.Id, new AddResponseCommentDto { Text = "Görüşmeye çağır" });
        (await _responseManagementAppService.GetAsync(response.Id)).Comments.ShouldHaveSingleItem().Text.ShouldBe("Görüşmeye çağır");
        var stats = await _formAppService.GetStatisticsAsync(hostForm.Id);
        stats.TodayResponseCount.ShouldBe(1);

        // Başka bir kiracı bu yanıtı göremez.
        var other = await CreateTenantAsync("Başka Firma");
        using (_currentTenant.Change(other.Id))
        {
            (await _responseManagementAppService.GetListAsync(new ResponseListFilterDto { DocumentId = hostForm.Id })).TotalCount.ShouldBe(0);
        }
    }

    [Fact]
    public async Task Kiracinin_kendi_formu_ayni_slugli_host_formundan_once_gelir()
    {
        var slug = NewSlug("iletisim");
        await CreatePublishedFormAsync("Host iletişim formu", slug);
        var owner = await CreateTenantAsync("Slug Sahibi");
        var filler = await CreateTenantAsync("Slug Yok");
        using (_currentTenant.Change(owner.Id))
        {
            await CreatePublishedFormAsync("Firma iletişim formu", slug);
            (await _publicDocumentAppService.GetBySlugAsync(slug)).Title.ShouldBe("Firma iletişim formu");
        }

        using (_currentTenant.Change(filler.Id))
        {
            (await _publicDocumentAppService.GetBySlugAsync(slug)).Title.ShouldBe("Host iletişim formu");
        }
    }

    [Fact]
    public async Task Host_kiraci_formunun_yanitlarini_goremez()
    {
        var firm = await CreateTenantAsync("Gizli Yanıt");
        DocumentDto form;
        using (_currentTenant.Change(firm.Id))
        {
            form = await CreatePublishedFormAsync("İç anket", NewSlug("anket"));
            await SubmitAsync(form, "Çalışan");
        }

        var response = (await AllResponsesOfAsync(form.Id)).ShouldHaveSingleItem();
        response.TenantId.ShouldBe(firm.Id);

        _currentTenant.Id.ShouldBeNull();
        (await _responseManagementAppService.GetListAsync(new ResponseListFilterDto { DocumentId = form.Id })).TotalCount.ShouldBe(0);
        (await _responseManagementAppService.GetListAsync(new ResponseListFilterDto())).Items.ShouldNotContain(r => r.Id == response.Id);
        await Should.ThrowAsync<EntityNotFoundException>(() => _responseManagementAppService.GetAsync(response.Id));
    }
}
