import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, ModalPortal, useRetryFocus } from '../components/ui';
import {
  DocsPageHeader, EmptyActions, ProcessRibbon, sameSummary, useComplianceOverview,
} from '../components/documents';
import {
  abpAuth, abpDocument, abpNotify, abpAppPath,
  bulkMoveFiles, bulkTagFiles, deleteFile, getDocumentTypes, getFile, getFiles,
  applySuggestions, dismissSuggestions, getSetupState, getSuggestions,
  getWorkSteps, linkComplianceDocument, moveFile, restoreFile, updateFileMeta, uploadAttachment,
} from './api';
import { cn, fmt } from './format';
import { wasShown } from '../lib/api/abpErrors';
import { ContextTree } from './components/ContextTree';
import { BulkBar, FileList } from './components/FileList';
import { DetailPanel } from './components/DetailPanel';
import { ComplianceTab } from './components/ComplianceTab';
import { ActivityTab } from './components/ActivityTab';
import { SuggestionBanner } from './components/SuggestionBanner';
import { SetupWizard } from './components/SetupWizard';

const PAGE_SIZE = 25;

/** Hiçbir belgeyle eşleşmeyen kimlik — "öneri yok" durumunu boş listeye çevirir. */
const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

/* ─── Küçük yardımcı bileşenler ───────────────────────────────────────── */

function Toast({ message, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2800);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <div className="apya-pop-in apya-doc-toast" role="status">
      <i className="fa fa-check" style={{ fontSize: 11, color: 'var(--apya-positive-500)' }} />
      <span style={{ fontSize: 12 }}>{message}</span>
    </div>
  );
}

function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);
  return (
    <ModalPortal>
    <div className="apya-in apya-doc-overlay" onClick={onCancel}>
      <div className="apya-pop-in apya-doc-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex align-items-start gap-3 mb-3">
          <div
            className="d-grid place-items-center flex-shrink-0"
            style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(248,113,113,.12)', color: 'var(--apya-negative-500)' }}
          >
            <i className="fa fa-trash" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--apya-text-tertiary)', marginTop: 4 }}>{message}</div>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="outline" size="sm" onClick={onCancel}>Vazgeç</Button>
          <Button
            variant="destructive" size="sm" isLoading={busy}
            onClick={async () => { setBusy(true); await onConfirm(); setBusy(false); }}
          >
            Evet, sil
          </Button>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}

/** KPI şeridi. Uygunluk ve eksik belge yalnız bir proje bağlamı seçiliyken
    doluyor — proje yokken kontrol listesi tanımsızdır ve sahte sayı basmıyoruz.
    Proje seçiliyken özet yükleniyorsa alt satır boş, okunamadıysa "Yüklenemedi". */
function KpiStrip({ uploadedThisMonth, expiring, compliance, hasProject, complianceFailed }) {
  const tiles = [
    {
      key: 'compliance',
      label: 'Uygunluk',
      value: compliance ? `%${compliance.percent}` : '—',
      icon: 'fa-clipboard-check',
      tone: 'positive',
      foot: compliance
        ? `${compliance.satisfiedCount} / ${compliance.totalCount - compliance.waivedCount} kalem tamam`
        : hasProject ? (complianceFailed ? 'Yüklenemedi' : null) : 'Proje bağlamı seçin',
    },
    {
      key: 'missing',
      label: 'Eksik belge',
      value: compliance ? compliance.missingCount : '—',
      icon: 'fa-triangle-exclamation',
      tone: 'warning',
      foot: compliance && compliance.blockingMissingCount > 0
        ? `${compliance.blockingMissingCount} tanesi teslimi bloke ediyor`
        : null,
    },
    {
      key: 'uploaded',
      label: 'Bu ay yüklenen',
      value: uploadedThisMonth ?? '—',
      icon: 'fa-arrow-up-from-bracket',
      tone: 'accent',
      // "Dönem" bu ekranda seçili değil; ölçülebilir tek pencere takvim ayı.
      foot: 'ayın 1\'inden bugüne',
    },
    { key: 'expiring', label: 'Süresi dolan', value: expiring ?? '—', icon: 'fa-clock-rotate-left', tone: 'negative' },
  ];

  return (
    <div className="apya-doc-kpis">
      {tiles.map((tile) => (
        <div key={tile.key} className="apya-doc-kpi">
          <div className="d-flex align-items-center gap-2">
            <span className={cn('apya-doc-kpi-icon', `is-${tile.tone}`)}><i className={`fa ${tile.icon}`} /></span>
            <span className="apya-md-overline">{tile.label}</span>
          </div>
          <div className="apya-numeric apya-doc-kpi-value">{tile.value}</div>
          {tile.foot && (
            <div style={{ fontSize: 11, color: 'var(--apya-text-tertiary)' }}>{tile.foot}</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Ana bileşen ─────────────────────────────────────────────────────── */

export function DocumentsRoot() {
  const [folders, setFolders] = useState([]);
  const [workSteps, setWorkSteps] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loadingTree, setLoadingTree] = useState(true);
  // Yükleme hatası (null = yok). "Başarılı ve boş" ile karışmasın diye ayrı tutulur.
  const [treeError, setTreeError] = useState(null);

  const [files, setFiles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [expiringCount, setExpiringCount] = useState(null);
  const [uploadedThisMonth, setUploadedThisMonth] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [filesError, setFilesError] = useState(null);

  /* --- URL, filtrelerin tek doğruluk kaynağı ---
     Üst bardaki kayıtlı görünüm çipi ekranın FİLTRE URL'İNİ adlandırıp saklıyor
     ve uygularken sayfayı o sorguyla yeniden açıyor. Filtreler yalnız React
     state'inde yaşasaydı kaydedilen görünüm boş bir ekran açardı. */
  const initialQuery = useMemo(() => new URLSearchParams(window.location.search), []);

  const [node, setNode] = useState(() => {
    const smart = initialQuery.get('smart');
    if (smart) return { key: smart, kind: 'smart', smart };

    // Klasör ve iş adımı süzgeci ağaca ihtiyaç duymaz: ilk istek doğru bağlamla
    // gider, ağaç yüklenemese de bağlam ve adres korunur. Ağaç gelince aşağıdaki
    // geri yükleme effect'i düğümü projeyle zenginleştirir; anahtarlar ağaçtakiyle
    // aynı biçimde olduğu için vurgu da kendiliğinden oturur (DOC-V01).
    const folderId = initialQuery.get('folder');
    if (folderId) return { key: `folder-${folderId}`, kind: 'folder', documentId: folderId };
    const stepId = initialQuery.get('step');
    if (stepId) return { key: `step-${stepId}`, kind: 'workstep', workStepId: stepId };

    // Süreç şeridinden (?projectId=) gelindi: bağlam ağaç yüklenmeden de proje
    // düzeyinde kurulur. Projenin klasörü ağaçta varsa aşağıdaki geri yükleme
    // effect'i düğümü o klasöre çevirir; yoksa proje düğümü olarak kalır.
    const projectId = initialQuery.get('projectId');
    if (projectId) return { key: `project-${projectId}`, kind: 'project', projectId };

    return { key: 'all', kind: 'all' };
  });
  const initialNodeRef = useRef(node);
  // ?projectId= ağaçtaki proje klasörüne çevrilecek; liste önce proje, sonra
  // klasörle iki kez gelip yanıp sönmesin diye ağaç çözülene kadar beklenir.
  const [restoring, setRestoring] = useState(() => node.kind === 'project');

  // Yükleme yalnız klasör bağlamında yapılır; uygunluk ve etkinlik ise proje
  // kapsamında çalışır — klasör de iş adımı da projeyi taşır. Aşağıdaki
  // yükleyicilerin bağımlılığı olduğu için burada, node'un hemen ardında durur.
  const activeFolderId = node.kind === 'folder' ? node.documentId : null;
  const activeProjectId = node.projectId || null;

  // Çöp kutusu: satırlar silinmiş belgeler, tek eylem geri alma.
  const isTrash = node.kind === 'smart' && node.smart === 'trash';
  const [expanded, setExpanded] = useState(new Set());
  const [search, setSearch] = useState(initialQuery.get('q') || '');
  const [sorting, setSorting] = useState(initialQuery.get('sort') || 'creationTime desc');
  const [view, setView] = useState(initialQuery.get('view') === 'grid' ? 'grid' : 'list');
  const [page, setPage] = useState(Number(initialQuery.get('page')) || 0);

  // Arama her tuşta istek atmasın; sayfa sıfırlaması da aynı anda, uygulanan
  // metinle yapılır. Eşitlik koşulu açılışta ?page= derin bağlantısını sıfırlamaz.
  const [appliedSearch, setAppliedSearch] = useState(search);
  useEffect(() => {
    if (search === appliedSearch) return undefined;
    const id = setTimeout(() => { setAppliedSearch(search); setPage(0); }, 300);
    return () => clearTimeout(id);
  }, [search, appliedSearch]);

  const [tab, setTab] = useState(() => {
    const requested = initialQuery.get('tab');
    return ['files', 'compliance', 'activity'].includes(requested) ? requested : 'files';
  });

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);

  const [checkedIds, setCheckedIds] = useState(new Set());
  const [dragTarget, setDragTarget] = useState(null);
  const draggedRef = useRef([]);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [setupState, setSetupState] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);
  const [suggestionBusy, setSuggestionBusy] = useState(false);

  // "Yükle" düğmesine basılan eksik kalem; yükleme bitince buna bağlanır.
  const pendingRequirementRef = useRef(null);

  const canCreate = abpAuth('Platform.Documents.Create');
  const canEditMeta = abpAuth('Platform.Documents.ManageMeta');
  const canBulk = abpAuth('Platform.Documents.BulkOperations');
  const canDelete = abpAuth('Platform.Documents.Delete');

  const flash = useCallback((msg) => setToast(msg), []);

  /* --- Ağaç verisi ---
     Yükleme hatası ağaçta kart olarak gösterilir (toast ve ABP penceresi yok). Son
     iyi ağaç varsa (mutasyon sonrası tazeleme düştü) ağaç kalır, üstünde uyarı durur.
     Yalnız son istek yazar: eşzamanlı iki tazelemede geç dönen eski yanıt yeniyi ezmez.
     Klasör listesi zorunlu; iş adımları ve belge türleri zenginleştirme — okunamazlarsa
     (ör. Projeler izni olmayan rolde 403) ağaç onlarsız çizilir, hata kartı çıkmaz. */
  const treeRequestRef = useRef(0);
  const loadTree = useCallback(async () => {
    const request = ++treeRequestRef.current;
    setLoadingTree(true);
    try {
      const [folderResult, steps, types] = await Promise.all([
        abpDocument().getList({ maxResultCount: 1000, sorting: 'title asc' }, { abpHandleError: false }),
        getWorkSteps(null, { abpHandleError: false }).catch(() => []),
        getDocumentTypes({ abpHandleError: false }).catch(() => []),
      ]);
      if (request !== treeRequestRef.current) return;
      setFolders(folderResult.items ?? []);
      setWorkSteps(steps ?? []);
      setDocumentTypes(types ?? []);
      setTreeError(null);
    } catch (e) {
      if (request !== treeRequestRef.current) return;
      setTreeError(e);
      console.error('[Documents] loadTree', e);
    } finally {
      if (request === treeRequestRef.current) setLoadingTree(false);
    }
  }, []);

  useEffect(() => { loadTree(); }, [loadTree]);

  /* --- Aktif düğüm → sorgu filtresi --- */
  const filter = useMemo(() => {
    const base = { maxResultCount: PAGE_SIZE, skipCount: page * PAGE_SIZE, sorting };
    if (appliedSearch.trim()) base.filterText = appliedSearch.trim();

    if (node.kind === 'folder') {
      base.documentId = node.documentId;
      base.includeSubFolders = true;
    } else if (node.kind === 'workstep') {
      base.workStepId = node.workStepId;
    } else if (node.kind === 'project') {
      base.projectId = node.projectId;
    } else if (node.kind === 'smart' && node.smart === 'expiring') {
      base.expiringWithinDays = 30;
    } else if (node.kind === 'smart' && node.smart === 'missing-meta') {
      base.missingRequiredFields = true;
    } else if (node.kind === 'smart' && node.smart === 'trash') {
      base.onlyDeleted = true;
    } else if (node.kind === 'smart' && node.smart === 'suggested') {
      // Öneriler saklanmıyor; süzgeç hesaplanan kimlik kümesiyle kurulur.
      // Henüz yüklenmediyse boş küme gönderilir → liste boş, sahte sonuç yok.
      base.documentFileIds = [...new Set((suggestions?.items ?? []).map((i) => i.documentFileId))];
      if (base.documentFileIds.length === 0) base.documentFileIds = [EMPTY_GUID];
    }

    return base;
  }, [node, page, sorting, appliedSearch, suggestions]);

  /* Bağlam ref'ten okunur: mutasyon sonrası yenilemeler (yükleme, taşıma, öneri)
     o sırada başka düğüme geçildiyse eski bağlamı değil güncelini ister. Sayaç
     yalnız son isteğin yanıtını yazar; böylece "güncel bağlam kazanır". */
  const filterRef = useRef(filter);
  filterRef.current = filter;
  const filesRequestRef = useRef(0);

  const loadFiles = useCallback(async () => {
    const request = ++filesRequestRef.current;
    setLoadingFiles(true);
    try {
      const result = await getFiles(filterRef.current, { abpHandleError: false });
      if (request !== filesRequestRef.current) return;
      setFiles(result.items ?? []);
      setTotalCount(result.totalCount ?? 0);
      setFilesError(null);
    } catch (e) {
      if (request !== filesRequestRef.current) return;
      // Liste bilinmiyor: eldeki satırlar başka bağlama ait olabilir, FileList hiç göstermez.
      setFilesError(e);
      console.error('[Documents] loadFiles', e);
    } finally {
      if (request === filesRequestRef.current) setLoadingFiles(false);
    }
  }, []);

  // İçerik anahtarı: ağaç gelince aynı klasör düğümü projeyle zenginleşir; aynı
  // isteği ikinci kez atıp iskeleti yeniden göstermesin.
  const filterKey = JSON.stringify(filter);
  useEffect(() => { if (!restoring) loadFiles(); }, [filterKey, restoring, loadFiles]);

  /* --- KPI: tek satırlık sorgular, yalnız totalCount okunur --- */
  const kpiRequestRef = useRef(0);
  const loadKpis = useCallback(async () => {
    const request = ++kpiRequestRef.current;
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [expiring, uploaded] = await Promise.all([
        getFiles({ maxResultCount: 1, skipCount: 0, expiringWithinDays: 30 }, { abpHandleError: false }),
        getFiles({ maxResultCount: 1, skipCount: 0, uploadedAfter: monthStart }, { abpHandleError: false }),
      ]);

      if (request !== kpiRequestRef.current) return;
      setExpiringCount(expiring.totalCount ?? 0);
      setUploadedThisMonth(uploaded.totalCount ?? 0);
    } catch (e) {
      if (request !== kpiRequestRef.current) return;
      // Sayılar bilinmiyor: tazeleme düştüyse eski değer kalmaz, "—" görünür.
      setExpiringCount(null);
      setUploadedThisMonth(null);
      console.error('[Documents] loadKpis', e);
    }
  }, []);

  useEffect(() => { loadKpis(); }, [loadKpis]);

  /* --- Uygunluk özeti ---
     Tek kaynak: KPI şeridi, süreç şeridi ve satır içi eksik kalemler aynı
     özetten okur. Kontrol listesi PROJE kapsamında tanımlı; proje bağlamı
     yoksa özet de yok. Okunamazsa dosya listesi yine çalışır (eksik satırı basılmaz). */
  const compliance = useComplianceOverview(activeProjectId);

  /* İş adımı seçiliyse yalnız o adımın kalemleri süzülür. */
  const missingItems = useMemo(() => {
    const items = (compliance.overview?.checklists ?? []).flatMap((checklist) =>
      (checklist.items ?? [])
        .filter((item) => item.status === 2) // 2 = Missing
        .map((item) => ({ ...item, assignmentId: checklist.assignmentId })));

    return node.kind === 'workstep'
      ? items.filter((i) => i.workStepId === node.workStepId)
      : items;
  }, [compliance.overview, node.kind, node.workStepId]);

  /* Uygunluk sekmesi paket uygular/feragat alır; özet değiştiyse tek kaynağı
     tazeleriz. Geri çağrı KİMLİĞİ SABİT olmalı: ComplianceTab onu yükleyicisinin
     bağımlılığına koyuyor, her render'da yeni fonksiyon sonsuz yeniden yükleme
     döngüsü kurardı. Güncel özet ref'ten okunur. */
  const complianceRef = useRef(compliance);
  complianceRef.current = compliance;

  const handleSummaryChange = useCallback((summary) => {
    const current = complianceRef.current;
    if (!summary || current.loading) return;
    if (!sameSummary(summary, current.overview?.summary)) current.reload();
  }, []);

  /* --- Öneriler ---
     Proje ref'ten okunur: öneri işlemi sonrası yenileme o an seçili projeyi ister.
     Okunamazsa ekranın geri kalanı çalışır; yalnız "Öneri bekleyen" klasörü (listesi
     önerilerden kurulur) "henüz belge yok" demez, hata kartı + Tekrar dene gösterir. */
  const projectIdRef = useRef(activeProjectId);
  projectIdRef.current = activeProjectId;
  const suggestionsRequestRef = useRef(0);

  const loadSuggestions = useCallback(async () => {
    const request = ++suggestionsRequestRef.current;
    setLoadingSuggestions(true);
    try {
      const next = await getSuggestions(projectIdRef.current, { abpHandleError: false });
      if (request !== suggestionsRequestRef.current) return;
      setSuggestions(next);
      setSuggestionsError(null);
    } catch (e) {
      if (request !== suggestionsRequestRef.current) return;
      setSuggestions(null);
      setSuggestionsError(e);
      console.error('[Documents] loadSuggestions', e);
    } finally {
      if (request === suggestionsRequestRef.current) setLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => { loadSuggestions(); }, [activeProjectId, loadSuggestions]);

  /* --- İlk kurulum sihirbazı ---
     Yalnız kurulum HİÇ yapılmamışsa açılır. Bayrak kiracı ayarında olduğu için
     ikinci kullanıcı aynı sihirbazı yeniden görmez. */
  useEffect(() => {
    if (!canCreate) return;

    (async () => {
      try {
        setSetupState(await getSetupState({ abpHandleError: false }));
      } catch (e) {
        // Kurulum durumu okunamadıysa ekran normal çalışmaya devam etsin.
        console.error('[Documents] setupState', e);
      }
    })();
  }, [canCreate]);

  const refToDto = (item) => ({
    documentFileId: item.documentFileId,
    kind: item.kind,
    payload: item.payload,
  });

  const runSuggestionAction = async (action, refs, message) => {
    setSuggestionBusy(true);
    try {
      await action(refs);
      flash(message);
      await Promise.all([loadSuggestions(), loadFiles(), loadTree()]);
    } catch (e) {
      if (!wasShown(e)) abpNotify('error', 'Öneri işlenemedi.');
      console.error('[Documents] suggestion action', e);
    } finally {
      setSuggestionBusy(false);
    }
  };

  /* --- Ağaç düğümleri --- */
  const tree = useMemo(() => {
    const stepsByProject = new Map();
    workSteps.forEach((step) => {
      if (!stepsByProject.has(step.projectId)) stepsByProject.set(step.projectId, []);
      stepsByProject.get(step.projectId).push(step);
    });

    const byParent = new Map();
    folders.forEach((folder) => {
      const key = folder.parentDocumentId || 'root';
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(folder);
    });

    const build = (parentKey) => (byParent.get(parentKey) || [])
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title, 'tr'))
      .map((folder) => {
        const children = build(folder.id);

        // Projeye bağlı klasörün altına o projenin iş adımları eklenir.
        const steps = folder.projectId ? (stepsByProject.get(folder.projectId) || []) : [];
        const stepNodes = steps
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((step) => ({
            key: `step-${step.id}`,
            kind: 'workstep',
            workStepId: step.id,
            projectId: step.projectId,
            label: `${step.order} · ${step.name}`,
            icon: 'fa-diagram-next',
            count: step.documentCount,
            children: [],
          }));

        return {
          key: `folder-${folder.id}`,
          kind: 'folder',
          documentId: folder.id,
          projectId: folder.projectId,
          label: folder.title,
          icon: folder.projectId ? 'fa-diagram-project' : 'fa-folder',
          children: [...stepNodes, ...children],
        };
      });

    return build('root');
  }, [folders, workSteps]);

  /* --- URL'deki klasör/iş adımı düğümünü ağaç gelince geri yükle ---
     Bir kez çalışır: kullanıcı sonradan başka düğüme geçtiğinde geri sürüklemez.
     Ağaç yüklenemezse (boş) adresten kurulan düğüm ve adres korunur. Kullanıcı
     bu arada "Tüm Dokümanlar" ya da akıllı klasör seçtiyse seçimi ezilmez. */
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current || loadingTree) return;
    restoredRef.current = true;

    const folderId = initialQuery.get('folder');
    const stepId = initialQuery.get('step');
    const projectId = initialQuery.get('projectId');
    if (!folderId && !stepId && !projectId) return;

    const flatten = (nodes) => nodes.flatMap((n) => [n, ...flatten(n.children || [])]);
    const sameId = (a, b) => String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase();
    const all = flatten(tree);
    // Proje bağlamında ön-sıradaki (en üstteki) proje klasörü seçilir: ağaçta
    // görünür, yükleme de klasör bağlamı istediği için "Yükle" açılır.
    const found = folderId ? all.find((n) => n.documentId === folderId)
      : stepId ? all.find((n) => n.workStepId === stepId)
        : all.find((n) => n.kind === 'folder' && sameId(n.projectId, projectId));

    if (found) {
      setNode((current) => (current === initialNodeRef.current ? found : current));
      // Geri yüklenen düğümün üstleri açık gelsin ki ağaçta görünsün.
      setExpanded((prev) => new Set([...prev, found.key]));
    } else if (tree.length > 0 && (folderId || stepId)) {
      // Bağlantıdaki klasör/adım artık yok: eski davranış, "Tüm Dokümanlar".
      setNode((current) => (current === initialNodeRef.current ? { key: 'all', kind: 'all' } : current));
    }
    setRestoring(false);
  }, [loadingTree, tree, initialQuery]);

  /* --- Durum → URL --- */
  useEffect(() => {
    const params = new URLSearchParams();

    if (tab !== 'files') params.set('tab', tab);
    if (node.kind === 'folder') params.set('folder', node.documentId);
    else if (node.kind === 'workstep') params.set('step', node.workStepId);
    else if (node.kind === 'project') params.set('projectId', node.projectId);
    else if (node.kind === 'smart') params.set('smart', node.smart);
    if (appliedSearch.trim()) params.set('q', appliedSearch.trim());
    if (view !== 'list') params.set('view', view);
    if (sorting !== 'creationTime desc') params.set('sort', sorting);
    if (page > 0) params.set('page', String(page));

    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, [tab, node, appliedSearch, view, sorting, page]);

  /* --- Seçim / detay ---
     Yalnız son açılan satırın detayı yazılır; hata olursa vurgulanan satır ile
     panel ayrışmasın diye seçim de düşer. */
  const detailRequestRef = useRef(0);

  const openDetail = useCallback(async (file) => {
    const request = ++detailRequestRef.current;
    setSelectedId(file.id);
    setLoadingDetail(true);
    try {
      const next = await getFile(file.id);
      if (request === detailRequestRef.current) setDetail(next);
    } catch (e) {
      if (request !== detailRequestRef.current) return;
      setSelectedId(null);
      setDetail(null);
      abpNotify('error', 'Belge detayı açılamadı.');
      console.error('[Documents] openDetail', e);
    } finally {
      if (request === detailRequestRef.current) setLoadingDetail(false);
    }
  }, []);

  const handleSave = async (draft) => {
    const request = detailRequestRef.current;
    setSaving(true);
    try {
      await updateFileMeta(draft.id, {
        displayName: draft.displayName,
        documentTypeId: draft.documentTypeId || null,
        projectId: draft.projectId || null,
        workStepId: draft.workStepId || null,
        amount: draft.amount,
        currency: draft.currency || 'TRY',
        documentDate: draft.documentDate || null,
        periodCode: draft.periodCode || null,
        expiryDate: draft.expiryDate || null,
        externalRef: draft.externalRef || null,
        status: draft.status,
        fields: draft.fields.map((f) => ({
          fieldId: f.fieldId,
          valueText: f.valueText ?? null,
          valueNumber: f.valueNumber ?? null,
          valueDate: f.valueDate ?? null,
        })),
        tags: draft.tags || [],
      });
      flash('Belge güncellendi.');
      // Bu arada başka satır açıldıysa eski belgenin detayı onun yerine yazılmaz.
      const next = await getFile(draft.id);
      if (request === detailRequestRef.current) setDetail(next);
      await loadFiles();
    } catch (e) {
      if (!wasShown(e)) abpNotify('error', 'Belge güncellenemedi.');
      console.error('[Documents] handleSave', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFile(deleteTarget.id);
      if (selectedId === deleteTarget.id) { setSelectedId(null); setDetail(null); }
      flash('Belge silindi.');
      await Promise.all([loadFiles(), loadKpis()]);
    } catch (e) {
      if (!wasShown(e)) abpNotify('error', 'Belge silinemedi.');
      console.error('[Documents] handleDelete', e);
    } finally {
      setDeleteTarget(null);
    }
  };

  /* --- Sürükle-bırak: satır → klasör --- */
  const handleDragStart = (file) => {
    // Seçili satırlar varsa ve sürüklenen onlardan biriyse hepsi taşınır.
    draggedRef.current = checkedIds.has(file.id) ? Array.from(checkedIds) : [file.id];
  };

  const handleDropOnFolder = async (targetDocumentId) => {
    const ids = draggedRef.current;
    if (!ids.length) return;

    try {
      if (ids.length === 1) {
        await moveFile(ids[0], targetDocumentId);
      } else {
        await bulkMoveFiles(ids, targetDocumentId);
      }
      flash(ids.length === 1 ? 'Belge taşındı.' : `${ids.length} belge taşındı.`);
      setCheckedIds(new Set());
      await loadFiles();
    } catch (e) {
      if (!wasShown(e)) abpNotify('error', 'Taşıma başarısız oldu.');
      console.error('[Documents] move', e);
    } finally {
      draggedRef.current = [];
    }
  };

  /* --- Toplu işlemler --- */
  const handleBulkMove = async () => {
    const target = window.prompt('Hedef klasör adını yazın:');
    if (!target) return;
    const folder = folders.find((f) => f.title.toLocaleLowerCase('tr') === target.toLocaleLowerCase('tr'));
    if (!folder) { abpNotify('warn', 'Klasör bulunamadı.'); return; }

    try {
      await bulkMoveFiles(Array.from(checkedIds), folder.id);
      flash(`${checkedIds.size} belge taşındı.`);
      setCheckedIds(new Set());
      await loadFiles();
    } catch (e) {
      if (!wasShown(e)) abpNotify('error', 'Toplu taşıma başarısız oldu.');
      console.error('[Documents] bulkMove', e);
    }
  };

  const handleBulkTag = async () => {
    const input = window.prompt('Etiket(ler) — virgülle ayırın:');
    if (!input) return;
    const tags = input.split(',').map((t) => t.trim()).filter(Boolean);
    if (!tags.length) return;

    try {
      await bulkTagFiles(Array.from(checkedIds), tags);
      flash(`${checkedIds.size} belge etiketlendi.`);
      setCheckedIds(new Set());
      await loadFiles();
    } catch (e) {
      if (!wasShown(e)) abpNotify('error', 'Etiketleme başarısız oldu.');
      console.error('[Documents] bulkTag', e);
    }
  };

  /* --- Yükleme --- */
  const handleUpload = async (fileList) => {
    if (!activeFolderId || !fileList?.length) return;

    // Eksik kalem satırından gelindiyse hedef burada sabitlenir; kullanıcı
    // dosya seçerken bağlam değişse bile yükleme doğru kaleme bağlanır.
    const requirement = pendingRequirementRef.current;
    pendingRequirementRef.current = null;

    setUploading(true);
    try {
      let firstFileId = null;

      for (const file of Array.from(fileList)) {
        const attachment = await uploadAttachment(activeFolderId, file);
        firstFileId = firstFileId ?? attachment?.documentFileId ?? null;
      }

      if (requirement && firstFileId) {
        await linkComplianceDocument({
          assignmentId: requirement.assignmentId,
          requirementId: requirement.requirementId,
          workStepId: requirement.workStepId || null,
          periodCode: requirement.periodCode || null,
          documentFileId: firstFileId,
        });
        flash(`Yüklendi ve "${requirement.title}" kalemine bağlandı.`);
      } else {
        flash(fileList.length === 1 ? 'Dosya yüklendi.' : `${fileList.length} dosya yüklendi.`);
      }

      // Uygunluk ref'ten: eski projenin reload'u en son istek olursa özet eski projede
      // kalır ve güncel proje için sonsuza dek "yükleniyor" görünürdü.
      await Promise.all([loadFiles(), loadKpis(), loadTree(), complianceRef.current.reload()]);
    } catch (e) {
      if (!wasShown(e)) abpNotify('error', 'Dosya yüklenemedi.');
      console.error('[Documents] upload', e);
    } finally {
      setUploading(false);
    }
  };

  /** Çöp kutusundan geri alma — belge ekleri ve etiketleriyle birlikte döner. */
  const handleRestore = async (file) => {
    try {
      await restoreFile(file.id);
      flash(`"${file.displayName}" geri alındı.`);
      await Promise.all([loadFiles(), loadKpis(), loadTree()]);
    } catch (e) {
      if (!wasShown(e)) abpNotify('error', 'Belge geri alınamadı.');
      console.error('[Documents] restore', e);
    }
  };

  /** Eksik kalem satırındaki "Yükle": dosya seçiciyi açar, hedefi saklar. */
  const handleUploadForRequirement = (item) => {
    if (!activeFolderId) {
      abpNotify('warn', 'Yükleme klasör bağlamında yapılır — soldan bir klasör seçin.');
      return;
    }

    pendingRequirementRef.current = item;
    fileInputRef.current?.click();
  };

  const openCreateFolder = () => {
    const modal = new window.abp.ModalManager(abpAppPath() + 'Documents/CreateModal');
    modal.open({ parentDocumentId: activeFolderId || undefined });
    modal.onResult(() => { loadTree(); flash('Klasör oluşturuldu.'); });
  };

  /* İlk deneme boş ağaçla bittiği için adresteki klasör/adım/proje düğümü "geri
     yüklendi" sayılmıştı; yeniden denemede geri yükleme tekrar koşar. Effect düğümü
     yalnız kullanıcı başka düğüm seçmediyse değiştirir, seçimi ezilmez. */
  const retryTree = () => {
    restoredRef.current = false;
    loadTree();
  };

  const toggleExpand = (key) => setExpanded((prev) => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  const selectNode = (next) => {
    // Kullanıcının açık seçimi geri yüklemeyi beklemez.
    setRestoring(false);
    setNode(next);
    setPage(0);
    setCheckedIds(new Set());
    if (next.key?.startsWith('folder-')) toggleExpand(next.key);
  };

  const toggleCheck = (id) => setCheckedIds((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => setCheckedIds((prev) => (
    files.every((f) => prev.has(f.id)) ? new Set() : new Set(files.map((f) => f.id))
  ));

  /* --- Süreç şeridi: Belgeler ve Uygunluk bu ekranın sekmeleri ---
     O iki adıma sayfa yenilemeden geçilir; Derle ve Teslim kendi ekranına gider. */
  const handleFlowSelect = (stepKey, event) => {
    if (stepKey !== 'docs' && stepKey !== 'compliance') return;
    event.preventDefault();
    setTab(stepKey === 'docs' ? 'files' : 'compliance');
  };

  const pickFiles = () => fileInputRef.current?.click();

  /* --- Boş durum eylemi: tek birincil düğme + metin bağlantısı ---
     Yalnız "henüz bir şey yok" durumlarında; arama/süzgeç ve akıllı klasör
     boşken eylem önermiyoruz (orada boş olmak iyi haber ya da süzgeç sonucu).
     Ağaç OKUNAMADIYSA klasör yok sayılmaz: "Şemayı kur" sihirbazı ikinci kez açılıp
     mükerrer şema kurdururdu. */
  const noFolders = !loadingTree && !treeError && folders.length === 0;

  let emptyAction = null;
  if (canCreate && !appliedSearch.trim() && node.kind !== 'smart') {
    if (noFolders) {
      // Tasarımdaki ilk kurulum boş durumu: şema sihirbazı ya da boş klasör.
      // Sihirbaz ağaç BOŞKEN yeniden açılabilir — kurulacak hiçbir şey yokken
      // "ilk kurulum" hâlâ ilk kurulumdur.
      emptyAction = setupState ? (
        <EmptyActions
          primary={<Button onClick={() => setSetupState({ ...setupState, setupCompleted: false })}>Şemayı kur</Button>}
          link={{ label: 'veya boş klasörle başla', onClick: openCreateFolder }}
        />
      ) : (
        <EmptyActions primary={<Button onClick={openCreateFolder}>Yeni klasör</Button>} />
      );
    } else if (activeFolderId) {
      emptyAction = (
        <EmptyActions
          primary={<Button leadingIcon={<i className="fa fa-upload" />} onClick={pickFiles}>Yükle</Button>}
          link={{ label: 'veya toplu yükleme ekranını aç', href: `${abpAppPath()}Documents/Upload?documentId=${activeFolderId}` }}
        />
      );
    }
  }

  const emptyHint = noFolders
    ? 'Klasör şemasını kurumun beklediği yapıya göre kurun; zorunlu belgeler ve meta alanları birlikte gelir.'
    : activeFolderId
      ? 'Dosyaları buraya sürükleyin ya da "Yükle" ile ekleyin.'
      : 'Sol taraftan bir klasör seçin; yükleme klasör bağlamında yapılır.';

  /* "Öneri bekleyen" klasörünün listesi önerilerden kurulur: öneriler yüklenirken ya da
     okunamadıysa liste de bilinmiyor — "henüz belge yok" yerine iskelet / hata kartı. */
  const isSuggested = node.kind === 'smart' && node.smart === 'suggested';
  const suggestionsFailed = isSuggested && Boolean(suggestionsError);
  const listLoading = loadingFiles || (isSuggested && loadingSuggestions);
  const listError = suggestionsFailed ? suggestionsError : filesError;

  /* Liste kartının "Tekrar dene"si KPI'ları da yeniden ister: aynı uçtan okunurlar ve yalnız
     açılışta/mutasyonda yüklendikleri için liste düzelse de sayfa yenilenene dek "—" kalıyorlardı.
     Başarıda kart listeyle yer değiştirir: odak sayfaya düşmesin, listeye geçsin. */
  const listFocus = useRetryFocus(!listLoading && !listError);
  const retryList = listFocus.retry(() => {
    loadKpis();
    if (suggestionsFailed) loadSuggestions();
    else loadFiles();
  });

  return (
    <div
      className="apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto"
      style={{ maxWidth: 1560 }}
      onDragOver={(e) => { if (activeFolderId) e.preventDefault(); }}
      onDrop={(e) => {
        if (!activeFolderId || !e.dataTransfer.files?.length) return;
        e.preventDefault();
        handleUpload(e.dataTransfer.files);
      }}
    >
      {/* Buton kuralı: başlıkta tek birincil düğme ("Yükle" — tek seferlik, seçili
          klasöre çalışır), ikincil eylemler ⋯ menüsünde. Sıra, ilerleme ve tekrar
          deneme isteyen toplu iş kuyruk ekranında. */}
      <DocsPageHeader
        title="Dokümanlar"
        description="Klasörler, belgeler ve meta veri"
        primary={canCreate && (
          <Button
            variant="primary"
            isLoading={uploading}
            disabled={!activeFolderId}
            title={activeFolderId ? undefined : 'Önce bir klasör seçin'}
            leadingIcon={<i className="fa fa-upload" />}
            onClick={pickFiles}
          >
            Yükle
          </Button>
        )}
        menuItems={canCreate ? [
          { key: 'folder', label: 'Yeni klasör', icon: 'fa-folder-plus', onSelect: openCreateFolder },
          {
            key: 'bulk',
            label: 'Toplu yükleme',
            icon: 'fa-layer-group',
            href: `${abpAppPath()}Documents/Upload${activeFolderId ? `?documentId=${activeFolderId}` : ''}`,
          },
          {
            key: 'capture',
            label: 'Belge yakala',
            icon: 'fa-camera',
            // Telefonda sağ alttaki sabit düğme bu işi görüyor; menüde tekrar etmesin.
            className: 'is-desktop-only',
            disabled: !activeFolderId || uploading,
            hint: activeFolderId ? null : 'Önce bir klasör seçin',
            onSelect: () => cameraInputRef.current?.click(),
          },
        ] : []}
      />

      <ProcessRibbon
        active={tab === 'compliance' ? 'compliance' : 'docs'}
        projectId={activeProjectId}
        compliance={compliance}
        onSelect={handleFlowSelect}
      />

      {/* Belge yakala — sahadaki kullanıcının ana eylemi. Dar ekranda sağ altta
          sabit bir düğmedir (CSS); geniş ekranda gizlenir, ⋯ menüsünden açılır.
          Portal ŞART: ada kökünün .apya-fade-in transform'u `position: fixed`
          için kapsayıcı blok olur, düğme görünen alana değil sayfanın dibine
          hizalanırdı (bkz. ModalPortal). */}
      {canCreate && (
        <ModalPortal>
          <Button
            variant="secondary"
            className="apya-doc-capture-btn"
            isLoading={uploading}
            disabled={!activeFolderId}
            title={activeFolderId ? undefined : 'Önce bir klasör seçin'}
            leadingIcon={<i className="fa fa-camera" />}
            onClick={() => cameraInputRef.current?.click()}
          >
            Belge yakala
          </Button>
        </ModalPortal>
      )}
      <input
        ref={fileInputRef} type="file" multiple hidden
        onChange={(e) => { handleUpload(e.target.files); e.target.value = ''; }}
      />

      {/* Sahadaki kullanıcı: belgeyi telefonun kamerasıyla yakalar.
          `capture` mobil tarayıcıda doğrudan kamerayı açar; masaüstünde
          yok sayılıp normal dosya seçiciye düşer, o yüzden ayrı bir kod
          yolu gerekmiyor. OCR YOK — dosya olduğu gibi yüklenir. */}
      <input
        ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden
        onChange={(e) => { handleUpload(e.target.files); e.target.value = ''; }}
      />

      <KpiStrip
        uploadedThisMonth={uploadedThisMonth}
        expiring={expiringCount}
        compliance={compliance.overview?.summary ?? null}
        hasProject={Boolean(activeProjectId)}
        complianceFailed={compliance.failed}
      />

      <div className="apya-doc-tabs" role="tablist">
        {[
          { key: 'files', label: 'Dosyalar' },
          { key: 'compliance', label: 'Uygunluk' },
          { key: 'activity', label: 'Etkinlik' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={cn('apya-doc-tab', tab === t.key && 'is-active')}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={cn('apya-docs-shell', tab !== 'files' && 'is-wide')}>
        <ContextTree
          loading={loadingTree}
          error={treeError}
          onRetry={retryTree}
          tree={tree}
          activeKey={node.key}
          expanded={expanded}
          onToggle={toggleExpand}
          onSelect={selectNode}
          onDropFiles={handleDropOnFolder}
          dragTarget={dragTarget}
          setDragTarget={setDragTarget}
        />

        {tab === 'compliance' ? (
          <div className="apya-docs-main">
            <ComplianceTab
              projectId={activeProjectId}
              periodCode={null}
              onSummaryChange={handleSummaryChange}
              documentTypes={documentTypes}
            />
          </div>
        ) : tab === 'activity' ? (
          <div className="apya-docs-main">
            <ActivityTab projectId={activeProjectId} documentFileId={null} />
          </div>
        ) : (
        <div className="apya-docs-main">
          {canEditMeta && (
            <SuggestionBanner
              summary={suggestions}
              busy={suggestionBusy}
              onApplyAll={() => runSuggestionAction(
                applySuggestions,
                (suggestions?.items ?? []).map(refToDto),
                'Öneriler uygulandı.',
              )}
              onApply={(item) => runSuggestionAction(
                applySuggestions, [refToDto(item)], 'Öneri uygulandı.',
              )}
              onDismiss={(item) => runSuggestionAction(
                dismissSuggestions, [refToDto(item)], 'Öneri yoksayıldı.',
              )}
              onReload={loadSuggestions}
            />
          )}

          <div className="apya-grid-toolbar" style={{ padding: '12px 14px', borderBottom: '1px solid var(--apya-border-subtle)' }}>
            <Input
              size="sm"
              className="apya-grid-search"
              leading={<i className="fa fa-search" style={{ fontSize: 11 }} />}
              placeholder="Bu bağlamda filtrele"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* Yüklenirken ve hatada sayı bilinmiyor: "0 belge" demek yanlış olur. */}
            <span className="apya-grid-count apya-numeric">{listLoading || listError ? '—' : totalCount} belge</span>
            <div className="apya-doc-viewtoggle">
              <button
                type="button"
                className={cn(view === 'list' && 'is-active')}
                onClick={() => setView('list')}
                aria-label="Liste görünümü"
              >
                <i className="fa fa-list" />
              </button>
              <button
                type="button"
                className={cn(view === 'grid' && 'is-active')}
                onClick={() => setView('grid')}
                aria-label="Kart görünümü"
              >
                <i className="fa fa-border-all" />
              </button>
            </div>
          </div>

          {/* Başarılı "Tekrar dene"de odağın taşındığı içerik kabı (useRetryFocus). */}
          <div ref={listFocus.contentRef} tabIndex={-1}>
          <FileList
            loading={listLoading}
            loadError={listError}
            onRetry={retryList}
            files={files}
            totalCount={totalCount}
            view={view}
            sorting={sorting}
            onSort={(next) => { setSorting(next); setPage(0); }}
            selectedId={selectedId}
            onSelect={openDetail}
            checkedIds={checkedIds}
            onToggleCheck={toggleCheck}
            onToggleAll={toggleAll}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            onDragStart={handleDragStart}
            emptyHint={emptyHint}
            emptyAction={emptyAction}
            missingItems={missingItems}
            onUploadMissing={handleUploadForRequirement}
            canUpload={canCreate}
            isTrash={isTrash}
            onRestore={handleRestore}
          />
          </div>

          {canBulk && (
            <BulkBar
              count={checkedIds.size}
              onClear={() => setCheckedIds(new Set())}
              onMove={handleBulkMove}
              onTag={handleBulkTag}
            />
          )}
        </div>
        )}

        {/* Detay paneli yalnız Dosyalar sekmesinde anlamlı — diğer sekmeler
            zaten satır bazlı okuma yapıyor, üçüncü kolon boş dururdu. */}
        {tab === 'files' && (
          <div className="apya-docs-detail">
            <DetailPanel
              detail={detail}
              loading={loadingDetail}
              canEdit={canEditMeta}
              documentTypes={documentTypes}
              saving={saving}
              onSave={handleSave}
              onDelete={canDelete ? setDeleteTarget : () => {}}
            />
          </div>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title="Belge silinecek"
          message={`"${deleteTarget.displayName}" ve tüm versiyonları çöp kutusuna taşınacak. Sol alttaki "Çöp kutusu"ndan geri alabilirsiniz.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {/* Sihirbaz yalnız kurulum hiç yapılmamışken açılır. */}
      {setupState && !setupState.setupCompleted && (
        <SetupWizard
          state={setupState}
          onDone={async () => {
            setSetupState({ ...setupState, setupCompleted: true });
            await Promise.all([loadTree(), loadFiles()]);
          }}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
