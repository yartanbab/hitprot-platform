$(function () {
    var interestSvc = apya.platform.grants.grantInterest;
    var l = abp.localization.getResource('Platform');

    apya.grantIdeaForm.reset();

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
