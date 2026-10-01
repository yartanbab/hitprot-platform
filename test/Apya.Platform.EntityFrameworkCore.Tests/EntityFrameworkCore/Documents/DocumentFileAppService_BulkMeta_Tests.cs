using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Authorization;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Documents;

/// <summary>
/// Yükleme kuyruğunun toplu künyesi (DOC-01). Kuyruk eskiden tek belgenin tam değiştirme
/// ucunu (UpdateMetaAsync) üç alanlı nesneyle çağırıyordu: proje bağı, tutar, tarihler,
/// durum, etiketler, dış referans ve görünen ad siliniyordu. ApplyBulkMetaAsync yalnız
/// dolu gelen alanı yazmalı; tür ise görünürlükle AYNI okumadan gelmeli (host sistem
/// tiplerinde saklama bitişi siliniyordu).
///
/// Her test kendi kiracısında koşar: klasör/dosya/tür satırları 'new' ile kiracı
/// bloğunun İÇİNDE kurulur (ABP TenantId'yi nesne kurulurken atar).
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DocumentFileAppService_BulkMeta_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly DateTime DocDate = new(2026, 9, 1);

    private readonly IDocumentFileAppService _fileAppService;
    private readonly IRepository<Document, Guid> _documentRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentType, Guid> _typeRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ICurrentTenant _currentTenant;

    public DocumentFileAppService_BulkMeta_Tests()
    {
        _fileAppService = GetRequiredService<IDocumentFileAppService>();
        _documentRepository = GetRequiredService<IRepository<Document, Guid>>();
        _fileRepository = GetRequiredService<IRepository<DocumentFile, Guid>>();
        _typeRepository = GetRequiredService<IRepository<DocumentType, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private static string Code() => "QA" + Guid.NewGuid().ToString("N")[..8];

    private async Task<DocumentType> CreateTypeAsync(Guid? tenantId, int? retentionMonths)
        => await _typeRepository.InsertAsync(
            new DocumentType(Guid.NewGuid(), tenantId, "Tür " + Code(), Code(), retentionMonths: retentionMonths),
            autoSave: true);

    /// <summary>
    /// Künyesi DOLU belge: özel ad, tür, proje, tutar, tarih + dönem, dış referans,
    /// Kesin durum, saklama bitişi ve 'rapor' etiketi. Çağıranın kiracı bloğunda çağrılır.
    /// </summary>
    private async Task<(DocumentFile File, Guid ProjectId)> CreateFilledFileAsync(DocumentType type, bool locked = false)
    {
        var project = await _projectRepository.InsertAsync(new Project(
            Guid.NewGuid(), _currentTenant.Id, grantId: null,
            name: "Künye Projesi", code: "P" + Guid.NewGuid().ToString("N")[..6], description: "toplu künye testi"),
            autoSave: true);

        var folder = await _documentRepository.InsertAsync(
            new Document(Guid.NewGuid(), _currentTenant.Id, "Künye klasörü", string.Empty, projectId: project.Id),
            autoSave: true);

        var file = new DocumentFile(Guid.NewGuid(), _currentTenant.Id, folder.Id, "Özel ad", type.Id, project.Id);
        file.SetAmount(1234.56m, "TRY");
        file.SetDates(DocDate, "2026-Q3", null);
        file.SetExternalRef("EXT-1");
        file.ChangeStatus(DocumentFileStatus.Final);
        file.ApplyRetention(type.RetentionMonths, DocDate);
        if (locked)
        {
            file.Lock();
        }

        await _fileRepository.InsertAsync(file, autoSave: true);

        if (!locked)
        {
            await _fileAppService.BulkTagAsync(new BulkTagDocumentFilesDto
            {
                DocumentFileIds = new List<Guid> { file.Id },
                Tags = new List<string> { "rapor" },
            });
        }

        return (file, project.Id);
    }

    [Fact]
    public async Task Yalniz_donem_verilince_diger_kunye_alanlari_korunur()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var typeA = await CreateTypeAsync(_currentTenant.Id, 24);
            var (file, projectId) = await CreateFilledFileAsync(typeA);

            var applied = await _fileAppService.ApplyBulkMetaAsync(new BulkApplyDocumentFileMetaDto
            {
                DocumentFileIds = new List<Guid> { file.Id },
                PeriodCode = "2026-Q4",
            });

            applied.ShouldBe(1);

            var after = await _fileAppService.GetAsync(file.Id);
            after.PeriodCode.ShouldBe("2026-Q4");
            after.DocumentTypeId.ShouldBe(typeA.Id);
            after.ProjectId.ShouldBe(projectId);
            after.Amount.ShouldBe(1234.56m);
            after.Currency.ShouldBe("TRY");
            after.DocumentDate.ShouldBe(DocDate);
            after.ExternalRef.ShouldBe("EXT-1");
            after.Status.ShouldBe(DocumentFileStatus.Final);
            after.DisplayName.ShouldBe("Özel ad");
            after.RetentionUntil.ShouldBe(DocDate.AddMonths(24));
            after.Tags.ShouldBe(new List<string> { "rapor" });
        }
    }

    [Fact]
    public async Task Yalniz_tur_verilince_donem_ve_proje_korunur_saklama_yeni_turden_hesaplanir()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var typeA = await CreateTypeAsync(_currentTenant.Id, 24);
            var typeB = await CreateTypeAsync(_currentTenant.Id, 12);
            var (file, projectId) = await CreateFilledFileAsync(typeA);

            var applied = await _fileAppService.ApplyBulkMetaAsync(new BulkApplyDocumentFileMetaDto
            {
                DocumentFileIds = new List<Guid> { file.Id },
                DocumentTypeId = typeB.Id,
            });

            applied.ShouldBe(1);

            var after = await _fileRepository.GetAsync(file.Id);
            after.DocumentTypeId.ShouldBe(typeB.Id);
            after.PeriodCode.ShouldBe("2026-Q3");
            after.ProjectId.ShouldBe(projectId);
            after.Status.ShouldBe(DocumentFileStatus.Final);
            after.RetentionUntil.ShouldBe(DocDate.AddMonths(12));
        }
    }

    [Fact]
    public async Task Kilitli_belge_atlanir_ve_sayilmaz()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var typeA = await CreateTypeAsync(_currentTenant.Id, 24);
            var typeB = await CreateTypeAsync(_currentTenant.Id, 12);
            var (file, _) = await CreateFilledFileAsync(typeA, locked: true);

            var applied = await _fileAppService.ApplyBulkMetaAsync(new BulkApplyDocumentFileMetaDto
            {
                DocumentFileIds = new List<Guid> { file.Id },
                DocumentTypeId = typeB.Id,
                PeriodCode = "2026-Q4",
            });

            applied.ShouldBe(0);

            var after = await _fileRepository.GetAsync(file.Id);
            after.DocumentTypeId.ShouldBe(typeA.Id);
            after.PeriodCode.ShouldBe("2026-Q3");
            after.RetentionUntil.ShouldBe(DocDate.AddMonths(24));
        }
    }

    [Theory]
    [InlineData(null)]
    [InlineData("   ")]
    public async Task Tur_ve_donem_bossa_hicbir_sey_yazilmaz(string? period)
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var typeA = await CreateTypeAsync(_currentTenant.Id, 24);
            var (file, _) = await CreateFilledFileAsync(typeA);

            var applied = await _fileAppService.ApplyBulkMetaAsync(new BulkApplyDocumentFileMetaDto
            {
                DocumentFileIds = new List<Guid> { file.Id },
                PeriodCode = period,
            });

            applied.ShouldBe(0);
            (await _fileRepository.GetAsync(file.Id)).PeriodCode.ShouldBe("2026-Q3");
        }
    }

    [Fact]
    public async Task Host_sistem_tipi_secilince_saklama_bitisi_hesaplanir()
    {
        DocumentType hostType;
        using (_currentTenant.Change(null))
        {
            hostType = await CreateTypeAsync(null, 36);
        }

        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var typeA = await CreateTypeAsync(_currentTenant.Id, 24);
            var (file, _) = await CreateFilledFileAsync(typeA);

            var applied = await _fileAppService.ApplyBulkMetaAsync(new BulkApplyDocumentFileMetaDto
            {
                DocumentFileIds = new List<Guid> { file.Id },
                DocumentTypeId = hostType.Id,
            });

            applied.ShouldBe(1);

            var after = await _fileRepository.GetAsync(file.Id);
            after.DocumentTypeId.ShouldBe(hostType.Id);
            // Kiracı süzgeçli FindAsync host tipini göremiyor, bitişi null'a yazıyordu.
            after.RetentionUntil.ShouldBe(DocDate.AddMonths(36));
        }
    }

    [Fact]
    public async Task Baska_kiracinin_tipi_reddedilir_parti_yazilmaz()
    {
        DocumentType foreignType;
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            foreignType = await CreateTypeAsync(_currentTenant.Id, 6);
        }

        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var typeA = await CreateTypeAsync(_currentTenant.Id, 24);
            var (file, _) = await CreateFilledFileAsync(typeA);

            await Should.ThrowAsync<EntityNotFoundException>(() => _fileAppService.ApplyBulkMetaAsync(
                new BulkApplyDocumentFileMetaDto
                {
                    DocumentFileIds = new List<Guid> { file.Id },
                    DocumentTypeId = foreignType.Id,
                    PeriodCode = "2026-Q4",
                }));

            var after = await _fileRepository.GetAsync(file.Id);
            after.DocumentTypeId.ShouldBe(typeA.Id);
            after.PeriodCode.ShouldBe("2026-Q3");
        }
    }

    [Fact]
    public async Task Detay_paneli_host_sistem_tipinde_saklama_bitisini_silmez()
    {
        DocumentType hostType;
        using (_currentTenant.Change(null))
        {
            hostType = await CreateTypeAsync(null, 36);
        }

        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var typeA = await CreateTypeAsync(_currentTenant.Id, 24);
            var (file, _) = await CreateFilledFileAsync(typeA);

            await _fileAppService.UpdateMetaAsync(file.Id, new UpdateDocumentFileMetaDto
            {
                DisplayName = "Özel ad",
                DocumentTypeId = hostType.Id,
                Amount = 1234.56m,
                Currency = "TRY",
                DocumentDate = DocDate,
                PeriodCode = "2026-Q3",
                Status = DocumentFileStatus.Final,
                Tags = new List<string> { "rapor" },
            });

            var after = await _fileRepository.GetAsync(file.Id);
            after.DocumentTypeId.ShouldBe(hostType.Id);
            after.RetentionUntil.ShouldBe(DocDate.AddMonths(36));
        }
    }

    [Fact]
    public void ApplyBulkMetaAsync_ManageMeta_izni_ister()
    {
        var info = typeof(DocumentFileAppService).GetMethod(
            nameof(DocumentFileAppService.ApplyBulkMetaAsync), BindingFlags.Public | BindingFlags.Instance);
        info.ShouldNotBeNull();

        info.GetCustomAttributes<AuthorizeAttribute>(inherit: true)
            .Select(a => a.Policy)
            .ShouldContain(PlatformPermissions.Documents.ManageMeta);
    }
}
