import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Input, SkeletonList } from '../components/ui';
import {
  abpNotify, addSubscriber, createSchedule, deleteSchedule, getSchedules,
  removeSubscriber, setScheduleEnabled,
} from './api';

/**
 * Zamanlanmış üretim ve aboneler.
 *
 * Zamanlama MEVCUT bir teslim paketini periyodik olarak yeniden üretir; her
 * üretim sürüm arşivine yeni bir satır ekler. Paket otomatik KURULMAZ — hangi
 * belgelerin ek olacağı kullanıcı kararıdır.
 *
 * Aboneye rapor DOSYASI e-postalanmaz; bildirim uygulamadaki arşive yönlendirir.
 */

const FREQUENCIES = [
  { value: 2, label: 'Aylık' },
  { value: 3, label: 'Üç aylık' },
  { value: 1, label: 'Haftalık' },
];

const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

const fmtDateTime = (iso) => (iso
  ? new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
  : '—');

function describe(schedule) {
  if (schedule.frequency === 1) return `Her ${DAYS[schedule.dayOfWeek]}, ${schedule.hourOfDay}:00`;
  const period = schedule.frequency === 3 ? 'üç ayda bir' : 'her ay';
  return `Ayın ${schedule.dayOfMonth}'i, ${period}, ${schedule.hourOfDay}:00`;
}

function SubscriberList({ schedule, busy, onChanged }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);

  const submit = async () => {
    try {
      await addSubscriber(schedule.id, { name: name.trim(), email: email.trim(), userId: null });
      setName('');
      setEmail('');
      setAdding(false);
      onChanged();
    } catch (e) {
      abpNotify('error', e?.responseJSON?.error?.message || 'Abone eklenemedi.');
    }
  };

  return (
    <div className="d-flex flex-column gap-2">
      <div className="apya-md-overline">Aboneler</div>

      {schedule.subscribers.length === 0 ? (
        <div style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
          Abone yok — üretim yine yapılır, kimse haberdar edilmez.
        </div>
      ) : schedule.subscribers.map((sub) => (
        <div key={sub.id} className="d-flex align-items-center gap-2" style={{ fontSize: 12 }}>
          <span className="text-truncate" style={{ flex: 1 }}>
            {sub.name} <span style={{ color: 'var(--apya-text-tertiary)' }}>· {sub.email}</span>
          </span>
          <button
            type="button" className="apya-doc-linkbtn" disabled={busy}
            onClick={async () => { await removeSubscriber(sub.id); onChanged(); }}
          >
            Çıkar
          </button>
        </div>
      ))}

      {adding ? (
        <div className="d-flex flex-wrap gap-2">
          <Input size="sm" placeholder="Ad" value={name} onChange={(e) => setName(e.target.value)} />
          <Input size="sm" type="email" placeholder="e-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button size="sm" disabled={!name.trim() || !email.trim()} onClick={submit}>Ekle</Button>
          <Button size="sm" variant="outline" onClick={() => setAdding(false)}>Vazgeç</Button>
        </div>
      ) : (
        <button type="button" className="apya-doc-linkbtn" onClick={() => setAdding(true)}>+ Abone ekle</button>
      )}
    </div>
  );
}

export function SchedulePanel({ projectId, packages }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState(null);

  const load = useCallback(async () => {
    if (!projectId) { setSchedules([]); setLoading(false); return; }

    setLoading(true);
    try {
      setSchedules((await getSchedules(projectId)) ?? []);
    } catch (e) {
      abpNotify('error', 'Zamanlamalar yüklenemedi.');
      console.error('[Documents] schedules', e);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const create = async () => {
    setBusy(true);
    try {
      await createSchedule({
        deliveryPackageId: draft.deliveryPackageId,
        frequency: Number(draft.frequency),
        dayOfMonth: Number(draft.dayOfMonth),
        dayOfWeek: Number(draft.dayOfWeek),
        hourOfDay: Number(draft.hourOfDay),
      });
      setDraft(null);
      await load();
    } catch (e) {
      abpNotify('error', 'Zamanlama kurulamadı.');
      console.error('[Documents] createSchedule', e);
    } finally {
      setBusy(false);
    }
  };

  if (!projectId) return null;
  if (loading) return <SkeletonList rows={3} />;

  return (
    <div className="apya-doc-check-card">
      <div className="apya-doc-check-head">
        <span style={{ fontSize: 13.5, fontWeight: 600 }}>Zamanlanmış üretim</span>
        <div className="flex-grow-1" />
        {!draft && packages.length > 0 && (
          <button
            type="button" className="apya-doc-linkbtn"
            onClick={() => setDraft({
              deliveryPackageId: packages[0].id, frequency: 2, dayOfMonth: 1, dayOfWeek: 1, hourOfDay: 6,
            })}
          >
            + Zamanlama ekle
          </button>
        )}
      </div>

      <div style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
        Seçtiğiniz teslim paketi bu ritimde yeniden üretilir; her üretim sürüm arşivine yeni
        bir satır ekler. Abonelere dosya değil, arşive götüren bir bildirim gider.
      </div>

      {packages.length === 0 && (
        <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
          Önce bir teslim paketi oluşturun — zamanlama mevcut bir paketi üretir.
        </div>
      )}

      {draft && (
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <select
            className="apya-doc-select" value={draft.deliveryPackageId}
            onChange={(e) => setDraft({ ...draft, deliveryPackageId: e.target.value })}
            aria-label="Paket"
          >
            {packages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <select
            className="apya-doc-select" value={draft.frequency}
            onChange={(e) => setDraft({ ...draft, frequency: Number(e.target.value) })}
            aria-label="Sıklık"
          >
            {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>

          {Number(draft.frequency) === 1 ? (
            <select
              className="apya-doc-select" value={draft.dayOfWeek}
              onChange={(e) => setDraft({ ...draft, dayOfWeek: Number(e.target.value) })}
              aria-label="Gün"
            >
              {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
          ) : (
            <select
              className="apya-doc-select" value={draft.dayOfMonth}
              onChange={(e) => setDraft({ ...draft, dayOfMonth: Number(e.target.value) })}
              aria-label="Ayın günü"
            >
              {/* 28'e kadar: şubatta atlanan bir zamanlama sessizce hiç üretmezdi. */}
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>Ayın {d}'i</option>
              ))}
            </select>
          )}

          <select
            className="apya-doc-select" value={draft.hourOfDay}
            onChange={(e) => setDraft({ ...draft, hourOfDay: Number(e.target.value) })}
            aria-label="Saat"
          >
            {Array.from({ length: 24 }, (_, i) => i).map((h) => (
              <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>
            ))}
          </select>

          <Button size="sm" isLoading={busy} onClick={create}>Kur</Button>
          <Button size="sm" variant="outline" onClick={() => setDraft(null)}>Vazgeç</Button>
        </div>
      )}

      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className="d-flex flex-column gap-2 p-2"
          style={{ background: 'var(--apya-surface-sunken)', borderRadius: 10 }}
        >
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{schedule.packageName}</span>
            <Badge variant={schedule.isEnabled ? 'positive' : 'neutral'} size="sm">
              {schedule.isEnabled ? 'açık' : 'kapalı'}
            </Badge>
            <span style={{ fontSize: 11.5, color: 'var(--apya-text-secondary)' }}>{describe(schedule)}</span>
            <div className="flex-grow-1" />
            <button
              type="button" className="apya-doc-linkbtn" disabled={busy}
              onClick={async () => {
                setBusy(true);
                try { await setScheduleEnabled(schedule.id, !schedule.isEnabled); await load(); }
                finally { setBusy(false); }
              }}
            >
              {schedule.isEnabled ? 'Duraklat' : 'Sürdür'}
            </button>
            <button
              type="button" className="apya-doc-linkbtn" disabled={busy}
              onClick={async () => { await deleteSchedule(schedule.id); await load(); }}
            >
              Sil
            </button>
          </div>

          <div className="d-flex gap-3 flex-wrap apya-numeric" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>
            <span>sıradaki: {fmtDateTime(schedule.nextRunAt)}</span>
            <span>son: {fmtDateTime(schedule.lastRunAt)}</span>
          </div>

          {/* Zamanlanmış üretim sessizce başarısız olmaz — sebep burada görünür. */}
          {schedule.lastError && (
            <div style={{ fontSize: 11.5, color: 'var(--apya-negative-500)' }}>
              Son deneme başarısız: {schedule.lastError}
            </div>
          )}

          <SubscriberList schedule={schedule} busy={busy} onChanged={load} />
        </div>
      ))}

      {schedules.length === 0 && !draft && packages.length > 0 && (
        <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>Kurulu zamanlama yok.</div>
      )}
    </div>
  );
}
