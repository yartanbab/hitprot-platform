/**
 * Documents Island — Apya Design System v3
 * -----------------------------------------------------------------------
 * Bağımlılık: React 18 + components/ui kit + apya-shell.css paylaşılan desenleri
 *   (.apya-docs-shell / .apya-tile-grid / .apya-md-detail — bkz. o dosyadaki
 *   HANDOFF yorumları).
 * ABP proxy    : window.apya.platform.documents.document.* (CRUD: getList/get/create/update/delete)
 * Dosya ekleri, versiyon geçmişi, erişim log'u, indirme:
 *   Razor Page handler'ları (/Documents?handler=...) — dynamic proxy'nin
 *   custom metod route kuralları belirsiz olduğundan, TaskAttachment'ın
 *   zaten kullandığı desenle (PageModel → app service, C#-to-C#) aynı yoldan gidiyoruz.
 * ABP modaller : window.abp.ModalManager (CreateModal / EditModal)
 * İkonlar      : Font Awesome 6 (LeptonX'in yüklediği FA — className="fa fa-...")
 *
 * Bu dosya Vite ile ES modülü olarak derlenir → /wwwroot/js/documents.js
 * Razor mount  : <div id="documents-island"></div>  (Documents/Index.cshtml)
 */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Badge, EmptyState, Skeleton, SkeletonList, Button, buttonVariants, Input, Sheet, Hint } from './components/ui';

/* ─── Yardımcılar ─────────────────────────────────────────────────────── */
const fmt = {
  date: (iso) => iso ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso)) : '—',
  dateTime: (iso) => iso ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '—',
  size: (bytes) => {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  },
  daysLeft: (iso) => {
    if (!iso) return null;
    const diff = Math.ceil((new Date(iso) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  },
};

const cn = (...c) => c.filter(Boolean).join(' ');

const ACCESS_ACTION_LABEL = {
  1: { text: 'Yüklendi', icon: 'fa-upload', variant: 'brand' },
  2: { text: 'İndirildi', icon: 'fa-download', variant: 'positive' },
  3: { text: 'Silindi', icon: 'fa-trash', variant: 'negative' },
};

/* ─── ABP köprüsü ─────────────────────────────────────────────────────── */
const abpDocument = () => window?.apya?.platform?.documents?.document;
const abpAuth     = (p) => window?.abp?.auth?.isGranted(p);
const abpNotify   = (type, msg) => window?.abp?.notify?.[type]?.(msg);
const abpAppPath  = () => window?.abp?.appPath ?? '/';

// abp.ajax jQuery Deferred döner; React'te await edebilmek için native Promise'e sarıyoruz.
function abpAjax(options) {
  return new Promise((resolve, reject) => {
    window.abp.ajax(options).done(resolve).fail(reject);
  });
}

const getAttachments = (documentId, includeHistory = false) =>
  abpAjax({ url: `${abpAppPath()}Documents?handler=Attachments&documentId=${documentId}&includeHistory=${includeHistory}`, type: 'GET' });

const getAccessLog = (documentId) =>
  abpAjax({ url: `${abpAppPath()}Documents?handler=AccessLog&documentId=${documentId}`, type: 'GET' });

const uploadAttachment = (documentId, file) => {
  const formData = new FormData();
  formData.append('documentId', documentId);
  formData.append('file', file);
  return abpAjax({
    url: `${abpAppPath()}Documents?handler=UploadFile`,
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
  });
};

const deleteAttachment = (attachmentId) =>
  abpAjax({ url: `${abpAppPath()}Documents?handler=DeleteAttachment&attachmentId=${attachmentId}`, type: 'POST' });

/* ─── Dosya türü → ikon/renk ──────────────────────────────────────────── */
function fileVisual(contentType, fileName) {
  const ext = (fileName || '').split('.').pop()?.toLowerCase() || '';
  if (contentType?.includes('pdf') || ext === 'pdf') return { icon: 'fa-file-pdf', color: '#EF4444' };
  if (contentType?.includes('sheet') || contentType?.includes('excel') || ['xlsx', 'xls', 'csv'].includes(ext)) return { icon: 'fa-file-excel', color: '#10B981' };
  if (contentType?.includes('word') || ['docx', 'doc'].includes(ext)) return { icon: 'fa-file-word', color: '#3B82F6' };
  if (contentType?.includes('presentation') || ['pptx', 'ppt'].includes(ext)) return { icon: 'fa-file-powerpoint', color: '#F59E0B' };
  if (contentType?.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif'].includes(ext)) return { icon: 'fa-file-image', color: '#8B5CF6' };
  if (['zip', 'rar'].includes(ext)) return { icon: 'fa-file-zipper', color: '#6B7280' };
  return { icon: 'fa-file', color: '#6B7280' };
}

/* ─── useIsDesktop — sağ detay panelinin statik kolon mu Sheet mi olacağını belirler ─── */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 992px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 992px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

/* ─── Toast ────────────────────────────────────────────────────────────*/
function Toast({ message, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2800);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <div className="apya-pop-in fixed bottom-5 right-5 z-[95] flex items-center gap-2.5 px-4 py-3 rounded-xl border"
      style={{ background: 'var(--apya-surface-elevated)', borderColor: 'var(--apya-border-strong)', boxShadow: 'var(--apya-shadow-lg)' }}
      role="status">
      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(52,211,153,.15)', color: 'var(--apya-positive-500)' }}>
        <i className="fa fa-check" style={{ fontSize: 11 }} />
      </div>
      <span className="text-xs text-[var(--apya-text-primary)]">{message}</span>
    </div>
  );
}

/* ─── ConfirmDialog ────────────────────────────────────────────────────*/
function ConfirmDialog({ title, message, confirmLabel = 'Evet, Sil', onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);
  const confirm = async () => { setBusy(true); await onConfirm(); setBusy(false); };
  return (
    <div className="apya-in fixed inset-0 z-[90] flex items-center justify-center p-5"
      style={{ background: 'var(--apya-surface-overlay)' }} onClick={onCancel}>
      <div className="apya-pop-in w-full max-w-sm rounded-2xl border border-[var(--apya-border-strong)] p-6"
        style={{ background: 'var(--apya-surface-elevated)', boxShadow: 'var(--apya-shadow-xl)' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(248,113,113,.12)', color: 'var(--apya-negative-500)' }}>
            <i className="fa fa-trash" style={{ fontSize: 16 }} aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--apya-text-primary)]">{title}</div>
            <div className="text-xs text-[var(--apya-text-tertiary)] mt-1">{message}</div>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onCancel}>Vazgeç</Button>
          <Button variant="destructive" size="sm" isLoading={busy} onClick={confirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Sol rail: klasör ağacı satırı — .apya-md-item stilini yeniden kullanır ──*/
function TreeRow({ node, depth, activeId, expanded, onToggle, onSelect }) {
  const hasChildren = node.children && node.children.length > 0;
  const isOpen = expanded.has(node.id);
  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={cn('apya-md-item', activeId === node.id && 'selected')}
        style={{ paddingLeft: 10 + depth * 16, borderRadius: 8 }}
      >
        <span
          role="button"
          tabIndex={-1}
          onClick={(e) => { e.stopPropagation(); if (hasChildren) onToggle(node.id); }}
          className="w-4 h-4 flex items-center justify-center flex-shrink-0"
          style={{ color: 'var(--apya-text-tertiary)' }}
        >
          {hasChildren && <i className={`fa fa-chevron-${isOpen ? 'down' : 'right'}`} style={{ fontSize: 9 }} />}
        </span>
        <span className="flex-shrink-0">{node.icon || (hasChildren ? '📁' : '📄')}</span>
        <span className="apya-md-item-title" style={{ fontWeight: activeId === node.id ? 700 : 500 }}>{node.title}</span>
        {typeof node.count === 'number' && (
          <span className="apya-md-item-side text-[11px]" style={{ color: 'var(--apya-text-tertiary)' }}>{node.count}</span>
        )}
      </button>
      {hasChildren && isOpen && (
        <div>
          {node.children.map((c) => (
            <TreeRow key={c.id} node={c} depth={depth + 1} activeId={activeId} expanded={expanded} onToggle={onToggle} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Orta alan: dosya/klasör kartı — .apya-tile deseni (Projeler ile aynı) ───*/
function DocTile({ item, selected, onClick }) {
  const isFile = item.kind === 'file';
  const visual = isFile ? fileVisual(item.contentType, item.fileName) : null;
  const days = isFile ? null : dfmtDaysChip(item.expiryDate);
  return (
    <button type="button" onClick={onClick} className="apya-tile" style={{ textAlign: 'left', cursor: 'pointer', ...(selected ? { borderColor: 'var(--apya-accent-500)', background: 'var(--apya-accent-soft)' } : {}) }}>
      <div className="apya-tile-head">
        <div className="d-flex align-items-start gap-2">
          <span className="apya-tile-icon-box" style={isFile ? { background: `${visual.color}1a`, color: visual.color } : undefined}>
            {isFile ? <i className={`fa ${visual.icon}`} /> : <span>{item.icon || (item.hasChildren ? '📁' : '📄')}</span>}
          </span>
          <div>
            <div className="apya-tile-title">{isFile ? item.fileName : item.title}</div>
            <div className="apya-tile-sub">{isFile ? fmt.size(item.fileSize) : (item.hasChildren ? 'Klasör' : 'Sayfa')}</div>
          </div>
        </div>
        {/* Grid yalnız IsLatest=true ekleri gösterir; versionNumber>1 = daha önce güncellenmiş dosya. */}
        {isFile && item.versionNumber > 1 && <Badge variant="brand" size="sm">v{item.versionNumber}</Badge>}
      </div>
      {days && <div className="apya-tile-foot" style={{ borderTop: 'none', paddingTop: 0 }}>
        <span className="apya-chip apya-chip-warning apya-tile-days-chip"><i className="fa fa-hourglass-half" />{days}</span>
      </div>}
      <div className="apya-tile-foot">
        <span title="Yükleyen">{isFile ? (item.uploaderName || 'Sistem') : '—'}</span>
        <span>{fmt.date(item.creationTime)}</span>
      </div>
    </button>
  );
}

function dfmtDaysChip(expiryDate) {
  const d = fmt.daysLeft(expiryDate);
  if (d === null || d < 0) return null;
  return d === 0 ? 'Bugün son gün' : `${d} gün kaldı`;
}

/* ─── Sağ: detay paneli içeriği (statik kolon ve Sheet arasında paylaşılır) ───*/
function DetailContent({ item, onEdit, onDelete, onOpen, canViewLog }) {
  const [versions, setVersions] = useState(null);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [log, setLog] = useState(null);
  const [loadingLog, setLoadingLog] = useState(false);

  const isFile = item?.kind === 'file';

  useEffect(() => {
    setVersions(null);
    setLog(null);
    if (!item || !isFile) return;

    setLoadingVersions(true);
    getAttachments(item.documentId, true)
      .then((all) => setVersions((all ?? []).filter((a) => a.versionGroupId === item.versionGroupId)))
      .catch(() => setVersions([]))
      .finally(() => setLoadingVersions(false));

    if (canViewLog) {
      setLoadingLog(true);
      getAccessLog(item.documentId)
        .then((all) => setLog((all ?? []).filter((l) => l.attachmentId === item.id)))
        .catch(() => setLog([]))
        .finally(() => setLoadingLog(false));
    }
  }, [item?.id, isFile, canViewLog]);

  if (!item) {
    return (
      <EmptyState
        icon={<i className="fa fa-file-lines" />}
        title="Bir dosya veya belge seçin"
        description="Detayları, versiyon geçmişini ve etkinlik kaydını burada görürsünüz."
      />
    );
  }

  const visual = isFile ? fileVisual(item.contentType, item.fileName) : null;
  const days = !isFile ? dfmtDaysChip(item.expiryDate) : null;

  return (
    <div>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: isFile ? `${visual.color}1a` : 'var(--apya-accent-soft)', color: isFile ? visual.color : 'var(--apya-accent-500)' }}>
          {isFile ? <i className={`fa ${visual.icon}`} /> : <span>{item.icon || '📄'}</span>}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[var(--apya-text-primary)] break-words">{isFile ? item.fileName : item.title}</div>
          {item.projectName && <div className="text-[11px] mt-0.5" style={{ color: 'var(--apya-text-tertiary)' }}><i className="fa fa-diagram-project me-1" />{item.projectName}</div>}
          {days && <Badge variant="warning" size="sm" className="mt-1.5"><i className="fa fa-hourglass-half" /> {days}</Badge>}
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6">
          <div className="apya-md-overline">Tür</div>
          <div className="text-xs fw-semibold">{isFile ? (item.fileName.split('.').pop()?.toUpperCase() || '—') : (item.hasChildren ? 'Klasör' : 'Sayfa')}</div>
        </div>
        {isFile && (
          <div className="col-6">
            <div className="apya-md-overline">Boyut</div>
            <div className="text-xs fw-semibold">{fmt.size(item.fileSize)}</div>
          </div>
        )}
        <div className="col-6">
          <div className="apya-md-overline">Yükleyen</div>
          <div className="text-xs fw-semibold">{isFile ? (item.uploaderName || 'Sistem') : '—'}</div>
        </div>
        <div className="col-6">
          <div className="apya-md-overline">Tarih</div>
          <div className="text-xs fw-semibold">{fmt.date(item.creationTime)}</div>
        </div>
      </div>

      <div className="d-flex flex-column gap-2 mb-4">
        {isFile ? (
          <a href={item.downloadUrl} className={buttonVariants({ variant: 'primary' })}>
            <i className="fa fa-download" /> İndir
          </a>
        ) : (
          <>
            <Button variant="primary" leadingIcon={<i className="fa fa-folder-open" />} onClick={() => onOpen(item)}>Aç</Button>
            <Button variant="secondary" leadingIcon={<i className="fa fa-pencil" />} onClick={() => onEdit(item)}>Düzenle</Button>
          </>
        )}
        <Button variant="outline" leadingIcon={<i className="fa fa-trash text-[var(--apya-negative-500)]" />} onClick={() => onDelete(item)}>Sil</Button>
      </div>

      {isFile && (
        <div className="mb-4">
          <div className="apya-md-overline mb-2 d-flex align-items-center">
            Versiyon Geçmişi
            <Hint text="Versiyon dosya ADINA göre izlenir: aynı belgeye aynı isimli bir dosyayı yeniden yüklerseniz yeni versiyon olur ve öncekiler geçmişte kalır. Farklı isimle yüklerseniz ayrı bir dosya olarak eklenir." />
          </div>
          {loadingVersions ? (
            <SkeletonList rows={2} />
          ) : !versions || versions.length <= 1 ? (
            <div className="text-[11.5px]" style={{ color: 'var(--apya-text-tertiary)' }}>Bu dosyanın başka versiyonu yok.</div>
          ) : (
            <div className="d-flex flex-column gap-1.5">
              {versions.map((v) => (
                <div key={v.id} className="d-flex align-items-center justify-content-between" style={{ fontSize: 11.5 }}>
                  <span className="d-flex align-items-center gap-2">
                    <Badge variant={v.isLatest ? 'brand' : 'neutral'} size="sm">v{v.versionNumber}</Badge>
                    <span style={{ color: 'var(--apya-text-secondary)' }}>{v.uploaderName || 'Sistem'}</span>
                  </span>
                  <span style={{ color: 'var(--apya-text-tertiary)' }}>{fmt.date(v.creationTime)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isFile && canViewLog && (
        <div>
          <div className="apya-md-overline mb-2 d-flex align-items-center">
            Aktivite
            <Hint text="Bu dosyaya kimin ne zaman dokunduğunun kaydı: yükleme, indirme ve silme işlemleri tutulur. Salt görüntüleme kaydedilmez." />
          </div>
          {loadingLog ? (
            <SkeletonList rows={3} />
          ) : !log || log.length === 0 ? (
            <div className="text-[11.5px]" style={{ color: 'var(--apya-text-tertiary)' }}>Henüz kayıtlı bir etkinlik yok.</div>
          ) : (
            <div className="d-flex flex-column gap-1.5">
              {log.map((l) => {
                const meta = ACCESS_ACTION_LABEL[l.action] || { text: '—', icon: 'fa-circle', variant: 'neutral' };
                return (
                  <div key={l.id} className="d-flex align-items-center justify-content-between" style={{ fontSize: 11.5 }}>
                    <span className="d-flex align-items-center gap-2">
                      <Badge variant={meta.variant} size="sm" withDot>{meta.text}</Badge>
                      <span style={{ color: 'var(--apya-text-secondary)' }}>{l.actorName}</span>
                    </span>
                    <span style={{ color: 'var(--apya-text-tertiary)' }}>{fmt.dateTime(l.creationTime)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Ana bileşen ──────────────────────────────────────────────────────*/
function DocumentsIsland() {
  const [allDocs, setAllDocs]         = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loadingTree, setLoadingTree] = useState(true);
  const [loadingFolder, setLoadingFolder] = useState(false);
  const [currentId, setCurrentId]     = useState(null); // null = kök
  const [selectedGroup, setSelectedGroup] = useState(null); // { type: 'project', projectId } — sanal Projeler dalı
  const [expanded, setExpanded]       = useState(new Set(['__projects__']));
  const [selected, setSelected]       = useState(null);
  const [search, setSearch]           = useState('');
  const [dragOver, setDragOver]       = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]             = useState(null);
  const fileInputRef = useRef(null);
  const isDesktop = useIsDesktop();

  const flash = useCallback((msg) => setToast(msg), []);
  const canViewLog = abpAuth('Platform.Documents.ViewAccessLog');

  const loadTree = useCallback(async () => {
    setLoadingTree(true);
    try {
      const result = await abpDocument().getList({ maxResultCount: 1000, sorting: 'title asc' });
      setAllDocs(result.items ?? []);
    } catch (e) {
      abpNotify('error', 'Belge listesi yüklenemedi.');
      console.error('[DocumentsIsland] loadTree error', e);
    } finally {
      setLoadingTree(false);
    }
  }, []);

  const loadAttachments = useCallback(async (documentId) => {
    if (!documentId) { setAttachments([]); return; }
    setLoadingFolder(true);
    try {
      const items = await getAttachments(documentId, false);
      setAttachments(items ?? []);
    } catch (e) {
      console.error('[DocumentsIsland] loadAttachments error', e);
    } finally {
      setLoadingFolder(false);
    }
  }, []);

  useEffect(() => { loadTree(); }, [loadTree]);

  useEffect(() => {
    setSelected((prev) => {
      if (!prev || prev.kind !== 'document') return prev;
      const fresh = allDocs.find((d) => d.id === prev.id);
      if (!fresh) return prev;
      return { ...fresh, kind: 'document', hasChildren: allDocs.some((x) => x.parentDocumentId === fresh.id) };
    });
  }, [allDocs]);
  useEffect(() => { loadAttachments(currentId); setSelected(null); }, [currentId, loadAttachments]);

  /* Gerçek klasör ağacı (ParentDocumentId hiyerarşisi) */
  const realTree = useMemo(() => {
    const byParent = new Map();
    allDocs.forEach((d) => {
      const key = d.parentDocumentId || 'root';
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(d);
    });
    const build = (parentKey) => (byParent.get(parentKey) || []).map((d) => ({ ...d, children: build(d.id) }));
    return build('root');
  }, [allDocs]);

  /* Sanal "Projeler" dalı — ProjectId'si dolu belgeleri proje adına göre gruplar (DB'de karşılığı yok, sadece render-time) */
  const projectGroup = useMemo(() => {
    const withProject = allDocs.filter((d) => d.projectId);
    if (withProject.length === 0) return null;
    const byProject = new Map();
    withProject.forEach((d) => {
      const key = d.projectId;
      if (!byProject.has(key)) byProject.set(key, { id: `project-${key}`, title: d.projectName || 'Adsız Proje', icon: '🏗️', projectId: key, children: [], count: 0 });
      const group = byProject.get(key);
      group.count += 1;
      group.children.push({ ...d, children: allDocs.filter((x) => x.parentDocumentId === d.id).map((c) => ({ ...c, children: [] })) });
    });
    return { id: '__projects__', title: 'Projeler', icon: '📁', count: withProject.length, children: Array.from(byProject.values()) };
  }, [allDocs]);

  const sidebarTree = useMemo(() => (projectGroup ? [projectGroup, ...realTree] : realTree), [projectGroup, realTree]);

  const breadcrumb = useMemo(() => {
    const path = [];
    let cursor = currentId;
    const byId = new Map(allDocs.map((d) => [d.id, d]));
    while (cursor) {
      const doc = byId.get(cursor);
      if (!doc) break;
      path.unshift(doc);
      cursor = doc.parentDocumentId;
    }
    return path;
  }, [currentId, allDocs]);

  const children = useMemo(
    () => allDocs.filter((d) => (d.parentDocumentId || null) === currentId)
      .map((d) => ({ ...d, kind: 'document', hasChildren: allDocs.some((x) => x.parentDocumentId === d.id) })),
    [allDocs, currentId],
  );
  const gridItems = useMemo(() => {
    const items = [...children, ...attachments.map((a) => ({ ...a, kind: 'file' }))];
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter((it) => (it.kind === 'file' ? it.fileName : it.title).toLowerCase().includes(q));
  }, [children, attachments, search]);

  const toggleExpand = (id) => setExpanded((s) => {
    const next = new Set(s);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const openFolder = (id) => {
    // Sanal "Projeler"/proje grup düğümlerine tıklamak yalnız açar/kapar, dosya listesi göstermez.
    if (id === '__projects__' || String(id).startsWith('project-')) { toggleExpand(id); return; }
    setCurrentId(id);
    if (id) setExpanded((s) => new Set(s).add(id));
  };

  const handleUpload = async (files) => {
    if (!currentId || !files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const dto = await uploadAttachment(currentId, file);
        // Aynı dosya adıyla eski versiyon varsa (artık IsLatest=false) yerini yeni versiyon alır.
        setAttachments((prev) => [dto, ...prev.filter((a) => a.fileName !== dto.fileName)]);
      }
      flash('Dosya yüklendi.');
    } catch (e) {
      abpNotify('error', 'Dosya yüklenemedi.');
      console.error('[DocumentsIsland] upload error', e);
    } finally {
      setUploading(false);
    }
  };

  const openCreate = () => {
    const modal = new window.abp.ModalManager(abpAppPath() + 'Documents/CreateModal');
    modal.open({ parentDocumentId: currentId || undefined });
    modal.onResult(() => { loadTree(); flash('Belge oluşturuldu.'); });
  };

  const openEdit = (doc) => {
    const modal = new window.abp.ModalManager(abpAppPath() + 'Documents/EditModal');
    modal.open({ id: doc.id });
    modal.onResult(() => { loadTree(); flash('Belge güncellendi.'); });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.kind === 'file') {
        await deleteAttachment(deleteTarget.id);
        setAttachments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      } else {
        await abpDocument().delete(deleteTarget.id);
        await loadTree();
      }
      if (selected?.id === deleteTarget.id) setSelected(null);
      flash('Silindi.');
    } catch (e) {
      abpNotify('error', 'Silme işlemi başarısız oldu.');
      console.error('[DocumentsIsland] delete error', e);
    } finally {
      setDeleteTarget(null);
    }
  };

  const canCreate = abpAuth('Platform.Documents.Create');

  return (
    <div className="apya-fade-in px-4 py-4 sm:px-7 sm:py-7 max-w-[1560px] mx-auto"
      onDragOver={(e) => { if (currentId) { e.preventDefault(); setDragOver(true); } }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); if (currentId) handleUpload(e.dataTransfer.files); }}>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--apya-text-primary)] m-0">Dokümanlar</h1>
          <p className="mt-1 text-xs text-[var(--apya-text-tertiary)] m-0">Klasörler ve dosya yönetimi</p>
        </div>
        {canCreate && (
          <Button variant="primary" leadingIcon={<i className="fa fa-plus" />} onClick={openCreate}>Yeni Belge</Button>
        )}
      </div>

      <div className="apya-docs-shell">
        {/* Sol: klasör ağacı */}
        <div className="apya-docs-tree">
          <button type="button" onClick={() => openFolder(null)}
            className={cn('apya-md-item', currentId === null && 'selected')} style={{ borderRadius: 8, fontWeight: 700 }}>
            <i className="fa fa-folder-tree" style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }} />
            <span className="apya-md-item-title">Tüm Dokümanlar</span>
          </button>
          {loadingTree ? (
            <div className="p-2"><SkeletonList rows={5} /></div>
          ) : sidebarTree.length === 0 ? (
            <div className="text-[11px] text-center py-6 px-2" style={{ color: 'var(--apya-text-tertiary)' }}>Henüz klasör/belge yok.</div>
          ) : (
            sidebarTree.map((node) => (
              <TreeRow key={node.id} node={node} depth={0} activeId={currentId} expanded={expanded} onToggle={toggleExpand} onSelect={openFolder} />
            ))
          )}
        </div>

        {/* Orta: grid */}
        <div className="apya-docs-main">
          <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--apya-border-subtle)' }}>
            <div className="flex items-center gap-1.5 text-xs min-w-0" style={{ color: 'var(--apya-text-tertiary)' }}>
              <span className={cn('cursor-pointer', currentId === null && 'fw-bold')} style={currentId === null ? { color: 'var(--apya-text-primary)' } : undefined} onClick={() => openFolder(null)}>Tüm Dokümanlar</span>
              {breadcrumb.map((d) => (
                <span key={d.id} className="flex items-center gap-1.5 min-w-0">
                  <i className="fa fa-chevron-right" style={{ fontSize: 8 }} />
                  <span className="cursor-pointer truncate" style={d.id === currentId ? { color: 'var(--apya-text-primary)', fontWeight: 700 } : undefined} onClick={() => openFolder(d.id)}>{d.title}</span>
                </span>
              ))}
            </div>
            {currentId && (
              <Button variant="primary" size="sm" isLoading={uploading} leadingIcon={<i className="fa fa-upload" />} onClick={() => fileInputRef.current?.click()}>Yükle</Button>
            )}
            <input ref={fileInputRef} type="file" multiple hidden onChange={(e) => { handleUpload(e.target.files); e.target.value = ''; }} />
          </div>

          <div className="p-4 relative">
            <div className="apya-grid-toolbar">
              <Input size="sm" className="apya-grid-search" leading={<i className="fa fa-search" style={{ fontSize: 11 }} />}
                placeholder="Ara veya klasör filtrele" value={search} onChange={(e) => setSearch(e.target.value)} />
              <span className="apya-grid-count">{gridItems.length} öge</span>
            </div>

            {dragOver && (
              <div className="absolute inset-2 z-10 rounded-xl border-2 border-dashed flex items-center justify-center text-sm font-semibold"
                style={{ borderColor: 'var(--apya-accent-500)', background: 'var(--apya-accent-soft)', color: 'var(--apya-accent-500)' }}>
                Yüklemek için bırakın
              </div>
            )}
            {!currentId && (
              <div className="mb-3 rounded-xl border border-dashed p-3 text-[11px] flex items-center gap-2"
                style={{ borderColor: 'var(--apya-border-default)', color: 'var(--apya-text-tertiary)' }}>
                <i className="fa fa-circle-info" /> Dosya yükleyebilmek için önce bir klasör/belge açın.
              </div>
            )}

            {loadingFolder ? (
              <div className="apya-tile-grid">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={120} rounded="lg" />)}</div>
            ) : gridItems.length === 0 ? (
              <EmptyState
                icon={<i className="fa fa-inbox" />}
                title="Burada henüz bir şey yok"
                description={currentId ? 'Dosya sürükleyip bırakın ya da "Yükle" butonunu kullanın.' : '"Yeni Belge" ile ilk klasörünüzü oluşturun.'}
              />
            ) : (
              <div className="apya-tile-grid">
                {gridItems.map((item) => (
                  <DocTile key={`${item.kind}-${item.id}`} item={item} selected={selected?.id === item.id}
                    onClick={() => setSelected(item)} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sağ: detay paneli — masaüstünde statik kolon, dar ekranda Sheet */}
        {isDesktop ? (
          <div className="apya-docs-detail">
            <div className="apya-md-detail">
              <DetailContent item={selected} onEdit={openEdit} onOpen={(d) => openFolder(d.id)} onDelete={setDeleteTarget} canViewLog={canViewLog} />
            </div>
          </div>
        ) : (
          <Sheet open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
            <Sheet.Content title="Belge Detayı">
              <div className="apya-md-detail" style={{ overflowY: 'auto' }}>
                <DetailContent item={selected} onEdit={openEdit} onOpen={(d) => { openFolder(d.id); setSelected(null); }} onDelete={setDeleteTarget} canViewLog={canViewLog} />
              </div>
            </Sheet.Content>
          </Sheet>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title={deleteTarget.kind === 'file' ? 'Dosya Silinecek' : 'Belge Silinecek'}
          message={`"${deleteTarget.kind === 'file' ? deleteTarget.fileName : deleteTarget.title}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

/* ─── Mount ─────────────────────────────────────────────────────────── */
const container = document.getElementById('documents-island');
if (container) {
  createRoot(container).render(<DocumentsIsland />);
}
