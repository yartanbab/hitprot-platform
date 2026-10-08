using System;
using System.Linq;

namespace Apya.Platform.Tasks;

/// <summary>
/// Görev GİZLİLİK süzgecinin tek kaynağı (PR-3b'de statiğe çıkarıldı — kural
/// üç serviste kopyalanmaya başlamıştı: TaskAppService, ProjectBudgetAppService,
/// ExpenseAppService).
///
/// Kural:
/// 1. Impersonated kullanıcı (örn. host admin) kiracının "gizli" görevlerini
///    ASLA göremez.
/// 2. Normal kullanıcı gizli görevi yalnız kendisi açtıysa, kendisine
///    atandıysa VEYA ekip yöneticisiyse (Projects.ManageTeam) görür.
///
/// Bayraklar çağıranda hesaplanır (CurrentUser/AuthorizationService app-service
/// bağımlılıkları buraya taşınmasın diye) — süzgecin kendisi saf sorgudur.
/// </summary>
public static class TaskPrivacyQueryFilter
{
    public static IQueryable<TaskItem> Apply(
        IQueryable<TaskItem> query,
        bool isImpersonated,
        bool canManageTeam,
        Guid? currentUserId)
    {
        // Kimliksiz çağrıda (currentUserId == null) sahiplik HİÇ eşleşmemeli: "null == null"
        // oluşturanı ve atananı olmayan gizli görevi kimliksiz çağırana açardı
        // (TaskItem.IsOwnedBy'daki aynı koruma).
        bool hasUser = currentUserId.HasValue;

        return query.Where(t =>
            !t.IsPrivate ||
            (!isImpersonated && (canManageTeam
                || (hasUser && (t.CreatorId == currentUserId || t.AssigneeId == currentUserId))))
        );
    }
}
