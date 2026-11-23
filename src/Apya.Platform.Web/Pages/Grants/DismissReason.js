/* Hibe "İlgilenmiyorum" gerekçe penceresi — Bugün kartı, çağrı ayrıntısı ve akış kartları ortak.
   apya.grantDismiss.ask() → Promise<{ reason, note } | null>   ASLA reddetmez; vazgeçince null.
   Gerekçe tek seçim ZORUNLU (sunucu da ister), not isteğe bağlı. Değerler GrantDismissReason ile aynı. */
(function () {
    window.apya = window.apya || {};
    if (window.apya.grantDismiss) { return; }

    var REASONS = [1, 2, 3, 4, 5, 6];

    function esc(value) {
        return abp.utils.htmlEscape(value == null ? '' : String(value));
    }

    function ask() {
        if (!window.Swal || !Swal.fire) { return Promise.resolve(null); }
        if (apya.session && apya.session.isDialogOpen && apya.session.isDialogOpen()) { return Promise.resolve(null); }

        var l = abp.localization.getResource('Platform');
        var config = (abp.libs && abp.libs.sweetAlert && abp.libs.sweetAlert.config) || {};
        var swal = Object.assign({}, config['default'], config.confirm);
        delete swal.title;
        swal.titleText = l('Grants:Dismiss:Title');
        swal.confirmButtonText = l('Grants:Dismiss:Submit');
        swal.focusConfirm = false;
        swal.html =
            '<p class="text-muted small mb-3">' + esc(l('Grants:Today:Opportunity:Dismiss:Confirm')) + '</p>' +
            '<fieldset class="text-start"><legend class="form-label small fw-semibold">' + esc(l('Grants:Dismiss:ReasonLabel')) + '</legend>' +
            REASONS.map(function (r) {
                var id = 'apyaDismissReason' + r;
                return '<div class="form-check">' +
                    '<input class="form-check-input" type="radio" name="apyaDismissReason" id="' + id + '" value="' + r + '">' +
                    '<label class="form-check-label" for="' + id + '">' + esc(l('Grants:Dismiss:Reason:' + r)) + '</label></div>';
            }).join('') +
            '</fieldset>' +
            '<div class="text-start mt-3"><label for="apyaDismissNote" class="form-label small">' + esc(l('Grants:Dismiss:NoteLabel')) + '</label>' +
            '<textarea id="apyaDismissNote" class="form-control" rows="2" maxlength="256"></textarea></div>';
        swal.preConfirm = function () {
            var popup = Swal.getPopup();
            var checked = popup.querySelector('input[name="apyaDismissReason"]:checked');
            if (!checked) {
                Swal.showValidationMessage(esc(l('Grants:Dismiss:ReasonRequired')));
                return false;
            }
            var note = popup.querySelector('#apyaDismissNote').value.trim();
            return { reason: Number(checked.value), note: note || null };
        };

        return Promise.resolve(Swal.fire(swal)).then(
            function (result) { return result && result.isConfirmed ? result.value : null; },
            function () { return null; });
    }

    window.apya.grantDismiss = { ask: ask };
})();
