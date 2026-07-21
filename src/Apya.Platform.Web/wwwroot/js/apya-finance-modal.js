/* =============================================================================
   APYA FINANCE MODAL — Gelir/Gider modalı ortak davranışları
   -----------------------------------------------------------------------------
   apya.financeModal.bindProjectDateRange(opts)
     • Proje seçiliyse tarih girişini projenin başlangıç–bitiş aralığına sınırlar
       (date input min/max) ve aralık dışındaki değerde Kaydet'i bloke eder.
     • Bloke mekanizması jQuery-validation kuralıdır: ABP ModalManager kaydetmeden
       önce $form.valid() çağırır → kural başarısızsa kayıt durur, mesaj görünür.

   opts = {
     formSelector:    '...'   // modal form (CSS seçici)
     projectSelector: '#Income_ProjectId'
     dateSelector:    '#Income_IncomeDate'
     projectDates:    { '<projectId>': { s:'yyyy-MM-dd'|null, e:'yyyy-MM-dd'|null }, ... }
   }
   Not: <input type="date"> .val() her zaman 'yyyy-MM-dd' (ISO) → string karşılaştırma
   leksikografik olarak doğru sıralanır; min/max da aynı formatı kullanır.
   ============================================================================= */
(function () {
    window.apya = window.apya || {};
    if (apya.financeModal) { return; }

    var methodRegistered = false;
    function ensureMethod() {
        if (methodRegistered || typeof $ === 'undefined' || !$.validator) { return; }
        methodRegistered = true;
        // Global, durumsuz: tarih input'unun kendi form'undan proje seçicisini ve
        // .data('apyaProjectDates') sözlüğünü okur (kapanış sızıntısı yok).
        $.validator.addMethod('apyaProjectDateRange', function (value, element) {
            var $d = $(element);
            var dates = $d.data('apyaProjectDates') || {};
            var pid = $d.closest('form').find('[data-apya-project-select]').val();
            var i = pid ? dates[pid] : null;
            if (!i || !value) { return true; }          // proje yok / tarih boş → kural uygulanmaz
            if (i.s && value < i.s) { return false; }
            if (i.e && value > i.e) { return false; }
            return true;
        });
    }

    function fmtTr(s) { return s ? s.split('-').reverse().join('.') : '—'; } // 2026-06-22 → 22.06.2026

    apya.financeModal = {
        bindProjectDateRange: function (opts) {
            var $form = $(opts.formSelector);
            if (!$form.length) { return; }
            var $proj = $form.find(opts.projectSelector);
            var $date = $form.find(opts.dateSelector);
            if (!$proj.length || !$date.length) { return; }
            var dates = opts.projectDates || {};

            $proj.attr('data-apya-project-select', '');
            $date.data('apyaProjectDates', dates);

            function applyBounds() {
                var pid = $proj.val();
                var i = pid ? dates[pid] : null;
                if (i && i.s) { $date.attr('min', i.s); } else { $date.removeAttr('min'); }
                if (i && i.e) { $date.attr('max', i.e); } else { $date.removeAttr('max'); }
            }
            $proj.on('change', applyBounds);
            applyBounds();

            ensureMethod();
            $form.validate();                 // validator yoksa başlatır, varsa mevcutu döndürür
            $date.rules('add', {
                apyaProjectDateRange: true,
                messages: {
                    apyaProjectDateRange: function () {
                        var pid = $proj.val();
                        var i = (pid && dates[pid]) || {};
                        return 'Seçilen tarih, projenin tarih aralığı dışında (' +
                            fmtTr(i.s) + ' – ' + fmtTr(i.e) + '). Lütfen aralık içinde bir tarih seçin.';
                    }
                }
            });
        }
    };
})();
