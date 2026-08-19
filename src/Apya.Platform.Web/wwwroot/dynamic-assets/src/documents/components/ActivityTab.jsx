import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, EmptyState, SkeletonList } from '../../components/ui';
import { abpNotify, getActivity } from '../api';
import { ACCESS_ACTION_LABEL, cn, fmt } from '../format';

/**
 * Etkinlik sekmesi — değiştirilemez denetim izi.
 *
 * Sıralama sunucuda sabittir (en yeniden eskiye) ve istemciden değiştirilemez:
 * denetim izinde "sıralamayı ben seçtim" diye bir şey yok.
 * Liste render'ı loglanmaz; iz yalnız bilinçli erişimlerde büyür.
 */

const PAGE_SIZE = 25;

const ACTION_TONE = {
  1: 'apya-chip-brand',     // Yüklendi
  2: 'apya-chip-positive',  // İndirildi
  3: 'apya-chip-negative',  // Silindi
  4: 'apya-chip-neutral',   // Görüntülendi
  5: 'apya-chip-accent',    // Meta değişti
  6: 'apya-chip-warning',   // Taşındı
};

const FILTERS = [
  { value: '', label: 'Tümü' },
  { value: '1', label: 'Yüklendi' },
  { value: '2', label: 'İndirildi' },
  { value: '5', label: 'Meta değişti' },
  { value: '3', label: 'Silindi' },
];

export function ActivityTab({ projectId, documentFileId }) {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getActivity({
        maxResultCount: PAGE_SIZE,
        skipCount: page * PAGE_SIZE,
        projectId: projectId || undefined,
        documentFileId: documentFileId || undefined,
        action: action || undefined,
      });
      setRows(result.items ?? []);
      setTotalCount(result.totalCount ?? 0);
    } catch (e) {
      abpNotify('error', 'Etkinlik kaydı yüklenemedi.');
      console.error('[Documents] activity load', e);
    } finally {
      setLoading(false);
    }
  }, [projectId, documentFileId, action, page]);

  useEffect(() => { load(); }, [load]);

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="d-flex flex-column">
      <div
        className="d-flex align-items-center gap-2 flex-wrap px-3 py-2"
        style={{ borderBottom: '1px solid var(--apya-border-subtle)' }}
      >
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={cn('apya-doc-filterchip', action === filter.value && 'is-active')}
            onClick={() => { setAction(filter.value); setPage(0); }}
          >
            {filter.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span className="apya-numeric" style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
          {totalCount} kayıt
        </span>
      </div>

      {loading ? (
        <div className="p-3"><SkeletonList rows={8} /></div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<i className="fa fa-clock-rotate-left" />}
          title="Henüz kayıtlı etkinlik yok"
          description="Yükleme, indirme, meta değişikliği ve silme işlemleri burada iz bırakır."
        />
      ) : (
        <div>
          {rows.map((row) => (
            <div key={row.id} className="apya-doc-activity-row">
              <span className={cn('apya-chip', ACTION_TONE[row.action] || 'apya-chip-neutral')}>
                {ACCESS_ACTION_LABEL[row.action] || '—'}
              </span>

              <span style={{ minWidth: 0 }}>
                <span className="d-block text-truncate" style={{ fontSize: 12.5 }}>
                  {row.documentFileName || row.folderName || '—'}
                </span>
                {row.detail && (
                  <span className="d-block text-truncate" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
                    {row.detail}
                  </span>
                )}
              </span>

              <span className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                <span className="text-truncate" style={{ fontSize: 12 }}>{row.actorName}</span>
                {row.actorRole && <Badge variant="neutral" size="sm">{row.actorRole}</Badge>}
              </span>

              <span className="apya-numeric" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)', textAlign: 'right' }}>
                {fmt.dateTime(row.creationTime)}
              </span>
            </div>
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div
          className="d-flex align-items-center justify-content-between px-3 py-2"
          style={{ borderTop: '1px solid var(--apya-border-subtle)' }}
        >
          <span className="apya-numeric" style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalCount)} / {totalCount}
          </span>
          <div className="d-flex align-items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <i className="fa fa-chevron-left" />
            </Button>
            <span className="apya-numeric" style={{ fontSize: 11.5 }}>{page + 1} / {pageCount}</span>
            <Button variant="outline" size="sm" disabled={page + 1 >= pageCount} onClick={() => setPage(page + 1)}>
              <i className="fa fa-chevron-right" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
