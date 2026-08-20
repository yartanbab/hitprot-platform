using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Documents;

/// <summary>
/// Dosyalar sekmesinin sunucu davranışları:
///  • "Bu ay yüklenen" sayacını besleyen UploadedAfter süzgeci,
///  • detay panelindeki "İlişkili kayıtlar" listesi,
///  • çöp kutusu ve geri alma.
///
/// Üçü de sessizce yanlış olabilecek türden: süzgeç kaçırırsa sayaç eksik
/// gösterir, ilişkili liste kaçırırsa belge "hiçbir yere bağlı değil" gibi
/// okunur, geri alma eksik çalışırsa açılamayan bir belge bırakır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DocumentFileAppService_ListAndRelated_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IDocumentFileAppService _fileAppService;
    private readonly IRepository<Document, Guid> _documentRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentAttachment, Guid> _attachmentRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<DeliveryPackage, Guid> _packageRepository;
    private readonly IRepository<DeliveryPackageItem, Guid> _packageItemRepository;
    private readonly ICurrentTenant _currentTenant;

    public DocumentFileAppService_ListAndRelated_Tests()
    {
        _fileAppService = GetRequiredService<IDocumentFileAppService>();
        _documentRepository = GetRequiredService<IRepository<Document, Guid>>();
        _fileRepository = GetRequiredService<IRepository<DocumentFile, Guid>>();
        _attachmentRepository = GetRequiredService<IRepository<DocumentAttachment, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _packageRepository = GetRequiredService<IRepository<DeliveryPackage, Guid>>();
        _packageItemRepository = GetRequiredService<IRepository<DeliveryPackageItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<DocumentFile> CreateFileAsync(string name)
    {
        var folder = new Document(Guid.NewGuid(), _currentTenant.Id, name + " klasörü", string.Empty);
        await _documentRepository.InsertAsync(folder, autoSave: true);

        var file = new DocumentFile(Guid.NewGuid(), _currentTenant.Id, folder.Id, name);
        await _fileRepository.InsertAsync(file, autoSave: true);
        return file;
    }

    [Fact]
    public async Task UploadedAfter_o_andan_once_yuklenenleri_disarida_birakir()
    {
        var file = await CreateFileAsync("Bu tur yüklendi.pdf");

        // Yükleme anından SONRAsı: yeni belge sayılmamalı.
        var after = await _fileAppService.GetListAsync(new GetDocumentFilesInput
        {
            MaxResultCount = 1000,
            UploadedAfter = DateTime.Now.AddMinutes(5),
        });

        after.Items.ShouldNotContain(f => f.Id == file.Id);

        // Yükleme anından ÖNCEsi: sayılmalı.
        var before = await _fileAppService.GetListAsync(new GetDocumentFilesInput
        {
            MaxResultCount = 1000,
            UploadedAfter = DateTime.Now.AddDays(-1),
        });

        before.Items.ShouldContain(f => f.Id == file.Id);
    }

    [Fact]
    public async Task UploadedAfter_verilmezse_hepsi_doner()
    {
        var file = await CreateFileAsync("Süzgeçsiz.pdf");

        var result = await _fileAppService.GetListAsync(new GetDocumentFilesInput { MaxResultCount = 1000 });

        result.Items.ShouldContain(f => f.Id == file.Id);
    }

    [Fact]
    public async Task Teslim_paketi_iliskili_kayit_olarak_EK_numarasiyla_doner()
    {
        var file = await CreateFileAsync("Pakete giren belge.pdf");

        // Paketin ProjectId'si gerçek bir projeye FK ile bağlı.
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, grantId: null,
            name: "Paket Projesi", code: "PKG-1", description: "ilişkili kayıt testi");
        await _projectRepository.InsertAsync(project, autoSave: true);

        var package = new DeliveryPackage(
            Guid.NewGuid(), _currentTenant.Id, projectId: project.Id,
            name: "KOSGEB · Ara Rapor", periodCode: "2026-Q2");
        await _packageRepository.InsertAsync(package, autoSave: true);

        var item = new DeliveryPackageItem(Guid.NewGuid(), _currentTenant.Id, package.Id, file.Id, order: 3);
        item.AssignAnnexNumber(3);
        await _packageItemRepository.InsertAsync(item, autoSave: true);

        var detail = await _fileAppService.GetAsync(file.Id);

        var related = detail.Related
            .Where(r => r.Kind == RelatedRecordKind.DeliveryPackage)
            .ShouldHaveSingleItem();

        related.EntityId.ShouldBe(package.Id);
        related.Label.ShouldBe("KOSGEB · Ara Rapor");
        related.Detail.ShouldNotBeNull();
        related.Detail!.ShouldContain("EK-3");
        related.Detail!.ShouldContain("2026-Q2");
    }

    [Fact]
    public async Task Silinen_belge_normal_listede_gorunmez_cop_kutusunda_gorunur()
    {
        var file = await CreateFileAsync("Silinecek.pdf");

        await _fileAppService.DeleteAsync(file.Id);

        var normal = await _fileAppService.GetListAsync(new GetDocumentFilesInput { MaxResultCount = 1000 });
        normal.Items.ShouldNotContain(f => f.Id == file.Id);

        var trash = await _fileAppService.GetListAsync(new GetDocumentFilesInput
        {
            MaxResultCount = 1000,
            OnlyDeleted = true,
        });
        trash.Items.ShouldContain(f => f.Id == file.Id);
    }

    [Fact]
    public async Task Cop_kutusu_yalnizca_silinmisleri_doner()
    {
        var live = await CreateFileAsync("Duran.pdf");
        var gone = await CreateFileAsync("Giden.pdf");
        await _fileAppService.DeleteAsync(gone.Id);

        var trash = await _fileAppService.GetListAsync(new GetDocumentFilesInput
        {
            MaxResultCount = 1000,
            OnlyDeleted = true,
        });

        trash.Items.ShouldContain(f => f.Id == gone.Id);
        trash.Items.ShouldNotContain(f => f.Id == live.Id);
    }

    /// <summary>
    /// Asıl mesele bu: geri alınan belge EKLERİYLE dönmeli. Ekler sert silinseydi
    /// "geri al" açılamayan, indirilemeyen bir belge bırakırdı.
    /// </summary>
    [Fact]
    public async Task Geri_alinan_belge_ekleriyle_birlikte_doner()
    {
        var file = await CreateFileAsync("Ekli belge.pdf");

        var attachment = new DocumentAttachment(Guid.NewGuid())
        {
            TenantId = _currentTenant.Id,
            DocumentId = file.DocumentId,
            DocumentFileId = file.Id,
            FileName = "Ekli belge.pdf",
            StoredFileName = "abc_Ekli-belge.pdf",
            ContentType = "application/pdf",
            FileSize = 1024,
            VersionGroupId = Guid.NewGuid(),
        };
        await _attachmentRepository.InsertAsync(attachment, autoSave: true);

        await _fileAppService.DeleteAsync(file.Id);

        // Silindikten sonra ek de görünmez olmalı (soft-delete).
        (await _attachmentRepository.FindAsync(attachment.Id)).ShouldBeNull();

        await _fileAppService.RestoreAsync(file.Id);

        var restored = await _fileAppService.GetListAsync(new GetDocumentFilesInput { MaxResultCount = 1000 });
        restored.Items.ShouldContain(f => f.Id == file.Id);

        // Ek geri geldi: belge yeniden açılabilir/indirilebilir.
        (await _attachmentRepository.FindAsync(attachment.Id)).ShouldNotBeNull();
    }

    [Fact]
    public async Task Silinmemis_belgede_geri_alma_sessizce_gecer()
    {
        var file = await CreateFileAsync("Zaten duruyor.pdf");

        await Should.NotThrowAsync(() => _fileAppService.RestoreAsync(file.Id));
    }

    [Fact]
    public async Task Hicbir_yere_bagli_olmayan_belgede_iliskili_liste_bostur()
    {
        var file = await CreateFileAsync("Yalnız belge.pdf");

        var detail = await _fileAppService.GetAsync(file.Id);

        // Proje ve iş adımı DTO'da AYRI alan; ilişkili listede tekrarlanmaz.
        detail.Related.ShouldBeEmpty();
    }
}
