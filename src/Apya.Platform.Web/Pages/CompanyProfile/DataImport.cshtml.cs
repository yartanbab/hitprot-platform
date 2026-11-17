using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.CompanyProfile;

/// <summary>
/// "Belgeden doldur" — kurum belgesini yapay zekâyla okutup Kurumsal Veriler için öneri alma.
/// Kimlik verilmezse yükleme formu ve okutulan belgeler, verilirse o belgenin önerileri.
///
/// <para>🔴 Her yükleme aydınlatma metninin onayını ister; öneri kurum onaylamadan kurum
/// verisine yazılmaz (kurallar <see cref="IFirmDataExtractionAppService"/>'te).</para>
/// </summary>
[Authorize]
public class DataImportModel : AbpPageModel
{
    private static readonly JsonSerializerOptions ChoiceJson = new() { Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping };

    private readonly IFirmDataExtractionAppService _extractions;
    private readonly IUploadedFileStorage _storage;

    public DataImportModel(IFirmDataExtractionAppService extractions, IUploadedFileStorage storage)
    {
        _extractions = extractions;
        _storage = storage;
    }

    public bool IsHost { get; private set; }

    /// <summary>Kurum yöneticisi mi: belgeleri görmek ve önerilere karar vermek bunu ister.</summary>
    public bool CanManage { get; private set; }

    /// <summary>Yeni belge okutabilir mi (paketin yapay zekâ özelliği + belge yükleme izni).</summary>
    public bool CanExtract { get; private set; }

    public List<FirmDataExtractionDto> History { get; private set; } = new();

    public FirmDataExtractionDto? Current { get; private set; }

    public string? ErrorMessage { get; private set; }

    [BindProperty]
    public IFormFile? Document { get; set; }

    [BindProperty]
    public bool Consent { get; set; }

    public async Task<IActionResult> OnGetAsync(Guid? id)
    {
        if (!await PrepareAsync())
        {
            return Page();
        }

        if (id.HasValue)
        {
            Current = await _extractions.GetAsync(id.Value);
        }
        else
        {
            History = await _extractions.GetListAsync();
        }
        return Page();
    }

    /// <summary>Belgeyi diske yazar ve okutur; başarıda önerilerine gider.</summary>
    public async Task<IActionResult> OnPostAsync()
    {
        if (!await PrepareAsync())
        {
            return Page();
        }

        var error = Document is not { Length: > 0 } ? L["FirmDataImport:FileRequired"].Value
            : !Consent ? L[PlatformDomainErrorCodes.FirmDataExtractionConsentRequired].Value
            : !FirmDocumentTextReader.IsSupported(Document.FileName) ? L[PlatformDomainErrorCodes.FirmDataExtractionFileTypeNotSupported].Value
            : null;
        if (error != null)
        {
            return await ShowUploadErrorAsync(error);
        }

        string stored;
        try
        {
            stored = await _storage.StoreAsync(Document!);
        }
        catch (BusinessException ex)
        {
            return await ShowUploadErrorAsync(Localize(ex));
        }

        try
        {
            var result = await _extractions.ExtractAsync(new ExtractFirmDataInput
            {
                FileName = Document!.FileName,
                StoredFileName = stored,
                ContentType = Document.ContentType ?? string.Empty,
                FileSize = Document.Length,
                ConsentGiven = Consent
            });
            return RedirectToPage(new { id = result.Id });
        }
        catch (BusinessException ex)
        {
            // Belge kaydı açılmadıysa dosya diskte sahipsiz kalmasın.
            _storage.TryDelete(stored);
            return await ShowUploadErrorAsync(Localize(ex));
        }
    }

    /// <summary>
    /// Öneriyi onaylar. Gönderilen değer önerilenden farklıysa düzenlenmiş değer yazılır.
    /// Çoklu seçimde işaretlenenler JSON dizisine çevrilir (hiçbiri işaretli değilse boş dizi: hata).
    /// </summary>
    public async Task<IActionResult> OnPostAcceptAsync(Guid id, Guid suggestionId, string? rawValue, List<string>? choices, bool multi)
    {
        var raw = multi ? JsonSerializer.Serialize(choices ?? new List<string>(), ChoiceJson) : rawValue ?? string.Empty;
        return await DecideAsync(id, suggestionId, () => _extractions.AcceptAsync(id, suggestionId, raw), "FirmDataImport:Accepted");
    }

    public Task<IActionResult> OnPostRejectAsync(Guid id, Guid suggestionId)
        => DecideAsync(id, suggestionId, () => _extractions.RejectAsync(id, suggestionId), "FirmDataImport:Rejected");

    private async Task<IActionResult> DecideAsync(Guid id, Guid suggestionId, Func<Task<FirmDataExtractionDto>> decide, string messageKey)
    {
        if (!await PrepareAsync())
        {
            return Page();
        }

        try
        {
            await decide();
            TempData["FirmDataImportMessage"] = L[messageKey].Value;
        }
        catch (BusinessException ex)
        {
            TempData["FirmDataImportError"] = Localize(ex);
            TempData["FirmDataImportErrorFor"] = suggestionId.ToString();
        }
        return RedirectToPage(new { id });
    }

    /// <summary>Kurum bağlamı ve yetki; sayfanın gövdesi çizilecekse true.</summary>
    private async Task<bool> PrepareAsync()
    {
        if (CurrentTenant.Id == null)
        {
            IsHost = true;
            return false;
        }

        CanManage = await AuthorizationService.IsGrantedAsync(PlatformPermissions.TenantSettings.Default);
        if (!CanManage)
        {
            return false;
        }

        CanExtract = await _extractions.CanExtractAsync();
        return true;
    }

    private async Task<IActionResult> ShowUploadErrorAsync(string message)
    {
        ErrorMessage = message;
        History = await _extractions.GetListAsync();
        return Page();
    }

    /// <summary>Hata kodunun metnini, istisnanın taşıdığı değerlerle ({Name}, {Min}…) doldurur.</summary>
    private string Localize(BusinessException ex)
    {
        var text = ex.Code == null ? null : L[ex.Code];
        if (text == null || text.ResourceNotFound)
        {
            return L["FirmDataExtraction:AiFailed"].Value;
        }
        var value = text.Value;
        foreach (var key in ex.Data.Keys)
        {
            value = value.Replace("{" + key + "}", Convert.ToString(ex.Data[key], CultureInfo.CurrentCulture));
        }
        return value;
    }

    /// <summary>Ham değerin okunur hali: evet/hayır, seçimler virgülle, sayı yerel biçimde.</summary>
    public string Display(FirmParameterDataType type, string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            return "—";
        }

        switch (type)
        {
            case FirmParameterDataType.Boolean:
                return raw == "true" ? L["FirmData:Yes"].Value : raw == "false" ? L["FirmData:No"].Value : raw;
            case FirmParameterDataType.MultiSelect:
                return string.Join(", ", Choices(raw));
            case FirmParameterDataType.Number:
            case FirmParameterDataType.Money:
            case FirmParameterDataType.Percent:
                if (!decimal.TryParse(raw, NumberStyles.Number, CultureInfo.InvariantCulture, out var number))
                {
                    return raw;
                }
                var text = number.ToString("#,##0.##", CultureInfo.CurrentCulture);
                return type == FirmParameterDataType.Money ? text + " TL" : type == FirmParameterDataType.Percent ? "%" + text : text;
            case FirmParameterDataType.Date:
                return DateTime.TryParseExact(raw, FirmParameterRawValue.DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
                    ? date.ToString("dd.MM.yyyy", CultureInfo.CurrentCulture)
                    : raw;
            default:
                return raw;
        }
    }

    public static IReadOnlyList<string> Choices(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            return Array.Empty<string>();
        }
        try
        {
            return JsonSerializer.Deserialize<List<string>>(raw) ?? new List<string>();
        }
        catch (JsonException)
        {
            return new[] { raw };
        }
    }
}
