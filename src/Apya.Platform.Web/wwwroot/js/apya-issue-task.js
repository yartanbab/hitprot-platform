/*
 * Sinyalden göreve köprüsü — panel tarafı.
 *
 * Geri bildirim ve hata detay modallarındaki "Göreve Dönüştür" düğmesini ortak
 * dönüştürme modalına bağlar. Düğme, içinde bulunduğu detay modalını ÖNCE kapatır:
 * iç içe modal yığını backdrop/odak sorunları çıkarıyor, akış da doğal olarak
 * "detaydan göreve geç" şeklinde.
 */
window.apyaIssueTask = (function () {
    var createModal = new abp.ModalManager({
        viewUrl: '/Admin/IssueTasks/CreateTaskModal'
    });

    /**
     * Bir detay modalındaki dönüştürme düğmesini bağlar.
     * @param {abp.ModalManager} sourceModal Düğmeyi barındıran detay modalı.
     */
    function bind(sourceModal) {
        sourceModal.onOpen(function () {
            sourceModal.getModal().find('.issue-task-create').on('click', function () {
                var $btn = $(this);

                var args = { sourceType: $btn.data('source-type') };

                // Kaynak türüne göre yalnız ilgili parametreler taşınır; boş string
                // gönderilirse model binder Guid?'i bağlayamayıp hata veriyor.
                if ($btn.data('source-id')) {
                    args.sourceId = $btn.data('source-id');
                }
                if ($btn.data('source-url')) {
                    args.sourceUrl = $btn.data('source-url');
                    args.windowDays = $btn.data('window-days') || 7;

                    // Uç kimliğinin ikinci yarısı: GET ve POST ayrı arızalardır,
                    // taşınmazsa iki uç tek göreve düşer.
                    if ($btn.data('source-http-method')) {
                        args.sourceHttpMethod = $btn.data('source-http-method');
                    }
                }

                sourceModal.close();
                createModal.open(args);
            });
        });
    }

    /**
     * Görev oluşturulduğunda çalışacak geri çağırım (tabloyu tazelemek için).
     */
    function onCreated(callback) {
        createModal.onResult(function () {
            abp.notify.success('Görev oluşturuldu.');
            if (callback) {
                callback();
            }
        });
    }

    /**
     * Tablo satırı aksiyonundan doğrudan açmak için.
     */
    function open(args) {
        createModal.open(args);
    }

    return { bind: bind, onCreated: onCreated, open: open };
})();
