using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;
using Shouldly;
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
            }
        });

        var reloaded = await _formAppService.GetAsync(form.Id);
        reloaded.Blocks.Count.ShouldBe(3);
        reloaded.Blocks.ShouldNotContain(b => b.Id == emailId);
        reloaded.Blocks.ShouldNotContain(b => b.Id == foreignId);
        reloaded.Blocks.Single(b => b.Id == nameId).Content.ShouldBe("Adınız");
        reloaded.Blocks.Single(b => b.Content == "Unvan").Id.ShouldNotBe(nameId);
        saved.Blocks.Select(b => b.Id).OrderBy(x => x).ShouldBe(reloaded.Blocks.Select(b => b.Id).OrderBy(x => x));
    }
}
