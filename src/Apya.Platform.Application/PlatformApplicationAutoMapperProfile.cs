using AutoMapper;
using Apya.Platform.Customers;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
// Tasks namespace'ini using olarak eklemiyorum ki aşağıda elle yazalım, karışmasın.

namespace Apya.Platform
{
    public class ApyaPlatformApplicationAutoMapperProfile : Profile
    {
        public ApyaPlatformApplicationAutoMapperProfile()
        {
            // --- MEVCUT PROJE (PROJECTS) MODÜLÜ ---
            // Mevcut satırı şununla değiştir:
            // Hata veren satırı şununla değiştirin:
            CreateMap<Project, ProjectDto>();
            CreateMap<Project, ProjectDetailDto>().IncludeBase<Project, ProjectDto>();

            // Hibe (Grant) — CallCount/CriteriaTags DTO'da elle doldurulur (MapToGetOutputDtoAsync).
            CreateMap<Grant, GrantDto>()
                .ForMember(d => d.CallCount, o => o.Ignore())
                .ForMember(d => d.CriteriaTags, o => o.Ignore());
            CreateMap<CreateUpdateGrantDto, Grant>()
                .ForMember(d => d.CriteriaTags, o => o.Ignore())
                .ForMember(d => d.Calls, o => o.Ignore());

            // Hibe Çağrısı (GrantCall) — GrantName MapToGetOutputDtoAsync'te doldurulur.
            // (Girdi→entity dönüşümü AppService'te MapToEntityAsync ile yapılır, AutoMapper değil.)
            CreateMap<GrantCall, GrantCallDto>()
                .ForMember(d => d.GrantName, o => o.Ignore());

            // Hibe Başvurusu (B1) — Period/GrantName AppService'te (filtre-kapalı) doldurulur.
            // TenantName/Tranches/Milestones (Faz C) da AppService'te elle doldurulur.
            CreateMap<GrantApplication, GrantApplicationDto>()
                .ForMember(d => d.Period, o => o.Ignore())
                .ForMember(d => d.GrantName, o => o.Ignore())
                .ForMember(d => d.TenantName, o => o.Ignore())
                .ForMember(d => d.Tranches, o => o.Ignore())
                .ForMember(d => d.Milestones, o => o.Ignore());

            // Tahsilat dilimi / milestone (Faz C) — salt okuma map'leri.
            CreateMap<GrantDisbursementTranche, GrantDisbursementTrancheDto>();
            CreateMap<GrantMilestone, GrantMilestoneDto>();

            // (BUG-001) Eski ProjectTask eşlemeleri kaldırıldı — Artık yalnızca Tasks.TaskItem kullanılıyor.


            // --- YENİ GÖREV (TASKS) MODÜLÜ ---

            // 1. TaskItem -> Yeni TaskDto
            // Başına Apya.Platform.Tasks yazarak yenisini kastettiğimizi belirttik.
            CreateMap<Apya.Platform.Tasks.TaskItem, Apya.Platform.Tasks.TaskDto>()
                .ForMember(dest => dest.AssigneeName, opt => opt.MapFrom(src => src.Assignee != null ? src.Assignee.UserName : null))
                .ForMember(dest => dest.ParentTaskTitle, opt => opt.MapFrom(src => src.ParentTask != null ? src.ParentTask.Title : null))
                .ForMember(dest => dest.IsFavorite, opt => opt.Ignore()); // TaskFavorite join'inden AppService'te doldurulur

            // 2. CreateUpdateTaskDto -> TaskItem
            CreateMap<Apya.Platform.Tasks.CreateUpdateTaskDto, Apya.Platform.Tasks.TaskItem>();

            // 3. Comments and Attachments
            CreateMap<Apya.Platform.Tasks.TaskComment, Apya.Platform.Tasks.TaskCommentDto>();
            CreateMap<Apya.Platform.Tasks.TaskAttachment, Apya.Platform.Tasks.TaskAttachmentDto>();
            CreateMap<Apya.Platform.Tasks.TaskChecklistItem, Apya.Platform.Tasks.TaskChecklistItemDto>();

            // --- WIKI / DOKÜMAN (DOCUMENTS) MODÜLÜ ---
            CreateMap<Apya.Platform.Documents.Document, Apya.Platform.Documents.DocumentDto>();
            CreateMap<Apya.Platform.Documents.CreateUpdateDocumentDto, Apya.Platform.Documents.Document>();
            CreateMap<Apya.Platform.Documents.DocumentAttachment, Apya.Platform.Documents.DocumentAttachmentDto>();

            // --- CARİ (MÜŞTERİ) MODÜLÜ ---
            CreateMap<Customer, CustomerDto>();
            CreateMap<CreateUpdateCustomerDto, Customer>();

            // --- KASA (CASH ACCOUNT) MODÜLÜ — APYA-133 ---
            CreateMap<CashAccount, CashAccountDto>();
            CreateMap<CreateUpdateCashAccountDto, CashAccount>();

            // --- KUR (EXCHANGE RATE) MODÜLÜ — APYA-137 ---
            CreateMap<ExchangeRate, ExchangeRateDto>();
            CreateMap<CreateUpdateExchangeRateDto, ExchangeRate>();

            // --- KASA HAREKETİ (CASH MOVEMENT) MODÜLÜ — APYA-134 ---
            CreateMap<CashMovement, CashMovementDto>();
            CreateMap<CreateUpdateCashMovementDto, CashMovement>();

            // --- GİDER (EXPENSE) MODÜLÜ — APYA-135 ---
            CreateMap<Expense, ExpenseDto>();
            CreateMap<CreateUpdateExpenseDto, Expense>();

            // --- GELİR (INCOME) MODÜLÜ — APYA-142d ---
            CreateMap<IncomeEntry, IncomeEntryDto>();
            CreateMap<CreateUpdateIncomeEntryDto, IncomeEntry>();

            // --- TENANT PROFILE MODÜLÜ ---
            CreateMap<Apya.Platform.Tenants.TenantProfile, Apya.Platform.Tenants.TenantProfileDto>();

            // --- GERİ BİLDİRİM (FEEDBACK) MODÜLÜ ---
            // HasScreenshot/CommentCount/TenantName/UserStatus AppService'te elle doldurulur (ham entity'de yok).
            CreateMap<Apya.Platform.Feedbacks.Feedback, Apya.Platform.Feedbacks.Dtos.FeedbackDto>()
                .ForMember(d => d.TenantName, o => o.Ignore())
                .ForMember(d => d.HasScreenshot, o => o.Ignore())
                .ForMember(d => d.CommentCount, o => o.Ignore())
                .ForMember(d => d.UserStatus, o => o.Ignore());
            CreateMap<Apya.Platform.Feedbacks.Feedback, Apya.Platform.Feedbacks.Dtos.FeedbackDetailDto>()
                .IncludeBase<Apya.Platform.Feedbacks.Feedback, Apya.Platform.Feedbacks.Dtos.FeedbackDto>()
                .ForMember(d => d.Comments, o => o.Ignore());
            CreateMap<Apya.Platform.Feedbacks.FeedbackComment, Apya.Platform.Feedbacks.Dtos.FeedbackCommentDto>();
            CreateMap<Apya.Platform.Feedbacks.FeedbackAttachment, Apya.Platform.Feedbacks.Dtos.FeedbackAttachmentDto>();
            CreateMap<Apya.Platform.Feedbacks.FeedbackActivity, Apya.Platform.Feedbacks.Dtos.FeedbackActivityDto>();
        }
    }
}