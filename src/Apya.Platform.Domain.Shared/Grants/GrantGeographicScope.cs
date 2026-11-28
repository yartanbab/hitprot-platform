namespace Apya.Platform.Grants;

/// <summary>
/// Programın coğrafi kapsamı. İl etiketleri boşken "bütün iller" mi yoksa "iller girilmemiş" mi
/// olduğunu ayırır ve il şartının başvurana mı projeye mi koyulduğunu söyler.
/// <para>Eşleştirme (<see cref="GrantEligibilityRule.Region"/>): il gerektiren kapsamda il etiketi yoksa kural
/// ölçülemez döner; <see cref="IllerdeYerlesik"/> kurumun kayıtlı merkez iline bakar, girilmemişse faaliyet
/// illerine.</para>
/// </summary>
public enum GrantGeographicScope
{
    Belirtilmemis = 0,
    TurkiyeGeneli = 1,
    IllerdeYerlesik = 2,
    IllerdeUygulama = 3,
    Uluslararasi = 4
}

public static class GrantGeographicScopeExtensions
{
    /// <summary>Kapsam il listesine bağlı mı.</summary>
    public static bool NeedsProvinces(this GrantGeographicScope scope)
        => scope is GrantGeographicScope.IllerdeYerlesik or GrantGeographicScope.IllerdeUygulama;
}
