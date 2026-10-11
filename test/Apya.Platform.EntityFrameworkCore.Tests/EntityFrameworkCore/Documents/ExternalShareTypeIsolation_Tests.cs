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
/// Girişsiz dış paylaşım sayfası kiracı süzgeci KAPALI çalışır. Belge türü yalnız kimliğiyle
/// aranıyordu: dosyaya başka kiracının tür kimliği yazılmışsa o türün adı ve "gizli alanı var mı"
/// bilgisi dış sayfaya çıkıyordu. Tür ya sistem türüdür ya da bağlantının kiracısının.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ExternalShareTypeIsolation_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Tenant = Guid.Parse("99990000-cccc-4000-8000-000000000071");
    private static readonly Guid OtherTenant = Guid.Parse("99990000-cccc-4000-8000-000000000072");

    private readonly IExternalShareAppService _share;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<Document, Guid> _documentRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentType, Guid> _typeRepository;
    private readonly IRepository<DocumentTypeField, Guid> _fieldRepository;
    private readonly IRepository<DeliveryPackage, Guid> _packageRepository;
    private readonly IRepository<DeliveryPackageItem, Guid> _itemRepository;
    private readonly ICurrentTenant _currentTenant;

    public ExternalShareTypeIsolation_Tests()
    {
        _share = GetRequiredService<IExternalShareAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _documentRepository = GetRequiredService<IRepository<Document, Guid>>();
        _fileRepository = GetRequiredService<IRepository<DocumentFile, Guid>>();
        _typeRepository = GetRequiredService<IRepository<DocumentType, Guid>>();
        _fieldRepository = GetRequiredService<IRepository<DocumentTypeField, Guid>>();
        _packageRepository = GetRequiredService<IRepository<DeliveryPackage, Guid>>();
        _itemRepository = GetRequiredService<IRepository<DeliveryPackageItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private static string Code() => "DPT-" + Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();

    private async Task<Guid> TypeAsync(Guid? tenantId, string name)
    {
        using (_currentTenant.Change(tenantId))
        {
            // TenantId kurucuda ATANIR; CurrentTenant.Change kapsamı tek başına yetmez.
            var type = new DocumentType(Guid.NewGuid(), tenantId, name, Code());
            await _typeRepository.InsertAsync(type, autoSave: true);
            return type.Id;
        }
    }

    /// <summary>Kiracının tek belgeli teslim paketini kurar ve paylaşım bağlantısının jetonunu döner.</summary>
    private async Task<string> SharePackageWithFileOfTypeAsync(Guid documentTypeId)
    {
        using (_currentTenant.Change(Tenant))
        {
            var project = new Project(
                Guid.NewGuid(), Tenant, null, "Dış paylaşım projesi", Code(), "açıklama");
            await _projectRepository.InsertAsync(project, autoSave: true);

            var folder = new Document(Guid.NewGuid(), Tenant, "Klasör", "", project.Id);
            await _documentRepository.InsertAsync(folder, autoSave: true);

            var file = new DocumentFile(
                Guid.NewGuid(), Tenant, folder.Id, "Sözleşme.pdf", documentTypeId, project.Id);
            await _fileRepository.InsertAsync(file, autoSave: true);

            var package = new DeliveryPackage(Guid.NewGuid(), Tenant, project.Id, "Teslim paketi");
            await _packageRepository.InsertAsync(package, autoSave: true);
            await _itemRepository.InsertAsync(
                new DeliveryPackageItem(Guid.NewGuid(), Tenant, package.Id, file.Id, 1), autoSave: true);

            var link = await _share.CreateAsync(new CreateShareLinkDto
            {
                TargetType = ShareTargetType.DeliveryPackage,
                TargetId = package.Id
            });

            return link.Url["/Share/".Length..];
        }
    }

    [Fact]
    public async Task Dis_paylasim_baska_kiracinin_belge_turu_adini_gostermez()
    {
        var foreignType = await TypeAsync(OtherTenant, "Rakip firmanın gizli tür adı");
        using (_currentTenant.Change(OtherTenant))
        {
            await _fieldRepository.InsertAsync(new DocumentTypeField(
                Guid.NewGuid(), OtherTenant, foreignType, "gizliAlan", "Gizli alan", DocumentFieldType.Text,
                isRequired: false, visibility: DocumentFieldVisibility.Confidential), autoSave: true);
        }
        var token = await SharePackageWithFileOfTypeAsync(foreignType);

        // Girişsiz sayfa: kiracı bağlamı yok.
        _currentTenant.Id.ShouldBeNull();
        var view = await _share.ResolveAsync(token, ipHash: null, userAgent: null);

        var item = view.Items.Single();
        item.DocumentFileName.ShouldBe("Sözleşme.pdf");
        item.DocumentTypeName.ShouldBeNull();
        item.IsMasked.ShouldBeFalse("yabancı türün gizli alan bilgisi de çıkmamalı");
    }

    /// <summary>Karşı yön: kiracının kendi türü ve sistem türü görünmeye devam eder.</summary>
    [Fact]
    public async Task Dis_paylasim_kendi_ve_sistem_turunun_adini_gosterir()
    {
        var ownType = await TypeAsync(Tenant, "Kendi türü");
        var systemType = await TypeAsync(null, "Sistem türü");

        var ownView = await _share.ResolveAsync(
            await SharePackageWithFileOfTypeAsync(ownType), ipHash: null, userAgent: null);
        var systemView = await _share.ResolveAsync(
            await SharePackageWithFileOfTypeAsync(systemType), ipHash: null, userAgent: null);

        ownView.Items.Single().DocumentTypeName.ShouldBe("Kendi türü");
        systemView.Items.Single().DocumentTypeName.ShouldBe("Sistem türü");
    }
}
