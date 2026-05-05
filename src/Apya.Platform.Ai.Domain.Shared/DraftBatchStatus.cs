namespace Apya.Platform.Ai;

public enum DraftBatchStatus
{
    Created = 0,
    Processing = 1,
    ReadyForReview = 2,
    PartiallyApproved = 3,
    FullyApproved = 4,
    Abandoned = 5,
    Failed = 6
}
