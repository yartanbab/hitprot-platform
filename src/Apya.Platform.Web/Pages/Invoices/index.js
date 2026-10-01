$(function () {
    // Faturalar — master-detail (apya-shell.css §11 deseni, AiCenter/Workflows ile aynı iskelet).
    var service = apya.platform.invoices.invoice;
    var l = abp.localization.getResource('Platform');

    var createModal = new abp.ModalManager(abp.appPath + 'Invoices/CreateModal');
    var paymentModal = new abp.ModalManager(abp.appPath + 'Invoices/PaymentModal');

    var state = { all: [], filtered: [], selectedId: null, status: '', loading: false, loadFailed: false };
    var nextList = apya.latest();
    var nextDetail = apya.latest();

    var $md = $('#InvoicesMd');
    var $list = $('#InvoicesList');
    var $empty = $('#InvoicesListEmpty');
    var $detail = $('#InvoiceDetail');
    // Boş/hata durumu markup'ı iki cshtml'de kopya; eylemler JS'ten basılır. Hata bloğu listbox'ın DIŞINDA durur.
    var $clearFilters = $('<button type="button" class="btn btn-sm btn-outline-secondary" hidden>Filtreleri temizle</button>')
        .appendTo($empty)
        .on('click', function () {
            $('#InvoiceFilter').val('');
            $('#InvoiceStatusPills button[data-status=""]').trigger('click');
        });
    // Yükleme hatası kartı (Faz 4 kararları 2, 10): kanonik apya.loadState.errorHtml, load() reddinde basılır.
    var $loadError = $('<div hidden></div>')
        .on('click', '.js-invoices-retry', function () { $(this).prop('disabled', true); load(); })
        .insertAfter($empty);

    // Finans sekmesine gomuldugunde liste O PROJEYLE sinirlanir. /Invoices
    // sayfasinda oznitelik yoktur -> null -> davranis eskisiyle birebir ayni.
    var scopeProjectId = $md.data('project-id') || null;

    var STATUS = {
        0: { text: 'Taslak', chip: 'apya-chip-neutral' },
        1: { text: 'Gönderildi', chip: 'apya-chip-brand' },
        2: { text: 'Ödendi', chip: 'apya-chip-positive' },
        3: { text: 'İptal', chip: 'apya-chip-negative' },
        4: { text: 'Gecikmiş', chip: 'apya-chip-warning' }
    };

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function fmt(n) {
        return Number(n || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function fmtDate(iso) {
        return iso ? luxon.DateTime.fromISO(iso).toLocaleString() : '—';
    }

    function statusChip(status) {
        var s = STATUS[status] || STATUS[0];
        return '<span class="apya-chip ' + s.chip + '">' + s.text + '</span>';
    }

    function applyFilter() {
        var q = ($('#InvoiceFilter').val() || '').toLocaleLowerCase('tr-TR').trim();
        state.filtered = state.all.filter(function (x) {
            if (scopeProjectId && x.projectId !== scopeProjectId) { return false; }
            if (state.status !== '' && String(x.status) !== state.status) { return false; }
            if (!q) { return true; }
            return ((x.invoiceNumber || '').toLocaleLowerCase('tr-TR').indexOf(q) !== -1)
                || ((x.customerName || '').toLocaleLowerCase('tr-TR').indexOf(q) !== -1);
        });
        // Seçili fatura süzgeç dışına düştüyse panel onu göstermeye (ve "Ödeme Ekle"yi sunmaya) devam etmesin.
        if (state.selectedId && !state.filtered.some(function (x) { return x.id === state.selectedId; })) {
            state.selectedId = null;
            renderDetailEmpty();
        }
        renderList();
    }

    function renderList() {
        // Yükleniyor ve hata durumu state'te: süzgece yazmak ya da çipe basmak onları "bulunamadı" ile ezmez.
        var waiting = !state.all.length && state.loading;
        var failed = !state.all.length && !state.loading && state.loadFailed;
        $list.empty();
        $list.attr('aria-busy', waiting ? 'true' : null);
        $loadError.prop('hidden', !failed);
        $empty.prop('hidden', waiting || failed || state.filtered.length > 0);
        $clearFilters.prop('hidden', !(($('#InvoiceFilter').val() || '').trim() || state.status !== ''));
        if (waiting) {
            for (var i = 0; i < 6; i++) {
                $list.append('<li aria-hidden="true"><div class="apya-md-item"><span class="apya-skeleton d-block" style="height:12px;width:70%"></span></div></li>');
            }
            $('#InvoicesPagerInfo').text('Yükleniyor…');
            return;
        }
        if (failed) {
            $('#InvoicesPagerInfo').text('—');
            return;
        }
        state.filtered.forEach(function (x) {
            var directionIcon = x.direction === 1 ? 'fa-arrow-down-long text-warning' : 'fa-arrow-up-long text-primary';
            var li = $(
                '<li><button type="button" class="apya-md-item" role="option">' +
                '  <i class="fa ' + directionIcon + '" style="width:14px" aria-hidden="true"></i>' +
                '  <span class="apya-md-item-body">' +
                '    <span class="apya-md-item-title d-block">' + esc(x.invoiceNumber || '(numarasız)') + '</span>' +
                '    <span class="apya-md-item-sub d-block">' + esc(x.customerName || x.projectName || '—') + ' · ' + fmtDate(x.invoiceDate) + '</span>' +
                '  </span>' +
                '  <span class="apya-md-item-side">' +
                '    <span class="d-block apya-numeric fw-bold" style="font-size:12.5px">' + fmt(x.totalAmount) + ' ' + esc(x.currency) + '</span>' +
                '    ' + statusChip(x.status) +
                '  </span>' +
                '</button></li>'
            );
            var btn = li.find('button');
            btn.toggleClass('selected', x.id === state.selectedId)
               .attr('aria-selected', x.id === state.selectedId ? 'true' : 'false')
               .on('click', function () { select(x.id); });
            $list.append(li);
        });
        $('#InvoicesPagerInfo').text(state.filtered.length + ' fatura');
    }

    function renderDetailEmpty() {
        nextDetail(); // yoldaki detay yanıtı artık çizilmez
        $detail.removeAttr('data-invoice-id');
        $md.removeClass('has-selection');
        $detail.html(
            '<div class="apya-md-empty">' +
            '  <i class="fa fa-file-invoice-dollar" aria-hidden="true"></i>' +
            '  <span>Detaylarını görmek için soldaki listeden bir fatura seçin.</span>' +
            '</div>'
        );
    }

    function itemRow(item) {
        return '<tr>' +
            '<td>' + esc(item.description) + '</td>' +
            '<td class="text-end apya-numeric">' + fmt(item.quantity) + '</td>' +
            '<td class="text-end apya-numeric">' + fmt(item.unitPrice) + '</td>' +
            '<td class="text-end apya-numeric fw-semibold">' + fmt(item.totalPrice) + '</td>' +
            '</tr>';
    }

    function renderDetail(d) {
        var items = d.items || [];
        var subtotal = items.reduce(function (s, it) { return s + (it.totalPrice || 0); }, 0);
        var tax = d.totalAmount - subtotal;
        var isSales = d.direction === 0;

        var html =
            '<button type="button" class="apya-md-back" id="InvoiceDetailBack">' +
            '  <i class="fa fa-arrow-left" aria-hidden="true"></i> Listeye dön' +
            '</button>' +

            '<div class="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-3">' +
            '  <div class="min-w-0">' +
            '    <div class="d-flex align-items-center gap-2 flex-wrap">' +
            '      <span class="h6 mb-0">' + esc(d.invoiceNumber || '(numarasız)') + '</span>' + statusChip(d.status) +
            '    </div>' +
            '    <div class="text-muted mt-1" style="font-size:12.5px">' + esc(d.customerName || d.projectName || '—') + '</div>' +
            '  </div>' +
            '  <div class="d-flex gap-1 flex-wrap">' +
            (d.status !== 2 && abp.auth.isGranted('Platform.Invoices.Edit')
                ? '<button type="button" class="btn btn-sm btn-outline-secondary" id="InvoiceDetailPay"><i class="fa fa-hand-holding-dollar me-1"></i>Ödeme Ekle</button>' +
                  apya.hint('Faturaya kısmi ya da tam tahsilat kaydı ekler. Ödenen tutar genel toplamı karşılayınca fatura Ödendi durumuna geçer.', 'bottom')
                : '') +
            '    <button type="button" class="btn btn-sm btn-outline-secondary" id="InvoiceDetailPrint"><i class="fa fa-print me-1"></i>Yazdır</button>' +
            '    <button type="button" class="btn btn-sm btn-primary" id="InvoiceDetailSend"><i class="fa fa-paper-plane me-1"></i>Gönder</button>' +
            apya.hint('Faturayı e-posta ile karşı tarafa göndermek için. Bu işlev henüz devrede değil.', 'bottom') +
            '  </div>' +
            '</div>' +

            '<div class="row g-3 mb-3">' +
            '  <div class="col-sm-3"><div class="apya-md-overline">Düzenleme</div><div style="font-size:12.5px">' + fmtDate(d.invoiceDate) + '</div></div>' +
            '  <div class="col-sm-3"><div class="apya-md-overline">Vade</div><div style="font-size:12.5px">' + fmtDate(d.dueDate) + '</div></div>' +
            '  <div class="col-sm-3"><div class="apya-md-overline">Yön' +
            apya.hint('Satış = sizin kestiğiniz fatura; cari hesabı borçlandırır, sizin için alacak doğurur. Alış = size kesilen fatura; tedarikçiye borcunuzu oluşturur.') +
            '</div><div style="font-size:12.5px">' + (isSales ? 'Satış' : 'Alış') + '</div></div>' +
            '  <div class="col-sm-3"><div class="apya-md-overline">Ödenen</div><div class="apya-numeric" style="font-size:12.5px">' + fmt(d.paidAmount) + ' ' + esc(d.currency) + '</div></div>' +
            '</div>' +

            '<div class="table-responsive mb-3">' +
            '  <table class="table table-sm mb-0">' +
            '    <thead><tr><th>Kalem</th><th class="text-end">Adet</th><th class="text-end">Birim</th><th class="text-end">Tutar</th></tr></thead>' +
            '    <tbody>' + (items.length ? items.map(itemRow).join('') : '<tr><td colspan="4" class="text-muted text-center py-3">Kalem yok</td></tr>') + '</tbody>' +
            '  </table>' +
            '</div>' +

            '<div class="ms-auto" style="max-width:280px">' +
            '  <div class="d-flex justify-content-between" style="font-size:12.5px"><span class="text-muted">Ara toplam</span><span class="apya-numeric">' + fmt(subtotal) + ' ' + esc(d.currency) + '</span></div>' +
            '  <div class="d-flex justify-content-between mt-1" style="font-size:12.5px"><span class="text-muted">KDV (%' + fmt(d.taxRate) + ')</span><span class="apya-numeric">' + fmt(tax) + ' ' + esc(d.currency) + '</span></div>' +
            '  <div class="d-flex justify-content-between mt-2 pt-2 border-top fw-bold"><span>Genel Toplam</span><span class="apya-numeric">' + fmt(d.totalAmount) + ' ' + esc(d.currency) + '</span></div>' +
            '</div>' +

            (d.notes ? '<div class="mt-3"><div class="apya-md-overline mb-1">Notlar</div><div style="font-size:12.5px">' + esc(d.notes) + '</div></div>' : '');

        $detail.html(html).attr('data-invoice-id', d.id);
        $md.addClass('has-selection');

        $('#InvoiceDetailBack').on('click', function () {
            state.selectedId = null;
            renderList();
            renderDetailEmpty();
        });
        $('#InvoiceDetailPrint').on('click', function () {
            window.open(abp.appPath + 'Invoices/Print/' + d.id, '_blank');
        });
        $('#InvoiceDetailSend').on('click', function () {
            abp.notify.info('E-posta ile gönderim yakında eklenecek.');
        });
        $('#InvoiceDetailPay').on('click', function () {
            paymentModal.open({ invoiceId: d.id });
        });
    }

    // Seçim işareti ile panel aynı faturayı gösterir: yüklenirken önceki faturanın eylemleri durmaz,
    // geç dönen eski yanıt yeni seçimi ezmez, hata olursa seçim geri alınır.
    function renderDetailLoading() {
        $detail.removeAttr('data-invoice-id').html(
            '<div class="apya-md-empty" role="status">' +
            '  <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' +
            '  <span>Fatura yükleniyor…</span>' +
            '</div>'
        );
    }

    function select(id) {
        var isLatest = nextDetail();
        state.selectedId = id;
        renderList();
        // Ödeme sonrası aynı fatura yenilenirken panel titremesin.
        if ($detail.attr('data-invoice-id') !== String(id)) { renderDetailLoading(); }
        Promise.resolve(service.get(id)).then(function (d) {
            if (isLatest()) { renderDetail(d); }
        }, function () {
            if (!isLatest()) { return; }
            state.selectedId = null;
            renderList();
            renderDetailEmpty();
        });
    }

    // Liste hiç gelmemişken (açılış, Tekrar dene) yükleme hatası ABP penceresi açmaz, liste yerine
    // kart basılır (Faz 4 kararı 2). Veri ekrandayken (oluştur/ödeme sonrası) yenileme düşerse liste
    // korunur ve tek kanal ABP penceresidir — sessiz kalsaydı yeni fatura "kayboldu" sanılırdı.
    function load(keepSelection) {
        var isLatest = nextList();
        var initial = !state.all.length;
        state.loading = true;
        state.loadFailed = false;
        if (!state.all.length) { renderList(); }
        Promise.resolve(service.getList({ maxResultCount: 200, sorting: 'invoiceDate desc' }, { abpHandleError: !initial })).then(function (result) {
            if (!isLatest()) { return; }
            state.loading = false;
            state.loadFailed = false;
            state.all = result.items || [];
            if (!keepSelection) { state.selectedId = null; }
            applyFilter();
            var stillThere = state.filtered.some(function (x) { return x.id === state.selectedId; });
            if (!stillThere) {
                state.selectedId = null;
                var isDesktop = window.matchMedia('(min-width: 992px)').matches;
                if (isDesktop && state.filtered.length > 0) {
                    select(state.filtered[0].id);
                } else {
                    renderList();
                    renderDetailEmpty();
                }
                return;
            }
            renderList();
            if (state.selectedId) { select(state.selectedId); }
        }, function (err) {
            if (!isLatest()) { return; }
            state.loading = false;
            state.loadFailed = true;
            if (!state.all.length) {
                $loadError.html(apya.loadState.errorHtml('Faturalar yüklenemedi.', 'js-invoices-retry', err));
                renderList();
            }
        });
    }

    // ── Olaylar ──
    var filterDebounce;
    $('#InvoiceFilter').on('keyup', function () {
        clearTimeout(filterDebounce);
        filterDebounce = setTimeout(applyFilter, 250);
    });

    $('#InvoiceStatusPills').on('click', 'button[data-status]', function () {
        $('#InvoiceStatusPills button').removeClass('btn-primary').addClass('btn-outline-secondary');
        $(this).removeClass('btn-outline-secondary').addClass('btn-primary');
        state.status = $(this).data('status').toString();
        applyFilter();
    });

    createModal.onResult(function () { abp.notify.success(l('Notify:Invoice:Created')); load(true); });
    paymentModal.onResult(function () { abp.notify.success(l('Notify:Invoice:PaymentRecorded')); load(true); });

    $('#NewInvoiceButton').click(function (e) { e.preventDefault(); createModal.open(); });

    // Cariler'deki "+ Yeni Fatura" ile ?customerId=... üzerinden gelindiyse
    // formu o cari ön-dolu şekilde otomatik aç.
    // Yalniz /Invoices sayfasinda: Finans sekmesinde ?customerId yok, ama
    // olsaydi bile orada fatura formunu kendiliginden acmak istemiyoruz.
    var presetCustomerId = scopeProjectId
        ? null
        : new URLSearchParams(window.location.search).get('customerId');
    if (presetCustomerId) {
        createModal.open({ customerId: presetCustomerId });
    }

    load();
});
