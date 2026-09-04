using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Calendars;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Calendars;

/// <summary>
/// Hesap bağlama akışının kapısı — OAuth istemcisi TANIMLI DEĞİLKEN.
/// <para>
/// Yetkilendirme adresini sunucu üretir; istemci sabit adres yazmaz. İstemci
/// <c>/Calendars/SimulateAuth</c>'u sabit yazdığı sürece gerçek OAuth hiç
/// çalışmıyordu — bu testler adresi ÜRETENİN sunucu olduğunu bağlar.
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class CalendarOAuthGate_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ICalendarAppService _calendar;
    private readonly IRepository<ExternalCalendarAccount, Guid> _accountRepository;

    public CalendarOAuthGate_Tests()
    {
        _calendar          = GetRequiredService<ICalendarAppService>();
        _accountRepository = GetRequiredService<IRepository<ExternalCalendarAccount, Guid>>();
    }

    [Theory]
    [InlineData(CalendarProviderType.Google)]
    [InlineData(CalendarProviderType.Outlook)]
    public async Task Istemci_tanimsizken_simulasyon_sayfasina_duser(CalendarProviderType provider)
    {
        var url = await _calendar.GetAuthUrlAsync(provider);

        url.ShouldBe($"/Calendars/SimulateAuth?provider={(int)provider}");
    }

    [Fact]
    public async Task Istemci_tanimsizken_token_istemciden_alinabilir()
    {
        // Simülasyon yolu: geliştirme ortamında akış ekranda denenebilmeli.
        await _calendar.ConnectAccountAsync(new ConnectCalendarInput
        {
            Provider      = CalendarProviderType.Google,
            ExternalEmail = "sim@apya.co",
            AccessToken   = "sim_at",
            RefreshToken  = "sim_rt"
        });

        // Geri okuma AYRI bir UoW'da: AppService'in UoW'u kapandığı için repository
        // aynı bağlamda okunamaz (ObjectDisposedException).
        var account = await WithUnitOfWorkAsync(() =>
            _accountRepository.FirstOrDefaultAsync(x => x.ExternalEmail == "sim@apya.co"));

        account.ShouldNotBeNull();
        // Token ŞİFRELİ saklanır — düz metin geri okunmamalı (SEC-010).
        account!.AccessToken.ShouldNotBe("sim_at");
    }
}

/// <summary>
/// Aynı kapı — OAuth istemcisi TANIMLIYKEN. Bu ortamda simülasyon yolu kapanır:
/// aksi hâlde takvim izni olan herkes sahte token'lı hesap üretebilir, hesap bağlı
/// görünür ama her okuma sessizce hataya düşer.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class CalendarOAuthConfiguredGate_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ICalendarAppService _calendar;

    public CalendarOAuthConfiguredGate_Tests()
    {
        _calendar = GetRequiredService<ICalendarAppService>();
    }

    protected override void SetAbpApplicationCreationOptions(AbpApplicationCreationOptions options)
    {
        base.SetAbpApplicationCreationOptions(options);

        // Veritabanı kod içinden (SQLite in-memory) yapılandırıldığı için
        // yapılandırmanın tamamını değiştirmek güvenli.
        options.Services.ReplaceConfiguration(new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["App:SelfUrl"]                     = "https://localhost:44386",
                ["Calendars:Google:ClientId"]       = "google-client",
                ["Calendars:Google:ClientSecret"]   = "google-secret",
                ["Calendars:Outlook:ClientId"]      = "ms-client",
                ["Calendars:Outlook:ClientSecret"]  = "ms-secret"
            })
            .Build());
    }

    [Fact]
    public async Task Google_icin_gercek_yetkilendirme_adresi_uretilir()
    {
        var url = await _calendar.GetAuthUrlAsync(CalendarProviderType.Google);

        url.ShouldStartWith("https://accounts.google.com/o/oauth2/v2/auth");
        url.ShouldContain("client_id=google-client");
        url.ShouldContain("access_type=offline");
        // CSRF state'i sağlayıcı numarasıyla başlar ("{provider}.{token}").
        url.ShouldContain($"state={(int)CalendarProviderType.Google}.");
        url.ShouldContain(Uri.EscapeDataString("https://localhost:44386/Calendars/Callback"));
    }

    [Fact]
    public async Task Outlook_icin_gercek_yetkilendirme_adresi_uretilir()
    {
        var url = await _calendar.GetAuthUrlAsync(CalendarProviderType.Outlook);

        url.ShouldStartWith("https://login.microsoftonline.com/common/oauth2/v2.0/authorize");
        url.ShouldContain("client_id=ms-client");
        url.ShouldContain(Uri.EscapeDataString("offline_access"));
    }

    [Fact]
    public async Task Yapilandirilmis_saglayicida_token_istemciden_ALINMAZ()
    {
        var connect = () => _calendar.ConnectAccountAsync(new ConnectCalendarInput
        {
            Provider      = CalendarProviderType.Google,
            ExternalEmail = "sahte@apya.co",
            AccessToken   = "sahte_at",
            RefreshToken  = "sahte_rt"
        });

        await connect.ShouldThrowAsync<BusinessException>();
    }

    [Fact]
    public async Task Gecersiz_state_ile_kod_takasi_reddedilir()
    {
        // SEC-012: state auth başlangıcında saklanan tek kullanımlık değerle eşleşmeli.
        var exchange = () => _calendar.ExchangeCodeAndConnectAsync(
            CalendarProviderType.Google, "kod", "https://localhost:44386/Calendars/Callback", "uydurma-token");

        await exchange.ShouldThrowAsync<BusinessException>();
    }
}
