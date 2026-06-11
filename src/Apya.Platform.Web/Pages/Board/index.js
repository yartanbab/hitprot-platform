$(function () {
    // Global kanban (tüm projelerdeki kullanıcı görevleri). Ortak çekirdek:
    // /js/apya-kanban.js — kart/drag/timer/sil/düzenle tek kaynak.
    var editModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' });
    var createModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/CreateModal' });

    var kb = apya.kanban.create({
        projectId: null,            // başlangıç: global → sistem kolonları, status ile taşınır
        editModal: editModal,
        showProjectName: true,      // global görünümde kartta proje adı göster
        enableTimer: false,         // zaman sayacı her board'da gizli (kullanıcı kararı)
        enableCustomColumns: true   // proje seçilince o projenin özel kolonları + Kolon Ekle gelir
    });

    // Proje seçici doldur — proje seçilince board o projeye scope'lanır (özel kolon yönetimi açılır)
    apya.platform.application.projects.project.getList({ maxResultCount: 1000 }).then(function (res) {
        var $sel = $('#board-project');
        (res.items || []).forEach(function (p) {
            $sel.append($('<option>').val(p.id).text(p.name + (p.code ? ' (' + p.code + ')' : '')));
        });
    });
    $('#board-project').on('change', function () { kb.setProject($(this).val() || null); });

    $('#btn-refresh-board').on('click', function (e) { e.preventDefault(); kb.load(); });
    $('#btn-new-task').on('click', function (e) {
        e.preventDefault();
        var pid = $('#board-project').val();
        createModal.open(pid ? { projectId: pid } : {});
    });
    createModal.onResult(function () { kb.load(); });

    kb.load();
});
