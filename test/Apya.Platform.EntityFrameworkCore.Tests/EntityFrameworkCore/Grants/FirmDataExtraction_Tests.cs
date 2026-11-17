using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Features;
using Volo.Abp.MultiTenancy;
using Xunit;
using Apya.Platform.Documents;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Storage;
using static Apya.Platform.Tests.Application.Grants.FirmDocumentFixtures;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Belgeden kurum verisi okuma: aydınlatma onayı olmadan belge okunmaz, öneri kurum onaylamadan
/// kurum verisine yazılmaz, yapay zekânın yanıtı tanımın kurallarıyla süzülür. Yapay zekâ sahtedir.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FirmDataExtraction_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Cofinancing = FirmParameterCatalog.CofinancingCapacityId;
    private static readonly Guid StrategicGoals = FirmParameterCatalog.IdOf(19);

    // Alan ilklendiricileri taban kurucudan ÖNCE çalışır: AfterAddApplication bunları görür.
    private readonly FakeExtractionAi _ai = new();
    private readonly IFeatureChecker _features = Substitute.For<IFeatureChecker>();

    private readonly ICurrentTenant _currentTenant;
    private readonly Guid _tenantId = Guid.NewGuid();

    public FirmDataExtraction_Tests()
    {
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _features.IsEnabledAsync(Arg.Any<string>()).Returns(true);
        _features.GetOrNullAsync(Arg.Any<string>()).Returns("true");
    }

    protected override void AfterAddApplication(IServiceCollection services)
    {
        services.AddSingleton<IFirmDataExtractionAi>(_ai);
        services.AddSingleton(_features);
    }

    private IFirmDataExtractionAppService Service => GetRequiredService<IFirmDataExtractionAppService>();

    /// <summary>Dosyayı yükleme kökene yazar (sayfa modelinin yaptığı gibi) ve okutur.</summary>
    private async Task<FirmDataExtractionDto> ExtractAsync(byte[] content, string fileName, bool consent = true)
    {
        var stored = Guid.NewGuid().ToString("N") + Path.GetExtension(fileName);
        await File.WriteAllBytesAsync(GetRequiredService<IUploadedFileRootFolderProvider>().ResolveSafePath(stored)!, content);

        using (_currentTenant.Change(_tenantId))
        {
            return await Service.ExtractAsync(new ExtractFirmDataInput
            {
                FileName = fileName,
                StoredFileName = stored,
                ContentType = "application/pdf",
                FileSize = content.Length,
                ConsentGiven = consent
            });
        }
    }

    private static byte[] Report() => Pdf(
        ["Faaliyet Raporu 2025", "Dernegimiz 2010 yilinda kuruldu."],
        ["Es finansman kapasitemiz 250000 TL olarak belirlenmistir.", "Hedefimiz bolgesel kalkinmadir."]);

    private Task<List<FirmParameterValue>> ValuesAsync()
        => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(_tenantId))
            {
                return await GetRequiredService<IRepository<FirmParameterValue, Guid>>().GetListAsync();
            }
        });

    private async Task<T> InTenantAsync<T>(Func<Task<T>> action)
    {
        using (_currentTenant.Change(_tenantId))
        {
            return await action();
        }
    }

    [Fact]
    public async Task Aydinlatma_onayi_olmadan_belge_okunmaz()
    {
        var error = await Should.ThrowAsync<BusinessException>(() => ExtractAsync(Report(), "rapor.pdf", consent: false));

        error.Code.ShouldBe(PlatformDomainErrorCodes.FirmDataExtractionConsentRequired);
        _ai.Calls.ShouldBe(0);
        (await InTenantAsync(() => Service.GetListAsync())).ShouldBeEmpty();
    }

    [Fact]
    public async Task Yalniz_PDF_ve_Word_okunur()
    {
        var error = await Should.ThrowAsync<BusinessException>(() => ExtractAsync(Docx("x"), "tablo.xlsx"));

        error.Code.ShouldBe(PlatformDomainErrorCodes.FirmDataExtractionFileTypeNotSupported);
    }

    [Fact]
    public async Task Paketinde_yapay_zeka_olmayan_kurum_belge_okutamaz()
    {
        _features.IsEnabledAsync(Arg.Any<string>()).Returns(false);

        (await InTenantAsync(() => Service.CanExtractAsync())).ShouldBeFalse();
        var error = await Should.ThrowAsync<BusinessException>(() => ExtractAsync(Report(), "rapor.pdf"));
        error.Code.ShouldBe(PlatformDomainErrorCodes.FirmDataExtractionUnavailable);
    }

    [Fact]
    public async Task Belge_Kurumsal_klasorune_konur_oneriler_onaylanmadan_kurum_verisine_yazilmaz()
    {
        _ai.Respond = (_, _) =>
        [
            new("cofinancing_capacity", "250000", 90, 2, "Es finansman kapasitemiz 250000 TL olarak belirlenmistir."),
            new("strategic_goals", "Bölgesel kalkınma", 75, 2, "Hedefimiz bolgesel kalkinmadir.")
        ];

        var result = await ExtractAsync(Report(), "faaliyet-raporu.pdf");

        result.Status.ShouldBe(FirmDataExtractionStatus.Hazir);
        result.PageCount.ShouldBe(2);
        result.PendingCount.ShouldBe(2);
        result.Suggestions.ShouldAllBe(s => s.Status == FirmDataSuggestionStatus.Beklemede && !s.HasCurrentValue);
        _ai.LastPages!.Select(p => p.Number).ShouldBe(new int?[] { 1, 2 });
        (await ValuesAsync()).ShouldBeEmpty("öneri kurum onaylamadan kurum verisi değildir");

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(_tenantId))
            {
                var extraction = await GetRequiredService<IRepository<FirmDataExtraction, Guid>>().GetAsync(result.Id);
                extraction.ConsentedByUserId.ShouldNotBe(Guid.Empty, "KVKK onayını veren kullanıcı saklanır");
                var file = await GetRequiredService<IRepository<DocumentFile, Guid>>().GetAsync(extraction.DocumentFileId);
                var folder = await GetRequiredService<IRepository<Document, Guid>>().GetAsync(file.DocumentId);
                folder.Title.ShouldBe(FirmDataExtractionAppService.FolderTitle);
                folder.ProjectId.ShouldBeNull();
            }
        });
    }

    [Fact]
    public async Task Yapay_zekanin_yaniti_tanimin_kurallariyla_suzulur()
    {
        _ai.Respond = (_, candidates) =>
        {
            candidates.ShouldNotContain(d => d.IsSystem, "değeri başka ekranda yaşayan bilgi sorulmaz");
            candidates.ShouldAllBe(d => d.AllowedSources.HasFlag(FirmParameterSource.BelgeAi));
            return
            [
                new("annual_revenue", "1000000", 99, 1, null),          // sistem parametresi: aday değil
                new("uydurma_kod", "x", 99, 1, null),                   // katalogda yok
                new("cofinancing_capacity", "250 bin TL", 95, 2, null), // sayı değil
                new("cofinancing_capacity", "-5", 90, 2, null),         // alt sınırın altında
                new("cofinancing_capacity", "250000", 60, 1,            // geçerli; sayfa alıntıdan düzeltilir
                    "Es finansman kapasitemiz 250000 TL"),
                new("strategic_goals", "Kalkınma", 40, 9, "belgede olmayan alıntı") // sayfa belgenin dışında
            ];
        };

        var result = await ExtractAsync(Report(), "rapor.pdf");

        result.Suggestions.Select(s => s.Code).ShouldBe(new[] { "strategic_goals", "cofinancing_capacity" }, ignoreOrder: true);
        var cofinancing = result.Suggestions.Single(s => s.Code == "cofinancing_capacity");
        cofinancing.RawValue.ShouldBe("250000");
        cofinancing.Confidence.ShouldBe(60);
        cofinancing.Page.ShouldBe(2, "model 1. sayfa dedi; alıntı 2. sayfada geçiyor");
        result.Suggestions.Single(s => s.Code == "strategic_goals").Page.ShouldBeNull();
    }

    [Fact]
    public async Task Onaylanan_oneri_kaynagi_ve_kaniti_ile_yazilir_ikinci_karar_verilemez()
    {
        _ai.Respond = (_, _) => [new("cofinancing_capacity", "250000", 90, 2, "Es finansman kapasitemiz 250000 TL")];
        var result = await ExtractAsync(Report(), "rapor.pdf");
        var suggestion = result.Suggestions.Single();

        var after = await InTenantAsync(() => Service.AcceptAsync(result.Id, suggestion.Id));

        after.Suggestions.Single().Status.ShouldBe(FirmDataSuggestionStatus.Kabul);
        after.Suggestions.Single().CurrentRawValue.ShouldBe("250000");
        var value = (await ValuesAsync()).ShouldHaveSingleItem();
        value.DefinitionId.ShouldBe(Cofinancing);
        value.ValueNumber.ShouldBe(250000m);
        value.Source.ShouldBe(FirmParameterSource.BelgeAi);
        value.Confidence.ShouldBe(90);
        value.Verification.ShouldBe(FirmParameterVerification.Dogrulandi, "kurum okumayı gördü ve onayladı");
        value.SourceDocumentFileId.ShouldBe(result.DocumentFileId);
        value.SourcePage.ShouldBe(2);
        value.SourceExcerpt.ShouldBe("Es finansman kapasitemiz 250000 TL");

        var again = await Should.ThrowAsync<BusinessException>(() => InTenantAsync(() => Service.RejectAsync(result.Id, suggestion.Id)));
        again.Code.ShouldBe(PlatformDomainErrorCodes.FirmDataSuggestionAlreadyDecided);
    }

    [Fact]
    public async Task Duzenlenerek_onaylanan_deger_kurumun_beyanidir_belge_kanit_olarak_kalir()
    {
        _ai.Respond = (_, _) => [new("cofinancing_capacity", "250000", 90, 2, "Es finansman kapasitemiz 250000 TL")];
        var result = await ExtractAsync(Report(), "rapor.pdf");

        var after = await InTenantAsync(() => Service.AcceptAsync(result.Id, result.Suggestions.Single().Id, "200000"));

        var decided = after.Suggestions.Single();
        decided.Status.ShouldBe(FirmDataSuggestionStatus.DuzenlenerekKabul);
        decided.AcceptedRawValue.ShouldBe("200000");
        decided.RawValue.ShouldBe("250000", "önerilen değer iz olarak kalır");
        var value = (await ValuesAsync()).ShouldHaveSingleItem();
        value.ValueNumber.ShouldBe(200000m);
        value.Source.ShouldBe(FirmParameterSource.Kullanici);
        value.Confidence.ShouldBeNull();
        value.Verification.ShouldBe(FirmParameterVerification.Dogrulanmadi, "elle girilen değer gibi beyandır");
        value.SourceDocumentFileId.ShouldBe(result.DocumentFileId);
    }

    [Fact]
    public async Task Duzenlenen_deger_kurala_uymazsa_yazilmaz_ve_oneri_beklemede_kalir()
    {
        _ai.Respond = (_, _) => [new("cofinancing_capacity", "250000", 90, 2, null)];
        var result = await ExtractAsync(Report(), "rapor.pdf");

        var error = await Should.ThrowAsync<BusinessException>(
            () => InTenantAsync(() => Service.AcceptAsync(result.Id, result.Suggestions.Single().Id, "-1")));

        error.Code.ShouldBe(PlatformDomainErrorCodes.FirmParameterValueBelowMin);
        (await ValuesAsync()).ShouldBeEmpty();
        (await InTenantAsync(() => Service.GetAsync(result.Id))).Suggestions.Single().Status.ShouldBe(FirmDataSuggestionStatus.Beklemede);
    }

    [Fact]
    public async Task Reddedilen_oneri_mevcut_degere_dokunmaz()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(_tenantId))
            {
                await GetRequiredService<FirmParameterManager>().SetValueAsync(
                    Cofinancing, new FirmParameterInput(Number: 100_000m), FirmParameterOrigin.UserEntry);
            }
        });
        _ai.Respond = (_, _) => [new("cofinancing_capacity", "250000", 90, 2, null)];
        var result = await ExtractAsync(Report(), "rapor.pdf");
        result.Suggestions.Single().CurrentRawValue.ShouldBe("100000", "onay ekranı mevcut değeri yan yana gösterir");

        var after = await InTenantAsync(() => Service.RejectAsync(result.Id, result.Suggestions.Single().Id));

        after.Suggestions.Single().Status.ShouldBe(FirmDataSuggestionStatus.Red);
        after.PendingCount.ShouldBe(0);
        var value = (await ValuesAsync()).ShouldHaveSingleItem();
        value.ValueNumber.ShouldBe(100_000m);
        value.Source.ShouldBe(FirmParameterSource.Kullanici);
    }

    [Fact]
    public async Task Metni_olmayan_belge_okunamadi_sayilir_yapay_zekaya_gitmez()
    {
        var result = await ExtractAsync(Pdf([], []), "tarama.pdf");

        result.Status.ShouldBe(FirmDataExtractionStatus.Okunamadi);
        _ai.Calls.ShouldBe(0);
    }

    [Fact]
    public async Task Yapay_zeka_hatasi_kayitta_durumdur_belge_yerinde_kalir()
    {
        _ai.Respond = (_, _) => throw new BusinessException(PlatformDomainErrorCodes.AiQuotaExceeded);

        var result = await ExtractAsync(Docx("Stratejik plan", "Hedefimiz bölgesel kalkınma."), "plan.docx");

        result.Status.ShouldBe(FirmDataExtractionStatus.Hata);
        result.Error.ShouldNotBeNullOrWhiteSpace();
        result.Error.ShouldNotContain("Platform:Ai", Case.Sensitive, "kullanıcı hata kodunu değil metnini görür");
        var list = await InTenantAsync(() => Service.GetListAsync());
        list.ShouldHaveSingleItem().DocumentFileId.ShouldBe(result.DocumentFileId);
    }

    private sealed class FakeExtractionAi : IFirmDataExtractionAi
    {
        public Func<IReadOnlyList<FirmDocumentPage>, IReadOnlyList<FirmParameterDefinition>, IReadOnlyList<FirmDataProposal>> Respond { get; set; }
            = (_, _) => Array.Empty<FirmDataProposal>();

        public int Calls { get; private set; }

        public IReadOnlyList<FirmDocumentPage>? LastPages { get; private set; }

        public Task<IReadOnlyList<FirmDataProposal>> ProposeAsync(
            Guid extractionId,
            IReadOnlyList<FirmDocumentPage> pages,
            IReadOnlyList<FirmParameterDefinition> candidates,
            CancellationToken cancellationToken = default)
        {
            Calls++;
            LastPages = pages;
            return Task.FromResult(Respond(pages, candidates));
        }
    }
}
