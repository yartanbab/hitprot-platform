using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Web.Services;
using Apya.Platform.Web.Pages.Documents;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Web.Documents;

/// <summary>
/// Zamanlanmış rapor üretimi.
///
/// WEB katmanında, çünkü PDF/Excel üreteci (QuestPDF/ClosedXML) burada yaşıyor —
/// Domain'den erişilemez. Aynı desen: FeedbackAttachmentRetentionWorker.
///
/// 🔐 KİMLİK: üretim zinciri altı ayrı [Authorize]'lı AppService'ten geçiyor;
/// kullanıcısız bir arka plan işi hepsinde yetkisizlik alırdı. Bu yüzden iş,
/// zamanlamayı KURAN kullanıcı adına koşar. Anlamı da doğru: zamanlanmış üretim
/// o kişinin yetkisiyle yapılır, yetkisi alınırsa üretim de durur.
/// </summary>
public class ScheduledReportWorker : AsyncPeriodicBackgroundWorkerBase
{
    /// <summary>Bir turda üretilecek azami rapor — worker'ın saatlerce koşmasını önler.</summary>
    private const int MaxPerRun = 10;

    public ScheduledReportWorker(
            AbpAsyncTimer timer,
            IServiceScopeFactory serviceScopeFactory
        ) : base(timer, serviceScopeFactory)
    {
        // Saatte bir: en ince zamanlama çözünürlüğü "saat" olduğu için yeterli.
        Timer.Period = 60 * 60 * 1000;
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var services = workerContext.ServiceProvider;

        var scheduleRepository = services.GetRequiredService<IRepository<ReportSchedule, Guid>>();
        var clock = services.GetRequiredService<IClock>();
        var dataFilter = services.GetRequiredService<IDataFilter<IMultiTenant>>();

        var now = clock.Now;
        List<ReportSchedule> due;

        // Tüm kiracıların zamanlamaları tek turda taranır.
        using (dataFilter.Disable())
        {
            due = (await scheduleRepository.GetListAsync(s => s.IsEnabled && s.NextRunAt <= now))
                .OrderBy(s => s.NextRunAt)
                .Take(MaxPerRun)
                .ToList();
        }

        if (due.Count == 0)
        {
            return;
        }

        Logger.LogInformation("ScheduledReportWorker: {Count} zamanlanmış rapor üretilecek.", due.Count);

        foreach (var schedule in due)
        {
            var error = await RunOneAsync(services, schedule, now);

            schedule.MarkRun(now, error);
            await scheduleRepository.UpdateAsync(schedule, autoSave: true);

            if (error != null)
            {
                Logger.LogWarning(
                    "ScheduledReportWorker: {ScheduleId} üretilemedi — {Error}", schedule.Id, error);
            }
        }
    }

    /// <summary>Tek bir zamanlamayı çalıştırır; hata metnini döner (null = başarılı).</summary>
    private static async Task<string?> RunOneAsync(
        IServiceProvider services, ReportSchedule schedule, DateTime now)
    {
        if (schedule.CreatorId is null)
        {
            // Sahipsiz zamanlama kimin adına koşacağını bilemez.
            return "Zamanlamayı kuran kullanıcı bilinmiyor; yeniden oluşturun.";
        }

        var principalAccessor = services.GetRequiredService<ICurrentPrincipalAccessor>();
        var currentTenant = services.GetRequiredService<ICurrentTenant>();

        var claims = new List<Claim> { new(AbpClaimTypes.UserId, schedule.CreatorId.Value.ToString()) };
        if (schedule.TenantId.HasValue)
        {
            claims.Add(new Claim(AbpClaimTypes.TenantId, schedule.TenantId.Value.ToString()));
        }

        var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, "ScheduledReport"));

        try
        {
            using (currentTenant.Change(schedule.TenantId))
            using (principalAccessor.Change(principal))
            {
                await GenerateAsync(services, schedule.DeliveryPackageId);
            }

            await NotifySubscribersAsync(services, schedule, now);
            return null;
        }
        catch (Exception ex)
        {
            // Bir zamanlamanın hatası diğerlerini durdurmaz; sebep satıra yazılır.
            return ex.Message;
        }
    }

    /// <summary>
    /// Paketi yeniden üretir. Deliveries sayfasındaki üretimle AYNI yolu izler —
    /// ayrı bir üretim kodu, zamanlanmış çıktının elle üretilenden farklı olması
    /// demek olurdu. Preflight bloke ediyorsa AppService hata fırlatır ve bu tur
    /// hata olarak kaydedilir.
    /// </summary>
    private static async Task GenerateAsync(IServiceProvider services, Guid packageId)
    {
        var packageAppService = services.GetRequiredService<IDeliveryPackageAppService>();
        var modelBuilder = services.GetRequiredService<DeliveryReportModelBuilder>();
        var fileStorage = services.GetRequiredService<IUploadedFileStorage>();

        var package = await packageAppService.GetAsync(packageId);
        var model = await modelBuilder.BuildAsync(package);

        // Zamanlanmış üretim PDF verir: ZIP'in ek dosyalarını çözmek sayfa
        // bağlamına bağlı ve arka planda onlarca MB üretmek istemiyoruz.
        var pdf = DeliveryPackageExporter.ToPdf(model);
        var storedFileName = await fileStorage.StoreGeneratedAsync(pdf, ".pdf");

        await packageAppService.MarkGeneratedAsync(
            packageId, storedFileName, pdf.LongLength, model.Sections.Count);
    }

    /// <summary>
    /// Aboneleri haberdar eder. Rapor DOSYASI eklenmez — kurum belgesi posta
    /// kutularında dolaşmasın diye; abone uygulamadaki sürüm arşivine yönlendirilir.
    /// </summary>
    private static async Task NotifySubscribersAsync(
        IServiceProvider services, ReportSchedule schedule, DateTime now)
    {
        var subscriberRepository = services.GetRequiredService<IRepository<ReportSubscriber, Guid>>();
        var dataFilter = services.GetRequiredService<IDataFilter<IMultiTenant>>();

        List<ReportSubscriber> subscribers;
        using (dataFilter.Disable())
        {
            subscribers = (await subscriberRepository.GetListAsync(
                s => s.ScheduleId == schedule.Id && s.IsEnabled)).ToList();
        }

        if (subscribers.Count == 0)
        {
            return;
        }

        var emailSender = services.GetService<Volo.Abp.Emailing.IEmailSender>();
        if (emailSender is null)
        {
            return;
        }

        foreach (var subscriber in subscribers)
        {
            try
            {
                await emailSender.SendAsync(
                    subscriber.Email,
                    "Zamanlanmış raporunuz hazır",
                    $"Merhaba {subscriber.Name},<br/><br/>" +
                    $"{now:dd.MM.yyyy} tarihli zamanlanmış rapor üretildi. " +
                    "Uygulamadaki <b>Teslimler &amp; arşiv</b> ekranından sürüm arşivine ulaşabilirsiniz.",
                    isBodyHtml: true);
            }
            catch (Exception)
            {
                // Bir abonenin adresi bozuksa diğerleri yine haber alsın; üretim
                // zaten başarılı, e-posta ikincil kanal.
            }
        }
    }
}
