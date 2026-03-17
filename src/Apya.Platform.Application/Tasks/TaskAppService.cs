using System;
using System.Collections.Generic;
using System.Linq; // WhereIf için şart
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;

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
        private readonly IRepository<IdentityUser, Guid> _identityRepository;

        public TaskAppService(
            IRepository<TaskItem, Guid> repository,
            IIdentityUserRepository userRepository,
            IRepository<TaskComment, Guid> commentRepository,
            IRepository<TaskAttachment, Guid> attachmentRepository,
            IRepository<IdentityUser, Guid> identityRepository)
            : base(repository)
        {
            _userRepository = userRepository;
            _commentRepository = commentRepository;
            _attachmentRepository = attachmentRepository;
            _identityRepository = identityRepository;
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
                ProjectId = input.ProjectId // KİLİT NOKTA: Proje ID'sini veritabanına kaydediyoruz!
            };

            await Repository.InsertAsync(newTask);

            string? assigneeName = null;
            if (input.AssigneeId.HasValue)
            {
                var user = await _userRepository.FindAsync(input.AssigneeId.Value);
                assigneeName = user?.UserName;
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
                ProjectId = newTask.ProjectId
            };
        }

        // --- 3. UPDATE (Güncelleme) ---
        public override async Task<TaskDto> UpdateAsync(Guid id, CreateUpdateTaskDto input)
        {
            var task = await Repository.GetAsync(id);

            task.Title = input.Title;
            task.Description = input.Description;
            task.StartDate = input.StartDate;
            task.DueDate = input.DueDate;
            task.Priority = input.Priority;
            task.Status = input.Status;
            task.AssigneeId = input.AssigneeId;
            // Not: Proje ID genelde güncellenmez, görev bir projeye aittir. O yüzden eklemiyoruz.

            await Repository.UpdateAsync(task);

            string? assigneeName = null;
            if (task.AssigneeId.HasValue)
            {
                var user = await _userRepository.FindAsync(task.AssigneeId.Value);
                assigneeName = user?.UserName;
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
                AssigneeName = assigneeName
            };
        }

        // --- 4. LIST (Listeleme & Filtreleme) ---
        // 2. KİLİT NOKTA: Artık PagedAndSortedResultRequestDto değil, GetTasksInput alıyor.
        protected override async Task<IQueryable<TaskItem>> CreateFilteredQueryAsync(GetTasksInput input)
        {
            var query = await base.CreateFilteredQueryAsync(input);

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
            await _commentRepository.InsertAsync(new TaskComment(taskId, text));
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
    }
}