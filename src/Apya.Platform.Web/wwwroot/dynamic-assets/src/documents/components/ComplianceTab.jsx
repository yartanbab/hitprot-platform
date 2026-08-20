import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, EmptyState, SkeletonList } from '../../components/ui';
import {
  abpAuth, abpNotify, applyCompliancePackage, getComplianceOverview,
  getCompliancePackages, removeComplianceAssignment, waiveComplianceItem,
} from '../api';
import { cn } from '../format';
import { PackageCatalog } from './PackageEditor';

/**
 * Uygunluk sekmesi — kurum kontrol listesi.
 *
 * Durumlar sunucuda HESAPLANIR (saklanmaz): belge yüklendiğinde liste
 * kendiliğinden doğrudur. İstemci yalnız çizer ve kullanıcı kararlarını
 * (feragat) geri gönderir.
 */

const STATUS_META = {
  1: { text: 'Karşılandı', chip: 'apya-chip-positive', icon: 'fa-check' },
  2: { text: 'Eksik', chip: 'apya-chip-warning', icon: 'fa-triangle-exclamation' },
  3: { text: 'Feragat', chip: 'apya-chip-neutral', icon: 'fa-ban' },
};

const SCOPE_LABEL = { 1: 'Proje', 2: 'İş adımı', 3: 'Dönem' };

/**
 * Kalemin kökeni. Enum sunucudan SAYI olarak gelir (ComplianceRequirementSource).
 * Kontrol listesi tek bir yerde toplanır ama satır nereden geldiğini söyler —
 * "bunu kurum mu istiyor, biz mi?" sorusunun cevabı teslim hazırlığında kritik.
 */
const SOURCE_LABEL = {
  1: 'kurum şablonu',
  2: 'klasör şeması',
  3: 'task eki',
};

function ProgressBar({ percent, blocking }) {
  const tone = blocking > 0
    ? 'var(--apya-negative-500)'
    : percent >= 90 ? 'var(--apya-positive-500)' : 'var(--apya-warning-500)';

  return (
    <div className="apya-doc-progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div style={{ width: `${percent}%`, background: tone }} />
    </div>
  );
}

function ChecklistRow({ item, canManage, onWaive, busy }) {
  const status = STATUS_META[item.status] || STATUS_META[2];

  const scopeLabel = item.workStepName
    ? `${item.workStepOrder} · ${item.workStepName}`
    : item.periodCode || SCOPE_LABEL[item.scope];

  return (
    <div className={cn('apya-doc-check-row', item.status === 2 && item.isBlocking && 'is-blocking')}>
      <span className={cn('apya-chip', status.chip)}>
        <i className={`fa ${status.icon}`} /> {status.text}
      </span>

      <span style={{ minWidth: 0 }}>
        <span className="d-block text-truncate" style={{ fontSize: 13, fontWeight: 500 }}>{item.title}</span>
        <span className="d-block" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
          {SOURCE_LABEL[item.source] || SOURCE_LABEL[1]}
          {item.sourceEntityName && ` · ${item.sourceEntityName}`}
          {' · '}{scopeLabel}
          {item.documentTypeName && ` · ${item.documentTypeName}`}
          {item.waiveReason && ` · ${item.waiveReason}`}
        </span>
        {/* Göreve bağlı kalem otomatik karşılanamaz — kullanıcı boşuna beklemesin. */}
        {item.requiresManualLink && item.status === 2 && (
          <span className="d-block" style={{ fontSize: 10.5, color: 'var(--apya-warning-700, #92400E)' }}>
            Otomatik eşleşmez — belgeyi elle bağlayın.
          </span>
        )}
      </span>

      <span className="text-truncate" style={{ fontSize: 11.5, color: 'var(--apya-text-secondary)' }}>
        {item.documentFileName || '—'}
      </span>

      <span className="d-flex align-items-center gap-2 justify-content-end">
        {item.isBlocking && item.status === 2 && (
          <Badge variant="negative" size="sm">Teslimi bloke ediyor</Badge>
        )}
        {canManage && item.status !== 1 && (
          <button
            type="button"
            className="apya-doc-linkbtn"
            disabled={busy}
            onClick={() => onWaive(item, item.status !== 3)}
          >
            {item.status === 3 ? 'Feragati kaldır' : 'Feragat et'}
          </button>
        )}
      </span>
    </div>
  );
}

export function ComplianceTab({ projectId, periodCode, onSummaryChange, documentTypes = [] }) {
  const [overview, setOverview] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const canManage = abpAuth('Platform.Documents.ManageCompliance');

  const load = useCallback(async () => {
    if (!projectId) { setOverview(null); setLoading(false); return; }

    setLoading(true);
    try {
      const [data, catalog] = await Promise.all([
        getComplianceOverview(projectId, periodCode),
        getCompliancePackages(projectId),
      ]);
      setOverview(data);
      setPackages(catalog ?? []);
      onSummaryChange?.(data?.summary ?? null);
    } catch (e) {
      abpNotify('error', 'Uygunluk verisi yüklenemedi.');
      console.error('[Documents] compliance load', e);
    } finally {
      setLoading(false);
    }
  }, [projectId, periodCode, onSummaryChange]);

  useEffect(() => { load(); }, [load]);

  const handleApply = async (packageId) => {
    setBusy(true);
    try {
      await applyCompliancePackage(projectId, packageId, periodCode || null);
      await load();
    } catch (e) {
      abpNotify('error', 'Paket uygulanamadı.');
      console.error('[Documents] applyPackage', e);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (assignmentId) => {
    setBusy(true);
    try {
      await removeComplianceAssignment(assignmentId);
      await load();
    } catch (e) {
      abpNotify('error', 'Paket kaldırılamadı.');
      console.error('[Documents] removeAssignment', e);
    } finally {
      setBusy(false);
    }
  };

  const handleWaive = async (checklist, item, waive) => {
    const reason = waive ? window.prompt('Feragat gerekçesi:') : null;
    if (waive && !reason) return;

    setBusy(true);
    try {
      await waiveComplianceItem({
        assignmentId: checklist.assignmentId,
        requirementId: item.requirementId,
        workStepId: item.workStepId,
        periodCode: item.periodCode,
        waive,
        reason,
      });
      await load();
    } catch (e) {
      abpNotify('error', 'İşlem başarısız oldu.');
      console.error('[Documents] waive', e);
    } finally {
      setBusy(false);
    }
  };

  if (!projectId) {
    return (
      <EmptyState
        icon={<i className="fa fa-clipboard-check" />}
        title="Önce bir proje bağlamı seçin"
        description="Uygunluk, projeye uygulanan kurum paketleri üzerinden hesaplanır."
      />
    );
  }

  if (loading) {
    return <div className="p-4"><SkeletonList rows={6} /></div>;
  }

  const applied = overview?.checklists ?? [];
  const available = packages.filter((p) => !p.isApplied);

  return (
    <div className="p-3 d-flex flex-column gap-3">
      {applied.length === 0 ? (
        <EmptyState
          icon={<i className="fa fa-clipboard-list" />}
          title="Bu projeye henüz kurum paketi uygulanmadı"
          description="Aşağıdan bir paket seçerek kontrol listesini başlatın."
        />
      ) : applied.map((checklist) => (
        <div key={checklist.assignmentId} className="apya-doc-check-card">
          <div className="apya-doc-check-head">
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{checklist.packageName}</div>
              <div style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
                {checklist.issuer}
                {checklist.periodCode && ` · ${checklist.periodCode}`}
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="apya-numeric" style={{ fontSize: 15, fontWeight: 500 }}>
                %{checklist.summary.percent}
              </span>
              {checklist.summary.blockingMissingCount > 0 && (
                <Badge variant="negative" size="sm">
                  {checklist.summary.blockingMissingCount} bloke
                </Badge>
              )}
              {canManage && (
                <button
                  type="button"
                  className="apya-doc-linkbtn"
                  disabled={busy}
                  onClick={() => handleRemove(checklist.assignmentId)}
                >
                  Kaldır
                </button>
              )}
            </div>
          </div>

          <ProgressBar percent={checklist.summary.percent} blocking={checklist.summary.blockingMissingCount} />

          <div style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
            {checklist.summary.satisfiedCount} / {checklist.summary.totalCount - checklist.summary.waivedCount} kalem tamam
            {checklist.summary.waivedCount > 0 && ` · ${checklist.summary.waivedCount} feragat`}
          </div>

          <div className="apya-doc-check-list">
            {checklist.items.map((item, index) => (
              <ChecklistRow
                key={`${item.requirementId}-${item.workStepId || item.periodCode || index}`}
                item={item}
                canManage={canManage}
                busy={busy}
                onWaive={(target, waive) => handleWaive(checklist, target, waive)}
              />
            ))}
          </div>
        </div>
      ))}

      {canManage && (
        <PackageCatalog
          packages={packages}
          projectId={projectId}
          documentTypes={documentTypes}
          onChanged={load}
        />
      )}

      {canManage && available.length > 0 && (
        <div className="apya-doc-check-card">
          <div className="apya-md-overline">Uygulanabilir paketler</div>
          <div className="d-flex flex-wrap gap-2">
            {available.map((pkg) => (
              <Button
                key={pkg.id}
                variant="outline"
                size="sm"
                disabled={busy}
                leadingIcon={<i className="fa fa-plus" />}
                onClick={() => handleApply(pkg.id)}
              >
                {pkg.name} ({pkg.requirementCount})
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
