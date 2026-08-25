using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectFinance;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// Host bağlamından KİRACIYA ait projeye erişim.
///
/// Canlıda görülen hata: /Projects listesi host'a tüm kiracıların projelerini
/// gösteriyor (ProjectAppService.GetListAsync kiracı filtresini bilerek kapatıyor),
/// ama karta basınca 404 dönüyordu — detay sayfasının çağırdığı servisler filtreyi
/// kapatmıyordu. Denetim kaydındaki 8 adet 404'ün tamamı bu desendeydi.
///
/// Testler host bağlamında koşar (CurrentTenant.Id == null); proje başka bir
/// kiracıya yazılır. Düzeltme öncesi 1., 2. ve 3. test EntityNotFoundException
/// ile düşerdi, 4. test boş liste, 5. test TenantId=null görürdü.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class HostTenantProjectAccess_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid OtherTenantId = Guid.Parse("11111111-2222-3333-4444-555555555555");

    private readonly IProjectAppService _projectAppService;
    private readonly IProjectFinanceAppService _financeAppService;
    private readonly IProjectMemberAppService _memberAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly ICurrentTenant _currentTenant;

    public HostTenantProjectAccess_Tests()
    {
        _projectAppService = GetRequiredService<IProjectAppService>();
        _financeAppService = GetRequiredService<IProjectFinanceAppService>();
        _memberAppService = GetRequiredService<IProjectMemberAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _memberRepository = GetRequiredService<IRepository<ProjectMember, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Project> CreateTenantProjectAsync(string code)
    {
        // Testin ön koşulu: host bağlamındayız ama proje BAŞKA bir kiracıya ait.
        _currentTenant.Id.ShouldBeNull("test host bağlamında koşmalı");

        var project = new Project(
            Guid.NewGuid(), OtherTenantId, grantId: null,
            name: "Kiracı Projesi " + code, code: code, description: "Host erişim testi",
            totalBudget: 5000);

        await _projectRepository.InsertAsync(project, autoSave: true);
        return project;
    }

    [Fact]
    public async Task Host_kiraci_projesini_tekil_okuyabilir()
    {
        var project = await CreateTenantProjectAsync("HT-1");

        var dto = await _projectAppService.GetAsync(project.Id);

        dto.Id.ShouldBe(project.Id);
        dto.TenantId.ShouldBe(OtherTenantId);
    }

    [Fact]
    public async Task Host_kiraci_projesinin_finans_ozetini_okuyabilir()
    {
        // 404'ün gerçek kaynağı buydu: ProjectDetails sayfası GetDetailAsync'ten
        // sonra GetSummaryAsync çağırıyor, o da filtreyi kapatmıyordu.
        var project = await CreateTenantProjectAsync("HT-2");

        var summary = await _financeAppService.GetSummaryAsync(project.Id);

        summary.ProjectId.ShouldBe(project.Id);
        summary.Budget.ShouldBe(5000);
    }

    [Fact]
    public async Task Host_kiraci_projesinin_ekiplerini_gorur()
    {
        var project = await CreateTenantProjectAsync("HT-3");
        await _memberRepository.InsertAsync(
            new ProjectMember(Guid.NewGuid(), project.Id, Guid.NewGuid(),
                ProjectMemberRole.Lead, OtherTenantId),
            autoSave: true);

        var members = await _memberAppService.GetListByProjectAsync(project.Id);

        // Düzeltme öncesi burası SESSİZCE boş dönüyordu — hata değil, eksik veri.
        members.Count.ShouldBe(1);
        members.Single().Role.ShouldBe(ProjectMemberRole.Lead);
    }

    [Fact]
    public async Task Host_kiraci_projesine_eklenen_dosya_PROJENIN_kiracisina_yazilir()
    {
        var project = await CreateTenantProjectAsync("HT-4");

        var attachment = await _projectAppService.AddAttachmentAsync(
            project.Id, "rapor.pdf", "stored-ht4.pdf", "application/pdf", 128);

        // TenantId CurrentTenant'tan alınsaydı null olurdu ve kiracı kendi
        // dosyasını göremezdi.
        //
        // Satır kiracıya yazıldığı için host bağlamında filtre AÇIKKEN okunamaz —
        // doğrulama filtreyi kapatarak yapılır (aksi hâlde test kendi kurgusundan düşer).
        var dataFilter = GetRequiredService<Volo.Abp.Data.IDataFilter>();
        var attachmentRepository = GetRequiredService<IRepository<ProjectAttachment, Guid>>();

        using (dataFilter.Disable<IMultiTenant>())
        {
            var stored = await attachmentRepository.FindAsync(attachment.Id);
            stored.ShouldNotBeNull();
            stored!.TenantId.ShouldBe(OtherTenantId);
        }

        var list = await _projectAppService.GetAttachmentsAsync(project.Id);
        list.Count.ShouldBe(1);
    }

    [Fact]
    public async Task Host_kiraci_projesini_guncelleyebilir()
    {
        var project = await CreateTenantProjectAsync("HT-5");

        var input = new Apya.Platform.Projects.Dtos.CreateProjectDto
        {
            Name = "Güncellenmiş ad",
            Code = "HT-5",
            Description = "güncellendi",
            TotalBudget = 7500,
            Currency = "TRY"
        };

        var updated = await _projectAppService.UpdateAsync(project.Id, input);

        updated.Name.ShouldBe("Güncellenmiş ad");
        updated.TotalBudget.ShouldBe(7500);
    }
}
