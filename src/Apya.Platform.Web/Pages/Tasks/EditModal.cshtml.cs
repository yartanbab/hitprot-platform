using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Tasks
{
    public class EditModalModel : AbpPageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CreateUpdateTaskDto Task { get; set; } = new();

        // Null hatalarını önlemek için listeleri burada başlatıyoruz
        public List<SelectListItem> UserList { get; set; } = new();
        public List<TaskDto> SubTasks { get; set; } = new();
        public List<TaskCommentDto> Comments { get; set; } = new();
        public List<TaskAttachmentDto> Attachments { get; set; } = new();

        private readonly ITaskAppService _taskAppService;
        private readonly IWebHostEnvironment _environment;

        public EditModalModel(ITaskAppService taskAppService, IWebHostEnvironment environment)
        {
            _taskAppService = taskAppService;
            _environment = environment;
        }

        public async Task OnGetAsync()
        {
            var taskDto = await _taskAppService.GetAsync(Id);

            Task = new CreateUpdateTaskDto
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                StartDate = taskDto.StartDate,
                DueDate = taskDto.DueDate,
                Priority = taskDto.Priority,
                Status = taskDto.Status,
                AssigneeId = taskDto.AssigneeId,
                ProjectId = taskDto.ProjectId ?? Guid.Empty,
                IsPrivate = taskDto.IsPrivate
            };

            SubTasks = taskDto.SubTasks?.OrderByDescending(x => x.CreationTime).ToList() ?? new List<TaskDto>();
            Comments = taskDto.Comments?.OrderByDescending(x => x.CreationTime).ToList() ?? new List<TaskCommentDto>();
            Attachments = taskDto.Attachments?.OrderByDescending(x => x.CreationTime).ToList() ?? new List<TaskAttachmentDto>();

            var userLookup = await _taskAppService.GetUsersLookupAsync();
            UserList = userLookup.Items
                .Select(u => new SelectListItem(u.UserName, u.Id.ToString()))
                .ToList();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                Logger.LogWarning("AutoSave Validation Error: {Errors}", string.Join(", ", errors));
                return BadRequest("Doğrulama Hatası: " + string.Join(", ", errors));
            }

            try 
            {
                // DB CONSTRAINT FIX: Description alanı veritabanında "Not Null" ise hata verir.
                // Eğer formdan null geldiyse boş stringe çevirerek veritabanını tatmin edelim.
                if (Task.Description == null) Task.Description = string.Empty;

                // Task.ProjectId eğer formdan 0'lanmış gelirse, veritabanındaki değeri korumaya çalışalım
                if (!Task.ProjectId.HasValue || Task.ProjectId == Guid.Empty)
                {
                    var current = await _taskAppService.GetAsync(Id);
                    Task.ProjectId = current.ProjectId;
                }

                await _taskAppService.UpdateAsync(Id, Task);
                return NoContent();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "AutoSave System Error for Task {TaskId}", Id);
                return BadRequest("Sistem Hatası: " + ex.Message);
            }
        }

        public async Task<IActionResult> OnPostAddSubTaskAsync(Guid parentId, string subTaskTitle)
        {
            if (string.IsNullOrWhiteSpace(subTaskTitle)) return NoContent();

            var subTask = new CreateUpdateTaskDto
            {
                Title = subTaskTitle,
                ParentTaskId = parentId,
                Status = Apya.Platform.Tasks.TaskStatus.Todo,
                Priority = TaskPriority.Medium,
                StartDate = DateTime.Now
            };

            await _taskAppService.CreateAsync(subTask);
            return NoContent();
        }

        public async Task<IActionResult> OnPostAddCommentAsync(Guid taskId, string commentText)
        {
            if (string.IsNullOrWhiteSpace(commentText)) return NoContent();
            await _taskAppService.AddCommentAsync(taskId, commentText);
            return NoContent();
        }

        public async Task<IActionResult> OnPostUploadFileAsync(Guid taskId, IFormFile file)
        {
            if (file == null || file.Length == 0) return NoContent();

            // BUG-004: Güvenlik — Yalnızca izin verilen dosya uzantıları kabul edilir
            var allowedExtensions = new[] { ".pdf", ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt", ".png", ".jpg", ".jpeg", ".gif", ".txt", ".csv", ".zip", ".rar" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(ext))
            {
                throw new Volo.Abp.BusinessException(PlatformDomainErrorCodes.FileUnsupportedExtension);
            }

            // Dosya boyutu kontrolü (maks 25 MB)
            if (file.Length > 25 * 1024 * 1024)
            {
                throw new Volo.Abp.BusinessException(PlatformDomainErrorCodes.FileSizeExceeded);
            }

            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var storedFileName = Guid.NewGuid().ToString() + ext; // ext zaten doğrulanmış
            var filePath = Path.Combine(uploadsFolder, storedFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            await _taskAppService.AddAttachmentAsync(taskId, file.FileName, storedFileName, file.Length);
            return NoContent();
        }
    }
}