import React from 'react';
import { Badge, Button, EmptyState, Skeleton } from '../../components/ui';
import { cn, fmt, fileVisual, STATUS_META, tagChipClass } from '../format';

/**
 * Orta panel: liste (tablo) ve grid görünümü + toplu işlem şeridi.
 *
 * Satır yüksekliği var(--row-h) — yoğunluk anahtarı (data-density) otomatik uygular.
 * Sıralama sunucu tarafında; başlığa tıklamak `sorting` string'ini değiştirir.
 */

const COLUMNS = [
  { key: 'displayName', label: 'Belge', sortable: true, width: 'minmax(0,1fr)' },
  { key: 'workStep', label: 'İş adımı', sortable: false, width: '140px' },
  { key: 'type', label: 'Tür', sortable: false, width: '96px' },
  { key: 'amount', label: 'Tutar', sortable: true, width: '116px', align: 'right' },
  { key: 'documentDate', label: 'Tarih', sortable: true, width: '96px' },
  { key: 'status', label: 'Durum', sortable: false, width: '110px' },
];

const GRID_TEMPLATE = `34px ${COLUMNS.map((c) => c.width).join(' ')}`;

function SortHeader({ column, sorting, onSort }) {
  if (!column.sortable) {
    return <span style={{ textAlign: column.align || 'left' }}>{column.label}</span>;
  }

  const [field, dir] = (sorting || '').split(' ');
  const active = field === column.key;
  const nextDir = active && dir !== 'desc' ? 'desc' : 'asc';

  return (
    <button
      type="button"
      onClick={() => onSort(`${column.key} ${nextDir}`)}
      className="d-flex align-items-center gap-1"
      style={{
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        font: 'inherit', color: active ? 'var(--apya-accent-500)' : 'inherit',
        justifyContent: column.align === 'right' ? 'flex-end' : 'flex-start',
        width: '100%',
      }}
      aria-sort={active ? (dir === 'desc' ? 'descending' : 'ascending') : 'none'}
    >
      {column.label}
      <i
        className={`fa fa-${active ? (dir === 'desc' ? 'arrow-down' : 'arrow-up') : 'arrows-up-down'}`}
        style={{ fontSize: 8, opacity: active ? 1 : 0.4 }}
      />
    </button>
  );
}

/**
 * Kontrol listesinde karşılığı olmayan zorunlu kalem — dosya listesinin İÇİNDE,
 * kesikli çerçeveyle gösterilir. "Eksik olan" da bir liste satırıdır: ayrı bir
 * sekmeye saklanırsa yükleme akışından kopar.
 *
 * Satırlar listenin BAŞINDA durur, aralara serpiştirilmez: dosya listesi sunucuda
 * sayfalanıyor, eksikler ise sayfalama dışı — araya karıştırılsa 2. sayfada
 * kaybolurlardı.
 */
function MissingRow({ item, onUpload, canUpload }) {
  const scopeLabel = item.workStepName
    ? `${item.workStepOrder} · ${item.workStepName}`
    : item.periodCode || 'Proje';

  return (
    <div className="apya-doc-row apya-doc-missing-row" style={{ gridTemplateColumns: GRID_TEMPLATE }}>
      <span style={{ color: 'var(--apya-warning-600, #B45309)', textAlign: 'center', fontWeight: 700, fontSize: 12 }}>!</span>

      <span className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
        <span
          className="d-grid place-items-center flex-shrink-0"
          style={{
            width: 26, height: 26, borderRadius: 7, fontSize: 11,
            border: '1px dashed var(--apya-border-default)', color: 'var(--apya-text-tertiary)',
          }}
        >
          <i className="fa fa-plus" />
        </span>
        <span className="text-truncate" style={{ fontSize: 13, fontWeight: 500, color: 'var(--apya-warning-700, #92400E)' }}>
          Eksik: {item.title}
        </span>
        {item.isBlocking && <Badge variant="warning" size="sm">teslimi bloke ediyor</Badge>}
      </span>

      <span className="text-truncate" style={{ fontSize: 12, color: 'var(--apya-warning-700, #92400E)' }}>{scopeLabel}</span>

      <span className="text-truncate" style={{ fontSize: 12, color: 'var(--apya-warning-700, #92400E)' }}>
        {item.documentTypeName || '—'}
      </span>

      <span className="apya-numeric" style={{ fontSize: 12, textAlign: 'right', color: 'var(--apya-text-tertiary)' }}>—</span>

      <span style={{ fontSize: 11.5, color: 'var(--apya-warning-700, #92400E)' }}>bekliyor</span>

      <span>
        {canUpload ? (
          <button type="button" className="apya-doc-missing-upload" onClick={() => onUpload(item)}>
            <i className="fa fa-upload" /> Yükle
          </button>
        ) : (
          <span className="apya-chip apya-chip-warning">Eksik</span>
        )}
      </span>
    </div>
  );
}

function FileRow({ file, selected, checked, onSelect, onToggleCheck, onDragStart }) {
  const visual = fileVisual(file.contentType, file.fileName);
  const status = STATUS_META[file.status] || STATUS_META[1];

  return (
    <div
      draggable
      onDragStart={() => onDragStart(file)}
      onClick={() => onSelect(file)}
      className={cn('apya-doc-row', selected && 'is-selected')}
      style={{ gridTemplateColumns: GRID_TEMPLATE }}
    >
      <span onClick={(e) => { e.stopPropagation(); onToggleCheck(file.id); }} style={{ cursor: 'pointer' }}>
        <i
          className={`fa fa-${checked ? 'square-check' : 'square'}`}
          style={{ fontSize: 13, color: checked ? 'var(--apya-accent-500)' : 'var(--apya-text-tertiary)' }}
          role="checkbox"
          aria-checked={checked}
        />
      </span>

      <span className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
        <span
          className="d-grid place-items-center flex-shrink-0"
          style={{ width: 26, height: 26, borderRadius: 7, background: `${visual.color}1a`, color: visual.color, fontSize: 11 }}
        >
          <i className={`fa ${visual.icon}`} />
        </span>
        <span className="text-truncate" style={{ fontSize: 13, fontWeight: 500 }}>{file.displayName}</span>
        {file.versionCount > 1 && <Badge variant="brand" size="sm">v{file.versionCount}</Badge>}
        {file.isLocked && <i className="fa fa-lock" style={{ fontSize: 10, color: 'var(--apya-text-tertiary)' }} title="Kilitli" />}
      </span>

      <span className="text-truncate" style={{ fontSize: 12, color: 'var(--apya-text-secondary)' }}>
        {file.workStepName ? `${file.workStepOrder} · ${file.workStepName}` : '—'}
      </span>

      <span className="text-truncate" style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
        {file.documentTypeName || '—'}
      </span>

      <span className="apya-numeric" style={{ fontSize: 12, textAlign: 'right' }}>
        {fmt.money(file.amount, file.currency)}
      </span>

      <span className="apya-numeric" style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
        {fmt.date(file.documentDate || file.creationTime)}
      </span>

      <span>
        <span className={cn('apya-chip', status.chip)}>{status.text}</span>
      </span>
    </div>
  );
}

function FileCard({ file, selected, onSelect, onDragStart }) {
  const visual = fileVisual(file.contentType, file.fileName);
  const status = STATUS_META[file.status] || STATUS_META[1];

  return (
    <button
      type="button"
      draggable
      onDragStart={() => onDragStart(file)}
      onClick={() => onSelect(file)}
      className="apya-tile"
      style={{
        textAlign: 'left',
        cursor: 'pointer',
        ...(selected ? { borderColor: 'var(--apya-accent-500)', background: 'var(--apya-accent-soft)' } : {}),
      }}
    >
      <div className="apya-tile-head">
        <div className="d-flex align-items-start gap-2" style={{ minWidth: 0 }}>
          <span className="apya-tile-icon-box" style={{ background: `${visual.color}1a`, color: visual.color }}>
            <i className={`fa ${visual.icon}`} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div className="apya-tile-title">{file.displayName}</div>
            <div className="apya-tile-sub">{file.documentTypeName || 'Sınıflandırılmamış'}</div>
          </div>
        </div>
        {file.versionCount > 1 && <Badge variant="brand" size="sm">v{file.versionCount}</Badge>}
      </div>

      <div className="apya-tile-foot" style={{ borderTop: 'none', paddingTop: 0 }}>
        <span className={cn('apya-chip', status.chip)}>{status.text}</span>
        {file.amount !== null && file.amount !== undefined && (
          <span className="apya-numeric" style={{ fontSize: 11.5 }}>{fmt.money(file.amount, file.currency)}</span>
        )}
      </div>

      <div className="apya-tile-foot">
        <span className="text-truncate">{file.uploaderName || 'Sistem'}</span>
        <span className="apya-numeric">{fmt.date(file.documentDate || file.creationTime)}</span>
      </div>
    </button>
  );
}

export function FileList({
  loading, files, totalCount, view, sorting, onSort,
  selectedId, onSelect, checkedIds, onToggleCheck, onToggleAll,
  page, pageSize, onPageChange, onDragStart, emptyHint,
  missingItems = [], onUploadMissing, canUpload = false,
}) {
  const allChecked = files.length > 0 && files.every((f) => checkedIds.has(f.id));
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  // Eksik kalemler yalnız listenin ilk sayfasında; ikinci sayfada tekrar
  // basmak "her sayfada aynı eksikler" gibi yanlış bir izlenim verirdi.
  const missing = page === 0 && view === 'list' ? missingItems : [];

  if (loading) {
    return view === 'grid'
      ? <div className="apya-tile-grid p-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={120} rounded="lg" />)}</div>
      : <div className="p-3 d-flex flex-column gap-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} height={40} rounded="md" />)}</div>;
  }

  // Klasör boş ama eksik kalem varsa boş durum BASILMAZ — "burada bir şey yok"
  // demek, yüklenmesi gereken belgeler dururken yanlış olur.
  if (files.length === 0 && missing.length === 0) {
    return (
      <EmptyState
        icon={<i className="fa fa-inbox" />}
        title="Burada henüz belge yok"
        description={emptyHint}
      />
    );
  }

  return (
    <>
      {view === 'grid' ? (
        <div className="apya-tile-grid p-3">
          {files.map((file) => (
            <FileCard
              key={file.id} file={file} selected={selectedId === file.id}
              onSelect={onSelect} onDragStart={onDragStart}
            />
          ))}
        </div>
      ) : (
        <div>
          <div className="apya-doc-row apya-doc-row-head" style={{ gridTemplateColumns: GRID_TEMPLATE }}>
            <span onClick={onToggleAll} style={{ cursor: 'pointer' }}>
              <i
                className={`fa fa-${allChecked ? 'square-check' : 'square'}`}
                style={{ fontSize: 13, color: allChecked ? 'var(--apya-accent-500)' : 'var(--apya-text-tertiary)' }}
                role="checkbox"
                aria-checked={allChecked}
              />
            </span>
            {COLUMNS.map((column) => (
              <SortHeader key={column.key} column={column} sorting={sorting} onSort={onSort} />
            ))}
          </div>

          {missing.map((item) => (
            <MissingRow
              key={`missing-${item.assignmentId}-${item.requirementId}-${item.workStepId || 'none'}`}
              item={item}
              onUpload={onUploadMissing}
              canUpload={canUpload}
            />
          ))}

          {files.map((file) => (
            <FileRow
              key={file.id} file={file}
              selected={selectedId === file.id}
              checked={checkedIds.has(file.id)}
              onSelect={onSelect}
              onToggleCheck={onToggleCheck}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div
          className="d-flex align-items-center justify-content-between px-3 py-2"
          style={{ borderTop: '1px solid var(--apya-border-subtle)' }}
        >
          <span className="apya-numeric" style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, totalCount)} / {totalCount}
          </span>
          <div className="d-flex align-items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
              <i className="fa fa-chevron-left" />
            </Button>
            <span className="apya-numeric" style={{ fontSize: 11.5 }}>{page + 1} / {pageCount}</span>
            <Button variant="outline" size="sm" disabled={page + 1 >= pageCount} onClick={() => onPageChange(page + 1)}>
              <i className="fa fa-chevron-right" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

/** Seçim varken görünen koyu şerit — toplu taşıma/etiketleme. */
export function BulkBar({ count, onClear, onMove, onTag, busy }) {
  if (count === 0) return null;

  return (
    <div className="apya-doc-bulkbar">
      <span style={{ fontSize: 12.5, fontWeight: 600 }}>{count} belge seçildi</span>
      <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,.18)' }} />
      <button type="button" className="apya-doc-bulkbar-action" onClick={onMove} disabled={busy}>
        <i className="fa fa-folder-open" /> Taşı
      </button>
      <button type="button" className="apya-doc-bulkbar-action" onClick={onTag} disabled={busy}>
        <i className="fa fa-tag" /> Etiketle
      </button>
      <div style={{ flex: 1 }} />
      <button type="button" className="apya-doc-bulkbar-action" onClick={onClear}>Vazgeç</button>
    </div>
  );
}

/** Etiket rozetleri — detay panelinde ve kartlarda ortak. */
export function TagChips({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="d-flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span key={tag} className={cn('apya-chip', tagChipClass(tag))}>{tag}</span>
      ))}
    </div>
  );
}
