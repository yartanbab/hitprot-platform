$(function () {
    var docService = apya.platform.documents.document;
    var currentDocId = null;
    var allDocs = [];

    // ── Load tree ──────────────────────────────────────────────────────────
    function loadTree(filterText) {
        docService.getList({ maxResultCount: 1000, filterText: filterText || null }).then(function (result) {
            allDocs = result.items;
            renderTree(allDocs);
        });
    }

    function renderTree(docs) {
        var $tree = $('#DocTree').empty();
        var roots = docs.filter(function (d) { return !d.parentDocumentId; });
        roots.forEach(function (doc) {
            $tree.append(buildTreeItem(doc, docs, 0));
        });
        if (roots.length === 0) {
            $tree.html('<p class="text-muted small text-center mt-4">Henüz belge yok.</p>');
        }
    }

    function buildTreeItem(doc, allDocs, depth) {
        var children = allDocs.filter(function (d) { return d.parentDocumentId === doc.id; });
        var icon = doc.icon || '📄';
        var $item = $('<div class="doc-item" data-id="' + doc.id + '">' +
            '<span class="me-1">' + icon + '</span> ' + escapeHtml(doc.title) + '</div>');
        $item.css('padding-left', (12 + depth * 16) + 'px');

        var $wrap = $('<div></div>').append($item);
        if (children.length > 0) {
            var $sub = $('<div class="doc-sub-list"></div>');
            children.forEach(function (child) {
                $sub.append(buildTreeItem(child, allDocs, depth + 1));
            });
            $wrap.append($sub);
        }
        return $wrap;
    }

    // ── Select doc ─────────────────────────────────────────────────────────
    $(document).on('click', '.doc-item', function () {
        var id = $(this).data('id');
        selectDoc(id);
    });

    function selectDoc(id) {
        currentDocId = id;
        $('.doc-item').removeClass('active');
        $('.doc-item[data-id="' + id + '"]').addClass('active');

        docService.get(id).then(function (doc) {
            $('#CurrentDocIcon').text(doc.icon || '📄');
            $('#CurrentDocTitle').text(doc.title);
            $('#DocBodyDisplay').html(doc.content || '<em class="text-muted">İçerik yok.</em>');
            $('#WikiWelcome').hide();
            $('#DocEditPanel').hide();
            $('#DocViewPanel').css('display', 'flex');
        });
    }

    // ── Edit ───────────────────────────────────────────────────────────────
    $('#EditBtn').on('click', function () {
        if (!currentDocId) return;
        var doc = allDocs.find(function (d) { return d.id === currentDocId; });
        if (!doc) return;

        $('#EditDocIcon').val(doc.icon || '📄');
        $('#EditDocTitle').val(doc.title);
        $('#EditDocContent').val(doc.content || '');
        $('#DocViewPanel').hide();
        $('#DocEditPanel').css('display', 'flex');
    });

    $('#CancelEditBtn').on('click', function () {
        $('#DocEditPanel').hide();
        $('#DocViewPanel').css('display', 'flex');
    });

    $('#SaveDocBtn').on('click', function () {
        if (!currentDocId) return;
        var doc = allDocs.find(function (d) { return d.id === currentDocId; });
        docService.update(currentDocId, {
            title: $('#EditDocTitle').val(),
            content: $('#EditDocContent').val(),
            icon: $('#EditDocIcon').val(),
            projectId: doc ? doc.projectId : null,
            parentDocumentId: doc ? doc.parentDocumentId : null
        }).then(function () {
            abp.notify.success('Belge kaydedildi.');
            loadTree();
            selectDoc(currentDocId);
            $('#DocEditPanel').hide();
            $('#DocViewPanel').css('display', 'flex');
        });
    });

    // ── Delete ─────────────────────────────────────────────────────────────
    $('#DeleteBtn').on('click', function () {
        if (!currentDocId) return;
        abp.message.confirm('Bu belgeyi silmek istiyor musunuz?', 'Belge Sil').then(function (confirmed) {
            if (!confirmed) return;
            docService.delete(currentDocId).then(function () {
                abp.notify.info('Belge silindi.');
                currentDocId = null;
                loadTree();
                $('#DocViewPanel').hide();
                $('#WikiWelcome').show();
            });
        });
    });

    // ── Create root doc ────────────────────────────────────────────────────
    $('#NewRootDocBtn').on('click', function () {
        createDocPrompt(null);
    });

    function createDocPrompt(parentId) {
        Swal.fire({
            title: 'Yeni Belge',
            html: '<input id="swal-title" class="swal2-input" placeholder="Belge başlığı">' +
                  '<input id="swal-icon" class="swal2-input" placeholder="İkon (emoji, örn: 📋)" maxlength="10">',
            showCancelButton: true,
            confirmButtonText: 'Oluştur',
            cancelButtonText: 'Vazgeç',
            preConfirm: function () {
                var title = document.getElementById('swal-title').value.trim();
                if (!title) { Swal.showValidationMessage('Başlık boş bırakılamaz.'); return false; }
                return { title: title, icon: document.getElementById('swal-icon').value.trim() || null };
            }
        }).then(function (result) {
            if (!result.isConfirmed) return;
            docService.create({
                title: result.value.title,
                icon: result.value.icon,
                content: '',
                parentDocumentId: parentId
            }).then(function (doc) {
                abp.notify.success('Belge oluşturuldu.');
                loadTree();
                selectDoc(doc.id);
            });
        });
    }

    // ── Search ─────────────────────────────────────────────────────────────
    var searchTimer;
    $('#TreeSearch').on('input', function () {
        clearTimeout(searchTimer);
        var q = $(this).val().trim();
        searchTimer = setTimeout(function () { loadTree(q); }, 300);
    });

    // ── Helpers ────────────────────────────────────────────────────────────
    function escapeHtml(str) {
        return $('<div>').text(str || '').html();
    }

    // ── Init ───────────────────────────────────────────────────────────────
    loadTree();
});
