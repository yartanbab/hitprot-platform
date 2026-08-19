import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, EmptyState, SkeletonList } from '../components/ui';
import {
  RECIPIENT_LABEL, SECTION_LABEL, abpNotify, createTemplate, deleteTemplate,
  duplicateTemplate, getProjects, getTemplates, updateSections,
} from './api';
import { PreviewTab } from './PreviewTab';
import { DistributionTab } from './DistributionTab';

/**
 * Rapor derleyici — Bölümler / Önizleme / Dağıtım.
 *
 * Sol kolon şablon listesi, sağ kolon seçilen sekmenin içeriği. Şablon seçimi
 * üç sekmede de ORTAK: kullanıcı bölümü açıp hemen önizleyebilmeli, sekme
 * değiştirmek seçimi sıfırlamamalı.
 */

const cn = (...c) => c.filter(Boolean).join(' ');

const TABS = [
  { key: 'sections', label: 'Bölümler' },
  { key: 'preview', label: 'Önizleme' },
  { key: 'distribution', label: 'Dağıtım' },
];

function SectionRow({ section, onToggle, onMove, isFirst, isLast, busy }) {
  const label = SECTION_LABEL[section.sectionKey] ?? `Bölüm ${section.sectionKey}`;

  return (
    <div className="apya-doc-check-row" style={{ gridTemplateColumns: '34px minmax(0,1fr) auto auto' }}>
      <input
        type="checkbox"
        checked={section.isEnabled}
        disabled={busy || !section.isAvailable}
        onChange={(e) => onToggle(section.id, e.target.checked)}
        aria-label={`${label} bölümünü aç/kapa`}
      />

      <span style={{ minWidth: 0 }}>
        <span className="d-block text-truncate"
          style={{ fontSize: 12.5, opacity: section.isAvailable ? 1 : 0.55 }}>
          {label}
        </span>
        {!section.isAvailable && (
          <span style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)' }}>
            verisi henüz yok — açılamaz
          </span>
        )}
      </span>

      <span className="apya-numeric" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
        {section.order}
      </span>

      <span className="d-flex gap-1">
        <button type="button" className="apya-doc-linkbtn" disabled={busy || isFirst}
          onClick={() => onMove(section.id, -1)} aria-label="Yukarı taşı">↑</button>
        <button type="button" className="apya-doc-linkbtn" disabled={busy || isLast}
          onClick={() => onMove(section.id, +1)} aria-label="Aşağı taşı">↓</button>
      </span>
    </div>
  );
}

export function ReportBuilderRoot() {
  const params = new URLSearchParams(window.location.search);

  const [templates, setTemplates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [projectId, setProjectId] = useState(params.get('projectId') || '');
  const [tab, setTab] = useState('sections');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, p] = await Promise.all([getTemplates(), getProjects()]);
      setTemplates(t ?? []);
      setProjects(p ?? []);
      setSelectedId((prev) => prev ?? (t?.[0]?.id ?? null));
    } catch (e) {
      abpNotify('error', 'Şablonlar yüklenemedi.');
      console.error('[ReportBuilder] load', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const selected = useMemo(
    () => templates.find((t) => t.id === selectedId) ?? null,
    [templates, selectedId],
  );

  const orderedSections = useMemo(
    () => (selected ? [...selected.sections].sort((a, b) => a.order - b.order) : []),
    [selected],
  );

  /** Bölüm değişikliklerini tek çağrıda gönderir — sunucu sırayı normalize eder. */
  const persistSections = async (sections) => {
    if (!selected) return;
    setBusy(true);
    try {
      const updated = await updateSections({
        templateId: selected.id,
        sections: sections.map((s, i) => ({ sectionId: s.id, order: i + 1, isEnabled: s.isEnabled })),
      });
      setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      abpNotify('error', 'Bölümler kaydedilemedi.');
      console.error('[ReportBuilder] persistSections', e);
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = (sectionId, isEnabled) =>
    persistSections(orderedSections.map((s) => (s.id === sectionId ? { ...s, isEnabled } : s)));

  const handleMove = (sectionId, delta) => {
    const list = [...orderedSections];
    const i = list.findIndex((s) => s.id === sectionId);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    persistSections(list);
  };

  const handleCreate = async () => {
    const name = window.prompt('Şablon adı:');
    if (!name) return;

    setBusy(true);
    try {
      const created = await createTemplate({ name, recipient: 1, issuer: null, order: templates.length + 1 });
      await load();
      setSelectedId(created.id);
    } catch (e) {
      abpNotify('error', 'Şablon oluşturulamadı.');
    } finally {
      setBusy(false);
    }
  };

  const handleDuplicate = async (id) => {
    setBusy(true);
    try {
      const copy = await duplicateTemplate(id);
      await load();
      setSelectedId(copy.id);
    } catch (e) {
      abpNotify('error', 'Şablon kopyalanamadı.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu şablon silinsin mi? Üretilmiş paketler etkilenmez.')) return;
    setBusy(true);
    try {
      await deleteTemplate(id);
      setSelectedId(null);
      await load();
    } catch (e) {
      abpNotify('error', 'Şablon silinemedi.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-4"><SkeletonList rows={8} /></div>;

  return (
    <div className="apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto" style={{ maxWidth: 1560 }}>
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Rapor derleyici</h1>
          <p style={{ fontSize: 12, color: 'var(--apya-text-tertiary)', margin: '4px 0 0' }}>
            Şablonun bölümlerini seç, önizle, alıcıya dağıt
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <select
            className="apya-doc-select"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            aria-label="Proje bağlamı"
          >
            <option value="">Proje seçin…</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.code ? `${p.code} · ${p.name}` : p.name}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" disabled={busy} onClick={handleCreate}>
            <i className="fa fa-plus" /> Yeni şablon
          </Button>
        </div>
      </div>

      <div className="apya-doc-tabs mb-3" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={cn('apya-doc-tab', tab === t.key && 'active')}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="apya-doc-reportgrid">
        {/* Sol: şablonlar */}
        <div className="apya-doc-check-card">
          <div className="apya-md-overline">Şablonlar</div>

          {templates.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>Şablon yok.</div>
          ) : templates.map((t) => (
            <button
              key={t.id}
              type="button"
              className={cn('apya-md-item', selectedId === t.id && 'selected')}
              style={{ borderRadius: 8, height: 'auto', paddingTop: 7, paddingBottom: 7 }}
              onClick={() => setSelectedId(t.id)}
            >
              <span style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
                <span className="d-block text-truncate" style={{ fontSize: 12.5, fontWeight: 500 }}>
                  {t.name}
                </span>
                <span className="d-block" style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)' }}>
                  {RECIPIENT_LABEL[t.recipient] ?? '—'}
                  {t.issuer && ` · ${t.issuer}`}
                </span>
              </span>
              <span className="d-flex align-items-center gap-1">
                {t.isSystem && <Badge variant="neutral" size="sm">sistem</Badge>}
                <Badge variant="accent" size="sm">{t.enabledSectionCount}</Badge>
              </span>
            </button>
          ))}
        </div>

        {/* Sağ: sekme içeriği */}
        {tab === 'sections' && (
          <div className="apya-doc-check-card">
            {!selected ? (
              <EmptyState icon={<i className="fa fa-list-check" />} title="Şablon seçin"
                description="Soldan bir şablon seçerek bölümlerini düzenleyin." />
            ) : (
              <>
                <div className="apya-doc-check-head">
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{selected.name}</span>
                  <span className="d-flex gap-2">
                    <button type="button" className="apya-doc-linkbtn" disabled={busy}
                      onClick={() => handleDuplicate(selected.id)}>Kopyala</button>
                    {!selected.isSystem && (
                      <button type="button" className="apya-doc-linkbtn" disabled={busy}
                        onClick={() => handleDelete(selected.id)}>Sil</button>
                    )}
                  </span>
                </div>

                {selected.isSystem && (
                  <div style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)', marginBottom: 6 }}>
                    Sistem şablonu tüm kiracılarda paylaşılır; künyesi düzenlenemez.
                    Kendinize uyarlamak için <strong>Kopyala</strong>'yı kullanın.
                  </div>
                )}

                {orderedSections.map((s, i) => (
                  <SectionRow
                    key={s.id}
                    section={s}
                    busy={busy}
                    isFirst={i === 0}
                    isLast={i === orderedSections.length - 1}
                    onToggle={handleToggle}
                    onMove={handleMove}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {tab === 'preview' && (
          <PreviewTab projectId={projectId} template={selected} />
        )}

        {tab === 'distribution' && (
          <DistributionTab projectId={projectId} />
        )}
      </div>
    </div>
  );
}
