using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Security.Claims;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Form yanıtındaki yorumu yalnız SAHİBİ ya da form düzenleme yetkisi olan siler (ürün kararı,
/// 2026-10-12). Eskiden yanıtları görebilen herkes başkasının yorumunu silebiliyordu.
///
/// <para>Barındırıcı yalnız form düzenleme iznini (DynamicAssets.Edit) reddedecek şekilde kurulur;
/// böylece "sahibi değil ve düzenleme yetkisi yok" durumu gerçek yoldan ölçülür.</para>
/// </summary>
public class ResponseCommentDeletePermission_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var denyEdit = new DenyPermissionsAuthorizationService(PlatformPermissions.DynamicAssets.Edit);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(denyEdit));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(denyEdit));
    }

    private IDisposable As(Guid userId) => GetRequiredService<ICurrentPrincipalAccessor>().Change(
        new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, userId.ToString()),
            new Claim(AbpClaimTypes.UserName, "yorumcu-" + userId.ToString("N")[..6])
        }, "Test")));

    private async Task<Guid> ResponseAsync()
    {
        var responseId = Guid.NewGuid();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var document = new AppDocument(Guid.NewGuid(), "Yorum formu", "yorum-" + Guid.NewGuid().ToString("N")[..8]);
            await GetRequiredService<IRepository<AppDocument, Guid>>().InsertAsync(document, autoSave: true);
            await GetRequiredService<IRepository<AppResponse, Guid>>().InsertAsync(
                new AppResponse(responseId, document.Id, "{}"), autoSave: true);
            await uow.CompleteAsync();
        }
        return responseId;
    }

    [Fact]
    public async Task Baskasinin_yorumunu_duzenleme_yetkisi_olmayan_silemez_sahibi_siler()
    {
        var service = GetRequiredService<IResponseManagementAppService>();
        var responseId = await ResponseAsync();
        var owner = Guid.NewGuid();
        var other = Guid.NewGuid();

        Guid commentId;
        using (As(owner))
        {
            commentId = (await service.AddCommentAsync(responseId, new AddResponseCommentDto { Text = "Sahibinin yorumu" })).Id;
        }

        using (As(other))
        {
            await Should.ThrowAsync<AbpAuthorizationException>(() => service.DeleteCommentAsync(responseId, commentId));
            (await service.GetAsync(responseId)).Comments.Select(c => c.Id).ShouldContain(commentId);
        }

        using (As(owner))
        {
            await service.DeleteCommentAsync(responseId, commentId);
            (await service.GetAsync(responseId)).Comments.ShouldBeEmpty();
        }
    }

    /// <summary>
    /// Varlık bağlantısı servisi hiçbir izin istemiyor ve bağlanan kayıtları doğrulamıyordu; arayüzü
    /// de yok. Otomatik API ucu kapalı (ürün kararı, 2026-10-12).
    /// </summary>
    [Fact]
    public void Varlik_baglantisi_servisinin_API_ucu_yok()
    {
        var routes = GetRequiredService<EndpointDataSource>().Endpoints
            .OfType<RouteEndpoint>()
            .Select(e => e.RoutePattern.RawText ?? string.Empty)
            .ToList();

        routes.ShouldContain(r => r.StartsWith("api/app/task"), "uç tablosu okunamadı");
        routes.ShouldNotContain(r => r.Contains("entity-link", StringComparison.OrdinalIgnoreCase));
    }
}
