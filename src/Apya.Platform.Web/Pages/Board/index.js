$(function () {
    // Global kanban (tüm projelerdeki kullanıcı görevleri). Ortak çekirdek:
    // /js/apya-kanban.js — kart/drag/timer/sil/düzenle tek kaynak.
    var editModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' });
    var createModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/CreateModal' });

    var kb = apya.kanban.create({
        projectId: null,            // global → sistem kolonları, status ile taşınır
        editModal: editModal,
        showProjectName: true,      // global board: kartta proje adı göster
        enableTimer: true,
        enableCustomColumns: false  // özel kolonlar projeye ait → global'de yok
    });

    $('#btn-refresh-board').on('click', function (e) { e.preventDefault(); kb.load(); });
    $('#btn-new-task').on('click', function (e) { e.preventDefault(); createModal.open(); });
    createModal.onResult(function () { kb.load(); });

    kb.load();
});
