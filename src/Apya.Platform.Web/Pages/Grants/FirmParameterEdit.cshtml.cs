using System;
using System.Globalization;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// Kurum parametresi oluşturma ve düzenleme. <c>id</c> yoksa yeni parametre.
/// Kod ve veri tipi yalnız oluştururken seçilir; sistem parametresinde kilitli alanlar basılmaz.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class FirmParameterEditModel : AbpPageModel
{
    private readonly IFirmParameterAdminAppService _service;

    public FirmParameterEditModel(IFirmParameterAdminAppService service)
    {
        _service = service;
    }

    [BindProperty(SupportsGet = true)]
    public Guid? Id { get; set; }

    [BindProperty]
    public SaveFirmParameterDefinitionDto Input { get; set; } = new();

    /// <summary>
    /// Sayı sınırları METİN olarak bağlanır ve kültürden bağımsız okunur: tarayıcı "0.5"
    /// gönderir, Türkçe kültürde ondalık bağlama bunu 5 diye okurdu.
    /// </summary>
    [BindProperty]
    public string? MinText { get; set; }

    [BindProperty]
    public string? MaxText { get; set; }

    public bool IsNew => Id == null;

    /// <summary>Düzenlenen tanımın değişmeyen bilgileri (kod, tip, sistem mi, sürüm).</summary>
    public FirmParameterDefinitionDto? Existing { get; private set; }

    public bool IsSystem => Existing?.IsSystem == true;

    public string? ErrorMessage { get; private set; }

    public async Task OnGetAsync()
    {
        if (Id is not { } id)
        {
            return;
        }

        Existing = await _service.GetAsync(id);
        // 🔴 Formdaki her alan burada doldurulmalı: eksik kalan alan boş gönderilir ve kayıtta silinir.
        Input = new SaveFirmParameterDefinitionDto
        {
            Code = Existing.Code,
            Name = Existing.Name,
            Description = Existing.Description,
            DataType = Existing.DataType,
            Group = Existing.Group,
            Requirement = Existing.Requirement,
            Audience = Existing.Audience,
            AllowDocumentSource = Existing.AllowDocumentSource,
            ValidityMonths = Existing.ValidityMonths,
            MinNumber = Existing.MinNumber,
            MaxNumber = Existing.MaxNumber,
            MaxLength = Existing.MaxLength,
            OptionsText = string.Join("\n", Existing.Options),
            MatchUsage = Existing.MatchUsage,
            IsActive = Existing.IsActive,
            Order = Existing.Order
        };
        MinText = Existing.MinNumber?.ToString(CultureInfo.InvariantCulture);
        MaxText = Existing.MaxNumber?.ToString(CultureInfo.InvariantCulture);
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (Id is { } existingId)
        {
            Existing = await _service.GetAsync(existingId);
            if (Existing.IsSystem)
            {
                // Sistem parametresinin formunda bu alanlar yoktur; gönderilmeyen alan
                // varsayılana düşüp "değiştirilmek istendi" sayılmasın.
                Input.MatchUsage = Existing.MatchUsage;
                Input.IsActive = Existing.IsActive;
            }
        }

        if (!TryParseLimit(MinText, out var min) || !TryParseLimit(MaxText, out var max))
        {
            ErrorMessage = L[PlatformDomainErrorCodes.FirmParameterLimitInvalid].Value;
            return Page();
        }
        Input.MinNumber = min;
        Input.MaxNumber = max;

        try
        {
            if (Id is { } id)
            {
                await _service.UpdateAsync(id, Input);
            }
            else
            {
                await _service.CreateAsync(Input);
            }
        }
        catch (BusinessException ex) when (ex.Code?.StartsWith("Platform:FirmParameter:") == true)
        {
            ErrorMessage = FirmParameterErrors.Localize(L, ex);
            return Page();
        }

        TempData["FirmParamsMessage"] = L["FirmParams:Saved"].Value;
        return RedirectToPage("/Grants/FirmParameters");
    }

    private static bool TryParseLimit(string? text, out decimal? value)
    {
        value = null;
        if (string.IsNullOrWhiteSpace(text))
        {
            return true;
        }
        if (decimal.TryParse(text.Trim(), NumberStyles.Number & ~NumberStyles.AllowThousands, CultureInfo.InvariantCulture, out var parsed))
        {
            value = parsed;
            return true;
        }
        return false;
    }
}
