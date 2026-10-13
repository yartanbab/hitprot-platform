/* =============================================================================
   APYA FINANCE MODAL — Gelir/Gider modalı ortak davranışları
   -----------------------------------------------------------------------------
   apya.financeModal.bindProjectDateRange(opts)
     • Proje seçiliyse tarih girişini projenin başlangıç–bitiş aralığına sınırlar
       (date input min/max) ve aralık dışındaki değerde Kaydet'i bloke eder.
     • Bloke mekanizması jQuery-validation kuralıdır: ABP ModalManager kaydetmeden
       önce $form.valid() çağırır → kural başarısızsa kayıt durur, mesaj görünür.

   opts = {
     formSelector:    '...'   // modal form (CSS seçici)
     projectSelector: '#Income_ProjectId'
     dateSelector:    '#Income_IncomeDate'
     projectDates:    { '<projectId>': { s:'yyyy-MM-dd'|null, e:'yyyy-MM-dd'|null }, ... }
   }
   Not: <input type="date"> .val() her zaman 'yyyy-MM-dd' (ISO) → string karşılaştırma
   leksikografik olarak doğru sıralanır; min/max da aynı formatı kullanır.
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (apya.financeModal) { return; }

    var methodRegistered = false;
    function ensureMethod() {
        if (methodRegistered || typeof $ === 'undefined' || !$.validator) { return; }
        methodRegistered = true;
        // Global, durumsuz: tarih input'unun kendi form'undan proje seçicisini ve
        // .data('apyaProjectDates') sözlüğünü okur (kapanış sızıntısı yok).
        $.validator.addMethod('apyaProjectDateRange', function (value, element) {
            var $d = $(element);
            var dates = $d.data('apyaProjectDates') || {};
            var pid = $d.closest('form').find('[data-apya-project-select]').val();
            var i = pid ? dates[pid] : null;
            if (!i || !value) { return true; }          // proje yok / tarih boş → kural uygulanmaz
            if (i.s && value < i.s) { return false; }
            if (i.e && value > i.e) { return false; }
            return true;
        });
    }

    function fmtTr(s) { return s ? s.split('-').reverse().join('.') : '—'; } // 2026-06-22 → 22.06.2026

    apya.financeModal = {
        bindProjectDateRange: function (opts) {
            var $form = $(opts.formSelector);
            if (!$form.length) { return; }
            var $proj = $form.find(opts.projectSelector);
            var $date = $form.find(opts.dateSelector);
            if (!$proj.length || !$date.length) { return; }
            var dates = opts.projectDates || {};

            $proj.attr('data-apya-project-select', '');
            $date.data('apyaProjectDates', dates);

            function applyBounds() {
                var pid = $proj.val();
                var i = pid ? dates[pid] : null;
                if (i && i.s) { $date.attr('min', i.s); } else { $date.removeAttr('min'); }
                if (i && i.e) { $date.attr('max', i.e); } else { $date.removeAttr('max'); }
            }
            $proj.on('change', applyBounds);
            applyBounds();

            ensureMethod();
            $form.validate();                 // validator yoksa başlatır, varsa mevcutu döndürür
            $date.rules('add', {
                apyaProjectDateRange: true,
                messages: {
                    apyaProjectDateRange: function () {
                        var pid = $proj.val();
                        var i = (pid && dates[pid]) || {};
                        return 'Seçilen tarih, projenin tarih aralığı dışında (' +
                            fmtTr(i.s) + ' – ' + fmtTr(i.e) + '). Lütfen aralık içinde bir tarih seçin.';
                    }
                }
            });
        },

        /* ---------------------------------------------------------------
           bindBudgetContext(opts)
             Proje secilince butce kalemi + gorev seciciyi doldurur.

             KURAL (kullanici karari 2026-09-01): kalem, PROJENIN KALEMI VARSA
             zorunludur. Proje secili degilse alanlar hic gorunmez; proje var ama
             kalem tanimlanmamissa alan gorunur, zorunlu olmaz. Ayni kural
             sunucuda da isliyor (ProjectBudgetManager.EnsureBudgetLineIsValidAsync);
             buradaki erken geri bildirim, tek savunma hatti DEGIL.
           --------------------------------------------------------------- */
        bindBudgetContext: function (opts) {
            var $form = $(opts.formSelector);
            if (!$form.length) { return; }

            var $proj = $form.find(opts.projectSelector);
            var $line = $form.find(opts.lineSelector);
            var $task = $form.find(opts.taskSelector);
            var $lineWrap = $form.find(opts.lineWrapSelector);
            var $taskWrap = $form.find(opts.taskWrapSelector);
            var $hint = $form.find(opts.hintSelector);
            if (!$proj.length || !$line.length) { return; }

            // Duzenlenen kaydin degerleri YALNIZ ilk yuklemede geri konur; sonraki
            // proje degisimlerinde konmaz, yoksa baska projenin kalemi secili kalir.
            var pendingLineId = opts.selectedLineId || '';
            var pendingTaskId = opts.selectedTaskId || '';
            var lines = [];

            function money(v) {
                try { return v.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
                catch (e) { return String(v); }
            }

            function showHint() {
                if (!$hint.length) { return; }
                var id = $line.val();
                var l = id ? lines.filter(function (x) { return x.id === id; })[0] : null;
                if (!l) { $hint.text('').addClass('d-none'); return; }
                var asim = l.remainingAmount < 0;
                $hint.text((asim ? 'asim ' : 'kalan ') + money(Math.abs(l.remainingAmount)))
                    .toggleClass('text-danger', asim)
                    .removeClass('d-none');
            }

            function reset() {
                lines = [];
                $line.empty().prop('required', false).removeAttr('required');
                $task.empty();
                if ($hint.length) { $hint.text('').addClass('d-none'); }
                $lineWrap.addClass('d-none');
                $taskWrap.addClass('d-none');
            }

            function fill(lookup) {
                lines = lookup.lines || [];

                $line.empty().append($('<option>').val('').text(
                    lines.length ? '\u2014 Kalem se\u00e7in \u2014' : '\u2014 Bu projede kalem tan\u0131ml\u0131 de\u011fil \u2014'));
                lines.forEach(function (l) {
                    $line.append($('<option>').val(l.id).text((l.code ? l.code + ' \u00b7 ' : '') + l.name));
                });

                // optionalLine (FIN-05, fatura): kalem gosterilir ama hicbir zaman zorunlu olmaz.
                if (lookup.requiresBudgetLine && !opts.optionalLine) {
                    $line.attr('required', 'required').prop('required', true);
                } else {
                    $line.prop('required', false).removeAttr('required');
                }
                $lineWrap.removeClass('d-none');

                var tasks = lookup.tasks || [];
                $task.empty().append($('<option>').val('').text('\u2014 G\u00f6rev yok \u2014'));
                tasks.forEach(function (t) {
                    $task.append($('<option>').val(t.id).text(t.title));
                });
                // Liste bossa (projede gorev yok ya da gorev yetkisi yok) secici basilmaz.
                $taskWrap.toggleClass('d-none', tasks.length === 0);

                if (pendingLineId) { $line.val(pendingLineId); pendingLineId = ''; }
                if (pendingTaskId) { $task.val(pendingTaskId); pendingTaskId = ''; }
                showHint();
            }

            function load() {
                var pid = $proj.val();
                if (!pid) { reset(); return; }
                apya.financeModal._fetchLookup(pid).then(fill).catch(function () {
                    // Yetki yok ya da uc erisilemedi: alanlari gizle, formu BLOKE ETME.
                    // Sunucu yine dogruluyor; burada kilitlemek yanlis pozitif olurdu.
                    reset();
                });
            }

            $proj.on('change', function () { pendingLineId = ''; pendingTaskId = ''; load(); });
            $line.on('change', showHint);
            load();
        },

        /* ABP'nin urettigi JS proxy'si. Uc nokta ADI tek noktada tutulur;
           servis imzasi degisirse duzeltilecek tek yer burasi.
           REST'e elle dusen bir yedek YOK: proxy script layout'ta her sayfada
           yukleniyor, yoksa zaten sayfanin yarisi calismiyor demektir. Proxy
           bulunamazsa reddedilir, cagiran alanlari gizler. */
        _fetchLookup: function (projectId) {
            var svc = window.apya && apya.platform && apya.platform.projectBudgets
                && apya.platform.projectBudgets.projectBudget;
            if (!svc || !svc.getRecordFormLookup) {
                return Promise.reject(new Error('projectBudget proxy yok'));
            }
            return Promise.resolve(svc.getRecordFormLookup(projectId));
        }
    };

    /* -------------------------------------------------------------------------
       FIN-05 · Fatura <-> gider capraz uyarisi (urun karari 2026-10-13)
       Fatura ve gider pencereleri kayittan sonra, karsilik bulunamadiysa yanitta
       { crossWarning: { kind: 'invoice'|'expense', invoiceId } } dondurur.
       Pencereyi acan sayfalarin cogu kayittan sonra sayfayi YENILER; uyari
       yenilemede kaybolmasin diye sessionStorage'da tutulur ve kullanici
       kapatinca silinir. Kayit her durumda yapilmistir: uyari engellemez.
       ------------------------------------------------------------------------- */
    var CROSS_KEY = 'apya.finance.crossWarning';
    var CROSS_MAX_AGE_MS = 2 * 60 * 1000;
    var crossShowing = false;

    function crossRead() {
        try {
            var raw = window.sessionStorage.getItem(CROSS_KEY);
            if (!raw) { return null; }
            var w = JSON.parse(raw);
            if (!w || !w.kind || (Date.now() - (w.at || 0)) > CROSS_MAX_AGE_MS) { crossClear(); return null; }
            return w;
        } catch (e) { return null; }
    }
    function crossClear() {
        try { window.sessionStorage.removeItem(CROSS_KEY); } catch (e) { }
    }
    function crossText(key, fallback) {
        try {
            var v = abp.localization.getResource('Platform')(key);
            return v && v !== key ? v : fallback;
        } catch (e) { return fallback; }
    }

    function crossShow() {
        if (crossShowing || typeof abp === 'undefined' || !abp.message) { return; }
        var w = crossRead();
        if (!w) { return; }
        crossShowing = true;

        if (w.kind === 'invoice' && w.invoiceId) {
            abp.message.confirm(
                crossText('Finance:CrossCheck:InvoiceWithoutExpense',
                    'Bu al\u0131\u015f faturas\u0131n\u0131n kar\u015f\u0131l\u0131\u011f\u0131 olan bir gider kayd\u0131 bulunamad\u0131. \u015eimdi gider kayd\u0131n\u0131 girmek ister misiniz?'),
                crossText('Finance:CrossCheck:Title', 'Kar\u015f\u0131l\u0131k bulunamad\u0131')
            ).then(function (ok) {
                crossShowing = false;
                crossClear();
                if (!ok) { return; }
                var modal = new abp.ModalManager({ viewUrl: abp.appPath + 'Expenses/CreateModal' });
                modal.onResult(function () { window.location.reload(); });
                modal.open({ FromInvoiceId: w.invoiceId });
            });
            return;
        }

        abp.message.warn(
            crossText('Finance:CrossCheck:ExpenseWithoutInvoice',
                'Bu giderin kar\u015f\u0131l\u0131\u011f\u0131 olan bir al\u0131\u015f faturas\u0131 bulunamad\u0131. Fatura geldiyse Faturalar ekran\u0131ndan girmeyi unutmay\u0131n.'),
            crossText('Finance:CrossCheck:Title', 'Kar\u015f\u0131l\u0131k bulunamad\u0131')
        ).then(function () {
            crossShowing = false;
            crossClear();
        });
    }

    if (typeof $ !== 'undefined') {
        $(document).ajaxSuccess(function (event, xhr, settings) {
            var url = (settings && settings.url) || '';
            if (!settings || String(settings.type).toUpperCase() !== 'POST') { return; }
            if (url.indexOf('Invoices/CreateModal') < 0 && url.indexOf('Expenses/CreateModal') < 0) { return; }
            var w = xhr && xhr.responseJSON && xhr.responseJSON.crossWarning;
            if (!w || !w.kind) { return; }
            try {
                window.sessionStorage.setItem(CROSS_KEY,
                    JSON.stringify({ kind: w.kind, invoiceId: w.invoiceId || null, at: Date.now() }));
            } catch (e) { }
            // Pencere kapanip sayfanin kendi onResult'i calistiktan SONRA goster.
            setTimeout(crossShow, 300);
        });
        // Sayfa yenilendiyse bekleyen uyari burada gosterilir.
        $(function () { setTimeout(crossShow, 300); });
    }
})();
