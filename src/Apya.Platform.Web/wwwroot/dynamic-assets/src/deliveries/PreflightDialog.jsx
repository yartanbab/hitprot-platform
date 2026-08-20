import React from 'react';
import { Badge, Button, ModalPortal, SkeletonList } from '../components/ui';

/**
 * Preflight modalı — "Paketi üret" öncesi son kontrol.
 *
 * Bloke bulgu varsa üretim düğmesi KAPALIDIR ve kullanıcı bunu geçemez.
 * Sunucu aynı kontrolü üretim çağrısında tekrar yapar; buradaki kapatma
 * yalnız kullanıcıya erken geri bildirimdir, güvenlik sınırı değildir.
 */

const KIND_LABEL = {
  1: 'Zorunlu kalem',
  2: 'Süresi dolmuş belge',
  3: 'Eksik meta',
  4: 'Gizli alan',
  5: 'Boş paket',
};

export function PreflightDialog({ result, loading, busy, onGenerate, onClose }) {
  const canGenerate = result?.canGenerate === true;

  return (
    <ModalPortal>
    <div className="apya-in apya-doc-overlay" onClick={onClose}>
      <div
        className="apya-pop-in apya-doc-dialog"
        style={{ maxWidth: 560 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Üretim öncesi kontrol"
      >
        <div className="d-flex align-items-start gap-3 mb-3">
          <div
            className="d-grid place-items-center flex-shrink-0"
            style={{
              width: 36, height: 36, borderRadius: 12,
              background: canGenerate ? 'rgba(52,211,153,.14)' : 'rgba(248,113,113,.12)',
              color: canGenerate ? 'var(--apya-positive-500)' : 'var(--apya-negative-500)',
            }}
          >
            <i className={`fa fa-${canGenerate ? 'circle-check' : 'triangle-exclamation'}`} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Üretim öncesi kontrol</div>
            <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)', marginTop: 4 }}>
              {loading
                ? 'Kontrol ediliyor…'
                : canGenerate
                  ? 'Paket üretilebilir.'
                  : `${result?.blockingCount ?? 0} kalem üretimi engelliyor.`}
            </div>
          </div>
        </div>

        {loading ? (
          <SkeletonList rows={4} />
        ) : (result?.issues?.length ?? 0) === 0 ? (
          <div style={{ fontSize: 12.5, color: 'var(--apya-text-secondary)' }}>
            Engelleyen veya uyarı gerektiren bir durum bulunmadı.
          </div>
        ) : (
          <div className="d-flex flex-column gap-2" style={{ maxHeight: 320, overflowY: 'auto' }}>
            {result.issues.map((issue, index) => (
              <div
                key={index}
                className="d-flex align-items-start gap-2"
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  background: issue.isBlocking ? 'rgba(248,113,113,.08)' : 'var(--apya-surface-sunken)',
                }}
              >
                <Badge variant={issue.isBlocking ? 'negative' : 'warning'} size="sm">
                  {issue.isBlocking ? 'Bloke' : 'Uyarı'}
                </Badge>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5 }}>{issue.message}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)' }}>
                    {KIND_LABEL[issue.kind] || '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="d-flex gap-2 justify-content-end mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>Kapat</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!canGenerate || loading}
            isLoading={busy}
            title={canGenerate ? undefined : 'Bloke kalemler giderilmeden üretilemez'}
            onClick={onGenerate}
          >
            Paketi üret
          </Button>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
