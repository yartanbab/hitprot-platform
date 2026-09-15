$(function () {
    var service = apya.platform.grants.grantIdeaPool;
    var l = abp.localization.getResource('Platform');
    var detailModal = new bootstrap.Modal(document.getElementById('IdeaModal'));
    var createModal = new bootstrap.Modal(document.getElementById('IdeaCreateModal'));

    // GrantInterestSource sırasıyla birebir.
    var sourceKeys = ['Tenant', 'Consultant'];
    var filters = { source: null, sort: 0 };
    var firmsFilled = false;

    // Dokuz sorunun etiketleri formdakiyle aynı; sıra da formun sırası.
    var questions = [
        ['idea', 'Grants:Interest:Form:Idea'],
        ['problemStatement', 'Grants:Interest:Form:Problem'],
        ['targetAudience', 'Grants:Interest:Form:Audience'],
        ['plannedActivities', 'Grants:Interest:Form:Activities'],
        ['durationAndPartners', 'Grants:Interest:Form:Duration'],
        ['supportNeeds', 'Grants:Interest:Form:Support'],
        ['priorExperience', 'Grants:Interest:Form:Experience'],
        ['teamStructure', 'Grants:Interest:Form:Team'],
        ['stakeholders', 'Grants:Interest:Form:Stakeholders']
    ];

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return v != null ? Math.round(v).toLocaleString('tr-TR') + ' ₺' : '—'; }
    function date(v) { return new Date(v).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }); }

    // Çeyreğin ilk günü saklanır ("2026-10-01") → "2026 · 4. çeyrek". Saat dilimi kaymasın diye elle ayrıştırılır.
    function quarter(v) {
        if (!v) { return l('Grants:Interest:Form:TargetStart:Unknown'); }
        var parts = String(v).slice(0, 10).split('-');
        return l('Grants:Interest:Form:Quarter', parts[0], Math.floor((Number(parts[1]) - 1) / 3) + 1);
    }

    function sourceLabel(s) { return l('Grants:Ideas:Source:' + sourceKeys[s]); }

    // "Selin Bakır" → avatar "SB", etiket "Selin B." (Talepler ile aynı); kaynağı altında (Firma / Danışman).
    function creator(r) {
        var name = (r.creatorName || '').trim();
        var parts = name ? name.split(/\s+/) : [];
        var initials = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] || '?').slice(0, 2);
        var short = parts.length > 1 ? parts[0] + ' ' + parts[parts.length - 1][0] + '.' : name;
        return '<span class="apya-idea-creator" data-label="' + esc(l('Grants:Ideas:Col:Creator')) + '"' + (name ? ' title="' + esc(name) + '"' : '') + '>' +
            '<span class="apya-avatar ' + (r.source === 1 ? 'apya-avatar-brand' : 'apya-avatar-neutral') + '" aria-hidden="true">' + esc(initials.toLocaleUpperCase('tr-TR')) + '</span>' +
            '<span class="apya-idea-creator-text">' +
            '<span class="apya-idea-creator-name">' + esc(short || '—') + '</span>' +
            '<span class="apya-idea-creator-source">' + esc(sourceLabel(r.source)) + '</span>' +
            '</span></span>';
    }

    function row(r) {
        return '<div class="apya-idea-row">' +
            '<div class="apya-idea-main">' +
            // Fikir tek satırda kesilir; tamamı üzerine gelince ve "İncele"de görünür.
            '<strong title="' + esc(r.idea) + '">' + esc(r.idea || '—') + '</strong>' +
            '<span>' + esc(r.firmName) + ' · ' + esc(date(r.creationTime)) + '</span></div>' +
            creator(r) +
            '<span class="apya-idea-budget apya-numeric" data-label="' + esc(l('Grants:Ideas:Col:Budget')) + '">' + esc(money(r.estimatedBudget)) + '</span>' +
            '<span class="apya-idea-start" data-label="' + esc(l('Grants:Ideas:Col:Start')) + '">' + esc(quarter(r.targetStartDate)) + '</span>' +
            '<button type="button" class="btn btn-sm btn-outline-secondary apya-idea-cta" data-idea="' + r.id + '">' + esc(l('Grants:Ideas:Open')) + '</button>' +
            '</div>';
    }

    function paint(dto) {
        if (!firmsFilled) {
            firmsFilled = true;
            (dto.firms || []).forEach(function (f) { $('#IdeaFirm').append($('<option>').val(f.id).text(f.name)); });
        }

        $('#IdeaCount').removeClass('apya-skel-num').text(l('Grants:Ideas:Count', dto.totalCount));

        var items = dto.items || [];
        $('#IdeaRows').removeClass('apya-skel-rows').html(items.map(row).join(''));
        $('#IdeaEmpty').toggleClass('d-none', items.length > 0)
            .text(l(dto.totalCount > 0 ? 'Grants:Ideas:EmptyFiltered' : 'Grants:Ideas:Empty'));
    }

    function load() { return service.getList(filters).then(paint); }

    $('#SourceFilter').on('change', function () { filters.source = $(this).val() === '' ? null : Number($(this).val()); load(); });
    $('#SortFilter').on('change', function () { filters.sort = Number($(this).val()); load(); });

    // ---------- İncele ----------
    $('#IdeaRows').on('click', '[data-idea]', function () {
        var $btn = $(this).prop('disabled', true);
        service.get($btn.data('idea')).then(function (d) {
            $('#IdeaModalTitle').text(d.firmName);
            $('#IdeaModalMeta').text([
                (d.creatorName ? d.creatorName + ' · ' : '') + sourceLabel(d.source),
                new Date(d.creationTime).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
                l('Grants:Ideas:Col:Budget') + ': ' + money(d.estimatedBudget),
                l('Grants:Ideas:Col:Start') + ': ' + quarter(d.targetStartDate)
            ].join(' · '));
            $('#IdeaAnswers').html(questions.map(function (q) {
                var value = d[q[0]];
                return '<div class="apya-idea-answer"><dt>' + esc(l(q[1])) + '</dt>' +
                    (value
                        ? '<dd>' + esc(value) + '</dd>'
                        : '<dd class="is-empty">' + esc(l('Grants:Ideas:Detail:Unanswered')) + '</dd>') + '</div>';
            }).join(''));
            detailModal.show();
        }).always(function () { $btn.prop('disabled', false); });
    });

    // ---------- Firma adına fikir ekle ----------
    $('#IdeaAddBtn').on('click', function () {
        document.getElementById('IdeaCreateForm').reset();
        $('#IdeaFirm').removeClass('is-invalid');
        apya.grantIdeaForm.reset();
        createModal.show();
    });

    $('#IdeaCreateModal').on('shown.bs.modal', function () { $('#IdeaFirm').trigger('focus'); });
    $('#IdeaFirm').on('change', function () { $(this).removeClass('is-invalid'); });

    $('#IdeaCreateForm').on('submit', function (e) {
        e.preventDefault();
        var tenantId = $('#IdeaFirm').val();
        $('#IdeaFirm').toggleClass('is-invalid', !tenantId);
        var valid = apya.grantIdeaForm.validate() && !!tenantId;
        if (!valid) {
            $('#IdeaCreateForm .is-invalid').first().trigger('focus');
            return;
        }

        var $submit = $(this).find('button[type=submit]').prop('disabled', true);
        service.create($.extend(apya.grantIdeaForm.read(), { tenantId: tenantId }))
            .then(function () {
                createModal.hide();
                abp.notify.success(l('Grants:Ideas:Created'));
                return load();
            })
            .always(function () { $submit.prop('disabled', false); });
    });

    load();
});
