using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.DataTransfers.Dtos
{
    /// <summary>İşlem geçmişinin bir satırı.</summary>
    public class DataTransferRunDto : EntityDto<Guid>
    {
        public DateTime CreationTime { get; set; }
        public Guid? CreatorId { get; set; }

        /// <summary>İşlemi yapan kişinin adı; kullanıcı silinmişse boş.</summary>
        public string? CreatorName { get; set; }

        public string ModuleKey { get; set; } = string.Empty;
        public DataTransferDirection Direction { get; set; }
        public string? Format { get; set; }
        public string? FileName { get; set; }
        public int? TotalRows { get; set; }
        public int? SucceededRows { get; set; }
        public int? FailedRows { get; set; }
        public bool Succeeded { get; set; }
        public string? Message { get; set; }
        public int DurationMs { get; set; }
    }

    /// <summary>Kaydedilecek işlem. Satır sayıları yalnız işlem bildirdiyse doludur.</summary>
    public class RecordDataTransferRunDto
    {
        public string ModuleKey { get; set; } = string.Empty;
        public DataTransferDirection Direction { get; set; }
        public bool Succeeded { get; set; }
        public int DurationMs { get; set; }
        public string? Format { get; set; }
        public string? FileName { get; set; }
        public int? TotalRows { get; set; }
        public int? SucceededRows { get; set; }
        public int? FailedRows { get; set; }
        public string? Message { get; set; }
        public Guid? TemplateId { get; set; }
        public int? TemplateVersion { get; set; }
    }
}

namespace Apya.Platform.DataTransfers
{
    using Apya.Platform.DataTransfers.Dtos;

    /// <summary>
    /// İçe/dışa aktarma işlem geçmişi. Kayıtlar kiracıya aittir: kiracı kendi işlemlerini, host
    /// host bağlamında yapılanları görür.
    /// </summary>
    public interface IDataTransferRunAppService : IApplicationService
    {
        /// <summary>En yeni kayıt başta.</summary>
        Task<PagedResultDto<DataTransferRunDto>> GetListAsync(PagedResultRequestDto input);
    }
}
