import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Input, SkeletonList } from '../../components/ui';
import {
  abpNotify, addComplianceRequirement, createCompliancePackage, deleteComplianceRequirement,
  deleteCompliancePackage, getComplianceRequirements, getProjectTasks, updateComplianceRequirement,
  updateCompliancePackage,
} from '../api';
import { cn } from '../format';

/**
 * Kiracının kendi kontrol listesi paketi.
 *
 * Kurumun listesi (KOSGEB, TÜBİTAK) sistemde tohumludur ve DÜZENLENEMEZ — tüm
 * kiracılarca paylaşılır, biri değiştirse diğerlerinin listesi bozulur. Kurum
 * dışındaki iç zorunluluklar ("her projede imzalı sözleşme olacak") burada
 * tanımlanır ve kalemler kaynağını taşır.
 */

const SCOPES = [
  { value: 1, label: 'Proje geneli' },
  { value: 2, label: 'Her iş adımı için' },
  { value: 3, label: 'Her dönem için' },
];

const SOURCES = [
  { value: 2, label: 'Klasör şeması' },
  { value: 3, label: 'Task eki' },
];

const EMPTY_REQUIREMENT = {
  title: '', scope: 1, documentTypeId: '', isBlocking: false, order: 0,
  source: 2, sourceEntityId: '',
};

function RequirementForm({ draft, setDraft, documentTypes, tasks, onSubmit, onCancel, busy }) {
  const isTaskSource = Number(draft.source) === 3;

  return (
    <form
      className="d-flex flex-column gap-2 p-2"
      style={{ background: 'var(--apya-surface-sunken)', borderRadius: 10 }}
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    >
      <Input
        size="sm"
        placeholder="Kalem adı (ör. İmzalı hizmet sözleşmesi)"
        value={draft.title}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        required
      />

      <div className="d-flex flex-wrap gap-2">
        <select
          className="apya-doc-select"
          value={draft.source}
          onChange={(e) => setDraft({ ...draft, source: Number(e.target.value), sourceEntityId: '' })}
          aria-label="Kaynak"
        >
          {SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <select
          className="apya-doc-select"
          value={draft.scope}
          onChange={(e) => setDraft({ ...draft, scope: Number(e.target.value) })}
          aria-label="Kapsam"
        >
          {SCOPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <select
          className="apya-doc-select"
          value={draft.documentTypeId || ''}
          onChange={(e) => setDraft({ ...draft, documentTypeId: e.target.value })}
          aria-label="Belge tipi"
          disabled={isTaskSource}
          title={isTaskSource ? 'Göreve bağlı kalem otomatik eşleşmez' : undefined}
        >
          <option value="">Belge tipi: yok (elle bağlanır)</option>
          {documentTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {isTaskSource && (
        <select
          className="apya-doc-select"
          value={draft.sourceEntityId || ''}
          onChange={(e) => setDraft({ ...draft, sourceEntityId: e.target.value })}
          aria-label="Görev"
          required
        >
          <option value="">Görev seçin…</option>
          {tasks.map((t) => <option key={t.id} value={t.id}>#{t.number} · {t.title}</option>)}
        </select>
      )}

      {isTaskSource && (
        <div style={{ fontSize: 10.5, color: 'var(--apya-warning-700, #92400E)' }}>
          Göreve bağlı kalem otomatik karşılanmaz; belge elle bağlanır.
        </div>
      )}

      <label className="d-flex align-items-center gap-2" style={{ fontSize: 12 }}>
        <input
          type="checkbox"
          checked={draft.isBlocking}
          onChange={(e) => setDraft({ ...draft, isBlocking: e.target.checked })}
        />
        Eksikse teslim paketi üretimini bloke etsin
      </label>

      <div className="d-flex gap-2 justify-content-end">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Vazgeç</Button>
        <Button type="submit" size="sm" isLoading={busy} disabled={!draft.title.trim()}>Kaydet</Button>
      </div>
    </form>
  );
}

export function PackageEditor({ pkg, projectId, documentTypes, onClose, onChanged }) {
  const [requirements, setRequirements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [meta, setMeta] = useState({
    name: pkg.name, issuer: pkg.issuer, description: pkg.description || '', order: pkg.order || 0,
  });

  const [draft, setDraft] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [items, taskList] = await Promise.all([
        getComplianceRequirements(pkg.id),
        // Görev listesi yalnız proje bağlamında anlamlı; yoksa "task eki"
        // kaynağı seçilebilir ama liste boş kalır.
        projectId ? getProjectTasks(projectId) : Promise.resolve([]),
      ]);
      setRequirements(items ?? []);
      setTasks(taskList ?? []);
    } catch (e) {
      abpNotify('error', 'Paket kalemleri yüklenemedi.');
      console.error('[Documents] package requirements', e);
    } finally {
      setLoading(false);
    }
  }, [pkg.id, projectId]);

  useEffect(() => { load(); }, [load]);

  const saveMeta = async () => {
    setBusy(true);
    try {
      await updateCompliancePackage(pkg.id, {
        name: meta.name, issuer: meta.issuer, description: meta.description || null, order: meta.order,
      });
      abpNotify('success', 'Paket güncellendi.');
      onChanged?.();
    } catch (e) {
      abpNotify('error', 'Paket güncellenemedi.');
      console.error('[Documents] update package', e);
    } finally {
      setBusy(false);
    }
  };

  const submitRequirement = async () => {
    setBusy(true);
    try {
      const payload = {
        title: draft.title.trim(),
        scope: Number(draft.scope),
        documentTypeId: draft.documentTypeId || null,
        isBlocking: draft.isBlocking,
        order: Number(draft.order) || requirements.length,
        source: Number(draft.source),
        sourceEntityId: draft.sourceEntityId || null,
      };

      if (editingId) {
        await updateComplianceRequirement(editingId, payload);
      } else {
        await addComplianceRequirement(pkg.id, payload);
      }

      setDraft(null);
      setEditingId(null);
      await load();
      onChanged?.();
    } catch (e) {
      abpNotify('error', 'Kalem kaydedilemedi.');
      console.error('[Documents] save requirement', e);
    } finally {
      setBusy(false);
    }
  };

  const removeRequirement = async (id) => {
    setBusy(true);
    try {
      await deleteComplianceRequirement(id);
      await load();
      onChanged?.();
    } catch (e) {
      abpNotify('error', 'Kalem silinemedi.');
      console.error('[Documents] delete requirement', e);
    } finally {
      setBusy(false);
    }
  };

  const removePackage = async () => {
    if (!window.confirm(`"${pkg.name}" paketi silinecek. Emin misiniz?`)) return;

    setBusy(true);
    try {
      await deleteCompliancePackage(pkg.id);
      onChanged?.();
      onClose();
    } catch (e) {
      // Projeye uygulanmış paket silinemez; sunucu sebebini söylüyor.
      abpNotify('error', e?.responseJSON?.error?.message || 'Paket silinemedi.');
      console.error('[Documents] delete package', e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="apya-doc-check-card">
      <div className="apya-doc-check-head">
        <span style={{ fontSize: 13.5, fontWeight: 600 }}>Paketi düzenle</span>
        <div className="flex-grow-1" />
        <button type="button" className="apya-doc-linkbtn" onClick={removePackage} disabled={busy}>
          Paketi sil
        </button>
        <button type="button" className="apya-doc-linkbtn" onClick={onClose}>Kapat</button>
      </div>

      <div className="d-flex flex-wrap gap-2">
        <Input
          size="sm" placeholder="Paket adı" value={meta.name}
          onChange={(e) => setMeta({ ...meta, name: e.target.value })}
        />
        <Input
          size="sm" placeholder="İsteyen taraf (ör. İç politika)" value={meta.issuer}
          onChange={(e) => setMeta({ ...meta, issuer: e.target.value })}
        />
        <Button size="sm" variant="outline" isLoading={busy} onClick={saveMeta}>Kaydet</Button>
      </div>

      {loading ? <SkeletonList rows={4} /> : (
        <div className="apya-doc-check-list">
          {requirements.length === 0 && (
            <div className="p-2" style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
              Bu pakette henüz kalem yok.
            </div>
          )}

          {requirements.map((req) => (
            <div key={req.id} className="apya-doc-check-row">
              <span className={cn('apya-chip', req.isBlocking ? 'apya-chip-warning' : 'apya-chip-neutral')}>
                {req.isBlocking ? 'bloke eden' : 'normal'}
              </span>

              <span style={{ minWidth: 0 }}>
                <span className="d-block text-truncate" style={{ fontSize: 13, fontWeight: 500 }}>{req.title}</span>
                <span className="d-block" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
                  {SOURCES.find((s) => s.value === req.source)?.label || 'kurum şablonu'}
                  {req.sourceEntityName && ` · ${req.sourceEntityName}`}
                  {' · '}{SCOPES.find((s) => s.value === req.scope)?.label}
                  {req.documentTypeName && ` · ${req.documentTypeName}`}
                </span>
              </span>

              <span />

              <span className="d-flex align-items-center gap-2 justify-content-end">
                <button
                  type="button" className="apya-doc-linkbtn" disabled={busy}
                  onClick={() => {
                    setEditingId(req.id);
                    setDraft({
                      title: req.title, scope: req.scope, documentTypeId: req.documentTypeId || '',
                      isBlocking: req.isBlocking, order: req.order,
                      source: req.source === 1 ? 2 : req.source,
                      sourceEntityId: req.sourceEntityId || '',
                    });
                  }}
                >
                  Düzenle
                </button>
                <button
                  type="button" className="apya-doc-linkbtn" disabled={busy}
                  onClick={() => removeRequirement(req.id)}
                >
                  Sil
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {draft ? (
        <RequirementForm
          draft={draft} setDraft={setDraft} documentTypes={documentTypes} tasks={tasks}
          onSubmit={submitRequirement}
          onCancel={() => { setDraft(null); setEditingId(null); }}
          busy={busy}
        />
      ) : (
        <Button
          size="sm" variant="outline" leadingIcon={<i className="fa fa-plus" />}
          onClick={() => { setEditingId(null); setDraft({ ...EMPTY_REQUIREMENT, order: requirements.length }); }}
        >
          Kalem ekle
        </Button>
      )}
    </div>
  );
}

/** Katalog şeridi: kiracının paketleri + yeni paket kurma. */
export function PackageCatalog({ packages, projectId, documentTypes, onChanged }) {
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const own = packages.filter((p) => p.isEditable);

  const create = async () => {
    setBusy(true);
    try {
      const created = await createCompliancePackage({
        name: name.trim(), issuer: 'İç politika', description: null, order: own.length,
      });
      setName('');
      setCreating(false);
      onChanged?.();
      setEditing(created);
    } catch (e) {
      abpNotify('error', 'Paket oluşturulamadı.');
      console.error('[Documents] create package', e);
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <PackageEditor
        pkg={editing}
        projectId={projectId}
        documentTypes={documentTypes}
        onClose={() => setEditing(null)}
        onChanged={onChanged}
      />
    );
  }

  return (
    <div className="apya-doc-check-card">
      <div className="apya-doc-check-head">
        <span className="apya-md-overline">Kendi paketleriniz</span>
        <div className="flex-grow-1" />
        {!creating && (
          <button type="button" className="apya-doc-linkbtn" onClick={() => setCreating(true)}>
            + Yeni paket
          </button>
        )}
      </div>

      <div style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
        Kurum paketleri (KOSGEB, TÜBİTAK) sistemde tanımlıdır ve değiştirilemez.
        Kendi klasör şemanız ve göreve bağlı ekleriniz için buradan paket kurun.
      </div>

      {creating && (
        <div className="d-flex gap-2">
          <Input
            size="sm" autoFocus placeholder="Paket adı (ör. Şirket klasör şeması)"
            value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) create(); }}
          />
          <Button size="sm" isLoading={busy} disabled={!name.trim()} onClick={create}>Oluştur</Button>
          <Button size="sm" variant="outline" onClick={() => { setCreating(false); setName(''); }}>Vazgeç</Button>
        </div>
      )}

      {own.length === 0 ? (
        <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>Henüz kendi paketiniz yok.</div>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {own.map((pkg) => (
            <Button key={pkg.id} variant="outline" size="sm" onClick={() => setEditing(pkg)}>
              {pkg.name}
              <Badge variant="neutral" size="sm">{pkg.requirementCount}</Badge>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
