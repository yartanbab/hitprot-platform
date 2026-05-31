using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Aggregate Root representing a single form submission/response to an <see cref="AppDocument"/>.
/// The submitted <see cref="Answers"/> are immutable; only the review workflow
/// (status, tags, comments) changes after submission.
/// </summary>
public class AppResponse : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid DocumentId { get; private set; }

    /// <summary>
    /// Optional respondent identifier. Null for anonymous submissions.
    /// </summary>
    public Guid? RespondentId { get; private set; }

    /// <summary>
    /// JSON payload containing the form answers keyed by block ID. Immutable after submission.
    /// </summary>
    public string Answers { get; private set; } = null!;

    /// <summary>Review workflow status (Pending/InReview/Reviewed).</summary>
    public ResponseStatus Status { get; private set; }

    /// <summary>JSON array of free-form tags applied by reviewers.</summary>
    public string? TagsJson { get; private set; }

    /// <summary>How long the respondent took to complete the form, in seconds.</summary>
    public int? CompletionSeconds { get; private set; }

    /// <summary>JSON (JSONB) — respondent metadata (IP, user agent, referrer) for anti-spam/analytics.</summary>
    public string? RespondentMetaJson { get; private set; }

    public Guid? TenantId { get; set; }

    private readonly List<ResponseComment> _comments = new();
    public IReadOnlyList<ResponseComment> Comments => _comments.AsReadOnly();

    /// <summary>
    /// Required by EF Core and ABP for deserialization.
    /// </summary>
    protected AppResponse()
    {
    }

    public AppResponse(
        Guid id,
        Guid documentId,
        string answers,
        Guid? respondentId = null,
        int? completionSeconds = null,
        string? respondentMetaJson = null)
        : base(id)
    {
        DocumentId = documentId;
        Answers = Check.NotNullOrWhiteSpace(answers, nameof(answers));
        RespondentId = respondentId;
        CompletionSeconds = completionSeconds;
        RespondentMetaJson = respondentMetaJson;
        Status = ResponseStatus.Pending;
    }

    public void SetStatus(ResponseStatus status)
    {
        Status = status;
    }

    public void SetTags(string? tagsJson)
    {
        TagsJson = tagsJson;
    }

    public ResponseComment AddComment(Guid commentId, string text)
    {
        var comment = new ResponseComment(commentId, Id, text);
        _comments.Add(comment);
        return comment;
    }

    public void RemoveComment(Guid commentId)
    {
        var comment = _comments.FirstOrDefault(c => c.Id == commentId);

        if (comment is null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.ResponseCommentNotFound);
        }

        _comments.Remove(comment);
    }
}
