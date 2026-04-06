$(function () {
    var taskService = apya.platform.tasks.task;
    var editModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' });
    var sortables = [];

    // Tıklanan görevi düzenle (EditModal açılır)
    $(document).on('click', '.edit-task-btn', function () {
        editModal.open({ id: $(this).data('id') });
    });

    // Kayıt edildikten sonra bordu yenile
    editModal.onResult(function () {
        loadKanban();
    });
    
    $('#btn-refresh-board').click(function(e) {
        e.preventDefault();
        loadKanban();
    });

    loadKanban();

    function loadKanban() {
        // Tüm projelerdeki kullanıcının görevlerini çekmek için projectId boş geçiyoruz. Max 1000 alalım.
        taskService.getList({ maxResultCount: 1000 }).then(function (result) {
            $('.kanban-cards').empty();
            var counts = { 1: 0, 2: 0, 3: 0, 4: 0 };

            result.items.forEach(function (task) {
                var statusId = task.status;
                var priorityId = task.priority;
                var assigneeHtml = task.assigneeName ? '<div class="small fw-bold text-muted mt-2"><i class="fa fa-user me-1"></i> ' + task.assigneeName + '</div>' : '';

                var dueHtml = '';
                var cardBorder = '';
                if (task.dueDate) {
                    if (statusId !== 4 && statusId !== 0) { // 4: Done, 0: Canceled
                        var dueDiff = moment(task.dueDate).diff(moment(), 'hours');
                        if (dueDiff < 0) {
                            cardBorder = 'border-danger border-2 bg-light bg-opacity-50';
                            dueHtml = '<div class="small text-white bg-danger mt-2 px-2 py-1 rounded fw-bold text-center heartbeat-animation"><i class="fa fa-exclamation-circle me-1"></i>Süresi Geçti (' + moment(task.dueDate).format("DD MMM") + ')</div>';
                        } else if (dueDiff <= 48) {
                            cardBorder = 'border-warning border-2';
                            dueHtml = '<div class="small text-dark bg-warning mt-2 px-2 py-1 rounded fw-bold text-center"><i class="fa fa-clock me-1"></i>Yaklaşıyor (' + moment(task.dueDate).format("DD MMM") + ')</div>';
                        } else {
                            dueHtml = '<div class="small text-muted mt-2 px-1"><i class="fa fa-clock me-1"></i> ' + moment(task.dueDate).format("DD MMM") + '</div>';
                        }
                    } else {
                        dueHtml = '<div class="small text-success mt-2 px-1"><i class="fa fa-check-circle me-1"></i> ' + moment(task.dueDate).format("DD MMM") + '</div>';
                    }
                }

                // Global bord olduğu için proje ismini koyarsak iyi olur (TaskDto içinde var olarak ayarladık)
                var projectHtml = task.projectName ? '<div class="small fw-bold text-primary mb-1"><i class="fa fa-rocket me-1"></i> ' + task.projectName + '</div>' : '';

                var cardHtml = `
                    <div class="kanban-card ${cardBorder}" data-id="${task.id}" data-priority="${priorityId}">
                        ${projectHtml}
                        <div class="fw-bold mb-1 text-dark">${task.title}</div>
                        ${assigneeHtml}
                        ${dueHtml}
                        <div class="text-end mt-2">
                           <button class="btn btn-sm btn-light py-0 px-2 rounded edit-task-btn" data-id="${task.id}"><i class="fa fa-pencil-alt text-secondary" style="font-size: 0.75rem;"></i></button>
                        </div>
                    </div>
                `;

                if (statusId === 1) { $('#kanban-todo').append(cardHtml); counts[1]++; }
                else if (statusId === 2) { $('#kanban-inprogress').append(cardHtml); counts[2]++; }
                else if (statusId === 3) { $('#kanban-inreview').append(cardHtml); counts[3]++; }
                else if (statusId === 4) { $('#kanban-done').append(cardHtml); counts[4]++; }
            });

            // Countları güncelle
            $('[data-status-id="1"] .kanban-count').text(counts[1]);
            $('[data-status-id="2"] .kanban-count').text(counts[2]);
            $('[data-status-id="3"] .kanban-count').text(counts[3]);
            $('[data-status-id="4"] .kanban-count').text(counts[4]);

            // SortableJS başlat
            initSortable();
        });
    }

    function initSortable() {
        // Destroy existing 
        sortables.forEach(function (s) { s.destroy(); });
        sortables = [];

        var cols = document.querySelectorAll('.kanban-cards');
        cols.forEach(function (col) {
            var sortable = new Sortable(col, {
                group: 'global-board', // Drag n drop her kolon arası
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: function (evt) {
                    var itemEl = evt.item;
                    var toCol = evt.to;
                    var taskId = $(itemEl).data('id');
                    var newStatusId = $(toCol).closest('.kanban-column').data('status-id');

                    if (evt.from !== evt.to) {
                        try{
                            taskService.updateStatus(taskId, newStatusId).then(function () {
                                abp.notify.success('Görev durumu başarıyla güncellendi.');
    
                                // Kolon sayılarını tekrar hesapla
                                var cArr = [1, 2, 3, 4];
                                cArr.forEach(function (s) {
                                    $('[data-status-id="' + s + '"] .kanban-count').text($('[data-status-id="' + s + '"] .kanban-cards .kanban-card').length);
                                });
                            }).catch(function (error) {
                                abp.message.error("Görevin durumu değiştirilirken bir hata oluştu.");
                                loadKanban(); // Hata olursa bordu eski haline getir
                            });
                        } catch(e) {
                             abp.message.error("Görevin durumu değiştirilirken bir hata oluştu.");
                             loadKanban();
                        }
                    }
                }
            });
            sortables.push(sortable);
        });
    }
});
