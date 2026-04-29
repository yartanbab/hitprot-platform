namespace Apya.Platform;

/// <summary>
/// REV-006: Tüm iş mantığı hata kodları burada merkezi olarak tanımlanır.
/// ABP, "Platform:" prefix'ini otomatik olarak lokalizasyon kaynağına eşler
/// (PlatformDomainSharedModule → MapCodeNamespace("Platform", ...)).
/// </summary>
public static class PlatformDomainErrorCodes
{
    // --- Görev (Task) Modülü ---
    public const string TaskTitleRequired = "Platform:Task:TitleRequired";
    public const string TaskViewPrivateDenied = "Platform:Task:ViewPrivateDenied";
    public const string TaskViewImpersonationDenied = "Platform:Task:ViewImpersonationDenied";
    public const string TaskUpdateDenied = "Platform:Task:UpdateDenied";
    public const string TaskDeleteDenied = "Platform:Task:DeleteDenied";

    // --- Proje (Project) Modülü ---
    public const string ProjectNotFound = "Platform:Project:NotFound";
    public const string ProjectCodeAlreadyExists = "Platform:Project:CodeAlreadyExists";
    public const string ProjectNameRequired = "Platform:Project:NameRequired";
    public const string ProjectBudgetInvalid = "Platform:Project:BudgetInvalid";
    public const string ProjectScheduleInvalid = "Platform:Project:ScheduleInvalid";

    // --- Dosya (File) Modülü ---
    public const string FileUnsupportedExtension = "Platform:File:UnsupportedExtension";
    public const string FileSizeExceeded = "Platform:File:SizeExceeded";

    // --- Dinamik Varlıklar (DynamicAssets) Modülü ---
    public const string DocumentSlugAlreadyExists = "Platform:DynamicAssets:SlugAlreadyExists";
    public const string DocumentBlockNotFound = "Platform:DynamicAssets:BlockNotFound";
    public const string DocumentTitleRequired = "Platform:DynamicAssets:TitleRequired";
    public const string DocumentNotATemplate = "Platform:DynamicAssets:DocumentNotATemplate";
    public const string AiFormGenerationFailed = "Platform:DynamicAssets:AiFormGenerationFailed";
    public const string AiFormParseFailed = "Platform:DynamicAssets:AiFormParseFailed";

    // --- Accounting / Ledger Modülü ---
    // Money & Currency
    public const string MoneyAmountInvalidPrecision = "Platform:Accounting:Money:InvalidPrecision";
    public const string MoneyCurrencyInvalid = "Platform:Accounting:Money:CurrencyInvalid";
    public const string MoneyCurrencyMismatch = "Platform:Accounting:Money:CurrencyMismatch";
    public const string MoneyAmountMustBePositive = "Platform:Accounting:Money:AmountMustBePositive";

    // Account
    public const string AccountCodeRequired = "Platform:Accounting:Account:CodeRequired";
    public const string AccountNameRequired = "Platform:Accounting:Account:NameRequired";
    public const string AccountCurrencyImmutable = "Platform:Accounting:Account:CurrencyImmutable";
    public const string AccountTypeImmutable = "Platform:Accounting:Account:TypeImmutable";
    public const string AccountInactive = "Platform:Accounting:Account:Inactive";
    public const string AccountParentSelfReference = "Platform:Accounting:Account:ParentSelfReference";
    public const string AccountTenantMismatch = "Platform:Accounting:Account:TenantMismatch";

    // Journal Entry
    public const string JournalEntryIdempotencyKeyRequired = "Platform:Accounting:Journal:IdempotencyKeyRequired";
    public const string JournalEntryDescriptionRequired = "Platform:Accounting:Journal:DescriptionRequired";
    public const string JournalEntryPostingDateInvalid = "Platform:Accounting:Journal:PostingDateInvalid";
    public const string JournalEntryNotBalanced = "Platform:Accounting:Journal:NotBalanced";
    public const string JournalEntryRequiresAtLeastTwoLines = "Platform:Accounting:Journal:RequiresAtLeastTwoLines";
    public const string JournalEntryTooManyLines = "Platform:Accounting:Journal:TooManyLines";
    public const string JournalEntryCurrencyInconsistent = "Platform:Accounting:Journal:CurrencyInconsistent";
    public const string JournalEntryDuplicateIdempotencyKey = "Platform:Accounting:Journal:DuplicateIdempotencyKey";
    public const string JournalEntryAccountNotFound = "Platform:Accounting:Journal:AccountNotFound";
    public const string JournalEntryAccountInactive = "Platform:Accounting:Journal:AccountInactive";
    public const string JournalEntryAccountTenantMismatch = "Platform:Accounting:Journal:AccountTenantMismatch";
    public const string JournalEntryReversalSelfReference = "Platform:Accounting:Journal:ReversalSelfReference";
    public const string JournalEntryReversalAlreadyExists = "Platform:Accounting:Journal:ReversalAlreadyExists";
    public const string JournalEntryReversalTargetMissing = "Platform:Accounting:Journal:ReversalTargetMissing";
    public const string JournalEntryImmutable = "Platform:Accounting:Journal:Immutable";
    public const string JournalEntryLineAmountMustBePositive = "Platform:Accounting:Journal:LineAmountMustBePositive";

    // Outbox
    public const string OutboxMessageImmutablePayload = "Platform:Accounting:Outbox:ImmutablePayload";
    public const string OutboxMessageInvalidTransition = "Platform:Accounting:Outbox:InvalidTransition";

    // Projection
    public const string ProjectionSequenceOutOfOrder = "Platform:Accounting:Projection:SequenceOutOfOrder";
    public const string ProjectionTenantMismatch = "Platform:Accounting:Projection:TenantMismatch";
}
