using System;

namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// K-02 · Adaya postada verilen ve host panelinde talebin yanında görünen kısa referans:
/// "KT-" + kimliğin ilk 8 hanesi. Aday yazışırken bu numarayı verir, host listede bulur.
/// </summary>
public static class RegistrationRequestReference
{
    public const string Prefix = "KT-";

    public static string Of(Guid id) => Prefix + id.ToString("N")[..8].ToUpperInvariant();
}
