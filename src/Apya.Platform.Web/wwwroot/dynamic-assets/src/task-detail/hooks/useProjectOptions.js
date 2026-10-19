import { useQuery } from '@tanstack/react-query';

function fetchProjects() {
    const svc = window?.apya?.platform?.tasks?.task;
    if (!svc) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(svc.getProjectsLookup());
}

/** Görev "Proje" seçici için tenant'ın projeleri. Backend: GetProjectsLookupAsync → List<ProjectLookupDto>. */
export function useProjectOptions() {
    const query = useQuery({
        queryKey: ['task-detail', 'projects-lookup'],
        queryFn: fetchProjects,
        staleTime: 5 * 60_000,
        retry: false,
    });

    const projects = query.data ?? [];
    const options = projectOptionsOf(projects);
    const nameById = new Map(projects.map((p) => [p.id, p.name]));

    return { options, nameById, isLoading: query.isLoading };
}

/**
 * QA-37 · Adı çakışan projelerde etikete kod eklenir ("Yeşil Enerji Dönüşümü · PRJ-2026-010");
 * tekil adlar olduğu gibi kalır. Taşı/Kopyala penceresi ve proje seçicisi bu etiketi gösterir.
 */
export function projectOptionsOf(projects) {
    const counts = new Map();
    projects.forEach((p) => counts.set(p.name, (counts.get(p.name) ?? 0) + 1));
    return projects.map((p) => ({
        value: p.id,
        label: counts.get(p.name) > 1 && p.code ? `${p.name} · ${p.code}` : p.name,
    }));
}
