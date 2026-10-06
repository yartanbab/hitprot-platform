using System;
using System.Linq;
using System.Reflection;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages.Finance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// FIN-16 · Finans sayfalarının sayfa düzeyi yetki sözleşmesi.
///
/// <para>Yedi finans penceresinin hiçbirinde <c>[Authorize]</c> yoktu; koruma yalnız
/// çağırdıkları uygulama servisindeydi. Bugün yeterliydi, ama tek katmandı: bir pencereye
/// servis çağırmayan bir GET eklendiği gün sayfa korumasız açılırdı.</para>
///
/// <para>Entegrasyon testleri <c>AddAlwaysAllowAuthorization</c> altında koştuğu için izin
/// reddi orada ölçülemez; sözleşme öznitelik üzerinden kilitlenir (bkz.
/// <c>TaskMutationAuthorization_Tests</c>).</para>
/// </summary>
public class FinancePageAuthorizationContract_Tests
{
    private static Type[] FinancePageModels() =>
        typeof(IndexModel).Assembly.GetTypes()
            .Where(t => t.Namespace == typeof(IndexModel).Namespace
                        && !t.IsAbstract
                        && typeof(PageModel).IsAssignableFrom(t))
            .ToArray();

    /// <summary>
    /// Bu klasöre eklenen HER sayfa modeli yetki taşımalı — yeni bir pencere eklenip
    /// öznitelik unutulursa burada kırmızı verir.
    /// </summary>
    [Fact]
    public void Finans_klasorundeki_her_sayfa_yetki_tasir()
    {
        var models = FinancePageModels();
        models.Length.ShouldBeGreaterThanOrEqualTo(8, "klasör taranamadı — ad alanı değişmiş olabilir");

        var unprotected = models
            .Where(t => !t.GetCustomAttributes<AuthorizeAttribute>(inherit: true).Any())
            .Select(t => t.Name)
            .ToArray();

        unprotected.ShouldBeEmpty("[Authorize] taşımayan finans sayfası: " + string.Join(", ", unprotected));
    }

    /// <summary>
    /// Pencerelerin izni, açılışta çağırdıkları servisin ZATEN istediği izinle aynıdır
    /// (<c>ProjectBudgetAppService</c> / <c>ProjectFxAppService</c> sınıf düzeyi).
    /// 🔴 Daha sıkı bir izin (ör. Projects.Edit) BİLEREK konmadı: sayfa izni servis izninden
    /// sıkı olursa bugün pencereyi açabilen kullanıcı kilitlenir.
    /// </summary>
    [Theory]
    [InlineData(typeof(BudgetLineModalModel))]
    [InlineData(typeof(CollectionModalModel))]
    [InlineData(typeof(ContextWizardModalModel))]
    [InlineData(typeof(DeductionModalModel))]
    [InlineData(typeof(FxPolicyModalModel))]
    [InlineData(typeof(RevisionModalModel))]
    [InlineData(typeof(TrancheModalModel))]
    public void Finans_penceresi_butce_gorme_izni_ister(Type model)
    {
        var policies = model.GetCustomAttributes<AuthorizeAttribute>(inherit: true)
            .Select(a => a.Policy)
            .ToArray();

        policies.ShouldBe(new[] { PlatformPermissions.Projects.ViewBudget },
            $"{model.Name}: sayfa izni servisin okuma yolunun istediği izinle aynı olmalı");
    }
}
