using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Documents;

/// <summary>
/// Sistem rapor şablonlarını (alıcı setleri) seed eder — host seviyesinde
/// (TenantId = null), sabit GUID'lerle, idempotent.
///
/// Bölüm listesi her şablonda AYNIDIR; şablonlar birbirinden hangi bölümlerin
/// AÇIK geldiğiyle ayrışır. Verisi henüz üretilemeyen bölümler (Faz E: zaman
/// çizelgesi, harcama eşleşmesi, ekip, riskler, kilometre taşları) her şablonda
/// KAPALI doğar — boş sayfa basmaktansa hiç basmamak doğru.
/// </summary>
public class ReportTemplateDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<ReportTemplate, Guid> _templateRepository;
    private readonly IRepository<ReportSection, Guid> _sectionRepository;

    public ReportTemplateDataSeedContributor(
        IRepository<ReportTemplate, Guid> templateRepository,
        IRepository<ReportSection, Guid> sectionRepository)
    {
        _templateRepository = templateRepository;
        _sectionRepository = sectionRepository;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return;
        }

        var definitions = BuildDefinitions();

        var templateIds = definitions.Select(d => d.Id).ToList();
        var existingIds = (await _templateRepository.GetListAsync(t => templateIds.Contains(t.Id)))
            .Select(t => t.Id)
            .ToHashSet();

        var newTemplates = definitions
            .Where(d => !existingIds.Contains(d.Id))
            .Select(d => new ReportTemplate(
                d.Id, tenantId: null, name: d.Name, recipient: d.Recipient,
                issuer: d.Issuer, isSystem: true, order: d.Order))
            .ToList();

        if (newTemplates.Count > 0)
        {
            await _templateRepository.InsertManyAsync(newTemplates, autoSave: true);
        }

        // Bölümler şablon başına ayrı kontrol edilir — yeni bir bölüm tipi eklenirse
        // mevcut kurulumlara da (kapalı olarak) iner.
        var existingSections = await _sectionRepository.GetListAsync(s => templateIds.Contains(s.TemplateId));
        var existingKeys = existingSections
            .Select(s => (s.TemplateId, s.SectionKey))
            .ToHashSet();

        var newSections = new List<ReportSection>();
        foreach (var definition in definitions)
        {
            var order = 0;
            foreach (var key in SectionOrder)
            {
                order++;

                if (existingKeys.Contains((definition.Id, key)))
                {
                    continue;
                }

                var enabled = ReportSectionAvailability.IsAvailable(key) && definition.EnabledSections.Contains(key);

                newSections.Add(new ReportSection(
                    DeterministicSectionId(definition.Id, key), tenantId: null,
                    templateId: definition.Id, sectionKey: key, order: order, isEnabled: enabled));
            }
        }

        if (newSections.Count > 0)
        {
            await _sectionRepository.InsertManyAsync(newSections, autoSave: true);
        }
    }

    /// <summary>
    /// Bölüm id'si (şablon + bölüm) çiftinden deterministik üretilir — seeder
    /// yeniden çalıştığında aynı satır bulunur, mükerrer kayıt oluşmaz.
    ///
    /// Guid baytlarını elle düzenlemek YANLIŞ olur: <c>ToByteArray()</c> karışık
    /// endian'dır ve şablonları ayıran bayt son sırada değildir — üzerine yazmak
    /// tüm şablonlarda aynı id'yi üretir. Bu yüzden çiftin özeti alınır.
    /// </summary>
    private static Guid DeterministicSectionId(Guid templateId, ReportSectionKey key)
    {
        Span<byte> input = stackalloc byte[20];
        templateId.TryWriteBytes(input);
        BitConverter.TryWriteBytes(input[16..], (int)key);

        Span<byte> hash = stackalloc byte[32];
        System.Security.Cryptography.SHA256.HashData(input, hash);

        return new Guid(hash[..16]);
    }

    /// <summary>Raporun doğal okuma sırası; şablonlar bu sırayı devralır.</summary>
    private static readonly ReportSectionKey[] SectionOrder =
    {
        ReportSectionKey.CoverPage,
        ReportSectionKey.ProjectSummary,
        ReportSectionKey.WorkStepProgress,
        ReportSectionKey.Timeline,
        ReportSectionKey.ExpenseDocumentMatch,
        ReportSectionKey.TeamContribution,
        ReportSectionKey.ComplianceStatus,
        ReportSectionKey.MissingDocuments,
        ReportSectionKey.Milestones,
        ReportSectionKey.Risks,
        ReportSectionKey.AnnexIndex,
        ReportSectionKey.AuditTrail,
    };

    private static List<TemplateDefinition> BuildDefinitions()
    {
        // Kurum teslimleri: künye + ilerleme + uygunluk + eksikler + ek indeksi.
        var institution = new[]
        {
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Timeline, ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.ComplianceStatus,
            ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex,
        };

        return new List<TemplateDefinition>
        {
            new(new Guid("c1000000-0000-4000-8000-000000000001"), "KOSGEB ara rapor",
                ReportRecipient.Institution, "KOSGEB", 1, institution),

            new(new Guid("c1000000-0000-4000-8000-000000000002"), "TÜBİTAK 1501 dönem raporu",
                ReportRecipient.Institution, "TÜBİTAK", 2, institution),

            new(new Guid("c1000000-0000-4000-8000-000000000003"), "Banka / finans dosyası",
                ReportRecipient.Bank, null, 3, new[]
                {
                    ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary,
                    ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.AnnexIndex,
                }),

            new(new Guid("c1000000-0000-4000-8000-000000000004"), "Müşteri · şirket raporu",
                ReportRecipient.Customer, null, 4, new[]
                {
                    ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary,
                    ReportSectionKey.WorkStepProgress, ReportSectionKey.Milestones,
                }),

            new(new Guid("c1000000-0000-4000-8000-000000000005"), "Denetçi · YMM dosyası",
                ReportRecipient.Auditor, null, 5, new[]
                {
                    ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary,
                    ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.ComplianceStatus,
                    ReportSectionKey.AnnexIndex, ReportSectionKey.AuditTrail,
                }),

            new(new Guid("c1000000-0000-4000-8000-000000000006"), "İç yönetim özeti",
                ReportRecipient.Internal, null, 6, new[]
                {
                    ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
                    ReportSectionKey.MissingDocuments, ReportSectionKey.Risks,
                }),
        };
    }

    private sealed record TemplateDefinition(
        Guid Id,
        string Name,
        ReportRecipient Recipient,
        string? Issuer,
        int Order,
        IReadOnlyCollection<ReportSectionKey> EnabledSections);
}
