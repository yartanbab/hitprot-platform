// Görev satırı/kartı render yardımcıları — Tasks/index.js, Projects/ProjectDetails.js ve
// apya-kanban.js arasında paylaşılır (DRY). Global namespace: window.apyaTask.
(function (window) {
    'use strict';

    var TONES = ['positive', 'negative', 'warning', 'brand', 'ai', 'neutral'];

    function esc(s) {
        return $('<div>').text(s == null ? '' : String(s)).html();
    }

    // Basit deterministik string hash — aynı isim her zaman aynı tonu üretir.
    function hashTone(name) {
        var s = String(name || '');
        var h = 0;
        for (var i = 0; i < s.length; i++) {
            h = (h * 31 + s.charCodeAt(i)) | 0;
        }
        return TONES[Math.abs(h) % TONES.length];
    }

    function tagChips(tags) {
        if (!tags || !tags.length) return '';
        return '<div class="apya-task-tags">' +
            tags.map(function (t) {
                var name = t.name || t;
                return '<span class="apya-chip apya-chip-' + hashTone(name) + '">' + esc(name) + '</span>';
            }).join('') +
            '</div>';
    }

    // TaskPriority enum: Low=1, Medium=2, High=3, Critical=4 (Apya.Platform.Tasks.TaskPriority).
    var PRIORITY_MAP = {
        1: { tone: 'positive', text: 'Düşük' },
        2: { tone: 'warning', text: 'Orta' },
        3: { tone: 'negative', text: 'Yüksek' },
        4: { tone: 'negative', text: 'Kritik' }
    };

    function priorityBadge(priority) {
        var p = PRIORITY_MAP[priority] || PRIORITY_MAP[2];
        var icon = priority === 4 ? '<i class="fa fa-triangle-exclamation apya-priority-dot apya-priority-dot-' + p.tone + '"></i>' : '<span class="apya-priority-dot apya-priority-dot-' + p.tone + '"></span>';
        return icon + '<span class="apya-priority-text">' + p.text + '</span>';
    }

    // avatarOnly=true: isim etiketi olmadan yalnız renkli daire (kompakt tablo kolonları için).
    function assigneeAvatar(name, avatarOnly) {
        if (!name) return '<span class="text-muted small">—</span>';
        var initials = String(name).trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
        var tone = hashTone(name);
        var avatar = '<span class="apya-avatar apya-avatar-' + tone + '" title="' + esc(name) + '">' + esc(initials) + '</span>';
        return avatarOnly ? avatar : avatar + '<span class="ms-2">' + esc(name) + '</span>';
    }

    // status: TaskStatus enum (Done=4, Cancelled=0) — bu ikisinde aciliyet vurgusu yapılmaz.
    // Done ise BİTİŞ = gerçek tamamlanma günü (completedDate); eski kayıtlarda
    // completedDate yoksa deadline'a düş.
    function dueDateChip(dueDate, status, completedDate) {
        if (status === 4) {
            var doneDate = completedDate || dueDate;
            if (!doneDate) return '<span class="text-muted small">—</span>';
            return '<span class="text-muted small"><i class="fa fa-check-circle me-1"></i>' + moment(doneDate).format('DD MMM YYYY') + '</span>';
        }
        if (!dueDate) return '<span class="text-muted small">—</span>';
        var fmt = moment(dueDate).format('DD MMM YYYY');

        if (status === 0) {
            return '<span class="text-muted small">' + fmt + '</span>';
        }

        var diff = moment(dueDate).diff(moment(), 'hours');
        if (diff < 0) {
            return '<span class="apya-chip apya-chip-negative heartbeat-animation"><i class="fa fa-exclamation-circle me-1"></i>' + fmt + '</span>';
        }
        if (diff <= 48) {
            return '<span class="apya-chip apya-chip-warning"><i class="fa fa-clock me-1"></i>' + fmt + '</span>';
        }
        return '<span class="text-muted small">' + fmt + '</span>';
    }

    function commentCount(comments) {
        var n = (comments || []).length;
        if (!n) return '';
        return '<span class="text-muted small ms-2" title="Yorum sayısı"><i class="fa fa-comment me-1"></i>' + n + '</span>';
    }

    // --- Alt görev hiyerarşisi (Görevler listesi) ---------------------------
    // TaskStatus enum: Cancelled=0, Todo=1, InProgress=2, InReview=3, Done=4.
    var STATUS_MAP = {
        0: { tone: 'negative', text: 'İptal' },
        1: { tone: 'neutral', text: 'Yapılacak' },
        2: { tone: 'warning', text: 'Sürüyor' },
        3: { tone: 'brand', text: 'Testte' },
        4: { tone: 'positive', text: 'Tamamlandı' }
    };

    // Durum çipi + (varsa) özel kolon çipi YAN YANA. Eskiden kolon adı durumun
    // YERİNE geçiyordu: pano ile rapor ayrışıyor, "Testte" filtresi özel kolondaki
    // kartları bulamıyordu (Faz 4a). Artık ikisi de görünür.
    function statusChip(status, boardColumnName) {
        var s = STATUS_MAP[status] || STATUS_MAP[1];
        var html = '<span class="apya-chip apya-chip-' + s.tone + '">' + s.text + '</span>';
        if (boardColumnName) {
            html += '<span class="apya-chip apya-chip-brand ms-1" title="Projeye özel kolon">' +
                esc(boardColumnName) + '</span>';
        }
        return html;
    }

    // Aç/kapa chevron'u. Alt görevi olmayan satırda AYNI genişlikte boş bir yer
    // tutucu döner — aksi halde başlıklar satırdan satıra kayar.
    function subtaskToggle(row) {
        if (!row || !row.subTaskCount) {
            return '<span class="apya-subtask-toggle is-empty" aria-hidden="true"></span>';
        }
        return '<button type="button" class="apya-subtask-toggle" data-subtask-toggle="' + row.id + '"' +
            ' aria-expanded="false" aria-label="Alt görevleri göster">' +
            '<i class="fa fa-chevron-right"></i></button>';
    }

    // "2/5" rozeti — tamamlanan / toplam alt görev.
    function subtaskCountBadge(row) {
        if (!row || !row.subTaskCount) return '';
        return '<span class="apya-subtask-count" title="Tamamlanan / toplam alt görev">' +
            row.completedSubTaskCount + '/' + row.subTaskCount + '</span>';
    }

    // Chevron açılınca DataTables child satırına basılan alt görev listesi.
    // Üst tablonun kolonlarına HİZALANMAZ: child hücre tek bir colspan'dir ve
    // kolon genişlikleri scrollX ile dinamiktir — kendi flex düzeni vardır.
    function subtaskRows(subtasks) {
        if (!subtasks || !subtasks.length) {
            return '<div class="apya-subtask-panel"><p class="apya-subtask-empty">Alt görev bulunamadı.</p></div>';
        }
        return '<div class="apya-subtask-panel">' + subtasks.map(function (s) {
            return '<div class="apya-subtask-row" data-subtask-id="' + s.id + '" role="button" tabindex="0">' +
                '<span class="apya-subtask-code">' + esc(s.code) + '</span>' +
                '<span class="apya-subtask-title' + (s.status === 4 ? ' is-done' : '') + '">' + esc(s.title) + '</span>' +
                statusChip(s.status, s.boardColumnName) +
                '<span class="apya-subtask-due">' + dueDateChip(s.dueDate, s.status, s.completedDate) + '</span>' +
                assigneeAvatar(s.assigneeName, true) +
                '</div>';
        }).join('') + '</div>';
    }

    window.apyaTask = {
        esc: esc,
        hashTone: hashTone,
        tagChips: tagChips,
        priorityBadge: priorityBadge,
        assigneeAvatar: assigneeAvatar,
        dueDateChip: dueDateChip,
        commentCount: commentCount,
        statusChip: statusChip,
        subtaskToggle: subtaskToggle,
        subtaskCountBadge: subtaskCountBadge,
        subtaskRows: subtaskRows
    };
})(window);
