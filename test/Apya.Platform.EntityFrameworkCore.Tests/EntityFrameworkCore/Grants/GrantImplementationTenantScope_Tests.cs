using System;
using System.Reflection;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 🔴 SEC-06 · Hibe uygulama servisinin kimlikle-bulma yardımcıları kiracı süzgecini
/// KOŞULSUZ kapatıyordu: çıplak kimlikle tüm kiracılarda arıyorlardı.
///
/// <para>Bugün üçü de yalnız danışman kapısından (<c>EnsureConsultant</c>) sonra çağrılıyor,
/// yani açık bir sızıntı yoktu — ve tam da bu yüzden hiçbir test göremezdi: firma
/// bağlamından bu yardımcılara giden bir genel yol YOK. Sızıntı, ilk firma-tarafı çağrı
/// eklendiği gün doğardı.</para>
///
/// <para>Bu yüzden yardımcılar burada yansıma ile DOĞRUDAN çağrılır. Özel metodu test
/// etmek normalde kötü bir fikirdir; burada ölçülen şey bir uygulama ayrıntısı değil,
/// "bu yardımcı hangi çağıranla kullanılırsa kullanılsın başka kiracının kaydını vermez"
/// güvencesinin kendisi.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantImplementationTenantScope_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly GrantImplementationAppService _service;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantApplication, Guid> _appRepository;
    private readonly IRepository<GrantReport, Guid> _reportRepository;
    private readonly IRepository<GrantReportSection, Guid> _sectionRepository;
    private readonly IRepository<GrantDisbursementTranche, Guid> _trancheRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantImplementationTenantScope_Tests()
    {
        _service = GetRequiredService<GrantImplementationAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _appRepository = GetRequiredService<IRepository<GrantApplication, Guid>>();
        _reportRepository = GetRequiredService<IRepository<GrantReport, Guid>>();
        _sectionRepository = GetRequiredService<IRepository<GrantReportSection, Guid>>();
        _trancheRepository = GetRequiredService<IRepository<GrantDisbursementTranche, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateTenantAsync(string name)
    {
        var tenant = await _tenantManager.CreateAsync(name + " " + Guid.NewGuid().ToString("N")[..6]);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    /// <summary>Sahip kiracıya ait rapor + bölüm + dilim; üçünün kimliğini döner.</summary>
    private async Task<(Guid OwnerTenantId, Guid ReportId, Guid SectionId, Guid TrancheId)> CreateOwnedRecordsAsync()
    {
        _currentTenant.Id.ShouldBeNull("katalog host bağlamında tohumlanmalı");

        var grant = new Grant(Guid.NewGuid(), "Süzgeç Desteği", "Kurum", 500_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);
        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik);
        await _callRepository.InsertAsync(call, autoSave: true);

        var ownerTenantId = await CreateTenantAsync("Sahip Firma");

        using (_currentTenant.Change(ownerTenantId))
        {
            var application = new GrantApplication(Guid.NewGuid(), ownerTenantId, call.Id);
            await _appRepository.InsertAsync(application, autoSave: true);

            var tranche = new GrantDisbursementTranche(Guid.NewGuid(), ownerTenantId, application.Id, 1, 100_000m, null);
            await _trancheRepository.InsertAsync(tranche, autoSave: true);

            var report = new GrantReport(Guid.NewGuid(), ownerTenantId, application.Id, tranche.Id, 1, "Ara rapor", null);
            await _reportRepository.InsertAsync(report, autoSave: true);

            var section = new GrantReportSection(Guid.NewGuid(), ownerTenantId, report.Id, 1, "Teknik bölüm");
            await _sectionRepository.InsertAsync(section, autoSave: true);

            return (ownerTenantId, report.Id, section.Id, tranche.Id);
        }
    }

    /// <summary>Özel yardımcıyı çağırır; yansıma sarmalayıcısını açıp asıl istisnayı fırlatır.</summary>
    private async Task InvokeLookupAsync(string methodName, Guid id)
    {
        var method = typeof(GrantImplementationAppService).GetMethod(
            methodName, BindingFlags.Instance | BindingFlags.NonPublic);
        method.ShouldNotBeNull($"{methodName} bulunamadı — yardımcının adı değiştiyse bu testi de güncelleyin");

        try
        {
            await (Task)method!.Invoke(_service, new object[] { id })!;
        }
        catch (TargetInvocationException ex) when (ex.InnerException != null)
        {
            throw ex.InnerException;
        }
    }

    private static Guid Pick(string methodName, (Guid OwnerTenantId, Guid ReportId, Guid SectionId, Guid TrancheId) ids)
        => methodName switch
        {
            "GetReportAsync" => ids.ReportId,
            "GetSectionAsync" => ids.SectionId,
            "GetTrancheAsync" => ids.TrancheId,
            _ => throw new ArgumentOutOfRangeException(nameof(methodName), methodName, null),
        };

    [Theory]
    [InlineData("GetReportAsync")]
    [InlineData("GetSectionAsync")]
    [InlineData("GetTrancheAsync")]
    public async Task Baska_kiraci_kimligini_bilse_de_kaydi_alamaz(string methodName)
    {
        var ids = await WithUnitOfWorkAsync(CreateOwnedRecordsAsync);
        var otherTenantId = await WithUnitOfWorkAsync(() => CreateTenantAsync("Yabancı Firma"));

        using (_currentTenant.Change(otherTenantId))
        {
            await Should.ThrowAsync<EntityNotFoundException>(
                () => WithUnitOfWorkAsync(() => InvokeLookupAsync(methodName, Pick(methodName, ids))));
        }
    }

    /// <summary>Sahibi kendi kaydına ulaşır: süzgeç açıkken de bulunur.</summary>
    [Theory]
    [InlineData("GetReportAsync")]
    [InlineData("GetSectionAsync")]
    [InlineData("GetTrancheAsync")]
    public async Task Sahibi_kendi_kaydini_alir(string methodName)
    {
        var ids = await WithUnitOfWorkAsync(CreateOwnedRecordsAsync);

        using (_currentTenant.Change(ids.OwnerTenantId))
        {
            await WithUnitOfWorkAsync(() => InvokeLookupAsync(methodName, Pick(methodName, ids)));
        }
    }

    /// <summary>
    /// Danışman (host) her kiracının kaydına ulaşmaya DEVAM eder — düzeltme danışmanın
    /// rapor/dilim yönetimini bozmamalı.
    /// </summary>
    [Theory]
    [InlineData("GetReportAsync")]
    [InlineData("GetSectionAsync")]
    [InlineData("GetTrancheAsync")]
    public async Task Danisman_her_kiracinin_kaydini_alir(string methodName)
    {
        var ids = await WithUnitOfWorkAsync(CreateOwnedRecordsAsync);

        _currentTenant.Id.ShouldBeNull();
        await WithUnitOfWorkAsync(() => InvokeLookupAsync(methodName, Pick(methodName, ids)));
    }
}
