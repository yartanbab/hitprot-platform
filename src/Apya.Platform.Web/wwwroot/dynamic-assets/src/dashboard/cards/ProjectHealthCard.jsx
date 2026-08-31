import React from 'react';
import { CardShell } from './CardShell';
import { Bullet } from '../charts';
import { useProjectHealth } from '../hooks/useDashboard';
import { EmptyState } from '../../components/ui';
import { cn } from '../../lib/utils';
import { t } from '../../lib/i18n';

const VISIBLE_ROWS = 4;

const STATE_BADGE = {
    Healthy:   ['bg-positive-50 text-positive-700',  'Dashboard:Health:Healthy',   'Sağlıklı'],
    Attention: ['bg-warning-50 text-warning-700',    'Dashboard:Health:Attention', 'Dikkat'],
    Risky:     ['bg-negative-50 text-negative-700',  'Dashboard:Health:Risky',     'Riskli'],
};

const STATE_TONE = { Healthy: 'positive', Attention: 'warning', Risky: 'negative' };

/**
 * Proje sağlığı — zaman × bütçe × kapsam.
 *
 * Bütçe barı yalnız `budgetRatio` doluysa çizilir; Projects.ViewBudget yoksa
 * sunucu null döner ve satır zaman oranını gösterir. Sıfır YAZILMAZ.
 */
function ProjectHealthCard({ filter, editMode }) {
    const query = useProjectHealth(filter);
    const projects = query.data ?? [];
    const visible = projects.slice(0, VISIBLE_ROWS);
    const rest = projects.slice(VISIBLE_ROWS);

    return (
        <CardShell
            editMode={editMode}
            title={t('Dashboard:Health:Title', 'Proje sağlığı')}
            subtitle={t('Dashboard:Health:Subtitle', '{0} aktif proje', projects.length)}
            isLoading={query.isPending}
            isError={query.isError}
            onRetry={query.refetch}
            isEmpty={projects.length === 0}
            isFetching={query.isFetching}
            isStale={query.isStale}
            dataUpdatedAt={query.dataUpdatedAt}
            emptyState={
                <EmptyState
                    compact
                    title={t('Dashboard:Health:EmptyTitle', 'Henüz proje yok')}
                    description={t('Dashboard:Health:EmptyDescription', 'Proje oluşturunca sağlık göstergeleri burada belirir.')}
                    action={
                        <a href="/Projects" className="text-[12.5px] font-medium text-text-link hover:underline">
                            {t('Dashboard:Health:OpenProjects', 'Projeleri aç →')}
                        </a>
                    }
                />
            }
            footer={rest.length > 0 && (
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-text-tertiary truncate">
                        {rest.map((p) => p.name).join(' · ')}
                    </span>
                    <a href="/Projects" className="text-xs text-text-link hover:underline flex-none">
                        {t('Dashboard:Health:More', '+{0} proje →', rest.length)}
                    </a>
                </div>
            )}
        >
            <ul className="flex flex-col">
                {visible.map((project, index) => (
                    <li key={project.projectId} className="flex flex-col gap-[7px]">
                        {index > 0 && <span className="h-px bg-subtle my-2.5" />}
                        <div className="flex items-center justify-between gap-2">
                            <a
                                href={`/Projects/ProjectDetails/${project.projectId}`}
                                className="text-[13px] font-medium text-text-primary truncate hover:underline"
                            >
                                {project.name}
                            </a>
                            <HealthBadge state={project.state} />
                        </div>
                        <Bullet
                            ratio={project.budgetRatio ?? project.timeRatio ?? 0}
                            tone={STATE_TONE[project.state] ?? 'positive'}
                            ariaLabel={t('Dashboard:Health:BarLabel', '{0} ilerleme', project.name)}
                        />
                        <MetaRow project={project} />
                    </li>
                ))}
            </ul>
        </CardShell>
    );
}

function HealthBadge({ state }) {
    const [tone, key, fallback] = STATE_BADGE[state] ?? STATE_BADGE.Healthy;
    return (
        <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full flex-none', tone)}>
            {t(key, fallback)}
        </span>
    );
}

/** Mono meta satırı: "14 gün | %80 bütçe | 24/31 görev". Olmayan parça atlanır. */
function MetaRow({ project }) {
    const parts = [];
    if (project.daysRemaining != null) {
        parts.push(t('Dashboard:Health:DaysLeft', '{0} gün', project.daysRemaining));
    }
    if (project.budgetRatio != null) {
        parts.push(t('Dashboard:Health:BudgetPercent', '%{0} bütçe', Math.round(project.budgetRatio * 100)));
    }
    parts.push(t('Dashboard:Health:Tasks', '{0}/{1} görev', project.tasksDone, project.tasksTotal));

    return (
        <div className="flex items-center gap-2.5 font-mono text-[11px] text-text-secondary tabular-nums">
            {parts.map((part, i) => (
                <React.Fragment key={part}>
                    {i > 0 && <span className="text-border-default" aria-hidden="true">|</span>}
                    <span>{part}</span>
                </React.Fragment>
            ))}
        </div>
    );
}

export { ProjectHealthCard };
