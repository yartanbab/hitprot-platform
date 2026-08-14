import React from 'react';
import { CardShell } from './CardShell';
import { EmptyState } from '../../components/ui';
import { t } from '../../lib/i18n';

/**
 * Proje fazları (mini gantt) — BOŞ DURUM.
 *
 * Platformda faz entity'si YOK: Domain'de proje fazı diye bir kayıt tutulmuyor,
 * dolayısıyla `/api/dashboard/project-phases` ucu da yazılmadı. Uydurulmuş bir
 * zaman çizelgesi çizmek yerine kart ne eksik olduğunu söyler.
 *
 * Faz entity'si eklendiğinde: uç açılır, `useProjectPhases` hook'u eklenir ve
 * buraya `MiniGantt` (charts/) bağlanır — bileşen zaten hazır.
 */
function ProjectPhasesCard({ editMode }) {
    return (
        <CardShell
            editMode={editMode}
            title={t('Dashboard:Phases:Title', 'Proje fazları')}
            subtitle={t('Dashboard:Phases:Subtitle', 'mini gantt')}
            isEmpty
            emptyState={
                <EmptyState
                    compact
                    title={t('Dashboard:Phases:EmptyTitle', 'Faz tanımlı değil')}
                    description={t('Dashboard:Phases:EmptyDescription', 'Projelere faz tanımlandığında zaman çizelgesi burada görünecek.')}
                    action={
                        <a href="/Projects" className="text-[12.5px] font-medium text-text-link hover:underline">
                            {t('Dashboard:Phases:OpenProjects', 'Projeleri aç →')}
                        </a>
                    }
                />
            }
        />
    );
}

export { ProjectPhasesCard };
