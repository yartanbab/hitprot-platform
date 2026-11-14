using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.DataTransfers.Dtos
{
    /// <summary>
    /// Şablonun bir sütunu. <see cref="Key"/> modülün standart sütun başlığıdır (kalıcı bağ);
    /// <see cref="Header"/> dosyada görünen başlıktır — dışa aktarmada yazılan, içe aktarmada aranan.
    /// Listedeki sıra dosyadaki sütun sırasıdır.
    /// </summary>
    public class DataTransferTemplateColumnDto
    {
        public string Key { get; set; } = string.Empty;
        public string Header { get; set; } = string.Empty;
    }

    public class DataTransferTemplateDto : EntityDto<Guid>
    {
        public Guid? TenantId { get; set; }

        /// <summary>Host'un tanımladığı, bütün kiracıların kullandığı şablon; yalnız host değiştirir.</summary>
        public bool IsSystem { get; set; }

        /// <summary>Çağıran bu şablonu değiştirebilir mi (kendi tarafının şablonu).</summary>
        public bool IsEditable { get; set; }

        public string ModuleKey { get; set; } = string.Empty;
        public DataTransferDirection Direction { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DataTransferFileFormat Format { get; set; }
        public int Version { get; set; }
        public List<DataTransferTemplateColumnDto> Columns { get; set; } = new();
        public DateTime CreationTime { get; set; }
        public DateTime? LastModificationTime { get; set; }
    }

    public class DataTransferTemplateVersionDto
    {
        public int Version { get; set; }
        public string Name { get; set; } = string.Empty;
        public DataTransferFileFormat Format { get; set; }
        public List<DataTransferTemplateColumnDto> Columns { get; set; } = new();
        public DateTime CreationTime { get; set; }
    }

    public class SaveDataTransferTemplateDto
    {
        [Required]
        [StringLength(DataTransferConsts.MaxTemplateNameLength)]
        public string Name { get; set; } = string.Empty;

        [StringLength(DataTransferConsts.MaxTemplateDescriptionLength)]
        public string? Description { get; set; }

        public DataTransferFileFormat Format { get; set; }

        public List<DataTransferTemplateColumnDto> Columns { get; set; } = new();
    }

    public class CreateDataTransferTemplateDto : SaveDataTransferTemplateDto
    {
        public string ModuleKey { get; set; } = string.Empty;
        public DataTransferDirection Direction { get; set; }
    }

    public class GetDataTransferTemplatesInput
    {
        public string? ModuleKey { get; set; }
        public DataTransferDirection? Direction { get; set; }
    }
}

namespace Apya.Platform.DataTransfers
{
    using Apya.Platform.DataTransfers.Dtos;

    /// <summary>
    /// Aktarım şablonları. Kiracı kendi şablonlarını ve host'un sistem şablonlarını görür; herkes
    /// yalnız kendi tarafının şablonunu değiştirir. Yalnız görebildiği modülün şablonları listelenir.
    /// </summary>
    public interface IDataTransferTemplateAppService : IApplicationService
    {
        Task<ListResultDto<DataTransferTemplateDto>> GetListAsync(GetDataTransferTemplatesInput input);

        Task<DataTransferTemplateDto> GetAsync(Guid id);

        Task<DataTransferTemplateDto> CreateAsync(CreateDataTransferTemplateDto input);

        /// <summary>Şablonu değiştirir; yeni sürüm açılır, önceki saklanır.</summary>
        Task<DataTransferTemplateDto> UpdateAsync(Guid id, SaveDataTransferTemplateDto input);

        Task DeleteAsync(Guid id);

        /// <summary>Bütün sürümler, en yenisi başta.</summary>
        Task<List<DataTransferTemplateVersionDto>> GetVersionsAsync(Guid id);
    }
}
