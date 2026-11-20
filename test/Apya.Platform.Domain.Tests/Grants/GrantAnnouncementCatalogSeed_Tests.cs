using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// Gömülü hibe tohumları (Grants/SeedData/*.json) DbMigrator'da ilk kez okunur; bozuk bir satır tüm
/// tohumlama zincirini düşürür. Burada dosyalar aynı okuyucuyla açılır ve veritabanı sütun sınırları
/// ile enum sözleşmeleri kaydetmeden önce doğrulanır.
/// </summary>
public class GrantAnnouncementCatalogSeed_Tests
{
    [Fact]
    public async Task Tohumlar_okunur_ve_sutun_sinirlarina_sigar()
    {
        var seeds = await GrantAnnouncementCatalogDataSeedContributor.ReadSeedsAsync();

        seeds.Count.ShouldBeGreaterThan(100);
        seeds.GroupBy(s => (s.Id, s.Period)).Where(g => g.Count() > 1).ShouldBeEmpty("aynı program + dönem iki kez");
        seeds.Where(s => s.Id == Guid.Empty).ShouldBeEmpty();

        foreach (var s in seeds)
        {
            var who = s.Name;
            s.Name.Length.ShouldBeInRange(1, 128, who);
            s.Issuer.Length.ShouldBeInRange(1, 64, who);
            s.Period.Length.ShouldBeInRange(1, 32, who);
            s.SourceUrl.ShouldStartWith("http", Case.Insensitive, who);
            s.SourceUrl.Length.ShouldBeLessThanOrEqualTo(512, who);
            s.Description.ShouldNotBeNullOrWhiteSpace(who);
            Enum.TryParse<GrantCallStatus>(s.Status, out _).ShouldBeTrue(who + ": " + s.Status);
            if (s.OpenDate != null && s.Deadline != null)
            {
                // GrantCall.SetSchedule ters takvimi reddeder; tohumda kalırsa tüm tohumlama zinciri düşer.
                string.CompareOrdinal(s.OpenDate, s.Deadline).ShouldBeLessThanOrEqualTo(0, who + ": açılış son başvurudan sonra");
            }
            (s.Objective?.Length ?? 0).ShouldBeLessThanOrEqualTo(2000, who);
            string.Join("\n", s.Priorities ?? []).Length.ShouldBeLessThanOrEqualTo(4000, who);
            string.Join("\n", s.EligibleApplicants ?? []).Length.ShouldBeLessThanOrEqualTo(2000, who);
            s.Sectors.Concat(s.Regions).Concat(s.Keywords).Where(t => t.Length > 64).ShouldBeEmpty(who);
            s.MaxAmount.ShouldBeGreaterThanOrEqualTo(0, who);
            if (s.Currency != null) GrantCurrencies.IsSupported(s.Currency).ShouldBeTrue(who + ": " + s.Currency);
            if (s.MaxAmount > 0 && s.MinAmount != null) s.MinAmount.Value.ShouldBeLessThanOrEqualTo(s.MaxAmount, who);
            if (s.SupportRatePercent != null) s.SupportRatePercent.Value.ShouldBeInRange(0, 100, who);

            foreach (var c in s.CostItems ?? [])
            {
                Enum.TryParse<GrantCostItemKind>(c.Kind, out _).ShouldBeTrue(who + ": " + c.Kind);
                if (c.LimitPercent != null) c.LimitPercent.Value.ShouldBeInRange(0, 100, who);
            }

            (s.CostItems ?? []).GroupBy(c => c.Kind).Where(g => g.Count() > 1).ShouldBeEmpty(who + ": harcama kalemi tekrarı");

            foreach (var d in s.Documents ?? [])
            {
                d.Name.Length.ShouldBeInRange(1, 128, who);
                Enum.TryParse<GrantDocumentObligation>(d.Obligation, out _).ShouldBeTrue(who + ": " + d.Obligation);
                Enum.TryParse<GrantPartyRole>(d.Uploader, out _).ShouldBeTrue(who + ": " + d.Uploader);
            }
        }
    }

    /// <summary>
    /// Başvurabilecek kurum türleri: ad enum'a çözülmeli (yoksa tohumlama düşer), platforma kapalı
    /// programda tür listesi olmamalı. Kullanıcının örneği: KOSGEB programları derneğe açık değil.
    /// </summary>
    [Fact]
    public async Task Kurum_turu_tohumu_gecerli_ve_tutarli()
    {
        var seeds = await GrantAnnouncementCatalogDataSeedContributor.ReadSeedsAsync();

        foreach (var s in seeds)
        {
            foreach (var name in s.ApplicantTypes ?? [])
            {
                Enum.TryParse<OrganizationType>(name, out _).ShouldBeTrue(s.Name + ": " + name);
            }
            if (s.ClosedToPlatform)
            {
                (s.ApplicantTypes ?? []).ShouldBeEmpty(s.Name + ": kapalı programda tür listesi");
            }
        }

        seeds.Count(s => s.ClosedToPlatform).ShouldBeGreaterThan(10);
        var kosgeb = seeds.Where(s => s.Issuer.Contains("KOSGEB") && !s.ClosedToPlatform && s.ApplicantTypeMask != 0).ToList();
        kosgeb.ShouldNotBeEmpty();
        kosgeb.ShouldAllBe(s => !OrganizationType.Dernek.IsAllowedBy(s.ApplicantTypeMask));
    }
}
