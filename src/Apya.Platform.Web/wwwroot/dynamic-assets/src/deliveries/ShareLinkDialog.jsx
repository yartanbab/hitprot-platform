import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, ModalPortal } from '../components/ui';

/**
 * Paylaşım bağlantısı penceresi.
 *
 * Bağlantı üç ARDIŞIK tarayıcı kutusuyla kuruluyordu (süre → indirme onayı → filigran) ve
 * sonuç dördüncü bir kutuda gösteriliyordu. İlk adımdan sonra vazgeçilemiyordu: onay
 * kutusunda "İptal" yalnız görüntüleme, filigran kutusunda "İptal" filigransız demekti.
 * Bağlantı ise sunucudan YALNIZ BİR KEZ döner — tarayıcı kutusu engellenirse ya da yanlışlıkla
 * kapanırsa geri getirilemiyordu.
 *
 * İki hâli vardır: `link` yokken seçenekler, `link` gelince bağlantının kendisi. Bağlantı
 * gösterilirken arka plana tıklamak pencereyi KAPATMAZ; kullanıcı "Kapat" der.
 */

// Sunucudaki sınırların aynısı (CreateShareLinkDto: LifetimeDays [Range(1, 365)], Watermark 120).
const DEFAULT_DAYS = 14;
const MAX_DAYS = 365;
const MAX_WATERMARK = 120;

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--apya-text-secondary)', marginBottom: 4 };
const hintStyle = { fontSize: 11.5, color: 'var(--apya-text-tertiary)', marginTop: 4 };

export function ShareLinkDialog({ open, busy, link, onClose, onSubmit }) {
  const [days, setDays] = useState(String(DEFAULT_DAYS));
  const [allowDownload, setAllowDownload] = useState(false);
  const [watermark, setWatermark] = useState('');
  const [copyState, setCopyState] = useState(null); // null | 'copied' | 'failed'
  const linkRef = useRef(null);

  // Pencere her açılışta varsayılanlarla başlar: önceki bağlantının seçenekleri taşınmaz.
  useEffect(() => {
    if (open) {
      setDays(String(DEFAULT_DAYS));
      setAllowDownload(false);
      setWatermark('');
      setCopyState(null);
    }
  }, [open]);

  if (!open) return null;

  const lifetimeDays = Number(days);
  const daysValid = /^\d+$/.test(days.trim()) && lifetimeDays >= 1 && lifetimeDays <= MAX_DAYS;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!daysValid || busy) return;
    onSubmit({ lifetimeDays, allowDownload, watermark: watermark.trim() || null });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopyState('copied');
    } catch {
      // Pano izni yoksa bağlantıyı seçili bırak: kullanıcı Ctrl+C ile alır.
      linkRef.current?.select();
      setCopyState('failed');
    }
  };

  return (
    <ModalPortal>
      <div className="apya-in apya-doc-overlay" onClick={link || busy ? undefined : onClose}>
        <div
          className="apya-pop-in apya-doc-dialog"
          style={{ maxWidth: 460 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Paylaşım bağlantısı oluştur"
        >
          <div style={{ fontSize: 14, fontWeight: 600 }} className="mb-3">Paylaşım bağlantısı</div>

          {link ? (
            <>
              <div style={{ fontSize: 12.5, color: 'var(--apya-text-secondary)' }} className="mb-2">
                Bağlantı hazır. Yalnız şimdi gösterilir; bu pencere kapandıktan sonra yeniden görüntülenemez.
              </div>
              <div className="d-flex gap-2 align-items-center">
                <Input
                  ref={linkRef} size="sm" readOnly value={link} aria-label="Paylaşım bağlantısı"
                  onFocus={(e) => e.target.select()}
                />
                <Button variant="primary" size="sm" onClick={handleCopy}>Kopyala</Button>
              </div>
              <div style={hintStyle} role="status">
                {copyState === 'copied' && 'Kopyalandı.'}
                {copyState === 'failed' && 'Kopyalanamadı — bağlantı seçildi, elle kopyalayın.'}
              </div>
              <div className="d-flex gap-2 justify-content-end mt-4">
                <Button variant="outline" size="sm" onClick={onClose}>Kapat</Button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label style={labelStyle} htmlFor="share-days">Geçerlilik süresi (gün)</label>
                <Input
                  id="share-days" size="sm" type="number" min={1} max={MAX_DAYS} step={1} autoFocus
                  invalid={!daysValid} value={days} onChange={(e) => setDays(e.target.value)}
                />
                {!daysValid && (
                  <div style={{ ...hintStyle, color: 'var(--apya-negative-500)' }}>
                    1 ile {MAX_DAYS} gün arasında bir tam sayı girin.
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="d-flex align-items-center gap-2" style={{ fontSize: 12.5 }}>
                  <input
                    type="checkbox" checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                  />
                  İndirmeye izin ver
                </label>
                <div style={hintStyle}>Kapalıyken bağlantıyı açan kişi paketi yalnız görüntüler.</div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="share-watermark">Filigran metni (boş bırakılabilir)</label>
                <Input
                  id="share-watermark" size="sm" maxLength={MAX_WATERMARK}
                  value={watermark} onChange={(e) => setWatermark(e.target.value)}
                />
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4">
                <Button type="button" variant="outline" size="sm" disabled={busy} onClick={onClose}>Vazgeç</Button>
                <Button type="submit" variant="primary" size="sm" disabled={!daysValid} isLoading={busy}>
                  Bağlantı oluştur
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
