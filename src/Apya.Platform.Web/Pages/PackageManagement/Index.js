$(function () {
    var svc = apya.platform.tenants.package;
    var $cards = $('#PackageCards');
    var modalEl = document.getElementById('PackageEditModal');
    var modal = new bootstrap.Modal(modalEl);
    var current = null;

    function esc(s) { return $('<div>').text(s == null ? '' : s).html(); }

    function featBadge(f) {
        if (f.isNumeric) {
            return '<span class="badge bg-light text-dark border">' + esc(f.displayName) + ': ' + esc(f.value) + '</span>';
        }
        var on = f.value === 'true';
        return '<span class="badge ' + (on ? 'bg-success' : 'bg-light text-muted border') + '">'
            + '<i class="fa fa-' + (on ? 'check' : 'minus') + ' me-1"></i>' + esc(f.displayName) + '</span>';
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
                + '<button class="btn btn-sm btn-outline-primary js-edit-pkg" data-code="' + p.code + '">'
                + '<i class="fa fa-pen me-1"></i>Düzenle</button>'
                + '</div>'
                + '<div class="d-flex flex-wrap gap-1">' + badges + '</div>'
                + '</div>'
            );
            $cards.append(col);
        });
    }

    function load() { svc.getList().then(render); }

    $(document).on('click', '.js-edit-pkg', function () {
        var code = parseInt($(this).data('code'), 10);
        // GetList verisini yeniden çekip ilgili paketi al (taze değer için)
        svc.getList().then(function (packages) {
            var p = packages.filter(function (x) { return x.code === code; })[0];
            if (!p) { return; }
            current = p;
            $('#PkgEditTitle').text('Paketi Düzenle — ' + p.name);
            var rows = (p.features || []).map(function (f) {
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
            abp.message.confirm('Bu paketteki mevcut tenant\'lara şimdi yeniden uygulansın mı?', 'Yeniden uygula', function (ok) {
                if (ok) {
                    svc.reapplyToTenants(code).then(function (n) {
                        abp.notify.info(n + ' tenant güncellendi.');
                    });
                }
            });
        }).always(function () { $btn.prop('disabled', false); abp.ui.clearBusy(modalEl); });
    });

    load();
});
