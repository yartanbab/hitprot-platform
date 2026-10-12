using System;
using System.Linq;
using System.Reflection;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Shouldly;
using Xunit;

namespace Apya.Platform.Documents;

/// <summary>
/// Belgeler modülünde sınıf düzeyi Documents.Default yalnız GÖRÜNTÜLEME iznidir. Kiracının tamamını
/// etkileyen iki yazma ucu ona düşüyordu: öneriyi kalıcı olarak yok sayma ve ilk kurulumu
/// "tamamlandı" işaretleme (ürün kararı, 2026-10-12: yazma ucu yazma izni ister).
///
/// <para>Entegrasyon testleri her izne "evet" dediği için sözleşme öznitelik üzerinden kilitlenir.</para>
/// </summary>
public class DocumentWriteAuthorization_Tests
{
    [Theory]
    [InlineData(typeof(DocumentSuggestionAppService), nameof(DocumentSuggestionAppService.DismissAsync), PlatformPermissions.Documents.ManageMeta)]
    [InlineData(typeof(DocumentSuggestionAppService), nameof(DocumentSuggestionAppService.ApplyAsync), PlatformPermissions.Documents.ManageMeta)]
    [InlineData(typeof(DocumentSetupAppService), nameof(DocumentSetupAppService.CompleteAsync), PlatformPermissions.Documents.Create)]
    [InlineData(typeof(DocumentSetupAppService), nameof(DocumentSetupAppService.ApplyAsync), PlatformPermissions.Documents.Create)]
    public void Yazma_ucu_metot_duzeyi_izin_ister(Type service, string method, string policy)
    {
        var info = service.GetMethod(method, BindingFlags.Public | BindingFlags.Instance);
        info.ShouldNotBeNull($"{method} bulunamadı");

        info.GetCustomAttributes<AuthorizeAttribute>(inherit: true)
            .Select(a => a.Policy)
            .ShouldContain(policy, $"{service.Name}.{method} [Authorize({policy})] taşımıyor");
    }
}
