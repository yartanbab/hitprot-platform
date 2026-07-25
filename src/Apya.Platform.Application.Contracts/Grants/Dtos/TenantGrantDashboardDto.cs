using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

public class TenantGrantDashboardDto
{
    public int Onaylanan { get; set; }
    public int Degerlendirmede { get; set; }
    public decimal TahsilEdilen { get; set; }
    public int BuAySonTarih { get; set; }
    public List<UpcomingDeadlineDto> YaklasanSonTarihler { get; set; } = new();
}
