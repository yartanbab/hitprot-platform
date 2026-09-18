using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// Tahsilat dilimi tutarı sıfırdan büyük olmalı: negatif dilim tahsilat toplamına
/// karışıp kalan tutarı şişirirdi.
/// </summary>
public class GrantDisbursementTranche_Tests
{
    private static GrantDisbursementTranche NewTranche(decimal amount = 400_000m)
        => new(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), 1, amount, null);

    [Theory]
    [InlineData(0)]
    [InlineData(-50_000)]
    public void Kurulurken_sifir_ya_da_negatif_tutar_reddedilir(decimal amount)
    {
        var ex = Should.Throw<BusinessException>(() => NewTranche(amount));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantTrancheAmountInvalid);
    }

    [Fact]
    public void Guncellenirken_negatif_tutar_reddedilir_ve_eski_tutar_kalir()
    {
        var tranche = NewTranche();

        var ex = Should.Throw<BusinessException>(() =>
            tranche.Update(1, -1m, GrantDisbursementTrancheStatus.Planlandi, null));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantTrancheAmountInvalid);
        tranche.Amount.ShouldBe(400_000m);
    }
}
