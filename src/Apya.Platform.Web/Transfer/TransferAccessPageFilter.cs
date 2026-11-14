using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Apya.Platform.DataTransfers;
using Apya.Platform.DataTransfers.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Web.Transfer;

/// <summary>
/// Katalogdaki her aktarım ucunun önünde ve arkasında durur. Önce <see cref="TransferAccess"/>
/// kuralını uygular (uçların kendi sayfa izinleri ayrıca geçerlidir); sonra işlemi geçmişe yazar.
/// Tek yerde durduğu için yeni bir uç kataloğa yazıldığı anda aynı kurala ve geçmişe girer.
/// </summary>
public class TransferAccessPageFilter : IAsyncPageFilter, ITransientDependency
{
    private readonly TransferAccess _access;
    private readonly DataTransferRunRecorder _recorder;

    public TransferAccessPageFilter(TransferAccess access, DataTransferRunRecorder recorder)
    {
        _access = access;
        _recorder = recorder;
    }

    public Task OnPageHandlerSelectionAsync(PageHandlerSelectedContext context) => Task.CompletedTask;

    public async Task OnPageHandlerExecutionAsync(PageHandlerExecutingContext context, PageHandlerExecutionDelegate next)
    {
        var endpoint = TransferCatalog.Find(context.ActionDescriptor.ViewEnginePath, context.HandlerMethod?.Name);
        if (endpoint == null)
        {
            await next();
            return;
        }

        if (!await _access.CanAsync(endpoint.Direction))
        {
            context.Result = new ForbidResult();
            return;
        }

        var watch = Stopwatch.StartNew();
        var executed = await next();
        await RecordAsync(endpoint, executed, (int)watch.ElapsedMilliseconds);
    }

    /// <summary>
    /// Dışa aktarmada dosya dönen her istek; içe aktarmada yalnız yazan uç (şablon indirme ve
    /// önizleme işlem değildir). Listelenmeyen uçların (gizli raporlar) modülü yoktur, kaydedilmez.
    /// </summary>
    private async Task RecordAsync(TransferEndpoint endpoint, PageHandlerExecutedContext executed, int durationMs)
    {
        var screen = TransferCatalog.ScreenOf(endpoint);
        if (screen == null || executed.Exception != null)
        {
            return;
        }

        var report = TransferReport.Get(executed.HttpContext);
        var input = new RecordDataTransferRunDto
        {
            ModuleKey = screen.Module.Key,
            Direction = endpoint.Direction == TransferDirection.Export ? DataTransferDirection.Export : DataTransferDirection.Import,
            DurationMs = durationMs,
            FileName = report?.FileName,
            Format = report?.Format,
            TotalRows = report?.TotalRows,
            SucceededRows = report?.SucceededRows,
            FailedRows = report?.FailedRows
        };

        if (endpoint.Direction == TransferDirection.Export)
        {
            if (executed.Result is not FileResult file)
            {
                return;
            }

            input.Succeeded = true;
            input.FileName ??= file.FileDownloadName;
            input.Format ??= TransferReport.FormatOf(file.FileDownloadName);
        }
        else
        {
            if (!endpoint.Handler.StartsWith("Import", StringComparison.OrdinalIgnoreCase) || executed.Result is not JsonResult json)
            {
                return;
            }

            // İçe aktarma uçları { ok, done?, message } döner; Excel/CSV'de kayıt "done" ile biter.
            input.Succeeded = Flag(json.Value, "done") ?? Flag(json.Value, "ok") ?? false;
            input.Message = json.Value?.GetType().GetProperty("message")?.GetValue(json.Value) as string;
        }

        await _recorder.RecordAsync(input);
    }

    private static bool? Flag(object? value, string name)
        => value?.GetType().GetProperty(name)?.GetValue(value) as bool?;
}
