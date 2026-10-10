using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.IssueTasks;
using Apya.Platform.ProjectBudgets;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Identity;

namespace Apya.Platform.Tasks;

/// <summary>Görev sırası (kod) ataması ve projeler arası taşıma/kopyalama iş kuralı.
/// AppService yalnız yetki + DTO çevirisi yapar; kural burada.</summary>
public class TaskManager : DomainService
{
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskChecklistItem, Guid> _checklistRepository;
    private readonly IRepository<TaskComment, Guid> _commentRepository;
    private readonly IRepository<TaskAttachment, Guid> _attachmentRepository;
    private readonly IRepository<TaskDependency, Guid> _dependencyRepository;
    private readonly IRepository<TaskTagAssignment, Guid> _tagAssignmentRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
    private readonly IRepository<IssueTaskLink, Guid> _issueTaskLinkRepository;
    private readonly IRepository<IdentityUser, Guid> _userRepository;
    private readonly IRepository<FundingTranche, Guid> _trancheRepository;

    /// <summary>
    /// 🔴 PRJ-07 · Alt görevin bağlanacağı üst görevi doğrular.
    ///
    /// <para>Görev oluşturma, gönderilen üst görev kimliğini HİÇ doğrulamadan yazıyordu.
    /// Var olmayan (ya da başka kiracıya ait) bir kimlikle açılan alt görev hiçbir listede
    /// görünmez: kök listeler onu "alt görev" diye dışarıda bırakır, üst görevi ise yoktur —
    /// kayıt erişilmez bir yetim olarak kalırdı.</para>
    ///
    /// <para>Proje kuralı bilerek DAR: yalnız AÇIK çelişki reddedilir (alt görev için başka
    /// bir proje gönderilmişse). Proje gönderilmemişse dokunulmaz — eski düzenleme penceresi
    /// alt görevi projesiz açıyor ve o davranışı burada sessizce değiştirmek ayrı bir karar.</para>
    ///
    /// <para>🔴 DERİNLİK ZORLANMIYOR. Sistem "tek seviye alt görev" varsayıyor ama arayüz
    /// bugün alt görevin altına görev eklemeye izin veriyor (Alt Görevler sekmesi her görevde
    /// açık). Yasaklamak var olan bir yeteneği kaldırır — ürün kararı.</para>
    /// </summary>
    public async Task EnsureParentTaskIsValidAsync(Guid? parentTaskId, Guid? projectId)
    {
        if (parentTaskId == null)
        {
            return;
        }

        // Kiracı süzgeci açık: başka kiracının görevi "bulunamadı" olur.
        var parent = await _taskRepository.FindAsync(parentTaskId.Value);

        if (parent == null)
            throw new BusinessException(PlatformDomainErrorCodes.TaskParentNotFound)
                .WithData("ParentTaskId", parentTaskId);

        if (projectId.HasValue && parent.ProjectId != projectId)
            throw new BusinessException(PlatformDomainErrorCodes.TaskParentProjectMismatch)
                .WithData("ParentTaskId", parentTaskId)
                .WithData("ProjectId", projectId);
    }

    public TaskManager(
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<TaskChecklistItem, Guid> checklistRepository,
        IRepository<TaskComment, Guid> commentRepository,
        IRepository<TaskAttachment, Guid> attachmentRepository,
        IRepository<TaskDependency, Guid> dependencyRepository,
        IRepository<TaskTagAssignment, Guid> tagAssignmentRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<IncomeEntry, Guid> incomeRepository,
        IRepository<IssueTaskLink, Guid> issueTaskLinkRepository,
        IRepository<IdentityUser, Guid> userRepository,
        IRepository<FundingTranche, Guid> trancheRepository)
    {
        _trancheRepository = trancheRepository;
        _taskRepository = taskRepository;
        _checklistRepository = checklistRepository;
        _commentRepository = commentRepository;
        _attachmentRepository = attachmentRepository;
        _dependencyRepository = dependencyRepository;
        _tagAssignmentRepository = tagAssignmentRepository;
        _expenseRepository = expenseRepository;
        _incomeRepository = incomeRepository;
        _issueTaskLinkRepository = issueTaskLinkRepository;
        _userRepository = userRepository;
    }

    /// <summary>
    /// Atanan kişi çağıranın KENDİ bağlamındaki bir kullanıcı olmalı. Kimlik istekten gelir ve hiç
    /// doğrulanmıyordu: kimliği bilinen başka bir kiracının (ya da host'un) kullanıcısı atanabiliyor,
    /// görev kaydedilince o kullanıcının bağlı dış takvimine etkinlik yazılıyordu. Ekran yalnız kendi
    /// kullanıcılarını sunar; kural onu sunucuda kilitler.
    /// </summary>
    public async Task EnsureAssigneeIsValidAsync(Guid? assigneeId)
    {
        if (assigneeId == null)
        {
            return;
        }

        // Kiracı süzgeci açık: başka kiracının kullanıcısı "bulunamadı" olur.
        if (!await _userRepository.AnyAsync(u => u.Id == assigneeId.Value))
        {
            throw new BusinessException(PlatformDomainErrorCodes.TaskAssigneeNotFound)
                .WithData("AssigneeId", assigneeId);
        }
    }

    /// <summary>
    /// Silinen projenin görevlerini (alt görevler dahil — ProjectId'leri üst görevle
    /// aynı) soft-delete eder. Proje soft-delete olunca görevleri kendiliğinden gitmez:
    /// TaskItem'da proje navigasyonu yok, görevi okuyan onlarca sorgu projenin
    /// silindiğini bilmez ve pano/takvim/gösterge paneli yetim görevleri göstermeye
    /// devam ediyordu. Tek görev silmedeki (TaskAppService.DeleteAsync) temizlik burada
    /// da yapılır: bağımlılıklar ve sinyal köprüsü bağı.
    /// <para>Kiracı kapsamını çağıran ayarlar — host başka kiracının projesini
    /// silerken IMultiTenant filtresi kapalı olmalı.</para>
    /// </summary>
    public async Task DeleteByProjectAsync(Guid projectId)
    {
        var tasks = await _taskRepository.GetListAsync(x => x.ProjectId == projectId);
        if (tasks.Count == 0)
        {
            return;
        }

        var taskIds = tasks.Select(x => x.Id).ToList();

        // Başka projedeki bir görev bu görevlerden birine öncül olarak bağlıysa o bağ da gider.
        await _dependencyRepository.DeleteDirectAsync(x =>
            taskIds.Contains(x.TaskId) || taskIds.Contains(x.PredecessorTaskId));

        // Bağ soft-delete DEĞİL ve (SourceType, SourceKey) unique — kalırsa kaynak bir
        // daha göreve dönüştürülemezdi.
        await _issueTaskLinkRepository.DeleteAsync(x => taskIds.Contains(x.TaskId));

        await _taskRepository.DeleteManyAsync(tasks);
    }

    /// <summary>Tenant içindeki bir sonraki görev sırası. DB sequence kullanılmaz —
    /// çift provider'da (Postgres/MSSQL) sequence taşınması güvenilir değil.</summary>
    public async Task<int> GetNextNumberAsync()
    {
        var q = await _taskRepository.GetQueryableAsync(); // IMultiTenant → tenant'a göre filtreli
        var max = await AsyncExecuter.MaxAsync(q.Select(t => (int?)t.Number), x => x) ?? 0;
        return max + 1;
    }

    /// <summary>Görevi hedef projelere taşır/kopyalar.
    /// <para>Move: <paramref name="targetProjectIds"/> listesinin İLKİ hedeftir (görev oraya
    /// taşınır); kalan hedeflere kopya çıkarılır. Copy: kaynak yerinde kalır, her hedefte
    /// bir kopya oluşur.</para>
    /// Dönen liste oluşturulan KOPYALARIN id'leridir (taşınan görev dahil değildir).</summary>
    public async Task<List<Guid>> TransferAsync(
        TaskItem source,
        IReadOnlyList<Guid> targetProjectIds,
        TaskTransferMode mode,
        TaskTransferOptions options,
        DateTime now)
    {
        Check.NotNull(source, nameof(source));
        Check.NotNull(options, nameof(options));

        var targets = (targetProjectIds ?? Array.Empty<Guid>()).Distinct().ToList();
        if (targets.Count == 0)
            throw new BusinessException(PlatformDomainErrorCodes.TaskTransferNoTarget);

        if (mode == TaskTransferMode.Move && targets.Count == 1 && source.ProjectId == targets[0])
            throw new BusinessException(PlatformDomainErrorCodes.TaskTransferSameProject);

        var createdIds = new List<Guid>();
        var copyTargets = targets;

        if (mode == TaskTransferMode.Move)
        {
            await EnsureTrancheLinkedIncomesCanLeaveAsync(source.Id, targets[0]);

            source.MoveToProject(targets[0]);
            await _taskRepository.UpdateAsync(source);
            await SyncFinanceProjectAsync(source.Id, targets[0]);
            copyTargets = targets.Skip(1).ToList(); // kalanlar kopya
        }

        foreach (var projectId in copyTargets)
        {
            var clone = await CloneAsync(source, projectId, options, now);
            createdIds.Add(clone.Id);
        }

        return createdIds;
    }

    /// <summary>
    /// Kapsam tutarlılığı (birleşik sekme sistemi PR-3a): TaskId dolu finans
    /// kaydının ProjectId'si görevden türetilir — görev taşınınca gider/gelir
    /// kayıtları da yeni projeye geçer, bütçe toplamları görevle birlikte yürür.
    /// Change-tracker üzerinden güncellenir (DeleteDirect/raw SQL değil):
    /// Expense/IncomeEntry entity-history seçicisinde, eski/yeni değer audit'e düşer.
    /// Kalem bağı düşürülür — bütçe kalemi projeye özgüdür, eski projenin
    /// kalemine yazılı kalmak sessizce yanlış toplam üretirdi.
    /// </summary>
    private async Task SyncFinanceProjectAsync(Guid taskId, Guid newProjectId)
    {
        // Dilime bağlı gelir buraya gelmez: TransferAsync taşımadan ÖNCE reddeder
        // (EnsureTrancheLinkedIncomesCanLeaveAsync).
        var expenses = await _expenseRepository.GetListAsync(x => x.TaskId == taskId);
        foreach (var e in expenses)
        {
            e.ProjectId = newProjectId;
            e.BudgetLineId = null;
            await _expenseRepository.UpdateAsync(e);
        }

        var incomes = await _incomeRepository.GetListAsync(x => x.TaskId == taskId);
        foreach (var i in incomes)
        {
            i.ProjectId = newProjectId;
            i.BudgetLineId = null;
            await _incomeRepository.UpdateAsync(i);
        }
    }

    /// <summary>
    /// FIN-06 · Görevin bir fon diliminin tahsilatına bağlı geliri varsa görev başka projeye
    /// TAŞINAMAZ. Taşıma görevin gelirlerini de yeni projeye geçirir; bağ ise "aynı projenin
    /// geliri" kuralıyla kurulmuştur — sessizce taşımak, dilimi başka projenin gelirine bağlı
    /// bırakırdı. Aynı ilke: bağlı kaydı koparma, REDDET (kullanıcı önce bağı kaldırır).
    /// Kopyalama etkilenmez: kaynak görev ve gelirleri yerinde kalır.
    /// </summary>
    private async Task EnsureTrancheLinkedIncomesCanLeaveAsync(Guid taskId, Guid newProjectId)
    {
        var incomeIds = (await _incomeRepository.GetListAsync(x => x.TaskId == taskId))
            .Select(i => i.Id)
            .ToList();
        if (incomeIds.Count == 0)
        {
            return;
        }

        var tranche = await _trancheRepository.FirstOrDefaultAsync(t =>
            t.IncomeEntryId != null && incomeIds.Contains(t.IncomeEntryId.Value) && t.ProjectId != newProjectId);

        if (tranche != null)
            throw new BusinessException(PlatformDomainErrorCodes.TaskTransferIncomeLinkedToTranche)
                .WithData("SequenceNo", tranche.SequenceNo);
    }

    /// <summary>Kaynağın seçilen içerikleriyle birlikte tek bir hedef projede kopyasını üretir.</summary>
    private async Task<TaskItem> CloneAsync(
        TaskItem source,
        Guid targetProjectId,
        TaskTransferOptions options,
        DateTime now)
    {
        // Tarihleri bugüne kaydır: aradaki gün farkı korunarak başlangıç bugüne çekilir.
        var shift = options.ShiftDates ? (now.Date - source.StartDate.Date) : TimeSpan.Zero;

        var clone = new TaskItem(
            GuidGenerator.Create(),
            source.Title,
            projectId: targetProjectId,
            parentTaskId: null, // kopya her zaman kök görevdir
            description: source.Description,
            startDate: source.StartDate.Add(shift),
            dueDate: source.DueDate?.Add(shift),
            priority: source.Priority,
            assigneeId: options.KeepAssignee ? source.AssigneeId : null,
            isPrivate: source.IsPrivate,
            tenantId: source.TenantId,
            now: now);

        clone.AssignNumber(await GetNextNumberAsync());
        clone.SetPlanningInfo(source.EstimatedHours, source.TaskType, source.Sprint);
        await _taskRepository.InsertAsync(clone, autoSave: true); // sonraki GetNextNumberAsync doğru MAX'ı görsün

        if (options.Checklist)
        {
            var items = await _checklistRepository.GetListAsync(x => x.TaskId == source.Id);
            foreach (var item in items)
            {
                // Id verilmez: ABP repository'si Guid'i kendisi üretir (AddChecklistItemAsync ile aynı desen).
                await _checklistRepository.InsertAsync(new TaskChecklistItem
                {
                    TaskId = clone.Id,
                    Text = item.Text,
                    IsDone = item.IsDone
                });
            }
        }

        if (options.Comments)
        {
            // Yalnız kök yorumlar kopyalanır: yanıt zinciri ParentCommentId ile kaynağın
            // id'lerine bağlı; kopyada karşılığı olmayan id'ye işaret etmesin diye düzleştirilir.
            var comments = await _commentRepository.GetListAsync(x => x.TaskId == source.Id && x.ParentCommentId == null);
            foreach (var c in comments)
            {
                await _commentRepository.InsertAsync(new TaskComment(clone.Id, clone.TenantId, c.Text));
            }
        }

        if (options.Files)
        {
            // Fiziksel dosya YENİDEN YAZILMAZ; kopya aynı StoredFileName'i işaret eder.
            var files = await _attachmentRepository.GetListAsync(x => x.TaskId == source.Id);
            foreach (var f in files)
            {
                await _attachmentRepository.InsertAsync(new TaskAttachment
                {
                    TaskId = clone.Id,
                    TenantId = clone.TenantId,
                    FileName = f.FileName,
                    StoredFileName = f.StoredFileName,
                    ContentType = f.ContentType,
                    FileSize = f.FileSize
                });
            }
        }

        if (options.KeepLinks)
        {
            var deps = await _dependencyRepository.GetListAsync(x => x.TaskId == source.Id);
            foreach (var d in deps)
            {
                await _dependencyRepository.InsertAsync(
                    new TaskDependency(GuidGenerator.Create(), clone.Id, d.PredecessorTaskId));
            }
        }

        // Etiketler her zaman taşınır (tasarımda ayrı anahtarı yok).
        var tags = await _tagAssignmentRepository.GetListAsync(x => x.TaskId == source.Id);
        foreach (var t in tags)
        {
            await _tagAssignmentRepository.InsertAsync(
                new TaskTagAssignment(GuidGenerator.Create(), clone.Id, t.TagId));
        }

        if (options.Subtasks)
        {
            var subtasks = await _taskRepository.GetListAsync(x => x.ParentTaskId == source.Id);
            foreach (var sub in subtasks)
            {
                await CloneSubtaskAsync(sub, clone, targetProjectId, options, now, shift);
            }
        }

        return clone;
    }

    /// <summary>Alt görev kopyası — kendi kontrol listesini taşır, ama alt-alt görev
    /// zincirine inmez (görev modelinde tek seviye alt görev kullanılıyor).</summary>
    private async Task CloneSubtaskAsync(
        TaskItem sub,
        TaskItem parentClone,
        Guid targetProjectId,
        TaskTransferOptions options,
        DateTime now,
        TimeSpan shift)
    {
        var subClone = new TaskItem(
            GuidGenerator.Create(),
            sub.Title,
            projectId: targetProjectId,
            parentTaskId: parentClone.Id,
            description: sub.Description,
            startDate: sub.StartDate.Add(shift),
            dueDate: sub.DueDate?.Add(shift),
            priority: sub.Priority,
            assigneeId: options.KeepAssignee ? sub.AssigneeId : null,
            isPrivate: sub.IsPrivate,
            tenantId: sub.TenantId,
            now: now);

        subClone.AssignNumber(await GetNextNumberAsync());
        subClone.SetPlanningInfo(sub.EstimatedHours, sub.TaskType, sub.Sprint);
        await _taskRepository.InsertAsync(subClone, autoSave: true);

        if (!options.Checklist) return;

        var items = await _checklistRepository.GetListAsync(x => x.TaskId == sub.Id);
        foreach (var item in items)
        {
            await _checklistRepository.InsertAsync(new TaskChecklistItem
            {
                TaskId = subClone.Id,
                Text = item.Text,
                IsDone = item.IsDone
            });
        }
    }
}
