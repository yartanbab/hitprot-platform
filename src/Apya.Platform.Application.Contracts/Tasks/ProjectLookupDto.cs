using System;

namespace Apya.Platform.Tasks
{
    /// <summary>Görev "Proje" seçici için hafif proje listesi öğesi (tenant'ın projeleri).</summary>
    public class ProjectLookupDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
