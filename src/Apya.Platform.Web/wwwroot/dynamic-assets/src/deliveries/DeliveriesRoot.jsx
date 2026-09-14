import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Button, EmptyState, Input, SkeletonList } from '../components/ui';
import { DocsPageHeader, EmptyActions, OverflowMenu, ProcessRibbon } from '../components/documents';
import {
  abpAppPath, abpAuth, abpNotify, addItems, createPackage, createShareLink, deletePackage,
  generate, getPackage, getPackages, getPreflight, getRuns, getShareLinks,
  getTemplates, removeItem, revokeShareLink, searchDocuments,
} from './api';
import { PreflightDialog } from './PreflightDialog';

/**
 * Teslimler & arşiv.
 *
 * Sol: paket listesi + rapor sürüm arşivi. Sağ: seçili paketin ek kurucusu,
 * preflight ve paylaşım linkleri.
 *
 * Proje bağlamı URL'den (?projectId=) gelir — bu sayfa Dokümanlar'daki bağlam
 * ağacından açılır; kendi proje seçicisini tekrar üretmiyoruz.
 */

const cn = (...c) => c.filter(Boolean).join(' ');

const fmt = {
  date: (iso) => (iso ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso)) : '—'),
  size: (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' MB';
  },
};

const STATUS_META = {
  1: { text: 'Taslak', chip: 'apya-chip-neutral' },
  2: { text: 'Üretildi', chip: 'apya-chip-positive' },
  3: { text: 'Gönderildi', chip: 'apya-chip-accent' },
};

const FORMAT = { Pdf: 1, Zip: 2, Excel: 4 };

function Toast({ message, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 3200);
    return () => clearTimeout(id);
  }, [onDone]);
  return <div className="apya-pop-in apya-doc-toast" role="status"><span style={{ fontSize: 12 }}>{message}</span></div>;
}

const sameId = (a, b) => String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase();

export function DeliveriesRoot() {
  const initialQuery = useMemo(() => new URLSearchParams(window.location.search), []);

  // Proje bağlamı URL'den gelir. Yalnız ?packageId= ile gelindiyse (belge
  // detayındaki "ilişkili kayıt" bağlantısı, rapor derleyicinin "Üret ve teslime
  // geç"i) paket açılır; proje yoksa paketin kendisinden çözülür.
  const [projectId, setProjectId] = useState(initialQuery.get('projectId'));
  const [resolvingProject, setResolvingProject] = useState(
    !initialQuery.get('projectId') && Boolean(initialQuery.get('packageId')),
  );
  const pendingPackageRef = useRef(initialQuery.get('packageId'));

  const [packages, setPackages] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [busy, setBusy] = useState(false);

  const [preflight, setPreflight] = useState(null);
  const [preflightLoading, setPreflightLoading] = useState(false);
  const [showPreflight, setShowPreflight] = useState(false);

  const [picker, setPicker] = useState('');
  const [pickerResults, setPickerResults] = useState([]);
  const [shareLinks, setShareLinks] = useState([]);
  const [toast, setToast] = useState(null);

  const canGenerate = abpAuth('Platform.Documents.GenerateReports');
  const canShare = abpAuth('Platform.Documents.ShareExternally');

  const load = useCallback(async () => {
    if (!projectId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [list, tpl, runList] = await Promise.all([
        getPackages(projectId), getTemplates(), getRuns(projectId),
      ]);
      setPackages(list ?? []);
      setTemplates(tpl ?? []);
      setRuns(runList ?? []);
    } catch (e) {
      abpNotify('error', 'Teslim paketleri yüklenemedi.');
      console.error('[Deliveries] load', e);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!resolvingProject) return;

    (async () => {
      try {
        const pkg = await getPackage(pendingPackageRef.current);
        // Yükleme bayrağı proje değişimiyle AYNI render'da kalkmalı: yoksa bekleyen
        // paket, yeni projenin listesi gelmeden boş listede aranıp düşürülür.
        setLoading(true);
        setProjectId(pkg.projectId);

        // Yenilemede bağlam kaybolmasın: proje adrese yazılır.
        const params = new URLSearchParams(window.location.search);
        params.set('projectId', pkg.projectId);
        window.history.replaceState(null, '', `${window.location.pathname}?${params}`);
      } catch (e) {
        pendingPackageRef.current = null;
        console.error('[Deliveries] resolve project', e);
      } finally {
        setResolvingProject(false);
      }
    })();
  }, [resolvingProject]);

  const openPackage = async (id) => {
    setSelectedId(id);
    try {
      const [pkg, links] = await Promise.all([getPackage(id), canShare ? getShareLinks(id) : Promise.resolve([])]);
      setDetail(pkg);
      setShareLinks(links ?? []);
    } catch (e) {
      abpNotify('error', 'Paket açılamadı.');
      console.error('[Deliveries] openPackage', e);
    }
  };

  /* Adresle gelen paket, liste yüklenince bir kez açılır. Başka projenin
     paketiyse (bozuk bağlantı) sessizce geçilir — liste zaten doğru projeyi gösteriyor. */
  useEffect(() => {
    if (loading || resolvingProject || !pendingPackageRef.current) return;

    const target = packages.find((p) => sameId(p.id, pendingPackageRef.current));
    pendingPackageRef.current = null;
    if (target) openPackage(target.id);
    // openPackage her render'da yeniden kuruluyor; yalnız yükleme bitişine bağlıyız.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, resolvingProject, packages]);

  const handleCreate = async () => {
    const name = window.prompt('Paket adı:');
    if (!name) return;

    setBusy(true);
    try {
      const created = await createPackage({
        projectId,
        name,
        formats: FORMAT.Pdf | FORMAT.Zip | FORMAT.Excel,
      });
      await load();
      await openPackage(created.id);
    } catch (e) {
      abpNotify('error', 'Paket oluşturulamadı.');
      console.error('[Deliveries] create', e);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    setBusy(true);
    try {
      await deletePackage(id);
      if (selectedId === id) { setSelectedId(null); setDetail(null); }
      await load();
    } catch (e) {
      abpNotify('error', 'Paket silinemedi.');
    } finally {
      setBusy(false);
    }
  };

  const handleSearch = async (text) => {
    setPicker(text);
    if (!text.trim()) { setPickerResults([]); return; }
    try {
      const result = await searchDocuments(projectId, text.trim());
      setPickerResults(result.items ?? []);
    } catch (e) {
      console.error('[Deliveries] search', e);
    }
  };

  const handleAdd = async (documentFileId) => {
    setBusy(true);
    try {
      setDetail(await addItems(detail.id, [documentFileId]));
      setPicker('');
      setPickerResults([]);
      await load();
    } catch (e) {
      abpNotify('error', 'Ek eklenemedi.');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (itemId) => {
    setBusy(true);
    try {
      setDetail(await removeItem(itemId));
      await load();
    } catch (e) {
      abpNotify('error', 'Ek çıkarılamadı.');
    } finally {
      setBusy(false);
    }
  };

  const openPreflight = async () => {
    setShowPreflight(true);
    setPreflightLoading(true);
    try {
      setPreflight(await getPreflight(detail.id));
    } catch (e) {
      abpNotify('error', 'Kontrol çalıştırılamadı.');
      setShowPreflight(false);
    } finally {
      setPreflightLoading(false);
    }
  };

  const handleGenerate = async () => {
    setBusy(true);
    try {
      const run = await generate(detail.id);
      setShowPreflight(false);
      setToast(`Paket üretildi — sürüm v${run.version}.`);
      setDetail(await getPackage(detail.id));
      await load();
    } catch (e) {
      // Sunucu bloke kalem bulursa buraya düşeriz; istemci düğmesi kapalı olsa bile.
      abpNotify('error', 'Paket üretilemedi — engelleyen kalemler olabilir.');
      console.error('[Deliveries] generate', e);
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    const days = Number(window.prompt('Kaç gün geçerli olsun?', '14'));
    if (!days || days < 1) return;

    const allowDownload = window.confirm('İndirmeye izin verilsin mi? (İptal = yalnız görüntüleme)');
    const watermark = window.prompt('Filigran metni (boş bırakılabilir):') || null;

    setBusy(true);
    try {
      const link = await createShareLink({
        targetType: 1, targetId: detail.id, lifetimeDays: days, allowDownload, watermark,
      });
      setShareLinks(await getShareLinks(detail.id));
      // Token yalnız bu yanıtta döner — kullanıcıya hemen gösterilmeli.
      window.prompt('Bağlantı (yalnız şimdi gösterilir, kopyalayın):', window.location.origin + link.url);
    } catch (e) {
      abpNotify('error', 'Bağlantı oluşturulamadı.');
    } finally {
      setBusy(false);
    }
  };

  /* --- Seçili paketin eylemleri ---
     Buton kuralı: tek birincil düğme. Taslakta iş "üretmek", üretilmiş pakette
     "indirmek"; geri kalan her şey paket başlığındaki ⋯ menüsünde. */
  const isDraft = detail?.status === 1;
  const downloadHref = detail
    ? `${window.abp.appPath}Documents/Deliveries?handler=DownloadPackage&packageId=${detail.id}`
    : null;

  const detailActions = detail ? [
    canGenerate && {
      key: 'generate', label: isDraft ? 'Paketi üret' : 'Yeniden üret', icon: 'fa-gears', disabled: busy, onSelect: openPreflight,
    },
    detail.hasOutput && { key: 'download', label: 'Çıktıyı indir', icon: 'fa-download', href: downloadHref },
    canShare && detail.hasOutput && {
      key: 'share', label: 'Paylaşım bağlantısı oluştur', icon: 'fa-share-nodes', disabled: busy, onSelect: handleShare,
    },
    canGenerate && isDraft && {
      key: 'delete', label: 'Paketi sil', icon: 'fa-trash', className: 'is-danger', disabled: busy, onSelect: () => handleDelete(detail.id),
    },
  ].filter(Boolean) : [];

  const primaryAction = detailActions.find((a) => a.key === (isDraft ? 'generate' : 'download')) ?? null;
  const menuActions = detailActions.filter((a) => a !== primaryAction);

  const page = (children) => (
    <div className="apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto" style={{ maxWidth: 1560 }}>
      <DocsPageHeader
        title="Teslimler & arşiv"
        description="Paket kurucu, üretim öncesi kontrol ve rapor sürümleri"
        menuItems={[
          canGenerate && projectId && {
            key: 'new', label: 'Yeni paket', icon: 'fa-plus', disabled: busy, onSelect: handleCreate,
          },
        ]}
      />
      <ProcessRibbon active="deliver" projectId={projectId} />
      {children}
    </div>
  );

  if (resolvingProject) return page(<SkeletonList rows={6} />);

  if (!projectId) {
    return page(
      <EmptyState
        icon={<i className="fa fa-box-open" />}
        title="Proje bağlamı gerekiyor"
        description="Bu sayfa Dokümanlar'daki bir proje bağlamından açılır (?projectId=...)."
        action={(
          <EmptyActions
            // Rapor derleyici projeyi seçtirir ve "Üret ve teslime geç" ile buraya bağlamla döner.
            primary={<Button asChild><a href={`${abpAppPath()}Documents/ReportBuilder`}>Rapor derleyiciye git</a></Button>}
            link={{ label: 'veya Projelere git', href: `${abpAppPath()}Projects` }}
          />
        )}
      />,
    );
  }

  return page(
    <>
      <div className="apya-docs-shell is-wide">
        <div className="apya-docs-tree" style={{ maxHeight: 'none' }}>
          <div className="apya-md-overline" style={{ padding: '4px 8px 6px' }}>Paketler</div>

          {loading ? (
            <div className="p-2"><SkeletonList rows={4} /></div>
          ) : packages.length === 0 ? (
            <div className="text-[11px] text-center py-5 px-2" style={{ color: 'var(--apya-text-tertiary)' }}>
              Henüz paket yok.
            </div>
          ) : packages.map((pkg) => {
            const status = STATUS_META[pkg.status] || STATUS_META[1];
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => openPackage(pkg.id)}
                className={cn('apya-md-item', selectedId === pkg.id && 'selected')}
                style={{ borderRadius: 8, height: 'auto', paddingTop: 6, paddingBottom: 6 }}
              >
                <span style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
                  <span className="d-block text-truncate" style={{ fontSize: 12.5, fontWeight: 500 }}>{pkg.name}</span>
                  <span className="d-block" style={{ fontSize: 10.5, color: 'var(--apya-text-tertiary)' }}>
                    {pkg.itemCount} ek{pkg.periodCode ? ` · ${pkg.periodCode}` : ''}
                  </span>
                </span>
                <span className={cn('apya-chip', status.chip)}>{status.text}</span>
              </button>
            );
          })}

          <div style={{ height: 1, background: 'var(--apya-border-subtle)', margin: '8px 4px' }} />
          <div className="apya-md-overline" style={{ padding: '0 8px 6px' }}>Sürüm arşivi</div>

          {runs.length === 0 ? (
            <div className="text-[11px] px-2 pb-2" style={{ color: 'var(--apya-text-tertiary)' }}>
              Henüz üretim yapılmadı.
            </div>
          ) : runs.map((run) => (
            <a
              key={run.id}
              href={run.downloadUrl}
              className="apya-md-item"
              style={{ borderRadius: 8, textDecoration: 'none' }}
            >
              <i className="fa fa-file-arrow-down" style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }} />
              <span className="apya-md-item-title">
                v{run.version} · {run.reportTemplateName || 'Rapor'}
              </span>
              <span className="apya-md-item-side apya-numeric" style={{ fontSize: 10.5 }}>
                {fmt.size(run.outputSize)}
              </span>
            </a>
          ))}
        </div>

        <div className="apya-docs-main">
          {!detail ? (
            !loading && packages.length === 0 ? (
              <EmptyState
                icon={<i className="fa fa-box" />}
                title="Henüz paket yok"
                description="Paket, rapor derleyicide seçtiğiniz şablonla ya da buradan boş olarak oluşturulur."
                action={canGenerate && (
                  <EmptyActions
                    primary={<Button leadingIcon={<i className="fa fa-plus" />} disabled={busy} onClick={handleCreate}>Yeni paket</Button>}
                    link={{ label: 'veya rapor derleyiciden başla', href: `${abpAppPath()}Documents/ReportBuilder?projectId=${projectId}` }}
                  />
                )}
              />
            ) : (
              <EmptyState
                icon={<i className="fa fa-box" />}
                title="Bir paket seçin"
                description="Ekleri sıralayın, kontrolü çalıştırın ve paketi üretin."
              />
            )
          ) : (
            <div className="p-3 d-flex flex-column gap-3">
              <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{detail.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
                    {detail.reportTemplateName || 'Şablon seçilmedi'}
                    {detail.periodCode && ` · ${detail.periodCode}`}
                    {detail.generatedAt && ` · ${fmt.date(detail.generatedAt)} üretildi`}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {primaryAction && (primaryAction.href ? (
                    <Button asChild size="sm" leadingIcon={<i className={`fa ${primaryAction.icon}`} />}>
                      <a href={primaryAction.href}>{primaryAction.label}</a>
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm" disabled={primaryAction.disabled} onClick={primaryAction.onSelect}>
                      {primaryAction.label}
                    </Button>
                  ))}
                  <OverflowMenu size="sm" label="Paket eylemleri" items={menuActions} />
                </div>
              </div>

              {detail.status !== 1 && (
                <div style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
                  <i className="fa fa-lock" /> Üretilmiş paket düzenlenemez — içerik değişirse denetim izi anlamsızlaşır.
                </div>
              )}

              {detail.status === 1 && canGenerate && (
                <div>
                  <Input
                    size="sm"
                    placeholder="Ek eklemek için belge ara"
                    leading={<i className="fa fa-search" style={{ fontSize: 11 }} />}
                    value={picker}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {pickerResults.length > 0 && (
                    <div className="mt-2 d-flex flex-column gap-1">
                      {pickerResults.slice(0, 8).map((file) => (
                        <button
                          key={file.id}
                          type="button"
                          className="apya-md-item"
                          style={{ borderRadius: 8 }}
                          onClick={() => handleAdd(file.id)}
                        >
                          <i className="fa fa-plus" style={{ fontSize: 10, color: 'var(--apya-accent-500)' }} />
                          <span className="apya-md-item-title">{file.displayName}</span>
                          <span className="apya-md-item-side" style={{ fontSize: 10.5 }}>
                            {file.documentTypeName || '—'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <div className="apya-md-overline mb-2">Ekler ({detail.items.length})</div>
                {detail.items.length === 0 ? (
                  <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)' }}>
                    Pakette henüz ek yok — boş paket üretilemez.
                  </div>
                ) : (
                  <div>
                    {detail.items.map((item) => (
                      <div key={item.id} className="apya-doc-check-row" style={{ gridTemplateColumns: '70px minmax(0,1fr) 110px 90px' }}>
                        <span className="apya-numeric" style={{ fontSize: 12, fontWeight: 600 }}>{item.annexNumber}</span>
                        <span className="text-truncate" style={{ fontSize: 12.5 }}>{item.documentFileName}</span>
                        <span className="apya-numeric" style={{ fontSize: 11.5, color: 'var(--apya-text-tertiary)' }}>
                          {fmt.size(item.fileSize)}
                        </span>
                        <span className="text-end">
                          {item.expiryDate && new Date(item.expiryDate) <= new Date() && (
                            <Badge variant="negative" size="sm">Süresi dolmuş</Badge>
                          )}
                          {detail.status === 1 && canGenerate && (
                            <button type="button" className="apya-doc-linkbtn" disabled={busy} onClick={() => handleRemove(item.id)}>
                              Çıkar
                            </button>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {canShare && shareLinks.length > 0 && (
                <div>
                  <div className="apya-md-overline mb-2">Paylaşım bağlantıları</div>
                  {shareLinks.map((link) => (
                    <div key={link.id} className="apya-doc-activity-row" style={{ gridTemplateColumns: '110px minmax(0,1fr) 120px 90px' }}>
                      <Badge variant={link.isActive ? 'positive' : 'neutral'} size="sm">
                        {link.isActive ? 'Aktif' : link.revokedAt ? 'İptal' : 'Süresi doldu'}
                      </Badge>
                      <span style={{ fontSize: 11.5 }}>
                        {link.allowDownload ? 'İndirme açık' : 'Yalnız görüntüleme'}
                        {link.watermark && ` · ${link.watermark}`}
                      </span>
                      <span className="apya-numeric" style={{ fontSize: 11 }}>
                        {fmt.date(link.expiresAt)} · {link.accessCount} erişim
                      </span>
                      <span className="text-end">
                        {link.isActive && (
                          <button type="button" className="apya-doc-linkbtn" disabled={busy} onClick={async () => {
                            await revokeShareLink(link.id);
                            setShareLinks(await getShareLinks(detail.id));
                          }}>
                            İptal et
                          </button>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showPreflight && (
        <PreflightDialog
          result={preflight}
          loading={preflightLoading}
          busy={busy}
          onGenerate={handleGenerate}
          onClose={() => setShowPreflight(false)}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>,
  );
}
