import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Button, EmptyState, SkeletonList } from '../components/ui';
import {
  ALLOWED_EXTENSIONS, abpAppPath, abpDocument, abpNotify, fmtSize,
  getDocumentTypes, setMeta, uploadFile, validate,
} from './api';

/**
 * Yükleme kuyruğu.
 *
 * Her dosya AYRI istek olarak gider: biri patlarsa kuyruk durmaz, yalnız hatalı
 * olan yeniden denenir. Aynı anda en fazla PARALLEL kadar istek açılır — 50
 * dosyayı aynı anda göndermek tarayıcıyı da sunucuyu da boğardı.
 *
 * Sunucu tarafında yeni bir iş kuyruğu YOK; mevcut tekil yükleme ucu kullanılır.
 * Aynı klasörde aynı adlı dosya sunucuda otomatik olarak yeni VERSİYON olur
 * (üzerine yazılmaz, eski sürüm geçmişte kalır).
 */

const PARALLEL = 3;

const STATUS = {
  queued: { label: 'sırada', variant: 'neutral' },
  uploading: { label: 'yükleniyor', variant: 'accent' },
  done: { label: 'tamam', variant: 'positive' },
  failed: { label: 'hata', variant: 'negative' },
  rejected: { label: 'reddedildi', variant: 'warning' },
};

let seq = 0;

export function UploadRoot() {
  const params = new URLSearchParams(window.location.search);

  const [folders, setFolders] = useState([]);
  const [types, setTypes] = useState([]);
  const [folderId, setFolderId] = useState((params.get('documentId') || '').toLowerCase());
  const [items, setItems] = useState([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [bulkTypeId, setBulkTypeId] = useState('');
  const [bulkPeriod, setBulkPeriod] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const [f, t] = await Promise.all([
          abpDocument().getList({ maxResultCount: 1000, sorting: 'title asc' }),
          getDocumentTypes(),
        ]);
        setFolders(f?.items ?? []);
        setTypes(t ?? []);
      } catch (e) {
        abpNotify('error', 'Klasörler yüklenemedi.');
        console.error('[Upload] load', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addFiles = useCallback((fileList) => {
    const added = Array.from(fileList).map((file) => {
      const reason = validate(file);
      return {
        key: `f${++seq}`,
        file,
        name: file.name,
        size: file.size,
        status: reason ? 'rejected' : 'queued',
        error: reason,
        percent: 0,
        documentFileId: null,
      };
    });

    setItems((prev) => [...prev, ...added]);

    const rejected = added.filter((a) => a.status === 'rejected').length;
    if (rejected > 0) {
      abpNotify('warn', `${rejected} dosya kabul edilmedi (tür veya boyut).`);
    }
  }, []);

  const patch = (key, changes) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...changes } : i)));

  /** Sırayı PARALLEL kadar eşzamanlı işçiyle tüketir. */
  const runQueue = async () => {
    if (!folderId) { abpNotify('warn', 'Önce hedef klasör seçin.'); return; }

    setRunning(true);

    const pending = items.filter((i) => i.status === 'queued' || i.status === 'failed');
    const queue = [...pending];

    const worker = async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (!item) return;

        patch(item.key, { status: 'uploading', percent: 0, error: null });

        try {
          const result = await uploadFile(folderId, item.file, {
            onProgress: (p) => patch(item.key, { percent: p }),
          });
          patch(item.key, {
            status: 'done',
            percent: 100,
            documentFileId: result?.documentFileId ?? null,
          });
        } catch (e) {
          patch(item.key, { status: 'failed', error: e.message });
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(PARALLEL, queue.length) }, worker));
    setRunning(false);
  };

  /** Yüklenen partiye toplu künye atar — kuyruğun asıl kazancı bu adım. */
  const applyBulkMeta = async () => {
    const done = items.filter((i) => i.status === 'done' && i.documentFileId);
    if (done.length === 0) return;

    setRunning(true);
    let ok = 0;

    for (const item of done) {
      try {
        await setMeta(item.documentFileId, {
          displayName: item.name,
          documentTypeId: bulkTypeId || null,
          periodCode: bulkPeriod || null,
        });
        ok++;
      } catch (e) {
        console.error('[Upload] setMeta', item.name, e);
      }
    }

    setRunning(false);
    abpNotify(ok === done.length ? 'success' : 'warn', `${ok}/${done.length} belgeye künye atandı.`);
  };

  const counts = useMemo(() => {
    const c = { queued: 0, uploading: 0, done: 0, failed: 0, rejected: 0 };
    items.forEach((i) => { c[i.status] = (c[i.status] ?? 0) + 1; });
    return c;
  }, [items]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  };

  if (loading) return <div className="p-4"><SkeletonList rows={6} /></div>;

  return (
    <div className="apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto" style={{ maxWidth: 1560 }}>
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Yükleme kuyruğu</h1>
          <p style={{ fontSize: 12, color: 'var(--apya-text-tertiary)', margin: '4px 0 0' }}>
            Dosyaları sürükleyin; sıra tek tek yükler, hatalı olanı tekrar denersiniz
          </p>
        </div>
        <a className="apya-doc-linkbtn" href={`${abpAppPath()}Documents`}>Dokümanlar'a dön</a>
      </div>

      <div className="apya-doc-uploadgrid">
        {/* Sol: hedef + bırakma alanı */}
        <div className="apya-doc-check-card">
          <div className="apya-md-overline">Hedef klasör</div>
          <select
            className="apya-doc-select w-100 mb-3"
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            aria-label="Hedef klasör"
          >
            <option value="">Klasör seçin…</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>

          <div
            className={`apya-doc-dropzone${dragOver ? ' is-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
          >
            <i className="fa fa-cloud-arrow-up" style={{ fontSize: 22, color: 'var(--apya-text-tertiary)' }} />
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>
              Dosyaları buraya bırakın
            </div>
            <div style={{ fontSize: 11, color: 'var(--apya-text-tertiary)', marginTop: 2 }}>
              veya tıklayıp seçin · en fazla 25 MB
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            accept={ALLOWED_EXTENSIONS.join(',')}
            onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
          />

          <div style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)', marginTop: 8 }}>
            Kabul edilen: {ALLOWED_EXTENSIONS.join(' ')}
          </div>

          {/* Yükleme sonrası toplu künye */}
          {counts.done > 0 && (
            <>
              <div className="apya-md-overline mt-3">Toplu künye ({counts.done} belge)</div>
              <select className="apya-doc-select w-100 mb-2" value={bulkTypeId}
                onChange={(e) => setBulkTypeId(e.target.value)} aria-label="Belge türü">
                <option value="">Tür seçin…</option>
                {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <input className="apya-doc-input w-100 mb-2" placeholder="Dönem (örn. 2026-Q1)"
                value={bulkPeriod} onChange={(e) => setBulkPeriod(e.target.value)} aria-label="Dönem kodu" />
              <Button variant="outline" size="sm" className="w-100"
                disabled={running || (!bulkTypeId && !bulkPeriod)} onClick={applyBulkMeta}>
                Yüklenenlere uygula
              </Button>
            </>
          )}
        </div>

        {/* Sağ: kuyruk */}
        <div className="apya-doc-check-card">
          <div className="apya-doc-check-head">
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>
              Sıra ({items.length})
            </span>
            <span className="d-flex align-items-center gap-2">
              {counts.done > 0 && <Badge variant="positive" size="sm">{counts.done} tamam</Badge>}
              {counts.failed > 0 && <Badge variant="negative" size="sm">{counts.failed} hata</Badge>}
              {items.length > 0 && (
                <button type="button" className="apya-doc-linkbtn" disabled={running}
                  onClick={() => setItems((p) => p.filter((i) => i.status !== 'done'))}>
                  Bitenleri temizle
                </button>
              )}
              <Button variant="primary" size="sm"
                disabled={running || !folderId || (counts.queued + counts.failed) === 0}
                onClick={runQueue}>
                {running ? 'Yükleniyor…' : `Yükle (${counts.queued + counts.failed})`}
              </Button>
            </span>
          </div>

          {items.length === 0 ? (
            <EmptyState icon={<i className="fa fa-inbox" />} title="Sıra boş"
              description="Soldaki alana dosya bırakarak başlayın." />
          ) : items.map((i) => {
            const s = STATUS[i.status];
            return (
              <div key={i.key} className="apya-doc-check-row"
                style={{ gridTemplateColumns: 'minmax(0,1fr) 80px 90px 60px' }}>
                <span style={{ minWidth: 0 }}>
                  <span className="d-block text-truncate" style={{ fontSize: 12.5 }}>{i.name}</span>
                  {i.error && (
                    <span className="d-block" style={{ fontSize: 10.5, color: 'var(--apya-negative-500)' }}>
                      {i.error}
                    </span>
                  )}
                  {i.status === 'uploading' && (
                    <span className="apya-doc-progress d-block mt-1" style={{ height: 3 }}>
                      <span style={{ display: 'block', width: `${i.percent}%`, height: '100%',
                        background: 'var(--apya-accent-500)' }} />
                    </span>
                  )}
                </span>
                <span className="apya-numeric" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
                  {fmtSize(i.size)}
                </span>
                <span><Badge variant={s.variant} size="sm">{s.label}</Badge></span>
                <span className="text-end">
                  {i.status !== 'uploading' && (
                    <button type="button" className="apya-doc-linkbtn" disabled={running}
                      onClick={() => setItems((p) => p.filter((x) => x.key !== i.key))}>
                      Kaldır
                    </button>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
