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
    const options = projects.map((p) => ({ value: p.id, label: p.name }));
    const nameById = new Map(projects.map((p) => [p.id, p.name]));

    return { options, nameById, isLoading: query.isLoading };
}
