using System;
using System.Collections.Generic;
using System.Text;
using Apya.Platform.Localization;
using Volo.Abp.Application.Services;

namespace Apya.Platform;

/* Inherit your application services from this class.
 *
 * 🔴 Bu bir üslup tercihi DEĞİL. ABP'de ApplicationService.L, LocalizationResource
 * ayarlanmadıysa içi BOŞ olan Volo.Abp.Localization.DefaultResource'u kullanır;
 * AbpLocalizationOptions.DefaultResourceType'a BAKMAZ. Yani bu sınıftan türemeyen bir
 * serviste L["Anahtar"] çeviriyi değil ANAHTARIN KENDİSİNİ döndürür — derleme yeşil,
 * hata yok, kullanıcı "Grants:Stage:Odeme" görür.
 *
 * L kullanan her uygulama servisi bu sınıftan türemeli (ya da kaynağı kendisi
 * ayarlamalı). Sözleşmeyi AppServiceLocalizationContract_Tests kilitliyor.
 */
public abstract class PlatformAppService : ApplicationService
{
    protected PlatformAppService()
    {
        LocalizationResource = typeof(PlatformResource);
    }
}
