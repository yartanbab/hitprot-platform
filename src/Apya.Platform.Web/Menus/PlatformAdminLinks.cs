using System.Collections.Generic;
using Apya.Platform.Permissions;
using Volo.Abp.Identity;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Web.Menus;

/// <summary>
/// Yönetim hedeflerinin kataloğu — eski YÖNETİM menü bölümünün gittiği yer
/// (kabuk handoff'u 2026-08-13). Varsayılan konumları Ayarlar sayfasıdır;
/// kullanıcı menü düzeninden birini kenar çubuğuna alabilir.
///
/// Liste burada duruyor çünkü İKİ yüzey de aynı kaynağı okumak zorunda:
/// Ayarlar sayfasının bağlantı listesi ve kenar çubuğunun "Yönetim" grubu.
/// Daha önce liste yalnız Settings/Index.cshtml.cs içindeydi ve menüye
/// taşınamıyordu.
/// </summary>
public static class PlatformAdminLinks
{
    /// <summary>
    /// Menü ADI, düzen ayarında saklanan kimliktir — ETİKET DEĞİL. Adlarda alt
    /// çizgi KULLANILMAZ: LeptonX `id="MenuItem_Apya_Admin_Tenants"` basıyor ve
    /// apya-sidebar-shell.js `_` → `.` çevirisiyle adı geri okuyor.
    /// </summary>
    /// <param name="Name">Kararlı menü adı (düzen ayarındaki kimlik).</param>
    /// <param name="PermissionName">Bu hedefi görebilmek için gereken izin.</param>
    /// <param name="TitleKey">PlatformResource yerelleştirme anahtarı — başlık.</param>
    /// <param name="DescriptionKey">PlatformResource yerelleştirme anahtarı — Ayarlar listesindeki açıklama.</param>
    /// <param name="TenantOnly">
    /// Yalnız kiracı bağlamında gösterilir. Host'un paketi yoktur (her şey açıktır), bu yüzden
    /// "Paketim" gibi hedefler host'ta izin yeterli olsa bile basılmamalıdır.
    /// </param>
    /// <param name="Group">
    /// Ayarlar sayfasında bir başlık altında toplanacaksa grubu. Grup, içine görünür bir
    /// bağlantı düştüğünde doğar — izni olmayan kullanıcıda boş başlık basılmaz.
    /// </param>
    public record AdminLinkDefinition(
        string Name,
        string PermissionName,
        string TitleKey,
        string DescriptionKey,
        string Url,
        string Icon,
        bool TenantOnly = false,
        AdminLinkGroup? Group = null);

    /// <summary>Ayarlar sayfasındaki başlık. Ad, bağlantı adlarıyla aynı kurala uyar (alt çizgi yok).</summary>
    public record AdminLinkGroup(string Name, string TitleKey, string Icon);

    /// <summary>Tur 22 · Hibe modülünün günlük işte açılmayan ekranları.</summary>
    public static readonly AdminLinkGroup Grants = new("Apya.Admin.Grants", "Menu:Settings:Grants", "fa fa-award");

    public static readonly IReadOnlyList<AdminLinkDefinition> All = new List<AdminLinkDefinition>
    {
        new("Apya.Admin.Tenants", TenantManagementPermissions.Tenants.Default,
            "Menu:TenantManagement", "Settings:Admin.Tenants.Desc",
            "/TenantManagement/Tenants", "fa fa-building"),

        new("Apya.Admin.Users", IdentityPermissions.Users.Default,
            "Menu:IdentityUsers", "Settings:Admin.Users.Desc",
            "/Identity/Users", "fa fa-users"),

        new("Apya.Admin.Roles", IdentityPermissions.Roles.Default,
            "Menu:IdentityRoles", "Settings:Admin.Roles.Desc",
            "/Identity/Roles", "fa fa-user-shield"),

        // ABP'nin kendi Ayar Yönetimi ekranı (e-posta vb.) — modülün menü
        // contributor'ı da bu izne bakıyor, aynı kapı kullanılır.
        new("Apya.Admin.SettingManagement", SettingManagementPermissions.Emailing,
            "Menu:SettingManagement", "Settings:Admin.SettingManagement.Desc",
            "/SettingManagement", "fa fa-envelope"),

        // Paket Yönetimi + Tasarım Sistemi aynı kapıyı (Tenants.Update) kullanır —
        // yeni permission tanımlamamak için bilinçli tercih, tenant'ta görünmez.
        new("Apya.Admin.Packages", TenantManagementPermissions.Tenants.Update,
            "Menu:PackageManagement", "Settings:Admin.Packages.Desc",
            "/PackageManagement", "fa fa-box-open"),

        new("Apya.Admin.DesignSystem", TenantManagementPermissions.Tenants.Update,
            "Menu:DesignSystem", "Settings:Admin.DesignSystem.Desc",
            "/DesignSystem", "fa fa-palette"),

        new("Apya.Admin.Feedback", PlatformPermissions.Feedbacks.Default,
            "Menu:FeedbackAdmin", "Settings:Admin.Feedback.Desc",
            "/Admin/Feedback", "fa fa-inbox"),

        new("Apya.Admin.FeedbackSettings", PlatformPermissions.Feedbacks.ManageSettings,
            "Menu:FeedbackSettings", "Settings:Admin.FeedbackSettings.Desc",
            "/Admin/Feedback/Settings", "fa fa-sliders"),

        new("Apya.Admin.LoginScreen", PlatformPermissions.LoginScreen.Default,
            "Menu:LoginScreen", "Settings:Admin.LoginScreen.Desc",
            "/Admin/LoginScreen", "fa fa-right-to-bracket"),

        // Kiracının KENDİ paketi. Host'un paket yönetim ekranıyla karıştırılmasın:
        // bu salt okunurdur ve TenantSettings kapısını kullanır — Basic dahil her
        // pakette açıktır (izin hiçbir feature kapısının arkasında değil), yoksa
        // yükseltme çağrısı tam da onu görmesi gerekene kapalı kalırdı.
        new("Apya.Admin.Subscription", PlatformPermissions.TenantSettings.Default,
            "Menu:Subscription", "Settings:Admin.Subscription.Desc",
            "/Subscription", "fa fa-gem", TenantOnly: true),

        // Kurumun kimlik/iletişim bilgisi. Sayfanın kendisi her kurum kullanıcısına açık
        // (avatar menüsünden gelinir); buradaki kart düzenleme yetkisi olan yöneticiye.
        new("Apya.Admin.CompanyProfile", PlatformPermissions.TenantSettings.Default,
            "Menu:CompanyProfile", "Settings:Admin.CompanyProfile.Desc",
            "/CompanyProfile", "fa fa-building", TenantOnly: true),

        // Hibe · aşama ve bildirim şablonları eskiden hibe menüsündeydi. YENİ adla doğarlar:
        // eski ad (Apya.Grants.*) kayıtlı menü düzeninde kalsaydı öğe kenar çubuğunda kalırdı.
        // Grants.Edit host tarafında tanımlı → kiracıda ikisi de, dolayısıyla grup da basılmaz.
        new("Apya.Admin.GrantStageTemplates", PlatformPermissions.Grants.Edit,
            "Menu:Grants:StageTemplates", "Settings:Admin.GrantStageTemplates.Desc",
            "/Grants/StageTemplates", "fa fa-diagram-project", Group: Grants),

        new("Apya.Admin.GrantNotificationTemplates", PlatformPermissions.Grants.Edit,
            "Menu:Grants:NotificationTemplates", "Settings:Admin.GrantNotificationTemplates.Desc",
            "/Grants/NotificationTemplates", "fa fa-bell", Group: Grants)
    };
}
