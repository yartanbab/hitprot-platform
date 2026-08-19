import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, EmptyState, SkeletonList } from '../components/ui';
import { SECTION_LABEL, abpNotify, fmtDate, fmtMoney, getPreview, previewPdfUrl } from './api';

/**
 * Önizleme sekmesi.
 *
 * Ekrandaki özet ile "PDF önizle" AYNI sunucu modelinden beslenir — biri
 * diğerinden sapamaz. PDF'e "ÖNİZLEME" damgası sunucuda basılır, çünkü
 * damgayı istemciye bırakmak onu atlanabilir kılardı.
 */
export function PreviewTab({ projectId, template }) {
  const [model, setModel] = useState(null);
  const [periodCode, setPeriodCode] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!projectId) { setModel(null); return; }
    setLoading(true);
    try {
      setModel(await getPreview(projectId, template?.id, periodCode));
    } catch (e) {
      abpNotify('error', 'Önizleme üretilemedi.');
      console.error('[ReportBuilder] preview', e);
    } finally {
      setLoading(false);
    }
  }, [projectId, template?.id, periodCode]);

  useEffect(() => { load(); }, [load]);

  if (!projectId) {
    return (
      <div className="apya-doc-check-card">
        <EmptyState icon={<i className="fa fa-eye" />} title="Proje bağlamı gerekiyor"
          description="Önizleme gerçek veriyle üretilir; üstteki listeden bir proje seçin." />
      </div>
    );
  }

  if (loading) return <div className="apya-doc-check-card"><SkeletonList rows={6} /></div>;
  if (!model) return null;

  const s = model.summary;

  return (
    <div className="apya-doc-check-card">
      <div className="apya-doc-check-head">
        <span style={{ fontSize: 13.5, fontWeight: 600 }}>
          {model.projectName}
          {model.templateName && (
            <span style={{ fontWeight: 400, color: 'var(--apya-text-tertiary)' }}> · {model.templateName}</span>
          )}
        </span>
        <span className="d-flex align-items-center gap-2">
          <input
            className="apya-doc-input"
            style={{ width: 110 }}
            placeholder="Dönem (ops.)"
            value={periodCode}
            onChange={(e) => setPeriodCode(e.target.value)}
            aria-label="Dönem kodu"
          />
          <a className="apya-doc-linkbtn" target="_blank" rel="noreferrer"
            href={previewPdfUrl(projectId, template?.id, periodCode)}>
            PDF önizle
          </a>
        </span>
      </div>

      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '.06em',
        color: 'var(--apya-negative-500)', marginBottom: 8,
      }}>
        ÖNİZLEME — TESLİM İÇİN KULLANMAYIN
      </div>

      {/* Özet — PDF'in ilk bloğunun birebir karşılığı */}
      <div className="apya-doc-kpis" style={{ marginBottom: 12 }}>
        <div className="apya-doc-kpi">
          <span className="apya-md-overline">Uygunluk</span>
          <div className="apya-numeric apya-doc-kpi-value">%{s.compliancePercent}</div>
        </div>
        <div className="apya-doc-kpi">
          <span className="apya-md-overline">Belge</span>
          <div className="apya-numeric apya-doc-kpi-value">{s.documentCount}</div>
        </div>
        <div className="apya-doc-kpi">
          <span className="apya-md-overline">Eksik</span>
          <div className="apya-numeric apya-doc-kpi-value"
            style={{ color: s.blockingCount > 0 ? 'var(--apya-negative-500)' : undefined }}>
            {s.missingCount}
          </div>
          <div style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
            {s.blockingCount} bloke edici
          </div>
        </div>
        <div className="apya-doc-kpi">
          <span className="apya-md-overline">Belgelenen tutar</span>
          <div className="apya-numeric apya-doc-kpi-value" style={{ fontSize: 16 }}>
            {fmtMoney(s.documentedAmount, s.currency)}
          </div>
        </div>
      </div>

      {/* Bölüm sırası — çıktıya bu sırayla girecek */}
      <div className="apya-md-overline">Çıktıya girecek bölümler ({model.sections.length})</div>
      {model.sections.length === 0 ? (
        <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
          Açık bölüm yok — Bölümler sekmesinden en az bir tane açın.
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-1 mb-3">
          {model.sections.map((key, i) => (
            <Badge key={`${key}-${i}`} variant="neutral" size="sm">
              {i + 1}. {SECTION_LABEL[key] ?? key}
            </Badge>
          ))}
        </div>
      )}

      {/* Ekler */}
      <div className="apya-md-overline">
        Ekler ({model.annexes.length}
        {model.truncatedAnnexCount > 0 && ` · +${model.truncatedAnnexCount} gösterilmiyor`})
      </div>
      {model.annexes.length === 0 ? (
        <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
          Bu projede henüz belge yok; ek dizini boş çıkacak.
        </div>
      ) : model.annexes.slice(0, 12).map((a) => (
        <div key={a.annexNumber + a.documentName} className="apya-doc-check-row"
          style={{ gridTemplateColumns: '60px minmax(0,1fr) 90px 110px' }}>
          <span className="apya-numeric" style={{ fontSize: 11 }}>{a.annexNumber}</span>
          <span className="text-truncate" style={{ fontSize: 12.5 }}>{a.documentName}</span>
          <span style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>{a.typeName ?? '—'}</span>
          <span className="apya-numeric text-end" style={{ fontSize: 11.5 }}>
            {a.amount != null ? fmtMoney(a.amount) : fmtDate(a.documentDate)}
          </span>
        </div>
      ))}

      {/* Eksikler — kuruma gitmeden önce görülmesi gereken tek liste */}
      {model.missingDocuments.length > 0 && (
        <>
          <div className="apya-md-overline mt-3">Eksik belgeler ({model.missingDocuments.length})</div>
          {model.missingDocuments.slice(0, 10).map((m, i) => (
            <div key={i} style={{ fontSize: 12, padding: '3px 0' }}>
              <i className="fa fa-triangle-exclamation" style={{ color: 'var(--apya-warning-500)' }} /> {m}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
