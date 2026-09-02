(function () {
    var data = JSON.parse(document.getElementById('TestData').textContent);
    var callId = document.querySelector('.apya-pub-detail').dataset.callId;

    // Enum sırası sunucudakiyle birebir (GrantEligibilityRule).
    var FIELD = {
        0: { key: 'size', input: '#AnsSize' },
        1: { key: 'companyAgeYears', input: '#AnsAge' },
        2: { key: 'trl', input: '#AnsTrl' },
        3: { key: 'staffCount', input: '#AnsStaff' },
        4: { key: 'rdStaffCount', input: '#AnsRd' },
        5: { key: 'annualRevenue', input: '#AnsRevenue' },
        6: { key: 'hasConsortiumPartner', input: '#AnsConsortium' }
    };

    var answers = {};
    var index = 0;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return (v || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' ₺'; }
    function fmt(t, a, b) { return String(t).replace('{0}', a).replace('{1}', b); }

    function paintAnswered() {
        var html = '';
        for (var i = 0; i < index; i++) {
            var q = data.questions[i];
            html += '<div class="apya-pub-answered">' +
                '<i class="fa fa-circle-check"></i>' +
                '<span>' + esc(data.labels.rules[q.rule]) + '</span>' +
                '<span>' + esc(displayOf(q)) + '</span></div>';
        }
        $('#TestAnswered').html(html);
        $('#TestProgress').text(fmt(data.labels.progress, index, data.questions.length));
    }

    function displayOf(q) {
        var raw = answers[FIELD[q.rule].key];
        if (raw == null) { return ''; }
        if (q.options.length) {
            for (var i = 0; i < q.options.length; i++) {
                if (String(q.options[i].value) === String(raw)) { return q.options[i].label; }
            }
        }
        return raw;
    }

    function paintQuestion() {
        if (index >= data.questions.length) {
            $('#TestQuestion').empty();
            return;
        }

        var q = data.questions[index];
        var html = '<strong>' + esc(q.text) + '</strong>';

        if (q.options.length) {
            html += '<div class="apya-pub-options">';
            q.options.forEach(function (o) {
                html += '<button type="button" class="apya-pub-option" data-value="' +
                    esc(o.value) + '">' + esc(o.label) + '</button>';
            });
            html += '</div>';
        } else {
            // Sayısal soru: seçenek üretmek yerine doğrudan sayı istenir.
            html += '<input type="number" class="apya-pub-number-input" id="FreeAnswer" min="0" />' +
                '<button type="button" class="apya-pub-btn apya-pub-btn--ghost apya-pub-next" id="FreeNext">→</button>';
        }

        $('#TestQuestion').html(html);
    }

    function record(value) {
        var q = data.questions[index];
        var field = FIELD[q.rule];

        answers[field.key] = value;
        $(field.input).val(value);

        index++;
        paintAnswered();
        paintQuestion();
        evaluate();
    }

    function evaluate() {
        if (index === 0) { return; }

        var payload = $.extend({ callId: callId }, answers);

        $.ajax({
            url: window.location.pathname + '?handler=Evaluate',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            headers: { RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val() }
        }).done(paintResult);
    }

    function paintResult(r) {
        $('#TestResult').prop('hidden', false).removeClass('d-none');

        // 🔴 Enum sırasını BURADA yeniden türetme: GrantRuleOutcome.Failed = 1,
        // Unknown = 2. Önce 2 sayılmıştı; karşılanmayan şart "uygun" gösteriliyordu.
        // Sunucu engelleyen şartı zaten hesaplıyor — tek kaynak o.
        var title = r.blockingRule != null ? data.labels.notEligible
            : (index < data.questions.length ? data.labels.partial : data.labels.eligible);

        $('#ResultTitle').text(title);
        $('#ResultScore').text(fmt(data.labels.score, r.passedRuleCount, r.totalRuleCount));
        $('#ResultSupport').text(r.estimatedSupport ? money(r.estimatedSupport) : '—');
        $('#ResultDifficulty').text(data.labels.difficulty[r.difficulty] || '—');

        if (r.blockingRule != null) {
            $('#ResultBlocking').prop('hidden', false)
                .text(fmt(data.labels.blocking, data.labels.rules[r.blockingRule]));
        } else {
            $('#ResultBlocking').prop('hidden', true);
        }

        // 🔴 Dürüst değerlendirme: kolay çağrıda danışmanlık ÖNERİLMEZ ve CTA da
        // gösterilmez. Herkesi randevuya çağırmak lead kutusunu niteliksiz doldurur.
        $('#ResultHonest').prop('hidden', false)
            .text(r.recommendConsulting ? data.labels.honestNeed : data.labels.honestNoNeed);
        $('#LeadCta').prop('hidden', !r.recommendConsulting);
    }

    $('#TestQuestion').on('click', '.apya-pub-option', function () {
        record($(this).data('value'));
    });

    $('#TestQuestion').on('click', '#FreeNext', function () {
        var v = $('#FreeAnswer').val();
        if (v === '') { return; }
        record(v);
    });

    // Ölçülebilir şartı olmayan çağrıda test hiç başlamaz; boş durum Razor'da.
    if (data.questions.length) {
        paintAnswered();
        paintQuestion();
    }
})();
