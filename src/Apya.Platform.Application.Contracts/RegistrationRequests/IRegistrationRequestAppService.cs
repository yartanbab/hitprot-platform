using System;
using System.Threading.Tasks;
using Apya.Platform.RegistrationRequests.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// Kayıt talebi uygulama servisi. <see cref="Apya.Platform.Consents.IConsentAppService"/>
/// ile aynı gerekçeyle HTTP API olarak AÇILMAZ: oluşturma oturumsuzdur ve IP/UA
/// yalnız Web sınırında güvenilir biçimde yakalanabilir; açık bir uç, formu atlayıp
/// doğrudan kayıt üretmeye izin verirdi.
/// </summary>
public interface IRegistrationRequestAppService : IApplicationService
{
    /// <summary>Kayıt talebini kaydeder (oturumsuz; Web sınırından çağrılır).</summary>
    Task<Guid> CreateAsync(CreateRegistrationRequestDto input);

    /// <summary>Panel listesi (izin: RegistrationRequests.Default).</summary>
    Task<PagedResultDto<RegistrationRequestDto>> GetListAsync(RegistrationRequestListFilterDto input);

    /// <summary>Tek kayıt (izin: RegistrationRequests.Default).</summary>
    Task<RegistrationRequestDto> GetAsync(Guid id);

    /// <summary>Durum / paket / bedel / iç not günceller (izin: RegistrationRequests.Manage).</summary>
    Task<RegistrationRequestDto> UpdateAsync(Guid id, UpdateRegistrationRequestDto input);

    /// <summary>Durumlara göre kayıt sayıları — panel sekmelerinin rozetleri.</summary>
    Task<RegistrationRequestSummaryDto> GetSummaryAsync();

    /// <summary>
    /// Protokol adımının davet bağlantısını üretir (izin: RegistrationRequests.Manage).
    /// <para>
    /// 🔐 Ham jeton YALNIZ bu çağrının dönüşünde görülür; veritabanında özeti durur.
    /// Tekrar çağrılabilir — bağlantı kaybolduysa yenisi üretilir ve eskisi geçersizleşir.
    /// </para>
    /// </summary>
    Task<RegistrationInviteDto> IssueInviteAsync(Guid id);

    /// <summary>
    /// Davet bağlantısını adaya e-postayla iletir (izin: RegistrationRequests.Manage).
    /// <para>
    /// <c>true</c> = gönderildi. <c>false</c> = SMTP yapılandırılmamış ya da gönderim
    /// düştü; İSTİSNA ATMAZ — davet zaten üretildi ve host bağlantıyı ekrandan kopyalayıp
    /// kendisi iletebilir. Akışın e-postaya bağlanması, posta ayarı gelene kadar hesap
    /// açılışını tamamen durdururdu.
    /// </para>
    /// <para>
    /// Bağlantıyı ÇAĞIRAN üretir: mutlak adres Web sınırında bilinir, uygulama katmanı
    /// hangi şema/host altında çalıştığını bilmez.
    /// </para>
    /// </summary>
    Task<bool> SendInviteMailAsync(Guid id, string protocolUrl);
}
