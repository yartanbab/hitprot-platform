using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.DataTransfers;
using Apya.Platform.DataTransfers.Dtos;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Transfer;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.DataTransfer;

/// <summary>
/// Aktarım şablonu düzenleyicisi (yeni ya da mevcut). Pencere yalnız seçenekleri ve mevcut şablonu
/// taşır; sütunlar modülün kendi ucundan okunur, kayıt şablon servisine gider — kurallar orada.
/// </summary>
[Authorize]
public class TemplateModalModel : PlatformPageModel
{
    private readonly IDataTransferTemplateAppService _templates;

    public TemplateModalModel(IDataTransferTemplateAppService templates)
    {
        _templates = templates;
    }

    /// <summary>Şablon kurulabilen bir modül + yön ve standart sütunlarının okunacağı adres.</summary>
    public sealed record Target(string ModuleKey, int Direction, string Name, string ColumnsUrl);

    public List<Target> Targets { get; private set; } = [];

    public DataTransferTemplateDto? Template { get; private set; }

    public List<DataTransferTemplateVersionDto> Versions { get; private set; } = [];

    public async Task OnGetAsync(Guid? id)
    {
        var host = CurrentTenant.Id == null;
        foreach (var screen in TransferCatalog.Screens.Where(s => s.Module.IsOn(host)))
        {
            if (!await AuthorizationService.IsGrantedAsync(screen.Module.Permission))
            {
                continue;
            }

            var name = L[screen.Module.NameKey].Value;
            // Yalnız doğrudan adresi olan liste dışa aktarımları ve ortak pencereli içe aktarmalar şablon alır.
            if (screen.ExportUrl != null && screen.Formats.Contains("csv"))
            {
                Targets.Add(new Target(screen.Module.Key, (int)DataTransferDirection.Export, name,
                    $"{screen.ExportUrl}&{TableExport.ColumnsQueryKey}=1"));
            }

            if (screen.ImportUrl != null)
            {
                Targets.Add(new Target(screen.Module.Key, (int)DataTransferDirection.Import, name,
                    $"{screen.ImportUrl}?handler=Columns"));
            }
        }

        if (id.HasValue)
        {
            Template = await _templates.GetAsync(id.Value);
            Versions = await _templates.GetVersionsAsync(id.Value);
        }
    }
}
