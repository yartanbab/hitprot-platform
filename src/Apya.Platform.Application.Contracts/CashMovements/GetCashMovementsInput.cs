using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.CashMovements;

public class GetCashMovementsInput : PagedAndSortedResultRequestDto
{
    public Guid? CashAccountId { get; set; }
    public CashMovementDirection? Direction { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
