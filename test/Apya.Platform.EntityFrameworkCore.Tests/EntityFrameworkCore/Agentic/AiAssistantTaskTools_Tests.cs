using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Agentic;
using Apya.Platform.Agentic.Plugins;
using Apya.Platform.Permissions;
using Apya.Platform.Tasks;
using Microsoft.AspNetCore.Authorization;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Volo.Abp.Timing;
using Volo.Abp.Users;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Agentic;

/// <summary>
/// SÖZLEŞME: AI asistanının görev araçları, çağıranın görev listesinde GÖREBİLDİĞİNDEN fazlasını
/// vermez.
///
/// <para>Araçlar (<see cref="TasksPlugin"/>) görevi doğrudan depodan okur; uygulama servisinin
/// kapıları orada kendiliğinden çalışmaz. Süzgeç yokken <c>/api/app/ai-assistant/run-plan</c>'ı
/// çağırabilen herkes kiracının bütün görev başlıklarını — gizli olanlar dahil — alıyor,
/// başlıklar dış AI sağlayıcısına da gidiyordu.</para>
///
/// <para>Dil modeli çağrılmaz: araçlar doğrudan koşulur (modelin aracı çağırıp çağırmayacağı
/// sağlayıcıya bağlıdır, sözleşme aracın NE döndürdüğüdür).</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class AiAssistantTaskTools_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentPrincipalAccessor _principalAccessor;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public AiAssistantTaskTools_Tests()
    {
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _principalAccessor = GetRequiredService<ICurrentPrincipalAccessor>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
    }

    /// <summary>Servisin eklentiyi kurduğu biçimin aynısı: kendi kullanıcısı ve yetki servisiyle.</summary>
    private TasksPlugin Plugin() => new(
        _taskRepository,
        _clock,
        GetRequiredService<ICurrentUser>(),
        GetRequiredService<IAuthorizationService>());

    // Araç sorguyu kendi içinde yürütür; serviste bu, isteğin iş birimi içinde olur.
    private Task<string> OpenTasksAsync() => WithUnitOfWorkAsync(() => Plugin().GetOpenTasksAsync());

    private Task<string> OverdueTasksAsync() => WithUnitOfWorkAsync(() => Plugin().GetOverdueTasksAsync());

    /// <summary>Gizli görevi hiçbir koşulda göremeyen çağıran: bürünme oturumu.</summary>
    private IDisposable AsOutsider() => _principalAccessor.Change(
        new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new(AbpClaimTypes.UserName, "gizliyi-goremeyen"),
            new(AbpClaimTypes.ImpersonatorUserId, Guid.NewGuid().ToString())
        }, "Test")));

    private async Task<string> NewOverdueTaskAsync(bool isPrivate)
    {
        var title = (isPrivate ? "gizli-" : "acik-") + Guid.NewGuid().ToString("N");
        var task = new TaskItem(
            Guid.NewGuid(), title,
            dueDate: _clock.Now.AddDays(-10),
            isPrivate: isPrivate,
            tenantId: _currentTenant.Id, now: _clock.Now.AddDays(-30));

        await _taskRepository.InsertAsync(task, autoSave: true);
        return title;
    }

    [Fact]
    public async Task Acik_gorevler_araci_gizli_gorevi_goremeyene_vermez()
    {
        var open = await NewOverdueTaskAsync(isPrivate: false);
        var secret = await NewOverdueTaskAsync(isPrivate: true);

        // Karşı yön: görebilen (oluşturan / ekip yöneticisi) ikisini de alır.
        var full = await OpenTasksAsync();
        full.ShouldContain(open);
        full.ShouldContain(secret);

        using (AsOutsider())
        {
            var result = await OpenTasksAsync();

            result.ShouldContain(open);
            result.ShouldNotContain(secret);
        }
    }

    [Fact]
    public async Task Gecikmis_gorevler_araci_gizli_gorevi_goremeyene_vermez()
    {
        var open = await NewOverdueTaskAsync(isPrivate: false);
        var secret = await NewOverdueTaskAsync(isPrivate: true);

        (await OverdueTasksAsync()).ShouldContain(secret);

        using (AsOutsider())
        {
            var result = await OverdueTasksAsync();

            result.ShouldContain(open);
            result.ShouldNotContain(secret);
        }
    }

    /// <summary>
    /// Form yanıtlarının AI özeti, yanıt ekranıyla aynı izni ister. Barındırıcı her izne "evet"
    /// dediği için kapı öznitelikten ölçülür (depodaki <c>TaskMutationAuthorization_Tests</c> deseni).
    /// </summary>
    [Fact]
    public void Form_yaniti_ozeti_yanitlari_gorme_iznini_ister()
    {
        var method = typeof(AiAssistantAppService).GetMethod(nameof(AiAssistantAppService.AnalyzeResponsesAsync))!;

        method.GetCustomAttributes<AuthorizeAttribute>()
            .Select(a => a.Policy)
            .ShouldContain(PlatformPermissions.DynamicAssets.ViewResponses);

        // Sınıf izni yerinde: ikisi BİRLİKTE aranır.
        typeof(AiAssistantAppService).GetCustomAttributes<AuthorizeAttribute>()
            .Select(a => a.Policy)
            .ShouldContain(PlatformPermissions.Projects.UseAiFeatures);
    }
}
