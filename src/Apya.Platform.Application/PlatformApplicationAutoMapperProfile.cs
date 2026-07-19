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

            // Hibe Eşleştirmeleri
            CreateMap<Grant, GrantDto>();
            CreateMap<CreateUpdateGrantDto, Grant>();

            // (BUG-001) Eski ProjectTask eşlemeleri kaldırıldı — Artık yalnızca Tasks.TaskItem kullanılıyor.


            // --- YENİ GÖREV (TASKS) MODÜLÜ ---

            // 1. TaskItem -> Yeni TaskDto
            // Başına Apya.Platform.Tasks yazarak yenisini kastettiğimizi belirttik.
            CreateMap<Apya.Platform.Tasks.TaskItem, Apya.Platform.Tasks.TaskDto>()
                .ForMember(dest => dest.AssigneeName, opt => opt.MapFrom(src => src.Assignee != null ? src.Assignee.UserName : null))
                .ForMember(dest => dest.ParentTaskTitle, opt => opt.MapFrom(src => src.ParentTask != null ? src.ParentTask.Title : null));

            // 2. CreateUpdateTaskDto -> TaskItem
            CreateMap<Apya.Platform.Tasks.CreateUpdateTaskDto, Apya.Platform.Tasks.TaskItem>();

            // 3. Comments and Attachments
            CreateMap<Apya.Platform.Tasks.TaskComment, Apya.Platform.Tasks.TaskCommentDto>();
            CreateMap<Apya.Platform.Tasks.TaskAttachment, Apya.Platform.Tasks.TaskAttachmentDto>();

            // --- WIKI / DOKÜMAN (DOCUMENTS) MODÜLÜ ---
            CreateMap<Apya.Platform.Documents.Document, Apya.Platform.Documents.DocumentDto>();
            CreateMap<Apya.Platform.Documents.CreateUpdateDocumentDto, Apya.Platform.Documents.Document>();

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
        }
    }
}