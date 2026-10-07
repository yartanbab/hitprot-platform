using System;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Documents;

/// <summary>
/// Klasör ağacı kopmaz: içi dolu klasör silinmez, klasör kendi içine ya da var olmayan bir
/// klasöre taşınmaz.
///
/// <para>Klasör uçları (<c>/api/app/document</c>) varsayılan silme ve güncellemeyle açıktı.
/// Silinen klasörün alt klasörleri, belgeleri ve ekleri yerinde kalır: alt klasörler ağaçta kökten
/// erişilemez olur, ekler ise ne indirilebilir ne silinebilir — iki işlem de önce ekin klasörünü
/// arar ve "bulunamadı" verir. Üst klasörü kendisi (ya da bir alt klasörü) yapılan klasör de
/// içindekilerle birlikte ağaçtan düşer. Arayüz bu ikisini yaptırmıyor; yetkili bir API çağrısı
/// yetiyordu.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DocumentFolderIntegrity_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Tenant = Guid.Parse("55550000-cccc-4000-8000-000000000095");

    private readonly IDocumentAppService _documentAppService;
    private readonly IRepository<Document, Guid> _documentRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentAttachment, Guid> _attachmentRepository;
    private readonly ICurrentTenant _currentTenant;

    public DocumentFolderIntegrity_Tests()
    {
        _documentAppService = GetRequiredService<IDocumentAppService>();
        _documentRepository = GetRequiredService<IRepository<Document, Guid>>();
        _fileRepository = GetRequiredService<IRepository<DocumentFile, Guid>>();
        _attachmentRepository = GetRequiredService<IRepository<DocumentAttachment, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>Klasörün içinde ne olduğu.</summary>
    public enum FolderContent { Subfolder, File, Attachment, TrashedFile }

    private Task InTenantAsync(Func<Task> action) => WithUnitOfWorkAsync(async () =>
    {
        using (_currentTenant.Change(Tenant))
        {
            await action();
        }
    });

    private async Task<Guid> InsertFolderAsync(string title, Guid? parentId = null)
    {
        // TenantId kurucuda ATANIR; CurrentTenant.Change kapsamı tek başına yetmez.
        var folder = new Document(Guid.NewGuid(), Tenant, title, "", parentDocumentId: parentId);
        await _documentRepository.InsertAsync(folder, autoSave: true);
        return folder.Id;
    }

    private async Task<(Guid FolderId, Guid AttachmentId)> CreateFolderAsync(FolderContent? content)
    {
        var folderId = Guid.Empty;
        var attachmentId = Guid.Empty;
        await InTenantAsync(async () =>
        {
            folderId = await InsertFolderAsync("Sözleşmeler");

            if (content == FolderContent.Subfolder)
            {
                await InsertFolderAsync("2026", folderId);
                return;
            }

            if (content is FolderContent.File or FolderContent.Attachment or FolderContent.TrashedFile)
            {
                var file = new DocumentFile(Guid.NewGuid(), Tenant, folderId, "Kira sözleşmesi");
                await _fileRepository.InsertAsync(file, autoSave: true);

                // Çöp kutusundaki belge geri getirilebilir; klasörü gidince klasörsüz geri gelir.
                if (content == FolderContent.TrashedFile)
                {
                    await _fileRepository.DeleteAsync(file, autoSave: true);
                }

                if (content == FolderContent.Attachment)
                {
                    var attachment = await _attachmentRepository.InsertAsync(new DocumentAttachment
                    {
                        TenantId = Tenant,
                        DocumentId = folderId,
                        DocumentFileId = file.Id,
                        FileName = "Kira sözleşmesi.pdf",
                        StoredFileName = Guid.NewGuid() + ".pdf",
                        ContentType = "application/pdf",
                        FileSize = 1024,
                        VersionGroupId = Guid.NewGuid(),
                    }, autoSave: true);
                    attachmentId = attachment.Id;
                }
            }
        });
        return (folderId, attachmentId);
    }

    [Theory]
    [InlineData(FolderContent.Subfolder)]
    [InlineData(FolderContent.File)]
    [InlineData(FolderContent.Attachment)]
    [InlineData(FolderContent.TrashedFile)]
    public async Task Ici_Dolu_Klasor_Silinmez(FolderContent content)
    {
        var (folderId, attachmentId) = await CreateFolderAsync(content);

        await InTenantAsync(async () =>
        {
            var ex = await Should.ThrowAsync<BusinessException>(
                async () => await _documentAppService.DeleteAsync(folderId));
            ex.Code.ShouldBe(PlatformDomainErrorCodes.DocumentFolderNotEmpty);
        });

        await InTenantAsync(async () =>
        {
            (await _documentRepository.FindAsync(folderId)).ShouldNotBeNull();

            // Asıl zarar: klasör gidince ek indirilemez hâle geliyordu.
            if (attachmentId != Guid.Empty)
            {
                (await _documentAppService.PrepareDownloadAsync(attachmentId)).ShouldNotBeNull();
            }
        });
    }

    [Fact]
    public async Task Bos_Klasor_Silinir()
    {
        var (folderId, _) = await CreateFolderAsync(content: null);

        await InTenantAsync(async () => await _documentAppService.DeleteAsync(folderId));

        await InTenantAsync(async () =>
            (await _documentRepository.FindAsync(folderId)).ShouldBeNull());
    }

    [Fact]
    public async Task Klasor_Kendi_Icine_Tasinamaz()
    {
        Guid rootId = Guid.Empty, childId = Guid.Empty, grandchildId = Guid.Empty;
        await InTenantAsync(async () =>
        {
            rootId = await InsertFolderAsync("Kök");
            childId = await InsertFolderAsync("Alt", rootId);
            grandchildId = await InsertFolderAsync("Torun", childId);
        });

        // Kendisi, alt klasörü ve alt klasörünün alt klasörü: üçü de döngü kurar.
        foreach (var parentId in new[] { rootId, childId, grandchildId })
        {
            await InTenantAsync(async () =>
            {
                var ex = await Should.ThrowAsync<BusinessException>(async () =>
                    await _documentAppService.UpdateAsync(
                        rootId, new CreateUpdateDocumentDto { Title = "Kök", ParentDocumentId = parentId }));
                ex.Code.ShouldBe(PlatformDomainErrorCodes.DocumentFolderParentInvalid);
            });
        }

        await InTenantAsync(async () =>
            (await _documentRepository.GetAsync(rootId)).ParentDocumentId.ShouldBeNull());
    }

    [Fact]
    public async Task Ust_Klasor_Var_Olan_Bir_Klasor_Olmali()
    {
        var folderId = Guid.Empty;
        await InTenantAsync(async () => folderId = await InsertFolderAsync("Raporlar"));
        var missing = Guid.NewGuid();

        await InTenantAsync(async () =>
        {
            var onUpdate = await Should.ThrowAsync<BusinessException>(async () =>
                await _documentAppService.UpdateAsync(
                    folderId, new CreateUpdateDocumentDto { Title = "Raporlar", ParentDocumentId = missing }));
            onUpdate.Code.ShouldBe(PlatformDomainErrorCodes.DocumentFolderParentInvalid);

            var onCreate = await Should.ThrowAsync<BusinessException>(async () =>
                await _documentAppService.CreateAsync(
                    new CreateUpdateDocumentDto { Title = "Yeni", ParentDocumentId = missing }));
            onCreate.Code.ShouldBe(PlatformDomainErrorCodes.DocumentFolderParentInvalid);
        });
    }

    [Fact]
    public async Task Gecerli_Tasima_Ve_Alt_Klasor_Acma_Calisir()
    {
        Guid firstId = Guid.Empty, secondId = Guid.Empty;
        await InTenantAsync(async () =>
        {
            firstId = await InsertFolderAsync("Birinci");
            secondId = await InsertFolderAsync("İkinci");
        });

        var createdId = Guid.Empty;
        await InTenantAsync(async () =>
        {
            await _documentAppService.UpdateAsync(
                secondId, new CreateUpdateDocumentDto { Title = "İkinci", ParentDocumentId = firstId });
            createdId = (await _documentAppService.CreateAsync(
                new CreateUpdateDocumentDto { Title = "Üçüncü", ParentDocumentId = secondId })).Id;
        });

        await InTenantAsync(async () =>
        {
            (await _documentRepository.GetAsync(secondId)).ParentDocumentId.ShouldBe(firstId);
            (await _documentRepository.GetAsync(createdId)).ParentDocumentId.ShouldBe(secondId);
        });
    }
}
