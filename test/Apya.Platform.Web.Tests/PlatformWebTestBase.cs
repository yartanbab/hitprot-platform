using System;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Shouldly;
using Volo.Abp.AspNetCore;
using Volo.Abp.AspNetCore.TestBase;
using Volo.Abp.Security.Claims;

namespace Apya.Platform;

public abstract class PlatformWebTestBase : AbpWebApplicationFactoryIntegratedTest<Program>
{
    // Soğuk ABP host + ilk Razor derlemesi yük altında HttpClient'ın varsayılan
    // 100 sn sınırını aşıyor; paket TaskCanceledException ile rastgele düşüyordu.
    // İddia hatası değil, zaman aşımı — sınırı gevşetmek yeter.
    protected PlatformWebTestBase()
    {
        Client.Timeout = TimeSpan.FromMinutes(10);
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
