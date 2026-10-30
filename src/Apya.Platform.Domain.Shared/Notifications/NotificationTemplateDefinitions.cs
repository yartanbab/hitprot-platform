using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.Notifications;

/// <summary>
/// Faz 4 · Düzenlenebilir bildirim metninin tanımı: bir tür ve hâli (ör. "bugün bitiyor"), varsayılan metnin
/// yerelleştirme anahtarları ve o anahtarlardaki <c>{0}</c>, <c>{1}</c>… yerlerinin adlandırılmış karşılıkları.
/// </summary>
/// <param name="TitleArgs">Başlık anahtarındaki sıralı yerlerin değişken adları (<c>{0}</c> → ilk eleman).</param>
/// <param name="BodyArgs">Gövde anahtarındaki sıralı yerlerin değişken adları.</param>
public record NotificationTemplateDefinition(
    NotificationType Type,
    string Variant,
    string TitleKey,
    string[] TitleArgs,
    string BodyKey,
    string[] BodyArgs)
{
    /// <summary>Bu metinde kullanılabilecek değişkenler (üreticinin doldurdukları).</summary>
    public IReadOnlyList<string> Variables => TitleArgs.Concat(BodyArgs).Distinct().ToList();
}

/// <summary>
/// Faz 4 · Host'un metnini düzenleyebildiği hibe dışı bildirimler (kullanıcı kararı 10-29: Görev, Proje, Finans).
///
/// <para>Varsayılan metin BUGÜNKÜ <c>tr.json</c> metnidir; tohumlama sıralı yerleri adlandırılmış değişkenlere
/// çevirerek şablona yazar, host dokunmadıkça bildirim bir harf değişmez. Bir türün birden çok hâli varsa
/// (bugün bitiyor / N gün kaldı, son tarih kaldırıldı…) her hâl ayrı metindir: koşul koda gömülü kalır,
/// metin host'ta.</para>
/// </summary>
public static class NotificationTemplateDefinitions
{
    public const string Default = "Default";
    public const string Removed = "Removed";
    public const string Today = "Today";
    public const string NoOpenTasks = "NoOpenTasks";
    public const string TodayNoOpenTasks = "TodayNoOpenTasks";
    public const string Purchase = "Purchase";
    public const string Sales = "Sales";

    private const string Task = "{görev_adı}";
    private const string Commenter = "{yorumlayan}";
    private const string Comment = "{yorum}";
    private const string ChangedBy = "{değiştiren}";
    private const string Project = "{proje_adı}";

    public static readonly IReadOnlyList<NotificationTemplateDefinition> All =
    [
        // --- Görev
        new(NotificationType.TaskAssigned, Default,
            "Notification:TaskAssigned:Title", [], "Notification:TaskAssigned:Body", [Task]),
        new(NotificationType.TaskCommentAdded, Default,
            "Notification:TaskComment:Title", [], "Notification:TaskComment:Body", [Commenter, Comment]),
        new(NotificationType.Mention, Default,
            "Notification:Mention:Title", [], "Notification:Mention:Body", [Commenter, Task, Comment]),
        new(NotificationType.CommentReplied, Default,
            "Notification:CommentReplied:Title", [], "Notification:CommentReplied:Body", [Commenter, Task, Comment]),
        new(NotificationType.TaskStatusChanged, Default,
            "Notification:TaskStatus:Title", [], "Notification:TaskStatus:Body", [Task, ChangedBy, "{durum}"]),
        new(NotificationType.TaskUnassigned, Default,
            "Notification:TaskUnassigned:Title", [], "Notification:TaskUnassigned:Body", [ChangedBy, Task]),
        new(NotificationType.TaskDueDateChanged, Default,
            "Notification:TaskDueDateChanged:Title", [], "Notification:TaskDueDateChanged:Body", [ChangedBy, Task, "{yeni_tarih}"]),
        new(NotificationType.TaskDueDateChanged, Removed,
            "Notification:TaskDueDateChanged:Title", [], "Notification:TaskDueDateChanged:Body:Removed", [ChangedBy, Task]),
        new(NotificationType.TaskPriorityRaised, Default,
            "Notification:TaskPriorityRaised:Title", [], "Notification:TaskPriorityRaised:Body", [ChangedBy, Task]),
        new(NotificationType.TaskDueSoon, Default,
            "Notification:TaskDueSoon:Title", [], "Notification:TaskDueSoon:Body", [Task]),
        new(NotificationType.TaskOverdue, Default,
            "Notification:TaskOverdue:Title", [], "Notification:TaskOverdue:Body", [Task, "{gecikme_gün}"]),
        new(NotificationType.TaskOverdueEscalated, Default,
            "Notification:TaskOverdueEscalated:Title", [], "Notification:TaskOverdueEscalated:Body", [Project, Task, "{gecikme_gün}"]),

        // --- Proje
        new(NotificationType.ProjectMemberAdded, Default,
            "Notification:ProjectMemberAdded:Title", [], "Notification:ProjectMemberAdded:Body", [Project]),
        new(NotificationType.ProjectMemberRemoved, Default,
            "Notification:ProjectMemberRemoved:Title", [], "Notification:ProjectMemberRemoved:Body", [Project]),
        new(NotificationType.ProjectMemberRoleChanged, Default,
            "Notification:ProjectMemberRoleChanged:Title", [], "Notification:ProjectMemberRoleChanged:Body", [Project, "{rol}"]),
        new(NotificationType.ProjectEndingSoon, Default,
            "Notification:ProjectEndingSoon:Title", ["{kalan_gün}"],
            "Notification:ProjectEndingSoon:Body", [Project, "{bitiş_tarihi}", "{açık_görev_sayısı}"]),
        new(NotificationType.ProjectEndingSoon, Today,
            "Notification:ProjectEndingSoon:TitleToday", [],
            "Notification:ProjectEndingSoon:Body", [Project, "{bitiş_tarihi}", "{açık_görev_sayısı}"]),
        new(NotificationType.ProjectEndingSoon, NoOpenTasks,
            "Notification:ProjectEndingSoon:Title", ["{kalan_gün}"],
            "Notification:ProjectEndingSoon:BodyNoOpenTasks", [Project, "{bitiş_tarihi}"]),
        new(NotificationType.ProjectEndingSoon, TodayNoOpenTasks,
            "Notification:ProjectEndingSoon:TitleToday", [],
            "Notification:ProjectEndingSoon:BodyNoOpenTasks", [Project, "{bitiş_tarihi}"]),
        new(NotificationType.ProjectIndicatorBehind, Default,
            "Notification:ProjectIndicatorBehind:Title", [],
            "Notification:ProjectIndicatorBehind:Body",
            [Project, "{gösterge}", "{hedef_tarih}", "{gerçekleşen}", "{hedef}", "{ilerleme}"]),

        // --- Finans (Faz 4b). Tutarlar üreticide para birimiyle biçimlenir ("12.500,00 TRY").
        new(NotificationType.BudgetRevisionApplied, Default,
            "Notification:BudgetRevision:Title", [],
            "Notification:BudgetRevision:Body", [Project, "{revizyon_no}", "{gerekçe}", "{onaylanan_toplam}"]),
        new(NotificationType.BudgetUsageThresholdReached, Default,
            "Notification:BudgetThreshold:Title", ["{eşik}"],
            "Notification:BudgetThreshold:Body", [Project, "{kalem}", "{onaylanan}", "{harcanan}", "{yüzde}", "{kalan}"]),
        new(NotificationType.BudgetOverrun, Default,
            "Notification:BudgetOverrun:Title", ["{kalem}"],
            "Notification:BudgetOverrun:Body", [Project, "{kalem}", "{onaylanan}", "{harcanan}", "{yüzde}", "{aşım}"]),
        new(NotificationType.FundingTrancheCollected, Default,
            "Notification:TrancheCollected:Title", [],
            "Notification:TrancheCollected:Body", [Project, "{dilim_no}", "{tahsil_edilen}", "{beklenen}"]),
        new(NotificationType.FundingTrancheOverdue, Default,
            "Notification:TrancheOverdue:Title", [],
            "Notification:TrancheOverdue:Body", [Project, "{dilim_no}", "{planlanan_tarih}", "{gecikme_gün}", "{beklenen}"]),
        new(NotificationType.TrancheDeductionAdded, Default,
            "Notification:TrancheDeduction:Title", [],
            "Notification:TrancheDeduction:Body", [Project, "{dilim_no}", "{tutar}", "{gerekçe}"]),
        new(NotificationType.TrancheDisputed, Default,
            "Notification:TrancheDisputed:Title", [],
            "Notification:TrancheDisputed:Body", [Project, "{dilim_no}", "{beklenen}"]),
        // Fatura yönü başlığı değiştirir (alış: ödeme gecikti, satış: tahsilat gecikti); gövde ortak.
        new(NotificationType.InvoiceOverdue, Purchase,
            "Notification:InvoiceOverdue:TitlePurchase", [],
            "Notification:InvoiceOverdue:Body", ["{fatura_no}", Project, "{gecikme_gün}"]),
        new(NotificationType.InvoiceOverdue, Sales,
            "Notification:InvoiceOverdue:TitleSales", [],
            "Notification:InvoiceOverdue:Body", ["{fatura_no}", Project, "{gecikme_gün}"])
    ];

    public static NotificationTemplateDefinition? Find(NotificationType type, string variant)
        => All.FirstOrDefault(d => d.Type == type && d.Variant == variant);

    /// <summary>
    /// Yerelleştirilmiş varsayılan metni (sıralı yerleriyle) adlandırılmış değişkenli şablona çevirir:
    /// <c>"\"{0}\" size atandı."</c> → <c>"\"{görev_adı}\" size atandı."</c>.
    /// </summary>
    public static string ToTemplate(string localized, string[] args)
    {
        var text = localized;
        for (var i = 0; i < args.Length; i++)
        {
            text = text.Replace("{" + i + "}", args[i]);
        }
        return text;
    }
}
