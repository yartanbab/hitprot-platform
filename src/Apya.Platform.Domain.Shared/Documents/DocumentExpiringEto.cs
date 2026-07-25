using System;
using Volo.Abp.EventBus;

namespace Apya.Platform.Documents;

[EventName("Apya.Platform.Documents.DocumentExpiring")]
public class DocumentExpiringEto
{
    public Guid DocumentId { get; set; }
    public string DocumentTitle { get; set; } = string.Empty;
    public Guid? ProjectId { get; set; }
    public Guid CreatorId { get; set; }
    public DateTime ExpiryDate { get; set; }
}
