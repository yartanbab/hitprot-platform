// "İlişkiyi değiştir…" diyaloğu (birleşik sekme sistemi PR-3b, tasarım 3b).
// Üç hedef: bir GÖREVE bağla (arama ile) · yalnız PROJEYE bağla · BAĞIMSIZ
// (Genel gider — hiçbir bütçeye sayılmaz). Sunucu yarısı granüler SetScopeAsync:
// görev seçilirse proje GÖREVDEN türetilir, buradaki proje seçimi yok sayılır.
//
// abp.message.prompt BİLEREK kullanılmadı (STRING çözer, inputType yok — bkz.
// hafıza notu); kendi Bootstrap modalımız. Kaydetme ABP JS proxy'siyle:
// expense → apya.platform.expenses.expense.setScope, income → incomes.incomeEntry.
//
// Kullananlar: Pages/Projects/ProjectDetails.js (proje Finans paneli) ve
// /js/apya-task-finance.js (/Tasks Finans paneli).
(function (window, $) {
    'use strict';

    var apya = window.apya = window.apya || {};

    function esc(s) { return $('<div>').text(s == null ? '' : String(s)).html(); }

    var MODAL_ID = 'apya-scope-modal';
    var modal = null;          // bootstrap.Modal örneği (tek sefer kurulur)
    var current = null;        // { opts, taskChoice }

    function svcFor(kind) {
        return kind === 'income'
            ? window.apya.platform.incomes.incomeEntry
            : window.apya.platform.expenses.expense;
    }

    function fmtAmount(amount, currency) {
        var n = Number(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 });
        return currency === 'TRY' ? n + ' ₺' : n + ' ' + currency;
    }

    function ensureModal() {
        if (document.getElementById(MODAL_ID)) { return; }

        var html = ''
            + '<div class="modal fade" id="' + MODAL_ID + '" tabindex="-1" aria-hidden="true">'
            + '  <div class="modal-dialog"><div class="modal-content">'
            + '    <div class="modal-header py-2">'
            + '      <div><h6 class="modal-title mb-0">İlişkiyi değiştir</h6>'
            + '        <div class="text-muted" style="font-size:12px" data-scope="subtitle"></div></div>'
            + '      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>'
            + '    </div>'
            + '    <div class="modal-body d-flex flex-column gap-2">'
            + '      <label class="border rounded p-2 d-flex gap-2 align-items-start" style="cursor:pointer">'
            + '        <input type="radio" name="scope-target" value="task" class="mt-1">'
            + '        <span class="flex-grow-1"><b style="font-size:13px">Bir göreve bağla</b>'
            + '          <input type="text" class="form-control form-control-sm mt-1 d-none" data-scope="task-search" placeholder="Görev ara…">'
            + '          <div class="list-group mt-1" data-scope="task-results"></div>'
            + '          <div class="mt-1 d-none" data-scope="task-chosen"></div>'
            + '        </span>'
            + '      </label>'
            + '      <label class="border rounded p-2 d-flex gap-2 align-items-center" style="cursor:pointer" data-scope="project-option">'
            + '        <input type="radio" name="scope-target" value="project">'
            + '        <span class="flex-grow-1"><b style="font-size:13px">Yalnız projeye bağla</b>'
            + '          <span class="text-muted" style="font-size:12px"> — göreve bağsız, bütçeye sayılır</span>'
            + '          <select class="form-select form-select-sm mt-1 d-none" data-scope="project-select"></select>'
            + '        </span>'
            + '      </label>'
            + '      <label class="border rounded p-2 d-flex gap-2 align-items-center" style="cursor:pointer">'
            + '        <input type="radio" name="scope-target" value="none">'
            + '        <span><b style="font-size:13px">Bağımsız yap</b>'
            + '          <span class="text-muted" style="font-size:12px"> — Genel gider havuzuna taşınır</span></span>'
            + '      </label>'
            + '      <div class="d-flex gap-2 p-2 rounded" data-scope="impact"'
            + '           style="background:var(--apya-warning-50,#FFFBEB);border:1px solid var(--apya-warning-100,#FEF3C7)">'
            + '        <i class="fa fa-scale-balanced mt-1" style="color:var(--apya-text-warning,#B45309)" aria-hidden="true"></i>'
            + '        <span style="font-size:12px;color:var(--apya-text-warning,#92400E)" data-scope="impact-text"></span>'
            + '      </div>'
            + '    </div>'
            + '    <div class="modal-footer py-2">'
            + '      <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Vazgeç</button>'
            + '      <button type="button" class="btn btn-sm btn-primary" data-scope="save" disabled>Taşı ve kaydet</button>'
            + '    </div>'
            + '  </div></div>'
            + '</div>';

        $(document.body).append(html);
        modal = new bootstrap.Modal(document.getElementById(MODAL_ID));
        bindEvents();
    }

    function $m(sel) { return $('#' + MODAL_ID).find('[data-scope="' + sel + '"]'); }
    function selectedTarget() { return $('#' + MODAL_ID).find('[name="scope-target"]:checked').val() || null; }

    function updateImpact() {
        if (!current) { return; }
        var r = current.opts.record;
        var target = selectedTarget();
        var text = 'Bu kayıt ' + fmtAmount(r.amount, r.currency) + ' tutarında. ';
        if (target === 'none') {
            text += 'Bağımsız yapılırsa hiçbir proje bütçesine sayılmaz — Genel gider havuzunda toplanır.';
        } else if (target === 'task') {
            text += 'Seçilen görevin PROJESİ neyse tutar o bütçeye sayılır (proje görevden türetilir).';
        } else if (target === 'project') {
            text += 'Tutar seçilen projenin bütçesine sayılır.';
        } else {
            text += 'Bir hedef seçin.';
        }
        // Kalem bağı varsa uyar — kapsam değişince sunucu bağı düşürür.
        text += ' Proje değişirse bütçe kalemi bağı kaldırılır.';
        $m('impact-text').text(text);
    }

    function updateSaveEnabled() {
        var target = selectedTarget();
        var ok = target === 'none'
            || (target === 'task' && current.taskChoice)
            || (target === 'project' && (current.opts.projectId || $m('project-select').val()));
        $m('save').prop('disabled', !ok);
    }

    var searchTimer = null;

    function bindEvents() {
        var $root = $('#' + MODAL_ID);

        $root.on('change', '[name="scope-target"]', function () {
            var target = selectedTarget();
            $m('task-search').toggleClass('d-none', target !== 'task');
            $m('task-results').empty();
            $m('project-select').toggleClass('d-none',
                target !== 'project' || !!current.opts.projectId);
            if (target === 'task') { $m('task-search').trigger('focus'); }
            updateImpact();
            updateSaveEnabled();
        });

        // Görev arama — 300ms debounce, en fazla 20 sonuç. Liste konsol
        // sözleşmesindeki getList'i kullanır (gizlilik süzgeci sunucuda).
        $root.on('input', '[data-scope="task-search"]', function () {
            var q = $(this).val().trim();
            clearTimeout(searchTimer);
            if (q.length < 2) { $m('task-results').empty(); return; }
            searchTimer = setTimeout(function () {
                window.apya.platform.tasks.task
                    .getList({ filter: q, maxResultCount: 20, rootOnly: false })
                    .then(function (res) {
                        var $list = $m('task-results').empty();
                        (res.items || []).forEach(function (t) {
                            $('<button type="button" class="list-group-item list-group-item-action py-1" style="font-size:12.5px">')
                                .text(t.title + (t.projectName ? ' · ' + t.projectName : ''))
                                .on('click', function () {
                                    current.taskChoice = { id: t.id, title: t.title };
                                    $m('task-chosen').removeClass('d-none')
                                        .html('<span class="apya-chip apya-chip-neutral"><i class="fa fa-list-check me-1"></i>'
                                            + esc(t.title) + '</span>');
                                    $m('task-results').empty();
                                    $m('task-search').val('');
                                    updateSaveEnabled();
                                })
                                .appendTo($list);
                        });
                    });
            }, 300);
        });

        $root.on('click', '[data-scope="save"]', function () {
            var target = selectedTarget();
            var input = { taskId: null, projectId: null };
            if (target === 'task') { input.taskId = current.taskChoice.id; }
            else if (target === 'project') {
                input.projectId = current.opts.projectId || $m('project-select').val();
            }

            var $btn = $(this).prop('disabled', true);
            svcFor(current.opts.kind).setScope(current.opts.record.id, input)
                .then(function () {
                    abp.notify.success('İlişki güncellendi.');
                    modal.hide();
                    if (current.opts.onSaved) { current.opts.onSaved(); }
                })
                .always(function () { $btn.prop('disabled', false); });
        });
    }

    function open(opts) {
        ensureModal();
        current = { opts: opts, taskChoice: null };

        $m('subtitle').text(opts.record.title + ' · ' + fmtAmount(opts.record.amount, opts.record.currency));
        $('#' + MODAL_ID).find('[name="scope-target"]').prop('checked', false);
        $m('task-search').addClass('d-none').val('');
        $m('task-results').empty();
        $m('task-chosen').addClass('d-none').empty();

        // Proje hedefi: sabit bağlam (proje konsolu) ya da seçici (/Tasks).
        var $sel = $m('project-select').addClass('d-none').empty();
        if (!opts.projectId) {
            (opts.projectOptions || []).forEach(function (p) {
                $('<option>').val(p.id).text(p.name + (p.code ? ' (' + p.code + ')' : '')).appendTo($sel);
            });
        }

        updateImpact();
        updateSaveEnabled();
        modal.show();
    }

    apya.financeScope = { open: open };
})(window, jQuery);
