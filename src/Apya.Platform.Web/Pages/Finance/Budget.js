$(function () {
    // Proje bağlamı kök düğümde; modal URL'leri onsuz kurulamaz.
    var projectId = $('.apya-page').data('project-id');
    if (!projectId) { return; }

    var lineModal = new abp.ModalManager(abp.appPath + 'Finance/BudgetLineModal');
    var trancheModal = new abp.ModalManager(abp.appPath + 'Finance/TrancheModal');
    var collectionModal = new abp.ModalManager(abp.appPath + 'Finance/CollectionModal');
    var deductionModal = new abp.ModalManager(abp.appPath + 'Finance/DeductionModal');
    var revisionModal = new abp.ModalManager(abp.appPath + 'Finance/RevisionModal');
    var fxPolicyModal = new abp.ModalManager(abp.appPath + 'Finance/FxPolicyModal');
    var contextWizard = new abp.ModalManager(abp.appPath + 'Finance/ContextWizardModal');
    var supportRateModal = new abp.ModalManager(abp.appPath + 'Finance/SupportRateModal');
    var vatExemptionModal = new abp.ModalManager(abp.appPath + 'Finance/VatExemptionModal');

    // Paneller sunucuda render ediliyor; kaydettikten sonra sayfayı tazelemek
    // hem tabloyu hem KPI'ları hem şerit toplamlarını tek hamlede tutarlı yapar.
    [lineModal, trancheModal, collectionModal, deductionModal, revisionModal, fxPolicyModal, contextWizard, supportRateModal, vatExemptionModal]
        .forEach(function (m) { m.onResult(function () { window.location.reload(); }); });

    $('#BtnSupportRate').on('click', function () {
        supportRateModal.open({ projectId: projectId });
    });

    $('#BtnVatExemption').on('click', function () {
        vatExemptionModal.open({ projectId: projectId });
    });

    $(document).on('click', '[data-add-child-line]', function () {
        lineModal.open({ projectId: projectId, parentId: $(this).data('add-child-line') });
    });

    initLineFormShares();
    initLinesTable();

    $('#BtnFxPolicy').on('click', function () {
        fxPolicyModal.open({ projectId: projectId });
    });

    $('#BtnContextWizard').on('click', function () {
        contextWizard.open({ projectId: projectId });
    });

    $('#BtnAddBudgetLine').on('click', function () {
        lineModal.open({ projectId: projectId });
    });

    $('#BtnApplyRevision').on('click', function () {
        revisionModal.open({ projectId: projectId });
    });

    $('#BtnAddTranche').on('click', function () {
        trancheModal.open({ projectId: projectId });
    });

    $(document).on('click', '[data-edit-line]', function () {
        lineModal.open({ projectId: projectId, id: $(this).data('edit-line') });
    });

    $(document).on('click', '[data-edit-tranche]', function () {
        trancheModal.open({ projectId: projectId, id: $(this).data('edit-tranche') });
    });

    $(document).on('click', '[data-collect-tranche]', function () {
        collectionModal.open({ projectId: projectId, id: $(this).data('collect-tranche') });
    });

    $(document).on('click', '[data-add-deduction]', function () {
        deductionModal.open({ projectId: projectId, id: $(this).data('add-deduction') });
    });

    $(document).on('click', '[data-revise-budget]', function () {
        revisionModal.open({ projectId: projectId, deductionId: $(this).data('revise-budget') });
    });

    // Silme onayı: data-confirm taşıyan düğmeleri genel delege (wwwroot/js/apya-confirm.js) sorar.
});

/**
 * Kalem formu: hibe payı ↔ kurum payı. Yalnız hibe payı sunucuya gider; kurum payı
 * onaylanan − hibe olarak türetilir. Kurum yazılırsa hibe ondan hesaplanır. İkisi de
 * boşsa pay sunucuda destek oranından hesaplanır — ipucu satırı bunu gösterir.
 * Modal AJAX ile geldiği için olaylar belgeye bağlanır.
 */
function initLineFormShares() {
    var money = window.apya && window.apya.moneyInput;
    if (!money) { return; }

    function form() { return document.querySelector('form[data-budget-line-form]'); }
    function el(id) { var f = form(); return f ? f.querySelector('#' + id) : null; }

    function approved() {
        var a = money.getValue(el('Line_ApprovedAmount'));
        return a !== null ? a : (money.getValue(el('Line_PlannedAmount')) || 0);
    }

    function fmt(n) { return n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

    function round2(n) { return Math.round(n * 100) / 100; }

    function refresh(source) {
        var f = form();
        if (!f) { return; }
        var grantEl = el('Line_GrantAmount');
        var instEl = el('Line_InstitutionShare');
        var hint = f.querySelector('[data-share-hint]');
        var total = approved();

        if (source === 'inst') {
            var inst = money.getValue(instEl);
            money.setValue(grantEl, inst === null ? null : round2(Math.max(0, total - inst)));
        }

        var grant = money.getValue(grantEl);
        if (source !== 'inst') {
            money.setValue(instEl, grant === null ? null : round2(total - grant));
        }

        var rateAttr = f.getAttribute('data-support-rate');
        var rate = rateAttr ? Number(rateAttr) : null;
        if (!hint) { return; }
        if (grant !== null) {
            hint.textContent = grant > total
                ? 'Hibe payı onaylanan tutardan büyük olamaz.'
                : 'Hibe payı elle girildi; destek oranı bu kalem için kullanılmaz.';
        } else if (rate !== null && isFinite(rate)) {
            var g = round2(total * rate / 100);
            hint.textContent = 'Boş bırakılırsa destek oranından hesaplanır: hibe %' + rate.toLocaleString('tr-TR') +
                ' = ' + fmt(g) + ', kurum ' + fmt(round2(total - g)) + '.';
        } else {
            hint.textContent = 'Projede destek oranı yok; hibe payı girilmezse pay hesaplanmaz.';
        }
    }

    $(document).on('input', 'form[data-budget-line-form] #Line_GrantAmount', function () { refresh('grant'); });
    $(document).on('input', 'form[data-budget-line-form] #Line_InstitutionShare', function () { refresh('inst'); });
    $(document).on('input', 'form[data-budget-line-form] #Line_ApprovedAmount, form[data-budget-line-form] #Line_PlannedAmount',
        function () { refresh('amount'); });

    // Kod yazılınca üst kalem önerilir ("2.1" → "2"): yalnız üst kalem henüz seçilmemişse.
    $(document).on('change', 'form[data-budget-line-form] #Line_Code', function () {
        var select = el('Line_ParentId');
        if (!select || select.value) { return; }
        var code = String(this.value || '').trim();
        var cut = code.lastIndexOf('.');
        if (cut <= 0) { return; }
        var parentCode = code.slice(0, cut);
        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].getAttribute('data-code') === parentCode) {
                select.value = select.options[i].value;
                break;
            }
        }
    });

    // Para maskesi modal açıldıktan sonra kurulur; ilk hesap ondan SONRA yapılmalı.
    document.addEventListener('shown.bs.modal', function () {
        setTimeout(function () { refresh('amount'); }, 0);
    });
}

/**
 * Bütçe kalemi tablosu: süzgeç + sıralama. Satırlar ağaçtır (data-parent); sıralama
 * yalnız kardeşleri yer değiştirir, alt kalem her zaman üst kaleminin altında kalır.
 * Varsayılan sıra kodun SAYI sırasıdır (1, 2, 2.1, 2.2, 10) — sunucunun bastığı sıra.
 */
function initLinesTable() {
    var table = document.querySelector('[data-budget-lines-table]');
    if (!table) { return; }
    var tbody = table.tBodies[0];
    var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr[data-line-row]'));
    var byId = {};
    rows.forEach(function (r) { byId[r.dataset.id] = { row: r, children: [] }; });
    var roots = [];
    rows.forEach(function (r) {
        var p = r.dataset.parent && byId[r.dataset.parent];
        (p ? p.children : roots).push(byId[r.dataset.id]);
    });

    var collator = new Intl.Collator('tr', { numeric: true, sensitivity: 'base' });
    var state = { key: 'code', dir: 1 };

    function num(r, key) {
        var v = r.dataset[key];
        return v === '' || v === undefined ? null : Number(v);
    }

    function compare(a, b) {
        var ra = a.row, rb = b.row, k = state.key, res;
        if (k === 'code' || k === 'name') {
            var x = ra.dataset[k] || '', y = rb.dataset[k] || '';
            // Kodsuz kalem yön ne olursa olsun en sonda.
            if (!x || !y) { res = x ? -1 : y ? 1 : 0; return res || (Number(ra.dataset.order) - Number(rb.dataset.order)); }
            res = collator.compare(x, y);
        } else {
            var nx = num(ra, k), ny = num(rb, k);
            // Değeri bilinmeyen (ör. hibe payı "—") yön ne olursa olsun en sonda.
            if (nx === null || ny === null) { return nx === null ? (ny === null ? 0 : 1) : -1; }
            res = nx - ny;
        }
        return res * state.dir || (Number(ra.dataset.order) - Number(rb.dataset.order));
    }

    function render() {
        var frag = document.createDocumentFragment();
        (function walk(nodes) {
            nodes.slice().sort(compare).forEach(function (n) { frag.appendChild(n.row); walk(n.children); });
        })(roots);
        tbody.appendChild(frag);
    }

    table.querySelectorAll('[data-sort-key]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var key = btn.getAttribute('data-sort-key');
            state.dir = state.key === key ? -state.dir : 1;
            state.key = key;
            table.querySelectorAll('th[aria-sort]').forEach(function (th) { th.setAttribute('aria-sort', 'none'); });
            btn.closest('th').setAttribute('aria-sort', state.dir === 1 ? 'ascending' : 'descending');
            render();
        });
    });

    var bar = document.querySelector('[data-budget-filter]');
    if (!bar) { return; }
    var textInput = bar.querySelector('[data-filter-text]');
    var statusSelect = bar.querySelector('[data-filter-status]');
    var countLabel = bar.querySelector('[data-filter-count]');
    var emptyNote = document.querySelector('[data-filter-empty]');

    function matches(r, text, status) {
        if (text) {
            var hay = ((r.dataset.code || '') + ' ' + (r.dataset.name || '')).toLocaleLowerCase('tr-TR');
            if (hay.indexOf(text) === -1) { return false; }
        }
        var spent = num(r, 'spent') || 0;
        switch (status) {
            case 'over': return num(r, 'approved') > 0 && spent > num(r, 'approved');
            case 'spent': return spent > 0;
            case 'unspent': return spent === 0;
            case 'manual-grant': return r.dataset.manualGrant === '1';
            default: return true;
        }
    }

    function applyFilter() {
        var text = (textInput.value || '').trim().toLocaleLowerCase('tr-TR');
        var status = statusSelect.value;
        var active = !!text || !!status;
        var hits = 0;

        // Eşleşen kalem görünür; üst kalemleri de (ağaç kopmasın) görünür kalır.
        (function walk(nodes) {
            var any = false;
            nodes.forEach(function (n) {
                var self = matches(n.row, text, status);
                var child = walk(n.children);
                if (self) { hits++; }
                n.row.classList.toggle('d-none', !(self || child));
                n.row.classList.toggle('opacity-50', active && !self && child);
                any = any || self || child;
            });
            return any;
        })(roots);

        countLabel.textContent = active ? hits + ' / ' + rows.length + ' kalem' : '';
        if (emptyNote) { emptyNote.classList.toggle('d-none', !active || hits > 0); }
    }

    textInput.addEventListener('input', applyFilter);
    statusSelect.addEventListener('change', applyFilter);
}
