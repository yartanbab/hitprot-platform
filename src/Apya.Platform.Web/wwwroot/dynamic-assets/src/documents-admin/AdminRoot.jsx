import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, EmptyState, Input, SkeletonList } from '../components/ui';
import {
  abpNotify, createRule, deleteRule, getConsolidated, getFieldPermissions,
  getIntegrations, getRules, getTemplates, getTypes, saveIntegration,
  setFieldPermission, updateRule,
} from './api';
import { RuleEditor } from './RuleEditor';

/**
 * Doküman yönetimi — altı modül tek ekranda (mockup'taki modül şeridi).
 *
 * Modüller aynı izne (Documents.Administer) bağlı ve aynı veriyi paylaşıyor;
 * altı ayrı sayfa kurmak gezinmeyi ağırlaştırırdı.
 */

const cn = (...c) => c.filter(Boolean).join(' ');

const MODULES = [
  { key: 'schema', label: 'Meta şema' },
  { key: 'rules', label: 'Kural motoru' },
  { key: 'templates', label: 'Şablon galerisi' },
  { key: 'integrations', label: 'Entegrasyonlar' },
  { key: 'permissions', label: 'Alan bazlı izinler' },
  { key: 'consolidated', label: 'Konsolide rapor' },
];

const FIELD_TYPE_LABEL = {
  1: 'metin', 2: 'tarih', 3: 'para', 4: 'sayı', 5: 'yüzde', 6: 'liste', 7: 'ilişki',
};
const FILL_LABEL = { 1: 'Manuel', 2: 'OCR', 3: 'AI', 4: 'Kural' };
const VISIBILITY_LABEL = { 1: 'Herkes', 2: 'Kısıtlı', 3: 'Gizli' };

const LEVEL_META = {
  1: { text: 'düzenle', chip: 'apya-chip-positive' },
  2: { text: 'görüntüle', chip: 'apya-chip-accent' },
  3: { text: 'maskeli', chip: 'apya-chip-warning' },
  4: { text: 'gizli', chip: 'apya-chip-neutral' },
};

const INTEGRATION_LABEL = {
  1: 'E-posta kutusu', 2: 'Muhasebe', 3: 'Soğuk arşiv', 4: 'Sürücü eşitleme',
};

export function AdminRoot() {
  const [module, setModule] = useState('schema');
  const [types, setTypes] = useState([]);
  const [activeTypeId, setActiveTypeId] = useState(null);
  const [rules, setRules] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [matrix, setMatrix] = useState(null);
  const [consolidated, setConsolidated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadTypes = useCallback(async () => {
    const list = await getTypes();
    setTypes(list ?? []);
    if (!activeTypeId && list?.length) setActiveTypeId(list[0].id);
  }, [activeTypeId]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await loadTypes();
      } catch (e) {
        abpNotify('error', 'Yönetim verisi yüklenemedi.');
        console.error('[DocumentsAdmin] load', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [loadTypes]);

  /* Modül değişince o modülün verisini tembel yükle. */
  useEffect(() => {
    (async () => {
      try {
        if (module === 'rules' && rules.length === 0) setRules(await getRules() ?? []);
        if (module === 'templates' && templates.length === 0) setTemplates(await getTemplates() ?? []);
        if (module === 'integrations' && integrations.length === 0) setIntegrations(await getIntegrations() ?? []);
        if (module === 'consolidated' && !consolidated) setConsolidated(await getConsolidated());
        if (module === 'permissions' && activeTypeId) setMatrix(await getFieldPermissions(activeTypeId));
      } catch (e) {
        abpNotify('error', 'Modül verisi yüklenemedi.');
        console.error('[DocumentsAdmin] module load', e);
      }
    })();
  }, [module, activeTypeId]);

  const reloadRules = useCallback(async () => setRules(await getRules() ?? []), []);

  const activeType = types.find((t) => t.id === activeTypeId);

  /* --- Kural oluşturma: koşul/eylem düzenleyicisi yerine hızlı şablon --- */
  const handleCreateRule = async () => {
    const name = window.prompt('Kural adı:');
    if (!name) return;

    setBusy(true);
    try {
      await createRule({
        name,
        trigger: 1,
        logicalOperator: 1,
        // Yeni kural boş koşulla anlamsız olurdu; ilk koşul olarak "eksik meta"
        // gibi güvenli bir varsayılan verilir, kullanıcı düzenler.
        conditions: [{ order: 1, field: 9, operator: 4, compareValue: '0' }],
        actions: [{ order: 1, actionType: 3, payload: 'incelenecek' }],
      });
      await reloadRules();
    } catch (e) {
      abpNotify('error', 'Kural oluşturulamadı.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteRule = async (rule) => {
    if (!window.confirm(`"${rule.name}" silinsin mi?`)) return;
    setBusy(true);
    try {
      await deleteRule(rule.id);
      await reloadRules();
    } finally {
      setBusy(false);
    }
  };

  const handleEditRule = async (rule) => {
    const name = window.prompt('Kural adı:', rule.name);
    if (!name) return;
    setBusy(true);
    try {
      await updateRule(rule.id, {
        name,
        description: rule.description,
        trigger: rule.trigger,
        logicalOperator: rule.logicalOperator,
        order: rule.order,
        conditions: rule.conditions.map((c) => ({
          order: c.order, field: c.field, operator: c.operator, compareValue: c.compareValue,
        })),
        actions: rule.actions.map((a) => ({
          order: a.order, actionType: a.actionType, payload: a.payload,
        })),
      });
      await reloadRules();
    } finally {
      setBusy(false);
    }
  };

  const cycleLevel = async (fieldId, role, current) => {
    const next = current >= 4 ? 1 : current + 1;
    setBusy(true);
    try {
      await setFieldPermission({ documentTypeId: activeTypeId, fieldId, roleName: role, level: next });
      setMatrix(await getFieldPermissions(activeTypeId));
    } catch (e) {
      abpNotify('error', 'İzin güncellenemedi.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveIntegration = async () => {
    const name = window.prompt('Bağlantı adı:');
    if (!name) return;
    const target = window.prompt('Hedef (adres/kimlik):') || null;

    setBusy(true);
    try {
      await saveIntegration(null, { kind: 1, name, target, isEnabled: false });
      setIntegrations(await getIntegrations() ?? []);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto" style={{ maxWidth: 1560 }}>
      <div className="mb-4">
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Doküman yönetimi</h1>
        <p style={{ fontSize: 12, color: 'var(--apya-text-tertiary)', margin: '4px 0 0' }}>
          Belge tipleri, kurallar, izinler ve bağlantılar
        </p>
      </div>

      <div className="d-flex align-items-center gap-2 flex-wrap mb-4">
        {MODULES.map((m) => (
          <button
            key={m.key}
            type="button"
            className={cn('apya-doc-filterchip', module === m.key && 'is-active')}
            style={{ height: 31, fontSize: 12.5 }}
            onClick={() => setModule(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonList rows={6} />
      ) : module === 'schema' ? (
        <div className="apya-docs-shell is-wide">
          <div className="apya-docs-tree" style={{ maxHeight: 'none' }}>
            <div className="apya-md-overline" style={{ padding: '4px 8px 6px' }}>Belge tipleri</div>
            {types.map((type) => (
              <button
                key={type.id}
                type="button"
                className={cn('apya-md-item', activeTypeId === type.id && 'selected')}
                style={{ borderRadius: 8 }}
                onClick={() => setActiveTypeId(type.id)}
              >
                <span className="apya-md-item-title">{type.name}</span>
                {type.isSystem && <Badge variant="neutral" size="sm">sistem</Badge>}
                <span className="apya-md-item-side apya-numeric">{type.fields.length}</span>
              </button>
            ))}
            <div style={{ padding: '6px 8px', fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
              Sistem tipleri tüm kiracılarda paylaşılır; düzenlenemez.
            </div>
          </div>

          <div className="apya-docs-main">
            {!activeType ? (
              <EmptyState icon={<i className="fa fa-list" />} title="Bir belge tipi seçin" />
            ) : (
              <div className="p-3">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{activeType.name} · alan şeması</span>
                  <Badge variant="brand" size="sm">{activeType.fields.length} alan</Badge>
                  {activeType.retentionMonths && (
                    <Badge variant="neutral" size="sm">saklama {activeType.retentionMonths} ay</Badge>
                  )}
                </div>

                <div className="apya-doc-row apya-doc-row-head" style={{ gridTemplateColumns: 'minmax(0,1fr) 90px 80px 90px 110px' }}>
                  <span>Alan</span><span>Tip</span><span>Zorunlu</span><span>Doldurma</span><span>Görünürlük</span>
                </div>
                {activeType.fields.map((f) => (
                  <div key={f.id} className="apya-doc-row" style={{ gridTemplateColumns: 'minmax(0,1fr) 90px 80px 90px 110px', cursor: 'default' }}>
                    <span className="text-truncate" style={{ fontSize: 12.5 }}>{f.label}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>{FIELD_TYPE_LABEL[f.fieldType]}</span>
                    <span>{f.isRequired && <Badge variant="negative" size="sm">zorunlu</Badge>}</span>
                    <span style={{ fontSize: 11.5 }}>{FILL_LABEL[f.fillSource]}</span>
                    <span style={{ fontSize: 11.5 }}>{VISIBILITY_LABEL[f.visibility]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : module === 'rules' ? (
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center gap-2">
            <Button variant="primary" size="sm" disabled={busy} onClick={handleCreateRule}
              leadingIcon={<i className="fa fa-plus" />}>
              Yeni kural
            </Button>
            <span style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
              Yeni kural KAPALI doğar — önce kuru çalıştırıp etkisini görün.
            </span>
          </div>

          {rules.length === 0 ? (
            <EmptyState icon={<i className="fa fa-wand-magic-sparkles" />} title="Henüz kural yok"
              description="Koşul → eylem tanımlayarak belgeleri otomatik sınıflandırın." />
          ) : rules.map((rule) => (
            <RuleEditor key={rule.id} rule={rule} onChanged={reloadRules}
              onEdit={handleEditRule} onDelete={handleDeleteRule} />
          ))}
        </div>
      ) : module === 'templates' ? (
        <div className="apya-tile-grid">
          {templates.map((t) => (
            <div key={t.id} className="apya-tile" style={{ cursor: 'default' }}>
              <div className="apya-tile-head">
                <div><div className="apya-tile-title">{t.name}</div>
                  <div className="apya-tile-sub">{t.issuer || '—'}</div></div>
                <Badge variant="brand" size="sm">{t.enabledSectionCount} bölüm</Badge>
              </div>
              <div className="apya-tile-foot">
                <span>{t.isSystem ? 'Sistem şablonu' : 'Kiracı şablonu'}</span>
                <span className="apya-numeric">{t.sections.length} tanım</span>
              </div>
            </div>
          ))}
          {templates.length === 0 && <EmptyState icon={<i className="fa fa-layer-group" />} title="Şablon yok" />}
        </div>
      ) : module === 'integrations' ? (
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center gap-2">
            <Button variant="primary" size="sm" disabled={busy} onClick={handleSaveIntegration}
              leadingIcon={<i className="fa fa-plus" />}>
              Bağlantı ekle
            </Button>
          </div>

          <div className="apya-doc-check-card" style={{ borderColor: 'var(--apya-warning-500)' }}>
            <div style={{ fontSize: 12, color: 'var(--apya-text-secondary)' }}>
              <i className="fa fa-circle-info" /> Bu kayıtlar yalnız <strong>yapılandırma</strong> tutar.
              Gerçek eşitleme altyapısı (e-posta çekme, S3 aktarımı, muhasebe senkronu) henüz yok —
              bir bağlantı hiçbir zaman kendiliğinden "bağlı" duruma geçmez.
            </div>
          </div>

          {integrations.map((i) => (
            <div key={i.id} className="apya-doc-activity-row" style={{ gridTemplateColumns: '150px minmax(0,1fr) 150px 110px' }}>
              <Badge variant="neutral" size="sm">{INTEGRATION_LABEL[i.kind]}</Badge>
              <span style={{ fontSize: 12.5 }}>{i.name}</span>
              <span className="apya-numeric text-truncate" style={{ fontSize: 11 }}>{i.target || '—'}</span>
              <Badge variant="warning" size="sm">kurulum bekliyor</Badge>
            </div>
          ))}
        </div>
      ) : module === 'permissions' ? (
        !matrix ? <SkeletonList rows={5} /> : (
          <div className="apya-doc-check-card">
            <div className="apya-doc-check-head">
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                Alan bazlı izinler · {matrix.documentTypeName}
              </div>
              <div className="d-flex gap-2">
                {Object.entries(LEVEL_META).map(([k, v]) => (
                  <span key={k} className={cn('apya-chip', v.chip)}>{v.text}</span>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <div className="apya-doc-row apya-doc-row-head"
                style={{ gridTemplateColumns: `220px repeat(${matrix.roles.length}, minmax(110px, 1fr))` }}>
                <span>Alan</span>
                {matrix.roles.map((r) => <span key={r}>{r}</span>)}
              </div>
              {matrix.rows.map((row) => (
                <div key={row.fieldId} className="apya-doc-row"
                  style={{ gridTemplateColumns: `220px repeat(${matrix.roles.length}, minmax(110px, 1fr))`, cursor: 'default' }}>
                  <span className="text-truncate" style={{ fontSize: 12.5 }}>{row.label}</span>
                  {matrix.roles.map((role) => {
                    const level = row.levels[role] ?? 1;
                    const meta = LEVEL_META[level];
                    return (
                      <span key={role}>
                        <button type="button" className={cn('apya-chip', meta.chip)}
                          style={{ border: 'none', cursor: 'pointer' }}
                          disabled={busy}
                          title="Seviyeyi değiştirmek için tıklayın"
                          onClick={() => cycleLevel(row.fieldId, role, level)}>
                          {meta.text}
                        </button>
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>

            <div style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
              Matris ETKİN seviyeyi gösterir (kural + devralma + varsayılan).
              Bir kullanıcı birden çok role sahipse en az kısıtlayıcı olan geçerlidir.
            </div>
          </div>
        )
      ) : (
        !consolidated ? <SkeletonList rows={5} /> : (
          <div className="d-flex flex-column gap-3">
            <div className="apya-doc-kpis">
              <div className="apya-doc-kpi">
                <span className="apya-md-overline">Kiracı</span>
                <div className="apya-numeric apya-doc-kpi-value">{consolidated.tenantCount}</div>
                <div style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
                  {consolidated.tenantsWithProjects} tanesi projeli
                </div>
              </div>
              <div className="apya-doc-kpi">
                <span className="apya-md-overline">Toplam belge</span>
                <div className="apya-numeric apya-doc-kpi-value">{consolidated.totalDocuments}</div>
              </div>
            </div>

            <div className="apya-doc-check-card">
              <div className="apya-doc-row apya-doc-row-head" style={{ gridTemplateColumns: 'minmax(0,1fr) 90px 90px 130px 110px' }}>
                <span>Kiracı</span><span>Proje</span><span>Belge</span><span>Belgelenen tutar</span><span>Son belge</span>
              </div>
              {consolidated.rows.map((row) => (
                <div key={row.tenantId ?? 'host'} className="apya-doc-row"
                  style={{ gridTemplateColumns: 'minmax(0,1fr) 90px 90px 130px 110px', cursor: 'default' }}>
                  <span className="text-truncate" style={{ fontSize: 12.5 }}>{row.tenantName}</span>
                  <span className="apya-numeric">{row.projectCount}</span>
                  <span className="apya-numeric">{row.documentCount}</span>
                  <span className="apya-numeric">
                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(row.documentedAmount)}
                  </span>
                  <span className="apya-numeric" style={{ fontSize: 11 }}>
                    {row.lastDocumentAt
                      ? new Intl.DateTimeFormat('tr-TR').format(new Date(row.lastDocumentAt))
                      : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
