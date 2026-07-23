$(function () {
    var grantService = apya.platform.grants.grant;
    var canEdit = abp.auth.isGranted('Platform.Grants.Edit');
    var canDelete = abp.auth.isGranted('Platform.Grants.Delete');

    var $grid = $('#GrantTileGrid');
    var $empty = $('#GrantTileGridEmpty');

    function esc(text) {
        return $('<div>').text(text == null ? '' : text).html();
    }

    function money(value) {
        return value != null ? Math.round(value).toLocaleString('tr-TR') + ' ₺' : '—';
    }

    function tileTemplate(g) {
        var scoreChip = g.minMatchScore > 0
            ? '<span class="apya-chip apya-chip-ai">%' + g.minMatchScore + ' uyum</span>'
            : '';
        var descMeta = g.description
            ? '<div class="apya-tile-meta"><span><i class="fa fa-align-left"></i>' + esc(g.description) + '</span></div>'
            : '';
        var actions =
            '<div class="apya-tile-actions">' +
            (canEdit ? '<button type="button" class="btn btn-sm btn-link text-muted apya-edit-btn" title="Düzenle"><i class="fa fa-pen"></i></button>' : '') +
            (canDelete ? '<button type="button" class="btn btn-sm btn-link text-danger apya-delete-btn" title="Sil"><i class="fa fa-trash"></i></button>' : '') +
            '</div>';

        var $tile = $(
            '<div class="apya-tile" data-id="' + g.id + '">' +
            '  <div class="apya-tile-head">' +
            '    <div class="d-flex align-items-start gap-2">' +
            '      <span class="apya-tile-icon-box"><i class="fa fa-award"></i></span>' +
            '      <div>' +
            '        <div class="apya-tile-title">' + esc(g.name) + '</div>' +
            '        <div class="apya-tile-sub">' + esc(g.issuer) + '</div>' +
            '      </div>' +
            '    </div>' +
            '    <div class="d-flex flex-column align-items-end gap-1">' + scoreChip + '</div>' +
            '  </div>' +
            descMeta +
            '  <div class="apya-tile-progress-label">' +
            '    <span>Maks. Tutar</span>' +
            '    <span class="apya-numeric fw-semibold">' + money(g.maxAmount) + '</span>' +
            '  </div>' +
            '  <div class="apya-tile-foot" style="justify-content:flex-end">' +
            actions +
            '  </div>' +
            '</div>'
        );
        $tile.data('grant', g);
        return $tile;
    }

    function renderKpis(items) {
        var total = items.length;
        var totalAmount = items.reduce(function (sum, g) { return sum + (g.maxAmount || 0); }, 0);
        var avgScore = total
            ? items.reduce(function (sum, g) { return sum + (g.minMatchScore || 0); }, 0) / total
            : 0;
        var top = items.reduce(function (best, g) {
            return (!best || (g.maxAmount || 0) > (best.maxAmount || 0)) ? g : best;
        }, null);

        $('#KpiTotalPrograms').text(total);
        $('#KpiTotalAmount').text(money(totalAmount));
        $('#KpiAvgScore').text(total ? ('%' + Math.round(avgScore)) : '—');
        $('#KpiTopProgram').text(top ? top.name : '—').attr('title', top ? top.name : '');
    }

    function loadList() {
        grantService.getList({ maxResultCount: 1000, sorting: 'name asc' }).then(function (result) {
            $grid.empty();
            renderKpis(result.items);

            if (!result.items.length) {
                $grid.addClass('d-none');
                $empty.removeClass('d-none');
                return;
            }

            $grid.removeClass('d-none');
            $empty.addClass('d-none');
            result.items.forEach(function (g) { $grid.append(tileTemplate(g)); });
        });
    }

    var createModal = new abp.ModalManager(abp.appPath + 'Grants/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'Grants/EditModal');

    $grid.on('click', '.apya-edit-btn', function () {
        var g = $(this).closest('.apya-tile').data('grant');
        editModal.open({ id: g.id });
    });

    $grid.on('click', '.apya-delete-btn', function () {
        var g = $(this).closest('.apya-tile').data('grant');

        Swal.fire({
            title: 'Hibe Programı Silinecek',
            text: '"' + g.name + '" hibe programını silmek istiyor musunuz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, Sil',
            cancelButtonText: 'İptal',
            confirmButtonColor: '#dc3545'
        }).then(function (result) {
            if (!result.isConfirmed) return;
            grantService.delete(g.id).then(function () {
                abp.notify.success('Hibe programı silindi.');
                loadList();
            });
        });
    });

    $('#NewGrantButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    createModal.onResult(function () {
        loadList();
        abp.notify.success('Hibe programı oluşturuldu.');
    });

    editModal.onResult(function () {
        loadList();
        abp.notify.success('Hibe programı güncellendi.');
    });

    loadList();
});
