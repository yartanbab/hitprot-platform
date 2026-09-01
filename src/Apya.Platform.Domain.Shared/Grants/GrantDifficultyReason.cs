namespace Apya.Platform.Grants;

/// <summary>
/// 1e · Başvuru zorluğunu yükselten etkenler. Zorluk skoru bunların sayısından türetilir
/// (bkz. <see cref="GrantDifficultyCalculator"/>); metinleri istemci yerelleştirir.
/// </summary>
public enum GrantDifficultyReason
{
    /// <summary>Çok sayıda zorunlu belge.</summary>
    ManyDocuments = 0,

    /// <summary>En az bir belge e-imza/noter ister.</summary>
    ESignature = 1,

    /// <summary>Konsorsiyum/ortaklık şartı var.</summary>
    Consortium = 2,

    /// <summary>Uzun süreç: çok aşamalı şablon ya da uzun proje süresi.</summary>
    ComplexProcess = 3,

    /// <summary>Son başvuruya az zaman kaldı.</summary>
    DeadlinePressure = 4
}
