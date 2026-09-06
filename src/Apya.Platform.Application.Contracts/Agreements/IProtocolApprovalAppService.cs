using System.Threading.Tasks;
using Apya.Platform.Agreements.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Agreements;

/// <summary>
/// Davet bağlantısıyla yürüyen protokol onayı — oturumsuzdur, yetkiyi tek kullanımlık
/// jeton verir.
///
/// <para><c>RemoteService(false)</c>: kayıt talebi ve rıza servisleriyle aynı gerekçe —
/// IP/UA yalnız Web sınırında güvenilir yakalanır ve bu değerler protokolün 9. maddesine
/// göre delilin parçasıdır. Açık bir HTTP ucu, sayfayı atlayıp IP'siz onay üretmeye izin
/// verirdi.</para>
/// </summary>
public interface IProtocolApprovalAppService : IApplicationService
{
    /// <summary>
    /// Jetonu doğrular ve onay öncesi belgeyi döner. Jeton geçersiz/süresi dolmuşsa
    /// <c>BusinessException</c> atar — hata kodları ayrıdır, çünkü çözümleri farklıdır.
    /// </summary>
    Task<ProtocolInviteDto> GetByTokenAsync(string token);

    /// <summary>
    /// Protokolü onaylar, sözleşmeyi yazar, rıza kayıtlarını düşer ve kiracı hesabını açar.
    /// <para>
    /// Yeniden denemeye DAYANIKLIDIR: sözleşme zaten yazılmış ama hesap açılamamışsa
    /// (kurulum kendi transaction'ında koşar) ikinci çağrı yeni sözleşme üretmez, var olanı
    /// kullanıp kurulumu tekrar dener.
    /// </para>
    /// </summary>
    Task<ProtocolApprovalResultDto> ApproveAsync(ApproveProtocolInput input);
}
