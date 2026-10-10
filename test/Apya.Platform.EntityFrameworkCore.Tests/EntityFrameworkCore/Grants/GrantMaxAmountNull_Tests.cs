using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// DOM-02 · <c>Grant.MaxAmount</c> C#'ta nullable, veritabanında NOT NULL. Null yazan her yol
/// kayıt anında veritabanı hatasıyla düşüyordu; tek koruma bir serviste elle yazılmış
/// "null ise 0" satırıydı. Artık kural varlığın kendisinde: null = 0 = "üst limit yok".
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantMaxAmountNull_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IRepository<Grant, Guid> _grants;

    public GrantMaxAmountNull_Tests()
    {
        _grants = GetRequiredService<IRepository<Grant, Guid>>();
    }

    [Fact]
    public async Task Ust_Limit_Null_Atanan_Program_Kaydedilir_Ve_Limit_Yok_Sayilir()
    {
        var id = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            var grant = new Grant(id, "Limitsiz Program", "Kurum", maxAmount: 250_000m, minMatchScore: 0)
            {
                MaxAmount = null
            };
            await _grants.InsertAsync(grant, autoSave: true);
        });

        await WithUnitOfWorkAsync(async () =>
        {
            (await _grants.GetAsync(id)).MaxAmount.ShouldBe(0m);
        });
    }

    /// <summary>Karşı yön: gerçek bir tutar olduğu gibi saklanır ve geri okunur.</summary>
    [Fact]
    public async Task Ust_Limit_Verilen_Program_Tutari_Korur()
    {
        var id = Guid.NewGuid();

        await WithUnitOfWorkAsync(async () =>
        {
            await _grants.InsertAsync(
                new Grant(id, "Limitli Program", "Kurum", maxAmount: 750_000.50m, minMatchScore: 0), autoSave: true);
        });

        await WithUnitOfWorkAsync(async () =>
        {
            (await _grants.GetAsync(id)).MaxAmount.ShouldBe(750_000.50m);
        });
    }
}
