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
            CreateMap<ProjectCategoryDefinition, ProjectCategoryDto>();
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
                // Sorumlu adı ad+soyad olarak gösterilir; ikisi de boşsa kullanıcı adına düşülür.
                // Daha önce doğrudan UserName'e eşleniyordu, bu yüzden görev LİSTESİNDE "pm1"
                // görünürken görev DETAYINDA (TaskAppService, ad+soyad kurar) "Mehmet Demir"
                // yazıyordu. Tek kaynak burası olsun diye eşleme buraya taşındı.
                // İfade EF Core'a çevrilebilir biçimde tutuldu (ProjectTo kullanımına hazır).
                .ForMember(dest => dest.AssigneeName, opt => opt.MapFrom(src =>
                    src.Assignee == null
                        ? null
                        : (src.Assignee.Name == null || src.Assignee.Name == "")
                            ? src.Assignee.UserName
                            : (src.Assignee.Surname == null || src.Assignee.Surname == "")
                                ? src.Assignee.Name
                                : src.Assignee.Name + " " + src.Assignee.Surname))
                .ForMember(dest => dest.ParentTaskTitle, opt => opt.MapFrom(src => src.ParentTask != null ? src.ParentTask.Title : null))
                .ForMember(dest => dest.IsFavorite, opt => opt.Ignore()) // TaskFavorite join'inden AppService'te doldurulur
                // Alt görev sayaçları gizlilik (APYA-22) süzgecinden geçmek zorunda,
                // bu yüzden navigasyondan otomatik türetilmez; AppService doldurur.
                .ForMember(dest => dest.SubTaskCount, opt => opt.Ignore())
                .ForMember(dest => dest.CompletedSubTaskCount, opt => opt.Ignore());

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

            // Belge (DocumentFile) — ad/proje/tip gibi ilişkili adlar AppService'te toplu doldurulur,
            // AutoMapper yalnız düz alanları taşır (N+1 sorgu üretmemek için Ignore).
            CreateMap<Apya.Platform.Documents.DocumentFile, Apya.Platform.Documents.DocumentFileDto>()
                .ForMember(d => d.FolderName, o => o.Ignore())
                .ForMember(d => d.DocumentTypeName, o => o.Ignore())
                .ForMember(d => d.DocumentTypeCode, o => o.Ignore())
                .ForMember(d => d.DocumentTypeIcon, o => o.Ignore())
                .ForMember(d => d.ProjectName, o => o.Ignore())
                .ForMember(d => d.WorkStepName, o => o.Ignore())
                .ForMember(d => d.WorkStepOrder, o => o.Ignore())
                .ForMember(d => d.FileName, o => o.Ignore())
                .ForMember(d => d.ContentType, o => o.Ignore())
                .ForMember(d => d.FileSize, o => o.Ignore())
                .ForMember(d => d.DownloadUrl, o => o.Ignore())
                .ForMember(d => d.UploaderName, o => o.Ignore())
                .ForMember(d => d.Tags, o => o.Ignore());
            CreateMap<Apya.Platform.Documents.DocumentFile, Apya.Platform.Documents.DocumentFileDetailDto>()
                .IncludeBase<Apya.Platform.Documents.DocumentFile, Apya.Platform.Documents.DocumentFileDto>()
                .ForMember(d => d.Fields, o => o.Ignore())
                .ForMember(d => d.Versions, o => o.Ignore());
            CreateMap<Apya.Platform.Documents.DocumentType, Apya.Platform.Documents.DocumentTypeDto>()
                .ForMember(d => d.Fields, o => o.Ignore());
            CreateMap<Apya.Platform.Documents.DocumentTypeField, Apya.Platform.Documents.DocumentTypeFieldDto>();

            // --- PROJE İŞ ADIMI (WORK STEP) ---
            CreateMap<ProjectWorkStep, ProjectWorkStepDto>()
                .ForMember(d => d.ProjectName, o => o.Ignore())
                .ForMember(d => d.DocumentCount, o => o.Ignore());

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

            // --- DEMO TALEBİ (DEMO REQUESTS) MODÜLÜ ---
            // InterestedModuleKeys hesaplanan bir özelliktir, eşlenmez.
            CreateMap<Apya.Platform.DemoRequests.DemoRequest, Apya.Platform.DemoRequests.Dtos.DemoRequestDto>();
        }
    }
}