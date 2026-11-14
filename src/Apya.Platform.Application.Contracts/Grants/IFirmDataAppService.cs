using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>Kurumun kendi kurumsal verileri (elle girilen parametreler).</summary>
public interface IFirmDataAppService : IApplicationService
{
    Task<FirmDataDto> GetMineAsync();

    Task<FirmDataDto> SaveMineAsync(SaveFirmDataDto input);

    /// <summary>Eksik bilgiler; en çok açık çağrıyı ölçülebilir yapacak olan başta.</summary>
    Task<List<FirmDataGapDto>> GetMyGapsAsync();
}
