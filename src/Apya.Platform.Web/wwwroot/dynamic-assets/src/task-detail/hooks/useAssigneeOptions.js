import { useQuery } from '@tanstack/react-query';

function displayName(u) {
    const full = [u.name, u.surname].filter(Boolean).join(' ');
    return full || u.userName;
}

function fetchUsers() {
    const svc = window?.apya?.platform?.tasks?.task;
    if (!svc) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(svc.getUsersLookup());
}

/** Atanan seçici + oluşturan/güncelleyen isim çözümü için tenant kullanıcı listesi. */
export function useAssigneeOptions() {
    const query = useQuery({
        queryKey: ['task-detail', 'users-lookup'],
        queryFn: fetchUsers,
        staleTime: 5 * 60_000,
        retry: false,
    });

    const users = query.data?.items ?? [];
    const options = users.map((u) => ({ value: u.id, label: displayName(u) }));
    const nameById = new Map(users.map((u) => [u.id, displayName(u)]));

    return { options, nameById, isLoading: query.isLoading };
}
