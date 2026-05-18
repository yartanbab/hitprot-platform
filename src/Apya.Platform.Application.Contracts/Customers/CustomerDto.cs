using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Customers;

public class CustomerDto : FullAuditedEntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public string Name { get; set; } = null!;
    public string? TaxNumber { get; set; }
    public string? TaxOffice { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; }

    /// <summary>APYA-142e: Cari bakiye (Σ Borç − Σ Alacak; pozitif → müşteri bize borçlu).</summary>
    public decimal Balance { get; set; }
}
