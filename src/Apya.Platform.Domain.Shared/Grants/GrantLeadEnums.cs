namespace Apya.Platform.Grants;

/// <summary>
/// 5a · Ön değerlendirme talebinin triage durumu.
///
/// <para>Tasarımdaki "Bülten'e al" durumu YOK: bülten aboneliği kurulmadı
/// (bkz. 6d). Düşük ısılı talep <see cref="Takipte"/> olarak kapanır —
/// danışman aranmasına gerek olmayan, firmanın tek başına yapabileceği iş.</para>
/// </summary>
public enum GrantLeadStatus
{
    Yeni = 0,
    Arandi = 1,
    RandevuVerildi = 2,
    MusteriOldu = 3,

    /// <summary>Danışmanlık gerekmiyor; kaydı tutulur, aranmaz.</summary>
    Takipte = 4,

    Kapandi = 5
}

/// <summary>
/// 5a · Talebi "nitelikli" yapan sinyaller. Her biri testin verdiği cevaptan
/// ve çağrının kendi parametrelerinden HESAPLANIR; elle işaretlenmez.
///
/// <para>Tasarımdaki iki sinyal YOK: "ilk başvuru / daha önce reddedilmiş"
/// (ziyaretçi anonim, geçmişi bilinmiyor) ve "resmî metne tıklamış" (tıklama
/// takibi kurulu değil). Uydurmak yerine çıkarıldılar.</para>
/// </summary>
public enum GrantLeadSignal
{
    /// <summary>Yüksek tutarlı çağrı ve konsorsiyum şartı var, ortağı yok.</summary>
    HighAmountNeedsConsortium = 0,

    /// <summary>Son başvuruya az kaldı.</summary>
    DeadlinePressure = 1,

    /// <summary>Birden çok açık çağrının şartlarını karşılıyor.</summary>
    MultipleEligible = 2,

    /// <summary>Cirosu çağrının alt eşiğinin belirgin üstünde.</summary>
    RevenueAboveThreshold = 3,

    /// <summary>Ar-Ge personeli var ama teknoloji olgunluğu düşük.</summary>
    RdStaffLowTrl = 4
}
