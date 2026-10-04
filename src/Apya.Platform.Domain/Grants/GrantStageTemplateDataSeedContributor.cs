using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Grants;

/// <summary>
/// 3b · Varsayılan aşama şablonunu HOST kataloğuna kurar. Şablon seçilmemiş programlar
/// bunu kullanır; host ekrandan kopyalayıp çağrıya özel şablon türetir.
///
/// <para>🔴 HOST-ONLY: şablon <c>TenantId=null</c> ile yaşar. Guard olmasaydı ABP bu
/// tohumlayıcıyı her yeni kiracı açılışında da çağırır ve kiracı başına kopya yazardı
/// (<see cref="ErasmusYouthCatalogDataSeedContributor"/> ile aynı gerekçe).</para>
///
/// <para>Yeniden çalıştırılabilir: sabit Id ile aranır, VARSA hiç dokunulmaz — host
/// aşamaları düzenlediyse tohumlama geri almaz.</para>
/// </summary>
public class GrantStageTemplateDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private static readonly Guid DefaultTemplateId = Guid.Parse("b1a7e5d0-0001-4000-8000-000000000001");

    private readonly IRepository<GrantStageTemplate, Guid> _templateRepository;
    private readonly IRepository<GrantStageTemplateStep, Guid> _stepRepository;

    public GrantStageTemplateDataSeedContributor(
        IRepository<GrantStageTemplate, Guid> templateRepository,
        IRepository<GrantStageTemplateStep, Guid> stepRepository)
    {
        _templateRepository = templateRepository;
        _stepRepository = stepRepository;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return; // şablon host'ta yaşar
        }

        if (await _templateRepository.FindAsync(DefaultTemplateId) != null)
        {
            // 🔴 DOM-01: Varsayılan şablon zaten varsa kurulum atlanır ama eşleme
            // geri dolumu HER TURDA koşar — alan sonradan eklendi, mevcut adımlarda
            // null duruyor ve eşlenmemiş adıma taşımak Stage'i yazmaz.
            await BackfillStagesAsync();
            return;
        }

        var template = new GrantStageTemplate(DefaultTemplateId, "Varsayılan")
        {
            IsDefault = true,
            Description = "Şablon seçilmemiş programlar bu dört aşamayı kullanır."
        };
        await _templateRepository.InsertAsync(template, autoSave: true);

        var order = 0;
        foreach (var step in DefaultSteps)
        {
            await _stepRepository.InsertAsync(
                new GrantStageTemplateStep(
                    // Adım Id'leri de sabit: tohumlama yeniden koşarsa mükerrer satır olmasın.
                    Guid.Parse($"b1a7e5d0-0001-4000-8000-00000000001{order}"),
                    DefaultTemplateId,
                    order,
                    step.Name)
                {
                    Owner = step.Owner,
                    CompletionCondition = step.CompletionCondition,
                    ReminderDays = step.ReminderDays,
                    // Dört adımın adı sabit aşamalarla birebir; eşleme ada göre oturur.
                    Stage = GrantStageMapping.Suggest(step.Name, order, DefaultSteps.Length)
                },
                autoSave: true);
            order++;
        }
    }

    /// <summary>
    /// 🔴 DOM-01: Eşlemesi olmayan adımlara varsayılan aşamayı yazar (önce ada, sonra
    /// konuma göre). Yalnız <c>null</c> olanlara dokunur — host'un elle seçtiği eşleme
    /// EZİLMEZ, bu yüzden her DbMigrator turunda güvenle koşar.
    /// </summary>
    private async Task BackfillStagesAsync()
    {
        var unmapped = await _stepRepository.GetListAsync(s => s.Stage == null);
        if (unmapped.Count == 0)
        {
            return;
        }

        // Konuma göre eşleme şablondaki TOPLAM adım sayısını ister; adımlar şablon
        // bazında gruplanmadan oranlama yanlış çıkardı.
        foreach (var group in unmapped.GroupBy(s => s.StageTemplateId))
        {
            var all = await _stepRepository.GetListAsync(s => s.StageTemplateId == group.Key);
            var count = all.Count;
            foreach (var step in group)
            {
                step.Stage = GrantStageMapping.Suggest(step.Name, step.Order, count);
                await _stepRepository.UpdateAsync(step, autoSave: true);
            }
        }
    }

    private sealed record StepSeed(string Name, GrantPartyRole Owner, string CompletionCondition, int ReminderDays);

    private static readonly StepSeed[] DefaultSteps =
    {
        new("Başvuru", GrantPartyRole.Ortak, "Başvuru kuruma gönderildi", 7),
        new("Değerlendirme", GrantPartyRole.Kurum, "Kurum yanıtı girildi", 14),
        new("Onay", GrantPartyRole.Firma, "Onaylanan tutar girildi", 5),
        new("Ödeme", GrantPartyRole.Ortak, "Son dilim ödendi", 30)
    };
}
