using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Export;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Apya.Platform.Web.Import;

/// <summary>Tüm parametreli aktarımın dosya satırı: kimlik doluysa güncelleme, boşsa yeni kayıt.</summary>
public interface IFullParameterRow
{
    Guid? Id { get; }

    /// <summary>Satır kaydın bugünkü hâliyle aynı; yazılmaz.</summary>
    bool Unchanged { get; }
}

/// <summary>
/// Sistem yöneticisine özel, tüm parametreli toplu aktarımın ortak gövdesi. Her uçta host bağlamı
/// (kiracıya bürünmek yetmez) ve özel izin aranır; "tek anahtar" kapalıyken de geçerlidir.
/// </summary>
[Authorize(PlatformPermissions.DataTransfer.FullParameters)]
public abstract class FullParameterImportPageModel<TLookups, TRow> : ExcelImportPageModel<TLookups, TRow>
    where TRow : IFullParameterRow
{
    public override async Task OnPageHandlerExecutionAsync(PageHandlerExecutingContext context, PageHandlerExecutionDelegate next)
    {
        if (CurrentTenant.Id != null || !await AuthorizationService.IsGrantedAsync(PlatformPermissions.DataTransfer.FullParameters))
        {
            context.Result = new ForbidResult();
            return;
        }

        await base.OnPageHandlerExecutionAsync(context, next);
    }

    protected override string? Summarize(IReadOnlyList<TRow> rows)
        => L["Import:Full:Summary", rows.Count(r => r.Id == null),
            rows.Count(r => r.Id != null && !r.Unchanged), rows.Count(r => r.Unchanged)].Value;

    protected sealed override Task CreateAsync(TRow row) => row.Unchanged ? Task.CompletedTask : SaveAsync(row);

    protected abstract Task SaveAsync(TRow row);

    /// <summary>Dolu çıktı: açılır listeler ve alan rehberiyle.</summary>
    private protected IActionResult SheetFile<TSource, TInput>(ParameterSheet<TSource, TInput> sheet, IEnumerable<TSource> rows)
        where TSource : class
        where TInput : new()
        => this.TableFile(L[NameKey].Value, sheet.ExportColumns, rows, finish: workbook =>
        {
            ExcelImport.AddOptions(workbook, workbook.Worksheet(1), L["Import:OptionsSheet"], sheet.Columns);
            sheet.AddGuide(workbook);
        });
}
