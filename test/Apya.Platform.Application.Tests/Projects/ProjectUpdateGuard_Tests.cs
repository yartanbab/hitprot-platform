using System;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Projects;

/// <summary>
/// 🔴 PRJ-02 · Proje güncelleme ucunda formda gösterilmeyen alanların korunması.
///
/// <para>Entegrasyon testleri <c>AddAlwaysAllowAuthorization</c> altında koştuğu için
/// "bütçe yetkisi yok" dalı orada HİÇ ölçülemez; karar saf fonksiyona alındı ve burada
/// kilitlendi. Bağların uçtan uca korunması ayrıca
/// <c>ProjectUpdateKeepsLinks_Tests</c> (EF) içinde.</para>
/// </summary>
public class ProjectUpdateGuard_Tests
{
    private static readonly Guid GrantId = Guid.Parse("11111111-0000-4000-8000-000000000001");
    private static readonly Guid CustomerId = Guid.Parse("22222222-0000-4000-8000-000000000002");

    private static Project Existing() => new(
        Guid.NewGuid(), tenantId: null, grantId: GrantId,
        name: "Mevcut proje", code: "PG-1", description: "açıklama",
        totalBudget: 750_000m, hourlyRate: 420m, currency: "EUR",
        customerId: CustomerId);

    /// <summary>Alanı HİÇ göndermeyen istemci — DTO varsayılanları gelir.</summary>
    private static CreateProjectDto OmittingClient() => new()
    {
        Name = "Yeni ad",
        Code = "PG-1",
    };

    [Fact]
    public void Baglari_gondermeyen_istemci_baglari_koparmaz()
    {
        var effective = ProjectUpdateGuard.Resolve(Existing(), OmittingClient(), canEditBudget: true);

        effective.GrantId.ShouldBe(GrantId, "hibe bağı null geldi diye silinmemeli");
        effective.CustomerId.ShouldBe(CustomerId, "cari bağı null geldi diye silinmemeli");
    }

    [Fact]
    public void Gonderilen_bag_yazilir()
    {
        var newGrant = Guid.NewGuid();
        var newCustomer = Guid.NewGuid();
        var input = OmittingClient();
        input.GrantId = newGrant;
        input.CustomerId = newCustomer;

        var effective = ProjectUpdateGuard.Resolve(Existing(), input, canEditBudget: true);

        effective.GrantId.ShouldBe(newGrant);
        effective.CustomerId.ShouldBe(newCustomer);
    }

    /// <summary>
    /// 🔴 Asıl tuzak: okuma yolu bütçe yetkisi olmayan kullanıcıya bütçeyi 0 gösterir.
    /// "Oku → adı değiştir → geri yaz" yapan dürüst istemci 0 gönderir; koşulsuz
    /// yazılsaydı projenin bütçesi sıfırlanırdı.
    /// </summary>
    [Fact]
    public void Butce_yetkisi_olmayan_kullanici_butceyi_degistiremez()
    {
        var input = OmittingClient();
        input.TotalBudget = 0m;      // maskeli okumadan geri gelen değer
        input.HourlyRate = 0m;
        input.Currency = "TRY";

        var effective = ProjectUpdateGuard.Resolve(Existing(), input, canEditBudget: false);

        effective.TotalBudget.ShouldBe(750_000m);
        effective.HourlyRate.ShouldBe(420m);
        effective.Currency.ShouldBe("EUR");
    }

    [Fact]
    public void Butce_yetkisi_olan_kullanicinin_degeri_yazilir()
    {
        var input = OmittingClient();
        input.TotalBudget = 900_000m;
        input.HourlyRate = 500m;
        input.Currency = "USD";

        var effective = ProjectUpdateGuard.Resolve(Existing(), input, canEditBudget: true);

        effective.TotalBudget.ShouldBe(900_000m);
        effective.HourlyRate.ShouldBe(500m);
        effective.Currency.ShouldBe("USD");
    }

    /// <summary>Bütçe yetkisi bağ korumasını etkilemez: iki eksen birbirinden bağımsız.</summary>
    [Fact]
    public void Butce_yetkisi_olmasa_da_baglar_korunur()
    {
        var effective = ProjectUpdateGuard.Resolve(Existing(), OmittingClient(), canEditBudget: false);

        effective.GrantId.ShouldBe(GrantId);
        effective.CustomerId.ShouldBe(CustomerId);
    }
}
