$(function () {
    var service = apya.platform.grants.grantStageTemplate;
    var l = abp.localization.getResource('Platform');

    var partyKeys = ['Firma', 'Danisman', 'Ortak', 'Kurum'];

    var templates = [];
    var activeId = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function num(v) { return v === '' || v == null ? null : Number(v); }

    // ---------- Sol liste ----------
    function paintList() {
        var $list = $('#TplList').empty();
        templates.forEach(function (t) {
            var meta = l('Grants:StageTemplates:StepCount', t.steps.length) +
                ' · ' + l('Grants:StageTemplates:UsedByGrants', t.grantCount);
            var badge = t.isDefault
                ? '<span class="apya-chip apya-chip-neutral">' + esc(l('Grants:StageTemplates:Default')) + '</span>'
                : '';
            $list.append(
                '<button type="button" class="apya-tpl-item' + (t.id === activeId ? ' is-active' : '') +
                '" data-id="' + t.id + '">' +
                '<span class="apya-tpl-item-name">' + esc(t.name) + badge + '</span>' +
                '<span class="apya-tpl-item-meta">' + esc(meta) + '</span>' +
                '</button>');
        });

        var empty = templates.length === 0;
        $('#TplEmpty').toggleClass('d-none', !empty);
        $('#TplEditor, .apya-tpl-side').toggleClass('d-none', empty);
    }

    $('#TplList').on('click', '.apya-tpl-item', function () {
        activeId = $(this).data('id');
        paintAll();
    });

    // ---------- Aşama satırı ----------
    function stepRow(s) {
        var owner = partyKeys.map(function (k, i) {
            return '<option value="' + i + '"' + (s.owner === i ? ' selected' : '') + '>' +
                esc(l('Grants:Party:' + k)) + '</option>';
        }).join('');

        return $(
            '<div class="apya-tpl-row apya-tpl-step">' +
            '  <span class="apya-tpl-grip"><i class="fa fa-grip-vertical"></i></span>' +
            '  <span class="apya-tpl-name-cell">' +
            '    <input type="text" class="form-control form-control-sm apya-tpl-step-name" maxlength="96" ' +
            '           placeholder="' + esc(l('Grants:StageTemplates:StepNamePlaceholder')) + '" />' +
            '    <input type="text" class="form-control form-control-sm apya-tpl-note" maxlength="128" ' +
            '           placeholder="' + esc(l('Grants:StageTemplates:NotePlaceholder')) + '" />' +
            '  </span>' +
            '  <select class="form-select form-select-sm apya-tpl-owner">' + owner + '</select>' +
            '  <input type="text" class="form-control form-control-sm apya-tpl-docs" maxlength="128" ' +
            '         placeholder="' + esc(l('Grants:StageTemplates:DocumentsPlaceholder')) + '" />' +
            '  <input type="text" class="form-control form-control-sm apya-tpl-completion" maxlength="128" ' +
            '         placeholder="' + esc(l('Grants:StageTemplates:CompletionPlaceholder')) + '" />' +
            '  <span class="apya-tpl-reminder">' +
            '    <input type="number" min="0" max="365" class="form-control form-control-sm apya-tpl-days" />' +
            '    <span>' + esc(l('Grants:StageTemplates:ReminderDays')) + '</span>' +
            '  </span>' +
            '  <button type="button" class="apya-tpl-remove" title="' + esc(l('Grants:Parameters:Documents:Remove')) + '">' +
            '    <i class="fa fa-xmark"></i></button>' +
            '</div>')
            // Değerler .val() ile veriliyor: HTML'e gömülse kullanıcı metnindeki
            // tırnak/işaretler markup'ı bozardı.
            .find('.apya-tpl-step-name').val(s.name || '').end()
            .find('.apya-tpl-note').val(s.note || '').end()
            .find('.apya-tpl-docs').val(s.requiredDocumentsNote || '').end()
            .find('.apya-tpl-completion').val(s.completionCondition || '').end()
            .find('.apya-tpl-days').val(s.reminderDays == null ? '' : s.reminderDays).end();
    }

    function paintEditor() {
        var t = current();
        if (!t) { return; }

        $('#TplName').val(t.name || '');
        $('#TplDescription').val(t.description || '');
        $('#TplIsDefault').prop('checked', !!t.isDefault);
        $('#TplStepCount').text(l('Grants:StageTemplates:StepCount', t.steps.length));
        // Kaydedilmemiş yeni şablon silinemez.
        $('#TplDelete').toggleClass('d-none', !t.id);

        var $steps = $('#TplSteps').empty();
        t.steps.forEach(function (s) { $steps.append(stepRow(s)); });
        $('#TplStepsEmpty').toggleClass('d-none', t.steps.length > 0);
    }

    function paintSide() {
        var t = current();
        if (!t) { return; }

        var $board = $('#TplBoard').empty();
        collectSteps().forEach(function (s) {
            $board.append(
                '<div class="apya-tpl-column"><span>' + esc(s.name) + '</span>' +
                '<span class="apya-tpl-column-owner">' + esc(l('Grants:Party:' + partyKeys[s.owner])) + '</span></div>');
        });

        var $calls = $('#TplCalls').empty();
        if (!t.calls || t.calls.length === 0) {
            $calls.append('<div class="small text-muted">' + esc(l('Grants:StageTemplates:NoCalls')) + '</div>');
        } else {
            t.calls.forEach(function (c) {
                $calls.append('<div class="apya-tpl-call"><span>' + esc(c.label) + '</span>' +
                    '<span class="apya-tpl-call-count">' + c.openApplicationCount + '</span></div>');
            });
        }

        $('#TplWarning')
            .toggleClass('d-none', !t.openApplicationCount)
            .text(l('Grants:StageTemplates:ChangeWarning', t.openApplicationCount || 0));
    }

    function paintAll() {
        paintList();
        paintEditor();
        paintSide();
    }

    function current() {
        return templates.find(function (t) { return t.id === activeId; });
    }

    // ---------- Form → DTO ----------
    function collectSteps() {
        return $('#TplSteps .apya-tpl-step').map(function (i) {
            var $r = $(this);
            return {
                order: i,
                name: $r.find('.apya-tpl-step-name').val(),
                note: $r.find('.apya-tpl-note').val(),
                owner: Number($r.find('.apya-tpl-owner').val()),
                requiredDocumentsNote: $r.find('.apya-tpl-docs').val(),
                completionCondition: $r.find('.apya-tpl-completion').val(),
                reminderDays: num($r.find('.apya-tpl-days').val())
            };
        }).get();
    }

    function collect() {
        return {
            name: $('#TplName').val(),
            description: $('#TplDescription').val(),
            isDefault: $('#TplIsDefault').is(':checked'),
            steps: collectSteps()
        };
    }

    // ---------- Aşama ekle / sil / sırala ----------
    $('#TplAddStep').on('click', function () {
        $('#TplSteps').append(stepRow({ owner: 2 }));
        $('#TplStepsEmpty').addClass('d-none');
        refreshStepMeta();
    });

    $('#TplSteps').on('click', '.apya-tpl-remove', function () {
        $(this).closest('.apya-tpl-step').remove();
        $('#TplStepsEmpty').toggleClass('d-none', $('#TplSteps .apya-tpl-step').length > 0);
        refreshStepMeta();
    });

    // Pano önizlemesi ve sayaç formla birlikte yaşar — kaydetmeyi beklemez.
    $('#TplSteps').on('input change', 'input, select', refreshStepMeta);

    function refreshStepMeta() {
        $('#TplStepCount').text(l('Grants:StageTemplates:StepCount', $('#TplSteps .apya-tpl-step').length));
        paintSide();
    }

    new Sortable(document.getElementById('TplSteps'), {
        handle: '.apya-tpl-grip',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: refreshStepMeta
    });

    // ---------- Yeni / kaydet / sil ----------
    $('#TplNewBtn').on('click', function () {
        // Kaydedilmemiş taslak tekil: ikinci kez basılınca yenisi eskisinin yerini alır,
        // aksi halde current() id'si null olan iki kayıttan hep ilkini bulurdu.
        templates = templates.filter(function (t) { return t.id; });
        var draft = {
            id: null,
            name: l('Grants:StageTemplates:NewTemplateName'),
            description: '',
            isDefault: false,
            steps: [],
            grantCount: 0,
            openApplicationCount: 0,
            calls: []
        };
        templates.push(draft);
        activeId = null;
        paintAll();
        // Taslak kaydedilene kadar listede seçili görünmez; adı hemen düzenlensin.
        $('#TplName').trigger('focus');
    });

    $('#TplSave').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        var input = collect();
        var t = current();
        var call = t && t.id ? service.update(t.id, input) : service.create(input);
        call.then(function (saved) {
            abp.notify.success(l('Grants:StageTemplates:Saved'));
            activeId = saved.id;
            return load();
        }).always(function () { $btn.prop('disabled', false); });
    });

    $('#TplDelete').on('click', function () {
        var t = current();
        if (!t || !t.id) { return; }
        abp.message.confirm(l('Grants:StageTemplates:DeleteConfirm', t.name)).then(function (ok) {
            if (!ok) { return; }
            service.delete(t.id).then(function () {
                abp.notify.success(l('Grants:StageTemplates:Deleted'));
                activeId = null;
                load();
            });
        });
    });

    function load() {
        return service.getList().then(function (list) {
            templates = list || [];
            if (!templates.some(function (t) { return t.id === activeId; })) {
                activeId = templates.length ? templates[0].id : null;
            }
            paintAll();
        });
    }

    load();
});
