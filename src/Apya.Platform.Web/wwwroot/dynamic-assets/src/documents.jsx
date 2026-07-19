/**
 * Documents Island — Apya Design System v2
 * -----------------------------------------------------------------------
 * Bağımlılık: React 18 + mevcut style.css (Tailwind + --apya-* tokens).
 * ABP proxy    : window.apya.platform.documents.document.* (CRUD: getList/get/create/update/delete)
 * Dosya ekleri : Razor Page handler'ları (/Documents?handler=...) — dynamic proxy'nin
 *                custom metod route kuralları belirsiz olduğundan, TaskAttachment'ın
 *                zaten kullandığı desenle (PageModel → app service, C#-to-C#) aynı yoldan gidiyoruz.
 * ABP modaller : window.abp.ModalManager (CreateModal / EditModal)
 * İkonlar      : Font Awesome 6 (LeptonX'in yüklediği FA — className="fa fa-...")
 *
 * Bu dosya Vite ile ES modülü olarak derlenir → /wwwroot/js/documents.js
 * Razor mount  : <div id="documents-island"></div>  (Documents/Index.cshtml)
 */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

/* ─── Yardımcılar ─────────────────────────────────────────────────────── */
const fmt = {
  date: (iso) => iso ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso)) : '—',
  size: (bytes) => {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  },
};

const cn = (...c) => c.filter(Boolean).join(' ');

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

const getAttachments = (documentId) =>
  abpAjax({ url: `${abpAppPath()}Documents?handler=Attachments&documentId=${documentId}`, type: 'GET' });

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

/* ─── Skeleton ──────────────────────────────────────────────────────────*/
function Skeleton({ w = '100%', h = 14, r = 6 }) {
  return <div aria-hidden="true" className="apya-skeleton" style={{ width: w, height: h, borderRadius: r, flexShrink: 0 }} />;
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
          <button type="button" onClick={onCancel}
            className="h-9 px-4 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors">
            Vazgeç
          </button>
          <button type="button" onClick={confirm} disabled={busy}
            className="h-9 px-4 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50"
            style={{ background: 'var(--apya-negative-500)' }}>
            {busy ? <i className="fa fa-spinner fa-spin me-1" /> : null}{confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Sol rail: klasör ağacı ────────────────────────────────────────────*/
function TreeNode({ node, depth, activeId, expanded, onToggle, onSelect }) {
  const hasChildren = node.children.length > 0;
  const isOpen = expanded.has(node.id);
  return (
    <div>
      <div
        onClick={() => onSelect(node.id)}
        className={cn(
          'flex items-center gap-1.5 h-8 pr-2 rounded-lg cursor-pointer text-[12.5px] transition-colors',
          activeId === node.id
            ? 'bg-[var(--apya-accent-soft)] text-[var(--apya-accent-500)] font-semibold'
            : 'text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)]',
        )}
        style={{ paddingLeft: 8 + depth * 16 }}
      >
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); if (hasChildren) onToggle(node.id); }}
          className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-[var(--apya-text-tertiary)]"
        >
          {hasChildren && <i className={`fa fa-chevron-${isOpen ? 'down' : 'right'}`} style={{ fontSize: 9 }} />}
        </button>
        <span className="flex-shrink-0">{node.icon || (hasChildren ? '📁' : '📄')}</span>
        <span className="truncate">{node.title}</span>
      </div>
      {hasChildren && isOpen && (
        <div>
          {node.children.map((c) => (
            <TreeNode key={c.id} node={c} depth={depth + 1} activeId={activeId} expanded={expanded} onToggle={onToggle} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Orta alan: grid kartı ─────────────────────────────────────────────*/
function GridCard({ item, selected, onClick }) {
  const isFile = item.kind === 'file';
  const visual = isFile ? fileVisual(item.contentType, item.fileName) : null;
  return (
    <button type="button" onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-2 p-3.5 rounded-xl border text-left transition-colors w-full',
        selected ? 'border-[var(--apya-accent-500)] bg-[var(--apya-accent-soft)]' : 'border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] hover:bg-[var(--apya-border-subtle)]',
      )}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
        style={{ background: isFile ? `${visual.color}1a` : 'var(--apya-accent-soft)', color: isFile ? visual.color : 'var(--apya-accent-500)' }}>
        {isFile ? <i className={`fa ${visual.icon}`} /> : <span>{item.icon || (item.hasChildren ? '📁' : '📄')}</span>}
      </div>
      <div className="min-w-0 w-full">
        <div className="text-[12.5px] font-semibold text-[var(--apya-text-primary)] truncate">{isFile ? item.fileName : item.title}</div>
        <div className="text-[10.5px] text-[var(--apya-text-tertiary)] mt-0.5">
          {isFile ? fmt.size(item.fileSize) : (item.hasChildren ? 'Klasör' : 'Sayfa')} · {fmt.date(item.creationTime)}
        </div>
      </div>
    </button>
  );
}

/* ─── Sağ rail: detay paneli ────────────────────────────────────────────*/
function DetailPanel({ item, onEdit, onDelete, onOpen }) {
  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6" style={{ color: 'var(--apya-text-tertiary)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'var(--apya-border-subtle)' }}>
          <i className="fa fa-file-lines text-xl" />
        </div>
        <div className="text-xs">Bir dosya veya belge seçin</div>
      </div>
    );
  }

  const isFile = item.kind === 'file';
  const visual = isFile ? fileVisual(item.contentType, item.fileName) : null;

  return (
    <div className="p-5 flex flex-col h-full">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
        style={{ background: isFile ? `${visual.color}1a` : 'var(--apya-accent-soft)', color: isFile ? visual.color : 'var(--apya-accent-500)' }}>
        {isFile ? <i className={`fa ${visual.icon}`} /> : <span>{item.icon || '📄'}</span>}
      </div>
      <div className="text-sm font-semibold text-[var(--apya-text-primary)] text-center break-words mb-4">
        {isFile ? item.fileName : item.title}
      </div>

      <div className="space-y-2.5 text-xs flex-1">
        <div className="flex justify-between"><span className="text-[var(--apya-text-tertiary)]">Tür</span>
          <span className="font-semibold text-[var(--apya-text-primary)]">{isFile ? (item.fileName.split('.').pop()?.toUpperCase() || '—') : (item.hasChildren ? 'Klasör' : 'Sayfa')}</span></div>
        {isFile && <div className="flex justify-between"><span className="text-[var(--apya-text-tertiary)]">Boyut</span>
          <span className="font-semibold text-[var(--apya-text-primary)]">{fmt.size(item.fileSize)}</span></div>}
        <div className="flex justify-between"><span className="text-[var(--apya-text-tertiary)]">Yükleyen</span>
          <span className="font-semibold text-[var(--apya-text-primary)]">{isFile ? (item.uploaderName || 'Sistem') : '—'}</span></div>
        <div className="flex justify-between"><span className="text-[var(--apya-text-tertiary)]">Tarih</span>
          <span className="font-semibold text-[var(--apya-text-primary)]">{fmt.date(item.creationTime)}</span></div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {isFile ? (
          <a href={item.downloadUrl} target="_blank" rel="noreferrer"
            className="h-9 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-colors"
            style={{ background: 'var(--apya-accent-500)' }}>
            <i className="fa fa-download" /> İndir
          </a>
        ) : (
          <>
            <button type="button" onClick={() => onOpen(item)}
              className="h-9 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-colors"
              style={{ background: 'var(--apya-accent-500)' }}>
              <i className="fa fa-folder-open" /> Aç
            </button>
            <button type="button" onClick={() => onEdit(item)}
              className="h-9 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] flex items-center justify-center gap-2 hover:bg-[var(--apya-border-subtle)] transition-colors">
              <i className="fa fa-pencil" /> Düzenle
            </button>
          </>
        )}
        <button type="button" onClick={() => onDelete(item)}
          className="h-9 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-negative-500)] flex items-center justify-center gap-2 hover:bg-[var(--apya-border-subtle)] transition-colors">
          <i className="fa fa-trash" /> Sil
        </button>
      </div>
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
  const [expanded, setExpanded]       = useState(new Set());
  const [selected, setSelected]       = useState(null);
  const [viewMode, setViewMode]       = useState('grid');
  const [dragOver, setDragOver]       = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]             = useState(null);
  const fileInputRef = useRef(null);

  const flash = useCallback((msg) => setToast(msg), []);

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
      const items = await getAttachments(documentId);
      setAttachments(items ?? []);
    } catch (e) {
      console.error('[DocumentsIsland] loadAttachments error', e);
    } finally {
      setLoadingFolder(false);
    }
  }, []);

  useEffect(() => { loadTree(); }, [loadTree]);

  // Bir belge düzenlendikten sonra allDocs tazelenir; seçili detay panelini de senkron tut.
  useEffect(() => {
    setSelected((prev) => {
      if (!prev || prev.kind !== 'document') return prev;
      const fresh = allDocs.find((d) => d.id === prev.id);
      if (!fresh) return prev;
      return { ...fresh, kind: 'document', hasChildren: allDocs.some((x) => x.parentDocumentId === fresh.id) };
    });
  }, [allDocs]);
  useEffect(() => { loadAttachments(currentId); setSelected(null); }, [currentId, loadAttachments]);

  const tree = useMemo(() => {
    const byParent = new Map();
    allDocs.forEach((d) => {
      const key = d.parentDocumentId || 'root';
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(d);
    });
    const build = (parentKey) => (byParent.get(parentKey) || []).map((d) => ({ ...d, children: build(d.id) }));
    return build('root');
  }, [allDocs]);

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
  const gridItems = useMemo(
    () => [...children, ...attachments.map((a) => ({ ...a, kind: 'file' }))],
    [children, attachments],
  );

  const toggleExpand = (id) => setExpanded((s) => {
    const next = new Set(s);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const openFolder = (id) => {
    setCurrentId(id);
    if (id) setExpanded((s) => new Set(s).add(id));
  };

  const handleUpload = async (files) => {
    if (!currentId || !files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const dto = await uploadAttachment(currentId, file);
        setAttachments((prev) => [dto, ...prev]);
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
    <div className="apya-fade-in px-7 py-7 max-w-[1560px] mx-auto"
      onDragOver={(e) => { if (currentId) { e.preventDefault(); setDragOver(true); } }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); if (currentId) handleUpload(e.dataTransfer.files); }}>

      {/* Başlık */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--apya-text-primary)] m-0">Dokümanlar</h1>
          <p className="mt-1 text-xs text-[var(--apya-text-tertiary)] m-0">Klasörler ve dosya yönetimi</p>
        </div>
        {canCreate && (
          <button type="button" onClick={openCreate}
            className="h-9 px-3.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 hover:opacity-90 transition-colors"
            style={{ background: 'var(--apya-accent-500)' }}>
            <i className="fa fa-plus" /> Yeni Belge
          </button>
        )}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '260px 1fr 300px', alignItems: 'start' }}>
        {/* Sol: klasör ağacı */}
        <div className="rounded-2xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] p-2"
          style={{ boxShadow: 'var(--apya-shadow-sm)', maxHeight: 640, overflowY: 'auto' }}>
          <div
            onClick={() => openFolder(null)}
            className={cn(
              'flex items-center gap-2 h-8 px-2 rounded-lg cursor-pointer text-[12.5px] font-semibold mb-1 transition-colors',
              currentId === null ? 'bg-[var(--apya-accent-soft)] text-[var(--apya-accent-500)]' : 'text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)]',
            )}>
            <i className="fa fa-folder-tree" style={{ fontSize: 12 }} />
            Tüm Dokümanlar
          </div>
          {loadingTree ? (
            <div className="space-y-2 p-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h={20} />)}</div>
          ) : tree.length === 0 ? (
            <div className="text-[11px] text-[var(--apya-text-tertiary)] text-center py-6 px-2">Henüz klasör/belge yok.</div>
          ) : (
            tree.map((node) => (
              <TreeNode key={node.id} node={node} depth={0} activeId={currentId} expanded={expanded} onToggle={toggleExpand} onSelect={openFolder} />
            ))
          )}
        </div>

        {/* Orta: grid */}
        <div className="rounded-2xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] overflow-hidden"
          style={{ boxShadow: 'var(--apya-shadow-sm)', minHeight: 460 }}>
          {/* Araç çubuğu + breadcrumb */}
          <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-3 border-b border-[var(--apya-border-subtle)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--apya-text-tertiary)] min-w-0">
              <span className={cn('cursor-pointer hover:text-[var(--apya-text-primary)]', currentId === null && 'text-[var(--apya-text-primary)] font-semibold')} onClick={() => openFolder(null)}>Tüm Dokümanlar</span>
              {breadcrumb.map((d) => (
                <span key={d.id} className="flex items-center gap-1.5 min-w-0">
                  <i className="fa fa-chevron-right" style={{ fontSize: 8 }} />
                  <span className={cn('cursor-pointer hover:text-[var(--apya-text-primary)] truncate', d.id === currentId && 'text-[var(--apya-text-primary)] font-semibold')} onClick={() => openFolder(d.id)}>{d.title}</span>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-[var(--apya-border-default)] overflow-hidden">
                <button type="button" onClick={() => setViewMode('grid')} className={cn('w-7 h-7 flex items-center justify-center text-xs', viewMode === 'grid' ? 'bg-[var(--apya-accent-soft)] text-[var(--apya-accent-500)]' : 'text-[var(--apya-text-tertiary)]')}><i className="fa fa-grip" /></button>
                <button type="button" onClick={() => setViewMode('list')} className={cn('w-7 h-7 flex items-center justify-center text-xs', viewMode === 'list' ? 'bg-[var(--apya-accent-soft)] text-[var(--apya-accent-500)]' : 'text-[var(--apya-text-tertiary)]')}><i className="fa fa-list" /></button>
              </div>
              {currentId && (
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="h-8 px-3 rounded-lg text-xs font-semibold text-white flex items-center gap-2 hover:opacity-90 transition-colors disabled:opacity-50"
                  style={{ background: 'var(--apya-accent-500)' }}>
                  {uploading ? <i className="fa fa-spinner fa-spin" /> : <i className="fa fa-upload" />} Yükle
                </button>
              )}
              <input ref={fileInputRef} type="file" multiple hidden onChange={(e) => { handleUpload(e.target.files); e.target.value = ''; }} />
            </div>
          </div>

          {/* İçerik */}
          <div className="p-4 relative" style={{ minHeight: 380 }}>
            {dragOver && (
              <div className="absolute inset-2 z-10 rounded-xl border-2 border-dashed flex items-center justify-center text-sm font-semibold"
                style={{ borderColor: 'var(--apya-accent-500)', background: 'var(--apya-accent-soft)', color: 'var(--apya-accent-500)' }}>
                Yüklemek için bırakın
              </div>
            )}
            {!currentId && (
              <div className="mb-4 rounded-xl border border-dashed border-[var(--apya-border-default)] p-3 text-[11px] text-[var(--apya-text-tertiary)] flex items-center gap-2">
                <i className="fa fa-circle-info" /> Dosya yükleyebilmek için önce bir klasör/belge açın.
              </div>
            )}
            {loadingFolder ? (
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h={84} r={12} />)}
              </div>
            ) : gridItems.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-14 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]">
                  <i className="fa fa-inbox text-2xl" />
                </div>
                <div className="text-sm font-semibold text-[var(--apya-text-primary)]">Burada henüz bir şey yok</div>
                <div className="text-xs text-[var(--apya-text-tertiary)] max-w-xs">
                  {currentId ? 'Dosya sürükleyip bırakın ya da "Yükle" butonunu kullanın.' : '"Yeni Belge" ile ilk klasörünüzü oluşturun.'}
                </div>
              </div>
            ) : (
              <div className="grid gap-3" style={{ gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(140px, 1fr))' : '1fr' }}>
                {gridItems.map((item) => (
                  <GridCard key={`${item.kind}-${item.id}`} item={item} selected={selected?.id === item.id}
                    onClick={() => setSelected(item)} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sağ: detay paneli */}
        <div className="rounded-2xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)]"
          style={{ boxShadow: 'var(--apya-shadow-sm)', minHeight: 460 }}>
          <DetailPanel item={selected} onEdit={openEdit} onOpen={(d) => openFolder(d.id)} onDelete={setDeleteTarget} />
        </div>
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
