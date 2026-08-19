using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>Alıcı şablonları ve bölüm sıralaması (rapor derleyicinin sol kolonu).</summary>
public interface IReportTemplateAppService : IApplicationService
{
    Task<List<ReportTemplateDto>> GetListAsync();

    /// <summary>Bölümleri sürükleyerek sırala / aç-kapa. Kapalı bölüm çıktıya girmez.</summary>
    Task<ReportTemplateDto> UpdateSectionsAsync(UpdateReportSectionsDto input);
}
