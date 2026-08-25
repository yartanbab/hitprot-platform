using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Consents.Dtos;
using Apya.Platform.Settings;
using Apya.Platform.Web.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Shouldly;
using Volo.Abp.DependencyInjection;
using Volo.Abp.SettingManagement;
using Volo.Abp.Uow;
using Volo.Abp.Users;
using Xunit;

namespace Apya.Platform.Consents;

/// <summary>
/// "Anladım" ucunun TEK işi onayı kalıcı kılmaktır. Rıza kaydı (analiz/ispat)
/// ikincildir ve düşebilir — örneğin <c>AppConsentRecords</c> tablosu henüz
/// yoksa (migration atlanmış bir yayın). Eskiden çerez o yazımdan SONRA
/// bırakıldığı için böyle bir hata yanıtı 500'e çeviriyor, <c>Set-Cookie</c>
/// düşüyor ve şerit her sayfada geri geliyordu. Burası o sırayı sabitler.
/// </summary>
public class ConsentController_Tests
{
    private readonly IConsentAppService _consentAppService = Substitute.For<IConsentAppService>();
    private readonly ISettingManager _settingManager = Substitute.For<ISettingManager>();
    private readonly DefaultHttpContext _http = new();

    private ConsentController BuildController(bool authenticated)
    {
        var currentUser = Substitute.For<ICurrentUser>();
        currentUser.IsAuthenticated.Returns(authenticated);
        currentUser.Id.Returns(authenticated ? Guid.NewGuid() : null);

        // Begin(requiresNew:, isTransactional:) bir UZANTI metodudur — altında
        // çağırdığı arayüz üyesi kurulur.
        var uowManager = Substitute.For<IUnitOfWorkManager>();
        uowManager.Begin(Arg.Any<AbpUnitOfWorkOptions>(), Arg.Any<bool>())
                  .Returns(_ => Substitute.For<IUnitOfWork>());

        var lazy = Substitute.For<IAbpLazyServiceProvider>();
        lazy.LazyGetRequiredService<ICurrentUser>().Returns(currentUser);

        return new ConsentController(_consentAppService, _settingManager, uowManager)
        {
            LazyServiceProvider = lazy,
            ControllerContext = new ControllerContext(
                new ActionContext(_http, new RouteData(), new ControllerActionDescriptor(), new ModelStateDictionary()))
        };
    }

    /// <summary>Yanıtta bırakılan onay çerezinin değeri (yoksa null).</summary>
    private string? AckCookie()
    {
        return _http.Response.Headers.SetCookie
            .FirstOrDefault(h => h != null && h.StartsWith(ConsentConsts.CookieNoticeAckCookieName + "="));
    }

    [Fact]
    public async Task Onay_cerezi_birakilir()
    {
        var result = await BuildController(authenticated: false).AckCookieNoticeAsync();

        result.ShouldBeOfType<NoContentResult>();
        AckCookie().ShouldNotBeNull();
    }

    /// <summary>
    /// Asıl regresyon: rıza kaydı patlasa da kullanıcı onayı ayakta kalmalı.
    /// </summary>
    [Fact]
    public async Task Riza_kaydi_patlasa_da_onay_cerezi_birakilir()
    {
        _consentAppService.RecordAsync(Arg.Any<RecordConsentInput>())
                          .ThrowsAsync(new Exception("AppConsentRecords tablosu yok"));

        var result = await BuildController(authenticated: false).AckCookieNoticeAsync();

        result.ShouldBeOfType<NoContentResult>();
        AckCookie().ShouldNotBeNull();
    }

    /// <summary>Kullanıcı ayarı yazılamasa da çerez bırakılır (iki dayanak bağımsız).</summary>
    [Fact]
    public async Task Kullanici_ayari_patlasa_da_onay_cerezi_birakilir()
    {
        _settingManager.SetAsync(Arg.Any<string>(), Arg.Any<string?>(), Arg.Any<string>(), Arg.Any<string?>(), Arg.Any<bool>())
                       .ThrowsAsync(new Exception("ayar yazılamadı"));

        var result = await BuildController(authenticated: true).AckCookieNoticeAsync();

        result.ShouldBeOfType<NoContentResult>();
        AckCookie().ShouldNotBeNull();
    }

    /// <summary>Girişli kullanıcıda onay, çerezin yanında kalıcı ayara da işlenir.</summary>
    [Fact]
    public async Task Girisli_kullanicida_onay_ayara_yazilir()
    {
        await BuildController(authenticated: true).AckCookieNoticeAsync();

        await _settingManager.Received(1).SetAsync(
            PlatformSettings.CookieNotice.Acknowledged, "true",
            Arg.Any<string>(), Arg.Any<string?>(), Arg.Any<bool>());
    }

    /// <summary>Oturumsuz ziyaretçide yazacak kullanıcı yoktur; ayar hiç denenmez.</summary>
    [Fact]
    public async Task Oturumsuz_istekte_ayar_yazilmaz()
    {
        await BuildController(authenticated: false).AckCookieNoticeAsync();

        await _settingManager.DidNotReceive().SetAsync(
            Arg.Any<string>(), Arg.Any<string?>(), Arg.Any<string>(), Arg.Any<string?>(), Arg.Any<bool>());
    }
}
