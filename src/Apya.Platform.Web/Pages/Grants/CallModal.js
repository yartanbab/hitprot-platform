// Çağrı (GrantCall) penceresi: Çağrılar (Index.js) ve Parametreler (Parameters.js) aynı pencereyi açar.
// Markup _CallModal.cshtml'de. Kayıttan sonra ne olacağına açan sayfa karar verir (onSaved).
(function () {
    var TASLAK = 3; // GrantCallStatus.Taslak
    var KAPANDI = 2; // GrantCallStatus.Kapandi
    var modal = null;
    var onSaved = null;
    // Pencerede düzenlenmeyen görsel alanları: okunduğu gibi geri gönderilir, kayıt onları boşaltmasın.
    var IMAGE_FIELDS = ['announcementImageUrl', 'imageSourceUrl', 'imageLicense', 'imageStatus', 'imageLastCheckedAt'];
    var kept = {};

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
        kept = {};
        IMAGE_FIELDS.forEach(function (k) { if (call && call[k] != null) { kept[k] = call[k]; } });
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
            $('#CallSourceUrl').val(call.sourceUrl || '');
            $('#CallClosureReason').val(String(call.closureReason || 0));
            $('#CallLastVerifiedAt').val(call.lastVerifiedAt ? call.lastVerifiedAt.substring(0, 10) : '');
            $('#CallVerificationStatus').val(String(call.verificationStatus || 0));
            $('#CallModalTitle').text(l('Grants:Calls:Modal:EditTitle'));
        } else {
            // Yeni çağrı taslak doğar: yayına alma Parametreler'deki yayın kapısından geçer.
            $('#CallId').val('');
            $('#CallStatus').val(String(TASLAK));
            $('#CallModalTitle').text(l('Grants:Calls:Modal:NewTitle'));
        }
        paintClosureReason();
        modal.show();
    }

    // Kapanış nedeni yalnız kapalı çağrıda anlamlı; başka duruma geçince boşalır (domain kuralıyla aynı).
    function paintClosureReason() {
        var closed = parseInt($('#CallStatus').val(), 10) === KAPANDI;
        $('#CallClosureReasonRow').prop('hidden', !closed);
        if (!closed) { $('#CallClosureReason').val('0'); }
    }

    $(function () {
        var l = abp.localization.getResource('Platform');
        var callService = apya.platform.grants.grantCall;
        modal = new bootstrap.Modal(document.getElementById('CallModal'));
        $('#CallStatus').on('change', paintClosureReason);

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
                reference: $('#CallReference').val().trim() || null,
                // Bu alanlar her kayıtta gönderilir: DTO'dan düşerse güncelleme onları boşaltır.
                sourceUrl: $('#CallSourceUrl').val().trim() || null,
                closureReason: parseInt($('#CallClosureReason').val(), 10) || 0,
                lastVerifiedAt: $('#CallLastVerifiedAt').val() || null,
                verificationStatus: parseInt($('#CallVerificationStatus').val(), 10) || 0
            };
            $.extend(dto, kept);
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
