using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.CompanyProfile;

/// <summary>
/// "Kurumsal Veriler" — kurumun hibe eşleştirmesinde kullanılan, başka hiçbir ekranda
/// girilmeyen bilgileri (stratejik hedefler, kapasite, eş finansman…). Form katalogdaki
/// tanımlardan çizilir: yeni parametre eklemek bu sayfada kod değişikliği gerektirmez.
///
/// <para>🔴 Boş bırakılan alan "bilinmiyor"dur, sıfır değil. Bu yüzden evet/hayır alanı
/// onay kutusu DEĞİL üç seçenekli listedir: işaretsiz kutu "hayır" ile "bilmiyorum"u ayıramaz.</para>
/// </summary>
[Authorize]
public class DataModel : AbpPageModel
{
    private readonly IFirmDataAppService _firmDataAppService;

    public DataModel(IFirmDataAppService firmDataAppService)
    {
        _firmDataAppService = firmDataAppService;
    }

    public bool IsHost { get; private set; }

    public bool CanEdit { get; private set; }

    public FirmDataDto Data { get; private set; } = new();

    public string? ErrorMessage { get; private set; }

    [BindProperty]
    public List<SaveFirmDataItemDto> Items { get; set; } = new();

    public async Task OnGetAsync()
    {
        if (CurrentTenant.Id == null)
        {
            IsHost = true;
            return;
        }

        await LoadAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (CurrentTenant.Id == null)
        {
            return RedirectToPage();
        }

        CanEdit = await AuthorizationService.IsGrantedAsync(PlatformPermissions.TenantSettings.Default);
        if (!CanEdit)
        {
            return Forbid();
        }

        try
        {
            await _firmDataAppService.SaveMineAsync(new SaveFirmDataDto { Items = Items });
        }
        catch (BusinessException ex) when (ex.Code?.StartsWith("Platform:FirmParameter:") == true)
        {
            // Hata sayfada gösterilir ve kullanıcının yazdıkları formda kalır.
            ErrorMessage = Localize(ex);
            await LoadAsync();
            KeepPostedValues();
            return Page();
        }

        TempData["FirmDataSaved"] = L["FirmData:Saved"].Value;
        return RedirectToPage();
    }

    private async Task LoadAsync()
    {
        Data = await _firmDataAppService.GetMineAsync();
        CanEdit = await AuthorizationService.IsGrantedAsync(PlatformPermissions.TenantSettings.Default);
    }

    private void KeepPostedValues()
    {
        var posted = Items.ToDictionary(i => i.DefinitionId);
        foreach (var item in Data.Groups.SelectMany(g => g.Items))
        {
            if (posted.TryGetValue(item.DefinitionId, out var value))
            {
                item.RawValue = value.RawValue;
                item.Choices = value.Choices;
            }
        }
    }

    /// <summary>Hata kodunun metnini, istisnanın taşıdığı değerlerle ({Name}, {Max}…) doldurur.</summary>
    private string Localize(BusinessException ex)
    {
        var text = L[ex.Code!].Value;
        foreach (var key in ex.Data.Keys)
        {
            text = text.Replace("{" + key + "}", ex.Data[key]?.ToString());
        }
        return text;
    }
}
