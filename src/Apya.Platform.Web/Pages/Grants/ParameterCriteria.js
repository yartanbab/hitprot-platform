// Program ölçütü: evet/hayır parametresinde değer serbest metin yerine Evet/Hayır seçim kutusudur.
// Parametre değişince doğru alan açılır, diğeri kapanır (kapalı alan gönderilmez). Evet/hayırda
// yalnız "eşittir" anlamlıdır; karşılaştırma ona çekilir.
(function () {
    var parameter = document.getElementById('GcParameter');
    var text = document.querySelector('[data-criterion-value="text"]');
    var yesNo = document.querySelector('[data-criterion-value="yesno"]');
    var operator = document.getElementById('GcOperator');
    var label = document.getElementById('GcValueLabel');
    if (!parameter || !text || !yesNo) {
        return;
    }

    function sync() {
        var option = parameter.options[parameter.selectedIndex];
        var isYesNo = !!option && option.getAttribute('data-type') === 'Boolean';

        text.disabled = isYesNo;
        text.classList.toggle('d-none', isYesNo);
        yesNo.disabled = !isYesNo;
        yesNo.classList.toggle('d-none', !isYesNo);
        if (label) {
            label.setAttribute('for', isYesNo ? yesNo.id : text.id);
        }
        if (isYesNo && operator) {
            operator.value = 'Esit';
        }
    }

    parameter.addEventListener('change', sync);
})();
