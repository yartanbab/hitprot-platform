$(function () {
    var service = apya.platform.notifications.notificationTemplate;
    var l = abp.localization.getResource('Platform');

    var model = null;
    var selectedId = null;
    var category = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }

    function templates() { return (model && model.templates) || []; }
    function selected() { return templates().filter(function (t) { return t.id === selectedId; })[0]; }

    // ---------- Sekmeler: verideki kategoriler, tanım sırasıyla ----------
    function paintTabs() {
        var seen = [];
        templates().forEach(function (t) { if (seen.indexOf(t.category) < 0) { seen.push(t.category); } });
        if (category === null || seen.indexOf(category) < 0) { category = seen[0]; }

        $('#NtTabs').html(seen.map(function (c) {
            var key = { 1: 'Tasks', 2: 'Projects', 8: 'Finance' }[c];
            return '<li class="nav-item"><button type="button" class="nav-link' + (c === category ? ' active' : '') +
                '" data-category="' + c + '">' + esc(l('Notification:Category:' + key)) + '</button></li>';
        }).join(''));
    }

    // ---------- Liste ----------
    function row(t) {
        var state = '<span class="apya-chip ' + (t.isEnabled ? 'apya-chip-positive' : 'apya-chip-neutral') + '">' +
            esc(l(t.isEnabled ? 'Grants:Notify:State:On' : 'Grants:Notify:State:Off')) + '</span>';

        return '<button type="button" class="apya-nt-row apya-nt-row--simple' + (t.id === selectedId ? ' is-selected' : '') +
            '" data-id="' + t.id + '">' +
            '<span class="apya-nt-name"><strong>' + esc(t.name) + '</strong><span>' + esc(t.subject) + '</span></span>' +
            '<span class="apya-nt-meta">' + esc(t.variantName || '') + '</span>' +
            '<span>' + state + '</span></button>';
    }

    function paintList() {
        var items = templates().filter(function (t) { return t.category === category; });
        $('#NtRows').removeClass('apya-skel-rows').html(items.map(row).join(''));
        $('#NtEmpty').toggleClass('d-none', items.length > 0);
        $('#NtCount').text(l('Grants:Notify:ActiveCount', model.enabledCount));
    }

    // ---------- Düzenleyici ----------
    function paintEditor() {
        var t = selected();
        $('#NtSelectHint').toggleClass('d-none', !!t);
        $('#NtEditor').toggleClass('d-none', !t);
        if (!t) {
            $('#NtEditorTitle').text(l('Grants:Notify:Preview'));
            return;
        }

        $('#NtEditorTitle').text(t.variantName ? t.name + ' · ' + t.variantName : t.name);
        $('#NtSubject').val(t.subject);
        $('#NtBody').val(t.body);
        $('#NtEnabled').prop('checked', t.isEnabled);
        $('#NtOffWarning').toggleClass('d-none', t.isEnabled);

        $('#NtVariables').html((t.variables || []).map(function (v) {
            return '<button type="button" class="apya-nt-var" data-var="' + esc(v) + '">' + esc(v) + '</button>';
        }).join(''));

        $('#NtPreviewSubject').text(t.previewSubject);
        $('#NtPreviewBody').text(t.previewBody);
    }

    function paint() {
        paintTabs();
        paintList();
        paintEditor();
    }

    // ---------- Olaylar ----------
    $('#NtTabs').on('click', '[data-category]', function () {
        category = parseInt($(this).data('category'), 10);
        var first = templates().filter(function (t) { return t.category === category; })[0];
        selectedId = first ? first.id : null;
        paint();
    });

    $('#NtRows').on('click', '.apya-nt-row', function () {
        selectedId = $(this).data('id');
        paintList();
        paintEditor();
    });

    $('#NtVariables').on('click', '.apya-nt-var', function () {
        var $body = $('#NtBody');
        var token = $(this).data('var');
        var text = $body.val();
        $body.val(text + (text && !/\s$/.test(text) ? ' ' : '') + token).focus();
    });

    $('#NtEnabled').on('change', function () {
        $('#NtOffWarning').toggleClass('d-none', $(this).is(':checked'));
    });

    $('#NtSaveBtn').on('click', function () {
        var t = selected();
        if (!t) { return; }

        service.save({
            id: t.id,
            subject: $('#NtSubject').val(),
            body: $('#NtBody').val(),
            isEnabled: $('#NtEnabled').is(':checked')
        }).then(function (dto) {
            model = dto;
            paint();
            abp.notify.success(l('Grants:Notify:Saved'));
        });
    });

    // ---------- Açılış ----------
    function load() {
        return Promise.resolve(service.get({ abpHandleError: false })).then(function (dto) {
            model = dto;
            var first = templates()[0];
            selectedId = first ? first.id : null;
            category = first ? first.category : null;
            paint();
        }, function (err) {
            $('#NtRows').removeClass('apya-skel-rows')
                .html(apya.loadState.errorHtml(l('Notify:Templates:LoadFailed'), 'js-nt-retry', err));
            $('#NtCount').text('');
        });
    }

    $('#NtRows').on('click', '.js-nt-retry', function () {
        $(this).prop('disabled', true);
        load();
    });

    load();
});
