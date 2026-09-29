$(function () {

    var createAccountModal = new abp.ModalManager(abp.appPath + 'CashAccounts/CreateModal');
    var editAccountModal = new abp.ModalManager(abp.appPath + 'CashAccounts/EditModal');
    var createMovementModal = new abp.ModalManager(abp.appPath + 'CashMovements/CreateModal');
    var editMovementModal = new abp.ModalManager(abp.appPath + 'CashMovements/EditModal');
    var movementSvc = apya.platform.cashMovements.cashMovement;

    var selectedAccountId = null;
    var selectedAccountName = null;

    // Geç dönen eski yanıt (önceki kartın hareketleri, önceki özet) yenisini ezmesin.
    var nextMovements = apya.latest();
    var nextSummary = apya.latest();
    // Hareket yazıldıysa transfer penceresindeki bakiyeler bayat: açılışta yeniden bağlanır.
    var transferDirty = false;

    var SKELETON_ROWS = new Array(5).join('<tr aria-hidden="true"><td colspan="5"><span class="apya-skeleton d-block" style="height:10px"></span></td></tr>');

    // Kimlik adresten (?account=) gelebilir: seçiciye birleştirilmez, karşılaştırılır.
    function cardById(id) {
        return $('#AccountSummary .apya-account-card').filter(function () {
            return String($(this).data('account-id')) === String(id);
        });
    }

    // Kullanıcı metni HTML'e metin olarak girer. Gider başlığı kasa hareketi açıklamasına
    // yazıldığı için ("Gider: " + başlık) gider girme yetkisi olan herkes kasayı açan
    // finans yöneticisinin oturumunda betik çalıştırabiliyordu.
    function esc(s) {
        return $('<div>').text(s == null ? '' : String(s)).html();
    }

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
                actions += '<button type="button" class="btn btn-sm btn-link p-0 me-2 apya-row-actions" data-action="edit" data-id="' + m.id + '" title="Düzenle" aria-label="Hareketi düzenle"><i class="fa fa-pencil"></i></button>';
            }
            if (canDelete) {
                actions += '<button type="button" class="btn btn-sm btn-link p-0 text-danger apya-row-actions" data-action="delete" data-id="' + m.id + '" title="Sil" aria-label="Hareketi sil"><i class="fa fa-trash"></i></button>';
            }
            var $tr = $(
                '<tr>' +
                '<td class="text-nowrap">' + (m.movementDate ? new Date(m.movementDate).toLocaleDateString('tr-TR') : '-') + '</td>' +
                '<td>' + directionBadge(m.direction) + '</td>' +
                '<td>' + esc(m.description || (m.source === 3 ? 'Transfer' : '—')) + '</td>' +
                '<td class="text-end apya-numeric fw-semibold">' + fmt(m.amount) + '</td>' +
                '<td class="text-end">' + actions + '</td>' +
                '</tr>'
            );
            $tbody.append($tr);
        });
    }

    // withSkeleton: yalnız hesap değişince ve "Tekrar dene"de. Yazmadan sonraki tazelemede
    // mevcut satırlar yanıt gelene kadar kalır — tablo çökmez, kaydırma konumu korunur.
    function loadMovements(withSkeleton) {
        if (!selectedAccountId) return;
        var isLatest = nextMovements();
        var $table = $('#CashMovementsTable').attr('aria-busy', 'true');
        if (withSkeleton) {
            $table.find('tbody').html(SKELETON_ROWS);
        }
        Promise.resolve(movementSvc.getList({ cashAccountId: selectedAccountId, maxResultCount: 200, sorting: 'movementDate desc' }))
            .then(function (result) {
                if (!isLatest()) return;
                $table.removeAttr('aria-busy');
                renderMovements(result.items || []);
            }, function () {
                if (!isLatest()) return;
                $table.removeAttr('aria-busy');
                $table.find('tbody').html(
                    '<tr><td colspan="5" class="text-center py-4">' +
                    '<span class="text-danger" role="alert">Hareketler yüklenemedi.</span> ' +
                    '<button type="button" class="btn btn-sm btn-link p-0 ms-1 align-baseline" data-action="retry">Tekrar dene</button>' +
                    '</td></tr>');
            });
    }

    // Konsolide toplam + tüm kartlar sunucudaki parçadan (tek doğruluk kaynağı). $.get ABP'nin
    // hata kutusunu açmaz: kayıt başarılıyken yalnız tazeleme düşerse kullanıcı kaydın
    // başarısız olduğunu sanmasın.
    function refreshSummary() {
        var isLatest = nextSummary();
        Promise.resolve($.get(abp.appPath + 'CashAccounts?handler=AccountSummary'))
            .then(function (html) {
                if (!isLatest()) return;
                $('#AccountSummary').html(html);
                if (selectedAccountId) {
                    cardById(selectedAccountId).addClass('selected');
                }
            }, function () {
                if (!isLatest()) return;
                abp.notify.warn('Bakiyeler güncellenemedi. Güncel değerler için sayfayı yenileyin.');
            });
    }

    // Hareket ekleme/düzenleme/silme ve transfer sonrası: sayfa yenilenmez, seçim ve bildirim kalır.
    function afterWrite(message) {
        if (message) {
            abp.notify.success(message);
        }
        loadMovements();
        refreshSummary();
        transferDirty = true;
    }

    $('#CashMovementsTable').on('click', 'button[data-action]', function () {
        var id = $(this).data('id');
        var action = $(this).data('action');
        if (action === 'retry') {
            loadMovements(true);
        } else if (action === 'edit') {
            editMovementModal.open({ id: id });
        } else if (action === 'delete') {
            abp.message.confirm('Hareket silinecek?').then(function (confirmed) {
                if (!confirmed) return;
                movementSvc.delete(id).then(function () {
                    afterWrite('Hareket silindi.');
                });
            });
        }
    });

    function selectAccount($card) {
        $('#AccountCards .apya-account-card').removeClass('selected');
        $card.addClass('selected');
        selectedAccountId = $card.data('account-id');
        selectedAccountName = $card.data('account-name');

        $('#MovementsSubtitle').text(selectedAccountName);
        $('#MovementsEmpty').addClass('d-none');
        $('#MovementsTableWrap').removeClass('d-none');
        $('#NewCashMovementButton').prop('disabled', false);

        // Seçim adreste kalır: hesap modallarındaki yenileme ve F5 seçimi düşürmez.
        var url = new URL(window.location.href);
        url.searchParams.set('account', selectedAccountId);
        history.replaceState(history.state, '', url);

        loadMovements(true);
    }

    // Kartlar parçayla yeniden basıldığı için tıklama parçanın DIŞINDAKİ sarmalayıcıya bağlı.
    $('#AccountSummary').on('click', '.apya-account-card', function () {
        selectAccount($(this));
    });

    $('#NewCashAccountButton').click(function (e) {
        e.preventDefault();
        createAccountModal.open();
    });
    // Boş durumdaki "Yeni Kasa Ekle": parça yeniden basıldığı için kart tıklaması gibi sarmalayıcıya delege.
    $('#AccountSummary').on('click', '[data-cash-account-new]', function (e) {
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
        afterWrite('Hareket kaydedildi.');
    });
    editMovementModal.onResult(function () {
        afterWrite('Hareket güncellendi.');
    });

    // Kart üstündeki Düzenle/Sil için basit sağ-tık yerine: kart uzun listede
    // değil, kasa düzenleme "Yeni Kasa Ekle" yanına eklenmedi — kart tıklaması
    // seçim yapar; kasa düzenleme/silme ihtiyacı nadir, mevcut EditModal
    // doğrudan hesap id'siyle açılabilir (ileride: kart üstü aksiyon menüsü).

    // ── Transfer ──
    var transferModalEl = document.getElementById('TransferModal');
    var transferModal = transferModalEl ? new bootstrap.Modal(transferModalEl) : null;

    var transferPlaceholder = $('#ApyaTransferWidget').html();

    function mountTransfer() {
        transferDirty = false;
        $('#ApyaTransferWidget').html(transferPlaceholder);
        apya.transfer.mount('ApyaTransferWidget', {
            onSuccess: function () {
                if (transferModal) { transferModal.hide(); }
                afterWrite(); // "Transfer tamamlandı." bildirimini widget kendisi basıyor
            }
        });
    }

    mountTransfer();

    $('#OpenTransferButton').click(function () {
        if (transferDirty) { mountTransfer(); }
        if (transferModal) { transferModal.show(); }
    });

    var initialId = new URLSearchParams(window.location.search).get('account');
    if (initialId) {
        var $initial = cardById(initialId);
        if ($initial.length) { selectAccount($initial); }
    }
});
