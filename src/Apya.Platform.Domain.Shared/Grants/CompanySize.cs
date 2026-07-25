using System;

namespace Apya.Platform.Grants;

// Bit-maskesi: bir çağrı/program birden çok ölçeği hedefleyebilir.
// KOBİ = Mikro | Kucuk | Orta (UI yardımcı grubu; ayrı değer yok).
[Flags]
public enum CompanySize
{
    Mikro = 1,
    Kucuk = 2,
    Orta = 4,
    Buyuk = 8
}
