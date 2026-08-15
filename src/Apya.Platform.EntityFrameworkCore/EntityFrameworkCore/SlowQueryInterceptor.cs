using System.Data.Common;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.EntityFrameworkCore;

/// <summary>
/// Eşiği aşan veritabanı komutlarını Warning loglar (bkz. <see cref="PlatformPerformanceOptions"/>).
/// Parametre DEĞERLERİ bilinçli olarak loglanmaz — komut metninde yalnız @p0 gibi
/// yer tutucular bulunur, kişisel veri log dosyasına sızmaz.
/// </summary>
public class SlowQueryInterceptor : DbCommandInterceptor, ISingletonDependency
{
    private const int MaxCommandTextLength = 600;

    private readonly ILogger<SlowQueryInterceptor> _logger;
    private readonly IOptions<PlatformPerformanceOptions> _options;

    public SlowQueryInterceptor(
        ILogger<SlowQueryInterceptor> logger,
        IOptions<PlatformPerformanceOptions> options)
    {
        _logger = logger;
        _options = options;
    }

    public override DbDataReader ReaderExecuted(
        DbCommand command, CommandExecutedEventData eventData, DbDataReader result)
    {
        LogIfSlow(command, eventData);
        return base.ReaderExecuted(command, eventData, result);
    }

    public override ValueTask<DbDataReader> ReaderExecutedAsync(
        DbCommand command, CommandExecutedEventData eventData, DbDataReader result,
        CancellationToken cancellationToken = default)
    {
        LogIfSlow(command, eventData);
        return base.ReaderExecutedAsync(command, eventData, result, cancellationToken);
    }

    public override int NonQueryExecuted(
        DbCommand command, CommandExecutedEventData eventData, int result)
    {
        LogIfSlow(command, eventData);
        return base.NonQueryExecuted(command, eventData, result);
    }

    public override ValueTask<int> NonQueryExecutedAsync(
        DbCommand command, CommandExecutedEventData eventData, int result,
        CancellationToken cancellationToken = default)
    {
        LogIfSlow(command, eventData);
        return base.NonQueryExecutedAsync(command, eventData, result, cancellationToken);
    }

    public override object? ScalarExecuted(
        DbCommand command, CommandExecutedEventData eventData, object? result)
    {
        LogIfSlow(command, eventData);
        return base.ScalarExecuted(command, eventData, result);
    }

    public override ValueTask<object?> ScalarExecutedAsync(
        DbCommand command, CommandExecutedEventData eventData, object? result,
        CancellationToken cancellationToken = default)
    {
        LogIfSlow(command, eventData);
        return base.ScalarExecutedAsync(command, eventData, result, cancellationToken);
    }

    private void LogIfSlow(DbCommand command, CommandExecutedEventData eventData)
    {
        var thresholdMs = _options.Value.SlowQueryThresholdMs;
        if (thresholdMs <= 0)
        {
            return;
        }

        var elapsedMs = (long)eventData.Duration.TotalMilliseconds;
        if (elapsedMs < thresholdMs)
        {
            return;
        }

        var text = command.CommandText;
        if (text.Length > MaxCommandTextLength)
        {
            text = text[..MaxCommandTextLength] + " …[kırpıldı]";
        }

        _logger.LogWarning(
            "[PERF] Yavaş sorgu: {ElapsedMs} ms (eşik {ThresholdMs} ms). Komut: {CommandText}",
            elapsedMs, thresholdMs, text);
    }
}
