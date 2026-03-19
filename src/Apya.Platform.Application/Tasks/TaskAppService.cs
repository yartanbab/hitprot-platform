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

            // APYA-22: Impersonation Gizlilik Kontrolü
            bool isImpersonated = CurrentUser.FindClaim(Volo.Abp.Security.Claims.AbpClaimTypes.ImpersonatorUserId) != null;
            if (isImpersonated && task.IsPrivate)
            {
                throw new Volo.Abp.Authorization.AbpAuthorizationException("Bu özel görevi görüntüleme yetkiniz yok.");
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

        // --- 2. CREATE (Ekleme) ---
        public override async Task<TaskDto> CreateAsync(CreateUpdateTaskDto input)
        {
            var newTask = new TaskItem
            {
                Title = input.Title,
                Description = input.Description,
                StartDate = input.StartDate,
                DueDate = input.DueDate,
                Status = input.Status,
                Priority = input.Priority,
                AssigneeId = input.AssigneeId,
                ParentTaskId = input.ParentTaskId,
                ProjectId = input.ProjectId, // KİLİT NOKTA: Proje ID'sini veritabanına kaydediyoruz!
                IsPrivate = input.IsPrivate 
            };

            await Repository.InsertAsync(newTask);

            // --- BAĞIMLILIKLARIN KAYDEDİLMESİ (APYA-30) ---
            if (input.PredecessorIds != null && input.PredecessorIds.Any())
            {
                foreach (var predId in input.PredecessorIds)
                {
                    await _dependencyRepository.InsertAsync(new TaskDependency(GuidGenerator.Create(), newTask.Id, predId));
                }
            }

            string? assigneeName = null;
            if (input.AssigneeId.HasValue)
            {
                var user = await _userRepository.FindAsync(input.AssigneeId.Value);
                assigneeName = user?.UserName;

                // BİLDİRİM: Görev atandı etkinliği yayınla
                await _localEventBus.PublishAsync(new TaskAssignedEto
                {
                    TaskId       = newTask.Id,
                    TaskTitle    = newTask.Title,
                    AssigneeId   = input.AssigneeId.Value,
                    AssignerName = CurrentUser.UserName ?? "Sistem"
                });
            }

            return new TaskDto
            {
                Id = newTask.Id,
                Title = newTask.Title,
                Description = newTask.Description,
                StartDate = newTask.StartDate,
                DueDate = newTask.DueDate,
                Status = newTask.Status,
                Priority = newTask.Priority,
                AssigneeId = newTask.AssigneeId,
                AssigneeName = assigneeName,
                ParentTaskId = newTask.ParentTaskId,
                ProjectId = newTask.ProjectId,
                PredecessorIds = input.PredecessorIds ?? new()
            };
        }

        // --- 3. UPDATE (Güncelleme) ---
        public override async Task<TaskDto> UpdateAsync(Guid id, CreateUpdateTaskDto input)
        {
            await CheckUpdatePolicyAsync();

            var task = await Repository.GetAsync(id);

            // Özel Yetki Kuralı: Görevi sadece oluşturan veya atanan kişi (ya da projelere yönetim yetkisi olan) güncelleyebilir.
            if (task.CreatorId != CurrentUser.Id && task.AssigneeId != CurrentUser.Id)
            {
                if (!await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam))
                {
                    throw new Volo.Abp.Authorization.AbpAuthorizationException("Bu görevi güncellemek için yetkiniz yok. Sadece görevi oluşturan veya atanan kişi güncelleyebilir.");
                }
            }

            task.Title = input.Title;
            task.Description = input.Description;
            task.StartDate = input.StartDate;
            task.DueDate = input.DueDate;
            task.Priority = input.Priority;
            task.Status = input.Status;
            task.AssigneeId = input.AssigneeId;
            task.IsPrivate = input.IsPrivate;
            // Not: Proje ID genelde güncellenmez, görev bir projeye aittir. O yüzden eklemiyoruz.

            var previousAssigneeId = (await Repository.GetAsync(id)).AssigneeId;
            await Repository.UpdateAsync(task);

            // --- BAĞIMLILIKLARIN GÜNCELLENMESİ (APYA-30) ---
            await _dependencyRepository.DeleteDirectAsync(x => x.TaskId == id);
            if (input.PredecessorIds != null && input.PredecessorIds.Any())
            {
                foreach (var predId in input.PredecessorIds)
                {
                    await _dependencyRepository.InsertAsync(new TaskDependency(GuidGenerator.Create(), id, predId));
                }
            }

            string? assigneeName = null;
            if (task.AssigneeId.HasValue)
            {
                var user = await _userRepository.FindAsync(task.AssigneeId.Value);
                assigneeName = user?.UserName;

                // BİLDİRİM: Atanan kişi değiştiyse event yayınla
                if (task.AssigneeId != previousAssigneeId)
                {
                    await _localEventBus.PublishAsync(new TaskAssignedEto
                    {
                        TaskId       = task.Id,
                        TaskTitle    = task.Title,
                        AssigneeId   = task.AssigneeId.Value,
                        AssignerName = CurrentUser.UserName ?? "Sistem"
                    });
                }
            }

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                StartDate = task.StartDate,
                DueDate = task.DueDate,
                Status = task.Status,
                Priority = task.Priority,
                AssigneeId = task.AssigneeId,
                AssigneeName = assigneeName,
                PredecessorIds = input.PredecessorIds ?? new()
            };
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
                    throw new Volo.Abp.Authorization.AbpAuthorizationException("Bu görevi silmek için yetkiniz yok. Sadece görevi oluşturan veya atanan kişi silebilir.");
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

            // APYA-22: Impersonation Gizlilik Kontrolü
            bool isImpersonated = CurrentUser.FindClaim(Volo.Abp.Security.Claims.AbpClaimTypes.ImpersonatorUserId) != null;
            if (isImpersonated)
            {
                query = query.Where(t => !t.IsPrivate);
            }

            return query
                .WhereIf(input.ProjectId.HasValue, t => t.ProjectId == input.ProjectId) // Görevleri Projeye göre izole et!
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

        public async Task UpdateStatusAsync(Guid id, TaskStatus status)
        {
            var task = await Repository.GetAsync(id);
            task.Status = status;

            if (status == TaskStatus.Done)
            {
                task.CompletedDate = Clock.Now;
            }

            await Repository.UpdateAsync(task);
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

