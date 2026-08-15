using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.DynamicAssets.Webhooks.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// Manages webhook subscriptions for tenant admins.
/// Provides CRUD operations and delivery log viewing.
/// </summary>
[Authorize]
public class WebhookSubscriptionAppService : PlatformAppService, IWebhookSubscriptionAppService
{
    private readonly IRepository<WebhookSubscription, Guid> _subscriptionRepository;
    private readonly IRepository<WebhookDeliveryLog, Guid> _deliveryLogRepository;
    private readonly WebhookDeliverySender _deliverySender;
    private readonly ILogger<WebhookSubscriptionAppService> _logger;

    public WebhookSubscriptionAppService(
        IRepository<WebhookSubscription, Guid> subscriptionRepository,
        IRepository<WebhookDeliveryLog, Guid> deliveryLogRepository,
        WebhookDeliverySender deliverySender,
        ILogger<WebhookSubscriptionAppService> logger)
    {
        _subscriptionRepository = subscriptionRepository;
        _deliveryLogRepository = deliveryLogRepository;
        _deliverySender = deliverySender;
        _logger = logger;
    }

    [Authorize(PlatformPermissions.DynamicAssets.Create)]
    public async Task<WebhookSubscriptionDto> CreateAsync(CreateUpdateWebhookSubscriptionDto input)
    {
        WebhookUrlGuard.ValidateOrThrow(input.TargetUrl); // SEC-011: SSRF erken red

        var subscription = new WebhookSubscription(
            GuidGenerator.Create(),
            input.DocumentId,
            input.TargetUrl,
            input.Secret,
            input.IsActive
        );

        await _subscriptionRepository.InsertAsync(subscription, autoSave: true);

        _logger.LogInformation(
            "Webhook aboneliği oluşturuldu. SubscriptionId: {SubscriptionId}, DocumentId: {DocumentId}, TargetUrl: {TargetUrl}",
            subscription.Id, subscription.DocumentId, subscription.TargetUrl);

        return ObjectMapper.Map<WebhookSubscription, WebhookSubscriptionDto>(subscription);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Edit)]
    public async Task<WebhookSubscriptionDto> UpdateAsync(Guid id, CreateUpdateWebhookSubscriptionDto input)
    {
        WebhookUrlGuard.ValidateOrThrow(input.TargetUrl); // SEC-011: SSRF erken red

        var subscription = await _subscriptionRepository.GetAsync(id);

        subscription.SetTargetUrl(input.TargetUrl);

        // Secret çıktı DTO'sunda dönmediği için düzenleme ekranında boş gelir.
        // Yalnızca kullanıcı yeniden girdiğinde güncelle; boş bırakılırsa mevcut secret korunur.
        if (!string.IsNullOrWhiteSpace(input.Secret))
            subscription.SetSecret(input.Secret);

        if (input.IsActive)
            subscription.Activate();
        else
            subscription.Deactivate();

        await _subscriptionRepository.UpdateAsync(subscription, autoSave: true);

        _logger.LogInformation(
            "Webhook aboneliği güncellendi. SubscriptionId: {SubscriptionId}",
            subscription.Id);

        return ObjectMapper.Map<WebhookSubscription, WebhookSubscriptionDto>(subscription);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Default)]
    public async Task<WebhookSubscriptionDto> GetAsync(Guid id)
    {
        var subscription = await _subscriptionRepository.GetAsync(id);
        return ObjectMapper.Map<WebhookSubscription, WebhookSubscriptionDto>(subscription);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Default)]
    public async Task<PagedResultDto<WebhookSubscriptionDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var totalCount = await _subscriptionRepository.GetCountAsync();

        var items = await _subscriptionRepository.GetPagedListAsync(
            input.SkipCount,
            input.MaxResultCount,
            input.Sorting ?? nameof(WebhookSubscription.CreationTime) + " DESC"
        );

        var dtos = ObjectMapper.Map<List<WebhookSubscription>, List<WebhookSubscriptionDto>>(items);

        return new PagedResultDto<WebhookSubscriptionDto>(totalCount, dtos);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await _subscriptionRepository.DeleteAsync(id);

        _logger.LogInformation("Webhook aboneliği silindi. SubscriptionId: {SubscriptionId}", id);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Default)]
    public async Task<List<WebhookDeliveryLogDto>> GetDeliveryLogsAsync(Guid subscriptionId)
    {
        // WebhookDeliveryLog IMultiTenant DEĞİL — tenant sahipliği subscription
        // üzerinden doğrulanmalı; aksi halde GUID bilen başka tenant'ın kullanıcısı
        // payload/response gövdelerini okuyabilir. Cross-tenant istekte GetAsync
        // tenant filtresi sayesinde EntityNotFound fırlatır.
        await _subscriptionRepository.GetAsync(subscriptionId);

        var logs = await _deliveryLogRepository.GetListAsync(
            l => l.SubscriptionId == subscriptionId
        );

        return ObjectMapper.Map<List<WebhookDeliveryLog>, List<WebhookDeliveryLogDto>>(
            logs.OrderByDescending(l => l.CreationTime).ToList()
        );
    }

    [Authorize(PlatformPermissions.DynamicAssets.Edit)]
    public async Task<WebhookDeliveryLogDto> ResendDeliveryAsync(Guid deliveryLogId)
    {
        var originalLog = await _deliveryLogRepository.GetAsync(deliveryLogId);
        var subscription = await _subscriptionRepository.GetAsync(originalLog.SubscriptionId);

        // Manual resend: a single immediate attempt, no retry/backoff — the user is
        // watching and expects a prompt result, not a job-style multi-attempt wait.
        var result = await _deliverySender.SendAsync(subscription.TargetUrl, subscription.Secret, originalLog.Payload);

        var newLog = new WebhookDeliveryLog(
            GuidGenerator.Create(),
            subscription.Id,
            originalLog.Payload,
            result.ResponseCode,
            result.ResponseBody,
            tryCount: 1,
            result.IsSuccess,
            result.ElapsedMilliseconds
        );

        await _deliveryLogRepository.InsertAsync(newLog, autoSave: true);

        _logger.LogInformation(
            "Webhook teslimatı yeniden gönderildi. SubscriptionId: {SubscriptionId}, OriginalLogId: {OriginalLogId}, NewLogId: {NewLogId}, StatusCode: {StatusCode}",
            subscription.Id, deliveryLogId, newLog.Id, result.ResponseCode);

        return ObjectMapper.Map<WebhookDeliveryLog, WebhookDeliveryLogDto>(newLog);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Edit)]
    public async Task<RegenerateWebhookSecretResultDto> RegenerateSecretAsync(Guid id)
    {
        var subscription = await _subscriptionRepository.GetAsync(id);

        var newSecret = "wh_secret_" + Convert.ToHexStringLower(RandomNumberGenerator.GetBytes(24));
        subscription.SetSecret(newSecret);

        await _subscriptionRepository.UpdateAsync(subscription, autoSave: true);

        // Secret değeri kasıtlı olarak loglanmaz — sadece olay kaydedilir.
        _logger.LogInformation(
            "Webhook secret'ı yeniden oluşturuldu. SubscriptionId: {SubscriptionId}",
            subscription.Id);

        return new RegenerateWebhookSecretResultDto { Secret = newSecret };
    }
}
