import React, { useState } from 'react';
import { Badge, Button } from '../../components/ui';
import { cn } from '../format';

/**
 * Öneri şeridi.
 *
 * Öneriler kural motorunun planından ve harcama eşleşme skorlarından üretilir —
 * ayrı bir tahmin katmanı yok. Hiçbiri KENDİLİĞİNDEN uygulanmaz: şerit sayıyı
 * söyler, kullanıcı inceleyip onaylar. Otomatik davranış isteyen kullanıcı
 * kuralı açar; o zaman sorumluluk açıkça kuralda olur.
 */

const KIND_LABEL = {
  1: 'klasör',
  2: 'belge tipi',
  3: 'iş adımı',
  4: 'dönem',
  5: 'harcama kalemi',
};

function confidenceTone(confidence) {
  if (confidence >= 90) return 'positive';
  if (confidence >= 70) return 'brand';
  return 'warning';
}

export function SuggestionBanner({ summary, busy, onApplyAll, onApply, onDismiss, onReload }) {
  const [open, setOpen] = useState(false);

  const items = summary?.items ?? [];
  if (items.length === 0) return null;

  const kinds = [...new Set(items.map((i) => KIND_LABEL[i.kind]).filter(Boolean))];

  return (
    <div className="apya-doc-suggestion-banner">
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <span className="apya-doc-suggestion-icon"><i className="fa fa-wand-magic-sparkles" /></span>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>
            {summary.documentCount} dosya için {kinds.join(', ')} önerisi hazır
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
            Kural motoru ve harcama eşleşmesinden üretildi — uygulanmadan önce onayınızı bekler.
          </div>
        </div>

        <div className="flex-grow-1" />

        <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? 'Gizle' : 'İncele'}
        </Button>
        <Button size="sm" isLoading={busy} onClick={onApplyAll}>
          Tümünü uygula
        </Button>
      </div>

      {open && (
        <div className="apya-doc-suggestion-list">
          {items.map((item) => (
            <div
              key={`${item.documentFileId}-${item.kind}-${item.payload}`}
              className="apya-doc-suggestion-row"
            >
              <span className="text-truncate" style={{ fontSize: 12.5, minWidth: 0 }}>
                {item.documentFileName}
              </span>

              <span className="text-truncate" style={{ fontSize: 12, color: 'var(--apya-text-secondary)' }}>
                {KIND_LABEL[item.kind]} → <strong>{item.targetName || item.payload}</strong>
              </span>

              <span className="text-truncate" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
                {item.reason}
              </span>

              <Badge variant={confidenceTone(item.confidence)} size="sm">%{item.confidence}</Badge>

              <span className="d-flex gap-2 justify-content-end">
                <button
                  type="button" className="apya-doc-linkbtn" disabled={busy}
                  onClick={() => onApply(item)}
                >
                  Uygula
                </button>
                <button
                  type="button" className="apya-doc-linkbtn" disabled={busy}
                  onClick={() => onDismiss(item)}
                  title="Bu öneri bir daha gösterilmez"
                >
                  Yoksay
                </button>
              </span>
            </div>
          ))}

          <button type="button" className={cn('apya-doc-linkbtn', 'mt-1')} onClick={onReload}>
            Yenile
          </button>
        </div>
      )}
    </div>
  );
}
