using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>
/// Belgeden kurum verisi okuma: belge Belge Merkezi'ne konur, yapay zekâ önerir, kurum her
/// öneriyi onaylar, düzenleyerek onaylar ya da reddeder. Onaylanmayan öneri kurum verisine yazılmaz.
/// </summary>
public interface IFirmDataExtractionAppService : IApplicationService
{
    /// <summary>Kullanıcı bu kurum için belge okutabilir mi (izin, paket, yapay zekâ modülü).</summary>
    Task<bool> CanExtractAsync();

    /// <summary>
    /// Belgeyi kaydeder ve okur. Okunamayan belge ya da yapay zekâ hatası istisna değil, kayıttaki
    /// durumdur: belge yine Belge Merkezi'nde kalır.
    /// </summary>
    Task<FirmDataExtractionDto> ExtractAsync(ExtractFirmDataInput input);

    /// <summary>
    /// Yapay zekâ hatasıyla biten okumayı Belge Merkezi'ndeki aynı belgeyle yeniden dener
    /// (aynı kayıt; yeni yükleme ve yeni onay istemez).
    /// </summary>
    Task<FirmDataExtractionDto> RetryAsync(Guid id);

    /// <summary>Kurumun okuttuğu belgeler, yeniden eskiye.</summary>
    Task<List<FirmDataExtractionDto>> GetListAsync();

    Task<FirmDataExtractionDto> GetAsync(Guid id);

    /// <summary>
    /// Öneriyi onaylar. <paramref name="editedRawValue"/> verilirse ve önerilenden farklıysa
    /// düzenlenmiş değer yazılır (kurumun beyanı olarak).
    /// </summary>
    Task<FirmDataExtractionDto> AcceptAsync(Guid id, Guid suggestionId, string? editedRawValue = null);

    Task<FirmDataExtractionDto> RejectAsync(Guid id, Guid suggestionId);
}
