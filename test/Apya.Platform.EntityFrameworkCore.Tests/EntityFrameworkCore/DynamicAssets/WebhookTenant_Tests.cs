using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Webhooks;
using Microsoft.Extensions.Logging.Abstractions;
using Shouldly;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities.Events;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.DynamicAssets;

/// <summary>
/// Arka plan işi kiracısız çalışır ve iş kaydı kiracı tutmaz. Kiracının formuna gelen yanıt için
/// kuyruğa giren webhook işi aboneliği host'ta arıyor, bulamayınca hiç göndermiyordu.
/// İş argümanı artık aboneliğin kiracısını taşır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class WebhookTenant_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IRepository<AppDocument, Guid> _documentRepository;
    private readonly IRepository<AppResponse, Guid> _responseRepository;
    private readonly IRepository<WebhookSubscription, Guid> _subscriptionRepository;
    private readonly IRepository<WebhookDeliveryLog, Guid> _deliveryLogRepository;
    private readonly ICurrentTenant _currentTenant;

    public WebhookTenant_Tests()
    {
        _documentRepository = GetRequiredService<IRepository<AppDocument, Guid>>();
        _responseRepository = GetRequiredService<IRepository<AppResponse, Guid>>();
        _subscriptionRepository = GetRequiredService<IRepository<WebhookSubscription, Guid>>();
        _deliveryLogRepository = GetRequiredService<IRepository<WebhookDeliveryLog, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Fact]
    public async Task Kiracinin_formuna_gelen_yanit_webhooku_kiracida_teslim_edilir()
    {
        var tenantManager = GetRequiredService<ITenantManager>();
        var tenant = await tenantManager.CreateAsync("Webhook Firma " + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        var jobs = new CapturingJobManager();
        WebhookSubscription subscription;
        using (_currentTenant.Change(tenant.Id))
        {
            var document = new AppDocument(Guid.NewGuid(), "Talep formu", "talep-" + Guid.NewGuid().ToString("N")[..6]);
            await _documentRepository.InsertAsync(document, autoSave: true);
            subscription = await _subscriptionRepository.InsertAsync(
                new WebhookSubscription(Guid.NewGuid(), document.Id, "https://hooks.firma.test/apya", "gizli-anahtar"),
                autoSave: true);
            var response = await _responseRepository.InsertAsync(
                new AppResponse(Guid.NewGuid(), document.Id, "{\"soru\":\"cevap\"}"), autoSave: true);

            await WithUnitOfWorkAsync(() => CreateHandler(jobs).HandleEventAsync(new EntityCreatedEventData<AppResponse>(response)));
        }

        var args = jobs.Enqueued.OfType<WebhookSenderJobArgs>().ShouldHaveSingleItem();
        args.TenantId.ShouldBe(tenant.Id);
        args.SubscriptionId.ShouldBe(subscription.Id);

        // İş, arka plan işçisi gibi kiracısız bağlamda yürür.
        _currentTenant.Id.ShouldBeNull();
        var http = new StubHandler();
        var job = new WebhookSenderJob(
            _subscriptionRepository,
            _deliveryLogRepository,
            new WebhookDeliverySender(new StubHttpClientFactory(http)),
            GetRequiredService<IGuidGenerator>(),
            NullLogger<WebhookSenderJob>.Instance,
            _currentTenant);
        await WithUnitOfWorkAsync(() => job.ExecuteAsync(args));

        http.Requests.ShouldHaveSingleItem().ShouldBe("https://hooks.firma.test/apya");
        _currentTenant.Id.ShouldBeNull();
        var log = (await _deliveryLogRepository.GetListAsync(l => l.SubscriptionId == subscription.Id)).ShouldHaveSingleItem();
        log.IsSuccess.ShouldBeTrue();
    }

    /// <summary>
    /// Host formunu dolduran kiracının yanıtı kiracıda durur ama abonelik host'undur. Olay dolduranın
    /// bağlamında işlense bile host aboneliği bulunur; aynı forma kimliğini bilerek abonelik açan başka
    /// kiracı ise yanıtı almaz.
    /// </summary>
    [Fact]
    public async Task Host_formuna_kiraci_yaniti_yalniz_host_aboneligine_gider()
    {
        var hostDocument = await _documentRepository.InsertAsync(
            new AppDocument(Guid.NewGuid(), "Proje fikri", "fikir-" + Guid.NewGuid().ToString("N")[..6]), autoSave: true);
        var hostSubscription = await _subscriptionRepository.InsertAsync(
            new WebhookSubscription(Guid.NewGuid(), hostDocument.Id, "https://hooks.host.test/fikir", "host-anahtar"), autoSave: true);

        var tenantManager = GetRequiredService<ITenantManager>();
        var filler = await tenantManager.CreateAsync("Dolduran " + Guid.NewGuid().ToString("N")[..6]);
        var eavesdropper = await tenantManager.CreateAsync("Dinleyen " + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertManyAsync(new[] { filler, eavesdropper }, autoSave: true);
        using (_currentTenant.Change(eavesdropper.Id))
        {
            await _subscriptionRepository.InsertAsync(
                new WebhookSubscription(Guid.NewGuid(), hostDocument.Id, "https://hooks.dinleyen.test/x", "dinleyen-anahtar"), autoSave: true);
        }

        var jobs = new CapturingJobManager();
        using (_currentTenant.Change(filler.Id))
        {
            var response = await _responseRepository.InsertAsync(
                new AppResponse(Guid.NewGuid(), hostDocument.Id, "{\"fikir\":\"sensör\"}"), autoSave: true);
            await WithUnitOfWorkAsync(() => CreateHandler(jobs).HandleEventAsync(new EntityCreatedEventData<AppResponse>(response)));
        }

        var args = jobs.Enqueued.OfType<WebhookSenderJobArgs>().ShouldHaveSingleItem();
        args.SubscriptionId.ShouldBe(hostSubscription.Id);
        args.TenantId.ShouldBeNull();
    }

    private WebhookPublisherHandler CreateHandler(IBackgroundJobManager jobs)
        => new(
            _subscriptionRepository,
            _documentRepository,
            jobs,
            NullLogger<WebhookPublisherHandler>.Instance,
            GetRequiredService<IDataFilter<IMultiTenant>>());

    private sealed class CapturingJobManager : IBackgroundJobManager
    {
        public List<object> Enqueued { get; } = new();

        public Task<string> EnqueueAsync<TArgs>(TArgs args, BackgroundJobPriority priority = BackgroundJobPriority.Normal, TimeSpan? delay = null)
        {
            Enqueued.Add(args!);
            return Task.FromResult(Guid.NewGuid().ToString());
        }
    }

    private sealed class StubHandler : HttpMessageHandler
    {
        public List<string> Requests { get; } = new();

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Requests.Add(request.RequestUri!.ToString());
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent("ok") });
        }
    }

    private sealed class StubHttpClientFactory(HttpMessageHandler handler) : IHttpClientFactory
    {
        public HttpClient CreateClient(string name) => new(handler, disposeHandler: false);
    }
}
