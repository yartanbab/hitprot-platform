using AutoMapper;
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
            CreateMap<CreateProjectDto, Project>();

            // Hibe Eşleştirmeleri
            CreateMap<Grant, GrantDto>();

            // (BUG-001) Eski ProjectTask eşlemeleri kaldırıldı — Artık yalnızca Tasks.TaskItem kullanılıyor.


            // --- YENİ GÖREV (TASKS) MODÜLÜ ---

            // 1. TaskItem -> Yeni TaskDto
            // Başına Apya.Platform.Tasks yazarak yenisini kastettiğimizi belirttik.
            CreateMap<Apya.Platform.Tasks.TaskItem, Apya.Platform.Tasks.TaskDto>()
                .ForMember(dest => dest.AssigneeName, opt => opt.MapFrom(src => src.Assignee.UserName))
                .ForMember(dest => dest.ParentTaskTitle, opt => opt.MapFrom(src => src.ParentTask != null ? src.ParentTask.Title : null));

            // 2. CreateUpdateTaskDto -> TaskItem
            CreateMap<Apya.Platform.Tasks.CreateUpdateTaskDto, Apya.Platform.Tasks.TaskItem>();

            // 3. Comments and Attachments
            CreateMap<Apya.Platform.Tasks.TaskComment, Apya.Platform.Tasks.TaskCommentDto>();
            CreateMap<Apya.Platform.Tasks.TaskAttachment, Apya.Platform.Tasks.TaskAttachmentDto>();

            // --- WIKI / DOKÜMAN (DOCUMENTS) MODÜLÜ ---
            CreateMap<Apya.Platform.Documents.Document, Apya.Platform.Documents.DocumentDto>();
            CreateMap<Apya.Platform.Documents.CreateUpdateDocumentDto, Apya.Platform.Documents.Document>();

            // --- TENANT PROFILE MODÜLÜ ---
            CreateMap<Apya.Platform.Tenants.TenantProfile, Apya.Platform.Tenants.TenantProfileDto>();
        }
    }
}