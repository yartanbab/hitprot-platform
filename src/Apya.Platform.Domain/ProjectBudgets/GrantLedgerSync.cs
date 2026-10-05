using Apya.Platform.Grants;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// 🔴 CNV-01 / FIN-04 · Dönüşümün KOPYALADIĞI iki defterin birbirini tutup tutmadığı.
///
/// <para>Dönüşüm hibe dilimini ve bütçe satırını projeye kopyalar; iki kayıt ondan sonra
/// ayrı yaşar. Hibe tarafında "Ödendi" işaretlenen dilim proje gelir planında "Bekliyor"
/// kalır ve iki ekran çelişir — ama çelişkiyi hiçbir ekran SÖYLEMEZDİ.</para>
///
/// <para>Bu sınıf yalnız FARKI söyler. Hangi kaydın doğruluk kaynağı olacağına karar
/// VERMEZ ve hiçbir kaydı değiştirmez: o bir ürün kararı (tahsilatı otomatik gelir kaydı
/// mı doğursun, yoksa proje tarafındaki tahsilat mı hibe dilimini kapatsın).</para>
/// </summary>
public static class GrantLedgerSync
{
    /// <summary>
    /// Hibe dilimi ile ondan doğan proje fon dilimi çelişiyor mu.
    ///
    /// <para>İki yön de sayılır: hibe "Ödendi" ama projede tam tahsilat yok; ya da projeye
    /// para girmiş (kısmen bile) ama hibe tarafı hâlâ ödenmemiş diyor.</para>
    ///
    /// <para><see cref="FundingTrancheStatus.Disputed"/>: hibe ÖDENMEMİŞKEN itiraz çelişki
    /// sayılmaz (itiraz bir süreç bilgisidir, para hareketi değil). Hibe "Ödendi" ise
    /// sayılır — biri "tamamı geldi" diyor, diğeri eksik geldiğine itiraz ediyor.</para>
    /// </summary>
    public static bool IsTrancheOutOfSync(
        GrantDisbursementTrancheStatus grantStatus, FundingTrancheStatus projectStatus)
    {
        var grantPaid = grantStatus == GrantDisbursementTrancheStatus.Odendi;

        return grantPaid
            ? projectStatus != FundingTrancheStatus.Collected
            : projectStatus is FundingTrancheStatus.Collected or FundingTrancheStatus.PartiallyCollected;
    }

    /// <summary>
    /// Proje kalemi doğduğu başvuru satırına göre bayat mı.
    ///
    /// <para>Kıyas projenin <c>PlannedAmount</c>'ı iledir, <c>ApprovedAmount</c> ile DEĞİL:
    /// onaylanan tutar bütçe revizyonuyla meşru olarak değişir; planlanan tutar ise
    /// sözleşmedeki ilk tutardır ve dönüşüm anında başvurudan kopyalanmıştır. İkisi
    /// ayrıştıysa başvurudaki tutar dönüşümden SONRA değişmiş demektir.</para>
    /// </summary>
    public static bool IsBudgetLineStale(decimal grantAmount, decimal projectPlannedAmount)
        => grantAmount != projectPlannedAmount;
}
