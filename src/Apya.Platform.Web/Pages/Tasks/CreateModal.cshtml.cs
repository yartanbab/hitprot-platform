using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Apya.Platform.Tasks;

namespace Apya.Platform.Web.Pages.Tasks;

public class CreateModalModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid? ProjectId { get; set; }

    [BindProperty]
    public CreateUpdateTaskDto Task { get; set; } = new();

    // Birleşik "Durum / Kolon" seçimi — "s:<int>" sistem durumu, "c:<guid>" özel kolon.
    [BindProperty]
    public string? StatusOrColumn { get; set; }

    public List<SelectListItem> UserList { get; set; } = new();
    public List<SelectListItem> StatusOrColumnList { get; set; } = new();

    private readonly ITaskAppService _taskAppService;
    private readonly Apya.Platform.Projects.IBoardColumnAppService _boardColumnAppService;

    public CreateModalModel(
        ITaskAppService taskAppService,
        Apya.Platform.Projects.IBoardColumnAppService boardColumnAppService)
    {
        _taskAppService = taskAppService;
        _boardColumnAppService = boardColumnAppService;
    }

    public async System.Threading.Tasks.Task OnGetAsync()
    {
        Task = new CreateUpdateTaskDto
        {
            ProjectId = ProjectId,
            StartDate = Clock.Now,
            DueDate = Clock.Now.AddDays(7),
            Priority = TaskPriority.Medium,
            Status = Apya.Platform.Tasks.TaskStatus.Todo
        };

        var userLookup = await _taskAppService.GetUsersLookupAsync();
        UserList = userLookup.Items
            .Select(u => new SelectListItem(u.UserName, u.Id.ToString()))
            .ToList();

        await BuildStatusOrColumnListAsync(ProjectId);
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (ProjectId.HasValue && Task.ProjectId == null)
        {
            Task.ProjectId = ProjectId;
        }

        // Birleşik Durum/Kolon seçimini uzlaştır: özel kolon → BoardColumnId (Status=Todo),
        // sistem durumu → Status. Boşsa varsayılan Todo kalır.
        if (!string.IsNullOrEmpty(StatusOrColumn))
        {
            if (StatusOrColumn.StartsWith("c:") && Guid.TryParse(StatusOrColumn.Substring(2), out var colId))
            {
                Task.BoardColumnId = colId;
            }
            else if (StatusOrColumn.StartsWith("s:") && int.TryParse(StatusOrColumn.Substring(2), out var sv))
            {
                Task.Status = (Apya.Platform.Tasks.TaskStatus)sv;
                Task.BoardColumnId = null;
            }
        }

        await _taskAppService.CreateAsync(Task);
        return NoContent();
    }

    // Proje verilmişse kanban kolonlarını (sistem = s:<status>, özel = c:<guid>) + İptal,
    // yoksa sistem durumlarını listeler. Varsayılan seçili: Yapılacak.
    private async System.Threading.Tasks.Task BuildStatusOrColumnListAsync(Guid? projectId)
    {
        StatusOrColumnList = new List<SelectListItem>();
        if (projectId.HasValue)
        {
            try
            {
                var cols = await _boardColumnAppService.GetListByProjectAsync(projectId.Value);
                foreach (var c in cols.OrderBy(c => c.Order))
                {
                    var val = c.StatusValue.HasValue ? "s:" + c.StatusValue.Value : "c:" + c.Id;
                    StatusOrColumnList.Add(new SelectListItem(c.Name, val, c.StatusValue == 1));
                }
                StatusOrColumnList.Add(new SelectListItem("İptal", "s:0", false));
                return;
            }
            catch { /* yetki/erişim yoksa sistem durumlarına düş */ }
        }

        foreach (var (label, sv) in new[] { ("Yapılacak", 1), ("Devam Ediyor", 2), ("Kontrol/Test", 3), ("Tamamlandı", 4), ("İptal", 0) })
        {
            StatusOrColumnList.Add(new SelectListItem(label, "s:" + sv, sv == 1));
        }
    }
}