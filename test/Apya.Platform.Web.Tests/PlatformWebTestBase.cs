using System;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Microsoft.AspNetCore.Mvc.Testing;
using Shouldly;
using Volo.Abp.AspNetCore;
using Volo.Abp.AspNetCore.TestBase;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Security.Claims;
using Volo.Abp.Threading;
using Volo.Abp.Uow;

namespace Apya.Platform;

public abstract class PlatformWebTestBase : AbpWebApplicationFactoryIntegratedTest<Program>
{
    // Soğuk ABP host + ilk Razor derlemesi yük altında HttpClient'ın varsayılan
    // 100 sn sınırını aşıyor; paket TaskCanceledException ile rastgele düşüyordu.
    // İddia hatası değil, zaman aşımı — sınırı gevşetmek yeter.
    protected PlatformWebTestBase()
    {
        Client.Timeout = TimeSpan.FromMinutes(10);
        AsyncHelper.RunSync(KeepSeededOpenCallsOpenAsync);
    }

    /// <summary>
    /// Katalog tohumu çağrıları "Açık" ve SABİT son başvuru tarihiyle kurar (1 Ekim 2026). Canlıda
    /// tarihi geçen çağrıyı otomatik kapanış kapatır; test barındırıcısında o işçi koşmaz ve
    /// takvim o günü geçtiğinde tohumdaki "açık" çağrıların hepsi süresi dolmuş kalır. Katalog ve
    /// kapılar tarihe de baktığı için "açık çağrı" isteyen testler koşulduğu güne bağlanırdı.
    /// Tohumdan gelen açık çağrıların tarihi burada ileri alınır; süresi dolmuş çağrıyı ölçen
    /// testler kendi çağrısını kurar.
    /// </summary>
    private async Task KeepSeededOpenCallsOpenAsync()
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var repo = GetRequiredService<IRepository<GrantCall, Guid>>();

        foreach (var call in await repo.GetListAsync(c => c.Status == GrantCallStatus.Acik && c.Deadline != null))
        {
            if (call.IsPastDeadline(DateTime.Now))
            {
                call.SetSchedule(call.OpenDate, DateTime.Now.Date.AddDays(30));
                await repo.UpdateAsync(call, autoSave: true);
            }
        }

        await uow.CompleteAsync();
    }

    protected virtual async Task<T?> GetResponseAsObjectAsync<T>(string url, HttpStatusCode expectedStatusCode = HttpStatusCode.OK)
    {
        var strResponse = await GetResponseAsStringAsync(url, expectedStatusCode);
        return JsonSerializer.Deserialize<T>(strResponse, new JsonSerializerOptions(JsonSerializerDefaults.Web));
    }

    protected virtual async Task<string> GetResponseAsStringAsync(string url, HttpStatusCode expectedStatusCode = HttpStatusCode.OK)
    {
        var response = await GetResponseAsync(url, expectedStatusCode);
        return await response.Content.ReadAsStringAsync();
    }

    protected virtual async Task<HttpResponseMessage> GetResponseAsync(string url, HttpStatusCode expectedStatusCode = HttpStatusCode.OK)
    {
        var response = await Client.GetAsync(url);
        response.StatusCode.ShouldBe(expectedStatusCode);
        return response;
    }

    /// <summary>
    /// İsteği KURUM kullanıcısı gözüyle atar. Web testleri host bağlamında koşar; principal'a
    /// tenant claim'i verilince ABP'nin çözücüsü kiracıyı kullanıcıdan okur
    /// (<c>?__tenant</c> bu yüzden işe yaramaz — kullanıcı çözücüsü önce gelir).
    /// <para>🔑 İki şart birlikte: <c>PreserveExecutionContext</c> açık OLMALI ve istemci bundan
    /// SONRA kurulmalı — tabanın hazır <see cref="Client"/>'ı AsyncLocal'ı sunucuya taşımaz.
    /// Yönlendirme İZLENMEZ: başarılı POST 302 olarak ölçülür.</para>
    /// </summary>
    protected async Task WithTenantClientAsync(Guid tenantId, Func<HttpClient, Task> action)
    {
        Server.PreserveExecutionContext = true;

        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new Claim(AbpClaimTypes.UserName, "admin"),
            new Claim(AbpClaimTypes.TenantId, tenantId.ToString())
        }, "Test"));

        using (GetRequiredService<ICurrentPrincipalAccessor>().Change(principal))
        {
            using var client = CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
            await action(client);
        }
    }
}
