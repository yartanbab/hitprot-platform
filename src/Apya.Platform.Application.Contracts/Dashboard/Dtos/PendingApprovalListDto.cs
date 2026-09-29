using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Dashboard.Dtos;

/// <summary>
/// "Bende bekleyen kararlar" kartının tamamı (JSON <c>{ items, locked }</c>).
/// <para>
/// KİLİT SÖZLEŞMESİ: <c>Platform.Invoices</c> yoksa <see cref="Locked"/> true, <c>Items</c> boş
/// ve sorgu HİÇ atılmaz — boş kuyruk ile kilitli kuyruk ayırt edilsin.
/// </para>
/// </summary>
public class PendingApprovalListDto : ListResultDto<PendingApprovalDto>
{
    public bool Locked { get; set; }
}
