namespace Apya.Platform.Grants;

/// <summary>
/// Platformda hesabı olmayan başvuru sahibi türleri. Programın <c>ExternalApplicantTypes</c> bit maskesinde
/// tutulur; kurum profilindeki <see cref="OrganizationType"/>'tan AYRIDIR ve eşleştirmeye girmez. Karma
/// çağrılarda (şirket + üniversite) kimin başvurabildiğini, platforma kapalı çağrıda kime açık olduğunu anlatır.
/// </summary>
public enum ExternalApplicantType
{
    Universite = 0,
    KamuKurumu = 1,
    Belediye = 2,
    OdaBorsa = 3,
    Sendika = 4,
    ArastirmaMerkezi = 5,
    Okul = 6,
    GercekKisi = 7
}

public static class ExternalApplicantTypeExtensions
{
    public static int ToMaskBit(this ExternalApplicantType type) => 1 << (int)type;
}
