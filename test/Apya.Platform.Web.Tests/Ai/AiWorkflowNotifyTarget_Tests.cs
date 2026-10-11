using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Ai.Evaluations;
using Apya.Platform.Ai.Workflows;
using Apya.Platform.Notifications;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Emailing;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Identity;
using Xunit;

namespace Apya.Platform.Ai;

/// <summary>
/// İş akışı kuralındaki "bildir" eylemi hedef kullanıcıyı serbest metin olarak taşır ve hiç
/// doğrulanmıyordu: kimliği bilinen başka kiracının (ya da host'un) kullanıcısına bildirim
/// düşürülebiliyordu. Kiracı süzgeçli kullanıcı deposunda bulunmayan hedef için bildirim
/// yöneticisi hiç çağrılmaz.
/// </summary>
public class AiWorkflowNotifyTarget_Tests
{
    private readonly IAiWorkflowRepository _workflows = Substitute.For<IAiWorkflowRepository>();
    private readonly IAiEvaluationRepository _evaluations = Substitute.For<IAiEvaluationRepository>();
    private readonly IRepository<IdentityUser, Guid> _users = Substitute.For<IRepository<IdentityUser, Guid>>();
    private readonly IRepository<Notification, Guid> _notifications = Substitute.For<IRepository<Notification, Guid>>();
    private readonly IRepository<NotificationPreference, Guid> _preferences =
        Substitute.For<IRepository<NotificationPreference, Guid>>();

    private AiWorkflowTriggerHandler Handler() => new(
        _workflows,
        _evaluations,
        new AiWorkflowEvaluator(),
        new NotificationManager(
            _notifications,
            _preferences,
            Substitute.For<IIdentityUserRepository>(),
            Substitute.For<IEmailSender>(),
            Substitute.For<ILocalEventBus>(),
            Substitute.For<IDataFilter<ISoftDelete>>()),
        NullLogger<AiWorkflowTriggerHandler>.Instance,
        _users);

    private Guid CompletedEvaluationMatching(Guid targetUserId)
    {
        var evaluation = new AiEvaluation(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());
        evaluation.MarkCompleted(new AiEvaluationResult(
            Guid.NewGuid(), evaluation.Id, "{\"score\":95}", isSchemaValid: true, tokensUsed: 1, durationMs: 1));
        _evaluations.GetWithResultAsync(evaluation.Id, Arg.Any<CancellationToken>()).Returns(evaluation);

        var workflow = new AiWorkflow(Guid.NewGuid(), "Sızıntı denemesi");
        workflow.AddRule(
            Guid.NewGuid(), "score", RuleOperator.GreaterThan, "80", WorkflowActionType.Notify, targetUserId.ToString());
        _workflows.GetMatchingActiveAsync(evaluation.DocumentId, evaluation.PromptId, Arg.Any<CancellationToken>())
            .Returns(new List<AiWorkflow> { workflow });

        return evaluation.Id;
    }

    [Fact]
    public async Task Kiracida_olmayan_kullaniciya_bildirim_gonderilmez()
    {
        var foreignUser = Guid.NewGuid();
        var evaluationId = CompletedEvaluationMatching(foreignUser);
        _users.FindAsync(foreignUser, false, Arg.Any<CancellationToken>()).Returns((IdentityUser?)null);

        await Handler().HandleEventAsync(new AiEvaluationStatusChangedEto
        {
            EvaluationId = evaluationId,
            NewStatus = AiEvaluationStatus.Completed
        });

        // Kural eşleşti (kullanıcı arandı) ama bildirim yöneticisine hiç gidilmedi.
        await _users.Received(1).FindAsync(foreignUser, false, Arg.Any<CancellationToken>());
        _preferences.ReceivedCalls().ShouldBeEmpty();
        _notifications.ReceivedCalls().ShouldBeEmpty();
    }
}
