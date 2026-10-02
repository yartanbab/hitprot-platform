import { useQuery } from '@tanstack/react-query';

function fetchColumns(projectId) {
    const svc = window?.apya?.platform?.projects?.boardColumn;
    if (!svc) return Promise.resolve([]);
    return Promise.resolve(svc.getListByProject(projectId, { abpHandleError: false }));
}

/** Projenin kanban kolonları (sistem + özel, pano sırası) — görev detayının "Durum"
 *  menüsü bunları seçenek olarak gösterir. Backend: BoardColumnAppService.GetListByProjectAsync. */
export function useBoardColumns(projectId) {
    const query = useQuery({
        queryKey: ['task-detail', 'board-columns', projectId],
        queryFn: () => fetchColumns(projectId),
        enabled: Boolean(projectId),
        staleTime: 60_000,
        retry: false,
        /* Kolonlar panoda her an yeniden adlandırılıp eklenebilir — kalıcı önbellekten
           bayat seçenek gelmesin. */
        meta: { persist: false },
    });
    return projectId ? (query.data ?? []) : [];
}
