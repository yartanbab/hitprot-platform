using System;

namespace Apya.Platform.Tasks
{
    /// <summary>Görev "Proje" seçici için hafif proje listesi öğesi (tenant'ın projeleri).</summary>
    public class ProjectLookupDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;

        /// <summary>Proje kodu — görev konsolundaki filtre etiketi "Ad (KOD)" biçiminde.</summary>
        public string Code { get; set; } = string.Empty;
    }
}
