// Görev konsolu — ProjectDetails konsolundaki jenerik etkileşim desenlerinin
// paylaşılabilir hâli: filtre state'i + URL senkronu, chip kablolaması, toplu
// seçim çubuğu, satır yoğunluğu, kolon seçici ve boş-hâl basımı.
//
// Bilinçli sınır: burada HİÇBİR sayfaya özel bilgi yok (proje, AI, bütçe, ekip
// yok). Sayfa hangi filtre alanlarına sahip olduğunu `defaults` ile bildirir,
// modül onları URL'e yazıp chip'lere bağlar.
//
// Kullananlar: Pages/Tasks/index.js ve Pages/Projects/ProjectDetails.js.
(function (window, $) {
    'use strict';

    var apya = window.apya = window.apya || {};

    // --- Filtre state'i + URL senkronu ------------------------------------
    // Boolean alanlar URL'de '1', metin alanları ham değer. Boş olanlar
    // yazılmaz → paylaşılan bağlantı kısa kalır ve ?task=... korunur.
    function createState(defaults) {
        var state = $.extend({}, defaults);

        function isBool(key) { return typeof defaults[key] === 'boolean'; }

        return {
            values: state,

            get: function (key) { return state[key]; },

            set: function (key, value) { state[key] = value; return this; },

            reset: function () {
                Object.keys(defaults).forEach(function (k) { state[k] = defaults[k]; });
                return this;
            },

            readUrl: function () {
                var p = new URLSearchParams(window.location.search);
                Object.keys(defaults).forEach(function (k) {
                    if (isBool(k)) { state[k] = p.get(k) === '1'; }
                    else { state[k] = p.get(k) || ''; }
                });
                return this;
            },

            writeUrl: function (extra) {
                // Mevcut arama dizesinden başla → görev derin bağlantısı (?task=...) korunur.
                var p = new URLSearchParams(window.location.search);
                function set(k, v) { if (v) { p.set(k, v); } else { p.delete(k); } }
                Object.keys(defaults).forEach(function (k) {
                    set(k, isBool(k) ? (state[k] ? '1' : '') : state[k]);
                });
                if (extra) { Object.keys(extra).forEach(function (k) { set(k, extra[k]); }); }
                var qs = p.toString();
                history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
                return this;
            },

            hasActive: function () {
                return Object.keys(defaults).some(function (k) {
                    return isBool(k) ? state[k] : state[k] !== '';
                });
            }
        };
    }

    // --- Chip kablolaması --------------------------------------------------
    // Dropdown chip: "Durum: tümü" gibi bir etiket taşır, seçilince is-active olur.
    // aria-pressed KULLANMAZ — dropdown zaten aria-expanded taşıyor.
    function bindDropdownChip(opts) {
        var $chip = $(opts.chip);
        if (!$chip.length) { return null; }

        $(document).on('click', '[data-filter="' + opts.filter + '"]', function () {
            opts.state.set(opts.key, String($(this).data('value') || ''));
            if (opts.onPick) { opts.onPick($(this)); }
            opts.onChange();
        });

        return {
            render: function () {
                var value = opts.state.get(opts.key);
                var label = opts.label ? opts.label(value) : (opts.labels[value] || 'tümü');
                $chip.find('[data-chip-text]').text(opts.prefix + ': ' + label);
                $chip.toggleClass('is-active', opts.active ? opts.active() : value !== '');
            }
        };
    }

    // Aç/kapa chip: Gecikmiş, Bana atanan gibi. aria-pressed ile durum bildirir.
    function bindToggleChip(opts) {
        var $chip = $(opts.chip);
        if (!$chip.length) { return null; }

        $chip.on('click', function () {
            var next = !opts.state.get(opts.key);
            opts.state.set(opts.key, next);
            if (opts.onToggle) { opts.onToggle(next); }
            opts.onChange();
        });

        return {
            render: function () {
                $chip.attr('aria-pressed', String(!!opts.state.get(opts.key)));
            }
        };
    }

    // --- Toplu seçim çubuğu -------------------------------------------------
    // Seçim SAYFA DIŞINDA da korunur (id kümesi), çünkü kullanıcı sayfa değiştirip
    // seçmeye devam edebiliyor; "tümünü seç" yalnız görünen sayfayı kapsar.
    function createBulkSelection(opts) {
        var selected = {};

        function ids() { return Object.keys(selected); }

        function render() {
            var n = ids().length;
            $(opts.bar).toggleClass('d-none', n === 0);
            $(opts.count).text(n + ' görev seçili');
            syncRowChecks();
        }

        function syncRowChecks() {
            $(opts.table + ' tbody .apya-row-check[data-task-id]').each(function () {
                this.checked = !!selected[$(this).data('task-id')];
            });
            // Seçili satır vurgusu — onay kutusu tek başına yeterince görünür değil.
            $(opts.table + ' tbody tr').each(function () {
                $(this).toggleClass('is-selected', !!selected[$(this).attr('data-id')]);
            });
            var $page = $(opts.table + ' tbody .apya-row-check[data-task-id]');
            var pageIds = $page.map(function () { return String($(this).data('task-id')); }).get();
            var allOn = pageIds.length > 0 && pageIds.every(function (id) { return !!selected[id]; });
            $(opts.checkAll).prop('checked', allOn);
        }

        $(document).on('change', opts.table + ' tbody .apya-row-check', function () {
            var id = String($(this).data('task-id'));
            if (this.checked) { selected[id] = true; } else { delete selected[id]; }
            render();
        });

        $(document).on('change', opts.checkAll, function () {
            var on = this.checked;
            $(opts.table + ' tbody .apya-row-check[data-task-id]').each(function () {
                var id = String($(this).data('task-id'));
                if (on) { selected[id] = true; } else { delete selected[id]; }
            });
            render();
        });

        return {
            ids: ids,
            clear: function () { selected = {}; render(); },
            render: render,
            syncRowChecks: syncRowChecks
        };
    }

    // İstekleri SIRAYLA çalıştırır. Paralel (Promise.all) çağrı bu backend'de
    // sahte eşzamanlılık hatası + sessiz çift yazma riski taşıyor.
    function runSequential(items, fn) {
        return items.reduce(function (chain, item) {
            return chain.then(function () { return fn(item); });
        }, Promise.resolve());
    }

    // --- Satır yoğunluğu ----------------------------------------------------
    // ⋯ menüsündeki S/N/G segmentini UYGULAMA GENELİ yoğunluk ayarına bağlar.
    // Tek doğruluk kaynağı /js/density-toggle.js: <html data-density> +
    // localStorage('apya-density') + 'apya:density-changed' olayı; topbar'daki
    // düğme de aynı değeri yazar. Burada SADECE segmentin aktif durumu senkronlanır.
    //
    // NOT: Bu daha önce sayfaya özel bir kopyaydı (kendi localStorage anahtarı +
    // kart üzerine data-density). Sonuç: topbar ile sayfa birbirini görmüyordu.
    // Sayfa-yerel yoğunluk YANLIŞ soyutlamaydı — bilerek kaldırıldı.
    function bindDensitySegment() {
        function sync() {
            var d = (window.apya && window.apya.density) ? window.apya.density.current() : 'cozy';
            $('[data-density-set]').each(function () {
                var on = $(this).data('density-set') === d;
                $(this).toggleClass('active', on).attr('aria-pressed', String(on));
            });
        }

        $(document).on('click', '[data-density-set]', function () {
            if (window.apya && window.apya.density) {
                window.apya.density.set($(this).data('density-set'));
            }
        });

        document.addEventListener('apya:density-changed', sync);
        sync();
    }

    // --- Kolon seçici -------------------------------------------------------
    // Seçim localStorage'da; backend yok (konsolda da böyle).
    //
    // `autoDrop` kolonları dar kapta ZORLA gizlenir: mobil kart ızgarasında
    // onlara ayrılmış bir hücre yok, görünür kalırlarsa ızgaraya kendiliğinden
    // yerleşip düzeni bozarlar. Ölçülen KAP genişliğidir, viewport değil —
    // kenar çubuğu daraltılabildiği için sabit bir viewport eşiği yanlış cevap verir.
    function createColumnPrefs(opts) {
        var KEY = opts.storageKey;
        var autoDrop = opts.autoDrop || [];
        var narrowWidth = opts.narrowWidth || 1020;
        var isNarrow = false;

        function read() {
            try {
                var raw = localStorage.getItem(KEY);
                return raw ? JSON.parse(raw) : {};
            } catch (e) { return {}; }
        }

        function write(prefs) {
            try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* yoksay */ }
        }

        function stored() {
            var s = read();
            var out = {};
            opts.codes.forEach(function (code) {
                out[code] = s[code] === undefined ? true : !!s[code];
            });
            return out;
        }

        function effective() {
            var prefs = stored();
            if (!isNarrow) { return prefs; }
            var out = {};
            opts.codes.forEach(function (code) {
                out[code] = autoDrop.indexOf(code) === -1 ? prefs[code] : false;
            });
            return out;
        }

        function apply() {
            var prefs = effective();
            opts.codes.forEach(function (code) {
                var auto = isNarrow && autoDrop.indexOf(code) !== -1;
                $('[data-col-toggle="' + code + '"]')
                    .attr('aria-pressed', String(prefs[code]))
                    .prop('disabled', auto)
                    .attr('title', auto ? 'Ekran dar olduğu için otomatik gizlendi' : null);
            });
            if (opts.onApply) { opts.onApply(prefs); }
        }

        $(document).on('click', '[data-col-toggle]', function () {
            if (this.disabled) { return; }
            var code = String($(this).data('col-toggle'));
            var prefs = stored();
            prefs[code] = !prefs[code];
            write(prefs);
            apply();
        });

        if (opts.observe && window.ResizeObserver) {
            var el = document.querySelector(opts.observe);
            if (el) {
                new ResizeObserver(function (entries) {
                    var next = entries[0].contentRect.width < narrowWidth;
                    if (next === isNarrow) { return; }
                    isNarrow = next;
                    apply();
                }).observe(el);
            }
        }

        return { apply: apply, effective: effective };
    }

    // --- Boş hâller ---------------------------------------------------------
    // "Hiç görev yok" ile "filtreye uyan yok" AYRI metinlerdir; ikincisinde
    // kullanıcıya çıkış yolu (filtreleri temizle) sunulur.
    function renderEmptyState(opts) {
        var $cell = $(opts.table + ' tbody td.dt-empty');
        if (!$cell.length) { return; }
        var tpl = document.getElementById(opts.hasFilters ? opts.nomatchTemplate : opts.emptyTemplate);
        if (!tpl) { return; }
        $cell.empty().append(tpl.content.cloneNode(true));
    }

    // --- Kaydedilmiş görünümler ---------------------------------------------
    // Filtre + görünüm + arama önayarı. Backend YOK, localStorage'da durur.
    // `scope` verilirse kayıtlar o anahtarın altında gruplanır (konsolda proje
    // başına — atanan filtresi proje-özgü olduğu için tek ortak liste yanlış
    // sonuç verirdi). scope null ise düz liste (Görevler sayfası: proje yok).
    function createSavedViews(opts) {
        var scoped = opts.scope !== null && opts.scope !== undefined;

        function read() {
            try {
                var raw = JSON.parse(localStorage.getItem(opts.storageKey) || (scoped ? '{}' : '[]'));
                if (!scoped) { return Array.isArray(raw) ? raw : []; }
                return Array.isArray(raw[opts.scope]) ? raw[opts.scope] : [];
            } catch (e) { return []; }
        }

        function write(list) {
            try {
                if (!scoped) { localStorage.setItem(opts.storageKey, JSON.stringify(list)); return; }
                var all = JSON.parse(localStorage.getItem(opts.storageKey) || '{}');
                all[opts.scope] = list;
                localStorage.setItem(opts.storageKey, JSON.stringify(all));
            } catch (e) { /* özel kip — yoksay */ }
        }

        function render() {
            var list = read();
            var $wrap = $(opts.list).empty();
            if (!list.length) {
                $wrap.append('<div class="apya-console-menu-hint px-3 pb-2">Henüz kayıtlı görünüm yok.</div>');
                return;
            }
            list.forEach(function (v, i) {
                var $row = $(
                    '<div class="apya-console-saved-view">' +
                    '  <button type="button" class="apya-console-saved-view-apply">' +
                    '    <span class="apya-console-saved-view-name"></span>' +
                    '    <span class="apya-console-saved-view-meta"></span>' +
                    '  </button>' +
                    '  <button type="button" class="apya-console-saved-view-del" aria-label="Görünümü sil" title="Sil">' +
                    '    <i class="fa fa-xmark"></i></button>' +
                    '</div>');
                $row.find('.apya-console-saved-view-name').text(v.name);
                $row.find('.apya-console-saved-view-meta').text(opts.summarize(v.state));
                $row.find('.apya-console-saved-view-apply').click(function () { opts.onApply(v); });
                $row.find('.apya-console-saved-view-del').click(function (e) {
                    e.stopPropagation();
                    var next = read();
                    next.splice(i, 1);
                    write(next);
                    render();
                });
                $wrap.append($row);
            });
        }

        $(opts.saveButton).click(function () {
            Swal.fire({
                title: 'Görünümü kaydet',
                input: 'text',
                inputPlaceholder: 'Örn. Bana atanan gecikmişler',
                showCancelButton: true,
                confirmButtonText: 'Kaydet',
                cancelButtonText: 'Vazgeç',
                preConfirm: function (name) {
                    if (!name || !name.trim()) { Swal.showValidationMessage('Bir ad girin.'); }
                    return name;
                }
            }).then(function (result) {
                if (!result.isConfirmed) { return; }
                var snap = opts.getSnapshot();
                var list = read();
                list.push({ name: result.value.trim(), state: snap.state, view: snap.view, q: snap.q });
                write(list);
                render();
                abp.notify.success('Görünüm kaydedildi.');
            });
        });

        render();
        // `read` dışarı veriliyor: Görevler konsolunun "＋ Pano ekle" menüsü
        // kayıtlı görünümleri sekme olarak sunuyor ve listeyi okuması gerek.
        // Depolama biçimi (scope'lu/scope'suz) burada kapalı kalsın diye
        // çağıran localStorage'a kendisi uzanmıyor.
        return { render: render, read: read };
    }

    // --- Alt görev hiyerarşisi ------------------------------------------------
    // Liste HİYERARŞİK kiptedir: yalnız kök görevler sayfalanır, alt görevler
    // chevron ile DataTables child satırında TEMBEL yüklenir (parentTaskId ile
    // ayrı istek). Filtre veya arama aktifken sayfa `isEnabled()` ile düz kipe
    // döner — aksi halde filtreye uyan bir alt görev, üstü uymadığı için
    // listeden tamamen düşerdi.
    //
    // Sayfanın sorumluluğu: kolon render'ında `apyaTask.subtaskToggle(row)`
    // basmak, `listFilter`da `rootOnly` göndermek ve `draw`da `restore()`
    // çağırmak. Açık/kapalı durumu ve önbellek burada tutulur.
    function createSubtaskHierarchy(opts) {
        var expanded = {};   // { taskId: true } — açık kalan üst görevler
        var cache = {};      // { taskId: [alt görev DTO] } — sekme/çizim arası

        // Child satırına AÇIKÇA sınıf veriyoruz (row.child'ın 2. parametresi):
        // DataTables 2.3'te child satırı kendiliğinden hiçbir sınıf almıyor
        // (yalnız ÜST satıra `dt-hasChild` yazıyor — sondada ölçüldü). Satır
        // hover'ı bu sınıfla dışarıda bırakılır, bkz. apya-shell.css §17.
        var CHILD_CLASS = 'apya-subtask-child';

        function render(rowApi, id) {
            var $btn = $(rowApi.node()).find('[data-subtask-toggle]');
            $btn.attr('aria-expanded', 'true').attr('aria-label', 'Alt görevleri gizle');

            if (cache[id]) {
                rowApi.child(window.apyaTask.subtaskRows(cache[id]), CHILD_CLASS).show();
                return;
            }

            var $icon = $btn.find('i');
            $icon.attr('class', 'fa fa-spinner fa-spin');
            opts.service.getList({ parentTaskId: id, maxResultCount: 100, sorting: 'Number' }).then(
                function (res) {
                    $icon.attr('class', 'fa fa-chevron-right');
                    cache[id] = res.items || [];
                    if (!expanded[id]) { return; }
                    rowApi.child(window.apyaTask.subtaskRows(cache[id]), CHILD_CLASS).show();
                },
                function () {
                    $icon.attr('class', 'fa fa-chevron-right');
                    delete expanded[id];
                    $btn.attr('aria-expanded', 'false').attr('aria-label', 'Alt görevleri göster');
                    abp.notify.error('Alt görevler yüklenemedi.');
                }
            );
        }

        $(document).on('click', opts.table + ' tbody [data-subtask-toggle]', function (e) {
            e.stopPropagation();   // satır tıklaması görev detayını açıyor
            var dt = opts.getTable();
            if (!dt) { return; }
            var $btn = $(this);
            var id = $btn.attr('data-subtask-toggle');
            var row = dt.row($btn.closest('tr'));
            if (!row || !row.data()) { return; }

            if (row.child.isShown()) {
                row.child.hide();
                delete expanded[id];
                $btn.attr('aria-expanded', 'false').attr('aria-label', 'Alt görevleri göster');
                return;
            }
            expanded[id] = true;
            render(row, id);
        });

        $(document).on('click', opts.table + ' tbody .apya-subtask-row', function (e) {
            e.stopPropagation();
            var id = $(this).attr('data-subtask-id');
            if (id) { opts.openTask(id); }
        });

        $(document).on('keydown', opts.table + ' tbody .apya-subtask-row', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') { return; }
            e.preventDefault();
            e.stopPropagation();
            var id = $(this).attr('data-subtask-id');
            if (id) { opts.openTask(id); }
        });

        return {
            // Veri bayatladığında (filtre değişimi, kayıt güncelleme) çağrılır.
            reset: function () { cache = {}; },

            // Child satırlar her `draw`da kaybolur → açık olanları geri açar.
            restore: function () {
                if (!opts.isEnabled()) { return; }
                if (!Object.keys(expanded).length) { return; }
                var dt = opts.getTable();
                if (!dt) { return; }
                dt.rows().every(function () {
                    var d = this.data();
                    if (d && expanded[d.id]) { render(this, d.id); }
                });
            }
        };
    }

    // --- Klavye kısayolları --------------------------------------------------
    // Kural: bir metin alanına yazarken veya herhangi bir pencere/menü açıkken
    // HİÇBİR kısayol tetiklenmez — görev detay island'ı (React) ve SweetAlert
    // kendi tuşlarını kullanıyor.
    function bindShortcuts(opts) {
        var modalEl = opts.modal || '#shortcuts-modal';
        var instance = null;

        function getModal() {
            var el = document.querySelector(modalEl);
            if (!el) { return null; }
            if (!instance) { instance = new bootstrap.Modal(el); }
            return instance;
        }

        if (opts.menuButton) {
            $(opts.menuButton).click(function () {
                var m = getModal();
                if (m) { m.show(); }
            });
        }

        function typingInField(el) {
            if (!el) { return false; }
            var tag = (el.tagName || '').toLowerCase();
            return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
        }

        function overlayOpen() {
            return !!document.querySelector('.modal.show, .swal2-container, [role="dialog"]') ||
                   document.body.classList.contains('swal2-shown');
        }

        // Odaklı satır — j/k ile gezilir, ↵/x/1-4 bunun üzerinde çalışır.
        var focusedIndex = -1;
        function rowEls() { return $(opts.table + ' tbody tr[data-id]').get(); }

        function renderFocusedRow() {
            var rows = rowEls();
            $(opts.table + ' tbody tr').removeClass('is-focused');
            if (focusedIndex < 0 || focusedIndex >= rows.length) { return null; }
            var el = rows[focusedIndex];
            el.classList.add('is-focused');
            if (el.scrollIntoView) { el.scrollIntoView({ block: 'nearest' }); }
            return el;
        }

        function moveFocus(delta) {
            var rows = rowEls();
            if (!rows.length) { return; }
            focusedIndex = focusedIndex < 0
                ? (delta > 0 ? 0 : rows.length - 1)
                : Math.min(rows.length - 1, Math.max(0, focusedIndex + delta));
            renderFocusedRow();
        }

        function focusedTaskId() {
            var el = rowEls()[focusedIndex];
            return el ? el.getAttribute('data-id') : null;
        }

        // "g" ön ekli iki tuşlu diziler (g l / g k) için kısa süreli bekleme.
        var awaitingG = false;
        var gTimer = null;

        $(document).on('keydown', function (e) {
            if (e.ctrlKey || e.altKey || e.metaKey) { return; }
            if (typingInField(e.target)) { return; }

            // Esc yalnız kısayol penceresini kapatır; diğer pencereleri Bootstrap
            // ve React kendi yönetiyor, araya girmiyoruz.
            if (e.key === 'Escape') {
                var el = document.querySelector(modalEl);
                if (el && el.classList.contains('show') && instance) { instance.hide(); }
                return;
            }
            if (overlayOpen()) { return; }

            if (awaitingG) {
                awaitingG = false;
                clearTimeout(gTimer);
                if (e.key === 'l') { e.preventDefault(); opts.switchView('list'); return; }
                if (e.key === 'k') { e.preventDefault(); opts.switchView('kanban'); return; }
            }
            if (e.key === 'g') {
                awaitingG = true;
                gTimer = setTimeout(function () { awaitingG = false; }, 800);
                return;
            }

            switch (e.key) {
                case '?':
                    e.preventDefault();
                    var m = getModal();
                    if (m) { m.show(); }
                    return;
                case '/':
                    e.preventDefault();
                    $(opts.searchInput).focus();
                    return;
                case 'n':
                    if ($(opts.newButton).length) { e.preventDefault(); $(opts.newButton).trigger('click'); }
                    return;
            }

            // Buradan sonrası liste görünümüne özgü
            if (opts.getView() !== 'list') { return; }

            if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); return; }
            if (e.key === 'k' || e.key === 'ArrowUp')   { e.preventDefault(); moveFocus(-1); return; }

            var id = focusedTaskId();
            if (!id) { return; }

            if (e.key === 'Enter') { e.preventDefault(); opts.openTask(id); return; }

            if (e.key === 'x' && opts.canBulk) {
                e.preventDefault();
                var $cb = $(opts.table + ' tbody tr[data-id="' + id + '"] .apya-row-check');
                $cb.prop('checked', !$cb.prop('checked')).trigger('change');
                return;
            }

            if (opts.canChangeStatus && ['1', '2', '3', '4'].indexOf(e.key) > -1) {
                e.preventDefault();
                opts.onStatusKey(id, parseInt(e.key, 10));
            }
        });

        return { renderFocusedRow: renderFocusedRow };
    }

    // --- Sekme şeridi + "＋" menüsü (birleşik sekme sistemi) ----------------
    // /Tasks'taki "kapatılabilir sekme + ＋ menü + Shell.BoardTabs" deseninin
    // paylaşılan hâli — Tasks/index.js'ten çıkarıldı, ProjectDetails de kullanır.
    //
    // Sabit sekmeler Razor'da basılır (etiket localization'dan gelsin diye) ve
    // kapatılınca yalnız `d-none` alır; parametreli sekmeler (kayıtlı görünüm /
    // proje panosu) JS ile üretilir. Düzen kullanıcıya SUNUCUDA, yüzey (scope)
    // başına kaydedilir: POST /api/app/shell/set-board-tabs {scope, tabs}.
    // Sayfaya düzen şeridin `data-board-tabs` attribute'üyle gelir, ayrı istek yok.
    //
    // Yüzeye özgü olan her şey DIŞARIDA: hangi panelin görüneceği (onActivate),
    // okunan düzendeki sekmenin çizilebilir olup olmadığı (isValidTab), "＋"
    // menüsünün ek bölümleri (populateMenu). Modül yalnız şerit + menü + kalıcılık.
    function createTabs(opts) {
        var strip = document.querySelector(opts.strip);
        var maxTabs = opts.maxTabs || 16;

        function tabId(t) { return t.ref ? t.kind + ':' + t.ref : t.kind; }
        function findTab(id) {
            return tabs.filter(function (t) { return tabId(t) === id; })[0] || null;
        }

        function readInitialTabs() {
            // Düzen sayfayla birlikte geldi (PageModel → data-board-tabs).
            // BOŞ = kullanıcı hiç dokunmamış → yüzeyin varsayılan sekmeleri.
            var raw = strip ? strip.getAttribute('data-board-tabs') : '';
            var parsed = [];
            try { parsed = raw ? JSON.parse(raw) : []; } catch (e) { parsed = []; }
            var clean = (Array.isArray(parsed) ? parsed : []).filter(function (t) {
                return t && t.kind && opts.isValidTab(t);
            });
            var result = clean.length ? clean : opts.defaultTabs.slice();

            // SABİT sekmeler her zaman açık: kayıtlı düzen onları içermiyorsa
            // (örn. bütçe yetkisi sekme kaydedildikten SONRA verildi) başa
            // eklenir — kapatma düğmeleri olmadığı için düzenden düşemezler.
            (opts.requiredTabs || []).forEach(function (kind, i) {
                var present = result.some(function (t) { return t.kind === kind && !t.ref; });
                if (!present) { result.splice(i, 0, { kind: kind }); }
            });
            return result;
        }

        var tabs = readInitialTabs();
        var activeTabId = null;

        function persistTabs() {
            // Sunucuya yaz — başarısız olursa SESSİZCE yut: sekme düzeni kritik
            // değil, kullanıcıya hata kutusu göstermek işi bölerdi (kabuk
            // sabitlemeleriyle aynı gerekçe, apya-sidebar-shell.js → savePins).
            // Bir sonraki yüklemede sunucudaki hâl geri gelir.
            var token = (document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1];
            fetch('/api/app/shell/set-board-tabs', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': token ? decodeURIComponent(token) : ''
                },
                body: JSON.stringify({
                    scope: opts.scope,
                    tabs: tabs.map(function (t) {
                        return { kind: t.kind, ref: t.ref || '', title: t.title || '' };
                    })
                })
            }).catch(function () { /* yoksay */ });
        }

        function buildDynamicTab(t) {
            var el = document.createElement('span');
            el.className = 'apya-console-tab';
            el.setAttribute('data-tab', tabId(t));
            el.setAttribute('data-tab-dynamic', '1');
            el.title = t.title || '';

            var main = document.createElement('button');
            main.type = 'button';
            main.className = 'apya-console-tab-main';
            main.setAttribute('role', 'tab');
            main.setAttribute('aria-selected', 'false');
            var icon = document.createElement('i');
            icon.className = (opts.dynamicIcon && opts.dynamicIcon(t)) || 'fa fa-bookmark';
            icon.setAttribute('aria-hidden', 'true');
            main.appendChild(icon);
            // Başlık kullanıcı girdisidir (proje/görünüm adı) → textContent ile
            // basılır, innerHTML ile değil. Kendi span'inde duruyor çünkü dar
            // yerlerde (mobil alt bar) kırpılması gerekiyor ve çıplak metin
            // düğümüne text-overflow uygulanamaz.
            var label = document.createElement('span');
            label.className = 'apya-console-tab-label';
            label.textContent = t.title || '';
            main.appendChild(label);
            el.appendChild(main);

            var close = document.createElement('button');
            close.type = 'button';
            close.className = 'apya-console-tab-close';
            close.title = 'Sekmeyi kapat';
            close.setAttribute('aria-label', (t.title || 'Sekme') + ' sekmesini kapat');
            close.innerHTML = '<i class="fa fa-xmark" aria-hidden="true"></i>';
            el.appendChild(close);
            return el;
        }

        function renderTabs() {
            // Sabit sekmeler DOM'da KALIR, yalnız gizlenir: panelleri ve
            // yükleyicileri zaten kurulu, geri açmak tek sınıf değişimi olsun.
            $(strip).children('.apya-console-tab').addClass('d-none');
            $(strip).children('[data-tab-dynamic]').remove();

            // Sıra kullanıcının: her sekme yeniden SONA eklenir, böylece DOM
            // sırası `tabs` dizisiyle birebir olur.
            tabs.forEach(function (t) {
                var el = t.ref
                    ? buildDynamicTab(t)
                    : strip.querySelector(':scope > [data-tab="' + t.kind + '"]');
                if (!el) { return; }
                el.classList.remove('d-none');
                // Son sekme kapatılamaz: sekmesiz konsol hiçbir şey göstermez.
                el.classList.toggle('is-only', tabs.length === 1);
                strip.appendChild(el);
            });

            syncActiveTab();
            renderAddMenu();
        }

        function syncActiveTab() {
            var $all = $(strip).children('.apya-console-tab');
            $all.removeClass('active').find('.apya-console-tab-main').attr('aria-selected', 'false');
            $all.filter('[data-tab="' + activeTabId + '"]')
                .addClass('active').find('.apya-console-tab-main').attr('aria-selected', 'true');
        }

        // "＋" menüsü. İlk bölüm her yüzeyde aynı: kapatılmış sabit panolar
        // (etiket/ikon DOM'dan okunur — ikinci bir Türkçe kopya tutulmaz,
        // adlandırma Razor'da tek kaynak kalır). Yüzeye özgü bölümleri
        // opts.populateMenu ekler. AÇIK sekmeler listelenmez; menü "ne
        // ekleyebilirim" sorusunu yanıtlar, açık sekmeleri tekrarlamaz.
        function renderAddMenu() {
            if (!opts.menu) { return; }
            var $menu = $(opts.menu).empty();
            var open = {};
            tabs.forEach(function (t) { open[tabId(t)] = true; });

            function section(title) {
                $menu.append($('<div class="apya-console-menu-head is-divided">').text(title));
            }
            function row(icon, label, onPick) {
                $('<button type="button" class="apya-console-menu-item">')
                    .append($('<span class="apya-console-menu-icon">')
                        .append($('<i aria-hidden="true">').attr('class', icon)))
                    .append($('<span>').text(label))
                    .on('click', onPick)
                    .appendTo($menu);
            }

            var closed = [];
            $(strip).children('.apya-console-tab:not([data-tab-dynamic])').each(function () {
                var kind = this.getAttribute('data-tab');
                if (open[kind]) { return; }
                closed.push({
                    kind: kind,
                    label: $(this).find('.apya-console-tab-main').text().trim(),
                    icon: $(this).find('.apya-console-tab-main i').attr('class') || 'fa fa-table-columns'
                });
            });
            if (closed.length) {
                section('Panolar');
                closed.forEach(function (c) {
                    row(c.icon, c.label, function () { openTab({ kind: c.kind }); });
                });
            }

            if (opts.populateMenu) {
                opts.populateMenu({ section: section, row: row, openTab: openTab, open: open });
            }

            if (!$menu.children().length) {
                $menu.append($('<div class="apya-console-menu-hint px-3 py-2">')
                    .text('Eklenecek başka pano yok.'));
            }
        }

        function openTab(t) {
            if (!findTab(tabId(t))) {
                if (tabs.length >= maxTabs) {
                    abp.notify.warn('En fazla ' + maxTabs + ' pano açık olabilir. Önce bir sekme kapatın.');
                    return;
                }
                tabs.push(t);
                renderTabs();
                persistTabs();
            }
            activateTab(tabId(t));
        }

        function closeTab(id) {
            if (tabs.length <= 1) { return; }
            var i = -1;
            tabs.forEach(function (t, ix) { if (tabId(t) === id) { i = ix; } });
            if (i < 0) { return; }

            tabs.splice(i, 1);
            renderTabs();
            persistTabs();

            // Kapatılan sekme AKTİFSE komşusuna geçilir; değilse bakılan pano
            // yerinde kalsın — kapatma bir gezinme değil.
            if (activeTabId === id) {
                activateTab(tabId(tabs[Math.min(i, tabs.length - 1)]));
            }
        }

        function activateTab(id) {
            var t = findTab(id);
            if (!t) { return; }
            activeTabId = id;
            syncActiveTab();
            // Panel takası, URL yazımı ve tembel yükleme yüzeyin işi.
            if (opts.onActivate) { opts.onActivate(t, id); }
        }

        // Şerit-panel onarımı için (bkz. index.js switchView): sekmeyi AÇAR ama
        // etkinleştirme geri çağrısını tetiklemez — çağıran paneli zaten gösterdi.
        function ensureTab(t) {
            if (!findTab(tabId(t))) {
                tabs.push(t);
                renderTabs();
                persistTabs();
            }
        }

        // Yalnız işaretler; onActivate ÇAĞRILMAZ (panel zaten görünür).
        function markActive(id) {
            activeTabId = id;
            syncActiveTab();
        }

        $(strip)
            .on('click', '.apya-console-tab-main', function () {
                activateTab($(this).closest('.apya-console-tab').attr('data-tab'));
            })
            .on('click', '.apya-console-tab-close', function (e) {
                e.stopPropagation();
                closeTab($(this).closest('.apya-console-tab').attr('data-tab'));
            });

        // Menü HER AÇILIŞTA yeniden çizilir: içerikleri (kayıtlı görünümler,
        // proje listesi) sayfa yaşarken değişebiliyor; açılış tek güvenilir an.
        if (opts.addButton) {
            $(opts.addButton).on('show.bs.dropdown', renderAddMenu);
        }

        return {
            tabId: tabId,
            findTab: findTab,
            count: function () { return tabs.length; },
            firstId: function () { return tabs.length ? tabId(tabs[0]) : null; },
            activeId: function () { return activeTabId; },
            render: renderTabs,
            renderMenu: renderAddMenu,
            open: openTab,
            close: closeTab,
            activate: activateTab,
            ensure: ensureTab,
            markActive: markActive
        };
    }

    apya.taskConsole = {
        createState: createState,
        bindDropdownChip: bindDropdownChip,
        bindToggleChip: bindToggleChip,
        createBulkSelection: createBulkSelection,
        bindDensitySegment: bindDensitySegment,
        createColumnPrefs: createColumnPrefs,
        renderEmptyState: renderEmptyState,
        createSavedViews: createSavedViews,
        createSubtaskHierarchy: createSubtaskHierarchy,
        bindShortcuts: bindShortcuts,
        runSequential: runSequential,
        createTabs: createTabs
    };
})(window, jQuery);
