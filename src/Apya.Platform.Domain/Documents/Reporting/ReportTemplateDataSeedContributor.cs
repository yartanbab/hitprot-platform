using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Sistem rapor şablonlarını (alıcı setleri) seed eder — host seviyesinde
/// (TenantId = null), sabit GUID'lerle, idempotent.
///
/// Bölüm listesi her şablonda AYNIDIR; şablonlar birbirinden hangi bölümlerin
/// AÇIK geldiğiyle ayrışır. Bir bölüm, verisi üretilebiliyorsa
/// (<see cref="ReportSectionAvailability"/>) VE şablonun tanımı onu istiyorsa açık doğar.
///
/// <para>Bugün BÜTÜN bölümlerin verisi üretilebiliyor; yeni kurulumda kapalı doğan bölüm
/// "veri yok" demek değildir, o alıcı setinin onu seçmediği anlamına gelir. Eski
/// kurulumlarda durum farklı olabilir: zaman çizelgesi, harcama eşleşmesi, ekip, riskler
/// ve kilometre taşları verisi yokken KAPALI yazıldı ve tohumlayıcı var olan satıra
/// dokunmadığı için öyle duruyor — o bölümleri şablon düzenleyicisinden kullanıcı açar.</para>
///
/// <para>🔴 RPT-02 · Yeni bir bölüm TÜRÜ eklendiğinde iki ayrı küme vardır ve ikisi de
/// burada tamamlanır: sistem şablonları (aşağıdaki tanımlar) ve kiracıların KENDİ
/// oluşturduğu şablonlar. İkincisi eskiden hiç ele alınmıyordu: özel şablonun bölüm
/// satırları oluşturulduğu günün enum'undan yazılır, sonradan eklenen bölüm o şablonda
/// hiç görünmezdi ve açılamazdı.</para>
///
/// <para>Kapanış raporu şablonları (<see cref="BuildClosingReportDefinitions"/>) bu kuralın
/// tek istisnasıdır: açık bölümleri kurumun resmi formundaki SIRAYLA gelir, kapalılar
/// ortak sırayla arkaya dizilir (<see cref="TemplateDefinition.OfficialOrder"/>).</para>
/// </summary>
public class ReportTemplateDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<ReportTemplate, Guid> _templateRepository;
    private readonly IRepository<ReportSection, Guid> _sectionRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly ICurrentTenant _currentTenant;

    public ReportTemplateDataSeedContributor(
        IRepository<ReportTemplate, Guid> templateRepository,
        IRepository<ReportSection, Guid> sectionRepository,
        IDataFilter<IMultiTenant> mtFilter,
        ICurrentTenant currentTenant)
    {
        _templateRepository = templateRepository;
        _sectionRepository = sectionRepository;
        _mtFilter = mtFilter;
        _currentTenant = currentTenant;
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
            // Resmi sıralı şablonda açık bölümler tanımdaki sırayla başa, kalanlar ortak sırayla arkaya.
            var keys = definition.OfficialOrder
                ? definition.EnabledSections.Concat(SectionOrder.Except(definition.EnabledSections))
                : SectionOrder;

            var order = 0;
            foreach (var key in keys)
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

        await BackfillCustomTemplatesAsync();
    }

    /// <summary>
    /// Kiracıların (ve host'un) KENDİ oluşturduğu şablonlara, sonradan eklenen bölüm
    /// türlerinin satırını tamamlar.
    ///
    /// <para>Satır KAPALI ve SONA eklenir: kullanıcının kurduğu rapor kendiliğinden
    /// değişmemeli — yeni bölüm yalnız açılabilir hâle gelir. Yeni oluşturulan özel
    /// şablonda ise bölüm, diğer uygun bölümler gibi açık doğar
    /// (<c>ReportTemplateAppService.CreateAsync</c>).</para>
    ///
    /// <para>Okuma filtre kapalı (şablonlar kiracılara dağınık), yazma her şablonun
    /// kendi kiracı bağlamında.</para>
    /// </summary>
    private async Task BackfillCustomTemplatesAsync()
    {
        List<ReportTemplate> templates;
        List<ReportSection> sections;

        using (_mtFilter.Disable())
        {
            templates = await _templateRepository.GetListAsync(t => !t.IsSystem);
            if (templates.Count == 0)
            {
                return;
            }

            var templateIds = templates.Select(t => t.Id).ToList();
            sections = await _sectionRepository.GetListAsync(s => templateIds.Contains(s.TemplateId));
        }

        var allKeys = Enum.GetValues<ReportSectionKey>();

        foreach (var group in templates.GroupBy(t => t.TenantId))
        {
            using (_currentTenant.Change(group.Key))
            {
                foreach (var template in group)
                {
                    var own = sections.Where(s => s.TemplateId == template.Id).ToList();
                    var present = own.Select(s => s.SectionKey).ToHashSet();
                    var order = own.Count == 0 ? 0 : own.Max(s => s.Order);

                    var missing = allKeys
                        .Where(key => !present.Contains(key))
                        .Select(key => new ReportSection(
                            DeterministicSectionId(template.Id, key), template.TenantId,
                            templateId: template.Id, sectionKey: key, order: ++order, isEnabled: false))
                        .ToList();

                    if (missing.Count > 0)
                    {
                        await _sectionRepository.InsertManyAsync(missing, autoSave: true);
                    }
                }
            }
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

        // 🔴 RPT-02 · Sonradan eklenen bölümler SONA yazılır, okuma sırasına göre araya
        // değil. Mevcut kurulumlarda satırların sıra numarası 1..12 olarak yazılmış
        // durumda; araya eklenen bölüm var olan bir satırla AYNI sıra numarasını alır ve
        // çıktıdaki sıra belirsizleşirdi. Kullanıcı sırayı rapor derleyicide değiştirebilir.
        // İlk altı sistem şablonu bunları açık GETİRMEZ (tanımlarda yoklar): mevcut
        // kurulumların rapor çıktısı bir sonraki DbMigrator turunda kendiliğinden değişmemeli.
        // Kapanış raporu şablonları yeni satır olarak doğduğu için bu kuralın dışındadır.
        ReportSectionKey.BudgetSummary,
        ReportSectionKey.TaskProgress,
        // PRJ-08 · aynı kural: sona yazılır, ilk altı sistem şablonu açık getirmez.
        ReportSectionKey.Indicators,
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

        var definitions = new List<TemplateDefinition>
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

        definitions.AddRange(BuildClosingReportDefinitions());
        return definitions;
    }

    /// <summary>
    /// Hibe veren kurumların proje kapanış (sonuç / nihai) raporu şablonları. Aynı resmi
    /// iskeleti paylaşan formatlar tek şablonda birleştirilmiştir; açık bölümler formun
    /// okuma sırasıyla verilir. Kaynak: 2026-10-31 kurum araştırması
    /// (docs/hibe-kapanis-raporlari/README.md).
    ///
    /// <para>Kimlikler c1000000-…-000000000101'den başlar (101 = 1. kapanış şablonu).
    /// Bir şablonu SİLMEK ya da kimliğini değiştirmek kurulu veritabanlarında yetim satır
    /// bırakır; yeni şablon sona eklenir.</para>
    /// </summary>
    private static IEnumerable<TemplateDefinition> BuildClosingReportDefinitions()
    {
        static TemplateDefinition Closing(int no, string name, string issuer, params ReportSectionKey[] sections)
            => new(new Guid($"c1000000-0000-4000-8000-{no + 100:D12}"), name, ReportRecipient.Institution,
                issuer, 6 + no, sections, OfficialOrder: true);

        // --- TÜBİTAK ve Eureka ---
        // AGY350/351/353 ve Yenilik Destek Programı (1501, 1507, 1509, 1707, 1719) aynı A–J iskeleti.
        yield return Closing(1, "TÜBİTAK TEYDEB proje sonuç raporu", "TÜBİTAK",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Timeline, ReportSectionKey.Milestones, ReportSectionKey.TeamContribution,
            ReportSectionKey.BudgetSummary, ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.Indicators,
            ReportSectionKey.Risks, ReportSectionKey.AuditTrail, ReportSectionKey.ComplianceStatus,
            ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex);

        // 1071 ikili işbirliği / Ufuk ortaklıklarının ulusal tarafı + BİDEB 2247 (PTS sonuç raporu).
        yield return Closing(2, "TÜBİTAK ARDEB / BİDEB sonuç raporu", "TÜBİTAK",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Timeline, ReportSectionKey.Milestones, ReportSectionKey.TeamContribution,
            ReportSectionKey.BudgetSummary, ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.Risks,
            ReportSectionKey.AuditTrail, ReportSectionKey.AnnexIndex);

        // KAMAG: müşteri kuruma ve TÜBİTAK'a ayrı dosya; bütçe künyeden hemen sonra.
        yield return Closing(3, "TÜBİTAK 1007 proje sonu raporu", "TÜBİTAK",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.BudgetSummary,
            ReportSectionKey.WorkStepProgress, ReportSectionKey.Timeline, ReportSectionKey.Milestones,
            ReportSectionKey.TeamContribution, ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.Risks,
            ReportSectionKey.AuditTrail, ReportSectionKey.ComplianceStatus, ReportSectionKey.MissingDocuments,
            ReportSectionKey.AnnexIndex);

        // Tek dönemli proje: dönem raporu fiilen kapanış raporudur.
        yield return Closing(4, "TÜBİTAK 1831 kapanış dönem raporu", "TÜBİTAK",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Milestones, ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.ComplianceStatus,
            ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex);

        // 2223 etkinlik düzenleme + 4006 bilim fuarı: kesin hesap ağırlıklı.
        yield return Closing(5, "TÜBİTAK etkinlik ve fuar sonuç raporu", "TÜBİTAK",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.BudgetSummary,
            ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.ComplianceStatus,
            ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex);

        // Eureka küme / Network ve Ufuk Avrupa ortaklıkları: ulusal rapora EK olarak verilir.
        yield return Closing(6, "Uluslararası ortaklık nihai raporu", "Eureka · Ufuk Avrupa",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Milestones, ReportSectionKey.Timeline, ReportSectionKey.Risks,
            ReportSectionKey.TeamContribution, ReportSectionKey.Indicators, ReportSectionKey.BudgetSummary,
            ReportSectionKey.AnnexIndex);

        yield return Closing(7, "Innowwide final raporu", "Eureka",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Milestones, ReportSectionKey.Timeline, ReportSectionKey.Risks,
            ReportSectionKey.Indicators, ReportSectionKey.BudgetSummary, ReportSectionKey.AnnexIndex);

        // --- Türk kamu kurumları ---
        // Stratejik Ürün (FRM.13.00.05) + İş Geliştirme (FRM.35.00.18). "KOSGEB ara rapor"dan ayrı.
        yield return Closing(8, "KOSGEB proje sonuç raporu", "KOSGEB",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Timeline, ReportSectionKey.Milestones, ReportSectionKey.Risks,
            ReportSectionKey.BudgetSummary, ReportSectionKey.Indicators, ReportSectionKey.AuditTrail,
            ReportSectionKey.AnnexIndex);

        // TEKMER faaliyet (4 ayda bir) / SEGEM gerçekleşme (3 ayda bir) raporu: her dönem aynı form,
        // ayrı kapanış raporu yok — son dönemin raporu kapanış yerine geçer.
        yield return Closing(9, "KOSGEB TEKMER / SEGEM dönem raporu (4 / 3 ayda bir)", "KOSGEB",
            ReportSectionKey.CoverPage, ReportSectionKey.WorkStepProgress, ReportSectionKey.Indicators,
            ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.BudgetSummary, ReportSectionKey.TeamContribution,
            ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex);

        // 9903 tamamlama vizesi + IPARD III ödeme talep paketi: kapanışı sağlayan dosya.
        yield return Closing(10, "Yatırım tamamlama ve nihai ödeme dosyası", "Sanayi ve Teknoloji Bakanlığı · TKDK",
            ReportSectionKey.CoverPage, ReportSectionKey.BudgetSummary, ReportSectionKey.ExpenseDocumentMatch,
            ReportSectionKey.ComplianceStatus, ReportSectionKey.MissingDocuments, ReportSectionKey.Indicators,
            ReportSectionKey.Timeline, ReportSectionKey.AnnexIndex);

        yield return Closing(11, "GSB ÜNİDES sonuç raporu", "Gençlik ve Spor Bakanlığı",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Indicators, ReportSectionKey.AnnexIndex);

        // --- Kalkınma ajansları (Proje Uygulama Rehberi EK 4.1) ---
        // Mali destek, fizibilite, alternatif destek ve faizsiz kredi aynı nihai rapor formatı.
        yield return Closing(12, "Kalkınma ajansı nihai raporu", "Kalkınma ajansları",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Milestones, ReportSectionKey.Timeline, ReportSectionKey.Indicators,
            ReportSectionKey.Risks, ReportSectionKey.TeamContribution, ReportSectionKey.BudgetSummary,
            ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.ComplianceStatus,
            ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex);

        // Hizmeti ajans alır: yararlanıcının mali raporu yok.
        yield return Closing(13, "Kalkınma ajansı teknik destek nihai raporu", "Kalkınma ajansları",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Milestones, ReportSectionKey.Timeline, ReportSectionKey.Indicators,
            ReportSectionKey.Risks, ReportSectionKey.ComplianceStatus, ReportSectionKey.MissingDocuments,
            ReportSectionKey.AnnexIndex);

        // Sözleşmesiz alternatif mali destek (ör. ORAN Keşfet): tur sonrası belge seti.
        yield return Closing(14, "Kalkınma ajansı tur sonrası belge dosyası", "Kalkınma ajansları",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.Timeline,
            ReportSectionKey.Indicators, ReportSectionKey.BudgetSummary, ReportSectionKey.ExpenseDocumentMatch,
            ReportSectionKey.ComplianceStatus, ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex);

        // --- AB programları ---
        // Ufuk Avrupa / EIC + Dijital Avrupa / EACEA: teknik rapor Part A + Part B + mali tablolar.
        yield return Closing(15, "AB Funding & Tenders nihai raporu", "Avrupa Komisyonu",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Milestones, ReportSectionKey.Timeline, ReportSectionKey.Risks,
            ReportSectionKey.Indicators, ReportSectionKey.TeamContribution, ReportSectionKey.BudgetSummary,
            ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.AnnexIndex);

        // KA1 · KA2 · ESC, Beneficiary Module.
        yield return Closing(16, "Erasmus+ Ulusal Ajans nihai raporu", "Türkiye Ulusal Ajansı",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Timeline, ReportSectionKey.Indicators, ReportSectionKey.TeamContribution,
            ReportSectionKey.Risks, ReportSectionKey.BudgetSummary, ReportSectionKey.ComplianceStatus,
            ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex);

        // KIC alt hibeleri (KPI + deliverable + maliyet) ve götürü bedelli startup destekleri.
        yield return Closing(17, "EIT nihai performans ve maliyet raporu", "EIT",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.TaskProgress, ReportSectionKey.Milestones, ReportSectionKey.Indicators,
            ReportSectionKey.Timeline, ReportSectionKey.Risks, ReportSectionKey.BudgetSummary,
            ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.ComplianceStatus, ReportSectionKey.AnnexIndex);

        // --- Vakıflar ve uluslararası fonlar ---
        // AB destekli STK hibeleri, vakıflar, büyükelçilikler, Global EbA, CIVICUS, Sumitomo...
        yield return Closing(18, "Anlatı ve mali nihai rapor", "Vakıflar ve uluslararası fonlar",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Timeline, ReportSectionKey.Milestones, ReportSectionKey.Indicators,
            ReportSectionKey.Risks, ReportSectionKey.BudgetSummary, ReportSectionKey.ExpenseDocumentMatch,
            ReportSectionKey.ComplianceStatus, ReportSectionKey.MissingDocuments, ReportSectionKey.AnnexIndex);

        // Sertifikalı mali rapor (NED FinRep).
        yield return Closing(19, "Demokrasi fonu nihai raporu", "NED · EED",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Milestones, ReportSectionKey.Timeline, ReportSectionKey.Indicators,
            ReportSectionKey.Risks, ReportSectionKey.BudgetSummary, ReportSectionKey.ComplianceStatus,
            ReportSectionKey.AnnexIndex);

        // Cascade hibeler, Wikimedia Rapid Fund, UN Women, hareketlilik dönüş raporları.
        yield return Closing(20, "Kısa sonuç raporu", "Küçük hibe ve hareketlilik fonları",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.WorkStepProgress,
            ReportSectionKey.Milestones, ReportSectionKey.Indicators, ReportSectionKey.BudgetSummary,
            ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.AnnexIndex);

        // Çıktı yayın/film/medya; mali kısım hafif.
        yield return Closing(21, "Yayın ve medya teslim raporu", "Pulitzer · National Geographic · Goethe",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.Milestones,
            ReportSectionKey.Timeline, ReportSectionKey.WorkStepProgress, ReportSectionKey.Indicators,
            ReportSectionKey.TeamContribution, ReportSectionKey.BudgetSummary, ReportSectionKey.ExpenseDocumentMatch,
            ReportSectionKey.AnnexIndex);

        // Aylık teslimat raporlarının sonuncusu.
        yield return Closing(22, "Teslimat bazlı kapanış raporu", "Open Technology Fund",
            ReportSectionKey.CoverPage, ReportSectionKey.ProjectSummary, ReportSectionKey.Milestones,
            ReportSectionKey.TaskProgress, ReportSectionKey.WorkStepProgress, ReportSectionKey.Timeline,
            ReportSectionKey.Indicators, ReportSectionKey.Risks);

        // Anlatı raporu yok; yalnız masraf ve katılım kanıtı (AI4Gov-X, Erasmus for Young Entrepreneurs).
        yield return Closing(23, "Masraf ve katılım kanıt paketi", "AB destek programları",
            ReportSectionKey.CoverPage, ReportSectionKey.ExpenseDocumentMatch, ReportSectionKey.MissingDocuments,
            ReportSectionKey.AnnexIndex);
    }

    private sealed record TemplateDefinition(
        Guid Id,
        string Name,
        ReportRecipient Recipient,
        string? Issuer,
        int Order,
        IReadOnlyCollection<ReportSectionKey> EnabledSections,
        bool OfficialOrder = false);
}
