import React from 'react';
import { abpAppPath } from '../../documents/api';
import { FLOW_STEPS, complianceSub, nextHint, stepHref } from './flow';
import { useComplianceOverview } from './useComplianceOverview';

const cx = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Süreç şeridi — 1 Belgeler → 2 Uygunluk → 3 Derle → 4 Teslim.
 *
 * Her süreç ekranında başlığın hemen altında durur. Etkin adım vurgulanır,
 * adımlar gerçek bağlantıdır (yeni sekmede de açılır) ve proje bağlamını
 * taşır. Sağdaki "Sırada" ipucu projenin uygunluk özetinden türetilir.
 *
 * @param {object} props
 * @param {'docs'|'compliance'|'report'|'deliver'|null} props.active
 *   Etkin adım. Sürecin adımı olmayan ekranlar (zaman çizelgesi) null verir.
 * @param {string|null} props.projectId
 * @param {{ overview: object|null, loading: boolean, failed: boolean }} [props.compliance]
 *   Ekran uygunluk verisini zaten yüklüyorsa verir; verilmezse şerit kendisi çeker.
 * @param {(stepKey: string, event: MouseEvent) => void} [props.onSelect]
 *   Aynı ekrandaki adıma (ör. Dokümanlar'da Uygunluk sekmesi) sayfa yenilemeden
 *   geçmek için: çağıran `event.preventDefault()` derse gezinme olmaz.
 */
export function ProcessRibbon({ active = null, projectId = null, compliance, onSelect }) {
  // Kanca koşulsuz çağrılmalı; veri dışarıdan geliyorsa boş kimlikle çağrılır
  // ve ağa gitmez.
  const own = useComplianceOverview(compliance ? null : projectId);
  const data = compliance ?? own;

  const state = { hasProject: Boolean(projectId), loading: data.loading, overview: data.overview };
  const hint = nextHint(active, state);
  const appPath = abpAppPath();

  const handleClick = (stepKey, event) => {
    // Ctrl/⌘/orta tık yeni sekme ister — onu bozmuyoruz.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    onSelect?.(stepKey, event);
  };

  return (
    <nav className="apya-flow" aria-label="Doküman süreci">
      <ol className="apya-flow-steps">
        {FLOW_STEPS.map((step, index) => {
          const isActive = step.key === active;
          const sub = step.key === 'compliance' ? complianceSub(state) : step.sub;

          return (
            <li key={step.key} className={cx('apya-flow-step', isActive && 'is-active')}>
              <a
                className="apya-flow-link"
                href={stepHref(step.key, projectId, appPath)}
                aria-current={isActive ? 'step' : undefined}
                // Dar ekranda etkin olmayan adımın metni gizlenir; ad kaybolmasın.
                aria-label={`${step.no}. ${step.label} · ${sub}`}
                onClick={(event) => handleClick(step.key, event)}
              >
                <span className="apya-flow-no" aria-hidden="true">{step.no}</span>
                <span className="apya-flow-text" aria-hidden="true">
                  <span className="apya-flow-label">{step.label}</span>
                  <span className="apya-flow-sub">{sub}</span>
                </span>
              </a>
              {index < FLOW_STEPS.length - 1 && <span className="apya-flow-arrow" aria-hidden="true">→</span>}
            </li>
          );
        })}
      </ol>

      {hint && (
        <p className={cx('apya-flow-next', `is-${hint.tone}`)}>
          <span className="apya-flow-next-label">Sırada:</span>
          <span className="apya-flow-next-text" title={hint.pending ? undefined : hint.text}>
            {hint.text}
          </span>
        </p>
      )}
    </nav>
  );
}
