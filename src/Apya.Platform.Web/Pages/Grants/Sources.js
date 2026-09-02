$(function () {
    var service = apya.platform.grants.grantSource;
    var l = abp.localization.getResource('Platform');

    // GrantScrapeRunStatus enum sırasıyla birebir.
    var STATUS_OK = 0, STATUS_FAILED = 1, STATUS_SKIPPED = 2;

    var sources = [];
    var editingId = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return v ? Math.round(v).toLocaleString('tr-TR') + ' ₺' : '—'; }
    function date(v) { return v ? new Date(v).toLocaleDateString('tr-TR') : '—'; }

    // Gün farkı YEREL gün sınırından hesaplanır; ham milisaniye farkı saat
    // kaymasında bir gün eksik/fazla verir.
    function missedDays(v) {
        var a = new Date(v); a.setHours(0, 0, 0, 0);
        var b = new Date(); b.setHours(0, 0, 0, 0);
        return Math.max(0, Math.round((b - a) / 86400000));
    }

    // ---------- Kaynak listesi ----------
    function sourceChip(s) {
        if (!s.isActive) {
            return '<span class="apya-chip apya-chip-neutral">' + esc(l('Grants:Sources:Chip:Passive')) + '</span>';
        }
        if (s.lastRunStatus === STATUS_FAILED) {
            return '<span class="apya-chip apya-chip-negative">' + esc(l('Grants:Sources:Chip:Fix')) + '</span>';
        }
        if (s.lastRunStatus === STATUS_SKIPPED) {
            return '<span class="apya-chip apya-chip-warning">' + esc(l('Grants:Sources:Chip:Skipped')) + '</span>';
        }
        if (s.lastRunStatus === STATUS_OK && s.lastRunNewCount > 0) {
            return '<span class="apya-chip apya-chip-positive">' +
                esc(l('Grants:Sources:Chip:New', s.lastRunNewCount)) + '</span>';
        }
        if (s.lastRunStatus === STATUS_OK) {
            return '<span class="apya-chip apya-chip-neutral">' + esc(l('Grants:Sources:Chip:Current')) + '</span>';
        }
        return '';
    }

    function paintSources() {
        var $list = $('#SourceList').empty();
        sources.forEach(function (s) {
            var meta = (s.lastScrapedAt
                ? l('Grants:Sources:LastScrape') + ' ' + date(s.lastScrapedAt)
                : l('Grants:Sources:NeverScraped')) +
                ' · ' + l('Grants:Sources:CallCount', s.callCount);

            // 7c · Hatalı kaynakta "en son ne zaman VERİ geldi" ve kaç gündür
            // gelmediği yazılır. lastScrapedAt başarısız koşuyu da saydığı için
            // tek başına "dün tarandı" diyerek yanıltıyor.
            var sorun = '';
            if (s.lastRunStatus === STATUS_FAILED) {
                sorun = '<span class="apya-src-problem">' +
                    esc(s.lastSuccessAt
                        ? l('Grants:Sources:FailSince', date(s.lastSuccessAt), missedDays(s.lastSuccessAt))
                        : l('Grants:Sources:FailNeverOk')) +
                    (s.lastRunMessage ? ' · ' + esc(s.lastRunMessage) : '') + '</span>';
            }

            $list.append(
                '<button type="button" class="apya-src-item' + (s.id === editingId ? ' is-active' : '') +
                '" data-id="' + s.id + '">' +
                '<span class="apya-src-initial">' + esc(s.initial) + '</span>' +
                '<span class="apya-src-body">' +
                '<span class="apya-src-name">' + esc(s.name) + '</span>' +
                '<span class="apya-src-meta">' + esc(meta) + '</span>' + sorun +
                '</span>' + sourceChip(s) + '</button>');
        });
        $('#SourceListEmpty').toggleClass('d-none', sources.length > 0);
    }

    // ---------- Kaynak formu ----------
    $('#SourceList').on('click', '.apya-src-item', function () {
        var s = sources.find(function (x) { return x.id === $(this).data('id'); }.bind(this));
        if (s) { openForm(s); }
    });

    $('#SourceAddBtn').on('click', function () { openForm(null); });
    $('#SourceCancelBtn').on('click', closeForm);

    function openForm(s) {
        editingId = s ? s.id : null;
        $('#SourceName').val(s ? s.name : '');
        $('#SourceUrl').val(s ? (s.url || '') : '');
        $('#SourceActive').prop('checked', s ? s.isActive : true);
        $('#SourceDeleteBtn').toggleClass('d-none', !s);
        $('#SourceForm').removeClass('d-none');
        $('#SourceAddBtn').addClass('d-none');
        paintSources();
        $('#SourceName').trigger('focus');
    }

    function closeForm() {
        editingId = null;
        $('#SourceForm').addClass('d-none');
        $('#SourceAddBtn').removeClass('d-none');
        paintSources();
    }

    function collect() {
        return {
            name: $('#SourceName').val(),
            url: $('#SourceUrl').val() || null,
            isActive: $('#SourceActive').is(':checked')
        };
    }

    $('#SourceSaveBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        var input = collect();
        var call = editingId ? service.update(editingId, input) : service.create(input);
        call.then(function () {
            abp.notify.success(l('Grants:Sources:Saved'));
            closeForm();
            return load();
        }).always(function () { $btn.prop('disabled', false); });
    });

    $('#SourceDeleteBtn').on('click', function () {
        var s = sources.find(function (x) { return x.id === editingId; });
        if (!s) { return; }
        abp.message.confirm(l('Grants:Sources:DeleteConfirm', s.name)).then(function (ok) {
            if (!ok) { return; }
            service.delete(s.id).then(function () {
                abp.notify.success(l('Grants:Sources:Deleted'));
                closeForm();
                load();
            });
        });
    });

    // ---------- Taslak kuyruğu ----------
    function confidenceClass(pct) {
        // Tasarım 1a: <%60 kırmızı · %60-79 sarı · ≥%80 yeşil.
        return pct < 60 ? 'is-low' : pct < 80 ? 'is-mid' : 'is-high';
    }

    function paintQueue(drafts) {
        var $body = $('#DraftQueue').empty();
        drafts.forEach(function (d) {
            // Güveni %80'in altındaki taslak tamamlanmayı bekler; üstündeki yalnız incelenir.
            var low = d.fieldConfidence < 80;
            var btn = '<a class="btn btn-sm ' + (low ? 'btn-primary' : 'btn-outline-secondary') +
                '" href="/Grants/Parameters?id=' + d.grantId + '">' +
                esc(l(low ? 'Grants:Sources:Btn:Complete' : 'Grants:Sources:Btn:Review')) + '</a>';

            $body.append(
                '<div class="apya-queue-row">' +
                '<span class="apya-queue-call">' +
                '<span class="apya-queue-title">' + esc(d.title) + '</span>' +
                '<span class="apya-queue-issuer">' + esc(d.issuer) + '</span></span>' +
                '<span class="apya-queue-num">' + esc(d.period) + '</span>' +
                '<span class="apya-queue-num">' + esc(date(d.deadline)) + '</span>' +
                '<span class="apya-queue-num text-end">' + esc(money(d.maxAmount)) + '</span>' +
                '<span class="apya-queue-conf">' +
                '<span class="apya-conf-bar"><span class="' + confidenceClass(d.fieldConfidence) +
                '" style="width:' + d.fieldConfidence + '%"></span></span>' +
                '<span class="apya-conf-value">%' + d.fieldConfidence + '</span></span>' +
                '<span>' + btn + '</span>' +
                '</div>');
        });
        $('#DraftQueueEmpty').toggleClass('d-none', drafts.length > 0);
        $('#QueueCount')
            .toggleClass('d-none', drafts.length === 0)
            .text(l('Grants:Sources:QueueCount', drafts.length));
    }

    // ---------- Tara ----------
    $('#ScrapeAllBtn').on('click', function () {
        var $btn = $(this).prop('disabled', true);
        service.scrapeAll()
            .then(function (r) {
                abp.notify.success(
                    l('Grants:Sources:ScrapeResult', r.sourceCount, r.skippedCount, r.newDraftCount));
                // Kazıyıcı bağlı değilken hepsi atlanır — sessiz başarısızlık yerine söyle.
                if (r.sourceCount > 0 && r.skippedCount === r.sourceCount) {
                    abp.message.info(l('Grants:Sources:ScraperNotConnected'));
                }
                return load();
            })
            .always(function () { $btn.prop('disabled', false); });
    });

    function load() {
        return service.getConsole().then(function (c) {
            sources = c.sources || [];
            $('#KpiActiveSources').text(c.activeSourceCount);
            $('#KpiDraftQueue').text(c.draftQueueCount);
            $('#KpiPublishedCalls').text(c.publishedCallCount);
            $('#KpiChangedThisWeek').text(c.changedThisWeekCount);
            paintSources();
            paintQueue(c.drafts || []);
        });
    }

    load();
});
