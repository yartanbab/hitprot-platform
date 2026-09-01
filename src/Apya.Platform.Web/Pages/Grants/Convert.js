$(function () {
    var service = apya.platform.grants.grantApplicationConversion;
    var l = abp.localization.getResource('Platform');
    var appId = $('.apya-page').data('application-id');

    // Enum sıraları sunucudakiyle birebir.
    var costKeys = ['Personel', 'MakineTechizat', 'Danismanlik', 'YazilimLisans', 'Seyahat', 'SarfMalzeme'];
    var categoryKeys = ['Other', 'Office', 'Travel', 'Personnel', 'Material', 'Service', 'Tax'];

    var model = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return (v || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 }); }
    function date(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }
    // 🔴 toISOString() UTC'ye çevirir ve TZ+03'te tarihi bir gün GERİYE kaydırır
    // (01.09 → 31.08). date girdisi yerel tarihi beklediği için elle kuruyoruz.
    function isoDate(v) {
        if (!v) { return ''; }
        var d = new Date(v);
        return d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
    }

    // ---------- Bütçe eşleme ----------
    function budgetRow(m) {
        var options = categoryKeys.map(function (k, i) {
            return '<option value="' + i + '"' + (m.suggestedCategory === i ? ' selected' : '') + '>' +
                esc(l('Expense:Category:' + k)) + '</option>';
        }).join('');

        return '<div class="apya-cv-row' + (m.isEligible ? '' : ' is-outside') + '" data-kind="' + m.kind + '">' +
            '<span class="apya-cv-item-name">' + esc(l('Grants:CostItem:' + costKeys[m.kind])) +
            (m.isEligible ? '' : ' <span class="apya-chip apya-chip-neutral">' +
                esc(l('Grants:Conversion:OutsideScope')) + '</span>') + '</span>' +
            '<span class="apya-numeric">' + money(m.amount) + '</span>' +
            '<span class="apya-cv-arrow"><i class="fa fa-arrow-right"></i></span>' +
            '<span><input type="text" class="form-control form-control-sm apya-cv-name" maxlength="128" ' +
            'value="' + esc(m.suggestedName) + '" /></span>' +
            '<span><select class="form-select form-select-sm apya-cv-category">' +
            (m.suggestedCategory == null
                ? '<option value="" selected>' + esc(l('Grants:Conversion:PickCategory')) + '</option>'
                : '') + options + '</select></span>' +
            '</div>';
    }

    function paintBudget() {
        var rows = model.budgetMappings || [];
        $('#BudgetRows').html(rows.map(budgetRow).join(''));
        $('#BudgetEmpty').toggleClass('d-none', rows.length > 0);
        $('#AutoMatchChip').text(l('Grants:Conversion:AutoMatched',
            rows.filter(function (m) { return m.suggestedCategory != null; }).length, rows.length));
    }

    // Kategori seçimi değişince "eşlenmedi" uyarısı canlı güncellenir.
    $('#BudgetRows').on('change', '.apya-cv-category', paintWarning);

    function unmappedCount() {
        return $('#BudgetRows .apya-cv-category').filter(function () { return !$(this).val(); }).length;
    }

    function paintWarning() {
        var missing = unmappedCount();
        $('#UnmappedNote').toggleClass('d-none', missing === 0);
        $('#UnmappedText').text(l('Grants:Conversion:Unmapped', missing));
    }

    // ---------- Plan ----------
    function paintPlan() {
        var tasks = model.tasks || [];
        var tranches = model.tranches || [];

        $('#TaskCountLabel').text(l('Grants:Conversion:TasksFromMilestones', tasks.length));
        $('#TaskList').html(tasks.length
            ? tasks.map(function (t) {
                return '<div class="apya-cv-line"><span>' + esc(t.title) + '</span>' +
                    '<span class="apya-cv-line-date">' + esc(date(t.dueDate)) + '</span></div>';
            }).join('')
            : '<div class="apya-cv-hint">' + esc(l('Grants:Conversion:NoMilestone')) + '</div>');

        $('#TrancheCountLabel').text(l('Grants:Conversion:TranchesToIncome', tranches.length));
        $('#TrancheList').html(tranches.length
            ? tranches.map(function (t) {
                return '<div class="apya-cv-line"><span class="apya-numeric">#' + t.sequenceNo + ' · ' +
                    money(t.amount) + ' ₺</span>' +
                    '<span class="apya-cv-line-date">%' + t.sharePercent + ' · ' + esc(date(t.dueDate)) +
                    '</span></div>';
            }).join('')
            : '<div class="apya-cv-hint">' + esc(l('Grants:Conversion:NoTranche')) + '</div>');

        $('#CreateTasks').prop('disabled', tasks.length === 0);
        $('#CreateTranches').prop('disabled', tranches.length === 0);
    }

    // ---------- Sağ panel ----------
    function paintSide() {
        $('#OutcomeName').text($('#ProjectName').val() || model.suggestedProjectName);
        $('#OutcomeCode').text(model.suggestedProjectCode);
        $('#OutcomeDuration').text(model.startDate && model.endDate
            ? date(model.startDate) + ' — ' + date(model.endDate) : '—');
        $('#OutcomeBudget').text(money(model.totalBudget) + ' ₺');
        $('#OutcomeIncome').text(model.approvedAmount != null ? money(model.approvedAmount) + ' ₺' : '—');
        $('#OutcomeTasks').text((model.tasks || []).length);

        $('#MemberList').html((model.members || []).length
            ? model.members.map(function (m) {
                return '<div class="form-check mb-0"><input class="form-check-input apya-cv-member" ' +
                    'type="checkbox" value="' + m.userId + '" id="mem-' + m.userId + '" />' +
                    '<label class="form-check-label" for="mem-' + m.userId + '">' + esc(m.name) + '</label></div>';
            }).join('')
            : '<div class="apya-cv-hint">' + esc(l('Grants:Conversion:NoMember')) + '</div>');

        $('#CarriedList').html(
            '<div class="apya-cv-line"><span>' + esc(l('Grants:Conversion:Carried:Documents', model.documentCount)) +
            '</span></div>' +
            '<div class="apya-cv-line"><span>' + esc(l('Grants:Conversion:Carried:Messages', model.messageCount)) +
            '</span></div>' +
            '<div class="apya-cv-line"><span>' +
            esc(l('Grants:Conversion:Carried:Hours', model.consultingHours.toLocaleString('tr-TR'))) +
            '</span></div>');
    }

    $('#ProjectName').on('input', function () { $('#OutcomeName').text($(this).val()); });

    // ---------- Dönüştür ----------
    $('#ConvertBtn').on('click', function () {
        var lines = [];
        $('#BudgetRows .apya-cv-row').each(function () {
            var $row = $(this);
            var category = $row.find('.apya-cv-category').val();
            var kind = Number($row.data('kind'));
            var mapping = (model.budgetMappings || []).filter(function (m) { return m.kind === kind; })[0];
            lines.push({
                kind: kind,
                name: $row.find('.apya-cv-name').val(),
                amount: mapping ? mapping.amount : 0,
                category: category === '' ? null : Number(category)
            });
        });

        var $btn = $(this).prop('disabled', true);
        service.convert({
            applicationId: appId,
            projectName: $('#ProjectName').val(),
            startDate: $('#StartDate').val() || null,
            endDate: $('#EndDate').val() || null,
            memberUserIds: $('.apya-cv-member:checked').map(function () { return this.value; }).get(),
            budgetLines: lines,
            createTasks: $('#CreateTasks').is(':checked'),
            createTranches: $('#CreateTranches').is(':checked')
        }).then(function (r) {
            abp.notify.success(l('Grants:Conversion:Created', r.projectCode));
            load();
        }).always(function () { $btn.prop('disabled', false); });
    });

    // ---------- Çizim ----------
    function paint() {
        $('#HeaderTitle').text(model.firmName + ' · ' + model.grantName);
        $('#HeaderMeta').text([model.period,
            model.approvedAmount != null
                ? l('Grants:Conversion:Approved', money(model.approvedAmount))
                : null].filter(Boolean).join(' · '));

        $('#ReadyChip').toggleClass('d-none', !model.canConvert);
        $('#ConvertedChip').toggleClass('d-none', model.projectId == null)
            .text(l('Grants:Conversion:AlreadyConverted'));

        // Onaylanan destek yoksa dönüştürme yapılamaz: sebebi ekranda yazar.
        var blocked = !model.canConvert && model.projectId == null;
        $('#BlockedNote').toggleClass('d-none', !blocked);
        $('#BlockedText').text(l('Grants:Conversion:Blocked'));
        $('#ConvertBtn').toggleClass('d-none', !model.canConvert);
        $('#OpenProjectBtn').toggleClass('d-none', model.projectId == null)
            .attr('href', '/Projects/ProjectDetails/' + model.projectId);

        if (!$('#ProjectName').val()) { $('#ProjectName').val(model.suggestedProjectName); }
        $('#ProjectCode').text(model.suggestedProjectCode);
        if (!$('#StartDate').val()) { $('#StartDate').val(isoDate(model.startDate)); }
        if (!$('#EndDate').val()) { $('#EndDate').val(isoDate(model.endDate)); }

        paintBudget();
        paintPlan();
        paintSide();
        paintWarning();
    }

    function load() {
        return service.getPreview(appId).then(function (dto) { model = dto; paint(); });
    }

    load();
});
