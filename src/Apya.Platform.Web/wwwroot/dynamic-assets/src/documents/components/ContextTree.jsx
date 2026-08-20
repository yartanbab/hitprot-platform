import React from 'react';
import { SkeletonList } from '../../components/ui';
import { cn } from '../format';

/**
 * Sol bağlam ağacı: gerçek klasör hiyerarşisi (ParentDocumentId) + proje altında
 * iş adımları + akıllı klasörler (kayıtlı filtre).
 *
 * Sürükle-bırak: satır (belge) bir klasör düğümünün üzerine bırakılınca taşınır.
 * onDropFiles(targetDocumentId) çağrılır; taşınan id'ler sürükleyen tarafta tutulur.
 */

const SMART_FOLDERS = [
  { key: 'expiring', label: 'Süresi dolanlar', icon: 'fa-clock-rotate-left' },
  { key: 'missing-meta', label: 'Eksik meta', icon: 'fa-triangle-exclamation' },
  { key: 'trash', label: 'Çöp kutusu', icon: 'fa-trash-can' },
];

function TreeRow({
  node, depth, activeKey, expanded, onToggle, onSelect, onDropFiles, dragTarget, setDragTarget,
}) {
  const hasChildren = node.children?.length > 0;
  const isOpen = expanded.has(node.key);
  const isDropTarget = dragTarget === node.documentId && node.documentId;

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(node)}
        onDragOver={(e) => { if (node.documentId) { e.preventDefault(); setDragTarget(node.documentId); } }}
        onDragLeave={() => setDragTarget(null)}
        onDrop={(e) => {
          if (!node.documentId) return;
          e.preventDefault();
          setDragTarget(null);
          onDropFiles(node.documentId);
        }}
        className={cn('apya-md-item', activeKey === node.key && 'selected')}
        style={{
          paddingLeft: 10 + depth * 14,
          borderRadius: 8,
          ...(isDropTarget
            ? { outline: '2px dashed var(--apya-accent-500)', background: 'var(--apya-accent-soft)' }
            : {}),
        }}
      >
        <span
          role="button"
          tabIndex={-1}
          onClick={(e) => { e.stopPropagation(); if (hasChildren) onToggle(node.key); }}
          className="w-3 flex-shrink-0"
          style={{ color: 'var(--apya-text-tertiary)' }}
        >
          {hasChildren && <i className={`fa fa-chevron-${isOpen ? 'down' : 'right'}`} style={{ fontSize: 9 }} />}
        </span>
        <i className={`fa ${node.icon}`} style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }} />
        <span className="apya-md-item-title">{node.label}</span>
        {typeof node.count === 'number' && (
          <span className="apya-md-item-side apya-numeric" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
            {node.count}
          </span>
        )}
      </button>
      {hasChildren && isOpen && node.children.map((child) => (
        <TreeRow
          key={child.key} node={child} depth={depth + 1} activeKey={activeKey}
          expanded={expanded} onToggle={onToggle} onSelect={onSelect}
          onDropFiles={onDropFiles} dragTarget={dragTarget} setDragTarget={setDragTarget}
        />
      ))}
    </div>
  );
}

export function ContextTree({
  loading, tree, activeKey, expanded, onToggle, onSelect, onDropFiles, dragTarget, setDragTarget,
}) {
  return (
    <div className="apya-docs-tree">
      <div className="apya-md-overline" style={{ padding: '4px 8px 6px' }}>Bağlam</div>

      <button
        type="button"
        onClick={() => onSelect({ key: 'all', kind: 'all' })}
        className={cn('apya-md-item', activeKey === 'all' && 'selected')}
        style={{ borderRadius: 8 }}
      >
        <span className="w-3 flex-shrink-0" />
        <i className="fa fa-folder-tree" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }} />
        <span className="apya-md-item-title" style={{ fontWeight: 600 }}>Tüm Dokümanlar</span>
      </button>

      {loading ? (
        <div className="p-2"><SkeletonList rows={5} /></div>
      ) : tree.length === 0 ? (
        <div className="text-[11px] text-center py-5 px-2" style={{ color: 'var(--apya-text-tertiary)' }}>
          Henüz klasör yok.
        </div>
      ) : tree.map((node) => (
        <TreeRow
          key={node.key} node={node} depth={0} activeKey={activeKey}
          expanded={expanded} onToggle={onToggle} onSelect={onSelect}
          onDropFiles={onDropFiles} dragTarget={dragTarget} setDragTarget={setDragTarget}
        />
      ))}

      <div style={{ height: 1, background: 'var(--apya-border-subtle)', margin: '8px 4px' }} />
      <div className="apya-md-overline" style={{ padding: '0 8px 6px' }}>Akıllı klasörler</div>

      {SMART_FOLDERS.map((folder) => (
        <button
          key={folder.key}
          type="button"
          onClick={() => onSelect({ key: folder.key, kind: 'smart', smart: folder.key })}
          className={cn('apya-md-item', activeKey === folder.key && 'selected')}
          style={{ borderRadius: 8 }}
        >
          <span className="w-3 flex-shrink-0" />
          <i className={`fa ${folder.icon}`} style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }} />
          <span className="apya-md-item-title">{folder.label}</span>
        </button>
      ))}
    </div>
  );
}
