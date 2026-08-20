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
/// Dosyalar sekmesinin iki yeni sunucu davranışı:
///  • "Bu ay yüklenen" sayacını besleyen UploadedAfter süzgeci,
///  • detay panelindeki "İlişkili kayıtlar" listesi.
///
/// İkisi de sessizce yanlış olabilecek türden: süzgeç kaçırırsa sayaç eksik
/// gösterir, ilişkili liste kaçırırsa belge "hiçbir yere bağlı değil" gibi
/// okunur ve kullanıcı onu yanlışlıkla siler.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DocumentFileAppService_ListAndRelated_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IDocumentFileAppService _fileAppService;
    private readonly IRepository<Document, Guid> _documentRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<DeliveryPackage, Guid> _packageRepository;
    private readonly IRepository<DeliveryPackageItem, Guid> _packageItemRepository;
    private readonly ICurrentTenant _currentTenant;

    public DocumentFileAppService_ListAndRelated_Tests()
    {
        _fileAppService = GetRequiredService<IDocumentFileAppService>();
        _documentRepository = GetRequiredService<IRepository<Document, Guid>>();
        _fileRepository = GetRequiredService<IRepository<DocumentFile, Guid>>();
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
    public async Task Hicbir_yere_bagli_olmayan_belgede_iliskili_liste_bostur()
    {
        var file = await CreateFileAsync("Yalnız belge.pdf");

        var detail = await _fileAppService.GetAsync(file.Id);

        // Proje ve iş adımı DTO'da AYRI alan; ilişkili listede tekrarlanmaz.
        detail.Related.ShouldBeEmpty();
    }
}
