/* =============================================================================
   Makro Yönetimi (/Admin/Macros) — host. Tasarım docs/design/makro-ekran (2a).
   Varsayılan açık model: katalogdaki her makro bir satır; ayar kaydedilir ya da
   varsayılana döndürülür. Adres ve izin KODDA (salt-okur gösterilir).
   ============================================================================= */
$(function () {
    'use strict';

    var service = apya.platform.macros.macroAdmin;
    var l = abp.localization.getResource('Platform');
    var KIND = { 1: 'Link', 2: 'Modal' }; // MacroKind

    var $md = $('#MacroAdminMd');
    var $list = $('#MacroAdminList');
    var $empty = $('#MacroAdminListEmpty');
    var $detail = $('#MacroAdminDetail');
    var options = JSON.parse(document.getElementById('apya-macro-admin-options').textContent || '{}');

    var items = [];
    var selectedKey = null;
    var filter = 'all';

    function esc(t) { return $('<div>').text(t == null ? '' : String(t)).html(); }
    function attr(t) { return esc(t).replace(/"/g, '&quot;'); }
    function title(m) { return m.displayName || m.defaultTitle; }
    // Menüye bağlı makronun ikonu/adresi menüde yaşar; sayfa host'un gördüğü menüden çözer.
    function menu(m) { return (m.menuName && options.menu && options.menu[m.menuName]) || {}; }
    function icon(m) { return m.icon || m.defaultIcon || menu(m).icon || 'fa fa-bolt'; }

    function state(m) {
        if (m.isHidden) { return { cls: 'apya-chip-neutral', text: l('Macros:Admin:State:Hidden') }; }
        if (m.isCustomized) { return { cls: 'apya-chip-accent', text: l('Macros:Admin:State:Custom') }; }
        return { cls: 'apya-chip-positive', text: l('Macros:Admin:State:Default') };
    }

    function matches(m) {
        if (filter === 'custom' && !m.isCustomized) { return false; }
        if (filter === 'hidden' && !m.isHidden) { return false; }
        var q = ($('#MacroAdminFilter').val() || '').trim().toLocaleLowerCase('tr-TR');
        return !q || (title(m) + ' ' + m.key + ' ' + m.area).toLocaleLowerCase('tr-TR').indexOf(q) !== -1;
    }

    function renderList() {
        var visible = items.filter(matches);
        $list.html(visible.map(function (m) {
            var s = state(m);
            return '<li><button type="button" class="apya-md-item' + (m.key === selectedKey ? ' selected' : '') +
                '" role="option" aria-selected="' + (m.key === selectedKey) + '" data-key="' + attr(m.key) + '">' +
                '<span class="apya-macro-admin-icon" aria-hidden="true"><i class="' + attr(icon(m)) + '"></i></span>' +
                '<span class="apya-md-item-body"><span class="apya-md-item-title d-block">' + esc(title(m)) + '</span>' +
                '<span class="apya-md-item-sub d-block">' + esc(m.area) + ' · ' + esc(l('Macros:Admin:Kind:' + KIND[m.kind])) +
                ' · <span class="apya-macro-admin-mono">' + m.usage30Days + '×</span></span></span>' +
                '<span class="apya-md-item-side"><span class="apya-chip ' + s.cls + '">' + esc(s.text) + '</span></span>' +
                '</button></li>';
        }).join(''));
        $empty.prop('hidden', visible.length > 0);
        $('[data-count="all"]').text(items.length);
        $('[data-count="custom"]').text(items.filter(function (m) { return m.isCustomized; }).length);
        $('[data-count="hidden"]').text(items.filter(function (m) { return m.isHidden; }).length);
    }

    function renderDetail(m) {
        var target = m.url || menu(m).url || l('Macros:Admin:TargetMenu', m.menuName);
        var permission = m.permission || l('Macros:Admin:PermissionFromMenu');
        var packages = options.packages.map(function (p) {
            var checked = m.packages.indexOf(p.value) !== -1;
            return '<label class="form-check form-check-inline"><input class="form-check-input" type="checkbox" name="MacroPackages" value="' +
                p.value + '"' + (checked ? ' checked' : '') + '><span class="form-check-label">' + esc(p.name) + '</span></label>';
        }).join('');

        $detail.html(
            '<button type="button" class="apya-md-back" id="MacroAdminBack"><i class="fa fa-arrow-left" aria-hidden="true"></i>' +
            esc(l('Macros:Admin:Back')) + '</button>' +
            '<div class="apya-macro-admin-head">' +
            '<span class="apya-macro-admin-icon is-large" aria-hidden="true"><i class="' + attr(icon(m)) + '"></i></span>' +
            '<span class="apya-macro-admin-head-text"><span class="apya-macro-admin-title">' + esc(title(m)) + '</span>' +
            '<span class="apya-macro-admin-mono">' + esc(m.key) + ' · ' + esc(l('Macros:Admin:Usage', m.usage30Days)) + '</span></span></div>' +

            '<dl class="apya-macro-admin-facts">' +
            '<div><dt>' + esc(l('Macros:Admin:KindLabel')) + '</dt><dd>' + esc(l('Macros:Admin:Kind:' + KIND[m.kind])) + '</dd></div>' +
            '<div><dt>' + esc(l('Macros:Admin:Target')) + '</dt><dd class="apya-macro-admin-mono">' + esc(target) + '</dd></div>' +
            '<div><dt>' + esc(l('Macros:Admin:Permission')) + '</dt><dd class="apya-macro-admin-mono">' + esc(permission) + '</dd></div>' +
            '<div><dt>' + esc(l('Macros:Admin:Area')) + '</dt><dd>' + esc(m.area) + '</dd></div>' +
            '</dl>' +

            '<form id="MacroAdminForm" class="apya-macro-admin-form" novalidate>' +
            '<div class="row g-3">' +
            '<div class="col-md-6"><label class="form-label" for="MacroDisplayName">' + esc(l('Macros:Admin:DisplayName')) + '</label>' +
            '<input class="form-control form-control-sm" id="MacroDisplayName" maxlength="64" value="' + attr(m.displayName || '') +
            '" placeholder="' + attr(m.defaultTitle) + '"></div>' +
            '<div class="col-md-6"><label class="form-label" for="MacroIcon">' + esc(l('Macros:Admin:Icon')) + '</label>' +
            '<input class="form-control form-control-sm apya-macro-admin-mono" id="MacroIcon" maxlength="64" value="' + attr(m.icon || '') +
            '" placeholder="' + attr(m.defaultIcon || 'fa fa-bolt') + '" aria-describedby="MacroIconHint">' +
            '<div class="form-text" id="MacroIconHint">' + esc(l('Macros:Admin:IconHint')) + '</div></div>' +
            '</div>' +

            '<fieldset class="apya-macro-admin-scope"><legend class="form-label">' + esc(l('Macros:Admin:Scope')) + '</legend>' +
            '<p class="form-text mt-0">' + esc(l('Macros:Admin:ScopeHint')) + '</p>' +
            '<div class="mb-2"><span class="apya-macro-admin-sublabel">' + esc(l('Macros:Admin:Packages')) + '</span>' + packages + '</div>' +
            '<label class="form-label" for="MacroRoles">' + esc(l('Macros:Admin:Roles')) + '</label>' +
            '<input class="form-control form-control-sm" id="MacroRoles" list="MacroRoleSuggestions" value="' + attr(m.roles.join(', ')) + '">' +
            '</fieldset>' +

            '<div class="row g-3 align-items-end">' +
            '<div class="col-sm-4"><label class="form-label" for="MacroSortOrder">' + esc(l('Macros:Admin:SortOrder')) + '</label>' +
            '<input class="form-control form-control-sm" type="number" min="0" max="999" id="MacroSortOrder" value="' +
            (m.sortOrder == null ? '' : m.sortOrder) + '" aria-describedby="MacroSortOrderHint"></div>' +
            '<div class="col-sm-8"><div class="form-text" id="MacroSortOrderHint">' + esc(l('Macros:Admin:SortOrderHint')) + '</div></div>' +
            '</div>' +

            '<div class="form-check form-switch mt-3"><input class="form-check-input" type="checkbox" role="switch" id="MacroDefaultPinned"' +
            (m.defaultPinned ? ' checked' : '') + '><label class="form-check-label" for="MacroDefaultPinned">' + esc(l('Macros:Admin:DefaultPinned')) + '</label></div>' +
            '<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" id="MacroIsHidden"' +
            (m.isHidden ? ' checked' : '') + '><label class="form-check-label" for="MacroIsHidden">' + esc(l('Macros:Admin:IsHidden')) + '</label></div>' +

            '<div class="apya-macro-admin-actions">' +
            (m.isCustomized ? '<button type="button" class="btn btn-sm btn-outline-secondary" id="MacroReset">' + esc(l('Macros:Admin:Reset')) + '</button>' : '') +
            '<button type="submit" class="btn btn-sm btn-primary" id="MacroSave">' + esc(l('Macros:Admin:Save')) + '</button>' +
            '</div></form>');
    }

    function select(key) {
        var m = items.filter(function (x) { return x.key === key; })[0];
        if (!m) { return; }
        selectedKey = key;
        $md.addClass('has-selection');
        renderList();
        renderDetail(m);
    }

    function replace(updated) {
        items = items.map(function (x) { return x.key === updated.key ? updated : x; });
        renderList();
        renderDetail(updated);
    }

    function readForm() {
        var sort = $('#MacroSortOrder').val();
        return {
            displayName: ($('#MacroDisplayName').val() || '').trim() || null,
            icon: ($('#MacroIcon').val() || '').trim() || null,
            isHidden: $('#MacroIsHidden').is(':checked'),
            sortOrder: sort === '' ? null : Number(sort),
            defaultPinned: $('#MacroDefaultPinned').is(':checked'),
            packages: $('input[name="MacroPackages"]:checked').map(function () { return Number(this.value); }).get(),
            roles: ($('#MacroRoles').val() || '').split(',').map(function (r) { return r.trim(); }).filter(Boolean)
        };
    }

    $list.on('click', '.apya-md-item', function () { select(this.dataset.key); });

    $detail.on('click', '#MacroAdminBack', function () {
        selectedKey = null;
        $md.removeClass('has-selection');
        renderList();
    });

    $detail.on('submit', '#MacroAdminForm', function (e) {
        e.preventDefault();
        var $btn = $('#MacroSave').prop('disabled', true);
        service.update(selectedKey, readForm())
            .then(function (updated) { replace(updated); abp.notify.success(l('Macros:Admin:Saved')); })
            .always(function () { $btn.prop('disabled', false); });
    });

    $detail.on('click', '#MacroReset', function () {
        var key = selectedKey;
        abp.message.confirm(l('Macros:Admin:ResetConfirm')).then(function (confirmed) {
            if (!confirmed) { return; }
            service.reset(key).then(function (updated) { replace(updated); abp.notify.success(l('Macros:Admin:Saved')); });
        });
    });

    $('#MacroAdminFilter').on('input', renderList);
    $('[data-filter]').on('click', function () {
        filter = this.dataset.filter;
        $('[data-filter]').each(function () {
            var on = this.dataset.filter === filter;
            $(this).toggleClass('active', on).attr('aria-pressed', on ? 'true' : 'false');
        });
        renderList();
    });

    function load() {
        $list.html('<li>' + apya.loadState.loadingHtml(l('Macros:Loading')) + '</li>');
        Promise.resolve(service.getList({ abpHandleError: false })).then(function (list) {
            items = list || [];
            renderList();
        }, function (err) {
            $list.html('<li>' + apya.loadState.errorHtml(l('Macros:Admin:LoadFailed'), 'js-macro-admin-retry', err) + '</li>');
        });
    }

    $list.on('click', '.js-macro-admin-retry', load);
    load();
});
