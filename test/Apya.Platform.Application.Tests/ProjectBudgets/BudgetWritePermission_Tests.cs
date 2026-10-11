using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using NSubstitute;
using Shouldly;
using Volo.Abp.Authorization;
using Xunit;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// FIN-15 · Bütçe yazmak "Bütçe Düzenleme" (ManageBudget) YA DA proje düzenleme izniyle mümkündür.
/// Finans ekibine proje düzenleme vermeden bütçe yazdırılabilir; proje düzenleme izni olan hiçbir
/// rol de yetki kaybetmez.
/// </summary>
public class BudgetWritePermission_Tests
{
    private static IAuthorizationService Granting(params string[] granted)
    {
        // ABP'nin IsGrantedAsync uzantısı AuthorizeAsync(principal, null, policyName) çağırır.
        var authorization = Substitute.For<IAbpAuthorizationService>();
        authorization
            .AuthorizeAsync(Arg.Any<ClaimsPrincipal>(), Arg.Any<object?>(), Arg.Any<string>())
            .Returns(call => Task.FromResult(granted.Contains(call.ArgAt<string>(2))
                ? AuthorizationResult.Success()
                : AuthorizationResult.Failed()));
        return authorization;
    }

    [Fact]
    public async Task Yalniz_butce_duzenleme_izni_yeterlidir()
    {
        await Should.NotThrowAsync(
            () => BudgetWritePermission.CheckAsync(Granting(PlatformPermissions.Projects.ManageBudget)));
    }

    /// <summary>Geriye uyum: bugüne kadar bütçe yazabilen her rol yazmaya devam eder.</summary>
    [Fact]
    public async Task Proje_duzenleme_izni_yazma_hakkini_korur()
    {
        await Should.NotThrowAsync(
            () => BudgetWritePermission.CheckAsync(Granting(PlatformPermissions.Projects.Edit)));
    }

    [Fact]
    public async Task Ikisi_de_yoksa_reddedilir()
    {
        // Bütçeyi GÖRME izni yazdırmaz.
        await Should.ThrowAsync<AbpAuthorizationException>(
            () => BudgetWritePermission.CheckAsync(Granting(PlatformPermissions.Projects.ViewBudget)));
    }

    /// <summary>
    /// Kapı öznitelik değil metodun ilk satırı olduğu için unutulması derleme hatası vermez.
    /// İki servisteki her yazma metodu kapıyı çağırmalı; yalnız proje düzenleme isteyen eski
    /// öznitelik de geri gelmemeli.
    /// </summary>
    [Theory]
    [InlineData("ProjectBudgetAppService.cs", 13)]
    [InlineData("ProjectFxAppService.cs", 2)]
    public void Yazma_metotlari_ortak_kapiyi_kullanir(string file, int expectedGuards)
    {
        var source = File.ReadAllText(Path.Combine(
            RepoRoot(), "src", "Apya.Platform.Application", "ProjectBudgets", file));

        Regex.Matches(source, @"await BudgetWritePermission\.CheckAsync\(AuthorizationService\);").Count
            .ShouldBe(expectedGuards);
        source.ShouldNotContain("[Authorize(PlatformPermissions.Projects.Edit)]");
    }

    private static string RepoRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            if (Directory.Exists(Path.Combine(dir.FullName, "src", "Apya.Platform.Domain")))
            {
                return dir.FullName;
            }

            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException("Depo kökü bulunamadı.");
    }
}
