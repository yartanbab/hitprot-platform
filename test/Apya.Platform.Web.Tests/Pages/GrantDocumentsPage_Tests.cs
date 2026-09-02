using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 2b · İki taraflı evrak takibi. Test host'u HOST bağlamında koşar, yani çağıran
/// danışman rolündedir — inceleme yolları burada doğrulanabilir.
/// </summary>
public class GrantDocumentsPage_Tests : PlatformWebTestBase
{
    private readonly IGrantApplicationDocumentAppService _documents;

    public GrantDocumentsPage_Tests()
    {
        _documents = GetRequiredService<IGrantApplicationDocumentAppService>();
    }

    /// <summary>Programa iki evrak şartı + açık çağrıya başvuru kurar.</summary>
    private async Task<Guid> CreateApplicationAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);

        var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var reqRepo = GetRequiredService<IRepository<GrantDocumentRequirement, Guid>>();
        var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();

        var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();
        var existing = await reqRepo.GetListAsync(r => r.GrantId == call.GrantId);

        if (existing.All(r => r.Name != "Proje öneri formu"))
        {
            await reqRepo.InsertAsync(
                new GrantDocumentRequirement(Guid.NewGuid(), call.GrantId, 0, "Proje öneri formu")
                {
                    Obligation = GrantDocumentObligation.Zorunlu,
                    UploaderParty = GrantPartyRole.Firma
                }, autoSave: true);
        }
        if (existing.All(r => r.Name != "Ortaklık protokolü"))
        {
            await reqRepo.InsertAsync(
                new GrantDocumentRequirement(Guid.NewGuid(), call.GrantId, 1, "Ortaklık protokolü")
                {
                    Obligation = GrantDocumentObligation.Kosullu,
                    UploaderParty = GrantPartyRole.Danisman,
                    RequiresESignature = true
                }, autoSave: true);
        }

        var application = await appRepo.FirstOrDefaultAsync(a => a.GrantCallId == call.Id);
        if (application == null)
        {
            application = new GrantApplication(Guid.NewGuid(), null, call.Id);
            await appRepo.InsertAsync(application, autoSave: true);
        }

        await uow.CompleteAsync();
        return application.Id;
    }

    private async Task<Guid> UploadAsync(Guid documentId, string fileName = "form-v1.pdf")
    {
        var dto = await _documents.RegisterVersionAsync(new RegisterGrantDocumentVersionInput
        {
            DocumentId = documentId,
            StoredFileName = Guid.NewGuid() + ".pdf",
            OriginalFileName = fileName,
            SizeBytes = 1024,
            Note = "şablondan oluşturuldu"
        });
        return dto.Documents.Single(d => d.Id == documentId).LatestVersion!.Id;
    }

    [Fact]
    public async Task Evrak_Sayfasi_Render_Oluyor()
    {
        var id = await CreateApplicationAsync();

        var html = await GetResponseAsStringAsync($"/Grants/Documents?id={id}");

        html.ShouldContain("apya-doc-layout");
        html.ShouldContain("Kuruma gönderim paketi");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Documents[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Documents.js içermeli");
    }

    [Fact]
    public async Task Id_Verilmezse_Listeye_Yonlendirir()
    {
        var response = await Client.GetAsync("/Grants/Documents");

        ((int)response.StatusCode).ShouldBe(302);
        response.Headers.Location!.ToString().ShouldContain("/Grants");
    }

    [Fact]
    public async Task Kontrol_Listesi_Cagri_Sablonundan_Turetilir()
    {
        var id = await CreateApplicationAsync();

        var dto = await _documents.GetAsync(id);

        dto.Documents.ShouldContain(d => d.Name == "Proje öneri formu"
                                         && d.Obligation == GrantDocumentObligation.Zorunlu);
        dto.Documents.ShouldContain(d => d.Name == "Ortaklık protokolü" && d.RequiresESignature);
        dto.ESignatureItems.ShouldContain(e => e.Name == "Ortaklık protokolü");
    }

    [Fact]
    public async Task Turetme_Idempotent_Ikinci_Okumada_Cogalmaz()
    {
        var id = await CreateApplicationAsync();

        var first = await _documents.GetAsync(id);
        var second = await _documents.GetAsync(id);

        second.Documents.Count.ShouldBe(first.Documents.Count);
    }

    [Fact]
    public async Task Yuklenen_Evrak_Incelemeye_Duser_Ve_Surum_Artar()
    {
        var id = await CreateApplicationAsync();
        var document = (await _documents.GetAsync(id)).Documents.First();

        await UploadAsync(document.Id);
        var afterFirst = (await _documents.GetAsync(id)).Documents.Single(d => d.Id == document.Id);
        afterFirst.Status.ShouldBe(GrantDocumentStatus.Incelemede);
        afterFirst.LatestVersionNo.ShouldBe(1);

        await UploadAsync(document.Id, "form-v2.pdf");
        var afterSecond = (await _documents.GetAsync(id)).Documents.Single(d => d.Id == document.Id);
        afterSecond.LatestVersionNo.ShouldBe(2);
        afterSecond.Versions.Count.ShouldBe(2, "sürümler silinmez, geçmiş denetim izidir");
        afterSecond.Versions.First().VersionNo.ShouldBe(2, "en yeni sürüm başta döner");
    }

    [Fact]
    public async Task Yuklenmemis_Evrak_Onaylanamaz()
    {
        var id = await CreateApplicationAsync();
        var document = (await _documents.GetAsync(id)).Documents.First();

        await Should.ThrowAsync<BusinessException>(async () =>
            await _documents.ApproveAsync(new ReviewGrantDocumentInput { DocumentId = document.Id }));
    }

    [Fact]
    public async Task Onay_Ve_Revizyon_Durumu_Degistirir()
    {
        var id = await CreateApplicationAsync();
        var document = (await _documents.GetAsync(id)).Documents.First();
        await UploadAsync(document.Id);

        var approved = await _documents.ApproveAsync(new ReviewGrantDocumentInput { DocumentId = document.Id });
        approved.Documents.Single(d => d.Id == document.Id).Status.ShouldBe(GrantDocumentStatus.Onaylandi);

        var revised = await _documents.RequestRevisionAsync(new RequestGrantDocumentRevisionInput
        {
            DocumentId = document.Id,
            Note = "Teknik özet eksik."
        });
        var row = revised.Documents.Single(d => d.Id == document.Id);
        row.Status.ShouldBe(GrantDocumentStatus.RevizyonIstendi);
        row.ReviewNote.ShouldBe("Teknik özet eksik.");
    }

    [Fact]
    public async Task Yeni_Surum_Revizyon_Notunu_Temizler()
    {
        var id = await CreateApplicationAsync();
        var document = (await _documents.GetAsync(id)).Documents.First();
        await UploadAsync(document.Id);
        await _documents.RequestRevisionAsync(new RequestGrantDocumentRevisionInput
        {
            DocumentId = document.Id,
            Note = "Teknik özet eksik."
        });

        await UploadAsync(document.Id, "form-v2.pdf");

        var row = (await _documents.GetAsync(id)).Documents.Single(d => d.Id == document.Id);
        row.Status.ShouldBe(GrantDocumentStatus.Incelemede);
        row.ReviewNote.ShouldBeNull("düzeltme yüklendi, eski gerekçe ekranda kalmamalı");
    }

    [Fact]
    public async Task Hazirlik_Yalniz_Zorunlu_Evrak_Uzerinden_Olculur()
    {
        var id = await CreateApplicationAsync();
        var console = await _documents.GetAsync(id);
        var mandatory = console.Documents.First(d => d.Obligation == GrantDocumentObligation.Zorunlu);

        await UploadAsync(mandatory.Id);
        var after = await _documents.ApproveAsync(new ReviewGrantDocumentInput { DocumentId = mandatory.Id });

        after.MandatoryApprovedCount.ShouldBe(after.MandatoryCount);
        after.ReadyPercent.ShouldBe(100, "koşullu evrak eksikken de kuruma hazır sayılır");
    }

    [Fact]
    public async Task Pakete_Yalniz_Onayli_Evrakin_Son_Surumu_Girer()
    {
        var id = await CreateApplicationAsync();
        var console = await _documents.GetAsync(id);
        var first = console.Documents[0];
        var second = console.Documents[1];

        await UploadAsync(first.Id);
        await UploadAsync(first.Id, "form-v2.pdf");
        await _documents.ApproveAsync(new ReviewGrantDocumentInput { DocumentId = first.Id });
        await UploadAsync(second.Id, "protokol.pdf"); // onaylanmadı

        var content = await _documents.GetPackageContentAsync(id);

        content.Entries.Count.ShouldBe(1, "yalnız onaylı evrak paketlenir");
        content.Entries[0].EntryName.ShouldStartWith("01-");
        content.Entries[0].EntryName.ShouldEndWith(".pdf");
    }

    [Fact]
    public async Task Elle_Eklenen_Evrak_Kosullu_Sayilir()
    {
        var id = await CreateApplicationAsync();

        var dto = await _documents.AddAsync(new AddGrantDocumentInput
        {
            ApplicationId = id,
            Name = "Kurumun ek talebi",
            UploaderParty = GrantPartyRole.Firma
        });

        var added = dto.Documents.Single(d => d.Name == "Kurumun ek talebi");
        added.Obligation.ShouldBe(GrantDocumentObligation.Kosullu,
            "şablon dışı evrak gönderim paketini bloke etmemeli");
    }

    [Fact]
    public async Task Hatirlatma_Karsi_Tarafin_Eksigini_Sayar()
    {
        var id = await CreateApplicationAsync();
        await _documents.GetAsync(id);

        // Çağıran host (danışman); karşı taraf firma → firmadan beklenen zorunlu evrak sayılır.
        var result = await _documents.SendReminderAsync(id);

        result.MissingCount.ShouldBeGreaterThan(0);
        result.NotifiedUserCount.ShouldBeGreaterThan(0);
    }

    [Fact]
    public async Task Gonderilen_Basvuruda_Evrak_Degistirilemez()
    {
        var id = await CreateApplicationAsync();
        var document = (await _documents.GetAsync(id)).Documents.First();

        var wizard = GetRequiredService<IGrantApplicationWizardAppService>();
        await wizard.SubmitAsync(id);

        await Should.ThrowAsync<BusinessException>(async () => await UploadAsync(document.Id));
        await Should.ThrowAsync<BusinessException>(async () =>
            await _documents.AddAsync(new AddGrantDocumentInput { ApplicationId = id, Name = "Geç kalan evrak" }));
    }
}
