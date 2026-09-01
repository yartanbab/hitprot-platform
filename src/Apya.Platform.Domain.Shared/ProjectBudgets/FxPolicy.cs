namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Bir kaydın donör para birimi karşılığının HANGİ GÜNÜN kuruyla hesaplanacağı.
///
/// Politika yalnız kur SEÇİMİNİ belirler; kurun kendisi her zaman mevcut
/// <c>ExchangeRate</c> kayıtlarından gelir — paralel bir kur mekanizması yok.
///
/// Donör karşılığı kayıt oluşurken hesaplanır ve KİLİTLENİR. Politika sonradan
/// değişirse kilitli kayıtlar kendiliğinden değişmez; önce etkilenenler listelenir,
/// sonra açıkça yeniden hesaplanır.
/// </summary>
public enum FxPolicy
{
    /// <summary>Harcama/gelir gününün kuru. Varsayılan; ek veri istemez.</summary>
    SpendDate = 0,

    /// <summary>
    /// Diliminin tahsil edildiği günün kuru. Donör açısından en doğru olan:
    /// para o gün geldiyse, o günün kuruyla raporlanır. Projede tahsil edilmiş
    /// dilim yoksa harcama günü kuruna düşer.
    /// </summary>
    TrancheDate = 1,

    /// <summary>
    /// Donörün o ay için yayımladığı kur (InforEuro tipi). Ay içindeki tüm
    /// kayıtlar aynı kuru kullanır — kayıt ayının en güncel kuru seçilir.
    /// </summary>
    MonthlyDonor = 2,

    /// <summary>
    /// Sözleşmede yazan sabit kur. Kur hiç sorgulanmaz;
    /// <c>Project.FixedDonorRate</c> kullanılır.
    /// </summary>
    FixedContract = 3,
}
