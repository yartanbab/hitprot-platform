using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.TenantManagement;
using Volo.Abp.Timing;

namespace Apya.Platform.DbMigrator.DemoWorld;

/// <summary>
/// Uçtan uca demo dünyası: 30 kiracı + host, her bağlamda CEO / Proje Yöneticisi /
/// Çalışan / Stajyer rol hiyerarşisi (gerçek izin farklarıyla) ve toplam 150 proje ile
/// bunlara bağlı görev, finans, hibe, doküman, form ve platform verisi.
///
/// <para>NEDEN DbMigrator PROJESİNDE: rol izinleri <c>PlatformPermissions</c> sabitlerini
/// gerektirir (Application.Contracts), repository ve domain manager'lar ise Domain'dedir.
/// Domain'den Application.Contracts'a referans katman kuralını ihlal ederdi; DbMigrator
/// ikisini de görür ve zaten tohumlamanın yürütüldüğü yerdir.</para>
///
/// <para>KİRACI DÖNGÜSÜ BURADA: <c>ApyaPlatformDbMigrationService</c> yalnızca
/// <c>SeedAsync()</c> çağırır, ABP'nin kiracı-başına tohumlama döngüsü yoktur
/// (Domain katmanındaki <c>PlatformDbMigrationService</c> bu döngüye sahiptir ama
/// hiçbir yerden çağrılmayan ölü koddur). Bu yüzden kiracılar burada
/// <c>ICurrentTenant.Change</c> ile dolaşılır.</para>
///
/// <para>Tarihler <c>IClock</c>'tan alınan "bugün"e göre görelidir; demo hangi gün
/// açılırsa açılsın gecikmiş / yaklaşan kırılımı anlamlı kalır. Rastgelelik sabit
/// tohumludur — aynı veritabanı iki kez kurulursa aynı dünya çıkar.</para>
/// </summary>
public partial class DemoWorldSeeder : IDataSeedContributor, ITransientDependency
{
    /// <summary>Sabit rastgelelik tohumu — demo tekrar üretilebilir olsun.</summary>
    private const int RandomSeed = 20260817;

    /// <summary>Tüm demo kullanıcılarının ortak parolası (yalnız yerel demo ortamı).</summary>
    public const string DemoPassword = "Demo1234!";

    private const int TenantCount = 30;
    private const int HostProjectCount = 10;
    private const int TenantProjectTotal = 140;

    public ILogger<DemoWorldSeeder> Logger { get; set; }

    private readonly IServiceProvider _sp;
    private readonly IConfiguration _configuration;
    private readonly IGuidGenerator _guid;
    private readonly IClock _clock;
    private readonly ICurrentTenant _currentTenant;
    private readonly ITenantRepository _tenantRepository;
    private readonly ITenantManager _tenantManager;
    private readonly IdentityUserManager _userManager;
    private readonly IdentityRoleManager _roleManager;
    private readonly IPermissionGrantRepository _permissionGrants;

    private Random _rnd = new(RandomSeed);
    private DateTime _today;

    /// <summary>Görev kodunun (GRV-n) sayısal kaynağı; kiracı başına 1'den başlar.</summary>
    private int _taskNumber;

    /// <summary>Fatura numarası sayaçları. BAĞLAMLAR ARASI DEVAM EDER: AppInvoices üzerindeki
    /// IX_AppInvoices_InvoiceNumber tekil indeksi TenantId içermez, yani fatura numarası
    /// kiracı bazlı değil GLOBAL tekildir. Her kiracıda 1'den başlatmak indeks ihlali verir.</summary>
    private int _invoiceNo;
    private int _purchaseNo;

    /// <summary>Hibe başvurusu sayacı. BAĞLAMLAR ARASI DEVAM EDER: her kiracıda tek hibe
    /// projesi olduğu için bağlam-içi indeks kullanılsa tüm başvurular "Başvuru" aşamasında
    /// kalır ve hakediş dilimi hiç üretilmezdi.</summary>
    private int _grantAppNo;

    public DemoWorldSeeder(
        IServiceProvider sp,
        IConfiguration configuration,
        IGuidGenerator guid,
        IClock clock,
        ICurrentTenant currentTenant,
        ITenantRepository tenantRepository,
        ITenantManager tenantManager,
        IdentityUserManager userManager,
        IdentityRoleManager roleManager,
        IPermissionGrantRepository permissionGrants)
    {
        _sp = sp;
        _configuration = configuration;
        _guid = guid;
        _clock = clock;
        _currentTenant = currentTenant;
        _tenantRepository = tenantRepository;
        _tenantManager = tenantManager;
        _userManager = userManager;
        _roleManager = roleManager;
        _permissionGrants = permissionGrants;
        Logger = NullLogger<DemoWorldSeeder>.Instance;
    }

    private IRepository<T, Guid> Repo<T>() where T : class, IEntity<Guid>
        => _sp.GetRequiredService<IRepository<T, Guid>>();

    // ============================================================
    //  Giriş noktası
    // ============================================================

    public async Task SeedAsync(DataSeedContext context)
    {
        if (!_configuration.GetValue<bool>(PlatformTestDataSeedContributor.SeedDemoDataConfigKey))
        {
            return;
        }

        // Kiracı döngüsünü kendimiz yönetiyoruz; ABP bizi kiracı başına da çağırsa
        // yalnız host çağrısında iş yaparız.
        if (context.TenantId != null)
        {
            return;
        }

        if (await Repo<Project>().GetCountAsync() > 0)
        {
            Logger.LogInformation("Demo dunyasi zaten kurulu, atlaniyor.");
            return;
        }

        _today = _clock.Now.Date;
        _rnd = new Random(RandomSeed);

        Logger.LogInformation("Demo dunyasi kuruluyor: host + {Count} kiraci...", TenantCount);

        await SeedExchangeRatesAsync(null);

        // --- Host ---
        _taskNumber = 0;
        await SeedContextAsync(null, "Apya Merkez", "apya", HostProjectCount, isPrimary: true);
        Logger.LogInformation("  host tamamlandi ({Count} proje).", HostProjectCount);

        // --- Kiracılar ---
        var names = DemoWorldData.TenantNames.Take(TenantCount).ToArray();
        var perTenant = DistributeEvenly(TenantProjectTotal, TenantCount);

        for (var i = 0; i < names.Length; i++)
        {
            var (name, slug) = names[i];
            var tenant = await _tenantManager.CreateAsync(name);
            await _tenantRepository.InsertAsync(tenant, autoSave: true);

            using (_currentTenant.Change(tenant.Id, tenant.Name))
            {
                _taskNumber = 0; // görev sırası kiracı içinde tekil
                await SeedExchangeRatesAsync(tenant.Id);
                await SeedContextAsync(tenant.Id, name, slug, perTenant[i], isPrimary: false);
            }

            if ((i + 1) % 5 == 0)
            {
                Logger.LogInformation("  {Done}/{Total} kiraci tamamlandi.", i + 1, names.Length);
            }
        }

        Logger.LogInformation("Demo dunyasi kuruldu.");
    }

    /// <summary>Toplamı kovalara olabildiğince eşit dağıtır (140/30 → 5,5,...,4,4).</summary>
    private static int[] DistributeEvenly(int total, int buckets)
    {
        var result = new int[buckets];
        var baseCount = total / buckets;
        var remainder = total % buckets;
        for (var i = 0; i < buckets; i++)
        {
            result[i] = baseCount + (i < remainder ? 1 : 0);
        }
        return result;
    }

    /// <summary>Bir bağlamın (host ya da tek kiracı) tüm demo verisini kurar.</summary>
    private async Task SeedContextAsync(Guid? tenantId, string orgName, string slug, int projectCount, bool isPrimary)
    {
        var team = await SeedRolesAndUsersAsync(tenantId, slug, isPrimary);
        var cashIds = await SeedCashAccountsAsync(tenantId);
        var customerIds = await SeedCustomersAsync(tenantId);
        var tagIds = await SeedTagsAsync(tenantId);

        var projects = await SeedProjectsAsync(tenantId, orgName, projectCount, customerIds, team);

        await SeedTasksAsync(tenantId, projects, team, tagIds, isPrimary);
        await SeedFinanceAsync(tenantId, projects, customerIds, cashIds);
        await SeedGrantsAsync(tenantId, projects, isPrimary);
        await SeedDocumentsAsync(tenantId, projects);
        await SeedFormsAsync(tenantId, slug, team, isPrimary);
        await SeedPlatformAsync(tenantId, team, projects, isPrimary);
    }

    // ---------- ortak yardımcılar ----------

    private DateTime Day(int offset) => _today.AddDays(offset);

    private int Rand(int minInclusive, int maxExclusive) => _rnd.Next(minInclusive, maxExclusive);

    private T Pick<T>(IReadOnlyList<T> source) => source[_rnd.Next(source.Count)];

    private bool Chance(int percent) => _rnd.Next(100) < percent;

    private decimal Money(int minThousand, int maxThousand)
        => _rnd.Next(minThousand, maxThousand) * 1000m;
}
