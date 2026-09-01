using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Grants;

/// <summary>
/// 1a · Kaynak kazıyıcısının SÖZLEŞMESİ. Gerçek uygulama (HTTP çekme, HTML/PDF ayrıştırma)
/// tasarım kapsamı dışındadır; burada yalnız arayüz durur ki konsol, koşu kaydı ve taslak
/// kuyruğu şimdiden çalışsın ve kazıyıcı geldiğinde hiçbir çağrı yeri değişmesin.
/// </summary>
public interface IGrantScraper
{
    Task<GrantScrapeOutcome> ScrapeAsync(GrantSource source, CancellationToken cancellationToken = default);
}

/// <summary>Bir tarama koşusunun sonucu — <see cref="GrantScrapeRun"/>'a yazılır.</summary>
public sealed record GrantScrapeOutcome(
    GrantScrapeRunStatus Status,
    int FoundCount,
    int NewCount,
    string? Message = null)
{
    public static GrantScrapeOutcome Skipped(string? message = null)
        => new(GrantScrapeRunStatus.Atlandi, 0, 0, message);
}

/// <summary>
/// Kazıyıcı bağlanana kadar geçerli olan uygulama: hiçbir şey çekmez, koşuyu
/// <see cref="GrantScrapeRunStatus.Atlandi"/> olarak kapatır. Böylece "Tümünü Tara"
/// düğmesi sessizce başarısız olmak yerine konsolda dürüst bir durum bırakır.
/// </summary>
public class NotConfiguredGrantScraper : IGrantScraper, ITransientDependency
{
    public Task<GrantScrapeOutcome> ScrapeAsync(GrantSource source, CancellationToken cancellationToken = default)
        => Task.FromResult(GrantScrapeOutcome.Skipped());
}
