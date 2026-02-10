$(function () {
    // 1. Modalı Tanımla
    var createTaskModal = new abp.ModalManager({
        viewUrl: abp.appPath + 'Tasks/CreateModal'
    });

    // 2. Butona Tıklanınca
    $('#btn-create-task').click(function (e) {
        e.preventDefault();

        // ID'yi HTML butonundan (data-project-id) okuyoruz
        var projectId = $(this).attr('data-project-id');

        createTaskModal.open({
            projectId: projectId
        });
    });

    // 3. Kayıt Başarılı Olunca Sayfayı Yenile
    createTaskModal.onResult(function () {
        abp.notify.success('Görev başarıyla eklendi!');
        window.location.reload();
    });
});