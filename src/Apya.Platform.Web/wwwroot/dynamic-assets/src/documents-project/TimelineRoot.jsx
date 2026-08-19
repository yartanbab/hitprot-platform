import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, EmptyState, SkeletonList } from '../components/ui';
import { abpNotify, createRisk, deleteRisk, fmtDate, fmtMoney, fmtNum, getTimeline, setRiskClosed } from './api';

/**
 * Zaman çizelgesi & bütçe.
 *
 * Gantt çubukları projenin kendi başlangıç/bitişine göre ORANTILANIR; sabit bir
 * takvim ızgarası çizmiyoruz — proje süreleri çok değişken ve sabit ızgara
 * kısa projelerde okunamaz hale geliyor.
 */

const cn = (...c) => c.filter(Boolean).join(' ');

function riskTone(score) {
  if (score >= 15) return 'negative';
  if (score >= 8) return 'warning';
  return 'neutral';
}

function GanttBar({ step, projectStart, projectEnd }) {
  const start = step.startDate ? new Date(step.startDate) : null;
  const end = step.endDate ? new Date(step.endDate) : null;

  // Tarihi olmayan adım için çubuk çizmiyoruz — 0'dan başlayan sahte bir
  // çubuk, planlanmamış adımı planlanmış gibi gösterirdi.
  if (!start || !end || !projectStart || !projectEnd) {
    return (
      <div className="apya-doc-gantt-track">
        <span style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)', paddingLeft: 6 }}>
          tarih girilmemiş
        </span>
      </div>
    );
  }

  const total = projectEnd - projectStart;
  const left = total > 0 ? ((start - projectStart) / total) * 100 : 0;
  const width = total > 0 ? Math.max(((end - start) / total) * 100, 2) : 100;

  return (
    <div className="apya-doc-gantt-track">
      <div
        className="apya-doc-gantt-bar"
        style={{
          left: `${Math.max(0, Math.min(left, 100))}%`,
          width: `${Math.min(width, 100)}%`,
          background: step.progressPercent >= 100 ? 'var(--apya-positive-500)' : 'var(--apya-accent-500)',
        }}
        title={`${fmtDate(step.startDate)} – ${fmtDate(step.endDate)} · %${step.progressPercent}`}
      />
    </div>
  );
}

export function TimelineRoot() {
  const projectId = new URLSearchParams(window.location.search).get('projectId');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!projectId) { setLoading(false); return; }
    setLoading(true);
    try {
      setData(await getTimeline(projectId));
    } catch (e) {
      abpNotify('error', 'Zaman çizelgesi yüklenemedi.');
      console.error('[Timeline] load', e);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const handleAddRisk = async () => {
    const title = window.prompt('Risk başlığı:');
    if (!title) return;
    const likelihood = Number(window.prompt('Olasılık (1-5):', '3')) || 3;
    const impact = Number(window.prompt('Etki (1-5):', '3')) || 3;
    const mitigation = window.prompt('Önlem (boş bırakılabilir):') || null;

    setBusy(true);
    try {
      await createRisk({ projectId, title, likelihood, impact, mitigation });
      await load();
    } catch (e) {
      abpNotify('error', 'Risk eklenemedi.');
    } finally {
      setBusy(false);
    }
  };

  if (!projectId) {
    return (
      <div className="apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto" style={{ maxWidth: 1560 }}>
        <EmptyState icon={<i className="fa fa-diagram-project" />} title="Proje bağlamı gerekiyor"
          description="Bu sayfa bir proje bağlamından açılır (?projectId=...)." />
      </div>
    );
  }

  if (loading) return <div className="p-4"><SkeletonList rows={8} /></div>;
  if (!data) return null;

  const projectStart = data.startDate ? new Date(data.startDate) : null;
  const projectEnd = data.endDate ? new Date(data.endDate) : null;
  const budget = data.budget;

  return (
    <div className="apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto" style={{ maxWidth: 1560 }}>
      <div className="mb-4">
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{data.projectName}</h1>
        <p style={{ fontSize: 12, color: 'var(--apya-text-tertiary)', margin: '4px 0 0' }}>
          {fmtDate(data.startDate)} – {fmtDate(data.endDate)} · {data.steps.length} iş adımı
        </p>
      </div>

      {/* Bütçe kapsaması — asıl soru: harcadığımın ne kadarı belgeli? */}
      <div className="apya-doc-kpis">
        <div className="apya-doc-kpi">
          <span className="apya-md-overline">Bütçe kullanımı</span>
          <div className="apya-numeric apya-doc-kpi-value">%{budget.budgetUsedPercent}</div>
          <div style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
            {fmtMoney(budget.totalExpense, data.currency)} / {fmtMoney(budget.totalBudget, data.currency)}
          </div>
        </div>
        <div className="apya-doc-kpi">
          <span className="apya-md-overline">Belgelenen harcama</span>
          <div className="apya-numeric apya-doc-kpi-value">%{budget.documentedPercent}</div>
          <div style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
            {fmtMoney(budget.documentedExpense, data.currency)}
          </div>
        </div>
        <div className="apya-doc-kpi">
          <span className="apya-md-overline">Belgesiz harcama</span>
          <div className="apya-numeric apya-doc-kpi-value"
            style={{ color: budget.undocumentedExpense > 0 ? 'var(--apya-negative-500)' : undefined }}>
            {fmtMoney(budget.undocumentedExpense, data.currency)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
            {budget.undocumentedCount} kalem
            {budget.undocumentedCount > 0 && (
              <> · <a href={`${window.abp.appPath}Documents/Matching?projectId=${projectId}`}>eşleştir</a></>
            )}
          </div>
        </div>
        <div className="apya-doc-kpi">
          <span className="apya-md-overline">Adam-gün</span>
          <div className="apya-numeric apya-doc-kpi-value">{fmtNum(data.capacity.loggedPersonDays)}</div>
          <div style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
            tahmin {fmtNum(data.capacity.estimatedPersonDays)} gün
          </div>
        </div>
      </div>

      {/* İş planı */}
      <div className="apya-doc-check-card mb-3">
        <div className="apya-doc-check-head">
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>İş planı</span>
          <span className="apya-numeric" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
            {fmtDate(data.startDate)} — {fmtDate(data.endDate)}
          </span>
        </div>

        {data.steps.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
            Tanımlı iş adımı yok.
          </div>
        ) : data.steps.map((step) => (
          <div key={step.id} className="apya-doc-gantt-row">
            <span className="text-truncate" style={{ fontSize: 12.5 }}>
              {step.order} · {step.name}
            </span>
            <GanttBar step={step} projectStart={projectStart} projectEnd={projectEnd} />
            <span className="apya-numeric" style={{ fontSize: 11.5, textAlign: 'right' }}>%{step.progressPercent}</span>
            <span className="apya-numeric" style={{ fontSize: 11.5, textAlign: 'right' }}>
              {step.documentCount} belge
            </span>
          </div>
        ))}
      </div>

      {/* Risk kütüğü */}
      <div className="apya-doc-check-card">
        <div className="apya-doc-check-head">
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>Risk kütüğü</span>
          <Button variant="outline" size="sm" disabled={busy} onClick={handleAddRisk}>
            <i className="fa fa-plus" /> Risk ekle
          </Button>
        </div>

        {data.risks.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>Kayıtlı risk yok.</div>
        ) : data.risks.map((risk) => (
          <div key={risk.id} className="apya-doc-check-row"
            style={{ gridTemplateColumns: '70px minmax(0,1fr) 120px 110px', opacity: risk.isClosed ? 0.55 : 1 }}>
            <Badge variant={riskTone(risk.score)} size="sm">{risk.score}</Badge>
            <span style={{ minWidth: 0 }}>
              <span className="d-block text-truncate" style={{ fontSize: 12.5 }}>{risk.title}</span>
              {risk.mitigation && (
                <span className="d-block text-truncate" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
                  {risk.mitigation}
                </span>
              )}
            </span>
            <span style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
              olasılık {risk.likelihood} · etki {risk.impact}
            </span>
            <span className="text-end">
              <button type="button" className="apya-doc-linkbtn" disabled={busy}
                onClick={async () => { setBusy(true); await setRiskClosed(risk.id, !risk.isClosed); await load(); setBusy(false); }}>
                {risk.isClosed ? 'Aç' : 'Kapat'}
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
