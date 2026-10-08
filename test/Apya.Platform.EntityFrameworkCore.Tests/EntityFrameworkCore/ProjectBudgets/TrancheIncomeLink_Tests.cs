using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Incomes;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.ProjectBudgets;

/// <summary>
/// 🔴 FIN-06 · Fon dilimi tahsilatının gelir kaydı bağı.
///
/// <para>Tahsilat, gönderilen gelir kaydı kimliğini hiç doğrulamadan yazıyordu; gelir
/// kaydı silinirken de ona bağlı dilim sorulmuyordu. Sonuç: var olmayan / başka projenin /
/// iki dilime birden bağlı gelir, ve "tahsil edildi" + silinmiş kaydın kimliğiyle kalan dilim.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TrancheIncomeLink_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectBudgetAppService _budgetAppService;
    private readonly IIncomeEntryAppService _incomeAppService;
    private readonly FundingTrancheIncomeLinkRepairDataSeedContributor _repair;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
    private readonly IRepository<FundingTranche, Guid> _trancheRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IUnitOfWorkManager _uowManager;

    public TrancheIncomeLink_Tests()
    {
        _budgetAppService = GetRequiredService<IProjectBudgetAppService>();
        _incomeAppService = GetRequiredService<IIncomeEntryAppService>();
        _repair = GetRequiredService<FundingTrancheIncomeLinkRepairDataSeedContributor>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _incomeRepository = GetRequiredService<IRepository<IncomeEntry, Guid>>();
        _trancheRepository = GetRequiredService<IRepository<FundingTranche, Guid>>();
        _cashAccountRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
        _cashMovementRepository = GetRequiredService<IRepository<CashMovement, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _uowManager = GetRequiredService<IUnitOfWorkManager>();
    }

    private async Task<Guid> NewProjectAsync()
    {
        var code = "PRJ-" + Guid.NewGuid().ToString("N")[..6];
        var project = new Project(Guid.NewGuid(), _currentTenant.Id, null, "Tahsilat " + code, code, "");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private async Task<Guid> NewIncomeAsync(Guid? projectId, decimal amount = 400_000m)
    {
        var income = new IncomeEntry(Guid.NewGuid(), "Hibe taksiti", amount, new DateTime(2026, 9, 1),
            projectId: projectId, tenantId: _currentTenant.Id);
        await _incomeRepository.InsertAsync(income, autoSave: true);
        return income.Id;
    }

    private async Task<Guid> NewTrancheAsync(Guid projectId, decimal amount = 400_000m)
        => (await _budgetAppService.CreateTrancheAsync(projectId,
            new CreateUpdateTrancheDto { PlannedAmount = amount })).Id;

    private static RegisterCollectionDto Collect(Guid? incomeEntryId, decimal amount = 400_000m) => new()
    {
        ReceivedAmount = amount,
        ReceivedDate = new DateTime(2026, 9, 2),
        IncomeEntryId = incomeEntryId,
    };

    private async Task<FundingTranche> ReadTrancheAsync(Guid id)
    {
        using var uow = _uowManager.Begin(requiresNew: true);
        var tranche = await _trancheRepository.GetAsync(id);
        await uow.CompleteAsync();
        return tranche;
    }

    /* ─── Bağ kurulurken ──────────────────────────────────────────────── */

    [Fact]
    public async Task Ayni_projenin_geliri_baglanir()
    {
        var projectId = await NewProjectAsync();
        var trancheId = await NewTrancheAsync(projectId);
        var incomeId = await NewIncomeAsync(projectId);

        await _budgetAppService.RegisterCollectionAsync(trancheId, Collect(incomeId));

        (await ReadTrancheAsync(trancheId)).IncomeEntryId.ShouldBe(incomeId);
    }

    [Fact]
    public async Task Var_olmayan_gelir_kaydi_reddedilir_ve_tahsilat_yazilmaz()
    {
        var projectId = await NewProjectAsync();
        var trancheId = await NewTrancheAsync(projectId);

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _budgetAppService.RegisterCollectionAsync(trancheId, Collect(Guid.NewGuid())));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.TrancheIncomeEntryNotFound);

        // 🔴 Doğrulama DEĞİŞİKLİKTEN önce: reddedilen çağrı tutarı da yazmamış olmalı.
        var stored = await ReadTrancheAsync(trancheId);
        stored.ReceivedAmount.ShouldBe(0m);
        stored.IncomeEntryId.ShouldBeNull();
    }

    [Fact]
    public async Task Baska_projenin_geliri_reddedilir()
    {
        var projectId = await NewProjectAsync();
        var otherProjectId = await NewProjectAsync();
        var trancheId = await NewTrancheAsync(projectId);
        var foreignIncomeId = await NewIncomeAsync(otherProjectId);

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _budgetAppService.RegisterCollectionAsync(trancheId, Collect(foreignIncomeId)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.TrancheIncomeEntryProjectMismatch);
    }

    [Fact]
    public async Task Projesiz_gelir_reddedilir()
    {
        var projectId = await NewProjectAsync();
        var trancheId = await NewTrancheAsync(projectId);
        var looseIncomeId = await NewIncomeAsync(projectId: null);

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _budgetAppService.RegisterCollectionAsync(trancheId, Collect(looseIncomeId)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.TrancheIncomeEntryProjectMismatch);
    }

    /// <summary>Aynı gelir iki dilime bağlanırsa aynı para iki dilimin tahsilatı sayılırdı.</summary>
    [Fact]
    public async Task Ayni_gelir_ikinci_bir_dilime_baglanamaz()
    {
        var projectId = await NewProjectAsync();
        var first = await NewTrancheAsync(projectId);
        var second = await NewTrancheAsync(projectId);
        var incomeId = await NewIncomeAsync(projectId);

        await _budgetAppService.RegisterCollectionAsync(first, Collect(incomeId));

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _budgetAppService.RegisterCollectionAsync(second, Collect(incomeId)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.TrancheIncomeEntryAlreadyLinked);
        ex.Data["SequenceNo"].ShouldBe(1, "hata hangi dilimin bağlı olduğunu söylemeli");
    }

    /// <summary>
    /// Kümülatif tahsilat ikinci kez girildiğinde dilim KENDİ bağını yeniden gönderir;
    /// kendisiyle çakışmamalı (yoksa kısmi tahsilat hiç güncellenemezdi).
    /// </summary>
    [Fact]
    public async Task Dilim_kendi_bagini_yeniden_kaydedebilir()
    {
        var projectId = await NewProjectAsync();
        var trancheId = await NewTrancheAsync(projectId);
        var incomeId = await NewIncomeAsync(projectId);

        await _budgetAppService.RegisterCollectionAsync(trancheId, Collect(incomeId, 150_000m));
        await _budgetAppService.RegisterCollectionAsync(trancheId, Collect(incomeId, 400_000m));

        var stored = await ReadTrancheAsync(trancheId);
        stored.ReceivedAmount.ShouldBe(400_000m);
        stored.IncomeEntryId.ShouldBe(incomeId);
    }

    /// <summary>Tahsilat sıfırlanırken gönderilen kimlik doğrulanmaz: bağ zaten temizlenir.</summary>
    [Fact]
    public async Task Tahsilat_sifirlanirken_kimlik_dogrulanmaz_ve_bag_temizlenir()
    {
        var projectId = await NewProjectAsync();
        var trancheId = await NewTrancheAsync(projectId);
        var incomeId = await NewIncomeAsync(projectId);
        await _budgetAppService.RegisterCollectionAsync(trancheId, Collect(incomeId));

        await _budgetAppService.RegisterCollectionAsync(trancheId, Collect(Guid.NewGuid(), amount: 0m));

        var stored = await ReadTrancheAsync(trancheId);
        stored.ReceivedAmount.ShouldBe(0m);
        stored.IncomeEntryId.ShouldBeNull();
    }

    /* ─── Gelir silinirken / taşınırken ───────────────────────────────── */

    /// <summary>
    /// 🔴 Bağlı gelir silinemez — ve reddedilen silme HİÇBİR ŞEYİ silmemiş olmalı. Doğrulama
    /// kasa hareketinin silinmesinden sonra gelseydi kasa bakiyesi sessizce bozulurdu.
    /// </summary>
    [Fact]
    public async Task Tahsilata_bagli_gelir_silinemez_ve_kasa_hareketi_yerinde_kalir()
    {
        var projectId = await NewProjectAsync();
        var trancheId = await NewTrancheAsync(projectId);

        var cash = new CashAccount(Guid.NewGuid(), "Kasa " + Guid.NewGuid().ToString("N")[..6], CashAccountType.Cash, "TRY");
        await _cashAccountRepository.InsertAsync(cash, autoSave: true);

        var income = await _incomeAppService.CreateAsync(new CreateUpdateIncomeEntryDto
        {
            Title = "Hibe taksiti", Amount = 400_000m, Currency = "TRY",
            IncomeDate = new DateTime(2026, 9, 1), ProjectId = projectId, CashAccountId = cash.Id,
        });
        await _budgetAppService.RegisterCollectionAsync(trancheId, Collect(income.Id));

        var ex = await Should.ThrowAsync<BusinessException>(() => _incomeAppService.DeleteAsync(income.Id));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.IncomeEntryLinkedToTranche);

        using var uow = _uowManager.Begin(requiresNew: true);
        (await _incomeRepository.FindAsync(income.Id)).ShouldNotBeNull("gelir silinmemiş olmalı");
        (await _cashMovementRepository.CountAsync(m => m.ReferenceId == income.Id))
            .ShouldBe(1, "reddedilen silme kasa hareketine dokunmamalı");
        await uow.CompleteAsync();
    }

    /// <summary>Kullanıcının çıkış yolu: tahsilattaki bağı kaldır, sonra sil.</summary>
    [Fact]
    public async Task Bag_kaldirilinca_gelir_silinebilir()
    {
        var projectId = await NewProjectAsync();
        var trancheId = await NewTrancheAsync(projectId);
        var incomeId = await NewIncomeAsync(projectId);
        await _budgetAppService.RegisterCollectionAsync(trancheId, Collect(incomeId));

        // Tutar duruyor, yalnız gelir seçimi kaldırılıyor.
        await _budgetAppService.RegisterCollectionAsync(trancheId, Collect(incomeEntryId: null));
        await _incomeAppService.DeleteAsync(incomeId);

        var stored = await ReadTrancheAsync(trancheId);
        stored.ReceivedAmount.ShouldBe(400_000m, "bağsız tahsilat geçerli bir durumdur");
        stored.IncomeEntryId.ShouldBeNull();
    }

    [Fact]
    public async Task Tahsilata_bagli_gelir_baska_projeye_tasinamaz_ama_duzeltilebilir()
    {
        var projectId = await NewProjectAsync();
        var otherProjectId = await NewProjectAsync();
        var trancheId = await NewTrancheAsync(projectId);
        var incomeId = await NewIncomeAsync(projectId);
        await _budgetAppService.RegisterCollectionAsync(trancheId, Collect(incomeId));

        CreateUpdateIncomeEntryDto Edit(Guid? project, string title) => new()
        {
            Title = title, Amount = 400_000m, Currency = "TRY",
            IncomeDate = new DateTime(2026, 9, 1), ProjectId = project,
        };

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _incomeAppService.UpdateAsync(incomeId, Edit(otherProjectId, "Taşınmak istenen")));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.IncomeEntryLinkedToTranche);

        // Proje değişmiyorsa güncelleme serbest: başlık düzeltilebilmeli.
        var updated = await _incomeAppService.UpdateAsync(incomeId, Edit(projectId, "Düzeltilmiş başlık"));
        updated.Title.ShouldBe("Düzeltilmiş başlık");
    }

    /* ─── Taşımanın öteki iki yolu ─────────────────────────────────────
     * Tam güncelleme (yukarıdaki test) taşımayı reddediyordu; aynı taşıma iki yoldan daha
     * yapılabiliyordu ve ikisi de korumayı sormuyordu. */

    private async Task<Apya.Platform.Tasks.TaskItem> NewTaskAsync(Guid projectId)
    {
        var task = new Apya.Platform.Tasks.TaskItem(
            Guid.NewGuid(), "Hibe raporu " + Guid.NewGuid().ToString("N")[..6], projectId,
            tenantId: _currentTenant.Id, now: new DateTime(2026, 9, 1));
        await GetRequiredService<IRepository<Apya.Platform.Tasks.TaskItem, Guid>>().InsertAsync(task, autoSave: true);
        return task;
    }

    private async Task<IncomeEntry> ReadIncomeAsync(Guid id)
    {
        using var uow = _uowManager.Begin(requiresNew: true);
        var income = await _incomeRepository.GetAsync(id);
        await uow.CompleteAsync();
        return income;
    }

    /// <summary>"İlişkiyi değiştir…" ucu: bağlı gelir başka projeye de, "bağımsız"a da geçemez.</summary>
    [Fact]
    public async Task Tahsilata_bagli_gelirin_iliskisi_baska_projeye_ya_da_bagimsiza_degistirilemez()
    {
        var projectId = await NewProjectAsync();
        var otherProjectId = await NewProjectAsync();
        var trancheId = await NewTrancheAsync(projectId);
        var incomeId = await NewIncomeAsync(projectId);
        await _budgetAppService.RegisterCollectionAsync(trancheId, Collect(incomeId));

        var toOther = await Should.ThrowAsync<BusinessException>(
            () => _incomeAppService.SetScopeAsync(incomeId, new SetIncomeScopeDto { ProjectId = otherProjectId }));
        toOther.Code.ShouldBe(PlatformDomainErrorCodes.IncomeEntryLinkedToTranche);

        var toNone = await Should.ThrowAsync<BusinessException>(
            () => _incomeAppService.SetScopeAsync(incomeId, new SetIncomeScopeDto()));
        toNone.Code.ShouldBe(PlatformDomainErrorCodes.IncomeEntryLinkedToTranche);

        var otherTask = await NewTaskAsync(otherProjectId);
        var toOtherTask = await Should.ThrowAsync<BusinessException>(
            () => _incomeAppService.SetScopeAsync(incomeId, new SetIncomeScopeDto { TaskId = otherTask.Id }));
        toOtherTask.Code.ShouldBe(PlatformDomainErrorCodes.IncomeEntryLinkedToTranche);

        // 🔴 Doğrulama DEĞİŞİKLİKTEN önce: reddedilen çağrılar hiçbir alanı yazmamış olmalı.
        var stored = await ReadIncomeAsync(incomeId);
        stored.ProjectId.ShouldBe(projectId);
        stored.TaskId.ShouldBeNull();
        (await ReadTrancheAsync(trancheId)).IncomeEntryId.ShouldBe(incomeId);
    }

    /// <summary>Karşı yön: aynı projenin içinde ilişki değişebilir (bir göreve bağlamak taşıma değildir).</summary>
    [Fact]
    public async Task Tahsilata_bagli_gelir_ayni_projenin_gorevine_baglanabilir()
    {
        var projectId = await NewProjectAsync();
        var trancheId = await NewTrancheAsync(projectId);
        var incomeId = await NewIncomeAsync(projectId);
        await _budgetAppService.RegisterCollectionAsync(trancheId, Collect(incomeId));
        var task = await NewTaskAsync(projectId);

        var updated = await _incomeAppService.SetScopeAsync(incomeId, new SetIncomeScopeDto { TaskId = task.Id });

        updated.TaskId.ShouldBe(task.Id);
        updated.ProjectId.ShouldBe(projectId);
    }

    /// <summary>
    /// Görev taşıma, görevin gelirlerini de yeni projeye geçirir. Dilime bağlı gelir varsa taşıma
    /// REDDEDİLİR — aksi halde dilim sessizce başka projenin gelirine bağlı kalırdı.
    /// </summary>
    [Fact]
    public async Task Tahsilata_bagli_geliri_olan_gorev_baska_projeye_tasinamaz()
    {
        var taskAppService = GetRequiredService<Apya.Platform.Tasks.ITaskAppService>();
        var projectId = await NewProjectAsync();
        var otherProjectId = await NewProjectAsync();
        var trancheId = await NewTrancheAsync(projectId);
        var task = await NewTaskAsync(projectId);
        var incomeId = await NewIncomeAsync(projectId);
        await _incomeAppService.SetScopeAsync(incomeId, new SetIncomeScopeDto { TaskId = task.Id });
        await _budgetAppService.RegisterCollectionAsync(trancheId, Collect(incomeId));

        var ex = await Should.ThrowAsync<BusinessException>(
            () => taskAppService.TransferAsync(task.Id, new Apya.Platform.Tasks.Dtos.TransferTaskDto
            {
                Mode = Apya.Platform.Tasks.TaskTransferMode.Move,
                TargetProjectIds = { otherProjectId }
            }));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskTransferIncomeLinkedToTranche);

        // Hiçbir şey taşınmadı: görev, gelir ve bağ yerinde.
        using (var uow = _uowManager.Begin(requiresNew: true))
        {
            (await GetRequiredService<IRepository<Apya.Platform.Tasks.TaskItem, Guid>>().GetAsync(task.Id))
                .ProjectId.ShouldBe(projectId);
            await uow.CompleteAsync();
        }
        (await ReadIncomeAsync(incomeId)).ProjectId.ShouldBe(projectId);
        (await ReadTrancheAsync(trancheId)).IncomeEntryId.ShouldBe(incomeId);
    }

    /// <summary>Karşı yön: bağlı geliri OLMAYAN görev taşınır ve geliri onunla gider (eski davranış).</summary>
    [Fact]
    public async Task Bagli_geliri_olmayan_gorev_tasinir_ve_geliri_onunla_gider()
    {
        var taskAppService = GetRequiredService<Apya.Platform.Tasks.ITaskAppService>();
        var projectId = await NewProjectAsync();
        var otherProjectId = await NewProjectAsync();
        var task = await NewTaskAsync(projectId);
        var incomeId = await NewIncomeAsync(projectId);
        await _incomeAppService.SetScopeAsync(incomeId, new SetIncomeScopeDto { TaskId = task.Id });

        await taskAppService.TransferAsync(task.Id, new Apya.Platform.Tasks.Dtos.TransferTaskDto
        {
            Mode = Apya.Platform.Tasks.TaskTransferMode.Move,
            TargetProjectIds = { otherProjectId }
        });

        (await ReadIncomeAsync(incomeId)).ProjectId.ShouldBe(otherProjectId);
    }

    /// <summary>
    /// Hata kodu Türkçe metne çözülmeli: karşılığı olmayan kod kullanıcıya ham anahtar olarak görünür.
    /// </summary>
    [Fact]
    public void Gorev_tasima_reddinin_Turkce_metni_var()
    {
        var localizer = GetRequiredService<Microsoft.Extensions.Localization.IStringLocalizer<Apya.Platform.Localization.PlatformResource>>();

        using (Volo.Abp.Localization.CultureHelper.Use("tr"))
        {
            var text = localizer[PlatformDomainErrorCodes.TaskTransferIncomeLinkedToTranche];
            text.ResourceNotFound.ShouldBeFalse();
            text.Value.ShouldContain("fon diliminin tahsilatına bağlı");
        }
    }

    /* ─── Eski sarkık bağların onarımı ────────────────────────────────── */

    /// <summary>
    /// Silme engeli gelmeden ÖNCE doğmuş sarkık bağ: gelir silinmiş, dilim onun kimliğini
    /// taşıyor. Onarım bağı kaldırır, tahsil edilen TUTARA dokunmaz; sağlam bağa dokunmaz.
    /// </summary>
    [Fact]
    public async Task Onarim_silinmis_gelire_giden_bagi_kaldirir_saglam_baga_dokunmaz()
    {
        var projectId = await NewProjectAsync();
        var dangling = await NewTrancheAsync(projectId);
        var healthy = await NewTrancheAsync(projectId);
        var goneIncome = await NewIncomeAsync(projectId);
        var liveIncome = await NewIncomeAsync(projectId);

        await _budgetAppService.RegisterCollectionAsync(dangling, Collect(goneIncome));
        await _budgetAppService.RegisterCollectionAsync(healthy, Collect(liveIncome));

        // Eski davranışı taklit et: gelir, dilim sorulmadan doğrudan depodan silinir.
        await WithUnitOfWorkAsync(() => _incomeRepository.DeleteAsync(goneIncome));

        await WithUnitOfWorkAsync(() => _repair.SeedAsync(new DataSeedContext()));

        var repaired = await ReadTrancheAsync(dangling);
        repaired.IncomeEntryId.ShouldBeNull();
        repaired.ReceivedAmount.ShouldBe(400_000m, "onarım paraya dokunmaz");
        repaired.Status.ShouldBe(FundingTrancheStatus.Collected);

        (await ReadTrancheAsync(healthy)).IncomeEntryId.ShouldBe(liveIncome);

        // İkinci tur yazacak bir şey bulamaz.
        await WithUnitOfWorkAsync(() => _repair.SeedAsync(new DataSeedContext()));
        (await ReadTrancheAsync(healthy)).IncomeEntryId.ShouldBe(liveIncome);
    }
}
