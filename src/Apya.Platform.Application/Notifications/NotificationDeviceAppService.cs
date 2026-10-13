using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Users;

namespace Apya.Platform.Notifications;

/// <summary>
/// NTF-08 · Tarayıcı bildirimi abonelikleri. Bildirim kişiseldir: her uç
/// <c>CurrentUser.GetId()</c> ile kilitlidir, başkasının cihazı listelenemez ve silinemez.
/// </summary>
[Authorize]
public class NotificationDeviceAppService : ApplicationService, INotificationDeviceAppService
{
    private readonly IRepository<NotificationDevice, Guid> _deviceRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly WebPushOptions _options;

    public NotificationDeviceAppService(
        IRepository<NotificationDevice, Guid> deviceRepository,
        IDataFilter<IMultiTenant> mtFilter,
        IOptions<WebPushOptions> options)
    {
        _deviceRepository = deviceRepository;
        _mtFilter = mtFilter;
        _options = options.Value;
    }

    public virtual Task<WebPushConfigDto> GetWebPushConfigAsync()
        => Task.FromResult(new WebPushConfigDto
        {
            Enabled = _options.IsEnabled,
            // Özel anahtar hiçbir yanıtta yer almaz.
            PublicKey = _options.IsEnabled ? _options.PublicKey : null
        });

    public virtual async Task<NotificationDeviceDto> SubscribeWebPushAsync(RegisterWebPushInput input)
    {
        if (!_options.IsEnabled)
        {
            throw new BusinessException(PlatformDomainErrorCodes.NotificationWebPushDisabled);
        }

        // Sunucu bu adrese istek atacak: yalnız bilinen tarayıcı bildirim servisleri kabul edilir.
        if (!WebPushEndpointPolicy.IsAllowed(input.Endpoint))
        {
            throw new BusinessException(PlatformDomainErrorCodes.NotificationDeviceEndpointInvalid);
        }

        var userId = CurrentUser.GetId();
        var hash = NotificationDevice.HashEndpoint(input.Endpoint);
        var now = Clock.Now;

        // Ortak tarayıcı: aynı abonelik önceki kullanıcıda kayıtlıysa onun kaydı silinir —
        // yoksa önceki kişinin bildirimleri bu tarayıcıda görünmeye devam ederdi. Başka kiracının
        // kullanıcısı da olabilir: arama kiracı süzgeci kapalıyken, yalnız adres özetiyle yapılır.
        using (_mtFilter.Disable())
        {
            var others = await _deviceRepository.GetListAsync(d => d.EndpointHash == hash && d.UserId != userId);
            if (others.Count > 0)
            {
                await _deviceRepository.DeleteManyAsync(others, autoSave: true);
            }
        }

        var device = await _deviceRepository.FirstOrDefaultAsync(d => d.UserId == userId && d.EndpointHash == hash);
        if (device == null)
        {
            device = new NotificationDevice(
                GuidGenerator.Create(), CurrentTenant.Id, userId, NotificationDevicePlatform.WebPush,
                input.Endpoint, input.P256dh, input.Auth, input.UserAgent, now);
            await _deviceRepository.InsertAsync(device, autoSave: true);
        }
        else
        {
            device.Refresh(input.P256dh, input.Auth, input.UserAgent, now);
            await _deviceRepository.UpdateAsync(device, autoSave: true);
        }

        return ToDto(device);
    }

    public virtual async Task UnsubscribeWebPushAsync(UnsubscribeWebPushInput input)
    {
        var userId = CurrentUser.GetId();
        var hash = NotificationDevice.HashEndpoint(input.Endpoint);

        var device = await _deviceRepository.FirstOrDefaultAsync(d => d.UserId == userId && d.EndpointHash == hash);
        if (device != null)
        {
            await _deviceRepository.DeleteAsync(device, autoSave: true);
        }
    }

    public virtual async Task<List<NotificationDeviceDto>> GetListAsync()
    {
        var userId = CurrentUser.GetId();
        return (await _deviceRepository.GetListAsync(d => d.UserId == userId))
            .OrderByDescending(d => d.LastSeenAt ?? d.CreationTime)
            .Select(ToDto)
            .ToList();
    }

    public virtual async Task DeleteAsync(Guid id)
    {
        var userId = CurrentUser.GetId();
        var device = await _deviceRepository.FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId)
                     ?? throw new EntityNotFoundException(typeof(NotificationDevice), id);
        await _deviceRepository.DeleteAsync(device, autoSave: true);
    }

    private static NotificationDeviceDto ToDto(NotificationDevice d) => new()
    {
        Id = d.Id,
        Platform = d.Platform,
        DeviceLabel = d.DeviceLabel,
        IsActive = d.IsActive,
        LastSeenAt = d.LastSeenAt,
        CreationTime = d.CreationTime
    };
}
