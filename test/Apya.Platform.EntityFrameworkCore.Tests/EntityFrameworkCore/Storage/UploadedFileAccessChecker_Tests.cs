using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Projects;
using Apya.Platform.Storage;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Storage;

/// <summary>
/// KİLİT SÖZLEŞME: <c>/file/get/{fileName}</c> yalnız kimlik değil SAHİPLİK de sorar.
///
/// <para>Regresyon kaynağı: uç, dosyayı yalnız addan çözüyordu ve depolama tek düz
/// klasör olduğu için kiracı sınırı hiçbir katmanda uygulanmıyordu — adı bir kez görmüş
/// başka kiracıdaki kullanıcı dosyayı indirebiliyordu (denetim bulgusu SEC-05).</para>
///
/// <para>İki tuzak burada kilitleniyor: (1) "dosyanın TenantId'si == CurrentTenant.Id"
/// biçiminde naif kontrol, hibe afişini (host katalog verisi, TenantId = null) kiracıya
/// kapatır; (2) görev ekinde TenantId KOLONU YOKTUR, kiracı yalnız göreve join ile
/// çözülür — kolon tabanlı bir kontrol tüm görev eklerini toptan kapatır.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class UploadedFileAccessChecker_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid TenantA = Guid.Parse("33330000-aaaa-4000-8000-000000000011");
    private static readonly Guid TenantB = Guid.Parse("44440000-bbbb-4000-8000-000000000022");

    private readonly IUploadedFileAccessChecker _checker;
    private readonly IRepository<ProjectAttachment, Guid> _projectAttachmentRepository;
    private readonly IRepository<TaskAttachment, Guid> _taskAttachmentRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly ICurrentTenant _currentTenant;

    public UploadedFileAccessChecker_Tests()
    {
        _checker = GetRequiredService<IUploadedFileAccessChecker>();
        _projectAttachmentRepository = GetRequiredService<IRepository<ProjectAttachment, Guid>>();
        _taskAttachmentRepository = GetRequiredService<IRepository<TaskAttachment, Guid>>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>Kontrolü gerçek istekteki gibi bir iş biriminin içinde, verilen kiracı bağlamında çalıştırır.</summary>
    private async Task<bool> CanReadAsync(Guid? tenantId, string fileName)
    {
        var allowed = false;

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                allowed = await _checker.CanReadAsync(fileName);
            }
        });

        return allowed;
    }

    private async Task<string> CreateProjectAttachmentAsync(Guid ownerTenantId)
    {
        var storedFileName = Guid.NewGuid() + ".pdf";

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(ownerTenantId))
            {
                await _projectAttachmentRepository.InsertAsync(new ProjectAttachment
                {
                    TenantId = ownerTenantId,
                    ProjectId = Guid.NewGuid(),
                    FileName = "Sozlesme.pdf",
                    StoredFileName = storedFileName,
                    ContentType = "application/pdf"
                }, autoSave: true);
            }
        });

        return storedFileName;
    }

    [Fact]
    public async Task Baska_Kiracinin_Proje_Ekine_Erisemez()
    {
        var fileName = await CreateProjectAttachmentAsync(TenantA);

        (await CanReadAsync(TenantB, fileName)).ShouldBeFalse(
            "Kiracı B, kiracı A'nın dosyasını indirebiliyor — kiracı sınırı dosya katmanında uygulanmıyor");
    }

    [Fact]
    public async Task Kendi_Proje_Ekine_Erisebilir()
    {
        var fileName = await CreateProjectAttachmentAsync(TenantA);

        (await CanReadAsync(TenantA, fileName)).ShouldBeTrue();
    }

    [Fact]
    public async Task Host_Kiracinin_Dosyasina_Erisebilir()
    {
        var fileName = await CreateProjectAttachmentAsync(TenantA);

        // Host, kiracı projesini zaten açıp düzenleyebiliyor (ProjectAppService.GetAccessibleProjectAsync).
        (await CanReadAsync(null, fileName)).ShouldBeTrue();
    }

    [Fact]
    public async Task Kiraci_Host_Katalogundaki_Hibe_Afisini_Gorebilir()
    {
        var posterFileName = Guid.NewGuid() + ".png";

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(null))
            {
                var grant = new Grant(Guid.NewGuid(), "Afişli Program", "Kurum", maxAmount: 10_000m, minMatchScore: 0);
                grant.SetPoster(posterFileName);
                await _grantRepository.InsertAsync(grant, autoSave: true);
            }
        });

        (await CanReadAsync(TenantB, posterFileName)).ShouldBeTrue(
            "Hibe afişi host katalog verisidir ve kiracı akışında zemin görseli olarak gösterilir");
    }

    [Fact]
    public async Task Gorev_Eki_Kiracisi_Goreve_Join_Ile_Cozulur()
    {
        // AppTaskAttachments'ta TenantId kolonu YOK; sahiplik yalnız görev üzerinden bulunur.
        var storedFileName = Guid.NewGuid() + ".docx";
        var taskId = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(TenantA))
            {
                await _taskRepository.InsertAsync(
                    new TaskItem(taskId, "Ekli görev", tenantId: TenantA, now: new DateTime(2026, 9, 21)),
                    autoSave: true);

                await _taskAttachmentRepository.InsertAsync(new TaskAttachment
                {
                    TaskId = taskId,
                    FileName = "Rapor.docx",
                    StoredFileName = storedFileName,
                    ContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                }, autoSave: true);
            }
        });

        (await CanReadAsync(TenantA, storedFileName)).ShouldBeTrue(
            "Görev eki kolon yerine join ile çözülmeli; aksi hâlde tüm görev ekleri kapanır");

        (await CanReadAsync(TenantB, storedFileName)).ShouldBeFalse();
    }

    [Fact]
    public async Task Hicbir_Kayitta_Gecmeyen_Dosya_Reddedilir()
    {
        (await CanReadAsync(TenantA, Guid.NewGuid() + ".pdf")).ShouldBeFalse();
    }
}
