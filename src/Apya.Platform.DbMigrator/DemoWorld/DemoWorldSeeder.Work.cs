using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Customers;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;
using TaskComment = Apya.Platform.Tasks.TaskComment;

namespace Apya.Platform.DbMigrator.DemoWorld;

public partial class DemoWorldSeeder
{
    /// <summary>Finans ve modül tohumlamasının ihtiyaç duyduğu proje özeti.</summary>
    private sealed record DemoProject(
        Guid Id,
        string Name,
        string Code,
        Guid CustomerId,
        decimal Budget,
        DateTime Start,
        DateTime End,
        ProjectCategory Category);

    // ============================================================
    //  Kur, kasa, cari, etiket
    // ============================================================

    private async Task SeedExchangeRatesAsync(Guid? tenantId)
    {
        var rates = new List<ExchangeRate>();
        // Son 6 ay için aylık kur — kur ekranı ve değerleme anlamlı bir seri görsün.
        for (var monthsAgo = 5; monthsAgo >= 0; monthsAgo--)
        {
            var date = Day(-monthsAgo * 30);
            rates.Add(new ExchangeRate(_guid.Create(), "USD", "TRY", 38.20m + monthsAgo * 0.35m, date, ExchangeRateSource.Tcmb, tenantId));
            rates.Add(new ExchangeRate(_guid.Create(), "EUR", "TRY", 41.60m + monthsAgo * 0.40m, date, ExchangeRateSource.Tcmb, tenantId));
        }

        await Repo<ExchangeRate>().InsertManyAsync(rates, autoSave: true);
    }

    private async Task<Guid[]> SeedCashAccountsAsync(Guid? tenantId)
    {
        var accounts = new[]
        {
            new CashAccount(_guid.Create(), "Merkez Nakit Kasa", CashAccountType.Cash, "TRY", 450_000m, tenantId),
            new CashAccount(_guid.Create(), "Ziraat Bankasi - Vadesiz TL", CashAccountType.Bank, "TRY", 3_200_000m, tenantId)
            {
                BankName = "Ziraat Bankasi",
                Iban = "TR33 0001 0012 3456 7890 1234 56"
            },
            new CashAccount(_guid.Create(), "Garanti BBVA - USD Hesap", CashAccountType.Bank, "USD", 120_000m, tenantId)
            {
                BankName = "Garanti BBVA",
                Iban = "TR91 0006 2000 1112 3456 7890 12"
            },
            new CashAccount(_guid.Create(), "Sirket Kredi Karti", CashAccountType.CreditCard, "TRY", 0m, tenantId)
            {
                BankName = "Yapi Kredi"
            },
        };

        await Repo<CashAccount>().InsertManyAsync(accounts, autoSave: true);
        return accounts.Select(a => a.Id).ToArray();
    }

    private async Task<Guid[]> SeedCustomersAsync(Guid? tenantId)
    {
        var list = new List<Customer>();

        foreach (var name in DemoWorldData.CustomerNames.Take(10))
        {
            list.Add(new Customer(_guid.Create(), name, tenantId)
            {
                TaxNumber = Rand(1000000000, 2000000000).ToString(),
                TaxOffice = Pick(new[] { "Kadikoy", "Besiktas", "Cankaya", "Bornova", "Nilufer" }),
                Email = "muhasebe@" + name.Split(' ')[0].ToLowerInvariant() + "-demo.com",
                Phone = "0212 " + Rand(200, 900) + " " + Rand(10, 99) + " " + Rand(10, 99)
            });
        }

        // Hibe kurumları da cari olarak tutulur (hibe projelerinin karşı tarafı).
        foreach (var body in DemoWorldData.GrantBodies)
        {
            list.Add(new Customer(_guid.Create(), body, tenantId)
            {
                TaxOffice = "Ankara",
                Email = "destek@" + body.Split(' ')[0].ToLowerInvariant() + "-demo.gov.tr"
            });
        }

        await Repo<Customer>().InsertManyAsync(list, autoSave: true);
        return list.Select(c => c.Id).ToArray();
    }

    private async Task<Guid[]> SeedTagsAsync(Guid? tenantId)
    {
        var tags = DemoWorldData.TagNames
            .Select(n => new Tag(_guid.Create(), n, tenantId))
            .ToArray();

        await Repo<Tag>().InsertManyAsync(tags, autoSave: true);
        return tags.Select(t => t.Id).ToArray();
    }

    // ============================================================
    //  Projeler
    // ============================================================

    private async Task<List<DemoProject>> SeedProjectsAsync(
        Guid? tenantId, string orgName, int count, Guid[] customerIds, DemoTeam team)
    {
        var projects = new List<Project>();
        var members = new List<ProjectMember>();
        var columns = new List<BoardColumn>();
        var result = new List<DemoProject>();

        for (var i = 0; i < count; i++)
        {
            // Her 5 projeden biri hibe, her 8'de biri etkinlik — kategori kırılımı görünsün.
            var category = i % 5 == 4 ? ProjectCategory.GrantProject
                         : i % 8 == 7 ? ProjectCategory.Event
                         : ProjectCategory.Other;

            var topic = category switch
            {
                ProjectCategory.GrantProject => Pick(DemoWorldData.GrantTopics),
                ProjectCategory.Event => Pick(DemoWorldData.EventTopics),
                _ => DemoWorldData.ProjectTopics[i % DemoWorldData.ProjectTopics.Length]
            };

            var name = category == ProjectCategory.Event ? $"{topic} {_today.Year}" : topic;

            // Hibe projesi karşı tarafı hibe kurumu; diğerleri normal cari.
            var customerId = category == ProjectCategory.GrantProject
                ? customerIds[customerIds.Length - 1 - (i % DemoWorldData.GrantBodies.Length)]
                : customerIds[i % 10];

            // Yaşam döngüsü: bir kısmı bitmiş, bir kısmı sürüyor, bir kısmı yeni başlamış.
            var start = Day(-Rand(30, 420));
            var end = start.AddDays(Rand(120, 400));
            var budget = Money(600, 9000);

            var project = new Project(
                _guid.Create(),
                tenantId: tenantId,
                grantId: null,
                name: name,
                code: $"PRJ-{_today.Year}-{(i + 1):D3}",
                description: $"{orgName} bunyesinde yurutulen {name.ToLowerInvariant()} projesi.",
                totalBudget: budget,
                hourlyRate: Rand(900, 1800),
                currency: "TRY",
                purpose: "Operasyonel verimliligi artirmak ve olculebilir is sonucu uretmek.",
                duration: $"{(end - start).Days / 30} ay",
                targetAudience: "Ilgili is birimleri ve son kullanicilar",
                activities: "Analiz, tasarim, gelistirme, test, devreye alma ve kapanis raporlamasi.",
                startDate: start,
                endDate: end,
                customerId: customerId,
                category: category);

            project.Approve();
            projects.Add(project);

            result.Add(new DemoProject(project.Id, name, project.Code, customerId, budget, start, end, category));

            // Ekip: bir yönetici lead, çalışanlardan birkaçı üye, ara sıra stajyer gözlemci.
            var lead = team.ManagerIds[i % team.ManagerIds.Count];
            members.Add(new ProjectMember(_guid.Create(), project.Id, lead, ProjectMemberRole.Lead, tenantId));

            foreach (var employeeId in team.EmployeeIds.Take(2 + (i % 2)))
            {
                members.Add(new ProjectMember(_guid.Create(), project.Id, employeeId, ProjectMemberRole.Member, tenantId));
            }

            if (i % 3 == 0)
            {
                members.Add(new ProjectMember(_guid.Create(), project.Id, team.InternId, ProjectMemberRole.Observer, tenantId));
            }

            // Kanban sistem kolonları — görevler BoardColumnId boş olduğunda Status'a göre
            // bu kolonlara düşer (BoardColumn.StatusValue eşlemesi).
            columns.Add(new BoardColumn(_guid.Create(), project.Id, "Yapilacak", 1, "secondary", (int)TaskStatus.Todo, true, tenantId));
            columns.Add(new BoardColumn(_guid.Create(), project.Id, "Devam Ediyor", 2, "primary", (int)TaskStatus.InProgress, true, tenantId));
            columns.Add(new BoardColumn(_guid.Create(), project.Id, "Kontrolde", 3, "warning", (int)TaskStatus.InReview, true, tenantId));
            columns.Add(new BoardColumn(_guid.Create(), project.Id, "Tamamlandi", 4, "success", (int)TaskStatus.Done, true, tenantId));
        }

        await Repo<Project>().InsertManyAsync(projects, autoSave: true);
        await Repo<ProjectMember>().InsertManyAsync(members, autoSave: true);
        await Repo<BoardColumn>().InsertManyAsync(columns, autoSave: true);

        return result;
    }

    // ============================================================
    //  Görevler ve tüm derinliği
    // ============================================================

    private async Task SeedTasksAsync(
        Guid? tenantId, List<DemoProject> projects, DemoTeam team, Guid[] tagIds, bool isPrimary)
    {
        var roots = new List<TaskItem>();
        var subs = new List<TaskItem>();
        var checklist = new List<TaskChecklistItem>();
        var tagLinks = new List<TaskTagAssignment>();
        var comments = new List<TaskComment>();
        var watchers = new List<TaskWatcher>();
        var favorites = new List<TaskFavorite>();
        var dependencies = new List<TaskDependency>();
        var timeLogs = new List<TaskTimeLog>();

        foreach (var project in projects)
        {
            var taskCount = Rand(6, 11);
            var projectRootIds = new List<Guid>();

            for (var t = 0; t < taskCount; t++)
            {
                var (status, dueOffset) = PlanSchedule(t, taskCount);
                var assignee = Pick(team.Assignable);

                var root = BuildTask(
                    tenantId, project.Id, DemoWorldData.TaskTitles[(t * 3 + project.Code.Length) % DemoWorldData.TaskTitles.Length],
                    status, dueOffset, assignee, parentId: null);

                roots.Add(root);
                projectRootIds.Add(root.Id);

                // --- alt görevler ---
                if (Chance(45))
                {
                    var subCount = Rand(1, 4);
                    for (var s = 0; s < subCount; s++)
                    {
                        var subStatus = status == TaskStatus.Done
                            ? TaskStatus.Done
                            : Pick(new[] { TaskStatus.Todo, TaskStatus.InProgress, TaskStatus.Done });

                        subs.Add(BuildTask(
                            tenantId, project.Id, Pick(DemoWorldData.SubTaskTitles),
                            subStatus, dueOffset + Rand(-4, 9), Pick(team.Assignable), parentId: root.Id));
                    }
                }

                // --- kontrol listesi ---
                if (Chance(50))
                {
                    foreach (var text in DemoWorldData.ChecklistItems.OrderBy(_ => _rnd.Next()).Take(Rand(2, 5)))
                    {
                        checklist.Add(new TaskChecklistItem
                        {
                            TaskId = root.Id,
                            Text = text,
                            IsDone = status == TaskStatus.Done || Chance(40)
                        });
                    }
                }

                // --- etiketler ---
                foreach (var tagId in tagIds.OrderBy(_ => _rnd.Next()).Take(Rand(0, 3)))
                {
                    tagLinks.Add(new TaskTagAssignment(_guid.Create(), root.Id, tagId));
                }

                // --- yorum ---
                if (Chance(30))
                {
                    comments.Add(new TaskComment(root.Id, Pick(DemoWorldData.TaskComments)));
                }

                // --- izleyen / favori ---
                if (Chance(35))
                {
                    watchers.Add(new TaskWatcher(_guid.Create(), root.Id, team.CeoId));
                }

                if (Chance(20))
                {
                    favorites.Add(new TaskFavorite(_guid.Create(), root.Id, Pick(team.ManagerIds)));
                }

                // --- zaman kaydı (tamamlanmış / süren işlerde) ---
                if (status != TaskStatus.Todo && Chance(55))
                {
                    var start = Day(dueOffset - Rand(3, 12)).AddHours(9);
                    var log = new TaskTimeLog(_guid.Create(), root.Id, assignee, start, "Calisma kaydi")
                    {
                        TenantId = tenantId,
                        EndTime = start.AddHours(Rand(2, 8))
                    };
                    log.SecondsSpent = (long)(log.EndTime!.Value - start).TotalSeconds;
                    timeLogs.Add(log);
                }
            }

            // --- bağımlılıklar: zincirin ikinci görevi ilkine bağlı olsun ---
            if (projectRootIds.Count >= 3 && Chance(60))
            {
                dependencies.Add(new TaskDependency(_guid.Create(), projectRootIds[2], projectRootIds[0]));
            }
        }

        // Kök görevler önce yazılır; alt görevler ParentTaskId ile onlara bağlanır.
        await Repo<TaskItem>().InsertManyAsync(roots, autoSave: true);
        await Repo<TaskItem>().InsertManyAsync(subs, autoSave: true);

        await Repo<TaskChecklistItem>().InsertManyAsync(checklist, autoSave: true);
        await Repo<TaskTagAssignment>().InsertManyAsync(tagLinks, autoSave: true);
        await Repo<TaskComment>().InsertManyAsync(comments, autoSave: true);
        await Repo<TaskWatcher>().InsertManyAsync(watchers, autoSave: true);
        await Repo<TaskFavorite>().InsertManyAsync(favorites, autoSave: true);
        await Repo<TaskDependency>().InsertManyAsync(dependencies, autoSave: true);
        await Repo<TaskTimeLog>().InsertManyAsync(timeLogs, autoSave: true);

        if (isPrimary)
        {
            await SeedTaskTemplatesAsync(tenantId);
        }
    }

    /// <summary>
    /// Görev takvimini kurgular. Her projede bilinçli olarak gecikmiş, bu hafta teslim
    /// ve ileri tarihli iş bulunur — pano ve raporlardaki kırılımlar boş kalmasın.
    /// </summary>
    private (TaskStatus Status, int DueOffset) PlanSchedule(int index, int total)
    {
        // ilk ~%40 tamamlanmış, sonraki ~%20 gecikmiş, sonra bu hafta, kalanı ileri tarihli
        var ratio = (double)index / total;

        if (ratio < 0.40)
        {
            return (TaskStatus.Done, -Rand(10, 120));
        }

        if (ratio < 0.60)
        {
            return (Chance(70) ? TaskStatus.InProgress : TaskStatus.Todo, -Rand(1, 40));
        }

        if (ratio < 0.80)
        {
            return (Pick(new[] { TaskStatus.InProgress, TaskStatus.InReview }), Rand(0, 8));
        }

        return (TaskStatus.Todo, Rand(8, 70));
    }

    private TaskItem BuildTask(
        Guid? tenantId, Guid projectId, string title, TaskStatus status,
        int dueOffset, Guid assigneeId, Guid? parentId)
    {
        var startOffset = dueOffset - Rand(5, 30);

        var task = new TaskItem(
            _guid.Create(),
            title,
            projectId: projectId,
            parentTaskId: parentId,
            description: null,
            startDate: Day(startOffset),
            dueDate: Day(dueOffset),
            priority: Pick(new[] { TaskPriority.Low, TaskPriority.Medium, TaskPriority.Medium, TaskPriority.High, TaskPriority.Critical }),
            assigneeId: assigneeId,
            isPrivate: false,
            tenantId: tenantId,
            now: _today);

        task.AssignNumber(++_taskNumber);
        task.SetPlanningInfo(Rand(4, 120), Pick(DemoWorldData.TaskTypes), $"Sprint {Rand(1, 15)}");

        if (status != TaskStatus.Todo)
        {
            // Tamamlanma tarihi vade civarına düşsün — "zamaninda/gec kapandi" kirilimi anlamli olsun.
            task.ChangeStatus(status, Day(dueOffset - Rand(0, 3)));
        }

        return task;
    }

    private async Task SeedTaskTemplatesAsync(Guid? tenantId)
    {
        var templates = new List<TaskTemplate>();

        var specs = new (string Name, string Title, TaskPriority Priority, string[] Items)[]
        {
            ("Yeni Ozellik Gelistirme", "Ozellik: {ad}", TaskPriority.Medium,
                new[] { "Gereksinim netlestir", "Tasarim cikar", "Gelistir", "Test et", "Devreye al" }),
            ("Hata Kaydi", "Hata: {ozet}", TaskPriority.High,
                new[] { "Yeniden uret", "Kok neden bul", "Duzelt", "Regresyon testi" }),
            ("Aylik Mali Kapanis", "Mali kapanis - {ay}", TaskPriority.Critical,
                new[] { "Fatura mutabakati", "Kasa sayimi", "Cari mutabakat", "Rapor uret" }),
        };

        foreach (var spec in specs)
        {
            var template = new TaskTemplate(
                _guid.Create(), tenantId, spec.Name, spec.Title, spec.Priority,
                description: "Demo sablonu — tekrar eden isler icin hazir govde.",
                estimatedHours: Rand(8, 40),
                taskType: Pick(DemoWorldData.TaskTypes));

            for (var i = 0; i < spec.Items.Length; i++)
            {
                template.AddItem(_guid.Create(), spec.Items[i], i + 1);
            }

            templates.Add(template);
        }

        await Repo<TaskTemplate>().InsertManyAsync(templates, autoSave: true);
    }
}
