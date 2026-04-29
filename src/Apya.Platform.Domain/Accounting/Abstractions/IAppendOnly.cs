namespace Apya.Platform.Accounting.Abstractions;

/// <summary>
/// Marker interface — bu interface'i implement eden hiçbir entity
/// güncellenemez veya silinemez.
/// <para>
/// Enforcement DbContext interceptor'ünde gerçekleştirilir
/// (EntityState.Modified veya Deleted yakalandığında AppendOnlyViolationException fırlatılır).
/// </para>
/// <para>
/// Domain layer'da sadece sözleşme tanımlanır — implementasyon
/// EntityFrameworkCore katmanında <c>LedgerSaveChangesInterceptor</c> tarafından sağlanır.
/// </para>
/// </summary>
public interface IAppendOnly
{
}
