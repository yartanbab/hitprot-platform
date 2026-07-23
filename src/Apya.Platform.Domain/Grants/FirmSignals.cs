using System.Collections.Generic;

namespace Apya.Platform.Grants;

/// <summary>
/// Eşleştirici girdisi (genişletilebilir). Faz B1: elle profil sinyalleri.
/// Faz B2: proje sinyalleri eklenecek (tipik bütçe, baskın kategori, aktif proje sayısı) —
/// yalnız buraya alan + GrantMatchManager.Score'a boyut eklenir, imza kırılmaz.
/// </summary>
public sealed class FirmSignals
{
    public CompanySize? Size { get; set; }
    public IReadOnlyList<FirmSignalTag> Tags { get; set; } = new List<FirmSignalTag>();
}

public sealed record FirmSignalTag(GrantCriteriaKind Kind, string Value);
