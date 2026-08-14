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
    public const string TaskEstimateNegative = "Platform:Task:EstimateNegative";
    public const string TaskTransferNoTarget = "Platform:Task:TransferNoTarget";
    public const string TaskTransferSameProject = "Platform:Task:TransferSameProject";

    // --- Cari (Customer) Modülü ---
    public const string CustomerNameRequired = "Platform:Customer:NameRequired";
    public const string CustomerFieldTooLong = "Platform:Customer:FieldTooLong";

    // --- Cari Hareket (CustomerLedger) Modülü — APYA-142 ---
    public const string CustomerLedgerCustomerRequired = "Platform:CustomerLedger:CustomerRequired";
    public const string CustomerLedgerAmountInvalid = "Platform:CustomerLedger:AmountInvalid";

    // --- Gelir (Income) Modülü — APYA-142d ---
    public const string IncomeTitleRequired = "Platform:Income:TitleRequired";
    public const string IncomeFieldTooLong = "Platform:Income:FieldTooLong";
    public const string IncomeAmountInvalid = "Platform:Income:AmountInvalid";

    // --- Kasa (CashAccount) Modülü — APYA-133 ---
    public const string CashAccountNameRequired = "Platform:CashAccount:NameRequired";
    public const string CashAccountFieldTooLong = "Platform:CashAccount:FieldTooLong";
    public const string CashAccountCurrencyInvalid = "Platform:CashAccount:CurrencyInvalid";

    // --- Kur (ExchangeRate) Modülü — APYA-137 ---
    public const string ExchangeRateCurrencyInvalid = "Platform:ExchangeRate:CurrencyInvalid";
    public const string ExchangeRateSameCurrency = "Platform:ExchangeRate:SameCurrency";
    public const string ExchangeRateInvalid = "Platform:ExchangeRate:RateInvalid";

    // --- Kasa Hareketi (CashMovement) Modülü — APYA-134 ---
    public const string CashMovementAccountRequired = "Platform:CashMovement:AccountRequired";
    public const string CashMovementAmountInvalid = "Platform:CashMovement:AmountInvalid";
    public const string CashMovementTransferSameAccount = "Platform:CashMovement:TransferSameAccount";
    public const string CashMovementTransferAccountInactive = "Platform:CashMovement:TransferAccountInactive";
    public const string CashMovementTransferRateMissing = "Platform:CashMovement:TransferRateMissing";

    // --- Gider (Expense) Modülü — APYA-135 ---
    public const string ExpenseTitleRequired = "Platform:Expense:TitleRequired";
    public const string ExpenseFieldTooLong = "Platform:Expense:FieldTooLong";
    public const string ExpenseAmountInvalid = "Platform:Expense:AmountInvalid";
    public const string ExpenseCashAccountRequired = "Platform:Expense:CashAccountRequired";

    // --- Fatura (Invoice) Modülü ---
    public const string InvoiceNumberRequired = "Platform:Invoice:NumberRequired";
    public const string InvoiceNotEditable = "Platform:Invoice:NotEditable";
    public const string InvoiceTaxRateInvalid = "Platform:Invoice:TaxRateInvalid";
    public const string InvoiceCurrencyInvalid = "Platform:Invoice:CurrencyInvalid";

    // --- Fatura Tahsilatı → Kasa (APYA-136) ---
    public const string PaymentExchangeRateMissing = "Platform:Payment:ExchangeRateMissing";

    // --- Yıl Sonu Değerleme (APYA-138) ---
    public const string FxRevaluationRateMissing = "Platform:FxRevaluation:RateMissing";

    // --- Proje (Project) Modülü ---
    public const string ProjectNotFound = "Platform:Project:NotFound";
    public const string ProjectCodeAlreadyExists = "Platform:Project:CodeAlreadyExists";
    public const string ProjectNameRequired = "Platform:Project:NameRequired";
    public const string ProjectBudgetInvalid = "Platform:Project:BudgetInvalid";
    public const string ProjectScheduleInvalid = "Platform:Project:ScheduleInvalid";

    // --- Hibe (Grant) Modülü ---
    public const string GrantCallScheduleInvalid = "Platform:Grant:CallScheduleInvalid";

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
    public const string ResponseCommentNotFound = "Platform:DynamicAssets:ResponseCommentNotFound";
    public const string FormNotFound = "Platform:DynamicAssets:FormNotFound";
    public const string FormCategoryNameRequired = "Platform:DynamicAssets:FormCategoryNameRequired";
    public const string FormNotPublished = "Platform:DynamicAssets:FormNotPublished";

    // --- AI Modülü ---
    public const string AiProviderUnavailable = "Platform:Ai:ProviderUnavailable";
    public const string AiResponseInvalid = "Platform:Ai:ResponseInvalid";
    public const string AiQuotaExceeded = "Platform:Ai:QuotaExceeded";

    // --- AI Değerlendirme Merkezi (AI Evaluation Center) ---
    public const string PromptCodeAlreadyExists = "Platform:Ai:PromptCodeAlreadyExists";
    public const string PromptVersionNotFound = "Platform:Ai:PromptVersionNotFound";
    public const string PromptNoPublishedVersion = "Platform:Ai:PromptNoPublishedVersion";
    public const string PromptCategorySelfReference = "Platform:Ai:PromptCategorySelfReference";
    public const string AiEvaluationResultInvalidSchema = "Platform:Ai:EvaluationResultInvalidSchema";
    public const string AiProviderNotConfigured = "Platform:Ai:ProviderNotConfigured";

    // --- Muhasebe (Accounting) — Hesap (Account) ---
    public const string AccountCodeRequired = "Platform:Accounting:Account:CodeRequired";
    public const string AccountNameRequired = "Platform:Accounting:Account:NameRequired";
    public const string AccountInactive = "Platform:Accounting:Account:Inactive";
    public const string AccountParentSelfReference = "Platform:Accounting:Account:ParentSelfReference";

    // --- Muhasebe (Accounting) — Yevmiye (JournalEntry) ---
    public const string JournalEntryRequiresAtLeastTwoLines = "Platform:Accounting:JournalEntry:RequiresAtLeastTwoLines";
    public const string JournalEntryTooManyLines = "Platform:Accounting:JournalEntry:TooManyLines";
    public const string JournalEntryNotBalanced = "Platform:Accounting:JournalEntry:NotBalanced";
    public const string JournalEntryCurrencyInconsistent = "Platform:Accounting:JournalEntry:CurrencyInconsistent";
    public const string JournalEntryLineAmountMustBePositive = "Platform:Accounting:JournalEntry:LineAmountMustBePositive";
    public const string JournalEntryIdempotencyKeyRequired = "Platform:Accounting:JournalEntry:IdempotencyKeyRequired";
    public const string JournalEntryDuplicateIdempotencyKey = "Platform:Accounting:JournalEntry:DuplicateIdempotencyKey";
    public const string JournalEntryDescriptionRequired = "Platform:Accounting:JournalEntry:DescriptionRequired";
    public const string JournalEntryPostingDateInvalid = "Platform:Accounting:JournalEntry:PostingDateInvalid";
    public const string JournalEntryAccountNotFound = "Platform:Accounting:JournalEntry:AccountNotFound";
    public const string JournalEntryAccountTenantMismatch = "Platform:Accounting:JournalEntry:AccountTenantMismatch";
    public const string JournalEntryReversalTargetMissing = "Platform:Accounting:JournalEntry:ReversalTargetMissing";
    public const string JournalEntryReversalAlreadyExists = "Platform:Accounting:JournalEntry:ReversalAlreadyExists";
    public const string JournalEntryReversalSelfReference = "Platform:Accounting:JournalEntry:ReversalSelfReference";

    // --- Muhasebe (Accounting) — Money Value Object ---
    public const string MoneyCurrencyInvalid = "Platform:Accounting:Money:CurrencyInvalid";
    public const string MoneyCurrencyMismatch = "Platform:Accounting:Money:CurrencyMismatch";
    public const string MoneyAmountInvalidPrecision = "Platform:Accounting:Money:AmountInvalidPrecision";

    // --- Muhasebe (Accounting) — Outbox ---
    public const string OutboxMessageInvalidTransition = "Platform:Accounting:Outbox:InvalidTransition";

    // --- Geri Bildirim (Feedback) Modülü ---
    public const string FeedbackSubjectRequired = "Platform:Feedback:SubjectRequired";
    public const string FeedbackBodyRequired = "Platform:Feedback:BodyRequired";
    public const string FeedbackCommentRequired = "Platform:Feedback:CommentRequired";
    public const string FeedbackRateLimitExceeded = "Platform:Feedback:RateLimitExceeded";
    public const string FeedbackInvalidStatusTransition = "Platform:Feedback:InvalidStatusTransition";

    // --- Telemetri (Telemetry) Modülü ---
    public const string TelemetryDisabled = "Platform:Telemetry:Disabled";

    // --- Dashboard ---
    public const string DashboardLayoutTooLarge = "Platform:Dashboard:LayoutTooLarge";
}
