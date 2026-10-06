using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Storage;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// DOC-04 · Yüklenen belgenin içerik özeti dolduruluyor.
///
/// <para>Özet alanı ve indeksi baştan vardı; eşleştirme tezgâhı her açılışta okuyup "birebir
/// aynı içerik" uyarısını ona göre veriyordu. Ama hiçbir yükleme yolu alanı doldurmuyordu:
/// aynı fatura iki kez yüklense uyarı hiç çıkmıyordu.</para>
///
/// <para>Bu sınıf yükleme klasörüne dosya YAZAR. Klasör bütün test sınıflarının ortak malı;
/// dosya sayan bir testle aynı anda koşarsa onu rastgele kırar. Klasörü kullanan sınıflar bu
/// yüzden aynı koleksiyonda, sırayla koşar.</para>
/// </summary>
[Collection("Yükleme klasörünü kullanan testler")]
public class DocumentContentHash_Tests : PlatformWebTestBase
{
    private readonly IDocumentAppService _documents;
    private readonly string _root;

    public DocumentContentHash_Tests()
    {
        _documents = GetRequiredService<IDocumentAppService>();
        _root = GetRequiredService<IUploadedFileRootFolderProvider>().GetRootFolder();
    }

    private async Task<Guid> CreateFolderAsync()
    {
        var folderId = Guid.NewGuid();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        await GetRequiredService<IRepository<Document, Guid>>()
            .InsertAsync(new Document(folderId, null, "Özet testi " + folderId.ToString("N")[..6], ""), autoSave: true);
        await uow.CompleteAsync();
        return folderId;
    }

    /// <summary>Yükleme sayfasının yaptığını yapar: baytları depoya yazar, kaydı açar.</summary>
    private async Task<string?> UploadAsync(Guid folderId, string fileName, byte[] content)
    {
        var storedFileName = Guid.NewGuid() + Path.GetExtension(fileName);
        var path = Path.Combine(_root, storedFileName);
        await File.WriteAllBytesAsync(path, content);

        try
        {
            var attachment = await _documents.AddAttachmentAsync(
                folderId, fileName, storedFileName, "application/pdf", content.Length);

            return await StoredHashAsync(attachment.Id);
        }
        finally
        {
            // Yükleme kökü test çıktı klasöründe; koşular arasında dosya birikmesin.
            File.Delete(path);
        }
    }

    private async Task<string?> StoredHashAsync(Guid attachmentId)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        var attachment = await GetRequiredService<IRepository<DocumentAttachment, Guid>>().GetAsync(attachmentId);
        return attachment.ContentHash;
    }

    [Fact]
    public async Task Yuklenen_dosyanin_ozeti_icerigin_sha256_sidir()
    {
        var content = Encoding.UTF8.GetBytes("fatura içeriği " + Guid.NewGuid());
        var expected = Convert.ToHexString(SHA256.HashData(content)).ToLowerInvariant();

        var hash = await UploadAsync(await CreateFolderAsync(), "fatura.pdf", content);

        hash.ShouldBe(expected);
        hash!.Length.ShouldBe(DocumentConsts.ContentHashLength);
    }

    /// <summary>
    /// Çift kayıt tespiti buna dayanır: aynı içerik farklı adla yüklenince özetler EŞİT,
    /// farklı içerik aynı adla yüklenince FARKLI olmalı. Ad hiçbir şey kanıtlamaz.
    /// </summary>
    [Fact]
    public async Task Ayni_icerik_ayni_ozeti_farkli_icerik_farkli_ozeti_verir()
    {
        var folderId = await CreateFolderAsync();
        var invoice = Encoding.UTF8.GetBytes("aynı fatura " + Guid.NewGuid());
        var other = Encoding.UTF8.GetBytes("başka belge " + Guid.NewGuid());

        var first = await UploadAsync(folderId, "fatura.pdf", invoice);
        var copy = await UploadAsync(folderId, "fatura (kopya).pdf", invoice);
        var different = await UploadAsync(folderId, "baska.pdf", other);

        first.ShouldNotBeNull();
        copy.ShouldBe(first);
        different.ShouldNotBe(first);

        // Tezgâhın kullandığı kuralın kendisi: özet eşitse "birebir aynı içerik".
        var a = new MatchDocument(Guid.NewGuid(), "fatura.pdf", null, null, null, first);
        var b = new MatchDocument(Guid.NewGuid(), "fatura (kopya).pdf", null, null, null, copy);
        ExpenseMatchScorer.DetectDuplicate(b, new[] { a, b }).ShouldBe(DuplicateReason.IdenticalContent);
    }

    /// <summary>Özet bir tespit yardımcısıdır: dosya yerinde değilse kayıt yine açılır, özet boş kalır.</summary>
    [Fact]
    public async Task Dosya_yerinde_degilse_kayit_acilir_ozet_bos_kalir()
    {
        var attachment = await _documents.AddAttachmentAsync(
            await CreateFolderAsync(), "yok.pdf", Guid.NewGuid() + ".pdf", "application/pdf", 10);

        (await StoredHashAsync(attachment.Id)).ShouldBeNull();
    }
}
