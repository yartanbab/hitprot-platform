using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Webhooks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Grants;
using Apya.Platform.Notifications;
using Apya.Platform.Projects;

namespace Apya.Platform.DbMigrator.DemoWorld;

public partial class DemoWorldSeeder
{
    // ============================================================
    //  Hibe: katalog → çağrı → başvuru → kilometre taşı + hakediş dilimi
    // ============================================================

    private async Task SeedGrantsAsync(Guid? tenantId, List<DemoProject> projects, bool isPrimary)
    {
        var grants = new[]
        {
            new Grant(_guid.Create(), "TUBITAK 1501 Sanayi Ar-Ge", "TUBITAK", 1_500_000m, 75.0) { TenantId = tenantId },
            new Grant(_guid.Create(), "TUBITAK 1507 KOBI Ar-Ge", "TUBITAK", 600_000m, 60.0) { TenantId = tenantId },
            new Grant(_guid.Create(), "KOSGEB Ar-Ge Destegi", "KOSGEB", 1_000_000m, 50.0) { TenantId = tenantId },
            new Grant(_guid.Create(), "Ticaret Bak. Kuresel Tedarik Zinciri", "Ticaret Bakanligi", 25_000_000m, 80.0) { TenantId = tenantId },
        };
        await Repo<Grant>().InsertManyAsync(grants, autoSave: true);

        var calls = new List<GrantCall>();
        var applications = new List<GrantApplication>();
        var milestones = new List<GrantMilestone>();
        var tranches = new List<GrantDisbursementTranche>();

        // Her hibe için bir çağrı: bir kısmı açık, bir kısmı kapanmış, biri planlanan.
        for (var i = 0; i < grants.Length; i++)
        {
            var status = i switch
            {
                0 => GrantCallStatus.Acik,
                1 => GrantCallStatus.Acik,
                2 => GrantCallStatus.Kapandi,
                _ => GrantCallStatus.Planlandi
            };

            var call = new GrantCall(_guid.Create(), grants[i].Id, $"{_today.Year}-{i + 1}. Donem", status)
            {
                TenantId = tenantId,
                Budget = grants[i].MaxAmount,
                Reference = $"CGR-{_today.Year}-{i + 1:D2}"
            };

            call.SetSchedule(
                status == GrantCallStatus.Planlandi ? Day(30) : Day(-Rand(120, 240)),
                status switch
                {
                    GrantCallStatus.Acik => Day(Rand(10, 60)),
                    GrantCallStatus.Kapandi => Day(-Rand(10, 40)),
                    _ => Day(Rand(90, 150))
                });

            calls.Add(call);
        }

        // Hibe kategorisindeki projeler için başvuru zinciri kur.
        var grantProjects = projects.Where(p => p.Category == ProjectCategory.GrantProject).ToList();
        var openCalls = calls.Where(c => c.Status != GrantCallStatus.Planlandi).ToList();

        for (var i = 0; i < grantProjects.Count && openCalls.Count > 0; i++)
        {
            var project = grantProjects[i];
            var call = openCalls[i % openCalls.Count];

            var application = new GrantApplication(_guid.Create(), tenantId, call.Id);

            // Aşama dağılımı: başvuru → değerlendirme → onay → ödeme
            var stage = (GrantApplicationStage)(_grantAppNo++ % 4);
            if (stage != GrantApplicationStage.Basvuru)
            {
                application.AdvanceStage(
                    stage,
                    stage >= GrantApplicationStage.Onay ? Math.Round(project.Budget * 0.65m, 2) : null);
            }

            applications.Add(application);

            // Kilometre taşları — bir kısmı tamamlanmış, biri gecikmiş, biri ileri tarihli.
            var milestoneSpecs = new (string Title, int DueOffset, bool Done)[]
            {
                ("Baslangic raporu teslimi", -Rand(90, 150), true),
                ("Ara donem teknik rapor", -Rand(5, 30), false),
                ("Prototip dogrulama", Rand(15, 60), false),
                ("Sonuc raporu ve kapanis", Rand(90, 200), false),
            };

            foreach (var m in milestoneSpecs)
            {
                var milestone = new GrantMilestone(_guid.Create(), tenantId, application.Id, m.Title, Day(m.DueOffset));
                if (m.Done)
                {
                    milestone.Complete();
                }
                milestones.Add(milestone);
            }

            // Hakediş dilimleri — ödenmiş / talep edilmiş / planlanan
            if (stage >= GrantApplicationStage.Onay)
            {
                var total = Math.Round(project.Budget * 0.65m, 2);
                var slice = Math.Round(total / 3m, 2);

                for (var t = 1; t <= 3; t++)
                {
                    var tranche = new GrantDisbursementTranche(
                        _guid.Create(), tenantId, application.Id, t, slice, Day(-120 + t * 60));

                    if (t == 1) { tranche.MarkPaid(); }
                    else if (t == 2 && stage == GrantApplicationStage.Odeme) { tranche.MarkPaid(); }

                    tranches.Add(tranche);
                }
            }
        }

        await Repo<GrantCall>().InsertManyAsync(calls, autoSave: true);
        await Repo<GrantApplication>().InsertManyAsync(applications, autoSave: true);
        await Repo<GrantMilestone>().InsertManyAsync(milestones, autoSave: true);
        await Repo<GrantDisbursementTranche>().InsertManyAsync(tranches, autoSave: true);
    }

    // ============================================================
    //  Dokümanlar
    // ============================================================

    private async Task SeedDocumentsAsync(Guid? tenantId, List<DemoProject> projects)
    {
        var documents = new List<Document>();

        foreach (var project in projects)
        {
            foreach (var title in DemoWorldData.DocumentTitles.OrderBy(_ => _rnd.Next()).Take(Rand(1, 4)))
            {
                var document = new Document(
                    _guid.Create(), tenantId, $"{title} - {project.Code}",
                    $"# {title}\n\n{project.Name} projesi kapsaminda hazirlanan demo dokumandir.\n\n" +
                    "- Kapsam ve hedefler\n- Sorumluluklar\n- Zaman plani\n- Riskler ve onlemler\n",
                    projectId: project.Id,
                    parentDocumentId: null,
                    // İkon alanı EMOJİ bekler (Documents CreateModal placeholder "📄"), FontAwesome sınıfı değil.
                    icon: Pick(new[] { "📄", "📑", "📋", "🗂️" }));

                // Bir kısmının son kullanma tarihi var; bir bölümü yakında doluyor
                // (Dokumanlar ekranindaki "suresi doluyor" uyarisi bos kalmasin).
                if (Chance(30))
                {
                    document.ExpiryDate = Day(Rand(-20, 60));
                }

                documents.Add(document);
            }
        }

        await Repo<Document>().InsertManyAsync(documents, autoSave: true);
    }

    // ============================================================
    //  Dinamik formlar (Şablonlar & Formlar) + webhook
    // ============================================================

    private async Task SeedFormsAsync(Guid? tenantId, string slug, DemoTeam team, bool isPrimary)
    {
        var categories = new[]
        {
            new FormCategory(_guid.Create(), "Ic Talepler", "#2563eb", "📥", 1) { TenantId = tenantId },
            new FormCategory(_guid.Create(), "Musteri Geri Bildirim", "#16a34a", "💬", 2) { TenantId = tenantId },
        };
        await Repo<FormCategory>().InsertManyAsync(categories, autoSave: true);

        var forms = new List<AppDocument>();
        var responses = new List<AppResponse>();

        var formSpecs = new (string Title, string Slug, int CategoryIndex, (BlockType Type, string Label)[] Fields)[]
        {
            ("Proje Talep Formu", $"proje-talep-{slug}", 0, new[]
            {
                (BlockType.ShortText, "Talep basligi"),
                (BlockType.LongText, "Talebin aciklamasi"),
                (BlockType.Select, "Oncelik"),
                (BlockType.DatePicker, "Hedeflenen tarih"),
                (BlockType.Number, "Tahmini butce"),
            }),
            ("Musteri Memnuniyet Anketi", $"memnuniyet-{slug}", 1, new[]
            {
                (BlockType.Rating, "Genel memnuniyet"),
                (BlockType.Nps, "Tavsiye eder misiniz?"),
                (BlockType.LongText, "Gorusleriniz"),
                (BlockType.Email, "E-posta"),
            }),
            ("Izin Talep Formu", $"izin-talep-{slug}", 0, new[]
            {
                (BlockType.ShortText, "Ad Soyad"),
                (BlockType.DatePicker, "Baslangic tarihi"),
                (BlockType.DatePicker, "Bitis tarihi"),
                (BlockType.Select, "Izin turu"),
            }),
        };

        foreach (var spec in formSpecs)
        {
            var form = new AppDocument(_guid.Create(), spec.Title, spec.Slug);
            form.TenantId = tenantId;
            form.SetCategory(categories[spec.CategoryIndex].Id);
            form.SetDescription($"{spec.Title} — demo formu.");

            for (var i = 0; i < spec.Fields.Length; i++)
            {
                var (type, label) = spec.Fields[i];
                form.AddBlock(
                    _guid.Create(), type, i + 1,
                    content: label,
                    settings: "{\"required\":" + (i == 0 ? "true" : "false") + "}");
            }

            // Üçüncü form taslak kalsın — yayınlanmış/taslak ayrımı görünsün.
            if (spec.Slug.StartsWith("izin-talep", StringComparison.Ordinal) == false)
            {
                form.Publish();
            }

            forms.Add(form);

            // Yanıtlar — yalnız yayınlanmış formlara.
            if (form.Status == FormStatus.Published)
            {
                var responseCount = Rand(3, 9);
                for (var r = 0; r < responseCount; r++)
                {
                    var answers = "{\"" + spec.Fields[0].Label + "\":\"Demo yanit " + (r + 1) + "\"}";
                    var response = new AppResponse(
                        _guid.Create(), form.Id, answers,
                        respondentId: Chance(60) ? Pick(team.All) : null,
                        completionSeconds: Rand(45, 400));

                    response.TenantId = tenantId;
                    response.SetStatus(Chance(70) ? ResponseStatus.Reviewed : ResponseStatus.Pending);
                    responses.Add(response);

                    // Formdaki yanit sayaci denormalize tutuluyor; yanit satirini eklemek
                    // yetmez, sayaci da islemek gerekir yoksa kart "0 yanit" gosterir.
                    form.IncrementResponseCount();
                }
            }
        }

        await Repo<AppDocument>().InsertManyAsync(forms, autoSave: true);
        await Repo<AppResponse>().InsertManyAsync(responses, autoSave: true);

        // Webhook aboneliği — form yanıtlarını dış sisteme iletmek üzere.
        var published = forms.FirstOrDefault(f => f.Status == FormStatus.Published);
        if (published != null)
        {
            var subscription = new WebhookSubscription(
                _guid.Create(), published.Id,
                $"https://hooks.{slug}-demo.com/apya/forms",
                secret: $"whsec_{Guid.NewGuid():N}")
            {
                TenantId = tenantId
            };

            await Repo<WebhookSubscription>().InsertAsync(subscription, autoSave: true);
        }
    }

    // ============================================================
    //  Platform: bildirimler ve geri bildirim
    // ============================================================

    private async Task SeedPlatformAsync(Guid? tenantId, DemoTeam team, List<DemoProject> projects, bool isPrimary)
    {
        var notifications = new List<Notification>();

        foreach (var userId in team.All)
        {
            var count = Rand(3, 8);
            for (var i = 0; i < count; i++)
            {
                var project = Pick(projects);

                var (type, title, body) = Pick(new (NotificationType, string, string)[]
                {
                    (NotificationType.TaskAssigned, "Size yeni gorev atandi",
                        $"{project.Name} projesinde bir gorev size atandi."),
                    (NotificationType.TaskDueSoon, "Gorev teslim tarihi yaklasiyor",
                        $"{project.Name} projesindeki bir gorevin vadesi yaklasti."),
                    (NotificationType.TaskCommentAdded, "Goreve yorum eklendi",
                        $"{project.Name} projesindeki bir goreve yeni yorum eklendi."),
                    (NotificationType.TaskStatusChanged, "Gorev durumu degisti",
                        $"{project.Name} projesinde bir gorevin durumu guncellendi."),
                    (NotificationType.ProjectMemberAdded, "Projeye eklendiniz",
                        $"{project.Name} projesine ekip uyesi olarak eklendiniz."),
                    (NotificationType.DocumentExpiring, "Dokuman suresi doluyor",
                        $"{project.Code} kodlu projede bir dokumanin suresi yaklasiyor."),
                });

                var notification = new Notification(
                    _guid.Create(), tenantId, userId, type, title, body,
                    entityType: "Project", entityId: project.Id,
                    actorUserId: team.CeoId, actorName: "Demo Yonetici");

                if (Chance(45))
                {
                    notification.IsRead = true;
                    notification.ReadAt = Day(-Rand(1, 20));
                }

                notifications.Add(notification);
            }
        }

        await Repo<Notification>().InsertManyAsync(notifications, autoSave: true);

        // Geri bildirim yalnız ana bağlamda — panel dolu görünsün, kiracılarda gürültü olmasın.
        if (!isPrimary)
        {
            return;
        }

        var feedbacks = new List<Feedback>();
        var no = 0;

        foreach (var spec in DemoWorldData.Feedbacks)
        {
            no++;
            var feedback = new Feedback(
                _guid.Create(), tenantId, (FeedbackType)spec.Type, spec.Subject, spec.Body,
                rating: spec.Type == 4 ? 5 : null)
            {
                FeedbackNumber = $"GB-{_today.Year}-{no:D4}",
                SubmittedByUserName = "demo.kullanici",
                PageUrl = "/Tasks",
                AppVersion = "1.0.0"
            };

            if (Chance(50))
            {
                feedback.ChangeStatus(FeedbackStatus.InReview, _clock.Now);
            }

            feedbacks.Add(feedback);
        }

        await Repo<Feedback>().InsertManyAsync(feedbacks, autoSave: true);
    }
}
