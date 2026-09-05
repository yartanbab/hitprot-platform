using System;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;

namespace Apya.Platform.Tenants;

/// <summary>
/// Kiracı kurulumunun tek gövdesi: tenant + admin kullanıcı tohumu + profil + feature seti
/// + abonelik dönemi.
///
/// <para><b>Neden AppService DEĞİL:</b> iki farklı kapıdan çağrılıyor — host'un "Yeni Müşteri"
/// modalı (<see cref="TenantProfileAppService.CreateTenantWithProfileAsync"/>, izin: Tenants.Create)
/// ve adayın protokol onayı (oturumsuz; yetkiyi tek kullanımlık davet jetonu verir). Gövde bir
/// AppService'te kalsaydı ikinci çağrı ABP'nin yetki kesicisine takılırdı; yetkilendirmeyi
/// kapıda tutup kurulumu ortak bir sınıfa almak, oturumsuz uca sahte bir yönetici kimliği
/// takmaktan dürüst.</para>
///
/// <para>🔴 <b>KENDİ requiresNew + transactional UoW'ünde koşar.</b> Aksi halde işlem dıştaki
/// sayfa UoW'una (AbpUowPageFilter) katılır; seed edilen admin permission grant'ları hem seed
/// sırasında hem sayfa UoW'unun SaveChanges'inde izlenip İKİ KEZ INSERT edilir →
/// IX_AbpPermissionGrants_TenantId_Name_ProviderName_ProviderKey (23505 duplicate) →
/// "Yeni Müşteri" 500. Tek sahip UoW + tek geçiş seed ile grant'lar tam olarak bir kez yazılır.</para>
///
/// <para>Bunun sonucu: kurulum, çağıranın transaction'ından BAĞIMSIZ commit olur. Protokol
/// akışı bu yüzden sözleşmeyi ÖNCE yazar — kurulum düşerse ortada onaylanmış bir sözleşme ve
/// açılmamış bir hesap kalır; bu, tersine göre kurtarılabilir bir durumdur.</para>
/// </summary>
public class TenantProvisioner : ITransientDependency
{
    private readonly ITenantRepository _tenantRepository;
    private readonly ITenantManager _tenantManager;
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;
    private readonly TenantProfileManager _tenantProfileManager;
    private readonly TenantPackageManager _tenantPackageManager;
    private readonly TenantSubscriptionManager _tenantSubscriptionManager;
    private readonly IDataSeeder _dataSeeder;
    private readonly IUnitOfWorkManager _unitOfWorkManager;
    private readonly ICurrentTenant _currentTenant;

    public TenantProvisioner(
        ITenantRepository tenantRepository,
        ITenantManager tenantManager,
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        TenantProfileManager tenantProfileManager,
        TenantPackageManager tenantPackageManager,
        TenantSubscriptionManager tenantSubscriptionManager,
        IDataSeeder dataSeeder,
        IUnitOfWorkManager unitOfWorkManager,
        ICurrentTenant currentTenant)
    {
        _tenantRepository = tenantRepository;
        _tenantManager = tenantManager;
        _tenantProfileRepository = tenantProfileRepository;
        _tenantProfileManager = tenantProfileManager;
        _tenantPackageManager = tenantPackageManager;
        _tenantSubscriptionManager = tenantSubscriptionManager;
        _dataSeeder = dataSeeder;
        _unitOfWorkManager = unitOfWorkManager;
        _currentTenant = currentTenant;
    }

    /// <summary>
    /// Kiracıyı kurar.
    /// <para>
    /// <paramref name="resolveUniqueName"/> açıkken <c>input.Name</c> bir ÖNERİDİR:
    /// slug'a indirilir ve boşta bir ad bulunana kadar "-2", "-3" eklenir. Host'un
    /// "Yeni Müşteri" modalı bunu KULLANMAZ — orada ad elle girilir ve çakışma sessizce
    /// başka bir ada kayarsa müşteri, yazdığından farklı adlı bir hesap alırdı.
    /// </para>
    /// <para>
    /// Boşluk sorguyla ARANMAZ, oluşturma DENENİR — gerekçe
    /// <see cref="CreateWithAvailableNameAsync"/> içinde.
    /// </para>
    /// </summary>
    public async Task<TenantProvisioningResult> ProvisionAsync(
        CreateTenantExtendedDto input,
        bool resolveUniqueName = false)
    {
        using var uow = _unitOfWorkManager.Begin(requiresNew: true, isTransactional: true);

        var tenant = resolveUniqueName
            ? await CreateWithAvailableNameAsync(input.Name)
            : await _tenantManager.CreateAsync(input.Name);

        await _tenantRepository.InsertAsync(tenant, autoSave: true);

        using (_currentTenant.Change(tenant.Id, tenant.Name))
        {
            await _dataSeeder.SeedAsync(
                new DataSeedContext(tenant.Id)
                    .WithProperty("AdminEmail", input.AdminEmailAddress)
                    .WithProperty("AdminPassword", input.AdminPassword));
        }

        var profile = await _tenantProfileManager.CreateProfileAsync(
            tenant.Id,
            input.CompanyType,
            input.TaxNumber,
            input.CorporateEmail);

        profile.SetPackage(input.PackageCode);
        profile.TaxOffice = input.TaxOffice ?? string.Empty;
        profile.Address = input.Address ?? string.Empty;
        profile.LegalRepresentativeName = input.LegalRepresentativeName ?? string.Empty;
        profile.LegalRepresentativePhone = input.LegalRepresentativePhone ?? string.Empty;
        profile.OperationalContactName = input.OperationalContactName ?? string.Empty;
        profile.OperationalContactPhone = input.OperationalContactPhone ?? string.Empty;

        await _tenantProfileRepository.InsertAsync(profile);

        // Paketin feature setini tenant'a uygula → feature'lar permission tavanını belirler.
        await _tenantPackageManager.ApplyPackageAsync(tenant.Id, input.PackageCode);

        // Abonelik dönemi: süresiz seçilirse satır yine açılır ama EndDate boş kalır, yani
        // süre işleyicisi bu müşteriye hiç dokunmaz.
        var subscription = await _tenantSubscriptionManager.StartAsync(
            tenant.Id, input.PackageCode, input.SubscriptionPeriod, SubscriptionSource.Manual);

        await uow.CompleteAsync();

        return new TenantProvisioningResult(tenant.Id, tenant.Name, profile, subscription);
    }

    /// <summary>
    /// Kurum unvanından boşta bir kiracı adı türetip kiracıyı oluşturur. Ad ABP tarafında
    /// TEKİLDİR ve giriş ekranındaki kiracı seçicisinde görünür; bu yüzden okunabilir
    /// tutulur, GUID'e kaçılmaz.
    ///
    /// <para>🔑 Boşluk ARANMAZ, DENENİR. "Önce sorgula, boşsa kullan" yaklaşımı ABP'nin
    /// kendi doğrulayıcısıyla aynı anlık görüntüyü görmediği için yanlış cevap verebiliyor
    /// (ölçüldü: sorgu "boş" derken <c>TenantManager.CreateAsync</c> "bu ad zaten var"
    /// diyordu). Oluşturmayı denemek tek güvenilir kontroldür ve yarış koşulunu da kapatır.</para>
    ///
    /// <para>Deneme UoW'un İLK yazma işlemidir; başarısız denemede geride hiçbir kayıt
    /// kalmaz, bu yüzden aynı UoW içinde sonraki adı denemek güvenlidir.</para>
    /// </summary>
    private async Task<Tenant> CreateWithAvailableNameAsync(string suggestion)
    {
        var baseName = Slugify(suggestion);
        if (baseName.IsNullOrWhiteSpace())
        {
            baseName = "kurum";
        }

        Exception? lastFailure = null;

        for (var attempt = 1; attempt <= MaxNameAttempts; attempt++)
        {
            var candidate = attempt == 1 ? baseName : $"{baseName}-{attempt}";

            try
            {
                return await _tenantManager.CreateAsync(candidate);
            }
            catch (BusinessException ex)
            {
                // Ad geçersiz de olabilir, dolu da. Ayırt edemiyoruz (ABP burada özel bir
                // kod vermiyor); birkaç deneme sonunda son hatayı olduğu gibi yükseltiyoruz
                // ki gerçek sebep kaybolmasın.
                lastFailure = ex;
            }
        }

        throw new BusinessException(PlatformDomainErrorCodes.AgreementTenantNameTaken, innerException: lastFailure)
            .WithData("Suggestion", suggestion);
    }

    /// <summary>
    /// Türkçe harfler ASCII'ye indirilir; ad bazı yerlerde URL/anahtar gibi kullanılıyor.
    /// </summary>
    private static string Slugify(string value)
    {
        var builder = new StringBuilder(value.Length);
        var lastWasDash = false;

        foreach (var ch in value.Trim().ToLowerInvariant())
        {
            var mapped = ch switch
            {
                'ı' or 'i' or 'î' => 'i',
                'ğ' => 'g',
                'ü' or 'û' => 'u',
                'ş' => 's',
                'ö' => 'o',
                'ç' => 'c',
                'â' => 'a',
                _ => ch
            };

            if (char.IsAsciiLetterOrDigit(mapped))
            {
                builder.Append(mapped);
                lastWasDash = false;
            }
            else if (!lastWasDash && builder.Length > 0)
            {
                builder.Append('-');
                lastWasDash = true;
            }
        }

        // 🔴 ABP'nin Left() metodu KIRPMAZ, dize kısaysa ArgumentException atar —
        // uzunluk kontrolü şart.
        var slug = builder.ToString().Trim('-');

        return slug.Length <= MaxTenantNameLength ? slug : slug[..MaxTenantNameLength].TrimEnd('-');
    }

    /// <summary>ABP kiracı adı 64 karakterle sınırlı; sonekler için pay bırakılır.</summary>
    private const int MaxTenantNameLength = 56;

    /// <summary>Ad denemesi üst sınırı. Aynı unvanlı sekiz kurum gerçek dünyada görülmez;
    /// sınırın asıl işi, ad dışı bir doğrulama hatasında sonsuz denemeyi önlemektir.</summary>
    private const int MaxNameAttempts = 8;
}

/// <summary>Kurulumun çıktısı. DTO'ya çevirme çağıranın işi — eşleme profili orada.</summary>
public record TenantProvisioningResult(
    Guid TenantId,
    string TenantName,
    TenantProfile Profile,
    TenantSubscription Subscription);
