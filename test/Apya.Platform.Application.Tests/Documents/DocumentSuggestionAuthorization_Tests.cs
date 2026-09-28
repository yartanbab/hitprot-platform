using System.Linq;
using System.Reflection;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Shouldly;
using Xunit;

namespace Apya.Platform.Documents;

/// <summary>
/// Öneri uygulama ucunun metot düzeyi izin sözleşmesi (2026-09-28 UX denetimi, Faz 1 devamı).
/// Sınıf düzeyindeki Documents.Default yalnız OKUMA iznidir; ApplyAsync ona düştüğünde künye
/// yetkisi (ManageMeta) olmayan kullanıcı öneri şeridinden belgenin türünü, iş adımını,
/// dönemini ve klasörünü değiştirebiliyordu.
///
/// <para>Entegrasyon testleri AddAlwaysAllowAuthorization kullandığı için izin reddi orada
/// ölçülemez; sözleşme öznitelik üzerinden kilitlenir (TaskMutationAuthorization_Tests emsali).</para>
/// </summary>
public class DocumentSuggestionAuthorization_Tests
{
    [Fact]
    public void Oneri_uygulama_kunye_yazma_izni_ister()
    {
        var info = typeof(DocumentSuggestionAppService).GetMethod(
            nameof(DocumentSuggestionAppService.ApplyAsync), BindingFlags.Public | BindingFlags.Instance);
        info.ShouldNotBeNull();

        var policies = info.GetCustomAttributes<AuthorizeAttribute>(inherit: true)
            .Select(a => a.Policy)
            .ToList();

        // DocumentFileAppService.UpdateMetaAsync ile aynı izin olmalı — iki yol aynı alanları yazar.
        var metaPolicies = typeof(DocumentFileAppService)
            .GetMethod(nameof(DocumentFileAppService.UpdateMetaAsync), BindingFlags.Public | BindingFlags.Instance)!
            .GetCustomAttributes<AuthorizeAttribute>(inherit: true)
            .Select(a => a.Policy)
            .ToList();

        metaPolicies.ShouldContain(PlatformPermissions.Documents.ManageMeta);
        policies.ShouldContain(PlatformPermissions.Documents.ManageMeta,
            "ApplyAsync [Authorize(Documents.ManageMeta)] taşımıyor — sınıf düzeyi Documents.Default (okuma) yeterli kalır");
    }
}
