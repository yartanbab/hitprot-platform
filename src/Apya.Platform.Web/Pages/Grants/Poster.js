// 12b · Hibe afişinin tek kaynağı. Kiracı kartı (Tenant.js) ve host parametre formundaki
// önizleme (Parameters.js) aynı zemini çizer; host yüklemeden önce kiracının göreceğini görür.
(function () {
    // Afiş yoksa ton kurum adından türer: aynı kurum her kartta aynı renk. Açıklık %34/%22
    // sabit — beyaz metin her tonda 4,5:1'in üstünde kalır (360 ton ölçüldü, en kötü 12,2:1).
    function issuerHue(name) {
        var h = 0;
        for (var i = 0; i < (name || '').length; i++) { h = (h * 31 + name.charCodeAt(i)) % 360; }
        return h;
    }

    function url(fileName) {
        // Saklanan ad Guid + uzantıdır; yine de tırnak kaçırılır — değer style="" içine yazılıyor.
        return fileName ? '/file/get/' + encodeURIComponent(fileName).replace(/'/g, '%27') : null;
    }

    window.apyaGrantPoster = {
        url: url,
        style: function (issuer, fileName) {
            if (fileName) { return "background-image:url('" + url(fileName) + "')"; }
            var h = issuerHue(issuer);
            return 'background-image:linear-gradient(135deg,hsl(' + h + ' 48% 34%),hsl(' + ((h + 32) % 360) + ' 55% 22%))';
        }
    };
})();
