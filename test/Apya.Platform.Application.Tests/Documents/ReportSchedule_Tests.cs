using System;
using Apya.Platform.Documents;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.Tests.Application.Documents;

/// <summary>
/// Zamanlanmış üretimin zaman hesabı.
///
/// Burada bir hata sessizdir: kullanıcı aylık raporunun üretildiğini sanar,
/// gerçekte hiç üretilmemiştir. En kritik iki kural: bir sonraki an DAİMA
/// gelecekte olmalı (yoksa worker aynı anı iki kez yakalar) ve ayın 29-31'i
/// kullanılmamalı (şubatta atlanan ay = hiç üretilmeyen rapor).
/// </summary>
public class ReportSchedule_Tests
{
    private static readonly DateTime Now = new(2026, 8, 20, 10, 30, 0);

    private static DateTime Next(
        ReportScheduleFrequency frequency,
        int dayOfMonth = 1,
        DayOfWeek dayOfWeek = DayOfWeek.Monday,
        int hour = 6,
        DateTime? from = null,
        bool isFirstRun = false)
        => ReportScheduleCalculator.ComputeNextRun(
            frequency, dayOfMonth, dayOfWeek, hour, from ?? Now, isFirstRun);

    [Fact]
    public void Aylik_zamanlama_gelecekteki_ilk_ayin_gunune_gider()
    {
        // 20 Ağustos 10:30'dayız; ayın 1'i geçti → eylülün 1'i.
        Next(ReportScheduleFrequency.Monthly, dayOfMonth: 1, hour: 6)
            .ShouldBe(new DateTime(2026, 9, 1, 6, 0, 0));
    }

    [Fact]
    public void Ayin_gunu_henuz_gelmediyse_bu_ay_calisir()
    {
        Next(ReportScheduleFrequency.Monthly, dayOfMonth: 25, hour: 6)
            .ShouldBe(new DateTime(2026, 8, 25, 6, 0, 0));
    }

    /// <summary>Tam o ana denk gelen zaman GEÇMİŞ sayılır — çift üretimi önler.</summary>
    [Fact]
    public void Tam_o_ana_denk_gelen_zaman_bir_sonraki_donguye_atilir()
    {
        var exact = new DateTime(2026, 8, 25, 6, 0, 0);

        Next(ReportScheduleFrequency.Monthly, dayOfMonth: 25, hour: 6, from: exact)
            .ShouldBe(new DateTime(2026, 9, 25, 6, 0, 0));
    }

    /// <summary>
    /// Kurulumda EN YAKIN tarihe gider; üretimden sonra üçer ay atlar.
    /// Ayrım olmasaydı ağustosta kurulan zamanlama ilk raporunu kasımda üretirdi.
    /// </summary>
    [Fact]
    public void Uc_aylik_zamanlama_kurulumda_en_yakin_tarihe_gider()
    {
        Next(ReportScheduleFrequency.Quarterly, dayOfMonth: 1, hour: 6, isFirstRun: true)
            .ShouldBe(new DateTime(2026, 9, 1, 6, 0, 0));
    }

    [Fact]
    public void Uc_aylik_zamanlama_uretimden_sonra_uc_ay_atlar()
    {
        Next(ReportScheduleFrequency.Quarterly, dayOfMonth: 25, hour: 6,
                from: new DateTime(2026, 8, 25, 6, 0, 0))
            .ShouldBe(new DateTime(2026, 11, 25, 6, 0, 0));
    }

    /// <summary>29-31 kırpılır: şubatta atlanan zamanlama o ay hiç üretmezdi.</summary>
    [Fact]
    public void Ayin_31i_28e_kirpilir()
    {
        ReportScheduleCalculator.NormalizeDayOfMonth(31).ShouldBe(28);
        ReportScheduleCalculator.NormalizeDayOfMonth(0).ShouldBe(1);

        Next(ReportScheduleFrequency.Monthly, dayOfMonth: 31, hour: 6)
            .ShouldBe(new DateTime(2026, 8, 28, 6, 0, 0));
    }

    [Fact]
    public void Haftalik_zamanlama_hedef_gune_gider()
    {
        // 20 Ağustos 2026 perşembe; hedef cuma → ertesi gün.
        Next(ReportScheduleFrequency.Weekly, dayOfWeek: DayOfWeek.Friday, hour: 8)
            .ShouldBe(new DateTime(2026, 8, 21, 8, 0, 0));
    }

    [Fact]
    public void Haftalik_ayni_gun_ama_saat_gectiyse_haftaya_gider()
    {
        Next(ReportScheduleFrequency.Weekly, dayOfWeek: DayOfWeek.Thursday, hour: 8)
            .ShouldBe(new DateTime(2026, 8, 27, 8, 0, 0));
    }

    [Fact]
    public void Saat_araligi_disina_tasmaz()
    {
        ReportScheduleCalculator.NormalizeHour(25).ShouldBe(23);
        ReportScheduleCalculator.NormalizeHour(-3).ShouldBe(0);
    }

    /* ─────────────────────────── Varlık davranışı ─────────────────────────── */

    private static ReportSchedule Schedule(DateTime? now = null)
        => new(Guid.NewGuid(), null, Guid.NewGuid(),
            ReportScheduleFrequency.Monthly, 1, DayOfWeek.Monday, 6, now ?? Now);

    [Fact]
    public void Yeni_zamanlamanin_sirasi_gelecektedir()
    {
        Schedule().NextRunAt.ShouldBeGreaterThan(Now);
    }

    [Fact]
    public void Vadesi_gelmeyen_zamanlama_calismaz()
    {
        Schedule().IsDue(Now).ShouldBeFalse();
    }

    [Fact]
    public void Kapali_zamanlama_vadesi_gelse_de_calismaz()
    {
        var schedule = Schedule();
        schedule.SetEnabled(false, Now);

        schedule.IsDue(schedule.NextRunAt.AddHours(1)).ShouldBeFalse();
    }

    /// <summary>Yeniden açılan zamanlama, geçmişte kalmış bir anla hemen tetiklenmemeli.</summary>
    [Fact]
    public void Yeniden_acilan_zamanlama_gecmisteki_ani_atlar()
    {
        var schedule = Schedule();
        schedule.SetEnabled(false, Now);

        var later = schedule.NextRunAt.AddMonths(2);
        schedule.SetEnabled(true, later);

        schedule.NextRunAt.ShouldBeGreaterThan(later);
        schedule.IsDue(later).ShouldBeFalse();
    }

    /// <summary>Hata olsa da sıradaki an İLERLER; takılı kalan zamanlama olmaz.</summary>
    [Fact]
    public void Hatali_calisma_sirayi_yine_de_ilerletir()
    {
        var schedule = Schedule();
        var runAt = schedule.NextRunAt;

        schedule.MarkRun(runAt, "Preflight bloke etti");

        schedule.LastError.ShouldBe("Preflight bloke etti");
        schedule.LastRunAt.ShouldBe(runAt);
        schedule.NextRunAt.ShouldBeGreaterThan(runAt);
    }

    [Fact]
    public void Basarili_calisma_hatayi_temizler()
    {
        var schedule = Schedule();
        schedule.MarkRun(schedule.NextRunAt, "eski hata");
        schedule.MarkRun(schedule.NextRunAt, null);

        schedule.LastError.ShouldBeNull();
    }

    [Fact]
    public void Gecersiz_e_posta_abone_kurulamaz()
    {
        var ex = Should.Throw<BusinessException>(() =>
            new ReportSubscriber(Guid.NewGuid(), null, Guid.NewGuid(), "Zeynep", "gecersiz"));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.ReportSubscriberEmailInvalid);
    }

    [Fact]
    public void Abone_e_postasi_normalize_edilir()
    {
        var subscriber = new ReportSubscriber(
            Guid.NewGuid(), null, Guid.NewGuid(), "  Zeynep  ", "  Zeynep@Hitprot.COM ");

        subscriber.Name.ShouldBe("Zeynep");
        subscriber.Email.ShouldBe("zeynep@hitprot.com");
    }
}
