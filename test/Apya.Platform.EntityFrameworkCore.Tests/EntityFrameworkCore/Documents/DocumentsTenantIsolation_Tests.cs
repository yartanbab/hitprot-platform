using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Documents;

/// <summary>
/// Belgeler modülünde kiracı yalıtımı: kimliğini bilen başka bir kiracı, bir kiracının uyum paketi
/// kalemlerini ve özel belge türü adını okuyamaz.
///
/// <para>Sistem paketleri ve sistem belge türleri host'ta durduğu için bu servisler kiracı süzgecini
/// kapatarak okur. Kapalı blokta sorgu "sistem ya da benim" koşuluyla yeniden daraltılmalıdır; üç
/// yerde daraltma unutulmuştu ve sorgu yalnız çağıranın verdiği kimliğe bakıyordu.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DocumentsTenantIsolation_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid TenantA = Guid.Parse("55550000-cccc-4000-8000-0000000000a2");
    private static readonly Guid TenantB = Guid.Parse("55550000-cccc-4000-8000-0000000000b2");
    private const string SecretTypeName = "A Firması Gizli Sözleşme Türü";

    private readonly IComplianceAppService _compliance;
    private readonly IDocumentAdminAppService _admin;
    private readonly IRepository<CompliancePackage, Guid> _packageRepository;
    private readonly IRepository<ComplianceRequirement, Guid> _requirementRepository;
    private readonly IRepository<DocumentType, Guid> _typeRepository;
    private readonly ICurrentTenant _currentTenant;

    public DocumentsTenantIsolation_Tests()
    {
        _compliance = GetRequiredService<IComplianceAppService>();
        _admin = GetRequiredService<IDocumentAdminAppService>();
        _packageRepository = GetRequiredService<IRepository<CompliancePackage, Guid>>();
        _requirementRepository = GetRequiredService<IRepository<ComplianceRequirement, Guid>>();
        _typeRepository = GetRequiredService<IRepository<DocumentType, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private Task AsAsync(Guid? tenantId, Func<Task> action) => WithUnitOfWorkAsync(async () =>
    {
        using (_currentTenant.Change(tenantId))
        {
            await action();
        }
    });

    private static string Code() => "YLT-" + Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();

    private async Task<Guid> InsertTypeAsync(Guid? tenantId, string name)
    {
        var id = Guid.NewGuid();
        // TenantId kurucuda ATANIR; CurrentTenant.Change kapsamı tek başına yetmez.
        await AsAsync(tenantId, async () =>
            await _typeRepository.InsertAsync(new DocumentType(id, tenantId, name, Code()), autoSave: true));
        return id;
    }

    /// <summary>Tek kalemli paket; kalem verilen belge türünü ister.</summary>
    private async Task<Guid> InsertPackageAsync(Guid? tenantId, string requirementTitle, Guid? documentTypeId)
    {
        var packageId = Guid.NewGuid();
        await AsAsync(tenantId, async () =>
        {
            await _packageRepository.InsertAsync(
                new CompliancePackage(packageId, tenantId, "Yalıtım paketi", "KOSGEB", Code()), autoSave: true);
            await _requirementRepository.InsertAsync(
                new ComplianceRequirement(
                    Guid.NewGuid(), tenantId, packageId, requirementTitle, ComplianceScope.Project, documentTypeId),
                autoSave: true);
        });
        return packageId;
    }

    [Fact]
    public async Task Kiraci_Baska_Kiracinin_Paket_Kalemlerini_Okuyamaz()
    {
        var typeId = await InsertTypeAsync(TenantA, SecretTypeName);
        var packageId = await InsertPackageAsync(TenantA, "A firmasının iç denetim kalemi", typeId);

        await AsAsync(TenantB, async () =>
            await Should.ThrowAsync<EntityNotFoundException>(
                async () => await _compliance.GetRequirementListAsync(packageId)));
    }

    [Fact]
    public async Task Kiraci_Kendi_Ve_Sistem_Paketinin_Kalemlerini_Okur()
    {
        var ownPackage = await InsertPackageAsync(TenantB, "Kendi kalemim", documentTypeId: null);
        var systemType = await InsertTypeAsync(tenantId: null, "Sistem türü (yalıtım)");
        var systemPackage = await InsertPackageAsync(tenantId: null, "Sistem kalemi", systemType);

        await AsAsync(TenantB, async () =>
        {
            (await _compliance.GetRequirementListAsync(ownPackage)).Single().Title.ShouldBe("Kendi kalemim");

            var system = (await _compliance.GetRequirementListAsync(systemPackage)).Single();
            system.Title.ShouldBe("Sistem kalemi");
            system.DocumentTypeName.ShouldBe("Sistem türü (yalıtım)");
        });
    }

    [Fact]
    public async Task Kalem_Baska_Kiracinin_Belge_Turune_Baglanamaz()
    {
        var foreignType = await InsertTypeAsync(TenantA, SecretTypeName);
        var ownPackage = await InsertPackageAsync(TenantB, "Kendi kalemim", documentTypeId: null);

        await AsAsync(TenantB, async () =>
            await Should.ThrowAsync<EntityNotFoundException>(async () =>
                await _compliance.AddRequirementAsync(ownPackage, new CreateUpdateComplianceRequirementDto
                {
                    Title = "Tür adı yoklaması",
                    DocumentTypeId = foreignType,
                })));

        // Reddedilen istek iz bırakmadı; mevcut kalemde de yabancı tür adı yok.
        await AsAsync(TenantB, async () =>
        {
            var items = await _compliance.GetRequirementListAsync(ownPackage);
            items.Count.ShouldBe(1);
            items.ShouldAllBe(i => i.DocumentTypeName != SecretTypeName);
        });
    }

    [Fact]
    public async Task Kural_Eylemi_Baska_Kiracinin_Belge_Turu_Adini_Gostermez()
    {
        var foreignType = await InsertTypeAsync(TenantA, SecretTypeName);
        var ownType = await InsertTypeAsync(TenantB, "Kendi türüm");

        var ruleId = Guid.Empty;
        await AsAsync(TenantB, async () =>
            ruleId = (await _admin.CreateRuleAsync(new CreateUpdateDocumentRuleDto
            {
                Name = "Yalıtım kuralı " + Guid.NewGuid().ToString("N")[..6],
                Actions = new List<DocumentRuleActionInputDto>
                {
                    new() { ActionType = DocumentRuleActionType.SetDocumentType, Payload = foreignType.ToString() },
                    new() { ActionType = DocumentRuleActionType.SetDocumentType, Payload = ownType.ToString() },
                },
            })).Id);

        // Ekranın yaptığı gibi kaydettikten sonra yeniden okunur.
        DocumentRuleDto rule = null!;
        await AsAsync(TenantB, async () => rule = await _admin.GetRuleAsync(ruleId));

        rule.Actions.Single(a => a.Payload == foreignType.ToString()).PayloadLabel.ShouldBeNull();
        // Kendi türünün adı çözülmeye devam eder.
        rule.Actions.Single(a => a.Payload == ownType.ToString()).PayloadLabel.ShouldBe("Kendi türüm");
    }
}
