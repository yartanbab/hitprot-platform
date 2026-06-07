using System;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Ai.Prompts;

public interface IPromptRepository : IRepository<Prompt, Guid>
{
    /// <summary>Loads a prompt together with its full version history (single round-trip).</summary>
    Task<Prompt?> GetWithVersionsAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Finds a prompt by its tenant-unique <c>Code</c> (with versions), or null.</summary>
    Task<Prompt?> FindByCodeAsync(string code, CancellationToken cancellationToken = default);

    /// <summary>True if another prompt already uses <paramref name="code"/> within the current tenant.</summary>
    Task<bool> CodeExistsAsync(string code, Guid? excludingId = null, CancellationToken cancellationToken = default);
}
