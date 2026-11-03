import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '../components/ui';
import { RECIPIENT_LABEL } from './api';
import { GENERAL_GROUP_KEY, OWN_GROUP_KEY, groupOf, groupTemplates } from './templateGroups';

/**
 * Rapor derleyicinin sol kolonu: aranabilir, kuruma göre gruplu şablon listesi.
 *
 * Açılışta yalnız kendi şablonlar ve seçili şablonun grubu açık; diğer gruplar başlık
 * olarak durur. Arama yapılırken eşleşen gruplar kendiliğinden açılır.
 */

const cn = (...c) => c.filter(Boolean).join(' ');

const mutedText = { fontSize: 11, color: 'var(--apya-text-tertiary)' };

const groupHeadStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  width: '100%',
  padding: '6px 4px',
  border: 0,
  borderRadius: 6,
  background: 'transparent',
  color: 'var(--apya-text-secondary)',
  fontSize: 11.5,
  fontWeight: 600,
  textAlign: 'left',
};

// Uzun adlar (sıklık bilgisi sondadır: "… (6 ayda bir)") iki satıra sarılır, sonra kesilir.
const nameStyle = {
  fontSize: 12.5,
  fontWeight: 500,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  overflowWrap: 'anywhere',
};

/**
 * Alt satır yalnız bilgi taşıdığında basılır: kendi şablonda alıcı ve kurum, genel grupta
 * alıcı türü. Kurum grubunda her satır aynı ("Kurum") olacağı için basılmaz.
 */
function subtitleOf(template, groupKey) {
  const recipient = RECIPIENT_LABEL[template.recipient] ?? '—';
  if (groupKey === OWN_GROUP_KEY) return template.issuer ? `${recipient} · ${template.issuer}` : recipient;
  if (groupKey === GENERAL_GROUP_KEY) return recipient;
  return null;
}

function TemplateItem({ template, selected, groupKey, onSelect }) {
  const subtitle = subtitleOf(template, groupKey);

  return (
    <button
      type="button"
      className={cn('apya-md-item', selected && 'selected')}
      style={{ borderRadius: 8, height: 'auto', paddingTop: 7, paddingBottom: 7 }}
      aria-current={selected || undefined}
      title={template.name}
      onClick={() => onSelect(template.id)}
    >
      <span style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
        <span style={nameStyle}>{template.name}</span>
        {subtitle && (
          <span className="d-block" style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)' }}>
            {subtitle}
          </span>
        )}
      </span>
      <Badge variant="accent" size="sm">{template.enabledSectionCount}</Badge>
    </button>
  );
}

export function TemplatePicker({ templates, selectedId, onSelect }) {
  const [query, setQuery] = useState('');

  const selected = templates.find((t) => t.id === selectedId) ?? null;
  const selectedGroupKey = selected ? groupOf(selected).key : null;

  const [openGroups, setOpenGroups] = useState(
    () => new Set([OWN_GROUP_KEY, selectedGroupKey].filter(Boolean)),
  );

  // Seçim kapalı bir gruba geçerse (kopyalama, yeni şablon) o grup açılır.
  useEffect(() => {
    if (!selectedGroupKey) return;
    setOpenGroups((prev) => (prev.has(selectedGroupKey) ? prev : new Set(prev).add(selectedGroupKey)));
  }, [selectedGroupKey]);

  const groups = useMemo(() => groupTemplates(templates, query), [templates, query]);
  const searching = query.trim().length > 0;

  const toggle = (key) => setOpenGroups((prev) => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });

  return (
    <div className="apya-doc-check-card">
      <div className="d-flex align-items-center justify-content-between">
        <span className="apya-md-overline">Şablonlar</span>
        <span className="apya-numeric" style={mutedText}>{templates.length}</span>
      </div>

      {templates.length === 0 ? (
        <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>Şablon yok.</div>
      ) : (
        <>
          <label className="apya-console-search" style={{ width: '100%', margin: 0 }}>
            <i className="fa fa-magnifying-glass" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') setQuery(''); }}
              placeholder="Kurum ya da şablon ara…"
              aria-label="Şablon ara"
              style={{ flex: 1, width: 'auto', minWidth: 0 }}
            />
          </label>

          {groups.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
              Aramaya uyan şablon yok.
            </div>
          ) : (
            <div className="d-flex flex-column" style={{ gap: 2 }}>
              {groups.map((group, index) => {
                const open = searching || openGroups.has(group.key);
                const listId = `report-template-group-${index}`;
                const head = (
                  <>
                    <i
                      className={cn('fa', open ? 'fa-chevron-down' : 'fa-chevron-right')}
                      aria-hidden="true"
                      style={{ width: 10, fontSize: 9 }}
                    />
                    <span className="text-truncate" style={{ flex: 1, minWidth: 0 }}>{group.title}</span>
                    <span className="apya-numeric" style={mutedText}>{group.items.length}</span>
                  </>
                );

                return (
                  <div key={group.key}>
                    {searching ? (
                      <div style={groupHeadStyle}>{head}</div>
                    ) : (
                      <button
                        type="button"
                        style={{ ...groupHeadStyle, cursor: 'pointer' }}
                        aria-expanded={open}
                        aria-controls={listId}
                        onClick={() => toggle(group.key)}
                      >
                        {head}
                      </button>
                    )}

                    {open && (
                      <div id={listId} role="group" aria-label={group.title} className="d-flex flex-column" style={{ gap: 2 }}>
                        {group.items.map((t) => (
                          <TemplateItem
                            key={t.id}
                            template={t}
                            selected={t.id === selectedId}
                            groupKey={group.key}
                            onSelect={onSelect}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
