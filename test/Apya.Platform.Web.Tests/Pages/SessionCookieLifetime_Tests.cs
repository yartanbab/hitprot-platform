using System;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Masaüstüne kurulan uygulama (PWA) sürekli açık kalsın diye giriş çerezi 90 gün yaşar ve her
/// kullanımda yenilenir. Varsayılan 14 gündü; iki haftadan uzun açılmayan uygulama yeniden giriş
/// istiyordu.
/// </summary>
public class SessionCookieLifetime_Tests : PlatformWebTestBase
{
    [Fact]
    public void Giris_cerezi_90_gun_yasar_ve_kullanildikca_yenilenir()
    {
        var options = GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>()
            .Get(IdentityConstants.ApplicationScheme);

        options.ExpireTimeSpan.ShouldBe(TimeSpan.FromDays(90));
        options.SlidingExpiration.ShouldBeTrue();
    }
}
