using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Apya.Platform.Telemetry;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.SettingManagement;
using Volo.Abp.Settings;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Ayarları okur/yazar. Okuma yalnızca oturum ister — widget ve form kendini bu
/// değerlere göre kurar; yazma ManageSettings iznine bağlıdır.
/// </summary>
[Authorize]
public class FeedbackSettingsAppService : ApplicationService, IFeedbackSettingsAppService
{
    private readonly ISettingManager _settingManager;

    public FeedbackSettingsAppService(ISettingManager settingManager)
    {
        _settingManager = settingManager;
    }

    public async Task<FeedbackSettingsDto> GetAsync()
    {
        // KRİTİK: bu ayarlar .WithProviders(Global) ile kısıtlı olduğundan
        // DefaultValueSettingValueProvider zincirde YOKTUR — her okumada açık
        // varsayılan verilmeli, aksi halde hiç yazılmamış ayar false/0 gelir.
        return new FeedbackSettingsDto
        {
            TriggerEnabled = await SettingProvider.GetAsync(
                PlatformSettings.Feedback.TriggerEnabled, PlatformSettingDefaults.FeedbackTriggerEnabled),

            TriggerPlacement = NormalizePlacement(await SettingProvider.GetOrNullAsync(
                PlatformSettings.Feedback.TriggerPlacement)),

            EnabledTypes = ParseTypes(await SettingProvider.GetOrNullAsync(
                PlatformSettings.Feedback.EnabledTypes)),

            MaxFileSizeMb = await SettingProvider.GetAsync(
                PlatformSettings.Feedback.MaxFileSizeMb, PlatformSettingDefaults.FeedbackMaxFileSizeMb),

            AllowedFileExtensions = (await SettingProvider.GetOrNullAsync(
                PlatformSettings.Feedback.AllowedFileExtensions)) ?? PlatformSettingDefaults.FeedbackAllowedExtensions,

            AllowAnonymous = await SettingProvider.GetAsync(
                PlatformSettings.Feedback.AllowAnonymous, PlatformSettingDefaults.FeedbackAllowAnonymous),

            TelemetryEnabled = await SettingProvider.GetAsync(
                PlatformSettings.Telemetry.Enabled, PlatformSettingDefaults.TelemetryEnabled),

            TelemetryRetentionDays = await SettingProvider.GetAsync(
                PlatformSettings.Telemetry.RetentionDays, PlatformSettingDefaults.TelemetryRetentionDays)
        };
    }

    [Authorize(PlatformPermissions.Feedbacks.ManageSettings)]
    public async Task UpdateAsync(FeedbackSettingsDto input)
    {
        var retention = Math.Clamp(
            input.TelemetryRetentionDays,
            TelemetryConsts.MinRetentionDays,
            TelemetryConsts.MaxRetentionDays);

        await SetGlobalAsync(PlatformSettings.Feedback.TriggerEnabled, input.TriggerEnabled.ToString().ToLowerInvariant());
        await SetGlobalAsync(PlatformSettings.Feedback.TriggerPlacement, NormalizePlacement(input.TriggerPlacement));
        await SetGlobalAsync(PlatformSettings.Feedback.EnabledTypes,
            string.Join(',', input.EnabledTypes.Distinct().Select(t => (int)t)));
        await SetGlobalAsync(PlatformSettings.Feedback.MaxFileSizeMb, input.MaxFileSizeMb.ToString());
        await SetGlobalAsync(PlatformSettings.Feedback.AllowedFileExtensions, NormalizeExtensions(input.AllowedFileExtensions));
        await SetGlobalAsync(PlatformSettings.Feedback.AllowAnonymous, input.AllowAnonymous.ToString().ToLowerInvariant());
        await SetGlobalAsync(PlatformSettings.Telemetry.Enabled, input.TelemetryEnabled.ToString().ToLowerInvariant());
        await SetGlobalAsync(PlatformSettings.Telemetry.RetentionDays, retention.ToString());
    }

    private Task SetGlobalAsync(string name, string value)
        => _settingManager.SetGlobalAsync(name, value);

    /// <summary>Bilinmeyen değer varsayılana düşer — bozuk ayar UI'ı kırmasın.</summary>
    private static string NormalizePlacement(string? value)
        => value == "floating" ? "floating" : PlatformSettingDefaults.FeedbackTriggerPlacement;

    /// <summary>".PNG, jpg" → ".png,.jpg" (küçük harf, noktalı, tekilleştirilmiş).</summary>
    private static string NormalizeExtensions(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            return PlatformSettingDefaults.FeedbackAllowedExtensions;
        }

        var parts = raw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(p => p.ToLowerInvariant())
            .Select(p => p.StartsWith('.') ? p : "." + p)
            .Distinct();

        var result = string.Join(',', parts);
        return result.Length == 0 ? PlatformSettingDefaults.FeedbackAllowedExtensions : result;
    }

    private static List<FeedbackType> ParseTypes(string? raw)
    {
        var result = new List<FeedbackType>();
        if (string.IsNullOrWhiteSpace(raw))
        {
            return result; // boş = tüm türler açık
        }

        foreach (var part in raw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            if (int.TryParse(part, out var value) && Enum.IsDefined(typeof(FeedbackType), value))
            {
                result.Add((FeedbackType)value);
            }
        }

        return result;
    }
}
