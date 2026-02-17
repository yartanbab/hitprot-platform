$(function () {
    // Servis çağrısı için proxy nesnesini alıyoruz
    var taskService = apya.platform.tasks.task;

    // Modal (Açılır Pencere) Yöneticisi
    var createModal = new abp.ModalManager(abp.appPath + 'Tasks/CreateModal');
    var editModal = new abp.ModalManager(abp.appPath + 'Tasks/EditModal');

    // Tablo Konfigürasyonu
    var dataTable = $('#TasksTable').DataTable(abp.libs.datatables.normalizeConfiguration({
        serverSide: true,
        paging: true,
        order: [[1, "desc"]], // Başlangıç tarihine göre sırala
        searching: true,
        scrollX: true,
        ajax: abp.libs.datatables.createAjax(taskService.getList), // Veriyi servisten çek
        columnDefs: [
            {
                title: "İşlemler",
                rowAction: {
                    items: [
                        {
                            text: "Düzenle",
                            action: function (data) {
                                editModal.open({ id: data.record.id });
                            }
                        },
                        {
                            text: "Sil",
                            confirmMessage: function (data) {
                                return data.record.title + " görevini silmek istediğinize emin misiniz?";
                            },
                            action: function (data) {
                                taskService.delete(data.record.id)
                                    .then(function () {
                                        abp.notify.info("Başarıyla silindi.");
                                        dataTable.ajax.reload();
                                    });
                            }
                        }
                    ]
                }
            },
            {
                title: "Başlık",
                data: "title"
            },
            {
                title: "Atanan Kişi",
                data: "assigneeName",
                render: function (data) {
                    return data ? '<span class="badge bg-info">' + data + '</span>' : '<span class="badge bg-secondary">Atanmadı</span>';
                }
            },
            {
                title: "Durum",
                data: "status",
                render: function (data) {
                    var color = 'secondary';
                    var text = 'Bilinmiyor';

                    if (data === 1) { text = 'Yapılacak'; color = 'warning text-dark'; }
                    else if (data === 2) { text = 'Sürüyor'; color = 'primary'; }
                    else if (data === 3) { text = 'Testte'; color = 'info'; }
                    else if (data === 4) { text = 'Tamamlandı'; color = 'success'; }
                    else if (data === 0) { text = 'Bekliyor'; color = 'secondary'; } // 0 Durumu (Taslak/Bekliyor) için ekleme yapıldı

                    return '<span class="badge bg-' + color + '">' + text + '</span>';
                }
            },
            {
                title: "Başlangıç Tarihi",
                data: "startDate",
                render: function (data) {
                    // KİLİT NOKTA: Tarih boşsa patlamasını engelliyoruz
                    if (!data) return '<span class="text-muted">—</span>';
                    return luxon.DateTime.fromISO(data, { locale: abp.localization.currentCulture.name }).toLocaleString(luxon.DateTime.DATE_SHORT);
                }
            }
        ]
    }));

    // "Yeni Görev" butonuna tıklanınca modalı aç
    $('#NewTaskButton').click(function (e) {
        e.preventDefault();
        createModal.open();
    });

    // Modallar kapanınca tabloyu yenile
    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    editModal.onResult