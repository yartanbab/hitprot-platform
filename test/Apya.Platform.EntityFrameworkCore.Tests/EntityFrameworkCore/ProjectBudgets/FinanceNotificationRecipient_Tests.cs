using System;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.ProjectBudgets;

/// <summary>
/// SÖZLEŞME: finans bildirimi tutar taşır, bu yüzden alıcı listesi izinle süzülür.
///
/// <para>Ekibin tamamına gönderilseydi bütçe rakamı projeye eklenmiş her stajyere
/// ve dış paydaşa düşerdi; hedef sayfanın izin denetimi de bunu kurtarmaz, çünkü
/// rakam zaten bildirim gövdesinde okunur.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FinanceNotificationRecipient_Tests : PlatformEntityFrameworkCoreTestBase
{
    /// <summary>
    /// ABP'nin kullanıcı izin sağlayıcısı. Sabit elle yazılıyor çünkü
    /// <c>UserPermissionValueProvider</c> tipi test projesinden görünmüyor —
    /// aynı yaklaşım <c>PackageAutoPermissionGrant_Tests</c>'te rol sağlayıcısı için de var.
    /// </summary>
    private const string UserProvider = "U";

    private readonly FinanceNotificationRecipientResolver _resolver;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly IPermissionManager _permissionManager;
    private readonly ICurrentTenant _currentTenant;

    public FinanceNotificationRecipient_Tests()
    {
        _resolver          = GetRequiredService<FinanceNotificationRecipientResolver>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _memberRepository  = GetRequiredService<IRepository<ProjectMember, Guid>>();
        _permissionManager = GetRequiredService<IPermissionManager>();
        _currentTenant     = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> NewProjectAsync(Guid? creatorId = null)
    {
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, null,
            "Alıcı testi " + Guid.NewGuid().ToString("N")[..6],
            "PRJ-RCP", "", 100_000m, 0m, "TRY");

        if (creatorId != null)
        {
            // CreatorId'yi ABP denetim altyapısı yazar; testte oturum açmış kullanıcı
            // olmadığı için elle kuruluyor (aynı teknik GrantFunnel_Tests'te de var).
            ObjectHelper.TrySetProperty(project, x => x.CreatorId, () => creatorId);
        }

        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private Task AddMemberAsync(Guid projectId, Guid userId, ProjectMemberRole role)
        => _memberRepository.InsertAsync(
            new ProjectMember(Guid.NewGuid(), projectId, userId, role, _currentTenant.Id),
            autoSave: true);

    private Task GrantBudgetPermissionAsync(Guid userId)
        => _permissionManager.SetAsync(
            PlatformPermissions.Projects.ViewBudget,
            UserProvider,
            userId.ToString(),
            isGranted: true);

    [Fact]
    public async Task Only_Leads_With_Budget_Permission_Should_Receive()
    {
        var projectId = await NewProjectAsync();
        var lead      = Guid.NewGuid();
        var member    = Guid.NewGuid();
        var observer  = Guid.NewGuid();

        await AddMemberAsync(projectId, lead,     ProjectMemberRole.Lead);
        await AddMemberAsync(projectId, member,   ProjectMemberRole.Member);
        await AddMemberAsync(projectId, observer, ProjectMemberRole.Observer);

        // Üçünün de izni var; ayrımı yapan üyelik rolü.
        await GrantBudgetPermissionAsync(lead);
        await GrantBudgetPermissionAsync(member);
        await GrantBudgetPermissionAsync(observer);

        var recipients = await _resolver.ResolveAsync(projectId);

        recipients.ShouldHaveSingleItem().ShouldBe(lead);
    }

    [Fact]
    public async Task Lead_Without_Budget_Permission_Should_Be_Filtered_Out()
    {
        // Üyelik rolü bu depoda YETKİ TAŞIMAZ: Lead olmak bütçeyi görme hakkı vermez.
        var projectId = await NewProjectAsync();
        var yetkili   = Guid.NewGuid();
        var yetkisiz  = Guid.NewGuid();

        await AddMemberAsync(projectId, yetkili,  ProjectMemberRole.Lead);
        await AddMemberAsync(projectId, yetkisiz, ProjectMemberRole.Lead);
        await GrantBudgetPermissionAsync(yetkili);

        var recipients = await _resolver.ResolveAsync(projectId);

        recipients.ShouldHaveSingleItem().ShouldBe(yetkili);
    }

    [Fact]
    public async Task Project_Without_A_Lead_Should_Fall_Back_To_Its_Creator()
    {
        // Üyelik kaydı sonradan geldi; eski projelerin ekibi boş.
        var creator   = Guid.NewGuid();
        var projectId = await NewProjectAsync(creator);
        await GrantBudgetPermissionAsync(creator);

        var recipients = await _resolver.ResolveAsync(projectId);

        recipients.ShouldHaveSingleItem().ShouldBe(creator);
    }

    [Fact]
    public async Task Nobody_Eligible_Should_Yield_An_Empty_List()
    {
        // Gönderecek kimse olmaması hata değil: çağıran taraf sessizce geçer.
        var projectId = await NewProjectAsync();
        await AddMemberAsync(projectId, Guid.NewGuid(), ProjectMemberRole.Lead);

        (await _resolver.ResolveAsync(projectId)).ShouldBeEmpty();
    }
}
