using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.CustomerLedger;
using Apya.Platform.Customers;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Microsoft.Extensions.Configuration;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.Timing;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;
using TaskComment = Apya.Platform.Tasks.TaskComment;

namespace Apya.Platform.Data;

/// <summary>
/// Müşteriye platformun uçtan uca mantığını göstermek için kurgulanmış demo senaryosu:
/// 10 proje, alt görevli görev ağacı, cari/kasa/fatura/tahsilat/gider/gelir zinciri.
/// <para>
/// Tarihler <see cref="IClock"/>'tan alınan "bugün"e göre göreli üretilir; demo hangi gün
/// açılırsa açılsın gecikmiş / bugün / yaklaşan kırılımı anlamlı kalır.
/// </para>
/// <para>
/// <see cref="PlatformTestDataSeedContributor.SeedDemoDataConfigKey"/> bayrağı açık değilse
/// hiçbir şey yapmaz — DbMigrator production'a karşı koşarsa demo veri sızmaz.
/// Yalnız host bağlamında (TenantId == null) çalışır ve tablo doluysa tekrar yazmaz.
/// </para>
/// </summary>
public class DemoScenarioDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IConfiguration _configuration;
    private readonly IGuidGenerator _guid;
    private readonly IClock _clock;
    private readonly IdentityUserManager _userManager;
    private readonly InvoiceManager _invoiceManager;

    private readonly IRepository<Customer, Guid> _customers;
    private readonly IRepository<CashAccount, Guid> _cashAccounts;
    private readonly IRepository<CashMovement, Guid> _cashMovements;
    private readonly IRepository<CustomerLedgerEntry, Guid> _ledger;
    private readonly IRepository<Project, Guid> _projects;
    private readonly IRepository<ProjectMember, Guid> _projectMembers;
    private readonly IRepository<TaskItem, Guid> _tasks;
    private readonly IRepository<TaskChecklistItem, Guid> _checklist;
    private readonly IRepository<TaskComment, Guid> _comments;
    private readonly IRepository<Tag, Guid> _tags;
    private readonly IRepository<TaskTagAssignment, Guid> _tagAssignments;
    private readonly IRepository<Expense, Guid> _expenses;
    private readonly IRepository<IncomeEntry, Guid> _incomes;
    private readonly IRepository<Invoice, Guid> _invoices;
    private readonly IRepository<Payment, Guid> _payments;

    /// <summary>Görev kodu (GRV-n) için tenant-içi artan sıra; TaskManager ile aynı mantık.</summary>
    private int _nextTaskNumber = 1;

    private DateTime _today;
    private Guid[] _userIds = Array.Empty<Guid>();
    private Guid[] _cashIds = Array.Empty<Guid>();
    private Guid[] _customerIds = Array.Empty<Guid>();
    private Guid[] _tagIds = Array.Empty<Guid>();

    public DemoScenarioDataSeedContributor(
        IConfiguration configuration,
        IGuidGenerator guid,
        IClock clock,
        IdentityUserManager userManager,
        InvoiceManager invoiceManager,
        IRepository<Customer, Guid> customers,
        IRepository<CashAccount, Guid> cashAccounts,
        IRepository<CashMovement, Guid> cashMovements,
        IRepository<CustomerLedgerEntry, Guid> ledger,
        IRepository<Project, Guid> projects,
        IRepository<ProjectMember, Guid> projectMembers,
        IRepository<TaskItem, Guid> tasks,
        IRepository<TaskChecklistItem, Guid> checklist,
        IRepository<TaskComment, Guid> comments,
        IRepository<Tag, Guid> tags,
        IRepository<TaskTagAssignment, Guid> tagAssignments,
        IRepository<Expense, Guid> expenses,
        IRepository<IncomeEntry, Guid> incomes,
        IRepository<Invoice, Guid> invoices,
        IRepository<Payment, Guid> payments)
    {
        _configuration = configuration;
        _guid = guid;
        _clock = clock;
        _userManager = userManager;
        _invoiceManager = invoiceManager;
        _customers = customers;
        _cashAccounts = cashAccounts;
        _cashMovements = cashMovements;
        _ledger = ledger;
        _projects = projects;
        _projectMembers = projectMembers;
        _tasks = tasks;
        _checklist = checklist;
        _comments = comments;
        _tags = tags;
        _tagAssignments = tagAssignments;
        _expenses = expenses;
        _incomes = incomes;
        _invoices = invoices;
        _payments = payments;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (!_configuration.GetValue<bool>(PlatformTestDataSeedContributor.SeedDemoDataConfigKey))
        {
            return;
        }

        // Demo senaryosu yalnız host'ta kurgulanır; tenant'lar kendi verileriyle açılır.
        if (context.TenantId != null)
        {
            return;
        }

        // Idempotent: proje varsa senaryo zaten kurulmuş, ikinci kez yazma.
        if (await _projects.GetCountAsync() > 0)
        {
            return;
        }

        _today = _clock.Now.Date;

        await SeedUsersAsync();
        await SeedCashAccountsAsync();
        await SeedCustomersAsync();
        await SeedTagsAsync();
        var projectIds = await SeedProjectsAsync();
        await SeedTasksAsync(projectIds);
        await SeedInvoicesAsync(projectIds);
        await SeedExpensesAsync(projectIds);
        await SeedIncomesAsync(projectIds);
    }

    // ==================== Ekip ====================

    private async Task SeedUsersAsync()
    {
        var people = new[]
        {
            ("ayse.yilmaz", "Ayşe", "Yılmaz", "ayse.yilmaz@apyademo.com"),
            ("mehmet.demir", "Mehmet", "Demir", "mehmet.demir@apyademo.com"),
            ("zeynep.kaya", "Zeynep", "Kaya", "zeynep.kaya@apyademo.com"),
            ("can.ozturk", "Can", "Öztürk", "can.ozturk@apyademo.com"),
            ("elif.sahin", "Elif", "Şahin", "elif.sahin@apyademo.com"),
        };

        var ids = new List<Guid>();
        foreach (var (userName, name, surname, email) in people)
        {
            var existing = await _userManager.FindByNameAsync(userName);
            if (existing != null)
            {
                ids.Add(existing.Id);
                continue;
            }

            var user = new IdentityUser(_guid.Create(), userName, email, tenantId: null)
            {
                Name = name,
                Surname = surname
            };

            var result = await _userManager.CreateAsync(user, DemoUserPassword);
            if (!result.Succeeded)
            {
                throw new Volo.Abp.AbpException(
                    $"Demo kullanıcısı oluşturulamadı ({userName}): " +
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            ids.Add(user.Id);
        }

        _userIds = ids.ToArray();
    }

    /// <summary>Demo ekip üyelerinin ortak parolası — yalnız yerel demo ortamı içindir.</summary>
    public const string DemoUserPassword = "Demo1234!";

    // ==================== Kasa ====================

    private async Task SeedCashAccountsAsync()
    {
        var specs = new[]
        {
            // Açılış, nakit kasadan yapılan demo giderlerini karşılayacak kadar yüksek tutulur;
            // fiziksel kasa bakiyesi negatife düşerse demo hatalı görünür.
            ("Merkez Nakit Kasa", CashAccountType.Cash, "TRY", 450_000m, (string?)null, (string?)null),
            ("Ziraat Bankası — Vadesiz TL", CashAccountType.Bank, "TRY", 2_400_000m, "Ziraat Bankası", "TR33 0001 0012 3456 7890 1234 56"),
            ("Garanti BBVA — USD Hesap", CashAccountType.Bank, "USD", 85_000m, "Garanti BBVA", "TR91 0006 2000 1112 3456 7890 12"),
            ("Şirket Kredi Kartı", CashAccountType.CreditCard, "TRY", 0m, "Yapı Kredi", null),
        };

        var ids = new List<Guid>();
        foreach (var (name, type, currency, opening, bank, iban) in specs)
        {
            var account = new CashAccount(_guid.Create(), name, type, currency, opening, tenantId: null)
            {
                BankName = bank,
                Iban = iban
            };
            await _cashAccounts.InsertAsync(account, autoSave: true);
            ids.Add(account.Id);
        }

        _cashIds = ids.ToArray();
    }

    // ==================== Cari ====================

    private async Task SeedCustomersAsync()
    {
        var specs = new[]
        {
            ("Vestel Elektronik A.Ş.", "9250042147", "Manisa", "satinalma@vestel-demo.com", "0236 226 30 00"),
            ("Yapı Kredi Bankası A.Ş.", "9370023456", "Levent", "tedarik@ykb-demo.com", "0212 339 70 00"),
            ("Migros Ticaret A.Ş.", "6210034521", "Ataşehir", "proje@migros-demo.com", "0216 579 30 00"),
            ("Arçelik A.Ş.", "0700034567", "Sütlüce", "bt@arcelik-demo.com", "0212 314 34 34"),
            ("Turkcell İletişim Hizmetleri A.Ş.", "8590033445", "Maltepe", "kurumsal@turkcell-demo.com", "0212 313 10 00"),
            ("Borusan Lojistik A.Ş.", "1810045612", "Beşiktaş", "etkinlik@borusan-demo.com", "0212 393 50 00"),
            ("TÜBİTAK", "8710025896", "Kavaklıdere", "destek@tubitak-demo.gov.tr", "0312 468 53 00"),
            ("KOSGEB", "5410078923", "Söğütözü", "kobi@kosgeb-demo.gov.tr", "0312 595 28 00"),
            ("Netsis Yazılım Ltd. Şti.", "6310098741", "Bornova", "destek@netsis-demo.com", "0232 462 20 20"),
            ("Piri Bilişim Danışmanlık Ltd. Şti.", "7290056321", "Çankaya", "muhasebe@piri-demo.com", "0312 440 11 22"),
        };

        var ids = new List<Guid>();
        foreach (var (name, taxNumber, taxOffice, email, phone) in specs)
        {
            var customer = new Customer(_guid.Create(), name, tenantId: null)
            {
                TaxNumber = taxNumber,
                TaxOffice = taxOffice,
                Email = email,
                Phone = phone
            };
            await _customers.InsertAsync(customer, autoSave: true);
            ids.Add(customer.Id);
        }

        _customerIds = ids.ToArray();
    }

    private async Task SeedTagsAsync()
    {
        var names = new[] { "backend", "frontend", "acil", "müşteri-talebi", "teknik-borç", "güvenlik", "raporlama", "saha" };

        var ids = new List<Guid>();
        foreach (var name in names)
        {
            var tag = new Tag(_guid.Create(), name, tenantId: null);
            await _tags.InsertAsync(tag, autoSave: true);
            ids.Add(tag.Id);
        }

        _tagIds = ids.ToArray();
    }

    // ==================== Projeler ====================

    private sealed record ProjectSpec(
        string Name,
        string Code,
        string Description,
        ProjectCategory Category,
        int CustomerIndex,
        decimal Budget,
        string Currency,
        int StartOffset,
        int EndOffset,
        string Purpose,
        string TargetAudience,
        bool Approved,
        int[] MemberIndexes);

    private static ProjectSpec[] ProjectSpecs => new[]
    {
        new ProjectSpec("E-Ticaret Altyapı Yenileme", "PRJ-2026-001",
            "Mevcut e-ticaret altyapısının mikroservis mimarisine taşınması, ödeme ve stok entegrasyonlarının yenilenmesi.",
            ProjectCategory.Other, 0, 4_500_000m, "TRY", -180, 90,
            "Kampanya dönemlerinde yaşanan performans darboğazını kalıcı olarak çözmek.",
            "Perakende son kullanıcılar ve bayi ağı", true, new[] { 0, 1, 4 }),

        new ProjectSpec("TÜBİTAK 1501 Akıllı Üretim Ar-Ge", "PRJ-2026-002",
            "Üretim hattında görüntü işleme tabanlı kalite kontrol sisteminin geliştirilmesi. TÜBİTAK 1501 destekli.",
            ProjectCategory.GrantProject, 6, 6_200_000m, "TRY", -240, 180,
            "Hatalı ürün oranını yapay zekâ destekli kontrolle düşürmek.",
            "Üretim ve kalite kontrol birimleri", true, new[] { 0, 1, 3 }),

        new ProjectSpec("Mobil Bankacılık Uygulaması", "PRJ-2026-003",
            "iOS ve Android için yeni nesil mobil bankacılık uygulaması; biyometrik giriş ve anlık transfer.",
            ProjectCategory.Other, 1, 8_750_000m, "TRY", -120, 210,
            "Şube dışı işlem oranını artırmak ve operasyonel maliyeti düşürmek.",
            "Bireysel bankacılık müşterileri", true, new[] { 0, 1, 4 }),

        new ProjectSpec("KOSGEB Dijital Dönüşüm", "PRJ-2026-004",
            "KOBİ üretim süreçlerinin dijitalleştirilmesi; MES kurulumu ve personel eğitimi. KOSGEB destekli.",
            ProjectCategory.GrantProject, 7, 1_850_000m, "TRY", -90, 120,
            "Üretim verisini kâğıttan dijitale taşıyıp izlenebilirlik sağlamak.",
            "KOBİ üretim ve planlama ekipleri", true, new[] { 0, 3 }),

        new ProjectSpec("Perakende Stok Optimizasyonu", "PRJ-2026-005",
            "Mağaza bazlı talep tahmini ve otomatik sipariş önerisi geliştiren analitik platform.",
            ProjectCategory.Other, 2, 3_200_000m, "TRY", -150, 45,
            "Raf boşluğunu azaltırken atıl stok maliyetini düşürmek.",
            "Kategori yönetimi ve mağaza operasyonları", true, new[] { 0, 1, 2 }),

        new ProjectSpec("Kurumsal Web Sitesi Yenileme", "PRJ-2026-006",
            "Kurumsal web sitesinin yeniden tasarımı, çok dilli içerik yönetimi ve erişilebilirlik uyumu.",
            ProjectCategory.Other, 3, 950_000m, "TRY", -60, 30,
            "Marka algısını güncellemek ve WCAG erişilebilirlik uyumunu sağlamak.",
            "Kurumsal müşteriler ve basın", true, new[] { 4, 1 }),

        new ProjectSpec("IoT Saha Sensör Ağı", "PRJ-2026-007",
            "Baz istasyonlarında sıcaklık ve enerji tüketimi izleyen LoRaWAN sensör ağının kurulumu.",
            ProjectCategory.Other, 4, 5_400_000m, "TRY", -200, 150,
            "Saha arızalarını oluşmadan önce tahmin ederek kesinti süresini azaltmak.",
            "Saha operasyon ve bakım ekipleri", true, new[] { 0, 3, 1 }),

        new ProjectSpec("Yıllık Bayi Toplantısı 2026", "PRJ-2026-008",
            "500 kişilik bayi buluşması; mekân, ulaşım, konaklama ve sahne prodüksiyonu organizasyonu.",
            ProjectCategory.Event, 5, 780_000m, "TRY", -45, 25,
            "Bayi ağıyla yıllık hedefleri paylaşmak ve yeni ürün lansmanını yapmak.",
            "Yurt içi bayi ağı ve iş ortakları", true, new[] { 4, 2 }),

        new ProjectSpec("ERP Entegrasyon Projesi", "PRJ-2026-009",
            "Mevcut ERP ile üretim ve lojistik sistemlerinin çift yönlü entegrasyonu.",
            ProjectCategory.Other, 8, 2_100_000m, "TRY", -300, -20,
            "Sistemler arası manuel veri girişini tamamen ortadan kaldırmak.",
            "Muhasebe, üretim planlama ve lojistik", true, new[] { 1, 2 }),

        new ProjectSpec("Veri Merkezi Taşıma", "PRJ-2026-010",
            "Şirket içi veri merkezinin buluta taşınması; 40 sunucu ve 12 veritabanının göçü. Tamamlandı.",
            ProjectCategory.Other, 0, 3_900_000m, "TRY", -420, -60,
            "Donanım yenileme maliyetinden kaçınıp esnek kapasiteye geçmek.",
            "Tüm iç birimler", true, new[] { 1, 3 }),
    };

    private async Task<Guid[]> SeedProjectsAsync()
    {
        var ids = new List<Guid>();

        foreach (var spec in ProjectSpecs)
        {
            var project = new Project(
                _guid.Create(),
                tenantId: null,
                grantId: null,
                name: spec.Name,
                code: spec.Code,
                description: spec.Description,
                totalBudget: spec.Budget,
                hourlyRate: 1_250m,
                currency: spec.Currency,
                purpose: spec.Purpose,
                duration: $"{(spec.EndOffset - spec.StartOffset) / 30} ay",
                targetAudience: spec.TargetAudience,
                activities: "Analiz, tasarım, geliştirme, test, devreye alma ve kapanış raporlaması.",
                startDate: _today.AddDays(spec.StartOffset),
                endDate: _today.AddDays(spec.EndOffset),
                customerId: _customerIds[spec.CustomerIndex],
                category: spec.Category);

            if (spec.Approved)
            {
                project.Approve();
            }

            await _projects.InsertAsync(project, autoSave: true);
            ids.Add(project.Id);

            for (var i = 0; i < spec.MemberIndexes.Length; i++)
            {
                var role = i == 0 ? ProjectMemberRole.Lead : ProjectMemberRole.Member;
                await _projectMembers.InsertAsync(new ProjectMember(
                    _guid.Create(), project.Id, _userIds[spec.MemberIndexes[i]], role, tenantId: null), autoSave: true);
            }
        }

        return ids.ToArray();
    }

    // ==================== Görevler ====================

    private sealed record SubSpec(string Title, TaskStatus Status, int? DueOffset, int AssigneeIndex);

    private sealed record TaskSpec(
        string Title,
        TaskStatus Status,
        TaskPriority Priority,
        int StartOffset,
        int? DueOffset,
        int AssigneeIndex,
        decimal? Estimate,
        string Type,
        string Sprint,
        SubSpec[]? Subs = null,
        string[]? Checklist = null,
        int[]? Tags = null,
        string? Comment = null);

    /// <summary>
    /// Proje sırasına göre görev kurguları. Vade offsetleri "bugün"e göredir:
    /// negatif = gecikmiş, 0..7 = bu hafta (yaklaşan), pozitif = ileri tarihli.
    /// </summary>
    private static TaskSpec[][] TaskSpecs => new[]
    {
        // 1 — E-Ticaret Altyapı Yenileme
        new[]
        {
            new TaskSpec("Ödeme servisi mikroservise ayrıştırılacak", TaskStatus.InProgress, TaskPriority.Critical, -40, -6, 1, 80m, "Geliştirme", "Sprint 12",
                new[]
                {
                    new SubSpec("Ödeme sağlayıcı arayüzü soyutlanacak", TaskStatus.Done, -20, 1),
                    new SubSpec("3D Secure akışı taşınacak", TaskStatus.InProgress, -3, 1),
                    new SubSpec("Eski servis kapatılacak", TaskStatus.Todo, 12, 1),
                },
                new[] { "Kesinti planı paylaşıldı", "Geri alma senaryosu yazıldı", "Yük testi koşuldu" },
                new[] { 0, 4 },
                "Sağlayıcı tarafındaki sertifika yenilemesi nedeniyle 3D Secure testleri bir hafta kaydı."),

            new TaskSpec("Stok senkronizasyonu gecikmesi giderilecek", TaskStatus.InProgress, TaskPriority.High, -25, 2, 1, 40m, "Hata", "Sprint 12",
                null, new[] { "Kuyruk metrikleri incelendi", "Toplu güncelleme eşiği ayarlandı" }, new[] { 0, 2 }, null),

            new TaskSpec("Ürün listeleme sayfası yeniden tasarlanacak", TaskStatus.InReview, TaskPriority.Medium, -30, 5, 4, 55m, "Tasarım", "Sprint 12",
                new[]
                {
                    new SubSpec("Filtre bileşeni tasarlanacak", TaskStatus.Done, -8, 4),
                    new SubSpec("Mobil kırılım uyarlanacak", TaskStatus.InReview, 4, 4),
                },
                null, new[] { 1 }, null),

            new TaskSpec("Kampanya motoru yük testi", TaskStatus.Todo, TaskPriority.High, 3, 18, 1, 24m, "Test", "Sprint 13", null, null, new[] { 0 }, null),
            new TaskSpec("Bayi paneli yetkilendirme revizyonu", TaskStatus.Todo, TaskPriority.Medium, 10, 35, 0, 30m, "Geliştirme", "Sprint 13", null, null, new[] { 5 }, null),
            new TaskSpec("Eski ödeme kayıtları arşivlenecek", TaskStatus.Done, TaskPriority.Low, -60, -35, 1, 16m, "Bakım", "Sprint 11", null, null, new[] { 4 }, null),
            new TaskSpec("Mimari karar kaydı hazırlanacak", TaskStatus.Done, TaskPriority.Medium, -75, -50, 0, 12m, "Dokümantasyon", "Sprint 10", null, null, null, null),
        },

        // 2 — TÜBİTAK 1501 Akıllı Üretim Ar-Ge
        new[]
        {
            new TaskSpec("Görüntü işleme modeli eğitilecek", TaskStatus.InProgress, TaskPriority.Critical, -50, 9, 1, 120m, "Ar-Ge", "Faz 2",
                new[]
                {
                    new SubSpec("Etiketli veri seti toplanacak", TaskStatus.Done, -25, 3),
                    new SubSpec("Model mimarisi seçilecek", TaskStatus.Done, -12, 1),
                    new SubSpec("Doğruluk %95 üzerine çıkarılacak", TaskStatus.InProgress, 9, 1),
                },
                new[] { "Veri seti dengelendi", "Çapraz doğrulama yapıldı" }, new[] { 0 }, null),

            new TaskSpec("Hat kenarı donanım kurulumu", TaskStatus.InProgress, TaskPriority.High, -35, -2, 3, 60m, "Saha", "Faz 2", null,
                new[] { "Kamera konumları belirlendi", "Aydınlatma testi yapıldı" }, new[] { 7 }, null),

            new TaskSpec("Ara dönem TÜBİTAK raporu", TaskStatus.Todo, TaskPriority.Critical, -5, 4, 0, 20m, "Raporlama", "Faz 2", null,
                new[] { "Harcama tablosu derlendi", "Teknik ilerleme özeti yazıldı", "İmza süreci başlatıldı" }, new[] { 6 },
                "Rapor son teslim tarihi bu hafta; mali eklerin Zeynep tarafından onaylanması bekleniyor."),

            new TaskSpec("Kalite kontrol arayüzü geliştirilecek", TaskStatus.Todo, TaskPriority.Medium, 6, 40, 4, 45m, "Geliştirme", "Faz 3", null, null, new[] { 1 }, null),
            new TaskSpec("Literatür taraması", TaskStatus.Done, TaskPriority.Low, -230, -200, 0, 32m, "Ar-Ge", "Faz 1", null, null, null, null),
            new TaskSpec("Prototip doğrulama testleri", TaskStatus.Done, TaskPriority.High, -180, -140, 1, 70m, "Test", "Faz 1", null, null, new[] { 0 }, null),
        },

        // 3 — Mobil Bankacılık Uygulaması
        new[]
        {
            new TaskSpec("Biyometrik giriş entegrasyonu", TaskStatus.InProgress, TaskPriority.Critical, -30, 7, 1, 65m, "Geliştirme", "Sprint 8",
                new[]
                {
                    new SubSpec("iOS Face ID akışı", TaskStatus.Done, -10, 1),
                    new SubSpec("Android BiometricPrompt akışı", TaskStatus.InProgress, 7, 1),
                    new SubSpec("Yedek PIN akışı", TaskStatus.Todo, 20, 1),
                },
                null, new[] { 5, 0 }, null),

            new TaskSpec("Güvenlik sızma testi bulguları kapatılacak", TaskStatus.InProgress, TaskPriority.Critical, -20, -4, 1, 50m, "Güvenlik", "Sprint 8", null,
                new[] { "Kritik 3 bulgu kapatıldı", "Orta seviye 7 bulgu planlandı" }, new[] { 5 },
                "Denetim firması yeniden test için 10 gün sonrasına randevu verdi."),

            new TaskSpec("Anlık transfer ekranı tasarımı", TaskStatus.InReview, TaskPriority.High, -25, 3, 4, 38m, "Tasarım", "Sprint 8", null, null, new[] { 1 }, null),
            new TaskSpec("Uygulama içi bildirim altyapısı", TaskStatus.Todo, TaskPriority.Medium, 8, 45, 1, 42m, "Geliştirme", "Sprint 9", null, null, new[] { 0 }, null),
            new TaskSpec("Erişilebilirlik denetimi", TaskStatus.Todo, TaskPriority.Medium, 15, 60, 4, 28m, "Test", "Sprint 9", null, null, null, null),
            new TaskSpec("Mimari tasarım dokümanı", TaskStatus.Done, TaskPriority.High, -110, -85, 0, 25m, "Dokümantasyon", "Sprint 6", null, null, null, null),
            new TaskSpec("Uygulama iskeleti kurulumu", TaskStatus.Done, TaskPriority.Medium, -100, -75, 1, 30m, "Geliştirme", "Sprint 6", null, null, null, null),
        },

        // 4 — KOSGEB Dijital Dönüşüm
        new[]
        {
            new TaskSpec("MES yazılımı kurulumu", TaskStatus.InProgress, TaskPriority.High, -40, 5, 3, 55m, "Kurulum", "Faz 1",
                new[]
                {
                    new SubSpec("Sunucu hazırlığı", TaskStatus.Done, -20, 3),
                    new SubSpec("Hat tanımları girilecek", TaskStatus.InProgress, 5, 3),
                },
                new[] { "Lisans anahtarı alındı", "Test ortamı kuruldu" }, null, null),

            new TaskSpec("Personel eğitim programı", TaskStatus.Todo, TaskPriority.Medium, 2, 21, 0, 24m, "Eğitim", "Faz 2", null,
                new[] { "Eğitim takvimi hazırlandı", "Materyal basıldı" }, null, null),

            new TaskSpec("KOSGEB harcama belgeleri derlenecek", TaskStatus.Todo, TaskPriority.High, -10, 1, 2, 16m, "Raporlama", "Faz 2", null, null, new[] { 6 },
                "Fatura asıllarının kargoyla gelmesi bekleniyor."),

            new TaskSpec("Süreç analizi ve mevcut durum raporu", TaskStatus.Done, TaskPriority.Medium, -85, -60, 0, 40m, "Analiz", "Faz 1", null, null, null, null),
        },

        // 5 — Perakende Stok Optimizasyonu
        new[]
        {
            new TaskSpec("Talep tahmin modeli devreye alınacak", TaskStatus.InProgress, TaskPriority.Critical, -45, -8, 1, 90m, "Ar-Ge", "Sprint 5",
                new[]
                {
                    new SubSpec("Geçmiş satış verisi temizlenecek", TaskStatus.Done, -30, 1),
                    new SubSpec("Mevsimsellik katsayıları hesaplanacak", TaskStatus.Done, -18, 1),
                    new SubSpec("Pilot 20 mağazada denenecek", TaskStatus.InProgress, -8, 3),
                },
                new[] { "Pilot mağazalar seçildi", "Karşılaştırma metriği tanımlandı" }, new[] { 6, 0 },
                "Pilot sonuçları beklenenden iyi; yaygınlaştırma için bütçe revizyonu gerekebilir."),

            new TaskSpec("Otomatik sipariş öneri ekranı", TaskStatus.InReview, TaskPriority.High, -20, 6, 4, 35m, "Geliştirme", "Sprint 5", null, null, new[] { 1 }, null),
            new TaskSpec("Kategori yöneticisi eğitimi", TaskStatus.Todo, TaskPriority.Medium, 5, 25, 2, 18m, "Eğitim", "Sprint 6", null, null, null, null),
            new TaskSpec("Haftalık performans raporu otomasyonu", TaskStatus.Todo, TaskPriority.Low, 12, 40, 1, 22m, "Raporlama", "Sprint 6", null, null, new[] { 6 }, null),
            new TaskSpec("Veri ambarı bağlantısı kurulumu", TaskStatus.Done, TaskPriority.High, -140, -110, 1, 45m, "Kurulum", "Sprint 3", null, null, null, null),
        },

        // 6 — Kurumsal Web Sitesi Yenileme
        new[]
        {
            new TaskSpec("Ana sayfa tasarımı onaya sunulacak", TaskStatus.InReview, TaskPriority.High, -18, 2, 4, 30m, "Tasarım", "Sprint 3", null,
                new[] { "Üç alternatif hazırlandı", "Marka ekibi görüşü alındı" }, new[] { 1, 3 }, null),

            new TaskSpec("Çok dilli içerik yönetimi", TaskStatus.InProgress, TaskPriority.Medium, -25, 8, 1, 40m, "Geliştirme", "Sprint 3",
                new[]
                {
                    new SubSpec("İngilizce içerik aktarımı", TaskStatus.InProgress, 8, 4),
                    new SubSpec("Almanca içerik aktarımı", TaskStatus.Todo, 22, 4),
                },
                null, null, null),

            new TaskSpec("WCAG erişilebilirlik uyumu", TaskStatus.Todo, TaskPriority.High, -3, 0, 4, 26m, "Test", "Sprint 3", null,
                new[] { "Kontrast oranları ölçüldü", "Klavye navigasyonu test edildi" }, new[] { 2 },
                "Teslim bugün — kontrast düzeltmeleri dışında kalan madde yok."),

            new TaskSpec("Eski siteden içerik göçü", TaskStatus.Done, TaskPriority.Medium, -55, -30, 1, 35m, "Geliştirme", "Sprint 2", null, null, null, null),
        },

        // 7 — IoT Saha Sensör Ağı
        new[]
        {
            new TaskSpec("Sahada 120 sensör montajı", TaskStatus.InProgress, TaskPriority.High, -60, 14, 3, 140m, "Saha", "Dalga 2",
                new[]
                {
                    new SubSpec("İstanbul bölgesi montajı", TaskStatus.Done, -30, 3),
                    new SubSpec("Ankara bölgesi montajı", TaskStatus.InProgress, 14, 3),
                    new SubSpec("İzmir bölgesi montajı", TaskStatus.Todo, 45, 3),
                },
                new[] { "Montaj ekibi eğitildi", "İş güvenliği izinleri alındı" }, new[] { 7 }, null),

            new TaskSpec("LoRaWAN ağ geçidi yapılandırması", TaskStatus.InProgress, TaskPriority.Critical, -40, -12, 1, 48m, "Kurulum", "Dalga 2", null,
                new[] { "Frekans planı onaylandı" }, new[] { 7, 2 },
                "Ankara sahasındaki iki ağ geçidinde sinyal zayıflığı var, anten değişimi planlandı."),

            new TaskSpec("Arıza tahmin kuralları tanımlanacak", TaskStatus.Todo, TaskPriority.Medium, 10, 50, 1, 36m, "Ar-Ge", "Dalga 3", null, null, new[] { 0 }, null),
            new TaskSpec("Saha ekibi mobil uygulaması", TaskStatus.Todo, TaskPriority.Medium, 20, 75, 4, 55m, "Geliştirme", "Dalga 3", null, null, new[] { 1 }, null),
            new TaskSpec("Pilot bölge fizibilite çalışması", TaskStatus.Done, TaskPriority.High, -190, -160, 0, 40m, "Analiz", "Dalga 1", null, null, null, null),
            new TaskSpec("Sensör tedarikçi seçimi", TaskStatus.Done, TaskPriority.Medium, -175, -150, 2, 20m, "Satınalma", "Dalga 1", null, null, null, null),
        },

        // 8 — Yıllık Bayi Toplantısı 2026
        new[]
        {
            new TaskSpec("Mekân sözleşmesi imzalanacak", TaskStatus.Done, TaskPriority.Critical, -40, -25, 2, 8m, "Organizasyon", "Hazırlık", null, null, null, null),

            new TaskSpec("Katılımcı davetleri gönderilecek", TaskStatus.InProgress, TaskPriority.High, -20, 1, 4, 14m, "Organizasyon", "Hazırlık",
                new[]
                {
                    new SubSpec("Bayi listesi güncellenecek", TaskStatus.Done, -10, 2),
                    new SubSpec("Davet e-postası gönderilecek", TaskStatus.InProgress, 1, 4),
                    new SubSpec("Katılım teyitleri toplanacak", TaskStatus.Todo, 10, 4),
                },
                new[] { "500 kişilik liste hazır", "E-posta şablonu onaylandı" }, new[] { 3 }, null),

            new TaskSpec("Sahne ve ses prodüksiyonu", TaskStatus.Todo, TaskPriority.High, -2, 15, 4, 30m, "Organizasyon", "Uygulama", null, null, null, null),
            new TaskSpec("Konaklama ve ulaşım planlaması", TaskStatus.InProgress, TaskPriority.Medium, -15, -3, 2, 22m, "Organizasyon", "Hazırlık", null,
                new[] { "Otel blokajı yapıldı" }, null,
                "Havayolu grup indirimi için son başvuru tarihi geçti, alternatif fiyat alınıyor."),

            new TaskSpec("Lansman sunumu hazırlanacak", TaskStatus.Todo, TaskPriority.Critical, 3, 20, 0, 26m, "İçerik", "Uygulama", null, null, new[] { 3 }, null),
        },

        // 9 — ERP Entegrasyon Projesi (süresi geçmiş, kapanmamış)
        new[]
        {
            new TaskSpec("Lojistik modülü çift yönlü senkronizasyon", TaskStatus.InProgress, TaskPriority.Critical, -120, -35, 1, 95m, "Entegrasyon", "Faz 3", null,
                new[] { "Sipariş akışı tamamlandı", "İade akışı bekliyor" }, new[] { 0, 2 },
                "İade akışındaki mutabakat farkı çözülmeden proje kapanışı yapılamıyor."),

            new TaskSpec("Muhasebe fişi aktarım hatası", TaskStatus.InProgress, TaskPriority.Critical, -60, -28, 2, 40m, "Hata", "Faz 3", null, null, new[] { 2, 6 }, null),
            new TaskSpec("Kullanıcı kabul testleri", TaskStatus.Todo, TaskPriority.High, -30, -10, 2, 45m, "Test", "Faz 3", null, null, null, null),
            new TaskSpec("Üretim modülü entegrasyonu", TaskStatus.Done, TaskPriority.High, -280, -200, 1, 110m, "Entegrasyon", "Faz 2", null, null, null, null),
            new TaskSpec("Veri eşleme tablosu hazırlandı", TaskStatus.Done, TaskPriority.Medium, -295, -260, 1, 35m, "Analiz", "Faz 1", null, null, null, null),
        },

        // 10 — Veri Merkezi Taşıma (tamamlanmış)
        new[]
        {
            new TaskSpec("40 sunucunun buluta göçü", TaskStatus.Done, TaskPriority.Critical, -400, -120, 1, 200m, "Kurulum", "Göç", null,
                new[] { "Kesinti penceresi kullanıldı", "Geri dönüş testi başarılı" }, null, null),

            new TaskSpec("12 veritabanının taşınması", TaskStatus.Done, TaskPriority.Critical, -380, -140, 1, 160m, "Kurulum", "Göç", null, null, null, null),
            new TaskSpec("Yedekleme stratejisi yenilendi", TaskStatus.Done, TaskPriority.High, -300, -100, 3, 45m, "Kurulum", "Kapanış", null, null, null, null),
            new TaskSpec("Kapanış raporu ve devir", TaskStatus.Done, TaskPriority.Medium, -120, -65, 0, 20m, "Dokümantasyon", "Kapanış", null, null, null, null),
            new TaskSpec("Eski donanım tasfiyesi", TaskStatus.Cancelled, TaskPriority.Low, -110, -70, 3, 10m, "Bakım", "Kapanış", null, null, null,
                "Donanım bağış programına devredildiği için bu görev iptal edildi."),
        },
    };

    private async Task SeedTasksAsync(Guid[] projectIds)
    {
        var specsByProject = TaskSpecs;

        for (var p = 0; p < projectIds.Length && p < specsByProject.Length; p++)
        {
            foreach (var spec in specsByProject[p])
            {
                var parent = await InsertTaskAsync(
                    projectIds[p], spec.Title, spec.Status, spec.Priority, spec.StartOffset,
                    spec.DueOffset, spec.AssigneeIndex, spec.Estimate, spec.Type, spec.Sprint, parentId: null);

                foreach (var sub in spec.Subs ?? Array.Empty<SubSpec>())
                {
                    await InsertTaskAsync(
                        projectIds[p], sub.Title, sub.Status, TaskPriority.Medium, spec.StartOffset,
                        sub.DueOffset, sub.AssigneeIndex, estimate: null, type: spec.Type, sprint: spec.Sprint,
                        parentId: parent.Id);
                }

                foreach (var text in spec.Checklist ?? Array.Empty<string>())
                {
                    await _checklist.InsertAsync(new TaskChecklistItem
                    {
                        TaskId = parent.Id,
                        Text = text,
                        IsDone = spec.Status == TaskStatus.Done
                    }, autoSave: true);
                }

                foreach (var tagIndex in spec.Tags ?? Array.Empty<int>())
                {
                    await _tagAssignments.InsertAsync(
                        new TaskTagAssignment(_guid.Create(), parent.Id, _tagIds[tagIndex]), autoSave: true);
                }

                if (spec.Comment != null)
                {
                    await _comments.InsertAsync(new TaskComment(parent.Id, spec.Comment), autoSave: true);
                }
            }
        }
    }

    private async Task<TaskItem> InsertTaskAsync(
        Guid projectId, string title, TaskStatus status, TaskPriority priority, int startOffset,
        int? dueOffset, int assigneeIndex, decimal? estimate, string type, string sprint, Guid? parentId)
    {
        var task = new TaskItem(
            _guid.Create(),
            title,
            projectId: projectId,
            parentTaskId: parentId,
            description: null,
            startDate: _today.AddDays(startOffset),
            dueDate: dueOffset.HasValue ? _today.AddDays(dueOffset.Value) : null,
            priority: priority,
            assigneeId: _userIds[assigneeIndex],
            isPrivate: false,
            tenantId: null,
            now: _today);

        task.AssignNumber(_nextTaskNumber++);
        task.SetPlanningInfo(estimate, type, sprint);

        // Tamamlanma tarihi vade civarına düşsün — dashboard "zamanında/geç kapandı" kırılımı anlamlı olsun.
        if (status != TaskStatus.Todo)
        {
            task.ChangeStatus(status, dueOffset.HasValue ? _today.AddDays(dueOffset.Value - 1) : _today);
        }

        await _tasks.InsertAsync(task, autoSave: true);
        return task;
    }

    // ==================== Faturalar & Tahsilat ====================

    private sealed record InvoiceSpec(
        int ProjectIndex,
        int CustomerIndex,
        string Number,
        int IssueOffset,
        int DueOffset,
        InvoiceDirection Direction,
        string Currency,
        (string Description, decimal Quantity, decimal UnitPrice)[] Items,
        decimal PaidRatio,
        int PaymentOffset,
        int CashIndex,
        string? Notes = null,
        /// <summary>Taslak durumunda bırakılacak fatura (henüz müşteriye gönderilmemiş).</summary>
        bool KeepDraft = false);

    private static InvoiceSpec[] InvoiceSpecs => new[]
    {
        // --- Vadesi geçmiş, hiç tahsil edilmemiş ---
        new InvoiceSpec(0, 0, "FTR-2026-0001", -75, -45, InvoiceDirection.Sales, "TRY",
            new[] { ("E-ticaret altyapı hizmeti — 1. hakediş", 1m, 850_000m) }, 0m, 0, 1,
            "Vade geçti; müşteri finans birimi ödeme planı talep etti."),

        new InvoiceSpec(8, 8, "FTR-2026-0002", -90, -60, InvoiceDirection.Sales, "TRY",
            new[] { ("ERP entegrasyon danışmanlığı — Faz 3", 1m, 420_000m) }, 0m, 0, 1,
            "Proje kapanışı gecikti, tahsilat askıda."),

        // --- Vadesi geçmiş, kısmi tahsil edilmiş ---
        new InvoiceSpec(4, 2, "FTR-2026-0003", -70, -30, InvoiceDirection.Sales, "TRY",
            new[] { ("Stok optimizasyon platformu — kurulum", 1m, 640_000m), ("Eğitim hizmeti (5 gün)", 5m, 18_000m) }, 0.4m, -25, 1,
            "Kısmi ödeme alındı, kalan bakiye için mutabakat gönderildi."),

        // --- Bu hafta vadesi dolacak (yaklaşan) ---
        new InvoiceSpec(2, 1, "FTR-2026-0004", -25, 4, InvoiceDirection.Sales, "TRY",
            new[] { ("Mobil bankacılık geliştirme — Sprint 7-8", 1m, 1_250_000m) }, 0m, 0, 1, null),

        new InvoiceSpec(6, 4, "FTR-2026-0005", -20, 6, InvoiceDirection.Sales, "TRY",
            new[] { ("IoT sensör ağı — montaj hakedişi", 120m, 7_500m) }, 0m, 0, 1, null),

        // --- İleri vadeli ---
        new InvoiceSpec(5, 3, "FTR-2026-0006", -8, 22, InvoiceDirection.Sales, "TRY",
            new[] { ("Kurumsal web sitesi yenileme — tasarım", 1m, 380_000m) }, 0m, 0, 1, null),

        new InvoiceSpec(7, 5, "FTR-2026-0007", -5, 25, InvoiceDirection.Sales, "TRY",
            new[] { ("Bayi toplantısı organizasyon bedeli", 1m, 520_000m) }, 0m, 0, 1,
            "Etkinlik sonrası kesinleşecek; henüz gönderilmedi.", KeepDraft: true),

        // --- Tamamı tahsil edilmiş ---
        new InvoiceSpec(9, 0, "FTR-2026-0008", -140, -110, InvoiceDirection.Sales, "TRY",
            new[] { ("Veri merkezi taşıma — nihai hakediş", 1m, 1_450_000m) }, 1m, -112, 1, null),

        new InvoiceSpec(0, 0, "FTR-2026-0009", -120, -90, InvoiceDirection.Sales, "TRY",
            new[] { ("E-ticaret altyapı hizmeti — avans", 1m, 900_000m) }, 1m, -95, 1, null),

        new InvoiceSpec(3, 7, "FTR-2026-0010", -60, -30, InvoiceDirection.Sales, "TRY",
            new[] { ("KOSGEB dijital dönüşüm — MES kurulumu", 1m, 460_000m) }, 1m, -33, 1, null),

        // --- Döviz faturası ---
        new InvoiceSpec(2, 1, "FTR-2026-0011", -40, 12, InvoiceDirection.Sales, "USD",
            new[] { ("Yurt dışı lisans bedeli yansıtması", 1m, 45_000m) }, 0m, 0, 2, null),

        // --- Alış faturaları (tedarikçi / AP) ---
        new InvoiceSpec(6, 8, "ALS-2026-0001", -50, -18, InvoiceDirection.Purchase, "TRY",
            new[] { ("LoRaWAN sensör donanımı", 120m, 4_200m) }, 0m, 0, 1,
            "Tedarikçiye vadesi geçmiş borç."),

        new InvoiceSpec(0, 9, "ALS-2026-0002", -35, 8, InvoiceDirection.Purchase, "TRY",
            new[] { ("Dış kaynak yazılım geliştirme (2 kişi/ay)", 2m, 165_000m) }, 0m, 0, 1, null),

        new InvoiceSpec(9, 9, "ALS-2026-0003", -150, -120, InvoiceDirection.Purchase, "TRY",
            new[] { ("Bulut altyapı kurulum danışmanlığı", 1m, 240_000m) }, 1m, -122, 1, null),
    };

    private async Task SeedInvoicesAsync(Guid[] projectIds)
    {
        foreach (var spec in InvoiceSpecs)
        {
            var items = spec.Items
                .Select(i => new InvoiceItemDescriptor(i.Description, i.Quantity, i.UnitPrice))
                .ToList();

            var invoice = await _invoiceManager.CreateAsync(
                projectId: projectIds[spec.ProjectIndex],
                invoiceNumber: spec.Number,
                invoiceDate: _today.AddDays(spec.IssueOffset),
                dueDate: _today.AddDays(spec.DueOffset),
                taxRate: 20m,
                currency: spec.Currency,
                direction: spec.Direction,
                customerId: _customerIds[spec.CustomerIndex],
                taskId: null,
                items: items,
                notes: spec.Notes);

            if (spec.PaidRatio > 0)
            {
                await RecordBackdatedPaymentAsync(
                    invoice,
                    Math.Round(invoice.TotalAmount * spec.PaidRatio, 2),
                    _today.AddDays(spec.PaymentOffset),
                    _cashIds[spec.CashIndex]);
            }
            else if (!spec.KeepDraft)
            {
                // Fatura kesilip müşteriye gönderilmiş ama henüz tahsil edilmemiş.
                // UpdateStatus(0) → Sent; aksi hâlde vadesi 45 gün geçmiş fatura "Taslak" görünürdü.
                invoice.UpdateStatus(0m);
                await _invoices.UpdateAsync(invoice, autoSave: true);
            }
        }
    }

    /// <summary>
    /// Geçmiş tarihli tahsilat/ödeme kaydı. <see cref="InvoiceManager.RecordPaymentAsync"/> ile
    /// aynı muhasebe zincirini kurar (Payment + kasa hareketi + cari tahakkuk + fatura durumu),
    /// tek farkı tarihi <see cref="IClock"/> yerine parametreden almasıdır — demo'nun nakit akışı
    /// ve yaşlandırma raporları gerçekçi bir geçmişe yayılsın diye.
    /// </summary>
    private async Task RecordBackdatedPaymentAsync(Invoice invoice, decimal amount, DateTime date, Guid cashAccountId)
    {
        var isSales = invoice.Direction == InvoiceDirection.Sales;

        var payment = new Payment(_guid.Create(), invoice.Id, amount, date, isSales ? "Havale" : "EFT")
        {
            ReferenceNumber = $"DEMO-{invoice.InvoiceNumber}",
            CashAccountId = cashAccountId
        };
        await _payments.InsertAsync(payment, autoSave: true);

        var cash = await _cashAccounts.GetAsync(cashAccountId);
        var cashAmount = PaymentCashConverter.ToCashCurrency(amount, invoice.Currency, cash.Currency, rate: null);

        await _cashMovements.InsertAsync(new CashMovement(
            _guid.Create(),
            cashAccountId,
            isSales ? CashMovementDirection.In : CashMovementDirection.Out,
            cashAmount,
            date,
            (isSales ? "Fatura tahsilatı: " : "Tedarikçi ödemesi: ") + invoice.InvoiceNumber,
            CashMovementSource.Invoice,
            payment.Id,
            tenantId: null), autoSave: true);

        if (invoice.CustomerId.HasValue)
        {
            await _ledger.InsertAsync(new CustomerLedgerEntry(
                _guid.Create(),
                invoice.CustomerId.Value,
                isSales ? CustomerLedgerDirection.Credit : CustomerLedgerDirection.Debit,
                amount,
                date,
                CustomerLedgerSource.Payment,
                invoice.Currency,
                payment.Id,
                invoice.ProjectId,
                (isSales ? "Tahsilat: " : "Tedarikçi ödemesi: ") + invoice.InvoiceNumber,
                tenantId: null), autoSave: true);
        }

        var all = await _payments.GetListAsync(p => p.InvoiceId == invoice.Id);
        invoice.UpdateStatus(all.Sum(p => p.Amount));
        await _invoices.UpdateAsync(invoice, autoSave: true);
    }

    // ==================== Giderler ====================

    private async Task SeedExpensesAsync(Guid[] projectIds)
    {
        var specs = new (string Title, decimal Amount, int ProjectIndex, ExpenseCategory Category, int DayOffset, int CashIndex, int CustomerIndex)[]
        {
            ("Ocak dönemi yazılım ekibi maaşları", 1_240_000m, 0, ExpenseCategory.Personnel, -35, 1, -1),
            ("Şubat dönemi yazılım ekibi maaşları", 1_310_000m, 0, ExpenseCategory.Personnel, -5, 1, -1),
            ("Bulut altyapı kullanım bedeli", 186_400m, 0, ExpenseCategory.Service, -12, 3, -1),
            ("Ofis kirası — merkez", 145_000m, -1, ExpenseCategory.Office, -8, 1, -1),
            ("Ar-Ge laboratuvar sarf malzemesi", 92_500m, 1, ExpenseCategory.Material, -28, 0, -1),
            ("GPU sunucu kiralama", 268_000m, 1, ExpenseCategory.Service, -20, 1, -1),
            ("Saha montaj ekibi konaklama", 74_300m, 6, ExpenseCategory.Travel, -18, 3, -1),
            ("LoRaWAN anten ve kablo alımı", 158_900m, 6, ExpenseCategory.Material, -40, 1, 8),
            ("Sızma testi danışmanlık hizmeti", 220_000m, 2, ExpenseCategory.Service, -22, 1, 9),
            ("Mobil cihaz test havuzu", 96_700m, 2, ExpenseCategory.Material, -50, 3, -1),
            ("Bayi toplantısı mekân ön ödemesi", 195_000m, 7, ExpenseCategory.Service, -30, 1, 5),
            ("Sahne ve ışık kiralama avansı", 88_000m, 7, ExpenseCategory.Service, -10, 1, -1),
            ("Katılımcı ulaşım organizasyonu", 64_500m, 7, ExpenseCategory.Travel, -4, 0, -1),
            ("MES yazılım lisans bedeli", 312_000m, 3, ExpenseCategory.Service, -45, 1, 8),
            ("Personel eğitim materyali basımı", 27_800m, 3, ExpenseCategory.Office, -6, 0, -1),
            ("Veri ambarı lisans yenileme", 174_500m, 4, ExpenseCategory.Service, -60, 1, -1),
            ("Pilot mağaza saha ziyaretleri", 41_200m, 4, ExpenseCategory.Travel, -14, 0, -1),
            ("Kurumsal fotoğraf ve video çekimi", 68_400m, 5, ExpenseCategory.Service, -16, 1, -1),
            ("Stok fotoğraf ve font lisansları", 22_600m, 5, ExpenseCategory.Material, -24, 3, -1),
            ("ERP danışman mesaisi", 142_000m, 8, ExpenseCategory.Service, -33, 1, 8),
            ("Damga vergisi ve harçlar", 38_900m, -1, ExpenseCategory.Tax, -26, 1, -1),
            ("Kurumlar vergisi geçici ödeme", 465_000m, -1, ExpenseCategory.Tax, -55, 1, -1),
            ("Veri merkezi taşıma nakliye", 118_000m, 9, ExpenseCategory.Service, -130, 1, -1),
            ("Genel ofis giderleri", 34_700m, -1, ExpenseCategory.Office, -2, 0, -1),
            ("Muhasebe ve mali müşavirlik", 58_000m, -1, ExpenseCategory.Service, -9, 1, 9),
        };

        foreach (var s in specs)
        {
            var date = _today.AddDays(s.DayOffset);
            var cashId = _cashIds[s.CashIndex];

            var expense = new Expense(
                _guid.Create(),
                s.Title,
                s.Amount,
                cashId,
                date,
                s.Category,
                "TRY",
                projectId: s.ProjectIndex >= 0 ? projectIds[s.ProjectIndex] : null,
                customerId: s.CustomerIndex >= 0 ? _customerIds[s.CustomerIndex] : null,
                description: null,
                taskId: null,
                tenantId: null);

            await _expenses.InsertAsync(expense, autoSave: true);

            // ExpenseAppService ile aynı yan etki: kasadan otomatik çıkış hareketi.
            await _cashMovements.InsertAsync(new CashMovement(
                _guid.Create(), cashId, CashMovementDirection.Out, s.Amount, date,
                "Gider: " + s.Title, CashMovementSource.Expense, expense.Id, tenantId: null), autoSave: true);
        }
    }

    // ==================== Gelirler ====================

    private async Task SeedIncomesAsync(Guid[] projectIds)
    {
        var specs = new (string Title, decimal Amount, int ProjectIndex, IncomeCategory Category, int DayOffset, int CashIndex, int CustomerIndex)[]
        {
            ("TÜBİTAK 1501 — 1. dönem hibe ödemesi", 1_860_000m, 1, IncomeCategory.Grant, -150, 1, 6),
            ("TÜBİTAK 1501 — 2. dönem hibe ödemesi", 1_240_000m, 1, IncomeCategory.Grant, -40, 1, 6),
            ("KOSGEB dijital dönüşüm hibe ödemesi", 925_000m, 3, IncomeCategory.Grant, -55, 1, 7),
            ("Bayi sponsorluk katkısı", 145_000m, 7, IncomeCategory.Donation, -12, 1, 5),
            ("Vadeli mevduat faiz geliri", 68_400m, -1, IncomeCategory.Financial, -7, 1, -1),
            ("Eğitim hizmeti nakit tahsilatı", 42_000m, 4, IncomeCategory.CashSale, -19, 0, 2),
            ("Kullanılmayan lisansların iadesi", 31_500m, 9, IncomeCategory.Other, -70, 1, -1),
            ("Fuar standı gelir paylaşımı", 57_800m, 7, IncomeCategory.CashSale, -3, 0, -1),
        };

        foreach (var s in specs)
        {
            var date = _today.AddDays(s.DayOffset);
            var cashId = _cashIds[s.CashIndex];

            var income = new IncomeEntry(
                _guid.Create(),
                s.Title,
                s.Amount,
                date,
                s.Category,
                "TRY",
                cashAccountId: cashId,
                projectId: s.ProjectIndex >= 0 ? projectIds[s.ProjectIndex] : null,
                customerId: s.CustomerIndex >= 0 ? _customerIds[s.CustomerIndex] : null,
                description: null,
                taskId: null,
                tenantId: null);

            await _incomes.InsertAsync(income, autoSave: true);

            // IncomeEntryAppService ile aynı yan etki: kasaya otomatik giriş hareketi.
            await _cashMovements.InsertAsync(new CashMovement(
                _guid.Create(), cashId, CashMovementDirection.In, s.Amount, date,
                "Gelir: " + s.Title, CashMovementSource.Income, income.Id, tenantId: null), autoSave: true);
        }
    }
}
