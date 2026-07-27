using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Services;
using Microsoft.AspNetCore.Authorization;
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

        // Birleşik "Durum / Kolon" seçimi — "s:<int>" sistem durumu, "c:<guid>" özel kolon.
        [BindProperty]
        public string? StatusOrColumn { get; set; }

        // Null hatalarını önlemek için listeleri burada başlatıyoruz
        public List<SelectListItem> UserList { get; set; } = new();
        public List<SelectListItem> StatusOrColumnList { get; set; } = new(); // Durum + özel kolonlar
        public List<SelectListItem> PriorityList { get; set; } = new(); // Öncelik (Türkçe)
        public List<string> AllTagNames { get; set; } = new(); // Select2 tags:true başlangıç seçenekleri
        public List<TaskDto> SubTasks { get; set; } = new();
        public List<TaskCommentDto> Comments { get; set; } = new();
        public List<TaskAttachmentDto> Attachments { get; set; } = new();
        public List<ExpenseDto> TaskExpenses { get; set; } = new();
        public List<IncomeEntryDto> TaskIncomes { get; set; } = new();
        public List<TaskDto> ProjectTasks { get; set; } = new();

        // Satır tıklayınca açılan panelden silme — tablodaki eski çöp kutusu ile aynı yetki kuralı
        // (ManageTeam yetkisi VEYA görevin oluşturucusu/atananı).
        public bool CanDelete { get; set; }

        private readonly ITaskAppService _taskAppService;
        private readonly IUploadedFileStorage _fileStorage;
        private readonly IExpenseAppService _expenseAppService;
        private readonly IIncomeEntryAppService _incomeEntryAppService;
        private readonly Apya.Platform.Projects.IBoardColumnAppService _boardColumnAppService;

        public EditModalModel(
            ITaskAppService taskAppService,
            IUploadedFileStorage fileStorage,
            IExpenseAppService expenseAppService,
            IIncomeEntryAppService incomeEntryAppService,
            Apya.Platform.Projects.IBoardColumnAppService boardColumnAppService)
        {
            _taskAppService = taskAppService;
            _fileStorage = fileStorage;
            _expenseAppService = expenseAppService;
            _incomeEntryAppService = incomeEntryAppService;
            _boardColumnAppService = boardColumnAppService;
        }

        // Birleşik "Durum / Kolon" listesini kurar: proje varsa kanban kolonları
        // (sistem = s:<status>, özel = c:<guid>) + İptal; yoksa sistem durumları.
        private async Task BuildStatusOrColumnListAsync(Guid? projectId, Apya.Platform.Tasks.TaskStatus status, Guid? boardColumnId)
        {
            var selected = boardColumnId.HasValue ? "c:" + boardColumnId.Value : "s:" + (int)status;
            StatusOrColumnList = new List<SelectListItem>();

            // Sistem durumları her zaman (seed durumundan bağımsız, board'la aynı isimler)
            foreach (var (label, sv) in new[] { ("Yapılacak", 1), ("Sürüyor", 2), ("Testte", 3), ("Tamamlandı", 4) })
            {
                StatusOrColumnList.Add(new SelectListItem(label, "s:" + sv, selected == "s:" + sv));
            }

            // Projenin özel kolonları (StatusValue=null) sıraya göre eklenir
            if (projectId.HasValue)
            {
                try
                {
                    var cols = await _boardColumnAppService.GetListByProjectAsync(projectId.Value);
                    foreach (var c in cols.Where(c => !c.StatusValue.HasValue).OrderBy(c => c.Order))
                    {
                        var val = "c:" + c.Id;
                        StatusOrColumnList.Add(new SelectListItem(c.Name, val, val == selected));
                    }
                }
                catch { /* yetki/erişim yoksa yalnızca sistem durumları */ }
            }

            StatusOrColumnList.Add(new SelectListItem("İptal", "s:0", selected == "s:0"));
        }

        // Form'dan gelen birleşik seçimi Task.Status + Task.BoardColumnId'ye uzlaştırır.
        private void ApplyStatusOrColumn(Apya.Platform.Tasks.TaskStatus currentStatus)
        {
            if (string.IsNullOrEmpty(StatusOrColumn)) return;
            if (StatusOrColumn.StartsWith("c:") && Guid.TryParse(StatusOrColumn.Substring(2), out var colId))
            {
                Task.BoardColumnId = colId;
                Task.Status = currentStatus; // özel kolon Status'u değiştirmez
            }
            else if (StatusOrColumn.StartsWith("s:") && int.TryParse(StatusOrColumn.Substring(2), out var sv))
            {
                Task.Status = (Apya.Platform.Tasks.TaskStatus)sv;
                Task.BoardColumnId = null;
            }
        }

        public async Task OnGetAsync()
        {
            var taskDto = await _taskAppService.GetAsync(Id);

            CanDelete = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam)
                        || taskDto.CreatorId == CurrentUser.Id
                        || taskDto.AssigneeId == CurrentUser.Id;

            Task = new CreateUpdateTaskDto
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                StartDate = taskDto.StartDate,
                DueDate = taskDto.DueDate,
                Priority = taskDto.Priority,
                Status = taskDto.Status,
                BoardColumnId = taskDto.BoardColumnId,
                AssigneeId = taskDto.AssigneeId,
                ProjectId = taskDto.ProjectId ?? Guid.Empty,
                IsPrivate = taskDto.IsPrivate,
                PredecessorIds = taskDto.PredecessorIds ?? new List<Guid>(),
                TagNames = taskDto.Tags?.Select(t => t.Name).ToList() ?? new List<string>()
            };

            SubTasks = taskDto.SubTasks?.OrderByDescending(x => x.CreationTime).ToList() ?? new List<TaskDto>();
            // Tek seviye thread: kök yorumlar (en yeni üstte) + altlarında yanıtlar (kronolojik).
            var allComments = taskDto.Comments ?? new List<TaskCommentDto>();
            var rootComments = allComments.Where(c => c.ParentCommentId == null)
                                          .OrderByDescending(c => c.CreationTime).ToList();
            foreach (var root in rootComments)
            {
                root.Replies = allComments.Where(r => r.ParentCommentId == root.Id)
                                          .OrderBy(r => r.CreationTime).ToList();
            }
            Comments = rootComments;
            Attachments = taskDto.Attachments?.OrderByDescending(x => x.CreationTime).ToList() ?? new List<TaskAttachmentDto>();

            var userLookup = await _taskAppService.GetUsersLookupAsync();
            UserList = userLookup.Items
                .Select(u => new SelectListItem(u.UserName, u.Id.ToString()))
                .ToList();

            AllTagNames = (await _taskAppService.GetAllTagsAsync()).Select(t => t.Name).ToList();

            // Durum artık birleşik "Durum/Kolon" dropdown'ından geliyor (StatusOrColumnList).
            PriorityList = new List<SelectListItem>
            {
                new("Düşük",  ((int)TaskPriority.Low).ToString(),      Task.Priority == TaskPriority.Low),
                new("Orta",   ((int)TaskPriority.Medium).ToString(),   Task.Priority == TaskPriority.Medium),
                new("Yüksek", ((int)TaskPriority.High).ToString(),     Task.Priority == TaskPriority.High),
                new("Kritik", ((int)TaskPriority.Critical).ToString(), Task.Priority == TaskPriority.Critical),
            };

            // Birleşik Durum/Kolon dropdown'ı (özel kanban kolonları dahil)
            await BuildStatusOrColumnListAsync(taskDto.ProjectId, taskDto.Status, taskDto.BoardColumnId);

            if (taskDto.ProjectId.HasValue)
            {
                var projectTasksResult = await _taskAppService.GetListAsync(new GetTasksInput
                {
                    ProjectId = taskDto.ProjectId,
                    MaxResultCount = 1000,
                    SkipCount = 0
                });
                ProjectTasks = projectTasksResult.Items
                    .Where(t => t.Id != Id)
                    .OrderBy(t => t.Title)
                    .ToList();
            }

            var expensePage = await _expenseAppService.GetListAsync(
                new GetExpensesInput { TaskId = Id, MaxResultCount = 500 });
            TaskExpenses = expensePage.Items.OrderByDescending(x => x.ExpenseDate).ToList();

            var incomePage = await _incomeEntryAppService.GetListAsync(
                new GetIncomeEntriesInput { TaskId = Id, MaxResultCount = 500 });
            TaskIncomes = incomePage.Items.OrderByDescending(x => x.IncomeDate).ToList();
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

                // Mevcut görevi bir kez çek: ProjectId koruması + özel kolon seçilince Status koruması.
                var current = await _taskAppService.GetAsync(Id);
                if (!Task.ProjectId.HasValue || Task.ProjectId == Guid.Empty)
                {
                    Task.ProjectId = current.ProjectId;
                }

                // Birleşik Durum/Kolon seçimini Task.Status + Task.BoardColumnId'ye uzlaştır
                ApplyStatusOrColumn(current.Status);

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
                StartDate = Clock.Now
            };

            // Yeni alt görevin Id'sini döndür ki istemci, satırı anında çalışır
            // (düzenle/sil butonlu) render edebilsin — eskiden NoContent dönüp
            // butonları disabled bırakıyordu, ancak reopen sonrası çalışıyordu.
            var created = await _taskAppService.CreateAsync(subTask);
            return new JsonResult(new { id = created.Id, title = created.Title });
        }

        public async Task<IActionResult> OnPostAddCommentAsync(Guid taskId, string commentText)
        {
            if (string.IsNullOrWhiteSpace(commentText)) return NoContent();
            // Yeni yorumun Id'sini döndür ki istemci, satırı düzenle/sil butonlu çizebilsin.
            var id = await _taskAppService.AddCommentAsync(taskId, commentText);
            return new JsonResult(new { id });
        }

        public async Task<IActionResult> OnPostReplyCommentAsync(Guid parentCommentId, string commentText)
        {
            if (string.IsNullOrWhiteSpace(commentText)) return NoContent();
            var id = await _taskAppService.ReplyToCommentAsync(parentCommentId, commentText);
            return new JsonResult(new { id, author = CurrentUser.UserName ?? "Siz" });
        }

        public async Task<IActionResult> OnPostUploadFileAsync(Guid taskId, IFormFile file)
        {
            if (file == null || file.Length == 0) return NoContent();

            var storedFileName = await _fileStorage.StoreAsync(file);
            await _taskAppService.AddAttachmentAsync(taskId, file.FileName, storedFileName, file.Length);
            return NoContent();
        }
    }
}