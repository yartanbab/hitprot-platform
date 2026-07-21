/* =============================================================================
   APYA TRANSFER — Ortak "Hızlı Transfer" widget'ı (tek kaynak JS)
   -----------------------------------------------------------------------------
   Finans Hub (/Finance) ve Kasa & Banka (/CashAccounts) bu modülü kullanır.
   Kendi kendine yeter: hesap listesini ve (farklı para birimlerinde) güncel
   kuru kendi çeker — host sayfa yalnızca bir mount noktası (<div id="...">)
   sağlar.

   Kullanım:
     apya.transfer.mount('ApyaTransferWidget', {
        onSuccess: fn   // transfer başarılı olunca (host sayfa verisini tazeler)
     });
   Backend: apya.platform.cashMovements.cashMovement.transfer(...)
   Tasarım: .apya-* token'ları + .apya-chip (apya-theme-bridge.css)
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (apya.transfer) { return; }

    function fmt(n) {
        return Number(n || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function accountLabel(a) {
        return a.name + ' · ' + a.currency + '  (' + fmt(a.balance) + ')';
    }

    function mount(containerId, opts) {
        opts = opts || {};
        var onSuccess = typeof opts.onSuccess === 'function' ? opts.onSuccess : function () { };

        var $root = $('#' + containerId);
        if (!$root.length) { return; }

        var cashAccountSvc = apya.platform.cashAccounts.cashAccount;
        var cashMovementSvc = apya.platform.cashMovements.cashMovement;
        var exchangeRateSvc = apya.platform.exchangeRates.exchangeRate;

        var accounts = [];
        var accountsById = {};
        var rateHintDebounce;

        function render() {
            $root.html(
                '<div class="mb-2">' +
                '  <label class="apya-overline d-block mb-1">Gönderen</label>' +
                '  <select class="form-select form-select-sm" id="' + containerId + '_From"></select>' +
                '</div>' +
                '<div class="text-center my-1">' +
                '  <button type="button" class="btn btn-sm btn-light rounded-circle" id="' + containerId + '_Swap" title="Yön değiştir" aria-label="Yön değiştir">' +
                '    <i class="fa fa-arrow-down-up-across-line" aria-hidden="true"></i>' +
                '  </button>' +
                '</div>' +
                '<div class="mb-2">' +
                '  <label class="apya-overline d-block mb-1">Alıcı</label>' +
                '  <select class="form-select form-select-sm" id="' + containerId + '_To"></select>' +
                '</div>' +
                '<div class="mb-1">' +
                '  <label class="apya-overline d-block mb-1">Tutar</label>' +
                '  <div class="input-group input-group-sm">' +
                '    <span class="input-group-text" id="' + containerId + '_CurLabel">TRY</span>' +
                '    <input type="number" min="0.01" step="0.01" class="form-control apya-numeric" id="' + containerId + '_Amount" placeholder="0,00" />' +
                '  </div>' +
                '</div>' +
                '<div class="small text-muted mb-3" id="' + containerId + '_RateHint" style="min-height:1.2em"></div>' +
                '<button type="button" class="btn btn-primary w-100" id="' + containerId + '_Submit">' +
                '  <i class="fa fa-paper-plane me-1" aria-hidden="true"></i>Transferi onayla' +
                '</button>'
            );

            fillSelect($('#' + containerId + '_From'));
            fillSelect($('#' + containerId + '_To'));
            if (accounts.length > 1) {
                $('#' + containerId + '_To').prop('selectedIndex', 1);
            }
            updateCurrencyLabel();
            updateRateHint();

            $('#' + containerId + '_Swap').on('click', function () {
                var $from = $('#' + containerId + '_From');
                var $to = $('#' + containerId + '_To');
                var tmp = $from.val();
                $from.val($to.val());
                $to.val(tmp);
                updateCurrencyLabel();
                updateRateHint();
            });

            $('#' + containerId + '_From, #' + containerId + '_To').on('change', function () {
                updateCurrencyLabel();
                updateRateHint();
            });

            $('#' + containerId + '_Amount').on('input', updateRateHint);

            $('#' + containerId + '_Submit').on('click', submit);
        }

        function fillSelect($select) {
            $select.empty();
            accounts.forEach(function (a) {
                $select.append($('<option></option>').val(a.id).text(accountLabel(a)));
            });
        }

        function updateCurrencyLabel() {
            var fromId = $('#' + containerId + '_From').val();
            var a = accountsById[fromId];
            $('#' + containerId + '_CurLabel').text(a ? a.currency : 'TRY');
        }

        function updateRateHint() {
            clearTimeout(rateHintDebounce);
            var $hint = $('#' + containerId + '_RateHint');
            var from = accountsById[$('#' + containerId + '_From').val()];
            var to = accountsById[$('#' + containerId + '_To').val()];

            if (!from || !to) { $hint.text(''); return; }
            if (from.currency === to.currency) { $hint.text(''); return; }

            rateHintDebounce = setTimeout(function () {
                exchangeRateSvc.getList({ fromCurrency: from.currency, maxResultCount: 50, sorting: 'RateDate desc' })
                    .then(function (result) {
                        var match = (result.items || []).filter(function (r) { return r.toCurrency === to.currency; });
                        if (!match.length) {
                            $hint.html('<i class="fa fa-triangle-exclamation text-warning me-1"></i>Güncel kur bulunamadı.');
                            return;
                        }
                        var rate = match[0].rate;
                        $hint.html('<i class="fa fa-circle-info me-1"></i>Çevrim kuru uygulanır · 1 ' + from.currency + ' ≈ ' + fmt(rate) + ' ' + to.currency);
                    })
                    .catch(function () { $hint.text(''); });
            }, 300);
        }

        function submit() {
            var fromId = $('#' + containerId + '_From').val();
            var toId = $('#' + containerId + '_To').val();
            var amount = parseFloat($('#' + containerId + '_Amount').val());

            if (!fromId || !toId || fromId === toId) {
                abp.notify.warn('Gönderen ve alıcı kasa farklı olmalıdır.');
                return;
            }
            if (!amount || amount <= 0) {
                abp.notify.warn('Geçerli bir tutar girin.');
                return;
            }

            var $btn = $('#' + containerId + '_Submit');
            $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin me-1"></i>Gönderiliyor...');

            cashMovementSvc.transfer({
                fromCashAccountId: fromId,
                toCashAccountId: toId,
                amount: amount
            }).then(function () {
                abp.notify.success('Transfer tamamlandı.');
                onSuccess();
            }).catch(function () {
                $btn.prop('disabled', false).html('<i class="fa fa-paper-plane me-1"></i>Transferi onayla');
            });
        }

        function load() {
            return cashAccountSvc.getList({ maxResultCount: 1000, isActive: true, sorting: 'name asc' })
                .then(function (result) {
                    accounts = (result.items || []).map(function (a) {
                        return { id: a.id, name: a.name, currency: a.currency, balance: 0 };
                    });
                    return Promise.all(accounts.map(function (a) {
                        return apya.platform.cashMovements.cashMovement.getBalance(a.id).then(function (b) {
                            a.balance = b.currentBalance;
                        });
                    }));
                })
                .then(function () {
                    accountsById = {};
                    accounts.forEach(function (a) { accountsById[a.id] = a; });
                    render();
                });
        }

        load();
    }

    apya.transfer = { mount: mount };
})();
