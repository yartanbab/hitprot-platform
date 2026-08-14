$(function () {
    var svc = apya.platform.tenants.package;
    var $cards = $('#PackageCards');
    var modalEl = document.getElementById('PackageEditModal');
    var modal = new bootstrap.Modal(modalEl);
    var permModalEl = document.getElementById('PackagePermissionModal');
    var permModal = new bootstrap.Modal(permModalEl);
    var current = null;
    var currentPermCode = null;

    function esc(s) { return $('<div>').text(s == null ? '' : s).html(); }

    function featBadge(f) {
        if (f.isNumeric) {
            return '<span class="apya-chip apya-chip-neutral">' + esc(f.displayName) + ': '
                + '<span class="apya-numeric">' + esc(f.value) + '</span></span>';
        }
        var on = f.value === 'true';
        return '<span class="apya-chip ' + (on ? 'apya-chip-positive' : 'apya-chip-neutral') + '">'
            + '<i class="fa fa-' + (on ? 'check' : 'minus') + '"></i>' + esc(f.displayName) + '</span>';
    }

    function render(packages) {
        $cards.empty();
        packages.forEach(function (p) {
            var badges = (p.features || []).map(featBadge).join(' ');
            var col = $('<div class="col-12 col-lg-6"></div>');
            col.html(
                '<div class="border rounded p-3 h-100">'
                + '<div class="d-flex justify-content-between align-items-start mb-2">'
                + '<div><h5 class="mb-0">' + esc(p.name) + '</h5>'
                + '<small class="text-muted">' + esc(p.description) + '</small></div>'
                + '<div class="d-flex gap-1">'
                + '<button class="btn btn-sm btn-outline-primary js-edit-perms" data-code="' + p.code + '">'
                + '<i class="fa fa-key me-1"></i>İzinler</button>'
                + '<button class="btn btn-sm btn-outline-primary js-edit-pkg" data-code="' + p.code + '">'
                + '<i class="fa fa-pen me-1"></i>Limitler</button>'
                + '</div>'
                + '</div>'
                + '<div class="mb-2"><span class="apya-chip apya-chip-neutral">'
                + '<i class="fa fa-key"></i>İzin: <span class="apya-numeric">' + p.permissionCount + '</span>'
                + ' / ' + p.totalPermissionCount + '</span></div>'
                + '<div class="d-flex flex-wrap gap-1">' + badges + '</div>'
                + '</div>'
            );
            $cards.append(col);
        });
    }

    function load() { svc.getList().then(render); }

    // ─────────────────────────── Limitler (türetilmeyen feature'lar) ───────────────────────────

    $(document).on('click', '.js-edit-pkg', function () {
        var code = parseInt($(this).data('code'), 10);
        // GetList verisini yeniden çekip ilgili paketi al (taze değer için)
        svc.getList().then(function (packages) {
            var p = packages.filter(function (x) { return x.code === code; })[0];
            if (!p) { return; }
            current = p;
            $('#PkgEditTitle').text('Limitler — ' + p.name);

            var editable = (p.features || []).filter(function (f) { return !f.isDerived; });
            var derived = (p.features || []).filter(function (f) { return f.isDerived; });

            var rows = editable.map(function (f) {
                if (f.isNumeric) {
                    return '<div class="mb-3"><label class="form-label">' + esc(f.displayName) + '</label>'
                        + '<input type="number" min="0" class="form-control js-feat" data-name="' + esc(f.featureName)
                        + '" data-numeric="1" value="' + esc(f.value) + '"></div>';
                }
                var checked = f.value === 'true' ? 'checked' : '';
                return '<div class="form-check form-switch mb-2">'
                    + '<input class="form-check-input js-feat" type="checkbox" data-name="' + esc(f.featureName) + '" ' + checked + '>'
                    + '<label class="form-check-label">' + esc(f.displayName) + '</label></div>';
            }).join('');

            if (derived.length) {
                rows += '<hr><div class="small text-muted mb-2">'
                    + 'Aşağıdaki modül özellikleri <strong>izin listesinden türetilir</strong>, burada düzenlenmez:'
                    + '</div><div class="d-flex flex-wrap gap-1">'
                    + derived.map(featBadge).join(' ') + '</div>';
            }

            $('#PkgFeatureRows').html(rows);
            modal.show();
        });
    });

    $('#PkgSaveBtn').on('click', function () {
        if (!current) { return; }
        var feats = {};
        $('#PkgFeatureRows .js-feat').each(function () {
            var name = $(this).data('name');
            if ($(this).data('numeric')) { feats[name] = String($(this).val() || '0'); }
            else { feats[name] = $(this).is(':checked') ? 'true' : 'false'; }
        });
        var code = current.code;
        var $btn = $(this); $btn.prop('disabled', true); abp.ui.setBusy(modalEl);
        svc.updateFeatures({ code: code, features: feats }).then(function () {
            abp.notify.success('Paket güncellendi.');
            modal.hide();
            load();
            askReapply(code);
        }).always(function () { $btn.prop('disabled', false); abp.ui.clearBusy(modalEl); });
    });

    function askReapply(code) {
        abp.message.confirm('Bu paketteki mevcut tenant\'lara şimdi yeniden uygulansın mı?', 'Yeniden uygula', function (ok) {
            if (ok) {
                svc.reapplyToTenants(code).then(function (n) {
                    abp.notify.info(n + ' tenant güncellendi.');
                });
            }
        });
    }

    // ─────────────────────────── İzin tavanı ───────────────────────────

    function permRow(p) {
        // Girinti ağaç derinliğinden gelir; alt izin üst iznine bağlıdır.
        var indent = p.depth * 1.5;
        // Host yönetimi izinleri KİLİTLİ: tenant'ta hiç geçerli olmadıkları için pakete
        // eklenemezler. Gizlemek yerine sebebiyle gösteriliyor — büsbütün yok olunca
        // "eksik mi kaldı?" izlenimi veriyorlardı.
        var lockedNote = p.isHostOnly
            ? ' <span class="badge bg-light text-muted border fw-normal ms-1">host yönetimi — pakete eklenemez</span>'
            : '';

        return '<div class="form-check js-perm-row' + (p.isHostOnly ? ' text-muted' : '') + '"'
            + ' data-name="' + esc(p.name) + '"'
            + ' data-parent="' + esc(p.parentName || '') + '"'
            + ' data-text="' + esc((p.displayName + ' ' + p.name).toLowerCase()) + '"'
            + ' style="margin-left:' + indent + 'rem">'
            + '<input class="form-check-input js-perm" type="checkbox" id="perm_' + esc(p.name) + '"'
            + (p.isIncluded ? ' checked' : '') + (p.isHostOnly ? ' disabled' : '') + '>'
            + '<label class="form-check-label" for="perm_' + esc(p.name) + '">' + esc(p.displayName)
            + lockedNote + '</label></div>';
    }

    function renderPermissions(tree) {
        var html = (tree.groups || []).map(function (g) {
            return '<div class="mb-3 js-perm-group">'
                + '<div class="d-flex align-items-center justify-content-between border-bottom pb-1 mb-2">'
                + '<strong>' + esc(g.displayName) + '</strong>'
                + '<button type="button" class="btn btn-sm btn-link p-0 js-perm-group-toggle">tümünü değiştir</button>'
                + '</div>'
                + g.permissions.map(permRow).join('')
                + '</div>';
        }).join('');
        $('#PkgPermGroups').html(html);
        updateCount();
    }

    // Kilitli (host yönetimi) satırlar hiçbir toplu işleme, sayaca ve kayda girmez:
    // seçilebilir olanların tek kaynağı bu seçici.
    function selectable($scope) {
        return ($scope || $('#PkgPermGroups')).find('.js-perm:not(:disabled)');
    }

    function updateCount() {
        var total = selectable().length;
        var on = selectable().filter(':checked').length;
        $('#PkgPermCount').text(on + ' / ' + total + ' izin seçili');
    }

    function setChecked($row, checked) {
        $row.find('.js-perm:not(:disabled)').prop('checked', checked);
    }

    // Üst izin kapanınca altları da kapanır; alt izin açılınca üstleri açılır —
    // aksi halde tavanda üstü olmayan bir alt izin kalır ve hiçbir zaman kullanılamaz.
    function cascade($input) {
        var $row = $input.closest('.js-perm-row');
        var name = String($row.data('name'));
        var checked = $input.is(':checked');

        $('#PkgPermGroups .js-perm-row').each(function () {
            var $r = $(this);
            var rName = String($r.data('name'));
            if (rName !== name && rName.indexOf(name + '.') === 0) {
                setChecked($r, checked);
            }
        });

        if (checked) {
            var parent = String($row.data('parent') || '');
            while (parent) {
                var $p = $('#PkgPermGroups .js-perm-row').filter(function () {
                    return String($(this).data('name')) === parent;
                });
                if (!$p.length) { break; }
                setChecked($p, true);
                parent = String($p.data('parent') || '');
            }
        }
    }

    $(document).on('click', '.js-edit-perms', function () {
        var code = parseInt($(this).data('code'), 10);
        currentPermCode = code;
        abp.ui.setBusy();
        svc.getPermissions(code).then(function (tree) {
            $('#PkgPermTitle').text('Paket İzinleri — ' + tree.name);
            $('#PkgPermSearch').val('');
            renderPermissions(tree);
            permModal.show();
        }).always(function () { abp.ui.clearBusy(); });
    });

    $(document).on('change', '#PkgPermGroups .js-perm', function () {
        cascade($(this));
        updateCount();
    });

    $(document).on('click', '.js-perm-group-toggle', function () {
        var $group = $(this).closest('.js-perm-group');
        var $boxes = selectable($group);
        var allOn = $boxes.length === $boxes.filter(':checked').length;
        $boxes.prop('checked', !allOn);
        updateCount();
    });

    $('#PkgPermSelectAll').on('click', function () {
        selectable().prop('checked', true);
        updateCount();
    });

    $('#PkgPermClearAll').on('click', function () {
        selectable().prop('checked', false);
        updateCount();
    });

    $('#PkgPermSearch').on('input', function () {
        var q = String($(this).val() || '').toLowerCase().trim();
        $('#PkgPermGroups .js-perm-group').each(function () {
            var hits = 0;
            $(this).find('.js-perm-row').each(function () {
                var hit = !q || String($(this).data('text')).indexOf(q) >= 0;
                $(this).toggle(hit);
                if (hit) { hits++; }
            });
            // Grup görünürlüğü satır EŞLEŞMESİNDEN hesaplanır, ':visible'dan DEĞİL:
            // grup gizliyken içindeki satırlar da görünmez sayılır, o yüzden ':visible'
            // ile bakınca filtre temizlense bile grup bir daha açılmıyordu.
            $(this).toggle(hits > 0);
        });
    });

    $('#PkgPermSaveBtn').on('click', function () {
        if (currentPermCode === null) { return; }
        var names = selectable().filter(':checked').map(function () {
            return String($(this).closest('.js-perm-row').data('name'));
        }).get();

        var $btn = $(this); $btn.prop('disabled', true); abp.ui.setBusy(permModalEl);
        svc.updatePermissions({ code: currentPermCode, permissionNames: names }).then(function () {
            abp.notify.success('Paket izinleri güncellendi.');
            permModal.hide();
            load();
        }).always(function () { $btn.prop('disabled', false); abp.ui.clearBusy(permModalEl); });
    });

    load();
});
