namespace Apya.Platform.Grants;

/// <summary>
/// 9a · Kiracının bir çağrıya göre durduğu yer. Katalogda hiçbir açık çağrı gizlenmez;
/// kovalar yalnız SIRALAR ve gerekçelendirir.
/// </summary>
public enum GrantEligibilityBucket
{
    /// <summary>Tüm şartlar KANITLI biçimde sağlanıyor.</summary>
    Uygun = 0,

    /// <summary>Eleyen şart yok ama bazı şartlar firma verisi eksik olduğu için ölçülemiyor.</summary>
    Kosullu = 1,

    /// <summary>En az bir şart açıkça sağlanmıyor.</summary>
    UygunDegil = 2
}
