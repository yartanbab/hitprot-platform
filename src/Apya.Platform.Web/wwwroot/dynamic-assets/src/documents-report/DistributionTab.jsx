import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, EmptyState, SkeletonList } from '../components/ui';
import { SchedulePanel } from './SchedulePanel';
import {
  abpAppPath, abpNotify, createShareLink, fmtDate, getPackages, getShareLinks, revokeShareLink,
} from './api';

/**
 * Dağıtım sekmesi.
 *
 * Paylaşım linki ÜRETİLMİŞ bir pakete bağlanır, şablona değil: şablon neyin
 * basılacağını, paket ne basıldığını tutar — dışarıya verilen link ikincisine
 * işaret etmeli, yoksa alıcı her açtığında farklı içerik görürdü.
 *
 * Token sunucuda üretilir ve YALNIZ oluşturma anında bir kez döner (DB'de
 * SHA-256 özeti saklanır). Bu yüzden link kopyalanmadan pencere kapanırsa
 * yeniden üretmek gerekir — bu kasıtlı.
 */
export function DistributionTab({ projectId }) {
  const [packages, setPackages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [links, setLinks] = useState([]);
  const [freshToken, setFreshToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!projectId) { setPackages([]); return; }
    setLoading(true);
    try {
      setPackages(await getPackages(projectId) ?? []);
    } catch (e) {
      abpNotify('error', 'Paketler yüklenemedi.');
      console.error('[ReportBuilder] packages', e);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const selectPackage = async (pkg) => {
    setSelected(pkg);
    setFreshToken(null);
    try {
      setLinks(await getShareLinks(pkg.id) ?? []);
    } catch (e) {
      console.error('[ReportBuilder] shareLinks', e);
    }
  };

  const handleCreate = async (allowDownload) => {
    if (!selected) return;
    setBusy(true);
    try {
      const created = await createShareLink({
        targetType: 1, // DeliveryPackage
        targetId: selected.id,
        lifetimeDays: 30,
        allowDownload,
        watermark: null,
      });
      setFreshToken(created);
      setLinks(await getShareLinks(selected.id) ?? []);
    } catch (e) {
      abpNotify('error', 'Paylaşım linki oluşturulamadı.');
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async (id) => {
    setBusy(true);
    try {
      await revokeShareLink(id);
      setLinks(await getShareLinks(selected.id) ?? []);
    } catch (e) {
      abpNotify('error', 'Link iptal edilemedi.');
    } finally {
      setBusy(false);
    }
  };

  if (!projectId) {
    return (
      <div className="apya-doc-check-card">
        <EmptyState icon={<i className="fa fa-share-nodes" />} title="Proje bağlamı gerekiyor"
          description="Dağıtım üretilmiş paketler üzerinden yürür; üstteki listeden bir proje seçin." />
      </div>
    );
  }

  if (loading) return <div className="apya-doc-check-card"><SkeletonList rows={5} /></div>;

  // Dağıtım = paylaşım linkleri + ZAMANLANMIŞ üretim; ikisi de "rapor kime,
  // ne zaman gider" sorusunun parçası, aynı sekmede duruyorlar.

  return (
    <div className="d-flex flex-column gap-3">
    <div className="apya-doc-check-card">
      <div className="apya-doc-check-head">
        <span style={{ fontSize: 13.5, fontWeight: 600 }}>Üretilmiş paketler</span>
        <a className="apya-doc-linkbtn"
          href={`${abpAppPath()}Documents/Deliveries?projectId=${projectId}`}>
          Teslimler ekranı
        </a>
      </div>

      {packages.length === 0 ? (
        <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
          Bu projede paket yok. Dağıtmak için önce Teslimler ekranından bir paket üretin.
        </div>
      ) : packages.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`apya-md-item${selected?.id === p.id ? ' selected' : ''}`}
          style={{ borderRadius: 8, height: 'auto', paddingTop: 7, paddingBottom: 7 }}
          onClick={() => selectPackage(p)}
        >
          <span style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
            <span className="d-block text-truncate" style={{ fontSize: 12.5, fontWeight: 500 }}>{p.name}</span>
            <span className="d-block" style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)' }}>
              {p.reportTemplateName ?? 'şablonsuz'}
              {p.periodCode && ` · ${p.periodCode}`}
            </span>
          </span>
          <Badge variant={p.status === 2 ? 'positive' : p.status === 3 ? 'accent' : 'neutral'} size="sm">
            {p.status === 2 ? 'üretildi' : p.status === 3 ? 'gönderildi' : 'taslak'}
          </Badge>
        </button>
      ))}

      {selected && (
        <>
          <div className="apya-md-overline mt-3">Paylaşım linkleri · {selected.name}</div>

          <div className="d-flex gap-2 mb-2">
            <Button variant="outline" size="sm" disabled={busy} onClick={() => handleCreate(false)}>
              Salt görüntüleme linki
            </Button>
            <Button variant="outline" size="sm" disabled={busy} onClick={() => handleCreate(true)}>
              İndirmeye açık link
            </Button>
          </div>

          {freshToken && (
            <div style={{
              fontSize: 11.5, padding: 8, borderRadius: 8,
              background: 'var(--apya-surface-sunken)', marginBottom: 8, wordBreak: 'break-all',
            }}>
              <strong>Link yalnız şimdi gösterilir</strong> — kopyalayın, tekrar görüntülenemez:
              <div className="apya-numeric mt-1">
                {window.location.origin}{abpAppPath()}Share/{freshToken.token}
              </div>
            </div>
          )}

          {links.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>Bu pakette link yok.</div>
          ) : links.map((l) => (
            <div key={l.id} className="apya-doc-check-row"
              style={{ gridTemplateColumns: 'minmax(0,1fr) 110px 90px 70px' }}>
              <span style={{ fontSize: 12 }}>
                {l.allowDownload ? 'İndirilebilir' : 'Salt görüntüleme'}
                {l.isRevoked && <Badge variant="negative" size="sm">iptal</Badge>}
              </span>
              <span style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
                {fmtDate(l.expiresAt)} bitiyor
              </span>
              <span className="apya-numeric" style={{ fontSize: 11 }}>
                {l.accessCount ?? 0} erişim
              </span>
              <span className="text-end">
                {!l.isRevoked && (
                  <button type="button" className="apya-doc-linkbtn" disabled={busy}
                    onClick={() => handleRevoke(l.id)}>İptal</button>
                )}
              </span>
            </div>
          ))}
        </>
      )}
    </div>

    <SchedulePanel projectId={projectId} packages={packages} />
    </div>
  );
}
