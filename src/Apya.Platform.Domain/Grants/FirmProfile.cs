using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Firma (tenant) eşleştirme profili — tenant başına tekil. Elle girilen sinyaller
/// (ölçek + sektör/bölge/anahtar kelime). Faz B2: proje verisiyle zenginleştirme.
/// </summary>
public class FirmProfile : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public CompanySize? Size { get; set; }

    // --- 1b · uygunluk şartlarının firma tarafındaki karşılıkları ---
    // Grant'taki her eleyici şartın burada bir aynası vardır; biri olmadan diğeri
    // değerlendirilemez. Hepsi nullable: null = "firma bu veriyi girmemiş" → kural
    // Unknown döner, firma ELENMEZ ama "eksik veri" sayacına girer (1b sağ panel).
    public DateTime? FoundedOn { get; set; }
    public int? StaffCount { get; set; }
    public int? RdStaffCount { get; set; }
    public decimal? AnnualRevenue { get; set; }
    public int? Trl { get; set; }
    public bool? HasConsortiumPartner { get; set; }

    // --- Kurum türü ve STK alanları ---
    // Şirket alanlarının STK'da karşılığı yoktur, tersi de doğrudur: form iki gruptan
    // birini gösterir ve kayıtta karşı grubun alanları temizlenir
    // (bkz. FirmProfileAppService.Apply). Kuruluş tarihi ile bölge/anahtar kelime
    // etiketleri her iki türde de ortaktır.

    /// <summary>Varsayılan Şirket: bu alan gelmeden önce yazılmış tüm profiller firmadır.</summary>
    public OrganizationType Type { get; set; } = OrganizationType.Sirket;

    /// <summary>DERBİS numarası (dernek/kulüp/federasyon) ya da vakıf sicil numarası.</summary>
    public string? RegistryNumber { get; set; }

    /// <summary>Vergi kimlik numarası.</summary>
    public string? TaxNumber { get; set; }

    public string? TaxOffice { get; set; }

    /// <summary>Ücretli (profesyonel) ekip bandı; asgari personel şartına alt sınırıyla girer.</summary>
    public NgoStaffBand? ProfessionalStaffBand { get; set; }

    public NgoProjectExperienceBand? ProjectExperience { get; set; }

    /// <summary>
    /// Asgari personel şartının ölçüldüğü değer: şirkette beyan edilen sayı, STK'da ekip
    /// bandının alt sınırı. Tek kaynak — kiracının kendi eşleşmesi de host önizlemesi de
    /// buradan okur, iki yerde ayrı formül yok.
    /// </summary>
    public int? EffectiveStaffCount => Type.IsNgo() ? ProfessionalStaffBand?.MinStaff() : StaffCount;

    public ICollection<FirmProfileTag> Tags { get; set; } = new List<FirmProfileTag>();

    protected FirmProfile() { }

    public FirmProfile(Guid id, Guid? tenantId) : base(id)
    {
        TenantId = tenantId;
    }
}
