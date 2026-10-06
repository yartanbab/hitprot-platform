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

/* Bağlantı '/Ai/Dashboard'a gidiyordu; öyle bir sayfa yok → 404. AI Merkezi buradadır. */
const AI_CENTER_URL = '/AiCenter/Dashboard';

/* Sayfanın kapısıyla aynı koşul (menü de buna bakar): AiAssist özelliği + Ai.Dashboard.View izni.
   Açamayacak kullanıcıya bağlantı çizilmez. */
function canOpenAiCenter() {
    const abp = window.abp;
    return abp?.features?.isEnabled?.('Platform.AiAssist') === true
        && abp?.auth?.isGranted?.('Ai.Dashboard.View') === true;
}

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
                    action={canOpenAiCenter() ? (
                        <a href={AI_CENTER_URL} className="text-[12.5px] font-medium text-text-link hover:underline">
                            {t('Dashboard:Ai:OpenCenter', 'AI Merkezi →')}
                        </a>
                    ) : undefined}
                />
            }
        />
    );
}

export { AiSuggestionsCard };
