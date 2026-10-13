$(function () {
    var interestSvc = apya.platform.grants.grantInterest;
    var l = abp.localization.getResource('Platform');
    // Salt-okur kullanıcı (yalnız görme izni) yazma denetimlerini görmez; sunucu yazmayı zaten
    // reddeder. Firma: ManageApplications, danışman: Edit — ikisi taraf-özeldir, biri yeter.
    var canWrite = abp.auth.isGranted('Platform.Grants.ManageApplications') || abp.auth.isGranted('Platform.Grants.Edit');
    // Bu sayfa yalnız yazma içindir: izin yoksa form kapatılır ve nedeni söylenir.
    if (!canWrite) {
        $('#IdeaForm').find('input, textarea, select, button[type=submit]').prop('disabled', true);
        $('#IdeaForm').prepend($('<div class="alert alert-warning m-3 mb-0" role="note"></div>').text(l('Grants:ReadOnly:Notice')));
    }

    apya.grantIdeaForm.reset();

    // 19b · Davet bildirimi /Grants/Invitation üzerinden ?invitation=<id> ile getirir. Davet bulunamazsa (başka
    // firmanın ya da silinmiş) form yine çalışır: not gösterilmez, hata penceresi açılmaz.
    var invitationId = new URLSearchParams(window.location.search).get('invitation');
    if (invitationId) {
        interestSvc.getInvitation(invitationId, { abpHandleError: false }).then(function (inv) {
            var date = new Date(inv.sentAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
            $('#InvitationFrom').text(l('Grants:Invite:Banner', date));
            $('#InvitationMessage').text(inv.message);
            $('#InvitationNote').removeClass('d-none');
        });
    }

    $('#IdeaForm').on('submit', function (e) {
        e.preventDefault();
        if (!apya.grantIdeaForm.validate()) {
            // Form uzun; boş kalan zorunlu soru ekranın dışında olabilir.
            $('#IdeaForm .is-invalid').first().trigger('focus');
            return;
        }

        var $submit = $(this).find('button[type=submit]').prop('disabled', true);
        interestSvc.shareIdea(apya.grantIdeaForm.read())
            .then(function () {
                abp.notify.success(l('Grants:Idea:Shared'));
                // Fikir yolculukta "fikir havuzunda" satırı olarak görünür.
                window.location.href = '/Grants/Journey';
            }, function () {
                $submit.prop('disabled', false);
            });
    });
});
