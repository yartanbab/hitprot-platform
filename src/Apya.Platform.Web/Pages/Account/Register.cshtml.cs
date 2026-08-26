using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Volo.Abp.Account;
using Volo.Abp.Account.Web;
using Volo.Abp.Identity;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>
/// Kayıt formu: kullanıcı adı ve e-posta alanlarının baş/son boşluklarını kırpar.
/// Şifreye DOKUNULMAZ.
/// </summary>
public class ApyaRegisterModel : Volo.Abp.Account.Web.Pages.Account.RegisterModel
{
    public ApyaRegisterModel(
        IAccountAppService accountAppService,
        IAuthenticationSchemeProvider schemeProvider,
        IOptions<AbpAccountOptions> accountOptions,
        IdentityDynamicClaimsPrincipalContributorCache dynamicClaimsPrincipalContributorCache)
        : base(accountAppService, schemeProvider, accountOptions, dynamicClaimsPrincipalContributorCache)
    {
    }

    public override async Task<IActionResult> OnPostAsync()
    {
        if (Input != null)
        {
            Input.UserName = AccountInputTrimmer.Trim(ModelState, "Input.UserName", Input.UserName);
            Input.EmailAddress = AccountInputTrimmer.Trim(ModelState, "Input.EmailAddress", Input.EmailAddress);
        }

        return await base.OnPostAsync();
    }
}
