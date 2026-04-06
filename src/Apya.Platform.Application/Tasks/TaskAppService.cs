using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Identity;
using Apya.Platform.Permissions;

namespace Apya.Platform.Tasks
{
    [Authorize]
    public class TaskAppService :
        CrudAppService<
            TaskItem,
            TaskDto,
            Guid,
            GetTasksInput, // 1. KİLİT NOKTA: PagedAndSorted... yerine kendi filtre DTO'muzu koyduk!
            CreateUpdateTaskDto>,
        ITaskAppService
    {
        private readonly IIdentityUserRepository _userRepository;
        private readonly IRepository<TaskComment, Guid> _commentRepository;
        private readonly IRepository<TaskAttachment, Guid> _attachmentRepository;
        private readonly IRepository<TaskDependency, Guid> _dependencyRepository;
        private readonly IRepository<TaskTimeLog, Guid> _timeLogRepository;
        private readonly IRepository<IdentityUser, Guid> _identityRepository;
        private readonly ILocalEventBus _localEventBus;

        public TaskAppService(
            IRepository<TaskItem, Guid> repository,
            IIdentityUserRepository userRepository,
            IRepository<TaskComment, Guid> commentRepository,
            IRepository<TaskAttachment, Guid> attachmentRepository,
            IRepository<TaskDependency, Guid> dependencyRepository,
            IRepository<TaskTimeLog, Guid> timeLogRepository,
            IRepository<IdentityUser, Guid> identityRepository,
            ILocalEventBus localEventBus)
            : base(repository)
        {
            _userRepository       = userRepository;
            _commentRepository    = commentRepository;
            _attachmentRepository = attachmentRepository;
            _dependencyRepository = dependencyRepository;
            _timeLogRepository    = timeLogRepository;
            _identityRepository   = identityRepository;
            _localEventBus        = localEventBus;

            CreatePolicyName = PlatformPermissions.Tasks.Create;
            UpdatePolicyName = PlatformPermissions.Tasks.Edit;
            DeletePolicyName = PlatformPermissions.Tasks.Delete;
        }

        // --- 1. GET (Tek Kayıt) ---
        public override async Task<TaskDto> GetAsync(Guid id)
        {
            var query = await Repository.GetQueryableAsync();
            var task = await query
                .Include(x => x.Assignee)
                .Include(x => x.SubTasks)
                .Include(x => x.Comments)
                .Include(x => x.Attachments)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (task == null) throw new Volo.Abp.Domain.Entities.EntityNotFoundException(typeof(TaskItem), id);

            // Kapsamlı Rol ve Gizlilik Kontrolü (APYA-22)
            bool isImpersonated = CurrentUser.FindClaim(Volo.Abp.Security.Claims.AbpClaimTypes.ImpersonatorUserId) != null;
            bool canManageTeam = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam);

            if (task.IsPrivate)
            {
                if (isImpersonated)
                {
                    throw new Volo.Abp.BusinessException(PlatformDomainErrorCodes.TaskViewImpersonationDenied);
                }
                
                if (!canManageTeam && task.CreatorId != CurrentUser.Id && task.AssigneeId != CurrentUser.Id)
                {
                    throw new Volo.Abp.BusinessException(PlatformDomainErrorCodes.TaskViewPrivateDenied);
                }
            }

            var taskDto = ObjectMapper.Map<TaskItem, TaskDto>(task);
            if (task.Assignee != null) taskDto.AssigneeName = task.Assignee.UserName;
            
            // Populate usernames for comments
            if (taskDto.Comments != null && taskDto.Comments.Any())
            {
                var commentUserIds = task.Comments.Select(c => c.CreatorId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
                var commentUsers = await _identityRepository.GetListAsync(u => commentUserIds.Contains(u.Id));
                var userMap = commentUsers.ToDictionary(u => u.Id, u => u.UserName);
                
                foreach (var c in taskDto.Comments)
                {
                    var entityComment = task.Comments.FirstOrDefault(x => x.Id == c.Id);
                    c.AuthorName = (entityComment?.CreatorId.HasValue == true && userMap.ContainsKey(entityComment.CreatorId.Value)) ? userMap[entityComment.CreatorId.Value] : "Bilinmeyen Kullanıcı";
                }
            }

            // Populate usernames for attachments
            if (taskDto.Attachments != null && taskDto.Attachments.Any())
            {
                var attUserIds = task.Attachments.Select(a => a.CreatorId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
                var attUsers = await _identityRepository.GetListAsync(u => attUserIds.Contains(u.Id));
                var userMap = attUsers.ToDictionary(u => u.Id, u => u.UserName);
                
                foreach (var a in taskDto.Attachments)
                {
                    var entityAtt = task.Attachments.FirstOrDefault(x => x.Id == a.Id);
                    a.UploaderName = (entityAtt?.CreatorId.HasValue == true && userMap.ContainsKey(entityAtt.CreatorId.Value)) ? userMap[entityAtt.CreatorId.Value] : "Sistem";
                    a.DownloadUrl = "/file/get/" + entityAtt?.StoredFileName;
                }
            }

            // --- BAĞIMLILIKLARIN EKLENMESİ (APYA-30) ---
            var dependencies = await _dependencyRepository.GetListAsync(x => x.TaskId == id);
            taskDto.PredecessorIds = dependencies.Select(d => d.PredecessorTaskId).ToList();

            return taskDto;
        }

        // --- 2. CREATE (Ekleme) - REV-001: Rich Domain Model ---
        public override async Task<TaskDto> CreateAsync(CreateUpdateTaskDto input)
        {
            var newTask = new TaskItem(
                GuidGenerator.Create(),
                input.Title,
                projectId: input.ProjectId,
                parentTaskId: input.ParentTaskId,
                description: input.Description,
                startDate: input.StartDate,
                dueDate: input.DueDate,
                priority: input.Priority,
                assigneeId: input.AssigneeId,
                isPrivate: input.IsPrivate
            );

            // Durum varsayılandan farklıysa set et
            if (input.Status != Apya.Platform.Tasks.TaskStatus.Todo)
            {
                newTask.ChangeStatus(input.Status, Clock.Now);
            }

            await Repository.InsertAsync(newTask);

            // --- BAĞIMLILIKLARIN KAYDEDILMESI (APYA-30) ---
            if (input.PredecessorIds != null && input.PredecessorIds.Any())
            {
                foreach (var predId in input.PredecessorIds)
                {
                    await _dependencyRepository.InsertAsync(new TaskDependency(GuidGenerator.Create(), newTask.Id, predId));
                }
            }

            // BİLDİRİM: Görev atandı etkinliği yayınla
            if (input.AssigneeId.HasValue)
            {
                await _localEventBus.PublishAsync(new TaskAssignedEto
                {
                    TaskId         = newTask.Id,
                    TaskTitle      = newTask.Title,
                    AssigneeId     = input.AssigneeId.Value,
                    ModifierUserId = CurrentUser.Id,
                    AssignerName   = CurrentUser.UserName ?? "Sistem"
                });
            }

            // REV-002: Manuel DTO yerine AutoMapper
            var taskDto = ObjectMapper.Map<TaskItem, TaskDto>(newTask);
            taskDto.PredecessorIds = input.PredecessorIds ?? new();

            if (input.AssigneeId.HasValue)
            {
                var user = await _userRepository.FindAsync(input.AssigneeId.Value);
                taskDto.AssigneeName = user?.UserName;
            }

            return taskDto;
        }

        // --- 3. UPDATE (Güncelleme) - REV-001: Rich Domain Model ---
        public override async Task<TaskDto> UpdateAsync(Guid id, CreateUpdateTaskDto input)
        {
            await CheckUpdatePolicyAsync();

            var task = await Repository.GetAsync(id);

            // Özel Yetki Kuralı
            if (task.CreatorId != CurrentUser.Id && task.AssigneeId != CurrentUser.Id)
            {
                if (!await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam))
                {
                    throw new Volo.Abp.BusinessException(PlatformDomainErrorCodes.TaskUpdateDenied);
                }
            }

            // Rich Domain: tüm alanları tek metotta güncelle
            var previousAssigneeId = task.Update(
                input.Title,
                input.Description,
                input.StartDate,
                input.DueDate,
                input.Priority,
                input.Status,
                input.AssigneeId,
                input.IsPrivate,
                Clock.Now
            );

            await Repository.UpdateAsync(task);

            // --- BAĞIMLILIKLARIN GÜNCELLENMESI (APYA-30) ---
            await _dependencyRepository.DeleteDirectAsync(x => x.TaskId == id);
            if (input.PredecessorIds != null && input.PredecessorIds.Any())
            {
                foreach (var predId in input.PredecessorIds)
                {
                    await _dependencyRepository.InsertAsync(new TaskDependency(GuidGenerator.Create(), id, predId));
                }
            }

            // BİLDİRİM: Atanan kişi değiştiyse event yayınla
            if (task.AssigneeId.HasValue && task.AssigneeId != previousAssigneeId)
            {
                await _localEventBus.PublishAsync(new TaskAssignedEto
                {
                    TaskId         = task.Id,
                    TaskTitle      = task.Title,
                    AssigneeId     = task.AssigneeId.Value,
                    ModifierUserId = CurrentUser.Id,
                    AssignerName   = CurrentUser.UserName ?? "Sistem"
                });
            }

            // REV-002: Manuel DTO yerine AutoMapper
            var taskDto = ObjectMapper.Map<TaskItem, TaskDto>(task);
            taskDto.PredecessorIds = input.PredecessorIds ?? new();

            if (task.AssigneeId.HasValue)
            {
                var user = await _userRepository.FindAsync(task.AssigneeId.Value);
                taskDto.AssigneeName = user?.UserName;
            }

            return taskDto;
        }

        // --- 4. DELETE (Silme) ---
        public override async Task DeleteAsync(Guid id)
        {
            await CheckDeletePolicyAsync();

            var task = await Repository.GetAsync(id);

            // Özel Yetki Kuralı: Görevi sadece oluşturan veya atanan kişi (ya da projelere yönetim yetkisi olan) silebilir.
            if (task.CreatorId != CurrentUser.Id && task.AssigneeId != CurrentUser.Id)
            {
                if (!await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam))
                {
                    throw new Volo.Abp.BusinessException(PlatformDomainErrorCodes.TaskDeleteDenied);
                }
            }

            // Bağımlılıkları da temizleyelim (APYA-30)
            await _dependencyRepository.DeleteDirectAsync(x => x.TaskId == id || x.PredecessorTaskId == id);

            await base.DeleteAsync(id);
        }

        // --- 5. LIST (Listeleme & Filtreleme) ---
        // 2. KİLİT NOKTA: Artık PagedAndSortedResultRequestDto değil, GetTasksInput alıyor.
        protected override async Task<IQueryable<TaskItem>> CreateFilteredQueryAsync(GetTasksInput input)
        {
            var query = await base.CreateFilteredQueryAsync(input);

            // Gelişmiş Gizlilik Filtresi (APYA-22)
            bool isImpersonated = CurrentUser.FindClaim(Volo.Abp.Security.Claims.AbpClaimTypes.ImpersonatorUserId) != null;
            bool canManageTeam = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam);
            var currentUserId = CurrentUser.Id;

            // 1. Eğer impersonated ise (örn. Admin), diğer tenantın "gizli" verilerini ASLA göremez.
            // 2. Normal kullanıcıysa; gizli görevleri sadece kendisi açtıysa, kendisine atandıysa VEYA yöneticiyse görebilir.
            query = query.Where(t => 
                !t.IsPrivate || 
                (!isImpersonated && (canManageTeam || t.CreatorId == currentUserId || t.AssigneeId == currentUserId))
            );

            return query
                .WhereIf(input.ProjectId.HasValue, t => t.ProjectId == input.ProjectId)
                .WhereIf(input.AssigneeId.HasValue, t => t.AssigneeId == input.AssigneeId)
                .WhereIf(input.Statuses != null && input.Statuses.Any(), t => input.Statuses!.Contains(t.Status))
                .WhereIf(input.MinDueDate.HasValue, t => t.DueDate >= input.MinDueDate.Value)
                .WhereIf(input.MaxDueDate.HasValue, t => t.DueDate <= input.MaxDueDate.Value)
                .Include(t => t.Assignee)
                .Include(t => t.ParentTask);
        }

        // --- 5. USER LOOKUP (Kullanıcı Listesi) ---
        public async Task<ListResultDto<IdentityUserDto>> GetUsersLookupAsync()
        {
            var users = await _userRepository.GetListAsync();
            var userDtos = users.Select(u => new IdentityUserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Name = u.Name,
                Surname = u.Surname,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                IsActive = true
            }).ToList();

            return new ListResultDto<IdentityUserDto>(userDtos);
        }

        // --- 6. YORUM METODLARI ---
        public async Task AddCommentAsync(Guid taskId, string text)
        {
            var comment = await _commentRepository.InsertAsync(new TaskComment(taskId, text));

            // BİLDİRİM: Yorum yapıldı event'ini yayınla
            var task = await Repository.GetAsync(taskId);
            await _localEventBus.PublishAsync(new TaskCommentAddedEto
            {
                TaskId        = taskId,
                TaskTitle     = task.Title,
                AssigneeId    = task.AssigneeId,
                CreatorId     = task.CreatorId,
                CommentUserId = CurrentUser.Id ?? Guid.Empty,
                CommenterName = CurrentUser.UserName ?? "Bilinmeyen",
                CommentText   = text
            });
        }


        public async Task<List<TaskCommentDto>> GetCommentsAsync(Guid taskId)
        {
            var comments = await _commentRepository.GetListAsync(x => x.TaskId == taskId);

            var userIds = comments
                .Select(c => c.CreatorId)
                .Where(id => id.HasValue)
                .Select(id => id!.Value)
                .Distinct()
                .ToList();

            var userQueryable = await _identityRepository.GetQueryableAsync();
            var users = await userQueryable.Where(u => userIds.Contains(u.Id)).ToListAsync();
            var userDictionary = users.ToDictionary(u => u.Id, u => u.UserName);

            return comments.Select(c => new TaskCommentDto
            {
                Id = c.Id,
                Text = c.Text,
                CreationTime = c.CreationTime,
                AuthorName = (c.CreatorId.HasValue && userDictionary.ContainsKey(c.CreatorId.Value))
                             ? userDictionary[c.CreatorId.Value]
                             : "Bilinmeyen Kullanıcı"
            })
            .OrderByDescending(x => x.CreationTime)
            .ToList();
        }

        // --- 7. DOSYA METODLARI ---
        public async Task AddAttachmentAsync(Guid taskId, string fileName, string storedFileName, long fileSize)
        {
            await _attachmentRepository.InsertAsync(new TaskAttachment
            {
                TaskId = taskId,
                FileName = fileName,
                StoredFileName = storedFileName,
                FileSize = fileSize,
                ContentType = "application/octet-stream"
            });
        }

        public async Task<List<TaskAttachmentDto>> GetAttachmentsAsync(Guid taskId)
        {
            var attachments = await _attachmentRepository.GetListAsync(x => x.TaskId == taskId);

            var userIds = attachments.Select(x => x.CreatorId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
            var userQueryable = await _identityRepository.GetQueryableAsync();
            var users = await userQueryable.Where(u => userIds.Contains(u.Id)).ToListAsync();
            var userDict = users.ToDictionary(k => k.Id, v => v.UserName);

            return attachments.Select(x => new TaskAttachmentDto
            {
                Id = x.Id,
                CreationTime = x.CreationTime,
                FileName = x.FileName,
                FileSize = x.FileSize,
                DownloadUrl = "/file/get/" + x.StoredFileName,
                UploaderName = (x.CreatorId.HasValue && userDict.ContainsKey(x.CreatorId.Value)) ? userDict[x.CreatorId.Value] : "Sistem"
            }).ToList();
        }

        public async Task UpdateStatusAsync(Guid id, Apya.Platform.Tasks.TaskStatus status)
        {
            var task = await Repository.GetAsync(id);
            var oldStatus = task.Status;
            // REV-001: Rich Domain Model kullan
            task.ChangeStatus(status, Clock.Now);

            await Repository.UpdateAsync(task);

            // BİLDİRİM: Durum değişikliğini yayınla
            await _localEventBus.PublishAsync(new TaskStatusChangedEto
            {
                TaskId         = id,
                TaskTitle      = task.Title,
                OldStatus      = oldStatus,
                NewStatus      = status,
                AssigneeId     = task.AssigneeId,
                CreatorId      = task.CreatorId,
                ModifierUserId = CurrentUser.Id,
                ChangedByName  = CurrentUser.UserName ?? "Bilinmeyen"
            });
        }

        // --- ZAMAN TAKİBİ ---
        public async Task StartTimeTrackingAsync(Guid taskId)
        {
            // Zaten açık bir log var mı? (Aynı anda sadece bir timer çalışabilir)
            var activeLog = await _timeLogRepository.FirstOrDefaultAsync(x => x.UserId == CurrentUser.Id && x.EndTime == null);
            if (activeLog != null) throw new Volo.Abp.UserFriendlyException("Zaten çalışan bir saymanınız var.");

            await _timeLogRepository.InsertAsync(new TaskTimeLog(GuidGenerator.Create(), taskId, CurrentUser.Id!.Value, Clock.Now));
        }

        public async Task StopTimeTrackingAsync(Guid taskId)
        {
            var log = await _timeLogRepository.FirstOrDefaultAsync(x => x.TaskId == taskId && x.UserId == CurrentUser.Id && x.EndTime == null);
            if (log == null) return;

            log.EndTime = Clock.Now;
            log.SecondsSpent = (long)(log.EndTime.Value - log.StartTime).TotalSeconds;
            
            await _timeLogRepository.UpdateAsync(log);

            // BÜTÇE: Proje saatlik maliyeti varsa bütçeden düşelim logic buraya gelebilir.
        }

        public async Task<List<TaskTimeLogDto>> GetTimeLogsAsync(Guid taskId)
        {
            var logs = await _timeLogRepository.GetListAsync(x => x.TaskId == taskId);
            var userIds = logs.Select(x => x.UserId).Distinct().ToList();
            var users = await _identityRepository.GetListAsync(u => userIds.Contains(u.Id));
            var userMap = users.ToDictionary(u => u.Id, u => u.UserName);

            return logs.Select(x => new TaskTimeLogDto
            {
                Id = x.Id,
                TaskId = x.TaskId,
                UserId = x.UserId,
                UserName = userMap.ContainsKey(x.UserId) ? userMap[x.UserId] : "Bilinmeyen",
                StartTime = x.StartTime,
                EndTime = x.EndTime,
                SecondsSpent = x.SecondsSpent,
                Note = x.Note
            }).ToList();
        }

        public async Task<TaskTimeLogDto?> GetActiveTimeLogAsync()
        {
            var log = await _timeLogRepository.FirstOrDefaultAsync(x => x.UserId == CurrentUser.Id && x.EndTime == null);
            if (log == null) return null;

            return new TaskTimeLogDto
            {
                Id = log.Id,
                TaskId = log.TaskId,
                UserId = log.UserId,
                StartTime = log.StartTime
            };
        }
    }
}

