using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Volo.Abp.DependencyInjection;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Middleware;

/// <summary>
/// Eşiği aşan HTTP isteklerini Warning loglar (bkz. <see cref="PlatformPerformanceOptions"/>).
/// Statik varlıklar ve uzun ömürlü SignalR bağlantıları kapsam dışıdır —
/// hub bağlantısı dakikalarca açık kalır, "yavaş istek" değildir.
/// </summary>
public class SlowRequestLoggingMiddleware : IMiddleware, ITransientDependency
{
    private static readonly string[] SkippedPrefixes =
    {
        "/css", "/js", "/libs", "/images", "/icons", "/favicon",
        "/health", "/notification-hub", "/task-hub", "/ai-hub"
    };

    private readonly ILogger<SlowRequestLoggingMiddleware> _logger;
    private readonly IOptions<PlatformPerformanceOptions> _options;
    private readonly ICurrentTenant _currentTenant;
    private readonly ICurrentUser _currentUser;

    public SlowRequestLoggingMiddleware(
        ILogger<SlowRequestLoggingMiddleware> logger,
        IOptions<PlatformPerformanceOptions> options,
        ICurrentTenant currentTenant,
        ICurrentUser currentUser)
    {
        _logger = logger;
        _options = options;
        _currentTenant = currentTenant;
        _currentUser = currentUser;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var thresholdMs = _options.Value.SlowRequestThresholdMs;
        if (thresholdMs <= 0 || ShouldSkip(context))
        {
            await next(context);
            return;
        }

        var stopwatch = Stopwatch.StartNew();
        try
        {
            await next(context);
        }
        finally
        {
            stopwatch.Stop();
            if (stopwatch.ElapsedMilliseconds >= thresholdMs)
            {
                _logger.LogWarning(
                    "[PERF] Yavaş istek: {Method} {Path} → {StatusCode}, {ElapsedMs} ms (eşik {ThresholdMs} ms). Tenant: {TenantId}, Kullanıcı: {UserId}",
                    context.Request.Method,
                    context.Request.Path.Value,
                    context.Response.StatusCode,
                    stopwatch.ElapsedMilliseconds,
                    thresholdMs,
                    _currentTenant.Id?.ToString() ?? "host",
                    _currentUser.Id?.ToString() ?? "anonim");
            }
        }
    }

    private static bool ShouldSkip(HttpContext context)
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            return true;
        }

        var path = context.Request.Path.Value ?? string.Empty;
        foreach (var prefix in SkippedPrefixes)
        {
            if (path.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }
}
