$(function () {
    // Global kanban (tüm projelerdeki kullanıcı görevleri). Ortak çekirdek:
    // /js/apya-kanban.js — kart/drag/timer/sil/düzenle tek kaynak.
    var _oldEditModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' });
    var editModal = (window.apya && (apya.taskDetailV2Enabled || apya.taskDetailV3Enabled || apya.taskDetail))
        ? {
            open: function (arg) { (window.apya?.taskDetail || _oldEditModal).open(arg); },
            onResult: function (fn) {
                _oldEditModal.onResult(fn);
                window.apya?.taskDetail?.onResult?.(fn);
            }
        }
        : new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' });
    var createModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/CreateModal' });

    var kb = apya.kanban.create({
        projectId: null,            // ilk proje listesi gelince setProject ile atanır
        editModal: editModal,
        showProjectName: false,     // tek proje seçili → kartta proje adı gereksiz
        enableTimer: false,         // zaman sayacı her board'da gizli (kullanıcı kararı)
        enableCustomColumns: true   // seçili projenin özel kolonları + Kolon Ekle gelir
    });

    // Proje seçici doldur — "Tüm Projeler (Genel)" kaldırıldı; board hep bir projeye scope'lu.
    // İlk proje otomatik seçilir ve yüklenir.
    $('#board-project').on('change', function () { kb.setProject($(this).val() || null); });

    apya.platform.application.projects.project.getList({ maxResultCount: 1000 }).then(function (res) {
        var $sel = $('#board-project');
        var items = res.items || [];
        items.forEach(function (p) {
            $sel.append($('<option>').val(p.id).text(p.name + (p.code ? ' (' + p.code + ')' : '')));
        });
        if (items.length) {
            $sel.val(items[0].id);
            kb.setProject(items[0].id);   // doğrudan ilk projenin board'u
        } else {
            kb.load();                    // hiç proje yoksa boş board
        }
    }).catch(function () { kb.load(); });

    $('#btn-refresh-board').on('click', function (e) { e.preventDefault(); kb.load(); });
    $('#btn-new-task').on('click', function (e) {
        e.preventDefault();
        var pid = $('#board-project').val();
        createModal.open(pid ? { projectId: pid } : {});
    });
    createModal.onResult(function () { kb.load(); });
});
