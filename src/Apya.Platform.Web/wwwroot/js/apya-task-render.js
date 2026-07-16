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

    function assigneeAvatar(name) {
        if (!name) return '<span class="text-muted small">—</span>';
        var initials = String(name).trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
        var tone = hashTone(name);
        return '<span class="apya-avatar apya-avatar-' + tone + '" title="' + esc(name) + '">' + esc(initials) + '</span>' +
            '<span class="ms-2">' + esc(name) + '</span>';
    }

    // status: TaskStatus enum (Done=4, Cancelled=0) — bu ikisinde aciliyet vurgusu yapılmaz.
    function dueDateChip(dueDate, status) {
        if (!dueDate) return '<span class="text-muted small">—</span>';
        var isDone = status === 4;
        var fmt = moment(dueDate).format('DD MMM YYYY');

        if (isDone) {
            return '<span class="text-muted small"><i class="fa fa-check-circle me-1"></i>' + fmt + '</span>';
        }
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

    window.apyaTask = {
        esc: esc,
        hashTone: hashTone,
        tagChips: tagChips,
        priorityBadge: priorityBadge,
        assigneeAvatar: assigneeAvatar,
        dueDateChip: dueDateChip,
        commentCount: commentCount
    };
})(window);
