$(function () {
    var service = apya.platform.grants.grantApplicationWizard;
    var l = abp.localization.getResource('Platform');
    var appId = $('.apya-page').data('application-id');

    // Enum sıraları sunucudakiyle birebir.
    var costKeys = ['Personel', 'MakineTechizat', 'Danismanlik', 'YazilimLisans', 'Seyahat', 'SarfMalzeme'];
    var roleKeys = ['Firma', 'Danisman', 'Ortak', 'Kurum'];
    var sizeKeys = { 1: 'Mikro', 2: 'Kucuk', 4: 'Orta', 8: 'Buyuk' };
    var stepKeys = ['Firm', 'Summary', 'Budget', 'Submit'];

    var model = null;
    var presence = [];
    var hub = null;
    var saveTimers = {};
    var saveFns = {};
    var saveSeq = {};
    // Kaydı bekleyen ya da başarısız alanlar. Yeniden çizim bunları sunucudaki
    // eski değerle EZMEZ; sayfadan çıkışta uyarı buna bakar.
    var dirty = {};
    // Yeniden çizimin geri verdiği odak, kullanıcı odağı değil: kilit isteme.
    var restoringFocus = false;
    var heartbeat = null;

    function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
    function money(v) { return (v || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 }); }
    function initials(n) {
        return (n || '?').trim().split(/\s+/).slice(0, 2)
            .map(function (w) { return w[0]; }).join('').toUpperCase();
    }
    function myLock(key) {
        var k = (model.locks || []).filter(function (x) { return x.fieldKey === key; })[0];
        return k && k.ownerUserId === model.viewerUserId ? k : null;
    }
    function isDirty(prefix) {
        return Object.keys(dirty).some(function (k) { return k.indexOf(prefix) === 0; });
    }
    function foreignLock(key) {
        var k = (model.locks || []).filter(function (x) { return x.fieldKey === key; })[0];
        return k && k.ownerUserId !== model.viewerUserId ? k : null;
    }

    // ---------- Canlı kanal ----------
    // Hub yalnız "değişti" sinyali taşır; veriyi daima servisten okuruz.
    function connect() {
        if (typeof signalR === 'undefined') { return; }

        hub = new signalR.HubConnectionBuilder()
            .withUrl('/grant-application-hub')
            .withAutomaticReconnect()
            .build();

        hub.on('PresenceChanged', function (people) {
            presence = people || [];
            paintPresence();
        });
        hub.on('ApplicationChanged', function () { load(); });

        // 7c · Bağlantıyı gizlemek yetmez, durumu SÖYLE. Kaydetme ve alan kilitleri
        // HTTP üzerinden gittiği için çalışmaya devam ediyor; kaybolan yalnız
        // karşı tarafın değişikliklerinin anlık yansıması.
        function setLive(online) {
            $('#LiveChip').toggleClass('d-none', !online);
            $('#OfflineChip').toggleClass('d-none', online)
                .attr('title', online ? null : l('Grants:Wizard:OfflineHint'));
        }

        hub.start()
            .then(function () {
                setLive(true);
                return hub.invoke('Subscribe', appId);
            })
            .catch(function () { setLive(false); });

        hub.onreconnecting(function () { setLive(false); });
        hub.onreconnected(function () { setLive(true); hub.invoke('Subscribe', appId); load(); });
        hub.onclose(function () { setLive(false); });
    }

    function announce(fieldKey) {
        if (hub && hub.state === 'Connected') { hub.invoke('NotifyChanged', appId, fieldKey || null); }
    }
    function focusField(fieldKey) {
        if (hub && hub.state === 'Connected') { hub.invoke('SetFocus', appId, fieldKey || null); }
    }

    // ---------- Alan kilidi ----------
    function acquire(fieldKey, $el) {
        // Zaten tutulan kilidi yeniden isteme: focus → acquire → load → paint →
        // odak geri → focus zinciri saniyede onlarca kilit + GET üretiyordu.
        if (model && myLock(fieldKey)) { return; }
        service.acquireLock({ applicationId: appId, fieldKey: fieldKey }).then(function (r) {
            if (!r.acquired) {
                abp.message.warn(l('Grants:Wizard:LockedBy', (r.lock || {}).ownerName || '?'));
                $el.blur();
            }
            load();
        });
    }

    function release(fieldKey) {
        service.releaseLock({ applicationId: appId, fieldKey: fieldKey }).then(function () {
            announce(fieldKey);
            load();
        });
    }

    function startHeartbeat() {
        clearInterval(heartbeat);
        // Kilit 2 dakika dokunulmazsa açılır; 30 sn'de bir dokunmak yeter.
        heartbeat = setInterval(function () {
            var key = $(document.activeElement).closest('[data-field]').data('field');
            if (key) { service.heartbeat({ applicationId: appId, fieldKey: key }); }
        }, 30000);
    }

    // ---------- Otomatik kayıt ----------
    function scheduleSave(key, fn) {
        clearTimeout(saveTimers[key]);
        saveFns[key] = fn;
        dirty[key] = true;
        saveTimers[key] = setTimeout(function () { runSave(key, false); }, 600);
    }

    function setSaveChip(text, failed) {
        $('#SaveChip').text(text)
            .toggleClass('apya-chip-warning', !!failed)
            .toggleClass('apya-chip-neutral', !failed);
    }

    // Başarısız kayıtta yazılan alanda KALIR (dirty), rozet uyarıya döner ve kayıt
    // arka planda yeniden denenir. Eskiden hata yolu yoktu: rozet "kaydediliyor…"da
    // takılıyor, sonraki yeniden çizim alanı sunucudaki eski değerle eziyordu.
    function runSave(key, isRetry) {
        var seq = saveSeq[key] = (saveSeq[key] || 0) + 1;
        saveTimers[key] = null;
        setSaveChip(l('Grants:Wizard:Saving'), false);
        // Yeniden denemede ABP hata penceresini tekrar tekrar açma; durum rozette.
        saveFns[key](isRetry ? { abpHandleError: false } : undefined).then(function (dto) {
            if (saveSeq[key] === seq && !saveTimers[key]) { delete dirty[key]; }
            model = dto;
            paint();
            setSaveChip(l('Grants:Wizard:Saved'), false);
            announce(key);
        }, function () {
            if (saveSeq[key] !== seq) { return; }
            setSaveChip(l('Grants:Wizard:SaveFailed'), true);
            if (!saveTimers[key]) {
                saveTimers[key] = setTimeout(function () { runSave(key, true); }, 10000);
            }
        });
    }

    window.addEventListener('beforeunload', function (e) {
        if (Object.keys(dirty).length) { e.preventDefault(); e.returnValue = ''; }
    });

    // ---------- Adımlar ----------
    function paintSteps() {
        var html = '';
        for (var i = 1; i <= model.stepCount; i++) {
            var done = i < model.currentStep;
            html += '<button type="button" class="apya-wiz-step-chip' +
                (i === model.currentStep ? ' is-active' : (done ? ' is-done' : '')) +
                '" data-goto="' + i + '">' +
                '<span class="apya-wiz-step-no">' + (done ? '<i class="fa fa-check"></i>' : i) + '</span>' +
                esc(l('Grants:Wizard:Step:' + stepKeys[i - 1])) + '</button>';
        }
        $('#Steps').html(html);
        $('.apya-wiz-step').addClass('d-none');
        $('.apya-wiz-step[data-step="' + model.currentStep + '"]').removeClass('d-none');

        $('#PrevBtn').prop('disabled', model.currentStep === 1);
        $('#NextBtn')
            .text(model.currentStep === model.stepCount
                ? l('Grants:Wizard:Submit')
                : l('Grants:Wizard:Next'))
            .prop('disabled', model.isReadOnly);
        $('#HandOverBtn')
            .text(model.viewerRole === 0 ? l('Grants:Wizard:HandOverToConsultant') : l('Grants:Wizard:HandOverToFirm'))
            .prop('disabled', model.isReadOnly);
    }

    $('#Steps').on('click', '.apya-wiz-step-chip', function () {
        service.setStep(appId, Number($(this).data('goto'))).then(function (dto) {
            model = dto; paint();
        });
    });

    $('#PrevBtn').on('click', function () {
        if (model.currentStep > 1) {
            service.setStep(appId, model.currentStep - 1).then(function (dto) { model = dto; paint(); });
        }
    });

    $('#NextBtn').on('click', function () {
        if (model.currentStep < model.stepCount) {
            service.setStep(appId, model.currentStep + 1).then(function (dto) { model = dto; paint(); });
            return;
        }
        service.submit(appId).then(function (dto) {
            model = dto; paint();
            abp.notify.success(l('Grants:Wizard:SubmittedNotice'));
            announce(null);
        });
    });

    $('#HandOverBtn').on('click', function () {
        service.handOver(appId).then(function (dto) {
            model = dto; paint();
            abp.notify.success(l('Grants:Wizard:HandedOver'));
            announce(null);
        });
    });

    // ---------- Adım 1 · firma ----------
    function paintFirm() {
        var f = model.firm;
        if (!f) {
            $('#FirmFacts').html('<div class="small text-muted">' + esc(l('Grants:Wizard:NoProfile')) + '</div>');
            return;
        }
        function fact(label, value) {
            return '<div class="apya-field"><span class="apya-field-label"><span>' + esc(label) +
                '</span></span><span class="apya-numeric fw-semibold">' + esc(value) + '</span></div>';
        }
        // Etiketler FİRMA dilli: Grants:Rule:* anahtarları programın şartını anlatır
        // ("TRL aralığı", "Konsorsiyum şartı"); burada firmanın kendi değeri var.
        $('#FirmFacts').html(
            fact(l('Grants:Wizard:Firm:Size'), f.size ? l('Grants:Size:' + sizeKeys[f.size]) : '—') +
            fact(l('Grants:Wizard:Firm:StaffCount'), f.staffCount == null ? '—' : f.staffCount) +
            fact(l('Grants:Wizard:Firm:RdStaffCount'), f.rdStaffCount == null ? '—' : f.rdStaffCount) +
            fact(l('Grants:Wizard:Firm:Trl'), f.trl == null ? '—' : f.trl) +
            fact(l('Grants:Wizard:Firm:Consortium'), f.hasConsortiumPartner == null
                ? '—' : l(f.hasConsortiumPartner ? 'Grants:Yes' : 'Grants:No')) +
            fact(l('Grants:Wizard:ProfileCompletion'), '%' + f.completionPercent));

        $('#FirmGap').toggleClass('d-none', f.completionPercent >= 100);
        $('#FirmGapText').text(l('Grants:Wizard:ProfileGap', f.completionPercent));
    }

    // ---------- Adım 2 · özet ----------
    function paintSummary() {
        // Kayıt tek istekte üç alanı birden yazar: biri kaydedilmemişken hiçbirini ezme.
        // (Yaz → 600 ms dolmadan Tab: blur → release → load buradan geçip alanı
        // boşaltıyor, ardından zamanlayıcı boş değeri kaydediyordu.)
        if (isDirty('summary:')) { return; }
        if (!$('#ProjectTitle').is(':focus')) { $('#ProjectTitle').val(model.projectTitle || ''); }
        if (!$('#ProjectSummary').is(':focus')) { $('#ProjectSummary').val(model.projectSummary || ''); }
        if (!$('#ProjectDuration').is(':focus')) { $('#ProjectDuration').val(model.projectDurationMonths || ''); }
    }

    function saveSummary(fieldKey) {
        scheduleSave(fieldKey, function (ajax) {
            return service.saveSummary({
                applicationId: appId,
                projectTitle: $('#ProjectTitle').val() || null,
                projectSummary: $('#ProjectSummary').val() || null,
                projectDurationMonths: Number($('#ProjectDuration').val()) || null
            }, ajax);
        });
    }

    $('#ProjectTitle').on('input', function () { saveSummary('summary:Title'); });
    $('#ProjectSummary').on('input', function () { saveSummary('summary:Body'); });
    $('#ProjectDuration').on('input', function () { saveSummary('summary:Duration'); });

    // ---------- Adım 3 · bütçe ----------
    function budgetRow(line) {
        var key = 'budget:' + costKeys[line.kind];
        var lock = foreignLock(key);
        var name = esc(l('Grants:CostItem:' + costKeys[line.kind]));

        if (!line.isEligible) {
            return '<div class="apya-wiz-row is-ineligible">' +
                '<span class="apya-wiz-item"><span class="apya-wiz-item-name">' + name + '</span>' +
                '<span class="apya-wiz-item-note">' + esc(l('Grants:Wizard:NotSupported')) + '</span></span>' +
                '<span class="apya-numeric">—</span><span class="apya-numeric">—</span>' +
                '<span class="apya-numeric">0</span></div>';
        }

        return '<div class="apya-wiz-row apya-wiz-field' + (lock ? ' is-locked' : '') + '" data-field="' + key + '">' +
            '<span class="apya-wiz-item">' +
            '<span class="apya-wiz-item-name">' + name +
            (lock ? ' <span class="apya-wiz-lock"><span class="apya-wiz-avatar">' + esc(initials(lock.ownerName)) +
                '</span>' + esc(l('Grants:Wizard:Writing', lock.ownerName)) + '</span>' : '') + '</span>' +
            '<input type="text" class="form-control form-control-sm apya-wiz-note" ' +
            'placeholder="' + esc(l('Grants:Wizard:JustificationPlaceholder')) + '" ' +
            'value="' + esc(line.justification || '') + '" maxlength="512" />' +
            '</span>' +
            '<span data-label="' + esc(l('Grants:Wizard:Col:Amount')) + '">' +
            '<input type="number" min="0" step="1" class="form-control form-control-sm apya-numeric apya-wiz-amount" ' +
            'value="' + (line.amount || 0) + '" /></span>' +
            '<span class="apya-numeric" data-label="' + esc(l('Grants:Wizard:Col:Limit')) + '">' +
            (line.limitPercent == null ? '—' : '%' + line.limitPercent) +
            (line.limitApplied ? ' <i class="fa fa-triangle-exclamation text-warning"></i>' : '') + '</span>' +
            '<span class="apya-numeric fw-semibold" data-label="' + esc(l('Grants:Wizard:Col:Support')) + '">' +
            money(line.supportAmount) + '</span>' +
            '</div>';
    }

    function paintBudget() {
        // Yalnız bütçe satırındaki odak geri verilir; özet alanları yeniden çizilmez.
        var active = document.activeElement;
        var $activeRow = $(active).closest('#BudgetRows [data-field]');
        var focusKey = $activeRow.data('field');
        var focusIndex = focusKey ? $activeRow.find('input').index(active) : -1;
        var caret = active && active.selectionStart;

        // Kaydı bekleyen/başarısız satırın yazılanı yeniden çizimde kaybolmasın.
        var typed = {};
        $('#BudgetRows [data-field]').each(function () {
            var k = $(this).data('field');
            if (dirty[k]) {
                typed[k] = { amount: $(this).find('.apya-wiz-amount').val(), note: $(this).find('.apya-wiz-note').val() };
            }
        });

        $('#BudgetRows').html((model.budgetLines || []).map(budgetRow).join(''));
        Object.keys(typed).forEach(function (k) {
            var $row = $('#BudgetRows [data-field="' + k + '"]');
            $row.find('.apya-wiz-amount').val(typed[k].amount);
            $row.find('.apya-wiz-note').val(typed[k].note);
        });
        $('#TotalProject').text(money(model.totalProject) + ' ₺');
        $('#TotalSupport').text(money(model.totalSupport) + ' ₺');
        $('#OwnContribution').text(money(model.ownContribution) + ' ₺');
        $('#CapNote').text(model.maxAmount
            ? l('Grants:Wizard:CapNote', money(model.maxAmount), model.supportShareOfCapPercent || 0)
            : '');
        $('#CoEditChip').toggleClass('d-none', presence.length < 2);

        // Yeniden çizim odağı düşürmesin — canlı düzenlemede kullanıcı hâlâ yazıyor olabilir.
        // Native focus + bayrak: jQuery trigger('focus') odaktaki öğede işleyicileri
        // yeniden çalıştırıp kilit isteğini sonsuz döngüye sokuyordu.
        if (focusKey) {
            var $back = $('#BudgetRows [data-field="' + focusKey + '"]').find('input').eq(Math.max(focusIndex, 0));
            if ($back.length) {
                restoringFocus = true;
                try { $back[0].focus(); } finally { restoringFocus = false; }
                if (caret != null && $back[0].setSelectionRange && $back.attr('type') === 'text') {
                    $back[0].setSelectionRange(caret, caret);
                }
            }
        }
    }

    function kindOf($row) { return costKeys.indexOf($row.data('field').split(':')[1]); }

    $('#BudgetRows').on('focus', 'input', function () {
        if (restoringFocus) { return; }
        var $row = $(this).closest('[data-field]');
        focusField($row.data('field'));
        acquire($row.data('field'), $(this));
    });

    $('#BudgetRows').on('blur', 'input', function () {
        var key = $(this).closest('[data-field]').data('field');
        if (myLock(key)) { release(key); }
        focusField(null);
    });

    $('#BudgetRows').on('input', '.apya-wiz-amount, .apya-wiz-note', function () {
        var $row = $(this).closest('[data-field]');
        var kind = kindOf($row);
        var key = $row.data('field');
        // Satır yeniden çizilebilir: kayıt anında GÜNCEL satırı key ile bul.
        scheduleSave(key, function (ajax) {
            var $current = $('#BudgetRows [data-field="' + key + '"]');
            return service.saveBudgetLine({
                applicationId: appId,
                kind: kind,
                amount: Number($current.find('.apya-wiz-amount').val()) || 0,
                justification: $current.find('.apya-wiz-note').val() || null
            }, ajax);
        });
    });

    // Özet alanları da kilitlenir.
    $('.apya-wiz-field[data-field^="summary:"]').find('input, textarea')
        .on('focus', function () {
            var key = $(this).closest('[data-field]').data('field');
            focusField(key);
            acquire(key, $(this));
        })
        .on('blur', function () {
            var key = $(this).closest('[data-field]').data('field');
            if (myLock(key)) { release(key); }
            focusField(null);
        });

    // ---------- Adım 4 · gönder ----------
    function paintSubmit() {
        var items = (model.pendingFields || []);
        var ready = model.completionPercent >= 100;
        $('#SubmitChecklist').html(
            '<div class="apya-wiz-person"><i class="fa ' +
            (model.projectTitle ? 'fa-circle-check text-success' : 'fa-circle-exclamation text-warning') +
            '"></i>' + esc(l('Grants:Wizard:ProjectTitle')) + '</div>' +
            '<div class="apya-wiz-person"><i class="fa ' +
            (model.totalProject > 0 ? 'fa-circle-check text-success' : 'fa-circle-exclamation text-warning') +
            '"></i>' + esc(l('Grants:Wizard:Step:Budget')) + '</div>' +
            '<div class="apya-wiz-person"><i class="fa ' +
            (ready ? 'fa-circle-check text-success' : 'fa-circle-exclamation text-warning') +
            '"></i>' + esc(l('Grants:Wizard:Completion')) + ' %' + model.completionPercent + '</div>');

        $('#SubmitWarning').toggleClass('d-none', ready || model.isReadOnly);
        $('#SubmitWarningText').text(l('Grants:Wizard:IncompleteWarning', items.length));
        $('#SubmittedChip').toggleClass('d-none', !model.isReadOnly)
            .text(model.submittedAt ? l('Grants:Wizard:SubmittedOn',
                new Date(model.submittedAt).toLocaleDateString('tr-TR')) : '');
    }

    // ---------- Sağ panel ----------
    function paintPresence() {
        if (!model) { return; }
        var html = presence.map(function (p) {
            var mine = p.userId === model.viewerUserId;
            return '<div class="apya-wiz-person">' +
                '<span class="apya-wiz-avatar">' + esc(initials(p.name)) + '</span>' +
                '<span class="flex-fill"><span class="fw-semibold">' + esc(p.name) + '</span>' +
                (mine ? ' <span class="apya-wiz-person-field">' + esc(l('Grants:Wizard:You')) + '</span>' : '') +
                '<br /><span class="apya-wiz-person-field">' +
                esc(p.fieldKey ? l('Grants:Wizard:OnField', fieldLabel(p.fieldKey)) : l('Grants:Wizard:Idle')) +
                '</span></span></div>';
        }).join('');
        $('#PresenceList').html(html || '<div class="small text-muted">' + esc(l('Grants:Wizard:AloneHere')) + '</div>');
        $('#OnlineChip').toggleClass('d-none', presence.length < 2)
            .text(l('Grants:Wizard:OnlineCount', presence.length));
        $('#CoEditChip').toggleClass('d-none', presence.length < 2);
    }

    function fieldLabel(key) {
        if (key.indexOf('budget:') === 0) {
            return l('Grants:CostItem:' + key.split(':')[1]);
        }
        if (key === 'summary:Title') { return l('Grants:Wizard:ProjectTitle'); }
        if (key === 'summary:Body') { return l('Grants:Wizard:ProjectSummary'); }
        if (key === 'summary:Duration') { return l('Grants:Wizard:Duration'); }
        return key;
    }

    function paintPending() {
        var items = model.pendingFields || [];
        $('#PendingList').html(items.length
            ? items.map(function (p) {
                return '<div class="apya-wiz-person"><i class="fa fa-circle-dot text-warning"></i>' +
                    '<span class="flex-fill">' + esc(fieldLabel(p.fieldKey.replace(':note', ''))) +
                    (p.fieldKey.indexOf(':note') > 0
                        ? ' <span class="apya-wiz-person-field">' + esc(l('Grants:Wizard:JustificationMissing')) + '</span>'
                        : '') + '</span></div>';
            }).join('')
            : '<div class="small text-muted">' + esc(l('Grants:Wizard:NothingPending')) + '</div>');
    }

    function paintMessages() {
        var items = model.messages || [];
        $('#MessageCount').toggleClass('d-none', items.length === 0).text(items.length);
        $('#MessageList').html(items.map(function (m) {
            return '<div class="apya-wiz-message' + (m.senderUserId === model.viewerUserId ? ' is-mine' : '') + '">' +
                '<div class="apya-wiz-message-head"><span>' + esc(m.senderName) + '</span>' +
                '<span class="apya-wiz-message-time">' +
                new Date(m.creationTime).toLocaleDateString('tr-TR') + '</span></div>' +
                esc(m.body) + '</div>';
        }).join(''));
        var el = document.getElementById('MessageList');
        if (el) { el.scrollTop = el.scrollHeight; }
    }

    $('#SendMessageBtn').on('click', sendMessage);
    $('#MessageBody').on('keydown', function (e) { if (e.key === 'Enter') { sendMessage(); } });

    function sendMessage() {
        var body = ($('#MessageBody').val() || '').trim();
        if (!body) { return; }
        service.sendMessage({ applicationId: appId, body: body }).then(function () {
            $('#MessageBody').val('');
            announce(null);
            load();
        });
    }

    // ---------- Çizim ----------
    function paint() {
        $('#GrantName').text(model.grantName);
        $('#GrantMeta').text([model.issuer, model.period,
            model.deadline ? l('Grants:Wizard:DeadlineOn', new Date(model.deadline).toLocaleDateString('tr-TR')) : null]
            .filter(Boolean).join(' · '));
        $('#DeadlineChip').toggleClass('d-none', model.daysRemaining == null)
            .text(l('Grants:Feed:Card:DaysLeft', model.daysRemaining));
        $('#CompletionBar').css('width', model.completionPercent + '%');
        $('#CompletionValue').text('%' + model.completionPercent);

        paintSteps();
        paintFirm();
        paintSummary();
        paintBudget();
        paintSubmit();
        paintPresence();
        paintPending();
        paintMessages();

        // Kilitli alanları kapat.
        $('.apya-wiz-field[data-field^="summary:"]').each(function () {
            var key = $(this).data('field');
            var lock = foreignLock(key);
            $(this).toggleClass('is-locked', !!lock)
                .find('.apya-wiz-lock').html(lock
                    ? '<span class="apya-wiz-avatar">' + esc(initials(lock.ownerName)) + '</span>' +
                      esc(l('Grants:Wizard:Writing', lock.ownerName))
                    : '');
        });

        if (model.isReadOnly) {
            $('.apya-wiz-step input, .apya-wiz-step textarea').prop('disabled', true);
        }
    }

    function load() {
        return service.get(appId).then(function (dto) { model = dto; paint(); });
    }

    $('#SaveChip').text(l('Grants:Wizard:AutoSave'));
    load().then(function () { connect(); startHeartbeat(); });
});
