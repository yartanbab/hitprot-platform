using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks;

public class GetTasksInput : PagedAndSortedResultRequestDto
{
    // Görevleri projeye göre filtrelemek için kullanacağımız parametre
    public Guid? ProjectId { get; set; }
}