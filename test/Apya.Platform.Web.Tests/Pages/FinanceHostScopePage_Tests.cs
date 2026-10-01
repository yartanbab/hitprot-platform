using System;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Web.Pages.Finance;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Host hesabıyla ("Hesabına Gir" kullanılmadan) kiracının projesi seçiliyken /Finance GERÇEKTEN çizilen
/// HTML'de (FIN-07, canlı doğrulama L3 E1): gelir/gider/fatura/kasa/belge servisleri kiracı süzgecini
/// kapatmadığı için kiracının kayıtları boş küme gelir; paneller bunu "Henüz işlem yok.", "Kayıt bulunamadı",
/// "Açık yok…" ya da host'un kendi hesapları diye basamaz, Belgeler sekmesi hata sayfasına düşemez —
/// "kiracının hesabından bakın" durumu basılır.
/// <para>
/// Web testleri host bağlamında ve AlwaysAllow ile koşar: tam da canlı vakanın bağlamı. Test kültürü 'en'
/// olduğu için yerelleştirilmiş metne bakılmaz; kültürden bağımsız <c>data-apya-state="host-scope"</c>
/// kancasına ve görünümlerdeki sabit Türkçe cümlelere bakılır. Sorgu atılmadığı
/// <see cref="FinanceIndexLocks_Tests"/>'te.
/// </para>
/// </summary>
public class FinanceHostScopePage_Tests : PlatformWebTestBase
{
    private const string HostScopeHook = "data-apya-state=\"host-scope\"";

    /// <summary>Kurumsal (varsayılan kategori) proje; <paramref name="tenantId"/> null = host'un kendi projesi.</summary>
    private async Task<Guid> CreateProjectAsync(string code, Guid? tenantId)
    {
        var projectId = Guid.NewGuid();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, tenantId, null, "Host Kapsamı " + code, code,
                    "FIN-07 host kapsamı", 100_000m, 0m, "TRY"),
                autoSave: true);
            await uow.CompleteAsync();
        }

        return projectId;
    }

    private async Task<string> TabAsync(Guid projectId, string tab)
        => WebUtility.HtmlDecode(await GetResponseAsStringAsync($"/Finance?projectId={projectId}&tab={tab}"));

    private static int CountOf(string html, string needle)
        => Regex.Matches(html, Regex.Escape(needle)).Count;

    [Fact]
    public async Task Kiraci_projesinde_kiraci_kayitlarina_bakan_paneller_host_kapsami_durumunu_basar()
    {
        var projectId = await CreateProjectAsync("FIN07-H1", tenantId: Guid.NewGuid());

        // Genel: bütçe bloğu basılır (bütçe servisi kiracı süzgecini kapatır); iki panel durum basar.
        var overview = await TabAsync(projectId, FinanceContext.TabOverview);
        CountOf(overview, HostScopeHook).ShouldBe(2, "Son İşlemler ve Kasa & Banka panelleri");
        overview.ShouldContain("Sözleşme bütçesi");
        overview.ShouldNotContain("Henüz işlem yok.");
        overview.ShouldNotContain("Henüz kasa/banka hesabı yok");

        // Gelir-Gider: süzgeç çubuğu, host'a kayıt açan "ekle" düğmeleri ve boş tablo yok.
        var ledger = await TabAsync(projectId, FinanceContext.TabLedger);
        CountOf(ledger, HostScopeHook).ShouldBe(1);
        ledger.ShouldNotContain("Kayıt bulunamadı");
        ledger.ShouldNotContain("Gelir ekle");

        // Kasa: host'un toplamı / hesapları ve transfer aracı yok.
        var cash = await TabAsync(projectId, FinanceContext.TabCash);
        CountOf(cash, HostScopeHook).ShouldBe(1);
        cash.ShouldNotContain("Toplam Bakiye");
        cash.ShouldNotContain("id=\"ApyaTransferWidget\"");

        // Faturalar: liste hiç kurulmaz (istemci host'un faturalarını projeye süzüp "bulunamadı" derdi).
        var invoices = await TabAsync(projectId, FinanceContext.TabInvoices);
        CountOf(invoices, HostScopeHook).ShouldBe(1);
        invoices.ShouldNotContain("id=\"InvoicesMd\"");
        invoices.ShouldNotContain("Eşleşen fatura bulunamadı");

        // Belgeler: sayfa hataya düşmez (TabAsync 200 bekler — uygunluk servisi projeyi bulamayıp
        // EntityNotFound atardı); boş tahtanın olumlu "Açık yok…" cümlesi ve "erişiminiz yok" basılmaz.
        var documents = await TabAsync(projectId, FinanceContext.TabDocuments);
        CountOf(documents, HostScopeHook).ShouldBe(1);
        documents.ShouldNotContain("Açık yok");
        documents.ShouldNotContain("Belge açığı");
        documents.ShouldNotContain("Belge modülüne erişiminiz yok");
    }

    /// <summary>Karşı vaka: host kendi (kiracısız) projesinde paneller her zamanki gibi çizilir.</summary>
    [Fact]
    public async Task Host_kendi_projesinde_paneller_her_zamanki_gibi_cizilir()
    {
        var projectId = await CreateProjectAsync("FIN07-H2", tenantId: null);

        (await TabAsync(projectId, FinanceContext.TabOverview)).ShouldNotContain(HostScopeHook);

        var ledger = await TabAsync(projectId, FinanceContext.TabLedger);
        ledger.ShouldNotContain(HostScopeHook);
        ledger.ShouldContain("Gelir ekle");

        var cash = await TabAsync(projectId, FinanceContext.TabCash);
        cash.ShouldNotContain(HostScopeHook);
        cash.ShouldContain("Toplam Bakiye");
        cash.ShouldContain("id=\"ApyaTransferWidget\"");

        var invoices = await TabAsync(projectId, FinanceContext.TabInvoices);
        invoices.ShouldNotContain(HostScopeHook);
        invoices.ShouldContain("id=\"InvoicesMd\"");

        var documents = await TabAsync(projectId, FinanceContext.TabDocuments);
        documents.ShouldNotContain(HostScopeHook);
        documents.ShouldContain("Belge açığı");
    }
}
