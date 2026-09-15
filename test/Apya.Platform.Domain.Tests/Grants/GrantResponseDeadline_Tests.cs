using System;
using Apya.Platform.Grants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// 22b · Talebe ilk yanıt süresi = bir iş günü. 2026-09-14 pazartesi, 09-18 cuma, 09-19 cumartesi.
/// </summary>
public class GrantResponseDeadline_Tests
{
    [Fact]
    public void Hafta_Ici_Gelen_Talep_Ertesi_Gun_Ayni_Saatte_Dolar()
    {
        GrantResponseDeadline.For(new DateTime(2026, 9, 15, 10, 30, 0))
            .ShouldBe(new DateTime(2026, 9, 16, 10, 30, 0));
    }

    [Fact]
    public void Cuma_Aksami_Gelen_Talep_Pazartesiye_Oteler()
    {
        GrantResponseDeadline.For(new DateTime(2026, 9, 18, 15, 0, 0))
            .ShouldBe(new DateTime(2026, 9, 21, 15, 0, 0));
    }

    [Fact]
    public void Hafta_Sonu_Gelen_Talep_Pazartesi_Gun_Sonunda_Dolar()
    {
        GrantResponseDeadline.For(new DateTime(2026, 9, 19, 10, 0, 0))
            .ShouldBe(new DateTime(2026, 9, 22, 0, 0, 0));
    }

    [Fact]
    public void Son_Alti_Saat_Yaklasiyor_Sayilir()
    {
        var due = new DateTime(2026, 9, 16, 10, 0, 0);

        GrantResponseDeadline.StateOf(due, due.AddHours(-7)).ShouldBe(GrantResponseState.Waiting);
        GrantResponseDeadline.StateOf(due, due.AddHours(-6)).ShouldBe(GrantResponseState.DueSoon);
        GrantResponseDeadline.StateOf(due, due).ShouldBe(GrantResponseState.Overdue);
        GrantResponseDeadline.StateOf(due, due.AddMinutes(1)).ShouldBe(GrantResponseState.Overdue);
    }

    [Fact]
    public void Kalan_Saat_Yukari_Yuvarlanir_Ve_Eksiye_Dusmez()
    {
        var due = new DateTime(2026, 9, 16, 10, 0, 0);

        GrantResponseDeadline.HoursLeft(due, due.AddMinutes(-20)).ShouldBe(1);
        GrantResponseDeadline.HoursLeft(due, due.AddHours(-21)).ShouldBe(21);
        GrantResponseDeadline.HoursLeft(due, due.AddHours(3)).ShouldBe(0);
    }
}
