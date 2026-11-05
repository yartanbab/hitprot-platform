using System.Collections.Generic;
using System.Linq;
using Volo.Abp;

namespace Apya.Platform.Grants;

/// <summary>
/// Kayıtta bölge etiketinin il adı olduğunu doğrular (profil ve program formu). Eşleştirme
/// tanınmayan değeri sessizce yok sayar; kullanıcı ise yazdığının boşa gittiğini bilmeli.
/// Tohum ve onarım yolları buradan GEÇMEZ — eski serbest metin kayıtları bozulmaz.
/// </summary>
public static class ProvinceTagGuard
{
    public static void EnsureKnown(IEnumerable<(GrantCriteriaKind Kind, string? Value)> tags)
    {
        var unknown = tags
            .Where(t => t.Kind == GrantCriteriaKind.Bolge && !string.IsNullOrWhiteSpace(t.Value))
            .Select(t => t.Value!.Trim())
            .FirstOrDefault(v => TurkeyProvinces.Find(v) == null);

        if (unknown != null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantUnknownProvince)
                .WithData("name", unknown);
        }
    }
}
