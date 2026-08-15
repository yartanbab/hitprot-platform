using System;
using System.Threading.Tasks;
using Apya.Platform.Calendars;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Calendars;

[Authorize]
public class CallbackModel : AbpPageModel
{
    private readonly ICalendarAppService _calendarAppService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<CallbackModel> _logger;

    public CallbackModel(ICalendarAppService calendarAppService, IConfiguration configuration, ILogger<CallbackModel> logger)
    {
        _calendarAppService = calendarAppService;
        _configuration      = configuration;
        _logger             = logger;
    }

    public async Task<IActionResult> OnGetAsync(string? code, string? state, string? error)
    {
        if (!string.IsNullOrEmpty(error))
        {
            _logger.LogWarning("OAuth callback hatası: {Error}", error);
            return Redirect("/Calendars?msg=error");
        }

        if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
            return Redirect("/Calendars?msg=error");

        // SEC-012: state = "{provider}.{token}"; token AppService'te kullanıcı-bağlı cache ile doğrulanır.
        var stateParts = state.Split('.', 2);
        if (stateParts.Length != 2
            || !int.TryParse(stateParts[0], out var providerInt)
            || !Enum.IsDefined(typeof(CalendarProviderType), providerInt))
            return Redirect("/Calendars?msg=error");

        var provider    = (CalendarProviderType)providerInt;
        var stateToken  = stateParts[1];
        var selfUrl     = _configuration["App:SelfUrl"]?.TrimEnd('/') ?? string.Empty;
        var redirectUri = $"{selfUrl}/Calendars/Callback";

        try
        {
            await _calendarAppService.ExchangeCodeAndConnectAsync(provider, code, redirectUri, stateToken);
            return Redirect("/Calendars?msg=success");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OAuth code exchange başarısız. Provider={Provider}", provider);
            return Redirect("/Calendars?msg=error");
        }
    }
}
