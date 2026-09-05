using System.Threading.Tasks;
using Apya.Platform.Agreements.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Agreements;

/// <summary>
/// Kiracının KENDİ hizmet protokolünü okuduğu uç. Bilerek DARDIR: tek kayıt, salt okunur,
/// başka kiracının sözleşmesine erişim yok.
/// <para>
/// Sözleşme host kaydıdır (<c>IMultiTenant</c> değil), bu yüzden kiracı filtresi bu sorguyu
/// KORUMAZ — eşleştirme <c>CurrentTenant.Id</c> ile ELLE yapılır.
/// </para>
/// </summary>
public interface IMyAgreementAppService : IApplicationService
{
    /// <summary>Yürürlükteki sözleşme; hiç yoksa <c>null</c> (protokol öncesi kurulmuş kiracılar).</summary>
    Task<MyAgreementDto?> GetAsync();
}
