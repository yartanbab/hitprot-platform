import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, EmptyState, SkeletonList } from '../components/ui';
import { abpAppPath, abpNotify, fmtDate, fmtMoney, getScopeBranch, getScopeOverview } from './api';

/**
 * Proje kapsami agaci.
 *
 * Agac IKI ekseni yan yana tasir, cunku sema onlari birbirine baglamiyor:
 * belgeler is adimindan (DocumentFile.WorkStepId), gorevler projeden
 * (TaskItem.ParentTaskId) sarkar. Gorevleri is adiminin altina koymak icin
 * uydurma bir eslestirme yapmiyoruz — kardes dalda duruyorlar.
 *
 * Proje dallari TEMBEL yuklenir ve bir kez yuklendikten sonra bellekte kalir;
 * "hepsini ac" yuklenmemis her projeyi tek turda getirir.
 */

const cn = (...c) => c.filter(Boolean).join(' ');

/* Satir turu → ikon + etiket. Tur sutunu belgede belge TIPINI gosterir
   (Fatura, Bordro…), digerlerinde bu etiketi. */
const KIND = {
  Project: { icon: 'fa-diagram-project', label: 'Proje' },
  WorkStep: { icon: 'fa-list-check', label: 'İş adımı' },
  UnassignedGroup: { icon: 'fa-folder-open', label: '—' },
  Document: { icon: 'fa-file-lines', label: 'Belge' },
  MissingItem: { icon: 'fa-triangle-exclamation', label: 'Eksik' },
  TaskGroup: { icon: 'fa-layer-group', label: '—' },
  Task: { icon: 'fa-square-check', label: 'Görev' },
  SubTask: { icon: 'fa-turn-up', label: 'Alt görev' },
};

const STATUS = {
  None: null,
  Planned: { label: 'Planlı', variant: 'neutral' },
  InProgress: { label: 'Devam', variant: 'brand' },
  Done: { label: 'Tamam', variant: 'positive' },
  Late: { label: 'Gecikti', variant: 'negative' },
  Cancelled: { label: 'İptal', variant: 'neutral' },
  Draft: { label: 'Taslak', variant: 'neutral' },
  Final: { label: 'Kesin', variant: 'positive' },
  Matched: { label: 'Eşleşti', variant: 'positive' },
  Expired: { label: 'Süre dolan', variant: 'negative' },
  Missing: { label: 'Eksik', variant: 'negative' },
};

/* Sunucu enum'lari JSON'a sayi olarak dusuyor; sirayla esliyoruz. */
const KIND_BY_VALUE = ['', 'Project', 'WorkStep', 'UnassignedGroup', 'Document', 'MissingItem', 'TaskGroup', 'Task', 'SubTask'];
const STATUS_BY_VALUE = ['None', 'Planned', 'InProgress', 'Done', 'Late', 'Cancelled', 'Draft', 'Final', 'Matched', 'Expired', 'Missing'];

const kindOf = (row) => (typeof row.kind === 'number' ? KIND_BY_VALUE[row.kind] : row.kind);
const statusOf = (row) => (typeof row.status === 'number' ? STATUS_BY_VALUE[row.status] : row.status);

function complianceTone(percent) {
  if (percent >= 85) return 'var(--apya-positive-500)';
  if (percent >= 60) return 'var(--apya-warning-500)';
  return 'var(--apya-negative-500)';
}

/** Tarih hucresi: iki tarih varsa aralik, biri varsa tek gun. */
function dateText(row) {
  if (row.startDate && row.endDate) return `${fmtDate(row.startDate)} — ${fmtDate(row.endDate)}`;
  if (row.startDate) return fmtDate(row.startDate);
  if (row.endDate) return fmtDate(row.endDate);
  return '—';
}

function ScopeRow({ row, isOpen, onToggle, currency }) {
  // Tanimsiz enum degeri gelirse satiri patlatmak yerine belge gibi cizeriz.
  const kind = kindOf(row) || 'Document';
  const status = STATUS[statusOf(row)];
  const meta = KIND[kind] ?? KIND.Document;
  const isGroup = kind === 'Project' || kind === 'WorkStep' || kind === 'TaskGroup' || kind === 'UnassignedGroup';

  return (
    <div
      className={cn('apya-doc-row apya-doc-scope-row', isGroup && 'is-group', kind === 'MissingItem' && 'is-missing')}
      style={{ gridTemplateColumns: 'minmax(0,1fr) 96px 104px 132px 156px 64px 128px 120px' }}
      onClick={row.hasChildren ? onToggle : undefined}
      role={row.hasChildren ? 'button' : undefined}
      tabIndex={row.hasChildren ? 0 : undefined}
      onKeyDown={row.hasChildren ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); }
      } : undefined}
    >
      <div className="d-flex align-items-center gap-2 text-truncate" style={{ paddingLeft: row.depth * 20 }}>
        <span className="apya-doc-scope-caret">
          {row.hasChildren ? <i className={cn('fa', isOpen ? 'fa-chevron-down' : 'fa-chevron-right')} /> : null}
        </span>
        <span className={cn('apya-doc-scope-icon', `is-${kind.toLowerCase()}`)}>
          <i className={`fa ${meta.icon}`} />
        </span>
        <span
          className="text-truncate"
          style={{ fontSize: 12.5, fontWeight: row.depth === 0 ? 600 : row.depth === 1 ? 500 : 400 }}
          title={row.name}
        >
          {row.name}
        </span>
      </div>

      <span style={{ fontSize: 11.5, color: 'var(--apya-text-secondary)' }} className="text-truncate">
        {row.typeName ?? meta.label}
      </span>

      <span>{status ? <Badge variant={status.variant} size="sm">{status.label}</Badge> : null}</span>

      <span className="text-truncate" style={{ fontSize: 11.5, color: 'var(--apya-text-secondary)' }}>
        {row.ownerName ?? '—'}
      </span>

      <span className="apya-numeric" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
        {dateText(row)}
      </span>

      <span className="apya-numeric" style={{ fontSize: 11.5, textAlign: 'center', color: 'var(--apya-text-secondary)' }}>
        {row.documentCount > 0 ? row.documentCount : '—'}
      </span>

      <span
        className="apya-numeric"
        style={{ fontSize: 11.5, textAlign: 'right', color: row.amount ? 'var(--apya-text-primary)' : 'var(--apya-text-tertiary)' }}
      >
        {row.amount ? fmtMoney(row.amount, currency) : '—'}
      </span>

      {row.compliancePercent === null || row.compliancePercent === undefined ? (
        <span style={{ fontSize: 11, color: 'var(--apya-text-tertiary)', textAlign: 'right' }}>—</span>
      ) : (
        <div className="d-flex align-items-center gap-2">
          <div className="apya-doc-progress" style={{ flex: 1 }}>
            <div style={{ width: `${row.compliancePercent}%`, background: complianceTone(row.compliancePercent) }} />
          </div>
          <span className="apya-numeric" style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)' }}>
            %{row.compliancePercent}
          </span>
        </div>
      )}
    </div>
  );
}

export function ScopeRoot() {
  const focusProjectId = new URLSearchParams(window.location.search).get('projectId');

  const [overview, setOverview] = useState(null);
  const [branches, setBranches] = useState({});     // projectId -> rows
  const [open, setOpen] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(focusProjectId ?? null);
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [kindFilter, setKindFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');

  // Yuklenen dallarin guncel hali: setState kapanislari bayat kaliyor,
  // "zaten yuklu mu" sorusunu ref uzerinden soruyoruz.
  const branchesRef = React.useRef(branches);
  useEffect(() => { branchesRef.current = branches; }, [branches]);

  /** Bir projenin dalini getirir; zaten yuklendiyse aga tekrar gitmez. */
  const loadBranch = useCallback(async (projectId) => {
    if (!projectId || branchesRef.current[projectId]) return;

    try {
      const branch = await getScopeBranch(projectId);
      branchesRef.current = { ...branchesRef.current, [projectId]: branch.rows };
      setBranches(branchesRef.current);
    } catch (e) {
      abpNotify('error', 'Proje dalı yüklenemedi.');
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getScopeOverview();
        setOverview(data);

        // Bir proje baglamindan gelindiyse (?projectId=) o proje acik baslar.
        // Guid'ler farkli kasada gelebilir; kiyas kucuk harf uzerinden.
        const focus = focusProjectId
          ? data.rows.find((r) => String(r.entityId).toLowerCase() === focusProjectId.toLowerCase())
          : null;

        if (focus) {
          setOpen(new Set([focus.id]));
          await loadBranch(focus.entityId);
        }
      } catch (e) {
        abpNotify('error', 'Kapsam yüklenemedi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [focusProjectId, loadBranch]);

  const toggle = useCallback(async (row) => {
    const key = row.id;
    const isOpening = !open.has(key);

    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });

    // "Kapsamı raporla" tek bir projeye gider; son açılan proje hedef olur.
    if (isOpening && kindOf(row) === 'Project') {
      setActiveProjectId(row.entityId);
    }

    if (isOpening && row.isLazy && row.entityId) {
      await loadBranch(row.entityId);
    }
  }, [open, loadBranch]);

  const expandAll = useCallback(async () => {
    if (!overview) return;

    // Zaten hepsi acisa kapat: tek dugme iki yonlu.
    const allOpen = overview.rows.every((r) => open.has(r.id));
    if (allOpen) {
      setOpen(new Set());
      return;
    }

    setBusy(true);
    try {
      await Promise.all(overview.rows.filter((r) => r.entityId).map((r) => loadBranch(r.entityId)));
      setOpen((prev) => {
        const next = new Set(prev);
        overview.rows.forEach((r) => next.add(r.id));
        // Alt dugumler de acilsin ki "hepsini ac" gercekten hepsini acsin.
        Object.values(branchesRef.current).forEach((rows) => {
          rows.forEach((r) => { if (r.hasChildren) next.add(r.id); });
        });
        return next;
      });
    } finally {
      setBusy(false);
    }
  }, [overview, open, loadBranch]);

  /** Gorunur satirlar: her dugumun tum atalari acik olmali. */
  const visibleRows = useMemo(() => {
    if (!overview) return [];

    const byId = new Map();
    const all = [];

    const push = (row) => { byId.set(row.id, row); all.push(row); };

    overview.rows.forEach((projectRow) => {
      push(projectRow);
      (branches[projectRow.entityId] ?? []).forEach(push);
    });

    const isVisible = (row) => {
      let parent = row.parentId;
      while (parent) {
        if (!open.has(parent)) return false;
        parent = byId.get(parent)?.parentId ?? null;
      }
      return true;
    };

    const matchesFilters = (row) => {
      const kind = kindOf(row);
      // Grup satirlari filtrede elenmez; elense altindaki eslesmeler de kaybolurdu.
      if (kind === 'Project' || kind === 'WorkStep' || kind === 'TaskGroup' || kind === 'UnassignedGroup') return true;
      if (onlyMissing && kind !== 'MissingItem') return false;
      if (kindFilter && kind !== kindFilter) return false;
      if (ownerFilter && row.ownerName !== ownerFilter) return false;
      return true;
    };

    return all.filter((r) => isVisible(r) && matchesFilters(r));
  }, [overview, branches, open, onlyMissing, kindFilter, ownerFilter]);

  const owners = useMemo(() => {
    const set = new Set();
    Object.values(branches).forEach((rows) => rows.forEach((r) => { if (r.ownerName) set.add(r.ownerName); }));
    return [...set].sort((a, b) => a.localeCompare(b, 'tr'));
  }, [branches]);

  if (loading) return <div className="p-4"><SkeletonList rows={8} /></div>;

  if (!overview || overview.rows.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={<i className="fa fa-diagram-project" />}
          title="Henüz proje yok"
          description="Kapsam ağacı projelerden doğar; önce bir proje oluşturun."
          action={<Button asChild><a href={`${abpAppPath()}Projects`}>Projelere git</a></Button>}
        />
      </div>
    );
  }

  const rollup = overview.rollup;
  const allOpen = overview.rows.every((r) => open.has(r.id));

  return (
    <div className="apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto" style={{ maxWidth: 1560 }}>
      <div className="d-flex align-items-end gap-3 mb-4 flex-wrap">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Proje kapsamı</h1>
          <p style={{ fontSize: 12, color: 'var(--apya-text-tertiary)', margin: '4px 0 0' }}>
            Projeler, iş adımları, görevler ve bunlara bağlı belge · tutar · uygunluk
          </p>
        </div>
        <div className="flex-grow-1" />
        <Button variant="outline" size="sm" onClick={expandAll} isLoading={busy}>
          <i className={cn('fa', allOpen ? 'fa-compress' : 'fa-expand')} />
          {allOpen ? ' Hepsini kapat' : ' Hepsini aç'}
        </Button>
        {/* Rapor TEK proje icin derlenir; hedef, acilan (ya da baglamdan gelen) proje. */}
        {activeProjectId ? (
          <Button asChild size="sm">
            <a href={`${abpAppPath()}Documents/ReportBuilder?projectId=${activeProjectId}`}>
              <i className="fa fa-file-export" /> Kapsamı raporla
            </a>
          </Button>
        ) : (
          <Button size="sm" disabled title="Raporlamak için bir proje açın">
            <i className="fa fa-file-export" /> Kapsamı raporla
          </Button>
        )}
      </div>

      {/* Ozet serit */}
      <div className="apya-doc-kpis">
        <div className="apya-doc-kpi">
          <span className="apya-md-overline">Proje</span>
          <div className="apya-numeric apya-doc-kpi-value">{rollup.projectCount}</div>
        </div>
        <div className="apya-doc-kpi">
          <span className="apya-md-overline">Belge</span>
          <div className="apya-numeric apya-doc-kpi-value">{rollup.documentCount}</div>
        </div>
        <div className="apya-doc-kpi">
          <span className="apya-md-overline">Belgelenmiş tutar</span>
          <div className="apya-numeric apya-doc-kpi-value" style={{ fontSize: 18 }}>
            {fmtMoney(rollup.totalAmount, rollup.currency)}
          </div>
          {rollup.hasMixedCurrency && (
            <div style={{ fontSize: 11, color: 'var(--apya-warning-600, #B45309)' }}>
              Farklı para birimli kalemler toplama katılmadı.
            </div>
          )}
        </div>
        <div className="apya-doc-kpi">
          <span className="apya-md-overline">Ortalama uygunluk</span>
          <div className="apya-numeric apya-doc-kpi-value">
            {rollup.averageCompliancePercent === null || rollup.averageCompliancePercent === undefined
              ? '—'
              : `%${rollup.averageCompliancePercent}`}
          </div>
          <div style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
            {rollup.missingCount > 0 ? `${rollup.missingCount} eksik kalem` : 'kontrol listesi olan projeler'}
          </div>
        </div>
      </div>

      <div className="apya-doc-check-card mt-3 p-0" style={{ overflow: 'hidden' }}>
        <div className="apya-doc-check-head" style={{ padding: '12px 14px' }}>
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>Proje → iş adımı → belge · görev</span>
          <div className="flex-grow-1" />

          <select
            className="apya-doc-select"
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
            aria-label="Tür süz"
          >
            <option value="">Tür: tümü</option>
            <option value="Document">Belge</option>
            <option value="MissingItem">Eksik kalem</option>
            <option value="Task">Görev</option>
            <option value="SubTask">Alt görev</option>
          </select>

          <select
            className="apya-doc-select"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            aria-label="Sorumlu süz"
          >
            <option value="">Sorumlu: tümü</option>
            {owners.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>

          <button
            type="button"
            className={cn('apya-doc-filterchip', onlyMissing && 'is-active')}
            onClick={() => setOnlyMissing((v) => !v)}
          >
            Sadece eksikler
          </button>
        </div>

        <div
          className="apya-doc-row apya-doc-row-head apya-doc-scope-row"
          style={{ gridTemplateColumns: 'minmax(0,1fr) 96px 104px 132px 156px 64px 128px 120px' }}
        >
          <span>Kalem</span>
          <span>Tür</span>
          <span>Durum</span>
          <span>Sorumlu</span>
          <span>Tarih</span>
          <span style={{ textAlign: 'center' }}>Belge</span>
          <span style={{ textAlign: 'right' }}>Tutar</span>
          <span style={{ textAlign: 'right' }}>Uygunluk</span>
        </div>

        {visibleRows.map((row) => (
          <ScopeRow
            key={row.id}
            row={row}
            isOpen={open.has(row.id)}
            onToggle={() => toggle(row)}
            currency={rollup.currency}
          />
        ))}

        <div
          className="apya-doc-row apya-doc-scope-row is-total"
          style={{ gridTemplateColumns: 'minmax(0,1fr) 96px 104px 132px 156px 64px 128px 120px', cursor: 'default' }}
        >
          <span style={{ fontSize: 12, fontWeight: 600 }}>Toplam · {rollup.projectCount} proje</span>
          <span /><span /><span /><span />
          <span className="apya-numeric" style={{ fontSize: 11.5, textAlign: 'center' }}>{rollup.documentCount}</span>
          <span className="apya-numeric" style={{ fontSize: 11.5, textAlign: 'right', fontWeight: 600 }}>
            {fmtMoney(rollup.totalAmount, rollup.currency)}
          </span>
          <span className="apya-numeric" style={{ fontSize: 11.5, textAlign: 'right' }}>
            {rollup.averageCompliancePercent === null || rollup.averageCompliancePercent === undefined
              ? '—'
              : `%${rollup.averageCompliancePercent} ort.`}
          </span>
        </div>
      </div>
    </div>
  );
}
