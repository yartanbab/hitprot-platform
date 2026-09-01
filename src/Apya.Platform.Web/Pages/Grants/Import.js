$(function () {
    var service = apya.platform.grants.grantDraft;
    var l = abp.localization.getResource('Platform');

    // GrantDraftFieldStatus enum sırasıyla birebir.
    var PENDING = 0, ACCEPTED = 1, REJECTED = 2;

    var fields = [];
    var totalCount = 0;
    var mode = 'text';

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }

    // ---------- Sekmeler ----------
    $('.apya-imp-tab:not(:disabled)').on('click', function () {
        mode = $(this).data('mode');
        $('.apya-imp-tab').removeClass('is-active');
        $(this).addClass('is-active');

        if (mode === 'blank') {
            // "Sıfırdan doldur": metin çıkarımı çalışmaz, boş alan listesi açılır.
            showTextarea();
            $('#ImportTextPane').addClass('d-none');
            loadBlankFields();
        } else {
            $('#ImportTextPane').removeClass('d-none');
        }
    });

    // ---------- Metin ----------
    $('#CallText').on('input', paintCharCount);

    function paintCharCount() {
        var n = ($('#CallText').val() || '').length;
        $('#CharCount').text(n ? l('Grants:Import:CharCount', n.toLocaleString('tr-TR')) : '');
    }

    function showTextarea() {
        $('#CallText').removeClass('d-none');
        $('#TextPreview').addClass('d-none');
        $('#EditTextBtn').addClass('d-none');
        $('#HighlightNote').addClass('d-none');
        $('#ExtractBtnText').text(l('Grants:Import:Extract'));
    }

    function showPreview() {
        $('#CallText').addClass('d-none');
        $('#TextPreview').removeClass('d-none');
        $('#EditTextBtn').removeClass('d-none');
        $('#HighlightNote').removeClass('d-none');
        $('#ExtractBtnText').text(l('Grants:Import:ReExtract'));
    }

    $('#EditTextBtn').on('click', showTextarea);

    /// Pasajları metin içinde işaretle. Kaçış ÖNCE yapılır; mark etiketleri
    /// kaçırılmış metnin üzerine konur, aksi halde kullanıcı metnindeki < > kırardı.
    function paintPreview(text) {
        var html = esc(text);
        var excerpts = fields
            .map(function (f) { return f.excerpt; })
            .filter(function (e) { return e && e.trim().length > 3; })
            // Uzun pasaj önce işaretlensin ki kısa olan onun içine girip bozmasın.
            .sort(function (a, b) { return b.length - a.length; });

        excerpts.forEach(function (e) {
            var needle = esc(e);
            var at = html.indexOf(needle);
            if (at >= 0 && html.indexOf('<mark>', Math.max(0, at - 6)) !== at - 6) {
                html = html.slice(0, at) + '<mark>' + needle + '</mark>' + html.slice(at + needle.length);
            }
        });

        $('#TextPreview').html(html);
    }

    // ---------- Alan satırları ----------
    function fieldRow(f, index) {
        var empty = !f.value;
        var cls = empty ? 'is-empty'
            : f.status === ACCEPTED ? 'is-accepted'
            : f.status === REJECTED ? 'is-rejected'
            : 'is-pending';

        var meta = empty
            ? '<span class="apya-imp-hint">' + esc(l('Grants:Import:EmptyFieldHint')) + '</span>'
            : f.confidence > 0
                ? '<span class="apya-chip ' + (f.confidence >= 80 ? 'apya-chip-positive' : 'apya-chip-warning') +
                  '">' + esc(l('Grants:Import:Confidence', f.confidence)) + '</span>'
                : '';

        return $(
            '<div class="apya-imp-field ' + cls + '" data-index="' + index + '">' +
            '  <span class="apya-imp-label">' + esc(l('Grants:Field:' + f.fieldKey)) + '</span>' +
            '  <span class="apya-imp-value">' +
            '    <input type="text" class="form-control form-control-sm apya-imp-input" maxlength="512" />' +
            '    ' + meta +
            '  </span>' +
            '  <span class="apya-imp-actions">' +
            '    <button type="button" class="apya-imp-act apya-imp-accept' +
                   (f.status === ACCEPTED ? ' is-on-accept' : '') + '" title="' +
                   esc(l('Grants:Import:Accept')) + '"><i class="fa fa-check"></i></button>' +
            '    <button type="button" class="apya-imp-act apya-imp-reject' +
                   (f.status === REJECTED ? ' is-on-reject' : '') + '" title="' +
                   esc(l('Grants:Import:Reject')) + '"><i class="fa fa-xmark"></i></button>' +
            '  </span>' +
            '</div>')
            .find('.apya-imp-input').val(f.value || '').end();
    }

    function paintFields() {
        var $list = $('#FieldList').empty();
        fields.forEach(function (f, i) { $list.append(fieldRow(f, i)); });

        var filled = fields.filter(function (f) { return !!f.value; }).length;
        var pending = fields.filter(function (f) { return f.value && f.status === PENDING; }).length;
        var empty = fields.length - filled;

        $('#SuggestionCount').toggleClass('d-none', pending === 0)
            .text(l('Grants:Import:Suggestions', pending));
        $('#EmptyCount').toggleClass('d-none', empty === 0)
            .text(l('Grants:Import:EmptyFields', empty));
        $('#FilledCount').text(fields.length ? l('Grants:Import:Filled', filled, totalCount) : '');
        $('#FieldListEmpty').toggleClass('d-none', fields.length > 0);

        // Ad ve kurum olmadan taslak kaydedilemez (ikisi de NOT NULL kolon).
        var hasIdentity = value('Name') && value('Issuer');
        $('#SaveDraftBtn').prop('disabled', !hasIdentity);
    }

    function value(key) {
        var f = fields.find(function (x) { return x.fieldKey === key; });
        return f && f.value ? f.value.trim() : '';
    }

    $('#FieldList').on('input', '.apya-imp-input', function () {
        var i = Number($(this).closest('.apya-imp-field').data('index'));
        fields[i].value = $(this).val();
        // Elle yazılan değer host'un kendi girdisidir: güven tam, durum kabul.
        fields[i].confidence = 100;
        fields[i].status = ACCEPTED;
        paintFields();
    });

    $('#FieldList').on('click', '.apya-imp-accept', function () {
        var i = Number($(this).closest('.apya-imp-field').data('index'));
        fields[i].status = fields[i].status === ACCEPTED ? PENDING : ACCEPTED;
        paintFields();
    });

    $('#FieldList').on('click', '.apya-imp-reject', function () {
        var i = Number($(this).closest('.apya-imp-field').data('index'));
        fields[i].status = fields[i].status === REJECTED ? PENDING : REJECTED;
        paintFields();
    });

    $('#AcceptAllBtn').on('click', function () {
        fields.forEach(function (f) { if (f.value) { f.status = ACCEPTED; } });
        paintFields();
    });

    // ---------- Çıkarım ----------
    $('#ExtractBtn').on('click', function () {
        var text = $('#CallText').val();
        if (!text || !text.trim()) {
            abp.message.warn(l('Grants:Import:PasteFirst'));
            return;
        }
        var $btn = $(this).prop('disabled', true);
        service.extract({ text: text })
            .then(function (r) {
                fields = r.fields || [];
                totalCount = r.totalCount;
                paintFields();
                paintPreview(text);
                showPreview();
            })
            .always(function () { $btn.prop('disabled', false); });
    });

    /// "Sıfırdan doldur": sunucudan boş metinle alan listesini alır — alan kümesi
    /// tek yerde (sunucuda) tanımlı kalsın diye istemcide tekrarlanmıyor.
    function loadBlankFields() {
        service.extract({ text: '-' }).then(function (r) {
            fields = (r.fields || []).map(function (f) {
                return { fieldKey: f.fieldKey, value: null, confidence: 0, excerpt: null, status: PENDING };
            });
            totalCount = r.totalCount;
            paintFields();
        });
    }

    // ---------- Kaydet ----------
    $('#SaveDraftBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        service.createDraft({
            // Reddedilen alan gönderilmez; "boş" alanlar bilgi olarak gider.
            fields: fields.filter(function (f) { return f.status !== REJECTED; }),
            sourceUrl: $('#TrackUrl').val() || null
        })
            .then(function (r) {
                abp.notify.success(l('Grants:Import:Saved'));
                window.location.href = '/Grants/Parameters?id=' + r.grantId;
            })
            .fail(function () { $btn.prop('disabled', false); });
    });

    paintCharCount();
    paintFields();
});
