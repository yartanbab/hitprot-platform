using System;
using System.Security.Cryptography;
using System.Text;

namespace Apya.Platform.Agreements;

/// <summary>
/// Davet jetonunun üretimi ve özetlenmesi.
///
/// <para>🔐 Jeton kriptografik olarak güvenli rastgeleliktir ve veritabanında YALNIZ SHA-256
/// özeti durur. Ham jeton host'a bir kez gösterilir; veritabanı sızsa bile bağlantılar
/// kullanılamaz. Emsal: <c>TaskShareLink</c>.</para>
/// </summary>
public static class InviteToken
{
    /// <summary>Yeni bir ham jeton üretir (URL'de güvenli, ~43 karakter).</summary>
    public static string Generate()
        => Convert.ToBase64String(RandomNumberGenerator.GetBytes(ServiceAgreementConsts.InviteTokenByteLength))
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');

    /// <summary>Aramada ve karşılaştırmada kullanılan özet (küçük harf hex).</summary>
    public static string Hash(string token)
        => Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
}
