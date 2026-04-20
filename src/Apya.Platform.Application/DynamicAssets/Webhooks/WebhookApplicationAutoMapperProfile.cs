using AutoMapper;
using Apya.Platform.DynamicAssets.Webhooks.Dtos;

namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// AutoMapper profile for the Webhook module.
/// </summary>
public class WebhookApplicationAutoMapperProfile : Profile
{
    public WebhookApplicationAutoMapperProfile()
    {
        CreateMap<WebhookSubscription, WebhookSubscriptionDto>();
        CreateMap<WebhookDeliveryLog, WebhookDeliveryLogDto>();
    }
}
