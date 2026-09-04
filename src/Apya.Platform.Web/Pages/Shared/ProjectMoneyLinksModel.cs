using System;

namespace Apya.Platform.Web.Pages.Shared;

/// <summary>
/// <c>_ProjectMoneyLinks</c> partial'ının modeli: bir projenin para ve belge
/// ekranlarına giden bağlantı üçlüsü.
///
/// Çağıranın yalnız <see cref="ProjectId"/> vermesi yeter; hedef adresler
/// partial'da tek yerde durur ki üç giriş noktası (konsol şeridi, ⋯ menüsü,
/// proje listesi) farklı sekmelere gitmesin.
/// </summary>
public class ProjectMoneyLinksModel
{
    public Guid ProjectId { get; set; }

    /// <summary>"Bütçe durumu" (modal) öğesi de basılsın mı — liste tarafında basılmaz.</summary>
    public bool IncludeStatusModal { get; set; }

    /// <summary>Belge bağlantısı yalnız <c>Documents.Default</c> yetkisi varken basılır.</summary>
    public bool CanViewDocuments { get; set; }
}
