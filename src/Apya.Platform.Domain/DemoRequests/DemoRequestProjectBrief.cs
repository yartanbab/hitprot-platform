namespace Apya.Platform.DemoRequests;

/// <summary>
/// Demo talebinin isteğe bağlı proje fikri bloğu. Beş alanı tek parametreye
/// toplar; aksi halde <see cref="DemoRequestManager.CreateAsync"/> on altı
/// parametreye çıkardı ve çağrı yerinde sıra hatası kaçınılmaz olurdu.
/// </summary>
public class DemoRequestProjectBrief
{
    public string? TargetAudience { get; set; }
    public string? ProblemStatement { get; set; }
    public string? PlannedActivities { get; set; }
    public DemoRequestBudgetRange? BudgetRange { get; set; }
    public string? ExpectedOutcomes { get; set; }
}
