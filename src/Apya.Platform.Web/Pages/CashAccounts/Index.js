$(function () {

    var createAccountModal = new abp.ModalManager(abp.appPath + 'CashAccounts/CreateModal');
    var editAccountModal = new abp.ModalManager(abp.appPath + 'CashAccounts/EditModal');
    var createMovementModal = new abp.ModalManager(abp.appPath + 'CashMovements/CreateModal');
    var editMovementModal = new abp.ModalManager(abp.appPath + 'CashMovements/EditModal');
    var movementSvc = apya.platform.cashMovements.cashMovement;

    var selectedAccountId = null;
    var selectedAccountName = null;

    function fmt(n) {
        return Number(n || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 });
    }

    function directionBadge(d) {
        return d === 0
            ? '<span class="apya-chip apya-chip-positive">Giriş</span>'
            : '<span class="apya-chip apya-chip-negative">Çıkış</span>';
    }

    function renderMovements(items) {
        var $tbody = $('#CashMovementsTable tbody');
        $tbody.empty();
        if (!items.length) {
            $tbody.append('<tr><td colspan="5" class="text-center text-muted py-4">Bu hesapta henüz hareket yok.</td></tr>');
            return;
        }
        items.forEach(function (m) {
            var canEdit = abp.auth.isGranted('Platform.CashMovements.Edit') && m.source === 0;
            var canDelete = abp.auth.isGranted('Platform.CashMovements.Delete') && m.source === 0;
            var actions = '';
            if (canEdit) {
                actions += '<button type="button" class="btn btn-sm btn-link p-0 me-2 apya-row-actions" data-action="edit" data-id="' + m.id + '"><i class="fa fa-pencil"></i></button>';
            }
            if (canDelete) {
                actions += '<button type="button" class="btn btn-sm btn-link p-0 text-danger apya-row-actions" data-action="delete" data-id="' + m.id + '"><i class="fa fa-trash"></i></button>';
            }
            var $tr = $(
                '<tr>' +
                '<td class="text-nowrap">' + (m.movementDate ? new Date(m.movementDate).toLocaleDateString('tr-TR') : '-') + '</td>' +
                '<td>' + directionBadge(m.direction) + '</td>' +
                '<td>' + (m.description || (m.source === 3 ? 'Transfer' : '—')) + '</td>' +
                '<td class="text-end apya-numeric fw-semibold">' + fmt(m.amount) + '</td>' +
                '<td class="text-end">' + actions + '</td>' +
                '</tr>'
            );
            $tbody.append($tr);
        });

        $tbody.off('click', 'button[data-action]').on('click', 'button[data-action]', function () {
            var id = $(this).data('id');
            var action = $(this).data('action');
            if (action === 'edit') {
                editMovementModal.open({ id: id });
            } else if (action === 'delete') {
                abp.message.confirm('Hareket silinecek?').then(function (confirmed) {
                    if (!confirmed) return;
                    movementSvc.delete(id).then(function () {
                        abp.notify.success('Hareket silindi.');
                        loadMovements();
                    });
                });
            }
        });
    }

    function loadMovements() {
        if (!selectedAccountId) return;
        movementSvc.getList({ cashAccountId: selectedAccountId, maxResultCount: 200, sorting: 'movementDate desc' })
            .then(function (result) { renderMovements(result.items || []); });
    }

    function selectAccount($card) {
        $('#AccountCards .apya-account-card').removeClass('selected');
        $card.addClass('selected');
        selectedAccountId = $card.data('account-id');
        selectedAccountName = $card.data('account-name');

        $('#MovementsSubtitle').text(selectedAccountName);
        $('#MovementsEmpty').addClass('d-none');
        $('#MovementsTableWrap').removeClass('d-none');
        $('#NewCashMovementButton').prop('disabled', false);

        loadMovements();
    }

    $('#AccountCards').on('click', '.apya-account-card', function () {
        selectAccount($(this));
    });

    $('#NewCashAccountButton').click(function (e) {
        e.preventDefault();
        createAccountModal.open();
    });
    createAccountModal.onResult(function () { window.location.reload(); });
    editAccountModal.onResult(function () { window.location.reload(); });

    $('#NewCashMovementButton').click(function (e) {
        e.preventDefault();
        if (!selectedAccountId) return;
        createMovementModal.open({ cashAccountId: selectedAccountId });
    });
    createMovementModal.onResult(function () {
        abp.notify.success('Hareket kaydedildi.');
        window.location.reload();
    });
    editMovementModal.onResult(function () {
        abp.notify.success('Hareket güncellendi.');
        window.location.reload();
    });

    // Kart üstündeki Düzenle/Sil için basit sağ-tık yerine: kart uzun listede
    // değil, kasa düzenleme "Yeni Kasa Ekle" yanına eklenmedi — kart tıklaması
    // seçim yapar; kasa düzenleme/silme ihtiyacı nadir, mevcut EditModal
    // doğrudan hesap id'siyle açılabilir (ileride: kart üstü aksiyon menüsü).

    // ── Transfer ──
    var transferModalEl = document.getElementById('TransferModal');
    var transferModal = transferModalEl ? new bootstrap.Modal(transferModalEl) : null;

    apya.transfer.mount('ApyaTransferWidget', {
        onSuccess: function () {
            if (transferModal) { transferModal.hide(); }
            window.location.reload();
        }
    });

    $('#OpenTransferButton').click(function () {
        if (transferModal) { transferModal.show(); }
    });
});
