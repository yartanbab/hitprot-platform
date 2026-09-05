using Volo.Abp.Account.Settings;
using Volo.Abp.Settings;

namespace Apya.Platform.Settings;

/// <summary>
/// ABP Hesap modülünün ayar varsayılanlarını platformun tercihine çeker.
///
/// <para>
/// <b>Neden Application katmanında:</b> ayar tanımı sağlayıcıları modül yükleme
/// sırasına göre koşar ve <c>GetOrNull</c> yalnız DAHA ÖNCE tanımlanmış bir ayarı
/// bulur. ABP'nin <c>AccountSettingDefinitionProvider</c>'ı
/// <c>Volo.Abp.Account.Application</c> içindedir; bu yüzden override, o modüle
/// bağımlı olan <c>PlatformApplicationModule</c>'ün assembly'sinde durmak zorunda.
/// Domain'e ya da Application.Contracts'a konursa daha erken koşar, <c>GetOrNull</c>
/// null döner ve override HİÇBİR HATA VERMEDEN sessizce düşer — bu bilfiil yaşandı,
/// /Account/Register kayıt formunu açmaya devam etti. Taşımadan önce iki kez düşün.
/// </para>
/// </summary>
public class AccountSettingOverrideProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        // Self-servis kayıt KAPALI: aday müşteri kendi hesabını açmaz, giriş
        // ekranından kayıt talebi gönderir (bkz. Pages/Account/RegistrationRequest.cshtml);
        // hesap, host onayı ve protokol onayından sonra açılır. Varsayılanı değiştirmek
        // hem giriş ekranındaki bağlantıyı düşürür hem de /Account/Register adresine
        // doğrudan gideni reddeder.
        // Geri açmak: bu satırı kaldır (ya da ayarı Global düzeyde true yap).
        var selfRegistration = context.GetOrNull(AccountSettingNames.IsSelfRegistrationEnabled);
        if (selfRegistration != null)
        {
            selfRegistration.DefaultValue = "false";
        }
    }
}
