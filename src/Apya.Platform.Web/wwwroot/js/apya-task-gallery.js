/*
 * Dosya Galerisi — PAYLAŞILAN konsol görünümü.
 *
 * Kanban/Gantt/Takvim ile AYNI sözleşme: apya.taskGallery.create({ mount,
 * getFilter, editModal }). Ayrı bir depo YOKTUR — süzülmüş görevlerin mevcut
 * ekleri arasından görseller gösterilir.
 *
 * Veri: taskSvc.getGallery(filter). Liste DTO'su yalnız ek SAYISINI taşır, o
 * yüzden galeri onunla beslenemez; görev başına getAttachments çağırmak da N+1
 * olurdu. Uç, görsel süzgecini veritabanında uygular.
 */
(function (window) {
    'use strict';

    var apya = window.apya = window.apya || {};

    var l = (typeof abp !== 'undefined' && abp.localization)
        ? abp.localization.getResource('Platform')
        : function (k) { return k; };

    function esc(s) {
        return $('<div/>').text(s == null ? '' : s).html();
    }

    function fmtSize(bytes) {
        if (!bytes && bytes !== 0) { return ''; }
        if (bytes < 1024) { return bytes + ' B'; }
        if (bytes < 1024 * 1024) { return Math.round(bytes / 1024) + ' KB'; }
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function create(opts) {
        var $mount = $(opts.mount);
        var getFilter = typeof opts.getFilter === 'function' ? opts.getFilter : function () { return {}; };
        var editModal = opts.editModal || null;
        var taskSvc = apya.platform.tasks.task;

        var state = { loading: false, items: [] };

        function render() {
            if (state.loading) {
                $mount.html('<div class="apya-gal-grid">'
                    + new Array(9).join('<div class="apya-gal-card apya-skeleton" style="height:190px"></div>')
                    + '</div>');
                return;
            }

            if (state.items.length === 0) {
                $mount.html('<p class="apya-gal-empty">' + esc(l('Tasks:Gallery:Empty')) + '</p>');
                return;
            }

            var html = '<div class="apya-gal-grid">';
            $.each(state.items, function (_, it) {
                html += ''
                    + '<figure class="apya-gal-card">'
                    + '  <a class="apya-gal-thumb" href="' + esc(it.downloadUrl) + '" target="_blank" rel="noreferrer"'
                    + '     title="' + esc(l('Tasks:Gallery:Open')) + '">'
                    + '    <img src="' + esc(it.downloadUrl) + '" alt="' + esc(it.fileName) + '" loading="lazy">'
                    + '  </a>'
                    + '  <figcaption class="apya-gal-meta">'
                    + '    <button type="button" class="apya-gal-task" data-open="' + it.taskId + '"'
                    + '            title="' + esc(it.taskTitle) + '">'
                    + '      <span class="apya-gal-code">' + esc(it.taskCode) + '</span>'
                    + '      <span class="apya-gal-title">' + esc(it.taskTitle) + '</span>'
                    + '    </button>'
                    + '    <span class="apya-gal-file">' + esc(it.fileName) + '</span>'
                    + '    <span class="apya-gal-size apya-numeric">' + fmtSize(it.fileSize)
                    + '      · ' + esc(it.uploaderName) + '</span>'
                    + '  </figcaption>'
                    + '</figure>';
            });
            html += '</div>';
            $mount.html(html);
        }

        function bindUi() {
            $mount.on('click', '[data-open]', function () {
                if (editModal) { editModal.open($(this).data('open')); }
            });
        }

        function load() {
            state.loading = true;
            render();
            // maxResultCount sunucudaki görev süzgecine gider; galeri satırı görev
            // değil EK olduğu için dönen sayı bundan fazla olabilir, bu beklenendir.
            var filter = $.extend({ maxResultCount: 1000 }, getFilter());
            return taskSvc.getGallery(filter).then(function (items) {
                state.items = items || [];
                state.loading = false;
                render();
            });
        }

        bindUi();
        return { load: load };
    }

    apya.taskGallery = { create: create };
})(window);
