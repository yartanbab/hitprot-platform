/* jQuery 3.5+ Uyumluluk Yaması - LeptonX */
(function($) {
    if (!$) return;

    // 1. $.parseJSON yaması
    if (typeof $.parseJSON === 'undefined') {
        $.parseJSON = function (json) {
            return JSON.parse(json);
        };
    }

    // 2. $.trim yaması
    if (typeof $.trim === 'undefined') {
        $.trim = function(str) {
            return str == null ? "" : String.prototype.trim.call(str);
        };
    }

    // 3. $.isFunction yaması
    if (typeof $.isFunction === 'undefined') {
        $.isFunction = function(obj) {
            return typeof obj === 'function';
        };
    }

    // 4. $.isArray yaması (ŞU AN ALDIĞINIZ HATANIN ÇÖZÜMÜ)
    if (typeof $.isArray === 'undefined') {
        $.isArray = function(obj) {
            return Array.isArray(obj);
        };
    }

    // 5. $.isWindow yaması
    if (typeof $.isWindow === 'undefined') {
        $.isWindow = function(obj) {
            return obj != null && obj === obj.window;
        };
    }

    // 6. $.isNumeric yaması (Olası gelecek hatayı önlemek için)
    if (typeof $.isNumeric === 'undefined') {
        $.isNumeric = function(obj) {
            var type = typeof obj;
            return (type === "number" || type === "string") && 
                   !isNaN(obj - parseFloat(obj));
        };
    }

})(jQuery);