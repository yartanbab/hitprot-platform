using System;
using System.Threading.Tasks;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Projects;

/// <summary>
/// Domain Service responsible for creating and validating Project entities.
/// REV-GAP001: All fields are set before the entity leaves this service.
/// </summary>
public class ProjectManager : DomainService
{
    /// <summary>
    /// Creates a fully initialized Project entity.
    /// All domain rules are enforced within the entity's constructor and domain methods.
    /// </summary>
    public Task<Project> CreateAsync(
        Guid? grantId,
        string name,
        string code,
        string description,
        decimal totalBudget = 0,
        decimal hourlyRate = 0,
        string currency = "TRY",
        string purpose = null,
        string duration = null,
        string targetAudience = null,
        string activities = null,
        DateTime? startDate = null,
        DateTime? endDate = null)
    {
        var project = new Project(
            GuidGenerator.Create(),
            grantId,
            name,
            code,
            description,
            totalBudget,
            hourlyRate,
            currency,
            purpose,
            duration,
            targetAudience,
            activities,
            startDate,
            endDate
        );

        return Task.FromResult(project);
    }
}