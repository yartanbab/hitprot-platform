using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Apya.Platform.Localization;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.Extensions.Localization;

namespace Apya.Platform.Web.Validation;

/// <summary>
/// Alan adlarını BAĞLAMA ÖZEL Türkçeleştirir — doğrulama mesajlarının "hedef odaklı"
/// olmasını sağlayan parça.
///
/// ABP'nin <c>AbpModelMetadataProvider</c>'ı zaten <c>DisplayName:{AlanAdı}</c>
/// anahtarını çözüyor; ama tek katmanlı: 21 ayrı DTO'daki <c>Name</c> alanının hepsi
/// aynı "Ad" metnini alır. Doğrulama özetinde üst üste birkaç hata listelendiğinde
/// hangi kutudan bahsedildiği kaybolur.
///
/// Bu sağlayıcı yalnız <c>DisplayName:{TipAdı}.{AlanAdı}</c> anahtarı TANIMLIYSA
/// devreye girer (CreateProjectDto.Name → "Proje adı"); tanımlı değilse ABP'nin genel
/// karşılığına dokunmaz. <c>[Display]</c>/<c>[DisplayName]</c> ile açıkça ad verilmiş
/// property'ler de dışarıda bırakılır.
/// </summary>
public class PlatformDisplayMetadataProvider : IDisplayMetadataProvider
{
    private readonly IStringLocalizerFactory _localizerFactory;

    public PlatformDisplayMetadataProvider(IStringLocalizerFactory localizerFactory)
    {
        _localizerFactory = localizerFactory;
    }

    public void CreateDisplayMetadata(DisplayMetadataProviderContext context)
    {
        if (context.Key.MetadataKind != ModelMetadataKind.Property)
        {
            return;
        }

        var propertyName = context.Key.Name;
        var containerName = context.Key.ContainerType?.Name;

        if (string.IsNullOrEmpty(propertyName) || containerName == null)
        {
            return;
        }

        // Koddaki açık ad her zaman öncelikli.
        if (context.Attributes.Any(a => a is DisplayAttribute or DisplayNameAttribute))
        {
            return;
        }

        var key = $"DisplayName:{containerName}.{propertyName}";
        if (_localizerFactory.Create(typeof(PlatformResource))[key].ResourceNotFound)
        {
            return;
        }

        // Func olarak bağlanır: kültür istek başına çözülsün (localizer CurrentUICulture'a bakar).
        context.DisplayMetadata.DisplayName = () => _localizerFactory.Create(typeof(PlatformResource))[key];
    }
}
