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

    // --- Görev dış paylaşım linki (misafir erişimi) ---
    public const string TaskShareLinkExpired = "Platform:Task:ShareLinkExpired";
    public const string TaskShareLinkRevoked = "Platform:Task:ShareLinkRevoked";
    public const string TaskShareCommentNotAllowed = "Platform:Task:ShareCommentNotAllowed";
    public const string TaskShareUploadNotAllowed = "Platform:Task:ShareUploadNotAllowed";
    public const string TaskShareDownloadNotAllowed = "Platform:Task:ShareDownloadNotAllowed";
    public const string TaskShareUploadLimitExceeded = "Platform:Task:ShareUploadLimitExceeded";
    public const string TaskShareRecipientNameRequired = "Platform:Task:ShareRecipientNameRequired";
    public const string TaskShareLifetimeInvalid = "Platform:Task:ShareLifetimeInvalid";

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
    public const string PaymentAmountInvalid = "Platform:Payment:AmountInvalid";

    // --- Yıl Sonu Değerleme (APYA-138) ---
    public const string FxRevaluationRateMissing = "Platform:FxRevaluation:RateMissing";

    // --- Proje (Project) Modülü ---
    public const string ProjectNotFound = "Platform:Project:NotFound";
    public const string ProjectCodeAlreadyExists = "Platform:Project:CodeAlreadyExists";
    public const string ProjectNameRequired = "Platform:Project:NameRequired";
    public const string ProjectBudgetInvalid = "Platform:Project:BudgetInvalid";
    public const string ProjectScheduleInvalid = "Platform:Project:ScheduleInvalid";
    public const string ProjectCategoryNameRequired = "Platform:ProjectCategory:NameRequired";
    public const string ProjectCategoryNameAlreadyExists = "Platform:ProjectCategory:NameAlreadyExists";
    public const string ProjectCategorySystemReadOnly = "Platform:ProjectCategory:SystemReadOnly";
    public const string ProjectCategoryInUse = "Platform:ProjectCategory:InUse";
    public const string ProjectCategoryNotFound = "Platform:ProjectCategory:NotFound";

    // --- Hibe (Grant) Modülü ---
    public const string GrantCallScheduleInvalid = "Platform:Grant:CallScheduleInvalid";
    public const string GrantCostLimitPercentInvalid = "Platform:Grant:CostLimitPercentInvalid";
    public const string GrantPublishRequiredFieldsMissing = "Platform:Grant:PublishRequiredFieldsMissing";
    public const string GrantStageTemplateInUse = "Platform:Grant:StageTemplateInUse";
    public const string GrantDraftIdentityRequired = "Platform:Grant:DraftIdentityRequired";

    // 2a · Başvuru sihirbazı
    public const string GrantBudgetAmountNegative = "Platform:Grant:BudgetAmountNegative";
    public const string GrantBudgetCostItemNotEligible = "Platform:Grant:BudgetCostItemNotEligible";
    public const string GrantWizardStepInvalid = "Platform:Grant:WizardStepInvalid";
    public const string GrantWizardDurationInvalid = "Platform:Grant:WizardDurationInvalid";
    public const string GrantApplicationAlreadySubmitted = "Platform:Grant:ApplicationAlreadySubmitted";
    public const string GrantFieldLockedByOther = "Platform:Grant:FieldLockedByOther";
    public const string GrantApplicationLocked = "Platform:Grant:ApplicationLocked";

    // 2b · Evrak takibi
    public const string GrantDocumentNotUploaded = "Platform:Grant:DocumentNotUploaded";
    public const string GrantDocumentPackageIncomplete = "Platform:Grant:DocumentPackageIncomplete";

    // 2c · Pipeline konsolu
    public const string GrantPipelineStepNotInTemplate = "Platform:Grant:PipelineStepNotInTemplate";
    public const string GrantPipelineAssigneeNotHost = "Platform:Grant:PipelineAssigneeNotHost";

    // 2d · Başvuru detayı
    public const string GrantConsultingHoursInvalid = "Platform:Grant:ConsultingHoursInvalid";
    public const string GrantSuccessFeeInvalid = "Platform:Grant:SuccessFeeInvalid";
    public const string GrantPipelineNoNextStep = "Platform:Grant:PipelineNoNextStep";

    // 2e · Projeye dönüştürme
    public const string GrantApplicationAlreadyConverted = "Platform:Grant:ApplicationAlreadyConverted";
    public const string GrantConversionNotApproved = "Platform:Grant:ConversionNotApproved";
    public const string GrantConversionMappingMissing = "Platform:Grant:ConversionMappingMissing";

    // 6b · Red ve itiraz
    public const string GrantAppealOnlyForRejection = "Platform:Grant:AppealOnlyForRejection";
    public const string GrantAppealAlreadySubmitted = "Platform:Grant:AppealAlreadySubmitted";
    public const string GrantAppealWindowClosed = "Platform:Grant:AppealWindowClosed";
    public const string GrantAppealNotSubmitted = "Platform:Grant:AppealNotSubmitted";
    public const string GrantAppealNoItems = "Platform:Grant:AppealNoItems";
    public const string GrantDecisionNotFound = "Platform:Grant:DecisionNotFound";

    // --- Dosya (File) Modülü ---
    public const string FileUnsupportedExtension = "Platform:File:UnsupportedExtension";
    public const string FileSizeExceeded = "Platform:File:SizeExceeded";

    // --- Doküman (Documents) Modülü — belge/meta şema ---
    public const string DocumentFileNameRequired = "Platform:Documents:FileNameRequired";
    public const string DocumentFileLocked = "Platform:Documents:FileLocked";
    public const string DocumentFileAmountInvalid = "Platform:Documents:FileAmountInvalid";
    public const string DocumentTypeNameRequired = "Platform:Documents:TypeNameRequired";
    public const string DocumentTypeCodeRequired = "Platform:Documents:TypeCodeRequired";
    public const string DocumentFieldKeyRequired = "Platform:Documents:FieldKeyRequired";
    public const string DocumentTagNameRequired = "Platform:Documents:TagNameRequired";
    public const string DocumentWorkStepMismatch = "Platform:Documents:WorkStepMismatch";
    public const string CompliancePackageNameRequired = "Platform:Documents:CompliancePackageNameRequired";
    public const string ComplianceRequirementTitleRequired = "Platform:Documents:ComplianceRequirementTitleRequired";
    public const string ComplianceWaiveReasonRequired = "Platform:Documents:ComplianceWaiveReasonRequired";
    public const string CompliancePackageAlreadyApplied = "Platform:Documents:CompliancePackageAlreadyApplied";
    public const string CompliancePackageReadOnly = "Platform:Documents:CompliancePackageReadOnly";
    public const string CompliancePackageInUse = "Platform:Documents:CompliancePackageInUse";
    public const string ComplianceTaskSourceRequiresTask = "Platform:Documents:ComplianceTaskSourceRequiresTask";

    // --- Rapor / teslim paketi (Faz C) ---
    public const string ReportTemplateNameRequired = "Platform:Documents:ReportTemplateNameRequired";
    public const string ReportTemplateIsSystem = "Platform:Documents:ReportTemplateIsSystem";
    public const string DeliveryPackageNameRequired = "Platform:Documents:DeliveryPackageNameRequired";
    public const string DeliveryPackageBlocked = "Platform:Documents:DeliveryPackageBlocked";
    public const string DeliveryPackageNotEditable = "Platform:Documents:DeliveryPackageNotEditable";
    public const string DeliveryPackageItemLimit = "Platform:Documents:DeliveryPackageItemLimit";
    public const string ShareLinkExpired = "Platform:Documents:ShareLinkExpired";
    public const string ShareLinkRevoked = "Platform:Documents:ShareLinkRevoked";
    public const string ShareLinkDownloadNotAllowed = "Platform:Documents:ShareLinkDownloadNotAllowed";
    public const string ReportSubscriberEmailInvalid = "Platform:Documents:ReportSubscriberEmailInvalid";

    // --- Yönetim: kural motoru + alan bazlı izinler (Faz D) ---
    public const string DocumentRuleNameRequired = "Platform:Documents:RuleNameRequired";
    public const string DocumentRuleConditionLimit = "Platform:Documents:RuleConditionLimit";
    public const string DocumentRuleActionLimit = "Platform:Documents:RuleActionLimit";
    public const string DocumentRuleNoActions = "Platform:Documents:RuleNoActions";
    public const string DocumentRuleDisabled = "Platform:Documents:RuleDisabled";
    public const string DocumentRuleAffectedLimit = "Platform:Documents:RuleAffectedLimit";
    public const string DocumentTypeIsSystem = "Platform:Documents:TypeIsSystem";
    public const string DocumentTypeInUse = "Platform:Documents:TypeInUse";
    public const string DocumentIntegrationNameRequired = "Platform:Documents:IntegrationNameRequired";

    // --- Eşleştirme + risk kütüğü (Faz E) ---
    public const string ProjectRiskTitleRequired = "Platform:Projects:RiskTitleRequired";
    public const string DocumentExpenseAlreadyMatched = "Platform:Documents:ExpenseAlreadyMatched";
    public const string WorkStepNameRequired = "Platform:Documents:WorkStepNameRequired";
    public const string WorkStepScheduleInvalid = "Platform:Documents:WorkStepScheduleInvalid";

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
    public const string FormNotStarted = "Platform:DynamicAssets:FormNotStarted";
    public const string FormExpired = "Platform:DynamicAssets:FormExpired";
    public const string FormKvkkConsentRequired = "Platform:DynamicAssets:FormKvkkConsentRequired";
    public const string FormCaptchaFailed = "Platform:DynamicAssets:FormCaptchaFailed";
    public const string FormAnswersTooLarge = "Platform:DynamicAssets:FormAnswersTooLarge";
    public const string FormAnswersInvalid = "Platform:DynamicAssets:FormAnswersInvalid";
    public const string FormRequiredAnswerMissing = "Platform:DynamicAssets:FormRequiredAnswerMissing";
    public const string WebhookTargetUrlNotAllowed = "Platform:DynamicAssets:WebhookTargetUrlNotAllowed";

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

    // --- Geri Bildirim (Feedback) Modülü ---
    public const string FeedbackSubjectRequired = "Platform:Feedback:SubjectRequired";
    public const string FeedbackBodyRequired = "Platform:Feedback:BodyRequired";
    public const string FeedbackCommentRequired = "Platform:Feedback:CommentRequired";
    public const string FeedbackRateLimitExceeded = "Platform:Feedback:RateLimitExceeded";
    public const string FeedbackInvalidStatusTransition = "Platform:Feedback:InvalidStatusTransition";

    // --- Telemetri (Telemetry) Modülü ---
    public const string TelemetryDisabled = "Platform:Telemetry:Disabled";

    // --- Sinyalden göreve (IssueTasks) Modülü ---
    public const string IssueTaskAlreadyLinked = "Platform:IssueTask:AlreadyLinked";
    public const string IssueTaskTargetProjectNotSet = "Platform:IssueTask:TargetProjectNotSet";
    public const string IssueTaskTargetProjectNotFound = "Platform:IssueTask:TargetProjectNotFound";
    public const string IssueTaskSourceNotFound = "Platform:IssueTask:SourceNotFound";

    // --- Dashboard ---
    public const string DashboardLayoutTooLarge = "Platform:Dashboard:LayoutTooLarge";

    // --- Proje bütçesi (ProjectBudget) — kalem, dilim, kesinti, revizyon ---
    public const string BudgetLineNameRequired = "Platform:ProjectBudget:LineNameRequired";
    public const string BudgetLineCodeAlreadyExists = "Platform:ProjectBudget:LineCodeAlreadyExists";
    public const string BudgetLineAmountInvalid = "Platform:ProjectBudget:LineAmountInvalid";
    public const string BudgetLineInUse = "Platform:ProjectBudget:LineInUse";
    public const string BudgetLineRequired = "Platform:ProjectBudget:LineRequired";
    public const string BudgetLineProjectMismatch = "Platform:ProjectBudget:LineProjectMismatch";
    public const string BudgetTransferLimitInvalid = "Platform:ProjectBudget:TransferLimitInvalid";

    public const string TrancheAmountInvalid = "Platform:ProjectBudget:TrancheAmountInvalid";
    public const string TrancheCollectionInvalid = "Platform:ProjectBudget:TrancheCollectionInvalid";

    public const string DeductionAmountInvalid = "Platform:ProjectBudget:DeductionAmountInvalid";
    public const string DeductionReasonRequired = "Platform:ProjectBudget:DeductionReasonRequired";
    public const string DeductionExceedsTranche = "Platform:ProjectBudget:DeductionExceedsTranche";

    public const string TaskBudgetAmountInvalid = "Platform:ProjectBudget:TaskBudgetAmountInvalid";
    public const string TaskBudgetExceedsLine = "Platform:ProjectBudget:TaskBudgetExceedsLine";
    public const string TaskBudgetLineProjectMismatch = "Platform:ProjectBudget:TaskBudgetLineProjectMismatch";

    public const string FxDonorCurrencySameAsProject = "Platform:ProjectBudget:FxDonorCurrencySameAsProject";
    public const string FxFixedRateRequired = "Platform:ProjectBudget:FxFixedRateRequired";
    public const string FxRateMissing = "Platform:ProjectBudget:FxRateMissing";

    public const string BudgetRevisionEmpty = "Platform:ProjectBudget:RevisionEmpty";
    public const string BudgetRevisionAmountInvalid = "Platform:ProjectBudget:RevisionAmountInvalid";

    // --- Demo Talebi (DemoRequests) Modülü ---
    public const string DemoRequestRateLimitExceeded = "Platform:DemoRequest:RateLimitExceeded";
}
