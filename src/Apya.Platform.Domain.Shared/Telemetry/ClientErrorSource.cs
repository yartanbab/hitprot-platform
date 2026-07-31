namespace Apya.Platform.Telemetry;

/// <summary>Hatanın tarayıcıda hangi kanaldan yakalandığı.</summary>
public enum ClientErrorSource
{
    JsError            = 1, // window.onerror
    UnhandledRejection = 2, // Promise reddi yakalanmamış
    AjaxError          = 3  // Sunucuya giden istek 5xx döndü
}
