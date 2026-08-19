using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Documents;

/// <summary>
/// Sistem kurum paketlerini (KOSGEB Ar-Ge, TÜBİTAK 1501) ve kontrol listesi
/// kalemlerini seed eder. DocumentType seed'i ile aynı desen: host seviyesinde
/// (TenantId = null), sabit GUID'lerle, idempotent.
///
/// Kalemler <see cref="DocumentTypeDataSeedContributor"/>'daki tip GUID'lerine FK ile
/// bağlanır. ABP contributor'ların çalışma sırasını GARANTİ ETMEZ ve eksik tip
/// insert sırasında FK ihlali verir (SetNull yalnız silmede geçerlidir), bu yüzden
/// tip seeder'ı burada açıkça çağrılır — idempotent olduğu için iki kez çalışması zararsız.
///
/// UYARI: buradaki listeler ÖRNEK/BAŞLANGIÇ içeriğidir — gerçek KOSGEB/TÜBİTAK
/// mevzuatının tam listesi değildir. Kiracı Faz D'de (Yönetim) düzenleyebilecek.
/// </summary>
public class CompliancePackageDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    /* DocumentTypeDataSeedContributor ile aynı sabitler. */
    private static readonly Guid TypeInvoice = new("a1000000-0000-4000-8000-000000000001");
    private static readonly Guid TypePayroll = new("a1000000-0000-4000-8000-000000000002");
    private static readonly Guid TypeReport = new("a1000000-0000-4000-8000-000000000003");
    private static readonly Guid TypeContract = new("a1000000-0000-4000-8000-000000000004");
    private static readonly Guid TypeTestReport = new("a1000000-0000-4000-8000-000000000005");
    private static readonly Guid TypeOfficialLetter = new("a1000000-0000-4000-8000-000000000006");

    private readonly IRepository<CompliancePackage, Guid> _packageRepository;
    private readonly IRepository<ComplianceRequirement, Guid> _requirementRepository;
    private readonly DocumentTypeDataSeedContributor _documentTypeSeeder;

    public CompliancePackageDataSeedContributor(
        IRepository<CompliancePackage, Guid> packageRepository,
        IRepository<ComplianceRequirement, Guid> requirementRepository,
        DocumentTypeDataSeedContributor documentTypeSeeder)
    {
        _packageRepository = packageRepository;
        _requirementRepository = requirementRepository;
        _documentTypeSeeder = documentTypeSeeder;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return;
        }

        // Sıra garantisi: kalemlerin FK'sı belge tiplerine bakar.
        await _documentTypeSeeder.SeedAsync(context);

        var definitions = BuildDefinitions();

        var packageIds = definitions.Select(d => d.Id).ToList();
        var existingPackageIds = (await _packageRepository.GetListAsync(p => packageIds.Contains(p.Id)))
            .Select(p => p.Id)
            .ToHashSet();

        var newPackages = definitions
            .Where(d => !existingPackageIds.Contains(d.Id))
            .Select(d => new CompliancePackage(
                d.Id, tenantId: null, name: d.Name, issuer: d.Issuer, code: d.Code,
                description: d.Description, isSystem: true, order: d.Order))
            .ToList();

        if (newPackages.Count > 0)
        {
            await _packageRepository.InsertManyAsync(newPackages, autoSave: true);
        }

        var allRequirementIds = definitions.SelectMany(d => d.Requirements.Select(r => r.Id)).ToList();
        var existingRequirementIds = (await _requirementRepository.GetListAsync(r => allRequirementIds.Contains(r.Id)))
            .Select(r => r.Id)
            .ToHashSet();

        var newRequirements = new List<ComplianceRequirement>();
        foreach (var definition in definitions)
        {
            var order = 0;
            foreach (var requirement in definition.Requirements)
            {
                order++;

                if (existingRequirementIds.Contains(requirement.Id))
                {
                    continue;
                }

                newRequirements.Add(new ComplianceRequirement(
                    requirement.Id,
                    tenantId: null,
                    packageId: definition.Id,
                    title: requirement.Title,
                    scope: requirement.Scope,
                    documentTypeId: requirement.DocumentTypeId,
                    isBlocking: requirement.IsBlocking,
                    order: order));
            }
        }

        if (newRequirements.Count > 0)
        {
            await _requirementRepository.InsertManyAsync(newRequirements, autoSave: true);
        }
    }

    private static List<PackageDefinition> BuildDefinitions() => new()
    {
        new PackageDefinition(
            new Guid("b1000000-0000-4000-8000-000000000001"),
            "KOSGEB Ar-Ge Destek Programı", "KOSGEB", "KOSGEB_ARGE",
            "Ar-Ge ve inovasyon destek programı ara/sonuç raporu belge seti.", 1,
            new List<RequirementDefinition>
            {
                new(new Guid("b1010000-0000-4000-8000-000000000001"), "Dönem ara raporu", ComplianceScope.Period, TypeReport, true),
                new(new Guid("b1010000-0000-4000-8000-000000000002"), "Gider dökümü ve fatura seti", ComplianceScope.Period, TypeInvoice, true),
                new(new Guid("b1010000-0000-4000-8000-000000000003"), "Personel bordroları", ComplianceScope.Period, TypePayroll, true),
                new(new Guid("b1010000-0000-4000-8000-000000000004"), "SGK borcu yoktur yazısı", ComplianceScope.Period, TypeOfficialLetter, true),
                new(new Guid("b1010000-0000-4000-8000-000000000005"), "Vergi borcu yoktur yazısı", ComplianceScope.Period, TypeOfficialLetter, false),
                new(new Guid("b1010000-0000-4000-8000-000000000006"), "İş adımı çıktı/test raporu", ComplianceScope.WorkStep, TypeTestReport, false),
                new(new Guid("b1010000-0000-4000-8000-000000000007"), "Hizmet alımı sözleşmeleri", ComplianceScope.Project, TypeContract, false),
            }),

        new PackageDefinition(
            new Guid("b1000000-0000-4000-8000-000000000002"),
            "TÜBİTAK 1501 Sanayi Ar-Ge", "TÜBİTAK", "TUBITAK_1501",
            "1501 sanayi Ar-Ge projeleri destekleme programı dönem raporu belge seti.", 2,
            new List<RequirementDefinition>
            {
                new(new Guid("b1020000-0000-4000-8000-000000000001"), "AGY311 dönem raporu", ComplianceScope.Period, TypeReport, true),
                new(new Guid("b1020000-0000-4000-8000-000000000002"), "Mali rapor eki faturalar", ComplianceScope.Period, TypeInvoice, true),
                new(new Guid("b1020000-0000-4000-8000-000000000003"), "Personel bordro ve SGK bildirgeleri", ComplianceScope.Period, TypePayroll, true),
                new(new Guid("b1020000-0000-4000-8000-000000000004"), "YMM tasdik raporu", ComplianceScope.Period, TypeOfficialLetter, true),
                new(new Guid("b1020000-0000-4000-8000-000000000005"), "İş paketi teknik çıktı raporu", ComplianceScope.WorkStep, TypeTestReport, true),
                new(new Guid("b1020000-0000-4000-8000-000000000006"), "Alt yüklenici sözleşmeleri", ComplianceScope.Project, TypeContract, false),
                new(new Guid("b1020000-0000-4000-8000-000000000007"), "Bağımsız test kuruluşu onay yazısı", ComplianceScope.WorkStep, TypeOfficialLetter, false),
            }),

        new PackageDefinition(
            new Guid("b1000000-0000-4000-8000-000000000003"),
            "Banka / finans dosyası", "Banka", "BANK_FILE",
            "Kredi veya teminat başvurusu için istenen asgari belge seti.", 3,
            new List<RequirementDefinition>
            {
                new(new Guid("b1030000-0000-4000-8000-000000000001"), "Güncel sözleşme", ComplianceScope.Project, TypeContract, true),
                new(new Guid("b1030000-0000-4000-8000-000000000002"), "Dönem gider dökümü", ComplianceScope.Period, TypeInvoice, false),
                new(new Guid("b1030000-0000-4000-8000-000000000003"), "Vergi ve SGK borcu yoktur yazıları", ComplianceScope.Period, TypeOfficialLetter, true),
            }),
    };

    private sealed record PackageDefinition(
        Guid Id, string Name, string Issuer, string Code, string Description, int Order,
        List<RequirementDefinition> Requirements);

    private sealed record RequirementDefinition(
        Guid Id, string Title, ComplianceScope Scope, Guid? DocumentTypeId, bool IsBlocking);
}
