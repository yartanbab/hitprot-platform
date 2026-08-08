$(function () {
    var taskService = apya.platform.tasks.task;
    var _oldEditModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' });
    var editModal = {
        open: function (arg) {
            if (window.apya && (window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled || window.apya.taskDetail)) {
                (window.apya?.taskDetail || _oldEditModal).open(arg);
            } else {
                _oldEditModal.open(arg);
            }
        },
        onResult: function (fn) {
            _oldEditModal.onResult(fn);
            if (window.apya && window.apya.taskDetail) {
                window.apya.taskDetail.onResult?.(fn);
            }
        }
    };

    // Proje Id'sini sayfadan alıyoruz (buton attribute veya URL)
    var projectId = $('#btn-create-task').data('project-id');
    if (!projectId) {
        var pathParts = window.location.pathname.split('/');
        projectId = pathParts[pathParts.length - 1];
    }

    // --- 1. DataTable ---
    var dataTable = $('#ProjectTasksTable').DataTable(
        abp.libs.datatables.normalizeConfiguration({
            serverSide: true,
            paging: true,
            order: [[0, 'asc']],
            searching: true,
            scrollX: true,
            ajax: abp.libs.datatables.createAjax(taskService.getList, function () {
                return { projectId: projectId };
            }),
            createdRow: function (row, data) {
                $(row).attr('data-id', data.id).css('cursor', 'pointer');
            },
            columnDefs: [
                {
                    title: 'Başlık',
                    data: 'title',
                    render: function (data, type, row) {
                        var head = '<span class="fw-bold">' + apyaTask.esc(data) + '</span>' + apyaTask.commentCount(row.comments);
                        if (row.parentTaskTitle) {
                            head += '<div class="text-muted small"><i class="fa fa-level-up-alt fa-rotate-90 me-1"></i>' + apyaTask.esc(row.parentTaskTitle) + '</div>';
                        }
                        return '<div>' + head + apyaTask.tagChips(row.tags) + '</div>';
                    }
                },
                {
                    title: 'Atanan',
                    data: 'assigneeName',
                    render: function (data) { return apyaTask.assigneeAvatar(data); }
                },
                {
                    title: 'Durum',
                    data: 'status',
                    render: function (data, type, row) {
                        // Özel kolondaysa kolon adını göster (ortak kanban paritesi).
                        if (row.boardColumnName) {
                            return '<span class="apya-chip apya-chip-brand">' + row.boardColumnName + '</span>';
                        }
                        var map = {
                            1: { tone: 'neutral', text: 'Yapılacak' },
                            2: { tone: 'warning', text: 'Sürüyor' },
                            3: { tone: 'brand',   text: 'Testte' },
                            4: { tone: 'positive', text: 'Tamamlandı' },
                            0: { tone: 'negative', text: 'İptal' }
                        };
                        var s = map[data] || { tone: 'neutral', text: 'Bilinmiyor' };
                        return '<span class="apya-chip apya-chip-' + s.tone + '">' + s.text + '</span>';
                    }
                },
                {
                    title: 'Öncelik',
                    data: 'priority',
                    render: function (data) { return apyaTask.priorityBadge(data); }
                },
                {
                    title: 'Başlangıç Tarihi',
                    data: 'startDate',
                    render: function (data) { return data ? moment(data).format('L') : ''; }
                },
                {
                    title: 'Bitiş Tarihi',
                    data: 'dueDate',
                    render: function (data, type, row) { return apyaTask.dueDateChip(data, row.status, row.completedDate); }
                }
            ]
        })
    );

    // --- Kanban (ortak çekirdek: /js/apya-kanban.js) ---
    // Proje board'u: özel kolon + timer + ekle/sil/düzenle hepsi modülden.
    var kb = apya.kanban.create({
        projectId: projectId,
        editModal: editModal,
        showProjectName: false,        // tek proje → kartta proje adı gereksiz
        enableTimer: false,            // zaman sayacı her board'da gizli (kullanıcı kararı)
        enableCustomColumns: true,
        onChanged: function () { if (dataTable) { dataTable.ajax.reload(null, false); } }
    });

    // --- Satıra tıklayınca drawer aç (eski "İşlemler" dropdown'ı kaldırıldı) ---
    $('#ProjectTasksTable tbody').on('click', 'tr', function (e) {
        if ($(e.target).closest('a, button, .form-check-input, input, select').length) return;
        var row = dataTable.row($(this).closest('tr'));
        var rowData = row ? row.data() : null;
        var id = rowData ? rowData.id : $(this).attr('data-id');
        if (id) { editModal.open({ id: id }); }
    });

    // --- 2. Yeni Görev Ekle ---
    $('#btn-create-task').click(function (e) {
        e.preventDefault();
        createModal.open({ projectId: projectId });
    });

    var reviewModal = new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/Drafts/ReviewModal' });

    // --- 2b. AI Görev Oluşturucu (Yeni Arka Plan İşleme Modülü) ---
    var aiTaskModal = new abp.ModalManager({
        viewUrl: abp.appPath + 'Tasks/Drafts/ImportModal',
        modalClass: 'aiTaskImport' // Opsiyonel CSS class
    });

    $('#btn-ai-task-generator').click(function (e) {
        e.preventDefault();
        aiTaskModal.open({ projectId: projectId });
    });

    // APYA-117: SignalR canlı güncelleme. Polling fallback'i de tutuyoruz (SignalR başarısız olursa devreye girer).
    var aiHubClient = null;
    var aiHubReady = false;

    function ensureAiHubClient() {
        if (aiHubClient) return Promise.resolve(aiHubClient);
        if (typeof window.AiHubClient === 'undefined') {
            console.warn('AiHubClient not loaded — falling back to polling.');
            return Promise.reject('hub-unavailable');
        }
        aiHubClient = new window.AiHubClient();
        return aiHubClient.connect().then(function () {
            aiHubReady = true;
            return aiHubClient;
        });
    }

    function showProgressToast(message, type) {
        type = type || 'info';
        if (abp.notify && abp.notify[type]) abp.notify[type](message);
    }

    function openReviewForBatch(batchId, totalItems) {
        showProgressToast('AI ' + totalItems + ' taslak görev üretti. İncelemeye geçiliyor.', 'success');
        setTimeout(function () {
            reviewModal.open({ BatchId: batchId });
        }, 500);
    }

    function startPollingFallback(batchId) {
        var checks = 0;
        var iv = setInterval(function () {
            checks++;
            if (checks > 20) {
                clearInterval(iv);
                abp.notify.error('İşlem zaman aşımına uğradı.');
                return;
            }
            abp.ajax({
                type: 'GET',
                url: '/api/app/draft-task/pending-drafts/' + batchId,
                cache: false
            }).done(function (result) {
                if (result && result.length > 0) {
                    clearInterval(iv);
                    openReviewForBatch(batchId, result.length);
                }
            });
        }, 3000);
    }

    // SignalR event listener — single global handler, multiplexes by batchId
    var subscribedBatches = {};
    document.addEventListener('apya:draft-batch-update', function (e) {
        var d = e.detail;
        if (!subscribedBatches[d.batchId]) return; // not our batch

        switch (d.status) {
            case 'Processing':
                showProgressToast('AI dokümanı analiz ediyor…', 'info');
                break;
            case 'ReadyForReview':
                delete subscribedBatches[d.batchId];
                openReviewForBatch(d.batchId, d.totalItems);
                break;
            case 'Abandoned':
                delete subscribedBatches[d.batchId];
                abp.notify.warning(d.errorMessage || 'AI geçerli görev bulamadı.');
                break;
            case 'Failed':
                delete subscribedBatches[d.batchId];
                abp.notify.error(d.errorMessage || 'AI işleme sırasında hata oluştu.');
                break;
        }
    });

    $(document).on('ai.drafts.batchStarted', function (e, batchId) {
        ensureAiHubClient()
            .then(function (client) {
                subscribedBatches[batchId] = true;
                return client.subscribeToBatch(batchId);
            })
            .then(function () {
                showProgressToast('Canlı bağlantı kuruldu, AI işleminin sonucu beklenecek.', 'info');
            })
            .catch(function () {
                // Hub unavailable → fall back to polling
                startPollingFallback(batchId);
            });
    });

    reviewModal.onResult(function () {
        abp.notify.success('AI görevleri başarıyla oluşturuldu!');
        dataTable.ajax.reload();
        kb.load();
    });

    // --- 3. Modal sonuçları ---
    createModal.onResult(function () {
        abp.notify.success('Görev başarıyla eklendi!');
        dataTable.ajax.reload();
        kb.load();
    });

    // editModal.onResult ortak kanban modülü tarafından bağlanır (load + onChanged
    // → board + datatable yenilenir). Burada tekrar bağlamıyoruz.

    // Otomatik kayıt event'ini dinle:
    abp.event.on('app.task.updated', function () {
        dataTable.ajax.reload(null, false);
        kb.load();
    });

    // --- 4. Projeyi Sil (Danger Zone) ---
    $('#btn-delete-project').click(function () {
        var pId   = $(this).data('project-id');
        var pCode = $(this).data('project-code');

        Swal.fire({
            title: 'Projeyi Silmek Üzeresiniz!',
            html: 'Dikkat! Bu işlem <b>geri alınamaz</b> ve projeye ait tüm görevler silinir.<br><br>Onaylamak için lütfen projenin kodunu (<b>' + pCode + '</b>) aşağıdaki kutuya yazın.',
            icon: 'error',
            input: 'text',
            inputPlaceholder: pCode,
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-exclamation-triangle"></i> Evet, Kalıcı Olarak Sil',
            cancelButtonText: 'Güvenli Bölgeye Dön (İptal)',
            confirmButtonColor: '#dc3545',
            preConfirm: function (inputValue) {
                if (inputValue !== pCode) {
                    Swal.showValidationMessage('Silme işlemini onaylamak için tam olarak "' + pCode + '" yazmalısınız.');
                }
                return inputValue;
            }
        }).then(function (result) {
            if (result.isConfirmed) {
                apya.platform.application.projects.project.delete(pId).then(function () {
                    abp.notify.success('Proje ve bağlı tüm veriler başarıyla silindi.');
                    setTimeout(function () { window.location.href = '/'; }, 1500);
                });
            }
        });
    });

    // --- 5. Tabs & Kanban Gösterimi ---
    // Tab görselleri artık .cshtml'deki #projectViewTabs .nav-link.active CSS'inden
    // gelir (token-tabanlı) — buradaki eski utility-class jonglörlüğü kaldırıldı.

    // Kanban sekmesi Bootstrap tab eventiyle de açılabilir → o durumda da yükle.
    $(document).on('shown.bs.tab', '#board-tab, [data-bs-target="#board-view"]', function () { kb.load(); });

    // --- APYA-143b: Bütçe-vs-Gerçekleşen modalı ---
    var budgetModal = new abp.ModalManager(abp.appPath + 'Projects/BudgetSummaryModal');
    $('#btn-budget-summary').click(function (e) {
        e.preventDefault();
        var pid = $(this).data('project-id');
        if (pid) budgetModal.open({ projectId: pid });
    });
});
