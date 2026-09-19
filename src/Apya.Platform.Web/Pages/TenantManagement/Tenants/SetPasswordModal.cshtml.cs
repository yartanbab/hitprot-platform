using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.TenantManagement.Tenants;

/// <summary>
/// Host'un, müşteri kullanıcısının şifresini ESKİ ŞİFREYİ BİLMEDEN belirlediği modal.
/// Müşteri şifresini unuttuğunda ve posta kanalı çalışmadığında tek kurtarma yolu.
/// </summary>
public class SetPasswordModalModel : AbpPageModel
{
    private readonly ITenantProfileAppService _tenantProfileAppService;

    [HiddenInput]
    [BindProperty]
    public Guid TenantId { get; set; }

    /// <summary>
    /// Yalnız başlıkta gösterilen etiket; listeden geldiği için yetki kararı VERMEZ.
    /// Hangi hesaba yazılacağını <see cref="TenantId"/> belirler.
    /// </summary>
    public string? TenantName { get; set; }

    public List<SelectListItem> UserOptions { get; private set; } = new();

    [BindProperty]
    public SetPasswordViewModel Input { get; set; } = new();

    public SetPasswordModalModel(ITenantProfileAppService tenantProfileAppService)
    {
        _tenantProfileAppService = tenantProfileAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid id, string? name)
    {
        TenantId = id;
        TenantName = name;

        var users = await _tenantProfileAppService.GetTenantUsersAsync(id);

        UserOptions = users
            .Select(user => new SelectListItem(
                $"{user.DisplayName} ({user.UserName}{(user.Email.IsNullOrWhiteSpace() ? string.Empty : " · " + user.Email)})",
                user.Id.ToString()))
            .ToList();

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();

        await _tenantProfileAppService.SetTenantUserPasswordAsync(TenantId, Input.UserId, Input.NewPassword);

        return NoContent();
    }

    public class SetPasswordViewModel
    {
        [Required(ErrorMessage = "Kullanıcı seçin.")]
        [Display(Name = "Kullanıcı")]
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "Yeni şifre girin.")]
        [StringLength(128, MinimumLength = 6, ErrorMessage = "Şifre en az 6 karakter olmalı.")]
        [DataType(DataType.Password)]
        [Display(Name = "Yeni Şifre")]
        public string NewPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Yeni şifreyi tekrar girin.")]
        [DataType(DataType.Password)]
        [Compare(nameof(NewPassword), ErrorMessage = "Şifreler eşleşmiyor.")]
        [Display(Name = "Yeni Şifre (Tekrar)")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
