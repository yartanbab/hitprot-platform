using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.IssueTasks.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.IssueTasks;

/// <summary>
/// Geri bildirim ve hata kayıtlarını host projesinde göreve dönüştürür. Host-only.
/// </summary>
public interface IIssueTaskAppService : IApplicationService
{
    /// <summary>Dönüştürme modalını besleyen bağlam (hedef proje, atanabilir kullanıcılar).</summary>
    Task<IssueTaskTargetDto> GetTargetAsync();

    Task<IssueTaskLinkDto?> GetLinkForFeedbackAsync(Guid feedbackId);

    Task<IssueTaskLinkDto?> GetLinkForClientErrorAsync(Guid clientErrorId);

    /// <summary>
    /// Sunucu hatasının bağı. Kaynağın Id'si yoktur; anahtar URL + exception türünden
    /// üretilir, tür de pencere içindeki en yeni audit log satırından çözülür.
    /// </summary>
    Task<IssueTaskLinkDto?> GetLinkForServerErrorAsync(string url, int windowDays);

    Task<IssueTaskLinkDto> CreateFromFeedbackAsync(Guid feedbackId, CreateIssueTaskInput input);

    Task<IssueTaskLinkDto> CreateFromClientErrorAsync(Guid clientErrorId, CreateIssueTaskInput input);

    Task<IssueTaskLinkDto> CreateFromServerErrorAsync(CreateServerErrorTaskInput input);

    /// <summary>Bağı kaldırır; görev yerinde kalır, kaynak yeniden dönüştürülebilir hale gelir.</summary>
    Task RemoveLinkAsync(Guid linkId);

    Task<IssueTaskSettingsDto> GetSettingsAsync();

    Task UpdateSettingsAsync(IssueTaskSettingsDto input);
}
