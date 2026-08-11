using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Timing;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// PostgreSQL sequence tabanlı takip numarası: "FB-2026-000123".
/// Sequence model'de tanımlı (HasSequence) → migration otomatik oluşturur.
/// nextval atomik olduğu için eşzamanlı gönderimde çakışma olmaz; sayaç yıl
/// değişiminde sıfırlanmaz (numara benzersizliği yıla değil sayaca dayanır).
/// </summary>
public class FeedbackNumberGenerator : IFeedbackNumberGenerator, ITransientDependency
{
    public const string SequenceName = "AppFeedbackNumberSeq";

    private readonly IDbContextProvider<PlatformDbContext> _dbContextProvider;
    private readonly IClock _clock;

    public FeedbackNumberGenerator(
        IDbContextProvider<PlatformDbContext> dbContextProvider,
        IClock clock)
    {
        _dbContextProvider = dbContextProvider;
        _clock = clock;
    }

    public async Task<string> NextAsync()
    {
        var dbContext = await _dbContextProvider.GetDbContextAsync();

        // Sequence çekme sözdizimi sağlayıcıya göre değişir:
        //   PostgreSQL → nextval('"AppFeedbackNumberSeq"')
        //   SQL Server → NEXT VALUE FOR [AppFeedbackNumberSeq]
        var isSqlServer = dbContext.Database.ProviderName?.Contains("SqlServer") == true;
        var sql = isSqlServer
            ? $"SELECT NEXT VALUE FOR [{SequenceName}] AS [Value]"
            : $"SELECT nextval('\"{SequenceName}\"') AS \"Value\"";

        var next = await dbContext.Database
            .SqlQueryRaw<long>(sql)
            .SingleAsync();

        return $"FB-{_clock.Now.Year}-{next:D6}";
    }
}
