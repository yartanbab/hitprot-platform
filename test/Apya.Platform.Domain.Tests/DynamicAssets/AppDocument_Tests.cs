using System;
using System.Linq;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.DynamicAssets;

namespace Apya.Platform.Tests.Domain.DynamicAssets;

/// <summary>
/// DOC-04 · Form kaydı yalnız düzenleyicinin BİLDİRDİĞİ alanları silebilir. Yüklenemeyen editör ya da
/// bayat sekme, ekranında olmayan (başkasının eklediği) soruyu silmeye kalkarsa hiçbir şey değişmez.
/// </summary>
public class AppDocument_Tests
{
    private static readonly Guid A = Guid.NewGuid();
    private static readonly Guid B = Guid.NewGuid();
    private static readonly Guid C = Guid.NewGuid();

    private static AppDocument FormWithThreeBlocks()
    {
        var document = new AppDocument(Guid.NewGuid(), "Başvuru formu", "basvuru-formu");
        document.AddBlock(A, BlockType.ShortText, 1, "Adınız", "{}");
        document.AddBlock(B, BlockType.Email, 2, "E-posta", "{}");
        document.AddBlock(C, BlockType.SectionHeader, 3, "Bölüm", "{}");
        return document;
    }

    [Fact]
    public void Bildirilmemis_silme_hicbir_alani_silmez()
    {
        var document = FormWithThreeBlocks();

        var ex = Should.Throw<BusinessException>(() => document.RemoveBlocksNotIn(new[] { A }, new[] { B }));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.FormBlocksOutOfDate);
        ex.Data["Count"].ShouldBe(1);
        document.Blocks.Count.ShouldBe(3);
    }

    [Fact]
    public void Bildirilen_alanlar_silinir()
    {
        var document = FormWithThreeBlocks();

        document.RemoveBlocksNotIn(new[] { A }, new[] { B, C });

        document.Blocks.Select(b => b.Id).ShouldBe(new[] { A });
    }

    [Fact]
    public void Formda_olmayan_bildirim_yok_sayilir()
    {
        var document = FormWithThreeBlocks();

        document.RemoveBlocksNotIn(new[] { A }, new[] { B, C, Guid.NewGuid() });

        document.Blocks.ShouldHaveSingleItem().Id.ShouldBe(A);
    }
}
