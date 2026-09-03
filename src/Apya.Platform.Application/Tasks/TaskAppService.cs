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
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;

namespace Apya.Platform.Tasks
{
    // SEC-013: Çıplak [Authorize] otomatik API'de (/api/app/task) Tasks.Default'ı atlıyordu.
    [Authorize(PlatformPermissions.Tasks.Default)]
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
        private readonly IRepository<Apya.Platform.Projects.BoardColumn, Guid> _boardColumnRepository;
        private readonly IRepository<Tag, Guid> _tagRepository;
        private readonly IRepository<TaskTagAssignment, Guid> _taskTagRepository;
        private readonly IRepository<TaskFeatureAssignment, Guid> _featureAssignmentRepository;
        private readonly IRepository<TaskChecklistItem, Guid> _checklistRepository;
        private readonly IRepository<TaskDocument, Guid> _documentRepository;
        private readonly IRepository<TaskFavorite, Guid> _favoriteRepository;
        private readonly IRepository<TaskWatcher, Guid> _watcherRepository;
        private readonly TaskManager _taskManager;
        private readonly Apya.Platform.IssueTasks.IssueTaskManager _issueTaskManager;
        private readonly IRepository<Expense, Guid> _expenseRepository;
        private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
        private readonly IRepository<Apya.Platform.Projects.Project, Guid> _projectLookupRepository;
        private readonly IRepository<TaskShareLink, Guid> _shareLinkRepository;
        private readonly ILocalEventBus _localEventBus;
        private readonly Apya.Platform.ProjectBudgets.ProjectBudgetManager _budgetManager;
        private readonly IRepository<Apya.Platform.ProjectBudgets.ProjectBudgetLine, Guid> _budgetLineRepository;

        public TaskAppService(
            IRepository<TaskItem, Guid> repository,
            IIdentityUserRepository userRepository,
            IRepository<TaskComment, Guid> commentRepository,
            IRepository<TaskAttachment, Guid> attachmentRepository,
            IRepository<TaskDependency, Guid> dependencyRepository,
            IRepository<TaskTimeLog, Guid> timeLogRepository,
            IRepository<IdentityUser, Guid> identityRepository,
            IRepository<Apya.Platform.Projects.BoardColumn, Guid> boardColumnRepository,
            IRepository<Tag, Guid> tagRepository,
            IRepository<TaskTagAssignment, Guid> taskTagRepository,
            IRepository<TaskFeatureAssignment, Guid> featureAssignmentRepository,
            IRepository<TaskChecklistItem, Guid> checklistRepository,
            IRepository<TaskDocument, Guid> documentRepository,
            IRepository<TaskFavorite, Guid> favoriteRepository,
            IRepository<TaskWatcher, Guid> watcherRepository,
            TaskManager taskManager,
            Apya.Platform.IssueTasks.IssueTaskManager issueTaskManager,
            IRepository<Expense, Guid> expenseRepository,
            IRepository<IncomeEntry, Guid> incomeRepository,
            IRepository<Apya.Platform.Projects.Project, Guid> projectLookupRepository,
            IRepository<TaskShareLink, Guid> shareLinkRepository,
            ILocalEventBus localEventBus,
            Apya.Platform.ProjectBudgets.ProjectBudgetManager budgetManager,
            IRepository<Apya.Platform.ProjectBudgets.ProjectBudgetLine, Guid> budgetLineRepository)
            : base(repository)
        {
            _budgetManager         = budgetManager;
            _budgetLineRepository  = budgetLineRepository;
            _userRepository        = userRepository;
            _commentRepository     = commentRepository;
            _attachmentRepository  = attachmentRepository;
            _dependencyRepository  = dependencyRepository;
            _timeLogRepository     = timeLogRepository;
            _identityRepository    = identityRepository;
            _boardColumnRepository = boardColumnRepository;
            _tagRepository         = tagRepository;
            _taskTagRepository     = taskTagRepository;
            _featureAssignmentRepository = featureAssignmentRepository;
            _checklistRepository   = checklistRepository;
            _documentRepository    = documentRepository;
            _favoriteRepository    = favoriteRepository;
            _watcherRepository     = watcherRepository;
            _taskManager           = taskManager;
            _issueTaskManager      = issueTaskManager;
            _expenseRepository     = expenseRepository;
            _incomeRepository      = incomeRepository;
            _projectLookupRepository = projectLookupRepository;
            _shareLinkRepository   = shareLinkRepository;
            _localEventBus         = localEventBus;

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
            await EnsureTaskPrivacyAllowedAsync(task);

            var taskDto = ObjectMapper.Map<TaskItem, TaskDto>(task);
            if (task.Assignee != null)
            {
                // Sorumlu adını atama seçicisiyle (name+surname) tutarlı göster; boşsa kullanıcı adına düş
                var assigneeFull = string.Join(" ", new[] { task.Assignee.Name, task.Assignee.Surname }
                    .Where(s => !string.IsNullOrWhiteSpace(s)));
                taskDto.AssigneeName = string.IsNullOrWhiteSpace(assigneeFull) ? task.Assignee.UserName : assigneeFull;
            }

            // Bütçe bağının GÖSTERİM bilgisi: kalem adı ve kalemde kalan yer.
            // "Kalan", görev planı girilirken "ne kadar yer var" sorusunun cevabı;
            // kalemin onaylanan tutarından DİĞER görevlerin planları düşülür.
            if (task.BudgetLineId.HasValue
                && await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget))
            {
                var line = await _budgetLineRepository.FindAsync(x => x.Id == task.BudgetLineId.Value);
                if (line != null)
                {
                    taskDto.BudgetLineName = string.IsNullOrWhiteSpace(line.Code)
                        ? line.Name
                        : $"{line.Code} · {line.Name}";

                    var siblings = await Repository.GetListAsync(x =>
                        x.BudgetLineId == line.Id && x.PlannedAmount != null && x.Id != task.Id);
                    taskDto.BudgetLineRemaining = line.ApprovedAmount - siblings.Sum(x => x.PlannedAmount!.Value);
                }
            }

            // Üst görev görünür olsa da alt görevler KENDİ gizlilik kuralına tabi (APYA-22) —
            // aksi halde gizli bir alt görevin başlığı, onu görme yetkisi olmayan bir
            // kullanıcıya (aynı paylaşılan üst görevi görebilen biri) sızardı.
            if (taskDto.SubTasks != null && taskDto.SubTasks.Count > 0)
            {
                bool subIsImpersonated = CurrentUser.FindClaim(Volo.Abp.Security.Claims.AbpClaimTypes.ImpersonatorUserId) != null;
                bool subCanManageTeam = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam);
                var visibleSubtaskIds = task.SubTasks
                    .Where(sub => IsTaskVisible(sub, subIsImpersonated, subCanManageTeam))
                    .Select(sub => sub.Id)
                    .ToHashSet();
                taskDto.SubTasks = taskDto.SubTasks.Where(s => visibleSubtaskIds.Contains(s.Id)).ToList();
            }

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
                    c.AuthorId = entityComment?.CreatorId;
                    c.IsOwn = entityComment?.CreatorId == CurrentUser.Id;
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

            await PopulateTagsAsync(new List<TaskDto> { taskDto });

            // Mevcut kullanıcının favorisi / takibi mi (TaskFavorite + TaskWatcher join)
            var favUserId = CurrentUser.Id;
            if (favUserId != null)
            {
                taskDto.IsFavorite = await _favoriteRepository.FindAsync(f => f.TaskId == id && f.UserId == favUserId.Value) != null;
                taskDto.IsWatched = await _watcherRepository.FindAsync(w => w.TaskId == id && w.UserId == favUserId.Value) != null;
            }

            // Harcanan süre: kapanmış zaman kayıtlarının toplamı (detay ekranındaki
            // "Harcanan / tahmin" hücresi ve tahmin kullanım çubuğu bunu kullanır).
            var logs = await _timeLogRepository.GetListAsync(l => l.TaskId == id);
            var totalSeconds = logs
                .Where(l => l.EndTime.HasValue)
                .Sum(l => l.SecondsSpent ?? (long)(l.EndTime!.Value - l.StartTime).TotalSeconds);
            taskDto.SpentHours = Math.Round(totalSeconds / 3600m, 2);

            // Göreve bağlı finans — izinle gate'lenir (finansal veri sızıntısını önler)
            if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Expenses.Default))
            {
                var taskExpenses = await _expenseRepository.GetListAsync(e => e.TaskId == id);
                taskDto.Expenses = taskExpenses
                    .Select(e => new TaskFinanceLineDto { Id = e.Id, Title = e.Title, Amount = e.Amount, Currency = e.Currency, Date = e.ExpenseDate })
                    .ToList();
            }
            if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Incomes.Default))
            {
                var taskIncomes = await _incomeRepository.GetListAsync(i => i.TaskId == id);
                taskDto.Incomes = taskIncomes
                    .Select(i => new TaskFinanceLineDto { Id = i.Id, Title = i.Title, Amount = i.Amount, Currency = i.Currency, Date = i.IncomeDate })
                    .ToList();
            }

            // Özel kanban kolonu adı (liste "Durum" sütunu + modal dropdown)
            if (task.BoardColumnId.HasValue)
            {
                var col = await _boardColumnRepository.FindAsync(task.BoardColumnId.Value);
                taskDto.BoardColumnName = col?.Name;
            }

            return taskDto;
        }

        // --- 1b. GET LIST (özel kolon adlarını batch doldurur) ---
        public override async Task<PagedResultDto<TaskDto>> GetListAsync(GetTasksInput input)
        {
            var result = await base.GetListAsync(input);
            await PopulateBoardColumnNamesAsync(result.Items);
            await PopulateTagsAsync(result.Items);
            await PopulateFavoritesAsync(result.Items);
            await PopulateSubTaskCountsAsync(result.Items);
            await PopulateProjectNamesAsync(result.Items);
            await PopulateCardMetaAsync(result.Items);   // Faz 7: yorum/ek sayısı + engelli
            return result;
        }

        // Bir görevin bu kullanıcıya gizlilik kuralına göre görünür olup olmadığı —
        // hem EnsureTaskPrivacyAllowedAsync'in fırlatma kararı hem de GetAsync'in
        // alt görev listesi filtresi (Faz 4) BUNU kullanır, kural tek yerde yaşar.
        private bool IsTaskVisible(TaskItem task, bool isImpersonated, bool canManageTeam)
        {
            if (!task.IsPrivate) return true;
            if (isImpersonated) return false;
            return canManageTeam || task.CreatorId == CurrentUser.Id || task.AssigneeId == CurrentUser.Id;
        }

        // Kapsamlı Rol ve Gizlilik Kontrolü (APYA-22) — GetAsync ile paylaşılan tek kopya.
        // Gizli bir görev; oluşturan, atanan veya Projects.ManageTeam yetkisi olmayan
        // kullanıcıya kapalıdır. Impersonation ile açılan oturumlar hiçbir gizli görevi göremez.
        private async Task EnsureTaskPrivacyAllowedAsync(TaskItem task)
        {
            bool isImpersonated = CurrentUser.FindClaim(Volo.Abp.Security.Claims.AbpClaimTypes.ImpersonatorUserId) != null;
            bool canManageTeam = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam);

            if (!IsTaskVisible(task, isImpersonated, canManageTeam))
            {
                if (isImpersonated)
                {
                    throw new Volo.Abp.BusinessException(PlatformDomainErrorCodes.TaskViewImpersonationDenied);
                }

                throw new Volo.Abp.BusinessException(PlatformDomainErrorCodes.TaskViewPrivateDenied);
            }
        }

        // Yorum/dosya entity'leri IMultiTenant DEĞİL (TaskComment: FullAuditedEntity,
        // TaskAttachment: CreationAuditedEntity) → üzerlerinde global tenant filtresi
        // YOK. TaskId ile doğrudan sorgulamak çapraz-tenant okuma açığı yaratıyordu.
        // TaskItem IMultiTenant olduğu için Repository.GetAsync filtreli çalışır:
        // başka tenant'ın görevi EntityNotFoundException verir. Ayrıca GetAsync'teki APYA-22
        // gizlilik kuralını da uygular — aksi halde aynı tenant'taki bir kullanıcı, göremediği
        // gizli bir görevin yorum/dosya uçlarını doğrudan taskId ile çağırıp erişebilirdi.
        private async Task EnsureTaskAccessAllowedAsync(Guid taskId)
        {
            var task = await Repository.GetAsync(taskId);
            await EnsureTaskPrivacyAllowedAsync(task);
        }

        // Görev etiketlerini tek toplu sorguda iliştirir (N+1 yok) — PopulateBoardColumnNamesAsync ile aynı desen.
        private async Task PopulateTagsAsync(System.Collections.Generic.IReadOnlyList<TaskDto> items)
        {
            if (items.Count == 0) return;
            var taskIds = items.Select(i => i.Id).ToList();

            // Atama + etiket TEK sorguda (önce iki ardışık tur atılıyordu). INNER JOIN,
            // eskiden elle yapılan "tagMap.ContainsKey" elemesinin aynısını yapar:
            // karşılığı silinmiş bir atama yine listeye girmez.
            var assignmentQuery = await _taskTagRepository.GetQueryableAsync();
            var tagQuery = await _tagRepository.GetQueryableAsync();

            var rows = await AsyncExecuter.ToListAsync(
                from assignment in assignmentQuery.Where(x => taskIds.Contains(x.TaskId))
                join tag in tagQuery on assignment.TagId equals tag.Id
                select new { assignment.TaskId, tag.Id, tag.Name });

            if (rows.Count == 0) return;

            var tagsByTask = rows
                .GroupBy(r => r.TaskId)
                .ToDictionary(g => g.Key,
                              g => g.Select(r => new TagDto { Id = r.Id, Name = r.Name }).ToList());

            foreach (var item in items)
            {
                if (tagsByTask.TryGetValue(item.Id, out var taskTags))
                {
                    item.Tags = taskTags;
                }
            }
        }

        // Mevcut kullanıcının favorilerini tek toplu sorguda iliştirir (N+1 yok) — PopulateTagsAsync ile aynı desen.
        private async Task PopulateFavoritesAsync(System.Collections.Generic.IReadOnlyList<TaskDto> items)
        {
            if (items.Count == 0) return;
            var userId = CurrentUser.Id;
            if (userId == null) return;

            var taskIds = items.Select(i => i.Id).ToList();
            var favorites = await _favoriteRepository.GetListAsync(f => f.UserId == userId.Value && taskIds.Contains(f.TaskId));
            if (favorites.Count == 0) return;

            var favSet = favorites.Select(f => f.TaskId).ToHashSet();
            foreach (var item in items)
            {
                item.IsFavorite = favSet.Contains(item.Id);
            }
        }

        // Proje adlarını tek toplu sorguda iliştirir — PopulateBoardColumnNamesAsync ile aynı desen.
        // TaskItem'da Project NAVİGASYONU YOK (yalnız ProjectId) ve TaskDto.ProjectName için
        // AutoMapper eşlemesi de yoktu → alan bugüne kadar HER ZAMAN null dönüyordu: görev
        // listesindeki "Proje" kolonu hep "—" gösteriyor, çapraz-proje kanban'daki
        // showProjectName ise sessizce ölüydü. Include mümkün olmadığı için batch lookup.
        private async Task PopulateProjectNamesAsync(System.Collections.Generic.IReadOnlyList<TaskDto> items)
        {
            if (items.Count == 0) return;

            var projectIds = items.Where(i => i.ProjectId.HasValue)
                                  .Select(i => i.ProjectId!.Value).Distinct().ToList();
            if (projectIds.Count == 0) return;

            // IMultiTenant → repository tenant'a göre zaten süzer.
            var projects = await _projectLookupRepository.GetListAsync(p => projectIds.Contains(p.Id));
            var map = projects.ToDictionary(p => p.Id, p => p.Name);

            foreach (var item in items)
            {
                if (item.ProjectId.HasValue && map.TryGetValue(item.ProjectId.Value, out var name))
                {
                    item.ProjectName = name;
                }
            }
        }

        // APYA-22 gizlilik süzgeci — liste sorgusu ve alt görev sayaçları AYNI kuralı
        // paylaşmak zorunda. Ayrışırlarsa sayaç, kullanıcının göremediği gizli bir alt
        // görevin varlığını chevron/rozet üzerinden ele verir.
        private async Task<IQueryable<TaskItem>> ApplyPrivacyFilterAsync(IQueryable<TaskItem> query)
        {
            bool isImpersonated = CurrentUser.FindClaim(Volo.Abp.Security.Claims.AbpClaimTypes.ImpersonatorUserId) != null;
            bool canManageTeam = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam);
            var currentUserId = CurrentUser.Id;

            // 1. Impersonated ise (örn. Admin) diğer tenantın "gizli" verilerini ASLA göremez.
            // 2. Normal kullanıcı gizli görevi yalnız kendisi açtıysa, kendisine atandıysa VEYA yöneticiyse görür.
            return query.Where(t =>
                !t.IsPrivate ||
                (!isImpersonated && (canManageTeam || t.CreatorId == currentUserId || t.AssigneeId == currentUserId))
            );
        }

        // Alt görev sayaçlarını tek toplu GroupBy sorgusuyla iliştirir (N+1 yok) —
        // PopulateTagsAsync ile aynı desen. Liste satırındaki aç/kapa chevron'u ve
        // "2/5" rozeti bunu kullanır.
        /// <summary>
        /// Faz 7: kanban kartındaki yorum/ek rozetleri ve "engelli" bilgisi.
        /// Comments/Attachments/PredecessorIds YALNIZ GetAsync'te doluyordu; kart
        /// bunları listede gösterebilsin diye sayılar burada TEK sorguda toplanır
        /// (PopulateSubTaskCountsAsync ile aynı desen — N+1 yok).
        /// </summary>
        private async Task PopulateCardMetaAsync(System.Collections.Generic.IReadOnlyList<TaskDto> items)
        {
            if (items.Count == 0) return;
            var taskIds = items.Select(i => i.Id).ToList();

            // Yorum ve ek sayısı TEK sorguda: iki ayrı GroupBy turu yerine görevin
            // kendi navigasyonları üzerinden ilintili alt sorgu. Sayılan görevler
            // zaten liste sorgusundan geliyor, ek bir görünürlük kuralı GEREKMEZ.
            var taskCountQuery = await Repository.GetQueryableAsync();
            var counts = await AsyncExecuter.ToListAsync(
                taskCountQuery.Where(t => taskIds.Contains(t.Id))
                              .Select(t => new
                              {
                                  t.Id,
                                  Comments = t.Comments.Count(),
                                  Attachments = t.Attachments.Count()
                              }));

            var commentMap = counts.ToDictionary(x => x.Id, x => x.Comments);
            var attachmentMap = counts.ToDictionary(x => x.Id, x => x.Attachments);

            // Engelli: AÇIK bir öncülü olan görev. Kapanmış (Done/Cancelled) öncül
            // engel sayılmaz — yoksa biten her iş kartı sonsuza dek engelli görünürdü.
            // Bağımlılık + AÇIK öncül TEK sorguda (önce "önce bağımlılıklar, sonra
            // öncüller" diye iki ardışık tur atılıyordu). INNER JOIN + durum süzgeci,
            // eskiden elle yapılan "openMap'te yoksa atla" elemesinin aynısı.
            var depQuery = await _dependencyRepository.GetQueryableAsync();
            var predecessorQuery = await Repository.GetQueryableAsync();

            var openBlockers = await AsyncExecuter.ToListAsync(
                from dependency in depQuery.Where(d => taskIds.Contains(d.TaskId))
                join predecessor in predecessorQuery
                    on dependency.PredecessorTaskId equals predecessor.Id
                where predecessor.Status != Apya.Platform.Tasks.TaskStatus.Done
                      && predecessor.Status != Apya.Platform.Tasks.TaskStatus.Cancelled
                select new { dependency.TaskId, predecessor.Number });

            var blockedCodes = new Dictionary<Guid, List<string>>();
            foreach (var blocker in openBlockers)
            {
                if (!blockedCodes.TryGetValue(blocker.TaskId, out var list))
                {
                    list = new List<string>();
                    blockedCodes[blocker.TaskId] = list;
                }
                list.Add($"GRV-{blocker.Number}");
            }

            foreach (var item in items)
            {
                item.CommentCount = commentMap.TryGetValue(item.Id, out var cN) ? cN : 0;
                item.AttachmentCount = attachmentMap.TryGetValue(item.Id, out var aN) ? aN : 0;
                if (blockedCodes.TryGetValue(item.Id, out var codes)) { item.BlockedByCodes = codes; }
            }
        }

        private async Task PopulateSubTaskCountsAsync(System.Collections.Generic.IReadOnlyList<TaskDto> items)
        {
            if (items.Count == 0) return;
            var taskIds = items.Select(i => i.Id).ToList();

            var queryable = await Repository.GetQueryableAsync();
            var subtasks = await ApplyPrivacyFilterAsync(
                queryable.Where(t => t.ParentTaskId != null && taskIds.Contains(t.ParentTaskId!.Value)));

            var counts = await AsyncExecuter.ToListAsync(
                subtasks
                    .GroupBy(t => t.ParentTaskId!.Value)
                    .Select(g => new
                    {
                        ParentId = g.Key,
                        Total = g.Count(),
                        Done = g.Count(x => x.Status == Apya.Platform.Tasks.TaskStatus.Done)
                    }));

            var map = counts.ToDictionary(c => c.ParentId);
            foreach (var item in items)
            {
                if (map.TryGetValue(item.Id, out var c))
                {
                    item.SubTaskCount = c.Total;
                    item.CompletedSubTaskCount = c.Done;
                }
            }
        }

        // Mevcut kullanıcı için görev favorisini aç/kapat (TaskTagAssignment ile aynı bare-join deseni).
        public async Task<bool> ToggleFavoriteAsync(Guid taskId)
        {
            await EnsureTaskAccessAllowedAsync(taskId);
            var userId = CurrentUser.Id!.Value; // [Authorize] → null değil

            var existing = await _favoriteRepository.FindAsync(f => f.TaskId == taskId && f.UserId == userId);
            if (existing != null)
            {
                await _favoriteRepository.DeleteAsync(existing, autoSave: true);
                return false;
            }

            await _favoriteRepository.InsertAsync(new TaskFavorite(GuidGenerator.Create(), taskId, userId), autoSave: true);
            return true;
        }

        // Mevcut kullanıcı için görev takibini aç/kapat (ToggleFavoriteAsync ile aynı desen).
        public async Task<bool> ToggleWatchAsync(Guid taskId)
        {
            await EnsureTaskAccessAllowedAsync(taskId);
            var userId = CurrentUser.Id!.Value; // [Authorize] → null değil

            var existing = await _watcherRepository.FindAsync(w => w.TaskId == taskId && w.UserId == userId);
            if (existing != null)
            {
                await _watcherRepository.DeleteAsync(existing, autoSave: true);
                return false;
            }

            await _watcherRepository.InsertAsync(new TaskWatcher(GuidGenerator.Create(), taskId, userId), autoSave: true);
            return true;
        }

        /// <summary>Görevi bir veya birden çok projeye taşır/kopyalar. Yetki kontrolü
        /// UpdateAsync ile aynı kuralı uygular; asıl iş TaskManager'da.</summary>
        public async Task<Dtos.TransferTaskResultDto> TransferAsync(Guid id, Dtos.TransferTaskDto input)
        {
            await CheckUpdatePolicyAsync();

            var task = await Repository.GetAsync(id);
            await EnsureTaskPrivacyAllowedAsync(task);

            if (task.CreatorId != CurrentUser.Id && task.AssigneeId != CurrentUser.Id)
            {
                if (!await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam))
                {
                    throw new Volo.Abp.BusinessException(PlatformDomainErrorCodes.TaskUpdateDenied);
                }
            }

            var options = new TaskTransferOptions
            {
                Subtasks     = input.Include.Subtasks,
                Checklist    = input.Include.Checklist,
                Comments     = input.Include.Comments,
                Files        = input.Include.Files,
                KeepAssignee = input.Include.KeepAssignee,
                KeepLinks    = input.Include.KeepLinks,
                ShiftDates   = input.Include.ShiftDates,
            };

            var createdIds = await _taskManager.TransferAsync(
                task, input.TargetProjectIds, input.Mode, options, Clock.Now);

            return new Dtos.TransferTaskResultDto
            {
                MovedToProjectId = input.Mode == TaskTransferMode.Move ? task.ProjectId : null,
                CreatedTaskIds = createdIds,
            };
        }

        // Görev "Proje" seçici — tenant'ın projeleri (IMultiTenant → sorgu tenant'a göre süzülür).
        // Projeksiyon SQL'DE yapılır: seçici üç alan kullanıyor, projenin tamamını
        // (bütçe, tarihler, açıklama…) çekip bellekte atmanın anlamı yok.
        public async Task<List<ProjectLookupDto>> GetProjectsLookupAsync()
        {
            var query = await _projectLookupRepository.GetQueryableAsync();
            return await AsyncExecuter.ToListAsync(
                query.OrderBy(p => p.Name)
                     .Select(p => new ProjectLookupDto
                     {
                         Id = p.Id,
                         Name = p.Name,
                         Code = p.Code
                     }));
        }

        // Liste şeridindeki sayaç barları. Barlar aynı zamanda filtre düğmesi olduğu
        // için sayılar, bara basınca listede çıkacak adetle AYNI olmalı — eşikler bu
        // yüzden istemcideki tanımı birebir yansıtır (açık = Todo/InProgress/InReview,
        // gecikmiş = dün 23:59:59 ve öncesi, 7 gün = bugün 00:00 → +7g 23:59:59).
        public async Task<TaskListSummaryDto> GetSummaryAsync(GetTasksInput input)
        {
            // Chip filtreleri BİLEREK uygulanmaz; barlar kapsam sayaçlarıdır.
            // Yalnız proje kapsamı + tenant/gizlilik süzgeci geçerli.
            var queryable = await Repository.GetQueryableAsync();
            var scoped = await ApplyPrivacyFilterAsync(queryable);
            scoped = scoped.WhereIf(input.ProjectId.HasValue, t => t.ProjectId == input.ProjectId);

            var openStatuses = new[]
            {
                Apya.Platform.Tasks.TaskStatus.Todo,
                Apya.Platform.Tasks.TaskStatus.InProgress,
                Apya.Platform.Tasks.TaskStatus.InReview
            };

            var todayStart = Clock.Now.Date;
            var overdueBound = todayStart.AddSeconds(-1);      // dün 23:59:59
            var due7Bound = todayStart.AddDays(8).AddSeconds(-1); // +7 gün 23:59:59
            var userId = CurrentUser.Id;

            var open = scoped.Where(t => openStatuses.Contains(t.Status));

            return new TaskListSummaryDto
            {
                Total = await AsyncExecuter.CountAsync(scoped),
                Done = await AsyncExecuter.CountAsync(
                    scoped.Where(t => t.Status == Apya.Platform.Tasks.TaskStatus.Done)),
                Overdue = await AsyncExecuter.CountAsync(
                    open.Where(t => t.DueDate != null && t.DueDate <= overdueBound)),
                DueIn7Days = await AsyncExecuter.CountAsync(
                    open.Where(t => t.DueDate != null && t.DueDate >= todayStart && t.DueDate <= due7Bound)),
                AssignedToMe = userId == null
                    ? 0
                    : await AsyncExecuter.CountAsync(open.Where(t => t.AssigneeId == userId.Value))
            };
        }

        /// <summary>
        /// Konsolun "Dosya galerisi" görünümü. Süzülmüş görevlerin GÖRSEL eklerini
        /// TEK sorguda düzleştirir — liste DTO'su yalnız ek sayısını taşıdığı için
        /// galeriyi besleyemez, görev başına <see cref="GetAttachmentsAsync"/> çağırmak
        /// ise N+1 olurdu.
        ///
        /// RootOnly BİLEREK kapatılır: liste hiyerarşik kipte yalnız kök görevleri
        /// sayfalar, ama alt göreve yüklenmiş bir görselin galeriden düşmesi için
        /// bir sebep yok.
        ///
        /// Görsel süzgeci uzantı üzerinden yapılır ve VERİTABANINDA çalışır; dosya
        /// içeriğine bakılmaz (ContentType tüm ekler için "application/octet-stream"
        /// yazılıyor, ona güvenilemez).
        /// </summary>
        public async Task<List<TaskGalleryItemDto>> GetGalleryAsync(GetTasksInput input)
        {
            input.RootOnly = false;
            var taskQuery = await CreateFilteredQueryAsync(input);

            var attachmentQuery = await _attachmentRepository.GetQueryableAsync();

            // Uzantı süzgeci VERİTABANINDA çalışsın diye açık OR zinciri; bir dizi
            // üzerinde `Any(ext => FileName.EndsWith(ext))` EF Core'da çevrilemez ve
            // sorgu istemciye düşerdi. Küme istemcideki isImageFile ile AYNI olmalı;
            // ayrışırsa galeride eksik görsel ya da boş kare çıkar.
            //
            // ToLower() şart: MSSQL varsayılan harmanlaması harf duyarsızdır ama
            // Postgres DEĞİLDİR — onsuz "FOTO.PNG" yalnız SQL Server'da görünürdü.
            var rows = await AsyncExecuter.ToListAsync(
                from a in attachmentQuery
                join t in taskQuery on a.TaskId equals t.Id
                where a.FileName.ToLower().EndsWith(".png")
                   || a.FileName.ToLower().EndsWith(".jpg")
                   || a.FileName.ToLower().EndsWith(".jpeg")
                   || a.FileName.ToLower().EndsWith(".gif")
                   || a.FileName.ToLower().EndsWith(".webp")
                   || a.FileName.ToLower().EndsWith(".svg")
                   || a.FileName.ToLower().EndsWith(".bmp")
                orderby a.CreationTime descending
                select new
                {
                    t.Id,
                    t.Title,
                    t.Number,
                    Attachment = a
                });

            var userIds = rows.Select(r => r.Attachment.CreatorId)
                .Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
            var userQueryable = await _identityRepository.GetQueryableAsync();
            var users = await AsyncExecuter.ToListAsync(userQueryable.Where(u => userIds.Contains(u.Id)));
            var userDict = users.ToDictionary(k => k.Id, v => v.UserName);

            // Misafir yüklemesinde CreatorId yoktur; ad paylaşım linkinden çözülür
            // (GetAttachmentsAsync ile aynı kural — orada "Sistem" görünmesi hataydı).
            var shareLinkIds = rows.Where(r => r.Attachment.ShareLinkId.HasValue)
                .Select(r => r.Attachment.ShareLinkId!.Value).Distinct().ToList();
            var recipientNames = shareLinkIds.Count == 0
                ? new Dictionary<Guid, string>()
                : (await _shareLinkRepository.GetListAsync(l => shareLinkIds.Contains(l.Id)))
                    .ToDictionary(l => l.Id, l => l.RecipientName);

            return rows.Select(r => new TaskGalleryItemDto
            {
                TaskId = r.Id,
                TaskTitle = r.Title,
                TaskCode = r.Number > 0 ? $"GRV-{r.Number}" : "GRV-—",
                AttachmentId = r.Attachment.Id,
                FileName = r.Attachment.FileName,
                FileSize = r.Attachment.FileSize,
                DownloadUrl = "/file/get/" + r.Attachment.StoredFileName,
                CreationTime = r.Attachment.CreationTime,
                UploaderName = r.Attachment.ShareLinkId.HasValue
                    ? recipientNames.GetValueOrDefault(r.Attachment.ShareLinkId.Value, "Dış katılımcı")
                    : (r.Attachment.CreatorId.HasValue && userDict.ContainsKey(r.Attachment.CreatorId.Value))
                        ? userDict[r.Attachment.CreatorId.Value]
                        : "Sistem"
            }).ToList();
        }

        // Create/Update ortak: TagNames'i get-or-create edip TaskTagAssignment'ları senkronlar
        // (PredecessorIds senkronuyla aynı sil-sonra-yeniden-ekle deseni).
        private async Task<List<TagDto>> SyncTagsAsync(Guid taskId, List<string>? tagNames)
        {
            await _taskTagRepository.DeleteDirectAsync(x => x.TaskId == taskId);

            var names = (tagNames ?? new())
                .Select(n => n?.Trim())
                .Where(n => !string.IsNullOrEmpty(n))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();
            if (names.Count == 0) return new List<TagDto>();

            // Tenant'ın TÜM etiketleri (küçük bir lookup tablosu) — case-insensitive eşleşme
            // in-memory yapılmalı, aksi halde Postgres'in case-sensitive '=' karşılaştırması
            // farklı harf büyüklüğüyle yazılan aynı etiketi kaçırıp yinelenen Tag oluşturur.
            var existingTags = await _tagRepository.GetListAsync();

            var result = new List<TagDto>();
            foreach (var name in names)
            {
                var tag = existingTags.FirstOrDefault(t => string.Equals(t.Name, name, StringComparison.OrdinalIgnoreCase));
                if (tag == null)
                {
                    tag = new Tag(GuidGenerator.Create(), name!, CurrentTenant.Id);
                    await _tagRepository.InsertAsync(tag);
                    existingTags.Add(tag);
                }
                await _taskTagRepository.InsertAsync(new TaskTagAssignment(GuidGenerator.Create(), taskId, tag.Id));
                result.Add(new TagDto { Id = tag.Id, Name = tag.Name });
            }
            return result;
        }

        /// <summary>Select2 tag girişinin başlangıç seçenek listesi için tenant'ın tüm etiketleri.</summary>
        public async Task<List<TagDto>> GetAllTagsAsync()
        {
            var q = await _tagRepository.GetQueryableAsync();
            var tags = await AsyncExecuter.ToListAsync(q.OrderBy(t => t.Name).Take(1000));
            return tags.Select(t => new TagDto { Id = t.Id, Name = t.Name }).ToList();
        }

        // Özel kolondaki görevlere kolon adını tek sorguda iliştirir (liste "Durum" sütunu).
        private async Task PopulateBoardColumnNamesAsync(System.Collections.Generic.IReadOnlyList<TaskDto> items)
        {
            var colIds = items.Where(i => i.BoardColumnId.HasValue)
                              .Select(i => i.BoardColumnId!.Value).Distinct().ToList();
            if (colIds.Count == 0) return;

            var cols = await _boardColumnRepository.GetListAsync(c => colIds.Contains(c.Id));
            var map = cols.ToDictionary(c => c.Id, c => c.Name);
            foreach (var item in items)
            {
                if (item.BoardColumnId.HasValue && map.TryGetValue(item.BoardColumnId.Value, out var name))
                {
                    item.BoardColumnName = name;
                }
            }
        }

        // Modal "Durum/Kolon" dropdown'ından gelen kolon seçimini uzlaştırır:
        // sistem kolonu → Status değişir + kolon bağı temizlenir; özel kolon → kolona bağlanır.
        private async Task ApplyColumnSelectionAsync(TaskItem task, Guid? boardColumnId)
        {
            if (!boardColumnId.HasValue) { task.MoveToColumn(null); return; }

            var col = await _boardColumnRepository.FindAsync(boardColumnId.Value);
            if (col == null || col.ProjectId != task.ProjectId) { task.MoveToColumn(null); return; } // güvenlik: proje uyuşmazsa yok say

            if (col.StatusValue.HasValue)
            {
                task.ChangeStatus((Apya.Platform.Tasks.TaskStatus)col.StatusValue.Value, Clock.Now);
                task.MoveToColumn(null);
            }
            else
            {
                task.MoveToColumn(col.Id);
            }
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
                isPrivate: input.IsPrivate,
                tenantId: CurrentTenant.Id,
                now: Clock.Now
            );

            // Kullanıcıya gösterilen kodun (GRV-N) kaynağı — tenant içinde artan sıra.
            newTask.AssignNumber(await _taskManager.GetNextNumberAsync());
            newTask.SetPlanningInfo(input.EstimatedHours, input.TaskType, input.Sprint);

            // Bütçe bağı: kalem projeye ait olmalı ve aynı kalemdeki görev
            // planlarının toplamı kalemi aşmamalı. Kural ProjectBudgetManager'da.
            await _budgetManager.EnsureTaskBudgetIsValidAsync(
                input.ProjectId, input.BudgetLineId, input.PlannedAmount);
            newTask.SetBudgetLink(input.BudgetLineId, input.PlannedAmount);

            // Durum varsayılandan farklıysa set et
            if (input.Status != Apya.Platform.Tasks.TaskStatus.Todo)
            {
                newTask.ChangeStatus(input.Status, Clock.Now);
            }

            // Modal'dan özel kolon seçildiyse uzlaştır (Status/BoardColumnId)
            await ApplyColumnSelectionAsync(newTask, input.BoardColumnId);

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

            var tagDtos = await SyncTagsAsync(newTask.Id, input.TagNames);

            // REV-002: Manuel DTO yerine AutoMapper
            var taskDto = ObjectMapper.Map<TaskItem, TaskDto>(newTask);
            taskDto.PredecessorIds = input.PredecessorIds ?? new();
            taskDto.Tags = tagDtos;

            if (input.AssigneeId.HasValue)
            {
                var user = await _userRepository.FindAsync(input.AssigneeId.Value);
                taskDto.AssigneeName = FormatAssigneeName(user);
            }

            return taskDto;
        }

        /// <summary>
        /// Sorumlu adını "Ad Soyad" olarak biçimlendirir; ikisi de boşsa kullanıcı adına düşer.
        /// Listede AutoMapper profili, oluşturma/güncelleme dönüşünde burası aynı sonucu üretsin
        /// diye tek yerde toplandı (önceden bu yollar ham UserName yazıyordu).
        /// </summary>
        private static string? FormatAssigneeName(Volo.Abp.Identity.IdentityUser? user)
        {
            if (user == null) return null;

            var full = string.Join(" ", new[] { user.Name, user.Surname }
                .Where(s => !string.IsNullOrWhiteSpace(s)));

            return string.IsNullOrWhiteSpace(full) ? user.UserName : full;
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

            task.SetPlanningInfo(input.EstimatedHours, input.TaskType, input.Sprint);

            // excludeTaskId ŞART: görevin kendi eski planı "başka görevin planı"
            // sayılırsa görev kendi tutarını güncelleyemez hale gelir.
            await _budgetManager.EnsureTaskBudgetIsValidAsync(
                input.ProjectId, input.BudgetLineId, input.PlannedAmount, excludeTaskId: id);
            task.SetBudgetLink(input.BudgetLineId, input.PlannedAmount);

            // Proje değişimi (task.Update projeyi kapsamaz). Board kolonu proje-kapsamlı
            // olduğundan MoveToProject proje değişince kolonu temizler.
            var projectChanged = task.ProjectId != input.ProjectId;
            task.MoveToProject(input.ProjectId);

            // Özel kolon seçimi yalnız proje DEĞİŞMEDİYSE uzlaştırılır — proje değiştiyse
            // gelen boardColumnId eski projeye ait (bayat), uygulanmamalı.
            if (!projectChanged)
            {
                await ApplyColumnSelectionAsync(task, input.BoardColumnId);
            }

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

            var tagDtos = await SyncTagsAsync(task.Id, input.TagNames);

            // REV-002: Manuel DTO yerine AutoMapper
            var taskDto = ObjectMapper.Map<TaskItem, TaskDto>(task);
            taskDto.PredecessorIds = input.PredecessorIds ?? new();
            taskDto.Tags = tagDtos;

            if (task.AssigneeId.HasValue)
            {
                var user = await _userRepository.FindAsync(task.AssigneeId.Value);
                taskDto.AssigneeName = FormatAssigneeName(user);
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

            // Sinyal köprüsünün bağı da gitmeli: bağ soft-delete DEĞİL ve (SourceType,
            // SourceKey) unique — kalırsa kaynak bir daha göreve dönüştürülemezdi.
            await _issueTaskManager.RemoveLinksOfTaskAsync(id);

            await base.DeleteAsync(id);
        }

        // --- 5. LIST (Listeleme & Filtreleme) ---
        // 2. KİLİT NOKTA: Artık PagedAndSortedResultRequestDto değil, GetTasksInput alıyor.
        protected override async Task<IQueryable<TaskItem>> CreateFilteredQueryAsync(GetTasksInput input)
        {
            var query = await base.CreateFilteredQueryAsync(input);

            // Gelişmiş Gizlilik Filtresi (APYA-22) — alt görev sayaçlarıyla paylaşılan tek kopya.
            query = await ApplyPrivacyFilterAsync(query);

            return query
                // Hiyerarşik liste kipi: sayfalama kök görevler üzerinden yürür, alt görevler
                // chevron açılınca ParentTaskId ile ayrıca istenir. Filtre/arama aktifken
                // istemci RootOnly göndermez → eşleşen alt görev listeden düşmez.
                .WhereIf(input.RootOnly, t => t.ParentTaskId == null)
                .WhereIf(input.ParentTaskId.HasValue, t => t.ParentTaskId == input.ParentTaskId)
                .WhereIf(input.ProjectId.HasValue, t => t.ProjectId == input.ProjectId)
                .WhereIf(input.AssigneeId.HasValue, t => t.AssigneeId == input.AssigneeId)
                .WhereIf(input.Statuses != null && input.Statuses.Any(), t => input.Statuses!.Contains(t.Status))
                .WhereIf(input.Priorities != null && input.Priorities.Any(), t => input.Priorities!.Contains(t.Priority))
                .WhereIf(input.MinDueDate.HasValue, t => t.DueDate >= input.MinDueDate!.Value)
                .WhereIf(input.MaxDueDate.HasValue, t => t.DueDate <= input.MaxDueDate!.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), t =>
                    t.Title.Contains(input.Filter!) || (t.Description != null && t.Description.Contains(input.Filter!)))
                .Include(t => t.Assignee)
                .Include(t => t.ParentTask)
                // Liste yalnız DTO'ya map'lenir, entity değiştirilmez — tracking gereksiz.
                .AsNoTracking();
        }

        // --- 5. USER LOOKUP (Kullanıcı Listesi) ---
        public async Task<ListResultDto<IdentityUserDto>> GetUsersLookupAsync()
        {
            var users = await _userRepository.GetListAsync(maxResultCount: 500, sorting: "UserName");
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
        public async Task<Guid> AddCommentAsync(Guid taskId, string text)
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                throw new Volo.Abp.UserFriendlyException("Yorum içeriği boş olamaz.", "Platform:Task:CommentRequired");
            }

            await EnsureTaskAccessAllowedAsync(taskId);

            var comment = await _commentRepository.InsertAsync(new TaskComment(taskId, text.Trim()), autoSave: true);

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

            return comment.Id;
        }

        // Instagram tarzı yanıt: bir yoruma cevap. Tek seviye thread tutarız —
        // bir yanıta yanıt verilirse kök yoruma bağlanır.
        public async Task<Guid> ReplyToCommentAsync(Guid parentCommentId, string text)
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                throw new Volo.Abp.UserFriendlyException("Yorum içeriği boş olamaz.", "Platform:Task:CommentRequired");
            }

            var parent = await _commentRepository.GetAsync(parentCommentId);
            await EnsureTaskAccessAllowedAsync(parent.TaskId);

            var rootId = parent.ParentCommentId ?? parent.Id; // tek seviye: yanıtın yanıtı köke gider
            var reply = await _commentRepository.InsertAsync(
                new TaskComment(parent.TaskId, text.Trim(), rootId), autoSave: true);

            var task = await Repository.GetAsync(parent.TaskId);
            await _localEventBus.PublishAsync(new TaskCommentAddedEto
            {
                TaskId        = parent.TaskId,
                TaskTitle     = task.Title,
                AssigneeId    = task.AssigneeId,
                CreatorId     = task.CreatorId,
                CommentUserId = CurrentUser.Id ?? Guid.Empty,
                CommenterName = CurrentUser.UserName ?? "Bilinmeyen",
                CommentText   = text
            });

            return reply.Id;
        }

        // Yorum düzenleme — yalnızca yorumu yazan kişi.
        public async Task UpdateCommentAsync(Guid commentId, string text)
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                throw new Volo.Abp.UserFriendlyException("Yorum içeriği boş olamaz.", "Platform:Task:CommentRequired");
            }

            var comment = await _commentRepository.GetAsync(commentId);
            await EnsureTaskAccessAllowedAsync(comment.TaskId);
            if (comment.CreatorId != CurrentUser.Id)
            {
                throw new Volo.Abp.UserFriendlyException("Yalnızca kendi yorumunuzu düzenleyebilirsiniz.");
            }

            comment.SetText(text);
            await _commentRepository.UpdateAsync(comment, autoSave: true);
        }

        // Yorum silme — yalnızca yorumu yazan kişi.
        public async Task DeleteCommentAsync(Guid commentId)
        {
            var comment = await _commentRepository.GetAsync(commentId);
            await EnsureTaskAccessAllowedAsync(comment.TaskId);
            if (comment.CreatorId != CurrentUser.Id)
            {
                throw new Volo.Abp.UserFriendlyException("Yalnızca kendi yorumunuzu silebilirsiniz.");
            }

            // Kök yorum siliniyorsa yanıtlarını da sil; aksi halde yanıtlar öksüz kalıp
            // (ParentCommentId silinmiş köke işaret eder) GetCommentsAsync'te UI'dan kaybolur.
            if (comment.ParentCommentId == null)
            {
                var replies = await _commentRepository.GetListAsync(c => c.ParentCommentId == comment.Id);
                foreach (var reply in replies)
                {
                    await _commentRepository.DeleteAsync(reply);
                }
            }

            await _commentRepository.DeleteAsync(comment, autoSave: true);
        }


        public async Task<List<TaskCommentDto>> GetCommentsAsync(Guid taskId)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

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

            var allDtos = comments.Select(c => new TaskCommentDto
            {
                Id = c.Id,
                Text = c.Text,
                CreationTime = c.CreationTime,
                AuthorId = c.CreatorId,
                ParentCommentId = c.ParentCommentId,
                IsOwn = c.CreatorId == CurrentUser.Id,
                AuthorName = (c.CreatorId.HasValue && userDictionary.ContainsKey(c.CreatorId.Value))
                             ? userDictionary[c.CreatorId.Value]
                             : "Bilinmeyen Kullanıcı"
            }).ToList();

            // Tek seviye thread: kök yorumlar (en yeni üstte) + altlarında yanıtlar (kronolojik).
            var roots = allDtos.Where(c => c.ParentCommentId == null)
                               .OrderByDescending(x => x.CreationTime).ToList();
            foreach (var root in roots)
            {
                root.Replies = allDtos.Where(r => r.ParentCommentId == root.Id)
                                      .OrderBy(r => r.CreationTime).ToList();
            }
            return roots;
        }

        // --- 7. DOSYA METODLARI ---
        public async Task AddAttachmentAsync(Guid taskId, string fileName, string storedFileName, long fileSize)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

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
            await EnsureTaskAccessAllowedAsync(taskId);

            var attachments = await _attachmentRepository.GetListAsync(x => x.TaskId == taskId);

            var userIds = attachments.Select(x => x.CreatorId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
            var userQueryable = await _identityRepository.GetQueryableAsync();
            var users = await userQueryable.Where(u => userIds.Contains(u.Id)).ToListAsync();
            var userDict = users.ToDictionary(k => k.Id, v => v.UserName);

            // Misafirin yüklediği dosyanın CreatorId'si YOKTUR (kullanıcı kaydı yok) — yükleyen
            // adı paylaşım linkinin alıcısından çözülür. Bu olmadan dış katkılar listede
            // "Sistem" görünür ve ekip dosyanın nereden geldiğini anlayamaz.
            var shareLinkIds = attachments.Where(x => x.ShareLinkId.HasValue)
                .Select(x => x.ShareLinkId!.Value).Distinct().ToList();
            var recipientNames = shareLinkIds.Count == 0
                ? new Dictionary<Guid, string>()
                : (await _shareLinkRepository.GetListAsync(l => shareLinkIds.Contains(l.Id)))
                    .ToDictionary(l => l.Id, l => l.RecipientName);

            return attachments.Select(x => new TaskAttachmentDto
            {
                Id = x.Id,
                CreationTime = x.CreationTime,
                FileName = x.FileName,
                FileSize = x.FileSize,
                DownloadUrl = "/file/get/" + x.StoredFileName,
                IsGuestUpload = x.ShareLinkId.HasValue,
                IsVisibleToGuests = x.IsVisibleToGuests,
                UploaderName = x.ShareLinkId.HasValue
                    ? recipientNames.GetValueOrDefault(x.ShareLinkId.Value, "Dış katılımcı")
                    : (x.CreatorId.HasValue && userDict.ContainsKey(x.CreatorId.Value)) ? userDict[x.CreatorId.Value] : "Sistem"
            }).ToList();
        }

        public async Task DeleteAttachmentAsync(Guid attachmentId)
        {
            var attachment = await _attachmentRepository.GetAsync(attachmentId);
            await EnsureTaskAccessAllowedAsync(attachment.TaskId);

            await _attachmentRepository.DeleteAsync(attachment, autoSave: true);
        }

        // --- 8. FEATURE REGISTRY METODLARI (Faz 3) ---
        public async Task<List<string>> GetFeatureAssignmentsAsync(Guid taskId)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

            var assignments = await _featureAssignmentRepository.GetListAsync(x => x.TaskId == taskId);
            return assignments.Select(x => x.FeatureCode).ToList();
        }

        public async Task AddFeatureAsync(Guid taskId, string featureCode)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

            if (string.IsNullOrWhiteSpace(featureCode) || featureCode.Length > 64)
            {
                throw new Volo.Abp.UserFriendlyException("Geçersiz feature kodu.");
            }
            featureCode = featureCode.Trim();

            var existing = await _featureAssignmentRepository.FirstOrDefaultAsync(
                x => x.TaskId == taskId && x.FeatureCode == featureCode);
            if (existing != null)
            {
                return; // idempotent — aynı feature'ı iki kez eklemek hata vermemeli
            }

            await _featureAssignmentRepository.InsertAsync(
                new TaskFeatureAssignment(GuidGenerator.Create(), taskId, featureCode),
                autoSave: true);
        }

        public async Task RemoveFeatureAsync(Guid taskId, string featureCode)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

            if (string.IsNullOrWhiteSpace(featureCode) || featureCode.Length > 64)
            {
                throw new Volo.Abp.UserFriendlyException("Geçersiz feature kodu.");
            }
            featureCode = featureCode.Trim();

            var assignment = await _featureAssignmentRepository.FirstOrDefaultAsync(
                x => x.TaskId == taskId && x.FeatureCode == featureCode);
            if (assignment != null)
            {
                await _featureAssignmentRepository.DeleteAsync(assignment, autoSave: true);
            }
        }

        // --- BELGELER (TaskDocument) ---
        // Yetki kapısı görevin KENDİSİ: EnsureTaskAccessAllowedAsync tenant + gizlilik
        // süzgecini uygular, yazma uçları ayrıca Tasks.Edit ister. Ayrı bir belge izni
        // TANIMLANMADI — feature kapısı olmayan izin kiracıya ulaşmıyor, o zincire
        // girmeye değecek bir ayrım yok.

        /// <summary>
        /// Görevin belgeleri. Content BİLEREK boş bırakılır: gövdeler uzun olabiliyor
        /// ve liste satırı yalnız başlık/tarih/yazar gösteriyor. Tam gövde için
        /// <see cref="GetDocumentAsync"/>.
        /// </summary>
        public async Task<List<TaskDocumentDto>> GetDocumentsAsync(Guid taskId)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

            var query = await _documentRepository.GetQueryableAsync();
            var rows = await AsyncExecuter.ToListAsync(
                query.Where(d => d.TaskId == taskId)
                     .OrderByDescending(d => d.LastModificationTime ?? d.CreationTime)
                     .Select(d => new
                     {
                         d.Id, d.TaskId, d.Title,
                         d.CreationTime, d.CreatorId,
                         d.LastModificationTime, d.LastModifierId,
                         // Gövdeyi ÇEKMEDEN uzunluğunu al — "boş belge" ayrımı için yeterli.
                         Length = d.Content == null ? 0 : d.Content.Length
                     }));

            var names = await ResolveUserNamesAsync(
                rows.SelectMany(r => new[] { r.LastModifierId, r.CreatorId }));

            return rows.Select(r => new TaskDocumentDto
            {
                Id = r.Id,
                TaskId = r.TaskId,
                Title = r.Title,
                Content = null,
                ContentLength = r.Length,
                CreationTime = r.CreationTime,
                CreatorId = r.CreatorId,
                LastModificationTime = r.LastModificationTime,
                LastModifierId = r.LastModifierId,
                EditorName = NameOf(names, r.LastModifierId ?? r.CreatorId)
            }).ToList();
        }

        public async Task<TaskDocumentDto> GetDocumentAsync(Guid documentId)
        {
            var doc = await _documentRepository.GetAsync(documentId);
            await EnsureTaskAccessAllowedAsync(doc.TaskId);

            var names = await ResolveUserNamesAsync(new[] { doc.LastModifierId, doc.CreatorId });
            return MapDocument(doc, NameOf(names, doc.LastModifierId ?? doc.CreatorId));
        }

        public async Task<TaskDocumentDto> CreateDocumentAsync(Guid taskId, string title)
        {
            await CheckPolicyAsync(PlatformPermissions.Tasks.Edit);
            await EnsureTaskAccessAllowedAsync(taskId);

            if (string.IsNullOrWhiteSpace(title))
            {
                throw new Volo.Abp.UserFriendlyException("Belge başlığı boş olamaz.", "Platform:Task:DocumentTitleRequired");
            }

            // autoSave: aynı UoW içinde geri okunacak bir alan yok, ama dönen DTO'nun
            // CreationTime/CreatorId'si dolu olmalı — kaydetmeden bunlar boş gelir.
            var doc = await _documentRepository.InsertAsync(
                new TaskDocument(GuidGenerator.Create(), taskId, title.Trim()), autoSave: true);

            var names = await ResolveUserNamesAsync(new[] { doc.CreatorId });
            return MapDocument(doc, NameOf(names, doc.CreatorId));
        }

        public async Task<TaskDocumentDto> UpdateDocumentAsync(Guid documentId, UpdateTaskDocumentDto input)
        {
            await CheckPolicyAsync(PlatformPermissions.Tasks.Edit);

            var doc = await _documentRepository.GetAsync(documentId);
            await EnsureTaskAccessAllowedAsync(doc.TaskId);

            if (string.IsNullOrWhiteSpace(input.Title))
            {
                throw new Volo.Abp.UserFriendlyException("Belge başlığı boş olamaz.", "Platform:Task:DocumentTitleRequired");
            }

            doc.Title = input.Title.Trim();
            doc.Content = input.Content;
            await _documentRepository.UpdateAsync(doc, autoSave: true);

            var names = await ResolveUserNamesAsync(new[] { doc.LastModifierId, doc.CreatorId });
            return MapDocument(doc, NameOf(names, doc.LastModifierId ?? doc.CreatorId));
        }

        public async Task DeleteDocumentAsync(Guid documentId)
        {
            await CheckPolicyAsync(PlatformPermissions.Tasks.Edit);

            var doc = await _documentRepository.GetAsync(documentId);
            await EnsureTaskAccessAllowedAsync(doc.TaskId);

            // FullAuditedEntity → SOFT delete. Kullanıcı yazısı, geri alınabilir kalsın.
            await _documentRepository.DeleteAsync(doc, autoSave: true);
        }

        private static TaskDocumentDto MapDocument(TaskDocument doc, string editorName) => new TaskDocumentDto
        {
            Id = doc.Id,
            TaskId = doc.TaskId,
            Title = doc.Title,
            Content = doc.Content,
            ContentLength = doc.Content?.Length ?? 0,
            CreationTime = doc.CreationTime,
            CreatorId = doc.CreatorId,
            LastModificationTime = doc.LastModificationTime,
            LastModifierId = doc.LastModifierId,
            EditorName = editorName
        };

        /// <summary>Kullanıcı id'lerini görünen ada çözer (tek sorgu, null'lar elenir).</summary>
        private async Task<Dictionary<Guid, string>> ResolveUserNamesAsync(IEnumerable<Guid?> ids)
        {
            var list = ids.Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
            if (list.Count == 0) { return new Dictionary<Guid, string>(); }

            var queryable = await _identityRepository.GetQueryableAsync();
            var users = await AsyncExecuter.ToListAsync(queryable.Where(u => list.Contains(u.Id)));
            return users.ToDictionary(u => u.Id, u => u.UserName);
        }

        private static string NameOf(Dictionary<Guid, string> names, Guid? id)
            => id.HasValue && names.TryGetValue(id.Value, out var n) ? n : "Sistem";

        public async Task<List<TaskChecklistItemDto>> GetChecklistItemsAsync(Guid taskId)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

            var items = await _checklistRepository.GetListAsync(x => x.TaskId == taskId);
            return items
                .OrderBy(x => x.CreationTime)
                .Select(x => new TaskChecklistItemDto
                {
                    Id = x.Id,
                    CreationTime = x.CreationTime,
                    Text = x.Text,
                    IsDone = x.IsDone,
                })
                .ToList();
        }

        public async Task<Guid> AddChecklistItemAsync(Guid taskId, string text)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

            if (string.IsNullOrWhiteSpace(text))
            {
                throw new Volo.Abp.UserFriendlyException("Kontrol listesi maddesi boş olamaz.");
            }
            text = text.Trim();
            if (text.Length > 500)
            {
                throw new Volo.Abp.UserFriendlyException("Kontrol listesi maddesi 500 karakterden uzun olamaz.");
            }

            var item = await _checklistRepository.InsertAsync(new TaskChecklistItem
            {
                TaskId = taskId,
                Text = text,
            }, autoSave: true);

            return item.Id;
        }

        public async Task ToggleChecklistItemAsync(Guid itemId)
        {
            var item = await _checklistRepository.GetAsync(itemId);
            await EnsureTaskAccessAllowedAsync(item.TaskId);

            item.IsDone = !item.IsDone;
            await _checklistRepository.UpdateAsync(item, autoSave: true);
        }

        public async Task DeleteChecklistItemAsync(Guid itemId)
        {
            var item = await _checklistRepository.GetAsync(itemId);
            await EnsureTaskAccessAllowedAsync(item.TaskId);

            await _checklistRepository.DeleteAsync(item, autoSave: true);
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

        /// <summary>
        /// Yalnız atananı değiştirir (null = atamayı kaldır). Toplu işlem tüm görevi
        /// okuyup yazmasın diye granüler uç. Başkasına atamak ayrı yetki ister.
        /// </summary>
        [Authorize(PlatformPermissions.Tasks.Assign)]
        public async Task SetAssigneeAsync(Guid id, Guid? assigneeId)
        {
            var task = await Repository.GetAsync(id);
            var previousAssigneeId = task.AssigneeId;

            task.AssignTo(assigneeId);
            await Repository.UpdateAsync(task);

            // BİLDİRİM: yalnız gerçekten DEĞİŞTİYSE ve biri atandıysa (atama
            // kaldırıldığında kimseye bildirim gitmez).
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
        }

        /// <summary>Yalnız önceliği değiştirir. Toplu işlem için granüler uç.</summary>
        [Authorize(PlatformPermissions.Tasks.Edit)]
        public async Task SetPriorityAsync(Guid id, Apya.Platform.Tasks.TaskPriority priority)
        {
            var task = await Repository.GetAsync(id);
            task.ChangePriority(priority);
            await Repository.UpdateAsync(task);
        }

        /// <summary>
        /// Faz 4b: görevi nedeniyle iptal eder. Durum muhasebesi (önceki durumu
        /// saklama, iptal tarihi) domain'de <see cref="TaskItem.ChangeStatus"/>
        /// içinde tutuluyor — hangi yoldan gelinirse gelinsin tutarlı.
        /// </summary>
        [Authorize(PlatformPermissions.Tasks.ChangeStatus)]
        public async Task CancelAsync(Guid id, string? reason)
        {
            var task = await Repository.GetAsync(id);
            var oldStatus = task.Status;
            task.Cancel(reason, Clock.Now);
            await Repository.UpdateAsync(task);

            await _localEventBus.PublishAsync(new TaskStatusChangedEto
            {
                TaskId         = id,
                TaskTitle      = task.Title,
                OldStatus      = oldStatus,
                NewStatus      = Apya.Platform.Tasks.TaskStatus.Cancelled,
                AssigneeId     = task.AssigneeId,
                CreatorId      = task.CreatorId,
                ModifierUserId = CurrentUser.Id,
                ChangedByName  = CurrentUser.UserName ?? "Bilinmeyen"
            });
        }

        /// <summary>Faz 4b: iptali geri alır — görev iptalden ÖNCEKİ durumuna döner.</summary>
        [Authorize(PlatformPermissions.Tasks.ChangeStatus)]
        public async Task RestoreFromCancelAsync(Guid id)
        {
            var task = await Repository.GetAsync(id);
            if (task.Status != Apya.Platform.Tasks.TaskStatus.Cancelled) { return; }

            task.RestoreFromCancel(Clock.Now);
            await Repository.UpdateAsync(task);

            await _localEventBus.PublishAsync(new TaskStatusChangedEto
            {
                TaskId         = id,
                TaskTitle      = task.Title,
                OldStatus      = Apya.Platform.Tasks.TaskStatus.Cancelled,
                NewStatus      = task.Status,
                AssigneeId     = task.AssigneeId,
                CreatorId      = task.CreatorId,
                ModifierUserId = CurrentUser.Id,
                ChangedByName  = CurrentUser.UserName ?? "Bilinmeyen"
            });
        }

        /// <summary>
        /// "Ötele" — son tarihi <paramref name="days"/> gün ileri alır. Son tarihi
        /// olmayan görevde bugün başlangıç kabul edilir. StartDate'e dokunulmaz;
        /// yalnız yeni son tarih başlangıcın gerisinde kalırsa başlangıç da kayar
        /// (aksi halde başlangıcı bitişinden sonra olan geçersiz görev oluşurdu).
        /// </summary>
        public async Task<TaskDto> DeferAsync(Guid id, int days)
        {
            var task = await Repository.GetAsync(id);
            await EnsureTaskPrivacyAllowedAsync(task);

            var basis = task.DueDate ?? Clock.Now;
            var newDue = basis.AddDays(days);
            var newStart = newDue < task.StartDate ? newDue : task.StartDate;

            task.UpdateSchedule(newStart, newDue);
            await Repository.UpdateAsync(task);

            return ObjectMapper.Map<TaskItem, TaskDto>(task);
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

