using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.Tenants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.CompanyProfile;

/// <summary>
/// "Kurum Profili" — avatar menüsündeki kurum adına tıklayınca açılan ekran. Kayıt talebinden
/// taşınan kimlik/iletişim bilgisini ve hesabın özetini gösterir; kurum yöneticisi aynı
/// sayfada düzenler (<c>?edit=true</c>).
///
/// <para>Okuma her kurum kullanıcısına açık, düzenleme <c>TenantSettings</c> ister —
/// gerekçe <see cref="MyCompanyProfileAppService"/>'te.</para>
/// </summary>
[Authorize]
public class IndexModel : AbpPageModel
{
    private readonly IMyCompanyProfileAppService _myCompanyProfileAppService;

    public IndexModel(IMyCompanyProfileAppService myCompanyProfileAppService)
    {
        _myCompanyProfileAppService = myCompanyProfileAppService;
    }

    /// <summary>Host'un kurum profili yoktur — ekran bilgi notuna düşer.</summary>
    public bool IsHost { get; private set; }

    public bool CanEdit { get; private set; }

    public bool IsEditing { get; private set; }

    public MyCompanyProfileDto Profile { get; private set; } = new();

    [BindProperty]
    public UpdateTenantProfileDto Input { get; set; } = new();

    public async Task OnGetAsync(bool edit = false)
    {
        if (CurrentTenant.Id == null)
        {
            IsHost = true;
            return;
        }

        await LoadAsync();

        IsEditing = edit && CanEdit;
        if (IsEditing)
        {
            FillInputFromProfile();
        }
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (CurrentTenant.Id == null)
        {
            return RedirectToPage();
        }

        await LoadAsync();

        if (!CanEdit)
        {
            return Forbid();
        }

        if (!ModelState.IsValid)
        {
            IsEditing = true;
            return Page();
        }

        try
        {
            await _myCompanyProfileAppService.UpdateAsync(Input);
        }
        catch (BusinessException ex) when (ex.Code == TaxNumberAlreadyExistsCode)
        {
            // Hata alana bağlanır ki kullanıcı neyi düzelteceğini görsün.
            ModelState.AddModelError($"{nameof(Input)}.{nameof(Input.TaxNumber)}", L[TaxNumberAlreadyExistsCode].Value);
            IsEditing = true;
            return Page();
        }

        TempData["CompanyProfileSaved"] = L["CompanyProfile:Saved"].Value;
        return RedirectToPage();
    }

    private async Task LoadAsync()
    {
        Profile = await _myCompanyProfileAppService.GetAsync();
        CanEdit = await AuthorizationService.IsGrantedAsync(PlatformPermissions.TenantSettings.Default);
    }

    /// <summary>
    /// Form, kayıt talebinden taşınmış değerlerle açılır — kurum yalnız değişeni düzeltir.
    /// 🔴 Formdaki her alan burada doldurulmalı: eksik kalan alan boş gönderilir ve kayıtta SİLİNİR.
    /// </summary>
    private void FillInputFromProfile()
    {
        Input.LegalName = Profile.LegalName;
        Input.CompanyType = Profile.CompanyType;
        Input.TaxNumber = Profile.TaxNumber;
        Input.TaxOffice = Profile.TaxOffice;
        Input.EmployeeCount = Profile.EmployeeCount;
        Input.Address = Profile.Address;
        Input.CorporateEmail = Profile.CorporateEmail;
        Input.LegalRepresentativeName = Profile.LegalRepresentativeName;
        Input.LegalRepresentativeTitle = Profile.LegalRepresentativeTitle;
        Input.LegalRepresentativeEmail = Profile.LegalRepresentativeEmail;
        Input.LegalRepresentativePhone = Profile.LegalRepresentativePhone;
        Input.OperationalContactName = Profile.OperationalContactName;
        Input.OperationalContactPhone = Profile.OperationalContactPhone;
    }

    private const string TaxNumberAlreadyExistsCode = "Platform:Error:TaxNumberAlreadyExists";

    public IEnumerable<CompanyType> CompanyTypes => Enum.GetValues<CompanyType>();

    public IEnumerable<RegistrationRequestCompanySize> CompanySizes => Enum.GetValues<RegistrationRequestCompanySize>();
}
