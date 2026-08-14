import React from 'react';
import { CardShell } from './CardShell';
import { EmptyState } from '../../components/ui';
import { t } from '../../lib/i18n';

/**
 * AI önerileri — BOŞ DURUM.
 *
 * Tasarımdaki koyu öneri kartının arkasında bir veri kaynağı YOK:
 * `AiDashboardAppService.GetAsync()` öneri değil AI KULLANIM METRİĞİ döndürüyor
 * (değerlendirme sayıları, ortalama skor, prompt/workflow adetleri). Sahte öneri
 * üretmek yerine kart AI Merkezi'ne yönlendirir.
 *
 * Öneri üreten bir uç eklendiğinde: çekirdek modül AI modülüne referans VEREMEZ,
 * bu yüzden UI ayrı bir uçtan okumalı (bkz IDashboardAppService notu).
 */
function AiSuggestionsCard({ editMode }) {
    return (
        <CardShell
            editMode={editMode}
            title={t('Dashboard:Ai:Title', 'AI önerileri')}
            subtitle={t('Dashboard:Ai:Subtitle', 'sessiz inbox')}
            isEmpty
            emptyState={
                <EmptyState
                    compact
                    title={t('Dashboard:Ai:EmptyTitle', 'AI şu an sessiz')}
                    description={t('Dashboard:Ai:EmptyDescription', 'Anlamlı bir öneri çıktığında burada görünecek.')}
                    action={
                        <a href="/Ai/Dashboard" className="text-[12.5px] font-medium text-text-link hover:underline">
                            {t('Dashboard:Ai:OpenCenter', 'AI Merkezi →')}
                        </a>
                    }
                />
            }
        />
    );
}

export { AiSuggestionsCard };
