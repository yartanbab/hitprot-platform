import { isGranted } from './hooks/useTaskDetail';

/**
 * Görev yetkisi — sunucudaki TaskAppService.EnsureCanMutateTaskAsync ile AYNI kural:
 * uç izni (Edit / ChangeStatus / Delete) + görevin sahibi (oluşturan ya da atanan)
 * veya Projects.ManageTeam.
 *
 * Alt görev KENDİ kaydına göre değerlendirilir: sunucu alt görevin uçlarında alt
 * görevin sahibine bakar, üst görevin yetkisi alt göreve geçmez. Bu yüzden hem
 * detay kökü hem alt görev paneli ve alt görev satırları bu yardımcıyı çağırır.
 *
 * Yorum bu kurala girmez (ürün kararı: görevi görebilen yorum yazar).
 * Frontend gizlemesi sunucu kontrolünün YERİNE GEÇMEZ.
 */
export function getTaskPermissions(task) {
    const me = window?.abp?.currentUser?.id;
    const canManage = Boolean(me && (task?.creatorId === me || task?.assigneeId === me))
        || isGranted('Platform.Projects.ManageTeam');
    return {
        canManage,
        canEdit: canManage && isGranted('Platform.Tasks.Edit'),
        canChangeStatus: canManage && isGranted('Platform.Tasks.ChangeStatus'),
        canDelete: canManage && isGranted('Platform.Tasks.Delete'),
    };
}
