/* 19a · Proje fikri formu (_IdeaQuestions) — çağrıya ilgi (Detail), havuza fikir (Idea) ve danışmanın
   firma adına girişi (Ideas) aynı alanları okur. Sayfaya özgü alanlar (çağrı, ortak, firma) sayfanın
   kendi betiğinde kalır. Sayfa başına tek form: alan kimlikleri sabit. */
(function () {
    window.apya = window.apya || {};
    var l = abp.localization.getResource('Platform');

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }

    // İsteğe bağlı soru: boş bırakıldıysa null gider, sunucu da null saklar.
    // 🔴 $.trim YOK: libs'teki jQuery 4.0.0 (install-libs) kaldırdı; String.prototype.trim kullanılır.
    function answer(id) { return ($('#' + id).val() || '').trim() || null; }

    // Hedeflenen başlangıç: içinde bulunulan çeyrekten itibaren sekiz çeyrek. Değer
    // çeyreğin ilk günü, "yyyy-MM-dd" olarak ELLE kurulur — toISOString() TZ+03'te
    // tarihi bir gün geriye kaydırır.
    function quarterOptions() {
        var now = new Date();
        var y = now.getFullYear();
        var q = Math.floor(now.getMonth() / 3) + 1;
        var html = '<option value="">' + esc(l('Grants:Interest:Form:TargetStart:Unknown')) + '</option>';
        for (var i = 0; i < 8; i++) {
            var month = (q - 1) * 3 + 1;
            html += '<option value="' + y + '-' + (month < 10 ? '0' : '') + month + '-01">' +
                esc(l('Grants:Interest:Form:Quarter', y, q)) + '</option>';
            q++;
            if (q > 4) { q = 1; y++; }
        }
        return html;
    }

    function budgetInput() { return document.getElementById('InterestBudget'); }

    $(document).on('input', '#InterestNote, #InterestProblem', function () { $(this).removeClass('is-invalid'); });

    apya.grantIdeaForm = {
        /// Formun kendisi (form.reset()) çağıranda sıfırlanır; burada yalnız formun kendi kurduğu parçalar.
        reset: function () {
            $('#InterestNote, #InterestProblem').removeClass('is-invalid');
            $('#InterestStart').html(quarterOptions());
            var budget = budgetInput();
            if (budget.__apyaMoney) { apya.moneyInput.setValue(budget, null); }
        },

        /// Yalnız ilk iki soru zorunlu. Geçersiz alan işaretlenir; odağı çağıran taşır (formun kalanı da denetlenebilsin).
        validate: function () {
            var valid = true;
            ['InterestNote', 'InterestProblem'].forEach(function (id) {
                var empty = !answer(id);
                $('#' + id).toggleClass('is-invalid', empty);
                if (empty) { valid = false; }
            });
            return valid;
        },

        /// GrantIdeaInput alanları.
        read: function () {
            var budget = budgetInput();
            return {
                note: answer('InterestNote'),
                problemStatement: answer('InterestProblem'),
                targetAudience: answer('InterestAudience'),
                plannedActivities: answer('InterestActivities'),
                durationAndPartners: answer('InterestDuration'),
                supportNeeds: answer('InterestSupport'),
                priorExperience: answer('InterestExperience'),
                teamStructure: answer('InterestTeam'),
                stakeholders: answer('InterestStakeholders'),
                estimatedBudget: budget.__apyaMoney
                    ? apya.moneyInput.getValue(budget)
                    : (budget.value === '' ? null : Number(budget.value)),
                targetStartDate: $('#InterestStart').val() || null
            };
        }
    };
})();
