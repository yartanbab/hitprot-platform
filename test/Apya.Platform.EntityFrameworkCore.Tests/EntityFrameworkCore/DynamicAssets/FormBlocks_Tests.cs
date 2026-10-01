using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.DynamicAssets;

/// <summary>
/// Yanıtlar alan kimliğiyle saklanır. Düzenleyici her kayıtta bütün alanları silip yeniden
/// eklediğinde kimlikler değişiyor, eski yanıtlar sorusundan kopuyordu (yanıt ekranında "Soru",
/// dışa aktarımda boş hücre). Kimliği gelen alan artık yerinde güncellenir.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FormBlocks_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IFormAppService _formAppService;
    private readonly IRepository<AppResponse, Guid> _responseRepository;

    public FormBlocks_Tests()
    {
        _formAppService = GetRequiredService<IFormAppService>();
        _responseRepository = GetRequiredService<IRepository<AppResponse, Guid>>();
    }

    private static CreateBlockDto Block(BlockType type, int order, string content, Guid? id = null, string settings = "{}")
        => new() { Id = id, Type = type, Order = order, Content = content, Settings = settings };

    private Task<DocumentDto> CreateFormAsync()
        => _formAppService.CreateAsync(new CreateUpdateFormDto
        {
            Title = "Başvuru formu " + Guid.NewGuid().ToString("N")[..6],
            Blocks = new List<CreateBlockDto>
            {
                Block(BlockType.ShortText, 1, "Adınız"),
                Block(BlockType.Email, 2, "E-posta")
            }
        });

    private static Guid IdOf(DocumentDto form, string content) => form.Blocks.Single(b => b.Content == content).Id;

    [Fact]
    public async Task Kayit_mevcut_alanlarin_kimligini_korur_ve_yanitlar_eslesmeye_devam_eder()
    {
        var form = await CreateFormAsync();
        var nameId = IdOf(form, "Adınız");
        var emailId = IdOf(form, "E-posta");
        await _responseRepository.InsertAsync(
            new AppResponse(Guid.NewGuid(), form.Id, JsonSerializer.Serialize(new Dictionary<string, string>
            {
                [nameId.ToString()] = "Ayşe Yılmaz",
                [emailId.ToString()] = "ayse@firma.test"
            })),
            autoSave: true);

        // Sıra değişir, bir alanın türü ve metni değişir, sona yeni alan eklenir.
        var saved = await _formAppService.UpdateBlocksAsync(form.Id, new UpdateFormBlocksDto
        {
            Blocks = new List<CreateBlockDto>
            {
                Block(BlockType.Email, 1, "İş e-postası", emailId, "{\"required\":true}"),
                Block(BlockType.LongText, 2, "Adınız ve soyadınız", nameId),
                Block(BlockType.Phone, 3, "Telefon")
            }
        });

        saved.Blocks.Count.ShouldBe(3);
        var email = saved.Blocks.Single(b => b.Id == emailId);
        email.Order.ShouldBe(1);
        email.Content.ShouldBe("İş e-postası");
        email.Settings.ShouldBe("{\"required\":true}");
        var name = saved.Blocks.Single(b => b.Id == nameId);
        name.Order.ShouldBe(2);
        name.Type.ShouldBe(BlockType.LongText);
        saved.Blocks.Single(b => b.Order == 3).Id.ShouldNotBe(Guid.Empty);

        // Veritabanından yeniden okununca da yanıtın her anahtarı formun bir alanını gösterir.
        var reloaded = await _formAppService.GetAsync(form.Id);
        var blockIds = reloaded.Blocks.Select(b => b.Id.ToString()).ToHashSet();
        var response = (await _responseRepository.GetListAsync(r => r.DocumentId == form.Id)).Single();
        using var answers = JsonDocument.Parse(response.Answers);
        answers.RootElement.EnumerateObject().Select(p => p.Name).ShouldAllBe(key => blockIds.Contains(key));
    }

    [Fact]
    public async Task Listede_olmayan_alan_silinir_tanimadik_kimlik_yeni_alan_olur()
    {
        var form = await CreateFormAsync();
        var nameId = IdOf(form, "Adınız");
        var emailId = IdOf(form, "E-posta");
        var foreignId = Guid.NewGuid();

        var saved = await _formAppService.UpdateBlocksAsync(form.Id, new UpdateFormBlocksDto
        {
            Blocks = new List<CreateBlockDto>
            {
                Block(BlockType.ShortText, 1, "Adınız", nameId),
                Block(BlockType.Number, 2, "Çalışan sayısı", foreignId),
                // Aynı kimlik ikinci kez gelirse ilk alanı ezmez, yeni alan olur.
                Block(BlockType.ShortText, 3, "Unvan", nameId)
            },
            // Silme bildirilir; bildirilmeyen silme reddedilir (DOC-04).
            RemovedBlockIds = { emailId }
        });

        var reloaded = await _formAppService.GetAsync(form.Id);
        reloaded.Blocks.Count.ShouldBe(3);
        reloaded.Blocks.ShouldNotContain(b => b.Id == emailId);
        reloaded.Blocks.ShouldNotContain(b => b.Id == foreignId);
        reloaded.Blocks.Single(b => b.Id == nameId).Content.ShouldBe("Adınız");
        reloaded.Blocks.Single(b => b.Content == "Unvan").Id.ShouldNotBe(nameId);
        saved.Blocks.Select(b => b.Id).OrderBy(x => x).ShouldBe(reloaded.Blocks.Select(b => b.Id).OrderBy(x => x));
    }

    /// <summary>
    /// DOC-04 · Yüklenemeyen editör ya da bayat sekme, ekranında olmayan alanı silmeye kalkarsa kayıt
    /// HİÇBİR şey yazmadan reddedilir; aynı silme bildirilirse geçer.
    /// </summary>
    [Fact]
    public async Task Bildirilmemis_alan_silme_reddedilir_ve_hicbir_sey_yazilmaz()
    {
        var form = await CreateFormAsync();
        var nameId = IdOf(form, "Adınız");
        var emailId = IdOf(form, "E-posta");

        var ex = await Should.ThrowAsync<BusinessException>(() => _formAppService.UpdateBlocksAsync(form.Id, new UpdateFormBlocksDto
        {
            Blocks = new List<CreateBlockDto> { Block(BlockType.ShortText, 1, "Adınız soyadınız", nameId) }
        }));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.FormBlocksOutOfDate);
        ex.Data["Count"].ShouldBe(1);
        var untouched = await _formAppService.GetAsync(form.Id);
        untouched.Blocks.Count.ShouldBe(2);
        untouched.Blocks.Single(b => b.Id == nameId).Content.ShouldBe("Adınız");

        await _formAppService.UpdateBlocksAsync(form.Id, new UpdateFormBlocksDto
        {
            Blocks = new List<CreateBlockDto> { Block(BlockType.ShortText, 1, "Adınız soyadınız", nameId) },
            RemovedBlockIds = { emailId }
        });

        var saved = await _formAppService.GetAsync(form.Id);
        saved.Blocks.ShouldHaveSingleItem().Content.ShouldBe("Adınız soyadınız");
    }

    /// <summary>
    /// DOC-02 · Yeni alana aynı kayıtta kurulan koşul, alanın düzenleyicideki geçici kimliğini gösterir.
    /// Sunucu onu yeni alanın kalıcı kimliğine çevirmezse koşul hiçbir alana bağlanmaz.
    /// </summary>
    [Fact]
    public async Task Yeni_alana_kurulan_kosul_ilk_kayitta_kalici_kimlige_baglanir()
    {
        var form = await _formAppService.CreateAsync(new CreateUpdateFormDto
        {
            Title = "Katılım formu " + Guid.NewGuid().ToString("N")[..6],
            Blocks = new List<CreateBlockDto>
            {
                new() { ClientId = "w06hu9nb", Type = BlockType.Select, Order = 1, Content = "Katılacak mısınız?", Settings = "{\"options\":[\"Evet\",\"Hayır\"]}" },
                new()
                {
                    ClientId = "k3j9x0aa", Type = BlockType.ShortText, Order = 2, Content = "Kaç kişi?",
                    Settings = "{\"helpText\":\"Kaç kişi katılacak?\",\"visibleWhen\":{\"blockId\":\"w06hu9nb\",\"op\":\"eq\",\"value\":\"Hayır\"}}"
                }
            }
        });

        var reloaded = await _formAppService.GetAsync(form.Id);
        var parent = reloaded.Blocks.Single(b => b.Order == 1);
        var child = reloaded.Blocks.Single(b => b.Order == 2);
        FormVisibilityRule.Parse(child.Settings)!.BlockId.ShouldBe(parent.Id);
        // Yeniden yazılan ayarda Türkçe metin kaçışsız kalır.
        child.Settings.ShouldContain("\"Hayır\"");
        child.Settings.ShouldContain("Kaç kişi katılacak?");
    }

    [Fact]
    public async Task Guncellemede_yeni_ust_alan_ve_zincir_ayni_kayitta_eslenir()
    {
        var form = await CreateFormAsync();
        var nameId = IdOf(form, "Adınız");
        var emailId = IdOf(form, "E-posta");

        var saved = await _formAppService.UpdateBlocksAsync(form.Id, new UpdateFormBlocksDto
        {
            Blocks = new List<CreateBlockDto>
            {
                Block(BlockType.ShortText, 1, "Adınız", nameId),
                Block(BlockType.Email, 2, "E-posta", emailId),
                new() { ClientId = "p1", Type = BlockType.Dropdown, Order = 3, Content = "Projeniz", Settings = $"{{\"source\":\"{FormChoiceSources.TenantProjects}\"}}" },
                new()
                {
                    ClientId = "t1", Type = BlockType.Dropdown, Order = 4, Content = "Göreviniz",
                    Settings = $"{{\"source\":\"{FormChoiceSources.TenantProjectTasks}\",\"dependsOn\":\"p1\"}}"
                }
            }
        });

        var parent = saved.Blocks.Single(b => b.Order == 3);
        var child = saved.Blocks.Single(b => b.Order == 4);
        FormChoiceProvider.DependsOnBlockOf(child.Type, child.Settings).ShouldBe(parent.Id);
    }

    [Fact]
    public async Task Esi_olmayan_gecici_kimlik_ve_bozuk_ayar_oldugu_gibi_kalir()
    {
        const string dangling = "{\"visibleWhen\":{\"blockId\":\"yok\",\"op\":\"answered\"}}";
        const string notJson = "json değil";

        var form = await _formAppService.CreateAsync(new CreateUpdateFormDto
        {
            Title = "Ayar formu " + Guid.NewGuid().ToString("N")[..6],
            Blocks = new List<CreateBlockDto>
            {
                new() { ClientId = "a1", Type = BlockType.ShortText, Order = 1, Content = "Birinci", Settings = dangling },
                new() { ClientId = "a2", Type = BlockType.ShortText, Order = 2, Content = "İkinci", Settings = notJson }
            }
        });

        var reloaded = await _formAppService.GetAsync(form.Id);
        reloaded.Blocks.Single(b => b.Order == 1).Settings.ShouldBe(dangling);
        reloaded.Blocks.Single(b => b.Order == 2).Settings.ShouldBe(notJson);
    }

    /// <summary>
    /// Bayat sekme: başka sekmede silinmiş alan GUID'iyle geri gelir ve yeni kimlik alır; ona bağlı koşul da
    /// o yeni kimliğe taşınır.
    /// </summary>
    [Fact]
    public async Task Formda_olmayan_eski_kimlige_bagli_kosul_yeni_kimlige_tasinir()
    {
        var form = await CreateFormAsync();
        var nameId = IdOf(form, "Adınız");
        var emailId = IdOf(form, "E-posta");
        var staleId = Guid.NewGuid();

        var saved = await _formAppService.UpdateBlocksAsync(form.Id, new UpdateFormBlocksDto
        {
            Blocks = new List<CreateBlockDto>
            {
                Block(BlockType.ShortText, 1, "Adınız", nameId),
                Block(BlockType.Email, 2, "E-posta", emailId),
                Block(BlockType.Select, 3, "Geri gelen alan", staleId, "{\"options\":[\"Evet\"]}"),
                Block(BlockType.ShortText, 4, "Bağlı alan", settings: $"{{\"visibleWhen\":{{\"blockId\":\"{staleId}\",\"op\":\"answered\"}}}}")
            }
        });

        var revived = saved.Blocks.Single(b => b.Order == 3);
        revived.Id.ShouldNotBe(staleId);
        FormVisibilityRule.Parse(saved.Blocks.Single(b => b.Order == 4).Settings)!.BlockId.ShouldBe(revived.Id);
    }

    [Fact]
    public async Task Ayni_kimligin_ikinci_kopyasi_referans_calmaz()
    {
        var form = await CreateFormAsync();
        var nameId = IdOf(form, "Adınız");
        var emailId = IdOf(form, "E-posta");

        var saved = await _formAppService.UpdateBlocksAsync(form.Id, new UpdateFormBlocksDto
        {
            Blocks = new List<CreateBlockDto>
            {
                Block(BlockType.ShortText, 1, "Adınız", nameId),
                Block(BlockType.ShortText, 2, "Adınız (kopya)", nameId),
                Block(BlockType.Email, 3, "E-posta", emailId, $"{{\"visibleWhen\":{{\"blockId\":\"{nameId}\",\"op\":\"answered\"}}}}")
            }
        });

        saved.Blocks.Single(b => b.Order == 2).Id.ShouldNotBe(nameId);
        FormVisibilityRule.Parse(saved.Blocks.Single(b => b.Order == 3).Settings)!.BlockId.ShouldBe(nameId);
    }
}
