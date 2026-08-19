using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Permissions;

namespace Apya.Platform.Documents;

/// <summary>
/// Alıcı şablonları + bölüm sıralaması.
/// Sistem şablonları host'ta (TenantId = null) durur; okuma DocumentType/CompliancePackage
/// ile aynı desende kiracı filtresi kapatılarak yapılır.
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class ReportTemplateAppService : ApplicationService, IReportTemplateAppService
{
    private readonly IRepository<ReportTemplate, Guid> _templateRepository;
    private readonly IRepository<ReportSection, Guid> _sectionRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public ReportTemplateAppService(
        IRepository<ReportTemplate, Guid> templateRepository,
        IRepository<ReportSection, Guid> sectionRepository,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _templateRepository = templateRepository;
        _sectionRepository = sectionRepository;
        _mtFilter = mtFilter;
    }

    public virtual async Task<List<ReportTemplateDto>> GetListAsync()
    {
        var tenantId = CurrentTenant.Id;

        // Sorgular filtre KAPALI blok içinde çalıştırılır — IQueryable döndürmek
        // filtreyi etkisiz kılar (EF yürütme anında yeniden uygular).
        using (_mtFilter.Disable())
        {
            var templateQueryable = await _templateRepository.GetQueryableAsync();
            var templates = await AsyncExecuter.ToListAsync(
                templateQueryable.AsNoTracking()
                    .Where(t => t.TenantId == null || t.TenantId == tenantId)
                    .OrderBy(t => t.Order).ThenBy(t => t.Name));

            if (templates.Count == 0)
            {
                return new List<ReportTemplateDto>();
            }

            var templateIds = templates.Select(t => t.Id).ToList();
            var sectionQueryable = await _sectionRepository.GetQueryableAsync();
            var sections = await AsyncExecuter.ToListAsync(
                sectionQueryable.AsNoTracking()
                    .Where(s => templateIds.Contains(s.TemplateId))
                    .OrderBy(s => s.Order));

            return templates.Select(t => Map(t, sections.Where(s => s.TemplateId == t.Id).ToList())).ToList();
        }
    }

    [Authorize(PlatformPermissions.Documents.GenerateReports)]
    public virtual async Task<ReportTemplateDto> UpdateSectionsAsync(UpdateReportSectionsDto input)
    {
        var sectionIds = input.Sections.Select(s => s.SectionId).ToList();

        // Kiracı filtresi kapalı okunur (sistem şablonu bölümleri host'ta),
        // ama yalnız İSTENEN şablona ait olanlar güncellenir.
        using (_mtFilter.Disable())
        {
            var sections = await _sectionRepository.GetListAsync(s => sectionIds.Contains(s.Id));

            foreach (var section in sections.Where(s => s.TemplateId == input.TemplateId))
            {
                var wanted = input.Sections.First(x => x.SectionId == section.Id);
                section.SetOrder(wanted.Order);

                // Verisi olmayan bölüm açılamaz — boş sayfa üretmesin.
                section.SetEnabled(wanted.IsEnabled && ReportSectionAvailability.IsAvailable(section.SectionKey));
            }

            await _sectionRepository.UpdateManyAsync(sections);
        }

        var templates = await GetListAsync();
        return templates.First(t => t.Id == input.TemplateId);
    }

    /* ─── Şablon CRUD (Rapor Derleyici) ────────────────────────────────── */

    /// <summary>
    /// Yeni kiracı şablonu. Bölümler 12 anahtarın TAMAMI için oluşturulur ki
    /// kullanıcı sonradan açıp kapatabilsin; varsayılan olarak yalnız verisi
    /// olanlar açık gelir.
    /// </summary>
    [Authorize(PlatformPermissions.Documents.GenerateReports)]
    public virtual async Task<ReportTemplateDto> CreateAsync(CreateUpdateReportTemplateDto input)
    {
        var template = new ReportTemplate(
            GuidGenerator.Create(), CurrentTenant.Id, input.Name,
            input.Recipient, input.Issuer, isSystem: false, order: input.Order);

        await _templateRepository.InsertAsync(template, autoSave: true);

        var order = 1;
        var sections = Enum.GetValues<ReportSectionKey>()
            .Select(key => new ReportSection(
                GuidGenerator.Create(), CurrentTenant.Id, template.Id, key,
                order++, ReportSectionAvailability.IsAvailable(key)))
            .ToList();

        await _sectionRepository.InsertManyAsync(sections, autoSave: true);

        var templates = await GetListAsync();
        return templates.First(t => t.Id == template.Id);
    }

    /// <summary>Şablon künyesini düzenler. Sistem şablonunu entity reddeder.</summary>
    [Authorize(PlatformPermissions.Documents.GenerateReports)]
    public virtual async Task<ReportTemplateDto> UpdateAsync(Guid id, CreateUpdateReportTemplateDto input)
    {
        var template = await _templateRepository.GetAsync(id);

        template.Update(input.Name, input.Recipient, input.Issuer, input.Order);
        await _templateRepository.UpdateAsync(template);

        var templates = await GetListAsync();
        return templates.First(t => t.Id == id);
    }

    /// <summary>
    /// Şablonu ve bölümlerini siler. Sistem şablonu silinemez. Üretilmiş teslim
    /// paketleri şablon ADINI kendi kaydında tuttuğu için geçmiş bozulmaz.
    /// </summary>
    [Authorize(PlatformPermissions.Documents.GenerateReports)]
    public virtual async Task DeleteAsync(Guid id)
    {
        var template = await _templateRepository.GetAsync(id);
        template.GuardNotSystem();

        await _sectionRepository.DeleteAsync(s => s.TemplateId == id);
        await _templateRepository.DeleteAsync(template);
    }

    /// <summary>
    /// Sistem şablonunu kiracıya kopyalar — "düzenlemek için önce kopyala"
    /// akışının tek tıkla karşılığı. Bölüm sırası ve açık/kapalı durumu korunur.
    /// </summary>
    [Authorize(PlatformPermissions.Documents.GenerateReports)]
    public virtual async Task<ReportTemplateDto> DuplicateAsync(Guid id)
    {
        ReportTemplate source;
        List<ReportSection> sourceSections;

        // Kaynak sistem şablonu olabilir (host'ta) — okuma filtre kapalı yapılır,
        // kopya HER ZAMAN mevcut kiracıya yazılır.
        using (_mtFilter.Disable())
        {
            source = await _templateRepository.GetAsync(id);
            sourceSections = (await _sectionRepository.GetListAsync(s => s.TemplateId == id))
                .OrderBy(s => s.Order)
                .ToList();
        }

        var copy = new ReportTemplate(
            GuidGenerator.Create(), CurrentTenant.Id, $"{source.Name} (kopya)",
            source.Recipient, source.Issuer, isSystem: false, order: source.Order);

        await _templateRepository.InsertAsync(copy, autoSave: true);

        var sections = sourceSections
            .Select(s => new ReportSection(
                GuidGenerator.Create(), CurrentTenant.Id, copy.Id, s.SectionKey, s.Order, s.IsEnabled))
            .ToList();

        await _sectionRepository.InsertManyAsync(sections, autoSave: true);

        var templates = await GetListAsync();
        return templates.First(t => t.Id == copy.Id);
    }

    private static ReportTemplateDto Map(ReportTemplate template, List<ReportSection> sections) => new()
    {
        Id = template.Id,
        TenantId = template.TenantId,
        Name = template.Name,
        Recipient = template.Recipient,
        Issuer = template.Issuer,
        IsSystem = template.IsSystem,
        Order = template.Order,
        EnabledSectionCount = sections.Count(s => s.IsEnabled),
        Sections = sections.Select(s => new ReportSectionDto
        {
            Id = s.Id,
            TemplateId = s.TemplateId,
            SectionKey = s.SectionKey,
            Order = s.Order,
            IsEnabled = s.IsEnabled,
            IsAvailable = ReportSectionAvailability.IsAvailable(s.SectionKey),
        }).ToList(),
    };
}
