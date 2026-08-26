namespace Apya.Platform.Tenants;

/// <summary>
/// Paket kotası dolduğunda atılan <c>BusinessException</c> kodları.
///
/// <para>Sabit olmalarının sebebi: bu kodlar sunucuyla İSTEMCİ arasındaki sözleşmedir.
/// <c>wwwroot/js/apya-quota-upsell.js</c> tam bu kodları tanıyıp düz hata kutusu yerine
/// yükseltme yönlendirmesi gösteriyor. Kod string'i tek yerde durmazsa yeniden
/// adlandırıldığında derleme de test de sessiz kalır, yönlendirme ise canlıda ölür —
/// kullanıcı yine "paketinizi yükseltin" yazan ama gidecek yeri olmayan kutuyu görür.</para>
/// </summary>
public static class PackageQuotaErrorCodes
{
    public const string MaxProjectsReached = "Platform:Error:MaxProjectsReached";

    public const string MaxUsersReached = "Platform:Error:MaxUsersReached";
}
