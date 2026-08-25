using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// Proje eki ve kapak görseli akışı.
///
/// Kritik senaryo: "Yeni Proje" modalı önce CreateAsync, HEMEN ARDINDAN
/// AddAttachmentAsync çağırıyor. AddAttachmentAsync artık projeyi okuyup
/// erişim/kiracı doğrulaması yapıyor — proje aynı UoW içinde henüz yazılmamışsa
/// bu okuma EntityNotFoundException'a düşer ve "dosyalı proje oluşturma" kırılır.
/// Aşağıdaki ilk test tam olarak o sırayı koşturur.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectAttachmentAppService_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectAppService _projectAppService;
    private readonly IRepository<ProjectAttachment, Guid> _attachmentRepository;

    public ProjectAttachmentAppService_Tests()
    {
        _projectAppService = GetRequiredService<IProjectAppService>();
        _attachmentRepository = GetRequiredService<IRepository<ProjectAttachment, Guid>>();
    }

    private static CreateProjectDto NewProjectInput(string code) => new()
    {
        Name = "Ek Testi " + code,
        Code = code,
        Description = "Ek akışı testi",
        TotalBudget = 1000,
        Currency = "TRY"
    };

    [Fact]
    public async Task Olusturulan_projeye_hemen_ardindan_dosya_eklenebilir()
    {
        var project = await _projectAppService.CreateAsync(NewProjectInput("ATT-1"));

        var attachment = await _projectAppService.AddAttachmentAsync(
            project.Id, "sozlesme.pdf", "stored-1.pdf", "application/pdf", 2048, "İmzalı nüsha");

        attachment.Id.ShouldNotBe(Guid.Empty);
        attachment.ProjectId.ShouldBe(project.Id);
        attachment.IsImage.ShouldBeFalse();
        attachment.Title.ShouldBe("İmzalı nüsha");
    }

    [Fact]
    public async Task Ekler_listelenir_ve_silinince_saklanan_ad_doner()
    {
        var project = await _projectAppService.CreateAsync(NewProjectInput("ATT-2"));

        await _projectAppService.AddAttachmentAsync(
            project.Id, "plan.xlsx", "stored-2.xlsx", "application/vnd.ms-excel", 512);
        var image = await _projectAppService.AddAttachmentAsync(
            project.Id, "saha.png", "stored-3.png", "image/png", 4096);

        var list = await _projectAppService.GetAttachmentsAsync(project.Id);
        list.Count.ShouldBe(2);
        list.Single(x => x.Id == image.Id).IsImage.ShouldBeTrue();

        var storedFileName = await _projectAppService.DeleteAttachmentAsync(image.Id);
        storedFileName.ShouldBe("stored-3.png");

        (await _projectAppService.GetAttachmentsAsync(project.Id)).Count.ShouldBe(1);
        (await _attachmentRepository.FindAsync(image.Id)).ShouldBeNull();
    }

    [Fact]
    public async Task Kapak_gorseli_ayarlanir_degistirilir_ve_kaldirilir()
    {
        var project = await _projectAppService.CreateAsync(NewProjectInput("ATT-3"));

        // İlk atamada değiştirilen bir dosya yok.
        (await _projectAppService.SetCoverImageAsync(project.Id, "cover-1.png")).ShouldBeNull();
        (await _projectAppService.GetAsync(project.Id)).CoverImageFileName.ShouldBe("cover-1.png");

        // Değiştirmede ESKİ dosya adı döner ki çağıran diskten silebilsin.
        (await _projectAppService.SetCoverImageAsync(project.Id, "cover-2.png")).ShouldBe("cover-1.png");

        (await _projectAppService.RemoveCoverImageAsync(project.Id)).ShouldBe("cover-2.png");
        (await _projectAppService.GetAsync(project.Id)).CoverImageFileName.ShouldBeNull();
    }
}
