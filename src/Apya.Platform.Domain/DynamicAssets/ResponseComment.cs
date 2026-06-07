using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Child entity of <see cref="AppResponse"/>. An internal reviewer comment on a submission.
/// </summary>
public class ResponseComment : CreationAuditedEntity<Guid>
{
    public Guid AppResponseId { get; private set; }

    public string Text { get; private set; } = null!;

    protected ResponseComment()
    {
    }

    public ResponseComment(Guid id, Guid appResponseId, string text)
        : base(id)
    {
        AppResponseId = appResponseId;
        Text = Check.NotNullOrWhiteSpace(text, nameof(text), maxLength: ResponseCommentConsts.MaxTextLength);
    }
}
