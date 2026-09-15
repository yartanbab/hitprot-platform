using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 19a · Host "Fikir Havuzu": çağrıya bağlanmamış proje fikirleri. Fikir firmanındır
/// (<c>GrantInterest</c>, çağrısı boş); danışman firma adına da girebilir.
///
/// <para>Havuz talep DEĞİLDİR — yanıt süresi işlemez, Talepler'e düşmez. Çağrıyla
/// ilişkilendirilen fikir talep olur ve oradan yürür.</para>
///
/// <para>🔴 HOST-ONLY: kiracılar arası bakar.</para>
/// </summary>
public interface IGrantIdeaPoolAppService : IApplicationService
{
    /// <summary>Bekleyen havuz fikirleri; geri çekilen fikir listelenmez.</summary>
    Task<GrantIdeaPoolDto> GetListAsync(GetGrantIdeaPoolInput input);

    Task<GrantIdeaDetailDto> GetAsync(Guid id);

    /// <summary>Danışman firma adına fikir girer; kayıt firmanın olur ve Hibe Yolculuğu'nda görünür.</summary>
    Task<GrantIdeaDetailDto> CreateAsync(CreateGrantIdeaInput input);
}
