using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Apya.Platform.Grants;

/// <summary>Belgeden okunan metnin bir sayfası. Word belgesinde sayfa bilinmez: <see cref="Number"/> null.</summary>
public sealed record FirmDocumentPage(int? Number, string Text);

/// <summary>Yapay zekânın bir parametre için önerdiği değer (henüz doğrulanmamış ham yanıt).</summary>
public sealed record FirmDataProposal(string Code, string RawValue, int Confidence, int? Page, string? Excerpt);

/// <summary>
/// Belge metninden kurum parametresi önerisi çıkaran yapay zekâ. Çekirdek bu arayüzü
/// tanımlar, AI modülü uygular (bağımlılık yönü AI → çekirdek). Modül yüklü değilse kayıt
/// yoktur; çağıran bunu "kullanılamıyor" sayar.
///
/// <para>Kota denetimi, istek kaydı ve iz uygulayıcının işidir. Kota aşımı ve sağlayıcı
/// hatası <see cref="Volo.Abp.BusinessException"/> olarak döner.</para>
/// </summary>
public interface IFirmDataExtractionAi
{
    Task<IReadOnlyList<FirmDataProposal>> ProposeAsync(
        Guid extractionId,
        IReadOnlyList<FirmDocumentPage> pages,
        IReadOnlyList<FirmParameterDefinition> candidates,
        CancellationToken cancellationToken = default);
}
