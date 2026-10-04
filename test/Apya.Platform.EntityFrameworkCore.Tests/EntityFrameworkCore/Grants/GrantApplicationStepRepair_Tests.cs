using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 🔴 LIF-02 veri onarımı. Şablon kaydı eskiden her kayıtta adımları silip yeni GUID'lerle
/// yeniden yaratıyordu (#460'ta düzeltildi); o tarihe kadar host bir adımın adını düzeltse
/// bile o şablondaki TÜM başvuruların adım kimliği yetim kalıyordu. Belirti sessizdi: pano
/// kartı kimliği tanımadığı için İLK sütuna düşüyor, kullanıcı başvurunun geri sarıldığını
/// sanıyordu. Onarım, DOM-01 eşlemesini kullanıp kartı başvurunun SABİT AŞAMASINA oturtur.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantApplicationStepRepair_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly GrantApplicationStepRepairDataSeedContributor _repair;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantStageTemplate, Guid> _templateRepo;
    private readonly IRepository<GrantStageTemplateStep, Guid> _stepRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IGuidGenerator _guids;

    public GrantApplicationStepRepair_Tests()
    {
        _repair = GetRequiredService<GrantApplicationStepRepairDataSeedContributor>();
        _appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();
        _templateRepo = GetRequiredService<IRepository<GrantStageTemplate, Guid>>();
        _stepRepo = GetRequiredService<IRepository<GrantStageTemplateStep, Guid>>();
        _callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
        _grantRepo = GetRequiredService<IRepository<Grant, Guid>>();
        _guids = GetRequiredService<IGuidGenerator>();
    }

    /// <summary>Dört adımı sabit aşamalara eşlenmiş bir şablon + o şablonu kullanan program ve çağrı.</summary>
    private async Task<(Guid CallId, Guid TemplateId, Guid[] StepIds)> ArrangeProgramAsync(bool withTemplate = true)
    {
        var templateId = _guids.Create();
        var stepIds = Array.Empty<Guid>();

        if (withTemplate)
        {
            await _templateRepo.InsertAsync(
                new GrantStageTemplate(templateId, "Onarım " + templateId.ToString("N")[..6]), autoSave: true);

            var names = new[] { "Başvuru", "Değerlendirme", "Onay", "Ödeme" };
            var ids = new Guid[names.Length];
            for (var i = 0; i < names.Length; i++)
            {
                ids[i] = _guids.Create();
                await _stepRepo.InsertAsync(new GrantStageTemplateStep(ids[i], templateId, i, names[i])
                {
                    Stage = GrantStageMapping.Suggest(names[i], i, names.Length)
                }, autoSave: true);
            }
            stepIds = ids;
        }

        var grant = new Grant(_guids.Create(), "Onarım Programı", "Kurum", maxAmount: 100_000m, minMatchScore: 0)
        {
            StageTemplateId = withTemplate ? templateId : null
        };
        await _grantRepo.InsertAsync(grant, autoSave: true);

        var call = new GrantCall(_guids.Create(), grant.Id, "2026/1", GrantCallStatus.Acik);
        await _callRepo.InsertAsync(call, autoSave: true);

        return (call.Id, templateId, stepIds);
    }

    private async Task<Guid> ArrangeApplicationAsync(Guid callId, Guid stepId, GrantApplicationStage stage)
    {
        var application = new GrantApplication(_guids.Create(), null, callId);
        application.AdvanceStage(stage);
        application.MoveToStep(stepId);
        await _appRepo.InsertAsync(application, autoSave: true);
        return application.Id;
    }

    /// <summary>
    /// Adım silinmişse kart, başvurunun sabit aşamasına karşılık gelen adıma taşınır —
    /// ilk sütuna DEĞİL.
    /// </summary>
    [Fact]
    public async Task Silinmis_Adim_Sabit_Asamanin_Adimina_Tasinir()
    {
        Guid applicationId = default, beklenenStep = default;

        await WithUnitOfWorkAsync(async () =>
        {
            var (callId, _, stepIds) = await ArrangeProgramAsync();
            // Kayıt var olmayan bir adımı gösteriyor (silinmiş şablon adımı).
            applicationId = await ArrangeApplicationAsync(callId, _guids.Create(), GrantApplicationStage.Onay);
            beklenenStep = stepIds[2]; // "Onay" adımı
        });

        await WithUnitOfWorkAsync(() => _repair.SeedAsync(new DataSeedContext()));

        await WithUnitOfWorkAsync(async () =>
        {
            var application = await _appRepo.GetAsync(applicationId);
            application.CurrentStepId.ShouldBe(beklenenStep, "kart sabit aşamasının adımına oturmalı");
            application.Stage.ShouldBe(GrantApplicationStage.Onay, "onarım özet ekseni değiştirmemeli");
        });
    }

    /// <summary>Başka şablonun adımını gösteren kayıt da onarılır (programın şablonu değiştirilmiş).</summary>
    [Fact]
    public async Task Yabanci_Sablonun_Adimi_Onarilir()
    {
        Guid applicationId = default, beklenenStep = default;

        await WithUnitOfWorkAsync(async () =>
        {
            var (callId, _, stepIds) = await ArrangeProgramAsync();
            var (_, _, yabanciStepIds) = await ArrangeProgramAsync();
            applicationId = await ArrangeApplicationAsync(
                callId, yabanciStepIds[3], GrantApplicationStage.Degerlendirme);
            beklenenStep = stepIds[1];
        });

        await WithUnitOfWorkAsync(() => _repair.SeedAsync(new DataSeedContext()));

        await WithUnitOfWorkAsync(async () =>
            (await _appRepo.GetAsync(applicationId)).CurrentStepId.ShouldBe(beklenenStep));
    }

    /// <summary>Programın şablonu yoksa kimlik temizlenir; pano o başvuruyu sabit aşamalara dizer.</summary>
    [Fact]
    public async Task Sablonsuz_Programda_Adim_Kimligi_Temizlenir()
    {
        Guid applicationId = default;

        await WithUnitOfWorkAsync(async () =>
        {
            var (callId, _, _) = await ArrangeProgramAsync(withTemplate: false);
            applicationId = await ArrangeApplicationAsync(callId, _guids.Create(), GrantApplicationStage.Basvuru);
        });

        await WithUnitOfWorkAsync(() => _repair.SeedAsync(new DataSeedContext()));

        await WithUnitOfWorkAsync(async () =>
        {
            var application = await _appRepo.GetAsync(applicationId);
            application.CurrentStepId.ShouldBeNull();
            application.Stage.ShouldBe(GrantApplicationStage.Basvuru);
        });
    }

    /// <summary>
    /// SAĞLAM kayda dokunulmaz. Onarım her DbMigrator turunda koştuğu için bu şart:
    /// host'un elle taşıdığı kartı geri çekerse veri onarımı kendisi bozucu olurdu.
    /// </summary>
    [Fact]
    public async Task Saglam_Kayit_Degismez()
    {
        Guid applicationId = default, orijinalStep = default;

        await WithUnitOfWorkAsync(async () =>
        {
            var (callId, _, stepIds) = await ArrangeProgramAsync();
            orijinalStep = stepIds[3]; // "Ödeme" adımı, aşaması Başvuru — kasten tutarsız
            applicationId = await ArrangeApplicationAsync(callId, orijinalStep, GrantApplicationStage.Basvuru);
        });

        await WithUnitOfWorkAsync(() => _repair.SeedAsync(new DataSeedContext()));

        await WithUnitOfWorkAsync(async () =>
        {
            var application = await _appRepo.GetAsync(applicationId);
            application.CurrentStepId.ShouldBe(orijinalStep,
                "adım programın şablonunda duruyor; onarım aşamayla tutarsız olsa bile dokunmaz");
        });
    }
}
