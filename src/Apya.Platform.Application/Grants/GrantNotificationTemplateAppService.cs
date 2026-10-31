using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 6d · Host: Bildirim ve e-posta şablonları.
///
/// <para>🔴 HOST-ONLY: şablon bütün kiracılara aynı gider, kiracının kendi metnini
/// yazması söz konusu değil. Kiracı bağlamından çağrılırsa yetki hatası verilir —
/// izin kapısı tek başına yetmez, kiracı yöneticisi de "Grants.Edit" taşıyabilir.</para>
///
/// <para>Genel şablonlar tohumlamayla gelir; ekran yalnız bir Genel şablonu role çoğaltır ve rol
/// şablonunu siler — yeni tetikleyici eklemez. Tetikleyici
/// listesi koda bağlıdır (<see cref="GrantNotificationTriggerRegistry"/>) — host'un
/// ateşlenmeyen bir tetikleyici uydurabilmesi ekranı yanıltıcı yapardı.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantNotificationTemplateAppService : PlatformAppService, IGrantNotificationTemplateAppService
{
    private readonly IRepository<GrantNotificationTemplate, Guid> _repo;
    private readonly ICurrentTenant _currentTenant;

    public GrantNotificationTemplateAppService(
        IRepository<GrantNotificationTemplate, Guid> repo,
        ICurrentTenant currentTenant)
    {
        _repo = repo;
        _currentTenant = currentTenant;
    }

    public async Task<GrantNotificationConsoleDto> GetAsync()
    {
        EnsureHostContext();
        return await BuildAsync();
    }

    public async Task<GrantNotificationConsoleDto> SaveAsync(SaveGrantNotificationTemplateInput input)
    {
        EnsureHostContext();

        var template = await _repo.FindAsync(input.Id)
                       ?? throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationTemplateNotFound);

        template.SetText(input.Subject, input.Body);
        template.SetChannels(input.InApp, input.Email);
        template.SetEnabled(input.IsEnabled);
        if (template.IsEscalation && input.AfterDays is { } afterDays)
        {
            template.SetAfterDays(afterDays);
        }
        await _repo.UpdateAsync(template, autoSave: true);

        return await BuildAsync();
    }

    public async Task<GrantNotificationConsoleDto> DuplicateAsync(DuplicateGrantNotificationTemplateInput input)
    {
        EnsureHostContext();

        var source = await _repo.FindAsync(input.Id)
                     ?? throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationTemplateNotFound);

        if (await _repo.AnyAsync(t => t.Trigger == source.Trigger && t.Audience == input.Audience && !t.IsEscalation))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationTemplateAudienceExists);
        }

        await _repo.InsertAsync(source.CopyFor(GuidGenerator.Create(), input.Audience), autoSave: true);

        return await BuildAsync();
    }

    public async Task<GrantNotificationConsoleDto> AddEscalationAsync(AddGrantNotificationEscalationInput input)
    {
        EnsureHostContext();

        var source = await _repo.FindAsync(input.Id)
                     ?? throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationTemplateNotFound);

        if (await _repo.AnyAsync(t => t.Trigger == source.Trigger && t.Audience == input.Audience && t.IsEscalation))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationTemplateAudienceExists);
        }

        var (subject, body) = GrantEscalationDefaults.TextOf(L, source.Trigger, input.Audience);
        await _repo.InsertAsync(GrantNotificationTemplate.CreateEscalation(
            GuidGenerator.Create(), source.Trigger, input.Audience, input.AfterDays, subject, body), autoSave: true);

        return await BuildAsync();
    }

    public async Task<GrantNotificationConsoleDto> DeleteAsync(Guid id)
    {
        EnsureHostContext();

        var template = await _repo.FindAsync(id)
                       ?? throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationTemplateNotFound);

        // Genel ilk bildirim tetikleyicinin son çaresidir: silinseydi rol şablonu olmayan alıcılar sessiz kalırdı.
        if (template.Audience == GrantNotificationAudience.Genel && !template.IsEscalation)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationTemplateGeneralNotDeletable);
        }

        await _repo.DeleteAsync(template, autoSave: true);

        return await BuildAsync();
    }

    // ------------------------------------------------------------------ yardımcılar

    private void EnsureHostContext()
    {
        if (_currentTenant.Id != null)
        {
            throw new AbpAuthorizationException();
        }
    }

    private async Task<GrantNotificationConsoleDto> BuildAsync()
    {
        var templates = await _repo.GetListAsync();

        var items = templates
            // Sıra enum sırasıdır: süreçte hangi olayın önce geldiğini anlatır. Rol şablonları
            // Genel şablonun hemen altında durur.
            .OrderBy(t => (int)t.Trigger)
            // Yükseltmeler ilk bildirimlerin altında, gün sırasıyla.
            .ThenBy(t => t.IsEscalation)
            .ThenBy(t => t.AfterDays)
            .ThenBy(t => (int)t.Audience)
            .Select(Map)
            .ToList();

        foreach (var general in items.Where(t => t.Audience == GrantNotificationAudience.Genel && !t.IsEscalation))
        {
            general.DuplicableAudiences = GrantNotificationTriggerRegistry.AudiencesOf(general.Trigger)
                .Where(a => !items.Any(t => t.Trigger == general.Trigger && t.Audience == a && !t.IsEscalation))
                .ToList();
            general.EscalationAudiences = GrantNotificationTriggerRegistry.EscalationAudiencesOf(general.Trigger)
                .Where(a => !items.Any(t => t.Trigger == general.Trigger && t.Audience == a && t.IsEscalation))
                .ToList();
        }

        return new GrantNotificationConsoleDto
        {
            Templates = items,
            EnabledCount = items.Count(t => t.IsEnabled)
        };
    }

    private GrantNotificationTemplateDto Map(GrantNotificationTemplate template)
    {
        var sample = SampleValues(template.Trigger);

        return new GrantNotificationTemplateDto
        {
            Id = template.Id,
            Trigger = template.Trigger,
            Audience = template.Audience,
            IsEscalation = template.IsEscalation,
            AfterDays = template.AfterDays,
            IsEnabled = template.IsEnabled,
            InApp = template.InApp,
            Email = template.Email,
            Subject = template.Subject,
            Body = template.Body,
            // Yükseltme isteğe bağlıdır: zorunlu tetikleyicinin kilidi yükseltmeye geçmez.
            IsMandatory = !template.IsEscalation && GrantNotificationTriggerRegistry.IsMandatory(template.Trigger),
            Variables = (template.IsEscalation
                    ? GrantNotificationTriggerRegistry.EscalationVariablesOf(template.Trigger)
                    : GrantNotificationTriggerRegistry.VariablesOf(template.Trigger))
                .ToList(),
            PreviewSubject = GrantNotificationRenderer.Render(template.Subject, sample),
            PreviewBody = GrantNotificationRenderer.Render(template.Body, sample)
        };
    }

    /// <summary>
    /// Önizleme için ÖRNEK değerler. Gerçek bir kayıttan okunmuyor: host şablonu
    /// düzenlerken elinde o tetikleyiciye uygun canlı bir başvuru olmayabilir ve
    /// "önizleme boş" demek metnin nasıl duracağını göstermezdi. Örnek oldukları
    /// ekranda yazılı.
    /// </summary>
    private Dictionary<string, string?> SampleValues(GrantNotificationTrigger trigger)
    {
        var deadline = Clock.Now.Date.AddDays(30);

        return new Dictionary<string, string?>
        {
            ["{firma_adı}"] = L["Grants:Notify:Sample:Firm"],
            ["{çağrı_adı}"] = L["Grants:Notify:Sample:Grant"],
            ["{son_tarih}"] = deadline.ToString("dd.MM.yyyy"),
            ["{kalan_gün}"] = "30",
            ["{host_notu}"] = L["Grants:Notify:Sample:HostNote"],
            ["{eksik_evrak_sayısı}"] = "3",
            ["{evrak_adı}"] = L["Grants:Notify:Sample:Document"],
            ["{danışman_notu}"] = L["Grants:Notify:Sample:ConsultantNote"],
            ["{aşama}"] = L["Grants:Notify:Sample:Stage"],
            ["{karar}"] = L["Grants:Notify:Decision:Reddedildi"],
            ["{itiraz_bilgisi}"] = L["Grants:Notify:AppealWindow", deadline.ToString("dd.MM.yyyy"), 30],
            ["{rapor_adı}"] = L["Grants:Notify:Sample:Report"],
            // 20b · Fikre uygun çağrı
            ["{fikir}"] = L["Grants:Notify:Sample:Idea"],
            ["{eşleşme}"] = "%91",
            ["{danışman}"] = L["Grants:Notify:Sample:Consultant"],
            // 19b · Fikir daveti: mesaj örneği ekranın varsayılan metni; {hatırlatma} ilk gönderimde boş.
            ["{davet_mesajı}"] = L["Grants:Invite:DefaultMessage"],
            // Faz 2 · yükseltme
            ["{bekleyen_gün}"] = "7",
            ["{sıradaki_taraf}"] = L["Grants:Notify:Sample:Side"],
            // Faz 3 · yönetici özeti
            ["{toplam}"] = "5",
            ["{en_eski_gün}"] = "9",
            ["{özet}"] = L["Grants:Notify:Sample:DigestSummary"],
            ["{liste}"] = L["Grants:Notify:Sample:DigestList"]
        };
    }
}
