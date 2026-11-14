using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Pages;
using Apya.Platform.Web.Transfer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Volo.Abp.Uow;

namespace Apya.Platform.Web.Import;

/// <summary>
/// "Excel'den içe aktar" penceresinin ortak gövdesi: şablon → önizleme → onay. Ekran yalnız
/// sütunları, satırı kendi kaydına çevirmeyi ve kaydı kendi oluşturma servisine vermeyi bilir.
/// <para>Satırlar ayrı ve işlemli iş biriminde yazılır: tek satır düşerse hiçbiri kalmaz. Sayfanın
/// kendi iş birimi kullanılmaz — yakalanan hatayı başarı sayıp önceki satırları kaydederdi
/// (bkz. <see cref="PlatformPageModel.OnPageHandlerExecuted"/>).</para>
/// </summary>
/// <typeparam name="TLookups">Satır eşlemesinin istek boyu kullandığı seçenekler (kasa, proje, kişi…).</typeparam>
/// <typeparam name="TRow">Satırın çevrildiği kayıt; <see cref="CreateAsync"/>'e verilir.</typeparam>
public abstract class ExcelImportPageModel<TLookups, TRow> : PlatformPageModel
{
    /// <summary>Şablon sayfası ve dosya adı (ör. "Export:Expenses:Name").</summary>
    protected abstract string NameKey { get; }

    protected abstract Task<TLookups> LoadLookupsAsync();

    protected abstract IReadOnlyList<ImportColumn> Columns(TLookups lookups);

    /// <summary>Satırı kayda çevirir; sorunları <see cref="ImportRow.Errors"/>'a yazar.</summary>
    protected abstract Task<TRow> MapAsync(ImportRow row, TLookups lookups);

    protected abstract Task CreateAsync(TRow row);

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnGetTemplateAsync()
    {
        var name = L[NameKey].Value;
        var columns = Columns(await LoadLookupsAsync());
        var fileName = $"{L["Import:Template"]}_{name}";
        return this.IsCsv()
            ? File(ExcelImport.TemplateCsv(columns), ExcelTable.CsvContentType, ExcelTable.FileName(fileName, Clock.Now, "csv"))
            : File(ExcelImport.Template(name, L["Import:OptionsSheet"], columns), ExcelTable.ContentType, ExcelTable.FileName(fileName, Clock.Now));
    }

    public async Task<IActionResult> OnPostPreviewAsync(IFormFile? file)
    {
        var (sheet, _) = await ReadAsync(file);
        return new JsonResult(ImportResponse.Preview(sheet, L));
    }

    public async Task<IActionResult> OnPostImportAsync(IFormFile? file, [FromServices] IUnitOfWorkManager unitOfWorkManager)
    {
        var (sheet, rows) = await ReadAsync(file);
        var failed = sheet.Rows.Count(r => r.Errors.Count > 0);
        if (sheet.Errors.Count > 0 || failed > 0)
        {
            Report(file, sheet.Rows.Count, succeeded: 0, failed);
            return new JsonResult(ImportResponse.Preview(sheet, L));
        }

        // Complete çağrılmadan çıkılırsa (reddedilen satır) bütün satırlar geri alınır.
        using var uow = unitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
        for (var i = 0; i < rows.Count; i++)
        {
            try
            {
                await CreateAsync(rows[i]);
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex, "{Page} içe aktarma satır {Row} reddedildi", GetType().Name, sheet.Rows[i].Number);
                Report(file, rows.Count, succeeded: 0, failed: 1);
                return new JsonResult(ImportResponse.Failed(L["Import:Error:Row", sheet.Rows[i].Number, this.UserMessage(ex)]));
            }
        }

        await uow.CompleteAsync();
        Report(file, rows.Count, succeeded: rows.Count, failed: 0);
        return new JsonResult(ImportResponse.Done(L["Import:Done", rows.Count]));
    }

    /// <summary>İşlem geçmişine satır sayılarını bildirir (hepsi ya da hiçbiri: reddedilen dosyada yazılan satır yoktur).</summary>
    private void Report(IFormFile? file, int total, int succeeded, int failed)
        => TransferReport.Set(HttpContext, new TransferReport
        {
            FileName = file?.FileName, Format = TransferReport.FormatOf(file?.FileName),
            TotalRows = total, SucceededRows = succeeded, FailedRows = failed
        });

    private async Task<(ImportSheet Sheet, List<TRow> Rows)> ReadAsync(IFormFile? file)
    {
        var rows = new List<TRow>();
        if (file == null || file.Length == 0)
        {
            return (new ImportSheet(new List<string>(), new List<ImportRow>(), [L["Import:ChooseFile"]]), rows);
        }

        var lookups = await LoadLookupsAsync();
        await using var stream = file.OpenReadStream();
        var sheet = ExcelImport.Read(stream, Columns(lookups), L);
        foreach (var row in sheet.Rows)
        {
            rows.Add(await MapAsync(row, lookups));
        }

        return (sheet, rows);
    }

    /// <summary>Ad eşleşmesi: büyük/küçük harf (Türkçe kural) ve "*" yok sayılır.</summary>
    protected static bool Same(string a, string b) => ExcelImport.Normalize(a) == ExcelImport.Normalize(b);

    /// <summary>
    /// Metni seçeneklerden tam bir taneyle eşler; yoksa ya da birden çoksa satıra hata yazar.
    /// </summary>
    protected bool TryMatch<T>(ImportRow row, string header, string text, IEnumerable<T> options,
        Func<T, IEnumerable<string>> names, out T? match)
    {
        var found = options.Where(o => names(o).Any(n => Same(n, text))).ToList();
        match = found.Count == 1 ? found[0] : default;
        if (found.Count != 1)
        {
            row.Errors.Add(L[found.Count == 0 ? "Import:Error:NotFound" : "Import:Error:Ambiguous", header, text]);
        }

        return found.Count == 1;
    }
}
