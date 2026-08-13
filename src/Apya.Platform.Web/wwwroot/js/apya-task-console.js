// Görev konsolu — ProjectDetails konsolundaki jenerik etkileşim desenlerinin
// paylaşılabilir hâli: filtre state'i + URL senkronu, chip kablolaması, toplu
// seçim çubuğu, satır yoğunluğu, kolon seçici ve boş-hâl basımı.
//
// Bilinçli sınır: burada HİÇBİR sayfaya özel bilgi yok (proje, AI, bütçe, ekip
// yok). Sayfa hangi filtre alanlarına sahip olduğunu `defaults` ile bildirir,
// modül onları URL'e yazıp chip'lere bağlar.
//
// Şu an yalnız Pages/Tasks/index.js kullanıyor. Pages/Projects/ProjectDetails.js
// kendi kopyasıyla çalışmaya devam ediyor — onu bu modüle taşımak ayrı bir iş
// (yeni merge edilmiş bir sayfayı aynı turda riske atmamak için bilinçli karar).
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
    function createDensity(opts) {
        var KEY = opts.storageKey;
        var VALUES = ['compact', 'cozy', 'comfortable'];

        function read() {
            var v = null;
            try { v = localStorage.getItem(KEY); } catch (e) { v = null; }
            return VALUES.indexOf(v) >= 0 ? v : 'cozy';
        }

        function apply(value) {
            $(opts.root).attr('data-density', value);
            $('[data-density-set]').each(function () {
                $(this).attr('aria-pressed', String($(this).data('density-set') === value));
            });
        }

        $(document).on('click', '[data-density-set]', function () {
            var v = String($(this).data('density-set'));
            try { localStorage.setItem(KEY, v); } catch (e) { /* özel kip — yoksay */ }
            apply(v);
            if (opts.onChange) { opts.onChange(v); }
        });

        return { apply: function () { apply(read()); }, value: read };
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

    apya.taskConsole = {
        createState: createState,
        bindDropdownChip: bindDropdownChip,
        bindToggleChip: bindToggleChip,
        createBulkSelection: createBulkSelection,
        createDensity: createDensity,
        createColumnPrefs: createColumnPrefs,
        renderEmptyState: renderEmptyState,
        runSequential: runSequential
    };
})(window, jQuery);
