import React, { useEffect, useState } from 'react';
import { Badge, Button, buttonVariants, EmptyState, Hint, Input, SkeletonList } from '../../components/ui';
import { abpAppPath } from '../api';
import { cn, fmt, fileVisual, FILL_SOURCE_META, STATUS_META } from '../format';
import { TagChips } from './FileList';

/**
 * İlişkili kayıt türü → ikon, etiket ve derin link.
 * Anahtarlar RelatedRecordKind enum DEĞERLERİDİR (sunucu enum'ları sayı olarak
 * serileştirir). Kontrol listesi kaleminin kendi sayfası yok; link üretmiyoruz.
 */
const RELATED_META = {
  1: { icon: 'fa-diagram-project', label: 'Proje' },
  2: { icon: 'fa-list-check', label: 'İş adımı' },
  3: { icon: 'fa-receipt', label: 'Harcama', href: (id) => (id ? `${abpAppPath()}Expenses` : null) },
  4: {
    icon: 'fa-box-archive',
    label: 'Teslim paketi',
    href: (id) => (id ? `${abpAppPath()}Documents/Deliveries?packageId=${id}` : null),
  },
  5: { icon: 'fa-clipboard-check', label: 'Kontrol listesi kalemi' },
};

/**
 * Sağ detay paneli: künye + özel meta alanları + versiyon geçmişi.
 *
 * Onay akışı / e-imza / KEP bu fazın kapsamı dışında; mockup'ta o kart için
 * ayrılan yer bilinçli olarak boş bırakıldı (yer tutucu da basmıyoruz).
 */

function FieldInput({ field, value, onChange, disabled }) {
  const common = { size: 'sm', disabled, value: value ?? '' };

  switch (field.fieldType) {
    case 2: // Date
      return <Input {...common} type="date" onChange={(e) => onChange({ valueDate: e.target.value || null })} />;
    case 3: // Money
    case 4: // Number
    case 5: // Percent
      return (
        <Input
          {...common}
          type="number"
          step={field.fieldType === 3 ? '0.01' : '1'}
          onChange={(e) => onChange({ valueNumber: e.target.value === '' ? null : Number(e.target.value) })}
        />
      );
    default: // Text / Select / Relation — Faz A'da hepsi düz metin girişi
      return <Input {...common} onChange={(e) => onChange({ valueText: e.target.value || null })} />;
  }
}

function valueOf(field) {
  if (field.fieldType === 2) return field.valueDate ? field.valueDate.substring(0, 10) : '';
  if ([3, 4, 5].includes(field.fieldType)) return field.valueNumber ?? '';
  return field.valueText ?? '';
}

export function DetailPanel({
  detail, loading, canEdit, onSave, onDelete, saving, documentTypes,
}) {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    setDraft(detail ? { ...detail, fields: (detail.fields || []).map((f) => ({ ...f })) } : null);
  }, [detail?.id]);

  if (loading) {
    return <div className="apya-md-detail"><SkeletonList rows={6} /></div>;
  }

  if (!detail || !draft) {
    return (
      <div className="apya-md-detail">
        <EmptyState
          icon={<i className="fa fa-file-lines" />}
          title="Bir belge seçin"
          description="Künye, özel alanlar ve versiyon geçmişi burada görünür."
        />
      </div>
    );
  }

  const visual = fileVisual(detail.contentType, detail.fileName);
  const status = STATUS_META[draft.status] || STATUS_META[1];
  const daysLeft = fmt.daysLeft(draft.expiryDate);

  const patchField = (fieldId, patch) => {
    setDraft((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.fieldId === fieldId
        ? { ...f, valueText: null, valueNumber: null, valueDate: null, ...patch }
        : f)),
    }));
  };

  const dirtyRequired = draft.fields.filter(
    (f) => f.isRequired && !f.valueText && f.valueNumber === null && !f.valueDate,
  );

  return (
    <div className="apya-md-detail" style={{ overflowY: 'auto' }}>
      <div className="d-flex align-items-start gap-3 mb-3">
        <div
          className="d-grid place-items-center flex-shrink-0"
          style={{ width: 48, height: 48, borderRadius: 14, background: `${visual.color}1a`, color: visual.color, fontSize: 20 }}
        >
          <i className={`fa ${visual.icon}`} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, wordBreak: 'break-word' }}>{detail.displayName}</div>
          <div className="apya-numeric mt-1" style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
            {fmt.size(detail.fileSize)} · {visual.label}
            {detail.versionCount > 1 && ` · v${detail.versionCount}`}
          </div>
          <div className="d-flex align-items-center gap-1 mt-1 flex-wrap">
            <span className={cn('apya-chip', status.chip)}>{status.text}</span>
            {daysLeft !== null && daysLeft >= 0 && daysLeft <= 30 && (
              <Badge variant="warning" size="sm"><i className="fa fa-hourglass-half" /> {daysLeft} gün</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3">
        {detail.downloadUrl && (
          <a href={detail.downloadUrl} className={buttonVariants({ variant: 'primary' })} style={{ flex: 1 }}>
            <i className="fa fa-download" /> İndir
          </a>
        )}
        {canEdit && !detail.isLocked && (
          <Button variant="outline" onClick={() => onDelete(detail)} title="Sil">
            <i className="fa fa-trash" style={{ color: 'var(--apya-negative-500)' }} />
          </Button>
        )}
      </div>

      {/* --- Künye --- */}
      <div className="row g-2 mb-3">
        <div className="col-6">
          <div className="apya-md-overline">Klasör</div>
          <div style={{ fontSize: 12 }}>{detail.folderName || '—'}</div>
        </div>
        <div className="col-6">
          <div className="apya-md-overline">İş adımı</div>
          <div style={{ fontSize: 12 }}>
            {detail.workStepName ? `${detail.workStepOrder} · ${detail.workStepName}` : '—'}
          </div>
        </div>
        <div className="col-6">
          <div className="apya-md-overline">Yükleyen</div>
          <div style={{ fontSize: 12 }}>{detail.uploaderName || 'Sistem'}</div>
        </div>
        <div className="col-6">
          <div className="apya-md-overline">Yükleme</div>
          <div className="apya-numeric" style={{ fontSize: 11.5 }}>{fmt.dateTime(detail.creationTime)}</div>
        </div>
        {detail.retentionUntil && (
          <div className="col-12">
            <div className="apya-md-overline">Saklama</div>
            <div className="apya-numeric" style={{ fontSize: 11.5 }}>{fmt.date(detail.retentionUntil)}</div>
          </div>
        )}
      </div>

      {/* --- Sınıflandırma + özel alanlar --- */}
      <div className="mb-3">
        <div className="apya-md-overline mb-2 d-flex align-items-center">
          Özel alanlar
          <Hint text="Alan şeması belge tipine bağlıdır. Tip değiştirdiğinizde kaydettikten sonra o tipin alanları görünür." />
        </div>

        <div className="d-flex flex-column gap-2">
          <label className="d-flex flex-column gap-1">
            <span style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>Belge tipi</span>
            <select
              className="apya-select"
              disabled={!canEdit || detail.isLocked}
              value={draft.documentTypeId || ''}
              onChange={(e) => setDraft({ ...draft, documentTypeId: e.target.value || null })}
            >
              <option value="">— Sınıflandırılmamış —</option>
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </label>

          <label className="d-flex flex-column gap-1">
            <span style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>Tutar</span>
            <Input
              size="sm"
              type="number"
              step="0.01"
              disabled={!canEdit || detail.isLocked}
              value={draft.amount ?? ''}
              onChange={(e) => setDraft({ ...draft, amount: e.target.value === '' ? null : Number(e.target.value) })}
            />
          </label>

          <label className="d-flex flex-column gap-1">
            <span style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>Belge tarihi</span>
            <Input
              size="sm"
              type="date"
              disabled={!canEdit || detail.isLocked}
              value={draft.documentDate ? draft.documentDate.substring(0, 10) : ''}
              onChange={(e) => setDraft({ ...draft, documentDate: e.target.value || null })}
            />
          </label>

          <label className="d-flex flex-column gap-1">
            <span style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>Dönem</span>
            <Input
              size="sm"
              placeholder="2026-Q2"
              disabled={!canEdit || detail.isLocked}
              value={draft.periodCode ?? ''}
              onChange={(e) => setDraft({ ...draft, periodCode: e.target.value || null })}
            />
          </label>

          {draft.fields.map((field) => (
            <label key={field.fieldId} className="d-flex flex-column gap-1">
              <span className="d-flex align-items-center gap-1" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
                {field.label}
                {field.isRequired && <span style={{ color: 'var(--apya-negative-500)' }}>*</span>}
                <Badge variant={FILL_SOURCE_META[field.fillSource]?.variant || 'neutral'} size="sm">
                  {FILL_SOURCE_META[field.fillSource]?.text || '—'}
                </Badge>
                {field.confidence !== null && field.confidence !== undefined && (
                  <span className="apya-numeric" style={{ fontSize: 10 }}>%{field.confidence}</span>
                )}
              </span>
              <FieldInput
                field={field}
                value={valueOf(field)}
                disabled={!canEdit || detail.isLocked}
                onChange={(patch) => patchField(field.fieldId, patch)}
              />
            </label>
          ))}
        </div>

        {dirtyRequired.length > 0 && (
          <div className="mt-2" style={{ fontSize: 11, color: 'var(--apya-warning-500)' }}>
            <i className="fa fa-triangle-exclamation" /> {dirtyRequired.length} zorunlu alan boş.
          </div>
        )}

        {canEdit && !detail.isLocked && (
          <Button
            variant="primary"
            size="sm"
            className="mt-3 w-100"
            isLoading={saving}
            onClick={() => onSave(draft)}
          >
            Kaydet
          </Button>
        )}
      </div>

      {detail.tags?.length > 0 && (
        <div className="mb-3">
          <div className="apya-md-overline mb-2">Etiketler</div>
          <TagChips tags={detail.tags} />
        </div>
      )}

      {/* --- İlişkili kayıtlar --- */}
      {detail.related?.length > 0 && (
        <div className="mb-3">
          <div className="apya-md-overline mb-2 d-flex align-items-center">
            İlişkili kayıtlar
            <Hint text="Belgenin bağlandığı harcama, içinde gittiği teslim paketi ve karşıladığı kontrol listesi kalemleri." />
          </div>
          <div className="d-flex flex-column gap-2">
            {detail.related.map((record, index) => {
              const meta = RELATED_META[record.kind] ?? RELATED_META[3];
              const href = meta.href?.(record.entityId);

              const body = (
                <>
                  <span
                    className="d-grid place-items-center flex-shrink-0"
                    style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--apya-surface-sunken)', color: 'var(--apya-text-secondary)', fontSize: 10 }}
                  >
                    <i className={`fa ${meta.icon}`} />
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span className="d-block text-truncate" style={{ fontSize: 12 }}>{record.label}</span>
                    <span
                      className="d-block text-truncate apya-numeric"
                      style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)' }}
                    >
                      {[meta.label, record.detail].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                </>
              );

              return href ? (
                <a
                  key={`${record.kind}-${record.entityId}-${index}`}
                  href={href}
                  className="d-flex align-items-center gap-2 text-decoration-none"
                  style={{ color: 'inherit' }}
                >
                  {body}
                </a>
              ) : (
                <div key={`${record.kind}-${index}`} className="d-flex align-items-center gap-2">{body}</div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- Versiyonlar --- */}
      <div>
        <div className="apya-md-overline mb-2 d-flex align-items-center">
          Versiyonlar
          <Hint text="Aynı klasöre aynı isimle yeniden yüklenen dosya yeni versiyon olur; önceki versiyonlar burada kalır." />
        </div>
        {!detail.versions?.length ? (
          <div style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>Versiyon kaydı yok.</div>
        ) : (
          <div className="d-flex flex-column gap-1">
            {detail.versions.map((version) => (
              <div key={version.id} className="d-flex align-items-center justify-content-between" style={{ fontSize: 11.5 }}>
                <span className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                  <Badge variant={version.isLatest ? 'brand' : 'neutral'} size="sm">v{version.versionNumber}</Badge>
                  <span className="text-truncate" style={{ color: 'var(--apya-text-secondary)' }}>{version.uploaderName}</span>
                </span>
                <span className="apya-numeric" style={{ color: 'var(--apya-text-tertiary)' }}>
                  {fmt.date(version.creationTime)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
