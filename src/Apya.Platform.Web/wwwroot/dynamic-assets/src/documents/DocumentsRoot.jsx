import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input } from '../components/ui';
import {
  abpAuth, abpDocument, abpNotify, abpAppPath,
  bulkMoveFiles, bulkTagFiles, deleteFile, getComplianceOverview, getDocumentTypes, getFile, getFiles,
  getWorkSteps, linkComplianceDocument, moveFile, restoreFile, updateFileMeta, uploadAttachment,
} from './api';
import { cn, fmt } from './format';
import { ContextTree } from './components/ContextTree';
import { BulkBar, FileList } from './components/FileList';
import { DetailPanel } from './components/DetailPanel';
import { ComplianceTab } from './components/ComplianceTab';
import { ActivityTab } from './components/ActivityTab';

const PAGE_SIZE = 25;

/* ─── Küçük yardımcı bileşenler ───────────────────────────────────────── */

function Toast({ message, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2800);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <div className="apya-pop-in apya-doc-toast" role="status">
      <i className="fa fa-check" style={{ fontSize: 11, color: 'var(--apya-positive-500)' }} />
      <span style={{ fontSize: 12 }}>{message}</span>
    </div>
  );
}

function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="apya-in apya-doc-overlay" onClick={onCancel}>
      <div className="apya-pop-in apya-doc-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex align-items-start gap-3 mb-3">
          <div
            className="d-grid place-items-center flex-shrink-0"
            style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(248,113,113,.12)', color: 'var(--apya-negative-500)' }}
          >
            <i className="fa fa-trash" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)', marginTop: 4 }}>{message}</div>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="outline" size="sm" onClick={onCancel}>Vazgeç</Button>
          <Button
            variant="destructive" size="sm" isLoading={busy}
            onClick={async () => { setBusy(true); await onConfirm(); setBusy(false); }}
          >
            Evet, sil
          </Button>
        </div>
      </div>
    </div>
  );
}

/** KPI şeridi. Uygunluk ve eksik belge yalnız bir proje bağlamı seçiliyken
    doluyor — proje yokken kontrol listesi tanımsızdır ve sahte sayı basmıyoruz. */
function KpiStrip({ uploadedThisMonth, expiring, compliance }) {
  const tiles = [
    {
      key: 'compliance',
      label: 'Uygunluk',
      value: compliance ? `%${compliance.percent}` : '—',
      icon: 'fa-clipboard-check',
      tone: 'positive',
      foot: compliance
        ? `${compliance.satisfiedCount} / ${compliance.totalCount - compliance.waivedCount} kalem tamam`
        : 'Proje bağlamı seçin',
    },
    {
      key: 'missing',
      label: 'Eksik belge',
      value: compliance ? compliance.missingCount : '—',
      icon: 'fa-triangle-exclamation',
      tone: 'warning',
      foot: compliance && compliance.blockingMissingCount > 0
        ? `${compliance.blockingMissingCount} tanesi teslimi bloke ediyor`
        : null,
    },
    {
      key: 'uploaded',
      label: 'Bu ay yüklenen',
      value: uploadedThisMonth ?? '—',
      icon: 'fa-arrow-up-from-bracket',
      tone: 'accent',
      // "Dönem" bu ekranda seçili değil; ölçülebilir tek pencere takvim ayı.
      foot: 'ayın 1\'inden bugüne',
    },
    { key: 'expiring', label: 'Süresi dolan', value: expiring ?? '—', icon: 'fa-clock-rotate-left', tone: 'negative' },
  ];

  return (
    <div className="apya-doc-kpis">
      {tiles.map((tile) => (
        <div key={tile.key} className="apya-doc-kpi">
          <div className="d-flex align-items-center gap-2">
            <span className={cn('apya-doc-kpi-icon', `is-${tile.tone}`)}><i className={`fa ${tile.icon}`} /></span>
            <span className="apya-md-overline">{tile.label}</span>
          </div>
          <div className="apya-numeric apya-doc-kpi-value">{tile.value}</div>
          {tile.foot && (
            <div style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>{tile.foot}</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Ana bileşen ─────────────────────────────────────────────────────── */

export function DocumentsRoot() {
  const [folders, setFolders] = useState([]);
  const [workSteps, setWorkSteps] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loadingTree, setLoadingTree] = useState(true);

  const [files, setFiles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [expiringCount, setExpiringCount] = useState(null);
  const [uploadedThisMonth, setUploadedThisMonth] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(true);

  /* --- URL, filtrelerin tek doğruluk kaynağı ---
     Üst bardaki kayıtlı görünüm çipi ekranın FİLTRE URL'İNİ adlandırıp saklıyor
     ve uygularken sayfayı o sorguyla yeniden açıyor. Filtreler yalnız React
     state'inde yaşasaydı kaydedilen görünüm boş bir ekran açardı. */
  const initialQuery = useMemo(() => new URLSearchParams(window.location.search), []);

  const [node, setNode] = useState(() => {
    const smart = initialQuery.get('smart');
    // Klasör/iş adımı düğümü ağaç yüklenmeden çözülemez (projeyi ağaç taşıyor);
    // onu aşağıdaki geri yükleme effect'i tamamlar.
    return smart ? { key: smart, kind: 'smart', smart } : { key: 'all', kind: 'all' };
  });

  // Yükleme yalnız klasör bağlamında yapılır; uygunluk ve etkinlik ise proje
  // kapsamında çalışır — klasör de iş adımı da projeyi taşır. Aşağıdaki
  // yükleyicilerin bağımlılığı olduğu için burada, node'un hemen ardında durur.
  const activeFolderId = node.kind === 'folder' ? node.documentId : null;
  const activeProjectId = node.projectId || null;

  // Çöp kutusu: satırlar silinmiş belgeler, tek eylem geri alma.
  const isTrash = node.kind === 'smart' && node.smart === 'trash';
  const [expanded, setExpanded] = useState(new Set());
  const [search, setSearch] = useState(initialQuery.get('q') || '');
  const [sorting, setSorting] = useState(initialQuery.get('sort') || 'creationTime desc');
  const [view, setView] = useState(initialQuery.get('view') === 'grid' ? 'grid' : 'list');
  const [page, setPage] = useState(Number(initialQuery.get('page')) || 0);

  const [tab, setTab] = useState(() => {
    const requested = initialQuery.get('tab');
    return ['files', 'compliance', 'activity'].includes(requested) ? requested : 'files';
  });
  const [complianceSummary, setComplianceSummary] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);

  const [checkedIds, setCheckedIds] = useState(new Set());
  const [dragTarget, setDragTarget] = useState(null);
  const draggedRef = useRef([]);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [missingItems, setMissingItems] = useState([]);
  // "Yükle" düğmesine basılan eksik kalem; yükleme bitince buna bağlanır.
  const pendingRequirementRef = useRef(null);

  const canCreate = abpAuth('Platform.Documents.Create');
  const canEditMeta = abpAuth('Platform.Documents.ManageMeta');
  const canBulk = abpAuth('Platform.Documents.BulkOperations');
  const canDelete = abpAuth('Platform.Documents.Delete');

  const flash = useCallback((msg) => setToast(msg), []);

  /* --- Ağaç verisi --- */
  const loadTree = useCallback(async () => {
    setLoadingTree(true);
    try {
      const [folderResult, steps, types] = await Promise.all([
        abpDocument().getList({ maxResultCount: 1000, sorting: 'title asc' }),
        getWorkSteps(),
        getDocumentTypes(),
      ]);
      setFolders(folderResult.items ?? []);
      setWorkSteps(steps ?? []);
      setDocumentTypes(types ?? []);
    } catch (e) {
      abpNotify('error', 'Klasör ağacı yüklenemedi.');
      console.error('[Documents] loadTree', e);
    } finally {
      setLoadingTree(false);
    }
  }, []);

  useEffect(() => { loadTree(); }, [loadTree]);

  /* --- Aktif düğüm → sorgu filtresi --- */
  const filter = useMemo(() => {
    const base = { maxResultCount: PAGE_SIZE, skipCount: page * PAGE_SIZE, sorting };
    if (search.trim()) base.filterText = search.trim();

    if (node.kind === 'folder') {
      base.documentId = node.documentId;
      base.includeSubFolders = true;
    } else if (node.kind === 'workstep') {
      base.workStepId = node.workStepId;
    } else if (node.kind === 'smart' && node.smart === 'expiring') {
      base.expiringWithinDays = 30;
    } else if (node.kind === 'smart' && node.smart === 'missing-meta') {
      base.missingRequiredFields = true;
    } else if (node.kind === 'smart' && node.smart === 'trash') {
      base.onlyDeleted = true;
    }

    return base;
  }, [node, page, sorting, search]);

  const loadFiles = useCallback(async () => {
    setLoadingFiles(true);
    try {
      const result = await getFiles(filter);
      setFiles(result.items ?? []);
      setTotalCount(result.totalCount ?? 0);
    } catch (e) {
      abpNotify('error', 'Belge listesi yüklenemedi.');
      console.error('[Documents] loadFiles', e);
    } finally {
      setLoadingFiles(false);
    }
  }, [filter]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  /* --- KPI: tek satırlık sorgular, yalnız totalCount okunur --- */
  const loadKpis = useCallback(async () => {
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [expiring, uploaded] = await Promise.all([
        getFiles({ maxResultCount: 1, skipCount: 0, expiringWithinDays: 30 }),
        getFiles({ maxResultCount: 1, skipCount: 0, uploadedAfter: monthStart }),
      ]);

      setExpiringCount(expiring.totalCount ?? 0);
      setUploadedThisMonth(uploaded.totalCount ?? 0);
    } catch (e) {
      console.error('[Documents] loadKpis', e);
    }
  }, []);

  useEffect(() => { loadKpis(); }, [loadKpis]);

  /* --- Satır içi eksik kalemler ---
     Kontrol listesi PROJE kapsamında tanımlı; proje bağlamı yoksa gösterilecek
     bir eksik de yok. İş adımı seçiliyse yalnız o adımın kalemleri süzülür. */
  const loadMissing = useCallback(async () => {
    if (!activeProjectId) {
      setMissingItems([]);
      return;
    }

    try {
      const overview = await getComplianceOverview(activeProjectId, null);

      const items = (overview.checklists ?? []).flatMap((checklist) =>
        (checklist.items ?? [])
          .filter((item) => item.status === 2) // 2 = Missing
          .map((item) => ({ ...item, assignmentId: checklist.assignmentId })));

      setMissingItems(
        node.kind === 'workstep'
          ? items.filter((i) => i.workStepId === node.workStepId)
          : items,
      );
    } catch (e) {
      // Kontrol listesi okunamadıysa dosya listesi yine çalışmalı.
      setMissingItems([]);
      console.error('[Documents] loadMissing', e);
    }
  }, [activeProjectId, node.kind, node.workStepId]);

  useEffect(() => { loadMissing(); }, [loadMissing]);

  /* --- Ağaç düğümleri --- */
  const tree = useMemo(() => {
    const stepsByProject = new Map();
    workSteps.forEach((step) => {
      if (!stepsByProject.has(step.projectId)) stepsByProject.set(step.projectId, []);
      stepsByProject.get(step.projectId).push(step);
    });

    const byParent = new Map();
    folders.forEach((folder) => {
      const key = folder.parentDocumentId || 'root';
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(folder);
    });

    const build = (parentKey) => (byParent.get(parentKey) || [])
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title, 'tr'))
      .map((folder) => {
        const children = build(folder.id);

        // Projeye bağlı klasörün altına o projenin iş adımları eklenir.
        const steps = folder.projectId ? (stepsByProject.get(folder.projectId) || []) : [];
        const stepNodes = steps
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((step) => ({
            key: `step-${step.id}`,
            kind: 'workstep',
            workStepId: step.id,
            projectId: step.projectId,
            label: `${step.order} · ${step.name}`,
            icon: 'fa-diagram-next',
            count: step.documentCount,
            children: [],
          }));

        return {
          key: `folder-${folder.id}`,
          kind: 'folder',
          documentId: folder.id,
          projectId: folder.projectId,
          label: folder.title,
          icon: folder.projectId ? 'fa-diagram-project' : 'fa-folder',
          children: [...stepNodes, ...children],
        };
      });

    return build('root');
  }, [folders, workSteps]);

  /* --- URL'deki klasör/iş adımı düğümünü ağaç gelince geri yükle ---
     Bir kez çalışır: kullanıcı sonradan başka düğüme geçtiğinde geri sürüklemez. */
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current || loadingTree || tree.length === 0) return;

    const folderId = initialQuery.get('folder');
    const stepId = initialQuery.get('step');
    if (!folderId && !stepId) {
      restoredRef.current = true;
      return;
    }

    const flatten = (nodes) => nodes.flatMap((n) => [n, ...flatten(n.children || [])]);
    const found = flatten(tree).find((n) => (
      folderId ? n.documentId === folderId : n.workStepId === stepId
    ));

    restoredRef.current = true;
    if (found) {
      setNode(found);
      // Geri yüklenen düğümün üstleri açık gelsin ki ağaçta görünsün.
      setExpanded((prev) => new Set([...prev, found.key]));
    }
  }, [loadingTree, tree, initialQuery]);

  /* --- Durum → URL --- */
  useEffect(() => {
    const params = new URLSearchParams();

    if (tab !== 'files') params.set('tab', tab);
    if (node.kind === 'folder') params.set('folder', node.documentId);
    else if (node.kind === 'workstep') params.set('step', node.workStepId);
    else if (node.kind === 'smart') params.set('smart', node.smart);
    if (search.trim()) params.set('q', search.trim());
    if (view !== 'list') params.set('view', view);
    if (sorting !== 'creationTime desc') params.set('sort', sorting);
    if (page > 0) params.set('page', String(page));

    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, [tab, node, search, view, sorting, page]);

  /* --- Seçim / detay --- */
  const openDetail = useCallback(async (file) => {
    setSelectedId(file.id);
    setLoadingDetail(true);
    try {
      setDetail(await getFile(file.id));
    } catch (e) {
      abpNotify('error', 'Belge detayı açılamadı.');
      console.error('[Documents] openDetail', e);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const handleSave = async (draft) => {
    setSaving(true);
    try {
      await updateFileMeta(draft.id, {
        displayName: draft.displayName,
        documentTypeId: draft.documentTypeId || null,
        projectId: draft.projectId || null,
        workStepId: draft.workStepId || null,
        amount: draft.amount,
        currency: draft.currency || 'TRY',
        documentDate: draft.documentDate || null,
        periodCode: draft.periodCode || null,
        expiryDate: draft.expiryDate || null,
        externalRef: draft.externalRef || null,
        status: draft.status,
        fields: draft.fields.map((f) => ({
          fieldId: f.fieldId,
          valueText: f.valueText ?? null,
          valueNumber: f.valueNumber ?? null,
          valueDate: f.valueDate ?? null,
        })),
        tags: draft.tags || [],
      });
      flash('Belge güncellendi.');
      setDetail(await getFile(draft.id));
      await loadFiles();
    } catch (e) {
      abpNotify('error', 'Belge güncellenemedi.');
      console.error('[Documents] handleSave', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFile(deleteTarget.id);
      if (selectedId === deleteTarget.id) { setSelectedId(null); setDetail(null); }
      flash('Belge silindi.');
      await Promise.all([loadFiles(), loadKpis()]);
    } catch (e) {
      abpNotify('error', 'Belge silinemedi.');
      console.error('[Documents] handleDelete', e);
    } finally {
      setDeleteTarget(null);
    }
  };

  /* --- Sürükle-bırak: satır → klasör --- */
  const handleDragStart = (file) => {
    // Seçili satırlar varsa ve sürüklenen onlardan biriyse hepsi taşınır.
    draggedRef.current = checkedIds.has(file.id) ? Array.from(checkedIds) : [file.id];
  };

  const handleDropOnFolder = async (targetDocumentId) => {
    const ids = draggedRef.current;
    if (!ids.length) return;

    try {
      if (ids.length === 1) {
        await moveFile(ids[0], targetDocumentId);
      } else {
        await bulkMoveFiles(ids, targetDocumentId);
      }
      flash(ids.length === 1 ? 'Belge taşındı.' : `${ids.length} belge taşındı.`);
      setCheckedIds(new Set());
      await loadFiles();
    } catch (e) {
      abpNotify('error', 'Taşıma başarısız oldu.');
      console.error('[Documents] move', e);
    } finally {
      draggedRef.current = [];
    }
  };

  /* --- Toplu işlemler --- */
  const handleBulkMove = async () => {
    const target = window.prompt('Hedef klasör adını yazın:');
    if (!target) return;
    const folder = folders.find((f) => f.title.toLocaleLowerCase('tr') === target.toLocaleLowerCase('tr'));
    if (!folder) { abpNotify('warn', 'Klasör bulunamadı.'); return; }

    try {
      await bulkMoveFiles(Array.from(checkedIds), folder.id);
      flash(`${checkedIds.size} belge taşındı.`);
      setCheckedIds(new Set());
      await loadFiles();
    } catch (e) {
      abpNotify('error', 'Toplu taşıma başarısız oldu.');
      console.error('[Documents] bulkMove', e);
    }
  };

  const handleBulkTag = async () => {
    const input = window.prompt('Etiket(ler) — virgülle ayırın:');
    if (!input) return;
    const tags = input.split(',').map((t) => t.trim()).filter(Boolean);
    if (!tags.length) return;

    try {
      await bulkTagFiles(Array.from(checkedIds), tags);
      flash(`${checkedIds.size} belge etiketlendi.`);
      setCheckedIds(new Set());
      await loadFiles();
    } catch (e) {
      abpNotify('error', 'Etiketleme başarısız oldu.');
      console.error('[Documents] bulkTag', e);
    }
  };

  /* --- Yükleme --- */
  const handleUpload = async (fileList) => {
    if (!activeFolderId || !fileList?.length) return;

    // Eksik kalem satırından gelindiyse hedef burada sabitlenir; kullanıcı
    // dosya seçerken bağlam değişse bile yükleme doğru kaleme bağlanır.
    const requirement = pendingRequirementRef.current;
    pendingRequirementRef.current = null;

    setUploading(true);
    try {
      let firstFileId = null;

      for (const file of Array.from(fileList)) {
        const attachment = await uploadAttachment(activeFolderId, file);
        firstFileId = firstFileId ?? attachment?.documentFileId ?? null;
      }

      if (requirement && firstFileId) {
        await linkComplianceDocument({
          assignmentId: requirement.assignmentId,
          requirementId: requirement.requirementId,
          workStepId: requirement.workStepId || null,
          periodCode: requirement.periodCode || null,
          documentFileId: firstFileId,
        });
        flash(`Yüklendi ve "${requirement.title}" kalemine bağlandı.`);
      } else {
        flash(fileList.length === 1 ? 'Dosya yüklendi.' : `${fileList.length} dosya yüklendi.`);
      }

      await Promise.all([loadFiles(), loadKpis(), loadTree(), loadMissing()]);
    } catch (e) {
      abpNotify('error', 'Dosya yüklenemedi.');
      console.error('[Documents] upload', e);
    } finally {
      setUploading(false);
    }
  };

  /** Çöp kutusundan geri alma — belge ekleri ve etiketleriyle birlikte döner. */
  const handleRestore = async (file) => {
    try {
      await restoreFile(file.id);
      flash(`"${file.displayName}" geri alındı.`);
      await Promise.all([loadFiles(), loadKpis(), loadTree()]);
    } catch (e) {
      abpNotify('error', 'Belge geri alınamadı.');
      console.error('[Documents] restore', e);
    }
  };

  /** Eksik kalem satırındaki "Yükle": dosya seçiciyi açar, hedefi saklar. */
  const handleUploadForRequirement = (item) => {
    if (!activeFolderId) {
      abpNotify('warn', 'Yükleme klasör bağlamında yapılır — soldan bir klasör seçin.');
      return;
    }

    pendingRequirementRef.current = item;
    fileInputRef.current?.click();
  };

  const openCreateFolder = () => {
    const modal = new window.abp.ModalManager(abpAppPath() + 'Documents/CreateModal');
    modal.open({ parentDocumentId: activeFolderId || undefined });
    modal.onResult(() => { loadTree(); flash('Klasör oluşturuldu.'); });
  };

  const toggleExpand = (key) => setExpanded((prev) => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  const selectNode = (next) => {
    setNode(next);
    setPage(0);
    setCheckedIds(new Set());
    if (next.key?.startsWith('folder-')) toggleExpand(next.key);
  };

  const toggleCheck = (id) => setCheckedIds((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => setCheckedIds((prev) => (
    files.every((f) => prev.has(f.id)) ? new Set() : new Set(files.map((f) => f.id))
  ));

  return (
    <div
      className="apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto"
      style={{ maxWidth: 1560 }}
      onDragOver={(e) => { if (activeFolderId) e.preventDefault(); }}
      onDrop={(e) => {
        if (!activeFolderId || !e.dataTransfer.files?.length) return;
        e.preventDefault();
        handleUpload(e.dataTransfer.files);
      }}
    >
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Dokümanlar</h1>
          <p style={{ fontSize: 12, color: 'var(--apya-text-tertiary)', margin: '4px 0 0' }}>
            Klasörler, belgeler ve meta veri
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          {/* Buradaki "Yükle" tek seferlik ve seçili klasöre çalışır; sıra,
              ilerleme ve tekrar deneme isteyen toplu iş kuyruk ekranında. */}
          {canCreate && (
            <a
              className="apya-doc-linkbtn"
              href={`${abpAppPath()}Documents/Upload${activeFolderId ? `?documentId=${activeFolderId}` : ''}`}
            >
              Toplu yükleme
            </a>
          )}
          {canCreate && (
            <Button variant="secondary" leadingIcon={<i className="fa fa-folder-plus" />} onClick={openCreateFolder}>
              Yeni klasör
            </Button>
          )}
          {canCreate && (
            <Button
              variant="primary"
              isLoading={uploading}
              disabled={!activeFolderId}
              title={activeFolderId ? undefined : 'Önce bir klasör seçin'}
              leadingIcon={<i className="fa fa-upload" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Yükle
            </Button>
          )}
          <input
            ref={fileInputRef} type="file" multiple hidden
            onChange={(e) => { handleUpload(e.target.files); e.target.value = ''; }}
          />
        </div>
      </div>

      <KpiStrip uploadedThisMonth={uploadedThisMonth} expiring={expiringCount} compliance={complianceSummary} />

      <div className="apya-doc-tabs" role="tablist">
        {[
          { key: 'files', label: 'Dosyalar' },
          { key: 'compliance', label: 'Uygunluk' },
          { key: 'activity', label: 'Etkinlik' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={cn('apya-doc-tab', tab === t.key && 'is-active')}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={cn('apya-docs-shell', tab !== 'files' && 'is-wide')}>
        <ContextTree
          loading={loadingTree}
          tree={tree}
          activeKey={node.key}
          expanded={expanded}
          onToggle={toggleExpand}
          onSelect={selectNode}
          onDropFiles={handleDropOnFolder}
          dragTarget={dragTarget}
          setDragTarget={setDragTarget}
        />

        {tab === 'compliance' ? (
          <div className="apya-docs-main">
            <ComplianceTab
              projectId={activeProjectId}
              periodCode={null}
              onSummaryChange={setComplianceSummary}
            />
          </div>
        ) : tab === 'activity' ? (
          <div className="apya-docs-main">
            <ActivityTab projectId={activeProjectId} documentFileId={null} />
          </div>
        ) : (
        <div className="apya-docs-main">
          <div className="apya-grid-toolbar" style={{ padding: '12px 14px', borderBottom: '1px solid var(--apya-border-subtle)' }}>
            <Input
              size="sm"
              className="apya-grid-search"
              leading={<i className="fa fa-search" style={{ fontSize: 11 }} />}
              placeholder="Bu bağlamda filtrele"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
            <span className="apya-grid-count apya-numeric">{totalCount} belge</span>
            <div className="apya-doc-viewtoggle">
              <button
                type="button"
                className={cn(view === 'list' && 'is-active')}
                onClick={() => setView('list')}
                aria-label="Liste görünümü"
              >
                <i className="fa fa-list" />
              </button>
              <button
                type="button"
                className={cn(view === 'grid' && 'is-active')}
                onClick={() => setView('grid')}
                aria-label="Kart görünümü"
              >
                <i className="fa fa-border-all" />
              </button>
            </div>
          </div>

          <FileList
            loading={loadingFiles}
            files={files}
            totalCount={totalCount}
            view={view}
            sorting={sorting}
            onSort={(next) => { setSorting(next); setPage(0); }}
            selectedId={selectedId}
            onSelect={openDetail}
            checkedIds={checkedIds}
            onToggleCheck={toggleCheck}
            onToggleAll={toggleAll}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            onDragStart={handleDragStart}
            emptyHint={activeFolderId
              ? 'Dosyaları buraya sürükleyin ya da "Yükle" ile ekleyin.'
              : 'Sol taraftan bir klasör seçin; yükleme klasör bağlamında yapılır.'}
            missingItems={missingItems}
            onUploadMissing={handleUploadForRequirement}
            canUpload={canCreate}
            isTrash={isTrash}
            onRestore={handleRestore}
          />

          {canBulk && (
            <BulkBar
              count={checkedIds.size}
              onClear={() => setCheckedIds(new Set())}
              onMove={handleBulkMove}
              onTag={handleBulkTag}
            />
          )}
        </div>
        )}

        {/* Detay paneli yalnız Dosyalar sekmesinde anlamlı — diğer sekmeler
            zaten satır bazlı okuma yapıyor, üçüncü kolon boş dururdu. */}
        {tab === 'files' && (
          <div className="apya-docs-detail">
            <DetailPanel
              detail={detail}
              loading={loadingDetail}
              canEdit={canEditMeta}
              documentTypes={documentTypes}
              saving={saving}
              onSave={handleSave}
              onDelete={canDelete ? setDeleteTarget : () => {}}
            />
          </div>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title="Belge silinecek"
          message={`"${deleteTarget.displayName}" ve tüm versiyonları çöp kutusuna taşınacak. Sol alttaki "Çöp kutusu"ndan geri alabilirsiniz.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
