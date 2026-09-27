// Çağrı (GrantCall) penceresi: Çağrılar (Index.js) ve Parametreler (Parameters.js) aynı pencereyi açar.
// Markup _CallModal.cshtml'de. Kayıttan sonra ne olacağına açan sayfa karar verir (onSaved).
(function () {
    var TASLAK = 3; // GrantCallStatus.Taslak
    var modal = null;
    var onSaved = null;

    function numOrNull(sel) {
        // Maskeli tutar alanında .val() "1.234,56" döndürür; parseFloat onu 1'e indirir.
        var el = $(sel)[0];
        if (el && el.__apyaMoney) { return apya.moneyInput.getValue(el); }
        var v = $(sel).val(); return v === '' || v == null ? null : parseFloat(v);
    }
    function setMoney(sel, v) { apya.moneyInput.setValue($(sel)[0], v); }

    function open(grantId, call, saved) {
        var l = abp.localization.getResource('Platform');
        onSaved = saved || null;
        $('#CallForm')[0].reset();
        $('#CallGrantId').val(grantId);
        if (call) {
            $('#CallId').val(call.id);
            $('#CallPeriod').val(call.period);
            $('#CallStatus').val(String(call.status));
            $('#CallOpenDate').val(call.openDate ? call.openDate.substring(0, 10) : '');
            $('#CallDeadline').val(call.deadline ? call.deadline.substring(0, 10) : '');
            setMoney('#CallBudget', call.budget);
            $('#CallReference').val(call.reference || '');
            $('#CallModalTitle').text(l('Grants:Calls:Modal:EditTitle'));
        } else {
            // Yeni çağrı taslak doğar: yayına alma Parametreler'deki yayın kapısından geçer.
            $('#CallId').val('');
            $('#CallStatus').val(String(TASLAK));
            $('#CallModalTitle').text(l('Grants:Calls:Modal:NewTitle'));
        }
        modal.show();
    }

    $(function () {
        var l = abp.localization.getResource('Platform');
        var callService = apya.platform.grants.grantCall;
        modal = new bootstrap.Modal(document.getElementById('CallModal'));

        $('#CallForm').on('submit', function (e) {
            e.preventDefault();
            var period = $('#CallPeriod').val().trim();
            if (!period) { abp.notify.warn(l('Grants:Calls:Modal:PeriodRequired')); return; }
            var dto = {
                grantId: $('#CallGrantId').val(),
                period: period,
                status: parseInt($('#CallStatus').val(), 10),
                openDate: $('#CallOpenDate').val() || null,
                deadline: $('#CallDeadline').val() || null,
                budget: numOrNull('#CallBudget'),
                reference: $('#CallReference').val().trim() || null
            };
            var id = $('#CallId').val();
            var op = id ? callService.update(id, dto) : callService.create(dto);
            op.then(function (saved) {
                modal.hide();
                abp.notify.success(l(id ? 'Grants:Calls:Modal:Updated' : 'Grants:Calls:Modal:Created'));
                // 18b · Bu kayıtta çağrı kapandıysa zincirin sonucu ayrıca duyurulur.
                if (saved && saved.closingSummary) {
                    var s = saved.closingSummary;
                    abp.message.info(l('Grants:CallClose:Summary')
                        .replace('{0}', s.missedInterestCount)
                        .replace('{1}', s.unfinishedApplicationCount)
                        .replace('{2}', s.notifiedFirmCount));
                }
                if (onSaved) { onSaved(saved); }
            });
        });
    });

    window.apyaGrantCallModal = { open: open };
})();
