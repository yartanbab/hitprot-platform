using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.DataAnnotations;
using Microsoft.Extensions.Localization;

namespace Apya.Platform.Web.Validation;

/// <summary>
/// DataAnnotations doğrulama mesajlarını Türkçeleştirir.
///
/// ASP.NET Core, <see cref="ValidationAttribute.ErrorMessage"/> AÇIKÇA verilmemiş
/// attribute'ları hiç yerelleştirmez: <c>ValidationAttributeAdapter.GetErrorMessage</c>
/// localizer'ı yalnız ErrorMessage doluyken kullanır, aksi hâlde .NET'in gömülü
/// İngilizce metnine (<c>FormatErrorMessage</c>) düşer. Repoda 259 doğrulama
/// attribute'u var ve neredeyse hiçbirinde ErrorMessage yok — "The Name field is
/// required." metinlerinin kaynağı buydu.
///
/// Burada ErrorMessage'a ABP'nin <c>AbpValidationResource</c> anahtarı yazılır;
/// böylece localizer yolu devreye girer ve mesaj hem sunucu ModelState'inde hem de
/// istemciye basılan <c>data-val-*</c> özniteliklerinde Türkçe üretilir.
/// Anahtarların Türkçe karşılıkları ABP'den gelir, tr.json'da ezilebilir
/// (PlatformResource, AbpValidationResource'u temel alır → kendi metni öncelikli).
/// </summary>
public class PlatformValidationAttributeAdapterProvider : IValidationAttributeAdapterProvider
{
    private readonly ValidationAttributeAdapterProvider _inner = new();

    public IAttributeAdapter? GetAttributeAdapter(ValidationAttribute attribute, IStringLocalizer? stringLocalizer)
    {
        ApplyLocalizationKey(attribute);
        return _inner.GetAttributeAdapter(attribute, stringLocalizer);
    }

    /// <summary>
    /// Attribute örneği ModelMetadata tarafından önbelleklenir; buraya her doğrulamada
    /// AYNI sabit metin yazıldığı için tekrar eden atama etkisizdir (string ataması
    /// atomik, yarış durumunda da sonuç aynı).
    /// </summary>
    private static void ApplyLocalizationKey(ValidationAttribute attribute)
    {
        if (!string.IsNullOrEmpty(attribute.ErrorMessage) ||
            !string.IsNullOrEmpty(attribute.ErrorMessageResourceName) ||
            attribute.ErrorMessageResourceType != null)
        {
            // Elle yazılmış mesaj / kaynak dosyası varsa dokunma.
            return;
        }

        var key = ResolveKey(attribute);
        if (key != null)
        {
            attribute.ErrorMessage = key;
        }
    }

    /// <summary>
    /// Anahtarlar AbpValidationResource'taki metinlerin BİREBİR aynısı olmalı;
    /// yer tutucu sırası da ilgili adapter'ın GetErrorMessage çağrısıyla hizalıdır
    /// (ör. StringLength: {0}=alan, {1}=maksimum, {2}=minimum).
    /// </summary>
    private static string? ResolveKey(ValidationAttribute attribute)
    {
        return attribute switch
        {
            RequiredAttribute => "The {0} field is required.",

            StringLengthAttribute { MinimumLength: > 0 }
                => "The field {0} must be a string with a minimum length of {2} and a maximum length of {1}.",
            StringLengthAttribute
                => "The field {0} must be a string with a maximum length of {1}.",

            MaxLengthAttribute => "The field {0} must be a string or array type with a maximum length of '{1}'.",
            MinLengthAttribute => "The field {0} must be a string or array type with a minimum length of '{1}'.",

            RangeAttribute => "The field {0} must be between {1} and {2}.",
            RegularExpressionAttribute => "The field {0} must match the regular expression '{1}'.",
            CompareAttribute => "'{0}' and '{1}' do not match.",
            FileExtensionsAttribute => "The {0} field only accepts files with the following extensions: {1}",

            EmailAddressAttribute => "The {0} field is not a valid e-mail address.",
            UrlAttribute => "The {0} field is not a valid fully-qualified http, https, or ftp URL.",
            PhoneAttribute => "The {0} field is not a valid phone number.",
            CreditCardAttribute => "The {0} field is not a valid credit card number.",

            _ => null
        };
    }
}
