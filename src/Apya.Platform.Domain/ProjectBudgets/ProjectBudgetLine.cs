using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Proje bütçesinin bir kalemi ("1. Personel", "3. Ekipman &amp; malzeme").
///
/// <see cref="Projects.Project.TotalBudget"/> tek skalerdir ve olduğu gibi kalır;
/// kalemler onun KIRILIMIDIR. İkisi zorla eşitlenmez — sözleşme bütçesi ile
/// kalemlerin toplamı farklı olabilir (henüz dağıtılmamış tutar, kesinti sonrası
/// açık) ve bu fark ekranda gösterilecek bir bilgidir, bastırılacak bir hata değil.
///
/// HARCANAN/KALAN BURADA TUTULMAZ. Harcanan, kaleme bağlı gider kayıtlarından
/// toplanır (<c>Expense.BudgetLineId</c>); denormalize edilirse ilk tutarsızlıkta
/// hangisinin doğru olduğu bilinemez.
///
/// Kalemler bir AĞAÇTIR (kullanıcı kararı 2026-10-31; 2026-09-01'deki "düz liste"
/// kararının yerine): <see cref="ParentId"/> üst kalemi gösterir. Üst kalem kendi
/// tutarını taşıyabilir; ekran onu kendi tutarı + alt kalemlerin toplamı olarak
/// gösterir. Proje toplamı TÜM kalemlerin kendi tutarlarının toplamıdır, böylece
/// hiçbir tutar çift sayılmaz. Tutarı 0 olan üst kalem fiilen bir kategoridir.
/// </summary>
public class ProjectBudgetLine : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid ProjectId { get; private set; }

    /// <summary>Kalem kodu — donör kodlaması da buraya yazılır. Proje içinde tekildir.</summary>
    public string Code { get; private set; } = null!;

    public string Name { get; private set; } = null!;

    /// <summary>Tablodaki sıra. Kod alfabetik sıralamaya güvenilmez ("10" &lt; "2").</summary>
    public int Order { get; private set; }

    /// <summary>Sözleşmedeki ilk tutar. Revizyon bunu DEĞİŞTİRMEZ — kıyas noktasıdır.</summary>
    public decimal PlannedAmount { get; private set; }

    /// <summary>Yürürlükteki tutar. Bütçe revizyonu yalnız bunu değiştirir.</summary>
    public decimal ApprovedAmount { get; private set; }

    /// <summary>
    /// Kalemler arası aktarım sınırı (donör kuralı, ör. %15). Boşsa sınır yok.
    /// Bu adımda yalnız SAKLANIR ve gösterilir; aktarım akışı henüz yok.
    /// </summary>
    public decimal? TransferLimitPercent { get; private set; }

    /// <summary>
    /// 🔴 FIN-04 · Bu kalem bir hibe başvurusundan dönüştürüldüyse kaynağı olan başvuru
    /// bütçe satırı (<c>GrantApplicationBudgetLine.Id</c>). Projede elle açılan kalemde boştur.
    ///
    /// <para>Dönüşüm kalemi KOPYALAR; bu alan olmadan kopya kaynağını unutuyordu ve
    /// başvurudaki tutar değişince hangi proje kaleminin bayatladığı bilinemiyordu.</para>
    ///
    /// <para>Bilerek FK DEĞİL: başvuru satırı silinse de proje bütçesi durmalı, bağ o
    /// zaman denetim izi olarak kalır (aynı karar: <c>GrantApplication.ProjectId</c>).</para>
    /// </summary>
    public Guid? SourceGrantLineId { get; private set; }

    /// <summary>
    /// CNV-04: kalemin gerekçesi. Hibe başvurusundan dönüşen projede başvurunun bütçe
    /// satırındaki gerekçe buraya taşınır; firma aynı metni projede yeniden yazmaz.
    /// </summary>
    public string? Justification { get; private set; }

    /// <summary>
    /// Üst kalem (aynı projede). Boşsa ana kalemdir. Döngü ve derinlik kuralı
    /// <see cref="ProjectBudgetManager"/>'da: tek kalem kendi başına bilemez.
    /// Bilerek FK DEĞİL — kalemler soft-delete ile silinir, FK onu engellemez;
    /// alt kalemi olan kalemin silinmesini manager reddeder.
    /// </summary>
    public Guid? ParentId { get; private set; }

    /// <summary>
    /// Kalemin hibeden karşılanan kısmı — ELLE girilmişse. Boşsa projenin destek
    /// oranından hesaplanır (bkz. <see cref="GetGrantShare"/>), böylece revizyon
    /// tutarı değiştirdiğinde pay kendiliğinden güncellenir. Kurum payı SAKLANMAZ:
    /// onaylanan − hibe payı.
    /// </summary>
    public decimal? GrantAmount { get; private set; }

    /// <summary>EF Core için.</summary>
    protected ProjectBudgetLine()
    {
    }

    public ProjectBudgetLine(
        Guid id,
        Guid? tenantId,
        Guid projectId,
        string code,
        string name,
        decimal plannedAmount,
        decimal approvedAmount,
        int order = 0,
        decimal? transferLimitPercent = null)
        : base(id)
    {
        TenantId = tenantId;
        ProjectId = projectId;
        SetCode(code);
        SetName(name);
        SetAmounts(plannedAmount, approvedAmount);
        Order = order;
        SetTransferLimit(transferLimitPercent);
    }

    /// <summary>Kalemin doğduğu başvuru bütçe satırını kaydeder (dönüşüm ve geri dolum).</summary>
    public void LinkToGrantLine(Guid grantLineId) => SourceGrantLineId = grantLineId;

    public void SetJustification(string? justification)
    {
        var clean = justification?.Trim();
        Justification = string.IsNullOrEmpty(clean)
            ? null
            : clean.Length > ProjectBudgetConsts.MaxJustificationLength
                ? clean[..ProjectBudgetConsts.MaxJustificationLength]
                : clean;
    }

    public void SetCode(string? code)
    {
        var clean = (code ?? string.Empty).Trim();
        Code = clean.Length > ProjectBudgetConsts.MaxCodeLength
            ? clean[..ProjectBudgetConsts.MaxCodeLength]
            : clean;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.BudgetLineNameRequired);

        var clean = name.Trim();
        Name = clean.Length > ProjectBudgetConsts.MaxNameLength
            ? clean[..ProjectBudgetConsts.MaxNameLength]
            : clean;
    }

    public void SetAmounts(decimal plannedAmount, decimal approvedAmount)
    {
        if (plannedAmount < 0 || approvedAmount < 0)
            throw new BusinessException(PlatformDomainErrorCodes.BudgetLineAmountInvalid)
                .WithData("PlannedAmount", plannedAmount)
                .WithData("ApprovedAmount", approvedAmount);

        PlannedAmount = plannedAmount;
        ApprovedAmount = approvedAmount;
    }

    public void SetTransferLimit(decimal? percent)
    {
        if (percent.HasValue && (percent.Value < 0 || percent.Value > 100))
            throw new BusinessException(PlatformDomainErrorCodes.BudgetTransferLimitInvalid)
                .WithData("TransferLimitPercent", percent);

        TransferLimitPercent = percent;
    }

    public void SetOrder(int order) => Order = order;

    /// <summary>Yalnız <see cref="ProjectBudgetManager"/> çağırmalı — döngü/derinlik orada denetlenir.</summary>
    internal void SetParent(Guid? parentId) => ParentId = parentId;

    /// <summary>
    /// Hibe payını elle sabitler; boş değer "destek oranından hesapla" demektir.
    /// Onaylanan tutardan büyük olamaz — kurum payı eksiye düşerdi.
    /// </summary>
    public void SetGrantAmount(decimal? grantAmount)
    {
        if (grantAmount.HasValue && (grantAmount.Value < 0 || grantAmount.Value > ApprovedAmount))
            throw new BusinessException(PlatformDomainErrorCodes.BudgetLineGrantAmountInvalid)
                .WithData("ApprovedAmount", ApprovedAmount.ToString("N2"))
                .WithData("GrantAmount", grantAmount.Value.ToString("N2"));

        GrantAmount = grantAmount;
    }

    /// <summary>
    /// Hibeden karşılanan tutar. Elle girilen pay önceliklidir; sonradan bir revizyon
    /// onaylanan tutarı payın altına indirdiyse pay onaylanana kırpılır (kurum payı
    /// eksiye düşmez). Elle pay da oran da yoksa <c>null</c> — "bilinmiyor", 0 değil.
    /// </summary>
    public decimal? GetGrantShare(decimal? supportRatePercent)
    {
        if (GrantAmount.HasValue)
            return Math.Min(GrantAmount.Value, ApprovedAmount);

        if (supportRatePercent.HasValue)
            return Math.Round(ApprovedAmount * supportRatePercent.Value / 100m, 2, MidpointRounding.AwayFromZero);

        return null;
    }

    /// <summary>
    /// Onaylanan tutarı revizyonla değiştirir. Yalnız <see cref="ProjectBudgetManager"/>
    /// çağırmalı — revizyon kaydı üretmeden tutar değiştirmek geçmişi koparır.
    /// </summary>
    internal void ApplyRevisedAmount(decimal newAmount)
    {
        if (newAmount < 0)
            throw new BusinessException(PlatformDomainErrorCodes.BudgetRevisionAmountInvalid)
                .WithData("NewAmount", newAmount);

        ApprovedAmount = newAmount;
    }
}
